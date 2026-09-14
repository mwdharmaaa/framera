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
    frame: { x: 5, y: 5, w: 1100, h: 790 }
  },
  render(ctx, img, bounds, state) {
    const { canvasWidth: cw, canvasHeight: ch } = this.config;

    // 1. Dark base background
    ctx.fillStyle = '#0a0a0d';
    ctx.fillRect(0, 0, cw, ch);

    // 2. High-resolution peripheral blur background outside lens
    if (img) {
      ctx.save();
      // High-res smooth optical camera blur
      if (ctx.filter !== undefined) ctx.filter = 'blur(14px) brightness(96%) contrast(102%)';
      ctx.drawImage(img, bounds.drawX, bounds.drawY, bounds.drawW, bounds.drawH);
      if (ctx.filter !== undefined) ctx.filter = 'none';

      // High-res fine-grain mosaic overlay (subtle 96-block mesh)
      const offCanvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
      if (offCanvas) {
        const mw = 96;
        const mh = Math.round(mw * (ch / cw));
        offCanvas.width = mw;
        offCanvas.height = mh;
        const offCtx = offCanvas.getContext('2d');
        if (offCtx) {
          offCtx.drawImage(img, 0, 0, mw, mh);
          ctx.imageSmoothingEnabled = false;
          ctx.globalAlpha = 0.38;
          if (ctx.filter !== undefined) ctx.filter = 'blur(4px)';
          ctx.drawImage(offCanvas, 0, 0, cw, ch);
          ctx.globalAlpha = 1.0;
        }
      }

      // Soft vignette tint over peripheral background
      ctx.fillStyle = 'rgba(8, 10, 14, 0.22)';
      ctx.fillRect(0, 0, cw, ch);
      ctx.restore();
    }

    // 3. Clear focal view inside spectacles lens (crisp and sharp)
    ctx.save();
    traceSpectacleLensPath(ctx, cw, ch);
    ctx.clip();
    ctx.fillStyle = '#111216';
    ctx.fillRect(5, 5, 1100, 790);

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
