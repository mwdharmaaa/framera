/**
 * Cinema Lens Movie Poster Template.
 * Features a mosaic background with a circular magnifying lens frame and cinematic typography.
 */
export const cinemaPosterTemplate = {
  id: 'cinema_poster',
  name: 'Cinema Lens Poster',
  description: 'Editorial movie poster with pixelated background blur, circular focus lens, and bold typography',
  previewImage: 'assets/cinema_reference.jpg',
  aspectRatio: '3:4',
  tag: 'CINEMA',
  config: {
    canvasWidth: 1200,
    canvasHeight: 1600,
    frame: { x: 0, y: 0, w: 1200, h: 1600 }
  },
  render(ctx, img, bounds, state) {
    const { canvasWidth: cw, canvasHeight: ch } = this.config;

    // 1. Solid base background
    ctx.fillStyle = '#0a0a0c';
    ctx.fillRect(0, 0, cw, ch);

    // 2. Pixelated mosaic background
    if (img) {
      const offCanvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
      if (offCanvas) {
        const mw = 36;
        const mh = Math.round(mw * (ch / cw));
        offCanvas.width = mw;
        offCanvas.height = mh;
        const offCtx = offCanvas.getContext('2d');
        if (offCtx) {
          offCtx.drawImage(img, 0, 0, mw, mh);
          ctx.save();
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(offCanvas, 0, 0, cw, ch);
          ctx.restore();
        }
      } else {
        ctx.drawImage(img, bounds.drawX, bounds.drawY, bounds.drawW, bounds.drawH);
      }
    }

    // Top Design Credit
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = '600 16px "Space Mono", monospace, sans-serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '4px';
    ctx.fillText('DESIGN BY ' + (state.date?.toUpperCase() || 'FRAMERA STUDIO'), cw / 2, 54);
    ctx.letterSpacing = '0px';

    // 3. Center Circular Magnifying Lens Frame
    const lensX = cw / 2;
    const lensY = 540;
    const lensR = 340;

    ctx.save();
    // Lens drop shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 32;
    ctx.shadowOffsetY = 14;

    // Outer Rim
    ctx.beginPath();
    ctx.arc(lensX, lensY, lensR + 7, 0, Math.PI * 2);
    ctx.lineWidth = 16;
    ctx.strokeStyle = '#b8bac0';
    ctx.stroke();

    ctx.shadowColor = 'transparent';
    ctx.beginPath();
    ctx.arc(lensX, lensY, lensR + 15, 0, Math.PI * 2);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#4a4d55';
    ctx.stroke();

    // Side metal hinges / prongs
    ctx.fillStyle = '#9da1aa';
    ctx.fillRect(lensX - lensR - 36, lensY - 10, 26, 20);
    ctx.fillRect(lensX + lensR + 10, lensY - 10, 26, 20);

    // Inner sharp photo clipping
    ctx.beginPath();
    ctx.arc(lensX, lensY, lensR, 0, Math.PI * 2);
    ctx.clip();

    ctx.fillStyle = '#111215';
    ctx.fillRect(lensX - lensR, lensY - lensR, lensR * 2, lensR * 2);

    if (img) {
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(img, bounds.drawX, bounds.drawY, bounds.drawW, bounds.drawH);
    }
    ctx.restore();

    // 4. Cinema Typography & Billing Block
    const headline = state.caption || 'HELLO';
    const subtext = state.subtitle || 'Open your eyes and look the vibes of your world. Just focus on your self';

    // Horizontal divider line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(80, 1160);
    ctx.lineTo(cw - 80, 1160);
    ctx.stroke();

    // Bold Title Block
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 132px "Syne", "Poppins", sans-serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '6px';
    ctx.fillText(headline, cw / 2, 1140);

    // Elegant Script Overlay
    ctx.save();
    ctx.font = 'italic 115px "Brush Script MT", "Caveat", cursive, Georgia';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 12;
    ctx.letterSpacing = '0px';
    ctx.fillText('World', cw / 2 + 10, 1220);
    ctx.restore();

    // Subtitle / Tagline
    ctx.fillStyle = '#f0f0f5';
    ctx.font = '500 19px "Space Mono", monospace, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(subtext, cw / 2, 1340);

    // Movie billing credits footer
    const footerText = state.date || '17 AGUSTUS 2026   ELISA ROBERT   CINEMA';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = '700 16px "Space Mono", monospace, sans-serif';
    ctx.letterSpacing = '4px';
    ctx.fillText(footerText.toUpperCase(), cw / 2, 1460);
  }
};
