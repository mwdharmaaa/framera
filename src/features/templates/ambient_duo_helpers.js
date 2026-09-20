/**
 * Layout Coordinates and Card Renderers for Ambient Headphone Duo Card (9:16, 736x1308).
 * Features darkened full-bleed backdrop and floating rounded card with Spotify badging.
 */

export const AMBIENT_DUO_SLOTS = [
  { id: 0, name: 'Ambient Backdrop Photo', x: 0, y: 0, w: 736, h: 1308 },
  { id: 1, name: 'Floating Feature Card', x: 138, y: 470, w: 460, h: 320, r: 18 }
];

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

export function renderDarkenedBackdrop(ctx, photo, cw, ch) {
  if (!ctx) return;
  ctx.save();
  ctx.fillStyle = '#0a0c10';
  ctx.fillRect(0, 0, cw, ch);

  if (photo) {
    const iw = photo.naturalWidth || photo.width || cw;
    const ih = photo.naturalHeight || photo.height || ch;
    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    ctx.save();
    ctx.filter = 'brightness(55%) contrast(110%) saturate(85%)';
    try {
      ctx.drawImage(photo, dx, dy, dw, dh);
    } catch {
      // Safe fallback for unit tests
    }
    ctx.restore();
  }

  // Dark atmospheric scrim gradient
  const scrim = ctx.createLinearGradient(0, 0, 0, ch);
  scrim.addColorStop(0, 'rgba(0, 0, 0, 0.35)');
  scrim.addColorStop(0.5, 'rgba(0, 0, 0, 0.45)');
  scrim.addColorStop(1, 'rgba(0, 0, 0, 0.65)');
  ctx.fillStyle = scrim;
  ctx.fillRect(0, 0, cw, ch);
  ctx.restore();
}

export function renderFloatingCard(ctx, photo, slot, caption = 'Spotify') {
  if (!ctx) return;
  const { x, y, w, h, r } = slot;

  ctx.save();
  // Deep card floating shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
  ctx.shadowBlur = 32;
  ctx.shadowOffsetY = 16;

  drawRoundedRect(ctx, x, y, w, h, r);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.shadowColor = 'transparent';

  // Render photo inside rounded card
  if (photo) {
    ctx.save();
    drawRoundedRect(ctx, x, y, w, h, r);
    ctx.clip();

    const iw = photo.naturalWidth || photo.width || w;
    const ih = photo.naturalHeight || photo.height || h;
    const scale = Math.max(w / iw, h / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = x + (w - dw) / 2;
    const dy = y + (h - dh) / 2;

    try {
      ctx.drawImage(photo, dx, dy, dw, dh);
    } catch {
      // Safe fallback for tests
    }

    // Bottom gradient for metadata legibility
    const cardScrim = ctx.createLinearGradient(0, y + h - 55, 0, y + h);
    cardScrim.addColorStop(0, 'rgba(0, 0, 0, 0)');
    cardScrim.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
    ctx.fillStyle = cardScrim;
    ctx.fillRect(x, y + h - 55, w, 55);

    ctx.restore();
  }

  // Card white hairline border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 1;
  drawRoundedRect(ctx, x, y, w, h, r);
  ctx.stroke();

  // Spotify badge on bottom-left of card
  drawSpotifyBadge(ctx, x + 24, y + h - 22, caption);
  ctx.restore();
}

export function drawSpotifyBadge(ctx, x, y, title = 'Spotify') {
  if (!ctx) return;
  ctx.save();
  // Spotify green icon
  ctx.fillStyle = '#1ed760';
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, Math.PI * 2);
  ctx.fill();

  // 3 sound waves
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1.6;
  ctx.lineCap = 'round';
  for (let i = 0; i < 3; i++) {
    const r = 4 + i * 2.2;
    const arcY = y - 1 + i * 2.2;
    ctx.beginPath();
    ctx.arc(x, arcY, r, 1.25 * Math.PI, 1.75 * Math.PI);
    ctx.stroke();
  }

  // Label
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 13px "Poppins", sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(title, x + 16, y);
  ctx.restore();
}
