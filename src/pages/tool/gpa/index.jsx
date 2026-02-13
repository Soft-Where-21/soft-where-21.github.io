import React, {useEffect, useMemo, useRef, useState} from 'react';

const DEFAULT_ROW = {
  id: 1,
  course: '课程1',
  credits: '3',
  scoreType: 'percent', // percent | five | passfail
  score: '90',
};

const FIVE_LEVEL_OPTIONS = [
  {label: '优秀', value: 'excellent'},
  {label: '良好', value: 'good'},
  {label: '中等', value: 'medium'},
  {label: '及格', value: 'pass'},
  {label: '不及格', value: 'fail'},
];

function clamp(n, min, max) {
  if (Number.isNaN(n)) return min;
  return Math.min(max, Math.max(min, n));
}

function scoreToGp(score) {
  if (!Number.isFinite(score)) return 0;
  if (score < 60) return 0;
  const x = clamp(score, 60, 100);
  const gp = 4 - (3 * Math.pow(100 - x, 2)) / 1600;
  return clamp(gp, 0, 4);
}

function formatNumber(value, digits = 2) {
  if (!Number.isFinite(value)) return '-';
  return value.toFixed(digits);
}

export default function GpaTool() {
  const [rows, setRows] = useState([DEFAULT_ROW]);
  const [showTable, setShowTable] = useState(false);
  const [panelPos, setPanelPos] = useState({x: 0, y: 0});
  const dragRef = useRef({dragging: false, offsetX: 0, offsetY: 0});
  const tableScores = useMemo(
    () => Array.from({length: 41}, (_, i) => 100 - i),
    []
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem('tool:gpa:rows');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) {
        setRows(parsed);
      }
    } catch (e) {
      // ignore broken cache
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem('tool:gpa:rows', JSON.stringify(rows));
    } catch (e) {
      // ignore storage errors
    }
  }, [rows]);

  useEffect(() => {
    if (!showTable) return;
    function onMove(e) {
      if (!dragRef.current.dragging) return;
      setPanelPos({
        x: e.clientX - dragRef.current.offsetX,
        y: e.clientY - dragRef.current.offsetY,
      });
    }
    function onUp() {
      dragRef.current.dragging = false;
    }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [showTable]);

  const data = useMemo(() => {
    const normalized = rows.map((row) => {
      const credits = Number(row.credits);
      const validCredits = Number.isFinite(credits) && credits > 0 ? credits : 0;

      let gp = 0;
      let include = true;
      let note = '';

      if (row.scoreType === 'percent') {
        const score = Number(row.score);
        if (!Number.isFinite(score)) {
          gp = 0;
        } else if (score < 60) {
          gp = 0;
        } else {
          gp = scoreToGp(score);
        }
      } else if (row.scoreType === 'five') {
        include = false;
        note = '五级制不计入均分';
      } else {
        include = false;
        note = '二级制不计入均分';
      }

      const qualityPoints = include ? gp * validCredits : 0;
      return {
        ...row,
        credits: validCredits,
        gp,
        include,
        qualityPoints,
        note,
      };
    });

    let totalCredits = 0;
    let totalQualityPoints = 0;

    normalized.forEach((row) => {
      if (row.include) {
        totalCredits += row.credits;
        totalQualityPoints += row.qualityPoints;
      }
    });

    return {
      rows: normalized,
      totalCredits,
      totalQualityPoints,
      average: totalCredits > 0 ? totalQualityPoints / totalCredits : 0,
    };
  }, [rows]);

  function updateRow(id, patch) {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? {...row, ...patch} : row))
    );
  }

  function addRow() {
    setRows((prev) => {
      const nextId = prev.length ? Math.max(...prev.map((r) => r.id)) + 1 : 1;
      return [
        ...prev,
        {
          ...DEFAULT_ROW,
          id: nextId,
          course: `课程${nextId}`,
        },
      ];
    });
  }

  function removeRow(id) {
    setRows((prev) => (prev.length <= 1 ? prev : prev.filter((r) => r.id !== id)));
  }

  return (
    <div style={{padding: 18}}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 12,
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          marginBottom: 6,
        }}
      >
        <div style={{display: 'flex', gap: 12, flexWrap: 'wrap'}}>
          <button type="button" className="button button--primary" onClick={addRow}>
            添加课程
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowTable((v) => !v)}
          aria-label="GPA 对照表"
          style={{
            width: 28,
            height: 28,
            borderRadius: 999,
            border: '1px solid var(--ifm-color-emphasis-200)',
            background: 'var(--ifm-background-color)',
            cursor: 'pointer',
            fontWeight: 700,
            lineHeight: '24px',
            padding: 0,
          }}
        >
          ?
        </button>
      </div>

      <div style={{display: 'grid', gap: 8, marginTop: -4}}>
        {data.rows.map((row) => (
          <div
            key={row.id}
            style={{
              border: '1px solid var(--ifm-color-emphasis-200)',
              borderRadius: 12,
              padding: 8,
              display: 'grid',
              gap: 6,
            }}
          >
            <div
              style={{
                display: 'grid',
                gap: 8,
                gridTemplateColumns:
                  'minmax(140px, 1.2fr) minmax(80px, 0.7fr) minmax(130px, 1fr) minmax(150px, 1.2fr)',
              }}
            >
              <div>
                <div style={{fontSize: '0.8rem', opacity: 0.6, marginBottom: 0}}>课程名</div>
                <input
                  value={row.course}
                  onChange={(e) => updateRow(row.id, {course: e.target.value})}
                  placeholder={`课程${row.id}`}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    borderRadius: 8,
                    border: '1px solid var(--ifm-color-emphasis-200)',
                    background: 'var(--ifm-background-color)',
                  }}
                />
              </div>

              <div>
                <div style={{fontSize: '0.8rem', opacity: 0.6, marginBottom: 0}}>学分</div>
                <input
                  value={row.credits}
                  onChange={(e) => updateRow(row.id, {credits: e.target.value})}
                  inputMode="decimal"
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    borderRadius: 8,
                    border: '1px solid var(--ifm-color-emphasis-200)',
                    background: 'var(--ifm-background-color)',
                  }}
                />
              </div>

              <div>
                <div style={{fontSize: '0.8rem', opacity: 0.6, marginBottom: 0}}>成绩类型</div>
                <select
                  value={row.scoreType}
                  onChange={(e) => updateRow(row.id, {scoreType: e.target.value, score: ''})}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    borderRadius: 8,
                    border: '1px solid var(--ifm-color-emphasis-200)',
                    background: 'var(--ifm-background-color)',
                  }}
                >
                  <option value="percent">百分制</option>
                  <option value="five">五级制（不计入）</option>
                  <option value="passfail">二级制（不计入）</option>
                </select>
              </div>

              <div>
                <div style={{fontSize: '0.8rem', opacity: 0.6, marginBottom: 0}}>成绩</div>
                {row.scoreType === 'percent' && (
                  <input
                    value={row.score}
                    onChange={(e) => updateRow(row.id, {score: e.target.value})}
                    inputMode="decimal"
                    placeholder="0 - 100"
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      borderRadius: 8,
                      border: '1px solid var(--ifm-color-emphasis-200)',
                      background: 'var(--ifm-background-color)',
                    }}
                  />
                )}
                {row.scoreType === 'five' && (
                  <select
                    value={row.score}
                    onChange={(e) => updateRow(row.id, {score: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      borderRadius: 8,
                      border: '1px solid var(--ifm-color-emphasis-200)',
                      background: 'var(--ifm-background-color)',
                    }}
                  >
                    <option value="">请选择</option>
                    {FIVE_LEVEL_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}
                {row.scoreType === 'passfail' && (
                  <select
                    value={row.score}
                    onChange={(e) => updateRow(row.id, {score: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      borderRadius: 8,
                      border: '1px solid var(--ifm-color-emphasis-200)',
                      background: 'var(--ifm-background-color)',
                    }}
                  >
                    <option value="">请选择</option>
                    <option value="pass">通过</option>
                    <option value="fail">不通过</option>
                  </select>
                )}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 10,
              }}
            >
              <div style={{display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: '0.92rem'}}>
                <div>
                  课程绩点: <strong>{formatNumber(row.gp, 2)}</strong>
                </div>
                {!row.include && <div style={{opacity: 0.6}}>{row.note}</div>}
              </div>
              <button
                type="button"
                className="button button--secondary"
                onClick={() => removeRow(row.id)}
                disabled={rows.length <= 1}
              >
                删除
              </button>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 12,
          padding: 12,
          borderRadius: 12,
          border: '1px solid var(--ifm-color-emphasis-200)',
          background: 'var(--ifm-color-emphasis-200)',
        }}
      >
        <div style={{fontWeight: 650, marginBottom: 6}}>统计</div>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 18}}>
          <div>计入学分: {formatNumber(data.totalCredits, 2)}</div>
          <div>平均 GPA: {data.totalCredits > 0 ? formatNumber(data.average, 3) : '-'}</div>
        </div>
      </div>

      <div style={{marginTop: 12}}>
        <div style={{fontWeight: 650, marginBottom: 6}}>课程 GPA</div>
        <div style={{display: 'grid', gap: 6}}>
          {data.rows.map((row) => (
            <div
              key={row.id}
              style={{
                border: '1px solid var(--ifm-color-emphasis-200)',
                borderRadius: 10,
                padding: '8px 10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 8,
              }}
            >
              <div style={{fontWeight: 600}}>{row.course || `课程${row.id}`}</div>
              <div style={{display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: '0.9rem'}}>
                <div>学分: {formatNumber(row.credits, 2)}</div>
                <div>课程绩点: {formatNumber(row.gp, 3)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{marginTop: 12, fontSize: '0.85rem', opacity: 0.65, lineHeight: 1.6}}>
        百分制绩点公式：课程绩点 = 4 - 3(100 - X)^2 / 1600（60 ≤ X ≤ 100）。60 分以下绩点为 0。
        五级制不计入均分；二级制不计入均分。
      </div>

      {showTable && (
        <div
          role="dialog"
          aria-modal="false"
          style={{
            position: 'fixed',
            right: panelPos.x === 0 ? 24 : 'auto',
            bottom: panelPos.y === 0 ? 24 : 'auto',
            left: panelPos.x !== 0 ? panelPos.x : 'auto',
            top: panelPos.y !== 0 ? panelPos.y : 'auto',
            width: 'min(560px, 92vw)',
            maxHeight: '70vh',
            background: '#f0f0f0',
            borderRadius: 12,
            border: '1px solid #bfbfbf',
            padding: 12,
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            overflow: 'auto',
            zIndex: 999,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 10,
              cursor: 'move',
              paddingBottom: 8,
              borderBottom: '1px dashed #bfbfbf',
              marginBottom: 10,
              userSelect: 'none',
            }}
            onMouseDown={(e) => {
              dragRef.current.dragging = true;
              dragRef.current.offsetX = e.clientX - (panelPos.x || (window.innerWidth - 24 - 560));
              dragRef.current.offsetY = e.clientY - (panelPos.y || (window.innerHeight - 24 - 300));
            }}
          >
            <div style={{fontWeight: 700}}>GPA 分数对照表（100–60）</div>
            <button
              type="button"
              className="button button--secondary"
              onClick={() => setShowTable(false)}
            >
              关闭
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
              gap: 0,
              border: '1px solid #bfbfbf',
              borderRadius: 8,
              overflow: 'hidden',
              background: '#f0f0f0',
            }}
          >
            {tableScores.map((s) => (
              <div
                key={s}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.85rem',
                  padding: '6px 8px',
                  background: '#f0f0f0',
                  borderRight: '1px solid #bfbfbf',
                  borderBottom: '1px solid #bfbfbf',
                }}
              >
                <span>{s}</span>
                <span style={{fontWeight: 700}}>{formatNumber(scoreToGp(s), 3)}</span>
              </div>
            ))}
          </div>

          <div style={{fontSize: '0.85rem', opacity: 0.6, marginTop: 10}}>
            五级制与二级制不计入均分
          </div>
        </div>
      )}
    </div>
  );
}
