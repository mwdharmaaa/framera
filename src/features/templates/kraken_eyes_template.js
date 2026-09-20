import {
  KRAKEN_EYES_SLOTS,
  renderNoirBackground,
  renderSlitPhoto,
  renderSlitTypography
} from './kraken_eyes_helpers.js';
import {
  drawTopTentacle,
  drawBottomTentacle,
  drawFloatingPetals
} from './kraken_eyes_decorations.js';

/**
 * Kraken Eyes Abyssal Slit 1-Photo Template (9:16, 736x1308).
 * Category: '1' (1 photo).
 * Features deep noir matte backdrop, central horizontal eye slit window,
 * curling purple anime kraken tentacles with suction cups, and floating violet petals.
 */
export const krakenEyesTemplate = {
  id: 'kraken_eyes',
  name: 'Kraken Eyes Abyssal Slit',
  description: 'Dark noir vertical letterbox slit framed by anime kraken tentacles and floating violet sakura petals',
  previewImage: 'assets/kraken_eyes_reference.jpg',
  aspectRatio: '9:16',
  tag: 'KRAKEN EYES',
  photoCount: 1,
  category: '1',
  config: {
    canvasWidth: 736,
    canvasHeight: 1308,
    frame: { x: 0, y: 485, w: 736, h: 374 }
  },
  render(ctx, img, bounds, state = {}) {
    const { canvasWidth: cw, canvasHeight: ch } = this.config;

    // 1. Reference preview fallback before custom user photo is loaded
    const isReferencePreview = !state?.isUserUploaded && img && (
      (typeof img.src === 'string' && img.src.includes('kraken_eyes_reference')) ||
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

    // 2. Resolve photo for the eye slit slot
    const rawPhotos = state?.photoImgs || state?.photos || (state?.photoImg ? [state.photoImg] : null);
    const photo = (Array.isArray(rawPhotos) && rawPhotos.length > 0) ? rawPhotos[0] : img;

    // 3. Render deep noir matte backdrop
    renderNoirBackground(ctx, cw, ch);

    // 4. Render photo inside the central eye slit
    renderSlitPhoto(ctx, photo, KRAKEN_EYES_SLOTS[0]);

    // 5. Render curling kraken tentacles
    drawTopTentacle(ctx);
    drawBottomTentacle(ctx);

    // 6. Render floating violet sakura petals
    drawFloatingPetals(ctx);

    // 7. Render atmospheric typography
    renderSlitTypography(ctx, state, cw, ch);
  }
};
