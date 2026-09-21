/**
 * Helper routines for Jura Mountains Diary 9-Photo Editorial Template.
 */

export const JURA_SLOT_COORDINATES = [
  // Row 1
  { x: 0, y: 102, w: 245, h: 190, numberY: 326 },
  { x: 245, y: 102, w: 246, h: 190, numberY: 326 },
  { x: 491, y: 102, w: 245, h: 190, numberY: 326 },
  // Row 2
  { x: 0, y: 365, w: 245, h: 190, numberY: 593 },
  { x: 245, y: 365, w: 246, h: 190, numberY: 593 },
  { x: 491, y: 365, w: 245, h: 190, numberY: 593 },
  // Row 3
  { x: 0, y: 635, w: 245, h: 190, numberY: 863 },
  { x: 245, y: 635, w: 246, h: 190, numberY: 863 },
  { x: 491, y: 635, w: 245, h: 190, numberY: 863 }
];

/**
 * Draws the minimal diary title at the top left.
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} title
 * @param {number} x
 * @param {number} y
 */
export function drawDiaryTitle(ctx, title, x = 48, y = 66) {
  if (!ctx || !title) return;
  ctx.save();
  ctx.fillStyle = '#111114';
  ctx.font = '500 19px "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.letterSpacing = '-0.2px';
  ctx.fillText(title, x, y);
  ctx.restore();
}

/**
 * Draws numbered parenthesized captions (1) to (9) under each photo slot.
 * @param {CanvasRenderingContext2D} ctx
 * @param {Array<object>} [slots=JURA_SLOT_COORDINATES]
 */
export function drawSlotNumbers(ctx, slots = JURA_SLOT_COORDINATES) {
  if (!ctx || !Array.isArray(slots)) return;
  ctx.save();
  ctx.fillStyle = '#111114';
  ctx.font = '400 13.5px "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  slots.forEach((slot, index) => {
    const centerX = slot.x + slot.w / 2;
    const numY = slot.numberY || (slot.y + slot.h + 35);
    ctx.fillText(`(${index + 1})`, centerX, numY);
  });

  ctx.restore();
}

/**
 * Renders an individual photo clipped within its slot rectangle.
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement|null} img
 * @param {object} slot
 * @param {object} [framing={ zoom: 1, panX: 0, panY: 0 }]
 */
export function drawClippedSlotPhoto(ctx, img, slot, framing = {}) {
  if (!ctx || !slot) return;
  if (!img) {
    ctx.save();
    ctx.fillStyle = '#f4f4f5';
    ctx.fillRect(slot.x, slot.y, slot.w, slot.h);
    ctx.restore();
    return;
  }

  const zoom = framing.zoom ?? 1;
  const panX = framing.panX ?? 0;
  const panY = framing.panY ?? 0;

  const nw = img.naturalWidth || img.width || slot.w;
  const nh = img.naturalHeight || img.height || slot.h;
  const scale = Math.max(slot.w / nw, slot.h / nh) * zoom;
  const sw = nw * scale;
  const sh = nh * scale;
  const sx = slot.x + (slot.w - sw) / 2 + panX;
  const sy = slot.y + (slot.h - sh) / 2 + panY;

  ctx.save();
  ctx.beginPath();
  ctx.rect(slot.x, slot.y, slot.w, slot.h);
  ctx.clip();
  ctx.drawImage(img, sx, sy, sw, sh);
  ctx.restore();
}
