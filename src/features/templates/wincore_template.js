import { drawClassicWindow, drawPixelCursor } from './wincore_helpers.js';

/**
 * Wincore Retro Y2K Template.
 * Features retro Windows XP media player portal with high-contrast threshold sketch and cascading warning dialogs.
 */
export const wincoreTemplate = {
  id: 'wincore',
  name: 'Wincore Y2K Cyber',
  description: 'Retro Windows XP media player eye portal with threshold sketch and cascading warning dialogs',
  previewImage: 'assets/wincore_reference.jpg',
  aspectRatio: '3:4',
  tag: 'Y2K RETRO',
  photoCount: 1,
  config: {
    canvasWidth: 1200,
    canvasHeight: 1600,
    frame: { x: 0, y: 0, w: 1200, h: 1600 }
  },
  render(ctx, img, bounds, state) {
    const { canvasWidth: cw, canvasHeight: ch } = this.config;

    // 1. Canvas background & base image
    ctx.fillStyle = '#050608';
    ctx.fillRect(0, 0, cw, ch);

    if (img) {
      ctx.drawImage(img, bounds.drawX, bounds.drawY, bounds.drawW, bounds.drawH);
    }

    // 2. Windows Media Player Window (Eye / Face Portal)
    const pwX = 110;
    const pwY = 240;
    const pwW = 460;
    const pwH = 450;
    drawClassicWindow(ctx, { x: pwX, y: pwY, w: pwW, h: pwH, title: 'Windows Media Player', active: true });

    // Menu Bar
    ctx.fillStyle = '#333333';
    ctx.font = '12px Tahoma, Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('File   View   Play   Tools   Help', pwX + 12, pwY + 44);

    // Inner Viewport for Threshold Sketch
    const vpX = pwX + 10;
    const vpY = pwY + 58;
    const vpW = pwW - 20;
    const vpH = pwH - 120;

    ctx.save();
    ctx.beginPath();
    ctx.rect(vpX, vpY, vpW, vpH);
    ctx.clip();

    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(vpX, vpY, vpW, vpH);

    if (img) {
      const offCanvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
      if (offCanvas) {
        offCanvas.width = vpW;
        offCanvas.height = vpH;
        const offCtx = offCanvas.getContext('2d');
        if (offCtx) {
          offCtx.drawImage(img, bounds.drawX - pwX, bounds.drawY - pwY, bounds.drawW, bounds.drawH);
          try {
            const imgData = offCtx.getImageData(0, 0, vpW, vpH);
            const data = imgData.data;
            for (let i = 0; i < data.length; i += 4) {
              const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
              const binary = lum > 118 ? 245 : 20;
              data[i] = binary;
              data[i + 1] = binary;
              data[i + 2] = binary + 8;
            }
            offCtx.putImageData(imgData, 0, 0);
            ctx.drawImage(offCanvas, vpX, vpY);
          } catch {
            ctx.drawImage(img, bounds.drawX, bounds.drawY, bounds.drawW, bounds.drawH);
          }
        }
      } else {
        ctx.drawImage(img, bounds.drawX, bounds.drawY, bounds.drawW, bounds.drawH);
      }
    }
    ctx.restore();

    // Player bottom bar & playback indicator
    ctx.fillStyle = '#223c6f';
    ctx.fillRect(pwX + 6, pwY + pwH - 54, pwW - 12, 48);
    ctx.fillStyle = '#10b981';
    ctx.fillRect(pwX + 16, pwY + pwH - 32, pwW - 32, 6);

    // 3. Pixel Mouse Cursor
    drawPixelCursor(ctx, pwX + pwW + 60, pwY + 80);

    // 4. Cascading Warning Dialogs (3 layers)
    const dwX = 540;
    const dwY = 900;
    const dwW = 560;
    const dwH = 220;

    drawClassicWindow(ctx, { x: dwX - 50, y: dwY - 50, w: dwW, h: dwH, title: 'Warning', active: false });
    drawClassicWindow(ctx, { x: dwX - 25, y: dwY - 25, w: dwW, h: dwH, title: 'Warning', active: false });
    drawClassicWindow(ctx, { x: dwX, y: dwY, w: dwW, h: dwH, title: state.caption || 'Warning', active: true });

    // Warning icon (yellow triangle)
    const iconX = dwX + 45;
    const iconY = dwY + 85;
    ctx.beginPath();
    ctx.moveTo(iconX, iconY - 24);
    ctx.lineTo(iconX + 24, iconY + 20);
    ctx.lineTo(iconX - 24, iconY + 20);
    ctx.closePath();
    ctx.fillStyle = '#ffcc00';
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#000000';
    ctx.stroke();

    ctx.fillStyle = '#000000';
    ctx.font = 'bold 22px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('!', iconX, iconY + 12);

    // Dialog text
    ctx.fillStyle = '#000000';
    ctx.font = '16px Tahoma, Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(state.subtitle || 'Your existence will now be erased.', dwX + 90, iconY);

    // Dialog action button
    const btnW = 210;
    const btnH = 36;
    const btnX = dwX + dwW - btnW - 40;
    const btnY = dwY + dwH - btnH - 24;
    ctx.fillStyle = '#ece9d8';
    ctx.fillRect(btnX, btnY, btnW, btnH);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#000000';
    ctx.strokeRect(btnX, btnY, btnW, btnH);
    ctx.fillStyle = '#000000';
    ctx.font = '14px Tahoma, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(state.date || "Finally I'll be free", btnX + btnW / 2, btnY + 22);
  }
};
