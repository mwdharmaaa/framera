import { renderFisheyeWarp, drawLensTicks, drawFisheyeBackdrop } from './fisheye_helpers.js';

export const fisheyeTemplate = {
  id: 'fisheye',
  name: '8mm Circular Fisheye',
  description: 'Ultra-wide 180-degree circular fisheye lens aperture with manual focus barrel and dark vignette',
  previewImage: 'assets/ref_6899_reference.jpg',
  aspectRatio: '3:4',
  tag: 'CAMERA',
  tags: ['fisheye', 'camera', '8mm', 'film', 'analog', 'vintage'],
  photoCount: 1,
  config: {
    canvasWidth: 1200,
    canvasHeight: 1600,
    frame: { x: 110, y: 230, w: 980, h: 980 }
  },
  render(ctx, img, bounds, state) {
    const { canvasWidth: cw, canvasHeight: ch } = this.config;
    const cx = cw / 2;
    const cy = 720;
    const radius = 490;

    // 1. Low-opacity atmospheric photo backdrop over studio void
    drawFisheyeBackdrop(ctx, img, cw, ch);

    // 2. Optical Fisheye Barrel Warp & Spherical Zoom
    renderFisheyeWarp(ctx, img, bounds, cx, cy, radius);

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
