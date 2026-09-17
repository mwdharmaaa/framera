import {
  getFinalGirlOverlayImage,
  drawHandDrawnHeart,
  renderDuotoneRisographHalftone,
  drawCustomQuote
} from './final_girl_helpers.js';

/**
 * Final Girl Studios Dual-Split Risograph Template.
 * Features a split crimson-and-noir poster composition with a zoomed face/eye portal on top,
 * full-body halftone raster on bottom, hand-drawn heart doodle, and centered cursive quote card.
 */
export const finalGirlTemplate = {
  id: 'final_girl',
  name: 'Final Girl Studios',
  description: 'Split risograph poster with zoom eye portal, blush-pink halftone raster, heart doodle, and crimson quote card',
  previewImage: 'assets/final_girl_reference.jpg',
  aspectRatio: '3:4',
  tag: 'RISOGRAPH',
  photoCount: 1,
  config: {
    canvasWidth: 1200,
    canvasHeight: 1600,
    frame: { x: 298, y: 176, w: 603, h: 459 },
    bottomFrame: { x: 0, y: 765, w: 1200, h: 835 },
    cardRect: { x: 300, y: 878, w: 598, h: 454 }
  },
  render(ctx, img, bounds, state = {}) {
    const { canvasWidth: cw, canvasHeight: ch, frame, bottomFrame, cardRect } = this.config;

    // 1. Base dark background backing
    ctx.fillStyle = '#0b0e14';
    ctx.fillRect(0, 0, cw, ch);

    // 2. Bottom section: Full portrait in duotone blush-pink risograph halftone
    if (img) {
      renderDuotoneRisographHalftone(ctx, img, bounds, bottomFrame, {
        zoom: 1.0,
        gridStep: 9,
        paperColor: '#f0b8c0',
        dotColor: '#0e0a12'
      });
    }

    // 3. Top box: Zoomed eye/face portal in duotone blush-pink risograph halftone
    if (img) {
      renderDuotoneRisographHalftone(ctx, img, bounds, frame, {
        zoom: 1.75,
        gridStep: 7,
        paperColor: '#f0b8c0',
        dotColor: '#0e0a12'
      });
    }

    // 4. Authentic Risograph Overlay (Crimson top background + bottom quote card with paper creases)
    const overlay = getFinalGirlOverlayImage();
    if (overlay && (overlay.complete || typeof Image === 'undefined')) {
      try {
        ctx.drawImage(overlay, 0, 0, cw, ch);
      } catch {
        // Fallback for mock test environments
      }
    } else if (overlay) {
      overlay.onload = () => {
        if (typeof state?.onRedraw === 'function') state.onRedraw();
      };
    }

    // 5. White hand-drawn heart doodle in the top-right corner of the top box
    drawHandDrawnHeart(ctx, frame.x + frame.w - 55, frame.y + 48, 28, 0.12);

    // 6. Dynamic custom quote on the card (drawn if user customizes caption or subtitle)
    drawCustomQuote(ctx, cardRect, state);
  }
};
