/**
 * Layout slots, golden-brown photo grading pipeline, and composition assembler.
 */
import { drawTopLeftFlowerCluster, drawBottomRightFlowerCluster } from './golden_brown_botanical.js';
import { drawTopRightFlourish, drawBottomLeftFlourish } from './golden_brown_flourishes.js';

export const GOLDEN_BROWN_SLOTS = [
  {
    id: 0,
    name: 'Top Golden Portrait',
    x: 164,
    y: 130,
    w: 408,
    h: 510
  },
  {
    id: 1,
    name: 'Bottom Golden Portrait',
    x: 164,
    y: 704,
    w: 408,
    h: 510
  }
];

/**
 * Renders an individual slot photo with the signature golden-brown warm amber grading.
 */
export function renderGoldenBrownPhoto(ctx, photo, slot, options = {}) {
  if (!ctx || !photo) return;
  const { x, y, w, h } = slot;
  const zoom = options.zoom || 1;
  const panX = options.panX || 0;
  const panY = options.panY || 0;
  const nw = photo.naturalWidth || photo.width || w;
  const nh = photo.naturalHeight || photo.height || h;
  const scale = Math.max(w / nw, h / nh) * zoom;
  const sw = nw * scale;
  const sh = nh * scale;
  const sx = x + (w - sw) / 2 + panX;
  const sy = y + (h - sh) / 2 + panY;

  ctx.save();
  ctx.beginPath();
  if (typeof ctx.rect === 'function') ctx.rect(x, y, w, h);
  if (typeof ctx.clip === 'function') ctx.clip();

  // 1. Warm amber sepia base filter
  const prevFilter = ctx.filter;
  try {
    ctx.filter = 'sepia(75%) saturate(210%) contrast(120%) brightness(102%) hue-rotate(-12deg)';
  } catch {}

  try {
    ctx.drawImage(photo, sx, sy, sw, sh);
  } catch {}

  try {
    ctx.filter = prevFilter || 'none';
  } catch {}

  // 2. Primary golden-orange hue infusion ('color' blend mode)
  ctx.save();
  ctx.globalCompositeOperation = 'color';
  ctx.fillStyle = 'rgba(238, 130, 10, 0.48)';
  if (typeof ctx.fillRect === 'function') ctx.fillRect(x, y, w, h);
  ctx.restore();

  // 3. Radiant golden-hour sunbeam glow ('soft-light' blend mode)
  if (typeof ctx.createLinearGradient === 'function') {
    ctx.save();
    ctx.globalCompositeOperation = 'soft-light';
    const grad = ctx.createLinearGradient(x, y, x + w, y + h);
    grad.addColorStop(0, 'rgba(255, 210, 60, 0.55)');
    grad.addColorStop(0.5, 'rgba(255, 145, 20, 0.45)');
    grad.addColorStop(1, 'rgba(215, 80, 8, 0.45)');
    ctx.fillStyle = grad;
    if (typeof ctx.fillRect === 'function') ctx.fillRect(x, y, w, h);
    ctx.restore();
  }

  // 4. Caramel brown shadow and midtone warmth ('multiply' blend mode)
  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillStyle = 'rgba(220, 145, 45, 0.28)';
  if (typeof ctx.fillRect === 'function') ctx.fillRect(x, y, w, h);
  ctx.restore();

  // 5. Golden highlight boost ('screen' blend mode)
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.fillStyle = 'rgba(255, 215, 110, 0.15)';
  if (typeof ctx.fillRect === 'function') ctx.fillRect(x, y, w, h);
  ctx.restore();

  // 6. Subtle dark edge vignette for editorial contrast against black backdrop
  if (typeof ctx.createRadialGradient === 'function') {
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    const cx = x + w / 2;
    const cy = y + h / 2;
    const r = Math.max(w, h) * 0.72;
    const vig = ctx.createRadialGradient(cx, cy, r * 0.48, cx, cy, r);
    vig.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vig.addColorStop(1, 'rgba(0, 0, 0, 0.60)');
    ctx.fillStyle = vig;
    if (typeof ctx.fillRect === 'function') ctx.fillRect(x, y, w, h);
    ctx.restore();
  }

  ctx.restore();
}

/**
 * Renders the complete Golden Brown Botanical Duo composition.
 */
export function drawGoldenBrownComposition(ctx, photoImgs, state = {}) {
  // 1. Deep solid black studio background
  ctx.fillStyle = '#050505';
  ctx.fillRect(0, 0, 736, 1308);

  // 2. Render both photo slots
  GOLDEN_BROWN_SLOTS.forEach((slot, index) => {
    const photo = (photoImgs && photoImgs[index]) || (index === 0 ? state.photoImg : null);
    if (photo) {
      renderGoldenBrownPhoto(ctx, photo, slot, {
        zoom: state.zoom || 1,
        panX: state.panX || 0,
        panY: state.panY || 0
      });
    } else {
      ctx.fillStyle = '#141414';
      ctx.fillRect(slot.x, slot.y, slot.w, slot.h);
      ctx.strokeStyle = '#282828';
      ctx.lineWidth = 1;
      ctx.strokeRect(slot.x, slot.y, slot.w, slot.h);
    }
  });

  // 3. Painterly chalk flourishes
  drawTopRightFlourish(ctx);
  drawBottomLeftFlourish(ctx);

  // 4. Botanical floral clusters overlapping photo corners
  drawTopLeftFlowerCluster(ctx);
  drawBottomRightFlowerCluster(ctx);
}
