/**
 * Vector rendering routines and typography helpers for Bloom Alone template.
 */

/**
 * Renders street-style Hope Gang / Restricted advisory badge.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 */
export function drawHopeGangBadge(ctx, x, y) {
  ctx.save();

  // Top header text
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 24px "Poppins", "Syne", sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';
  ctx.fillText('HOPE GANG', x + 2, y - 6);

  // Outer container bounds
  const boxW = 264;
  const boxH = 68;

  // Left rating box: solid white square with black 'H'
  const leftW = 46;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x, y, leftW, boxH);

  ctx.fillStyle = '#0b0c10';
  ctx.font = '900 36px "Poppins", "Syne", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('H', x + leftW / 2, y + boxH / 2 + 1);

  // Right warning box: thin white border with advisory micro-copy
  const rightX = x + leftW + 4;
  const rightW = boxW - leftW - 4;

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.strokeRect(rightX, y, rightW, boxH);

  // Pill label around RESTRICTED
  const pillW = 108;
  const pillH = 20;
  ctx.strokeRect(rightX + 8, y + 8, pillW, pillH);

  ctx.fillStyle = '#ffffff';
  ctx.font = '800 13px "Space Mono", "Poppins", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('RESTRICTED', rightX + 8 + pillW / 2, y + 8 + pillH / 2 + 1);

  // Small oval seal emblem beside RESTRICTED
  const sealX = rightX + pillW + 28;
  const sealY = y + 18;
  ctx.beginPath();
  ctx.ellipse(sealX, sealY, 14, 9, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(sealX, sealY, 6, 4, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Advisory fine print lines
  ctx.font = '700 8.5px "Space Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('UNDER 17 REQUIRES ACCOMPANYING', rightX + 8, y + 42);
  ctx.fillText('PARENT OR ADULT GUARDIAN', rightX + 8, y + 54);

  ctx.restore();
}

/**
 * Draws iconic 5-petal wildflower bloom accent.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cx
 * @param {number} cy
 * @param {number} radius
 */
export function drawBloomFlower(ctx, cx, cy, radius = 48) {
  ctx.save();

  // Natural green stem and wildflower leaves
  ctx.fillStyle = '#4d7c0f';
  ctx.beginPath();
  ctx.ellipse(cx - 10, cy + radius * 0.75, 7, 16, -Math.PI / 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + 12, cy + radius * 0.82, 8, 18, Math.PI / 5, 0, Math.PI * 2);
  ctx.fill();

  // Five vibrant elongated yellow petals radiating like a wild buttercup
  const petalCount = 5;
  ctx.fillStyle = '#facc15';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 3;

  for (let i = 0; i < petalCount; i++) {
    const angle = (i * 2 * Math.PI) / petalCount - Math.PI / 2;
    const px = cx + Math.cos(angle) * (radius * 0.52);
    const py = cy + Math.sin(angle) * (radius * 0.52);

    ctx.beginPath();
    ctx.ellipse(px, py, radius * 0.54, radius * 0.22, angle, 0, Math.PI * 2);
    ctx.fill();
  }

  // Inner petal depth and pistil core
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = '#eab308';
  for (let i = 0; i < petalCount; i++) {
    const angle = (i * 2 * Math.PI) / petalCount - Math.PI / 2;
    const px = cx + Math.cos(angle) * (radius * 0.32);
    const py = cy + Math.sin(angle) * (radius * 0.32);

    ctx.beginPath();
    ctx.ellipse(px, py, radius * 0.28, radius * 0.14, angle, 0, Math.PI * 2);
    ctx.fill();
  }

  // Floral pistil center core
  ctx.fillStyle = '#ca8a04';
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#854d0e';
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.1, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Draws rounded chunky streetwear headline text with subtle shadow.
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} text
 * @param {number} x
 * @param {number} y
 * @param {number} [lineHeight=116]
 */
export function drawChunkyHeadline(ctx, text, x, y, lineHeight = 116) {
  const lines = (text || 'ITS OKAY\nTO BLOOM\nALONE')
    .split(/\n|\\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  ctx.save();
  ctx.font = '400 114px "Chewy", "Shantell Sans", "Fredoka", cursive, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  lines.forEach((line, idx) => {
    const ly = y + idx * lineHeight;

    // Soft warm organic drop shadow matching curb paint relief
    ctx.shadowColor = 'rgba(20, 16, 12, 0.45)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 5;

    // Solid white fill
    ctx.fillStyle = '#ffffff';
    ctx.fillText(line, x, ly);

    // Second fill pass without shadow for solid vibrant white core
    ctx.shadowColor = 'transparent';
    ctx.fillText(line, x, ly);
  });

  ctx.restore();
}
