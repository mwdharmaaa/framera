/**
 * Tokyo Avant-Garde Brutalist Poster Template.
 * Features architectural red grid lines, split-tone scarlet face portal,
 * vertical brutalist gothic typography banner, and cyber star motif.
 */

function drawCyberStar(ctx, cx, cy, outerR = 90, innerR = 24) {
  ctx.save();
  ctx.translate(cx, cy);

  ctx.beginPath();
  for (let i = 0; i < 4; i++) {
    const a1 = (i * Math.PI) / 2;
    const a2 = a1 + Math.PI / 4;
    if (i === 0) {
      ctx.moveTo(Math.cos(a1) * outerR, Math.sin(a1) * outerR);
    } else {
      ctx.lineTo(Math.cos(a1) * outerR, Math.sin(a1) * outerR);
    }
    ctx.lineTo(Math.cos(a2) * innerR, Math.sin(a2) * innerR);
  }
  ctx.closePath();

  ctx.fillStyle = '#e71a1a';
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#0a0a0c';
  ctx.stroke();

  // Mini inner white core
  ctx.beginPath();
  ctx.arc(0, 0, 6, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  ctx.restore();
}

export const tokyoBrutalistTemplate = {
  id: 'tokyo_brutalist',
  name: 'Tokyo Brutalist Grid',
  description: 'Avant-garde Japanese graphic poster with architectural red grid, scarlet face portal, and gothic type banner',
  previewImage: 'assets/tokyo_brutalist_reference.jpg',
  aspectRatio: '3:4',
  tag: 'BRUTALIST',
  photoCount: 1,
  config: {
    canvasWidth: 1200,
    canvasHeight: 1600,
    frame: { x: 0, y: 0, w: 1200, h: 1600 }
  },
  render(ctx, img, bounds, state) {
    const { canvasWidth: cw, canvasHeight: ch } = this.config;

    // 1. Off-white architectural paper background
    ctx.fillStyle = '#f8f8f7';
    ctx.fillRect(0, 0, cw, ch);

    // 2. Red architectural grid lines
    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(220, 0); ctx.lineTo(220, ch);
    ctx.moveTo(0, 360); ctx.lineTo(cw, 360);
    ctx.moveTo(0, 790); ctx.lineTo(cw, 790);
    ctx.moveTo(920, 0); ctx.lineTo(920, ch);
    ctx.stroke();

    // 3. Draw monochrome base portrait
    if (img) {
      ctx.save();
      ctx.filter = 'grayscale(100%) contrast(125%) brightness(96%)';
      ctx.drawImage(img, bounds.drawX, bounds.drawY, bounds.drawW, bounds.drawH);
      ctx.restore();
    }

    // 4. Scarlet Red Split-Tone Portal (Left cheek/eye)
    const portalX = 220;
    const portalY = 360;
    const portalW = 430;
    const portalH = 430;

    ctx.save();
    ctx.beginPath();
    ctx.rect(portalX, portalY, portalW, portalH);
    ctx.clip();

    ctx.fillStyle = '#e61919';
    ctx.fillRect(portalX, portalY, portalW, portalH);

    if (img) {
      ctx.globalCompositeOperation = 'multiply';
      ctx.drawImage(img, bounds.drawX, bounds.drawY, bounds.drawW, bounds.drawH);
    }
    ctx.restore();

    // 3 White cube dots on portal left edge
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(portalX + 12, portalY + 20, 36, 36);
    ctx.fillRect(portalX + 12, portalY + 70, 36, 36);
    ctx.fillRect(portalX + 12, portalY + 120, 36, 36);

    // 5. Right Vertical Scarlet Typography Banner
    const bannerX = 910;
    const bannerY = 150;
    const bannerW = 230;
    const bannerH = 820;

    ctx.fillStyle = '#e61919';
    ctx.fillRect(bannerX, bannerY, bannerW, bannerH);

    // Vertical distorted gothic lettering
    const titleText = (state.caption || 'TOKYO').toUpperCase();
    ctx.save();
    ctx.translate(bannerX + bannerW / 2, bannerY + bannerH / 2);
    ctx.rotate(Math.PI / 2);
    ctx.fillStyle = '#0a0a0c';
    ctx.font = '900 128px "Syne", "Poppins", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = '14px';
    ctx.fillText(titleText, 0, 0);
    ctx.restore();

    // 6. Cyber Star Motif
    drawCyberStar(ctx, 220, 840, 110, 28);

    // 7. Minimalist Archival Footer
    ctx.fillStyle = '#0a0a0c';
    ctx.font = '700 16px "Space Mono", monospace, sans-serif';
    ctx.letterSpacing = '6px';
    ctx.textAlign = 'left';
    ctx.fillText(state.date || '2026 - BRUTALIST ARCHIVE VOL.01', 60, ch - 60);
  }
};
