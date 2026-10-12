import {compact, createQueryParser, normalize} from './query.mjs';

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function createMatcher() {
  const patterns = new Map();
  return (text, term) => {
    if (!term) return false;
    if (!patterns.has(term)) {
      // Compile once per query, not once for every field of every resource.
      patterns.set(term, /^[a-z\d][a-z\d .+#_-]*$/u.test(term)
        ? new RegExp(`(?<![a-z\\d])${escapeRegex(term)}(?![a-z\\d])`, 'u') : null);
    }
    const pattern = patterns.get(term);
    return pattern ? pattern.test(text) : text.includes(term);
  };
}

function prepare(record) {
  const aliases = (record.aliases || []).map(compact);
  const title = compact(record.title);
  const primaryContext = normalize([record.title, ...(record.aliases || [])].join(' '));
  return {
    record, title, aliases,
    titleText: normalize(record.title), aliasesText: (record.aliases || []).map(normalize),
    keywords: (record.keywords || []).map(normalize),
    description: normalize(record.description),
    cohortText: /20\d{2}级/u.test(primaryContext) ? primaryContext
      : normalize([primaryContext, record.description, ...(record.keywords || [])].join(' ')),
  };
}

function score(entry, query, includes) {
  if (!query.compact || !query.terms.length) return 0;
  if (query.cohorts.some((year) => !entry.cohortText.includes(year))) return 0;
  const exactTitle = entry.title === query.compact;
  const exactAlias = entry.aliases.includes(query.compact);
  const exactKeyword = entry.keywords.some((keyword) => compact(keyword) === query.compact);
  let total = 0;
  for (const alternatives of query.terms) {
    let best = 0;
    for (const term of alternatives) {
      const tight = compact(term);
      if (includes(entry.titleText, term) || includes(entry.title, tight)) best = Math.max(best, 40);
      if (entry.aliasesText.some((alias) => includes(alias, term)) || entry.aliases.some((alias) => includes(alias, tight))) best = Math.max(best, 32);
      if (entry.keywords.some((keyword) => includes(keyword, term) || includes(compact(keyword), tight))) best = Math.max(best, 18);
      if (includes(entry.description, term)) best = Math.max(best, 6);
    }
    // A missing concept does not silently become a partial answer.
    if (!best && !exactTitle && !exactAlias && !exactKeyword) return 0;
    total += best;
  }
  if (exactTitle) total += 1200;
  else if (exactAlias) total += 1100;
  else if (includes(entry.title, query.compact)) total += 320;
  else if (entry.aliases.some((alias) => includes(alias, query.compact))) total += 250;
  else if (exactKeyword) total += 180;
  // An explicit file format is a request for the attachment, ahead of its folder.
  if (entry.record.kind === 'file') {
    const formats = [
      [/\bpptx?\b|幻灯片/u, /\.pptx?(?:$|[?#])/u],
      [/\bpdf\b/u, /\.pdf(?:$|[?#])/u],
      [/\bdocx?\b|word/u, /\.docx?(?:$|[?#])/u],
      [/\bxlsx?\b|excel/u, /\.xlsx?(?:$|[?#])/u],
    ];
    if (formats.some(([queryPattern, filePattern]) => queryPattern.test(query.text)
      && (filePattern.test(entry.title) || filePattern.test(normalize(entry.record.url))))) total += 24;
  }
  total += Math.min(5, Math.max(0, entry.record.priority || 0)) * 8;
  // Specific names outrank broad, verbose titles when they match equally well.
  total += Math.min(20, query.compact.length / Math.max(1, entry.title.length) * 20);
  return total;
}

/** Pure, deterministic local search. No network, DOM, React or Docusaurus dependency. */
export function createSearchEngine(records, topics = {groups: []}) {
  const entries = records.map(prepare);
  const parseQuery = createQueryParser(topics.groups);
  return {
    search(input, {limit = 10, offset = 0} = {}) {
      const query = parseQuery(input);
      const includes = createMatcher();
      const matches = entries.map((entry) => ({record: entry.record, score: score(entry, query, includes)}))
        .filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score || (a.record.url < b.record.url ? -1 : a.record.url > b.record.url ? 1 : 0));
      const seen = new Set();
      const unique = matches.filter(({record}) => {
        if (seen.has(record.url)) return false;
        seen.add(record.url);
        return true;
      });
      return {results: unique.slice(offset, offset + limit).map(({record}) => record), total: unique.length};
    },
  };
}
