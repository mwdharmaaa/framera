/**
 * Helper routines and slot geometry for Kraken Eyes Abyssal Slit template (9:16, 736x1308).
 * Handles noir matte background, slit photo cover rendering, and atmospheric typography.
 */

export const KRAKEN_EYES_SLOTS = [
  { id: 0, name: 'Eye Slit Window', x: 0, y: 485, w: 736, h: 374 }
];

export function renderNoirBackground(ctx, cw, ch) {
  if (!ctx) return;
  ctx.save();
  const grad = ctx.createRadialGradient(cw / 2, ch / 2, 100, cw / 2, ch / 2, ch * 0.7);
  grad.addColorStop(0, '#13161c');
  grad.addColorStop(1, '#090a0d');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, cw, ch);
  ctx.restore();
}

export function renderSlitPhoto(ctx, photo, slot) {
  if (!ctx || !slot) return;
  const { x, y, w, h } = slot;

  ctx.save();
  ctx.fillStyle = '#08080c';
  ctx.fillRect(x, y, w, h);

  if (photo) {
    const iw = photo.naturalWidth || photo.width || w;
    const ih = photo.naturalHeight || photo.height || h;
    const scale = Math.max(w / iw, h / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = x + (w - dw) / 2;
    const dy = y + (h - dh) / 2;

    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();
    try {
      ctx.drawImage(photo, dx, dy, dw, dh);
    } catch {
      // Fallback for mock environments
    }
    ctx.restore();
  }

  // Abyssal boundary hairline borders
  ctx.strokeStyle = '#2d224d';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w, y);
  ctx.moveTo(x, y + h);
  ctx.lineTo(x + w, y + h);
  ctx.stroke();

  ctx.restore();
}

export function renderSlitTypography(ctx, state, cw, ch) {
  if (!ctx) return;
  ctx.save();

  const caption = (state?.caption || 'KRAKEN // EYE SLIT').toUpperCase();
  const subtitle = state?.subtitle || '深淵の眼光 - ABYSSAL GAZE';
  const date = state?.date || 'NOIR // 2026';

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Top header subtitle / category
  ctx.font = '600 11px "Courier New", monospace, sans-serif';
  ctx.fillStyle = 'rgba(183, 148, 244, 0.65)';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '3px';
  ctx.fillText(date, cw / 2, 210);

  // Main header title
  ctx.font = '700 18px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = '#f7fafc';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '5px';
  ctx.fillText(caption, cw / 2, 236);

  // Bottom footer tag
  ctx.font = '500 11px "Courier New", monospace, sans-serif';
  ctx.fillStyle = 'rgba(216, 180, 254, 0.6)';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '2.5px';
  ctx.fillText(subtitle, cw / 2, 1140);

  // Abyssal trench coordinates
  ctx.font = '400 10px monospace';
  ctx.fillStyle = 'rgba(160, 174, 192, 0.45)';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '2px';
  ctx.fillText('SECTOR 07 // DEPTH 8,400M // 9:16 VERTICAL', cw / 2, 1162);

  ctx.restore();
}
