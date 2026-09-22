import {
  IOS_STORY_SLOTS,
  renderHeroBackdrop,
  renderFloatingCard,
  renderSheetCard
} from './ios_story_helpers.js';
import {
  renderSheetContainer,
  drawHomeIndicator
} from './ios_story_decorations.js';

/**
 * iOS Share Sheet Story 6-Photo Template (9:16, 736x1308).
 * Category: '6' (6 photos).
 * Features lush hero backdrop, 2 floating white-framed cards,
 * and an authentic bottom iOS photo selection drawer with 3 cards.
 */
export const iosStoryTemplate = {
  id: 'ios_share_story',
  name: 'iOS Share Sheet Story 6-Photo',
  description: 'Aesthetic 6-photo layout combining hero backdrop, 2 floating framed cards, and bottom iOS share drawer',
  previewImage: 'assets/ios_share_story_reference.jpg',
  aspectRatio: '9:16',
  tag: 'IOS STORY',
  tags: ['ios', 'share', 'story', 'apple', 'interface', 'multi'],
  photoCount: 6,
  category: '6',
  config: {
    canvasWidth: 736,
    canvasHeight: 1308,
    frame: { x: 0, y: 0, w: 736, h: 1308 }
  },
  render(ctx, img, bounds, state = {}) {
    const { canvasWidth: cw, canvasHeight: ch } = this.config;
    const sheetY = 831;

    // 1. Reference preview fallback before custom user photos are loaded
    const isReferencePreview = !state?.isUserUploaded && img && (
      (typeof img.src === 'string' && img.src.includes('ios_share_story_reference')) ||
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

    // 2. Resolve 6 photos for all slots
    const rawPhotos = state?.photoImgs || state?.photos || (state?.photoImg ? [state.photoImg] : null);
    let photos = [];
    if (Array.isArray(rawPhotos) && rawPhotos.length >= 6) {
      photos = [rawPhotos[0], rawPhotos[1], rawPhotos[2], rawPhotos[3], rawPhotos[4], rawPhotos[5]];
    } else if (Array.isArray(rawPhotos) && rawPhotos.length > 0) {
      photos = Array.from({ length: 6 }, (_, i) => rawPhotos[i % rawPhotos.length]);
    } else if (img) {
      photos = [img, img, img, img, img, img];
    }

    // 3. Render Hero Backdrop (Slot 0)
    renderHeroBackdrop(ctx, photos[0], cw, sheetY);

    // 4. Render Floating Cards (Slots 1 & 2)
    renderFloatingCard(ctx, photos[1], IOS_STORY_SLOTS[1]);
    renderFloatingCard(ctx, photos[2], IOS_STORY_SLOTS[2]);

    // 5. Render Bottom iOS Share Sheet Container
    const sheetCaption = state?.caption || '3 Photos Selected';
    renderSheetContainer(ctx, sheetY, cw, ch, sheetCaption);

    // 6. Render 3 Share Sheet Cards (Slots 3, 4, 5)
    renderSheetCard(ctx, photos[3], IOS_STORY_SLOTS[3], true, false);
    renderSheetCard(ctx, photos[4], IOS_STORY_SLOTS[4], true, false);
    renderSheetCard(ctx, photos[5], IOS_STORY_SLOTS[5], true, true);

    // 7. Render iOS Home Indicator Bar
    drawHomeIndicator(ctx, cw / 2, 1295);
  }
};
