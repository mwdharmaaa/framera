import {
  getLockerPlaylistOverlayImage,
  LOCKER_POLAROID_SLOTS,
  renderLockerPolaroidPhoto,
  renderLockerChassisBackground,
  drawLockerPlayerTypography
} from './locker_playlist_helpers.js';

/**
 * Locker Playlist Trio Template.
 * High school locker aesthetic collage with penco clip, torn paper background,
 * 3 landscape polaroids, peeking Snoopy sticker, and wave to earth audio player.
 */
export const lockerPlaylistTemplate = {
  id: 'locker_playlist_trio',
  name: 'Locker Playlist Trio',
  description: 'Nostalgic locker collage with penco clip, torn paper, 3 polaroids, Snoopy accent, and music player',
  previewImage: 'assets/locker_playlist_reference.jpg',
  aspectRatio: '9:16',
  tag: 'LOCKER MIX',
  photoCount: 3,
  category: '3',
  config: {
    canvasWidth: 736,
    canvasHeight: 1308,
    frame: { x: 180, y: 250, w: 380, h: 780 }
  },
  render(ctx, img, bounds, state = {}) {
    const { canvasWidth: cw, canvasHeight: ch } = this.config;

    // 1. Render base navy background
    renderLockerChassisBackground(ctx, cw, ch);

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

    // 3. Render user photos into the 3 landscape polaroid windows
    LOCKER_POLAROID_SLOTS.forEach((slot) => {
      const photo = photos[slot.id] || img;
      if (photo) {
        renderLockerPolaroidPhoto(ctx, photo, slot);
      }
    });

    // 4. Authentic Locker & Playlist Collage Overlay
    const overlay = getLockerPlaylistOverlayImage();
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

    // 5. Customized player typography
    drawLockerPlayerTypography(ctx, cw, ch, state);
  }
};
