/**
 * Screen cracks and aesthetic star stickers for Phone Viewfinder template.
 */

/** Draws vector 5-pointed star. */
function drawFivePointStar(ctx, cx, cy, rOut, rIn) {
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const aOut = (i * 72 - 90) * (Math.PI / 180);
    const aIn = (i * 72 + 36 - 90) * (Math.PI / 180);
    const x1 = cx + Math.cos(aOut) * rOut;
    const y1 = cy + Math.sin(aOut) * rOut;
    const x2 = cx + Math.cos(aIn) * rIn;
    const y2 = cy + Math.sin(aIn) * rIn;
    if (i === 0) ctx.moveTo(x1, y1);
    else ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
  }
  ctx.closePath();
}

/** Draws realistic tempered glass screen cracks radiating from the bottom-right. */
export function drawScreenCracks(ctx, sw = 1540, sh = 820) {
  ctx.save();
  const ox = sw - 60;
  const oy = sh - 20;

  const crackPaths = [
    // Main long crack cutting towards the eye
    [[ox, oy], [sw - 260, sh - 140], [sw - 450, sh - 190], [sw - 640, sh - 320], [sw - 820, sh - 390], [sw - 1000, sh - 460]],
    // Fork towards lower cheek
    [[sw - 450, sh - 190], [sw - 530, sh - 80], [sw - 690, sh - 30]],
    // Fork towards right edge
    [[sw - 260, sh - 140], [sw - 150, sh - 280], [sw - 120, sh - 420]],
    // Secondary hairline branch
    [[sw - 640, sh - 320], [sw - 740, sh - 240], [sw - 880, sh - 220]],
    // Fine branch near reticle
    [[sw - 820, sh - 390], [sw - 870, sh - 510], [sw - 960, sh - 560]]
  ];

  // Refraction shadow
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.42)';
  ctx.lineWidth = 2.4;
  for (const branch of crackPaths) {
    ctx.beginPath();
    ctx.moveTo(branch[0][0] + 1.5, branch[0][1] + 1.5);
    for (let i = 1; i < branch.length; i++) ctx.lineTo(branch[i][0] + 1.5, branch[i][1] + 1.5);
    ctx.stroke();
  }

  // Specular white reflection
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.82)';
  ctx.lineWidth = 1.3;
  for (const branch of crackPaths) {
    ctx.beginPath();
    ctx.moveTo(branch[0][0], branch[0][1]);
    for (let i = 1; i < branch.length; i++) ctx.lineTo(branch[i][0], branch[i][1]);
    ctx.stroke();
  }
  ctx.restore();
}

/** Draws iconic holographic blue star sticker on the cheek. */
export function drawAestheticStars(ctx, sw = 1540, sh = 820) {
  ctx.save();
  // Holographic blue star sticker placed on cheek below outer eye corner
  const bx = sw * 0.64;
  const by = sh * 0.62;

  ctx.fillStyle = '#6cbaff';
  ctx.shadowColor = 'rgba(74, 144, 226, 0.7)';
  ctx.shadowBlur = 10;
  drawFivePointStar(ctx, bx, by, 20, 9);
  ctx.fill();

  ctx.fillStyle = '#eaf5ff';
  ctx.shadowColor = 'transparent';
  drawFivePointStar(ctx, bx, by, 10, 4.5);
  ctx.fill();
  ctx.restore();
}
