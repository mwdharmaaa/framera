/**
 * Helper routines for Cinema Lens Poster template.
 * Renders curved spectacle frame, metallic hardware, and editorial billing typography.
 */

/** Traces the rounded spectacle / glasses lens frame path with ultra-smooth continuous curvature. */
export function traceSpectacleLensPath(ctx, cw = 1200, ch = 1600) {
  ctx.beginPath();
  ctx.moveTo(600, 68);
  ctx.bezierCurveTo(850, 68, 1045, 120, 1125, 220);
  ctx.bezierCurveTo(1155, 260, 1162, 305, 1156, 355);
  ctx.bezierCurveTo(1140, 515, 1015, 775, 840, 855);
  ctx.bezierCurveTo(730, 885, 650, 888, 600, 888);
  ctx.bezierCurveTo(550, 888, 470, 885, 360, 855);
  ctx.bezierCurveTo(185, 775, 60, 515, 44, 355);
  ctx.bezierCurveTo(38, 305, 45, 260, 75, 220);
  ctx.bezierCurveTo(155, 120, 350, 68, 600, 68);
  ctx.closePath();
}

/** Draws realistic metallic spectacles frame, temple arms, hinge screws, and glass sheen. */
export function drawGlassesFrame(ctx, cw = 1200, ch = 1600) {
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
  ctx.shadowBlur = 32;
  ctx.shadowOffsetY = 16;

  // Temple arms extending outwards to canvas edges
  const armY = 320;
  const drawArm = (x1, x2, c1, c2) => {
    const g = ctx.createLinearGradient ? ctx.createLinearGradient(x1, armY, x2, armY) : null;
    if (g) { g.addColorStop(0, c1); g.addColorStop(0.5, '#c0c4cc'); g.addColorStop(1, c2); ctx.strokeStyle = g; }
    else { ctx.strokeStyle = '#8a8e96'; }
    ctx.lineWidth = 11;
    ctx.beginPath(); ctx.moveTo(x1, armY); ctx.lineTo(x2, armY); ctx.stroke();
  };
  drawArm(0, 48, '#50535a', '#80838c');
  drawArm(1152, cw, '#80838c', '#50535a');

  // Thick metallic wireframe rim with realistic silver reflection
  const rimGrad = ctx.createLinearGradient ? ctx.createLinearGradient(44, 68, 1156, 888) : null;
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
  for (const h of [{ x: 44, y: 308 }, { x: 1134, y: 308 }]) {
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
  const glassSheen = ctx.createLinearGradient ? ctx.createLinearGradient(80, 68, 600, 560) : null;
  if (glassSheen) {
    glassSheen.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
    glassSheen.addColorStop(0.4, 'rgba(255, 255, 255, 0.05)');
    glassSheen.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = glassSheen;
    ctx.fillRect(40, 60, 1120, 830);
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
  ctx.font = '600 15px "Space Mono", monospace, sans-serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '6px';
  ctx.fillText('DESIGN BY ' + credit.toUpperCase(), cw / 2, 48);
  ctx.letterSpacing = '0px';

  // 2. Bold condensed HELLO title (Tegas, high impact poster display)
  const headline = (state.caption && state.caption !== 'FOCUS') ? state.caption : 'HELLO';
  ctx.fillStyle = '#ffffff';
  ctx.font = '245px "Anton", "Bebas Neue", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.letterSpacing = '6px';
  ctx.fillText(headline.toUpperCase(), cw / 2, 1150);
  ctx.letterSpacing = '0px';

  // 3. Interrupted horizontal rule across full width (breaks cleanly around headline text)
  const lineY = 1065;
  const textWidth = ctx.measureText ? ctx.measureText(headline.toUpperCase()).width : 620;
  const halfGap = (textWidth / 2) + 24;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(0, lineY); ctx.lineTo(Math.max(0, cw / 2 - halfGap), lineY);
  ctx.moveTo(Math.min(cw, cw / 2 + halfGap), lineY); ctx.lineTo(cw, lineY);
  ctx.stroke();

  // 4. Overlaid elegant cursive World script (Authentic calligraphy matching reference)
  ctx.save();
  ctx.font = '225px "Great Vibes", "Alex Brush", cursive';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 4;
  ctx.textAlign = 'center';
  ctx.fillText('World', cw / 2 + 15, 1235);
  ctx.restore();

  // 5. Centered two-line subtitle tagline
  const sub = state.subtitle || 'Open your eyes and look the vibes of your world. Just focus on your self';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
  ctx.font = '500 18px "Space Mono", monospace, sans-serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '0.5px';
  if (sub.includes('world.')) {
    const p1 = sub.substring(0, sub.indexOf('world.')).trim();
    const p2 = sub.substring(sub.indexOf('world.')).trim();
    ctx.fillText(p1, cw / 2, 1320);
    ctx.fillText(p2, cw / 2, 1350);
  } else {
    const lines = sub.split('\n');
    if (lines.length > 1) {
      ctx.fillText(lines[0].trim(), cw / 2, 1320);
      ctx.fillText(lines[1].trim(), cw / 2, 1350);
    } else {
      ctx.fillText(sub, cw / 2, 1335);
    }
  }
  ctx.letterSpacing = '0px';

  // 6. Three-column movie billing credits
  const rawDate = state.date || '17 AGUSTUS 2025';
  const parts = rawDate.split(/\s{2,}|\t|\s\|\s/);
  ctx.font = '700 17px "Space Mono", monospace, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
  ctx.letterSpacing = '4px';
  if (parts.length >= 3) {
    ctx.textAlign = 'left'; ctx.fillText(parts[0].trim().toUpperCase(), 120, 1460);
    ctx.textAlign = 'center'; ctx.fillText(parts[1].trim().toUpperCase(), cw / 2, 1460);
    ctx.textAlign = 'right'; ctx.fillText(parts[2].trim().toUpperCase(), cw - 120, 1460);
  } else {
    ctx.textAlign = 'left'; ctx.fillText(rawDate.toUpperCase(), 120, 1460);
    ctx.textAlign = 'center'; ctx.fillText('ELISA ROBERT', cw / 2, 1460);
    ctx.textAlign = 'right'; ctx.fillText('CINEMA', cw - 120, 1460);
  }
  ctx.letterSpacing = '0px';
  ctx.restore();
}
