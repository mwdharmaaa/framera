/**
 * WhatsApp Dark Chat Trio Layout Coordinates and Canvas Drawing Routines.
 * Canvas resolution: 736 x 1308 (native 9:16).
 */

export const WHATSAPP_CARD_SLOTS = [
  { id: 0, name: 'Top Message', x: 148, y: 115, w: 480, h: 295, r: 16, time: '1:57 AM' },
  { id: 1, name: 'Middle Message', x: 148, y: 440, w: 480, h: 320, r: 16, time: '1:57 AM' },
  { id: 2, name: 'Bottom Message', x: 148, y: 790, w: 480, h: 320, r: 16, time: '1:57 AM' }
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

export function renderChatMessageCard(ctx, photo, slot, timeText = '1:57 AM') {
  if (!ctx || !photo) return;
  const { x, y, w, h, r } = slot;

  ctx.save();
  // Card outer glow and border
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 6;

  drawRoundedRect(ctx, x, y, w, h, r);
  ctx.fillStyle = '#0b141a';
  ctx.fill();
  ctx.shadowColor = 'transparent';

  // Photo clipping window
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
    // Graceful fallback for mock tests
  }

  // Subtle dark gradient vignette for bottom timestamp legibility
  const vig = ctx.createLinearGradient(0, y + h - 60, 0, y + h);
  vig.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vig.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
  ctx.fillStyle = vig;
  ctx.fillRect(x, y + h - 60, w, 60);

  ctx.restore();

  // Emerald border outline
  ctx.strokeStyle = '#275240';
  ctx.lineWidth = 1.5;
  drawRoundedRect(ctx, x, y, w, h, r);
  ctx.stroke();

  // Forward arrow icon pill on left
  ctx.fillStyle = 'rgba(17, 27, 33, 0.75)';
  ctx.beginPath();
  ctx.arc(x - 32, y + h / 2, 18, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#8696a0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - 38, y + h / 2);
  ctx.lineTo(x - 26, y + h / 2);
  ctx.lineTo(x - 30, y + h / 2 - 5);
  ctx.moveTo(x - 26, y + h / 2);
  ctx.lineTo(x - 30, y + h / 2 + 5);
  ctx.stroke();

  // Timestamp and double checkmark
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.font = '500 13px "Space Mono", monospace, sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.fillText(timeText, x + w - 38, y + h - 18);

  // Double cyan checkmarks
  ctx.strokeStyle = '#53bdeb';
  ctx.lineWidth = 1.8;
  const checkX = x + w - 24;
  const checkY = y + h - 18;
  ctx.beginPath();
  ctx.moveTo(checkX - 10, checkY);
  ctx.lineTo(checkX - 6, checkY + 4);
  ctx.lineTo(checkX, checkY - 4);
  ctx.moveTo(checkX - 5, checkY);
  ctx.lineTo(checkX - 1, checkY + 4);
  ctx.lineTo(checkX + 5, checkY - 4);
  ctx.stroke();

  ctx.restore();
}

export function renderChatHeader(ctx, title = 'Message yourself', cw = 736) {
  if (!ctx) return;
  ctx.save();
  ctx.fillStyle = '#202c33';
  ctx.fillRect(0, 0, cw, 75);

  // Back arrow
  ctx.strokeStyle = '#aebac1';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(38, 38); ctx.lineTo(24, 38);
  ctx.moveTo(30, 31); ctx.lineTo(24, 38); ctx.lineTo(30, 45);
  ctx.stroke();

  // Avatar circle
  ctx.fillStyle = '#6b7c85';
  ctx.beginPath();
  ctx.arc(68, 38, 20, 0, Math.PI * 2);
  ctx.fill();

  // Header Title
  ctx.fillStyle = '#e9edef';
  ctx.font = '600 17px "Poppins", sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(title, 102, 38);

  // Header right icons: Search & 3-dots
  ctx.strokeStyle = '#aebac1';
  ctx.beginPath();
  ctx.arc(cw - 75, 36, 7, 0, Math.PI * 2);
  ctx.moveTo(cw - 70, 41); ctx.lineTo(cw - 65, 46);
  ctx.stroke();

  ctx.fillStyle = '#aebac1';
  [30, 38, 46].forEach((dotY) => {
    ctx.beginPath();
    ctx.arc(cw - 32, dotY, 2, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

export function renderChatInputBar(ctx, placeholder = 'Type a message', cw = 736, ch = 1308) {
  if (!ctx) return;
  ctx.save();
  const barY = ch - 85;
  ctx.fillStyle = '#202c33';
  ctx.fillRect(0, barY, cw, 85);

  // Emoji smile icon
  ctx.strokeStyle = '#8696a0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(38, barY + 42, 13, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(38, barY + 43, 7, 0.2 * Math.PI, 0.8 * Math.PI);
  ctx.stroke();

  // Plus / Attachment icon
  ctx.beginPath();
  ctx.moveTo(76, barY + 42); ctx.lineTo(96, barY + 42);
  ctx.moveTo(86, barY + 32); ctx.lineTo(86, barY + 52);
  ctx.stroke();

  // Input Pill
  drawRoundedRect(ctx, 118, barY + 18, cw - 180, 50, 12);
  ctx.fillStyle = '#2a3942';
  ctx.fill();

  ctx.fillStyle = '#8696a0';
  ctx.font = '400 15px "Poppins", sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(placeholder, 140, barY + 43);

  // Mic icon on right
  ctx.strokeStyle = '#8696a0';
  ctx.beginPath();
  ctx.arc(cw - 36, barY + 38, 5, Math.PI, 0);
  ctx.lineTo(cw - 31, barY + 45);
  ctx.arc(cw - 36, barY + 45, 5, 0, Math.PI);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}
