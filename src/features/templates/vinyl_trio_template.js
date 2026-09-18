import {
  getVinylTrioOverlayImage,
  POLAROID_SLOTS,
  renderPolaroidPhoto,
  drawPolaroidMarkerText,
  renderVinylTrioBackground
} from './vinyl_trio_helpers.js';

/**
 * Vinyl Record Polaroid Trio Template.
 * Features an authentic 33 RPM LP vinyl disc with 3 tilted Polaroid instant film frames
 * cascading dynamically across the record face. Supports up to 3 individual user photos.
 */
export const vinylTrioTemplate = {
  id: 'vinyl_trio',
  name: 'Vinyl Record Polaroid Trio',
  description: 'Analog vinyl LP disc collage with 3 tilted Polaroid instant frames and handwritten annotations',
  previewImage: 'assets/vinyl_trio_reference.jpg',
  aspectRatio: '3:4',
  tag: 'VINYL RETRO',
  photoCount: 3,
  category: '3',
  config: {
    canvasWidth: 1200,
    canvasHeight: 1600,
    frame: { x: 240, y: 50, w: 700, h: 1450 }
  },
  render(ctx, img, bounds, state = {}) {
    const { canvasWidth: cw, canvasHeight: ch } = this.config;

    // 1. Resolve photo instances
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

    // 2. Render middle Polaroid photo as dynamic atmospheric background
    const middlePhoto = photos[1] || photos[0] || img;
    renderVinylTrioBackground(ctx, middlePhoto, cw, ch);

    // 3. Render user photos into the 3 tilted Polaroid windows

    POLAROID_SLOTS.forEach((slot) => {
      const photo = photos[slot.id] || img;
      if (photo) {
        renderPolaroidPhoto(ctx, photo, slot);
      }
    });

    // 3. Authentic Vinyl Record and Polaroid Frame Overlay
    const overlay = getVinylTrioOverlayImage();
    if (overlay && (overlay.complete || typeof Image === 'undefined')) {
      try {
        ctx.drawImage(overlay, 0, 0, cw, ch);
      } catch {
        // Fallback for mock test environments
      }
    } else if (overlay) {
      overlay.onload = () => {
        if (typeof state?.onRedraw === 'function') state.onRedraw();
      };
    }

    // 4. Handwritten marker annotations on Polaroid bottom chins
    if (state.caption && state.caption !== 'STEREO SIDE A') {
      drawPolaroidMarkerText(ctx, state.caption, POLAROID_SLOTS[0].cx, POLAROID_SLOTS[0].cy, POLAROID_SLOTS[0].angle, POLAROID_SLOTS[0].labelY);
    }
    if (state.subtitle && state.subtitle !== '33 RPM // VOL. 03') {
      drawPolaroidMarkerText(ctx, state.subtitle, POLAROID_SLOTS[1].cx, POLAROID_SLOTS[1].cy, POLAROID_SLOTS[1].angle, POLAROID_SLOTS[1].labelY);
    }
    if (state.date && state.date !== 'MEMORIES // 2026') {
      drawPolaroidMarkerText(ctx, state.date, POLAROID_SLOTS[2].cx, POLAROID_SLOTS[2].cy, POLAROID_SLOTS[2].angle, POLAROID_SLOTS[2].labelY);
    }
  }
};
