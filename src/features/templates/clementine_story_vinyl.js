/**
 * Renders the soft warm floral orange botanical art behind the vinyl record.
 */
export function renderFloralArt(ctx, x, y, w, h) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();

  const cx = x + w / 2;
  const cy = y + h / 2 - 14;

  // Soft warm peach ambient glow
  const glow = ctx.createRadialGradient(cx, cy, 20, cx, cy, 185);
  glow.addColorStop(0, 'rgba(252, 178, 126, 0.95)');
  glow.addColorStop(0.35, 'rgba(240, 138, 86, 0.75)');
  glow.addColorStop(0.7, 'rgba(230, 110, 64, 0.32)');
  glow.addColorStop(1, 'rgba(234, 227, 198, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(x, y, w, h);

  // Layered soft lily / peach botanical petals spreading gracefully
  const petalCount = 8;
  for (let i = 0; i < petalCount; i++) {
    const angle = (i * Math.PI * 2) / petalCount + 0.18;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    const petalGrad = ctx.createLinearGradient(0, 0, 0, -170);
    petalGrad.addColorStop(0, 'rgba(242, 125, 70, 0.65)');
    petalGrad.addColorStop(0.5, 'rgba(244, 162, 114, 0.45)');
    petalGrad.addColorStop(0.85, 'rgba(238, 190, 150, 0.22)');
    petalGrad.addColorStop(1, 'rgba(234, 227, 198, 0.02)');

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-46, -55, -42, -145, 0, -172);
    ctx.bezierCurveTo(42, -145, 46, -55, 0, 0);
    ctx.fillStyle = petalGrad;
    ctx.fill();

    // Central delicate petal vein
    ctx.beginPath();
    ctx.moveTo(0, -12);
    ctx.lineTo(0, -140);
    ctx.strokeStyle = 'rgba(205, 88, 42, 0.32)';
    ctx.lineWidth = 1.3;
    ctx.stroke();

    ctx.restore();
  }

  // Botanical stamens radiating outward
  ctx.save();
  ctx.translate(cx, cy);
  for (let s = 0; s < 6; s++) {
    const sAngle = (s * Math.PI * 2) / 6 + 0.25;
    const sx = Math.cos(sAngle) * 45;
    const sy = Math.sin(sAngle) * 45;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(sx, sy);
    ctx.strokeStyle = 'rgba(175, 70, 28, 0.48)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(sx, sy, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(155, 55, 18, 0.65)';
    ctx.fill();
  }
  ctx.restore();

  ctx.restore();
}

/**
 * Renders realistic black vinyl LP record disc with concentric grooves and center label.
 */
export function renderVinylDisc(ctx, cx, cy, radius, labelPhoto, caption, subtitle) {
  ctx.save();

  // 1. Drop shadow for depth
  ctx.shadowColor = 'rgba(25, 20, 15, 0.48)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 8;

  // 2. Vinyl black base
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = '#141416';
  ctx.fill();

  ctx.shadowColor = 'transparent';

  // 3. Concentric micro grooves
  ctx.lineWidth = 1.2;
  for (let r = 50; r < radius - 4; r += 5.5) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = r % 11 === 0 ? 'rgba(255, 255, 255, 0.16)' : 'rgba(255, 255, 255, 0.05)';
    ctx.stroke();
  }

  // 4. Center label (radius 42)
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, 42, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = '#fbf5e5';
  ctx.fillRect(cx - 42, cy - 42, 84, 84);

  if (labelPhoto) {
    try {
      ctx.drawImage(labelPhoto, cx - 42, cy - 42, 84, 84);
      // Clean soft cream wash over photo for contrast
      ctx.fillStyle = 'rgba(251, 245, 229, 0.42)';
      ctx.fillRect(cx - 42, cy - 42, 84, 84);
    } catch {
      // Safe fallback
    }
  }

  // Inner ring on label
  ctx.beginPath();
  ctx.arc(cx, cy, 38, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(195, 82, 34, 0.45)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Label Title
  ctx.font = '700 11px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#b84418';
  ctx.fillText(caption ? String(caption).slice(0, 14) : 'Clementine', cx, cy - 10);

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
  const textY = cy + radius + 19;
  ctx.font = '700 13px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
  ctx.shadowBlur = 6;
  ctx.fillText(caption || 'Clementine', cx, textY);

  ctx.font = '400 11px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.fillText(subtitle || 'grentperez', cx, textY + 15);

  ctx.restore();
}
