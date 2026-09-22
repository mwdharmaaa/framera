import {
  LIFE_OFFLINE_SLOTS,
  renderSlotPhoto,
  renderCenterCard,
  drawLifeOfflineTypography
} from './life_offline_helpers.js';

/**
 * Life Offline Outdoor Trio Template.
 * Features a split landscape composition with 50/50 dual horizon background and a centered floating white-framed card.
 * Supports up to 3 individual user photos with graceful fallback for single or dual photo uploads.
 */
export const lifeOfflineTemplate = {
  id: 'life_offline_trio',
  name: 'Life Offline Outdoor Trio',
  description: 'Outdoor photographic triptych with split horizon background and floating center white-framed card',
  previewImage: 'assets/life_offline_reference.jpg',
  aspectRatio: '4:5',
  tag: 'OUTDOOR TRIO',
  tags: ['outdoor', 'trio', 'nature', 'life', 'minimal', 'scrapbook'],
  photoCount: 3,
  category: '3',
  config: {
    canvasWidth: 736,
    canvasHeight: 920,
    frame: { x: 140, y: 308, w: 456, h: 304 }
  },
  render(ctx, img, bounds, state = {}) {
    const { canvasWidth: cw, canvasHeight: ch } = this.config;

    // 1. Direct reference preview before user uploads custom photos
    const isReferencePreview = !state?.isUserUploaded && img && (
      (typeof img.src === 'string' && img.src.includes('life_offline_reference')) ||
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
      drawLifeOfflineTypography(ctx, cw, ch, state);
      return;
    }

    // 2. Base dark backdrop
    ctx.fillStyle = '#11141a';
    if (typeof ctx.fillRect === 'function') {
      ctx.fillRect(0, 0, cw, ch);
    }

    // 3. Resolve user photo instances
    const rawPhotos = state?.photoImgs || state?.photos;
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

    // 4. Render top background slot (Slot 0)
    const topSlot = LIFE_OFFLINE_SLOTS[0];
    const topPhoto = photos[0] || img;
    if (topPhoto) {
      renderSlotPhoto(ctx, topPhoto, topSlot);
    }

    // 5. Render bottom background slot (Slot 1)
    const bottomSlot = LIFE_OFFLINE_SLOTS[1];
    const bottomPhoto = photos[1] || img;
    if (bottomPhoto) {
      renderSlotPhoto(ctx, bottomPhoto, bottomSlot);
    }

    // 6. Render center floating card (Slot 2)
    const centerSlot = LIFE_OFFLINE_SLOTS[2];
    const centerPhoto = photos[2] || photos[0] || img;
    renderCenterCard(ctx, centerPhoto, centerSlot);

    // 7. Optional typography
    drawLifeOfflineTypography(ctx, cw, ch, state);
  }
};
