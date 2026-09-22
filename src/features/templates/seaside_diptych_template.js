import {
  SEASIDE_DIPTYCH_SLOTS,
  renderSlotPhoto,
  renderWhiteDivider
} from './seaside_diptych_helpers.js';

/**
 * Seaside Minimal Diptych 2-Photo Template (4:5, 736x920).
 * Category: '2' (2 photos).
 * Features two full-bleed stacked photographic panels separated by a crisp white divider bar.
 */
export const seasideDiptychTemplate = {
  id: 'seaside_diptych',
  name: 'Seaside Minimal Diptych',
  description: 'Aesthetic 4:5 vertical split diptych with two full-bleed stacked photographic panels separated by a crisp white divider bar',
  previewImage: 'assets/seaside_diptych_preview.png',
  aspectRatio: '4:5',
  tag: 'SEASIDE DUO',
  tags: ['seaside', 'diptych', 'duo', 'split', 'minimal', 'coastal'],
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
      (typeof img.src === 'string' && img.src.includes('seaside_diptych_reference')) ||
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

    // 2. Resolve 2 photos: Slot 0 (Top Panel), Slot 1 (Bottom Panel)
    const rawPhotos = state?.photoImgs || state?.photos || (state?.photoImg ? [state.photoImg] : null);
    let photos = [];
    if (Array.isArray(rawPhotos) && rawPhotos.length >= 2) {
      photos = [rawPhotos[0], rawPhotos[1]];
    } else if (Array.isArray(rawPhotos) && rawPhotos.length === 1) {
      photos = [rawPhotos[0], rawPhotos[0]];
    } else if (img) {
      photos = [img, img];
    }

    // 3. Resolve per-slot transform framing
    const framings = [
      state?.slots?.[0] || { zoom: state?.zoom ?? 1, panX: state?.panX ?? 0, panY: state?.panY ?? 0 },
      state?.slots?.[1] || { zoom: state?.zoom ?? 1, panX: state?.panX ?? 0, panY: state?.panY ?? 0 }
    ];

    // 4. Render top and bottom photographic panels
    renderSlotPhoto(ctx, photos[0] || null, SEASIDE_DIPTYCH_SLOTS[0], framings[0]);
    renderSlotPhoto(ctx, photos[1] || null, SEASIDE_DIPTYCH_SLOTS[1], framings[1]);

    // 5. Render central white divider band
    renderWhiteDivider(ctx, cw, ch);
  }
};
