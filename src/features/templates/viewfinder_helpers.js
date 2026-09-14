/**
 * Helper drawing routines for authentic iPhone landscape camera viewfinder.
 * Synthesizes white iPhone chassis, Touch ID button, iOS video HUD, and screen cracks.
 */

/** Draws realistic white iPhone chassis with Touch ID home button, clear case, and aluminum edge. */
export function drawPhoneChassis(ctx, pw = 1140, ph = 580) {
  ctx.save();
  // 1. Clear TPU protective bumper case with rose-gold edge
  ctx.fillStyle = 'rgba(235, 215, 200, 0.28)';
  ctx.strokeStyle = 'rgba(215, 185, 165, 0.55)';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(-pw / 2 - 12, -ph / 2 - 12, pw + 24, ph + 24, 60) : ctx.rect(-pw / 2, -ph / 2, pw, ph);
  ctx.fill();
  ctx.stroke();

  // 2. White glass faceplate body with chamfered bezel
  ctx.fillStyle = '#f7f8fc';
  ctx.strokeStyle = '#cfb5a0';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(-pw / 2, -ph / 2, pw, ph, 52) : ctx.rect(-pw / 2, -ph / 2, pw, ph);
  ctx.fill();
  ctx.stroke();

  // 3. Left Chin Bezel: Circular Touch ID Home Button
  const hx = -pw / 2 + 66;
  const rimGrad = ctx.createLinearGradient ? ctx.createLinearGradient(hx - 40, -40, hx + 40, 40) : null;
  if (rimGrad) {
    rimGrad.addColorStop(0, '#cca892');
    rimGrad.addColorStop(0.3, '#ffffff');
    rimGrad.addColorStop(0.7, '#bda08c');
    rimGrad.addColorStop(1, '#cca892');
    ctx.strokeStyle = rimGrad;
  } else {
    ctx.strokeStyle = '#c6ad98';
  }
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(hx, 0, 40, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#f3f4f8';
  ctx.beginPath();
  ctx.arc(hx, 0, 38, 0, Math.PI * 2);
  ctx.fill();

  // Fine inner specular highlight
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(hx, 0, 36, 0, Math.PI * 2);
  ctx.stroke();

  // 4. Right Forehead Bezel: Earpiece speaker & front camera sensor
  const fx = pw / 2 - 32;
  ctx.fillStyle = '#2b2d34';
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(fx - 4, -26, 8, 52, 4) : ctx.rect(fx - 4, -26, 8, 52);
  ctx.fill();

  ctx.fillStyle = '#181a20';
  ctx.beginPath();
  ctx.arc(fx - 22, 0, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** Draws pure vector lightning bolt without emoji. */
function drawVectorBolt(ctx, bx, by, scale = 1) {
  ctx.save();
  ctx.translate(bx, by);
  ctx.scale(scale, scale);
  ctx.beginPath();
  ctx.moveTo(0, -7);
  ctx.lineTo(-4, 0);
  ctx.lineTo(-1, 0);
  ctx.lineTo(-2, 7);
  ctx.lineTo(4, -1);
  ctx.lineTo(1, -1);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/** Draws iOS Video Camera HUD: red shutter, timer, modes, reticle, AssistiveTouch, and screen cracks. */
export function drawCameraHUD(ctx, sw = 920, sh = 536, state = {}) {
  ctx.save();
  // 1. Left Control Panel: Translucent overlay, Red Video Shutter, and Modes
  ctx.fillStyle = 'rgba(0, 0, 0, 0.44)';
  ctx.fillRect(0, 0, 145, sh);

  // Red Video Record Shutter (White circular ring with crimson red record core)
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(60, sh / 2, 36, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#ee2e24';
  ctx.beginPath();
  ctx.arc(60, sh / 2, 27, 0, Math.PI * 2);
  ctx.fill();

  // Camera Flip Icon Button (Bottom Left)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.lineWidth = 2;
  ctx.strokeRect(44, sh - 76, 32, 24);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.beginPath();
  ctx.arc(60, sh - 64, 4.5, 0, Math.PI * 2);
  ctx.fill();

  // Vertical Camera Modes
  ctx.font = '700 11px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
  ctx.textAlign = 'left';
  const modes = [
    { t: 'TIME-LAPSE', y: sh * 0.22, c: 'rgba(255, 255, 255, 0.75)', b: false },
    { t: 'SLO-MO', y: sh * 0.36, c: 'rgba(255, 255, 255, 0.75)', b: false },
    { t: 'VIDEO', y: sh * 0.50, c: '#ffd600', b: true },
    { t: 'PHOTO', y: sh * 0.64, c: 'rgba(255, 255, 255, 0.75)', b: false },
    { t: 'SQUARE', y: sh * 0.78, c: 'rgba(255, 255, 255, 0.75)', b: false }
  ];
  for (const m of modes) {
    ctx.fillStyle = m.c;
    ctx.font = m.b
      ? '800 12px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
      : '700 11px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillText(m.t, 134, m.y + 4);
  }

  // 2. Top Bar: Flash Indicator & Recording Timer
  ctx.fillStyle = '#ffd600';
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(280, 24, 38, 26, 6) : ctx.rect(280, 24, 38, 26);
  ctx.fill();
  ctx.fillStyle = '#000000';
  drawVectorBolt(ctx, 299, 37, 1.2);

  const timerText = state.caption && /^\d/.test(state.caption) ? state.caption : '00:00:00';
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 24px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(timerText, sw / 2 + 40, 44);

  // 3. Yellow Eye Focus Reticle Box with Exposure Badge (Positioned over the eye)
  const rx = 510, ry = 190, rsize = 175;
  ctx.strokeStyle = '#ffd600';
  ctx.lineWidth = 1.8;
  ctx.strokeRect(rx, ry, rsize, rsize);

  ctx.fillStyle = '#ffd600';
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(rx + rsize / 2 - 24, ry - 30, 48, 24, 5) : ctx.rect(rx + rsize / 2 - 24, ry - 30, 48, 24);
  ctx.fill();
  ctx.fillStyle = '#000000';
  drawVectorBolt(ctx, rx + rsize / 2, ry - 18, 1.15);

  // 4. Floating AssistiveTouch Virtual Button
  const ax = 570, ay = 425;
  ctx.fillStyle = 'rgba(28, 30, 38, 0.74)';
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(ax - 32, ay - 32, 64, 64, 18) : ctx.rect(ax - 32, ay - 32, 64, 64);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(ax, ay, 20, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.beginPath();
  ctx.arc(ax, ay, 12, 0, Math.PI * 2);
  ctx.fill();

  // 5. Realistic Tempered Glass Screen Cracks (Shadow + Specular highlight)
  const cracks = [
    [[sw - 40, sh - 10], [sw - 160, sh - 90], [sw - 260, sh - 80], [sw - 350, sh - 170], [sw - 460, sh - 210]],
    [[sw - 160, sh - 90], [sw - 190, sh - 30], [sw - 280, sh - 10]],
    [[sw - 260, sh - 80], [sw - 300, sh - 200], [sw - 410, sh - 250], [sw - 480, sh - 340]],
    [[sw - 350, sh - 170], [sw - 440, sh - 160], [sw - 510, sh - 220]]
  ];

  // Refraction shadow
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.lineWidth = 2;
  for (const branch of cracks) {
    ctx.beginPath();
    ctx.moveTo(branch[0][0] + 1, branch[0][1] + 1);
    for (let i = 1; i < branch.length; i++) ctx.lineTo(branch[i][0] + 1, branch[i][1] + 1);
    ctx.stroke();
  }

  // Specular white glass glint
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.72)';
  ctx.lineWidth = 1.2;
  for (const branch of cracks) {
    ctx.beginPath();
    ctx.moveTo(branch[0][0], branch[0][1]);
    for (let i = 1; i < branch.length; i++) ctx.lineTo(branch[i][0], branch[i][1]);
    ctx.stroke();
  }
  ctx.restore();
}
