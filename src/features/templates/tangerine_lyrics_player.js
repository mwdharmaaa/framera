/**
 * Spotify Lyrics Card Vector Renderer for Tangerine Sunset Lyrics Duo Template.
 * Reproduces the iconic cerulean blue Spotify Lyrics card with track info, lyrics, and Spotify branding.
 */

function drawRoundedRectPath(ctx, x, y, w, h, r) {
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

function drawSpotifyLogo(ctx, cx, cy, radius = 9) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = '#0f172a';
  ctx.fill();

  // 3 soundwave curves
  ctx.strokeStyle = '#048db7';
  ctx.lineWidth = 1.6;
  ctx.lineCap = 'round';

  for (let i = 0; i < 3; i++) {
    const r = radius * (0.42 + i * 0.22);
    ctx.beginPath();
    ctx.arc(cx, cy + radius * 0.15, r, -Math.PI * 0.72, -Math.PI * 0.28);
    ctx.stroke();
  }
  ctx.restore();
}

export const DEFAULT_LYRICS = [
  'O que a gente acha que é',
  'presente de Deus',
  'Às vezes veio do inferno',
  'pra te ferrar'
];

/**
 * Renders the floating blue Spotify lyrics card.
 */
export function drawSpotifyLyricsCard(ctx, x = 478, y = 572, w = 230, h = 230, track = 'presente de d', artist = 'Link do Zap, EF', lyricsLines = DEFAULT_LYRICS) {
  if (!ctx) return;
  ctx.save();

  // 1. Soft contact drop shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.32)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetX = -2;
  ctx.shadowOffsetY = 8;

  // 2. Cerulean blue background
  drawRoundedRectPath(ctx, x, y, w, h, 8);
  ctx.fillStyle = '#048db7';
  ctx.fill();

  ctx.shadowColor = 'transparent';

  // 3. Album Art Thumbnail (top-left)
  const thumbX = x + 14;
  const thumbY = y + 14;
  const thumbSize = 22;

  drawRoundedRectPath(ctx, thumbX, thumbY, thumbSize, thumbSize, 3);
  const thumbGrad = ctx.createLinearGradient(thumbX, thumbY, thumbX + thumbSize, thumbY + thumbSize);
  thumbGrad.addColorStop(0, '#f97316');
  thumbGrad.addColorStop(1, '#eab308');
  ctx.fillStyle = thumbGrad;
  ctx.fill();

  // 4. Track metadata
  ctx.fillStyle = '#0f172a';
  ctx.font = '700 9px "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText((track || 'presente de d').slice(0, 22), thumbX + thumbSize + 7, thumbY + 1);

  ctx.font = '500 8px "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
  ctx.fillText((artist || 'Link do Zap, EF').slice(0, 24), thumbX + thumbSize + 7, thumbY + 12);

  // 5. Lyrics lines (bold black)
  const lines = Array.isArray(lyricsLines) && lyricsLines.length > 0 ? lyricsLines : DEFAULT_LYRICS;
  const lyricsStartY = y + 54;
  const lineSpacing = 22;

  ctx.fillStyle = '#0f172a';
  ctx.font = '800 13.5px "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.textBaseline = 'top';

  lines.slice(0, 4).forEach((line, idx) => {
    ctx.fillText(line, thumbX, lyricsStartY + idx * lineSpacing);
  });

  // 6. Spotify footer logo & text
  const logoY = y + h - 18;
  drawSpotifyLogo(ctx, thumbX + 6, logoY, 7);

  ctx.font = '600 10px "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = '#0f172a';
  ctx.textBaseline = 'middle';
  ctx.fillText('Spotify', thumbX + 17, logoY);

  ctx.restore();
}
