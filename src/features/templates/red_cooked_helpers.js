/**
 * Coordinates, backdrop, framing, and bold typography routines
 * for the Nah I'm Cooked Red Lockscreen Template (9:16, 736x1308).
 */

export const RED_COOKED_SLOT = {
  id: 0,
  x: 116,
  y: 486,
  w: 504,
  h: 332
};

export const DEFAULT_RED_COOKED_CONFIG = {
  quoteLine1: "Nah, I'm cooked.",
  quoteLine2: "I know I look too damn good.",
  trackTitle: "Magic I Want U",
  artist: "Jane Remover",
  currentTime: "0:05",
  duration: "-2:53",
  progress: 0.15,
  bgColor: "#fe0000",
  textColor: "#fff22a"
};

/**
 * Fills the canvas with the iconic saturated vibrant red background.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cw
 * @param {number} ch
 * @param {string} [bgColor='#fe0000']
 */
export function renderBackdrop(ctx, cw, ch, bgColor = '#fe0000') {
  if (!ctx) return;
  ctx.save();
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, cw, ch);
  ctx.restore();
}

/**
 * Renders the centered photo with a realistic soft drop shadow.
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement|null} img
 * @param {object} slot
 * @param {object} [framing={ zoom: 1, panX: 0, panY: 0 }]
 */
export function renderFramedPhoto(ctx, img, slot, framing = {}) {
  if (!ctx || !slot) return;

  // 1. Soft atmospheric black drop shadow
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
  ctx.shadowBlur = 32;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 10;
  ctx.fillStyle = '#111111';
  ctx.fillRect(slot.x, slot.y, slot.w, slot.h);
  ctx.restore();

  // 2. Photo content clipped inside slot
  ctx.save();
  ctx.beginPath();
  ctx.rect(slot.x, slot.y, slot.w, slot.h);
  ctx.clip();

  if (img) {
    const zoom = framing.zoom ?? 1;
    const panX = framing.panX ?? 0;
    const panY = framing.panY ?? 0;
    const nw = img.naturalWidth || img.width || slot.w;
    const nh = img.naturalHeight || img.height || slot.h;
    const scale = Math.max(slot.w / nw, slot.h / nh) * zoom;
    const sw = nw * scale;
    const sh = nh * scale;
    const sx = slot.x + (slot.w - sw) / 2 + panX;
    const sy = slot.y + (slot.h - sh) / 2 + panY;

    try {
      ctx.drawImage(img, sx, sy, sw, sh);
    } catch {
      // Graceful fallback for mock environments
    }
  } else {
    ctx.fillStyle = '#222222';
    ctx.fillRect(slot.x, slot.y, slot.w, slot.h);
  }
  ctx.restore();
}

/**
 * Renders the centered punchy yellow quote below the framed photo.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cw
 * @param {object} [state={}]
 */
export function renderYellowQuote(ctx, cw, state = {}) {
  if (!ctx) return;

  const line1 = state.quoteLine1 || state.caption || DEFAULT_RED_COOKED_CONFIG.quoteLine1;
  const line2 = state.quoteLine2 || state.subtitle || DEFAULT_RED_COOKED_CONFIG.quoteLine2;
  const textColor = state.textColor || DEFAULT_RED_COOKED_CONFIG.textColor;

  const cx = cw / 2;

  ctx.save();
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '900 32px "Impact", "Montserrat", "Arial Black", -apple-system, sans-serif';

  ctx.fillText(line1, cx, 839);
  ctx.fillText(line2, cx, 884);

  ctx.restore();
}
