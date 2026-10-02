/**
 * Renders atmospheric top and bottom gradient vignettes for Instagram Story overlay.
 */
export function renderStoryVignettes(ctx, cw, ch) {
  ctx.save();
  // Top vignette
  const topGrad = ctx.createLinearGradient(0, 0, 0, 150);
  topGrad.addColorStop(0, 'rgba(15, 12, 10, 0.45)');
  topGrad.addColorStop(0.55, 'rgba(15, 12, 10, 0.18)');
  topGrad.addColorStop(1, 'rgba(15, 12, 10, 0)');
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, cw, 150);

  // Bottom vignette
  const bottomGrad = ctx.createLinearGradient(0, ch - 170, 0, ch);
  bottomGrad.addColorStop(0, 'rgba(15, 12, 10, 0)');
  bottomGrad.addColorStop(0.5, 'rgba(15, 12, 10, 0.22)');
  bottomGrad.addColorStop(1, 'rgba(15, 12, 10, 0.48)');
  ctx.fillStyle = bottomGrad;
  ctx.fillRect(0, ch - 170, cw, 170);
  ctx.restore();
}

/**
 * Renders the top Instagram Story music header sticker with avatar, equalizer, and dismiss chevron.
 */
export function renderStoryHeader(ctx, caption, subtitle, avatarPhoto) {
  ctx.save();
  const title = caption || 'Clementine';
  const artist = subtitle || 'grentperez';

  // 1. Profile avatar circle
  const avX = 36;
  const avY = 32;
  const avR = 14;

  ctx.beginPath();
  ctx.arc(avX, avY, avR + 2, 0, Math.PI * 2);
  ctx.strokeStyle = '#e85a3a';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.save();
  ctx.beginPath();
  ctx.arc(avX, avY, avR, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = '#f2a679';
  ctx.fillRect(avX - avR, avY - avR, avR * 2, avR * 2);
  if (avatarPhoto) {
    try {
      ctx.drawImage(avatarPhoto, avX - avR, avY - avR, avR * 2, avR * 2);
    } catch {
      // Safe fallback
    }
  }
  ctx.restore();

  // 2. Equalizer bars
  const eqX = 64;
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 4;
  const bars = [14, 8, 12];
  bars.forEach((h, i) => {
    ctx.fillRect(eqX + i * 5, avY - h / 2, 2.5, h);
  });

  // 3. Song · Artist >
  ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`${artist} · ${title}  ›`, eqX + 20, avY + 4.5);

  // 4. Right dismiss chevron
  ctx.font = '300 18px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('⌄', 702, avY + 4);
  ctx.restore();
}

/**
 * Renders the translucent "Say something..." story input capsule at the bottom.
 */
export function renderStoryInputBar(ctx, cw, ch) {
  ctx.save();
  const x = 24;
  const y = ch - 76;
  const w = cw - 48;
  const h = 44;
  const r = 22;

  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.rect(x, y, w, h);
  }
  ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.font = '400 13px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.fillText('Say something...', x + 20, y + 27);
  ctx.restore();
}
