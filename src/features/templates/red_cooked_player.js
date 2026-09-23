import { DEFAULT_RED_COOKED_CONFIG } from './red_cooked_helpers.js';

/**
 * Renders the iOS lockscreen music player widget and quick actions over the photo.
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} slot
 * @param {object} [state={}]
 */
export function renderLockscreenOverlay(ctx, slot, state = {}) {
  if (!ctx || !slot) return;

  const title = state.trackTitle || state.title || DEFAULT_RED_COOKED_CONFIG.trackTitle;
  const artist = state.artist || DEFAULT_RED_COOKED_CONFIG.artist;
  const currentTime = state.currentTime || DEFAULT_RED_COOKED_CONFIG.currentTime;
  const duration = state.duration || DEFAULT_RED_COOKED_CONFIG.duration;
  const progress = typeof state.progress === 'number'
    ? Math.max(0, Math.min(1, state.progress))
    : DEFAULT_RED_COOKED_CONFIG.progress;

  const cx = slot.x + slot.w / 2;

  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 1;

  // Track title & artist
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif';
  ctx.fillText(title, cx, 672);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.font = '400 11px -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif';
  ctx.fillText(artist, cx, 689);

  // Scrubber bar
  const barW = 180;
  const barX = cx - barW / 2;
  const barY = 708;

  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.fillRect(barX, barY, barW, 2);

  const elapsedW = barW * progress;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.fillRect(barX, barY, elapsedW, 2);

  ctx.beginPath();
  ctx.arc(barX + elapsedW, barY + 1, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = '400 9px -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, monospace';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.textAlign = 'right';
  ctx.fillText(currentTime, barX - 6, barY + 1);
  ctx.textAlign = 'left';
  ctx.fillText(duration, barX + barW + 6, barY + 1);

  // Media Controls (Previous, Pause, Next)
  renderPlaybackControls(ctx, cx, 730);

  // Quick Action Buttons (Flashlight & Camera)
  renderQuickButton(ctx, 298, 798, 'flashlight');
  renderQuickButton(ctx, 486, 798, 'camera');

  ctx.restore();
}

/**
 * Draws iOS lockscreen media playback controls (Previous, Pause, Next).
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cx
 * @param {number} ctrlY
 */
function renderPlaybackControls(ctx, cx, ctrlY) {
  ctx.fillStyle = '#ffffff';

  // 1. Previous track
  ctx.fillRect(cx - 44, ctrlY - 5, 2, 10);
  ctx.beginPath();
  ctx.moveTo(cx - 36, ctrlY - 5);
  ctx.lineTo(cx - 43, ctrlY);
  ctx.lineTo(cx - 36, ctrlY + 5);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx - 29, ctrlY - 5);
  ctx.lineTo(cx - 36, ctrlY);
  ctx.lineTo(cx - 29, ctrlY + 5);
  ctx.closePath();
  ctx.fill();

  // 2. Pause icon (two vertical bars)
  ctx.fillRect(cx - 4.5, ctrlY - 6, 3, 12);
  ctx.fillRect(cx + 1.5, ctrlY - 6, 3, 12);

  // 3. Next track
  ctx.beginPath();
  ctx.moveTo(cx + 29, ctrlY - 5);
  ctx.lineTo(cx + 36, ctrlY);
  ctx.lineTo(cx + 29, ctrlY + 5);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx + 36, ctrlY - 5);
  ctx.lineTo(cx + 43, ctrlY);
  ctx.lineTo(cx + 36, ctrlY + 5);
  ctx.closePath();
  ctx.fill();
  ctx.fillRect(cx + 42, ctrlY - 5, 2, 10);
}

/**
 * Draws a circular translucent iOS quick action button (flashlight or camera).
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {'flashlight'|'camera'} type
 */
function renderQuickButton(ctx, x, y, type) {
  ctx.save();
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = 'rgba(20, 20, 20, 0.45)';
  ctx.beginPath();
  ctx.arc(x, y, 13, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  if (type === 'flashlight') {
    ctx.fillRect(x - 2, y - 5, 4, 3);
    ctx.fillRect(x - 1.5, y - 2, 3, 7);
  } else {
    ctx.fillRect(x - 5, y - 3, 10, 7);
    ctx.fillRect(x - 2, y - 5, 4, 2);
    ctx.fillStyle = 'rgba(20, 20, 20, 0.45)';
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}
