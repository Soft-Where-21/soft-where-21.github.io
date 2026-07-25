import {
  CATEGORY_RULES,
  evaluateComprehensiveItem,
  getItemRule,
} from './rules.js';

const EPSILON = 1e-10;

function sum(values) {
  return values.reduce((total, value) => total + value, 0);
}

function activeEntries(entries) {
  return entries.filter((entry) => !entry.excluded);
}

function addReason(entry, reason) {
  if (!entry.reasons.includes(reason)) entry.reasons.push(reason);
}

function exclude(entry, reason) {
  entry.excluded = true;
  entry.creditedScore = 0;
  entry.finalScore = 0;
  addReason(entry, reason);
}

function keepHighest(entries, label) {
  if (entries.length <= 1) return;
  const sorted = [...entries].sort(
    (left, right) =>
      right.rawScore - left.rawScore || left.originalIndex - right.originalIndex
  );
  const winner = sorted[0];
  sorted.slice(1).forEach((entry) => {
    exclude(entry, `${label}仅取最高项，已计入 ${winner.ruleLabel}`);
  });
}

function applyTopN(entries, count, label) {
  const available = activeEntries(entries);
  if (available.length <= count) return;
  const sorted = [...available].sort(
    (left, right) =>
      right.rawScore - left.rawScore || left.originalIndex - right.originalIndex
  );
  sorted.slice(count).forEach((entry) => {
    exclude(entry, `${label}至多计入 ${count} 项`);
  });
}

function allocateCap(entries, cap, label, scoreKey, targetKey) {
  const available = activeEntries(entries).sort(
    (left, right) =>
      right[scoreKey] - left[scoreKey] || left.originalIndex - right.originalIndex
  );
  let remaining = cap;
  available.forEach((entry) => {
    const sourceScore = entry[scoreKey];
    const credited = Math.min(sourceScore, Math.max(0, remaining));
    entry[targetKey] = credited;
    remaining -= credited;
    if (credited + EPSILON < sourceScore) {
      addReason(entry, `${label}按 ${cap.toFixed(4)} 分封顶`);
    }
  });
  return sum(available.map((entry) => entry[targetKey]));
}

export function calculateComprehensive(items, grade, baseGpa = null) {
  const evaluatedEntries = (Array.isArray(items) ? items : []).map(
    (item, originalIndex) => {
      const rule = getItemRule(item.kind);
      const evaluation = evaluateComprehensiveItem(item, grade);
      return {
        ...item,
        originalIndex,
        ruleLabel: rule?.label || '未知加分项',
        manual: Boolean(rule?.manual),
        ...evaluation,
        excluded: false,
        creditedScore: evaluation.rawScore,
        finalScore: evaluation.rawScore,
        weightedScore: 0,
        reasons: [],
      };
    }
  );

  const dedupeGroups = new Map();
  evaluatedEntries.forEach((entry) => {
    entry.dedupeKeys.forEach((key) => {
      if (!dedupeGroups.has(key)) dedupeGroups.set(key, []);
      dedupeGroups.get(key).push(entry);
    });
  });
  dedupeGroups.forEach((entries) => {
    const candidates = activeEntries(entries);
    if (candidates.length > 1) keepHighest(candidates, '同类成果');
  });

  const topNGroups = new Map();
  evaluatedEntries.forEach((entry) => {
    entry.constraints
      .filter((constraint) => constraint.kind === 'topN')
      .forEach((constraint) => {
        const key = `${constraint.key}:${constraint.count}`;
        if (!topNGroups.has(key)) {
          topNGroups.set(key, {constraint, entries: []});
        }
        topNGroups.get(key).entries.push(entry);
      });
  });
  topNGroups.forEach(({constraint, entries}) => {
    applyTopN(entries, constraint.count, constraint.label);
  });

  evaluatedEntries.forEach((entry) => {
    entry.creditedScore = entry.excluded ? 0 : entry.rawScore;
    entry.finalScore = entry.creditedScore;
  });

  const capGroups = new Map();
  evaluatedEntries.forEach((entry) => {
    entry.constraints
      .filter((constraint) => constraint.kind === 'cap')
      .forEach((constraint) => {
        const key = `${constraint.key}:${constraint.cap}`;
        if (!capGroups.has(key)) capGroups.set(key, {constraint, entries: []});
        capGroups.get(key).entries.push(entry);
      });
  });
  capGroups.forEach(({constraint, entries}) => {
    allocateCap(
      entries,
      constraint.cap,
      constraint.label,
      'creditedScore',
      'creditedScore'
    );
  });

  const categories = {};
  CATEGORY_RULES.forEach((category) => {
    const entries = evaluatedEntries.filter(
      (entry) => entry.categoryId === category.id
    );
    const submittedScore = sum(entries.map((entry) => entry.rawScore));
    const ruleAdjustedScore = sum(entries.map((entry) => entry.creditedScore));
    entries.forEach((entry) => {
      entry.finalScore = entry.creditedScore;
    });
    const cappedScore =
      ruleAdjustedScore > category.cap + EPSILON
        ? allocateCap(
            entries,
            category.cap,
            category.shortLabel,
            'creditedScore',
            'finalScore'
          )
        : ruleAdjustedScore;

    entries.forEach((entry) => {
      entry.weightedScore = entry.finalScore * category.weight;
    });

    categories[category.id] = {
      ...category,
      entries,
      submittedScore,
      ruleAdjustedScore,
      cappedScore,
      weightedScore: cappedScore * category.weight,
      limited:
        submittedScore > ruleAdjustedScore + EPSILON ||
        ruleAdjustedScore > cappedScore + EPSILON,
    };
  });

  const weightedAddition = sum(
    CATEGORY_RULES.map((category) => categories[category.id].weightedScore)
  );
  const normalizedBaseGpa =
    baseGpa === '' || baseGpa == null || !Number.isFinite(Number(baseGpa))
      ? null
      : Number(baseGpa);

  return {
    entries: evaluatedEntries,
    categories,
    weightedAddition,
    baseGpa: normalizedBaseGpa,
    finalScore:
      normalizedBaseGpa == null ? null : normalizedBaseGpa + weightedAddition,
  };
}
