import {
  getOceanStoryBackgroundImage,
  STORY_CARD_SLOTS,
  renderStoryBackground,
  renderStoryCard,
  drawStoryDetails
} from './ocean_stories_helpers.js';

/**
 * Ocean Stories Quad Template.
 * Aesthetic 9:16 Instagram story seaside collage with ocean background and 3 landscape photo cards.
 * Supports up to 4 individual user photos (1 background + 3 stacked cards).
 */
export const oceanStoriesTemplate = {
  id: 'ocean_stories_quad',
  name: 'Ocean Stories Quad',
  description: 'Aesthetic seaside story collage with ocean water background and 3 floating landscape photo cards',
  previewImage: 'assets/ocean_stories_reference.jpg',
  aspectRatio: '9:16',
  tag: 'STORY QUAD',
  tags: ['ocean', 'stories', 'quad', 'minimal', 'coastal', 'summer'],
  photoCount: 4,
  category: '4',
  config: {
    canvasWidth: 736,
    canvasHeight: 1308,
    frame: { x: 141, y: 171, w: 463, h: 982 }
  },
  render(ctx, img, bounds, state = {}) {
    const { canvasWidth: cw, canvasHeight: ch } = this.config;

    // Direct reference rendering before user uploads custom photos
    if (!state.isUserUploaded && img) {
      const drawX = typeof bounds?.drawX === 'number' ? bounds.drawX : 0;
      const drawY = typeof bounds?.drawY === 'number' ? bounds.drawY : 0;
      const drawW = typeof bounds?.drawW === 'number' ? bounds.drawW : cw;
      const drawH = typeof bounds?.drawH === 'number' ? bounds.drawH : ch;
      try {
        ctx.drawImage(img, drawX, drawY, drawW, drawH);
      } catch {
        // Fallback for mock unit test environments
      }
      drawStoryDetails(ctx, cw, ch, state);
      return;
    }

    // 1. Resolve multi-photo assignments
    const rawPhotos = state?.photoImgs || state?.photos;
    let bgPhoto = null;
    let cardPhotos = [];

    if (Array.isArray(rawPhotos) && rawPhotos.length >= 4) {
      bgPhoto = rawPhotos[0];
      cardPhotos = [rawPhotos[1], rawPhotos[2], rawPhotos[3]];
    } else if (Array.isArray(rawPhotos) && rawPhotos.length === 3) {
      cardPhotos = [rawPhotos[0], rawPhotos[1], rawPhotos[2]];
    } else if (Array.isArray(rawPhotos) && rawPhotos.length === 2) {
      bgPhoto = rawPhotos[0];
      cardPhotos = [rawPhotos[1], rawPhotos[1], rawPhotos[1]];
    } else if (Array.isArray(rawPhotos) && rawPhotos.length === 1) {
      cardPhotos = [rawPhotos[0], rawPhotos[0], rawPhotos[0]];
    } else if (img) {
      cardPhotos = [img, img, img];
    }

    // 2. Default ocean background if no custom background photo provided
    const defaultBg = getOceanStoryBackgroundImage();
    if (defaultBg && !defaultBg.complete && typeof Image !== 'undefined') {
      defaultBg.onload = () => {
        if (typeof state?.onRedraw === 'function') state.onRedraw();
      };
    }

    // 3. Render ocean story background
    renderStoryBackground(ctx, bgPhoto, defaultBg, cw, ch);

    // 4. Render 3 floating landscape cards
    STORY_CARD_SLOTS.forEach((slot, idx) => {
      const photo = cardPhotos[idx] || img;
      if (photo) {
        renderStoryCard(ctx, photo, slot);
      }
    });

    // 5. Optional customized typography
    drawStoryDetails(ctx, cw, ch, state);
  }
};
