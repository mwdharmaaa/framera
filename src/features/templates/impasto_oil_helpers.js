let ridgesImg = null;

/**
 * Returns cached Image instance for the authentic physical impasto knife ridges texture.
 * @returns {HTMLImageElement|null}
 */
export function getImpastoRidgesImage() {
  if (ridgesImg) return ridgesImg;
  if (typeof Image !== 'undefined') {
    ridgesImg = new Image();
    ridgesImg.src = 'assets/impasto_ridges.png?v=2';
  }
  return ridgesImg;
}

/**
 * Resets cached texture image for unit testing environments.
 */
export function resetImpastoRidgesImage() {
  ridgesImg = null;
}

/**
 * Renders dark gesso base primer on canvas.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cw
 * @param {number} ch
 */
export function renderOilCanvasPrimer(ctx, cw = 555, ch = 1200) {
  if (!ctx) return;
  ctx.fillStyle = '#0a0b0e';
  if (typeof ctx.fillRect === 'function') {
    ctx.fillRect(0, 0, cw, ch);
  }
}

/**
 * Renders user photo with painterly vibrance, oil pigment saturation, and contrast.
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement|object} img
 * @param {object} bounds
 * @param {number} cw
 * @param {number} ch
 */
export function renderImpastoPhoto(ctx, img, bounds, cw = 555, ch = 1200) {
  if (!ctx || !img) return;

  const drawX = typeof bounds?.drawX === 'number' ? bounds.drawX : 0;
  const drawY = typeof bounds?.drawY === 'number' ? bounds.drawY : 0;
  const drawW = typeof bounds?.drawW === 'number' ? bounds.drawW : cw;
  const drawH = typeof bounds?.drawH === 'number' ? bounds.drawH : ch;

  ctx.save();
  if ('filter' in ctx) {
    ctx.filter = 'contrast(1.18) saturate(1.28) brightness(0.97)';
  }

  try {
    // Directional paint strokes: subtle sub-pixel offset drag for physical paint body
    ctx.globalAlpha = 0.35;
    ctx.drawImage(img, drawX - 1.5, drawY - 1.5, drawW, drawH);
    ctx.drawImage(img, drawX + 1.5, drawY + 1.5, drawW, drawH);

    // Primary photo pigment layer
    ctx.globalAlpha = 1.0;
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  } catch {
    // Fallback for mock unit test environments
  }
  ctx.restore();
}

/**
 * Applies multi-pass 3D impasto knife ridges and glazed oil sheen over the photo.
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement} texture
 * @param {number} cw
 * @param {number} ch
 */
export function renderImpastoReliefPass(ctx, texture, cw = 555, ch = 1200) {
  if (!ctx || !texture) return;
  ctx.save();

  // Pass 1: Primary 3D palette-knife relief highlights and grooves
  ctx.globalCompositeOperation = 'overlay';
  ctx.globalAlpha = 0.94;
  try {
    ctx.drawImage(texture, 0, 0, cw, ch);
  } catch {
    // Fallback for mock unit test environments
  }

  // Pass 2: Glazed oil paint sheen and buttery body depth
  ctx.globalCompositeOperation = 'soft-light';
  ctx.globalAlpha = 0.78;
  try {
    ctx.drawImage(texture, 0, 0, cw, ch);
  } catch {
    // Fallback for mock unit test environments
  }

  // Pass 3: Specular varnish glaze glints on palette-knife peaks
  ctx.globalCompositeOperation = 'color-dodge';
  ctx.globalAlpha = 0.28;
  try {
    ctx.drawImage(texture, 0, 0, cw, ch);
  } catch {
    // Fallback for mock unit test environments
  }

  ctx.restore();
}

/**
 * Renders optional handwritten oil signature and catalog date stamp when specified.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cw
 * @param {number} ch
 * @param {object} state
 */
export function drawAtelierDetails(ctx, cw = 555, ch = 1200, state = {}) {
  if (!ctx) return;
  ctx.save();

  // 1. Artist signature in corner (only when custom caption is provided)
  if (state.caption && state.caption.trim()) {
    ctx.font = 'italic 20px "Great Vibes", cursive, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.78)';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 4;
    ctx.fillText(state.caption.trim(), cw - 28, ch - 24);
  }

  // 2. Catalog date / edition stamp (only when custom date is provided)
  if (state.date && state.date.trim()) {
    ctx.font = '400 10px "Space Mono", monospace, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.shadowBlur = 0;
    ctx.fillText(state.date.toUpperCase(), cw - 28, ch - 10);
  }

  ctx.restore();
}
