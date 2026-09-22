import { calculateImageBounds } from '../../core/canvas/bounds.js';

export const SEASIDE_DIPTYCH_SLOTS = [
  {
    id: 0,
    name: 'Top Panel',
    x: 0,
    y: 0,
    w: 736,
    h: 448
  },
  {
    id: 1,
    name: 'Bottom Panel',
    x: 0,
    y: 490,
    w: 736,
    h: 430
  }
];

export const SEASIDE_DIVIDER_BAR = {
  x: 0,
  y: 448,
  w: 736,
  h: 42
};

/**
 * Renders an individual slot photo with cover scaling and pan/zoom framing.
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement|null} photo
 * @param {object} slot
 * @param {object} framing
 */
export function renderSlotPhoto(ctx, photo, slot, framing = {}) {
  ctx.save();

  ctx.beginPath();
  ctx.rect(slot.x, slot.y, slot.w, slot.h);
  ctx.clip();

  // Neutral subtle base background
  ctx.fillStyle = '#f0f4f6';
  ctx.fillRect(slot.x, slot.y, slot.w, slot.h);

  if (photo) {
    const pw = photo.naturalWidth || photo.width || slot.w;
    const ph = photo.naturalHeight || photo.height || slot.h;
    const b = calculateImageBounds(pw, ph, slot, {
      zoom: framing.zoom ?? 1,
      panX: framing.panX ?? 0,
      panY: framing.panY ?? 0,
      fitMode: 'cover'
    });

    try {
      ctx.drawImage(photo, b.drawX, b.drawY, b.drawW, b.drawH);
    } catch {
      renderPlaceholderText(ctx, slot);
    }
  } else {
    renderPlaceholderText(ctx, slot);
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
  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(slot.name, slot.x + slot.w / 2, slot.y + slot.h / 2);
  ctx.restore();
}

/**
 * Renders the crisp white divider band separating the two photographic panels.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} width
 * @param {number} height
 */
export function renderWhiteDivider(ctx, width = 736, height = 920) {
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(SEASIDE_DIVIDER_BAR.x, SEASIDE_DIVIDER_BAR.y, width, SEASIDE_DIVIDER_BAR.h);
  ctx.restore();
}
