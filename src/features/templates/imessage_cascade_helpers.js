/**
 * Slot coordinates for iMessage Dark Cascade Trio (736 x 1308, 9:16).
 * Features 3 staggered floating rounded cards with iOS Live Photo badge and bottom iMessage toolbar.
 */
export const IMESSAGE_CARD_SLOTS = [
  { id: 0, name: 'Top Live Photo', x: 215, y: 35, w: 375, h: 360, r: 36, hasLiveBadge: true },
  { id: 1, name: 'Middle Right Stack', x: 410, y: 325, w: 300, h: 480, r: 36, hasLiveBadge: false },
  { id: 2, name: 'Bottom Anchor Stack', x: 265, y: 765, w: 375, h: 360, r: 36, hasLiveBadge: false }
];

/**
 * Draws a rounded rectangle path onto the 2D canvas.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @param {number} r
 */
export function drawRoundedRectPath(ctx, x, y, w, h, r) {
  if (!ctx) return;
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
}

/**
 * Renders an iOS floating card photo with rounded corners and drop shadow.
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement|object} photo
 * @param {object} slot
 * @param {object} [options={}]
 */
export function renderRoundedCardPhoto(ctx, photo, slot, options = {}) {
  if (!ctx || !photo) return;
  const { x, y, w, h, r, hasLiveBadge } = slot;

  ctx.save();
  // Floating drop shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 10;

  drawRoundedRectPath(ctx, x, y, w, h, r);
  ctx.fillStyle = '#18181b';
  ctx.fill();

  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // Clip and draw image
  ctx.save();
  drawRoundedRectPath(ctx, x, y, w, h, r);
  if (typeof ctx.clip === 'function') ctx.clip();

  const nw = photo.naturalWidth || photo.width || w;
  const nh = photo.naturalHeight || photo.height || h;
  const zoom = options.zoom || 1;
  const scale = Math.max(w / nw, h / nh) * zoom;
  const sw = nw * scale;
  const sh = nh * scale;
  const sx = x + (w - sw) / 2 + (options.panX || 0);
  const sy = y + (h - sh) / 2 + (options.panY || 0);

  try {
    ctx.drawImage(photo, sx, sy, sw, sh);
  } catch {
    // Safe fallback for unit tests
  }
  ctx.restore();

  // Subtle border highlight
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1.2;
  drawRoundedRectPath(ctx, x, y, w, h, r);
  ctx.stroke();

  // Optional Live Photo Concentric Circle Indicator Badge
  if (hasLiveBadge) {
    renderLivePhotoBadge(ctx, x + 24, y + 24);
  }

  ctx.restore();
}

/**
 * Draws the iOS Live Photo concentric circle badge icon.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cx
 * @param {number} cy
 */
export function renderLivePhotoBadge(ctx, cx, cy) {
  if (!ctx) return;
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.arc(cx, cy, 18, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.5;

  // Outer dashed circle
  ctx.beginPath();
  if (typeof ctx.setLineDash === 'function') ctx.setLineDash([2.5, 2.5]);
  ctx.arc(cx, cy, 12, 0, Math.PI * 2);
  ctx.stroke();
  if (typeof ctx.setLineDash === 'function') ctx.setLineDash([]);

  // Inner solid circle
  ctx.beginPath();
  ctx.arc(cx, cy, 7, 0, Math.PI * 2);
  ctx.stroke();

  // Center core dot
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/**
 * Renders authentic iOS iMessage bottom text message bar.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cw
 * @param {number} ch
 * @param {object} [state={}]
 */
export function renderIMessageBottomBar(ctx, cw, ch, state = {}) {
  if (!ctx) return;
  const barY = ch - 120;

  ctx.save();

  // 1. Camera icon
  const camX = 35;
  const camY = barY + 12;
  ctx.fillStyle = '#8e8e93';
  ctx.strokeStyle = '#8e8e93';
  ctx.lineWidth = 2.2;
  drawRoundedRectPath(ctx, camX, camY, 32, 24, 6);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(camX + 16, camY + 12, 5.5, 0, Math.PI * 2);
  ctx.stroke();

  // 2. App Store "A" icon
  const appX = 90;
  const appY = barY + 12;
  ctx.beginPath();
  ctx.arc(appX + 16, appY + 12, 14, 0, Math.PI * 2);
  ctx.strokeStyle = '#8e8e93';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.font = '700 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#8e8e93';
  ctx.textAlign = 'center';
  ctx.fillText('A', appX + 16, appY + 17);

  // 3. Text Message Input Capsule Pill
  const inputX = 140;
  const inputY = barY + 4;
  const inputW = cw - inputX - 35;
  const inputH = 40;
  const inputR = 20;

  drawRoundedRectPath(ctx, inputX, inputY, inputW, inputH, inputR);
  ctx.fillStyle = '#1c1c1e';
  ctx.fill();
  ctx.strokeStyle = '#2c2c2e';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Input Placeholder Text
  const messageText = state.caption || 'Text Message';
  ctx.font = '400 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#8e8e93';
  ctx.textAlign = 'left';
  ctx.fillText(messageText, inputX + 18, inputY + 25);

  // Microphone icon inside pill
  const micX = inputX + inputW - 24;
  const micY = inputY + 20;
  ctx.strokeStyle = '#8e8e93';
  ctx.lineWidth = 1.8;
  drawRoundedRectPath(ctx, micX - 4, micY - 9, 8, 12, 4);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(micX, micY - 2, 7, 0, Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(micX, micY + 5);
  ctx.lineTo(micX, micY + 9);
  ctx.stroke();

  // 4. iOS Home Indicator bar
  ctx.fillStyle = '#ffffff';
  drawRoundedRectPath(ctx, cw / 2 - 68, ch - 18, 136, 5, 2.5);
  ctx.fill();

  ctx.restore();
}
