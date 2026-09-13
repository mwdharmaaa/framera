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
    { x: innerFrame.x + 80, y: innerFrame.y + 120, len: 35, angle: 0.3 },
    { x: innerFrame.x + 420, y: innerFrame.y + 70, len: 25, angle: -0.4 },
    { x: innerFrame.x + 720, y: innerFrame.y + 310, len: 40, angle: 0.6 },
    { x: innerFrame.x + 230, y: innerFrame.y + 680, len: 30, angle: -0.25 },
    { x: innerFrame.x + 650, y: innerFrame.y + 920, len: 28, angle: 0.4 }
  ];
  for (const s of scuffs) {
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(s.x + Math.cos(s.angle) * s.len, s.y + Math.sin(s.angle) * s.len);
    ctx.stroke();
  }
  ctx.restore();
}

/** Draws authentic 4-quadrant tactile paper crease folds with offset bottom-right intersection. */
export function drawTactileCreases(ctx, cw, ch, poster, foldX, foldY) {
  const mx = foldX !== undefined ? foldX : Math.round(poster.x + poster.w * 0.69);
  const my = foldY !== undefined ? foldY : Math.round(poster.y + poster.h * 0.54);

  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.fillRect(poster.x, poster.y, mx - poster.x, my - poster.y);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
  ctx.fillRect(mx, poster.y, poster.x + poster.w - mx, my - poster.y);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.16)';
  ctx.fillRect(mx, my, poster.x + poster.w - mx, poster.y + poster.h - my);

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
    if (isVert) {
      ctx.moveTo(x1 + 1.5, y1); ctx.lineTo(x2 + 1.5, y2);
    } else {
      ctx.moveTo(x1, y1 + 1.5); ctx.lineTo(x2, y2 + 1.5);
    }
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.78)';
    ctx.lineWidth = 1.6;
    if (typeof ctx.setLineDash === 'function') {
      ctx.setLineDash([4, 12, 8, 16, 3, 20]);
    }
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    if (typeof ctx.setLineDash === 'function') {
      ctx.setLineDash([]);
    }
  };

  drawCrease(poster.x, my, poster.x + poster.w, my, false);
  drawCrease(mx, poster.y, mx, poster.y + poster.h, true);
  ctx.restore();
}
