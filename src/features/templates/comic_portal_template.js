/** Comic Portal Eye Cutout Template: hand-drawn chalk dash border, stylized manga eye portal, starburst accents */

function drawStarburst(ctx, cx, cy, radius, color = '#ffffff') {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx, cy - radius);
  ctx.quadraticCurveTo(cx, cy, cx + radius, cy);
  ctx.quadraticCurveTo(cx, cy, cx, cy + radius);
  ctx.quadraticCurveTo(cx, cy, cx - radius, cy);
  ctx.quadraticCurveTo(cx, cy, cx, cy - radius);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawCrossStitch(ctx, x, y, s = 8) {
  ctx.beginPath();
  ctx.moveTo(x - s, y - s); ctx.lineTo(x + s, y + s);
  ctx.moveTo(x - s, y + s); ctx.lineTo(x + s, y - s);
  ctx.stroke();
}

export const comicPortalTemplate = {
  id: 'comic_portal',
  name: 'Comic Sketch Eye Portal',
  description: 'Editorial portrait with chalk-stitched manga eye cutout, anime duotone filter, and starburst accents',
  previewImage: 'assets/insta_pop_reference.jpg',
  aspectRatio: '3:4',
  tag: 'EDITORIAL',
  config: {
    canvasWidth: 1200,
    canvasHeight: 1600,
    frame: { x: 70, y: 70, w: 1060, h: 1460 }
  },
  render(ctx, img, bounds, state) {
    const { canvasWidth: cw, canvasHeight: ch, frame } = this.config;

    // 1. Dark minimalist canvas backing
    ctx.fillStyle = '#0b0c10';
    ctx.fillRect(0, 0, cw, ch);

    // 2. Base Real Photo
    if (img) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(frame.x, frame.y, frame.w, frame.h);
      ctx.clip();
      ctx.filter = 'contrast(110%) saturate(100%)';
      ctx.drawImage(img, bounds.drawX, bounds.drawY, bounds.drawW, bounds.drawH);
      ctx.restore();
    }

    // Outer framing border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(frame.x, frame.y, frame.w, frame.h);

    // 3. Comic Manga Eye Cutout Portal
    const px = frame.x + 80;
    const py = frame.y + 420;
    const pw = frame.w - 160;
    const ph = 260;

    if (img) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(px, py, pw, ph);
      ctx.clip();
      // Stylized high-contrast anime comic filter
      ctx.filter = 'contrast(240%) saturate(200%) brightness(105%) hue-rotate(290deg)';
      const zoom = 1.12;
      const zOffX = (bounds.drawW * zoom - bounds.drawW) / 2;
      const zOffY = (bounds.drawH * zoom - bounds.drawH) / 2;
      ctx.drawImage(img, bounds.drawX - zOffX, bounds.drawY - zOffY, bounds.drawW * zoom, bounds.drawH * zoom);

      // Subtle comic halftone overlay tint
      ctx.fillStyle = 'rgba(236, 72, 153, 0.18)';
      ctx.fillRect(px, py, pw, ph);
      ctx.restore();
    }

    // 4. Chalk Dash Cross-stitch Border
    ctx.save();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3.5;
    ctx.setLineDash([12, 8]);
    ctx.strokeRect(px, py, pw, ph);
    ctx.setLineDash([]);

    // Corner cross-stitches
    drawCrossStitch(ctx, px, py);
    drawCrossStitch(ctx, px + pw, py);
    drawCrossStitch(ctx, px, py + ph);
    drawCrossStitch(ctx, px + pw, py + ph);
    ctx.restore();

    // 5. Hand-drawn Starburst Accents
    drawStarburst(ctx, px - 25, py - 20, 22, '#fb7185');
    drawStarburst(ctx, px + pw + 30, py + 40, 18, '#ffffff');
    drawStarburst(ctx, px + pw - 40, py + ph + 35, 26, '#f472b6');
    drawStarburst(ctx, px + 50, py + ph + 30, 14, '#ffffff');

    // 6. Header Editorial Typography
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 28px "Space Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('COMIC EYE PORTAL', frame.x + 40, frame.y + 55);

    ctx.font = '600 15px "Space Mono", monospace';
    ctx.fillStyle = '#f472b6';
    ctx.fillText('ANIME SKETCH OVERLAY // DUALITY', frame.x + 40, frame.y + 82);

    // 7. Bottom Artist Stamp & Signature
    ctx.fillStyle = 'rgba(11, 12, 16, 0.85)';
    ctx.fillRect(frame.x + 30, frame.y + frame.h - 120, frame.w - 60, 90);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(frame.x + 30, frame.y + frame.h - 120, frame.w - 60, 90);

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 22px "Space Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(state.caption || 'EYES OF THE BEHOLDER', frame.x + 55, frame.y + frame.h - 75);

    ctx.font = '500 15px "Space Mono", monospace';
    ctx.fillStyle = '#f472b6';
    ctx.fillText(state.subtitle || 'HAND-CRAFTED COMIC SKETCH EDITION', frame.x + 55, frame.y + frame.h - 45);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(state.date || 'SIGNATURE #042 // 2026', frame.x + frame.w - 55, frame.y + frame.h - 45);
  }
};
