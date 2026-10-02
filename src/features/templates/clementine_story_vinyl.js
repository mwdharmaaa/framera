/**
 * Renders the soft warm floral orange petals behind the vinyl record.
 */
export function renderFloralArt(ctx, x, y, w, h) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();

  const cx = x + w / 2;
  const cy = y + h / 2;

  // Soft warm peach/orange gradient atmosphere
  const grad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 170);
  grad.addColorStop(0, '#f7b070');
  grad.addColorStop(0.4, '#e78b54');
  grad.addColorStop(0.8, '#d87742');
  grad.addColorStop(1, '#eae3c6');
  ctx.fillStyle = grad;
  ctx.fillRect(x, y, w, h);

  // Soft lily petal silhouettes
  ctx.fillStyle = 'rgba(235, 115, 60, 0.35)';
  for (let i = 0; i < 5; i++) {
    const angle = (i * Math.PI * 2) / 5;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.ellipse(0, -90, 36, 80, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

/**
 * Renders realistic black vinyl LP record disc with concentric grooves and center label.
 */
export function renderVinylDisc(ctx, cx, cy, radius, labelPhoto, caption, subtitle) {
  ctx.save();

  // 1. Subtle drop shadow
  ctx.shadowColor = 'rgba(20, 15, 10, 0.45)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 8;

  // 2. Vinyl black base
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = '#141416';
  ctx.fill();

  ctx.shadowColor = 'transparent';

  // 3. Concentric grooves
  ctx.lineWidth = 1.2;
  for (let r = 52; r < radius - 4; r += 5.5) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = r % 11 === 0 ? 'rgba(255, 255, 255, 0.16)' : 'rgba(255, 255, 255, 0.05)';
    ctx.stroke();
  }

  // 4. Center label (radius 44)
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, 44, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = '#f8f1de';
  ctx.fillRect(cx - 44, cy - 44, 88, 88);

  if (labelPhoto) {
    try {
      ctx.drawImage(labelPhoto, cx - 44, cy - 44, 88, 88);
    } catch {
      // Safe fallback
    }
  }

  // Label Title
  ctx.font = '700 11px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#d85d2a';
  ctx.fillText(caption ? String(caption).slice(0, 14) : 'Clementine', cx, cy - 12);

  // Spindle hole
  ctx.beginPath();
  ctx.arc(cx, cy, 6, 0, Math.PI * 2);
  ctx.fillStyle = '#111111';
  ctx.fill();
  ctx.strokeStyle = '#c2baa6';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();

  // 5. Song Title & Artist below vinyl
  const textY = cy + radius + 20;
  ctx.font = '700 13px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 4;
  ctx.fillText(caption || 'Clementine', cx, textY);

  ctx.font = '400 11px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.fillText(subtitle || 'grentperez', cx, textY + 16);

  ctx.restore();
}
