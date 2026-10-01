/**
 * Vector Decorations and Polaroid Card Renderers for Coastal Polaroid Story Template (9:16, 736x1308).
 * Features realistic floating white polaroid card, audio signature icons, and typography.
 */

/**
 * Draws a rounded rectangle path on the 2D context.
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
 * Draws a clean vector headphone icon onto the context.
 */
export function drawHeadphoneIcon(ctx, cx, cy, size = 18) {
  if (!ctx) return;
  ctx.save();
  ctx.translate(cx, cy);

  ctx.strokeStyle = '#18181b';
  ctx.lineWidth = 1.8;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const r = size * 0.42;

  // Headband arch
  ctx.beginPath();
  ctx.arc(0, 0, r, Math.PI, 0, false);
  ctx.stroke();

  // Left ear-cup
  const cupW = size * 0.22;
  const cupH = size * 0.38;
  const cupR = 2.5;
  drawRoundedRect(ctx, -r - cupW * 0.5, 0, cupW, cupH, cupR);
  ctx.fillStyle = '#18181b';
  ctx.fill();

  // Right ear-cup
  drawRoundedRect(ctx, r - cupW * 0.5, 0, cupW, cupH, cupR);
  ctx.fill();

  ctx.restore();
}

/**
 * Draws aesthetic icons (headphone, star, sparkle, degree dot) and signature handle.
 */
export function drawPolaroidFooter(ctx, x, y, w, caption = '@imzzum') {
  if (!ctx) return;
  ctx.save();

  // 1. Icon group row
  const startX = x + 18;
  const iconY = y + 14;

  // Headphone icon
  drawHeadphoneIcon(ctx, startX + 9, iconY + 2, 17);

  // Star, sparkle, degree glyphs
  ctx.fillStyle = '#18181b';
  ctx.font = '16px "Segoe UI Symbol", "Apple Symbols", sans-serif';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillText('★ ⋆ °', startX + 26, iconY + 3);

  // 2. Handle / Caption text
  const cleanCaption = (caption || '@imzzum').trim();
  ctx.font = '500 14px "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = '#27272a';
  ctx.fillText(cleanCaption, startX + 78, iconY + 4);

  ctx.restore();
}
