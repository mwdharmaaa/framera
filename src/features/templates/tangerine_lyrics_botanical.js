import { drawStar } from './tangerine_lyrics_decorations.js';

/**
 * Botanical Flower and Celestial Doodle Cutouts for Tangerine Sunset Lyrics Duo Template.
 * Features tropical lily flower, vibrant hibiscus, and Y2K astrological doodle cluster.
 */

/**
 * Draws stylized orange tropical lily flower.
 */
export function drawTropicalLily(ctx, x = 0, y = 460, size = 135) {
  if (!ctx) return;
  ctx.save();
  ctx.translate(x + size * 0.45, y + size * 0.45);

  const numPetals = 6;
  for (let i = 0; i < numPetals; i++) {
    const angle = (i * Math.PI * 2) / numPetals;
    ctx.save();
    ctx.rotate(angle);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(size * 0.28, -size * 0.18, size * 0.52, 0);
    ctx.quadraticCurveTo(size * 0.28, size * 0.18, 0, 0);
    ctx.closePath();

    const pGrad = ctx.createLinearGradient(0, 0, size * 0.5, 0);
    pGrad.addColorStop(0, '#f97316');
    pGrad.addColorStop(0.65, '#ea580c');
    pGrad.addColorStop(1, '#c2410c');
    ctx.fillStyle = pGrad;
    ctx.fill();
    ctx.restore();
  }

  // Center Pistil / Stamens
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.08, 0, Math.PI * 2);
  ctx.fillStyle = '#7c2d12';
  ctx.fill();

  ctx.restore();
}

/**
 * Draws vibrant tropical hibiscus cutout in lower-right.
 */
export function drawHibiscus(ctx, x = 608, y = 730, size = 96) {
  if (!ctx) return;
  ctx.save();
  ctx.translate(x + size * 0.5, y + size * 0.5);

  for (let i = 0; i < 5; i++) {
    ctx.save();
    ctx.rotate((i * Math.PI * 2) / 5);
    ctx.beginPath();
    ctx.arc(0, size * 0.28, size * 0.24, 0, Math.PI * 2);
    const grad = ctx.createRadialGradient(0, size * 0.28, 5, 0, size * 0.28, size * 0.25);
    grad.addColorStop(0, '#fb923c');
    grad.addColorStop(0.55, '#ea580c');
    grad.addColorStop(1, '#c2410c');
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
  }

  // Yellow central stamen column
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.1, 0, Math.PI * 2);
  ctx.fillStyle = '#fef08a';
  ctx.fill();

  ctx.strokeStyle = '#ca8a04';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.restore();
}

/**
 * Draws Y2K astrological starburst & celestial cluster in bottom-left.
 */
export function drawY2kStarCluster(ctx, x = 0, y = 1140, size = 175) {
  if (!ctx) return;
  ctx.save();
  ctx.translate(x + size * 0.45, y + size * 0.45);

  // Concentric compass rings
  ctx.strokeStyle = 'rgba(234, 88, 12, 0.75)';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.36, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, size * 0.26, 0, Math.PI * 2);
  ctx.stroke();

  // Central star
  drawStar(ctx, 0, 0, 5, size * 0.16, size * 0.08, '#fef08a');

  // Layered orbiting stars
  drawStar(ctx, size * 0.35, -size * 0.18, 5, size * 0.15, size * 0.07, '#fb923c');
  drawStar(ctx, -size * 0.24, size * 0.26, 5, size * 0.12, size * 0.06, '#ea580c');
  drawStar(ctx, size * 0.22, size * 0.32, 5, size * 0.1, size * 0.05, '#f59e0b');

  ctx.restore();
}
