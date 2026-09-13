/**
 * Clamps a numerical value between a min and max threshold.
 * @param {number} val
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

/**
 * Calculates transformed source and destination bounds for image rendering.
 * @param {number} imgW
 * @param {number} imgH
 * @param {{ x: number, y: number, w: number, h: number }} frame
 * @param {{ zoom?: number, panX?: number, panY?: number, fitMode?: 'cover'|'contain' }} [options={}]
 * @returns {{ drawX: number, drawY: number, drawW: number, drawH: number }}
 */
export function calculateImageBounds(imgW, imgH, frame, options = {}) {
  const { x, y, w, h } = frame;
  if (imgW <= 0 || imgH <= 0 || w <= 0 || h <= 0) {
    return { drawX: x, drawY: y, drawW: w, drawH: h };
  }

  const zoom = clamp(options.zoom || 1, 0.5, 3);
  const panX = options.panX || 0;
  const panY = options.panY || 0;
  const fitMode = options.fitMode || 'cover';

  const imgRatio = imgW / imgH;
  const frameRatio = w / h;

  let baseW, baseH;

  if (fitMode === 'cover') {
    if (imgRatio > frameRatio) {
      baseH = h;
      baseW = h * imgRatio;
    } else {
      baseW = w;
      baseH = w / imgRatio;
    }
  } else {
    // contain mode
    if (imgRatio > frameRatio) {
      baseW = w;
      baseH = w / imgRatio;
    } else {
      baseH = h;
      baseW = h * imgRatio;
    }
  }

  const finalW = baseW * zoom;
  const finalH = baseH * zoom;

  const centerX = x + (w - finalW) / 2;
  const centerY = y + (h - finalH) / 2;

  return {
    drawX: Math.round(centerX + panX),
    drawY: Math.round(centerY + panY),
    drawW: Math.round(finalW),
    drawH: Math.round(finalH)
  };
}
