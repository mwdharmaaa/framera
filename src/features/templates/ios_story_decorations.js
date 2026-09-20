/**
 * iOS Interface Decorations and Visual Badges for iOS Share Sheet Story Template.
 * Handles sheet drawer background, header label, blue checkmark badges, heart icon, and home indicator.
 */

export function renderSheetContainer(ctx, sheetY, cw, ch, caption = '3 Photos Selected') {
  if (!ctx) return;
  ctx.save();

  // White / translucent iOS share sheet container
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, sheetY, cw, ch - sheetY);

  // Hairline top border separator
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, sheetY);
  ctx.lineTo(cw, sheetY);
  ctx.stroke();

  // Title: '3 Photos Selected' (or custom text from state)
  ctx.fillStyle = '#1c1c1e';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '600 15px "Poppins", sans-serif';
  ctx.fillText(caption, cw / 2, sheetY + 27);

  ctx.restore();
}

export function drawCheckmarkBadge(ctx, cx, cy) {
  if (!ctx) return;
  ctx.save();

  // Vibrant iOS Blue circle
  ctx.fillStyle = '#007aff';
  ctx.beginPath();
  ctx.arc(cx, cy, 11, 0, Math.PI * 2);
  ctx.fill();

  // Hairline white ring
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.4;
  ctx.stroke();

  // White checkmark icon
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.8;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - 3.8, cy + 0.2);
  ctx.lineTo(cx - 1, cy + 3.4);
  ctx.lineTo(cx + 4.2, cy - 3.2);
  ctx.stroke();

  ctx.restore();
}

export function drawHeartBadge(ctx, cx, cy) {
  if (!ctx) return;
  ctx.save();

  // Subtle shadow for legibility over bright imagery
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetY = 1;

  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  const s = 6.5;
  ctx.beginPath();
  ctx.moveTo(cx, cy + s * 0.4);
  ctx.bezierCurveTo(cx - s * 0.7, cy - s * 0.5, cx - s * 1.1, cy + s * 0.2, cx, cy + s * 1.1);
  ctx.bezierCurveTo(cx + s * 1.1, cy + s * 0.2, cx + s * 0.7, cy - s * 0.5, cx, cy + s * 0.4);
  ctx.fill();

  ctx.restore();
}

export function drawHomeIndicator(ctx, cx, cy) {
  if (!ctx) return;
  ctx.save();
  ctx.fillStyle = '#000000';
  const w = 138;
  const h = 5;
  const r = 2.5;

  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(cx - w / 2, cy - h / 2, w, h, r);
  } else {
    ctx.rect(cx - w / 2, cy - h / 2, w, h);
  }
  ctx.fill();
  ctx.restore();
}
