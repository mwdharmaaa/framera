/** 8mm Circular Fisheye Template: 180-degree spherical aperture, lens barrel ring, manual lens ticks */

function drawLensTicks(ctx, cx, cy, radius, count = 36) {
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 1.5;
  const step = (Math.PI * 2) / count;
  for (let i = 0; i < count; i++) {
    const angle = i * step;
    const isMajor = i % 6 === 0;
    const len = isMajor ? 14 : 7;
    const r1 = radius + 10;
    const r2 = r1 + len;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * r1, cy + Math.sin(angle) * r1);
    ctx.lineTo(cx + Math.cos(angle) * r2, cy + Math.sin(angle) * r2);
    ctx.stroke();
  }
  ctx.restore();
}

export const fisheyeTemplate = {
  id: 'fisheye',
  name: '8mm Circular Fisheye',
  description: 'Ultra-wide 180-degree circular fisheye lens aperture with manual focus barrel and dark vignette',
  previewImage: 'assets/ref_6899_reference.jpg',
  aspectRatio: '3:4',
  tag: 'CAMERA',
  config: {
    canvasWidth: 1200,
    canvasHeight: 1600,
    frame: { x: 80, y: 220, w: 1040, h: 1040 }
  },
  render(ctx, img, bounds, state) {
    const { canvasWidth: cw, canvasHeight: ch } = this.config;
    const cx = cw / 2;
    const cy = 720;
    const radius = 490;

    // 1. Deep studio void background
    ctx.fillStyle = '#050608';
    ctx.fillRect(0, 0, cw, ch);

    // 2. Circular Aperture Mask & Image
    if (img) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.clip();
      ctx.filter = 'contrast(125%) saturate(115%) brightness(98%)';
      ctx.drawImage(img, bounds.drawX, bounds.drawY, bounds.drawW, bounds.drawH);

      // Inner spherical barrel shading
      const vignette = ctx.createRadialGradient(cx, cy, radius * 0.65, cx, cy, radius);
      vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vignette.addColorStop(0.8, 'rgba(0, 0, 0, 0.45)');
      vignette.addColorStop(1, 'rgba(0, 0, 0, 0.92)');
      ctx.fillStyle = vignette;
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
      ctx.restore();
    }

    // 3. Lens Barrel Rings & Focus Ticks
    ctx.save();
    // Chromatic rim
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 2, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(244, 63, 94, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 5, 0, Math.PI * 2);
    ctx.stroke();

    // Outer metal chassis ring
    ctx.strokeStyle = '#1e232d';
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 18, 0, Math.PI * 2);
    ctx.stroke();

    // Calibration ticks
    drawLensTicks(ctx, cx, cy, radius + 24, 48);
    ctx.restore();

    // 4. Center Micro-Crosshair
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx - 15, cy); ctx.lineTo(cx + 15, cy);
    ctx.moveTo(cx, cy - 15); ctx.lineTo(cx, cy + 15);
    ctx.stroke();

    // 5. Header Telemetry
    ctx.fillStyle = '#f8fafc';
    ctx.font = '700 24px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('8MM CIRCULAR FISHEYE', cx, 110);

    ctx.font = '500 15px "Space Mono", monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('ULTRAWIDE OPTICS // 180° FIELD OF VIEW // f/2.8', cx, 140);

    // 6. Bottom Archival Metadata
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 32px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(state.caption || 'CURVATURE REALITY', cx, 1340);

    ctx.font = '600 17px "Space Mono", monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(state.subtitle || 'SPHERICAL PERSPECTIVE DISTORTION', cx, 1380);

    ctx.font = '500 15px "Space Mono", monospace';
    ctx.fillStyle = '#64748b';
    ctx.fillText(state.date || 'ISO 400 // 1/250s // MULTI-COATED GLASS', cx, 1420);
  }
};
