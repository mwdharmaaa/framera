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

  // The entire right half of the canvas / image frame with feathered center transition
  const startY = Math.round(bounds.drawY);
  const height = Math.round(bounds.drawH);
  const centerTransitionX = Math.round(bounds.drawX + bounds.drawW * 0.44);
  const featherWidth = Math.round(bounds.drawW * 0.20);
  const featherStart = Math.max(bounds.drawX, centerTransitionX - Math.round(featherWidth * 0.45));
  const featherEnd = centerTransitionX + Math.round(featherWidth * 0.55);
  const smearAreaW = Math.max(10, bounds.drawX + bounds.drawW - featherStart);

  const canvasWidth = ctx.canvas?.width || (bounds.drawX + bounds.drawW);
  const canvasHeight = ctx.canvas?.height || (bounds.drawY + bounds.drawH);

  // 1. Prepare offscreen layer for smooth feather mask composite
  let smearCanvas = null;
  let sCtx = null;
  if (typeof document !== 'undefined' && typeof document.createElement === 'function') {
    try {
      smearCanvas = document.createElement('canvas');
      smearCanvas.width = canvasWidth;
      smearCanvas.height = canvasHeight;
      sCtx = smearCanvas.getContext('2d');
    } catch {
      sCtx = null;
    }
  }

  const targetCtx = sCtx || ctx;
  targetCtx.save();

  if (targetCtx.filter !== undefined) {
    targetCtx.filter = 'grayscale(100%) contrast(155%) brightness(92%)';
  }

  targetCtx.beginPath();
  targetCtx.rect(featherStart, startY, smearAreaW, height);
  targetCtx.clip();

  // 2. Slit-Scan Horizontal Pixel Stretch (Produces authentic dragging trails from the transition edge)
  const imgW = photoImg.naturalWidth || photoImg.width || bounds.drawW;
  const imgH = photoImg.naturalHeight || photoImg.height || bounds.drawH;
  const scaleX = imgW / bounds.drawW;

  const slitPoints = [0, 8, 18, 30, 46, 65, 90, 120];
  slitPoints.forEach((slitXOffset, idx) => {
    const sampleCanvasX = featherStart + slitXOffset;
    const srcX = Math.max(0, Math.min(imgW - 2, Math.round((sampleCanvasX - bounds.drawX) * scaleX)));
    const srcW = Math.max(1, Math.round(2 * scaleX));
    const dstX = sampleCanvasX;
    const dstW = Math.max(10, bounds.drawX + bounds.drawW - dstX);

    targetCtx.globalAlpha = 0.18 / (1 + idx * 0.2);
    try {
      targetCtx.drawImage(
        photoImg,
        srcX, 0, srcW, imgH,
        dstX, bounds.drawY, dstW, bounds.drawH
      );
    } catch {
      // Fallback for mock tests
    }
  });

  // 3. Multi-Pass Progressive Horizontal Motion Blur Drag
  const passes = 32;
  for (let i = 1; i <= passes; i++) {
    const factor = i / passes;
    const offset = factor * (smearAreaW * 0.95);
    const alpha = 0.15 * Math.pow(1.0 - factor * 0.6, 0.85);

    targetCtx.globalAlpha = Math.max(0.015, alpha);
    try {
      targetCtx.drawImage(photoImg, bounds.drawX + offset, bounds.drawY, bounds.drawW, bounds.drawH);
    } catch {
      // Fallback for mock tests
    }
  }

  // 4. Dense High-Frequency Horizontal Speed Streaks spanning the entire height
  const streakCount = Math.floor(height / 14);
  for (let s = 0; s < streakCount; s++) {
    const streakY = startY + s * 14 + (s % 3) * 2;
    const streakH = 2 + (s % 5) * 2;
    const streakX = featherStart + (s % 7) * 8;
    const streakW = Math.max(10, bounds.drawX + bounds.drawW - streakX);

    const relY = (streakY - startY) / height;
    const focalWeight = 1.0 - Math.min(1, Math.abs(relY - 0.42) * 1.5);
    const streakAlpha = 0.05 + focalWeight * 0.12;

    targetCtx.save();
    targetCtx.beginPath();
    targetCtx.rect(streakX, streakY, streakW, streakH);
    targetCtx.clip();
    targetCtx.globalAlpha = streakAlpha;
    const shiftX = 25 + ((s * 53) % Math.round(smearAreaW * 0.7));
    try {
      targetCtx.drawImage(photoImg, bounds.drawX + shiftX, bounds.drawY, bounds.drawW, bounds.drawH);
    } catch {
      // Fallback for mock tests
    }
    targetCtx.restore();
  }

  // 5. Fine horizontal shutter speed scanlines
  targetCtx.fillStyle = '#00f0ff';
  targetCtx.globalAlpha = 0.06;
  for (let y = startY; y < startY + height; y += 4) {
    targetCtx.fillRect(featherStart, y, smearAreaW, 1);
  }

  // 6. Highlights and reflection trails
  targetCtx.fillStyle = 'rgba(0, 240, 255, 0.14)';
  const highlightPoints = [0.18, 0.28, 0.33, 0.37, 0.42, 0.47, 0.53, 0.62, 0.74, 0.85];
  highlightPoints.forEach((pos) => {
    const y = startY + Math.round(height * pos);
    const h = 2 + Math.round((pos * 10) % 3);
    targetCtx.fillRect(featherStart + 15, y, smearAreaW - 15, h);
  });

  targetCtx.restore();

  // 7. Apply feathered gradient mask so the center boundary dissolves organically
  if (sCtx && smearCanvas && typeof sCtx.createLinearGradient === 'function') {
    sCtx.save();
    if (sCtx.globalCompositeOperation !== undefined) {
      sCtx.globalCompositeOperation = 'destination-in';
    }
    const maskGrad = sCtx.createLinearGradient(featherStart, 0, featherEnd, 0);
    maskGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    maskGrad.addColorStop(0.25, 'rgba(0, 0, 0, 0.12)');
    maskGrad.addColorStop(0.6, 'rgba(0, 0, 0, 0.65)');
    maskGrad.addColorStop(0.85, 'rgba(0, 0, 0, 0.92)');
    maskGrad.addColorStop(1, 'rgba(0, 0, 0, 1.0)');

    sCtx.fillStyle = maskGrad;
    sCtx.fillRect(0, 0, canvasWidth, canvasHeight);
    sCtx.restore();

    ctx.save();
    try {
      ctx.drawImage(smearCanvas, 0, 0);
    } catch {
      // Fallback for mock environments
    }
    ctx.restore();
  }
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
