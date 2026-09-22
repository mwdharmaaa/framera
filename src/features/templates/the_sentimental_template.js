import {
  SENTIMENTAL_SLOTS,
  renderSentimentalBackground,
  renderSentimentalCard,
  renderSentimentalTypography
} from './the_sentimental_helpers.js';

/**
 * The Sentimental Duo 2-Photo Template (3:4, 736x1041).
 * Category: '2' (2 photos).
 * Features two side-by-side ID portrait cards on textured cream linen paper
 * with elegant cursive calligraphy and minimalist typewriter typography.
 */
export const theSentimentalTemplate = {
  id: 'the_sentimental',
  name: 'The Sentimental',
  description: 'Minimalist scrapbook ID photo duo on textured cream linen paper with cursive calligraphy',
  previewImage: 'assets/the_sentimental_preview.png',
  aspectRatio: '3:4',
  tag: 'SENTIMENTAL DUO',
  tags: ['sentimental', 'duo', 'minimal', 'journal', 'aesthetic', 'warm'],
  photoCount: 2,
  category: '2',
  config: {
    canvasWidth: 736,
    canvasHeight: 1041,
    frame: { x: 109, y: 320, w: 530, h: 314 }
  },
  render(ctx, img, bounds, state = {}) {
    const { canvasWidth: cw, canvasHeight: ch } = this.config;

    // 1. Reference preview fallback before custom user photos are loaded
    const isReferencePreview = !state?.isUserUploaded && img && (
      (typeof img.src === 'string' && img.src.includes('the_sentimental_reference')) ||
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

    // 2. Resolve 2 photos: Slot 0 (Left Card), Slot 1 (Right Card)
    const rawPhotos = state?.photoImgs || state?.photos || (state?.photoImg ? [state.photoImg] : null);
    let photos = [];
    if (Array.isArray(rawPhotos) && rawPhotos.length >= 2) {
      photos = [rawPhotos[0], rawPhotos[1]];
    } else if (Array.isArray(rawPhotos) && rawPhotos.length === 1) {
      photos = [rawPhotos[0], rawPhotos[0]];
    } else if (img) {
      photos = [img, img];
    }

    // 3. Render textured cream linen paper background
    renderSentimentalBackground(ctx, cw, ch);

    // 4. Resolve per-slot transform framing
    const slot0Framing = state?.slots?.[0] || {
      zoom: state?.zoom ?? 1,
      panX: state?.panX ?? 0,
      panY: state?.panY ?? 0
    };
    const slot1Framing = state?.slots?.[1] || {
      zoom: state?.zoom ?? 1,
      panX: state?.panX ?? 0,
      panY: state?.panY ?? 0
    };

    // 5. Render side-by-side ID photo cards
    renderSentimentalCard(ctx, photos[0] || null, SENTIMENTAL_SLOTS[0], slot0Framing);
    renderSentimentalCard(ctx, photos[1] || null, SENTIMENTAL_SLOTS[1], slot1Framing);

    // 6. Render top calligraphy and bottom typewriter caption
    renderSentimentalTypography(ctx, cw, ch, state);
  }
};
