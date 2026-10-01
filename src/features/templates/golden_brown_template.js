import {
  GOLDEN_BROWN_SLOTS,
  drawGoldenBrownComposition
} from './golden_brown_helpers.js';

/**
 * Golden Brown Botanical Duo Template (9:16, 736x1308).
 * Category: '2' (2 photos: top portrait & bottom portrait).
 * Features dual portrait panels on solid black backdrop with warm amber golden-brown grading,
 * handcrafted botanical blooms, and textured terracotta crayon flourishes.
 */
export const goldenBrownTemplate = {
  id: 'golden_brown_duo',
  name: 'Golden Brown Botanical Duo',
  description: 'Atmospheric 9:16 portrait diptych with warm amber golden-brown grading, handcrafted botanical blooms, and textured terracotta crayon flourishes',
  previewImage: 'assets/golden_brown_preview.png',
  aspectRatio: '9:16',
  tag: 'GOLDEN BROWN',
  tags: ['golden hour', 'botanical', 'amber', 'vintage', 'floral', 'duo', 'crayon', 'editorial'],
  photoCount: 2,
  category: '2',
  config: {
    canvasWidth: 736,
    canvasHeight: 1308,
    frame: { x: 0, y: 0, w: 736, h: 1308 }
  },
  slots: GOLDEN_BROWN_SLOTS,

  render(ctx, img, bounds, state = {}) {
    const { canvasWidth: cw, canvasHeight: ch } = this.config;

    // 1. Reference preview fallback when loading stock catalog preview
    const isReferencePreview = !state?.isUserUploaded && img && (
      (typeof img.src === 'string' && img.src.includes('golden_brown_preview')) ||
      (!state?.photoImgs?.length && !state?.photos?.length && !state?.photoImg)
    );

    if (isReferencePreview && img) {
      const drawX = typeof bounds?.drawX === 'number' ? bounds.drawX : 0;
      const drawY = typeof bounds?.drawY === 'number' ? bounds.drawY : 0;
      const drawW = typeof bounds?.drawW === 'number' ? bounds.drawW : cw;
      const drawH = typeof bounds?.drawH === 'number' ? bounds.drawH : ch;
      try {
        ctx.drawImage(img, drawX, drawY, drawW, drawH);
      } catch {
        // Safe fallback for unit tests
      }
      return;
    }

    // 2. Resolve photo instances (up to 2 photos)
    const rawPhotos = state?.photoImgs || state?.photos || (state?.photoImg ? [state.photoImg] : null) || (img ? [img] : []);
    let photos = [];
    if (Array.isArray(rawPhotos) && rawPhotos.length >= 2) {
      photos = [rawPhotos[0], rawPhotos[1]];
    } else if (Array.isArray(rawPhotos) && rawPhotos.length === 1) {
      photos = [rawPhotos[0], rawPhotos[0]];
    } else if (img) {
      photos = [img, img];
    }

    // 3. Assemble and render composition
    drawGoldenBrownComposition(ctx, photos, state);
  }
};
