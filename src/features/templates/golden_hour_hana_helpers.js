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
 * Renders an individual slot photo with an unmistakable golden hour / sunset orange filter pipeline.
 * Guarantees that any user uploaded image (regardless of initial color temperature) is graded into warm orange.
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement|object} photo
 * @param {object} slot
 * @param {object} [options={}]
 */
export function renderWarmSlotPhoto(ctx, photo, slot, options = {}) {
  if (!ctx || !photo) return;
  const { x, y, w, h } = slot;
  const zoom = options.zoom || 1;
  const panX = options.panX || 0;
  const panY = options.panY || 0;
  const nw = photo.naturalWidth || photo.width || w;
  const nh = photo.naturalHeight || photo.height || h;
  const scale = Math.max(w / nw, h / nh) * zoom;
  const sw = nw * scale;
  const sh = nh * scale;
  const sx = x + (w - sw) / 2 + panX;
  const sy = y + (h - sh) / 2 + panY;

  ctx.save();
  ctx.beginPath();
  if (typeof ctx.rect === 'function') {
    ctx.rect(x, y, w, h);
  }
  if (typeof ctx.clip === 'function') {
    ctx.clip();
  }

  // 1. Deep warm afternoon filter (sepia converts cool tones to amber, saturation boosts orange vibrance)
  const prevFilter = ctx.filter;
  try {
    ctx.filter = 'sepia(65%) saturate(175%) contrast(112%) brightness(98%) hue-rotate(-12deg)';
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

  // 2. Primary orange color tint overlay ('color' blend mode forces any image hue into warm sunset orange)
  ctx.save();
  ctx.globalCompositeOperation = 'color';
  ctx.fillStyle = 'rgba(255, 125, 0, 0.45)';
  if (typeof ctx.fillRect === 'function') {
    ctx.fillRect(x, y, w, h);
  }
  ctx.restore();

  // 3. Golden-hour soft-light sunset glow (angled directional sunbeam gradient)
  if (typeof ctx.createLinearGradient === 'function') {
    ctx.save();
    ctx.globalCompositeOperation = 'soft-light';
    const sunGrad = ctx.createLinearGradient(x, y, x + w, y + h);
    sunGrad.addColorStop(0, 'rgba(255, 165, 30, 0.55)');
    sunGrad.addColorStop(0.5, 'rgba(255, 115, 10, 0.45)');
    sunGrad.addColorStop(1, 'rgba(215, 65, 0, 0.50)');
    ctx.fillStyle = sunGrad;
    if (typeof ctx.fillRect === 'function') {
      ctx.fillRect(x, y, w, h);
    }
    ctx.restore();
  }

  // 4. Amber shadow and midtone warmth ('multiply' blend mode warms highlights and infuses shadows with sunset glow)
  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillStyle = 'rgba(255, 195, 110, 0.30)';
  if (typeof ctx.fillRect === 'function') {
    ctx.fillRect(x, y, w, h);
  }
  ctx.restore();

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
 * Renders the full-bleed darkened background photo base.
 * Matches the foreground primary photo with lower exposure, dark overlay, and warm vignette.
 * Supports legacy signature (ctx, cw, ch) or (ctx, photo, cw, ch).
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement|object|number} [photoOrCw=736]
 * @param {number} [maybeCw=736]
 * @param {number} [maybeCh=1308]
 */
export function renderDarkBotanicalBase(ctx, photoOrCw = 736, maybeCw = 736, maybeCh = 1308) {
  if (!ctx) return;
  let photo = null;
  let cw = 736;
  let ch = 1308;

  if (typeof photoOrCw === 'number') {
    cw = photoOrCw;
    ch = typeof maybeCw === 'number' ? maybeCw : 1308;
  } else {
    photo = photoOrCw;
    if (typeof maybeCw === 'number') cw = maybeCw;
    if (typeof maybeCh === 'number') ch = maybeCh;
  }

  ctx.save();

  // 1. Dark solid base fallback
  ctx.fillStyle = '#080504';
  if (typeof ctx.fillRect === 'function') {
    ctx.fillRect(0, 0, cw, ch);
  }

  // 2. Full-bleed background photo rendered with darkened exposure
  if (photo) {
    const nw = photo.naturalWidth || photo.width || cw;
    const nh = photo.naturalHeight || photo.height || ch;
    const scale = Math.max(cw / nw, ch / nh);
    const sw = nw * scale;
    const sh = nh * scale;
    const sx = (cw - sw) / 2;
    const sy = (ch - sh) / 2;

    const prevFilter = ctx.filter;
    try {
      ctx.filter = 'brightness(32%) contrast(120%) sepia(50%) saturate(140%)';
    } catch {
      // Filter unsupported fallback
    }

    try {
      ctx.drawImage(photo, sx, sy, sw, sh);
    } catch {
      // Mock environment fallback
    }

    try {
      ctx.filter = prevFilter || 'none';
    } catch {}

    // 3. Darkened warm overlay for high contrast against foreground collage slots
    if (typeof ctx.fillRect === 'function') {
      ctx.fillStyle = 'rgba(8, 4, 3, 0.58)';
      ctx.fillRect(0, 0, cw, ch);
    }

    // 4. Subtle sunset edge vignette
    if (typeof ctx.createRadialGradient === 'function') {
      const vignette = ctx.createRadialGradient(cw / 2, ch / 2, cw * 0.3, cw / 2, ch / 2, cw * 0.85);
      vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vignette.addColorStop(1, 'rgba(0, 0, 0, 0.65)');
      ctx.fillStyle = vignette;
      if (typeof ctx.fillRect === 'function') {
        ctx.fillRect(0, 0, cw, ch);
      }
    }
  }

  ctx.restore();
}
