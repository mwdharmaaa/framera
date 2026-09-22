import {
  MIDNIGHT_FORMULA_SLOTS,
  renderFormulaBackground,
  renderFormulaCard,
  drawMusicPlayerWidget
} from './midnight_formula_helpers.js';
import { drawMidnightLilies } from './midnight_formula_decorations.js';

/**
 * Midnight Formula Template.
 * Aesthetic 9:16 midnight 4-photo collage with translucent music player and ethereal lilac lily blooms.
 */
export const midnightFormulaTemplate = {
  id: 'midnight_formula',
  name: 'Midnight Formula',
  description: 'Moody midnight 4-photo collage with translucent music player and ethereal lilac lily blooms',
  previewImage: 'assets/midnight_formula_reference.jpg',
  aspectRatio: '9:16',
  tag: 'FORMULA QUAD',
  photoCount: 4,
  category: '4',
  config: {
    canvasWidth: 736,
    canvasHeight: 1308,
    frame: { x: 0, y: 0, w: 736, h: 1308 }
  },
  render(ctx, img, bounds, state = {}) {
    const { canvasWidth: cw, canvasHeight: ch } = this.config;

    // Direct reference rendering before user uploads custom photos
    if (!state.isUserUploaded && img) {
      const drawX = typeof bounds?.drawX === 'number' ? bounds.drawX : 0;
      const drawY = typeof bounds?.drawY === 'number' ? bounds.drawY : 0;
      const drawW = typeof bounds?.drawW === 'number' ? bounds.drawW : cw;
      const drawH = typeof bounds?.drawH === 'number' ? bounds.drawH : ch;
      try {
        ctx.drawImage(img, drawX, drawY, drawW, drawH);
      } catch {
        // Fallback for mock unit test environments
      }
      return;
    }

    // 1. Resolve multi-photo assignments for the 4 slots
    const rawPhotos = state?.photoImgs || state?.photos;
    let photos = [];

    if (Array.isArray(rawPhotos) && rawPhotos.length >= 4) {
      photos = [rawPhotos[0], rawPhotos[1], rawPhotos[2], rawPhotos[3]];
    } else if (Array.isArray(rawPhotos) && rawPhotos.length === 3) {
      photos = [rawPhotos[0], rawPhotos[1], rawPhotos[2], rawPhotos[0]];
    } else if (Array.isArray(rawPhotos) && rawPhotos.length === 2) {
      photos = [rawPhotos[0], rawPhotos[1], rawPhotos[0], rawPhotos[1]];
    } else if (Array.isArray(rawPhotos) && rawPhotos.length === 1) {
      photos = [rawPhotos[0], rawPhotos[0], rawPhotos[0], rawPhotos[0]];
    } else if (img) {
      photos = [img, img, img, img];
    }

    // 2. Render deep midnight canvas base
    renderFormulaBackground(ctx, cw, ch);

    // 3. Render the 4 photo cards into layout slots
    MIDNIGHT_FORMULA_SLOTS.forEach((slot, idx) => {
      const photo = photos[idx];
      if (photo) {
        renderFormulaCard(ctx, photo, slot);
      }
    });

    // 4. Render translucent glassmorphism music player widget
    drawMusicPlayerWidget(ctx, photos[0] || img, state);

    // 5. Render botanical lilac lily blooms overlay
    drawMidnightLilies(ctx, cw, ch);
  }
};
