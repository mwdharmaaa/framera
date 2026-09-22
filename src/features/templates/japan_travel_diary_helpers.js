/**
 * Layout slot coordinates, authentic handwritten Japanese travel captions,
 * and clipping/drawing helpers for the Japan Travel Film Diary 12-Photo Template (3:4, 736x1041).
 */

export const JAPAN_DIARY_SLOTS = [
  // Row 1 (y: 44, h: 134)
  { id: 0, x: 40, y: 44, w: 201, h: 134 },
  { id: 1, x: 267, y: 44, w: 201, h: 134 },
  { id: 2, x: 494, y: 44, w: 201, h: 134 },

  // Row 2 (y: 266, h: 134)
  { id: 3, x: 40, y: 266, w: 201, h: 134 },
  { id: 4, x: 267, y: 266, w: 201, h: 134 },
  { id: 5, x: 494, y: 266, w: 201, h: 134 },

  // Row 3 (y: 488, h: 134)
  { id: 6, x: 40, y: 488, w: 201, h: 134 },
  { id: 7, x: 267, y: 488, w: 201, h: 134 },
  { id: 8, x: 494, y: 488, w: 201, h: 134 },

  // Row 4 (y: 710, h: 134)
  { id: 9, x: 40, y: 710, w: 201, h: 134 },
  { id: 10, x: 267, y: 710, w: 201, h: 134 },
  { id: 11, x: 494, y: 710, w: 201, h: 134 }
];

export const DEFAULT_DIARY_CAPTIONS = [
  'ヒッチハイクー！',
  '実はこの時\nねむかったw\nとっても。',
  '気持ちええなぁ〜',
  'おつかれさん！',
  '早速、やき肉。',
  'ハルさんも\n空中すべり台やったよ\n2人でテンションMAX.',
  'ハリウッドみえたー！',
  'ぼちぼち帰ろっか.',
  'サンタモニカ',
  'バカンスはこちらです〜',
  'see you !',
  'thank you ハルさん！'
];

/**
 * Fills the canvas with crisp minimal white paper backdrop.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cw
 * @param {number} ch
 */
export function renderDiaryBackdrop(ctx, cw, ch) {
  if (!ctx) return;
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, cw, ch);
  ctx.restore();
}

/**
 * Renders an individual 35mm film landscape photo clipped within its slot rectangle.
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement|null} img
 * @param {object} slot
 * @param {object} [framing={ zoom: 1, panX: 0, panY: 0 }]
 */
export function renderClippedDiaryPhoto(ctx, img, slot, framing = {}) {
  if (!ctx || !slot) return;
  if (!img) {
    ctx.save();
    ctx.fillStyle = '#f4f4f5';
    ctx.fillRect(slot.x, slot.y, slot.w, slot.h);
    ctx.restore();
    return;
  }

  const zoom = framing.zoom ?? 1;
  const panX = framing.panX ?? 0;
  const panY = framing.panY ?? 0;

  const nw = img.naturalWidth || img.width || slot.w;
  const nh = img.naturalHeight || img.height || slot.h;
  const scale = Math.max(slot.w / nw, slot.h / nh) * zoom;
  const sw = nw * scale;
  const sh = nh * scale;
  const sx = slot.x + (slot.w - sw) / 2 + panX;
  const sy = slot.y + (slot.h - sh) / 2 + panY;

  ctx.save();
  ctx.beginPath();
  ctx.rect(slot.x, slot.y, slot.w, slot.h);
  ctx.clip();
  try {
    ctx.drawImage(img, sx, sy, sw, sh);
  } catch {
    // Graceful fallback for mock unit tests
  }
  ctx.restore();
}

/**
 * Draws handwritten Japanese travel diary annotations under each photo slot.
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} text
 * @param {object} slot
 */
export function renderDiaryCaption(ctx, text, slot) {
  if (!ctx || !text || !slot) return;
  const lines = String(text).split('\n');
  const centerX = slot.x + slot.w / 2;
  const areaY = slot.y + slot.h;
  const availableH = 88;
  const lineHeight = 15;
  const totalTextH = lines.length * lineHeight;
  const startY = areaY + (availableH - totalTextH) / 2 + lineHeight / 2;

  ctx.save();
  ctx.fillStyle = '#1c1917';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '500 12.5px "Hiragino Maru Gothic ProN", "Klee One", "Yuji Boku", "Yu Mincho", "Comic Sans MS", cursive, sans-serif';

  lines.forEach((line, i) => {
    ctx.fillText(line.trim(), centerX, startY + i * lineHeight);
  });

  ctx.restore();
}
