import { calculateImageBounds } from '../../core/canvas/bounds.js';
import { renderPlaceholder } from '../../core/canvas/renderer.js';

export const SENTIMENTAL_SLOTS = [
  {
    id: 0,
    name: 'Left Card',
    frame: { x: 109, y: 320, w: 250, h: 314 },
    photo: { x: 118, y: 329, w: 232, h: 296 }
  },
  {
    id: 1,
    name: 'Right Card',
    frame: { x: 389, y: 320, w: 250, h: 314 },
    photo: { x: 398, y: 329, w: 232, h: 296 }
  }
];

/**
 * Renders textured linen paper background with subtle paper fibers and vignette.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} width
 * @param {number} height
 */
export function renderSentimentalBackground(ctx, width, height) {
  ctx.save();

  // Warm cream linen paper base
  ctx.fillStyle = '#f8f4ea';
  ctx.fillRect(0, 0, width, height);

  // Subtle organic paper texture fibers
  ctx.fillStyle = 'rgba(50, 40, 30, 0.018)';
  for (let i = 0; i < 240; i++) {
    const rx = ((Math.sin(i * 14.123) * 43758.5453) % 1 + 1) % 1 * width;
    const ry = ((Math.cos(i * 67.432) * 43758.5453) % 1 + 1) % 1 * height;
    ctx.fillRect(rx, ry, 1.5, 1.5);
  }

  // Soft ambient radial vignette
  if (typeof ctx.createRadialGradient === 'function') {
    const grad = ctx.createRadialGradient(width / 2, height / 2, width * 0.25, width / 2, height / 2, width * 0.75);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
    grad.addColorStop(1, 'rgba(55, 42, 28, 0.045)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  }

  ctx.restore();
}

/**
 * Renders an ID photo card with white margin and subtle drop shadow.
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement|null} photo
 * @param {object} slot
 * @param {object} [framing={}]
 */
export function renderSentimentalCard(ctx, photo, slot, framing = {}) {
  const { frame, photo: pBox } = slot;

  ctx.save();

  // Outer card drop shadow
  ctx.shadowColor = 'rgba(35, 28, 20, 0.12)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 4;

  // Outer crisp white paper card
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(frame.x, frame.y, frame.w, frame.h);

  // Outer hairline border
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.14)';
  ctx.lineWidth = 1;
  ctx.strokeRect(frame.x, frame.y, frame.w, frame.h);

  // Inner ID Photo Box
  ctx.save();
  ctx.beginPath();
  ctx.rect(pBox.x, pBox.y, pBox.w, pBox.h);
  ctx.clip();

  // Classic studio ID card blue backdrop
  ctx.fillStyle = '#061fa6';
  ctx.fillRect(pBox.x, pBox.y, pBox.w, pBox.h);

  if (photo) {
    const pw = photo.naturalWidth || photo.width || pBox.w;
    const ph = photo.naturalHeight || photo.height || pBox.h;
    const b = calculateImageBounds(pw, ph, pBox, {
      zoom: framing.zoom ?? 1,
      panX: framing.panX ?? 0,
      panY: framing.panY ?? 0,
      fitMode: 'cover'
    });
    try {
      ctx.drawImage(photo, b.drawX, b.drawY, b.drawW, b.drawH);
    } catch {
      renderPlaceholder(ctx, pBox, 'rgba(255, 255, 255, 0.3)');
    }
  } else {
    renderPlaceholder(ctx, pBox, 'rgba(255, 255, 255, 0.3)');
  }

  ctx.restore();

  // Inner hairline frame border
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.10)';
  ctx.lineWidth = 1;
  ctx.strokeRect(pBox.x, pBox.y, pBox.w, pBox.h);

  ctx.restore();
}

/**
 * Renders header cursive calligraphy and footer typewriter quote.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} width
 * @param {number} height
 * @param {object} state
 */
export function renderSentimentalTypography(ctx, width, height, state = {}) {
  let caption = state.caption !== undefined ? state.caption : 'the "sentimental"';
  const subtitle = state.subtitle !== undefined ? state.subtitle : '...... trying very best version of me';

  if (caption && caption.includes('"')) {
    caption = caption.replace(/"([^"]+)"/, '“$1”');
  }

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // 1. Top flowing cursive calligraphy script
  if (caption) {
    ctx.fillStyle = '#1c1a16';
    ctx.font = '54px "Alex Brush", "Great Vibes", "Playfair Display", cursive';
    ctx.fillText(caption, width / 2, 234);
  }

  // 2. Bottom minimalist monospace quote
  if (subtitle) {
    ctx.fillStyle = '#22201b';
    ctx.font = '14.5px "Space Mono", "Courier New", monospace';
    ctx.fillText(subtitle, width / 2, 715);
  }

  ctx.restore();
}
