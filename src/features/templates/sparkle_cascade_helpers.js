import { calculateImageBounds } from '../../core/canvas/bounds.js';
import { drawRoundedRect } from './sparkle_cascade_decorations.js';

/**
 * Layout Coordinates and Card Renderers for Sparkle Vinyl Cascade Trio Template (9:16, 736x1308).
 * Arranges 3 rounded floating cards in a cascading diagonal stack with warm ambient background.
 */

export const SPARKLE_CASCADE_SLOTS = [
  { id: 0, name: 'Top Left Card', x: 24, y: 102, w: 364, h: 484, r: 18 },
  { id: 1, name: 'Middle Center Card', x: 134, y: 462, w: 424, h: 320, r: 18 },
  { id: 2, name: 'Bottom Right Card', x: 322, y: 742, w: 384, h: 510, r: 18 }
];

export const SPARKLE_VINYL_CONFIG = {
  cx: 586,
  cy: 254,
  radius: 82
};

/**
 * Renders the atmospheric warm amber/caramel gradient and blurred photo background.
 */
export function renderSparkleAtmosphere(ctx, photo, cw, ch) {
  if (!ctx) return;
  ctx.save();

  // 1. Rich warm amber gradient base
  const bgGrad = ctx.createLinearGradient(0, 0, cw * 0.8, ch);
  bgGrad.addColorStop(0, '#9e6a38');
  bgGrad.addColorStop(0.35, '#88511e');
  bgGrad.addColorStop(0.7, '#6b360f');
  bgGrad.addColorStop(1, '#4e2307');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, cw, ch);

  // 2. Atmospheric blurred photo background when image is available
  if (photo) {
    const pw = photo.naturalWidth || photo.width || cw;
    const ph = photo.naturalHeight || photo.height || ch;
    const scale = Math.max(cw / pw, ch / ph);
    const dw = pw * scale;
    const dh = ph * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    ctx.save();
    ctx.filter = 'blur(40px) brightness(68%) saturate(135%)';
    try {
      ctx.drawImage(photo, dx, dy, dw, dh);
    } catch {
      // Safe fallback for test environments
    }
    ctx.restore();

    // Warm amber luminous scrim over blurred image
    const scrim = ctx.createRadialGradient(cw * 0.4, ch * 0.45, 100, cw * 0.5, ch * 0.5, cw * 0.9);
    scrim.addColorStop(0, 'rgba(175, 110, 48, 0.42)');
    scrim.addColorStop(0.65, 'rgba(110, 52, 12, 0.65)');
    scrim.addColorStop(1, 'rgba(45, 18, 4, 0.82)');
    ctx.fillStyle = scrim;
    ctx.fillRect(0, 0, cw, ch);
  }

  // 3. Subtle soft vignette along outer canvas edges
  const vignette = ctx.createRadialGradient(cw / 2, ch / 2, ch * 0.35, cw / 2, ch / 2, ch * 0.75);
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignette.addColorStop(1, 'rgba(15, 6, 2, 0.55)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, cw, ch);

  ctx.restore();
}

/**
 * Renders an individual cascading rounded photo card with floating drop shadow and framing.
 */
export function renderCascadeCard(ctx, photo, slot, framing = {}) {
  if (!ctx || !slot) return;
  const { x, y, w, h, r } = slot;

  ctx.save();

  // 1. Smooth floating ambient shadow
  ctx.shadowColor = 'rgba(12, 6, 2, 0.48)';
  ctx.shadowBlur = 26;
  ctx.shadowOffsetY = 10;

  drawRoundedRect(ctx, x, y, w, h, r);
  ctx.fillStyle = '#1e140d';
  ctx.fill();

  ctx.shadowColor = 'transparent';

  // 2. Photo contents clipped to rounded card
  ctx.save();
  drawRoundedRect(ctx, x, y, w, h, r);
  ctx.clip();

  if (photo) {
    const pw = photo.naturalWidth || photo.width || w;
    const ph = photo.naturalHeight || photo.height || h;
    const b = calculateImageBounds(pw, ph, slot, {
      zoom: framing.zoom ?? 1,
      panX: framing.panX ?? 0,
      panY: framing.panY ?? 0,
      fitMode: 'cover'
    });

    try {
      ctx.drawImage(photo, b.drawX, b.drawY, b.drawW, b.drawH);
    } catch {
      // Safe fallback for unit tests
    }
  } else {
    ctx.fillStyle = '#2d1c10';
    ctx.fillRect(x, y, w, h);
  }

  // 3. Soft internal glass highlight rim
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.lineWidth = 1.2;
  drawRoundedRect(ctx, x + 0.6, y + 0.6, w - 1.2, h - 1.2, r - 0.6);
  ctx.stroke();

  ctx.restore();
  ctx.restore();
}
