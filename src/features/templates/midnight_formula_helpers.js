/**
 * Layout slots, card rendering, and music player routines for Midnight Formula Quad template.
 */

export const MIDNIGHT_FORMULA_SLOTS = [
  { id: 0, label: 'Top Hero', x: 0, y: 0, w: 736, h: 485 },
  { id: 1, label: 'Center Crop', x: 235, y: 485, w: 501, h: 360 },
  { id: 2, label: 'Bottom Left Detail', x: 0, y: 845, w: 405, h: 463 },
  { id: 3, label: 'Bottom Right Portrait', x: 395, y: 845, w: 341, h: 463 }
];

/**
 * Renders the midnight backdrop canvas.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cw
 * @param {number} ch
 */
export function renderFormulaBackground(ctx, cw = 736, ch = 1308) {
  if (!ctx) return;
  ctx.fillStyle = '#07070d';
  if (typeof ctx.fillRect === 'function') {
    ctx.fillRect(0, 0, cw, ch);
  }
}

/**
 * Renders a photo cropped and centered inside a defined slot rectangle.
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement} photo
 * @param {object} slot
 */
export function renderFormulaCard(ctx, photo, slot) {
  if (!ctx || !photo) return;
  const { x, y, w, h } = slot;

  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();

  const nw = photo.naturalWidth || photo.width || w;
  const nh = photo.naturalHeight || photo.height || h;
  const scale = Math.max(w / nw, h / nh);
  const sw = nw * scale;
  const sh = nh * scale;
  const sx = x + (w - sw) / 2;
  const sy = y + (h - sh) / 2;

  try {
    ctx.drawImage(photo, sx, sy, sw, sh);
  } catch {
    // Graceful fallback for mock unit tests
  }

  // Subtle dark frame hairline edge
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, w, h);

  ctx.restore();
}

/**
 * Renders the signature glassmorphic music player card.
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement|null} albumPhoto
 * @param {object} state
 */
export function drawMusicPlayerWidget(ctx, albumPhoto, state = {}) {
  if (!ctx) return;
  const x = 18;
  const y = 575;
  const w = 325;
  const h = 182;
  const r = 22;

  ctx.save();

  // Glass card background
  ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 6;

  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.rect(x, y, w, h);
  }
  ctx.fillStyle = 'rgba(20, 24, 38, 0.82)';
  ctx.fill();

  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Album Artwork Thumbnail
  const ax = 34;
  const ay = 592;
  const aw = 78;
  const ah = 78;
  const ar = 12;

  ctx.save();
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(ax, ay, aw, ah, ar);
  } else {
    ctx.rect(ax, ay, aw, ah);
  }
  ctx.clip();

  if (albumPhoto) {
    const nw = albumPhoto.naturalWidth || albumPhoto.width || aw;
    const nh = albumPhoto.naturalHeight || albumPhoto.height || ah;
    const scale = Math.max(aw / nw, ah / nh);
    const sw = nw * scale;
    const sh = nh * scale;
    try {
      ctx.drawImage(albumPhoto, ax + (aw - sw) / 2, ay + (ah - sh) / 2, sw, sh);
    } catch {
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(ax, ay, aw, ah);
    }
  } else {
    const albGrad = ctx.createLinearGradient(ax, ay, ax + aw, ay + ah);
    albGrad.addColorStop(0, '#1e1b4b');
    albGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = albGrad;
    ctx.fillRect(ax, ay, aw, ah);
  }
  ctx.restore();

  // Track Title and Artist
  const title = state.caption || 'formula';
  const artist = state.subtitle || 'labyrinth';

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 17px -apple-system, BlinkMacSystemFont, "DM Sans", Roboto, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(title, 126, 620);

  ctx.fillStyle = '#9ca3af';
  ctx.font = '500 13px -apple-system, BlinkMacSystemFont, "DM Sans", Roboto, sans-serif';
  ctx.fillText(artist, 126, 642);

  // Heart Icon
  drawHeartIcon(ctx, 312, 620, 8);

  // Progress Bar
  const px = 34;
  const py = 690;
  const pw = 290;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
  ctx.fillRect(px, py, pw, 3.5);

  const activeW = pw * 0.32;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
  ctx.fillRect(px, py, activeW, 3.5);

  ctx.beginPath();
  ctx.arc(px + activeW, py + 1.75, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  // Timestamps
  ctx.fillStyle = '#9ca3af';
  ctx.font = '10px -apple-system, BlinkMacSystemFont, "DM Sans", Roboto, sans-serif';
  ctx.fillText('0:56', px, 706);
  ctx.textAlign = 'right';
  ctx.fillText('-2:48', px + pw, 706);

  // Playback Controls
  drawPlaybackControls(ctx, 228, 726);

  ctx.restore();
}

function drawHeartIcon(ctx, cx, cy, size) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.beginPath();
  ctx.moveTo(0, size * 0.3);
  ctx.bezierCurveTo(-size, -size * 0.4, -size * 0.5, -size, 0, -size * 0.4);
  ctx.bezierCurveTo(size * 0.5, -size, size, -size * 0.4, 0, size * 0.3);
  ctx.fill();
  ctx.restore();
}

function drawPlaybackControls(ctx, cx, cy) {
  ctx.save();
  ctx.fillStyle = '#ffffff';

  // Skip Back (x = cx - 56)
  const bx = cx - 56;
  ctx.beginPath();
  ctx.moveTo(bx, cy - 6);
  ctx.lineTo(bx - 6, cy);
  ctx.lineTo(bx, cy + 6);
  ctx.closePath();
  ctx.moveTo(bx + 7, cy - 6);
  ctx.lineTo(bx + 1, cy);
  ctx.lineTo(bx + 7, cy + 6);
  ctx.closePath();
  ctx.fill();

  // Pause Bars (center)
  ctx.beginPath();
  ctx.rect(cx - 5, cy - 7, 3.5, 14);
  ctx.rect(cx + 1.5, cy - 7, 3.5, 14);
  ctx.fill();

  // Skip Next (x = cx + 56)
  const fx = cx + 56;
  ctx.beginPath();
  ctx.moveTo(fx, cy - 6);
  ctx.lineTo(fx + 6, cy);
  ctx.lineTo(fx, cy + 6);
  ctx.closePath();
  ctx.moveTo(fx - 7, cy - 6);
  ctx.lineTo(fx - 1, cy);
  ctx.lineTo(fx - 7, cy + 6);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}
