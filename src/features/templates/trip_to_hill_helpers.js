/**
 * Layout constants and organic torn paper coordinates for Trip To Hill template.
 */
export const TRIP_TO_HILL_LAYOUT = {
  canvasWidth: 736,
  canvasHeight: 1308,
  slots: [
    { id: 0, name: 'Top Horizon Vista', yStart: 0, yEnd: 380, h: 420 },
    { id: 1, name: 'Center Hill Gathering', yStart: 310, yEnd: 860, h: 560 },
    { id: 2, name: 'Bottom Memories Meadow', yStart: 830, yEnd: 1308, h: 480 }
  ]
};

export const TOP_TEAR_PROFILE = [
  [0, 342], [24, 348], [48, 344], [72, 356], [98, 368], [124, 360],
  [152, 352], [180, 340], [210, 326], [238, 316], [266, 312], [294, 318],
  [322, 330], [352, 342], [382, 356], [412, 364], [442, 372], [472, 378],
  [504, 384], [536, 388], [568, 384], [600, 374], [632, 368], [664, 372],
  [696, 378], [736, 376]
];

export const BOTTOM_TEAR_PROFILE = [
  [0, 832], [28, 836], [56, 830], [86, 838], [116, 844], [146, 848],
  [178, 842], [210, 846], [242, 852], [274, 856], [306, 850], [338, 854],
  [372, 860], [404, 858], [436, 850], [468, 844], [500, 836], [532, 834],
  [564, 840], [596, 848], [628, 856], [660, 854], [692, 848], [736, 844]
];

/**
 * Traces a jagged torn paper path on canvas.
 * @param {CanvasRenderingContext2D} ctx
 * @param {Array<[number, number]>} profile
 * @param {boolean} [reverse=false]
 */
export function traceTornEdgePath(ctx, profile, reverse = false) {
  if (!ctx || !profile?.length) return;
  const pts = reverse ? [...profile].reverse() : profile;
  pts.forEach(([px, py], i) => {
    if (i === 0 && !reverse) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  });
}

/**
 * Draws a realistic white fibrous torn paper border with tactile drop shadow.
 * @param {CanvasRenderingContext2D} ctx
 * @param {Array<[number, number]>} profile
 * @param {number} [ribbonHeight=14]
 */
export function drawTornPaperRibbon(ctx, profile, ribbonHeight = 14) {
  if (!ctx || !profile?.length) return;
  ctx.save();

  // 1. Soft drop shadow cast onto the layer below
  ctx.shadowColor = 'rgba(0, 0, 0, 0.42)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 5;

  // 2. White fibrous paper ribbon
  ctx.fillStyle = '#fbfbfa';
  ctx.beginPath();
  traceTornEdgePath(ctx, profile, false);
  const rev = [...profile].reverse();
  rev.forEach(([px, py]) => {
    ctx.lineTo(px, py + ribbonHeight);
  });
  ctx.closePath();
  if (typeof ctx.fill === 'function') ctx.fill();

  // 3. Subtle fibrous texture border stroke
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = 'rgba(215, 215, 210, 0.45)';
  ctx.lineWidth = 1;
  if (typeof ctx.stroke === 'function') ctx.stroke();

  ctx.restore();
}

/**
 * Renders a photo into a torn slot using a custom clipping path.
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement|object} photo
 * @param {() => void} clipPathFn
 * @param {{ y: number, h: number }} bounds
 * @param {object} [options={}]
 */
export function renderTornSlotPhoto(ctx, photo, clipPathFn, bounds, options = {}) {
  if (!ctx || !photo) return;
  const cw = 736;
  const { y, h } = bounds;
  const zoom = options.zoom || 1;
  const panX = options.panX || 0;
  const panY = options.panY || 0;
  const nw = photo.naturalWidth || photo.width || cw;
  const nh = photo.naturalHeight || photo.height || h;
  const scale = Math.max(cw / nw, h / nh) * zoom;
  const sw = nw * scale;
  const sh = nh * scale;
  const sx = (cw - sw) / 2 + panX;
  const sy = y + (h - sh) / 2 + panY;

  ctx.save();
  ctx.beginPath();
  clipPathFn();
  if (typeof ctx.clip === 'function') ctx.clip();

  // Natural outdoor film grade
  const prevFilter = ctx.filter;
  try {
    ctx.filter = 'contrast(106%) brightness(98%) saturate(92%) sepia(12%)';
  } catch {}

  try {
    ctx.drawImage(photo, sx, sy, sw, sh);
  } catch {}

  try {
    ctx.filter = prevFilter || 'none';
  } catch {}

  ctx.restore();
}

/**
 * Renders typography overlays, headlines, and stickers.
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} [state={}]
 */
export function renderTripToHillOverlays(ctx, state = {}) {
  if (!ctx || typeof ctx.fillText !== 'function') return;
  const title = state?.caption || 'Trip To Hill';
  const subtitle = state?.subtitle || 'Story behind';
  const location = state?.date || 'at Bukit Cita - Cita';

  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 2;

  // 1. Top Quote (Wisdom reflection)
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.font = '500 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Jika harapan sudah diluar batas, -', 210, 36);
  ctx.fillText("biarkan do'a dan takdir bertarung diatas langit", 210, 56);

  // 2. Middle Section Typography
  ctx.textAlign = 'center';
  ctx.font = '600 15px "Poppins", -apple-system, sans-serif';
  ctx.fillText(String(subtitle), 368, 345);

  // Large aesthetic cursive script
  ctx.font = '700 58px "Great Vibes", "Brush Script MT", cursive';
  ctx.fillText(String(title), 368, 385);

  ctx.font = '700 15px "Poppins", -apple-system, sans-serif';
  ctx.fillText(String(location), 368, 435);

  // 3. Bottom Memories Badges
  ctx.font = '700 15px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Memories', 32, 895);

  ctx.textAlign = 'right';
  ctx.font = '600 14px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillText('Daily Instagram Story', 704, 895);

  // 4. Subtle creator footer
  ctx.textAlign = 'center';
  ctx.font = '500 12px -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.82)';
  ctx.fillText('creativepost by hasbyatho', 368, 1272);

  ctx.restore();
}
