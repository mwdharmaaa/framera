/** Y2K Folded Print Poster Template: 4-quadrant paper crease folds, guilloche curves, streetwear type */

function drawGuillocheWaves(ctx, yStart, yEnd, cw) {
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  for (let y = yStart; y <= yEnd; y += 22) {
    ctx.beginPath();
    for (let x = 0; x <= cw; x += 15) {
      const yOffset = Math.sin((x + y * 2) * 0.02) * 12;
      if (x === 0) ctx.moveTo(x, y + yOffset);
      else ctx.lineTo(x, y + yOffset);
    }
    ctx.stroke();
  }
  ctx.restore();
}

function drawPaperCreases(ctx, cw, ch) {
  ctx.save();
  const mx = cw / 2;
  const my = ch / 2;
  // Horizontal fold
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.55)';
  ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(0, my); ctx.lineTo(cw, my); ctx.stroke();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(0, my + 2); ctx.lineTo(cw, my + 2); ctx.stroke();

  // Vertical fold
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.55)';
  ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(mx, 0); ctx.lineTo(mx, ch); ctx.stroke();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(mx + 2, 0); ctx.lineTo(mx + 2, ch); ctx.stroke();
  ctx.restore();
}

function drawBarcode(ctx, x, y, w, h) {
  ctx.save();
  ctx.fillStyle = '#ffffff';
  let curX = x;
  const widths = [3, 1.5, 4, 2, 6, 2, 4, 1.5, 3, 5, 2, 4, 2, 6];
  for (let i = 0; curX < x + w - 8; i++) {
    const bw = widths[i % widths.length];
    ctx.fillRect(curX, y, bw, h);
    curX += bw + 3;
  }
  ctx.restore();
}

export const foldedPosterTemplate = {
  id: 'folded_poster',
  name: 'Y2K Folded Print Poster',
  description: 'Tactile 4-quadrant creased print poster with security guilloche engraving waves and bold streetwear typography',
  previewImage: 'assets/ref_7_reference.jpg',
  aspectRatio: '3:4',
  tag: 'POSTER',
  config: {
    canvasWidth: 1200,
    canvasHeight: 1600,
    frame: { x: 80, y: 160, w: 1040, h: 1140 }
  },
  render(ctx, img, bounds, state) {
    const { canvasWidth: cw, canvasHeight: ch, frame } = this.config;

    // 1. Deep textured paper background
    ctx.fillStyle = '#0a0c10';
    ctx.fillRect(0, 0, cw, ch);

    // Guilloche security engraving waves
    drawGuillocheWaves(ctx, 40, ch - 40, cw);

    // 2. Giant Streetwear Header Typography (Behind & Framed)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.font = '900 84px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('CRASH OUT', cw / 2, 130);

    // 3. Central Image Print Frame
    if (img) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(frame.x, frame.y, frame.w, frame.h);
      ctx.clip();
      ctx.filter = 'contrast(125%) saturate(95%) brightness(96%)';
      ctx.drawImage(img, bounds.drawX, bounds.drawY, bounds.drawW, bounds.drawH);
      ctx.restore();
    }

    // Heavy graphic frame border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.strokeRect(frame.x, frame.y, frame.w, frame.h);

    // 4. Streetwear Banner Footer
    ctx.fillStyle = '#0a0c10';
    ctx.fillRect(frame.x, frame.y + frame.h + 20, frame.w, 190);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(frame.x, frame.y + frame.h + 20, frame.w, 190);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 36px "Space Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(state.caption || 'LIVE LAUGH CRASH OUT', frame.x + 35, frame.y + frame.h + 75);

    ctx.font = '600 18px "Space Mono", monospace';
    ctx.fillStyle = '#f43f5e';
    ctx.fillText(state.subtitle || 'LIMITED EDITION STREETWEAR FOLDED PRINT', frame.x + 35, frame.y + frame.h + 115);

    ctx.font = '500 15px "Space Mono", monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(state.date || 'ISSUE #07 // EDITION 1/500 // VERIFIED AUTHENTIC', frame.x + 35, frame.y + frame.h + 155);

    // Barcode on right side of footer
    drawBarcode(ctx, frame.x + frame.w - 230, frame.y + frame.h + 50, 195, 70);
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 12px "Space Mono", monospace';
    ctx.textAlign = 'right';
    ctx.fillText('*07-CRASH-Y2K*', frame.x + frame.w - 35, frame.y + frame.h + 155);

    // 5. Tactile 4-Quadrant Paper Crease Folds (Over Everything)
    drawPaperCreases(ctx, cw, ch);
  }
};
