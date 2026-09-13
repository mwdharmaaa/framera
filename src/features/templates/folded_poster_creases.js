let cachedGrainPattern = null;

function getGrainPattern(ctx) {
  if (cachedGrainPattern) return cachedGrainPattern;
  if (typeof document === 'undefined') return null;
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const cctx = canvas.getContext('2d');
  if (!cctx) return null;
  const imgData = cctx.createImageData(size, size);
  const buf = new Uint32Array(imgData.data.buffer);
  for (let i = 0; i < buf.length; i++) {
    const mono = (Math.random() * 120 + 70) | 0;
    const r = Math.min(255, Math.max(0, mono + ((Math.random() * 32 - 16) | 0)));
    const g = Math.min(255, Math.max(0, mono + ((Math.random() * 32 - 16) | 0)));
    const b = Math.min(255, Math.max(0, mono + ((Math.random() * 42 - 21) | 0)));
    const a = (Math.random() * 34 + 12) | 0;
    buf[i] = (a << 24) | (b << 16) | (g << 8) | r;
  }
  cctx.putImageData(imgData, 0, 0);
  cachedGrainPattern = ctx.createPattern(canvas, 'repeat');
  return cachedGrainPattern;
}

/** Draws realistic frosted semi-translucent adhesive scotch tape with crinkles. */
export function drawScotchTape(ctx, x, y, w = 125, h = 42, angle = -0.62) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = 'rgba(0, 8, 20, 0.32)';
  ctx.fillRect(-w / 2 + 2, -h / 2 + 3, w, h);
  ctx.fillStyle = 'rgba(242, 246, 255, 0.44)';
  ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = 1;
  ctx.strokeRect(-w / 2, -h / 2, w, h);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-w * 0.3, -h * 0.4); ctx.lineTo(-w * 0.1, h * 0.4);
  ctx.moveTo(w * 0.1, -h * 0.35); ctx.lineTo(w * 0.25, h * 0.3);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.fillRect(-w / 2, -h / 2, 2, h);
  ctx.fillRect(w / 2 - 2, -h / 2, 2, h);
  ctx.restore();
}

/** Applies vintage risograph CMYK film grain, aged newsprint wash, and paper fiber scuffs. */
export function applyVintagePrintTexture(ctx, poster, innerFrame) {
  ctx.save();
  ctx.fillStyle = 'rgba(255, 246, 230, 0.08)';
  ctx.fillRect(innerFrame.x, innerFrame.y, innerFrame.w, innerFrame.h);
  const grain = getGrainPattern(ctx);
  if (grain) {
    ctx.fillStyle = grain;
    ctx.fillRect(poster.x, poster.y, poster.w, poster.h);
  }
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
  ctx.lineWidth = 1;
  const scuffs = [
    [innerFrame.x + 80, innerFrame.y + 120, 35, 0.3],
    [innerFrame.x + 420, innerFrame.y + 70, 25, -0.4],
    [innerFrame.x + 720, innerFrame.y + 310, 40, 0.6],
    [innerFrame.x + 230, innerFrame.y + 680, 30, -0.25],
    [innerFrame.x + 650, innerFrame.y + 920, 28, 0.4]
  ];
  for (const [sx, sy, slen, sa] of scuffs) {
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + Math.cos(sa) * slen, sy + Math.sin(sa) * slen);
    ctx.stroke();
  }
  ctx.restore();
}

/** Draws authentic 4-quadrant paper creases and light sheen on top-right, bottom-left, and bottom-right corner. */
export function drawTactileCreases(ctx, cw, ch, poster, foldX, foldY) {
  const mx = foldX !== undefined ? foldX : Math.round(poster.x + poster.w * 0.69);
  const my = foldY !== undefined ? foldY : Math.round(poster.y + poster.h * 0.54);
  const pw = poster.x + poster.w - mx;
  const ph = poster.y + poster.h - my;

  ctx.save();
  // 1. Top-Left: subtle paper highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.fillRect(poster.x, poster.y, mx - poster.x, my - poster.y);

  // 2. Top-Right: luminous diagonal light wash across upper panel
  const trGrad = ctx.createLinearGradient(mx, poster.y, poster.x + poster.w, my);
  trGrad.addColorStop(0, 'rgba(255, 255, 255, 0.16)');
  trGrad.addColorStop(0.55, 'rgba(255, 255, 255, 0.06)');
  trGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = trGrad;
  ctx.fillRect(mx, poster.y, pw, my - poster.y);

  // 3. Bottom-Left: radiant soft light wash across lower manifesto panel
  const blGrad = ctx.createLinearGradient(poster.x, my, poster.x + (mx - poster.x) * 0.7, poster.y + poster.h);
  blGrad.addColorStop(0, 'rgba(255, 255, 255, 0.14)');
  blGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');
  blGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = blGrad;
  ctx.fillRect(poster.x, my, mx - poster.x, ph);

  // 4. Bottom-Right: base fold shadow + specular corner light reflection
  ctx.fillStyle = 'rgba(0, 0, 0, 0.14)';
  ctx.fillRect(mx, my, pw, ph);

  const brGrad = ctx.createRadialGradient(
    poster.x + poster.w, poster.y + poster.h, 0,
    poster.x + poster.w, poster.y + poster.h, 340
  );
  brGrad.addColorStop(0, 'rgba(255, 255, 255, 0.24)');
  brGrad.addColorStop(0.4, 'rgba(255, 255, 255, 0.09)');
  brGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = brGrad;
  ctx.fillRect(mx, my, pw, ph);

  // 5. Crease lines and cracked ink distress along fold axes
  const drawCrease = (x1, y1, x2, y2, isVert) => {
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.18)';
    ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.strokeStyle = 'rgba(12, 16, 26, 0.65)';
    ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    if (isVert) { ctx.moveTo(x1 + 1.5, y1); ctx.lineTo(x2 + 1.5, y2); }
    else { ctx.moveTo(x1, y1 + 1.5); ctx.lineTo(x2, y2 + 1.5); }
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.78)';
    ctx.lineWidth = 1.6;
    if (typeof ctx.setLineDash === 'function') ctx.setLineDash([4, 12, 8, 16, 3, 20]);
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    if (typeof ctx.setLineDash === 'function') ctx.setLineDash([]);
  };

  drawCrease(poster.x, my, poster.x + poster.w, my, false);
  drawCrease(mx, poster.y, mx, poster.y + poster.h, true);
  ctx.restore();
}
