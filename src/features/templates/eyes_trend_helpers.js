let overlayImg = null;

/**
 * Returns cached Image instance for the authentic Eyes Trend overlay.
 * @returns {HTMLImageElement|null}
 */
export function getEyesTrendOverlayImage() {
  if (overlayImg) return overlayImg;
  if (typeof Image !== 'undefined') {
    overlayImg = new Image();
    overlayImg.src = 'assets/eyes_trend_overlay.png';
  }
  return overlayImg;
}

/**
 * Resets cached overlay image (useful for testing environments).
 */
export function resetEyesTrendOverlayImage() {
  overlayImg = null;
}

/**
 * Draws a stylized 5-pointed doodle star with a center spiral.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cx
 * @param {number} cy
 * @param {number} r
 * @param {string} color
 */
export function drawDoodleStar(ctx, cx, cy, r = 24, color = '#22c55e') {
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const outerAngle = (i * 72 - 90) * (Math.PI / 180);
    const innerAngle = ((i * 72 + 36) - 90) * (Math.PI / 180);
    const ox = cx + Math.cos(outerAngle) * r;
    const oy = cy + Math.sin(outerAngle) * r;
    const ix = cx + Math.cos(innerAngle) * (r * 0.45);
    const iy = cy + Math.sin(innerAngle) * (r * 0.45);
    if (i === 0) ctx.moveTo(ox, oy);
    else ctx.lineTo(ox, oy);
    ctx.lineTo(ix, iy);
  }
  ctx.closePath();
  ctx.fill();

  // Spiral center
  ctx.strokeStyle = '#0a0a0c';
  ctx.lineWidth = 2;
  ctx.beginPath();
  let a = 0;
  for (let step = 0; step < 24; step++) {
    a += 0.35;
    const rad = (r * 0.28) * (step / 24);
    const sx = cx + Math.cos(a) * rad;
    const sy = cy + Math.sin(a) * rad;
    if (step === 0) ctx.moveTo(sx, sy);
    else ctx.lineTo(sx, sy);
  }
  ctx.stroke();
  ctx.restore();
}

/**
 * Draws a 4-pointed sparkle glint with white core.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cx
 * @param {number} cy
 * @param {number} size
 * @param {string} color
 */
export function drawSparkleGlint(ctx, cx, cy, size = 14, color = '#ffffff') {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx, cy - size);
  ctx.quadraticCurveTo(cx, cy, cx + size, cy);
  ctx.quadraticCurveTo(cx, cy, cx, cy + size);
  ctx.quadraticCurveTo(cx, cy, cx - size, cy);
  ctx.quadraticCurveTo(cx, cy, cx, cy - size);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/**
 * Draws subtle emerald green atmosphere across the eye slit.
 * @param {CanvasRenderingContext2D} ctx
 * @param {{x: number, y: number, w: number, h: number}} frame
 * @param {number} alpha
 */
export function drawEmeraldAura(ctx, frame, alpha = 0.12) {
  ctx.save();
  ctx.fillStyle = `rgba(34, 197, 94, ${alpha})`;
  if (ctx.globalCompositeOperation !== undefined) {
    ctx.globalCompositeOperation = 'screen';
  }
  ctx.fillRect(frame.x, frame.y, frame.w, frame.h);
  ctx.restore();
}

/**
 * Renders aesthetic typography branding when customized.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cw
 * @param {number} ch
 * @param {object} state
 */
export function drawEyesTrendTypography(ctx, cw, ch, state = {}) {
  const isDefaultCaption = !state.caption || state.caption === 'EYES TREND';
  const isDefaultSubtitle = !state.subtitle || state.subtitle === 'VIRAL DOODLE EDITION';
  const isDefaultDate = !state.date || state.date === '2026 // VOL.01';

  if (!isDefaultCaption || !isDefaultSubtitle || !isDefaultDate) {
    ctx.save();
    ctx.textAlign = 'center';

    if (!isDefaultCaption && state.caption) {
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 24px "Space Mono", monospace, sans-serif';
      ctx.letterSpacing = '6px';
      ctx.fillText(state.caption.toUpperCase(), cw / 2, 1420);
      ctx.letterSpacing = '0px';
    }

    if (!isDefaultSubtitle && state.subtitle) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.font = '400 16px "Space Mono", monospace, sans-serif';
      ctx.fillText(state.subtitle, cw / 2, 1460);
    }

    if (!isDefaultDate && state.date) {
      ctx.fillStyle = '#22c55e';
      ctx.font = '700 14px "Space Mono", monospace, sans-serif';
      ctx.letterSpacing = '2px';
      ctx.fillText(state.date, cw / 2, 1500);
      ctx.letterSpacing = '0px';
    }

    ctx.restore();
  }
}
