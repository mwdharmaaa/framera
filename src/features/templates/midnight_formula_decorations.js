/**
 * Procedural botanical lily rendering routines for the Midnight Formula Quad template.
 * Renders ethereal translucent lilac and rose lilies with detailed petals, veins, stamens, and center speckles.
 */

const LILY_COLOR_PALETTES = {
  lavender: {
    base: 'rgba(216, 180, 254, 0.88)',
    tip: 'rgba(168, 85, 247, 0.92)',
    center: 'rgba(243, 232, 255, 0.95)',
    speckle: 'rgba(88, 28, 135, 0.75)',
    stamen: 'rgba(253, 224, 71, 0.95)',
    anther: '#b45309'
  },
  pink: {
    base: 'rgba(244, 114, 182, 0.88)',
    tip: 'rgba(219, 39, 119, 0.92)',
    center: 'rgba(252, 231, 243, 0.95)',
    speckle: 'rgba(131, 24, 67, 0.75)',
    stamen: 'rgba(254, 240, 138, 0.95)',
    anther: '#9a3412'
  },
  blue: {
    base: 'rgba(147, 197, 253, 0.88)',
    tip: 'rgba(59, 130, 246, 0.92)',
    center: 'rgba(239, 246, 255, 0.95)',
    speckle: 'rgba(30, 58, 138, 0.75)',
    stamen: 'rgba(253, 224, 71, 0.95)',
    anther: '#854d0e'
  },
  soft_violet: {
    base: 'rgba(233, 213, 255, 0.88)',
    tip: 'rgba(192, 132, 252, 0.92)',
    center: 'rgba(250, 245, 255, 0.95)',
    speckle: 'rgba(107, 33, 168, 0.75)',
    stamen: 'rgba(250, 204, 21, 0.95)',
    anther: '#78350f'
  }
};

/**
 * Draws a single single botanically-detailed lily blossom.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cx
 * @param {number} cy
 * @param {number} radius
 * @param {number} rotation
 * @param {string} paletteKey
 */
export function drawLilyFlower(ctx, cx, cy, radius, rotation = 0, paletteKey = 'lavender') {
  if (!ctx) return;
  const palette = LILY_COLOR_PALETTES[paletteKey] || LILY_COLOR_PALETTES.lavender;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);

  // Six petals arranged in alternating inner (3) and outer (3) whorls
  const petalAngles = [0, Math.PI / 3, (2 * Math.PI) / 3, Math.PI, (4 * Math.PI) / 3, (5 * Math.PI) / 3];

  petalAngles.forEach((angle, idx) => {
    ctx.save();
    ctx.rotate(angle);

    const petalLen = idx % 2 === 0 ? radius : radius * 0.88;
    const petalW = petalLen * 0.38;

    // Petal body
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(petalW * 0.55, petalLen * 0.35, petalW * 0.7, petalLen * 0.75, 0, petalLen);
    ctx.bezierCurveTo(-petalW * 0.7, petalLen * 0.75, -petalW * 0.55, petalLen * 0.35, 0, 0);
    ctx.closePath();

    // Petal gradient fill
    const grad = ctx.createLinearGradient(0, 0, 0, petalLen);
    grad.addColorStop(0, palette.center);
    grad.addColorStop(0.45, palette.base);
    grad.addColorStop(1, palette.tip);
    ctx.fillStyle = grad;
    ctx.fill();

    // Subtle center vein
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(0, petalLen * 0.5, 0, petalLen * 0.92);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Center speckles on petal base
    ctx.fillStyle = palette.speckle;
    const speckles = [
      [petalW * 0.15, petalLen * 0.28, 1.2],
      [-petalW * 0.12, petalLen * 0.32, 1.1],
      [petalW * 0.08, petalLen * 0.42, 1.3],
      [-petalW * 0.18, petalLen * 0.45, 1.0],
      [petalW * 0.16, petalLen * 0.52, 1.2]
    ];
    speckles.forEach(([sx, sy, sr]) => {
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  });

  // Stamens and Anthers in flower center
  for (let i = 0; i < 6; i++) {
    const sAngle = (i * Math.PI) / 3 + Math.PI / 6;
    const sLen = radius * 0.48;
    const ax = Math.cos(sAngle) * sLen;
    const ay = Math.sin(sAngle) * sLen;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(ax * 0.5 + 2, ay * 0.5 - 2, ax, ay);
    ctx.strokeStyle = palette.stamen;
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // Anther (pollen head)
    ctx.save();
    ctx.translate(ax, ay);
    ctx.rotate(sAngle + Math.PI / 2);
    ctx.fillStyle = palette.anther;
    ctx.beginPath();
    ctx.ellipse(0, 0, 4.5, 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Pistil center node
  ctx.beginPath();
  ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
  ctx.fillStyle = '#65a30d';
  ctx.fill();

  ctx.restore();
}

/**
 * Renders the curated composition of 6 ethereal lilies matching reference layout.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cw
 * @param {number} ch
 */
export function drawMidnightLilies(ctx, cw = 736, ch = 1308) {
  if (!ctx) return;

  // 1. Top Right Upper (lavender)
  drawLilyFlower(ctx, 640, 115, 68, 0.28, 'lavender');

  // 2. Top Right Lower (blush pink)
  drawLilyFlower(ctx, 665, 245, 58, -0.18, 'pink');

  // 3. Upper Left (deep pink/magenta)
  drawLilyFlower(ctx, 95, 385, 76, -0.32, 'pink');

  // 4. Middle Left - below music player (soft blue)
  drawLilyFlower(ctx, 135, 630, 72, -0.22, 'blue');

  // 5. Bottom Center - floating over card split (soft violet)
  drawLilyFlower(ctx, 400, 930, 68, 0.16, 'soft_violet');

  // 6. Bottom Edge (deep lavender)
  drawLilyFlower(ctx, 280, 985, 54, -0.42, 'lavender');
}
