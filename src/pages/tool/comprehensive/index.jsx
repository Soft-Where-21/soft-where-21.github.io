import {useEffect, useMemo, useState} from 'react';

import {
  readAllCachedPostgradGpas,
  readCachedPostgradGpa,
} from '../../../lib/comprehensive/cache.js';
import {calculateComprehensive} from '../../../lib/comprehensive/calculator.js';
import {
  CATEGORY_BY_ID,
  CATEGORY_RULES,
  createComprehensiveItem,
  getFieldOptions,
  getItemRule,
  getItemRulesForCategory,
  GRADE_OPTIONS,
  isFieldVisible,
  normalizeItemValues,
} from '../../../lib/comprehensive/rules.js';

import styles from './styles.module.css';

const DATA_STORAGE_KEY = 'tool:comprehensive:data:v1';
const GPA_STORAGE_KEY = 'tool:comprehensive:base-gpa:v1';

function emptyGradeState(factory) {
  return Object.fromEntries(GRADE_OPTIONS.map((option) => [option.value, factory()]));
}

function formatNumber(value, digits = 4) {
  if (!Number.isFinite(Number(value))) return '-';
  return Number(value).toFixed(digits);
}

function createItemId() {
  return `comprehensive-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function hydrateItems(stored) {
  const next = emptyGradeState(() => []);
  GRADE_OPTIONS.forEach(({value: grade}) => {
    if (!Array.isArray(stored?.[grade])) return;
    next[grade] = stored[grade]
      .filter((item) => item && getItemRule(item.kind))
      .map((item) => ({
        ...item,
        categoryId: getItemRule(item.kind).categoryId,
        values: normalizeItemValues(item.kind, item.values || {}, grade),
      }));
  });
  return next;
}

function FieldControl({field, item, grade, onChange}) {
  if (!isFieldVisible(field, item.values, grade)) return null;
  const value = item.values[field.key] ?? '';
  const inputId = `${item.id}-${field.key}`;

  return (
    <label className={styles.field} htmlFor={inputId}>
      <span>{field.label}</span>
      {field.type === 'select' ? (
        <select
          id={inputId}
          value={value}
          onChange={(event) => onChange(field.key, event.target.value)}
        >
          {getFieldOptions(field, item.values, grade).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <span className={styles.inputWithSuffix}>
          <input
            id={inputId}
            type={field.type === 'number' ? 'number' : 'text'}
            value={value}
            min={field.min}
            max={field.max}
            step={field.step}
            inputMode={field.type === 'number' ? 'decimal' : undefined}
            placeholder={field.placeholder}
            onChange={(event) => onChange(field.key, event.target.value)}
          />
          {field.suffix && <small>{field.suffix}</small>}
        </span>
      )}
    </label>
  );
}

export default function ComprehensiveTool() {
  const [grade, setGrade] = useState('21');
  const [activeCategoryId, setActiveCategoryId] = useState('technology');
  const [itemsByGrade, setItemsByGrade] = useState(() =>
    emptyGradeState(() => [])
  );
  const [baseGpaByGrade, setBaseGpaByGrade] = useState(() =>
    emptyGradeState(() => '')
  );
  const [baseGpaSourceByGrade, setBaseGpaSourceByGrade] = useState(() =>
    emptyGradeState(() => '')
  );
  const [cachedPostgradGpas, setCachedPostgradGpas] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const [addKindByCategory, setAddKindByCategory] = useState(() =>
    Object.fromEntries(
      CATEGORY_RULES.map((category) => [
        category.id,
        getItemRulesForCategory(category.id)[0]?.id || '',
      ])
    )
  );

  function refreshPostgradCache() {
    if (typeof window === 'undefined') return;
    const allCached = readAllCachedPostgradGpas(window.localStorage);
    setCachedPostgradGpas(allCached);
    GRADE_OPTIONS.forEach(({value: itemGrade}) => {
      const match = readCachedPostgradGpa(window.localStorage, itemGrade);
      if (!match) return;
      setBaseGpaByGrade((previous) => ({
        ...previous,
        [itemGrade]: String(match.value),
      }));
      setBaseGpaSourceByGrade((previous) => ({
        ...previous,
        [itemGrade]: 'postgrad-cache',
      }));
    });
  }

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const storedItems = JSON.parse(
        window.localStorage.getItem(DATA_STORAGE_KEY) || '{}'
      );
      const storedGpas = JSON.parse(
        window.localStorage.getItem(GPA_STORAGE_KEY) || '{}'
      );
      setItemsByGrade(hydrateItems(storedItems));
      setBaseGpaByGrade((previous) => ({
        ...previous,
        ...Object.fromEntries(
          GRADE_OPTIONS.map(({value: itemGrade}) => [
            itemGrade,
            storedGpas?.[itemGrade] == null
              ? previous[itemGrade]
              : String(storedGpas[itemGrade]),
          ])
        ),
      }));
      setBaseGpaSourceByGrade((previous) => ({
        ...previous,
        ...Object.fromEntries(
          GRADE_OPTIONS.map(({value: itemGrade}) => [
            itemGrade,
            storedGpas?.[itemGrade] == null ? '' : 'manual',
          ])
        ),
      }));
    } catch {
      // Broken browser cache should not prevent the calculator from opening.
    }
    refreshPostgradCache();
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(
        DATA_STORAGE_KEY,
        JSON.stringify(itemsByGrade)
      );
      window.localStorage.setItem(
        GPA_STORAGE_KEY,
        JSON.stringify(baseGpaByGrade)
      );
    } catch {
      // Private browsing and full storage can reject writes.
    }
  }, [baseGpaByGrade, hydrated, itemsByGrade]);

  const currentItems = itemsByGrade[grade] || [];
  const currentBaseGpa = baseGpaByGrade[grade] ?? '';
  const currentCategory = CATEGORY_BY_ID[activeCategoryId];
  const gradeRule = GRADE_OPTIONS.find((option) => option.value === grade);
  const addableRules = getItemRulesForCategory(activeCategoryId);
  const calculation = useMemo(
    () => calculateComprehensive(currentItems, grade, currentBaseGpa),
    [currentBaseGpa, currentItems, grade]
  );
  const resultById = useMemo(
    () => new Map(calculation.entries.map((entry) => [entry.id, entry])),
    [calculation.entries]
  );
  const visibleItems = currentItems.filter(
    (item) => item.categoryId === activeCategoryId
  );
  const exactCachedGpa = cachedPostgradGpas.find((item) => item.grade === grade);
  const otherCachedGpas = cachedPostgradGpas.filter((item) => item.grade !== grade);
  const ruleEffects = Array.from(
    new Set(calculation.entries.flatMap((entry) => entry.reasons))
  );

  function addItem() {
    const kind = addKindByCategory[activeCategoryId];
    if (!kind) return;
    const item = createComprehensiveItem(kind, createItemId(), grade);
    setItemsByGrade((previous) => ({
      ...previous,
      [grade]: [...(previous[grade] || []), item],
    }));
  }

  function updateItem(itemId, fieldKey, value) {
    setItemsByGrade((previous) => ({
      ...previous,
      [grade]: (previous[grade] || []).map((item) => {
        if (item.id !== itemId) return item;
        const values = normalizeItemValues(
          item.kind,
          {...item.values, [fieldKey]: value},
          grade
        );
        return {...item, values};
      }),
    }));
  }

  function removeItem(itemId) {
    setItemsByGrade((previous) => ({
      ...previous,
      [grade]: (previous[grade] || []).filter((item) => item.id !== itemId),
    }));
  }

  function clearGrade() {
    if (
      typeof window !== 'undefined' &&
      !window.confirm(`确定清空 ${gradeRule.label} 的全部综测加分项吗？`)
    ) {
      return;
    }
    setItemsByGrade((previous) => ({...previous, [grade]: []}));
  }

  return (
    <div className={styles.root}>
      <div className={styles.toolbar}>
        <div className={styles.gradeSwitch} aria-label="选择综测方案年级">
          <span>综测方案</span>
          {GRADE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={grade === option.value ? styles.activeGrade : ''}
              aria-pressed={grade === option.value}
              onClick={() => setGrade(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className={styles.toolbarActions}>
          <a
            href={gradeRule.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ruleLink}
          >
            查看原方案 PDF
            <span aria-hidden="true">↗</span>
          </a>
          <button type="button" className={styles.quietButton} onClick={clearGrade}>
            清空当前年级
          </button>
        </div>
      </div>

      <div className={styles.workspace}>
        <main className={styles.editor}>
          <div className={styles.categoryTabs} role="tablist" aria-label="加分类型">
            {CATEGORY_RULES.map((category) => {
              const summary = calculation.categories[category.id];
              return (
                <button
                  key={category.id}
                  type="button"
                  role="tab"
                  aria-selected={activeCategoryId === category.id}
                  className={
                    activeCategoryId === category.id ? styles.activeCategory : ''
                  }
                  onClick={() => setActiveCategoryId(category.id)}
                >
                  <span>{category.shortLabel}</span>
                  <small>
                    {formatNumber(summary.cappedScore)} × {category.weight}
                  </small>
                </button>
              );
            })}
          </div>

          <section className={styles.categoryPanel}>
            <header className={styles.categoryHeader}>
              <div>
                <p>当前加分类型</p>
                <h2>{currentCategory.label}</h2>
              </div>
              <div className={styles.categoryRule}>
                <span>类别权重 × {currentCategory.weight}</span>
                <span>原始分上限 {formatNumber(currentCategory.cap)}</span>
              </div>
            </header>

            <div className={styles.addBar}>
              <label>
                <span>选择加分项</span>
                <select
                  value={addKindByCategory[activeCategoryId] || ''}
                  onChange={(event) =>
                    setAddKindByCategory((previous) => ({
                      ...previous,
                      [activeCategoryId]: event.target.value,
                    }))
                  }
                >
                  {addableRules.map((rule) => (
                    <option key={rule.id} value={rule.id}>
                      {rule.label}
                    </option>
                  ))}
                </select>
              </label>
              <button type="button" className={styles.addButton} onClick={addItem}>
                添加到计算
              </button>
            </div>

            <div className={styles.itemList}>
              {visibleItems.length === 0 && (
                <div className={styles.emptyState}>
                  <strong>还没有添加这一类加分项</strong>
                  <span>从上方选择项目，填写奖项、角色或认定分值。</span>
                </div>
              )}

              {visibleItems.map((item, index) => {
                const rule = getItemRule(item.kind);
                const entry = resultById.get(item.id);
                const status =
                  entry.rawScore <= 0
                    ? '未产生分值'
                    : entry.excluded
                      ? '未计入'
                      : entry.reasons.length
                        ? '已按上限处理'
                        : '已计入';
                return (
                  <article
                    key={item.id}
                    className={`${styles.itemCard} ${
                      entry.excluded ? styles.excludedItem : ''
                    }`}
                  >
                    <header className={styles.itemHeader}>
                      <div>
                        <span className={styles.itemIndex}>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <strong>{rule.label}</strong>
                        {rule.manual && <em>手动认定</em>}
                      </div>
                      <button
                        type="button"
                        className={styles.removeButton}
                        onClick={() => removeItem(item.id)}
                        aria-label={`删除${rule.label}`}
                      >
                        删除
                      </button>
                    </header>

                    <div className={styles.fieldsGrid}>
                      {rule.fields.map((field) => (
                        <FieldControl
                          key={field.key}
                          field={field}
                          item={item}
                          grade={grade}
                          onChange={(fieldKey, value) =>
                            updateItem(item.id, fieldKey, value)
                          }
                        />
                      ))}
                    </div>

                    <div className={styles.itemDetail}>{entry.detail}</div>

                    <div className={styles.itemLedger}>
                      <div>
                        <span>基础分</span>
                        <strong>{formatNumber(entry.baseScore)}</strong>
                      </div>
                      <div>
                        <span>项内系数</span>
                        <strong>× {formatNumber(entry.factor)}</strong>
                      </div>
                      <div>
                        <span>规则后计入</span>
                        <strong>{formatNumber(entry.finalScore)}</strong>
                        {Math.abs(entry.rawScore - entry.finalScore) > 1e-10 && (
                          <small>原始 {formatNumber(entry.rawScore)}</small>
                        )}
                      </div>
                      <div>
                        <span>类别权重</span>
                        <strong>× {currentCategory.weight}</strong>
                      </div>
                      <div>
                        <span>折合 GPA</span>
                        <strong>{formatNumber(entry.weightedScore)}</strong>
                      </div>
                      <div className={styles.itemStatus}>
                        <span>{status}</span>
                        {entry.reasons[0] && <small>{entry.reasons[0]}</small>}
                      </div>
                    </div>

                    {entry.warnings.length > 0 && (
                      <div className={styles.itemWarning}>
                        {entry.warnings.join(' ')}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        </main>

        <aside className={styles.ledger} aria-label="综测折合结果">
          <div className={styles.ledgerHeading}>
            <span>折合账本</span>
            <small>{gradeRule.label}</small>
          </div>

          <label className={styles.baseGpaField}>
            <span>平均学分绩点</span>
            <input
              value={currentBaseGpa}
              inputMode="decimal"
              type="number"
              min="0"
              max="4"
              step="0.0001"
              placeholder="未读取，可手动填写"
              onChange={(event) => {
                setBaseGpaByGrade((previous) => ({
                  ...previous,
                  [grade]: event.target.value,
                }));
                setBaseGpaSourceByGrade((previous) => ({
                  ...previous,
                  [grade]: 'manual',
                }));
              }}
            />
          </label>

          <div className={styles.cacheStatus}>
            {exactCachedGpa ? (
              <span>
                已读取推免成绩计算器缓存 · {exactCachedGpa.totalCredits.toFixed(1)} 学分
              </span>
            ) : baseGpaSourceByGrade[grade] === 'manual' && currentBaseGpa !== '' ? (
              <span>当前使用手动填写的平均学分绩点</span>
            ) : (
              <span>未找到当前年级的推免成绩缓存</span>
            )}
            <button type="button" onClick={refreshPostgradCache}>
              重新读取
            </button>
          </div>

          {otherCachedGpas.length > 0 && (
            <div className={styles.otherCaches}>
              检测到其他年级缓存：
              {otherCachedGpas.map((item) => (
                <span key={item.grade}>
                  {item.label} {formatNumber(item.value, 3)}
                </span>
              ))}
              <small>年级不一致，未自动采用。</small>
            </div>
          )}

          <div className={styles.categoryLedger}>
            {CATEGORY_RULES.map((category) => {
              const summary = calculation.categories[category.id];
              return (
                <div key={category.id}>
                  <span>{category.shortLabel}</span>
                  <span className={styles.scoreTransition}>
                    {summary.limited && (
                      <small>{formatNumber(summary.submittedScore)} → </small>
                    )}
                    <strong>{formatNumber(summary.cappedScore)}</strong>
                  </span>
                  <code>× {category.weight}</code>
                  <strong>{formatNumber(summary.weightedScore)}</strong>
                </div>
              );
            })}
          </div>

          <div className={styles.formula}>
            <span>综合素质量化加分</span>
            <strong>+ {formatNumber(calculation.weightedAddition)}</strong>
          </div>

          <div className={styles.finalScore}>
            <span>最终综合成绩</span>
            <strong>
              {calculation.finalScore == null
                ? '-'
                : formatNumber(calculation.finalScore)}
            </strong>
            <small>
              {calculation.finalScore == null
                ? '填写平均学分绩点后显示'
                : `${formatNumber(calculation.baseGpa)} + ${formatNumber(
                    calculation.weightedAddition
                  )}`}
            </small>
          </div>

          {ruleEffects.length > 0 && (
            <div className={styles.ruleEffects}>
              <span>自动规则</span>
              {ruleEffects.slice(0, 5).map((effect) => (
                <p key={effect}>{effect}</p>
              ))}
              {ruleEffects.length > 5 && (
                <small>另有 {ruleEffects.length - 5} 条已自动处理</small>
              )}
            </div>
          )}

          <p className={styles.disclaimer}>
            仅按方案普通规则估算；审核认定项以学院最终公示为准。
          </p>
        </aside>
      </div>
    </div>
  );
}
