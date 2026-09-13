/**
 * Helper routines for Cinema Lens Poster template.
 * Renders curved spectacle frame, metallic hardware, and editorial billing typography.
 */

/** Traces the rounded spectacle / glasses lens frame path with ultra-smooth continuous curvature. */
export function traceSpectacleLensPath(ctx, cw = 1200, ch = 1600) {
  ctx.beginPath();
  ctx.moveTo(600, 142);
  ctx.bezierCurveTo(800, 142, 985, 180, 1070, 260); ctx.bezierCurveTo(1105, 295, 1112, 335, 1110, 385);
  ctx.bezierCurveTo(1105, 530, 995, 780, 830, 845); ctx.bezierCurveTo(720, 868, 650, 870, 600, 870);
  ctx.bezierCurveTo(550, 870, 480, 868, 370, 845); ctx.bezierCurveTo(205, 780, 95, 530, 90, 385);
  ctx.bezierCurveTo(88, 335, 95, 295, 130, 260); ctx.bezierCurveTo(215, 180, 400, 142, 600, 142);
  ctx.closePath();
}

/** Draws realistic metallic spectacles frame, temple arms, hinge screws, and glass sheen. */
export function drawGlassesFrame(ctx, cw = 1200, ch = 1600) {
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.72)';
  ctx.shadowBlur = 34;
  ctx.shadowOffsetY = 16;

  // Temple arms extending outwards
  const drawArm = (x1, x2, c1, c2) => {
    const g = ctx.createLinearGradient ? ctx.createLinearGradient(x1, 315, x2, 315) : null;
    if (g) { g.addColorStop(0, c1); g.addColorStop(0.5, '#b0b4bc'); g.addColorStop(1, c2); ctx.strokeStyle = g; }
    else { ctx.strokeStyle = '#8a8e96'; }
    ctx.lineWidth = 11;
    ctx.beginPath(); ctx.moveTo(x1, 315); ctx.lineTo(x2, 315); ctx.stroke();
  };
  drawArm(0, 100, '#555860', '#787b84');
  drawArm(1100, cw, '#787b84', '#555860');

  // Thick metallic wireframe rim
  const rimGrad = ctx.createLinearGradient ? ctx.createLinearGradient(100, 140, 1100, 870) : null;
  if (rimGrad) {
    rimGrad.addColorStop(0, '#a2a6af'); rimGrad.addColorStop(0.3, '#ffffff');
    rimGrad.addColorStop(0.65, '#6b6f78'); rimGrad.addColorStop(1, '#b5b9c2');
    ctx.strokeStyle = rimGrad;
  } else { ctx.strokeStyle = '#9ca0a8'; }
  ctx.lineWidth = 16;
  traceSpectacleLensPath(ctx, cw, ch);
  ctx.stroke();

  // Inner dark accent bevel and specular rim line
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = 'rgba(18, 20, 24, 0.75)';
  ctx.lineWidth = 3;
  traceSpectacleLensPath(ctx, cw, ch);
  ctx.stroke();

  // Metal hinge joints & screws
  ctx.fillStyle = '#c5c8d0'; ctx.strokeStyle = '#32343a'; ctx.lineWidth = 2;
  for (const h of [{ x: 92, y: 303 }, { x: 1086, y: 303 }]) {
    ctx.fillRect(h.x, h.y, 22, 24); ctx.strokeRect(h.x, h.y, 22, 24);
    ctx.beginPath();
    ctx.arc ? ctx.arc(h.x + 11, h.y + 12, 4, 0, Math.PI * 2) : ctx.rect(h.x + 7, h.y + 8, 8, 8);
    ctx.fillStyle = '#454850';
    ctx.fill ? ctx.fill() : ctx.fillRect(h.x + 7, h.y + 8, 8, 8);
    ctx.fillStyle = '#c5c8d0';
  }

  // Subtle glass lens reflection sheen
  ctx.save();
  traceSpectacleLensPath(ctx, cw, ch);
  ctx.clip();
  if (ctx.globalCompositeOperation !== undefined) ctx.globalCompositeOperation = 'screen';
  const glassSheen = ctx.createLinearGradient ? ctx.createLinearGradient(160, 140, 600, 560) : null;
  if (glassSheen) {
    glassSheen.addColorStop(0, 'rgba(255, 255, 255, 0.18)');
    glassSheen.addColorStop(0.4, 'rgba(255, 255, 255, 0.05)');
    glassSheen.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = glassSheen;
    ctx.fillRect(80, 130, 1040, 750);
  }
  ctx.restore();
  ctx.restore();
}

/** Draws Cinema typography: interrupted horizontal rule, bold HELLO, script World, and billing footer. */
export function drawCinemaTypography(ctx, cw = 1200, ch = 1600, state = {}) {
  ctx.save();
  // 1. Top designer credit
  const credit = state.designer || 'ALEX HALILIANAA';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.font = '600 16px "Space Mono", monospace, sans-serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '5px';
  ctx.fillText('DESIGN BY ' + credit.toUpperCase(), cw / 2, 58);
  ctx.letterSpacing = '0px';

  // 2. Interrupted horizontal rule (breaks cleanly around HELLO text)
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(60, 1105); ctx.lineTo(cw / 2 - 275, 1105);
  ctx.moveTo(cw / 2 + 275, 1105); ctx.lineTo(cw - 60, 1105);
  ctx.stroke();

  // 3. Bold condensed HELLO title
  const headline = state.caption || 'HELLO';
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 165px "Bebas Neue", "Anton", "Syne", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.letterSpacing = '6px';
  ctx.fillText(headline.toUpperCase(), cw / 2, 1150);
  ctx.letterSpacing = '0px';

  // 4. Overlaid elegant cursive World script
  ctx.save();
  ctx.font = 'italic 130px "Great Vibes", "Alex Brush", "Brush Script MT", cursive';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.92)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 4;
  ctx.textAlign = 'center';
  ctx.fillText('World', cw / 2 + 10, 1220);
  ctx.restore();

  // 5. Centered subtitle tagline
  const sub = state.subtitle || 'Open your eyes and look the vibes of your world. Just focus on your self';
  ctx.fillStyle = '#f0f2f6';
  ctx.font = '500 18px "Space Mono", monospace, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(sub, cw / 2, 1315);

  // 6. Three-column movie billing credits
  const rawDate = state.date || '17 AGUSTUS 2025';
  const parts = rawDate.split(/\s{2,}|\t|\s\|\s/);
  ctx.font = '700 16px "Space Mono", monospace, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.letterSpacing = '3px';
  if (parts.length >= 3) {
    ctx.textAlign = 'left'; ctx.fillText(parts[0].trim().toUpperCase(), 160, 1445);
    ctx.textAlign = 'center'; ctx.fillText(parts[1].trim().toUpperCase(), cw / 2, 1445);
    ctx.textAlign = 'right'; ctx.fillText(parts[2].trim().toUpperCase(), cw - 160, 1445);
  } else {
    ctx.textAlign = 'left'; ctx.fillText(rawDate.toUpperCase(), 160, 1445);
    ctx.textAlign = 'center'; ctx.fillText('ELISA ROBERT', cw / 2, 1445);
    ctx.textAlign = 'right'; ctx.fillText('CINEMA', cw - 160, 1445);
  }
  ctx.letterSpacing = '0px';
  ctx.restore();
}
