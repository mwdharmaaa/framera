/**
 * Anime Kraken Tentacles and Floating Violet Petals for Kraken Eyes Abyssal Slit.
 * Features organic tentacle curls with suction cups, black ink outlines, and floating petals.
 */

export function drawSuctionCup(ctx, x, y, rx, ry, rot) {
  if (!ctx) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);

  // Outer base rim
  ctx.fillStyle = '#b794f4';
  ctx.strokeStyle = '#0a0a0f';
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Inner dark suction cavity
  ctx.fillStyle = '#321d5c';
  ctx.strokeStyle = '#1d0e3b';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.ellipse(0, ry * 0.12, rx * 0.62, ry * 0.62, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

export function drawTopTentacle(ctx) {
  if (!ctx) return;
  ctx.save();

  const traceTop = () => {
    ctx.beginPath();
    ctx.moveTo(740, 280);
    ctx.bezierCurveTo(620, 260, 430, 260, 330, 330);
    ctx.bezierCurveTo(270, 390, 360, 480, 385, 450);
    ctx.bezierCurveTo(395, 410, 350, 350, 450, 320);
    ctx.bezierCurveTo(560, 300, 680, 370, 740, 400);
  };

  // 1. White / lavender outer sticker border glow
  ctx.strokeStyle = 'rgba(235, 225, 255, 0.4)';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  traceTop();
  ctx.stroke();
  // 2. Main tentacle body
  traceTop();
  ctx.closePath();
  ctx.fillStyle = '#805ad5';
  ctx.fill();
  ctx.strokeStyle = '#050508';
  ctx.lineWidth = 3.5;
  ctx.stroke();
  // 3. Suction cups row
  const cups = [
    [380, 385, 9, 13, 0.4], [415, 360, 11, 15, 0.25], [455, 345, 13, 17, 0.15], [500, 340, 15, 19, 0.05],
    [550, 345, 17, 21, -0.08], [605, 355, 18, 22, -0.18], [660, 370, 19, 23, -0.24], [715, 390, 20, 24, -0.28],
    [470, 375, 11, 14, 0.12], [520, 375, 13, 16, 0.02], [575, 385, 14, 17, -0.1], [630, 400, 15, 18, -0.2]
  ];
  cups.forEach(([cx, cy, rx, ry, rot]) => drawSuctionCup(ctx, cx, cy, rx, ry, rot));

  ctx.restore();
}

export function drawBottomTentacle(ctx) {
  if (!ctx) return;
  ctx.save();

  const traceBottom = () => {
    ctx.beginPath();
    ctx.moveTo(-10, 890);
    ctx.bezierCurveTo(120, 890, 240, 880, 340, 810);
    ctx.bezierCurveTo(450, 740, 410, 660, 385, 700);
    ctx.bezierCurveTo(360, 740, 270, 800, 170, 790);
    ctx.bezierCurveTo(90, 780, 20, 800, -10, 830);
  };

  // 1. White / lavender outer sticker border glow
  ctx.strokeStyle = 'rgba(235, 225, 255, 0.4)';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  traceBottom();
  ctx.stroke();
  // 2. Main tentacle body
  traceBottom();
  ctx.closePath();
  ctx.fillStyle = '#805ad5';
  ctx.fill();
  ctx.strokeStyle = '#050508';
  ctx.lineWidth = 3.5;
  ctx.stroke();
  // 3. Suction cups row
  const cups = [
    [375, 730, 10, 13, -0.45], [340, 760, 12, 15, -0.38], [298, 788, 14, 17, -0.28], [250, 810, 16, 19, -0.18],
    [195, 825, 17, 21, -0.1], [138, 835, 18, 22, 0.0], [80, 845, 19, 23, 0.08], [22, 855, 20, 24, 0.12],
    [285, 755, 11, 14, -0.28], [230, 780, 13, 16, -0.18], [172, 795, 14, 17, -0.08], [115, 808, 15, 18, 0.02]
  ];
  cups.forEach(([cx, cy, rx, ry, rot]) => drawSuctionCup(ctx, cx, cy, rx, ry, rot));

  ctx.restore();
}

export function drawFloatingPetals(ctx) {
  if (!ctx) return;

  const drawOnePetal = (px, py, size, rot) => {
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(rot);

    ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 3;
    const grad = ctx.createLinearGradient(-size, -size, size, size);
    grad.addColorStop(0, '#d8b4fe');
    grad.addColorStop(0.5, '#a855f7');
    grad.addColorStop(1, '#6b21a8');
    ctx.fillStyle = grad;

    ctx.beginPath();
    ctx.moveTo(0, -size * 1.25);
    ctx.bezierCurveTo(size * 0.9, -size * 0.8, size * 0.85, size * 0.8, 0, size * 1.25);
    ctx.bezierCurveTo(-size * 0.85, size * 0.8, -size * 0.9, -size * 0.8, 0, -size * 1.25);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.9);
    ctx.lineTo(0, size * 0.9);
    ctx.stroke();
    ctx.restore();
  };

  const petals = [
    [455, 435, 18, 0.3], [550, 420, 22, -0.5], [635, 450, 23, 0.75], [710, 475, 19, -0.2],
    [505, 465, 13, 1.0], [270, 600, 16, 0.6], [225, 665, 20, -0.4], [180, 705, 18, 0.65],
    [110, 695, 22, -0.75], [25, 715, 19, 0.2], [225, 745, 14, -0.3]
  ];
  petals.forEach(([px, py, s, r]) => drawOnePetal(px, py, s, r));
}
