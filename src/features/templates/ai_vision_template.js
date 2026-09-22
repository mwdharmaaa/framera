/** AI Vision & Neural Detection Template: object bounding boxes, confidence tags, morse telemetry */

function drawDetectionBox(ctx, x, y, w, h, label, score) {
  ctx.save();
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(x, y, w, h);

  // Corner brackets
  const cl = 16;
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  // Top-left
  ctx.moveTo(x, y + cl); ctx.lineTo(x, y); ctx.lineTo(x + cl, y);
  // Top-right
  ctx.moveTo(x + w - cl, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + cl);
  // Bottom-left
  ctx.moveTo(x, y + h - cl); ctx.lineTo(x, y + h); ctx.lineTo(x + cl, y + h);
  // Bottom-right
  ctx.moveTo(x + w - cl, y + h); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w, y + h - cl);
  ctx.stroke();

  // Label tag
  ctx.fillStyle = '#facc15';
  const tagText = `${label} [${score}]`;
  ctx.font = '700 15px "Space Mono", monospace';
  const tw = ctx.measureText(tagText).width;
  ctx.fillRect(x, y - 26, tw + 18, 26);

  ctx.fillStyle = '#0a0a0c';
  ctx.textAlign = 'left';
  ctx.fillText(tagText, x + 9, y - 8);
  ctx.restore();
}

function drawMorseTelemetry(ctx, x, y, code) {
  ctx.save();
  ctx.fillStyle = '#60a5fa';
  let curX = x;
  for (let i = 0; i < code.length; i++) {
    const ch = code[i];
    if (ch === '.') {
      ctx.beginPath();
      ctx.arc(curX + 4, y, 4, 0, Math.PI * 2);
      ctx.fill();
      curX += 14;
    } else if (ch === '-') {
      ctx.fillRect(curX, y - 3, 16, 6);
      curX += 24;
    } else if (ch === ' ') {
      curX += 16;
    }
  }
  ctx.restore();
}

export const aiVisionTemplate = {
  id: 'ai_vision',
  name: 'AI Neural Vision',
  description: 'Machine perception HUD with object detection boxes, confidence telemetry, and morse sky symbols',
  previewImage: 'assets/ref_download1_reference.jpg',
  aspectRatio: '3:4',
  tag: 'CYBER',
  tags: ['cyber', 'hud', 'futuristic', 'digital', 'sci-fi', 'vision'],
  photoCount: 1,
  config: {
    canvasWidth: 1200,
    canvasHeight: 1600,
    frame: { x: 50, y: 50, w: 1100, h: 1500 }
  },
  render(ctx, img, bounds, state) {
    const { canvasWidth: cw, canvasHeight: ch, frame } = this.config;

    ctx.fillStyle = '#090b0e';
    ctx.fillRect(0, 0, cw, ch);

    if (img) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(frame.x, frame.y, frame.w, frame.h);
      ctx.clip();
      ctx.filter = 'contrast(120%) saturate(90%) sepia(12%)';
      ctx.drawImage(img, bounds.drawX, bounds.drawY, bounds.drawW, bounds.drawH);
      ctx.restore();
    }

    // Outer subtle grid lines
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.25)';
    ctx.lineWidth = 1;
    ctx.strokeRect(frame.x, frame.y, frame.w, frame.h);

    // Coordinate crosshairs in corners
    const crosses = [
      [frame.x + 24, frame.y + 24],
      [frame.x + frame.w - 24, frame.y + 24],
      [frame.x + 24, frame.y + frame.h - 24],
      [frame.x + frame.w - 24, frame.y + frame.h - 24]
    ];
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2;
    crosses.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.moveTo(cx - 10, cy); ctx.lineTo(cx + 10, cy);
      ctx.moveTo(cx, cy - 10); ctx.lineTo(cx, cy + 10);
      ctx.stroke();
    });

    // Morse telemetry sequence in upper sky
    drawMorseTelemetry(ctx, frame.x + 50, frame.y + 110, '-.-. --- -- .--. ..- - . .-.');
    drawMorseTelemetry(ctx, frame.x + 50, frame.y + 130, '...- .. ... .. --- -.');

    // Primary AI Bounding Boxes
    drawDetectionBox(ctx, frame.x + 360, frame.y + 280, 360, 420, 'person', '98.4%');
    drawDetectionBox(ctx, frame.x + 440, frame.y + 320, 200, 200, 'face', '99.1%');
    drawDetectionBox(ctx, frame.x + 140, frame.y + 880, 280, 320, 'object', '87.6%');

    // Header Telemetry Bar
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 24px "Space Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('NEURAL VISION // v4.2', frame.x + 40, frame.y + 60);

    ctx.font = '600 16px "Space Mono", monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('STATUS: TRACKING ACTIVE [3 OBJECTS]', frame.x + 40, frame.y + 85);

    // Bottom Telemetry
    ctx.fillStyle = 'rgba(9, 11, 14, 0.85)';
    ctx.fillRect(frame.x + 20, frame.y + frame.h - 110, frame.w - 40, 90);
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1;
    ctx.strokeRect(frame.x + 20, frame.y + frame.h - 110, frame.w - 40, 90);

    ctx.fillStyle = '#facc15';
    ctx.font = '700 22px "Space Mono", monospace';
    ctx.fillText(state.caption || 'TARGET ACQUIRED', frame.x + 45, frame.y + frame.h - 68);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '500 15px "Space Mono", monospace';
    ctx.fillText(state.subtitle || 'MODEL: YOLO-VISION-NEURAL-X', frame.x + 45, frame.y + frame.h - 38);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(state.date || 'LAT: 35.6762 // LNG: 139.6503', frame.x + frame.w - 45, frame.y + frame.h - 38);
  }
};
