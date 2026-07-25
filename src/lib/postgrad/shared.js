export const STANDARD_FIVE_LEVEL_OPTIONS = [
  {label: '优秀', value: 'excellent', gp: 4},
  {label: '良好', value: 'good', gp: 3.5},
  {label: '中等', value: 'medium', gp: 2.8},
  {label: '及格', value: 'pass', gp: 1.7},
  {label: '不及格', value: 'fail', gp: 0},
];

const STANDARD_FIVE_LEVEL_VALUES = {
  优秀: 'excellent',
  良好: 'good',
  中等: 'medium',
  通过: 'medium',
  及格: 'pass',
  不及格: 'fail',
};

export function scoreToGp(score) {
  if (!Number.isFinite(score)) return null;
  if (score < 60) return 0;
  const x = Math.min(100, Math.max(60, score));
  return 4 - (3 * Math.pow(100 - x, 2)) / 1600;
}

export function getRowGpa(row) {
  if (row.scoreType === 'five') {
    const found = STANDARD_FIVE_LEVEL_OPTIONS.find((option) => option.value === row.score);
    return found ? found.gp : null;
  }
  if (row.scoreType === 'passfail') return null;
  const score = Number(row.score);
  return Number.isFinite(score) ? scoreToGp(score) : null;
}

export function hasRowResult(row) {
  if (row.scoreType === 'passfail') {
    return row.passStatus === 'pass' || row.passStatus === 'fail';
  }
  return String(row.score ?? '').trim() !== '';
}

export function isRowSatisfied(row) {
  return row.scoreType === 'passfail' ? row.passStatus === 'pass' : hasRowResult(row);
}

export function isCountable(row) {
  return row.scoreType !== 'passfail';
}

export function toCourseKey(name) {
  return String(name || '')
    .trim()
    .toLowerCase()
    .replace(/[（(]/g, '(')
    .replace(/[）)]/g, ')')
    .replace(/\s+/g, '')
    .replace('基础物理学a(1)', '基础物理学(1)')
    .replace('基础物理学a(2)', '基础物理学(2)');
}

export function toLooseCourseKey(name) {
  return toCourseKey(name)
    .replace(/[a-z]/g, '')
    .replace(/[·•]/g, '')
    .replace(/[-—_]/g, '');
}

export function getCourseKeyVariants(name) {
  const base = toCourseKey(name);
  const variants = new Set([base]);
  variants.add(base.replace('基础物理学a', '基础物理学'));
  return Array.from(variants).filter(Boolean);
}

function buildRows(entries, category) {
  if (!Array.isArray(entries)) return [];
  const requiredNames = Array.isArray(category.requiredNames) ? category.requiredNames : [];
  return entries.map((entry, index) => {
    const isRequired = requiredNames.includes(entry.name);
    return {
      id: index + 1,
      name: entry.name,
      aliases: entry.aliases || [],
      code: entry.code || '',
      credits: entry.credits,
      score: '',
      passStatus: '',
      selected: category.selectable ? isRequired : true,
      scoreType:
        entry.scoreType ||
        (category.requiredMode === 'passfail' && isRequired ? 'passfail' : 'percent'),
    };
  });
}

export function buildInitialData(groups, presets) {
  const data = {};
  groups.forEach((group) => {
    group.categories.forEach((category) => {
      data[category.id] = buildRows(presets[category.id], category);
    });
  });
  return data;
}

function rowMatchesPreset(row, preset) {
  const rowKeys = new Set(getCourseKeyVariants(row?.name));
  return [preset.name, ...(preset.aliases || [])].some((name) =>
    getCourseKeyVariants(name).some((key) => rowKeys.has(key))
  );
}

export function mergeStoredData(initialData, storedData) {
  if (!storedData || typeof storedData !== 'object') return initialData;
  const legacyFiveLevelScores = {
    '90': 'excellent',
    '80': 'good',
    '70': 'medium',
    '60': 'pass',
    '50': 'fail',
  };
  const merged = {};
  Object.keys(initialData).forEach((categoryId) => {
    const initialRows = initialData[categoryId] || [];
    const storedRows = Array.isArray(storedData[categoryId]) ? storedData[categoryId] : [];
    merged[categoryId] = initialRows.map((initialRow, index) => {
      const storedRow =
        storedRows.find((row) => rowMatchesPreset(row, initialRow)) || storedRows[index];
      if (!storedRow) return initialRow;
      const presetOwnsScoreType =
        initialRow.scoreType === 'five' || initialRow.scoreType === 'passfail';
      const storedScore = String(storedRow.score ?? '');
      const score =
        initialRow.scoreType === 'five'
          ? legacyFiveLevelScores[storedScore] || storedScore
          : storedScore;
      const numericStoredScore = Number(storedScore);
      const passStatus =
        initialRow.scoreType === 'passfail' &&
        !storedRow.passStatus &&
        storedScore.trim() !== '' &&
        Number.isFinite(numericStoredScore)
          ? numericStoredScore >= 60
            ? 'pass'
            : 'fail'
          : storedRow.passStatus || '';
      return {
        ...initialRow,
        score: initialRow.scoreType === 'passfail' ? '' : score,
        passStatus,
        selected:
          typeof storedRow.selected === 'boolean' ? storedRow.selected : initialRow.selected,
        scoreType: presetOwnsScoreType
          ? initialRow.scoreType
          : storedRow.scoreType || initialRow.scoreType,
      };
    });
  });
  return merged;
}

export function buildRecognitionAssignments(records) {
  const assignments = [];
  records.forEach((record) => {
    if (record.attempt && record.attempt !== '正考') return;
    if (record.substituteName || record.substituteCode) {
      assignments.push({
        sourceIds: [record.id],
        sourceName: record.name,
        targetNames: record.substituteName ? [record.substituteName] : [],
        targetCodes: record.substituteCode ? [record.substituteCode] : [],
        record,
        priority: 40,
        reportable: true,
      });
      return;
    }
    if (record.isValid === false) return;
    assignments.push({
      sourceIds: [record.id],
      sourceName: record.name,
      targetNames: [record.name],
      targetCodes: record.code ? [record.code] : [],
      record,
      priority: 30,
      reportable: true,
    });
  });
  return assignments;
}

function createRowResolver(data) {
  const exactNameMap = new Map();
  const looseNameMap = new Map();
  const codeMap = new Map();

  Object.keys(data).forEach((categoryId) => {
    (data[categoryId] || []).forEach((row, index) => {
      const ref = {categoryId, index};
      const names = [row.name, ...(row.aliases || [])];
      names.forEach((name) => {
        getCourseKeyVariants(name).forEach((key) => {
          if (!exactNameMap.has(key)) exactNameMap.set(key, []);
          exactNameMap.get(key).push(ref);
        });
        const loose = toLooseCourseKey(name);
        if (!looseNameMap.has(loose)) looseNameMap.set(loose, []);
        looseNameMap.get(loose).push(ref);
      });
      if (row.code) {
        codeMap.set(String(row.code).trim().toUpperCase(), [ref]);
      }
    });
  });

  return (targetNames = [], targetCodes = []) => {
    const refs = [];
    targetCodes.forEach((code) => {
      const hit = codeMap.get(String(code || '').trim().toUpperCase());
      if (hit) refs.push(...hit);
    });
    targetNames.forEach((name) => {
      getCourseKeyVariants(name).forEach((key) => {
        const hit = exactNameMap.get(key);
        if (hit) refs.push(...hit);
      });
    });
    if (!refs.length) {
      targetNames.forEach((name) => {
        const hit = looseNameMap.get(toLooseCourseKey(name));
        if (hit && hit.length === 1) refs.push(...hit);
      });
    }
    const unique = new Map();
    refs.forEach((ref) => unique.set(`${ref.categoryId}:${ref.index}`, ref));
    return Array.from(unique.values());
  };
}

function passStatusFromRecord(record) {
  if (record.scoreType === 'passfail') return record.passStatus;
  if (record.scoreType === 'percent') {
    return Number(record.score) >= 60 ? 'pass' : 'fail';
  }
  if (record.scoreType === 'five') {
    return record.scoreRaw === '不及格' ? 'fail' : 'pass';
  }
  return '';
}

function applyRecordToRow(row, record) {
  if (row.scoreType === 'passfail') {
    row.passStatus = passStatusFromRecord(record);
    row.score = '';
    return;
  }

  if (row.scoreType === 'five') {
    row.score = STANDARD_FIVE_LEVEL_VALUES[record.scoreRaw] || '';
    row.passStatus = '';
    return;
  }

  if (record.scoreType === 'five') {
    row.scoreType = 'five';
    row.score = STANDARD_FIVE_LEVEL_VALUES[record.scoreRaw] || '';
    row.passStatus = '';
    return;
  }

  if (record.scoreType === 'passfail') {
    row.scoreType = 'passfail';
    row.passStatus = record.passStatus;
    row.score = '';
    return;
  }

  row.scoreType = 'percent';
  row.score = Number.isFinite(record.score) ? String(record.score) : '';
  row.passStatus = '';
}

export function applyImportAssignments(data, groups, assignments) {
  const nextData = {};
  Object.keys(data).forEach((categoryId) => {
    nextData[categoryId] = (data[categoryId] || []).map((row) => ({...row}));
  });
  const categoryMeta = new Map();
  groups.forEach((group) => {
    group.categories.forEach((category) => categoryMeta.set(category.id, category));
  });
  const resolveRows = createRowResolver(nextData);
  const matchedSourceIds = new Set();
  const reportableSources = new Map();
  const updatedRows = new Set();

  assignments
    .slice()
    .sort((a, b) => (a.priority || 0) - (b.priority || 0))
    .forEach((assignment) => {
      (assignment.sourceIds || []).forEach((id) => {
        if (assignment.reportable) {
          reportableSources.set(id, assignment.sourceName || '未知课程');
        }
      });
      const refs = resolveRows(assignment.targetNames, assignment.targetCodes);
      if (!refs.length) return;
      refs.forEach((ref) => {
        const row = nextData[ref.categoryId][ref.index];
        const category = categoryMeta.get(ref.categoryId);
        if (category?.selectable) row.selected = true;
        applyRecordToRow(row, assignment.record);
        updatedRows.add(`${ref.categoryId}:${row.id}`);
      });
      (assignment.sourceIds || []).forEach((id) => matchedSourceIds.add(id));
    });

  const unmatchedNames = [];
  reportableSources.forEach((name, id) => {
    if (!matchedSourceIds.has(id)) unmatchedNames.push(name);
  });

  return {
    data: nextData,
    matchedSourceIds,
    unmatchedNames,
    updatedRows: updatedRows.size,
  };
}

export function detectRequiredGroupChoice(records, groups, currentChoice = {}) {
  const nextChoice = {...currentChoice};
  const importedKeys = new Set();
  records.forEach((record) => {
    [record.name, record.substituteName].filter(Boolean).forEach((name) => {
      getCourseKeyVariants(name).forEach((key) => importedKeys.add(key));
    });
  });

  groups.forEach((group) => {
    group.categories.forEach((category) => {
      if (!Array.isArray(category.requiredGroups)) return;
      let bestId = '';
      let bestScore = 0;
      category.requiredGroups.forEach((requiredGroup) => {
        let score = 0;
        requiredGroup.names.forEach((name) => {
          getCourseKeyVariants(name).forEach((key) => {
            if (importedKeys.has(key)) score += 1;
          });
        });
        if (score > bestScore) {
          bestScore = score;
          bestId = requiredGroup.id;
        }
      });
      if (bestId) nextChoice[category.id] = bestId;
    });
  });
  return nextChoice;
}

function selectTopByCount(rows, targetCount) {
  const candidates = rows
    .map((row) => ({row, gpa: getRowGpa(row)}))
    .filter((item) => Number.isFinite(item.gpa))
    .sort((a, b) => b.gpa - a.gpa);
  const chosen = candidates.slice(0, targetCount);
  return summarizeRows(chosen.map((item) => item.row));
}

function selectTopByCredits(rows, targetCredits) {
  const candidates = rows
    .map((row) => ({row, gpa: getRowGpa(row)}))
    .filter((item) => Number.isFinite(item.gpa))
    .sort((a, b) => b.gpa - a.gpa);
  const selectedRows = [];
  let credits = 0;
  for (const item of candidates) {
    if (credits >= targetCredits) break;
    selectedRows.push(item.row);
    credits += Number(item.row.credits) || 0;
  }
  return summarizeRows(selectedRows);
}

function summarizeRows(rows) {
  const included = new Set();
  let credits = 0;
  let qp = 0;
  rows.forEach((row) => {
    if (!hasRowResult(row) || !isCountable(row)) return;
    const gpa = getRowGpa(row);
    if (!Number.isFinite(gpa)) return;
    const rowCredits = Number(row.credits) || 0;
    included.add(row.id);
    credits += rowCredits;
    qp += rowCredits * gpa;
  });
  return {included, credits, qp, count: included.size};
}

function calculateRequiredGroups(rows, category, selectedGroupId) {
  const requiredNames = category.requiredNames || [];
  const requiredRows = rows.filter((row) => requiredNames.includes(row.name));
  const selectedGroup = (category.requiredGroups || []).find(
    (group) => group.id === selectedGroupId
  );
  const groupRows = selectedGroup
    ? rows.filter((row) => selectedGroup.names.includes(row.name))
    : [];
  const ok =
    requiredRows.every(isRowSatisfied) &&
    Boolean(selectedGroup) &&
    groupRows.every(isRowSatisfied);
  return {...summarizeRows([...requiredRows, ...groupRows]), ok};
}

function calculateSelectable(rows, category) {
  const requiredNames = category.requiredNames || [];
  const requiredRows = rows.filter((row) => requiredNames.includes(row.name));
  const requiredMode = category.requiredMode || 'passfail';
  const requiredOk = requiredRows.every(isRowSatisfied);
  const requiredSummary =
    requiredMode === 'passfail'
      ? {included: new Set(), credits: 0, qp: 0}
      : summarizeRows(requiredRows);
  const optionalNames = Array.isArray(category.optionalNames)
    ? new Set(category.optionalNames)
    : null;
  const candidates = rows.filter((row) => {
    if (requiredNames.includes(row.name) || !row.selected || !isRowSatisfied(row)) return false;
    return optionalNames ? optionalNames.has(row.name) : true;
  });
  const targetCount = typeof category.minCount === 'number' ? category.minCount : 0;
  const targetCredits = typeof category.minCredits === 'number' ? category.minCredits : 0;
  const selectedSummary =
    targetCount > 0
      ? selectTopByCount(candidates, targetCount)
      : selectTopByCredits(candidates, targetCredits);
  const enough =
    targetCount > 0
      ? selectedSummary.count >= targetCount
      : selectedSummary.credits >= targetCredits;
  return {
    included: new Set([...requiredSummary.included, ...selectedSummary.included]),
    credits: requiredSummary.credits + selectedSummary.credits,
    qp: requiredSummary.qp + selectedSummary.qp,
    ok: requiredOk && enough,
  };
}

function calculateFixed(rows, category) {
  const satisfiedRows = rows.filter(isRowSatisfied);
  const satisfiedCredits = satisfiedRows.reduce(
    (sum, row) => sum + (Number(row.credits) || 0),
    0
  );
  const minCount =
    typeof category.minCount === 'number' ? category.minCount : rows.length;
  const minCredits = typeof category.minCredits === 'number' ? category.minCredits : 0;
  return {
    ...summarizeRows(satisfiedRows),
    ok: satisfiedRows.length >= minCount && satisfiedCredits >= minCredits,
  };
}

export function calculateByGroups(data, groups, groupChoices = {}) {
  const categoryResults = {};
  let totalCredits = 0;
  let totalQp = 0;
  let allOk = true;
  groups.forEach((group) => {
    group.categories.forEach((category) => {
      const rows = data[category.id] || [];
      let result;
      if (category.requiredGroups) {
        result = calculateRequiredGroups(rows, category, groupChoices[category.id]);
      } else if (category.selectable) {
        result = calculateSelectable(rows, category);
      } else {
        result = calculateFixed(rows, category);
      }
      categoryResults[category.id] = result;
      totalCredits += result.credits;
      totalQp += result.qp;
      allOk = allOk && result.ok;
    });
  });
  return {
    categoryResults,
    totalCredits,
    avg: totalCredits > 0 ? totalQp / totalCredits : 0,
    allOk,
  };
}

function expectedRowsForCategory(rows, category, groupChoices) {
  const requiredNames = category.requiredNames || [];
  if (category.requiredGroups) {
    const selectedGroup = category.requiredGroups.find(
      (group) => group.id === groupChoices[category.id]
    );
    const expectedNames = new Set([
      ...requiredNames,
      ...(selectedGroup ? selectedGroup.names : []),
    ]);
    return rows.filter((row) => expectedNames.has(row.name));
  }
  if (category.selectable) {
    return rows.filter((row) => requiredNames.includes(row.name) || row.selected);
  }
  return rows;
}

export function getPendingRows(data, groups, groupChoices = {}) {
  const pending = new Set();
  groups.forEach((group) => {
    group.categories.forEach((category) => {
      const rows = data[category.id] || [];
      expectedRowsForCategory(rows, category, groupChoices).forEach((row) => {
        if (!hasRowResult(row)) pending.add(`${category.id}:${row.id}`);
      });
    });
  });
  return pending;
}

export function formatNumber(value, digits = 2) {
  if (!Number.isFinite(value)) return '-';
  return value.toFixed(digits);
}
