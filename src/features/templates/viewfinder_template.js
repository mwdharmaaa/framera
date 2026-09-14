import {
  drawPhoneChassis,
  drawCameraHUD,
  drawScreenCracks,
  drawAestheticStars
} from './viewfinder_helpers.js';

/**
 * Phone Viewfinder Template.
 * Synthesizes an authentic tilted white iPhone held over the subject with Touch ID,
 * iOS video recording HUD (00:00:00), macro eye zoom, AssistiveTouch, and cracked glass.
 */
export const viewfinderTemplate = {
  id: 'viewfinder',
  name: 'Phone Viewfinder',
  description: 'Tilted white iPhone camera viewfinder held over subject with Touch ID, video mode HUD, and cracked glass',
  previewImage: 'assets/viewfinder_reference.jpg',
  aspectRatio: '3:4',
  tag: 'CAMERA',
  photoCount: 1,
  config: {
    canvasWidth: 1200,
    canvasHeight: 1600,
    frame: { x: 0, y: 0, w: 1200, h: 1600 }
  },
  render(ctx, img, bounds, state) {
    const { canvasWidth: cw, canvasHeight: ch } = this.config;

    // 1. Full ambient portrait background
    ctx.fillStyle = '#0f1115';
    ctx.fillRect(0, 0, cw, ch);

    if (img) {
      ctx.save();
      ctx.drawImage(img, bounds.drawX, bounds.drawY, bounds.drawW, bounds.drawH);
      ctx.restore();
    }

    // 2. Realistic Phone Dimensions & Clockwise Tilt matching reference (~15.2 deg)
    const phoneX = 810, phoneY = 760;
    const phoneRot = 0.265;
    const pw = 1750, ph = 880;
    const sw = 1540, sh = 820;
    const sx = -pw / 2 + 185;
    const sy = -sh / 2;

    ctx.save();
    ctx.translate(phoneX, phoneY);
    ctx.rotate(phoneRot);

    // Deep physical phone shadow onto background face
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.78)';
    ctx.shadowBlur = 64;
    ctx.shadowOffsetX = 16;
    ctx.shadowOffsetY = 42;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(-pw / 2 - 14, -ph / 2 - 14, pw + 28, ph + 28, 72) : ctx.rect(-pw / 2, -ph / 2, pw, ph);
    ctx.fill();
    ctx.restore();

    // 3. White iPhone Chassis, Touch ID Home Button, Clear TPU Bumper
    drawPhoneChassis(ctx, pw, ph);

    // 4. Phone Screen Viewport (Clipped display)
    ctx.save();
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(sx, sy, sw, sh, 6) : ctx.rect(sx, sy, sw, sh);
    ctx.clip();

    ctx.fillStyle = '#050608';
    ctx.fillRect(sx, sy, sw, sh);

    // Zoomed macro eye portrait inside the phone viewfinder screen
    if (img) {
      ctx.save();
      const zoom = 2.05 * (state.zoom || 1);
      const zw = bounds.drawW * zoom;
      const zh = bounds.drawH * zoom;
      const zx = sx + (sw - zw) * 0.52 + (state.panX || 0);
      const zy = sy + (sh - zh) * 0.36 + (state.panY || 0);
      if (ctx.filter !== undefined) ctx.filter = 'contrast(108%) brightness(105%) saturate(110%)';
      ctx.drawImage(img, zx, zy, zw, zh);
      if (ctx.filter !== undefined) ctx.filter = 'none';
      ctx.restore();
    }

    // Overlay iOS Camera Video HUD, Screen Cracks, and Aesthetic Stars
    ctx.save();
    ctx.translate(sx, sy);
    drawCameraHUD(ctx, sw, sh, state);
    drawScreenCracks(ctx, sw, sh);
    drawAestheticStars(ctx, sw, sh);
    ctx.restore();

    ctx.restore(); // end screen clip
    ctx.restore(); // end phone transform
  }
};
