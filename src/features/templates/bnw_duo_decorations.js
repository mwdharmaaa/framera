/**
 * Visual decorations for Analog B&W Duo Prints template (9:16, 736x1308).
 * Provides vintage photo paper frame with drop shadows, worn paper corners,
 * and silver gelatin analog film dust specks.
 */

const SILVER_GELATIN_SPECKS = [
  [65, 45, 1.1, 0.35], [180, 110, 0.8, 0.3], [310, 85, 1.3, 0.4], [480, 140, 0.9, 0.3],
  [590, 70, 1.2, 0.35], [120, 230, 0.7, 0.25], [260, 310, 1.0, 0.35], [410, 280, 1.4, 0.4],
  [540, 350, 0.8, 0.25], [90, 390, 1.1, 0.3], [340, 410, 1.2, 0.35], [610, 395, 0.9, 0.3]
];

export function drawCardPaperFrame(ctx, x, y, w, h) {
  if (!ctx) return;
  ctx.save();

  // Multi-tier realistic ambient and contact drop shadows
  ctx.shadowColor = 'rgba(0, 0, 0, 0.14)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 8;

  // Solid white vintage photo paper backing
  ctx.fillStyle = '#fdfdfb';
  ctx.fillRect(x, y, w, h);

  // Second layer contact shadow line at bottom
  ctx.shadowColor = 'rgba(0, 0, 0, 0.06)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetY = 2;
  ctx.fillRect(x, y, w, h);

  // Subtle paper edge border
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, w, h);

  ctx.restore();
}

export function drawWornPaperCorner(ctx, cardX, cardY, cardW) {
  if (!ctx) return;
  ctx.save();

  // Subtle folded corner / paper crease at top-right
  const cornerX = cardX + cardW;
  const cornerY = cardY;
  const foldSize = 12;

  ctx.beginPath();
  ctx.moveTo(cornerX - foldSize, cornerY);
  ctx.lineTo(cornerX, cornerY + foldSize);
  ctx.lineTo(cornerX - foldSize, cornerY + foldSize);
  ctx.closePath();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(cornerX - foldSize, cornerY);
  ctx.lineTo(cornerX, cornerY + foldSize);
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.12)';
  ctx.lineWidth = 0.8;
  ctx.stroke();

  ctx.restore();
}

export function drawSilverGelatinDust(ctx, slotX, slotY, slotW, slotH) {
  if (!ctx) return;
  ctx.save();
  ctx.beginPath();
  ctx.rect(slotX, slotY, slotW, slotH);
  ctx.clip();

  // White dust specks
  ctx.fillStyle = '#ffffff';
  SILVER_GELATIN_SPECKS.forEach(([rx, ry, r, a]) => {
    const px = slotX + (rx % slotW);
    const py = slotY + (ry % slotH);
    ctx.globalAlpha = a * 0.7;
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fill();
  });

  // Dark microscopic grain specks
  ctx.fillStyle = '#000000';
  SILVER_GELATIN_SPECKS.forEach(([rx, ry, r, a]) => {
    const px = slotX + ((rx + 115) % slotW);
    const py = slotY + ((ry + 75) % slotH);
    ctx.globalAlpha = a * 0.4;
    ctx.beginPath();
    ctx.arc(px, py, r * 0.7, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}
