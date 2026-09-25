import { wrapCanvasText, renderPlaceholder } from '../../core/canvas/renderer.js';
import { renderHalftonePortal } from '../../core/canvas/halftone.js';

/**
 * Focus Editorial Poster Template.
 * High-fashion monochrome editorial layout with dual CMYK halftone portals and vertical typography.
 */
export const focusEditorialTemplate = {
  id: 'focus_editorial',
  name: 'Focus Editorial Halftone',
  description: 'Monochrome base with dual color-halftone dot portals and bold vertical typography',
  previewImage: 'assets/focus_reference.jpg',
  aspectRatio: '3:4',
  tag: 'EDITORIAL',
  tags: ['editorial', 'halftone', 'poster', 'minimal', 'typography', 'fashion'],
  photoCount: 1,
  category: '1',
  config: {
    canvasWidth: 1200,
    canvasHeight: 1600,
    frame: { x: 0, y: 0, w: 1200, h: 1600 }
  },

  /**
   * Main render method for Focus Editorial template.
   * @param {CanvasRenderingContext2D} ctx
   * @param {HTMLImageElement|null} photoImg
   * @param {{ drawX: number, drawY: number, drawW: number, drawH: number }} bounds
   * @param {object} state
   */
  render(ctx, photoImg, bounds, state) {
    const { canvasWidth, canvasHeight } = this.config;

    // 1. Deep charcoal canvas background
    ctx.fillStyle = '#0a0c10';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // 2. Grayscale base photo layer
    if (photoImg) {
      ctx.save();
      ctx.filter = 'grayscale(100%) contrast(115%) brightness(92%)';
      ctx.drawImage(photoImg, bounds.drawX, bounds.drawY, bounds.drawW, bounds.drawH);
      ctx.restore();

      // Subtle gradient vignette for lower editorial text legibility
      const vig = ctx.createLinearGradient(0, canvasHeight * 0.55, 0, canvasHeight);
      vig.addColorStop(0, 'rgba(10, 12, 16, 0)');
      vig.addColorStop(1, 'rgba(10, 12, 16, 0.45)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    } else {
      renderPlaceholder(ctx, { x: 100, y: 100, w: canvasWidth - 200, h: canvasHeight - 200 });
    }

    // 3. Halftone Cutout Portals
    const mainPortal = { x: 348, y: 118, w: 320, h: 965 };
    const accentPortal = { x: 785, y: 875, w: 295, h: 210 };
    renderHalftonePortal(ctx, photoImg, bounds, mainPortal, 8);
    renderHalftonePortal(ctx, photoImg, bounds, accentPortal, 8);

    // 4. Large Vertical Stacked Masthead Typography
    const headline = (state.caption || 'FOCUS').toUpperCase();
    const letters = headline.split('');
    const startY = 145;
    const endY = 825;
    const stepY = letters.length > 1 ? (endY - startY) / (letters.length - 1) : 0;

    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 130px "Syne", "Poppins", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    letters.forEach((char, i) => {
      ctx.fillText(char, 932, startY + i * stepY);
    });
    ctx.restore();

    // 5. Left Vertical Rotated Telemetry Strip
    ctx.save();
    ctx.translate(52, 470);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = '500 13px "Space Mono", monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    const dateStamp = state.date || '2026 - VOL.02';
    ctx.fillText(`${dateStamp}   08:27 PM / MODE FOCUS   #QUIETPOWER #LOCKEDIN`, 0, 0);
    ctx.restore();

    // 6. Editorial Quote Narrative Block
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.font = '500 20px "Poppins", sans-serif';
    ctx.textAlign = 'left';
    const quote = state.subtitle || 'In a world obsessed with attention, focus becomes rare. It is not loud, dramatic, or rushed: it moves quietly, shaping dreams in silence while the distracted never notice.';
    wrapCanvasText(ctx, quote, 348, 1145, 430, 30, 4);
    ctx.restore();

    // 7. Bottom Left Volume & Year Marker
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 22px "Poppins", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('2026', 52, 1515);
    ctx.font = '600 18px "Poppins", sans-serif';
    ctx.fillText('VOL.02', 52, 1542);
    ctx.restore();
  }
};
