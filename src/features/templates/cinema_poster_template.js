import {
  traceSpectacleLensPath,
  drawGlassesFrame,
  drawCinemaTypography
} from './cinema_poster_helpers.js';

/**
 * Cinema Lens Movie Poster Template.
 * Features an editorial spectacles lens frame with sharp focal vision,
 * mosaic-blurred peripheral background, and iconic HELLO World layered typography.
 */
export const cinemaPosterTemplate = {
  id: 'cinema_poster',
  name: 'Cinema Lens Poster',
  description: 'Editorial movie poster with pixelated background blur, spectacles focus lens, and HELLO World typography',
  previewImage: 'assets/cinema_reference.jpg',
  aspectRatio: '3:4',
  tag: 'CINEMA',
  tags: ['cinema', 'poster', 'film', 'minimal', 'editorial', 'movie'],
  photoCount: 1,
  category: '1',
  config: {
    canvasWidth: 1200,
    canvasHeight: 1600,
    frame: { x: 0, y: 0, w: 1200, h: 1600 }
  },
  render(ctx, img, bounds, state) {
    const { canvasWidth: cw, canvasHeight: ch } = this.config;

    // 1. Dark base background
    ctx.fillStyle = '#0a0a0d';
    ctx.fillRect(0, 0, cw, ch);

    // 2. High-resolution peripheral mosaic background outside lens (authentic pixelated view)
    if (img) {
      ctx.save();
      // Base optical layer
      if (ctx.filter !== undefined) {
        ctx.filter = 'blur(4px) brightness(96%) contrast(102%)';
      }
      ctx.drawImage(img, bounds.drawX, bounds.drawY, bounds.drawW, bounds.drawH);
      if (ctx.filter !== undefined) ctx.filter = 'none';

      // Chunky editorial pixel mosaic strictly matching reference artwork
      const offCanvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
      if (offCanvas) {
        const scaleDown = 24;
        offCanvas.width = Math.max(1, Math.round(cw / scaleDown));
        offCanvas.height = Math.max(1, Math.round(ch / scaleDown));
        const offCtx = offCanvas.getContext('2d');
        if (offCtx) {
          offCtx.imageSmoothingEnabled = false;
          offCtx.drawImage(
            img,
            bounds.drawX / scaleDown,
            bounds.drawY / scaleDown,
            bounds.drawW / scaleDown,
            bounds.drawH / scaleDown
          );
          ctx.imageSmoothingEnabled = false;
          ctx.globalAlpha = 0.94;
          ctx.drawImage(offCanvas, 0, 0, cw, ch);
          ctx.globalAlpha = 1.0;
          ctx.imageSmoothingEnabled = true;
        }
      }

      // Soft cinematic tint over peripheral background
      ctx.fillStyle = 'rgba(6, 8, 12, 0.15)';
      ctx.fillRect(0, 0, cw, ch);
      ctx.restore();
    }

    // 3. Clear focal view inside spectacles lens (crisp, sharp, perfectly seamless)
    ctx.save();
    traceSpectacleLensPath(ctx, cw, ch);
    ctx.clip();
    ctx.fillStyle = '#111216';
    ctx.fillRect(0, 0, cw, ch);

    if (img) {
      ctx.imageSmoothingEnabled = true;
      if (ctx.filter !== undefined) ctx.filter = 'none';
      ctx.drawImage(img, bounds.drawX, bounds.drawY, bounds.drawW, bounds.drawH);
    }
    ctx.restore();

    // 4. Glasses hardware: metallic rims, temple arms, hinge joints, glass reflection
    drawGlassesFrame(ctx, cw, ch);

    // 5. Cinema typography: designer header, interrupted line, HELLO World, billing footer
    drawCinemaTypography(ctx, cw, ch, state);
  }
};
