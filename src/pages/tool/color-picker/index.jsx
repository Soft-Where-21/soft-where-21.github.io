import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';

function normalizeHexInput(value) {
  const trimmed = value.trim();
  const matched = trimmed.match(/^#?([\da-fA-F]{3}|[\da-fA-F]{6})$/);
  if (!matched) return null;
  let hex = matched[1].toLowerCase();
  if (hex.length === 3) {
    hex = hex.split('').map((c) => c + c).join('');
  }
  return `#${hex}`;
}

function hexToRgb(hex) {
  const normalized = normalizeHexInput(hex);
  if (!normalized) return null;
  const n = Number.parseInt(normalized.slice(1), 16);
  return {r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255};
}

function rgbToHex(r, g, b) {
  const toHex = (v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function rgbToHsl(r, g, b) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  let h = 0;
  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));

  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d) % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb(h, s, l) {
  const hh = ((h % 360) + 360) % 360;
  const sn = s / 100;
  const ln = l / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const x = c * (1 - Math.abs(((hh / 60) % 2) - 1));
  const m = ln - c / 2;

  let r1 = 0;
  let g1 = 0;
  let b1 = 0;

  if (hh < 60) {
    r1 = c;
    g1 = x;
  } else if (hh < 120) {
    r1 = x;
    g1 = c;
  } else if (hh < 180) {
    g1 = c;
    b1 = x;
  } else if (hh < 240) {
    g1 = x;
    b1 = c;
  } else if (hh < 300) {
    r1 = x;
    b1 = c;
  } else {
    r1 = c;
    b1 = x;
  }

  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}

function parseInteger(value) {
  if (value.trim() === '') return null;
  if (!/^-?\d+$/.test(value.trim())) return Number.NaN;
  return Number(value.trim());
}

export default function ColorPickerTool() {
  const [hex, setHex] = useState('#3b82f6');
  const [inputMode, setInputMode] = useState('hex');
  const [inputError, setInputError] = useState('');
  const [hexInput, setHexInput] = useState('#3B82F6');
  const [rgbInput, setRgbInput] = useState({r: '59', g: '130', b: '246'});
  const [hslInput, setHslInput] = useState({h: '217', s: '91', l: '60'});
  const [pickerPos, setPickerPos] = useState({x: 0, y: 0});
  const canvasRef = useRef(null);
  const hexSyncSourceRef = useRef('external'); // external | hex-input

  const data = useMemo(() => {
    const rgb = hexToRgb(hex);
    if (!rgb) return null;
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    return {rgb, hsl};
  }, [hex]);

  useEffect(() => {
    if (!data) return;
    if (hexSyncSourceRef.current !== 'hex-input') {
      setHexInput(hex.toUpperCase());
    }
    hexSyncSourceRef.current = 'external';
    setRgbInput({
      r: String(data.rgb.r),
      g: String(data.rgb.g),
      b: String(data.rgb.b),
    });
    setHslInput({
      h: String(data.hsl.h),
      s: String(data.hsl.s),
      l: String(data.hsl.l),
    });
  }, [hex, data]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // 色板：横向色相 + 左侧加白 + 下方加黑。
    const hue = ctx.createLinearGradient(0, 0, w, 0);
    hue.addColorStop(0, '#ff0000');
    hue.addColorStop(1 / 6, '#ffff00');
    hue.addColorStop(2 / 6, '#00ff00');
    hue.addColorStop(3 / 6, '#00ffff');
    hue.addColorStop(4 / 6, '#0000ff');
    hue.addColorStop(5 / 6, '#ff00ff');
    hue.addColorStop(1, '#ff0000');
    ctx.fillStyle = hue;
    ctx.fillRect(0, 0, w, h);

    const white = ctx.createLinearGradient(0, 0, w, 0);
    white.addColorStop(0, 'rgba(255,255,255,1)');
    white.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = white;
    ctx.fillRect(0, 0, w, h);

    const black = ctx.createLinearGradient(0, 0, 0, h);
    black.addColorStop(0, 'rgba(0,0,0,0)');
    black.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.fillStyle = black;
    ctx.fillRect(0, 0, w, h);
  }, []);

  const pickFromPoint = useCallback((clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.round(((clientX - rect.left) * canvas.width) / rect.width);
    const y = Math.round(((clientY - rect.top) * canvas.height) / rect.height);
    const clampX = Math.max(0, Math.min(canvas.width - 1, x));
    const clampY = Math.max(0, Math.min(canvas.height - 1, y));
    const pixel = ctx.getImageData(clampX, clampY, 1, 1).data;

    setPickerPos({x: clampX, y: clampY});
    setInputError('');
    hexSyncSourceRef.current = 'external';
    setHex(rgbToHex(pixel[0], pixel[1], pixel[2]));
  }, []);

  const handleHexChange = (value) => {
    setHexInput(value);
    const normalized = normalizeHexInput(value);
    if (!normalized) {
      setInputError('HEX 格式无效，支持 #RGB 或 #RRGGBB');
      return;
    }
    setInputError('');
    hexSyncSourceRef.current = 'hex-input';
    setHex(normalized);
  };

  const handleRgbChange = (channel, value) => {
    const next = {...rgbInput, [channel]: value};
    setRgbInput(next);

    const r = parseInteger(next.r);
    const g = parseInteger(next.g);
    const b = parseInteger(next.b);
    if ([r, g, b].some((n) => n === null)) {
      setInputError('RGB 范围：R/G/B 均为 0-255 的整数');
      return;
    }
    if ([r, g, b].some((n) => Number.isNaN(n) || n < 0 || n > 255)) {
      setInputError('RGB 超出范围：R/G/B 需在 0-255');
      return;
    }
    setInputError('');
    hexSyncSourceRef.current = 'external';
    setHex(rgbToHex(r, g, b));
  };

  const handleHslChange = (channel, value) => {
    const next = {...hslInput, [channel]: value};
    setHslInput(next);

    const h = parseInteger(next.h);
    const s = parseInteger(next.s);
    const l = parseInteger(next.l);
    if ([h, s, l].some((n) => n === null)) {
      setInputError('HSL 范围：H 0-360，S/L 0-100（整数）');
      return;
    }
    if (Number.isNaN(h) || Number.isNaN(s) || Number.isNaN(l)) {
      setInputError('HSL 输入无效，请输入整数');
      return;
    }
    if (h < 0 || h > 360 || s < 0 || s > 100 || l < 0 || l > 100) {
      setInputError('HSL 超出范围：H 0-360，S/L 0-100');
      return;
    }

    setInputError('');
    const rgb = hslToRgb(h, s, l);
    hexSyncSourceRef.current = 'external';
    setHex(rgbToHex(rgb.r, rgb.g, rgb.b));
  };

  const markerLeft = `${(pickerPos.x / 360) * 100}%`;
  const markerTop = `${(pickerPos.y / 200) * 100}%`;

  return (
    <div style={{padding: 18, display: 'grid', gap: 14}}>
      <div style={{display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap'}}>
        <input
          type="color"
          value={data ? hex : '#000000'}
          onChange={(e) => {
            setInputError('');
            hexSyncSourceRef.current = 'external';
            setHex(normalizeHexInput(e.target.value) || '#000000');
          }}
          style={{width: 52, height: 38, border: 'none', background: 'transparent', cursor: 'pointer'}}
        />

        <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
          {[
            {id: 'hex', label: 'HEX'},
            {id: 'rgb', label: 'RGB'},
            {id: 'hsl', label: 'HSL'},
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setInputError('');
                setInputMode(m.id);
              }}
              style={{
                border: '1px solid var(--ifm-color-emphasis-200)',
                background: inputMode === m.id ? 'var(--ifm-color-emphasis-200)' : 'var(--ifm-card-background-color)',
                borderRadius: 8,
                padding: '6px 10px',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {inputMode === 'hex' ? (
        <input
          value={hexInput}
          onChange={(e) => handleHexChange(e.target.value)}
          placeholder="#RRGGBB"
          style={{
            width: 220,
            maxWidth: '100%',
            padding: '10px 12px',
            borderRadius: 10,
            border: '1px solid var(--ifm-color-emphasis-200)',
            background: 'var(--ifm-background-color)',
            color: 'var(--ifm-font-color-base)',
            fontFamily: 'var(--ifm-font-family-monospace)',
          }}
        />
      ) : null}

      {inputMode === 'rgb' ? (
        <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
          <input
            type="number"
            min={0}
            max={255}
            step={1}
            value={rgbInput.r}
            onChange={(e) => handleRgbChange('r', e.target.value)}
            placeholder="R"
            style={{width: 90, padding: '10px 12px', borderRadius: 10, border: '1px solid var(--ifm-color-emphasis-200)'}}
          />
          <input
            type="number"
            min={0}
            max={255}
            step={1}
            value={rgbInput.g}
            onChange={(e) => handleRgbChange('g', e.target.value)}
            placeholder="G"
            style={{width: 90, padding: '10px 12px', borderRadius: 10, border: '1px solid var(--ifm-color-emphasis-200)'}}
          />
          <input
            type="number"
            min={0}
            max={255}
            step={1}
            value={rgbInput.b}
            onChange={(e) => handleRgbChange('b', e.target.value)}
            placeholder="B"
            style={{width: 90, padding: '10px 12px', borderRadius: 10, border: '1px solid var(--ifm-color-emphasis-200)'}}
          />
        </div>
      ) : null}

      {inputMode === 'hsl' ? (
        <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
          <input
            type="number"
            min={0}
            max={360}
            step={1}
            value={hslInput.h}
            onChange={(e) => handleHslChange('h', e.target.value)}
            placeholder="H"
            style={{width: 90, padding: '10px 12px', borderRadius: 10, border: '1px solid var(--ifm-color-emphasis-200)'}}
          />
          <input
            type="number"
            min={0}
            max={100}
            step={1}
            value={hslInput.s}
            onChange={(e) => handleHslChange('s', e.target.value)}
            placeholder="S"
            style={{width: 90, padding: '10px 12px', borderRadius: 10, border: '1px solid var(--ifm-color-emphasis-200)'}}
          />
          <input
            type="number"
            min={0}
            max={100}
            step={1}
            value={hslInput.l}
            onChange={(e) => handleHslChange('l', e.target.value)}
            placeholder="L"
            style={{width: 90, padding: '10px 12px', borderRadius: 10, border: '1px solid var(--ifm-color-emphasis-200)'}}
          />
        </div>
      ) : null}

      <div style={{fontSize: '0.82rem', opacity: 0.75}}>
        {inputMode === 'hex' ? 'HEX 范围：#RGB 或 #RRGGBB（十六进制 0-9 / A-F）' : null}
        {inputMode === 'rgb' ? 'RGB 范围：R/G/B 均为 0-255 的整数' : null}
        {inputMode === 'hsl' ? 'HSL 范围：H 0-360，S/L 0-100（单位：%）' : null}
      </div>

      {inputError ? (
        <div style={{fontSize: '0.86rem', color: 'var(--ifm-color-danger)'}}>{inputError}</div>
      ) : null}

      <div style={{height: 96, borderRadius: 12, border: '1px solid var(--ifm-color-emphasis-200)', background: data ? hex : '#000'}} />
      {data ? (
        <div style={{display: 'grid', gap: 8, fontFamily: 'var(--ifm-font-family-monospace)'}}>
          <div>HEX: {hex.toUpperCase()}</div>
          <div>RGB: {data.rgb.r}, {data.rgb.g}, {data.rgb.b}</div>
          <div>HSL: {data.hsl.h}, {data.hsl.s}%, {data.hsl.l}%</div>
        </div>
      ) : (
        <div style={{opacity: 0.7}}>输入格式无效，请按范围提示检查。</div>
      )}

      <div>
        <div style={{fontSize: '0.85rem', opacity: 0.7, marginBottom: 8}}>取色区（可点击或按住拖动）</div>
        <div style={{position: 'relative', width: '100%', maxWidth: 520}}>
          <canvas
            ref={canvasRef}
            width={360}
            height={200}
            onPointerDown={(e) => pickFromPoint(e.clientX, e.clientY)}
            onPointerMove={(e) => {
              if ((e.buttons & 1) !== 1) return;
              pickFromPoint(e.clientX, e.clientY);
            }}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              borderRadius: 12,
              border: '1px solid var(--ifm-color-emphasis-200)',
              cursor: 'crosshair',
              touchAction: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: markerLeft,
              top: markerTop,
              width: 12,
              height: 12,
              borderRadius: '50%',
              border: '2px solid #fff',
              boxShadow: '0 0 0 1px rgba(0,0,0,.5)',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>
    </div>
  );
}
