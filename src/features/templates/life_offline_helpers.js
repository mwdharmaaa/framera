/**
 * Card slot definitions for the Life Offline 3-photo triptych layout.
 * Slot 0: Top half background landscape
 * Slot 1: Bottom half background landscape
 * Slot 2: Center floating white-bordered card
 */
export const LIFE_OFFLINE_SLOTS = [
  {
    id: 0,
    role: 'top_background',
    name: 'Top Canopy',
    x: 0,
    y: 0,
    w: 736,
    h: 460
  },
  {
    id: 1,
    role: 'bottom_background',
    name: 'Bottom Landscape',
    x: 0,
    y: 460,
    w: 736,
    h: 460
  },
  {
    id: 2,
    role: 'center_card',
    name: 'Center Feature Card',
    x: 140,
    y: 308,
    w: 456,
    h: 304,
    borderWidth: 8
  }
];

/**
 * Renders an image inside a specified slot with object-fit: cover.
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement|object} photo
 * @param {object} slot
 */
export function renderSlotPhoto(ctx, photo, slot) {
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
  ctx.beginPath();
  if (typeof ctx.rect === 'function') {
    ctx.rect(x, y, w, h);
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
}

/**
 * Renders the center floating card with a clean white print border and soft drop shadow.
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement|object} photo
 * @param {object} slot
 */
export function renderCenterCard(ctx, photo, slot) {
  if (!ctx) return;
  const { x, y, w, h, borderWidth = 8 } = slot;

  // 1. Draw outer white card with ambient drop shadow
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.38)';
  ctx.shadowBlur = 22;
  ctx.shadowOffsetY = 8;
  ctx.fillStyle = '#ffffff';
  if (typeof ctx.fillRect === 'function') {
    ctx.fillRect(x, y, w, h);
  }
  ctx.restore();

  // 2. Draw subtle border stroke around white card
  ctx.save();
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
  ctx.lineWidth = 1;
  if (typeof ctx.strokeRect === 'function') {
    ctx.strokeRect(x, y, w, h);
  }
  ctx.restore();

  // 3. Draw inner photo inside white frame
  const innerSlot = {
    x: x + borderWidth,
    y: y + borderWidth,
    w: w - (borderWidth * 2),
    h: h - (borderWidth * 2)
  };

  if (photo) {
    renderSlotPhoto(ctx, photo, innerSlot);

    // Subtle inner stroke for realistic photo print depth
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.06)';
    ctx.lineWidth = 1;
    if (typeof ctx.strokeRect === 'function') {
      ctx.strokeRect(innerSlot.x, innerSlot.y, innerSlot.w, innerSlot.h);
    }
    ctx.restore();
  } else {
    ctx.save();
    ctx.fillStyle = '#f0f2f5';
    if (typeof ctx.fillRect === 'function') {
      ctx.fillRect(innerSlot.x, innerSlot.y, innerSlot.w, innerSlot.h);
    }
    ctx.restore();
  }
}

/**
 * Draws optional clean typographic overlay when configured by user.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cw
 * @param {number} ch
 * @param {object} [state]
 */
export function drawLifeOfflineTypography(ctx, cw, ch, state = {}) {
  if (!ctx) return;
  const { caption, date } = state;
  if (!caption && !date) return;

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (caption && typeof ctx.fillText === 'function') {
    ctx.font = '700 18px "Poppins", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
    ctx.shadowBlur = 8;
    ctx.fillText(String(caption).toUpperCase(), cw / 2, ch - 48);
  }

  if (date && typeof ctx.fillText === 'function') {
    ctx.font = '500 11px "Courier New", monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
    ctx.shadowBlur = 6;
    ctx.fillText(String(date), cw / 2, ch - 26);
  }

  ctx.restore();
}
