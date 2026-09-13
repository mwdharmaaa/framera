import { renderPlaceholder } from '../../core/canvas/renderer.js';

export const CYBER_CONFIG = {
  canvasWidth: 1000,
  canvasHeight: 1350,
  frame: { x: 60, y: 160, w: 880, h: 960 }
};

/**
 * Renders Cyberpunk Sci-Fi Telemetry template.
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement|null} img
 * @param {{ drawX: number, drawY: number, drawW: number, drawH: number }} bounds
 * @param {object} state
 */
export function renderCyberTemplate(ctx, img, bounds, state) {
  const { canvasWidth, canvasHeight, frame } = CYBER_CONFIG;

  // Deep Obsidian Cyber Matrix Background
  ctx.fillStyle = '#07090e';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Diagonal Matrix Crosshatch
  ctx.save();
  ctx.globalAlpha = 0.05;
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 1;
  for (let i = -1000; i < 2000; i += 45) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 1350, 1350);
    ctx.stroke();
  }
  ctx.restore();

  // Photo Frame Backplate
  ctx.fillStyle = '#0f141f';
  ctx.fillRect(frame.x, frame.y, frame.w, frame.h);

  // Clip and draw image
  ctx.save();
  ctx.beginPath();
  ctx.rect(frame.x, frame.y, frame.w, frame.h);
  ctx.clip();

  if (img) {
    ctx.drawImage(img, bounds.drawX, bounds.drawY, bounds.drawW, bounds.drawH);
  } else {
    renderPlaceholder(ctx, frame, '#00f0ff');
  }
  ctx.restore();

  // Frame Neon Cyan Border
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 2;
  ctx.strokeRect(frame.x, frame.y, frame.w, frame.h);

  // Corner HUD Brackets
  ctx.strokeStyle = '#d5ff40';
  ctx.lineWidth = 4;
  const bSize = 30;
  // Top-left
  ctx.beginPath(); ctx.moveTo(frame.x - 6, frame.y - 6 + bSize); ctx.lineTo(frame.x - 6, frame.y - 6); ctx.lineTo(frame.x - 6 + bSize, frame.y - 6); ctx.stroke();
  // Top-right
  ctx.beginPath(); ctx.moveTo(frame.x + frame.w + 6 - bSize, frame.y - 6); ctx.lineTo(frame.x + frame.w + 6, frame.y - 6); ctx.lineTo(frame.x + frame.w + 6, frame.y - 6 + bSize); ctx.stroke();
  // Bottom-left
  ctx.beginPath(); ctx.moveTo(frame.x - 6, frame.y + frame.h + 6 - bSize); ctx.lineTo(frame.x - 6, frame.y + frame.h + 6); ctx.lineTo(frame.x - 6 + bSize, frame.y + frame.h + 6); ctx.stroke();
  // Bottom-right
  ctx.beginPath(); ctx.moveTo(frame.x + frame.w + 6 - bSize, frame.y + frame.h + 6); ctx.lineTo(frame.x + frame.w + 6, frame.y + frame.h + 6); ctx.lineTo(frame.x + frame.w + 6, frame.y + frame.h + 6 - bSize); ctx.stroke();

  // Header Title & Status
  ctx.textAlign = 'left';
  ctx.font = '700 13px "Courier New", monospace';
  ctx.fillStyle = '#00f0ff';
  ctx.fillText('> SYSTEM_RECON // BIO_OPTIC_FEED 2.0', 60, 65);
  ctx.fillText(`COORDINATES: ${state.subtitle || '34.0522 N, 118.2437 W'}`, 60, 90);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#d5ff40';
  ctx.fillText(`STATUS: ONLINE [100%]`, canvasWidth - 60, 65);
  ctx.fillText(`REC_DATE: ${state.date || 'ACTIVE'}`, canvasWidth - 60, 90);

  // Big Headline
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 36px "Poppins", sans-serif';
  ctx.fillText((state.caption || 'CYBER ARCHIVE').toUpperCase(), 60, 140);

  // Footer Telemetry
  ctx.fillStyle = '#00f0ff';
  ctx.font = '700 12px "Courier New", monospace';
  ctx.fillText('// TELEMETRY LOGGED // ENCRYPTED OPTICAL ARCHIVE 256-BIT //', 60, 1175);
  ctx.textAlign = 'right';
  ctx.fillText('FRAMERA CYBER LABS', canvasWidth - 60, 1175);
}
