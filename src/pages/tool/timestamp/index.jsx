import React, {useMemo, useState} from 'react';
import Heading from '@theme/Heading';

export default function TimestampTool() {
  const [ts, setTs] = useState(() => String(Math.floor(Date.now() / 1000)));
  const [mode, setMode] = useState('s'); // s | ms

  const dateText = useMemo(() => {
    const n = Number(ts);
    if (!Number.isFinite(n)) return '请输入数字时间戳';
    const ms = mode === 'ms' ? n : n * 1000;
    const d = new Date(ms);
    if (Number.isNaN(d.getTime())) return '时间戳无效';
    return d.toLocaleString();
  }, [ts, mode]);

  return (
    <div style={{padding: 18}}>

      <div style={{display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 12}}>
        <label style={{display: 'inline-flex', gap: 6, alignItems: 'center', cursor: 'pointer'}}>
          <input type="radio" checked={mode === 's'} onChange={() => setMode('s')} />
          秒（s）
        </label>
        <label style={{display: 'inline-flex', gap: 6, alignItems: 'center', cursor: 'pointer'}}>
          <input type="radio" checked={mode === 'ms'} onChange={() => setMode('ms')} />
          毫秒（ms）
        </label>
      </div>

      <input
        value={ts}
        onChange={(e) => setTs(e.target.value)}
        placeholder="输入时间戳"
        style={{
          width: '100%',
          maxWidth: 520,
          padding: '10px 12px',
          borderRadius: 10,
          border: '1px solid var(--ifm-color-emphasis-200)',
          background: 'var(--ifm-background-color)',
          color: 'var(--ifm-font-color-base)',
        }}
      />

      <div style={{marginTop: 12, padding: 12, borderRadius: 10, border: '1px solid var(--ifm-color-emphasis-200)'}}>
        <div style={{fontSize: '0.85rem', opacity: 0.65, marginBottom: 6}}>转换结果</div>
        <div style={{fontWeight: 650}}>{dateText}</div>
      </div>
    </div>
  );
}

