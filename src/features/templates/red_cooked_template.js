import {
  RED_COOKED_SLOT,
  renderBackdrop,
  renderFramedPhoto,
  renderYellowQuote
} from './red_cooked_helpers.js';
import { renderLockscreenOverlay } from './red_cooked_player.js';

/**
 * Nah I'm Cooked Red Lockscreen Template (9:16, 736x1308).
 * Category: '1' (1 photo).
 * Features a bold saturated crimson backdrop, centered framed photo with iOS lockscreen music player overlay,
 * and high-impact yellow statement typography.
 */
export const redCookedTemplate = {
  id: 'red_cooked',
  name: "Nah I'm Cooked",
  description: 'Vibrant crimson 9:16 poster featuring a centered framed snapshot with iOS lockscreen music player and punchy yellow typography',
  previewImage: 'assets/red_cooked_preview.png',
  aspectRatio: '9:16',
  tag: 'RED LOCKSCREEN',
  tags: ['red', 'lockscreen', 'music', 'quote', 'poster', 'aesthetic', 'bold', 'pop', 'meme'],
  photoCount: 1,
  category: '1',
  config: {
    canvasWidth: 736,
    canvasHeight: 1308,
    slots: [RED_COOKED_SLOT]
  },
  slots: [RED_COOKED_SLOT],

  render(ctx, img, bounds, state = {}) {
    const { canvasWidth: cw, canvasHeight: ch } = this.config;

    // 1. Reference preview fallback before custom user photos are loaded
    const isReferencePreview = !state?.isUserUploaded && img && (
      (typeof img.src === 'string' && img.src.includes('red_cooked_reference')) ||
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

    // 2. Bold saturated crimson backdrop
    renderBackdrop(ctx, cw, ch, state?.bgColor);

    // 3. Resolve single hero photo & framing parameters
    const photo = state?.photoImg ||
      (Array.isArray(state?.photos) && state.photos[0] ? state.photos[0] : null) ||
      (Array.isArray(state?.photoImgs) && state.photoImgs[0] ? state.photoImgs[0] : null) ||
      img;

    const slotState = Array.isArray(state?.slots) ? state.slots[0] : null;
    const framing = {
      zoom: slotState?.zoom ?? (state?.zoom ?? 1),
      panX: slotState?.panX ?? (state?.panX ?? 0),
      panY: slotState?.panY ?? (state?.panY ?? 0)
    };

    renderFramedPhoto(ctx, photo, RED_COOKED_SLOT, framing);

    // 4. iOS Lockscreen music player overlay
    renderLockscreenOverlay(ctx, RED_COOKED_SLOT, state);

    // 5. Punchy yellow statement typography
    renderYellowQuote(ctx, cw, state);
  }
};
