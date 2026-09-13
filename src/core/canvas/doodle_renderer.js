/**
 * Hand-drawn doodle rendering engine for alter-ego shadow sketches.
 */

/**
 * Draws a hand-drawn 5-point star with organic sketch lines.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cx
 * @param {number} cy
 * @param {number} radius
 * @param {boolean} [filled=false]
 */
export function drawDoodleStar(ctx, cx, cy, radius, filled = false) {
  ctx.save();
  ctx.beginPath();
  const points = 5;
  const step = (Math.PI * 2) / points;
  const innerRadius = radius * 0.45;

  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? radius : innerRadius;
    const angle = i * (step / 2) - Math.PI / 2;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();

  if (filled) {
    ctx.fillStyle = '#1c1d22';
    ctx.fill();
  }
  ctx.strokeStyle = '#1c1d22';
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.stroke();

  // Subtle interior sketch lines for hand-drawn feel
  ctx.beginPath();
  ctx.moveTo(cx - radius * 0.3, cy);
  ctx.lineTo(cx + radius * 0.3, cy);
  ctx.moveTo(cx, cy - radius * 0.3);
  ctx.lineTo(cx, cy + radius * 0.3);
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.restore();
}

/**
 * Draws playful question-exclamation mark doodle (?!) with sketch vibration lines.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {number} [scale=1]
 */
export function drawDoodleQuestionExclamation(ctx, x, y, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.strokeStyle = '#1c1d22';
  ctx.fillStyle = '#1c1d22';
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Question mark '?'
  ctx.beginPath();
  ctx.arc(-14, -26, 12, Math.PI, 0, false);
  ctx.bezierCurveTo(-2, -14, -14, -8, -14, 0);
  ctx.stroke();

  // Dot for '?'
  ctx.beginPath();
  ctx.arc(-14, 10, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Exclamation mark '!'
  ctx.beginPath();
  ctx.moveTo(14, -38);
  ctx.lineTo(14, -2);
  ctx.stroke();

  // Dot for '!'
  ctx.beginPath();
  ctx.arc(14, 10, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Vibration sketch lines
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-32, -16);
  ctx.lineTo(-40, -10);
  ctx.moveTo(-34, -28);
  ctx.lineTo(-42, -26);
  ctx.stroke();

  ctx.restore();
}

/**
 * Draws hand-drawn small doodle heart.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {number} size
 */
export function drawDoodleHeart(ctx, x, y, size) {
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = '#1c1d22';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, size * 0.3);
  ctx.bezierCurveTo(-size * 0.6, -size * 0.3, -size * 0.8, size * 0.4, 0, size);
  ctx.bezierCurveTo(size * 0.8, size * 0.4, size * 0.6, -size * 0.3, 0, size * 0.3);
  ctx.stroke();
  ctx.restore();
}

/**
 * Draws curved action swoosh marks.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {number} radius
 * @param {number} startAngle
 * @param {number} endAngle
 */
export function drawActionSwoosh(ctx, x, y, radius, startAngle, endAngle) {
  ctx.save();
  ctx.strokeStyle = '#1c1d22';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(x, y, radius, startAngle, endAngle);
  ctx.stroke();
  ctx.restore();
}
