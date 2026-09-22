import {
  SILVER_GELATIN_SLOTS,
  renderPaperBackdrop,
  renderPhotographicCard
} from './silver_gelatin_helpers.js';

/**
 * Silver Gelatin Analog Duo 2-Photo Template (9:16, 736x1308).
 * Category: '2' (2 photos).
 * Features two stacked vintage photographic prints on tactile fine-art paper with high-contrast monochrome silver gelatin grading.
 */
export const silverGelatinTemplate = {
  id: 'silver_gelatin_duo',
  name: 'Silver Gelatin Analog Duo',
  description: 'Minimalist 9:16 dual vintage photographic prints on tactile fine-art paper with rich silver gelatin black and white grading',
  previewImage: 'assets/silver_gelatin_duo_preview.png',
  aspectRatio: '9:16',
  tag: 'SILVER GELATIN',
  tags: ['silver', 'gelatin', 'analog', 'bnw', 'duo', 'vintage', 'monochrome'],
  photoCount: 2,
  category: '2',
  config: {
    canvasWidth: 736,
    canvasHeight: 1308,
    frame: { x: 32, y: 170, w: 672, h: 938 }
  },
  render(ctx, img, bounds, state = {}) {
    const { canvasWidth: cw, canvasHeight: ch } = this.config;

    // 1. Reference preview fallback before custom user photos are loaded
    const isReferencePreview = !state?.isUserUploaded && img && (
      (typeof img.src === 'string' && img.src.includes('silver_gelatin_duo_reference')) ||
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

    // 2. Resolve 2 photos: Slot 0 (Top Vintage Print), Slot 1 (Bottom Vintage Print)
    const rawPhotos = state?.photoImgs || state?.photos || (state?.photoImg ? [state.photoImg] : null);
    let photos = [];
    if (Array.isArray(rawPhotos) && rawPhotos.length >= 2) {
      photos = [rawPhotos[0], rawPhotos[1]];
    } else if (Array.isArray(rawPhotos) && rawPhotos.length === 1) {
      photos = [rawPhotos[0], rawPhotos[0]];
    } else if (img) {
      photos = [img, img];
    }

    // 3. Render gallery wall / fine-art paper backdrop
    renderPaperBackdrop(ctx, cw, ch);

    // 4. Resolve per-slot transform framing
    const framings = [
      state?.slots?.[0] || { zoom: state?.zoom ?? 1, panX: state?.panX ?? 0, panY: state?.panY ?? 0 },
      state?.slots?.[1] || { zoom: state?.zoom ?? 1, panX: state?.panX ?? 0, panY: state?.panY ?? 0 }
    ];

    // 5. Render top and bottom photographic prints
    renderPhotographicCard(ctx, photos[0] || null, SILVER_GELATIN_SLOTS[0], framings[0], true);
    renderPhotographicCard(ctx, photos[1] || null, SILVER_GELATIN_SLOTS[1], framings[1], false);
  }
};
