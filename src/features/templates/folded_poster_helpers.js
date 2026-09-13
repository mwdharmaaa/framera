/** Draws dramatic twilight indigo sky, clouds, and diagonal utility power cables. */
export function drawSkyAndCables(ctx, cw, ch) {
  const skyGrad = ctx.createLinearGradient(0, 0, cw * 0.4, ch);
  skyGrad.addColorStop(0, '#0c1527');
  skyGrad.addColorStop(0.35, '#162744');
  skyGrad.addColorStop(0.7, '#243a5e');
  skyGrad.addColorStop(1, '#0e182a');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, cw, ch);

  ctx.save();
  const clouds = [
    { x: 120, y: 820, rx: 220, ry: 160, c: 'rgba(88, 122, 162, 0.45)' },
    { x: 260, y: 920, rx: 280, ry: 180, c: 'rgba(125, 162, 202, 0.35)' },
    { x: 1040, y: 1100, rx: 240, ry: 190, c: 'rgba(68, 98, 134, 0.40)' },
    { x: 960, y: 1250, rx: 290, ry: 200, c: 'rgba(42, 65, 96, 0.50)' }
  ];
  for (const cl of clouds) {
    const cg = ctx.createRadialGradient(cl.x, cl.y, 10, cl.x, cl.y, cl.rx);
    cg.addColorStop(0, cl.c);
    cg.addColorStop(0.65, cl.c.replace(/[\d.]+\)$/, '0.15)'));
    cg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = cg;
    ctx.beginPath();
    ctx.ellipse(cl.x, cl.y, cl.rx, cl.ry, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = '#090f1a';
  ctx.lineWidth = 2.2;
  const cables = [
    { y1: 30, y2: 240, sag: 20 },
    { y1: 110, y2: 360, sag: 30 },
    { y1: 240, y2: 600, sag: 45 },
    { y1: 380, y2: 840, sag: 40 },
    { y1: 520, y2: 1120, sag: 35 },
    { y1: 720, y2: 1420, sag: 25 },
    { y1: 940, y2: 1560, sag: 20 }
  ];
  for (const cb of cables) {
    ctx.beginPath();
    ctx.moveTo(cw, cb.y1);
    ctx.quadraticCurveTo(cw * 0.45, (cb.y1 + cb.y2) / 2 + cb.sag, 0, cb.y2);
    ctx.stroke();
  }
  ctx.restore();
}

/** Draws pale poster card with security guilloche ripples and diagonal security hatching. */
export function drawPosterCardBase(ctx, poster, innerFrame) {
  ctx.save();
  ctx.shadowColor = 'rgba(0, 5, 15, 0.65)';
  ctx.shadowBlur = 28;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 12;
  ctx.fillStyle = '#ebf2f8';
  ctx.fillRect(poster.x, poster.y, poster.w, poster.h);
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.rect(poster.x, poster.y, poster.w, poster.h);
  ctx.clip();

  ctx.strokeStyle = 'rgba(145, 175, 205, 0.28)';
  ctx.lineWidth = 1;
  for (let i = -poster.h; i <= poster.w + poster.h; i += 12) {
    ctx.beginPath();
    ctx.moveTo(poster.x + i, poster.y);
    ctx.lineTo(poster.x + i + poster.h, poster.y + poster.h);
    ctx.stroke();
  }

  ctx.strokeStyle = 'rgba(115, 150, 185, 0.38)';
  ctx.lineWidth = 1.2;
  const cx = poster.x + poster.w / 2;
  for (let r = 25; r <= 460; r += 16) {
    ctx.beginPath();
    ctx.ellipse(cx, poster.y + 110, r, r * 0.42, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  for (let r = 25; r <= 460; r += 16) {
    ctx.beginPath();
    ctx.ellipse(cx, poster.y + poster.h - 85, r, r * 0.42, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.strokeStyle = '#121a2c';
  ctx.lineWidth = 3.5;
  ctx.strokeRect(innerFrame.x, innerFrame.y, innerFrame.w, innerFrame.h);
  ctx.restore();
}

/** Draws giant Y2K stencil header and crisp bottom stacked typography. */
export function drawPosterTypography(ctx, poster, innerFrame, state) {
  const cx = poster.x + poster.w / 2;

  ctx.save();
  ctx.fillStyle = '#141e33';
  ctx.font = '900 130px "Space Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const headerText = (state.caption || 'FAST').toUpperCase();
  ctx.fillText(headerText, cx, poster.y + 115);
  ctx.restore();

  ctx.save();
  ctx.fillStyle = '#121a2c';
  ctx.font = '900 32px "Space Mono", monospace';
  ctx.textAlign = 'left';
  const sub = state.subtitle || 'LIVE\nLAUGH\nCRASH OUT';
  const lines = sub.split('\n');
  let textY = innerFrame.y + innerFrame.h + 46;
  for (let i = 0; i < Math.min(lines.length, 3); i++) {
    ctx.fillText(lines[i].trim().toUpperCase(), innerFrame.x + 8, textY);
    textY += 34;
  }

  ctx.font = '700 13px "Space Mono", monospace';
  ctx.textAlign = 'right';
  ctx.fillStyle = '#3a4d6b';
  ctx.fillText('#CHARLIE', innerFrame.x + innerFrame.w - 8, innerFrame.y + innerFrame.h + 58);

  ctx.font = '900 22px "Space Mono", monospace';
  ctx.fillStyle = '#121a2c';
  ctx.fillText(state.date || '12/12/2025', innerFrame.x + innerFrame.w - 8, innerFrame.y + innerFrame.h + 86);
  ctx.restore();
}
