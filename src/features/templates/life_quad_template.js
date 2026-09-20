import {
  LIFE_QUAD_SLOTS,
  renderQuadBackground,
  renderSlitPhoto
} from './life_quad_helpers.js';
import { renderQuadTypography } from './life_quad_typography.js';

/**
 * Life Memories Quad Slits Template (9:16, 736x1308).
 * Category: '4' (4 photos).
 * Features 4 vertical rounded slit windows over a moody slate-navy background,
 * paired with 3D extruded block lettering and distributed editorial sub-phrases.
 */
export const lifeQuadTemplate = {
  id: 'life_memories_quad',
  name: 'Life Memories Quad Slits',
  description: 'Aesthetic 4-column rounded vertical window slits with 3D block lettering and distributed editorial sub-phrases',
  previewImage: 'assets/life_quad_reference.jpg',
  aspectRatio: '9:16',
  tag: 'QUAD SLITS',
  photoCount: 4,
  category: '4',
  config: {
    canvasWidth: 736,
    canvasHeight: 1308,
    frame: { x: 0, y: 0, w: 736, h: 1308 }
  },
  render(ctx, img, bounds, state = {}) {
    const { canvasWidth: cw, canvasHeight: ch } = this.config;

    // 1. Reference preview fallback before custom user photos are loaded
    const isReferencePreview = !state?.isUserUploaded && img && (
      (typeof img.src === 'string' && img.src.includes('life_quad_reference')) ||
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

    // 2. Render deep slate-navy canvas background
    renderQuadBackground(ctx, cw, ch);

    // 3. Resolve photo allocation (supports multi-photo and continuous panorama)
    const rawPhotos = state?.photoImgs || state?.photos || (state?.photoImg ? [state.photoImg] : null);
    const hasMultiple = Array.isArray(rawPhotos) && rawPhotos.length > 1;
    const isPanorama = !hasMultiple;
    const fullBounds = { x: 16, y: 16, w: 704, h: 1276 };

    let photos = [];
    if (hasMultiple) {
      photos = [
        rawPhotos[0] || img,
        rawPhotos[1] || rawPhotos[0] || img,
        rawPhotos[2] || rawPhotos[0] || img,
        rawPhotos[3] || rawPhotos[1] || img
      ];
    } else {
      const single = (rawPhotos && rawPhotos[0]) || img;
      photos = [single, single, single, single];
    }

    // 4. Render 4 vertical rounded slit windows
    LIFE_QUAD_SLOTS.forEach((slot, idx) => {
      renderSlitPhoto(ctx, photos[idx], slot, isPanorama, fullBounds);
    });

    // 5. Render 3D typography and distributed editorial phrases
    renderQuadTypography(ctx, LIFE_QUAD_SLOTS, state);
  }
};
