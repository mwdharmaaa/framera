import {
  drawPhoneChassis,
  drawCameraHUD
} from './viewfinder_helpers.js';

/**
 * Phone Viewfinder Template.
 * Synthesizes a tilted white iPhone held over the subject with Touch ID,
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

    // 2. Realistic Phone Dimensions & Clockwise Tilt matching reference
    const phoneX = 570, phoneY = 560;
    const phoneRot = 0.135; // Authentic ~8 deg clockwise slope from reference
    const pw = 1140, ph = 580;
    const sw = 920, sh = 536;
    const sx = -pw / 2 + 132;
    const sy = -sh / 2;

    ctx.save();
    ctx.translate(phoneX, phoneY);
    ctx.rotate(phoneRot);

    // Deep physical phone shadow onto background face
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.72)';
    ctx.shadowBlur = 54;
    ctx.shadowOffsetX = 12;
    ctx.shadowOffsetY = 32;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(-pw / 2 - 10, -ph / 2 - 10, pw + 20, ph + 20, 54) : ctx.rect(-pw / 2, -ph / 2, pw, ph);
    ctx.fill();
    ctx.restore();

    // 3. Phone Screen Viewport (Clipped display)
    ctx.save();
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(sx, sy, sw, sh, 6) : ctx.rect(sx, sy, sw, sh);
    ctx.clip();

    ctx.fillStyle = '#050608';
    ctx.fillRect(sx, sy, sw, sh);

    // Zoomed macro eye portrait inside the phone viewfinder screen
    if (img) {
      ctx.save();
      const zoom = 2.15 * (state.zoom || 1);
      const zw = bounds.drawW * zoom;
      const zh = bounds.drawH * zoom;
      const zx = sx + (sw - zw) * 0.54 + (state.panX || 0);
      const zy = sy + (sh - zh) * 0.38 + (state.panY || 0);
      if (ctx.filter !== undefined) ctx.filter = 'contrast(108%) brightness(105%) saturate(112%)';
      ctx.drawImage(img, zx, zy, zw, zh);
      if (ctx.filter !== undefined) ctx.filter = 'none';
      ctx.restore();
    }

    // Overlay iOS Camera Video HUD & Screen Cracks
    ctx.save();
    ctx.translate(sx, sy);
    drawCameraHUD(ctx, sw, sh, state);
    ctx.restore();
    ctx.restore(); // end screen clip

    // 4. White iPhone Chassis, Touch ID Home Button, Clear TPU Bumper
    drawPhoneChassis(ctx, pw, ph);

    ctx.restore();
  }
};
