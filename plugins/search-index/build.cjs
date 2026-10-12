const {createHash} = require('node:crypto');
const {strings, plainText} = require('./text.cjs');
const {createUrlTools} = require('./urls.cjs');
const {docusaurusRecords, instances} = require('./adapters/docusaurus.cjs');
const {resourceRecords, materialsRecords} = require('./adapters/resources.cjs');
const {linkedRecords} = require('./adapters/links.cjs');

async function buildSearchIndex({siteDir, allContent, data, overrides = {}, siteUrl, baseUrl}) {
  const toolIds = (data['src/pages/tool/tools.json'].tools || []).map((tool) => tool.id);
  const {localUrl, canonicalUrl} = createUrlTools({siteUrl, baseUrl, toolIds});
  const records = new Map();
  function add(input) {
    const url = canonicalUrl(input.url);
    const record = {
      id: createHash('sha256').update(url).digest('hex').slice(0, 16),
      url,
      title: plainText(input.title),
      description: plainText(input.description).slice(0, 320),
      keywords: strings(input.keywords || []),
      aliases: strings(input.aliases || []),
      kind: input.kind,
      section: input.section,
      priority: input.priority ?? 1,
    };
    if (!record.title) throw new Error(`Search record has no title: ${url}`);
    const previous = records.get(url);
    if (previous) {
      // Same destination can be linked from several public sources. Prefer its
      // primary metadata and merge only direct names/keywords for that resource.
      const primary = record.priority > previous.priority ? record : previous;
      records.set(url, {...primary, keywords: strings([previous.keywords, record.keywords]), aliases: strings([previous.aliases, record.aliases])});
    } else records.set(url, record);
  }

  const {sources, exclusions} = await docusaurusRecords({siteDir, allContent, add, canonicalUrl, localUrl});
  resourceRecords({data, add, localUrl});
  const materialInstances = instances(allContent, 'materials-index');
  if (materialInstances.length !== 1) throw new Error('Search requires one materials-index plugin instance.');
  const materialPaths = materialsRecords({materials: materialInstances[0], add, localUrl});
  linkedRecords({sources, add, canonicalUrl, records, localUrl});

  for (const [url, override] of Object.entries(overrides)) {
    const canonical = canonicalUrl(url);
    const existing = records.get(canonical);
    if (!existing) throw new Error(`Search override has no live destination: ${url}`);
    if (!override || typeof override !== 'object' || Array.isArray(override)) throw new Error(`Invalid search override: ${url}`);
    for (const field of Object.keys(override)) {
      if (!['title', 'description', 'keywords', 'aliases', 'priority'].includes(field)) throw new Error(`Unsupported search override field ${field}: ${url}`);
    }
    for (const field of ['title', 'description']) {
      if (override[field] !== undefined && (typeof override[field] !== 'string' || !override[field].trim())) throw new Error(`Invalid ${field} override: ${url}`);
    }
    for (const field of ['keywords', 'aliases']) {
      if (override[field] !== undefined && (!Array.isArray(override[field]) || override[field].some((value) => typeof value !== 'string' || !value.trim()))) throw new Error(`Invalid ${field} override: ${url}`);
    }
    const priority = override.priority ?? existing.priority;
    if (!Number.isInteger(priority) || priority < 0 || priority > 5) throw new Error(`Invalid search priority: ${url}`);
    records.set(canonical, {...existing, ...override, title: plainText(override.title || existing.title), description: plainText(override.description || existing.description), keywords: strings([existing.keywords, override.keywords || []]), aliases: strings([existing.aliases, override.aliases || []]), priority});
  }
  const catalog = {version: 1, records: [...records.values()].sort((a, b) => a.url.localeCompare(b.url, 'en'))};
  const counts = {};
  for (const record of catalog.records) counts[record.kind] = (counts[record.kind] || 0) + 1;
  return {catalog, materialPaths, toolIds, shareIds: (data['src/pages/share/shares.json'].shares || []).map((share) => share.id), report: {total: catalog.records.length, counts, exclusions}};
}

module.exports = {buildSearchIndex};
