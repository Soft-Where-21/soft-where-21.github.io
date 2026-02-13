import React, {useMemo, useState} from 'react';

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildPattern(parts, matchMode) {
  if (parts.length === 0) return '';
  const alternation = `(?:${parts.join('|')})`;
  if (matchMode === 'start') return `^${alternation}`;
  if (matchMode === 'end') return `${alternation}$`;
  if (matchMode === 'exact') return `^${alternation}$`;
  if (matchMode === 'word') return `\\b${alternation}\\b`;
  return alternation;
}

function collectMatches(pattern, flags, text) {
  if (!pattern) return [];
  const previewFlags = flags.includes('g') ? flags : `${flags}g`;
  const reg = new RegExp(pattern, previewFlags);
  const lineStarts = [0];
  for (let i = 0; i < text.length; i += 1) {
    if (text[i] === '\n') lineStarts.push(i + 1);
  }

  const getLineAndColumn = (index) => {
    let low = 0;
    let high = lineStarts.length - 1;
    while (low <= high) {
      const mid = (low + high) >> 1;
      if (lineStarts[mid] <= index) low = mid + 1;
      else high = mid - 1;
    }
    const lineStart = lineStarts[high] ?? 0;
    return {
      line: high + 1,
      column: index - lineStart + 1,
    };
  };

  const result = [];
  let m;
  while ((m = reg.exec(text)) !== null && result.length < 50) {
    const pos = getLineAndColumn(m.index);
    result.push({
      value: m[0],
      index: m.index,
      line: pos.line,
      column: pos.column,
    });
    if (m[0] === '') reg.lastIndex += 1;
  }
  return result;
}

export default function RegexBuilderTool() {
  const [terms, setTerms] = useState('error\nwarning\ntimeout');
  const [testText, setTestText] = useState(
    '2026-02-11 error: request timeout\n2026-02-11 info: all good\n2026-02-11 warning: high latency'
  );
  const [matchMode, setMatchMode] = useState('contain');
  const [escapeOn, setEscapeOn] = useState(true);
  const [flagI, setFlagI] = useState(true);
  const [flagM, setFlagM] = useState(false);

  const {pattern, flags, error, previewMatches, termCount} = useMemo(() => {
    const rawTerms = terms
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const parts = escapeOn ? rawTerms.map(escapeRegex) : rawTerms;
    const builtPattern = buildPattern(parts, matchMode);
    const builtFlags = `${flagI ? 'i' : ''}${flagM ? 'm' : ''}`;

    if (!builtPattern) {
      return {
        pattern: '',
        flags: builtFlags,
        error: '',
        previewMatches: [],
        termCount: 0,
      };
    }

    try {
      // 这里用于校验 pattern + flags 是否能成功构造正则。
      // eslint-disable-next-line no-new
      new RegExp(builtPattern, builtFlags);
      return {
        pattern: builtPattern,
        flags: builtFlags,
        error: '',
        previewMatches: collectMatches(builtPattern, builtFlags, testText),
        termCount: rawTerms.length,
      };
    } catch (e) {
      return {
        pattern: builtPattern,
        flags: builtFlags,
        error: e?.message || String(e),
        previewMatches: [],
        termCount: rawTerms.length,
      };
    }
  }, [terms, testText, matchMode, escapeOn, flagI, flagM]);

  const regexLiteral = pattern ? `/${pattern}/${flags}` : '';

  return (
    <div style={{padding: 18, display: 'grid', gap: 14}}>
      <div style={{display: 'grid', gap: 10}}>
        <div style={{fontWeight: 650}}>规则输入（每行一个关键词）</div>
        <textarea
          value={terms}
          onChange={(e) => setTerms(e.target.value)}
          rows={5}
          style={{
            width: '100%',
            maxWidth: 520,
            padding: 10,
            borderRadius: 10,
            border: '1px solid var(--ifm-color-emphasis-200)',
            background: 'var(--ifm-background-color)',
            color: 'var(--ifm-font-color-base)',
            fontFamily: 'var(--ifm-font-family-monospace)',
          }}
        />
      </div>

      <div style={{display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center'}}>
        <label style={{display: 'inline-flex', gap: 8, alignItems: 'center'}}>
          匹配模式
          <select
            value={matchMode}
            onChange={(e) => setMatchMode(e.target.value)}
            style={{
              padding: '6px 8px',
              borderRadius: 8,
              border: '1px solid var(--ifm-color-emphasis-200)',
              background: 'var(--ifm-background-color)',
              color: 'var(--ifm-font-color-base)',
            }}
          >
            <option value="contain">包含</option>
            <option value="start">行首匹配</option>
            <option value="end">行尾匹配</option>
            <option value="exact">整行完全匹配</option>
            <option value="word">单词边界匹配</option>
          </select>
        </label>

        <label style={{display: 'inline-flex', gap: 6, alignItems: 'center'}}>
          <input type="checkbox" checked={escapeOn} onChange={(e) => setEscapeOn(e.target.checked)} />
          自动转义特殊字符
        </label>
        <label style={{display: 'inline-flex', gap: 6, alignItems: 'center'}}>
          <input type="checkbox" checked={flagI} onChange={(e) => setFlagI(e.target.checked)} />
          i（忽略大小写）
        </label>
        <label style={{display: 'inline-flex', gap: 6, alignItems: 'center'}}>
          <input type="checkbox" checked={flagM} onChange={(e) => setFlagM(e.target.checked)} />
          m（多行）
        </label>
      </div>

      <div style={{padding: 12, borderRadius: 10, border: '1px solid var(--ifm-color-emphasis-200)'}}>
        <div style={{fontSize: '0.85rem', opacity: 0.7}}>生成结果</div>
        <div style={{marginTop: 6, fontFamily: 'var(--ifm-font-family-monospace)', wordBreak: 'break-all'}}>
          {regexLiteral || '（请先输入关键词）'}
        </div>
        <div style={{marginTop: 8, opacity: 0.7, fontSize: '0.85rem'}}>
          关键词数量：{termCount}
        </div>
        {error ? (
          <div style={{marginTop: 8, color: 'var(--ifm-color-danger)'}}>正则无效：{error}</div>
        ) : null}
      </div>

      <div style={{display: 'grid', gap: 8}}>
        <div style={{fontWeight: 650}}>测试文本</div>
        <textarea
          value={testText}
          onChange={(e) => setTestText(e.target.value)}
          rows={6}
          style={{
            width: '100%',
            padding: 10,
            borderRadius: 10,
            border: '1px solid var(--ifm-color-emphasis-200)',
            background: 'var(--ifm-background-color)',
            color: 'var(--ifm-font-color-base)',
            fontFamily: 'var(--ifm-font-family-monospace)',
          }}
        />
      </div>

      <div style={{padding: 12, borderRadius: 10, border: '1px solid var(--ifm-color-emphasis-200)'}}>
        <div style={{fontSize: '0.85rem', opacity: 0.7, marginBottom: 8}}>匹配预览（最多 50 条）</div>
        {previewMatches.length === 0 ? (
          <div style={{opacity: 0.75}}>没有匹配结果</div>
        ) : (
          <div style={{display: 'grid', gap: 6}}>
            {previewMatches.map((m, idx) => (
              <div key={`${m.index}-${idx}`} style={{fontFamily: 'var(--ifm-font-family-monospace)'}}>
                [第{m.line}行 第{m.column}列 | idx {m.index}] {m.value}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
