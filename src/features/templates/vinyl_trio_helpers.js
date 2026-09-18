let overlayImg = null;

/**
 * Returns cached Image instance for the authentic Vinyl Polaroid Trio overlay.
 * @returns {HTMLImageElement|null}
 */
export function getVinylTrioOverlayImage() {
  if (overlayImg) return overlayImg;
  if (typeof Image !== 'undefined') {
    overlayImg = new Image();
    overlayImg.src = 'assets/vinyl_trio_overlay.png?v=2';
  }
  return overlayImg;
}

/**
 * Resets cached overlay image for unit testing environments.
 */
export function resetVinylTrioOverlayImage() {
  overlayImg = null;
}

/**
 * Spatial configurations for the 3 cascading Polaroid frames in 1200x1600 canvas space.
 */
export const POLAROID_SLOTS = [
  { id: 0, cx: 441, cy: 253, w: 340, h: 345, angle: -0.2339, labelY: 220 },
  { id: 1, cx: 647, cy: 681, w: 325, h: 332, angle: 0.3342, labelY: 225 },
  { id: 2, cx: 469, cy: 1149, w: 340, h: 348, angle: -0.2199, labelY: 220 }
];

/**
 * Renders and clips a photo into a tilted polaroid window.
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement|null} img
 * @param {object} slot
 */
export function renderPolaroidPhoto(ctx, img, slot) {
  if (!img) return;
  ctx.save();
  ctx.translate(slot.cx, slot.cy);
  ctx.rotate(slot.angle);

  // Square clipping window matching inner polaroid border
  const hw = slot.w / 2;
  const hh = slot.h / 2;
  ctx.beginPath();
  ctx.rect(-hw, -hh, slot.w, slot.h);
  ctx.clip();

  const iw = img.naturalWidth || img.width || slot.w;
  const ih = img.naturalHeight || img.height || slot.h;
  const scale = Math.max(slot.w / iw, slot.h / ih);
  const dw = iw * scale;
  const dh = ih * scale;

  try {
    ctx.drawImage(img, -dw / 2, -dh / 2, dw, dh);
  } catch {
    // Graceful fallback for mock tests
  }
  ctx.restore();
}

/**
 * Draws sharp handwritten marker annotations on the bottom polaroid chins.
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} text
 * @param {number} cx
 * @param {number} cy
 * @param {number} angle
 * @param {number} offsetY
 */
export function drawPolaroidMarkerText(ctx, text, cx, cy, angle, offsetY = 185) {
  if (!text) return;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.font = '600 20px "Space Mono", monospace, sans-serif';
  ctx.letterSpacing = '1px';
  ctx.fillStyle = 'rgba(25, 25, 30, 0.85)';
  ctx.textAlign = 'center';
  ctx.fillText(text, 0, offsetY);
  ctx.restore();
}

/**
 * Renders the middle polaroid photo as an atmospheric blurred backdrop covering the canvas.
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement|null} photo
 * @param {number} cw
 * @param {number} ch
 */
export function renderVinylTrioBackground(ctx, photo, cw, ch) {
  if (!photo) {
    ctx.fillStyle = '#ffffff';
    if (typeof ctx.fillRect === 'function') ctx.fillRect(0, 0, cw, ch);
    return;
  }

  const pw = photo.naturalWidth || photo.width || cw;
  const ph = photo.naturalHeight || photo.height || ch;
  const scale = Math.max(cw / pw, ch / ph);
  const dw = pw * scale;
  const dh = ph * scale;
  const dx = (cw - dw) / 2;
  const dy = (ch - dh) / 2;

  ctx.save();
  if (ctx.filter !== undefined) {
    ctx.filter = 'blur(10px) brightness(85%) contrast(105%)';
  }
  try {
    ctx.drawImage(photo, dx, dy, dw, dh);
  } catch {
    // Graceful fallback for mock test environments
  }
  if (ctx.filter !== undefined) ctx.filter = 'none';

  // Subtle atmospheric overlay for depth and contrast
  ctx.fillStyle = 'rgba(12, 14, 20, 0.2)';
  if (typeof ctx.fillRect === 'function') ctx.fillRect(0, 0, cw, ch);
  ctx.restore();
}

