import {
  MEMORY_TREE_SLOTS,
  getMemoryTreeBackgroundImage,
  renderTreeBackground,
  renderTreeSnapshotPhoto,
  drawTreeTypography
} from './memory_tree_helpers.js';

/**
 * Memory Tree Deca Story Template.
 * Aesthetic 9:16 vertical tree collage featuring 10 snapshot photo slots nestled organically along bare sky branches.
 * Supports up to 10 user photos with cyclic distribution for smaller photo sets.
 */
export const memoryTreeTemplate = {
  id: 'memory_tree_deca',
  name: 'Memory Tree Deca Story',
  description: 'Aesthetic 9:16 vertical tree collage with 10 memory snapshot photos nestled along bare sky branches',
  previewImage: 'assets/memory_tree_reference.jpg',
  aspectRatio: '9:16',
  tag: 'DECA STORY',
  tags: ['memory', 'scrapbook', 'deca', 'collage', 'nostalgia', 'multi'],
  photoCount: 10,
  category: '10',
  config: {
    canvasWidth: 736,
    canvasHeight: 1308,
    frame: { x: 22, y: 72, w: 647, h: 1088 }
  },
  render(ctx, img, bounds, state = {}) {
    const { canvasWidth: cw, canvasHeight: ch } = this.config;

    // 1. Direct reference rendering before user uploads custom photos
    const isReferencePreview = !state?.isUserUploaded && img && (
      (typeof img.src === 'string' && img.src.includes('memory_tree_reference')) ||
      (!state?.photoImgs?.length && !state?.photos?.length)
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
      drawTreeTypography(ctx, cw, ch, state);
      return;
    }

    // 2. Render tree and sky backdrop
    const defaultBg = getMemoryTreeBackgroundImage();
    if (defaultBg && !defaultBg.complete && typeof Image !== 'undefined') {
      defaultBg.onload = () => {
        if (typeof state?.onRedraw === 'function') state.onRedraw();
      };
    }
    renderTreeBackground(ctx, defaultBg, cw, ch);

    // 3. Resolve user photos for all 10 slots
    const rawPhotos = state?.photoImgs || state?.photos;
    const hasPhotos = Array.isArray(rawPhotos) && rawPhotos.length > 0;

    MEMORY_TREE_SLOTS.forEach((slot, idx) => {
      let photo = null;
      if (hasPhotos) {
        photo = rawPhotos[idx % rawPhotos.length];
      } else if (img) {
        photo = img;
      }

      if (photo) {
        renderTreeSnapshotPhoto(ctx, photo, slot);
      }
    });

    // 4. Optional typography overlay
    drawTreeTypography(ctx, cw, ch, state);
  }
};
