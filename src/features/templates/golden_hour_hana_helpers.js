/**
 * Slot definitions for the Golden Hour Hana Quad template.
 * 4 distinct photo slots arranged around an aesthetic floating music player card.
 */
export const HANA_SUNSET_SLOTS = [
  {
    id: 0,
    name: 'Top Horizon Banner',
    x: 55,
    y: 150,
    w: 636,
    h: 355
  },
  {
    id: 1,
    name: 'Middle Right Detail',
    x: 356,
    y: 505,
    w: 340,
    h: 275
  },
  {
    id: 2,
    name: 'Bottom Left Eyes Focus',
    x: 58,
    y: 685,
    w: 298,
    h: 300
  },
  {
    id: 3,
    name: 'Bottom Right Golden Portrait',
    x: 230,
    y: 780,
    w: 506,
    h: 366
  }
];

/**
 * Renders an individual slot photo with authentic warm sunset / golden hour filter pipeline.
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement|object} photo
 * @param {object} slot
 */
export function renderWarmSlotPhoto(ctx, photo, slot) {
  if (!ctx || !photo) return;
  const { x, y, w, h } = slot;
  const nw = photo.naturalWidth || photo.width || w;
  const nh = photo.naturalHeight || photo.height || h;
  const scale = Math.max(w / nw, h / nh);
  const sw = nw * scale;
  const sh = nh * scale;
  const sx = x + (w - sw) / 2;
  const sy = y + (h - sh) / 2;

  ctx.save();
  ctx.beginPath();
  if (typeof ctx.rect === 'function') {
    ctx.rect(x, y, w, h);
  }
  if (typeof ctx.clip === 'function') {
    ctx.clip();
  }

  // 1. Warm afternoon / sore hari color grade filter
  const prevFilter = ctx.filter;
  try {
    ctx.filter = 'sepia(38%) saturate(145%) contrast(116%) brightness(102%) hue-rotate(-8deg)';
  } catch {
    // Unsupported filter fallback
  }

  try {
    ctx.drawImage(photo, sx, sy, sw, sh);
  } catch {
    // Mock environment fallback
  }

  try {
    ctx.filter = prevFilter || 'none';
  } catch {}

  // 2. Warm golden-hour soft glow overlay
  if (typeof ctx.createLinearGradient === 'function') {
    const grad = ctx.createLinearGradient(x, y, x + w, y + h);
    grad.addColorStop(0, 'rgba(255, 140, 20, 0.22)');
    grad.addColorStop(0.5, 'rgba(255, 95, 15, 0.15)');
    grad.addColorStop(1, 'rgba(180, 45, 10, 0.25)');
    ctx.fillStyle = grad;
    ctx.globalCompositeOperation = 'soft-light';
    if (typeof ctx.fillRect === 'function') {
      ctx.fillRect(x, y, w, h);
    }
  }

  ctx.restore();
}

/**
 * Renders the floating amber glass music player card.
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} [state]
 */
export function renderHanaMusicPlayer(ctx, state = {}) {
  if (!ctx) return;
  const x = 60;
  const y = 515;
  const w = 328;
  const h = 162;
  const title = state?.caption || 'Hana';
  const artist = state?.subtitle || 'Fujii Kaze';
  const time = state?.date || '00:23 / 02:39';

  ctx.save();

  // 1. Ambient drop shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.42)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 6;

  // 2. Amber glass gradient card background
  if (typeof ctx.createLinearGradient === 'function') {
    const bgGrad = ctx.createLinearGradient(x, y, x + w, y + h);
    bgGrad.addColorStop(0, '#f9aa26');
    bgGrad.addColorStop(1, '#e57a0b');
    ctx.fillStyle = bgGrad;
  } else {
    ctx.fillStyle = '#f9aa26';
  }

  if (typeof ctx.beginPath === 'function') {
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(x, y, w, h, 16);
    } else if (typeof ctx.rect === 'function') {
      ctx.rect(x, y, w, h);
    }
    if (typeof ctx.fill === 'function') {
      ctx.fill();
    }
  }

  // 3. Subtle translucent border stroke
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = 1;
  if (typeof ctx.stroke === 'function') {
    ctx.stroke();
  }

  // 4. Music Player Typography
  if (typeof ctx.fillText === 'function') {
    ctx.fillStyle = '#261103';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = '700 16px "Poppins", sans-serif';
    ctx.fillText(String(title), x + 20, y + 20);

    ctx.font = '500 12px "Poppins", sans-serif';
    ctx.fillStyle = '#4a250a';
    ctx.fillText(String(artist), x + 20, y + 42);

    // Audio controls UI indicators (previous, pause, next)
    ctx.font = '700 14px monospace';
    ctx.fillStyle = '#261103';
    ctx.fillText('|<   ||   >|', x + 56, y + 74);

    // Timeline progress bar
    if (typeof ctx.fillRect === 'function') {
      ctx.fillStyle = 'rgba(60, 25, 5, 0.25)';
      ctx.fillRect(x + 20, y + 114, w - 40, 4);
      ctx.fillStyle = '#261103';
      ctx.fillRect(x + 20, y + 114, 52, 4);
    }

    ctx.font = '500 10px monospace';
    ctx.fillStyle = '#4a250a';
    ctx.fillText(String(time), x + 20, y + 126);
  }

  ctx.restore();
}

/**
 * Renders dark botanical background base.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cw
 * @param {number} ch
 */
export function renderDarkBotanicalBase(ctx, cw = 736, ch = 1308) {
  if (!ctx) return;
  ctx.save();
  ctx.fillStyle = '#0b0606';
  if (typeof ctx.fillRect === 'function') {
    ctx.fillRect(0, 0, cw, ch);
  }
  ctx.restore();
}
