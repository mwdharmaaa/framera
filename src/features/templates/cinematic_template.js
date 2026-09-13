import { renderPlaceholder } from '../../core/canvas/renderer.js';

export const CINEMATIC_CONFIG = {
  canvasWidth: 1200,
  canvasHeight: 900,
  frame: { x: 80, y: 130, w: 1040, h: 640 }
};

/**
 * Renders 35mm Cinematic Film Strip template.
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement|null} img
 * @param {{ drawX: number, drawY: number, drawW: number, drawH: number }} bounds
 * @param {object} state
 */
export function renderCinematicTemplate(ctx, img, bounds, state) {
  const { canvasWidth, canvasHeight, frame } = CINEMATIC_CONFIG;

  // Film Base Black
  ctx.fillStyle = '#0a0a0c';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Sprocket Perforations at Top & Bottom
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  const holeW = 28;
  const holeH = 40;
  const spacing = 65;
  for (let x = 30; x < canvasWidth - 30; x += spacing) {
    // Top sprocket hole
    ctx.fillRect(x, 40, holeW, holeH);
    // Bottom sprocket hole
    ctx.fillRect(x, canvasHeight - 80, holeW, holeH);
  }

  // Edge text above perforations
  ctx.fillStyle = '#ffb300';
  ctx.font = '700 13px "Courier New", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('KODAK PORTRA 400 | 35MM EXPOSURE | SAFETY FILM', 80, 25);
  ctx.textAlign = 'right';
  ctx.fillText('FRAME 24A >', canvasWidth - 80, 25);

  // Photo viewport
  ctx.fillStyle = '#141416';
  ctx.fillRect(frame.x, frame.y, frame.w, frame.h);

  ctx.save();
  ctx.beginPath();
  ctx.rect(frame.x, frame.y, frame.w, frame.h);
  ctx.clip();

  if (img) {
    ctx.drawImage(img, bounds.drawX, bounds.drawY, bounds.drawW, bounds.drawH);
  } else {
    renderPlaceholder(ctx, frame, '#ffb300');
  }

  ctx.restore();

  // Subtle Letterbox Film Border
  ctx.strokeStyle = '#1e1e24';
  ctx.lineWidth = 4;
  ctx.strokeRect(frame.x, frame.y, frame.w, frame.h);

  // Caption metadata at bottom
  const title = state.caption || 'Cinematic Still';
  const meta = `${state.subtitle || 'ANAMORPHIC 2.39:1'} // ${state.date || 'OCT 2026'}`;

  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffffff';
  ctx.font = '600 24px "Poppins", sans-serif';
  ctx.fillText(title, 80, 810);

  ctx.fillStyle = '#a0a2ad';
  ctx.font = '500 15px "Courier New", monospace';
  ctx.fillText(meta, 80, 835);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#ffb300';
  ctx.font = '700 14px "Courier New", monospace';
  ctx.fillText('ISO 400 | 1/500s | f/2.0', canvasWidth - 80, 820);
}
