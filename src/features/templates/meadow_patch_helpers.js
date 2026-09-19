/**
 * Meadow Patch Trio Slot Configurations (736 x 1308, 9:16).
 * Features an upper meadow view, lower forest view, and a center tilted card with craft cloth badge.
 */
export const MEADOW_PATCH_SLOTS = [
  { id: 0, name: 'Top Meadow Slot', x: 0, y: 0, w: 736, h: 485 },
  {
    id: 1,
    name: 'Center Tilted Card',
    cx: 280,
    cy: 655,
    w: 460,
    h: 360,
    angle: -0.095, // ~-5.5 degrees
    borderWidth: 14
  },
  { id: 2, name: 'Bottom Forest Slot', x: 0, y: 825, w: 736, h: 483 }
];

/**
 * Renders a full-width background slot with cover fit.
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement|object} photo
 * @param {object} slot
 * @param {object} [options={}]
 */
export function renderMeadowSlotPhoto(ctx, photo, slot, options = {}) {
  if (!ctx || !photo) return;
  const { x, y, w, h } = slot;
  const nw = photo.naturalWidth || photo.width || w;
  const nh = photo.naturalHeight || photo.height || h;
  const zoom = options.zoom || 1;
  const scale = Math.max(w / nw, h / nh) * zoom;
  const sw = nw * scale;
  const sh = nh * scale;
  const sx = x + (w - sw) / 2 + (options.panX || 0);
  const sy = y + (h - sh) / 2 + (options.panY || 0);

  ctx.save();
  ctx.beginPath();
  if (typeof ctx.rect === 'function') ctx.rect(x, y, w, h);
  if (typeof ctx.clip === 'function') ctx.clip();
  try {
    ctx.drawImage(photo, sx, sy, sw, sh);
  } catch {
    // Safe fallback for mock tests
  }
  ctx.restore();
}

/**
 * Renders the tilted center photo card with white border and drop shadow.
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement|object} photo
 * @param {object} cardConfig
 * @param {object} [options={}]
 */
export function renderCenterTiltedCard(ctx, photo, cardConfig, options = {}) {
  if (!ctx || !cardConfig) return;
  const { cx, cy, w, h, angle, borderWidth } = cardConfig;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);

  // Card drop shadow
  ctx.shadowColor = 'rgba(10, 15, 10, 0.45)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 12;

  // White polaroid-style card backing
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-w / 2, -h / 2, w, h);

  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // Inner photo area
  const pw = w - borderWidth * 2;
  const ph = h - borderWidth * 2;
  const px = -w / 2 + borderWidth;
  const py = -h / 2 + borderWidth;

  if (photo) {
    const nw = photo.naturalWidth || photo.width || pw;
    const nh = photo.naturalHeight || photo.height || ph;
    const scale = Math.max(pw / nw, ph / nh);
    const sw = nw * scale;
    const sh = nh * scale;
    const sx = px + (pw - sw) / 2;
    const sy = py + (ph - sh) / 2;

    ctx.save();
    ctx.beginPath();
    if (typeof ctx.rect === 'function') ctx.rect(px, py, pw, ph);
    if (typeof ctx.clip === 'function') ctx.clip();
    try {
      ctx.drawImage(photo, sx, sy, sw, sh);
    } catch {
      // Safe fallback for mock tests
    }
    ctx.restore();
  }

  // Card inner border line for tactile realism
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
  ctx.lineWidth = 1;
  ctx.strokeRect(px, py, pw, ph);

  ctx.restore();
}

/**
 * Renders the stitched linen fabric tag badge.
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} state
 */
export function renderStitchedClothPatch(ctx, state = {}) {
  if (!ctx) return;
  const pw = 205;
  const ph = 165;
  const px = 20;
  const py = 360;
  const angle = -0.06; // Slight rotation

  ctx.save();
  ctx.translate(px + pw / 2, py + ph / 2);
  ctx.rotate(angle);

  // Soft shadow
  ctx.shadowColor = 'rgba(15, 20, 15, 0.35)';
  ctx.shadowBlur = 14;
  ctx.shadowOffsetY = 6;

  // Linen cloth background
  ctx.fillStyle = '#f6f1e8';
  ctx.fillRect(-pw / 2, -ph / 2, pw, ph);

  // Dashed running stitch around perimeter
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = '#a49583';
  ctx.lineWidth = 1.5;
  if (typeof ctx.setLineDash === 'function') ctx.setLineDash([4, 3]);
  ctx.strokeRect(-pw / 2 + 5, -ph / 2 + 5, pw - 10, ph - 10);
  if (typeof ctx.setLineDash === 'function') ctx.setLineDash([]);

  // Tag typography
  ctx.fillStyle = '#1c1b18';
  ctx.textAlign = 'center';

  ctx.font = '700 12px "Space Mono", monospace';
  ctx.fillText('MADE WITH LOVE', 0, -ph / 2 + 35);

  ctx.font = '500 9px "Space Mono", monospace';
  ctx.fillText('BY', 0, -ph / 2 + 55);

  const headline = (state?.caption || 'REALLY REALLY PRETTY').toUpperCase();
  ctx.font = '700 11px "Space Mono", monospace';
  ctx.fillText(headline, 0, -ph / 2 + 75);

  const subline = (state?.subtitle || 'BLONDE GIRLS').toUpperCase();
  ctx.font = '700 11px "Space Mono", monospace';
  ctx.fillText(subline, 0, -ph / 2 + 95);

  const dateUrl = state?.date || 'framera.studio';
  ctx.fillStyle = '#7a7062';
  ctx.font = '500 9px "Space Mono", monospace';
  ctx.fillText(dateUrl, 0, -ph / 2 + 125);

  ctx.restore();
}

/**
 * Draws a hand-drawn botanical orange hibiscus flower pinned to the cloth tag corner.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cx
 * @param {number} cy
 * @param {number} r
 */
export function renderHibiscusFlower(ctx, cx = 65, cy = 520, r = 38) {
  if (!ctx) return;
  ctx.save();
  ctx.translate(cx, cy);

  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 4;

  // 5 overlapping petals
  const petals = 5;
  for (let i = 0; i < petals; i++) {
    const angle = (i * 2 * Math.PI) / petals;
    ctx.save();
    ctx.rotate(angle);

    // Warm tropical orange petal
    ctx.beginPath();
    ctx.fillStyle = '#e85822';
    if (typeof ctx.ellipse === 'function') {
      ctx.ellipse(0, -r * 0.65, r * 0.46, r * 0.65, 0, 0, Math.PI * 2);
    } else {
      ctx.arc(0, -r * 0.6, r * 0.5, 0, Math.PI * 2);
    }
    ctx.fill();

    // Petal inner vein
    ctx.strokeStyle = '#c43a0e';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -r * 0.85);
    ctx.stroke();

    ctx.restore();
  }

  // Golden stamen center
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = '#fad02c';
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.22, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.08, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
