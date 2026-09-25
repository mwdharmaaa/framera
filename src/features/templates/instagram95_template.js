import {
  drawBevel,
  drawScanlines,
  drawFilterCarousel
} from './instagram95_helpers.js';


export const instagram95Template = {
  id: 'instagram95',
  name: 'Instagram 95',
  description: 'Retro Windows 95 application window with CRT scanlines, classic menu bar, and vintage filter strip',
  previewImage: 'assets/instagram95_reference.jpg',
  aspectRatio: '3:4',
  tag: 'RETRO',
  tags: ['retro', 'y2k', 'vintage', 'nostalgia', 'interface', 'aesthetic'],
  photoCount: 1,
  category: '1',
  config: {
    canvasWidth: 1200,
    canvasHeight: 1600,
    frame: { x: 0, y: 0, w: 1200, h: 1600 }
  },
  render(ctx, img, bounds, state) {
    const { canvasWidth: cw, canvasHeight: ch } = this.config;

    // 1. Classic Windows Teal Desktop
    ctx.fillStyle = '#008080';
    ctx.fillRect(0, 0, cw, ch);

    // 2. Main Window Outer Frame
    const winX = 70;
    const winY = 80;
    const winW = cw - 140;
    const winH = ch - 160;

    ctx.fillStyle = '#c0c0c0';
    ctx.fillRect(winX, winY, winW, winH);
    drawBevel(ctx, winX, winY, winW, winH, false);

    // 3. Titlebar (Active Classic Navy Blue)
    const tbH = 46;
    ctx.fillStyle = '#000080';
    ctx.fillRect(winX + 6, winY + 6, winW - 12, tbH);

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 20px "MS Sans Serif", "Tahoma", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(state.caption || 'Instagram.exe - [Photo Filter Studio]', winX + 20, winY + 36);

    // Window control buttons (_ [] X)
    const btnSize = 30;
    const btnY = winY + 14;
    ['-', '■', 'X'].forEach((label, idx) => {
      const bx = winX + winW - 20 - (3 - idx) * 36;
      ctx.fillStyle = '#c0c0c0';
      ctx.fillRect(bx, btnY, btnSize, btnSize);
      drawBevel(ctx, bx, btnY, btnSize, btnSize, false);
      ctx.fillStyle = '#000000';
      ctx.font = '700 16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(label, bx + btnSize / 2, btnY + 21);
    });

    // 4. Menu Bar
    ctx.fillStyle = '#000000';
    ctx.font = '500 18px "MS Sans Serif", "Tahoma", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('File   Edit   View   Image   Filter   Options   Help', winX + 16, winY + 84);

    // 5. Sunken Photo Viewport
    const pvX = winX + 24;
    const pvY = winY + 104;
    const pvW = winW - 48;
    const pvH = 960;

    drawBevel(ctx, pvX, pvY, pvW, pvH, true);
    ctx.fillStyle = '#000000';
    ctx.fillRect(pvX + 3, pvY + 3, pvW - 6, pvH - 6);

    ctx.save();
    ctx.beginPath();
    ctx.rect(pvX + 3, pvY + 3, pvW - 6, pvH - 6);
    ctx.clip();

    if (img) {
      ctx.save();
      ctx.filter = 'contrast(115%) saturate(85%) sepia(25%)';
      ctx.drawImage(img, bounds.drawX, bounds.drawY, bounds.drawW, bounds.drawH);
      ctx.restore();
    }

    drawScanlines(ctx, pvX + 3, pvY + 3, pvW - 6, pvH - 6);
    ctx.restore();

    // 6. Vintage Filter Carousel Bar
    const barY = pvY + pvH + 20;
    drawFilterCarousel(ctx, pvX, barY);


    // 7. Status Bar
    const sbY = winY + winH - 44;
    drawBevel(ctx, winX + 8, sbY, winW - 16, 36, true);
    ctx.fillStyle = '#000000';
    ctx.font = '500 15px "MS Sans Serif", "Tahoma", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('Ready', winX + 20, sbY + 24);
    ctx.fillText(state.date || '1995-10-24 16:42:00', winX + 320, sbY + 24);
    ctx.fillText('1200 x 1600 px  24-bit RGB', winX + winW - 280, sbY + 24);
  }
};
