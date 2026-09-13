import { drawAstralKoi, drawCelestialSun, drawAstralSparkle } from './astral_koi_helpers.js';

/**
 * Astral Koi Reverie Template.
 * Features a cinematic horizontal eye letterbox frame flanked by golden celestial koi fish and astral bokeh glow.
 */
export const astralKoiTemplate = {
  id: 'astral_koi',
  name: 'Astral Koi Reverie',
  description: 'Cinematic horizontal eye letterbox frame flanked by golden celestial koi fish and astral bokeh glow',
  previewImage: 'assets/astral_reference.jpg',
  aspectRatio: '3:4',
  tag: 'ASTRAL ART',
  config: {
    canvasWidth: 1200,
    canvasHeight: 1600,
    frame: { x: 70, y: 520, w: 1060, h: 480 }
  },
  render(ctx, img, bounds, state) {
    const { canvasWidth: cw, canvasHeight: ch, frame } = this.config;

    // 1. Dark canvas background
    ctx.fillStyle = '#0b0c10';
    ctx.fillRect(0, 0, cw, ch);

    // 2. Light flare in top right
    const flareGrad = ctx.createRadialGradient(cw, 0, 10, cw, 0, 700);
    flareGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
    flareGrad.addColorStop(0.3, 'rgba(255, 240, 200, 0.15)');
    flareGrad.addColorStop(1, 'rgba(11, 12, 16, 0)');
    ctx.fillStyle = flareGrad;
    ctx.fillRect(0, 0, cw, ch);

    // 3. Bokeh circles near bottom
    const bokehColors = [
      { x: 580, y: 1180, r: 80, c: 'rgba(52, 152, 219, 0.18)' },
      { x: 420, y: 1280, r: 110, c: 'rgba(46, 204, 113, 0.14)' },
      { x: 700, y: 1320, r: 90, c: 'rgba(241, 196, 15, 0.16)' }
    ];
    bokehColors.forEach((b) => {
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fillStyle = b.c;
      ctx.fill();
    });

    // 4. Center Horizontal Letterbox Eye Frame
    ctx.save();
    ctx.beginPath();
    ctx.rect(frame.x, frame.y, frame.w, frame.h);
    ctx.clip();

    ctx.fillStyle = '#10121a';
    ctx.fillRect(frame.x, frame.y, frame.w, frame.h);

    if (img) {
      ctx.drawImage(img, bounds.drawX, bounds.drawY, bounds.drawW, bounds.drawH);
    }
    ctx.restore();

    // Textured Chalk Frame Border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 5;
    ctx.strokeRect(frame.x, frame.y, frame.w, frame.h);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 2;
    ctx.strokeRect(frame.x - 3, frame.y - 3, frame.w + 6, frame.h + 6);

    // 5. Celestial Koi Fish
    // Top right koi swimming down
    drawAstralKoi(ctx, frame.x + frame.w - 180, frame.y - 60, 1.35, -25);

    // Bottom left koi swimming up
    drawAstralKoi(ctx, frame.x + 120, frame.y + frame.h + 80, 1.45, -165);

    // 6. Astral Ornaments & Sparkles
    drawCelestialSun(ctx, frame.x + frame.w - 50, frame.y + frame.h + 90, 42);
    drawAstralSparkle(ctx, frame.x + 80, frame.y - 70, 24);
    drawAstralSparkle(ctx, frame.x + 120, frame.y - 40, 16);
    drawAstralSparkle(ctx, frame.x + frame.w - 120, frame.y + frame.h + 60, 18);

    // 7. Typography Branding
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 24px "Space Mono", monospace, sans-serif';
    ctx.letterSpacing = '6px';
    ctx.textAlign = 'left';
    ctx.fillText(state.caption || 'ASTRAL REVERIE', frame.x, 140);
    ctx.letterSpacing = '0px';

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '400 16px "Space Mono", monospace, sans-serif';
    ctx.fillText(state.subtitle || 'Deep within the quiet waters of consciousness, dreams navigate through astral light.', frame.x, 180);

    ctx.fillStyle = '#f39c12';
    ctx.font = '700 14px "Space Mono", monospace, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(state.date || 'VOL. 03 - DREAM REVERIE', frame.x + frame.w, ch - 80);
  }
};
