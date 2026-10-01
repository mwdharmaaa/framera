/**
 * Vector Decorations and Disc Renderers for Sparkle Vinyl Cascade Trio Template (9:16, 736x1308).
 * Features realistic 33 RPM LP vinyl record with fine grooves, center album label, and track typography.
 */

/**
 * Renders a rounded rectangle path on the 2D context.
 */
export function drawRoundedRect(ctx, x, y, w, h, r) {
  if (!ctx) return;
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
}

/**
 * Draws a realistic grooved black vinyl record disc with circular center label and song typography.
 */
export function drawVinylRecord(ctx, cx, cy, radius, labelImg, caption, subtitle) {
  if (!ctx) return;
  ctx.save();

  // 1. Soft contact drop shadow behind vinyl record
  ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 8;

  // 2. Vinyl black base disc
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = '#141416';
  ctx.fill();

  ctx.shadowColor = 'transparent';

  // 3. Concentric micro-grooves
  ctx.lineWidth = 1;
  for (let r = 44; r < radius - 3; r += 4.5) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = r % 9 === 0 ? 'rgba(255, 255, 255, 0.14)' : 'rgba(255, 255, 255, 0.04)';
    ctx.stroke();
  }

  // 4. Subtle dual specular light sheen reflection across vinyl
  const sheenGrad = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius);
  sheenGrad.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
  sheenGrad.addColorStop(0.35, 'rgba(255, 255, 255, 0)');
  sheenGrad.addColorStop(0.65, 'rgba(255, 255, 255, 0)');
  sheenGrad.addColorStop(1, 'rgba(255, 255, 255, 0.08)');
  ctx.fillStyle = sheenGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  // 5. Center circular album art label
  const labelRadius = 36;
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, labelRadius, 0, Math.PI * 2);
  ctx.clip();

  // Warm golden amber base for center label
  const labelGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, labelRadius);
  labelGrad.addColorStop(0, '#caa266');
  labelGrad.addColorStop(0.7, '#8f5c2c');
  labelGrad.addColorStop(1, '#4a2b10');
  ctx.fillStyle = labelGrad;
  ctx.fillRect(cx - labelRadius, cy - labelRadius, labelRadius * 2, labelRadius * 2);

  if (labelImg) {
    const iw = labelImg.naturalWidth || labelImg.width || labelRadius * 2;
    const ih = labelImg.naturalHeight || labelImg.height || labelRadius * 2;
    const scale = Math.max((labelRadius * 2) / iw, (labelRadius * 2) / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = cx - dw / 2;
    const dy = cy - dh / 2;
    try {
      ctx.drawImage(labelImg, dx, dy, dw, dh);
      // Warm amber scrim over label artwork for vintage analog coherence
      ctx.fillStyle = 'rgba(165, 95, 30, 0.25)';
      ctx.fillRect(cx - labelRadius, cy - labelRadius, labelRadius * 2, labelRadius * 2);
    } catch {
      // Safe fallback
    }
  }

  // Spindle center hole
  ctx.beginPath();
  ctx.arc(cx, cy, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#0a0a0c';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.restore();

  // 6. Track title and artist typography centered directly below the vinyl disc
  const titleText = caption || 'Sparkle';
  const artistText = subtitle || 'Jesse Barrera';

  const textY = cy + radius + 18;
  ctx.font = '600 13px "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
  ctx.shadowBlur = 6;
  ctx.fillText(titleText, cx, textY);

  ctx.font = '400 11px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.78)';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
  ctx.shadowBlur = 4;
  ctx.fillText(artistText, cx, textY + 15);

  ctx.restore();
}
