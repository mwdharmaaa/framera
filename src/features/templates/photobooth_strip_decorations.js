/**
 * Vintage Paper Texture and Editorial Telemetry Overlays for Photobooth Strip.
 * Handles procedural aged parchment, strip elevation shadow, and vintage footer typography.
 */

export function renderStripShadow(ctx, stripX, stripH) {
  if (!ctx) return;
  ctx.save();
  const shadowGrad = ctx.createLinearGradient(stripX - 16, 0, stripX, 0);
  shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  shadowGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.25)');
  shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0.55)');
  ctx.fillStyle = shadowGrad;
  ctx.fillRect(stripX - 16, 0, 16, stripH);
  ctx.restore();
}

export function renderParchmentTexture(ctx, sx, sy, sw, sh) {
  if (!ctx) return;
  ctx.save();

  // Base vintage aged cream gradient
  const bgGrad = ctx.createLinearGradient(sx, sy, sx + sw, sy + sh);
  bgGrad.addColorStop(0, '#f9f3e7');
  bgGrad.addColorStop(0.3, '#f5ecd8');
  bgGrad.addColorStop(0.7, '#f2e6cf');
  bgGrad.addColorStop(1, '#ebe0c5');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(sx, sy, sw, sh);

  // Subtle weathered vignette at the bottom corners
  const cornerGrad = ctx.createLinearGradient(sx, sy + sh - 220, sx, sy + sh);
  cornerGrad.addColorStop(0, 'rgba(180, 150, 110, 0)');
  cornerGrad.addColorStop(0.7, 'rgba(175, 145, 105, 0.12)');
  cornerGrad.addColorStop(1, 'rgba(150, 120, 80, 0.25)');
  ctx.fillStyle = cornerGrad;
  ctx.fillRect(sx, sy + sh - 220, sw, 220);

  // Left edge crease line
  ctx.strokeStyle = 'rgba(140, 110, 75, 0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.lineTo(sx, sy + sh);
  ctx.stroke();

  ctx.restore();
}

export function renderStripFooter(ctx, sx, sy, sw, sh, state = {}) {
  if (!ctx) return;
  ctx.save();

  const footerTop = sy + 1120;
  const centerX = sx + sw / 2;

  // Thin vintage separator hairline
  ctx.strokeStyle = 'rgba(120, 95, 65, 0.35)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(sx + 36, footerTop);
  ctx.lineTo(sx + sw - 36, footerTop);
  ctx.stroke();

  // Vintage serial barcode lines
  const barY = footerTop + 14;
  const barH = 22;
  const bars = [2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 3, 1, 2];
  let curX = centerX - 60;
  ctx.fillStyle = 'rgba(70, 55, 40, 0.65)';
  bars.forEach((w) => {
    ctx.fillRect(curX, barY, w, barH);
    curX += w + 4;
  });

  // Telemetry Labels (Typewriter / Space Mono aesthetic)
  const caption = (state?.caption || 'PHOTOBOOTH').toUpperCase();
  const subtitle = (state?.subtitle || 'STUDIO ARCHIVE').toUpperCase();
  const dateStr = (state?.date || 'NO. 0824 // 2026').toUpperCase();

  ctx.fillStyle = '#3c3022';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  ctx.font = '700 13px "Space Mono", monospace';
  ctx.fillText(caption, centerX, footerTop + 46);

  ctx.fillStyle = 'rgba(60, 48, 34, 0.75)';
  ctx.font = '500 11px "Space Mono", monospace';
  ctx.fillText(subtitle, centerX, footerTop + 66);

  ctx.fillStyle = 'rgba(80, 65, 48, 0.55)';
  ctx.font = '400 10px "Space Mono", monospace';
  ctx.fillText(dateStr, centerX, footerTop + 84);

  // Decorative corner registration crosses
  ctx.strokeStyle = 'rgba(100, 80, 55, 0.3)';
  ctx.lineWidth = 1;
  const drawCross = (cx, cy) => {
    ctx.beginPath();
    ctx.moveTo(cx - 5, cy);
    ctx.lineTo(cx + 5, cy);
    ctx.moveTo(cx, cy - 5);
    ctx.lineTo(cx, cy + 5);
    ctx.stroke();
  };
  drawCross(sx + 24, sy + sh - 24);
  drawCross(sx + sw - 24, sy + sh - 24);

  ctx.restore();
}
