let defaultBgImg = null;

/**
 * Returns cached Image instance for the authentic ocean ripples background.
 * @returns {HTMLImageElement|null}
 */
export function getOceanStoryBackgroundImage() {
  if (defaultBgImg) return defaultBgImg;
  if (typeof Image !== 'undefined') {
    defaultBgImg = new Image();
    defaultBgImg.src = 'assets/ocean_story_bg.jpg?v=1';
  }
  return defaultBgImg;
}

/**
 * Resets cached background image for test environments.
 */
export function resetOceanStoryBackgroundImage() {
  defaultBgImg = null;
}

/**
 * Card slot definitions matching the 3 landscape photos stacked vertically.
 */
export const STORY_CARD_SLOTS = [
  { id: 0, x: 141, y: 171, w: 463, h: 308 },
  { id: 1, x: 141, y: 505, w: 463, h: 308 },
  { id: 2, x: 141, y: 845, w: 463, h: 308 }
];

/**
 * Renders full-bleed ocean story background.
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement|null} bgPhoto
 * @param {HTMLImageElement|null} defaultBg
 * @param {number} cw
 * @param {number} ch
 */
export function renderStoryBackground(ctx, bgPhoto, defaultBg, cw = 736, ch = 1308) {
  if (!ctx) return;
  ctx.save();

  // Dark sea base
  ctx.fillStyle = '#0a1622';
  if (typeof ctx.fillRect === 'function') {
    ctx.fillRect(0, 0, cw, ch);
  }

  const activeBg = bgPhoto || defaultBg;
  if (activeBg) {
    const nw = activeBg.naturalWidth || activeBg.width || cw;
    const nh = activeBg.naturalHeight || activeBg.height || ch;
    const scale = Math.max(cw / nw, ch / nh);
    const sw = nw * scale;
    const sh = nh * scale;
    const sx = (cw - sw) / 2;
    const sy = (ch - sh) / 2;

    try {
      ctx.drawImage(activeBg, sx, sy, sw, sh);
    } catch {
      // Fallback for mock unit test environments
    }
  }

  ctx.restore();
}

/**
 * Renders a single landscape photo card with clean film cut styling.
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement} photo
 * @param {object} slot
 */
export function renderStoryCard(ctx, photo, slot) {
  if (!ctx || !photo) return;
  const { x, y, w, h } = slot;

  ctx.save();

  // Subtle ambient contact drop shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.32)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 3;

  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();

  // Reset shadow to avoid bleed inside the image
  ctx.shadowColor = 'transparent';

  const nw = photo.naturalWidth || photo.width || w;
  const nh = photo.naturalHeight || photo.height || h;
  const scale = Math.max(w / nw, h / nh);
  const sw = nw * scale;
  const sh = nh * scale;
  const sx = x + (w - sw) / 2;
  const sy = y + (h - sh) / 2;

  try {
    ctx.drawImage(photo, sx, sy, sw, sh);
  } catch {
    // Fallback for mock unit test environments
  }

  // Subtle editorial crisp edge
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
  ctx.lineWidth = 1;
  if (typeof ctx.strokeRect === 'function') {
    ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
  }

  ctx.restore();
}

/**
 * Renders optional customized caption or date stamp when user enters text.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cw
 * @param {number} ch
 * @param {object} state
 */
export function drawStoryDetails(ctx, cw = 736, ch = 1308, state = {}) {
  if (!ctx) return;
  ctx.save();

  if (state.caption && state.caption.trim()) {
    ctx.font = '600 18px "Space Mono", monospace, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 6;
    ctx.fillText(state.caption.toUpperCase(), cw / 2, 90);
  }

  if (state.date && state.date.trim()) {
    ctx.font = '400 13px "Space Mono", monospace, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.82)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 6;
    ctx.fillText(state.date.toUpperCase(), cw / 2, ch - 65);
  }

  ctx.restore();
}
