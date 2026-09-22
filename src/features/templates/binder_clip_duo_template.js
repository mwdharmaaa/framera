import {
  BINDER_CLIP_DUO_SLOTS,
  renderBackdrop,
  renderTopPhoto,
  renderBinderRings,
  renderCenterProse,
  renderBottomPhoto,
  renderPaperclip
} from './binder_clip_duo_helpers.js';

/**
 * Binder Clip Journal Duo 2-Photo Template (3:4, 736x981).
 * Category: '2' (2 photos).
 * Features an analog B&W journal collage with metallic spiral binder rings, serif prose, and a realistic metallic paperclip.
 */
export const binderClipDuoTemplate = {
  id: 'binder_clip_duo',
  name: 'Binder Clip Journal Duo',
  description: '3:4 analog B&W journal collage with metallic spiral binder rings, serif prose, and metallic paperclip',
  previewImage: 'assets/binder_clip_duo_preview.png',
  aspectRatio: '3:4',
  tag: 'JOURNAL B&W',
  tags: ['journal', 'bnw', 'vintage', 'analog', 'duo', 'minimal', 'aesthetic'],
  photoCount: 2,
  category: '2',
  config: {
    canvasWidth: 736,
    canvasHeight: 981,
    frame: { x: 0, y: 112, w: 736, h: 869 }
  },
  slots: BINDER_CLIP_DUO_SLOTS,
  render(ctx, img, bounds, state = {}) {
    const { canvasWidth: cw, canvasHeight: ch } = this.config;

    // 1. Reference preview fallback before custom user photos are loaded
    const isReferencePreview = !state?.isUserUploaded && img && (
      (typeof img.src === 'string' && img.src.includes('binder_clip_duo_reference')) ||
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

    // 2. Resolve 2 photos: Slot 0 (Top Journal Print), Slot 1 (Bottom Hero Photo)
    const rawPhotos = state?.photoImgs || state?.photos || (state?.photoImg ? [state.photoImg] : null);
    let photos = [];
    if (Array.isArray(rawPhotos) && rawPhotos.length >= 2) {
      photos = [rawPhotos[0], rawPhotos[1]];
    } else if (Array.isArray(rawPhotos) && rawPhotos.length === 1) {
      photos = [rawPhotos[0], rawPhotos[0]];
    } else if (img) {
      photos = [img, img];
    }

    // 3. Render clean paper backdrop
    renderBackdrop(ctx, cw, ch);

    // 4. Render top photo and bottom photo
    const slots = this.slots || BINDER_CLIP_DUO_SLOTS;
    const topSlotFraming = state?.slots?.[0] || { zoom: state?.zoom ?? 1, panX: state?.panX ?? 0, panY: state?.panY ?? 0 };
    const bottomSlotFraming = state?.slots?.[1] || { zoom: state?.zoom ?? 1, panX: state?.panX ?? 0, panY: state?.panY ?? 0 };

    renderTopPhoto(ctx, photos[0] || null, slots[0], topSlotFraming);
    renderBottomPhoto(ctx, photos[1] || null, slots[1], bottomSlotFraming);

    // 5. Render metallic binder rings over top photo
    renderBinderRings(ctx);

    // 6. Render center prose between photos
    renderCenterProse(ctx, cw, state);

    // 7. Render metallic paperclip clipped over bottom photo
    renderPaperclip(ctx);
  }
};
