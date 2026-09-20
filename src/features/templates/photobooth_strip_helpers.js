/**
 * Slot Coordinates and Frame Renderers for Vintage Photobooth Split Strip (9:16, 736x1308).
 * 5-Photo Composition: Left full-bleed hero portrait + 4-frame vertical photobooth strip.
 */

export const PHOTOBOOTH_STRIP_SLOTS = [
  { id: 0, name: 'Hero Portrait (Left)', x: 0, y: 0, w: 380, h: 1308 },
  { id: 1, name: 'Strip Frame 1', x: 400, y: 16, w: 316, h: 260 },
  { id: 2, name: 'Strip Frame 2', x: 400, y: 292, w: 316, h: 260 },
  { id: 3, name: 'Strip Frame 3', x: 400, y: 568, w: 316, h: 260 },
  { id: 4, name: 'Strip Frame 4', x: 400, y: 844, w: 316, h: 260 }
];

export function renderHeroPortrait(ctx, photo, slot) {
  if (!ctx) return;
  const { x, y, w, h } = slot;

  ctx.save();
  ctx.fillStyle = '#121316';
  ctx.fillRect(x, y, w, h);

  if (photo) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
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
      // Safe fallback for unit tests
    }

    // Subtle edge gradient on right where hero meets strip
    const edgeShadow = ctx.createLinearGradient(x + w - 30, 0, x + w, 0);
    edgeShadow.addColorStop(0, 'rgba(0, 0, 0, 0)');
    edgeShadow.addColorStop(1, 'rgba(0, 0, 0, 0.45)');
    ctx.fillStyle = edgeShadow;
    ctx.fillRect(x + w - 30, y, 30, h);

    ctx.restore();
  }

  ctx.restore();
}

export function renderStripFrame(ctx, photo, slot) {
  if (!ctx) return;
  const { x, y, w, h } = slot;

  ctx.save();
  // Frame deep backing / drop bevel
  ctx.fillStyle = '#11100f';
  ctx.fillRect(x, y, w, h);

  if (photo) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
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
      // Safe fallback for unit tests
    }

    // Subtle photo gloss / edge vignette
    const innerVignette = ctx.createLinearGradient(0, y, 0, y + 25);
    innerVignette.addColorStop(0, 'rgba(0, 0, 0, 0.25)');
    innerVignette.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = innerVignette;
    ctx.fillRect(x, y, w, 25);

    ctx.restore();
  }

  // Thin outer picture frame border
  ctx.strokeStyle = 'rgba(40, 32, 22, 0.35)';
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, w, h);

  ctx.restore();
}
