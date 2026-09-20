import {
  PHOTOBOOTH_STRIP_SLOTS,
  renderHeroPortrait,
  renderStripFrame
} from './photobooth_strip_helpers.js';
import {
  renderStripShadow,
  renderParchmentTexture,
  renderStripFooter
} from './photobooth_strip_decorations.js';

/**
 * Vintage Photobooth Split Strip Template (9:16, 736x1308).
 * Category: '5' (5 photos).
 * Slot 0: Full-height hero portrait occupying left panel.
 * Slots 1-4: 4 stacked photo frames on an authentic vintage photobooth parchment strip.
 */
export const photoboothStripTemplate = {
  id: 'photobooth_strip',
  name: 'Vintage Photobooth Split Strip',
  description: 'Editorial split composition with full-height hero portrait and vertical 4-frame vintage photobooth parchment strip',
  previewImage: 'assets/photobooth_strip_reference.jpg',
  aspectRatio: '9:16',
  tag: 'PHOTOBOOTH',
  photoCount: 5,
  category: '5',
  config: {
    canvasWidth: 736,
    canvasHeight: 1308,
    frame: { x: 0, y: 0, w: 736, h: 1308 }
  },
  render(ctx, img, bounds, state = {}) {
    const { canvasWidth: cw, canvasHeight: ch } = this.config;

    // 1. Reference preview fallback before custom user photos are loaded
    const isReferencePreview = !state?.isUserUploaded && img && (
      (typeof img.src === 'string' && img.src.includes('photobooth_strip_reference')) ||
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

    // 2. Resolve 5 photos for slots
    const rawPhotos = state?.photoImgs || state?.photos || (state?.photoImg ? [state.photoImg] : null);
    let photos = [];
    if (Array.isArray(rawPhotos) && rawPhotos.length >= 5) {
      photos = [rawPhotos[0], rawPhotos[1], rawPhotos[2], rawPhotos[3], rawPhotos[4]];
    } else if (Array.isArray(rawPhotos) && rawPhotos.length === 4) {
      photos = [rawPhotos[0], rawPhotos[1], rawPhotos[2], rawPhotos[3], rawPhotos[0]];
    } else if (Array.isArray(rawPhotos) && rawPhotos.length === 3) {
      photos = [rawPhotos[0], rawPhotos[1], rawPhotos[2], rawPhotos[0], rawPhotos[1]];
    } else if (Array.isArray(rawPhotos) && rawPhotos.length === 2) {
      photos = [rawPhotos[0], rawPhotos[1], rawPhotos[0], rawPhotos[1], rawPhotos[0]];
    } else if (Array.isArray(rawPhotos) && rawPhotos.length === 1) {
      photos = [rawPhotos[0], rawPhotos[0], rawPhotos[0], rawPhotos[0], rawPhotos[0]];
    } else if (img) {
      photos = [img, img, img, img, img];
    }

    // 3. Render Hero Portrait (Slot 0) on the left panel
    const heroSlot = PHOTOBOOTH_STRIP_SLOTS[0];
    renderHeroPortrait(ctx, photos[0] || img, heroSlot);

    // 4. Photobooth Strip Geometry
    const stripX = 380;
    const stripW = cw - stripX; // 356
    const stripH = ch;

    // 5. Render Strip Shadow onto Left Photo
    renderStripShadow(ctx, stripX, stripH);

    // 6. Render Vintage Parchment Paper Texture
    renderParchmentTexture(ctx, stripX, 0, stripW, stripH);

    // 7. Render 4 Photo Frames inside the strip
    for (let i = 1; i <= 4; i++) {
      const slot = PHOTOBOOTH_STRIP_SLOTS[i];
      const photo = photos[i] || img;
      renderStripFrame(ctx, photo, slot);
    }

    // 8. Render Vintage Footer (Barcode, Typography, Seals)
    renderStripFooter(ctx, stripX, 0, stripW, stripH, state);
  }
};
