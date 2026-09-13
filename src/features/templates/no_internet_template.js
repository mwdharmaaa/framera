/** Offline & Into the Green Template: Chrome T-Rex pixel art, disconnect checklist, nature theme */

const DINO_PIXELS = [
  '        ########',
  '       ##########',
  '       #### #####',
  '       ##########',
  '       ######',
  '       ##########',
  '##    ###########',
  '###  ############',
  '#################',
  ' ###############',
  '  #############',
  '   ###########',
  '     ###  ###',
  '     ##    ##'
];

function drawDino(ctx, ox, oy, scale = 4, color = '#22c55e') {
  ctx.fillStyle = color;
  for (let r = 0; r < DINO_PIXELS.length; r++) {
    const row = DINO_PIXELS[r];
    for (let c = 0; c < row.length; c++) {
      if (row[c] === '#') {
        ctx.fillRect(ox + c * scale, oy + r * scale, scale, scale);
      }
    }
  }
}

function drawCactus(ctx, ox, oy, scale = 3, color = '#15803d') {
  ctx.fillStyle = color;
  ctx.fillRect(ox + scale * 2, oy, scale * 2, scale * 10);
  ctx.fillRect(ox, oy + scale * 3, scale * 2, scale * 4);
  ctx.fillRect(ox, oy + scale * 6, scale * 3, scale * 1.5);
  ctx.fillRect(ox + scale * 4, oy + scale * 2, scale * 2, scale * 4);
  ctx.fillRect(ox + scale * 3, oy + scale * 5, scale * 3, scale * 1.5);
}

export const noInternetTemplate = {
  id: 'no_internet',
  name: 'No Internet / Green Oasis',
  description: 'Retro 8-bit offline dinosaur checklist with nature escape telemetry and pixel aesthetic',
  previewImage: 'assets/into_the_green_reference.jpg',
  aspectRatio: '3:4',
  tag: 'RETRO',
  config: {
    canvasWidth: 1200,
    canvasHeight: 1600,
    frame: { x: 70, y: 70, w: 1060, h: 1460 }
  },
  render(ctx, img, bounds, state) {
    const { canvasWidth: cw, canvasHeight: ch, frame } = this.config;

    // 1. Dark organic slate background
    ctx.fillStyle = '#0a100d';
    ctx.fillRect(0, 0, cw, ch);

    // 2. Photo rendering with natural rich tones
    if (img) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(frame.x, frame.y, frame.w, frame.h);
      ctx.clip();
      ctx.filter = 'contrast(115%) saturate(110%)';
      ctx.drawImage(img, bounds.drawX, bounds.drawY, bounds.drawW, bounds.drawH);
      ctx.restore();
    }

    // 3. Subtle dark-green gradient vignette for HUD contrast
    ctx.save();
    const grad = ctx.createLinearGradient(0, frame.y + frame.h - 550, 0, frame.y + frame.h);
    grad.addColorStop(0, 'rgba(10, 16, 13, 0)');
    grad.addColorStop(0.4, 'rgba(10, 16, 13, 0.75)');
    grad.addColorStop(1, 'rgba(10, 16, 13, 0.96)');
    ctx.fillStyle = grad;
    ctx.fillRect(frame.x, frame.y + frame.h - 550, frame.w, 550);
    ctx.restore();

    // 4. White frame border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(frame.x, frame.y, frame.w, frame.h);

    // 5. Offline Dino Pixel Graphics
    const dinoY = frame.y + frame.h - 380;
    drawDino(ctx, frame.x + 80, dinoY, 5, '#4ade80');
    drawCactus(ctx, frame.x + 220, dinoY + 16, 4, '#22c55e');
    drawCactus(ctx, frame.x + 255, dinoY + 10, 4.5, '#16a34a');

    // Ground pixel dashed line
    ctx.fillStyle = '#4ade80';
    for (let x = frame.x + 60; x < frame.x + frame.w - 60; x += 24) {
      ctx.fillRect(x, dinoY + 74, 16, 4);
    }

    // 6. Header Badge & Checklist Typography
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 38px "Space Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('No Internet', frame.x + 80, frame.y + frame.h - 260);

    ctx.font = '500 20px "Space Mono", monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Try:', frame.x + 80, frame.y + frame.h - 215);

    const items = [
      state.caption || 'Throw your phone away',
      state.subtitle || 'Find a quiet spot in nature',
      state.date || 'Take a deep breath and enjoy'
    ];

    ctx.font = '600 22px "Space Mono", monospace';
    ctx.fillStyle = '#f1f5f9';
    items.forEach((item, idx) => {
      const iy = frame.y + frame.h - 170 + idx * 42;
      // Pixel checkbox
      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 2;
      ctx.strokeRect(frame.x + 80, iy - 18, 20, 20);
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(frame.x + 84, iy - 14, 12, 12);
      // Item text
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(item, frame.x + 116, iy);
    });

    // 7. Top Pill Telemetry
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(frame.x + 30, frame.y + 30, 220, 38);
    ctx.strokeStyle = '#4ade80';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(frame.x + 30, frame.y + 30, 220, 38);

    ctx.fillStyle = '#4ade80';
    ctx.font = '700 14px "Space Mono", monospace';
    ctx.fillText('OFFLINE OASIS // 404', frame.x + 48, frame.y + 54);
  }
};
