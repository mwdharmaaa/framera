import {
  IOS_PHOTOSHEET_LAYOUT,
  renderCardPhoto,
  renderSheetHeader,
  renderCardBadges
} from './ios_photosheet_helpers.js';

/**
 * iOS Photosheet Live Share Template.
 * Authentic Apple Photos / AirDrop carousel sheet showcasing 1 featured photo card with
 * LIVE photo indicator, selection checkmark, adjacent carousel peek cards, and iOS share sheet header.
 */
export const iosPhotosheetTemplate = {
  id: 'ios_photosheet',
  name: 'iOS Photosheet Live Share',
  description: 'Authentic Apple Photos carousel sheet with LIVE indicator, checkmark, and iOS share header',
  previewImage: 'assets/ios_photosheet_reference.jpg',
  aspectRatio: '4:5',
  tag: 'IOS SHARE',
  photoCount: 1,
  category: '1',
  config: {
    canvasWidth: 736,
    canvasHeight: 920,
    frame: { x: 130, y: 254, w: 472, h: 666 }
  },
  render(ctx, img, bounds, state = {}) {
    const { canvasWidth: cw, canvasHeight: ch, card, leftPeek, rightPeek } = IOS_PHOTOSHEET_LAYOUT;

    // 1. Direct reference rendering before user uploads custom photos
    const isReferencePreview = !state?.isUserUploaded && img && (
      (typeof img.src === 'string' && img.src.includes('ios_photosheet_reference')) ||
      (!state?.photoImgs?.length && !state?.photos?.length)
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

    // 2. Base light gray iOS sheet surface
    ctx.fillStyle = '#f2f2f7';
    if (typeof ctx.fillRect === 'function') {
      ctx.fillRect(0, 0, cw, ch);
    }

    // 3. Resolve user photo
    const rawPhotos = state?.photoImgs || state?.photos;
    const photo = (Array.isArray(rawPhotos) && rawPhotos.length > 0) ? rawPhotos[0] : img;

    // 4. Render adjacent carousel peek cards (adds authentic carousel depth)
    if (photo) {
      renderCardPhoto(ctx, photo, leftPeek);
      renderCardPhoto(ctx, photo, rightPeek);
    }

    // 5. Render main featured card
    if (photo) {
      renderCardPhoto(ctx, photo, card);
    }

    // 6. Badges on main featured card (LIVE badge, heart, blue selection checkmark)
    renderCardBadges(ctx, card);

    // 7. Top iOS Photo Sheet header
    renderSheetHeader(ctx, photo, state);
  }
};
