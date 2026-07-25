import React, {useEffect, useMemo, useState} from 'react';

import {getCalculator, SUPPORTED_GRADES} from '../../../lib/postgrad/index.js';
import {
  formatNumber,
  isCountable,
  STANDARD_FIVE_LEVEL_OPTIONS,
} from '../../../lib/postgrad/shared.js';
import {parseTranscriptText} from '../../../lib/postgrad/transcript.js';

const STORAGE_KEY = 'tool:postgrad:data:v11';
const LEGACY_STORAGE_KEY = 'tool:postgrad:data:v10';
const GROUP_STORAGE_KEY = 'tool:postgrad:groups:v1';

function createInitialDataByGrade() {
  return Object.fromEntries(
    SUPPORTED_GRADES.map((grade) => [grade, getCalculator(grade).createInitialData()])
  );
}

function createEmptyGradeState() {
  return Object.fromEntries(SUPPORTED_GRADES.map((grade) => [grade, {}]));
}

function createEmptyGradeMessages() {
  return Object.fromEntries(SUPPORTED_GRADES.map((grade) => [grade, '']));
}

function selectStyle(width = 140) {
  return {
    width,
    padding: '8px 10px',
    borderRadius: 8,
    border: '1px solid var(--ifm-color-emphasis-300)',
    background: 'var(--ifm-background-color)',
    color: 'var(--ifm-font-color-base)',
    height: 40,
  };
}

export default function PostgradTool() {
  const [grade, setGrade] = useState('23');
  const [dataByGrade, setDataByGrade] = useState(createInitialDataByGrade);
  const [groupChoiceByGrade, setGroupChoiceByGrade] = useState(createEmptyGradeState);
  const [importedByGrade, setImportedByGrade] = useState(() =>
    Object.fromEntries(SUPPORTED_GRADES.map((item) => [item, false]))
  );
  const [importReportByGrade, setImportReportByGrade] = useState(
    createEmptyGradeMessages
  );
  const [showImportPanel, setShowImportPanel] = useState(false);
  const [importText, setImportText] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw =
        window.localStorage.getItem(STORAGE_KEY) ||
        window.localStorage.getItem(LEGACY_STORAGE_KEY);
      if (!raw) return;
      const stored = JSON.parse(raw);
      if (!stored || typeof stored !== 'object') return;
      setDataByGrade((previous) => {
        const hydrated = {...previous};
        SUPPORTED_GRADES.forEach((item) => {
          if (stored[item]) {
            hydrated[item] = getCalculator(item).hydrateData(stored[item]);
          }
        });
        return hydrated;
      });
    } catch {
      // Ignore broken browser cache and keep a clean calculator.
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(GROUP_STORAGE_KEY);
      if (!raw) return;
      const stored = JSON.parse(raw);
      if (!stored || typeof stored !== 'object') return;
      setGroupChoiceByGrade((previous) => ({...previous, ...stored}));
    } catch {
      // Ignore broken browser cache.
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(dataByGrade));
    } catch {
      // Ignore storage errors (private mode or full storage).
    }
  }, [dataByGrade]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(
        GROUP_STORAGE_KEY,
        JSON.stringify(groupChoiceByGrade)
      );
    } catch {
      // Ignore storage errors.
    }
  }, [groupChoiceByGrade]);

  const calculator = getCalculator(grade);
  const groups = calculator.groups;
  const currentData = dataByGrade[grade];
  const currentGroupChoices = groupChoiceByGrade[grade] || {};
  const computed = useMemo(
    () => calculator.calculate(currentData, currentGroupChoices),
    [calculator, currentData, currentGroupChoices]
  );
  const pendingRows = useMemo(
    () =>
      importedByGrade[grade]
        ? calculator.getPendingRows(currentData, currentGroupChoices)
        : new Set(),
    [calculator, currentData, currentGroupChoices, grade, importedByGrade]
  );
  const importReport = importReportByGrade[grade] || '';

  function updateRows(categoryId, updater) {
    setDataByGrade((previous) => ({
      ...previous,
      [grade]: {
        ...previous[grade],
        [categoryId]: updater(previous[grade][categoryId] || []),
      },
    }));
  }

  function updateRow(categoryId, id, patch) {
    updateRows(categoryId, (rows) =>
      rows.map((row) => (row.id === id ? {...row, ...patch} : row))
    );
  }

  function clearCurrentGrade() {
    setDataByGrade((previous) => ({
      ...previous,
      [grade]: calculator.createInitialData(),
    }));
    setGroupChoiceByGrade((previous) => ({...previous, [grade]: {}}));
    setImportedByGrade((previous) => ({...previous, [grade]: false}));
    setImportReportByGrade((previous) => ({...previous, [grade]: ''}));
  }

  function handleImportText() {
    const parsed = parseTranscriptText(importText);
    if (!parsed.length) {
      setImportReportByGrade((previous) => ({
        ...previous,
        [grade]: '未识别到成绩行，请确认粘贴内容包含课程名、课程号、学分和总成绩。',
      }));
      return;
    }

    const nextGroupChoices = calculator.detectGroupChoices(
      parsed,
      currentGroupChoices
    );
    const result = calculator.importTranscript(currentData, parsed);
    const nextPending = calculator.getPendingRows(result.data, nextGroupChoices);
    const unmatchedPreview = result.unmatchedNames.length
      ? `；未匹配示例：${result.unmatchedNames.slice(0, 5).join('、')}`
      : '';

    setDataByGrade((previous) => ({...previous, [grade]: result.data}));
    setGroupChoiceByGrade((previous) => ({
      ...previous,
      [grade]: nextGroupChoices,
    }));
    setImportedByGrade((previous) => ({...previous, [grade]: true}));
    setImportReportByGrade((previous) => ({
      ...previous,
      [grade]: `已识别 ${parsed.length} 条，填充 ${result.updatedRows} 项，待补全 ${nextPending.size} 项${unmatchedPreview}`,
    }));
    setShowImportPanel(false);
  }

  return (
    <div style={{padding: '14px 16px 18px'}}>
      <div
        style={{
          marginBottom: 12,
          fontSize: '0.85rem',
          opacity: 0.7,
          lineHeight: 1.6,
        }}
      >
        填写成绩或快速导入成绩单；系统按对应年级细则择优计入，绿色 √
        表示已纳入计算。
      </div>

      <div
        style={{
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          alignItems: 'center',
          marginBottom: 12,
          padding: 12,
          borderRadius: 12,
          border: '1px solid var(--ifm-color-emphasis-200)',
          background: 'var(--ifm-color-emphasis-100)',
        }}
      >
        <div style={{fontWeight: 650}}>年级</div>
        {SUPPORTED_GRADES.map((item) => (
          <label
            key={item}
            style={{display: 'inline-flex', gap: 6, alignItems: 'center'}}
          >
            <input
              type="radio"
              checked={grade === item}
              onChange={() => setGrade(item)}
            />
            {getCalculator(item).label}
          </label>
        ))}
        <div style={{opacity: 0.68, fontSize: '0.9rem'}}>
          平均 GPA：{formatNumber(computed.avg, 3)}
        </div>
        <button
          type="button"
          className="button button--secondary"
          onClick={clearCurrentGrade}
        >
          一键清空
        </button>
        <button
          type="button"
          className="button button--success"
          onClick={() => setShowImportPanel(true)}
        >
          快速导入
        </button>
        {importedByGrade[grade] && (
          <div
            role="status"
            style={{
              padding: '4px 10px',
              borderRadius: 999,
              border: '1px solid rgba(190, 54, 68, 0.28)',
              background: 'rgba(220, 53, 69, 0.08)',
              color: 'var(--ifm-font-color-base)',
              fontSize: '0.85rem',
              fontWeight: 650,
            }}
          >
            待补全 {pendingRows.size} 项
          </div>
        )}
        <div
          style={{
            marginLeft: 'auto',
            padding: '4px 10px',
            borderRadius: 999,
            border: '1px solid var(--ifm-color-emphasis-200)',
            background: computed.allOk
              ? 'rgba(30, 160, 90, 0.12)'
              : 'var(--ifm-color-emphasis-100)',
            color: computed.allOk ? 'rgb(24, 120, 70)' : 'inherit',
          }}
        >
          {computed.allOk ? '已达标' : '未达标'}
        </div>
        {importReport && (
          <div
            style={{
              flexBasis: '100%',
              fontSize: '0.85rem',
              opacity: 0.78,
              lineHeight: 1.5,
            }}
          >
            {importReport}
          </div>
        )}
      </div>

      <div style={{display: 'grid', gap: 16}}>
        {groups.map((group) => (
          <section
            key={group.module}
            style={{
              border: '1px solid var(--ifm-color-emphasis-200)',
              borderRadius: 12,
              padding: 14,
              background: 'var(--ifm-card-background-color)',
            }}
          >
            <div style={{fontWeight: 700, marginBottom: 10}}>{group.module}</div>
            <div style={{display: 'grid', gap: 12}}>
              {group.categories.map((category) => {
                const rows = currentData[category.id] || [];
                const result = computed.categoryResults[category.id] || {
                  included: new Set(),
                  ok: false,
                };
                const requiredNames = category.requiredNames || [];
                const selectedGroupId = currentGroupChoices[category.id] || '';

                return (
                  <div
                    key={category.id}
                    style={{
                      border: '1px solid var(--ifm-color-emphasis-200)',
                      borderRadius: 10,
                      padding: 12,
                      background: 'var(--ifm-background-color)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 10,
                        flexWrap: 'wrap',
                        marginBottom: 8,
                      }}
                    >
                      <div style={{minWidth: 220}}>
                        <div style={{fontWeight: 650}}>
                          {category.name}（{category.id}）
                        </div>
                        <div style={{fontSize: '0.85rem', opacity: 0.65}}>
                          {category.requirement}
                          {category.note ? `，${category.note}` : ''}
                        </div>
                      </div>
                      {Array.isArray(category.requiredGroups) && (
                        <select
                          value={selectedGroupId}
                          onChange={(event) =>
                            setGroupChoiceByGrade((previous) => ({
                              ...previous,
                              [grade]: {
                                ...previous[grade],
                                [category.id]: event.target.value,
                              },
                            }))
                          }
                          style={selectStyle(220)}
                          aria-label={`${category.name}课程组`}
                        >
                          <option value="">请选择大英 A / B</option>
                          {category.requiredGroups.map((requiredGroup) => (
                            <option key={requiredGroup.id} value={requiredGroup.id}>
                              {requiredGroup.label}
                            </option>
                          ))}
                        </select>
                      )}
                      <div
                        style={{
                          fontSize: '0.85rem',
                          padding: '4px 10px',
                          borderRadius: 999,
                          border: '1px solid var(--ifm-color-emphasis-200)',
                          background: result.ok
                            ? 'rgba(30, 160, 90, 0.12)'
                            : 'var(--ifm-color-emphasis-100)',
                          color: result.ok ? 'rgb(24, 120, 70)' : 'inherit',
                        }}
                      >
                        {result.ok ? '已达标' : '未达标'}
                      </div>
                    </div>

                    <div style={{display: 'grid', gap: 4}}>
                      {rows.length === 0 && (
                        <div style={{opacity: 0.6, fontSize: '0.85rem'}}>
                          该类别无需录入课程
                        </div>
                      )}
                      {rows.map((row) => {
                        const isRequired = requiredNames.includes(row.name);
                        const included = result.included.has(row.id) && isCountable(row);
                        const isPending = pendingRows.has(`${category.id}:${row.id}`);

                        return (
                          <div
                            key={row.id}
                            style={{
                              display: 'flex',
                              gap: 10,
                              alignItems: 'center',
                              flexWrap: 'wrap',
                              padding: '8px 10px',
                              borderRadius: 8,
                              borderBottom:
                                '1px dashed var(--ifm-color-emphasis-200)',
                              background: isPending
                                ? 'rgba(220, 53, 69, 0.08)'
                                : 'transparent',
                              boxShadow: isPending
                                ? 'inset 3px 0 0 rgba(190, 54, 68, 0.42)'
                                : 'none',
                            }}
                            aria-label={isPending ? `${row.name}待补全` : undefined}
                          >
                            {category.selectable && !isRequired && (
                              <input
                                type="checkbox"
                                checked={row.selected}
                                onChange={(event) =>
                                  updateRow(category.id, row.id, {
                                    selected: event.target.checked,
                                  })
                                }
                                aria-label={`选择${row.name}`}
                              />
                            )}
                            <div
                              style={{
                                fontWeight: 600,
                                flex: '1 1 300px',
                                display: 'flex',
                                gap: 8,
                                alignItems: 'center',
                              }}
                            >
                              <span>{row.name}</span>
                              {isPending && (
                                <span
                                  style={{
                                    color: 'rgb(176, 48, 60)',
                                    fontSize: '0.78rem',
                                    fontWeight: 650,
                                  }}
                                >
                                  待补全
                                </span>
                              )}
                              {included && (
                                <span
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 18,
                                    height: 18,
                                    borderRadius: 999,
                                    background: 'rgba(30, 160, 90, 0.12)',
                                    color: 'rgb(24, 120, 70)',
                                    fontSize: '0.8rem',
                                    fontWeight: 700,
                                  }}
                                  aria-label="已纳入计算"
                                  title="已纳入计算"
                                >
                                  √
                                </span>
                              )}
                            </div>
                            <div
                              style={{
                                marginLeft: 'auto',
                                display: 'flex',
                                gap: 10,
                                alignItems: 'center',
                                flexWrap: 'wrap',
                              }}
                            >
                              <div
                                style={{
                                  fontSize: '0.9rem',
                                  opacity: 0.85,
                                  minWidth: 90,
                                }}
                              >
                                学分 {row.credits ?? '-'}
                              </div>
                              {row.scoreType === 'passfail' ? (
                                <select
                                  value={row.passStatus}
                                  onChange={(event) =>
                                    updateRow(category.id, row.id, {
                                      passStatus: event.target.value,
                                    })
                                  }
                                  style={selectStyle()}
                                  aria-label={`${row.name}是否通过`}
                                >
                                  <option value="">请选择</option>
                                  <option value="pass">合格</option>
                                  <option value="fail">不合格</option>
                                </select>
                              ) : row.scoreType === 'five' ? (
                                <select
                                  value={row.score}
                                  onChange={(event) =>
                                    updateRow(category.id, row.id, {
                                      score: event.target.value,
                                    })
                                  }
                                  style={selectStyle()}
                                  aria-label={`${row.name}五级制成绩`}
                                >
                                  <option value="">请选择</option>
                                  {STANDARD_FIVE_LEVEL_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <input
                                  value={row.score}
                                  onChange={(event) =>
                                    updateRow(category.id, row.id, {
                                      score: event.target.value,
                                    })
                                  }
                                  placeholder="成绩"
                                  inputMode="decimal"
                                  style={selectStyle()}
                                  aria-label={`${row.name}成绩`}
                                />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {showImportPanel && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="快速导入成绩"
          onClick={() => setShowImportPanel(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            zIndex: 1200,
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              width: 'min(920px, 96vw)',
              maxHeight: '85vh',
              overflow: 'auto',
              padding: 16,
              borderRadius: 12,
              border: '1px solid var(--ifm-color-emphasis-300)',
              background: 'var(--ifm-background-surface-color)',
              boxShadow: '0 18px 60px rgba(0, 0, 0, 0.22)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 10,
                marginBottom: 8,
              }}
            >
              <div>
                <div style={{fontWeight: 650}}>粘贴成绩自动填充</div>
                <div style={{fontSize: '0.82rem', opacity: 0.68, marginTop: 2}}>
                  当前按 {calculator.label} 规则识别，支持“替代课程名”成绩认定。
                </div>
              </div>
              <button
                type="button"
                className="button button--secondary"
                onClick={() => setShowImportPanel(false)}
              >
                关闭
              </button>
            </div>
            <textarea
              value={importText}
              onChange={(event) => setImportText(event.target.value)}
              placeholder="复制并粘贴本研系统成绩查询页面的完整表格（含课程名、课程号、学分、总成绩、是否有效和替代课程名等列）"
              style={{
                width: '100%',
                minHeight: 210,
                resize: 'vertical',
                borderRadius: 8,
                border: '1px solid var(--ifm-color-emphasis-300)',
                padding: '10px 12px',
                background: 'var(--ifm-background-color)',
                color: 'var(--ifm-font-color-base)',
              }}
            />
            <div
              style={{
                display: 'flex',
                gap: 10,
                alignItems: 'center',
                marginTop: 10,
                flexWrap: 'wrap',
              }}
            >
              <button
                type="button"
                className="button button--primary"
                onClick={handleImportText}
              >
                自动识别并填充
              </button>
              <button
                type="button"
                className="button button--secondary"
                onClick={() => {
                  setImportText('');
                  setImportReportByGrade((previous) => ({
                    ...previous,
                    [grade]: '',
                  }));
                }}
              >
                清空文本
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
