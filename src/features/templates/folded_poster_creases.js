/** Draws realistic frosted semi-translucent adhesive scotch tape with crinkles. */
export function drawScotchTape(ctx, x, y, w = 125, h = 42, angle = -0.62) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  ctx.fillStyle = 'rgba(0, 8, 20, 0.32)';
  ctx.fillRect(-w / 2 + 2, -h / 2 + 3, w, h);

  ctx.fillStyle = 'rgba(238, 245, 255, 0.42)';
  ctx.fillRect(-w / 2, -h / 2, w, h);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = 1;
  ctx.strokeRect(-w / 2, -h / 2, w, h);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-w * 0.3, -h * 0.4); ctx.lineTo(-w * 0.1, h * 0.4);
  ctx.moveTo(w * 0.1, -h * 0.35); ctx.lineTo(w * 0.25, h * 0.3);
  ctx.stroke();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.fillRect(-w / 2, -h / 2, 2, h);
  ctx.fillRect(w / 2 - 2, -h / 2, 2, h);
  ctx.restore();
}

/** Draws authentic 4-quadrant tactile paper crease folds and cracked ink distress. */
export function drawTactileCreases(ctx, cw, ch, poster) {
  const mx = cw / 2;
  const my = ch / 2;

  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
  ctx.fillRect(poster.x, poster.y, mx - poster.x, my - poster.y);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.065)';
  ctx.fillRect(mx, my, poster.x + poster.w - mx, poster.y + poster.h - my);

  const drawCrease = (x1, y1, x2, y2, isVert) => {
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.18)';
    ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();

    ctx.strokeStyle = 'rgba(12, 16, 26, 0.65)';
    ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.42)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    if (isVert) {
      ctx.moveTo(x1 + 1.5, y1); ctx.lineTo(x2 + 1.5, y2);
    } else {
      ctx.moveTo(x1, y1 + 1.5); ctx.lineTo(x2, y2 + 1.5);
    }
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.lineWidth = 1.5;
    if (typeof ctx.setLineDash === 'function') {
      ctx.setLineDash([4, 12, 8, 16, 3, 20]);
    }
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    if (typeof ctx.setLineDash === 'function') {
      ctx.setLineDash([]);
    }
  };

  drawCrease(poster.x, my, poster.x + poster.w, my, false);
  drawCrease(mx, poster.y, mx, poster.y + poster.h, true);
  ctx.restore();
}
