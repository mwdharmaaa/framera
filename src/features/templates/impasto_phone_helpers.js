let overlayImg = null;

/**
 * Returns cached Image instance for the Impasto iOS Homescreen overlay.
 * @returns {HTMLImageElement|null}
 */
export function getImpastoPhoneOverlayImage() {
  if (overlayImg) return overlayImg;
  if (typeof Image !== 'undefined') {
    overlayImg = new Image();
    overlayImg.src = 'assets/impasto_ios_overlay.png?v=1';
  }
  return overlayImg;
}

/**
 * Resets cached overlay image for unit testing environments.
 */
export function resetImpastoPhoneOverlayImage() {
  overlayImg = null;
}

/**
 * Renders base dark canvas background.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cw
 * @param {number} ch
 */
export function renderImpastoPhoneBackground(ctx, cw = 555, ch = 1200) {
  if (!ctx) return;
  ctx.fillStyle = '#0f1116';
  if (typeof ctx.fillRect === 'function') {
    ctx.fillRect(0, 0, cw, ch);
  }
}

/**
 * Renders user photo onto the phone wallpaper canvas space.
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement|object} img
 * @param {object} bounds
 * @param {number} cw
 * @param {number} ch
 */
export function renderImpastoUserPhoto(ctx, img, bounds, cw = 555, ch = 1200) {
  if (!ctx || !img) return;

  const drawX = typeof bounds?.drawX === 'number' ? bounds.drawX : 0;
  const drawY = typeof bounds?.drawY === 'number' ? bounds.drawY : 0;
  const drawW = typeof bounds?.drawW === 'number' ? bounds.drawW : cw;
  const drawH = typeof bounds?.drawH === 'number' ? bounds.drawH : ch;

  try {
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  } catch {
    // Fallback for mock unit test environments
  }
}

/**
 * Renders smartphone status bar chrome, dynamic island, and home indicator.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cw
 * @param {number} ch
 * @param {object} state
 */
export function drawImpastoInterfaceChrome(ctx, cw = 555, ch = 1200, state = {}) {
  if (!ctx) return;
  ctx.save();

  // 1. Dynamic Island pill
  ctx.fillStyle = 'rgba(0, 0, 0, 0.94)';
  const islandW = 106;
  const islandH = 26;
  const islandX = Math.round((cw - islandW) / 2);
  const islandY = 16;
  const radius = 13;

  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(islandX, islandY, islandW, islandH, radius);
  } else {
    ctx.rect(islandX, islandY, islandW, islandH);
  }
  ctx.fill();

  // 2. Clock text (top left)
  const timeText = state.caption && state.caption.trim() ? state.caption : '9:41';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.font = '700 13px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
  ctx.fillText(timeText, 44, 29);

  // 3. Signal bars & battery indicator (top right)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(432, 29, 3, 5);
  ctx.fillRect(437, 27, 3, 7);
  ctx.fillRect(442, 24, 3, 10);
  ctx.fillRect(447, 21, 3, 13);

  // Battery outline
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.lineWidth = 1.5;
  if (typeof ctx.strokeRect === 'function') {
    ctx.strokeRect(467, 22, 22, 11);
  }
  // Battery fill & tip
  ctx.fillRect(469, 24, 15, 7);
  ctx.fillRect(490, 25, 2, 5);

  // 4. Custom widget notes (if provided)
  if (state.subtitle && state.subtitle.trim()) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = '500 11px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(state.subtitle, 400, 480);
  }

  // 5. Home swipe indicator pill (bottom)
  const homeW = 124;
  const homeH = 5;
  const homeX = Math.round((cw - homeW) / 2);
  const homeY = ch - 22;

  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(homeX, homeY, homeW, homeH, 2.5);
  } else {
    ctx.rect(homeX, homeY, homeW, homeH);
  }
  ctx.fill();

  ctx.restore();
}
