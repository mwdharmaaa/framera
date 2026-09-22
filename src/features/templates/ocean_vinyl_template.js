import {
  getOceanVinylOverlayImage,
  OCEAN_POLAROID_SLOTS,
  renderOceanPolaroidPhoto,
  renderOceanVinylBackground,
  drawOceanVinylTypography
} from './ocean_vinyl_helpers.js';

/**
 * Ocean Vinyl Turntable Trio Template.
 * Features a retro turntable with an ocean-blue vinyl LP disc, 3 tilted water-caustic Polaroid frames,
 * and a decorative cyan flower accent. Supports up to 3 individual user photos.
 */
export const oceanVinylTemplate = {
  id: 'ocean_vinyl_trio',
  name: 'Ocean Vinyl Turntable Trio',
  description: 'Retro turntable collage with ocean-blue vinyl record, 3 tilted water-caustic Polaroid frames, and flower accent',
  previewImage: 'assets/ocean_vinyl_reference.jpg',
  aspectRatio: '9:16',
  tag: 'AQUA VINYL',
  tags: ['ocean', 'vinyl', 'turntable', 'trio', 'music', 'aqua'],
  photoCount: 3,
  category: '3',
  config: {
    canvasWidth: 736,
    canvasHeight: 1308,
    frame: { x: 360, y: 50, w: 350, h: 1220 }
  },
  render(ctx, img, bounds, state = {}) {
    const { canvasWidth: cw, canvasHeight: ch } = this.config;

    // 1. Render neutral studio desk surface base
    renderOceanVinylBackground(ctx, cw, ch);

    // 2. Resolve photo instances
    const rawPhotos = state?.photoImgs || state?.photos;
    let photos = [];
    if (Array.isArray(rawPhotos) && rawPhotos.length > 0) {
      photos = [
        rawPhotos[0] || img,
        rawPhotos[1] || rawPhotos[0] || img,
        rawPhotos[2] || rawPhotos[0] || img
      ];
    } else if (img) {
      photos = [img, img, img];
    }

    // 3. Render user photos into the 3 tilted Polaroid windows
    OCEAN_POLAROID_SLOTS.forEach((slot) => {
      const photo = photos[slot.id] || img;
      if (photo) {
        renderOceanPolaroidPhoto(ctx, photo, slot);
      }
    });

    // 4. Authentic Ocean Vinyl Turntable Overlay
    const overlay = getOceanVinylOverlayImage();
    if (overlay && (overlay.complete || typeof Image === 'undefined')) {
      try {
        ctx.drawImage(overlay, 0, 0, cw, ch);
      } catch {
        // Fallback for mock unit test environments
      }
    } else if (overlay) {
      overlay.onload = () => {
        if (typeof state?.onRedraw === 'function') state.onRedraw();
      };
    }

    // 5. Editorial typography on the right margin
    drawOceanVinylTypography(ctx, cw, ch, state);
  }
};
