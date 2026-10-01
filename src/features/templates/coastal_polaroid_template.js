import {
  COASTAL_POLAROID_SLOTS,
  POLAROID_CARD_CONFIG,
  renderSeasideBackdrop,
  renderPolaroidCard
} from './coastal_polaroid_helpers.js';

/**
 * Coastal Polaroid Story Template (9:16, 736x1308).
 * Category: '1' (1 photo default, supports multi-slot expansion).
 * Features dual stacked monochrome seaside backdrops, a floating white polaroid snapshot,
 * and audio signature typography (@imzzum).
 */
export const coastalPolaroidTemplate = {
  id: 'coastal_polaroid_story',
  name: 'Coastal Polaroid Story',
  description: 'Aesthetic B&W seaside editorial story featuring dual monochrome horizon backdrops, floating white polaroid snapshot, and audio signature icons',
  previewImage: 'assets/coastal_polaroid_preview.png',
  aspectRatio: '9:16',
  tag: 'COASTAL POLAROID',
  tags: ['polaroid', 'monochrome', 'coastal', 'beach', 'analog', 'story', 'minimal', 'film', 'trio'],
  photoCount: 3,
  category: '3',
  config: {
    canvasWidth: 736,
    canvasHeight: 1308,
    frame: { x: 0, y: 0, w: 736, h: 1308 }
  },
  slots: COASTAL_POLAROID_SLOTS,

  render(ctx, img, bounds, state = {}) {
    const { canvasWidth: cw, canvasHeight: ch } = this.config;

    // 1. Reference preview fallback when loading stock catalog preview
    const isReferencePreview = !state?.isUserUploaded && img && (
      (typeof img.src === 'string' && img.src.includes('coastal_polaroid_reference')) ||
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

    // 2. Resolve photo instances (single photo or up to 3 multi-slot photos)
    const rawPhotos = state?.photoImgs || state?.photos || (state?.photoImg ? [state.photoImg] : null) || (img ? [img] : []);
    let backdropPhotos = [];
    let polaroidPhoto = null;

    if (Array.isArray(rawPhotos) && rawPhotos.length >= 3) {
      backdropPhotos = [rawPhotos[0], rawPhotos[1]];
      polaroidPhoto = rawPhotos[2];
    } else if (Array.isArray(rawPhotos) && rawPhotos.length === 2) {
      backdropPhotos = [rawPhotos[0], rawPhotos[1]];
      polaroidPhoto = rawPhotos[1];
    } else if (Array.isArray(rawPhotos) && rawPhotos.length === 1) {
      backdropPhotos = [rawPhotos[0], rawPhotos[0]];
      polaroidPhoto = rawPhotos[0];
    } else if (img) {
      backdropPhotos = [img, img];
      polaroidPhoto = img;
    }

    // 3. Render stacked seaside backdrops
    renderSeasideBackdrop(ctx, backdropPhotos, cw, ch);

    // 4. Render floating polaroid card and audio signature
    const caption = state?.caption || state?.subtitle || '@imzzum';
    renderPolaroidCard(ctx, polaroidPhoto, POLAROID_CARD_CONFIG, caption);
  }
};
