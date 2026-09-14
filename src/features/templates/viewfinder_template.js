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

    // 2. Realistic Hand/Finger Shadows & Grip holding the phone
    const phoneX = 590, phoneY = 560;
    const phoneRot = -0.11;
    const pw = 1060, ph = 580;
    const sw = 860, sh = 536;
    const sx = -pw / 2 + 130;
    const sy = -sh / 2;

    ctx.save();
    ctx.translate(phoneX, phoneY);
    ctx.rotate(phoneRot);

    // Deep phone shadow onto background face
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
    ctx.shadowBlur = 48;
    ctx.shadowOffsetX = 8;
    ctx.shadowOffsetY = 28;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(-pw / 2 - 8, -ph / 2 - 8, pw + 16, ph + 16, 52);
    ctx.fill();
    ctx.restore();

    // 3. Phone Screen Viewport (Clipped display)
    ctx.save();
    ctx.beginPath();
    ctx.rect(sx, sy, sw, sh);
    ctx.clip();

    ctx.fillStyle = '#050608';
    ctx.fillRect(sx, sy, sw, sh);

    // Zoomed macro eye portrait inside the phone viewfinder screen
    if (img) {
      ctx.save();
      ctx.rotate(-phoneRot * 0.4);
      const zoom = 1.82;
      const zw = bounds.drawW * zoom;
      const zh = bounds.drawH * zoom;
      const zx = sx + (sw - zw) * 0.42;
      const zy = sy + (sh - zh) * 0.32;
      if (ctx.filter !== undefined) ctx.filter = 'contrast(109%) brightness(106%) saturate(114%)';
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

    // 4. White iPhone Chassis, Touch ID Home Button & Hardware
    drawPhoneChassis(ctx, pw, ph);

    // 5. Stylized Fingers holding the phone edges
    ctx.fillStyle = '#e5c0a8';
    ctx.beginPath();
    ctx.ellipse(-80, -ph / 2 - 14, 60, 26, 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(160, 100, 80, 0.25)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#dfb59c';
    ctx.beginPath();
    ctx.ellipse(-240, ph / 2 + 16, 85, 32, -0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(180, ph / 2 + 18, 70, 28, 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }
};
