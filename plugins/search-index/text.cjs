const fs = require('node:fs/promises');
const path = require('node:path');

function strings(values) {
  return [...new Set((Array.isArray(values) ? values : [values]).flat(Infinity).filter((value) => typeof value === 'string').map((value) => value.replace(/\s+/g, ' ').trim()).filter(Boolean))];
}

function plainText(value = '') {
  return String(value)
    .replace(/<[^>]+>/g, ' ')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/(\*\*|__|~~)(.*?)\1/g, '$2')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*([^*\n]+)\*/g, '$1')
    .replace(/&(?:nbsp|amp|lt|gt|quot);/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function prose(source = '') {
  return source.replace(/^---\s*\r?\n[\s\S]*?\r?\n---\s*(?:\r?\n|$)/, '')
    .replace(/^\s*(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\s*\1\s*$/gm, '')
    .replace(/<!--[^]*?-->/g, '')
    .replace(/^\s*(?:import|export)\s+[^\n]+$/gm, '');
}

function linkLabels(source) {
  return strings([...prose(source).matchAll(/(?<!!)\[([^\]\n]+)\]\([^\n)]*\)/g)]
    .map((match) => plainText(match[1])))
    .filter((label) => !label.includes('![') && !/^(?:https?:\/\/|\/|#)/i.test(label)
      && !/^(?:链接|这里|点击这里|点此|click here|here)$/i.test(label)
      && !/^[\p{P}\p{S}\s]+$/u.test(label));
}

function contentKeywords(source) {
  const body = prose(source);
  return strings([
    linkLabels(body),
    [...body.matchAll(/^\s{0,3}#{1,6}\s+(.+?)\s*#*\s*$/gm)].map((match) => plainText(match[1])),
    [...body.matchAll(/\*\*([^*\n]{2,100})\*\*/g)].map((match) => plainText(match[1])),
    [...body.matchAll(/!\[([^\]\n]+)\]/g)].map((match) => plainText(match[1])),
  ]).filter((value) => value.length <= 180);
}

function sourcePath(siteDir, source) {
  if (!source) return null;
  const resolved = source.startsWith('@site/') ? path.join(siteDir, source.slice(6)) : path.resolve(siteDir, source);
  const relative = path.relative(siteDir, resolved);
  if (relative.startsWith('..') || path.isAbsolute(relative)) throw new Error(`Search source is outside the site: ${source}`);
  return resolved;
}

async function readSource(siteDir, source) {
  const filename = sourcePath(siteDir, source);
  return filename ? fs.readFile(filename, 'utf8') : '';
}

// Data-driven MDX pages keep meaningful labels in imported local JSON/JS files.
// Read only literal data strings: never execute imported author code during indexing.
async function supplementaryKeywords(siteDir, source, content) {
  const filename = sourcePath(siteDir, source);
  if (!filename) return [];
  const values = [];
  for (const match of content.matchAll(/^\s*import\s+[^;\n]+?\s+from\s+['"](\.[^'"]+\.(?:json|js))['"]/gm)) {
    const absolute = path.resolve(path.dirname(filename), match[1]);
    if (!absolute.startsWith(`${siteDir}${path.sep}`)) continue;
    const imported = await fs.readFile(absolute, 'utf8');
    if (absolute.endsWith('.json')) {
      const walk = (value) => {
        if (!value || typeof value !== 'object') return;
        for (const [key, child] of Object.entries(value)) {
          if (['title', 'name', 'label', 'nickname', 'tagline', 'department', 'role'].includes(key) && typeof child === 'string') values.push(child);
          else if (typeof child === 'object') walk(child);
        }
      };
      walk(JSON.parse(imported));
    } else {
      for (const literal of imported.matchAll(/\b(?:title|label)\s*:\s*(['"])((?:\\.|(?!\1)[^\\\r\n])*)\1/g)) values.push(literal[2]);
    }
  }
  return strings(values);
}

function metadataKeywords(metadata) {
  const frontMatter = metadata.frontMatter || {};
  return strings([frontMatter.keywords || [], frontMatter.tags || [], (metadata.tags || []).map((tag) => tag.label || tag.name || tag), (metadata.authors || []).map((author) => author.name)]);
}

module.exports = {strings, plainText, prose, contentKeywords, metadataKeywords, readSource, supplementaryKeywords, linkLabels};
