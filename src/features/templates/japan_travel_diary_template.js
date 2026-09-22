import {
  JAPAN_DIARY_SLOTS,
  DEFAULT_DIARY_CAPTIONS,
  renderDiaryBackdrop,
  renderClippedDiaryPhoto,
  renderDiaryCaption
} from './japan_travel_diary_helpers.js';

/**
 * Japan Travel Film Diary 12-Photo Template (3:4, 736x1041).
 * Category: '12' (12 photos).
 * Features a minimalist 3x4 grid of 35mm film landscape snapshots with handwritten Japanese travel notes.
 */
export const japanTravelDiaryTemplate = {
  id: 'japan_travel_diary',
  name: 'Japan Travel Film Diary',
  description: 'Minimalist Japanese 35mm film travel diary with 12 landscape snapshot grid and authentic handwritten annotations',
  previewImage: 'assets/japan_travel_preview.png',
  aspectRatio: '3:4',
  tag: 'JAPAN DIARY',
  tags: ['japan', 'travel', 'diary', 'film', 'journal', 'multi', 'vintage', 'aesthetic'],
  photoCount: 12,
  category: '12',
  config: {
    canvasWidth: 736,
    canvasHeight: 1041,
    slots: JAPAN_DIARY_SLOTS
  },
  slots: JAPAN_DIARY_SLOTS,

  render(ctx, img, bounds, state = {}) {
    const { canvasWidth: cw, canvasHeight: ch, slots } = this.config;

    // 1. Reference preview fallback before custom user photos are loaded
    const isReferencePreview = !state?.isUserUploaded && img && (
      (typeof img.src === 'string' && img.src.includes('japan_travel_reference')) ||
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

    // 2. Clean minimal white gallery backdrop
    renderDiaryBackdrop(ctx, cw, ch);

    // 3. Resolve photos and multi-slot states
    const slotList = Array.isArray(state?.slots) && state.slots.length === slots.length
      ? state.slots
      : null;
    const rawPhotos = state?.photoImgs || state?.photos || (state?.photoImg ? [state.photoImg] : (img ? [img] : []));
    const photoArray = Array.isArray(rawPhotos) ? rawPhotos : [];

    // 4. Render 12 seamlessly tiled 35mm landscape photos with Japanese handwritten annotations
    slots.forEach((slot, idx) => {
      const slotState = slotList ? slotList[idx] : null;
      const slotImg = slotState?.img || photoArray[idx] || (photoArray.length > 0 ? photoArray[idx % photoArray.length] : null);
      const framing = {
        zoom: slotState?.zoom ?? (idx === 0 ? (state?.zoom ?? 1) : 1),
        panX: slotState?.panX ?? (idx === 0 ? (state?.panX ?? 0) : 0),
        panY: slotState?.panY ?? (idx === 0 ? (state?.panY ?? 0) : 0)
      };

      renderClippedDiaryPhoto(ctx, slotImg, slot, framing);

      const captionText = (Array.isArray(state?.captions) && state.captions[idx] !== undefined)
        ? state.captions[idx]
        : DEFAULT_DIARY_CAPTIONS[idx];
      renderDiaryCaption(ctx, captionText, slot);
    });
  }
};
