import {
  HANA_SUNSET_SLOTS,
  renderWarmSlotPhoto,
  renderHanaMusicPlayer,
  renderDarkBotanicalBase
} from './golden_hour_hana_helpers.js';

/**
 * Golden Hour Hana Quad Template.
 * Aesthetic warm sunset 9:16 Instagram story collage featuring 4 warm-filtered photo slots,
 * dark botanical backdrop, and a floating amber glass music player card.
 * Specially tuned with authentic late-afternoon / sore hari golden hour warmth.
 */
export const goldenHourHanaTemplate = {
  id: 'golden_hour_hana',
  name: 'Golden Hour Hana Quad',
  description: 'Aesthetic 9:16 warm sunset collage with 4 golden-filtered photo slots and floating amber music player',
  previewImage: 'assets/golden_hour_hana_reference.jpg',
  aspectRatio: '9:16',
  tag: 'WARM SUNSET',
  photoCount: 4,
  category: '4',
  config: {
    canvasWidth: 736,
    canvasHeight: 1308,
    frame: { x: 55, y: 150, w: 636, h: 996 }
  },
  render(ctx, img, bounds, state = {}) {
    const { canvasWidth: cw, canvasHeight: ch } = this.config;

    // 1. Direct reference rendering before user uploads custom photos
    const isReferencePreview = !state?.isUserUploaded && img && (
      (typeof img.src === 'string' && img.src.includes('golden_hour_hana_reference')) ||
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
        // Fallback for mock unit test environments
      }
      return;
    }

    // 2. Resolve multi-photo assignments for 4 slots
    const rawPhotos = state?.photoImgs || state?.photos || (state?.photoImg ? [state.photoImg] : null);
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

    const primaryPhoto = photos[0] || img || state?.photoImg;

    // 3. Base full-bleed background using primary photo with darker exposure (layer bawah lebih gelap)
    renderDarkBotanicalBase(ctx, primaryPhoto, cw, ch);

    const options = {
      zoom: state?.zoom || 1,
      panX: state?.panX || 0,
      panY: state?.panY || 0
    };

    // 4. Render the 4 photo slots with authentic warm afternoon / sore hari orange filter
    HANA_SUNSET_SLOTS.forEach((slot, idx) => {
      const photo = photos[idx] || img;
      if (photo) {
        renderWarmSlotPhoto(ctx, photo, slot, options);
      }
    });

    // 5. Render floating amber glass music player card
    renderHanaMusicPlayer(ctx, state);
  }
};
