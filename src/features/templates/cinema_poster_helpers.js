/**
 * Helper routines for Cinema Lens Poster template.
 * Renders curved spectacle frame, metallic hardware, and editorial billing typography.
 */

/** Traces the rounded spectacle / glasses lens frame path with ultra-smooth continuous curvature. */
export function traceSpectacleLensPath(ctx, cw = 1200, ch = 1600) {
  ctx.beginPath();
  ctx.moveTo(600, 142);
  ctx.bezierCurveTo(800, 142, 985, 180, 1070, 260); ctx.bezierCurveTo(1105, 295, 1115, 335, 1112, 385);
  ctx.bezierCurveTo(1105, 530, 995, 780, 830, 845); ctx.bezierCurveTo(720, 868, 650, 870, 600, 870);
  ctx.bezierCurveTo(550, 870, 480, 868, 370, 845); ctx.bezierCurveTo(205, 780, 95, 530, 88, 385);
  ctx.bezierCurveTo(85, 335, 95, 295, 130, 260); ctx.bezierCurveTo(215, 180, 400, 142, 600, 142);
  ctx.closePath();
}

/** Draws realistic metallic spectacles frame, temple arms, hinge screws, and glass sheen. */
export function drawGlassesFrame(ctx, cw = 1200, ch = 1600) {
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
  ctx.shadowBlur = 32;
  ctx.shadowOffsetY = 16;

  // Temple arms extending outwards to canvas edges
  const armY = 342;
  const drawArm = (x1, x2, c1, c2) => {
    const g = ctx.createLinearGradient ? ctx.createLinearGradient(x1, armY, x2, armY) : null;
    if (g) { g.addColorStop(0, c1); g.addColorStop(0.5, '#c0c4cc'); g.addColorStop(1, c2); ctx.strokeStyle = g; }
    else { ctx.strokeStyle = '#8a8e96'; }
    ctx.lineWidth = 11;
    ctx.beginPath(); ctx.moveTo(x1, armY); ctx.lineTo(x2, armY); ctx.stroke();
  };
  drawArm(0, 92, '#50535a', '#80838c');
  drawArm(1108, cw, '#80838c', '#50535a');

  // Thick metallic wireframe rim with realistic silver reflection
  const rimGrad = ctx.createLinearGradient ? ctx.createLinearGradient(85, 140, 1115, 870) : null;
  if (rimGrad) {
    rimGrad.addColorStop(0, '#9ea2ab');
    rimGrad.addColorStop(0.2, '#eef1f6');
    rimGrad.addColorStop(0.4, '#ffffff');
    rimGrad.addColorStop(0.6, '#727680');
    rimGrad.addColorStop(0.85, '#d0d4dc');
    rimGrad.addColorStop(1, '#9ea2ab');
    ctx.strokeStyle = rimGrad;
  } else { ctx.strokeStyle = '#a6aaaf'; }
  ctx.lineWidth = 16;
  traceSpectacleLensPath(ctx, cw, ch);
  ctx.stroke();

  // Inner dark accent bevel and specular rim line
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = 'rgba(18, 20, 24, 0.78)';
  ctx.lineWidth = 3;
  traceSpectacleLensPath(ctx, cw, ch);
  ctx.stroke();

  // Metal hinge joints & screws
  ctx.fillStyle = '#c5c8d0'; ctx.strokeStyle = '#32343a'; ctx.lineWidth = 2;
  for (const h of [{ x: 88, y: 330 }, { x: 1090, y: 330 }]) {
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
  const glassSheen = ctx.createLinearGradient ? ctx.createLinearGradient(140, 140, 600, 560) : null;
  if (glassSheen) {
    glassSheen.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
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
  const credit = state.designer || 'ALESHALILIANAA';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.font = '600 16px "Space Mono", monospace, sans-serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '6px';
  ctx.fillText('DESIGN BY ' + credit.toUpperCase(), cw / 2, 55);
  ctx.letterSpacing = '0px';

  // 2. Interrupted horizontal rule (breaks cleanly around HELLO text)
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(0, 1105); ctx.lineTo(cw / 2 - 275, 1105);
  ctx.moveTo(cw / 2 + 275, 1105); ctx.lineTo(cw, 1105);
  ctx.stroke();

  // 3. Bold condensed HELLO title
  const headline = (state.caption && state.caption !== 'FOCUS') ? state.caption : 'HELLO';
  ctx.fillStyle = '#ffffff';
  ctx.font = '185px "Bebas Neue", "Anton", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.letterSpacing = '8px';
  ctx.fillText(headline.toUpperCase(), cw / 2, 1145);
  ctx.letterSpacing = '0px';

  // 4. Overlaid elegant cursive World script
  ctx.save();
  ctx.font = '160px "Great Vibes", "Alex Brush", cursive';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 4;
  ctx.textAlign = 'center';
  ctx.fillText('World', cw / 2 + 15, 1225);
  ctx.restore();

  // 5. Centered two-line subtitle tagline
  const sub = state.subtitle || 'Open your eyes and look the vibes of your world. Just focus on your self';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
  ctx.font = '500 17px "Space Mono", monospace, sans-serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '0.5px';
  if (sub.includes('world.')) {
    const p1 = sub.substring(0, sub.indexOf('world.')).trim();
    const p2 = sub.substring(sub.indexOf('world.')).trim();
    ctx.fillText(p1, cw / 2, 1310);
    ctx.fillText(p2, cw / 2, 1338);
  } else {
    const lines = sub.split('\n');
    if (lines.length > 1) {
      ctx.fillText(lines[0].trim(), cw / 2, 1310);
      ctx.fillText(lines[1].trim(), cw / 2, 1338);
    } else {
      ctx.fillText(sub, cw / 2, 1315);
    }
  }
  ctx.letterSpacing = '0px';

  // 6. Three-column movie billing credits
  const rawDate = state.date || '17 AGUSTUS 2025';
  const parts = rawDate.split(/\s{2,}|\t|\s\|\s/);
  ctx.font = '700 16px "Space Mono", monospace, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
  ctx.letterSpacing = '3px';
  if (parts.length >= 3) {
    ctx.textAlign = 'left'; ctx.fillText(parts[0].trim().toUpperCase(), 130, 1450);
    ctx.textAlign = 'center'; ctx.fillText(parts[1].trim().toUpperCase(), cw / 2, 1450);
    ctx.textAlign = 'right'; ctx.fillText(parts[2].trim().toUpperCase(), cw - 130, 1450);
  } else {
    ctx.textAlign = 'left'; ctx.fillText(rawDate.toUpperCase(), 130, 1450);
    ctx.textAlign = 'center'; ctx.fillText('ELISA ROBERT', cw / 2, 1450);
    ctx.textAlign = 'right'; ctx.fillText('CINEMA', cw - 130, 1450);
  }
  ctx.letterSpacing = '0px';
  ctx.restore();
}
