/**
 * Botanical floral illustrations for Golden Brown Botanical Duo template.
 * Handcrafted colored-pencil style layered blooms with fine etching lines.
 */

function drawBotanicalLeaf(ctx, cx, cy, angle, length, width) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(-width, length * 0.5, 0, length);
  ctx.quadraticCurveTo(width, length * 0.5, 0, 0);
  ctx.fillStyle = '#4c5226';
  ctx.fill();
  ctx.strokeStyle = '#2d3312';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, length * 0.85);
  ctx.stroke();
  ctx.restore();
}

function drawBotanicalPetal(ctx, angle, length, width, baseColor, tipColor) {
  ctx.save();
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-width * 0.75, length * 0.35, -width * 0.85, length * 0.8, -width * 0.25, length);
  ctx.bezierCurveTo(-width * 0.05, length * 1.04, width * 0.05, length * 1.04, width * 0.25, length);
  ctx.bezierCurveTo(width * 0.85, length * 0.8, width * 0.75, length * 0.35, 0, 0);
  ctx.closePath();

  const grad = ctx.createLinearGradient(0, 0, 0, length);
  grad.addColorStop(0, baseColor);
  grad.addColorStop(0.45, tipColor);
  grad.addColorStop(0.85, '#fde282');
  grad.addColorStop(1, '#fffae0');
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.strokeStyle = '#c2620a';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = 'rgba(145, 55, 8, 0.40)';
  ctx.lineWidth = 0.8;
  ctx.moveTo(0, length * 0.12);
  ctx.lineTo(0, length * 0.88);
  ctx.moveTo(-width * 0.3, length * 0.35);
  ctx.quadraticCurveTo(-width * 0.2, length * 0.6, -width * 0.1, length * 0.82);
  ctx.moveTo(width * 0.3, length * 0.35);
  ctx.quadraticCurveTo(width * 0.2, length * 0.6, width * 0.1, length * 0.82);
  ctx.stroke();
  ctx.restore();
}

export function drawGoldenBloom(ctx, cx, cy, radius, rotation = 0) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);

  for (let i = 0; i < 8; i++) {
    drawBotanicalPetal(ctx, (i * Math.PI * 2) / 8, radius, radius * 0.52, '#d67512', '#f6b834');
  }
  for (let i = 0; i < 7; i++) {
    drawBotanicalPetal(ctx, (i * Math.PI * 2) / 7 + Math.PI / 7, radius * 0.78, radius * 0.44, '#df7e18', '#f8c442');
  }
  for (let i = 0; i < 6; i++) {
    drawBotanicalPetal(ctx, (i * Math.PI * 2) / 6 + Math.PI / 6, radius * 0.55, radius * 0.36, '#e8891f', '#fcd256');
  }

  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.22, 0, Math.PI * 2);
  const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 0.22);
  coreGrad.addColorStop(0, '#4e1e07');
  coreGrad.addColorStop(0.7, '#883a12');
  coreGrad.addColorStop(1, '#b05018');
  ctx.fillStyle = coreGrad;
  ctx.fill();
  ctx.strokeStyle = '#381203';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = '#fce275';
  for (let i = 0; i < 14; i++) {
    const pAng = (i * Math.PI * 2) / 14;
    ctx.beginPath();
    ctx.arc(Math.cos(pAng) * radius * 0.14, Math.sin(pAng) * radius * 0.14, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

export function drawBronzeAster(ctx, cx, cy, radius, rotation = 0) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);

  for (let i = 0; i < 16; i++) {
    ctx.save();
    ctx.rotate((i * Math.PI * 2) / 16);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-radius * 0.13, radius * 0.45);
    ctx.lineTo(0, radius);
    ctx.lineTo(radius * 0.13, radius * 0.45);
    ctx.closePath();
    ctx.fillStyle = i % 2 === 0 ? '#985232' : '#b66944';
    ctx.fill();
    ctx.strokeStyle = '#52200f';
    ctx.lineWidth = 0.8;
    ctx.stroke();
    ctx.restore();
  }

  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.26, 0, Math.PI * 2);
  ctx.fillStyle = '#3a1306';
  ctx.fill();
  ctx.strokeStyle = '#220801';
  ctx.lineWidth = 0.9;
  ctx.stroke();
  ctx.restore();
}

export function drawTopLeftFlowerCluster(ctx) {
  drawBotanicalLeaf(ctx, 220, 70, -0.6, 50, 18);
  drawBotanicalLeaf(ctx, 280, 50, 0.4, 45, 16);
  drawBronzeAster(ctx, 162, 92, 38, 0.4);
  drawBronzeAster(ctx, 222, 144, 42, 1.1);
  drawGoldenBloom(ctx, 152, 138, 58, -0.35);
  drawGoldenBloom(ctx, 260, 92, 82, 0.25);
}

export function drawBottomRightFlowerCluster(ctx) {
  drawBotanicalLeaf(ctx, 600, 1140, -2.1, 46, 17);
  drawBotanicalLeaf(ctx, 670, 1100, -1.2, 42, 15);
  drawBronzeAster(ctx, 595, 1162, 38, 0.6);
  drawBronzeAster(ctx, 684, 1118, 44, -0.2);
  drawGoldenBloom(ctx, 646, 1204, 88, -0.6);
}
