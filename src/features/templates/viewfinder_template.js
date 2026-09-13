import {
  drawFocusReticle,
  drawZoomPills,
  drawShutterButton
} from './viewfinder_helpers.js';


export const viewfinderTemplate = {
  id: 'viewfinder',
  name: 'Phone Viewfinder',
  description: 'Smartphone camera HUD held over subject with focus reticle, zoom pills, and iOS controls',
  previewImage: 'assets/viewfinder_reference.jpg',
  aspectRatio: '3:4',
  tag: 'CAMERA',
  config: {
    canvasWidth: 1200,
    canvasHeight: 1600,
    frame: { x: 0, y: 0, w: 1200, h: 1600 }
  },
  render(ctx, img, bounds, state) {
    const { canvasWidth: cw, canvasHeight: ch } = this.config;

    // 1. Full ambient background portrait (dimmed)
    ctx.fillStyle = '#0b0c0e';
    ctx.fillRect(0, 0, cw, ch);

    if (img) {
      ctx.save();
      ctx.filter = 'brightness(68%) contrast(95%) blur(1px)';
      ctx.drawImage(img, bounds.drawX, bounds.drawY, bounds.drawW, bounds.drawH);
      ctx.restore();
    }

    // 2. Smartphone Body & Shadow
    const phoneX = 170;
    const phoneY = 110;
    const phoneW = 860;
    const phoneH = 1380;
    const r = 52;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 24;

    ctx.beginPath();
    ctx.roundRect(phoneX, phoneY, phoneW, phoneH, r);
    ctx.fillStyle = '#1c1d22';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#2d2f36';
    ctx.stroke();
    ctx.restore();

    // 3. Screen Viewport
    const scX = phoneX + 18;
    const scY = phoneY + 18;
    const scW = phoneW - 36;
    const scH = phoneH - 36;
    const scR = 38;

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(scX, scY, scW, scH, scR);
    ctx.clip();

    ctx.fillStyle = '#000000';
    ctx.fillRect(scX, scY, scW, scH);

    // Zoomed focused portrait inside phone screen
    if (img) {
      ctx.save();
      ctx.filter = 'contrast(106%) brightness(102%) saturate(110%)';
      const zoom = 1.18;
      const zW = bounds.drawW * zoom;
      const zH = bounds.drawH * zoom;
      const zX = bounds.drawX - (zW - bounds.drawW) / 2;
      const zY = bounds.drawY - (zH - bounds.drawH) / 2;
      ctx.drawImage(img, zX, zY, zW, zH);
      ctx.restore();
    }

    // Dynamic Island at top
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.roundRect(cw / 2 - 110, scY + 18, 220, 36, 18);
    ctx.fill();

    // Status bar time
    ctx.fillStyle = '#ffffff';
    ctx.font = '600 20px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('09:41', scX + 44, scY + 44);

    // Yellow Focus Reticle on face
    drawFocusReticle(ctx, cw / 2, ch * 0.44, 210);

    // Zoom selector pills (.5, 1x, 2, 3)
    drawZoomPills(ctx, cw / 2, ch * 0.73);

    // Mode Selector Carousel
    const modeY = ch * 0.81;
    ctx.font = '700 17px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillText('CINEMATIC', cw / 2 - 210, modeY);
    ctx.fillText('VIDEO', cw / 2 - 90, modeY);
    ctx.fillStyle = '#facc15';
    ctx.fillText('PHOTO', cw / 2 + 10, modeY);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillText('PORTRAIT', cw / 2 + 120, modeY);

    // Shutter Button
    drawShutterButton(ctx, cw / 2, ch * 0.88);


    // Bottom caption / date stamp
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.font = '500 14px "Space Mono", monospace, sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText(state.caption || 'RAW 48MP // ISO 64 // 24MM F/1.78', cw / 2, scY + scH - 24);

    ctx.restore();
  }
};
