/**
 * Helper routines for Cyan Motion Smear editorial template.
 * Features electric cyan duotone grading, horizontal motion smear trails, and film grain.
 */

/**
 * Draws directional horizontal motion smear trails across the focal portrait region.
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement|null} photoImg
 * @param {{ drawX: number, drawY: number, drawW: number, drawH: number }} bounds
 * @param {object} [config]
 */
export function drawHorizontalMotionSmear(ctx, photoImg, bounds, config = {}) {
  if (!photoImg) return;

  const startY = Math.round(bounds.drawY + bounds.drawH * 0.22);
  const height = Math.round(bounds.drawH * 0.48);
  const startX = Math.round(bounds.drawX + bounds.drawW * 0.38);
  const width = Math.round(bounds.drawW * 0.62);

  ctx.save();
  ctx.beginPath();
  ctx.rect(startX, startY, width, height);
  ctx.clip();

  // Multi-pass directional horizontal motion smear trails
  const passes = 28;
  for (let i = 1; i <= passes; i++) {
    const factor = i / passes;
    const offset = factor * (width * 0.85);
    const alpha = 0.12 * Math.pow(1.0 - factor, 0.7);

    ctx.globalAlpha = Math.max(0.01, alpha);
    try {
      ctx.drawImage(photoImg, bounds.drawX + offset, bounds.drawY, bounds.drawW, bounds.drawH);
    } catch {
      // Fallback for mock tests
    }
  }

  // Intense focal motion streak accents
  ctx.globalAlpha = 0.09;
  for (let s = 0; s < 6; s++) {
    const streakY = startY + (height * 0.2) + (s * 30);
    const streakH = 12 + (s % 3) * 6;
    ctx.save();
    ctx.beginPath();
    ctx.rect(startX, streakY, width, streakH);
    ctx.clip();
    try {
      ctx.drawImage(photoImg, bounds.drawX + 80, bounds.drawY, bounds.drawW + 120, bounds.drawH);
    } catch {
      // Fallback for mock tests
    }
    ctx.restore();
  }

  ctx.restore();
}

/**
 * Applies electric cyan and deep cobalt duotone color grading.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cw
 * @param {number} ch
 */
export function applyCyanDuotoneGrading(ctx, cw, ch) {
  ctx.save();

  // 1. Deep cobalt multiply pass to establish deep shadows
  if (ctx.globalCompositeOperation !== undefined) {
    ctx.globalCompositeOperation = 'multiply';
  }
  ctx.fillStyle = '#003566';
  ctx.fillRect(0, 0, cw, ch);

  // 2. Vibrant electric cyan screen pass for highlights
  if (ctx.globalCompositeOperation !== undefined) {
    ctx.globalCompositeOperation = 'screen';
  }
  ctx.fillStyle = 'rgba(0, 180, 216, 0.45)';
  ctx.fillRect(0, 0, cw, ch);

  ctx.restore();
}

/**
 * Renders aesthetic editorial typography overlays on the canvas.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cw
 * @param {number} ch
 * @param {object} state
 */
export function drawCyanMotionTypography(ctx, cw, ch, state = {}) {
  const isDefaultCaption = !state.caption || state.caption === 'CYAN ECHO';
  const isDefaultSubtitle = !state.subtitle || state.subtitle === 'DIRECTIONAL VELOCITY';
  const isDefaultDate = !state.date || state.date === '1/500s // ISO 800 // F/1.4';

  if (!isDefaultCaption || !isDefaultSubtitle || !isDefaultDate) {
    ctx.save();
    ctx.textAlign = 'left';

    if (state.caption) {
      ctx.fillStyle = '#00f0ff';
      ctx.font = '700 28px "Space Mono", monospace, sans-serif';
      ctx.letterSpacing = '6px';
      ctx.fillText(state.caption.toUpperCase(), 70, 1470);
      ctx.letterSpacing = '0px';
    }

    if (state.subtitle) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.font = '400 16px "Space Mono", monospace, sans-serif';
      ctx.fillText(state.subtitle, 70, 1510);
    }

    if (state.date) {
      ctx.fillStyle = '#00b4d8';
      ctx.font = '700 13px "Space Mono", monospace, sans-serif';
      ctx.letterSpacing = '2px';
      ctx.fillText(state.date, 70, 1545);
      ctx.letterSpacing = '0px';
    }

    ctx.restore();
  }
}
