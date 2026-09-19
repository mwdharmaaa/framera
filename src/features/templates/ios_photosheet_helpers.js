/**
 * Helper routines and layout definitions for the iOS Photosheet Live Share template.
 */
export const IOS_PHOTOSHEET_LAYOUT = {
  canvasWidth: 736,
  canvasHeight: 920,
  headerHeight: 230,
  card: {
    x: 130,
    y: 254,
    w: 472,
    h: 666,
    radius: 24
  },
  leftPeek: {
    x: -364,
    y: 254,
    w: 472,
    h: 666,
    radius: 24
  },
  rightPeek: {
    x: 624,
    y: 254,
    w: 472,
    h: 666,
    radius: 24
  },
  thumbnail: {
    x: 14,
    y: 24,
    w: 118,
    h: 128,
    radius: 14
  }
};

/**
 * Draws rounded rectangle path for canvas contexts.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @param {number} r
 */
export function drawRoundRectPath(ctx, x, y, w, h, r) {
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, r);
  } else if (typeof ctx.rect === 'function') {
    ctx.rect(x, y, w, h);
  }
}

/**
 * Renders an image into a rounded card boundary with object-fit: cover.
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement|object} photo
 * @param {object} bounds
 */
export function renderCardPhoto(ctx, photo, bounds) {
  if (!ctx || !photo) return;
  const { x, y, w, h, radius = 24 } = bounds;
  const nw = photo.naturalWidth || photo.width || w;
  const nh = photo.naturalHeight || photo.height || h;
  const scale = Math.max(w / nw, h / nh);
  const sw = nw * scale;
  const sh = nh * scale;
  const sx = x + (w - sw) / 2;
  const sy = y + (h - sh) / 2;

  ctx.save();
  ctx.beginPath();
  drawRoundRectPath(ctx, x, y, w, h, radius);
  if (typeof ctx.clip === 'function') {
    ctx.clip();
  }
  try {
    ctx.drawImage(photo, sx, sy, sw, sh);
  } catch {
    // Fallback for mock environments
  }
  ctx.restore();
}

/**
 * Renders the top iOS Photo Sheet header.
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement|object} photo
 * @param {object} [state]
 */
export function renderSheetHeader(ctx, photo, state = {}) {
  if (!ctx) return;
  const { thumbnail } = IOS_PHOTOSHEET_LAYOUT;
  const title = state?.caption || '1 Photo Selected';
  const subtitle = state?.subtitle || 'Location Is Included';
  const optionsText = state?.date || 'Options >';

  ctx.save();

  // 1. Header thumbnail preview
  if (photo) {
    renderCardPhoto(ctx, photo, thumbnail);
  } else {
    ctx.fillStyle = '#e5e5ea';
    ctx.beginPath();
    drawRoundRectPath(ctx, thumbnail.x, thumbnail.y, thumbnail.w, thumbnail.h, thumbnail.radius);
    if (typeof ctx.fill === 'function') ctx.fill();
  }

  // 2. Header text
  if (typeof ctx.fillText === 'function') {
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    ctx.font = '700 22px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.fillStyle = '#000000';
    ctx.fillText(String(title), 154, 48);

    // Location icon + text
    ctx.font = '400 17px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#8e8e93';
    ctx.fillText(String(subtitle), 154, 82);
  }

  // 3. "Options >" rounded pill button
  ctx.fillStyle = '#e5e5ea';
  ctx.beginPath();
  drawRoundRectPath(ctx, 154, 114, 178, 54, 18);
  if (typeof ctx.fill === 'function') ctx.fill();

  if (typeof ctx.fillText === 'function') {
    ctx.font = '600 18px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#000000';
    ctx.fillText(String(optionsText), 178, 141);
  }

  // 4. Close circular (X) button
  ctx.fillStyle = '#e5e5ea';
  ctx.beginPath();
  if (typeof ctx.arc === 'function') {
    ctx.arc(696, 48, 26, 0, Math.PI * 2);
    if (typeof ctx.fill === 'function') ctx.fill();
  }

  if (typeof ctx.fillText === 'function') {
    ctx.font = '700 18px -apple-system, sans-serif';
    ctx.fillStyle = '#8e8e93';
    ctx.textAlign = 'center';
    ctx.fillText('X', 696, 48);
  }

  // 5. Divider line
  ctx.strokeStyle = '#d1d1d6';
  ctx.lineWidth = 1;
  ctx.beginPath();
  if (typeof ctx.moveTo === 'function' && typeof ctx.lineTo === 'function') {
    ctx.moveTo(0, 204);
    ctx.lineTo(736, 204);
    if (typeof ctx.stroke === 'function') ctx.stroke();
  }

  ctx.restore();
}

/**
 * Renders the iOS Live photo badge and selected checkmark badges.
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} cardBounds
 */
export function renderCardBadges(ctx, cardBounds) {
  if (!ctx) return;
  const { x, y, w, h } = cardBounds;

  ctx.save();

  // 1. LIVE badge (Top Left)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
  ctx.beginPath();
  drawRoundRectPath(ctx, x + 18, y + 18, 116, 44, 10);
  if (typeof ctx.fill === 'function') ctx.fill();

  if (typeof ctx.fillText === 'function') {
    ctx.font = '700 18px -apple-system, sans-serif';
    ctx.fillStyle = '#007aff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('LIVE', x + 56, y + 40);
  }

  // Concentric circle icon
  if (typeof ctx.arc === 'function') {
    ctx.strokeStyle = '#007aff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(x + 38, y + 40, 9, 0, Math.PI * 2);
    if (typeof ctx.stroke === 'function') ctx.stroke();

    ctx.fillStyle = '#007aff';
    ctx.beginPath();
    ctx.arc(x + 38, y + 40, 4, 0, Math.PI * 2);
    if (typeof ctx.fill === 'function') ctx.fill();
  }

  // 2. White vector heart icon (Bottom Left)
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
  ctx.shadowBlur = 6;
  const hx = x + 34;
  const hy = y + h - 42;
  ctx.beginPath();
  if (typeof ctx.moveTo === 'function' && typeof ctx.bezierCurveTo === 'function') {
    ctx.moveTo(hx, hy + 3);
    ctx.bezierCurveTo(hx, hy - 4, hx - 11, hy - 4, hx - 11, hy + 4);
    ctx.bezierCurveTo(hx - 11, hy + 11, hx - 3, hy + 16, hx, hy + 21);
    ctx.bezierCurveTo(hx + 3, hy + 16, hx + 11, hy + 11, hx + 11, hy + 4);
    ctx.bezierCurveTo(hx + 11, hy - 4, hx, hy - 4, hx, hy + 3);
    if (typeof ctx.fill === 'function') ctx.fill();
  }

  // 3. Selection Checkmark Badge (Bottom Right)
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = '#007aff';
  ctx.beginPath();
  if (typeof ctx.arc === 'function') {
    ctx.arc(x + w - 42, y + h - 42, 22, 0, Math.PI * 2);
    if (typeof ctx.fill === 'function') ctx.fill();
  }

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  if (typeof ctx.moveTo === 'function' && typeof ctx.lineTo === 'function') {
    ctx.moveTo(x + w - 51, y + h - 42);
    ctx.lineTo(x + w - 44, y + h - 35);
    ctx.lineTo(x + w - 33, y + h - 48);
    if (typeof ctx.stroke === 'function') ctx.stroke();
  }

  ctx.restore();
}
