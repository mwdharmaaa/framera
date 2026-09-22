/**
 * Decorative element rendering routines for Leopard Chic Duo Template:
 * Procedural leopard/cheetah rosette fur patterns, lipstick kiss marks,
 * silver glitter starbursts, and dried botanical petals.
 */

/**
 * Draws realistic cheetah/leopard fur rosettes inside a rectangular boundary.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 */
export function drawLeopardPattern(ctx, x, y, w, h) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();

  // 1. Warm sandy cream fur background
  ctx.fillStyle = '#eddcc2';
  ctx.fillRect(x, y, w, h);

  // 2. Deterministic pseudo-random rosettes & spots
  const spotCount = Math.floor((w * h) / 1200);
  for (let i = 0; i < spotCount; i++) {
    const sx = x + ((Math.sin(i * 19.345) * 43758.5453 % 1 + 1) % 1) * w;
    const sy = y + ((Math.cos(i * 37.128) * 43758.5453 % 1 + 1) % 1) * h;
    const size = 10 + ((Math.sin(i * 5.12) * 43758.5453 % 1 + 1) % 1) * 14;

    const isRosette = i % 4 !== 0;

    if (isRosette) {
      // Warm caramel / amber center
      ctx.fillStyle = '#8f5c38';
      ctx.beginPath();
      ctx.ellipse(sx, sy, size * 0.75, size * 0.65, (i % 6) * 0.5, 0, Math.PI * 2);
      ctx.fill();

      // Broken dark espresso / black ring around rosette
      ctx.strokeStyle = '#2b170e';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(sx, sy, size * 0.75, (i % 5) * 0.6, (i % 5) * 0.6 + Math.PI * 1.35);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(sx, sy, size * 0.75, (i % 5) * 0.6 + Math.PI * 1.6, (i % 5) * 0.6 + Math.PI * 2.2);
      ctx.stroke();
    } else {
      // Solid satellite dot
      ctx.fillStyle = '#26140b';
      ctx.beginPath();
      ctx.arc(sx, sy, size * 0.35, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

/**
 * Draws a deep burgundy lipstick kiss imprint.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cx
 * @param {number} cy
 * @param {number} [scale=1]
 */
export function drawLipstickKiss(ctx, cx, cy, scale = 1) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-0.12);
  ctx.scale(scale, scale);

  ctx.fillStyle = '#6a1824';
  ctx.strokeStyle = '#50101a';
  ctx.lineWidth = 1.5;

  // Upper Lip (Cupid's bow with dual peaks)
  ctx.beginPath();
  ctx.moveTo(-36, 0);
  ctx.bezierCurveTo(-26, -18, -12, -22, -4, -14);
  ctx.bezierCurveTo(-1, -11, 1, -11, 4, -14);
  ctx.bezierCurveTo(12, -22, 26, -18, 36, 0);
  ctx.bezierCurveTo(24, -4, 10, -6, 0, -4);
  ctx.bezierCurveTo(-10, -6, -24, -4, -36, 0);
  ctx.fill();
  ctx.stroke();

  // Lower Lip (Full plump curve with center crease highlight)
  ctx.beginPath();
  ctx.moveTo(-34, 4);
  ctx.bezierCurveTo(-24, 22, 24, 22, 34, 4);
  ctx.bezierCurveTo(20, 9, 8, 11, 0, 11);
  ctx.bezierCurveTo(-8, 11, -20, 9, -34, 4);
  ctx.fill();
  ctx.stroke();

  // Realistic lip creases & texture striations
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = 1;
  for (let i = -24; i <= 24; i += 6) {
    ctx.beginPath();
    ctx.moveTo(i, 6);
    ctx.lineTo(i + (i < 0 ? -2 : 2), 16);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Draws a sparkling silver glitter 5-point star.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cx
 * @param {number} cy
 * @param {number} outerR
 * @param {number} innerR
 * @param {number} [rotation=0]
 */
export function drawGlitterStar(ctx, cx, cy, outerR, innerR, rotation = 0) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);

  // 1. Star base polygon
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const angle = (i * Math.PI) / 5 - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    const px = Math.cos(angle) * r;
    const py = Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();

  ctx.fillStyle = '#d6dbe0';
  ctx.fill();

  // 2. Silver metallic gradient & glitter specks
  ctx.clip();
  ctx.fillStyle = '#b0b8c2';
  for (let i = 0; i < 45; i++) {
    const gx = ((Math.sin(i * 9.21) * 43758.5453 % 1 + 1) % 1 - 0.5) * outerR * 2;
    const gy = ((Math.cos(i * 14.82) * 43758.5453 % 1 + 1) % 1 - 0.5) * outerR * 2;
    ctx.fillRect(gx, gy, 2, 2);
  }

  // Sparkling white glitter highlights
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 25; i++) {
    const gx = ((Math.sin(i * 23.41) * 43758.5453 % 1 + 1) % 1 - 0.5) * outerR * 2;
    const gy = ((Math.cos(i * 47.93) * 43758.5453 % 1 + 1) % 1 - 0.5) * outerR * 2;
    ctx.fillRect(gx, gy, 1.5, 1.5);
  }

  ctx.restore();
}

/**
 * Draws a translucent dried pressed botanical flower petal.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cx
 * @param {number} cy
 * @param {number} radius
 */
export function drawDriedFlower(ctx, cx, cy, radius = 95) {
  ctx.save();
  ctx.translate(cx, cy);

  const petalCount = 6;
  for (let p = 0; p < petalCount; p++) {
    const angle = (p * Math.PI * 2) / petalCount;
    ctx.save();
    ctx.rotate(angle);

    // Translucent crinkled dried flower petal
    ctx.fillStyle = 'rgba(128, 92, 82, 0.42)';
    ctx.strokeStyle = 'rgba(68, 44, 38, 0.55)';
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-radius * 0.35, radius * 0.4, -radius * 0.45, radius * 0.85, 0, radius);
    ctx.bezierCurveTo(radius * 0.45, radius * 0.85, radius * 0.35, radius * 0.4, 0, 0);
    ctx.fill();
    ctx.stroke();

    // Delicate botanical veins
    ctx.strokeStyle = 'rgba(52, 32, 28, 0.38)';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, radius * 0.85);
    ctx.moveTo(0, radius * 0.4);
    ctx.lineTo(-radius * 0.18, radius * 0.55);
    ctx.moveTo(0, radius * 0.6);
    ctx.lineTo(radius * 0.18, radius * 0.72);
    ctx.stroke();

    ctx.restore();
  }

  // Dried flower core / pistil
  ctx.fillStyle = '#3c2820';
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.14, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
