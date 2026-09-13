import { renderPlaceholder, wrapCanvasText } from '../../core/canvas/renderer.js';

export const BRUTALIST_CONFIG = {
  canvasWidth: 1000,
  canvasHeight: 1350,
  frame: { x: 50, y: 160, w: 900, h: 860 }
};

/**
 * Renders Neo-Brutalist Poster template.
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement|null} img
 * @param {{ drawX: number, drawY: number, drawW: number, drawH: number }} bounds
 * @param {object} state
 */
export function renderBrutalistTemplate(ctx, img, bounds, state) {
  const { canvasWidth, canvasHeight, frame } = BRUTALIST_CONFIG;

  // Background
  ctx.fillStyle = '#10120d';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Outer Neon Lime Frame
  ctx.strokeStyle = '#d5ff40';
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 20, canvasWidth - 40, canvasHeight - 40);

  // Top Barcode
  ctx.fillStyle = '#ffffff';
  let bx = canvasWidth - 240;
  for (let i = 0; i < 24; i++) {
    const w = (i % 5 === 0) ? 5 : (i % 3 === 0) ? 3 : (i % 2 === 0) ? 2 : 1;
    ctx.fillRect(bx, 45, w, 35);
    bx += w + 2;
  }

  // Header Title
  ctx.textAlign = 'left';
  ctx.fillStyle = '#d5ff40';
  ctx.font = '700 12px "Courier New", monospace';
  ctx.fillText('// SPECIFICATION: BRUTAL_OPTIC_01', 50, 55);
  ctx.fillText(`DATE_RECORDED: ${state.date || 'ACTIVE'}`, 50, 75);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 44px "Poppins", sans-serif';
  ctx.fillText('FRAMERA POSTER', 50, 130);

  // Photo Frame
  ctx.fillStyle = '#1b1e15';
  ctx.fillRect(frame.x, frame.y, frame.w, frame.h);

  ctx.save();
  ctx.beginPath();
  ctx.rect(frame.x, frame.y, frame.w, frame.h);
  ctx.clip();

  if (img) {
    ctx.drawImage(img, bounds.drawX, bounds.drawY, bounds.drawW, bounds.drawH);
  } else {
    renderPlaceholder(ctx, frame, '#d5ff40');
  }
  ctx.restore();

  ctx.strokeStyle = '#d5ff40';
  ctx.lineWidth = 3;
  ctx.strokeRect(frame.x, frame.y, frame.w, frame.h);

  // Bottom Metadata
  const title = (state.caption || 'EXHIBIT ARCHIVE').toUpperCase();
  const description = (state.subtitle || 'Systematic visual compilation for high-resolution output').toUpperCase();

  ctx.textAlign = 'left';
  ctx.fillStyle = '#d5ff40';
  ctx.font = '800 36px "Poppins", sans-serif';
  ctx.fillText(title, 50, 1080);

  ctx.fillStyle = '#c5c8ba';
  ctx.font = '600 16px "Poppins", sans-serif';
  wrapCanvasText(ctx, description, 50, 1125, 880, 26, 3);

  // Footer Tagline
  ctx.textAlign = 'center';
  ctx.fillStyle = '#d5ff40';
  ctx.font = '700 12px "Courier New", monospace';
  ctx.fillText('// AUTHENTIC RENDER // ZERO COMPROMISE VISUAL SYNTHESIZER //', canvasWidth / 2, 1290);
}
