import {
  METROPOLIS_STORY_SLOTS,
  renderJournalBackdrop,
  renderSlotPhoto,
  renderLoremIpsumText
} from './metropolis_story_helpers.js';

/**
 * Metropolis Editorial Journal 2-Photo Template (4:5, 736x920).
 * Category: '2' (2 photos).
 * Features a full-bleed top architectural/street hero photograph paired with a bottom editorial
 * journal section containing an inset street portrait and elegant handwritten cursive Lorem Ipsum text.
 */
export const metropolisStoryTemplate = {
  id: 'metropolis_story',
  name: 'Metropolis Editorial Journal',
  description: 'Editorial 4:5 journal layout with full-bleed top hero photograph, bottom inset street portrait, and cursive handwritten script',
  previewImage: 'assets/metropolis_story_preview.png',
  aspectRatio: '4:5',
  tag: 'EDITORIAL JOURNAL',
  photoCount: 2,
  category: '2',
  config: {
    canvasWidth: 736,
    canvasHeight: 920,
    frame: { x: 0, y: 0, w: 736, h: 920 }
  },
  render(ctx, img, bounds, state = {}) {
    const { canvasWidth: cw, canvasHeight: ch } = this.config;

    // 1. Reference preview fallback before custom user photos are loaded
    const isReferencePreview = !state?.isUserUploaded && img && (
      (typeof img.src === 'string' && img.src.includes('metropolis_story_reference')) ||
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

    // 2. Resolve 2 photos: Slot 0 (Top Hero), Slot 1 (Bottom Portrait)
    const rawPhotos = state?.photoImgs || state?.photos || (state?.photoImg ? [state.photoImg] : null);
    let photos = [];
    if (Array.isArray(rawPhotos) && rawPhotos.length >= 2) {
      photos = [rawPhotos[0], rawPhotos[1]];
    } else if (Array.isArray(rawPhotos) && rawPhotos.length === 1) {
      photos = [rawPhotos[0], rawPhotos[0]];
    } else if (img) {
      photos = [img, img];
    }

    // 3. Render bottom off-white journal backdrop
    renderJournalBackdrop(ctx, cw, ch);

    // 4. Resolve per-slot transform framing
    const framings = [
      state?.slots?.[0] || { zoom: state?.zoom ?? 1, panX: state?.panX ?? 0, panY: state?.panY ?? 0 },
      state?.slots?.[1] || { zoom: state?.zoom ?? 1, panX: state?.panX ?? 0, panY: state?.panY ?? 0 }
    ];

    // 5. Render top hero and bottom-left portrait
    renderSlotPhoto(ctx, photos[0] || null, METROPOLIS_STORY_SLOTS[0], framings[0]);
    renderSlotPhoto(ctx, photos[1] || null, METROPOLIS_STORY_SLOTS[1], framings[1]);

    // 6. Render handwritten cursive script story text
    renderLoremIpsumText(ctx, state);
  }
};
