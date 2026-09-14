/**
 * Hardware chassis and protective case routines for Phone Viewfinder template.
 * Renders white iPhone body, Touch ID home button, clear TPU bumper, and physical shadow.
 */

export function drawPhoneChassis(ctx, pw = 1750, ph = 880) {
  ctx.save();
  // 1. Clear TPU protective bumper case with warm champagne rim
  ctx.fillStyle = 'rgba(238, 218, 202, 0.32)';
  ctx.strokeStyle = 'rgba(215, 185, 160, 0.65)';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(-pw / 2 - 14, -ph / 2 - 14, pw + 28, ph + 28, 72) : ctx.rect(-pw / 2, -ph / 2, pw, ph);
  ctx.fill();
  ctx.stroke();

  // Fine outer specular case glint
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(-pw / 2 - 10, -ph / 2 - 10, pw + 20, ph + 20, 68) : ctx.rect(-pw / 2, -ph / 2, pw, ph);
  ctx.stroke();

  // 2. White glass faceplate body with chamfered bezel
  ctx.fillStyle = '#f8f9fc';
  ctx.strokeStyle = '#d2c0b0';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(-pw / 2, -ph / 2, pw, ph, 62) : ctx.rect(-pw / 2, -ph / 2, pw, ph);
  ctx.fill();
  ctx.stroke();

  // 3. Left Chin Bezel: Circular Touch ID Home Button
  const hx = -pw / 2 + 95;
  const rimGrad = ctx.createLinearGradient ? ctx.createLinearGradient(hx - 55, -55, hx + 55, 55) : null;
  if (rimGrad) {
    rimGrad.addColorStop(0, '#cca892');
    rimGrad.addColorStop(0.25, '#ffffff');
    rimGrad.addColorStop(0.5, '#cca892');
    rimGrad.addColorStop(0.75, '#f5f0ec');
    rimGrad.addColorStop(1, '#cca892');
    ctx.strokeStyle = rimGrad;
  } else {
    ctx.strokeStyle = '#cca892';
  }
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(hx, 0, 56, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#f4f5f9';
  ctx.beginPath();
  ctx.arc(hx, 0, 53, 0, Math.PI * 2);
  ctx.fill();

  // Fine inner specular highlight
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(hx, 0, 50, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}
