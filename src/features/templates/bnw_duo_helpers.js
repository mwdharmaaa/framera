import {
  drawCardPaperFrame,
  drawWornPaperCorner,
  drawSilverGelatinDust
} from './bnw_duo_decorations.js';

/**
 * Geometric slots and rendering helpers for Analog B&W Duo Prints template (9:16, 736x1308).
 * Features two stacked vintage prints with white margins, high-contrast monochrome grading,
 * and minimalist darkroom typography.
 */

export const BNW_DUO_SLOTS = [
  {
    id: 0,
    name: 'Top Print',
    cardX: 32,
    cardY: 175,
    cardW: 672,
    cardH: 458,
    x: 46,
    y: 189,
    w: 644,
    h: 430
  },
  {
    id: 1,
    name: 'Bottom Print',
    cardX: 32,
    cardY: 653,
    cardW: 672,
    cardH: 458,
    x: 46,
    y: 667,
    w: 644,
    h: 430
  }
];

export function renderPaperBackdrop(ctx, cw, ch) {
  if (!ctx) return;
  ctx.save();
  const grad = ctx.createRadialGradient(cw / 2, ch / 2, 80, cw / 2, ch / 2, ch * 0.75);
  grad.addColorStop(0, '#fcfcfb');
  grad.addColorStop(1, '#f5f5f1');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, cw, ch);
  ctx.restore();
}

export function renderVintagePrint(ctx, photo, slot, isTop = false) {
  if (!ctx || !slot) return;
  const { cardX, cardY, cardW, cardH, x, y, w, h } = slot;

  // 1. Draw outer paper card with multi-layered drop shadow
  drawCardPaperFrame(ctx, cardX, cardY, cardW, cardH);

  // 2. Subtle corner distress on top print
  if (isTop) {
    drawWornPaperCorner(ctx, cardX, cardY, cardW);
  }

  // 3. Render photo in high-contrast analog monochrome
  ctx.save();
  ctx.fillStyle = '#101010';
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
      if (ctx.filter !== undefined) {
        ctx.filter = 'grayscale(100%) contrast(128%) brightness(98%)';
      }
      ctx.drawImage(photo, dx, dy, dw, dh);
    } catch {
      // Fallback for mock unit test contexts
    } finally {
      if (ctx.filter !== undefined) {
        ctx.filter = 'none';
      }
    }
    ctx.restore();
  }

  // 4. Subtle inner photo border stroke
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.18)';
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, w, h);

  // 5. Film dust and silver gelatin texture
  drawSilverGelatinDust(ctx, x, y, w, h);

  ctx.restore();
}

export function renderBnwTypography(ctx, state, cw, ch) {
  if (!ctx) return;
  ctx.save();

  const caption = (state?.caption || 'ANALOG DUO PRINTS').toUpperCase();
  const subtitle = state?.subtitle || 'ILFORD HP5 PLUS // FRAME 24-25';
  const date = state?.date || '35MM B&W // SILVER GELATIN';

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Top header metadata stamp
  ctx.font = '600 11px "Courier New", monospace, sans-serif';
  ctx.fillStyle = 'rgba(70, 70, 75, 0.7)';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '3px';
  ctx.fillText(date, cw / 2, 100);

  // Top title
  ctx.font = '700 15px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = '#1c1c20';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '4px';
  ctx.fillText(caption, cw / 2, 126);

  // Bottom footer archive stamp
  ctx.font = '500 11px "Courier New", monospace, sans-serif';
  ctx.fillStyle = 'rgba(90, 90, 95, 0.65)';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '2.5px';
  ctx.fillText(subtitle, cw / 2, 1180);

  // Archive catalog code
  ctx.font = '400 10px monospace';
  ctx.fillStyle = 'rgba(120, 120, 128, 0.45)';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '2px';
  ctx.fillText('REF. NO. 110176 // 9:16 VERTICAL // MONOCHROME ARCHIVE', cw / 2, 1202);

  ctx.restore();
}
