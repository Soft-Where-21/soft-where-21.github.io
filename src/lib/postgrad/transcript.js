const STANDARD_FIVE_LEVEL_LABELS = new Set([
  '优秀',
  '良好',
  '中等',
  '及格',
  '不及格',
]);

function parseNumber(value) {
  const number = Number(String(value ?? '').trim());
  return Number.isFinite(number) ? number : null;
}

function parseScore(scoreRaw) {
  if (STANDARD_FIVE_LEVEL_LABELS.has(scoreRaw)) {
    return {scoreType: 'five', score: null, passStatus: ''};
  }
  if (scoreRaw === '通过' || scoreRaw === '不通过') {
    return {
      scoreType: 'passfail',
      score: null,
      passStatus: scoreRaw === '通过' ? 'pass' : 'fail',
    };
  }
  const score = parseNumber(scoreRaw);
  if (score === null) return null;
  return {scoreType: 'percent', score, passStatus: ''};
}

function normalizeHeaderName(value) {
  return String(value || '').replace(/\s+/g, '').trim();
}

function createHeaderMap(cells) {
  const map = new Map();
  cells.forEach((cell, index) => {
    const name = normalizeHeaderName(cell);
    if (name) map.set(name, index);
  });
  return map;
}

function readHeaderCell(cells, headerMap, name) {
  const index = headerMap.get(name);
  return typeof index === 'number' ? String(cells[index] || '').trim() : '';
}

function buildRecord(fields, id) {
  const name = String(fields.name || '').trim();
  const scoreRaw = String(fields.scoreRaw || '').trim();
  const parsedScore = parseScore(scoreRaw);
  if (!name || !parsedScore) return null;
  const validRaw = String(fields.validRaw || '').trim();
  return {
    id,
    name,
    code: String(fields.code || '').trim(),
    credits: parseNumber(fields.credits),
    scoreRaw,
    ...parsedScore,
    isValid: validRaw === '是' ? true : validRaw === '否' ? false : null,
    attempt: String(fields.attempt || '').trim(),
    substituteName: String(fields.substituteName || '').trim(),
    substituteCode: String(fields.substituteCode || '').trim(),
    recognitionMethod: String(fields.recognitionMethod || '').trim(),
  };
}

function parseHeaderRow(cells, headerMap, lineIndex) {
  return buildRecord(
    {
      name: readHeaderCell(cells, headerMap, '课程名'),
      code: readHeaderCell(cells, headerMap, '课程号'),
      credits: readHeaderCell(cells, headerMap, '学分'),
      scoreRaw: readHeaderCell(cells, headerMap, '总成绩'),
      validRaw: readHeaderCell(cells, headerMap, '是否有效'),
      attempt: readHeaderCell(cells, headerMap, '重修重考'),
      substituteName: readHeaderCell(cells, headerMap, '替代课程名'),
      substituteCode: readHeaderCell(cells, headerMap, '替代课程号'),
      recognitionMethod: readHeaderCell(cells, headerMap, '成绩认定方式'),
    },
    `line:${lineIndex}`
  );
}

function splitFallbackLine(line) {
  const tabParts = line.split('\t').map((part) => part.trim()).filter(Boolean);
  if (tabParts.length >= 5) return tabParts;
  return line
    .trim()
    .split(/\s{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function parseFallbackRow(line, lineIndex) {
  const cells = splitFallbackLine(line);
  const codePattern = /^[A-Z][A-Z0-9]{6,}$/;
  const codeIndex = cells.findIndex((cell, index) => index > 0 && codePattern.test(cell));
  if (codeIndex <= 0 || cells.length < codeIndex + 4) return null;
  return buildRecord(
    {
      name: cells[codeIndex - 1],
      code: cells[codeIndex],
      credits: cells[codeIndex + 1],
      scoreRaw: cells[codeIndex + 2],
      validRaw: cells[codeIndex + 4],
      attempt: cells[codeIndex + 5],
    },
    `line:${lineIndex}`
  );
}

export function parseTranscriptText(text) {
  if (!text || !text.trim()) return [];
  const lines = text.split(/\r?\n/);
  const entries = [];
  let headerMap = null;

  lines.forEach((line, lineIndex) => {
    if (!line.trim()) return;
    const tabCells = line.split('\t').map((cell) => cell.trim());
    const normalizedCells = new Set(tabCells.map(normalizeHeaderName));
    if (normalizedCells.has('课程名') && normalizedCells.has('总成绩')) {
      headerMap = createHeaderMap(tabCells);
      return;
    }
    const record = headerMap
      ? parseHeaderRow(tabCells, headerMap, lineIndex)
      : parseFallbackRow(line, lineIndex);
    if (record) entries.push(record);
  });

  return entries;
}
