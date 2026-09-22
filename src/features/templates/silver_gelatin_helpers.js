import { calculateImageBounds } from '../../core/canvas/bounds.js';

export const SILVER_GELATIN_SLOTS = [
  {
    id: 0,
    name: 'Top Vintage Print',
    cardX: 32,
    cardY: 170,
    cardW: 672,
    cardH: 450,
    x: 48,
    y: 186,
    w: 640,
    h: 418
  },
  {
    id: 1,
    name: 'Bottom Vintage Print',
    cardX: 32,
    cardY: 658,
    cardW: 672,
    cardH: 450,
    x: 48,
    y: 674,
    w: 640,
    h: 418
  }
];

/**
 * Renders the clean gallery wall / off-white paper canvas backdrop.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cw
 * @param {number} ch
 */
export function renderPaperBackdrop(ctx, cw = 736, ch = 1308) {
  if (!ctx) return;
  ctx.save();
  ctx.fillStyle = '#fafaf8';
  ctx.fillRect(0, 0, cw, ch);
  ctx.restore();
}

/**
 * Renders a tactile vintage photographic print with deckled paper border and B&W photo.
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement|null} photo
 * @param {object} slot
 * @param {object} framing
 * @param {boolean} isTop
 */
export function renderPhotographicCard(ctx, photo, slot, framing = {}, isTop = false) {
  if (!ctx || !slot) return;
  const { cardX, cardY, cardW, cardH, x, y, w, h } = slot;

  ctx.save();

  // 1. Multi-layered drop shadows for paper elevation
  ctx.shadowColor = 'rgba(25, 25, 30, 0.08)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 8;
  ctx.fillStyle = '#fbfbfa';
  ctx.fillRect(cardX, cardY, cardW, cardH);

  // Contact ambient shadow
  ctx.shadowColor = 'rgba(15, 15, 20, 0.04)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetY = 2;
  ctx.fillRect(cardX, cardY, cardW, cardH);

  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // 2. Subtle worn / vintage paper frame stroke
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
  ctx.lineWidth = 0.75;
  ctx.strokeRect(cardX, cardY, cardW, cardH);

  // 3. Photo inset container
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();

  // Deep matte black base
  ctx.fillStyle = '#0c0d0e';
  ctx.fillRect(x, y, w, h);

  if (photo) {
    const pw = photo.naturalWidth || photo.width || w;
    const ph = photo.naturalHeight || photo.height || h;
    const b = calculateImageBounds(pw, ph, { x, y, w, h }, {
      zoom: framing.zoom ?? 1,
      panX: framing.panX ?? 0,
      panY: framing.panY ?? 0,
      fitMode: 'cover'
    });

    try {
      if (ctx.filter !== undefined) {
        ctx.filter = 'grayscale(100%) contrast(128%) brightness(98%)';
      }
      ctx.drawImage(photo, b.drawX, b.drawY, b.drawW, b.drawH);
    } catch {
      renderPlaceholderText(ctx, slot);
    } finally {
      if (ctx.filter !== undefined) {
        ctx.filter = 'none';
      }
    }
  } else {
    renderPlaceholderText(ctx, slot);
  }

  // Inner hairline photo edge
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, w, h);

  ctx.restore();

  // 4. Vintage paper corner accent
  if (isTop) {
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.06)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cardX + 2, cardY + 12);
    ctx.lineTo(cardX + 12, cardY + 2);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Draws placeholder caption if image cannot be rendered.
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} slot
 */
export function renderPlaceholderText(ctx, slot) {
  ctx.save();
  ctx.fillStyle = '#64748b';
  ctx.font = '14px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(slot.name, slot.x + slot.w / 2, slot.y + slot.h / 2);
  ctx.restore();
}
