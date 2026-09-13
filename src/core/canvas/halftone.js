import { renderPlaceholder } from './renderer.js';

/**
 * Renders a color-halftone dot raster portal over a section of the user photo.
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement|null} photoImg
 * @param {{ drawX: number, drawY: number, drawW: number, drawH: number }} bounds
 * @param {{ x: number, y: number, w: number, h: number }} rect
 * @param {number} [gridStep=8]
 */
export function renderHalftonePortal(ctx, photoImg, bounds, rect, gridStep = 8) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(rect.x, rect.y, rect.w, rect.h);
  ctx.clip();

  // Dark background for halftone dot contrast
  ctx.fillStyle = '#050608';
  ctx.fillRect(rect.x, rect.y, rect.w, rect.h);

  if (photoImg && typeof document !== 'undefined') {
    try {
      const offCanvas = document.createElement('canvas');
      offCanvas.width = rect.w;
      offCanvas.height = rect.h;
      const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });

      if (offCtx) {
        offCtx.drawImage(
          photoImg,
          bounds.drawX - rect.x,
          bounds.drawY - rect.y,
          bounds.drawW,
          bounds.drawH
        );

        const imgData = offCtx.getImageData(0, 0, rect.w, rect.h);
        const data = imgData.data;
        const maxRadius = gridStep * 0.72;

        for (let py = gridStep / 2; py < rect.h; py += gridStep) {
          const iy = Math.floor(py);
          for (let px = gridStep / 2; px < rect.w; px += gridStep) {
            const ix = Math.floor(px);
            const idx = (iy * rect.w + ix) * 4;

            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const a = data[idx + 3];
            if (a < 20) continue;

            const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            const radius = Math.max(0.7, lum * maxRadius);

            ctx.beginPath();
            ctx.arc(rect.x + px, rect.y + py, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.fill();
          }
        }
      }
    } catch {
      // Graceful fallback: render direct image slice if pixel read is blocked
      ctx.drawImage(photoImg, bounds.drawX, bounds.drawY, bounds.drawW, bounds.drawH);
    }
  } else if (!photoImg) {
    renderPlaceholder(ctx, rect, 'rgba(255, 255, 255, 0.25)');
  }

  ctx.restore();

  // Crisp white framing border
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3.5;
  ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
}
