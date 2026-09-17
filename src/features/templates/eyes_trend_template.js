import {
  getEyesTrendOverlayImage,
  drawEmeraldAura,
  drawEyesTrendTypography
} from './eyes_trend_helpers.js';

/**
 * Emerald Eyes Trend Template.
 * Viral TikTok and Pinterest aesthetic template featuring an eye slit letterbox crop,
 * hand-drawn frog mascot peeking from corner, lucky four-leaf clover, and spiral doodles.
 */
export const eyesTrendTemplate = {
  id: 'eyes_trend',
  name: 'Emerald Eyes Trend',
  description: 'Viral TikTok/Pinterest eyes trend with letterbox eye slit, hand-drawn frog mascot, lucky clover, and spiral doodles',
  previewImage: 'assets/eyes_trend_reference.jpg',
  aspectRatio: '3:4',
  tag: 'Y2K DOODLE',
  photoCount: 1,
  config: {
    canvasWidth: 1200,
    canvasHeight: 1600,
    frame: { x: 0, y: 644, w: 1200, h: 329 }
  },
  render(ctx, img, bounds, state = {}) {
    const { canvasWidth: cw, canvasHeight: ch, frame } = this.config;

    // 1. Deep matte black background backing
    ctx.fillStyle = '#060706';
    ctx.fillRect(0, 0, cw, ch);

    // 2. User eye portrait clipped strictly to the central letterbox window
    if (img) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(frame.x, frame.y, frame.w, frame.h);
      ctx.clip();
      ctx.drawImage(img, bounds.drawX, bounds.drawY, bounds.drawW, bounds.drawH);

      // Subtle emerald atmosphere pass over the eye portrait
      drawEmeraldAura(ctx, frame, 0.08);
      ctx.restore();
    }

    // 3. Authentic Eyes Trend Artwork Overlay (Frog mascot, clover, spiral stars, doodles)
    const overlay = getEyesTrendOverlayImage();
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

    // 4. Aesthetic typography branding (drawn if user customizes caption, subtitle, or date)
    drawEyesTrendTypography(ctx, cw, ch, state);
  }
};
