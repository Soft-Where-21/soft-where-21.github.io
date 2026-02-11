import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';

function hexToRgb(hex) {
  // 仅支持十六进制颜色：#RGB（会自动扩展为 #RRGGBB）和 #RRGGBB。
  const v = hex.replace('#', '').trim();
  const s = v.length === 3 ? v.split('').map((c) => c + c).join('') : v;
  if (!/^[\da-fA-F]{6}$/.test(s)) return null;
  const n = Number.parseInt(s, 16);
  return {r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255};
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

function rgbToHex(r, g, b) {
  const toHex = (v) => v.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export default function ColorPickerTool() {
  const [hex, setHex] = useState('#3b82f6');
  const [pickerPos, setPickerPos] = useState({x: 0, y: 0});
  const canvasRef = useRef(null);

  const data = useMemo(() => {
    const rgb = hexToRgb(hex);
    if (!rgb) return null;
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    return {rgb, hsl};
  }, [hex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // 画一张可拾取的色板：横向色相 + 左侧加白 + 下方加黑。
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
    setHex(rgbToHex(pixel[0], pixel[1], pixel[2]));
  }, []);

  const handlePickerDown = (e) => {
    pickFromPoint(e.clientX, e.clientY);
  };

  const handlePickerMove = (e) => {
    if ((e.buttons & 1) !== 1) return;
    pickFromPoint(e.clientX, e.clientY);
  };

  const markerLeft = `${(pickerPos.x / 360) * 100}%`;
  const markerTop = `${(pickerPos.y / 200) * 100}%`;

  return (
    <div style={{padding: 18, display: 'grid', gap: 14}}>
      <div style={{display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap'}}>
        <input
          type="color"
          value={data ? hex : '#000000'}
          onChange={(e) => setHex(e.target.value)}
          style={{width: 52, height: 38, border: 'none', background: 'transparent', cursor: 'pointer'}}
        />
        <input
          value={hex}
          onChange={(e) => setHex(e.target.value)}
          placeholder="#RRGGBB"
          style={{
            width: 180,
            padding: '10px 12px',
            borderRadius: 10,
            border: '1px solid var(--ifm-color-emphasis-200)',
            background: 'var(--ifm-background-color)',
            color: 'var(--ifm-font-color-base)',
            fontFamily: 'var(--ifm-font-family-monospace)',
          }}
        />
      </div>
      <div style={{fontSize: '0.82rem', opacity: 0.7}}>
        仅支持十六进制输入：#RGB 或 #RRGGBB（不区分大小写）
      </div>

      <div style={{height: 96, borderRadius: 12, border: '1px solid var(--ifm-color-emphasis-200)', background: data ? hex : '#000'}} />
      {data ? (
        <div style={{display: 'grid', gap: 8, fontFamily: 'var(--ifm-font-family-monospace)'}}>
          <div>HEX: {hex.toUpperCase()}</div>
          <div>RGB: {data.rgb.r}, {data.rgb.g}, {data.rgb.b}</div>
          <div>HSL: {data.hsl.h}, {data.hsl.s}%, {data.hsl.l}%</div>
        </div>
      ) : (
        <div style={{opacity: 0.7}}>HEX 格式无效，请输入 `#RRGGBB` 或 `#RGB`。</div>
      )}
      <div>
        <div style={{fontSize: '0.85rem', opacity: 0.7, marginBottom: 8}}>取色区（可点击或按住拖动）</div>
        <div style={{position: 'relative', width: '100%', maxWidth: 520}}>
          <canvas
            ref={canvasRef}
            width={360}
            height={200}
            onPointerDown={handlePickerDown}
            onPointerMove={handlePickerMove}
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
