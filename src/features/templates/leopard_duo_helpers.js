import { calculateImageBounds } from '../../core/canvas/bounds.js';
import {
  drawLeopardPattern,
  drawLipstickKiss,
  drawGlitterStar,
  drawDriedFlower
} from './leopard_duo_decorations.js';

export const LEOPARD_DUO_SLOTS = [
  {
    id: 0,
    name: 'Top Frame',
    x: 49,
    y: 212,
    w: 482,
    h: 339
  },
  {
    id: 1,
    name: 'Bottom Frame',
    x: 48,
    y: 582,
    w: 482,
    h: 356
  }
];

export const LEOPARD_FRAME_BOX = {
  x: 25,
  y: 149,
  w: 536,
  h: 830
};

/**
 * Renders split backdrop: kraft paper cardboard on left, rich espresso brown on right.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} width
 * @param {number} height
 */
export function renderSplitBackdrop(ctx, width, height) {
  ctx.save();

  const splitX = Math.round(width * 0.56);

  // 1. Left Kraft Paper texture
  ctx.fillStyle = '#a68c6d';
  ctx.fillRect(0, 0, splitX, height);

  // Organic cardboard paper grain
  ctx.fillStyle = 'rgba(50, 35, 20, 0.035)';
  for (let i = 0; i < 300; i++) {
    const rx = ((Math.sin(i * 17.135) * 43758.5453 % 1 + 1) % 1) * splitX;
    const ry = ((Math.cos(i * 41.821) * 43758.5453 % 1 + 1) % 1) * height;
    ctx.fillRect(rx, ry, 2, 2);
  }

  // 2. Right Dark Espresso Chocolate
  ctx.fillStyle = '#3e2c24';
  ctx.fillRect(splitX, 0, width - splitX, height);

  ctx.restore();
}

/**
 * Renders photo slot or elegant serif placeholder.
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

  // Cream base
  ctx.fillStyle = '#f4f0e6';
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

  // Fine inner slot stroke
  ctx.strokeStyle = 'rgba(38, 20, 11, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(slot.x, slot.y, slot.w, slot.h);
}

function renderPlaceholderText(ctx, slot) {
  ctx.fillStyle = '#3e2c24';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const cx = slot.x + slot.w / 2;
  const cy = slot.y + slot.h / 2;

  ctx.font = '26px "Playfair Display", "Times New Roman", Georgia, serif';
  ctx.fillText('+', cx, cy - 18);

  ctx.font = '19px "Playfair Display", "Times New Roman", Georgia, serif';
  ctx.fillText('add your photo', cx, cy + 16);
}

/**
 * Renders entire leopard frame assemblage with overlays.
 * @param {CanvasRenderingContext2D} ctx
 * @param {Array<HTMLImageElement>} photos
 * @param {Array<object>} framings
 */
export function renderLeopardAssemblage(ctx, photos, framings = []) {
  const fb = LEOPARD_FRAME_BOX;

  // 1. Draw Leopard Fur Pattern on the main panel
  drawLeopardPattern(ctx, fb.x, fb.y, fb.w, fb.h);

  // 2. Render both photo slots
  LEOPARD_DUO_SLOTS.forEach((slot, idx) => {
    const photo = photos[idx] || null;
    const framing = framings[idx] || {};
    renderSlotPhoto(ctx, photo, slot, framing);
  });

  // 3. Render Lipstick Kiss at bottom-left
  drawLipstickKiss(ctx, 105, 955, 1.15);

  // 4. Render Dried Flower overlapping right edge
  drawDriedFlower(ctx, 560, 645, 85);

  // 5. Render Silver Glitter Stars
  drawGlitterStar(ctx, 635, 310, 18, 8, 0.1);
  drawGlitterStar(ctx, 690, 425, 38, 17, -0.2);
}
