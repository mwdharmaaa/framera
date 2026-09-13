/**
 * Helper drawing routines for Astral Koi fish and celestial ornaments.
 */

export function drawAstralKoi(ctx, x, y, scale = 1, angle = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((angle * Math.PI) / 180);
  ctx.scale(scale, scale);

  // Koi Body
  const bodyGrad = ctx.createLinearGradient(-60, 0, 80, 0);
  bodyGrad.addColorStop(0, '#f39c12');
  bodyGrad.addColorStop(0.5, '#e67e22');
  bodyGrad.addColorStop(1, '#d35400');

  ctx.beginPath();
  ctx.moveTo(70, 0);
  ctx.bezierCurveTo(40, -35, -20, -30, -60, -10);
  ctx.bezierCurveTo(-80, -25, -110, -30, -130, -5);
  ctx.bezierCurveTo(-95, 0, -85, 10, -60, 10);
  ctx.bezierCurveTo(-20, 30, 40, 35, 70, 0);
  ctx.closePath();

  ctx.fillStyle = bodyGrad;
  ctx.shadowColor = 'rgba(243, 156, 18, 0.4)';
  ctx.shadowBlur = 18;
  ctx.fill();

  // Chalk/Crayon Texture Highlights
  ctx.strokeStyle = '#fef1d2';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(60, -5);
  ctx.bezierCurveTo(30, -22, -10, -20, -50, -6);
  ctx.stroke();

  // Fins
  ctx.fillStyle = 'rgba(230, 126, 34, 0.85)';
  ctx.beginPath();
  ctx.moveTo(10, 18);
  ctx.bezierCurveTo(25, 45, 50, 60, 40, 75);
  ctx.bezierCurveTo(20, 65, 0, 40, -5, 15);
  ctx.closePath();
  ctx.fill();

  // Flowing Whisker Trails
  ctx.strokeStyle = '#f8c291';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(68, -4);
  ctx.bezierCurveTo(90, -20, 110, -60, 95, -90);
  ctx.bezierCurveTo(80, -115, 60, -80, 80, -70);
  ctx.stroke();

  ctx.restore();
}

export function drawCelestialSun(ctx, x, y, radius = 38) {
  ctx.save();
  ctx.translate(x, y);

  ctx.strokeStyle = '#e67e22';
  ctx.fillStyle = '#f39c12';
  ctx.lineWidth = 2.5;

  // Concentric Circles
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.5, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.22, 0, Math.PI * 2);
  ctx.fill();

  // 8 Solar Rays
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * (radius + 4), Math.sin(a) * (radius + 4));
    ctx.lineTo(Math.cos(a) * (radius + 18), Math.sin(a) * (radius + 18));
    ctx.stroke();
  }

  ctx.restore();
}

export function drawAstralSparkle(ctx, x, y, size = 18) {
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = '#fef1d2';
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(-size, 0);
  ctx.lineTo(size, 0);
  ctx.moveTo(0, -size);
  ctx.lineTo(0, size);
  ctx.stroke();

  ctx.restore();
}
