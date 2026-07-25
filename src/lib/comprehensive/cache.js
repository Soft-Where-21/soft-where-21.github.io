import {CALCULATORS} from '../postgrad/index.js';

export const POSTGRAD_DATA_KEYS = [
  'tool:postgrad:data:v11',
  'tool:postgrad:data:v10',
];
export const POSTGRAD_GROUP_KEY = 'tool:postgrad:groups:v1';

function safeParse(raw) {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function readCachedPostgradGpa(storage, grade) {
  if (!storage || !CALCULATORS[grade]) return null;
  const calculator = CALCULATORS[grade];
  const rawData = POSTGRAD_DATA_KEYS.map((key) => storage.getItem(key)).find(Boolean);
  const storedData = safeParse(rawData);
  if (!storedData?.[grade]) return null;

  const storedGroups = safeParse(storage.getItem(POSTGRAD_GROUP_KEY)) || {};
  const hydratedData = calculator.hydrateData(storedData[grade]);
  const calculated = calculator.calculate(hydratedData, storedGroups[grade] || {});
  if (!Number.isFinite(calculated.avg) || calculated.totalCredits <= 0) return null;

  return {
    grade,
    label: calculator.label,
    value: calculated.avg,
    totalCredits: calculated.totalCredits,
    source: 'postgrad-cache',
  };
}

export function readAllCachedPostgradGpas(storage) {
  if (!storage) return [];
  return Object.keys(CALCULATORS)
    .map((grade) => readCachedPostgradGpa(storage, grade))
    .filter(Boolean);
}
