let overlayImg = null;

/**
 * Returns cached Image instance for the Locker Playlist collage overlay.
 * @returns {HTMLImageElement|null}
 */
export function getLockerPlaylistOverlayImage() {
  if (overlayImg) return overlayImg;
  if (typeof Image !== 'undefined') {
    overlayImg = new Image();
    overlayImg.src = 'assets/locker_playlist_overlay.png?v=1';
  }
  return overlayImg;
}

/**
 * Resets cached overlay image for unit testing environments.
 */
export function resetLockerPlaylistOverlayImage() {
  overlayImg = null;
}

/**
 * Exact spatial coordinates and rotation angles for the 3 landscape polaroids
 * inside the native 736x1308 high school locker canvas.
 */
export const LOCKER_POLAROID_SLOTS = [
  { id: 0, cx: 347.2, cy: 390.2, w: 322, h: 242, angle: -0.0997 },
  { id: 1, cx: 347.3, cy: 652.6, w: 316, h: 238, angle: -0.0051 },
  { id: 2, cx: 346.7, cy: 916.1, w: 318, h: 240, angle: -0.0503 }
];

/**
 * Renders and clips a user photo inside a rotated polaroid slot.
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement|object} photo
 * @param {object} slot
 */
export function renderLockerPolaroidPhoto(ctx, photo, slot) {
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
 * Renders base navy locker background fill.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cw
 * @param {number} ch
 */
export function renderLockerChassisBackground(ctx, cw = 736, ch = 1308) {
  if (!ctx) return;
  ctx.fillStyle = '#1b3a5c';
  if (typeof ctx.fillRect === 'function') {
    ctx.fillRect(0, 0, cw, ch);
  }
}

/**
 * Dynamically draws customized song title and artist over the bottom audio player widget.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cw
 * @param {number} ch
 * @param {object} state
 */
export function drawLockerPlayerTypography(ctx, cw, ch, state = {}) {
  const isDefaultCaption = !state.caption || state.caption === 'seasons';
  const isDefaultSubtitle = !state.subtitle || state.subtitle === 'wave to earth';

  if (isDefaultCaption && isDefaultSubtitle) {
    return;
  }

  const widgetCx = Math.round(cw / 2);

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (state.caption && state.caption !== 'seasons') {
    // Clear existing song title area
    ctx.fillStyle = '#1b4165';
    ctx.fillRect(widgetCx - 140, 1094, 280, 20);

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 15px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.fillText(state.caption, widgetCx, 1104);
  }

  if (state.subtitle && state.subtitle !== 'wave to earth') {
    // Clear existing artist name area
    ctx.fillStyle = '#1b4165';
    ctx.fillRect(widgetCx - 140, 1120, 280, 18);

    ctx.fillStyle = '#8faec7';
    ctx.font = '500 12px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillText(state.subtitle, widgetCx, 1129);
  }

  ctx.restore();
}
