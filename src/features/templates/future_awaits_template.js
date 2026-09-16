import {
  drawGrainyNoiseBackdrop,
  drawGlitchScanlines,
  drawCurvedHeadline,
  drawOverlaidScript
} from './future_awaits_helpers.js';

/**
 * Future Awaits Avant-Garde Editorial Template.
 * Features an out-of-focus motion-blurred grayscale portrait, razor-sharp crimson red
 * vertical eye portal, cylindrical warped brutalist headline, and neon glowing cursive script.
 */
export const futureAwaitsTemplate = {
  id: 'future_awaits',
  name: 'Future Awaits',
  description: 'Editorial brutalist poster with motion-blurred portrait, sharp crimson red eye portal, and neon calligraphy',
  previewImage: 'assets/future_awaits_reference.jpg',
  aspectRatio: '3:4',
  tag: 'NOIR RED',
  photoCount: 1,
  config: {
    canvasWidth: 1200,
    canvasHeight: 1600,
    frame: { x: 0, y: 0, w: 1200, h: 1600 }
  },
  render(ctx, img, bounds, state = {}) {
    const { canvasWidth: cw, canvasHeight: ch } = this.config;

    // 1. Off-white risograph textured paper grain background
    drawGrainyNoiseBackdrop(ctx, cw, ch);

    // 2. Motion-blurred, desaturated monochrome silhouette layer
    if (img) {
      ctx.save();
      if (ctx.filter !== undefined) {
        ctx.filter = 'grayscale(100%) blur(16px) contrast(145%) brightness(95%)';
      }
      ctx.drawImage(img, bounds.drawX, bounds.drawY, bounds.drawW, bounds.drawH);
      if (ctx.filter !== undefined) ctx.filter = 'none';

      // Subtle horizontal motion smear overlay
      ctx.globalAlpha = 0.45;
      if (ctx.filter !== undefined) ctx.filter = 'grayscale(100%) blur(8px)';
      ctx.drawImage(img, bounds.drawX - 20, bounds.drawY, bounds.drawW + 40, bounds.drawH);
      if (ctx.filter !== undefined) ctx.filter = 'none';
      ctx.globalAlpha = 1.0;
      ctx.restore();
    }

    // 3. Crisp vertical crimson-red duotone portal cutout (sharp focal eye slit)
    const portalX = Math.round(cw * 0.564); // 677
    const portalY = Math.round(ch * 0.165); // 264
    const portalW = Math.round(cw * 0.205); // 246
    const portalH = Math.round(ch * 0.475); // 760

    ctx.save();
    ctx.beginPath();
    ctx.rect(portalX, portalY, portalW, portalH);
    ctx.clip();

    // Dark solid under-layer to prevent blurred ghost bleed
    ctx.fillStyle = '#0f0505';
    ctx.fillRect(portalX, portalY, portalW, portalH);

    if (img) {
      // Crisp sharp grayscale base
      ctx.save();
      if (ctx.filter !== undefined) {
        ctx.filter = 'grayscale(100%) contrast(185%) brightness(108%)';
      }
      ctx.drawImage(img, bounds.drawX, bounds.drawY, bounds.drawW, bounds.drawH);
      if (ctx.filter !== undefined) ctx.filter = 'none';
      ctx.restore();

      // Deep crimson-red duotone multiply pass
      ctx.save();
      if (ctx.globalCompositeOperation !== undefined) {
        ctx.globalCompositeOperation = 'multiply';
      }
      ctx.fillStyle = '#ff1111';
      ctx.fillRect(portalX, portalY, portalW, portalH);
      ctx.restore();

      // Vivid red highlight screen pass
      ctx.save();
      if (ctx.globalCompositeOperation !== undefined) {
        ctx.globalCompositeOperation = 'screen';
      }
      ctx.fillStyle = 'rgba(255, 35, 35, 0.42)';
      ctx.fillRect(portalX, portalY, portalW, portalH);
      ctx.restore();
    }
    ctx.restore();

    // 4. CRT horizontal scanlines and analog digital glitch lines
    drawGlitchScanlines(ctx, cw, 1020, 1580);

    // 5. Cylindrical warped brutalist red headline ("FUTURE")
    const headline = (state.caption && state.caption !== 'FOCUS') ? state.caption : 'FUTURE';
    drawCurvedHeadline(ctx, headline, cw, 1390);

    // Subtle CRT scanline overlay across headline for analog glitch texture
    ctx.save();
    ctx.globalAlpha = 0.20;
    drawGlitchScanlines(ctx, cw, 1220, 1540);
    ctx.restore();

    // 6. Glowing white calligraphy script overlay ("Awaits")
    const script = state.subtitle || 'Awaits';
    drawOverlaidScript(ctx, script, cw, 1285);
  }
};
