/**
 * Slot Coordinates, Canvas Background, and Slit Renderers for Life Memories Quad Slits (9:16, 736x1308).
 * 4 Vertical Rounded Slits: Supports both 4 distinct photos and continuous panoramic landscape slice.
 */

export const LIFE_QUAD_SLOTS = [
  { id: 0, name: 'Column 1 (Left)', x: 16, y: 16, w: 164, h: 1276, r: 24 },
  { id: 1, name: 'Column 2 (Mid-Left)', x: 196, y: 16, w: 164, h: 1276, r: 24 },
  { id: 2, name: 'Column 3 (Mid-Right)', x: 376, y: 16, w: 164, h: 1276, r: 24 },
  { id: 3, name: 'Column 4 (Right)', x: 556, y: 16, w: 164, h: 1276, r: 24 }
];

export function drawRoundedSlit(ctx, x, y, w, h, r) {
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

export function renderQuadBackground(ctx, cw, ch) {
  if (!ctx) return;
  ctx.save();
  // Deep moody slate-navy gradient
  const bg = ctx.createLinearGradient(0, 0, 0, ch);
  bg.addColorStop(0, '#1f2e42');
  bg.addColorStop(0.5, '#192637');
  bg.addColorStop(1, '#131e2c');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, cw, ch);
  ctx.restore();
}

export function renderSlitPhoto(ctx, photo, slot, isPanorama = false, fullBounds = null) {
  if (!ctx) return;
  const { x, y, w, h, r } = slot;

  ctx.save();
  // Slit base backing
  drawRoundedSlit(ctx, x, y, w, h, r);
  ctx.fillStyle = '#101620';
  ctx.fill();

  if (photo) {
    ctx.save();
    drawRoundedSlit(ctx, x, y, w, h, r);
    ctx.clip();

    if (isPanorama && fullBounds) {
      // Continuous panoramic rendering across all 4 slits
      const iw = photo.naturalWidth || photo.width || fullBounds.w;
      const ih = photo.naturalHeight || photo.height || fullBounds.h;
      const scale = Math.max(fullBounds.w / iw, fullBounds.h / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = fullBounds.x + (fullBounds.w - dw) / 2;
      const dy = fullBounds.y + (fullBounds.h - dh) / 2;
      try {
        ctx.drawImage(photo, dx, dy, dw, dh);
      } catch {
        // Safe fallback for unit tests
      }
    } else {
      // Individual per-column photo rendering
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
        // Safe fallback for unit tests
      }
    }

    // Atmospheric top fog/mist scrim for typography legibility
    const mist = ctx.createLinearGradient(0, y, 0, y + 260);
    mist.addColorStop(0, 'rgba(230, 238, 245, 0.42)');
    mist.addColorStop(0.65, 'rgba(230, 238, 245, 0.22)');
    mist.addColorStop(1, 'rgba(230, 238, 245, 0)');
    ctx.fillStyle = mist;
    ctx.fillRect(x, y, w, 260);

    ctx.restore();
  }

  // Crisp subtle slit outline
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1;
  drawRoundedSlit(ctx, x, y, w, h, r);
  ctx.stroke();

  ctx.restore();
}
