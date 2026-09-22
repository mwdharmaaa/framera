import { calculateImageBounds } from '../../core/canvas/bounds.js';

export const METROPOLIS_STORY_SLOTS = [
  {
    id: 0,
    name: 'Top Hero Photo',
    x: 0,
    y: 0,
    w: 736,
    h: 460
  },
  {
    id: 1,
    name: 'Bottom Portrait Photo',
    x: 74,
    y: 524,
    w: 282,
    h: 322
  }
];

export const LOREM_IPSUM_DEFAULT =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Every street tells a story.';

/**
 * Renders the warm editorial off-white paper canvas on the bottom half.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cw
 * @param {number} ch
 */
export function renderJournalBackdrop(ctx, cw = 736, ch = 920) {
  if (!ctx) return;
  ctx.save();
  ctx.fillStyle = '#f6f5f1';
  ctx.fillRect(0, 460, cw, ch - 460);
  ctx.restore();
}

/**
 * Renders an individual slot photo in rich monochrome analog grading.
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement|null} photo
 * @param {object} slot
 * @param {object} framing
 */
export function renderSlotPhoto(ctx, photo, slot, framing = {}) {
  if (!ctx || !slot) return;
  const { x, y, w, h } = slot;

  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();

  // Dark base
  ctx.fillStyle = '#111214';
  ctx.fillRect(x, y, w, h);

  if (photo) {
    const pw = photo.naturalWidth || photo.width || w;
    const ph = photo.naturalHeight || photo.height || h;
    const b = calculateImageBounds(pw, ph, slot, {
      zoom: framing.zoom ?? 1,
      panX: framing.panX ?? 0,
      panY: framing.panY ?? 0,
      fitMode: 'cover'
    });

    try {
      if (ctx.filter !== undefined) {
        ctx.filter = 'grayscale(100%) contrast(124%) brightness(98%)';
      }
      ctx.drawImage(photo, b.drawX, b.drawY, b.drawW, b.drawH);
    } catch {
      renderPlaceholderText(ctx, slot);
    } finally {
      if (ctx.filter !== undefined) {
        ctx.filter = 'none';
      }
    }
  } else {
    renderPlaceholderText(ctx, slot);
  }

  // Border stroke for inset portrait card
  if (slot.id === 1) {
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.12)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, w, h);
  }

  ctx.restore();
}

/**
 * Draws placeholder caption if image is null.
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} slot
 */
export function renderPlaceholderText(ctx, slot) {
  ctx.save();
  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(slot.name, slot.x + slot.w / 2, slot.y + slot.h / 2);
  ctx.restore();
}

/**
 * Renders handwritten cursive script text on the right column of the journal.
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} state
 */
export function renderLoremIpsumText(ctx, state = {}) {
  if (!ctx) return;
  ctx.save();

  const text = state?.subtitle || state?.caption || LOREM_IPSUM_DEFAULT;
  const startX = 388;
  const startY = 558;
  const maxW = 276;
  const lineHeight = 36;

  ctx.fillStyle = '#1a1a1a';
  ctx.font = '27px "Caveat", "Reenie Beanie", "Segoe Print", "Bradley Hand", cursive, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  const words = text.split(' ');
  let currentLine = '';
  let y = startY;

  for (let i = 0; i < words.length; i++) {
    const testLine = currentLine ? `${currentLine} ${words[i]}` : words[i];
    let metrics = { width: 0 };
    try {
      metrics = ctx.measureText(testLine) || { width: 0 };
    } catch {
      // Mock test fallback
    }

    if (metrics.width > maxW && currentLine) {
      ctx.fillText(currentLine, startX, y);
      currentLine = words[i];
      y += lineHeight;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    ctx.fillText(currentLine, startX, y);
  }

  ctx.restore();
}
