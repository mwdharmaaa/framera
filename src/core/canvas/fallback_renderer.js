/**
 * Renders neutral studio photo fallback when no template is selected.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} canvasWidth
 * @param {number} canvasHeight
 * @param {{ x: number, y: number, w: number, h: number }} frame
 * @param {object} state
 * @param {{ drawX: number, drawY: number, drawW: number, drawH: number }} bounds
 */
export function renderFallbackStudioCanvas(ctx, canvasWidth, canvasHeight, frame, state, bounds) {
  // Clean neutral card background
  ctx.fillStyle = '#0e1017';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Border frame area
  ctx.fillStyle = '#161922';
  ctx.fillRect(frame.x - 12, frame.y - 12, frame.w + 24, frame.h + 24);

  ctx.save();
  ctx.beginPath();
  ctx.rect(frame.x, frame.y, frame.w, frame.h);
  ctx.clip();

  if (state.photoImg) {
    ctx.drawImage(state.photoImg, bounds.drawX, bounds.drawY, bounds.drawW, bounds.drawH);
  } else {
    // Subtle grid placeholder
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.strokeRect(frame.x, frame.y, frame.w, frame.h);
    ctx.beginPath();
    ctx.moveTo(frame.x, frame.y);
    ctx.lineTo(frame.x + frame.w, frame.y + frame.h);
    ctx.moveTo(frame.x + frame.w, frame.y);
    ctx.lineTo(frame.x, frame.y + frame.h);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '600 18px "Poppins", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('UPLOAD PHOTO TO PREVIEW FRAMING', canvasWidth / 2, canvasHeight / 2);
  }
  ctx.restore();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 2;
  ctx.strokeRect(frame.x, frame.y, frame.w, frame.h);

  // Footer caption
  if (state.caption) {
    ctx.fillStyle = '#ffffff';
    ctx.font = '600 24px "Poppins", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(state.caption, canvasWidth / 2, canvasHeight - 50);
  }
}
