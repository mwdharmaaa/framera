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
  config: {
    canvasWidth: 1200,
    canvasHeight: 1600,
    frame: { x: 180, y: 140, w: 840, h: 740 }
  },
  render(ctx, img, bounds, state) {
    const { canvasWidth: cw, canvasHeight: ch } = this.config;

    // 1. Dark base background
    ctx.fillStyle = '#0a0a0d';
    ctx.fillRect(0, 0, cw, ch);

    // 2. Peripheral mosaic pixel blur background outside lens
    if (img) {
      const offCanvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
      if (offCanvas) {
        const mw = 36;
        const mh = Math.round(mw * (ch / cw));
        offCanvas.width = mw;
        offCanvas.height = mh;
        const offCtx = offCanvas.getContext('2d');
        if (offCtx) {
          offCtx.drawImage(img, 0, 0, mw, mh);
          ctx.save();
          ctx.imageSmoothingEnabled = false;
          if (ctx.filter !== undefined) ctx.filter = 'blur(6px)';
          ctx.drawImage(offCanvas, 0, 0, cw, ch);
          if (ctx.filter !== undefined) ctx.filter = 'none';
          ctx.restore();
        }
      } else {
        ctx.drawImage(img, bounds.drawX, bounds.drawY, bounds.drawW, bounds.drawH);
      }

      // Soft vignette tint over peripheral background
      ctx.fillStyle = 'rgba(8, 10, 14, 0.28)';
      ctx.fillRect(0, 0, cw, ch);
    }

    // 3. Clear focal view inside spectacles lens (crisp and sharp)
    ctx.save();
    traceSpectacleLensPath(ctx, cw, ch);
    ctx.clip();
    ctx.fillStyle = '#111216';
    ctx.fillRect(180, 140, 840, 740);

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
