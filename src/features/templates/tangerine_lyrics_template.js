import {
  TANGERINE_LYRICS_SLOTS,
  renderTangerineComposition
} from './tangerine_lyrics_helpers.js';

/**
 * Tangerine Sunset Lyrics Duo Template (9:16, 736x1308).
 * Category: '2' (2 photos: top portrait & bottom portrait).
 * Features dual photo panels divided by a warm tangerine accent band,
 * floating Spotify lyrics card, celestial radiant sun, and tropical botanical stickers.
 */
export const tangerineLyricsTemplate = {
  id: 'tangerine_lyrics_duo',
  name: 'Tangerine Sunset Lyrics Duo',
  description: 'Vibrant tri-band 9:16 layout featuring dual portrait panels, warm tangerine accent band, Spotify lyrics card, celestial sun, and tropical botanical floral stickers',
  previewImage: 'assets/tangerine_lyrics_preview.png',
  aspectRatio: '9:16',
  tag: 'TANGERINE LYRICS',
  tags: ['tangerine', 'spotify', 'lyrics', 'duo', 'orange', 'sun', 'botanical', 'y2k', 'music'],
  photoCount: 2,
  category: '2',
  config: {
    canvasWidth: 736,
    canvasHeight: 1308,
    frame: { x: 0, y: 0, w: 736, h: 1308 }
  },
  slots: TANGERINE_LYRICS_SLOTS,

  render(ctx, img, bounds, state = {}) {
    const { canvasWidth: cw, canvasHeight: ch } = this.config;

    // 1. Reference preview fallback when loading stock catalog preview
    const isReferencePreview = !state?.isUserUploaded && img && (
      (typeof img.src === 'string' && img.src.includes('tangerine_lyrics_reference')) ||
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

    // 2. Resolve photo instances (up to 2 photos)
    const rawPhotos = state?.photoImgs || state?.photos || (state?.photoImg ? [state.photoImg] : null) || (img ? [img] : []);
    let photos = [];
    if (Array.isArray(rawPhotos) && rawPhotos.length >= 2) {
      photos = [rawPhotos[0], rawPhotos[1]];
    } else if (Array.isArray(rawPhotos) && rawPhotos.length === 1) {
      photos = [rawPhotos[0], rawPhotos[0]];
    } else if (img) {
      photos = [img, img];
    }

    // 3. Assemble and render composition
    renderTangerineComposition(ctx, photos, cw, ch, state);
  }
};
