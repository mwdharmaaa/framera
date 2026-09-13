/**
 * Helper drawing routines for Wincore Retro XP UI elements.
 */

export function drawClassicWindow(ctx, { x, y, w, h, title, active = true }) {
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
  ctx.shadowBlur = 16;
  ctx.shadowOffsetX = 8;
  ctx.shadowOffsetY = 10;

  ctx.fillStyle = '#ece9d8';
  ctx.fillRect(x, y, w, h);

  ctx.shadowColor = 'transparent';
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#ffffff';
  ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
  ctx.strokeStyle = '#000000';
  ctx.strokeRect(x, y, w, h);

  const titleGrad = ctx.createLinearGradient(x, y, x, y + 28);
  if (active) {
    titleGrad.addColorStop(0, '#0058e6');
    titleGrad.addColorStop(1, '#0831a4');
  } else {
    titleGrad.addColorStop(0, '#7a96df');
    titleGrad.addColorStop(1, '#536db6');
  }
  ctx.fillStyle = titleGrad;
  ctx.fillRect(x + 3, y + 3, w - 6, 24);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 13px Tahoma, Arial, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(title, x + 10, y + 15);

  ctx.fillStyle = active ? '#d93924' : '#b25d53';
  ctx.fillRect(x + w - 24, y + 5, 18, 18);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px Tahoma, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('x', x + w - 15, y + 14);

  ctx.restore();
}

export function drawPixelCursor(ctx, x, y) {
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 4;

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + 26);
  ctx.lineTo(x + 6, y + 20);
  ctx.lineTo(x + 11, y + 30);
  ctx.lineTo(x + 15, y + 28);
  ctx.lineTo(x + 10, y + 18);
  ctx.lineTo(x + 18, y + 18);
  ctx.closePath();

  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#000000';
  ctx.stroke();
  ctx.restore();
}
