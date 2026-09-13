/**
 * Renders playful charcoal alter-ego shadow silhouette and anime expression.
 */

/**
 * Draws the charcoal hatched alter-ego shadow character.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} ox Base X coordinate (waist center)
 * @param {number} oy Base Y coordinate (ground baseline)
 * @param {number} scale
 */
export function drawAlterEgoShadow(ctx, ox = 800, oy = 1420, scaleX = 1, scaleY = 1, flipX = false) {
  ctx.save();
  ctx.translate(ox, oy);
  const sx = flipX ? -Math.abs(scaleX) : scaleX;
  ctx.scale(sx, scaleY);

  ctx.fillStyle = '#14151a';
  ctx.strokeStyle = '#14151a';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = flipX ? -5 : 5;
  ctx.shadowOffsetY = 5;

  // 1. Character Silhouette Path
  ctx.beginPath();
  // Standing Left Leg (pant + shoe)
  ctx.moveTo(-110, 0);
  ctx.lineTo(-140, -220);
  ctx.lineTo(-100, -420);

  // Kicking Right Leg (baggy pant + sneaker)
  ctx.lineTo(20, -440);
  ctx.bezierCurveTo(80, -480, 160, -460, 240, -420);
  ctx.lineTo(310, -435); // Foot toe
  ctx.lineTo(325, -400);
  ctx.lineTo(260, -360);
  ctx.bezierCurveTo(180, -380, 100, -370, 30, -340);
  ctx.lineTo(-40, 0); // Ground crotch seam
  ctx.lineTo(-110, 0);
  ctx.fill();

  // Torso & Jacket
  ctx.beginPath();
  ctx.moveTo(-100, -420);
  ctx.bezierCurveTo(-110, -560, -90, -680, -50, -740); // Left torso to shoulder
  ctx.lineTo(90, -710); // Right shoulder
  ctx.bezierCurveTo(70, -620, 50, -500, 30, -340); // Right waist
  ctx.closePath();
  ctx.fill();

  // Left Arm (raised high in wave)
  ctx.beginPath();
  ctx.moveTo(-50, -740);
  ctx.lineTo(-240, -950); // Hand wrist
  // Splayed 5 fingers
  ctx.lineTo(-285, -995);
  ctx.lineTo(-270, -970);
  ctx.lineTo(-290, -950);
  ctx.lineTo(-260, -940);
  ctx.lineTo(-275, -920);
  ctx.lineTo(-235, -915);
  ctx.bezierCurveTo(-180, -860, -110, -780, -30, -720);
  ctx.closePath();
  ctx.fill();

  // Right Arm (flung outward and bent)
  ctx.beginPath();
  ctx.moveTo(90, -710);
  ctx.bezierCurveTo(180, -700, 260, -660, 270, -540); // Bent elbow
  ctx.lineTo(285, -510);
  // Splayed hand
  ctx.lineTo(315, -490);
  ctx.lineTo(290, -475);
  ctx.lineTo(310, -460);
  ctx.lineTo(275, -455);
  ctx.bezierCurveTo(240, -560, 170, -610, 70, -620);
  ctx.closePath();
  ctx.fill();

  // Head & Shaggy Hair Silhouette
  ctx.beginPath();
  ctx.arc(10, -820, 95, 0, Math.PI * 2);
  ctx.fill();

  // Shaggy anime hair spikes
  ctx.beginPath();
  ctx.moveTo(-80, -850);
  ctx.lineTo(-105, -780);
  ctx.lineTo(-70, -770);
  ctx.lineTo(-90, -710);
  ctx.lineTo(20, -730);
  ctx.lineTo(100, -720);
  ctx.lineTo(120, -780);
  ctx.lineTo(95, -850);
  ctx.fill();

  // 2. Charcoal Hatching Texture Overlay
  ctx.save();
  ctx.strokeStyle = 'rgba(20, 21, 26, 0.92)';
  ctx.lineWidth = 2.5;
  for (let i = -980; i < 0; i += 18) {
    ctx.beginPath();
    ctx.moveTo(-250 + (i % 30), i);
    ctx.lineTo(280 - (i % 25), i + 40);
    ctx.stroke();
  }
  ctx.restore();

  // 3. Anime Hand-Drawn Face Expression (White Cutout)
  ctx.save();
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.strokeStyle = '#ffffff';
  ctx.fillStyle = '#ffffff';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Eyes: shut laughing arcs (^ ^)
  ctx.beginPath();
  ctx.moveTo(-32, -835);
  ctx.lineTo(-14, -848);
  ctx.lineTo(2, -835);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(18, -835);
  ctx.lineTo(36, -848);
  ctx.lineTo(52, -835);
  ctx.stroke();

  // Cute blushes (three little hatch lines under eyes)
  ctx.lineWidth = 2;
  [-22, -14, -6, 26, 34, 42].forEach((bx) => {
    ctx.beginPath();
    ctx.moveTo(bx, -822);
    ctx.lineTo(bx + 4, -812);
    ctx.stroke();
  });

  // Open mouth with sticking-out tongue (:P)
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(8, -805, 26, 0.1 * Math.PI, 0.9 * Math.PI, false);
  ctx.lineTo(8 - 24, -805);
  ctx.stroke();

  // Tongue cutout
  ctx.beginPath();
  ctx.arc(8, -785, 15, 0, Math.PI, false);
  ctx.fill();
  ctx.stroke();

  // Tongue division line
  ctx.strokeStyle = '#14151a';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(8, -795);
  ctx.lineTo(8, -772);
  ctx.stroke();

  ctx.restore();
  ctx.restore();
}
