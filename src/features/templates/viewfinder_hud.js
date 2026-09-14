/**
 * iOS Camera HUD routines for Phone Viewfinder template.
 * Renders authentic video recording controls, timer, focus reticle, and AssistiveTouch.
 */

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

export function drawCameraHUD(ctx, sw = 1540, sh = 820, state = {}) {
  ctx.save();
  // 1. Left Control Panel: Translucent overlay, Shutter Button, and Modes
  const barW = 210;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.44)';
  ctx.fillRect(0, 0, barW, sh);

  // Red Video Record Shutter
  const shutterX = 80, shutterY = sh / 2;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(shutterX, shutterY, 48, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#ee2c25';
  ctx.beginPath();
  ctx.arc(shutterX, shutterY, 38, 0, Math.PI * 2);
  ctx.fill();

  // Camera Flip Icon Button (Bottom Left)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.lineWidth = 2.4;
  ctx.strokeRect(58, sh - 95, 44, 32);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.beginPath();
  ctx.arc(80, sh - 79, 5.5, 0, Math.PI * 2);
  ctx.fill();

  // Vertical Camera Modes
  const modes = [
    { t: 'TIME-LAPSE', y: sh / 2 - 150, c: 'rgba(255, 255, 255, 0.72)', b: false },
    { t: 'SLO-MO', y: sh / 2 - 75, c: 'rgba(255, 255, 255, 0.72)', b: false },
    { t: 'VIDEO', y: sh / 2, c: '#ffd600', b: true },
    { t: 'PHOTO', y: sh / 2 + 75, c: 'rgba(255, 255, 255, 0.72)', b: false },
    { t: 'SQUARE', y: sh / 2 + 150, c: 'rgba(255, 255, 255, 0.72)', b: false }
  ];
  for (const m of modes) {
    ctx.fillStyle = m.c;
    ctx.font = m.b
      ? '800 16px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
      : '700 13px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(m.t, 175, m.y + 5);
  }

  // 2. Top Bar: Flash Indicator & Recording Timer grouped together
  const timerText = state.caption && /^\d/.test(state.caption) ? state.caption : '00:00:00';
  const midX = sw * 0.52;

  // Yellow Flash Badge
  const flashW = 46, flashH = 30;
  const flashX = midX - 90, flashY = 42;
  ctx.fillStyle = '#ffd600';
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(flashX, flashY, flashW, flashH, 6) : ctx.rect(flashX, flashY, flashW, flashH);
  ctx.fill();
  ctx.fillStyle = '#000000';
  drawVectorBolt(ctx, flashX + flashW / 2, flashY + flashH / 2, 1.3);

  // Recording Timer
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 34px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(timerText, midX - 25, 68);

  // 3. Yellow Eye Focus Reticle Box with Exposure Badge
  const rx = sw * 0.46, ry = sh * 0.24, rsize = 235;
  ctx.strokeStyle = '#ffd600';
  ctx.lineWidth = 2.2;
  ctx.strokeRect(rx, ry, rsize, rsize);

  const expW = 56, expH = 26;
  ctx.fillStyle = '#ffd600';
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(rx + rsize / 2 - expW / 2, ry - expH, expW, expH, 5) : ctx.rect(rx + rsize / 2 - expW / 2, ry - expH, expW, expH);
  ctx.fill();
  ctx.fillStyle = '#000000';
  drawVectorBolt(ctx, rx + rsize / 2, ry - expH / 2, 1.25);

  // 4. Floating AssistiveTouch Virtual Button
  const ax = rx + rsize * 0.72, ay = ry + rsize + 115;
  ctx.fillStyle = 'rgba(28, 30, 38, 0.78)';
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(ax - 42, ay - 42, 84, 84, 24) : ctx.rect(ax - 42, ay - 42, 84, 84);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.58)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(ax, ay, 26, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.beginPath();
  ctx.arc(ax, ay, 15, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
