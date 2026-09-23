/**
 * Procedural shaders, aged washi paper grain, and monochrome grading
 * for Antique Parchment Template (3:4, 1200x1600).
 */

/**
 * Fills the canvas with the aged washi paper texture, illuminated core, and fibers.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cw
 * @param {number} ch
 */
export function renderParchmentBase(ctx, cw, ch) {
  if (!ctx) return;

  // 1. Warm illuminated parchment radial gradient
  const cx = cw / 2;
  const cy = ch * 0.52;
  const bgGrad = ctx.createRadialGradient(cx, cy, 100, cx, cy, 960);
  bgGrad.addColorStop(0, '#ebdcc0');
  bgGrad.addColorStop(0.35, '#c9b895');
  bgGrad.addColorStop(0.70, '#756046');
  bgGrad.addColorStop(1, '#241b12');

  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, cw, ch);

  // 2. Horizontal washi paper fibers (procedural grain striations)
  ctx.save();
  ctx.lineWidth = 1;
  for (let y = 35; y < ch - 35; y += 3) {
    const seed = Math.sin(y * 14.123 + 45.67) * 43758.5453;
    const fract = seed - Math.floor(seed);
    const alpha = 0.02 + fract * 0.04;
    ctx.strokeStyle = fract > 0.55
      ? `rgba(30, 22, 14, ${alpha.toFixed(3)})`
      : `rgba(255, 245, 225, ${(alpha * 0.7).toFixed(3)})`;
    ctx.beginPath();
    ctx.moveTo(35, y);
    ctx.lineTo(cw - 35, y);
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * Draws the atmospheric top and bottom deep vignettes over the photo.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cw
 * @param {number} ch
 */
export function renderParchmentVignettes(ctx, cw, ch) {
  if (!ctx) return;
  const topVignette = ctx.createLinearGradient(0, 0, 0, 480);
  topVignette.addColorStop(0, 'rgba(15, 12, 9, 0.88)');
  topVignette.addColorStop(0.55, 'rgba(25, 20, 15, 0.42)');
  topVignette.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = topVignette;
  ctx.fillRect(0, 0, cw, 480);

  const btmVignette = ctx.createLinearGradient(0, ch - 520, 0, ch);
  btmVignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
  btmVignette.addColorStop(0.55, 'rgba(20, 16, 12, 0.58)');
  btmVignette.addColorStop(1, 'rgba(10, 8, 6, 0.94)');
  ctx.fillStyle = btmVignette;
  ctx.fillRect(0, ch - 520, cw, 520);
}

/**
 * Draws the user photo in high-contrast antique monochrome.
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement|null} img
 * @param {object} slot
 * @param {object} framing
 */
export function renderMonochromeHero(ctx, img, slot, framing = {}) {
  if (!ctx || !img) return;

  const nw = img.naturalWidth || img.width || slot.w;
  const nh = img.naturalHeight || img.height || slot.h;
  const zoom = framing.zoom ?? 1;
  const panX = framing.panX ?? 0;
  const panY = framing.panY ?? 0;

  const scale = Math.max(slot.w / nw, slot.h / nh) * zoom;
  const sw = nw * scale;
  const sh = nh * scale;
  const sx = slot.x + (slot.w - sw) / 2 + panX;
  const sy = slot.y + (slot.h - sh) / 2 + panY;

  ctx.save();
  // High-contrast vintage monochrome filter
  if (typeof ctx.filter === 'string') {
    ctx.filter = 'grayscale(100%) contrast(175%) brightness(112%)';
  }
  ctx.globalCompositeOperation = 'multiply';

  try {
    ctx.drawImage(img, sx, sy, sw, sh);
  } catch {
    // Graceful fallback for mock tests
  }
  ctx.restore();

  // Subtle luminous chiaroscuro pass
  ctx.save();
  ctx.globalCompositeOperation = 'soft-light';
  ctx.globalAlpha = 0.45;
  try {
    ctx.drawImage(img, sx, sy, sw, sh);
  } catch {
    // Mock safe
  }
  ctx.restore();
}

/**
 * Renders a traditional vermilion red chop / seal stamp (yin zhang / hanko).
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {string} [char='印']
 */
export function renderVermilionChop(ctx, x, y, char = '印') {
  if (!ctx) return;
  ctx.save();
  ctx.fillStyle = '#a6291b';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 4;
  ctx.fillRect(x, y, 42, 42);

  ctx.strokeStyle = '#851e12';
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 2, y + 2, 38, 38);

  ctx.fillStyle = '#eed6c8';
  ctx.font = '700 24px "Noto Serif SC", "SimSun", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(char, x + 21, y + 22);
  ctx.restore();
}
