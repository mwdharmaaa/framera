let overlayImg = null;

/**
 * Returns cached Image instance for the authentic Ocean Vinyl Turntable overlay.
 * @returns {HTMLImageElement|null}
 */
export function getOceanVinylOverlayImage() {
  if (overlayImg) return overlayImg;
  if (typeof Image !== 'undefined') {
    overlayImg = new Image();
    overlayImg.src = 'assets/ocean_vinyl_overlay.png?v=1';
  }
  return overlayImg;
}

/**
 * Resets cached overlay image for unit testing environments.
 */
export function resetOceanVinylOverlayImage() {
  overlayImg = null;
}

/**
 * Spatial configurations for the 3 cascading Polaroid frames in 1200x1600 canvas space.
 */
export const OCEAN_POLAROID_SLOTS = [
  { id: 0, cx: 646, cy: 205, w: 316, h: 388, angle: 0.0704, labelY: 220 },
  { id: 1, cx: 653, cy: 763, w: 332, h: 316, angle: -0.2535, labelY: 215 },
  { id: 2, cx: 647, cy: 1285, w: 388, h: 322, angle: 0.1405, labelY: 220 }
];

/**
 * Renders and clips a photo into a tilted polaroid window.
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement|object} photo
 * @param {object} slot
 */
export function renderOceanPolaroidPhoto(ctx, photo, slot) {
  if (!photo || !ctx) return;
  ctx.save();
  ctx.translate(slot.cx, slot.cy);
  ctx.rotate(slot.angle);

  const hw = slot.w / 2;
  const hh = slot.h / 2;
  ctx.beginPath();
  ctx.rect(-hw, -hh, slot.w, slot.h);
  ctx.clip();

  const iw = photo.naturalWidth || photo.width || slot.w;
  const ih = photo.naturalHeight || photo.height || slot.h;
  const scale = Math.max(slot.w / iw, slot.h / ih);
  const dw = iw * scale;
  const dh = ih * scale;

  try {
    ctx.drawImage(photo, -dw / 2, -dh / 2, dw, dh);
  } catch {
    // Fallback for mock unit test environments
  }
  ctx.restore();
}

/**
 * Renders neutral studio desk surface base.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cw
 * @param {number} ch
 */
export function renderOceanVinylBackground(ctx, cw = 1200, ch = 1600) {
  if (!ctx) return;
  ctx.fillStyle = '#dedacf';
  if (typeof ctx.fillRect === 'function') {
    ctx.fillRect(0, 0, cw, ch);
  }
}

/**
 * Renders editorial typography annotations on the right margin when customized.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cw
 * @param {number} ch
 * @param {object} state
 */
export function drawOceanVinylTypography(ctx, cw, ch, state = {}) {
  const isDefaultCaption = !state.caption || state.caption === 'AQUA GROOVE';
  const isDefaultSubtitle = !state.subtitle || state.subtitle === 'TURNTABLE // VOL. 04';
  const isDefaultDate = !state.date || state.date === '33 RPM // ARCHIVE 2026';

  if (isDefaultCaption && isDefaultSubtitle && isDefaultDate) {
    return;
  }

  ctx.save();
  ctx.textAlign = 'right';

  if (state.caption) {
    ctx.fillStyle = '#1e3a47';
    ctx.font = '700 22px "Space Mono", monospace, sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillText(state.caption.toUpperCase(), cw - 40, 780);
    ctx.letterSpacing = '0px';
  }

  if (state.subtitle) {
    ctx.fillStyle = '#486574';
    ctx.font = '500 14px "Space Mono", monospace, sans-serif';
    ctx.fillText(state.subtitle, cw - 40, 815);
  }

  if (state.date) {
    ctx.fillStyle = '#6a828e';
    ctx.font = '400 12px "Space Mono", monospace, sans-serif';
    ctx.fillText(state.date.toUpperCase(), cw - 40, 845);
  }

  ctx.restore();
}
