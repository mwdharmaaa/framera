let overlayImg = null;

/**
 * Returns cached Image instance for the authentic hand-drawn astral overlay.
 * @returns {HTMLImageElement|null}
 */
export function getAstralOverlayImage() {
  if (overlayImg) return overlayImg;
  if (typeof Image !== 'undefined') {
    overlayImg = new Image();
    overlayImg.src = 'assets/astral_overlay.png';
  }
  return overlayImg;
}

/**
 * Astral Koi Reverie Template.
 * Uses authentic hand-drawn celestial koi fish with chalk letterbox frame, cosmic sun, and astral light leak.
 */
export const astralKoiTemplate = {
  id: 'astral_koi',
  name: 'Astral Koi Reverie',
  description: 'Authentic hand-drawn celestial koi fish with chalk letterbox frame, cosmic sun, and astral light leak',
  previewImage: 'assets/astral_reference.jpg',
  aspectRatio: '3:4',
  tag: 'ASTRAL ART',
  photoCount: 1,
  config: {
    canvasWidth: 1200,
    canvasHeight: 1600,
    frame: { x: 46, y: 557, w: 1130, h: 514 }
  },
  render(ctx, img, bounds, state) {
    const { canvasWidth: cw, canvasHeight: ch, frame } = this.config;

    // 1. Pitch-black base background
    ctx.fillStyle = '#08080a';
    ctx.fillRect(0, 0, cw, ch);

    // 2. User photo clipped strictly to the inner chalk frame window
    if (img) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(frame.x, frame.y, frame.w, frame.h);
      ctx.clip();
      ctx.drawImage(img, bounds.drawX, bounds.drawY, bounds.drawW, bounds.drawH);
      ctx.restore();
    }

    // 3. Authentic Astral Overlay Artwork (Hand-drawn koi fish, chalk border, celestial sun, bokeh, flares)
    const overlay = getAstralOverlayImage();
    if (overlay && (overlay.complete || typeof Image === 'undefined')) {
      try {
        ctx.drawImage(overlay, 0, 0, cw, ch);
      } catch {
        // Safe fallback in mock test environments
      }
    } else if (overlay) {
      overlay.onload = () => {
        if (typeof state?.onRedraw === 'function') state.onRedraw();
      };
    }

    // 4. Custom Typography Branding (if user edits text)
    if (state?.caption && state.caption !== 'ASTRAL REVERIE') {
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 20px "Space Mono", monospace, sans-serif';
      ctx.letterSpacing = '4px';
      ctx.textAlign = 'left';
      ctx.fillText(state.caption, frame.x, 140);
      ctx.letterSpacing = '0px';
    }
    if (state?.subtitle && state.subtitle !== 'Deep within the quiet waters of consciousness, dreams navigate through astral light.') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '400 15px "Space Mono", monospace, sans-serif';
      ctx.fillText(state.subtitle, frame.x, 175);
    }
  }
};
