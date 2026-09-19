let defaultTreeBg = null;

/**
 * Returns cached Image instance for the authentic Memory Tree backdrop.
 * @returns {HTMLImageElement|null}
 */
export function getMemoryTreeBackgroundImage() {
  if (defaultTreeBg) return defaultTreeBg;
  if (typeof Image !== 'undefined') {
    defaultTreeBg = new Image();
    defaultTreeBg.src = 'assets/memory_tree_reference.jpg?v=1';
  }
  return defaultTreeBg;
}

/**
 * Resets cached background image for test environments.
 */
export function resetMemoryTreeBackgroundImage() {
  defaultTreeBg = null;
}

/**
 * 10 Photo Snapshot Slot Coordinates nestled organically across the tree branches.
 */
export const MEMORY_TREE_SLOTS = [
  { id: 0, name: 'Top Sky Manor', x: 294, y: 72, w: 114, h: 114 },
  { id: 1, name: 'Top Left Portrait', x: 116, y: 130, w: 120, h: 120 },
  { id: 2, name: 'Top Right Cavern', x: 535, y: 222, w: 134, h: 134 },
  { id: 3, name: 'Upper Left Archway', x: 81, y: 268, w: 118, h: 118 },
  { id: 4, name: 'Middle Left Skyview', x: 211, y: 412, w: 118, h: 118 },
  { id: 5, name: 'Middle Right Lantern', x: 434, y: 464, w: 106, h: 106 },
  { id: 6, name: 'Center Left Cottage', x: 187, y: 578, w: 116, h: 116 },
  { id: 7, name: 'Center Right Promenade', x: 478, y: 598, w: 116, h: 116 },
  { id: 8, name: 'Lower Left Monolith', x: 168, y: 880, w: 130, h: 130 },
  { id: 9, name: 'Bottom Left Embrace', x: 22, y: 1040, w: 120, h: 120 }
];

/**
 * Renders the tree and blue sky background.
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement|object|null} defaultBg
 * @param {number} cw
 * @param {number} ch
 */
export function renderTreeBackground(ctx, defaultBg, cw = 736, ch = 1308) {
  if (!ctx) return;
  ctx.save();

  // Cerulean blue sky base
  ctx.fillStyle = '#7ba9dc';
  if (typeof ctx.fillRect === 'function') {
    ctx.fillRect(0, 0, cw, ch);
  }

  if (defaultBg) {
    try {
      ctx.drawImage(defaultBg, 0, 0, cw, ch);
    } catch {
      // Fallback for mock unit test environments
    }
  }

  ctx.restore();
}

/**
 * Renders a photo snapshot into a branch slot with object-fit: cover and subtle print border.
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement|object} photo
 * @param {object} slot
 */
export function renderTreeSnapshotPhoto(ctx, photo, slot) {
  if (!ctx || !photo) return;
  const { x, y, w, h } = slot;
  const nw = photo.naturalWidth || photo.width || w;
  const nh = photo.naturalHeight || photo.height || h;
  const scale = Math.max(w / nw, h / nh);
  const sw = nw * scale;
  const sh = nh * scale;
  const sx = x + (w - sw) / 2;
  const sy = y + (h - sh) / 2;

  ctx.save();

  // 1. Snapshot drop shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 4;

  ctx.beginPath();
  if (typeof ctx.rect === 'function') {
    ctx.rect(x, y, w, h);
  }
  if (typeof ctx.fill === 'function') {
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  }
  if (typeof ctx.clip === 'function') {
    ctx.clip();
  }

  try {
    ctx.drawImage(photo, sx, sy, sw, sh);
  } catch {
    // Mock environment fallback
  }

  ctx.restore();

  // 2. Subtle snapshot border outline
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = 1;
  if (typeof ctx.strokeRect === 'function') {
    ctx.strokeRect(x, y, w, h);
  }
  ctx.restore();
}

/**
 * Draws optional clean typographic overlay when configured by user.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cw
 * @param {number} ch
 * @param {object} [state]
 */
export function drawTreeTypography(ctx, cw, ch, state = {}) {
  if (!ctx) return;
  const { caption, date } = state;
  if (!caption && !date) return;

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (caption && typeof ctx.fillText === 'function') {
    ctx.font = '600 16px "Poppins", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
    ctx.shadowBlur = 6;
    ctx.fillText(String(caption), cw / 2, ch - 54);
  }

  if (date && typeof ctx.fillText === 'function') {
    ctx.font = '500 11px "Courier New", monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
    ctx.shadowBlur = 4;
    ctx.fillText(String(date), cw / 2, ch - 32);
  }

  ctx.restore();
}
