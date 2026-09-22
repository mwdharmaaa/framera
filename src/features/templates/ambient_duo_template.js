import {
  AMBIENT_DUO_SLOTS,
  renderDarkenedBackdrop,
  renderFloatingCard
} from './ambient_duo_helpers.js';
import {
  drawHeadphones,
  drawFingerprintHeart,
  drawSparkleStars
} from './ambient_duo_decorations.js';

/**
 * Ambient Headphone Duo Card Template (9:16, 736x1308).
 * Category: '2' (2 photos).
 * Photo 0: Full-bleed darkened backdrop (brightness ~55% with dark gradient scrim).
 * Photo 1: Floating center card with Spotify badge, headphone overlay, fingerprint heart, and sparkle stars.
 */
export const ambientDuoTemplate = {
  id: 'ambient_duo_card',
  name: 'Ambient Headphone Duo Card',
  description: 'Atmospheric darkened full-bleed backdrop paired with floating Spotify photo card, vector headphones, fingerprint heart, and sparkle stars',
  previewImage: 'assets/ambient_duo_reference.jpg',
  aspectRatio: '9:16',
  tag: 'AMBIENT STORY',
  tags: ['ambient', 'duo', 'music', 'headphone', 'story', 'minimal'],
  photoCount: 2,
  category: '2',
  config: {
    canvasWidth: 736,
    canvasHeight: 1308,
    frame: { x: 0, y: 0, w: 736, h: 1308 }
  },
  render(ctx, img, bounds, state = {}) {
    const { canvasWidth: cw, canvasHeight: ch } = this.config;

    // 1. Reference preview fallback before custom user photos are loaded
    const isReferencePreview = !state?.isUserUploaded && img && (
      (typeof img.src === 'string' && img.src.includes('ambient_duo_reference')) ||
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

    // 2. Resolve 2 photos: Photo 0 for backdrop, Photo 1 for floating card
    const rawPhotos = state?.photoImgs || state?.photos || (state?.photoImg ? [state.photoImg] : null);
    let photos = [];
    if (Array.isArray(rawPhotos) && rawPhotos.length >= 2) {
      photos = [rawPhotos[0], rawPhotos[1]];
    } else if (Array.isArray(rawPhotos) && rawPhotos.length === 1) {
      photos = [rawPhotos[0], rawPhotos[0]];
    } else if (img) {
      photos = [img, img];
    }

    // 3. Render darkened ambient backdrop (Slot 0)
    renderDarkenedBackdrop(ctx, photos[0], cw, ch);

    // 4. Render floating center card (Slot 1)
    const cardSlot = AMBIENT_DUO_SLOTS[1];
    const caption = state?.caption || 'Spotify';
    renderFloatingCard(ctx, photos[1], cardSlot, caption);

    // 5. Render vector decorative overlays
    // Headphone overlay overlapping top-right of floating card
    drawHeadphones(ctx, 585, 475);

    // Biometric fingerprint heart in lower-left area
    drawFingerprintHeart(ctx, 110, 840);

    // Sparkle stars in lower-right area
    drawSparkleStars(ctx, 600, 835);
  }
};
