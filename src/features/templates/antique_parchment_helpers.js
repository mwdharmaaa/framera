/**
 * Coordinates, deckled paper path generator, and vertical calligraphy
 * for Antique Parchment Template (3:4, 1200x1600).
 */

export const ANTIQUE_PARCHMENT_SLOT = {
  id: 0,
  x: 38,
  y: 38,
  w: 1124,
  h: 1524
};

export const DEFAULT_PARCHMENT_CONFIG = {
  caption: '菲奥娜',
  subtitle: 'CHINESE INK FLOWER',
  date: 'EST. 1928'
};

/**
 * Fills the base canvas with deep pitch black border.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cw
 * @param {number} ch
 */
export function renderDarkBackdrop(ctx, cw, ch) {
  if (!ctx) return;
  ctx.save();
  ctx.fillStyle = '#060504';
  ctx.fillRect(0, 0, cw, ch);
  ctx.restore();
}

/**
 * Traces and clips an organic, ragged torn deckle-edge paper boundary.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cw
 * @param {number} ch
 */
export function clipDeckledParchment(ctx, cw, ch) {
  if (!ctx) return;
  const inset = 36;
  const step = 20;

  ctx.beginPath();
  // Top edge (Left to Right)
  ctx.moveTo(inset, inset);
  for (let x = inset; x <= cw - inset; x += step) {
    const wave = Math.sin(x * 0.08) * 4 + Math.sin(x * 0.22) * 2;
    const jag = (Math.sin(x * 1.34) > 0.65) ? -6 : 0;
    ctx.lineTo(x, inset + wave + jag);
  }

  // Right edge (Top to Bottom)
  for (let y = inset; y <= ch - inset; y += step) {
    const wave = Math.cos(y * 0.07) * 4 + Math.sin(y * 0.19) * 2;
    const jag = (Math.sin(y * 1.15) > 0.7) ? 6 : 0;
    ctx.lineTo(cw - inset + wave + jag, y);
  }

  // Bottom edge (Right to Left)
  for (let x = cw - inset; x >= inset; x -= step) {
    const wave = Math.sin(x * 0.09) * 4 + Math.cos(x * 0.25) * 2;
    const jag = (Math.sin(x * 1.42) > 0.65) ? 6 : 0;
    ctx.lineTo(x, ch - inset + wave + jag);
  }

  // Left edge (Bottom to Top)
  for (let y = ch - inset; y >= inset; y -= step) {
    const wave = Math.cos(y * 0.08) * 4 + Math.sin(y * 0.21) * 2;
    const jag = (Math.sin(y * 1.28) > 0.7) ? -6 : 0;
    ctx.lineTo(inset + wave + jag, y);
  }

  ctx.closePath();
  ctx.clip();
}

/**
 * Renders vertical calligraphy characters at top-left with sumi-ink bleed.
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} text
 * @param {number} startX
 * @param {number} startY
 */
export function renderVerticalCalligraphy(ctx, text = '菲奥娜', startX = 76, startY = 110) {
  if (!ctx) return;
  const chars = Array.from(text || '菲奥娜');

  ctx.save();
  ctx.fillStyle = 'rgba(25, 20, 16, 0.95)';
  ctx.shadowColor = 'rgba(235, 220, 195, 0.45)';
  ctx.shadowBlur = 4;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '900 68px "Noto Serif SC", "Songti SC", "SimSun", "STSong", "KaiTi", "Cinzel", "Times New Roman", serif';

  const charSpacing = 82;
  chars.forEach((c, idx) => {
    ctx.fillText(c, startX, startY + idx * charSpacing);
  });

  ctx.restore();
}
