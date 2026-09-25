/**
 * Canvas Vector Renderer for Stickers, Washi Tapes, and Postal Stamps.
 * Pure Canvas 2D vector drawing for crisp export resolution at any scale.
 */

function drawWashi(ctx, tint = 'rgba(245, 238, 220, 0.82)') {
  ctx.save();
  ctx.fillStyle = tint;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.12)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetY = 2;

  // Semi-translucent tape body with jagged ends
  ctx.beginPath();
  ctx.moveTo(-70, -18);
  ctx.lineTo(70, -18);
  ctx.lineTo(66, 18);
  ctx.lineTo(-66, 18);
  ctx.closePath();
  ctx.fill();

  // Subtle tape fiber highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
  ctx.fillRect(-60, -14, 120, 6);
  ctx.restore();
}

function drawPostalStamp(ctx) {
  ctx.save();
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#B3261E';
  ctx.lineWidth = 1.5;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 2;

  // Stamp paper base
  ctx.fillRect(-45, -35, 90, 70);
  ctx.strokeRect(-41, -31, 82, 62);

  ctx.fillStyle = '#B3261E';
  ctx.font = '700 9px "Space Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('AIR MAIL', 0, -16);
  ctx.fillText('FRAMERA 26', 0, 22);

  // Center emblem circle
  ctx.beginPath();
  ctx.arc(0, 2, 12, 0, Math.PI * 2);
  ctx.stroke();

  // Postmark wavy cancellation lines
  ctx.strokeStyle = '#2B2B2B';
  ctx.lineWidth = 1;
  for (let offset = -8; offset <= 8; offset += 4) {
    ctx.beginPath();
    ctx.moveTo(15, offset);
    ctx.lineTo(40, offset);
    ctx.stroke();
  }
  ctx.restore();
}

function drawBarcode(ctx) {
  ctx.save();
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(-60, -26, 120, 52);
  ctx.fillStyle = '#111111';

  const bars = [2, 1, 3, 1, 4, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 4, 1, 2];
  let curX = -52;
  bars.forEach((w) => {
    ctx.fillRect(curX, -18, w, 28);
    curX += w + 2;
  });

  ctx.font = '600 8px "Space Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('* FRAMERA STUDIO *', 0, 20);
  ctx.restore();
}

function drawSparkle(ctx) {
  ctx.save();
  ctx.fillStyle = '#E5A93C';
  ctx.shadowColor = 'rgba(229, 169, 60, 0.4)';
  ctx.shadowBlur = 8;

  ctx.beginPath();
  ctx.moveTo(0, -32);
  ctx.quadraticCurveTo(0, 0, 32, 0);
  ctx.quadraticCurveTo(0, 0, 0, 32);
  ctx.quadraticCurveTo(0, 0, -32, 0);
  ctx.quadraticCurveTo(0, 0, 0, -32);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(0, 0, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawHeart(ctx) {
  ctx.save();
  ctx.fillStyle = '#E11D48';
  ctx.strokeStyle = '#9F1239';
  ctx.lineWidth = 2;
  ctx.shadowColor = 'rgba(225, 29, 72, 0.3)';
  ctx.shadowBlur = 6;

  ctx.scale(1.2, 1.2);
  ctx.beginPath();
  ctx.moveTo(0, 8);
  ctx.bezierCurveTo(-18, -12, -22, -26, 0, -18);
  ctx.bezierCurveTo(22, -26, 18, -12, 0, 8);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawDateBadge(ctx) {
  ctx.save();
  ctx.strokeStyle = '#3F3F46';
  ctx.lineWidth = 2;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';

  ctx.beginPath();
  ctx.roundRect(-65, -18, 130, 36, 18);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#18181B';
  ctx.font = '700 9px "Space Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('• MEMORIES RECORDED •', 0, 4);
  ctx.restore();
}

function drawFilmMark(ctx) {
  ctx.save();
  ctx.fillStyle = '#09090B';
  ctx.strokeStyle = '#FAFAFA';
  ctx.lineWidth = 1;
  ctx.fillRect(-55, -16, 110, 32);
  ctx.strokeRect(-52, -13, 104, 26);

  ctx.fillStyle = '#FAFAFA';
  ctx.font = '700 8px "Space Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('35MM ISO 400 [01]', 0, 4);
  ctx.restore();
}

/**
 * Draws a sticker object instance onto canvas context.
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} sticker
 */
export function renderStickerOnCanvas(ctx, sticker) {
  if (!ctx || !sticker) return;
  const { type, x = 0, y = 0, scale = 1, rotation = 0 } = sticker;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.scale(scale, scale);

  switch (type) {
    case 'washi_cream':
      drawWashi(ctx, 'rgba(247, 240, 222, 0.85)');
      break;
    case 'washi_pink':
      drawWashi(ctx, 'rgba(251, 228, 237, 0.85)');
      break;
    case 'postal_stamp':
      drawPostalStamp(ctx);
      break;
    case 'barcode':
      drawBarcode(ctx);
      break;
    case 'sparkle_star':
      drawSparkle(ctx);
      break;
    case 'heart_doodle':
      drawHeart(ctx);
      break;
    case 'date_badge':
      drawDateBadge(ctx);
      break;
    case 'film_mark':
      drawFilmMark(ctx);
      break;
    default:
      drawWashi(ctx);
      break;
  }

  ctx.restore();
}
