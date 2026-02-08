import React, {useMemo, useState} from 'react';
import Heading from '@theme/Heading';

export default function JsonTool() {
  const [text, setText] = useState('{\n  \"hello\": \"world\",\n  \"n\": 1\n}\n');
  const [pretty, setPretty] = useState(true);

  const output = useMemo(() => {
    try {
      const obj = JSON.parse(text);
      return pretty ? JSON.stringify(obj, null, 2) : JSON.stringify(obj);
    } catch (e) {
      return `JSON 解析失败：${e?.message || e}`;
    }
  }, [text, pretty]);

  return (
    <div style={{padding: 18}}>

      <div style={{display: 'flex', gap: 16, flexWrap: 'wrap'}}>
        <div style={{flex: '1 1 360px', minWidth: 280}}>
          <div style={{fontSize: '0.85rem', opacity: 0.65, marginBottom: 6}}>输入</div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
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

        <div style={{flex: '1 1 360px', minWidth: 280}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10}}>
            <div style={{fontSize: '0.85rem', opacity: 0.65, marginBottom: 6}}>输出</div>
            <label style={{display: 'inline-flex', gap: 8, alignItems: 'center', opacity: 0.8}}>
              <input type="checkbox" checked={pretty} onChange={(e) => setPretty(e.target.checked)} />
              美化
            </label>
          </div>
          <textarea
            value={output}
            readOnly
            rows={10}
            style={{
              width: '100%',
              padding: 10,
              borderRadius: 10,
              border: '1px solid var(--ifm-color-emphasis-200)',
              background: 'var(--ifm-color-emphasis-100)',
              color: 'var(--ifm-font-color-base)',
              fontFamily: 'var(--ifm-font-family-monospace)',
            }}
          />
        </div>
      </div>
    </div>
  );
}

