/**
 * Vector Celestial Sun and Star Renderers for Tangerine Sunset Lyrics Duo Template (9:16, 736x1308).
 * Features radiant woodcut celestial sun and warm terracotta five-pointed stars.
 */

export function drawStar(ctx, cx, cy, spikes = 5, outerR = 14, innerR = 7, color = '#f97316') {
  if (!ctx) return;
  ctx.save();
  ctx.beginPath();
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.moveTo(cx, cy - outerR);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerR;
    y = cy + Math.sin(rot) * outerR;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerR;
    y = cy + Math.sin(rot) * innerR;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerR);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

/**
 * Renders stylized woodcut celestial sun in top-right.
 */
export function drawCelestialSun(ctx, cx = 650, cy = 80, radius = 90) {
  if (!ctx) return;
  ctx.save();

  // 1. Radiant wavy flame rays
  const numRays = 14;
  for (let i = 0; i < numRays; i++) {
    const angle = (i * Math.PI * 2) / numRays;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    ctx.beginPath();
    ctx.moveTo(radius * 0.7, -10);
    ctx.quadraticCurveTo(radius * 1.15, -24, radius * 1.45, 0);
    ctx.quadraticCurveTo(radius * 1.15, 24, radius * 0.7, 10);
    ctx.closePath();

    const rayGrad = ctx.createLinearGradient(radius * 0.7, 0, radius * 1.45, 0);
    rayGrad.addColorStop(0, '#f59e0b');
    rayGrad.addColorStop(0.5, '#ea580c');
    rayGrad.addColorStop(1, '#c2410c');
    ctx.fillStyle = rayGrad;
    ctx.fill();
    ctx.restore();
  }

  // 2. Central Sun Disk
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.75, 0, Math.PI * 2);
  const coreGrad = ctx.createRadialGradient(cx, cy, radius * 0.15, cx, cy, radius * 0.75);
  coreGrad.addColorStop(0, '#fef08a');
  coreGrad.addColorStop(0.35, '#f59e0b');
  coreGrad.addColorStop(0.75, '#ea580c');
  coreGrad.addColorStop(1, '#9a3412');
  ctx.fillStyle = coreGrad;
  ctx.fill();

  // 3. Concentric textured engraving rings
  ctx.strokeStyle = 'rgba(154, 52, 18, 0.45)';
  ctx.lineWidth = 1.5;
  for (let r = 18; r < radius * 0.7; r += 9) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Draws floating terracotta star cluster in top-left.
 */
export function drawTopStars(ctx) {
  drawStar(ctx, 175, 38, 5, 16, 7.5, '#fb923c');
  drawStar(ctx, 138, 84, 5, 12, 5.5, '#ea580c');
  drawStar(ctx, 232, 68, 5, 14, 6.5, '#f97316');
}
