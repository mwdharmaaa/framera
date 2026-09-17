let overlayImg = null;

/**
 * Returns cached Image instance for the authentic Final Girl overlay.
 * @returns {HTMLImageElement|null}
 */
export function getFinalGirlOverlayImage() {
  if (overlayImg) return overlayImg;
  if (typeof Image !== 'undefined') {
    overlayImg = new Image();
    overlayImg.src = 'assets/final_girl_overlay.png';
  }
  return overlayImg;
}

/**
 * Resets cached overlay image for unit testing environments.
 */
export function resetFinalGirlOverlayImage() {
  overlayImg = null;
}

/**
 * Renders a delicate hand-drawn heart doodle in white ink.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cx
 * @param {number} cy
 * @param {number} size
 * @param {number} angle
 */
export function drawHandDrawnHeart(ctx, cx, cy, size = 30, angle = 0.12) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.92)';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(0, size * 0.3);
  ctx.bezierCurveTo(-size * 0.65, -size * 0.4, -size * 0.7, size * 0.5, 0, size * 0.9);
  ctx.bezierCurveTo(size * 0.7, size * 0.5, size * 0.65, -size * 0.4, 0, size * 0.3);
  ctx.stroke();
  ctx.restore();
}

/**
 * Renders a blush-pink and charcoal duotone risograph halftone raster screen.
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement|null} photoImg
 * @param {{ drawX: number, drawY: number, drawW: number, drawH: number }} bounds
 * @param {{ x: number, y: number, w: number, h: number }} rect
 * @param {object} options
 */
export function renderDuotoneRisographHalftone(ctx, photoImg, bounds, rect, options = {}) {
  const {
    zoom = 1,
    gridStep = 8,
    paperColor = '#f0b8c0',
    dotColor = '#110a12'
  } = options;

  ctx.save();
  ctx.beginPath();
  ctx.rect(rect.x, rect.y, rect.w, rect.h);
  ctx.clip();

  // 1. Blush pink paper base
  ctx.fillStyle = paperColor;
  ctx.fillRect(rect.x, rect.y, rect.w, rect.h);

  if (photoImg && typeof document !== 'undefined') {
    try {
      const offCanvas = document.createElement('canvas');
      offCanvas.width = rect.w;
      offCanvas.height = rect.h;
      const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });

      if (offCtx) {
        // Draw photo with specified zoom scale centered within rect
        const sw = rect.w * zoom;
        const sh = rect.h * zoom;
        const sx = (rect.w - sw) / 2;
        const sy = (rect.h - sh) / 2;

        offCtx.drawImage(photoImg, sx, sy, sw, sh);

        const imgData = offCtx.getImageData(0, 0, rect.w, rect.h);
        const data = imgData.data;
        const maxRadius = gridStep * 0.72;

        ctx.fillStyle = dotColor;

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

            // Compute perceived luminance (0 = pure black, 1 = pure white)
            const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            // High ink density in darker areas
            const ink = Math.max(0, 1.0 - lum);
            const radius = ink * maxRadius;

            if (radius > 0.8) {
              ctx.beginPath();
              ctx.arc(rect.x + px, rect.y + py, radius, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }
    } catch {
      // Fallback to direct draw if canvas read is blocked
      ctx.drawImage(photoImg, bounds.drawX, bounds.drawY, bounds.drawW, bounds.drawH);
    }
  }

  ctx.restore();
}

/**
 * Draws customized cursive typography in the bottom card if modified by user.
 * @param {CanvasRenderingContext2D} ctx
 * @param {{ x: number, y: number, w: number, h: number }} cardRect
 * @param {object} state
 */
export function drawCustomQuote(ctx, cardRect, state = {}) {
  const isDefaultCaption = !state.caption || state.caption === 'godhood is like girlhood';
  const isDefaultSubtitle = !state.subtitle || state.subtitle === 'begging to be believed';

  if (!isDefaultCaption || !isDefaultSubtitle) {
    ctx.save();
    // Re-fill crimson backing to cleanly replace original baked text
    ctx.fillStyle = '#aa1c1c';
    ctx.fillRect(cardRect.x + 30, cardRect.y + 70, cardRect.w - 60, cardRect.h - 140);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';

    if (state.caption) {
      ctx.font = 'italic 400 30px "Playfair Display", Georgia, serif';
      ctx.fillText(state.caption, cardRect.x + cardRect.w / 2, cardRect.y + cardRect.h / 2 - 15);
    }
    if (state.subtitle) {
      ctx.font = 'italic 400 24px "Playfair Display", Georgia, serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillText(state.subtitle, cardRect.x + cardRect.w / 2, cardRect.y + cardRect.h / 2 + 35);
    }
    ctx.restore();
  }
}
