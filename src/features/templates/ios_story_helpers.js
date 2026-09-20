import {
  drawCheckmarkBadge,
  drawHeartBadge
} from './ios_story_decorations.js';

/**
 * Slot Coordinates and Card Renderers for iOS Share Sheet Story Template (9:16, 736x1308).
 * 6 Photos: 1 Hero backdrop + 2 floating cards + 3 bottom share sheet cards.
 */

export const IOS_STORY_SLOTS = [
  { id: 0, name: 'Hero Backdrop Photo', x: 0, y: 0, w: 736, h: 831 },
  { id: 1, name: 'Floating Card 1', x: 112, y: 144, w: 310, h: 232, r: 2 },
  { id: 2, name: 'Floating Card 2', x: 384, y: 302, w: 200, h: 230, r: 2 },
  { id: 3, name: 'Sheet Card 1 (Left)', x: 22, y: 886, w: 220, h: 398, r: 14 },
  { id: 4, name: 'Sheet Card 2 (Center)', x: 258, y: 886, w: 220, h: 398, r: 14 },
  { id: 5, name: 'Sheet Card 3 (Right)', x: 494, y: 886, w: 220, h: 398, r: 14 }
];

export function renderHeroBackdrop(ctx, photo, cw, sheetY) {
  if (!ctx) return;
  ctx.save();
  ctx.fillStyle = '#1c241e';
  ctx.fillRect(0, 0, cw, sheetY);

  if (photo) {
    const iw = photo.naturalWidth || photo.width || cw;
    const ih = photo.naturalHeight || photo.height || sheetY;
    const scale = Math.max(cw / iw, sheetY / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) / 2;
    const dy = (sheetY - dh) / 2;

    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, cw, sheetY);
    ctx.clip();
    try {
      ctx.drawImage(photo, dx, dy, dw, dh);
    } catch {
      // Fallback for tests
    }
    ctx.restore();
  }
  ctx.restore();
}

export function renderFloatingCard(ctx, photo, slot) {
  if (!ctx) return;
  const { x, y, w, h } = slot;

  ctx.save();
  // Deep floating shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 8;

  // Outer white photo frame
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x - 3.5, y - 3.5, w + 7, h + 7);
  ctx.shadowColor = 'transparent';

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
      // Fallback for tests
    }
    ctx.restore();
  }

  // Thin hairline border around photo edge
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, w, h);

  ctx.restore();
}

export function renderSheetCard(ctx, photo, slot, showCheckmark = true, showHeart = false) {
  if (!ctx) return;
  const { x, y, w, h, r = 14 } = slot;

  ctx.save();
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.rect(x, y, w, h);
  }
  ctx.fillStyle = '#2c2c2e';
  ctx.fill();

  if (photo) {
    const iw = photo.naturalWidth || photo.width || w;
    const ih = photo.naturalHeight || photo.height || h;
    const scale = Math.max(w / iw, h / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = x + (w - dw) / 2;
    const dy = y + (h - dh) / 2;

    ctx.save();
    ctx.clip();
    try {
      ctx.drawImage(photo, dx, dy, dw, dh);
    } catch {
      // Fallback for tests
    }
    ctx.restore();
  }

  // Subtle border
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Badges
  if (showCheckmark) {
    drawCheckmarkBadge(ctx, x + w - 20, y + h - 20);
  }
  if (showHeart) {
    drawHeartBadge(ctx, x + 20, y + h - 20);
  }

  ctx.restore();
}
