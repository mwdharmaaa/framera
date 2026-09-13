import {
  drawNegativePortrait,
  drawTornLetterP,
  drawEditorialTypography
} from './perfect_editorial_helpers.js';

/**
 * High-Fashion Perfect Editorial Poster Template.
 * Features negative solarized portraiture with electric cyan duotone,
 * iconic torn-paper letter P cutout, cursive typography, and archival quotes.
 */
export const perfectEditorialTemplate = {
  id: 'perfect_editorial',
  name: 'Perfect Editorial',
  description: 'High-fashion editorial negative solarized poster with torn cutout P, cyan duotone grade, and cursive typography',
  previewImage: 'assets/perfect_editorial_reference.jpg',
  aspectRatio: '3:4',
  tag: 'EDITORIAL',
  config: {
    canvasWidth: 1200,
    canvasHeight: 1600,
    frame: { x: 0, y: 0, w: 1200, h: 1600 }
  },
  render(ctx, img, bounds, state) {
    const { canvasWidth: cw, canvasHeight: ch } = this.config;

    // 1. Editorial studio dark backdrop
    ctx.fillStyle = '#0a0d14';
    ctx.fillRect(0, 0, cw, ch);

    // 2. Inverted Negative Solarized Portrait Layer
    drawNegativePortrait(ctx, img, bounds, cw, ch);

    // 3. Iconic Torn Letter P Cutout
    drawTornLetterP(ctx);

    // 4. Editorial Typography, Quotes & Credits
    drawEditorialTypography(ctx, {
      caption: state.caption,
      subtitle: state.subtitle,
      date: state.date,
      cw,
      ch
    });
  }
};
