/**
 * Helper drawing routines for Phone Viewfinder UI overlays.
 */

export function drawFocusReticle(ctx, cx, cy, size) {
  const half = size / 2;
  const arm = 24;
  ctx.save();
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 2.5;

  ctx.beginPath();
  // Top-left
  ctx.moveTo(cx - half, cy - half + arm);
  ctx.lineTo(cx - half, cy - half);
  ctx.lineTo(cx - half + arm, cy - half);
  // Top-right
  ctx.moveTo(cx + half - arm, cy - half);
  ctx.lineTo(cx + half, cy - half);
  ctx.lineTo(cx + half, cy - half + arm);
  // Bottom-right
  ctx.moveTo(cx + half, cy + half - arm);
  ctx.lineTo(cx + half, cy + half);
  ctx.lineTo(cx + half - arm, cy + half);
  // Bottom-left
  ctx.moveTo(cx - half + arm, cy + half);
  ctx.lineTo(cx - half, cy + half);
  ctx.lineTo(cx - half, cy + half - arm);
  ctx.stroke();

  // Exposure vertical indicator slider on right
  const sliderX = cx + half + 26;
  ctx.beginPath();
  ctx.moveTo(sliderX, cy - 40);
  ctx.lineTo(sliderX, cy + 40);
  ctx.stroke();

  // Mini sun icon
  ctx.beginPath();
  ctx.arc(sliderX, cy - 8, 7, 0, Math.PI * 2);
  ctx.fillStyle = '#facc15';
  ctx.fill();
  ctx.restore();
}

export function drawZoomPills(ctx, cx, pillY) {
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.beginPath();
  ctx.roundRect(cx - 140, pillY - 24, 280, 48, 24);
  ctx.fill();

  ctx.font = '700 18px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.fillText('.5', cx - 84, pillY + 6);
  ctx.fillStyle = '#facc15';
  ctx.fillText('1x', cx - 28, pillY + 6);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.fillText('2', cx + 28, pillY + 6);
  ctx.fillText('3', cx + 84, pillY + 6);
  ctx.restore();
}

export function drawShutterButton(ctx, cx, shutterY) {
  ctx.save();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, shutterY, 40, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx, shutterY, 32, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
