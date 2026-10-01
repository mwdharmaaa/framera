import {
  SPARKLE_CASCADE_SLOTS,
  SPARKLE_VINYL_CONFIG,
  renderSparkleAtmosphere,
  renderCascadeCard
} from './sparkle_cascade_helpers.js';
import { drawVinylRecord } from './sparkle_cascade_decorations.js';

/**
 * Sparkle Vinyl Cascade Trio Template (9:16, 736x1308).
 * Category: '3' (3 photos).
 * Features 3 cascading rounded photo cards across a warm amber atmosphere,
 * paired with a realistic grooved vinyl record disc player and track typography.
 */
export const sparkleCascadeTemplate = {
  id: 'sparkle_cascade_trio',
  name: 'Sparkle Vinyl Cascade Trio',
  description: 'Warm amber atmospheric backdrop with 3 cascading rounded photo cards and vinyl record player badge',
  previewImage: 'assets/sparkle_cascade_reference.jpg',
  aspectRatio: '9:16',
  tag: 'VINYL SPARKLE',
  tags: ['vinyl', 'sparkle', 'cascade', 'trio', 'music', 'warm', 'amber'],
  photoCount: 3,
  category: '3',
  config: {
    canvasWidth: 736,
    canvasHeight: 1308,
    frame: { x: 24, y: 102, w: 682, h: 1150 }
  },
  render(ctx, img, bounds, state = {}) {
    const { canvasWidth: cw, canvasHeight: ch } = this.config;

    // 1. Reference preview fallback when loading stock catalog preview
    const isReferencePreview = !state?.isUserUploaded && img && (
      (typeof img.src === 'string' && img.src.includes('sparkle_cascade_reference')) ||
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

    // 2. Resolve photo instances (up to 3 distinct photos)
    const rawPhotos = state?.photoImgs || state?.photos || (state?.photoImg ? [state.photoImg] : null);
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

    // 3. Render warm ambient atmosphere backdrop
    renderSparkleAtmosphere(ctx, photos[0] || img, cw, ch);

    // 4. Resolve multi-slot framings
    const getFraming = (idx) => {
      if (Array.isArray(state?.slotFramings) && state.slotFramings[idx]) {
        return state.slotFramings[idx];
      }
      return {
        zoom: state?.zoom ?? 1,
        panX: state?.panX ?? 0,
        panY: state?.panY ?? 0
      };
    };

    // 5. Render 3 cascading cards in depth order (Slot 0 -> Slot 1 -> Slot 2)
    SPARKLE_CASCADE_SLOTS.forEach((slot, idx) => {
      renderCascadeCard(ctx, photos[idx] || img, slot, getFraming(idx));
    });

    // 6. Render grooved vinyl record player disc & track typography
    const vinylPhoto = photos[1] || photos[0] || img;
    drawVinylRecord(
      ctx,
      SPARKLE_VINYL_CONFIG.cx,
      SPARKLE_VINYL_CONFIG.cy,
      SPARKLE_VINYL_CONFIG.radius,
      vinylPhoto,
      state?.caption,
      state?.subtitle
    );
  }
};
