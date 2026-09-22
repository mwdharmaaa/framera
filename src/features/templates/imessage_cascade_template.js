import {
  IMESSAGE_CARD_SLOTS,
  renderRoundedCardPhoto,
  renderIMessageBottomBar
} from './imessage_cascade_helpers.js';

/**
 * iMessage Dark Cascade Trio Template.
 * Aesthetic 9:16 dark iOS chat composition with 3 floating rounded photo cards,
 * Live Photo badge indicator, and authentic iMessage text message input bar.
 */
export const imessageCascadeTemplate = {
  id: 'imessage_cascade',
  name: 'iMessage Dark Cascade Trio',
  description: 'Viral iOS dark chat aesthetic with 3 staggered floating rounded photo cards, Live Photo badge, and authentic iMessage text bar',
  previewImage: 'assets/imessage_cascade_reference.jpg',
  aspectRatio: '9:16',
  tag: 'IOS CHAT',
  tags: ['imessage', 'chat', 'ios', 'dark', 'trio', 'bubble'],
  photoCount: 3,
  category: '3',
  config: {
    canvasWidth: 736,
    canvasHeight: 1308,
    frame: { x: 0, y: 0, w: 736, h: 1308 }
  },
  render(ctx, img, bounds, state = {}) {
    const { canvasWidth: cw, canvasHeight: ch } = this.config;

    // 1. Direct reference rendering before user uploads custom photos
    const isReferencePreview = !state?.isUserUploaded && img && (
      (typeof img.src === 'string' && img.src.includes('imessage_cascade_reference')) ||
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

    // 2. Resolve 3 photos for the staggered cards
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

    const options = {
      zoom: state?.zoom || 1,
      panX: state?.panX || 0,
      panY: state?.panY || 0
    };

    // 3. Deep OLED pitch-black backdrop
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, cw, ch);

    // 4. Render the 3 staggered floating cards (Slot 0 -> Slot 1 -> Slot 2)
    IMESSAGE_CARD_SLOTS.forEach((slot, idx) => {
      const photo = photos[idx];
      if (photo) {
        renderRoundedCardPhoto(ctx, photo, slot, options);
      }
    });

    // 5. Render authentic iOS iMessage bottom toolbar
    renderIMessageBottomBar(ctx, cw, ch, state);
  }
};
