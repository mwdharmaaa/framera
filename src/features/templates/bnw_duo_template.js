import {
  BNW_DUO_SLOTS,
  renderPaperBackdrop,
  renderVintagePrint,
  renderBnwTypography
} from './bnw_duo_helpers.js';

/**
 * Analog B&W Vintage Duo Prints 2-Photo Template (9:16, 736x1308).
 * Category: '2' (2 photos).
 * Features two stacked vintage prints with white margins, distressed paper corners,
 * high-contrast monochrome silver gelatin grading, and minimalist archive typography.
 */
export const bnwDuoTemplate = {
  id: 'bnw_duo_prints',
  name: 'Analog B&W Vintage Duo Prints',
  description: 'Two stacked vintage black and white photographic prints with worn paper borders and silver gelatin analog film tone',
  previewImage: 'assets/bnw_duo_reference.jpg',
  aspectRatio: '9:16',
  tag: 'BNW DUO',
  tags: ['bnw', 'duo', 'vintage', 'analog', 'prints', 'monochrome'],
  photoCount: 2,
  category: '2',
  config: {
    canvasWidth: 736,
    canvasHeight: 1308,
    frame: { x: 32, y: 175, w: 672, h: 936 }
  },
  render(ctx, img, bounds, state = {}) {
    const { canvasWidth: cw, canvasHeight: ch } = this.config;

    // 1. Reference preview fallback before custom user photos are loaded
    const isReferencePreview = !state?.isUserUploaded && img && (
      (typeof img.src === 'string' && img.src.includes('bnw_duo_reference')) ||
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

    // 2. Resolve 2 photos: Photo 0 for top print, Photo 1 for bottom print
    const rawPhotos = state?.photoImgs || state?.photos || (state?.photoImg ? [state.photoImg] : null);
    let photos = [];
    if (Array.isArray(rawPhotos) && rawPhotos.length >= 2) {
      photos = [rawPhotos[0], rawPhotos[1]];
    } else if (Array.isArray(rawPhotos) && rawPhotos.length === 1) {
      photos = [rawPhotos[0], rawPhotos[0]];
    } else if (img) {
      photos = [img, img];
    }

    // 3. Render off-white paper canvas backdrop
    renderPaperBackdrop(ctx, cw, ch);

    // 4. Render top vintage print card (Slot 0)
    renderVintagePrint(ctx, photos[0], BNW_DUO_SLOTS[0], true);

    // 5. Render bottom vintage print card (Slot 1)
    renderVintagePrint(ctx, photos[1], BNW_DUO_SLOTS[1], false);

    // 6. Render editorial darkroom typography
    renderBnwTypography(ctx, state, cw, ch);
  }
};
