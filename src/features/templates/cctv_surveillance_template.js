/** CCTV Cyber Surveillance Telemetry Template: facial tracking HUD, inspection crop, pixel UI */

function drawPixelFolder(ctx, x, y) {
  ctx.save();
  ctx.fillStyle = '#facc15';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(x, y + 8); ctx.lineTo(x + 14, y + 8);
  ctx.lineTo(x + 22, y + 16); ctx.lineTo(x + 56, y + 16);
  ctx.lineTo(x + 56, y + 46); ctx.lineTo(x, y + 46);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(x + 4, y + 18, 48, 24);
  ctx.strokeRect(x + 4, y + 18, 48, 24);
  ctx.restore();
}

function drawPixelCursor(ctx, x, y) {
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y); ctx.lineTo(x, y + 36);
  ctx.lineTo(x + 10, y + 28); ctx.lineTo(x + 18, y + 44);
  ctx.lineTo(x + 25, y + 40); ctx.lineTo(x + 17, y + 25);
  ctx.lineTo(x + 28, y + 25); ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.restore();
}

export const cctvSurveillanceTemplate = {
  id: 'cctv_surveillance',
  name: 'CCTV Surveillance',
  description: 'Cybersecurity monitoring HUD with facial detection, inspection callout crops, and pixel UI icons',
  previewImage: 'assets/ref_1090_reference.jpg',
  aspectRatio: '3:4',
  tag: 'CYBER',
  config: {
    canvasWidth: 1200,
    canvasHeight: 1600,
    frame: { x: 0, y: 0, w: 1200, h: 1600 }
  },
  render(ctx, img, bounds, state) {
    const { canvasWidth: cw, canvasHeight: ch } = this.config;

    // 1. Base CCTV Monochrome/Grainy Footage
    ctx.fillStyle = '#101216';
    ctx.fillRect(0, 0, cw, ch);

    if (img) {
      ctx.save();
      ctx.filter = 'contrast(125%) saturate(85%) brightness(95%)';
      ctx.drawImage(img, bounds.drawX, bounds.drawY, bounds.drawW, bounds.drawH);
      ctx.restore();
    }

    // 2. White Outer CCTV Crosshair Frame
    const fx = 60;
    const fy = 60;
    const fw = cw - 120;
    const fh = ch - 120;

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(fx, fy, fw, fh);

    // Crosshair ticks
    ctx.beginPath();
    ctx.moveTo(cw / 2, fy - 12); ctx.lineTo(cw / 2, fy + 12);
    ctx.moveTo(cw / 2, fy + fh - 12); ctx.lineTo(cw / 2, fy + fh + 12);
    ctx.moveTo(fx - 12, ch / 2); ctx.lineTo(fx + 12, ch / 2);
    ctx.moveTo(fx + fw - 12, ch / 2); ctx.lineTo(fx + fw + 12, ch / 2);
    ctx.stroke();

    // 3. Primary Subject Detection Box (Face area)
    const b1x = 440;
    const b1y = 260;
    const b1w = 340;
    const b1h = 280;

    ctx.strokeStyle = '#1d4ed8';
    ctx.lineWidth = 4;
    ctx.strokeRect(b1x, b1y, b1w, b1h);

    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(b1x + b1w - 140, b1y - 32, 140, 32);
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 16px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SUBJECT', b1x + b1w - 70, b1y - 10);

    // Callout zoom window on the right
    const w1x = 810;
    const w1y = 660;
    const w1s = 260;

    ctx.beginPath();
    ctx.moveTo(b1x + b1w, b1y + b1h / 2);
    ctx.lineTo(w1x + w1s / 2, w1y);
    ctx.stroke();

    ctx.fillStyle = '#0a0a0c';
    ctx.fillRect(w1x, w1y, w1s, w1s);
    ctx.strokeStyle = '#1d4ed8';
    ctx.lineWidth = 4;
    ctx.strokeRect(w1x, w1y, w1s, w1s);

    if (img) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(w1x, w1y, w1s, w1s);
      ctx.clip();
      ctx.filter = 'grayscale(100%) contrast(140%)';
      const z = 1.9;
      ctx.drawImage(img, bounds.drawX - (bounds.drawW * z - bounds.drawW) / 2, bounds.drawY - 180, bounds.drawW * z, bounds.drawH * z);
      ctx.restore();
    }

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 14px "Space Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('#580YR19', w1x, w1y - 10);

    // 4. Floating Pixel Icons & Cursor
    drawPixelFolder(ctx, 120, 700);
    drawPixelFolder(ctx, 240, 880);
    drawPixelCursor(ctx, b1x + 130, b1y + b1h - 30);

    // 5. Header Telemetry & Metadata
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 32px "Space Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('CCTV 01', fx + 30, fy + 50);

    ctx.font = '700 22px "Space Mono", monospace';
    ctx.fillText(state.caption || 'FEMALE MUSE', fx + 30, fy + 90);

    // 6. Bottom Archival Metadata
    ctx.font = '600 16px "Space Mono", monospace';
    ctx.fillText('DATA UPDATE', fx + 30, fy + fh - 70);
    ctx.fillText(state.subtitle || 'SURVEILLANCE ARCHIVE', fx + 30, fy + fh - 44);
    ctx.fillText(state.date || '2026-09-13 // REC.ACTIVE', fx + 30, fy + fh - 20);
  }
};
