import {
  INVERTED_DUET_LAYOUT,
  renderFramedPhoto,
  drawDuetAnnotations
} from './inverted_duet_helpers.js';

/**
 * Inverted Duet Split Dual-Photo Template.
 * Features a reciprocal 50/50 vertical split composition with mirrored square inset portals.
 * Designed for 2 complementary photos with graceful fallback for single photo uploads.
 */
export const invertedDuetTemplate = {
  id: 'inverted_duet',
  name: 'Inverted Duet',
  description: 'Dual-frame inverted split collage with reciprocal inset windows and 50/50 mirrored balance',
  previewImage: 'assets/inverted_duet_reference.jpg',
  aspectRatio: '3:4',
  tag: 'DUAL INVERT',
  photoCount: 2,
  category: '2',
  config: {
    canvasWidth: 1200,
    canvasHeight: 1600,
    frame: { x: 0, y: 0, w: 1200, h: 1600 }
  },
  render(ctx, img, bounds, state = {}) {
    const { canvasWidth: cw, canvasHeight: ch } = this.config;

    // 1. Base dark neutral backdrop
    ctx.fillStyle = '#0e0e11';
    ctx.fillRect(0, 0, cw, ch);

    // 2. Direct reference render when in preset preview mode before user upload
    const isReferencePreview = !state?.isUserUploaded && img && (
      (typeof img.src === 'string' && img.src.includes('inverted_duet_reference')) ||
      (!state?.photoImgs?.length && !state?.photos?.length)
    );

    if (isReferencePreview && img) {
      try {
        ctx.drawImage(img, 0, 0, cw, ch);
      } catch {
        // Fallback for mock unit test environments
      }
      drawDuetAnnotations(ctx, cw, ch, state);
      return;
    }

    // 3. Resolve user photo instances
    const rawPhotos = state?.photoImgs || state?.photos;
    let photoA = img;
    let photoB = img;

    if (Array.isArray(rawPhotos) && rawPhotos.length > 0) {
      photoA = rawPhotos[0] || img;
      photoB = rawPhotos[1] || rawPhotos[0] || img;
    }

    if (!photoA && !photoB) {
      return;
    }

    const zoom = state?.zoom || 1;
    const panX = state?.panX || 0;
    const panY = state?.panY || 0;

    const baseOptions = { zoom, panX, panY, fitMode: 'cover' };
    const isSinglePhoto = (photoA === photoB);

    // For single-photo fallback, subtly zoom the inset portal to create visual depth
    const insetOptions = isSinglePhoto
      ? { zoom: zoom * 1.35, panX, panY, fitMode: 'cover' }
      : baseOptions;

    // 4. Render Top Half: Photo A Background + Photo B Inset
    if (photoA) {
      renderFramedPhoto(ctx, photoA, INVERTED_DUET_LAYOUT.topBackground, baseOptions);
    }
    if (photoB) {
      renderFramedPhoto(ctx, photoB, INVERTED_DUET_LAYOUT.topInset, insetOptions);
    }

    // 5. Render Bottom Half: Photo B Background + Photo A Inset
    if (photoB) {
      renderFramedPhoto(ctx, photoB, INVERTED_DUET_LAYOUT.bottomBackground, baseOptions);
    }
    if (photoA) {
      renderFramedPhoto(ctx, photoA, INVERTED_DUET_LAYOUT.bottomInset, insetOptions);
    }

    // 6. Minimalist typography annotations
    drawDuetAnnotations(ctx, cw, ch, state);
  }
};
