import {
  LEOPARD_DUO_SLOTS,
  renderSplitBackdrop,
  renderLeopardAssemblage
} from './leopard_duo_helpers.js';

/**
 * Leopard Chic Duo 2-Photo Template (9:16, 736x1308).
 * Category: '2' (2 photos).
 * Features split kraft paper & espresso background, dual-stacked cheetah print photo frames,
 * silver glitter starbursts, dark red lipstick kiss mark, and dried pressed botanical petal.
 */
export const leopardDuoTemplate = {
  id: 'leopard_duo',
  name: 'Leopard Chic Duo',
  description: 'Y2K aesthetic split kraft paper and espresso collage with double cheetah print photo frames, silver glitter stars, lipstick kiss, and dried botanical petal',
  previewImage: 'assets/leopard_duo_preview.png',
  aspectRatio: '9:16',
  tag: 'LEOPARD DUO',
  tags: ['leopard', 'duo', 'chic', 'fashion', 'animalprint', 'aesthetic'],
  photoCount: 2,
  category: '2',
  config: {
    canvasWidth: 736,
    canvasHeight: 1308,
    frame: { x: 25, y: 149, w: 536, h: 830 }
  },
  render(ctx, img, bounds, state = {}) {
    const { canvasWidth: cw, canvasHeight: ch } = this.config;

    // 1. Reference preview fallback before custom user photos are loaded
    const isReferencePreview = !state?.isUserUploaded && img && (
      (typeof img.src === 'string' && img.src.includes('leopard_duo_reference')) ||
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

    // 2. Resolve 2 photos: Slot 0 (Top), Slot 1 (Bottom)
    const rawPhotos = state?.photoImgs || state?.photos || (state?.photoImg ? [state.photoImg] : null);
    let photos = [];
    if (Array.isArray(rawPhotos) && rawPhotos.length >= 2) {
      photos = [rawPhotos[0], rawPhotos[1]];
    } else if (Array.isArray(rawPhotos) && rawPhotos.length === 1) {
      photos = [rawPhotos[0], rawPhotos[0]];
    } else if (img) {
      photos = [img, img];
    }

    // 3. Render split kraft paper & espresso background
    renderSplitBackdrop(ctx, cw, ch);

    // 4. Resolve per-slot transform framing
    const framings = [
      state?.slots?.[0] || { zoom: state?.zoom ?? 1, panX: state?.panX ?? 0, panY: state?.panY ?? 0 },
      state?.slots?.[1] || { zoom: state?.zoom ?? 1, panX: state?.panX ?? 0, panY: state?.panY ?? 0 }
    ];

    // 5. Render cheetah assemblage with slots, lipstick, flower, and glitter stars
    renderLeopardAssemblage(ctx, photos, framings);
  }
};
