import {
  CLEMENTINE_STORY_SLOTS,
  drawClementineStoryComposition
} from './clementine_story_helpers.js';

/**
 * Clementine Story Vinyl Trio Template (9:16, 736x1308).
 * Category: '3' (3 photos: top-left, bottom-left, bottom-right + top-right vinyl card).
 * Features an aesthetic Instagram Story layout with warm vanilla backdrop,
 * spinning vinyl disc card with floral art, and translucent story controls.
 */
export const clementineStoryTemplate = {
  id: 'clementine_story',
  name: 'Clementine Story Vinyl Trio',
  description: 'Aesthetic 9:16 Instagram Story trio layout featuring warm vanilla backdrop, vintage vinyl record card with floral art, and translucent story controls',
  previewImage: 'assets/clementine_story_preview.png',
  aspectRatio: '9:16',
  tag: 'CLEMENTINE',
  tags: ['story', 'instagram', 'vinyl', 'music', 'trio', 'aesthetic', 'retro', 'warm'],
  photoCount: 3,
  category: '3',
  config: {
    canvasWidth: 736,
    canvasHeight: 1308,
    frame: { x: 0, y: 0, w: 736, h: 1308 }
  },
  slots: CLEMENTINE_STORY_SLOTS,

  render(ctx, img, bounds, state = {}) {
    const { canvasWidth: cw, canvasHeight: ch } = this.config;

    // 1. Reference preview fallback when loading stock catalog preview
    const isReferencePreview = !state?.isUserUploaded && img && (
      (typeof img.src === 'string' && img.src.includes('clementine_story_preview')) ||
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

    // 2. Resolve photo instances (up to 3 photos)
    const rawPhotos = state?.photoImgs || state?.photos || (state?.photoImg ? [state.photoImg] : null) || (img ? [img] : []);
    let photos = [];
    if (Array.isArray(rawPhotos) && rawPhotos.length >= 3) {
      photos = [rawPhotos[0], rawPhotos[1], rawPhotos[2]];
    } else if (Array.isArray(rawPhotos) && rawPhotos.length === 2) {
      photos = [rawPhotos[0], rawPhotos[1], rawPhotos[0]];
    } else if (Array.isArray(rawPhotos) && rawPhotos.length === 1) {
      photos = [rawPhotos[0], rawPhotos[0], rawPhotos[0]];
    } else if (img) {
      photos = [img, img, img];
    }

    // 3. Assemble and render composition
    drawClementineStoryComposition(ctx, photos, state);
  }
};
