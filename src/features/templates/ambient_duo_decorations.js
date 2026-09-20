import { drawRoundedRect } from './ambient_duo_helpers.js';

/**
 * Vector Decorative Overlays for Ambient Headphone Duo Card:
 * Headphones illustration, Biometric fingerprint heart, and Sparkle stars.
 */

export function drawHeadphones(ctx, cx = 585, cy = 475) {
  if (!ctx) return;
  ctx.save();
  // Outer headband
  ctx.strokeStyle = '#2b2d31';
  ctx.lineWidth = 12;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(cx - 30, cy - 25, 46, 1.15 * Math.PI, 1.95 * Math.PI);
  ctx.stroke();

  // Inner headband padding
  ctx.strokeStyle = '#18191c';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(cx - 30, cy - 25, 44, 1.25 * Math.PI, 1.85 * Math.PI);
  ctx.stroke();

  // Right ear cushion (main cup)
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(0.26);

  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 8;

  ctx.fillStyle = '#1e1f22';
  drawRoundedRect(ctx, -24, -36, 48, 72, 22);
  ctx.fill();
  ctx.shadowColor = 'transparent';

  // Ear cup outer rim
  ctx.strokeStyle = '#4e5058';
  ctx.lineWidth = 2.5;
  drawRoundedRect(ctx, -24, -36, 48, 72, 22);
  ctx.stroke();

  // Inner speaker cavity
  ctx.fillStyle = '#111214';
  drawRoundedRect(ctx, -14, -24, 28, 48, 14);
  ctx.fill();

  ctx.restore();
  ctx.restore();
}

export function drawFingerprintHeart(ctx, x = 110, y = 840) {
  if (!ctx) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.15);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = 1.4;
  ctx.lineCap = 'round';
  ctx.setLineDash([5, 4]);

  // Concentric biometric heart loops
  for (let r = 8; r <= 42; r += 7) {
    ctx.beginPath();
    const topCurveHeight = r * 0.45;
    ctx.moveTo(0, r * 0.4);
    ctx.bezierCurveTo(-r * 0.7, -topCurveHeight, -r, r * 0.2, 0, r);
    ctx.bezierCurveTo(r, r * 0.2, r * 0.7, -topCurveHeight, 0, r * 0.4);
    ctx.stroke();
  }
  ctx.restore();
}

export function drawSparkleStars(ctx, x = 600, y = 835) {
  if (!ctx) return;
  ctx.save();

  const drawOneStar = (sx, sy, size) => {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.2;

    ctx.beginPath();
    ctx.moveTo(sx, sy - size);
    ctx.quadraticCurveTo(sx, sy, sx + size, sy);
    ctx.quadraticCurveTo(sx, sy, sx, sy + size);
    ctx.quadraticCurveTo(sx, sy, sx - size, sy);
    ctx.quadraticCurveTo(sx, sy, sx, sy - size);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  };

  drawOneStar(x, y, 16);
  drawOneStar(x - 22, y + 24, 11);
  drawOneStar(x + 24, y + 20, 13);
  ctx.restore();
}
