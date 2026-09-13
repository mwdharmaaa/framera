import {
  drawSkyAndCables,
  drawPosterCardBase,
  drawPosterTypography
} from './folded_poster_helpers.js';
import {
  drawScotchTape,
  drawTactileCreases
} from './folded_poster_creases.js';

/**
 * Y2K Folded Print Poster Template.
 * Faithfully synthesized from reference: floating artboard card, twilight utility pole sky,
 * guilloche security ripples, giant stencil typography, 4-quadrant tactile paper crease, and scotch tape.
 */
export const foldedPosterTemplate = {
  id: 'folded_poster',
  name: 'Y2K Folded Print Poster',
  description: 'Tactile 4-quadrant creased print poster with security guilloche engraving waves and bold streetwear typography',
  previewImage: 'assets/ref_7_reference.jpg',
  aspectRatio: '3:4',
  tag: 'POSTER',
  config: {
    canvasWidth: 1200,
    canvasHeight: 1600,
    poster: { x: 125, y: 95, w: 950, h: 1410 },
    frame: { x: 180, y: 225, w: 840, h: 1125 }
  },
  render(ctx, img, bounds, state) {
    const { canvasWidth: cw, canvasHeight: ch, poster, frame } = this.config;

    // 1. Dramatic twilight sky with clouds and utility telephone power lines
    drawSkyAndCables(ctx, cw, ch);

    // 2. Pale cyan-white poster card base with drop shadow and guilloche security ripples
    drawPosterCardBase(ctx, poster, frame);

    // 3. Central Image Print Frame
    if (img) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(frame.x, frame.y, frame.w, frame.h);
      ctx.clip();
      ctx.filter = 'contrast(120%) saturate(108%) brightness(98%)';
      ctx.drawImage(img, bounds.drawX, bounds.drawY, bounds.drawW, bounds.drawH);
      ctx.restore();
    }

    // 4. Poster Typography (Giant header overlapping frame + stacked bottom manifesto)
    drawPosterTypography(ctx, poster, frame, state);

    // 5. Authentic 4-Quadrant Tactile Paper Crease Folds & Ink Cracking
    drawTactileCreases(ctx, cw, ch, poster);

    // 6. Frosted Adhesive Scotch Tape (Top-Left Corner)
    drawScotchTape(ctx, poster.x + 40, poster.y + 15, 125, 42, -0.62);
  }
};
