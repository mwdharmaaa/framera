import { renderPlaceholder } from '../../core/canvas/renderer.js';

export const POLAROID_CONFIG = {
  canvasWidth: 1000,
  canvasHeight: 1250,
  frame: { x: 75, y: 75, w: 850, h: 850 }
};

/**
 * Renders Classic Polaroid instant film template.
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement|null} img
 * @param {{ drawX: number, drawY: number, drawW: number, drawH: number }} bounds
 * @param {object} state
 */
export function renderPolaroidTemplate(ctx, img, bounds, state) {
  const { canvasWidth, canvasHeight, frame } = POLAROID_CONFIG;

  // Cream white paper card background
  ctx.fillStyle = '#f8f7f2';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Subtle paper texture grain border
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.06)';
  ctx.lineWidth = 1;
  ctx.strokeRect(10, 10, canvasWidth - 20, canvasHeight - 20);

  // Photo recessed shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
  ctx.fillRect(frame.x - 3, frame.y - 3, frame.w + 6, frame.h + 6);

  // Photo viewport
  ctx.fillStyle = '#1c1c1f';
  ctx.fillRect(frame.x, frame.y, frame.w, frame.h);

  // Clip and draw photo
  ctx.save();
  ctx.beginPath();
  ctx.rect(frame.x, frame.y, frame.w, frame.h);
  ctx.clip();

  if (img) {
    ctx.drawImage(img, bounds.drawX, bounds.drawY, bounds.drawW, bounds.drawH);
  } else {
    renderPlaceholder(ctx, frame, 'rgba(255, 255, 255, 0.2)');
  }
  ctx.restore();

  // Glossy reflection sheen
  ctx.save();
  const sheen = ctx.createLinearGradient(frame.x, frame.y, frame.x + frame.w, frame.y + frame.h);
  sheen.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
  sheen.addColorStop(0.3, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = sheen;
  ctx.fillRect(frame.x, frame.y, frame.w, frame.h);
  ctx.restore();

  // Bottom text section
  const caption = (state.caption || 'Cherished Moments').trim();
  const dateStr = (state.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })).trim();
  const location = (state.subtitle || 'MEMORIES ARCHIVE').toUpperCase();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#1a1a1c';
  ctx.font = '600 38px "Poppins", sans-serif';
  ctx.fillText(caption, canvasWidth / 2, 1030);

  ctx.fillStyle = '#7a7a82';
  ctx.font = '500 18px "Poppins", sans-serif';
  ctx.fillText(`${dateStr} • ${location}`, canvasWidth / 2, 1085);

  // Vintage film logo watermark at bottom corner
  ctx.textAlign = 'right';
  ctx.font = '700 11px "Courier New", monospace';
  ctx.fillStyle = '#b0b0b8';
  ctx.fillText('FRAMERA INSTANT COLOR FILM 800', canvasWidth - 75, 1180);
}
