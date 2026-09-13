import { renderPlaceholder } from '../../core/canvas/renderer.js';

export const MAGAZINE_CONFIG = {
  canvasWidth: 1000,
  canvasHeight: 1350,
  frame: { x: 30, y: 30, w: 940, h: 1290 }
};

/**
 * Renders Editorial Magazine Cover template.
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement|null} img
 * @param {{ drawX: number, drawY: number, drawW: number, drawH: number }} bounds
 * @param {object} state
 */
export function renderMagazineTemplate(ctx, img, bounds, state) {
  const { canvasWidth, canvasHeight, frame } = MAGAZINE_CONFIG;

  ctx.fillStyle = '#0c0d10';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Clip and draw main portrait photo
  ctx.save();
  ctx.beginPath();
  ctx.rect(frame.x, frame.y, frame.w, frame.h);
  ctx.clip();

  if (img) {
    ctx.drawImage(img, bounds.drawX, bounds.drawY, bounds.drawW, bounds.drawH);
  } else {
    renderPlaceholder(ctx, frame, 'rgba(255, 255, 255, 0.15)');
  }

  // Vignette overlay for text legibility
  const topGrad = ctx.createLinearGradient(0, 0, 0, 300);
  topGrad.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
  topGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = topGrad;
  ctx.fillRect(frame.x, frame.y, frame.w, 300);

  const btmGrad = ctx.createLinearGradient(0, canvasHeight - 400, 0, canvasHeight);
  btmGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  btmGrad.addColorStop(1, 'rgba(0, 0, 0, 0.75)');
  ctx.fillStyle = btmGrad;
  ctx.fillRect(frame.x, canvasHeight - 400, frame.w, 400);

  ctx.restore();

  // White slim border
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.strokeRect(frame.x, frame.y, frame.w, frame.h);

  // Masthead Title
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 92px "Poppins", sans-serif';
  ctx.fillText('FRAMERA', canvasWidth / 2, 160);

  // Top header metadata bar
  ctx.font = '600 13px "Courier New", monospace';
  ctx.fillStyle = '#f0f0f5';
  ctx.textAlign = 'left';
  ctx.fillText('ISSUE NO. 042 // SPECIAL EDITION', 60, 80);
  ctx.textAlign = 'right';
  ctx.fillText(state.date || 'AUTUMN / WINTER 2026', canvasWidth - 60, 80);

  // Headline overlay on bottom
  const headline = (state.caption || 'ICONIC PORTRAITS').toUpperCase();
  const subtext = state.subtitle || 'A definitive exploration of modern visual aesthetic';

  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 48px "Poppins", sans-serif';
  ctx.fillText(headline, 65, 1140);

  ctx.fillStyle = '#d0d2db';
  ctx.font = '400 20px "Poppins", sans-serif';
  ctx.fillText(subtext, 65, 1185);

  // Minimal barcode strip on bottom right
  ctx.fillStyle = '#ffffff';
  let barX = canvasWidth - 190;
  for (let i = 0; i < 24; i++) {
    const bw = (i % 4 === 0) ? 4 : (i % 2 === 0) ? 2 : 1;
    ctx.fillRect(barX, 1220, bw, 40);
    barX += bw + 2;
  }
}
