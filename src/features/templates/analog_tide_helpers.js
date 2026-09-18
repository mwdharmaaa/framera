import { calculateImageBounds } from '../../core/canvas/bounds.js';

/**
 * Geometric layout definitions for the Analog Tide template.
 * Features full-bleed background with an offset vertical color cutout portal on the right.
 */
export const ANALOG_TIDE_LAYOUT = {
  backgroundFrame: { x: 0, y: 0, w: 1200, h: 1600 },
  insetFrame: { x: 468, y: 440, w: 650, h: 1005 }
};

/** Deterministic pseudo-random seed values for realistic vintage film dust & scratches. */
const FILM_DUST_SPECKS = [
  [80, 140, 1.2, 0.4], [160, 310, 0.8, 0.3], [240, 520, 1.5, 0.5], [310, 890, 1.0, 0.35],
  [120, 980, 1.4, 0.45], [420, 260, 0.9, 0.3], [190, 740, 1.1, 0.4], [350, 410, 0.7, 0.25],
  [95, 1220, 1.3, 0.4], [280, 1380, 1.6, 0.5], [410, 1490, 0.8, 0.3], [150, 1530, 1.2, 0.35],
  [510, 180, 1.0, 0.3], [680, 120, 1.3, 0.4], [820, 210, 0.9, 0.35], [960, 320, 1.4, 0.45],
  [1080, 190, 1.1, 0.3], [1140, 380, 1.5, 0.5], [740, 360, 0.8, 0.25], [890, 140, 1.2, 0.4]
];

const FILM_SCRATCHES = [
  [140, 420, 18, 26], [290, 710, -12, 34], [90, 1100, 22, 18],
  [410, 180, -15, 28], [1020, 240, 14, 22], [220, 1340, -18, 30]
];

/**
 * Renders the background photo in high-contrast monochrome with analog film dust.
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement|object} photo
 * @param {{ x: number, y: number, w: number, h: number }} frame
 * @param {object} options
 */
export function renderMonochromeFilmBackground(ctx, photo, frame, options = {}) {
  if (!photo || !ctx) return;

  const pw = photo.naturalWidth || photo.width || frame.w;
  const ph = photo.naturalHeight || photo.height || frame.h;
  const bounds = calculateImageBounds(pw, ph, frame, options);

  ctx.save();
  if (ctx.filter !== undefined) {
    ctx.filter = 'grayscale(100%) contrast(135%) brightness(95%)';
  }

  try {
    ctx.drawImage(photo, bounds.drawX, bounds.drawY, bounds.drawW, bounds.drawH);
  } catch {
    // Fallback for mock unit test environments
  }

  if (ctx.filter !== undefined) ctx.filter = 'none';

  // Render vintage analog film dust specks
  ctx.fillStyle = '#ffffff';
  FILM_DUST_SPECKS.forEach(([x, y, r, a]) => {
    ctx.globalAlpha = a;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  });

  // Render subtle fine film hairline scratches
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1;
  FILM_SCRATCHES.forEach(([x, y, dx, dy]) => {
    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + dx, y + dy);
    ctx.stroke();
  });

  ctx.restore();
}

/**
 * Renders the offset color inset card portal with razor-sharp edges.
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement|object} photo
 * @param {{ x: number, y: number, w: number, h: number }} frame
 * @param {object} options
 */
export function renderColorInsetCard(ctx, photo, frame, options = {}) {
  if (!photo || !ctx) return;

  const pw = photo.naturalWidth || photo.width || frame.w;
  const ph = photo.naturalHeight || photo.height || frame.h;
  const bounds = calculateImageBounds(pw, ph, frame, options);

  ctx.save();
  ctx.beginPath();
  ctx.rect(frame.x, frame.y, frame.w, frame.h);
  ctx.clip();

  try {
    ctx.drawImage(photo, bounds.drawX, bounds.drawY, bounds.drawW, bounds.drawH);
  } catch {
    // Fallback for mock unit test environments
  }

  ctx.restore();
}

/**
 * Renders editorial typography annotations when customized by user.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cw
 * @param {number} ch
 * @param {object} state
 */
export function drawAnalogTideAnnotations(ctx, cw, ch, state = {}) {
  const isDefaultCaption = !state.caption || state.caption === 'ANALOG TIDE';
  const isDefaultSubtitle = !state.subtitle || state.subtitle === 'SURGE OF SOLITUDE';
  const isDefaultDate = !state.date || state.date === '35MM // ARCHIVE 2026';

  if (isDefaultCaption && isDefaultSubtitle && isDefaultDate) {
    return;
  }

  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 8;

  if (state.caption) {
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 24px "Space Mono", monospace, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(state.caption.toUpperCase(), 70, 1515);
  }

  if (state.subtitle) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = '400 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(state.subtitle, 70, 1545);
  }

  if (state.date) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '500 13px "Space Mono", monospace, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(state.date.toUpperCase(), cw - 70, 1515);
  }

  ctx.restore();
}
