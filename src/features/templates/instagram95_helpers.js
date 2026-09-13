/**
 * Helper drawing routines for Windows 95 UI styling and effects.
 */

export function drawBevel(ctx, x, y, w, h, sunken = false) {
  const light = sunken ? '#808080' : '#ffffff';
  const dark = sunken ? '#ffffff' : '#000000';
  ctx.strokeStyle = light;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y + h);
  ctx.lineTo(x, y);
  ctx.lineTo(x + w, y);
  ctx.stroke();

  ctx.strokeStyle = dark;
  ctx.beginPath();
  ctx.moveTo(x + w, y);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.stroke();
}

export function drawScanlines(ctx, x, y, w, h) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.14)';
  for (let i = y; i < y + h; i += 6) {
    ctx.fillRect(x, i, w, 2);
  }
}

export function drawFilterCarousel(ctx, pvX, barY) {
  const filters = [
    { name: "Mac '86", active: false },
    { name: 'Apple II', active: true },
    { name: 'CGA 4', active: false },
    { name: 'VGA 256', active: false }
  ];

  filters.forEach((f, i) => {
    const fx = pvX + 20 + i * 240;
    const fy = barY + 16;
    ctx.fillStyle = f.active ? '#000080' : '#dcdcdc';
    ctx.fillRect(fx, fy, 210, 130);
    drawBevel(ctx, fx, fy, 210, 130, f.active);

    ctx.fillStyle = f.active ? '#ffffff' : '#000000';
    ctx.font = '700 16px "MS Sans Serif", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(f.name, fx + 105, fy + 72);
  });
}
