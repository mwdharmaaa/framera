import {
  getImpastoPhoneOverlayImage,
  renderImpastoPhoneBackground,
  renderImpastoUserPhoto,
  drawImpastoInterfaceChrome
} from './impasto_phone_helpers.js';

/**
 * Impasto iOS Homescreen Template.
 * High-definition smartphone portrait featuring palette-knife impasto paint ridges,
 * painted app icons, notes widget, dynamic island, and customizable status bar chrome.
 */
export const impastoPhoneTemplate = {
  id: 'impasto_canvas_phone',
  name: 'Impasto iOS Homescreen',
  description: 'Textured oil painting smartphone screen with palette-knife impasto ridges, painted app icons, and dynamic status bar',
  previewImage: 'assets/impasto_phone_reference.jpg',
  aspectRatio: '9:19.5',
  tag: 'IMPASTO IOS',
  photoCount: 1,
  category: '1',
  config: {
    canvasWidth: 555,
    canvasHeight: 1200,
    frame: { x: 0, y: 0, w: 555, h: 1200 }
  },
  render(ctx, img, bounds, state = {}) {
    const { canvasWidth: cw, canvasHeight: ch } = this.config;

    // 1. Render dark base background
    renderImpastoPhoneBackground(ctx, cw, ch);

    // 2. Render user photo as wallpaper
    if (img) {
      renderImpastoUserPhoto(ctx, img, bounds, cw, ch);
    }

    // 3. Render authentic Impasto iOS Homescreen Overlay (painted icons & knife ridges)
    const overlay = getImpastoPhoneOverlayImage();
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

    // 4. Render dynamic iOS status bar, clock, and home indicator
    drawImpastoInterfaceChrome(ctx, cw, ch, state);
  }
};
