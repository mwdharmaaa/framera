let cachedLut = null;
let cachedRadius = 0;
let cachedOffCanvas = null;

/**
 * Computes or retrieves cached radial fisheye barrel distortion LUT.
 * Maps destination radius to source radius with center magnification (bulge zoom).
 */
export function getFisheyeLUT(radius, a = 0.40) {
  if (cachedLut && cachedRadius === radius) return cachedLut;
  const b = 1 - a;
  const lut = new Float32Array(radius + 1);
  for (let i = 0; i <= radius; i++) {
    const rho = i / radius;
    const rhoSrc = rho * (a + b * rho * rho);
    lut[i] = i > 0 ? (rhoSrc * radius) / i : a;
  }
  cachedLut = lut;
  cachedRadius = radius;
  return lut;
}

/** Draws calibrated angle ticks around the lens chassis ring. */
export function drawLensTicks(ctx, cx, cy, radius, count = 36) {
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 1.5;
  const step = (Math.PI * 2) / count;
  for (let i = 0; i < count; i++) {
    const angle = i * step;
    const len = i % 6 === 0 ? 14 : 7;
    const r1 = radius + 10;
    const r2 = r1 + len;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * r1, cy + Math.sin(angle) * r1);
    ctx.lineTo(cx + Math.cos(angle) * r2, cy + Math.sin(angle) * r2);
    ctx.stroke();
  }
  ctx.restore();
}

/** Draws realistic 3D convex glass dome vignette falloff and specular reflection glare. */
export function drawFisheyeGlassEffects(ctx, cx, cy, radius) {
  const vignette = ctx.createRadialGradient(cx, cy, radius * 0.62, cx, cy, radius);
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignette.addColorStop(0.78, 'rgba(0, 0, 0, 0.40)');
  vignette.addColorStop(1, 'rgba(0, 0, 0, 0.94)');
  ctx.fillStyle = vignette;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

  const glassGlare = ctx.createLinearGradient(cx - radius * 0.7, cy - radius * 0.7, cx, cy);
  glassGlare.addColorStop(0, 'rgba(255, 255, 255, 0.22)');
  glassGlare.addColorStop(0.35, 'rgba(255, 255, 255, 0.04)');
  glassGlare.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = glassGlare;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.96, -Math.PI * 0.88, -Math.PI * 0.12);
  ctx.lineTo(cx, cy);
  ctx.closePath();
  ctx.fill();
}

/** Warps photo with authentic optical fisheye barrel distortion (2.5x center zoom). */
export function renderFisheyeWarp(ctx, img, bounds, cx, cy, radius) {
  if (!img) return;
  const size = radius * 2;
  const ox = cx - radius;
  const oy = cy - radius;

  if (typeof document === 'undefined') {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(img, bounds.drawX, bounds.drawY, bounds.drawW, bounds.drawH);
    ctx.restore();
    return;
  }

  if (!cachedOffCanvas) cachedOffCanvas = document.createElement('canvas');
  if (cachedOffCanvas.width !== size || cachedOffCanvas.height !== size) {
    cachedOffCanvas.width = size;
    cachedOffCanvas.height = size;
  }
  const offCtx = cachedOffCanvas.getContext('2d', { willReadFrequently: true });
  if (!offCtx) return;

  offCtx.clearRect(0, 0, size, size);
  offCtx.filter = 'contrast(125%) saturate(115%) brightness(98%)';
  offCtx.drawImage(img, bounds.drawX - ox, bounds.drawY - oy, bounds.drawW, bounds.drawH);

  const srcData = offCtx.getImageData(0, 0, size, size);
  const dstData = offCtx.createImageData(size, size);
  const src32 = new Uint32Array(srcData.data.buffer);
  const dst32 = new Uint32Array(dstData.data.buffer);
  const lut = getFisheyeLUT(radius);
  const r2 = radius * radius;

  for (let y = 0; y < size; y++) {
    const dy = y - radius;
    const dy2 = dy * dy;
    if (dy2 > r2) continue;
    const halfChord = Math.floor(Math.sqrt(r2 - dy2));
    const minX = radius - halfChord;
    const maxX = radius + halfChord;
    const yRow = y * size;

    for (let x = minX; x <= maxX; x++) {
      const dx = x - radius;
      const dist = Math.round(Math.sqrt(dx * dx + dy2));
      if (dist <= radius) {
        const factor = lut[dist];
        const sx = (radius + dx * factor) | 0;
        const sy = (radius + dy * factor) | 0;
        if (sx >= 0 && sx < size && sy >= 0 && sy < size) {
          dst32[yRow + x] = src32[sy * size + sx];
        }
      }
    }
  }

  offCtx.putImageData(dstData, 0, 0);

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(cachedOffCanvas, ox, oy);
  drawFisheyeGlassEffects(ctx, cx, cy, radius);
  ctx.restore();
}
