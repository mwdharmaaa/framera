/**
 * Textured crayon/chalk decorative flourishes for Golden Brown Botanical Duo.
 * Tactile terracotta pastel/chalk strokes with organic line modulation.
 */

function drawChalkPolyline(ctx, points, color, strokeWidth = 14) {
  if (!points || points.length < 2) return;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // 1. Soft foundation base stroke
  ctx.beginPath();
  ctx.lineWidth = strokeWidth * 0.85;
  ctx.globalAlpha = 0.68;
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const mx = (prev.x + curr.x) / 2;
    const my = (prev.y + curr.y) / 2;
    ctx.quadraticCurveTo(prev.x, prev.y, mx, my);
  }
  const last = points[points.length - 1];
  ctx.lineTo(last.x, last.y);
  ctx.stroke();

  // 2. Multi-pass chalk texture passes simulating pigment caught on paper tooth
  const passes = [
    { widthRatio: 0.65, alpha: 0.55, ox: 0.8, oy: -0.6 },
    { widthRatio: 0.40, alpha: 0.60, ox: -0.9, oy: 0.7 },
    { widthRatio: 0.90, alpha: 0.35, ox: 0.4, oy: 0.8 }
  ];

  passes.forEach((p) => {
    ctx.beginPath();
    ctx.lineWidth = strokeWidth * p.widthRatio;
    ctx.globalAlpha = p.alpha;
    ctx.moveTo(points[0].x + p.ox, points[0].y + p.oy);
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const mx = (prev.x + curr.x) / 2 + p.ox;
      const my = (prev.y + curr.y) / 2 + p.oy;
      ctx.quadraticCurveTo(prev.x + p.ox, prev.y + p.oy, mx, my);
    }
    ctx.lineTo(last.x + p.ox, last.y + p.oy);
    ctx.stroke();
  });

  // 3. Stippled chalk flecks along the edge
  ctx.fillStyle = color;
  for (let i = 0; i < points.length; i += 2) {
    const pt = points[i];
    const fleckCount = 6;
    for (let f = 0; f < fleckCount; f++) {
      const ang = Math.random() * Math.PI * 2;
      const dist = Math.random() * (strokeWidth * 0.75);
      const fx = pt.x + Math.cos(ang) * dist;
      const fy = pt.y + Math.sin(ang) * dist;
      ctx.globalAlpha = 0.30 + Math.random() * 0.45;
      ctx.beginPath();
      ctx.arc(fx, fy, 0.7 + Math.random() * 1.1, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

/**
 * Draws the top-right curling terracotta vine flourish.
 */
export function drawTopRightFlourish(ctx) {
  const points = [
    { x: 590, y: 72 },
    { x: 620, y: 46 },
    { x: 654, y: 35 },
    { x: 680, y: 45 },
    { x: 692, y: 75 },
    { x: 678, y: 120 },
    { x: 668, y: 165 },
    { x: 664, y: 210 },
    { x: 650, y: 250 },
    { x: 636, y: 280 },
    { x: 624, y: 308 },
    { x: 634, y: 318 },
    { x: 648, y: 305 },
    { x: 642, y: 285 }
  ];

  drawChalkPolyline(ctx, points, '#76281e', 14);
}

/**
 * Draws the bottom-left undulating bracket vine flourish.
 */
export function drawBottomLeftFlourish(ctx) {
  const points = [
    { x: 132, y: 452 },
    { x: 110, y: 468 },
    { x: 118, y: 498 },
    { x: 136, y: 494 },
    { x: 126, y: 530 },
    { x: 104, y: 580 },
    { x: 88, y: 625 },
    { x: 55, y: 668 },
    { x: 52, y: 686 },
    { x: 78, y: 715 },
    { x: 92, y: 750 },
    { x: 96, y: 800 },
    { x: 88, y: 845 },
    { x: 74, y: 880 },
    { x: 84, y: 910 },
    { x: 106, y: 912 },
    { x: 118, y: 890 },
    { x: 112, y: 870 }
  ];

  drawChalkPolyline(ctx, points, '#76281e', 14);
}
