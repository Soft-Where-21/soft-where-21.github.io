/** Shared normalization for the index and user input; never changes a destination URL. */
export function normalize(value) {
  return String(value ?? '').normalize('NFKC').toLowerCase()
    .replace(/(?<!\d)(\d{2})\s*级/gu, '20$1级')
    .replace(/(20\d{2})\s+级/gu, '$1级')
    .replace(/\s+/gu, ' ').trim();
}

export const compact = (value) => normalize(value).replace(/\s/gu, '');

const stopWords = new Set(['的', '了', '吗', '呢', '啊', '我', '想', '要', '找', '看', '查', '一下', '请', '帮', '帮我', '有关', '关于', '有没有', '哪里', '在哪', '在哪里', '哪些', '有什么', '是否', '可以', '能', '到', '和', '与', '及', '在', '是']);
const segmenter = typeof Intl.Segmenter === 'function' ? new Intl.Segmenter('zh-CN', {granularity: 'word'}) : null;

function segment(text) {
  // Segment Chinese prose separately so C++, C#, filenames and hyphenated
  // repository names keep the symbols that distinguish them.
  if (segmenter) return text.split(/([a-z\d][a-z\d._-]*(?:\+\+|#)?)/u).flatMap((part, index) =>
    index % 2 ? [part] : [...segmenter.segment(part)].filter((item) => item.isWordLike).map((item) => item.segment));
  // Older browsers still support exact phrases and deterministic Chinese bigrams.
  return (text.match(/[a-z\d_+#.-]+|[\p{Script=Han}]+/gu) || []).flatMap((part) =>
    /^[\p{Script=Han}]{3,}$/u.test(part) ? [...part].slice(0, -1).map((c, i) => c + part[i + 1]) : [part]);
}

export function createQueryParser(groups = []) {
  const synonyms = new Map();
  for (const {terms = []} of groups) {
    const normalized = [...new Set(terms.map(normalize).filter(Boolean))];
    for (const term of normalized) synonyms.set(term, normalized);
  }
  const dictionary = [...synonyms.keys()].sort((a, b) => b.length - a.length);

  return (input) => {
    const original = normalize(input).slice(0, 256);
    const text = original
      .replace(/^(?:(?:请问|请|帮我|给我|我想|想要|想|能不能|能否|可以|有没有|有什么)\s*)+/u, '')
      .replace(/^(?:(?:知道|了解|找一下|找找|查一下|搜索一下|查找|搜索|查询|找|看一下|关于)\s*)+/u, '')
      .replace(/(?:在哪里|在哪儿|在哪里看|哪里有|在哪|怎么找|有哪些|有没有|的?链接|的?入口|的?网址|这个页面|这个网站)[呢吗啊?？!！。\s]*$/u, '')
      .replace(/[?？!！。]+$/u, '').trim();
    const terms = [];
    let remainder = '';
    const flush = () => {
      terms.push(...segment(remainder).filter((part) => !stopWords.has(part)).map((part) => [part]));
      remainder = '';
    };
    for (let i = 0; i < text.length;) {
      const match = dictionary.find((word) => text.startsWith(word, i)
        && (!/^[a-z\d]/u.test(word) || !/[a-z\d]/u.test(text[i - 1] || ''))
        && (!/[a-z\d]$/u.test(word) || !/[a-z\d]/u.test(text[i + word.length] || '')));
      if (match) {
        flush();
        terms.push(synonyms.get(match));
        i += match.length;
      } else {
        remainder += text[i++];
      }
    }
    flush();
    const unique = [...new Map(terms.map((term) => [term.join('|'), term])).values()];
    return {text, compact: compact(text), terms: unique, cohorts: [...text.matchAll(/20\d{2}级/gu)].map((m) => m[0])};
  };
}
