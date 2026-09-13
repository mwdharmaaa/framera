/**
 * Helper drawing routines for authentic iPhone landscape camera viewfinder.
 * Synthesizes white iPhone chassis, Touch ID button, iOS video HUD, and screen cracks.
 */

/** Draws realistic white iPhone chassis with Touch ID home button, clear case, and aluminum edge. */
export function drawPhoneChassis(ctx, pw = 1060, ph = 580) {
  ctx.save();
  // 1. Clear TPU protective case bumper
  ctx.fillStyle = 'rgba(235, 220, 210, 0.35)'; ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = 4; ctx.beginPath(); ctx.roundRect(-pw / 2 - 12, -ph / 2 - 12, pw + 24, ph + 24, 56);
  ctx.fill(); ctx.stroke();

  // 2. White glass faceplate body with chamfered aluminum edge
  ctx.fillStyle = '#f5f6fa'; ctx.strokeStyle = '#d6b8a4';
  ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(-pw / 2, -ph / 2, pw, ph, 48);
  ctx.fill(); ctx.stroke();

  // 3. Left Chin Bezel: Circular Touch ID Home Button
  const hx = -pw / 2 + 65;
  ctx.strokeStyle = '#c8b2a0'; ctx.lineWidth = 3.5;
  ctx.beginPath(); ctx.arc(hx, 0, 39, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#ebedf2'; ctx.beginPath(); ctx.arc(hx, 0, 37, 0, Math.PI * 2); ctx.fill();

  // 4. Right Forehead Bezel: Earpiece speaker & front sensor
  const fx = pw / 2 - 35;
  ctx.fillStyle = '#2b2d32'; ctx.beginPath(); ctx.roundRect(fx - 4, -28, 8, 56, 4); ctx.fill();
  ctx.fillStyle = '#1c1e24'; ctx.beginPath(); ctx.arc(fx - 24, 0, 5.5, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

/** Draws pure vector lightning bolt without emoji. */
function drawVectorBolt(ctx, bx, by, scale = 1) {
  ctx.save(); ctx.translate(bx, by); ctx.scale(scale, scale);
  ctx.beginPath(); ctx.moveTo(0, -7); ctx.lineTo(-4, 0); ctx.lineTo(-1, 0);
  ctx.lineTo(-2, 7); ctx.lineTo(4, -1); ctx.lineTo(1, -1); ctx.closePath();
  ctx.fill(); ctx.restore();
}

/** Draws iOS Video Camera HUD: red shutter, timer, modes, reticle, AssistiveTouch, and screen cracks. */
export function drawCameraHUD(ctx, sw = 860, sh = 536, state = {}) {
  ctx.save();
  // 1. Left Control Panel: Red Video Shutter Button & Camera Flip
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'; ctx.fillRect(0, 0, 115, sh);

  // Red Video Record Shutter
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.arc(58, sh / 2, 36, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(58, sh / 2, 27, 0, Math.PI * 2); ctx.fill();

  // Camera Flip Icon
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)'; ctx.lineWidth = 2;
  ctx.strokeRect(43, sh - 75, 30, 22);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.beginPath(); ctx.arc(58, sh - 64, 4, 0, Math.PI * 2); ctx.fill();

  // Vertical Camera Modes
  ctx.font = '700 11px -apple-system, BlinkMacSystemFont, sans-serif'; ctx.textAlign = 'left';
  const modes = [
    { t: 'TIME-LAPSE', y: sh * 0.22, c: 'rgba(255,255,255,0.7)' },
    { t: 'SLO-MO', y: sh * 0.36, c: 'rgba(255,255,255,0.7)' },
    { t: 'VIDEO', y: sh * 0.50, c: '#ffd600' },
    { t: 'PHOTO', y: sh * 0.64, c: 'rgba(255,255,255,0.7)' },
    { t: 'SQUARE', y: sh * 0.78, c: 'rgba(255,255,255,0.7)' }
  ];
  for (const m of modes) { ctx.fillStyle = m.c; ctx.fillText(m.t, 126, m.y + 4); }

  // 2. Top Bar: Flash Indicator & Recording Timer
  ctx.fillStyle = '#ffd600';
  ctx.beginPath(); ctx.roundRect(240, 24, 38, 26, 6); ctx.fill();
  ctx.fillStyle = '#000000';
  drawVectorBolt(ctx, 259, 37, 1.2);

  const timerText = state.caption && /^\d/.test(state.caption) ? state.caption : '00:00:00';
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 24px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(timerText, sw / 2 + 30, 44);

  // 3. Yellow Eye Focus Reticle Box with Exposure Badge
  const rx = 490, ry = 220, rsize = 150;
  ctx.strokeStyle = '#ffd600'; ctx.lineWidth = 1.8; ctx.strokeRect(rx, ry, rsize, rsize);
  ctx.fillStyle = '#ffd600'; ctx.beginPath(); ctx.roundRect(rx + rsize / 2 - 22, ry - 30, 44, 24, 5); ctx.fill();
  ctx.fillStyle = '#000000';
  drawVectorBolt(ctx, rx + rsize / 2, ry - 18, 1.1);

  // 4. Floating AssistiveTouch Virtual Button
  const ax = 540, ay = 425;
  ctx.fillStyle = 'rgba(32, 34, 40, 0.75)'; ctx.beginPath(); ctx.roundRect(ax - 32, ay - 32, 64, 64, 18); ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(ax, ay, 20, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'; ctx.beginPath(); ctx.arc(ax, ay, 12, 0, Math.PI * 2); ctx.fill();

  // 5. Realistic Cracked Glass Spiderweb Lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)'; ctx.lineWidth = 1.2;
  const cracks = [
    [[sw - 60, sh - 10], [sw - 160, sh - 110], [sw - 230, sh - 90], [sw - 310, sh - 160]],
    [[sw - 160, sh - 110], [sw - 190, sh - 40], [sw - 250, sh - 20]],
    [[sw - 230, sh - 90], [sw - 270, sh - 190], [sw - 380, sh - 240]],
    [[sw - 310, sh - 160], [sw - 420, sh - 170]]
  ];
  for (const branch of cracks) {
    ctx.beginPath(); ctx.moveTo(branch[0][0], branch[0][1]);
    for (let i = 1; i < branch.length; i++) ctx.lineTo(branch[i][0], branch[i][1]);
    ctx.stroke();
  }
  ctx.restore();
}
