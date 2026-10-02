import { calculateImageBounds } from '../../core/canvas/bounds.js';
import { renderFloralArt, renderVinylDisc } from './clementine_story_vinyl.js';
import { renderStoryVignettes, renderStoryHeader, renderStoryInputBar } from './clementine_story_decorations.js';

export const CLEMENTINE_STORY_SLOTS = [
  { id: 0, name: 'Top Left Photo', x: 34, y: 364, w: 330, h: 330 },
  { id: 1, name: 'Bottom Left Photo', x: 34, y: 704, w: 330, h: 330 },
  { id: 2, name: 'Bottom Right Photo', x: 372, y: 704, w: 330, h: 330 }
];

export const CLEMENTINE_VINYL_CARD = { x: 372, y: 364, w: 330, h: 330 };

/**
 * Renders the warm vanilla/cream story backdrop.
 */
export function renderClementineBackdrop(ctx, cw, ch) {
  ctx.save();
  ctx.fillStyle = '#eae3c6';
  ctx.fillRect(0, 0, cw, ch);
  ctx.restore();
}

/**
 * Renders an individual slot photo with cover scaling and pan/zoom framing.
 */
export function renderSlotPhoto(ctx, photo, slot, framing = {}) {
  if (!ctx || !slot) return;
  ctx.save();
  ctx.beginPath();
  ctx.rect(slot.x, slot.y, slot.w, slot.h);
  ctx.clip();

  ctx.fillStyle = '#dfd6b8';
  ctx.fillRect(slot.x, slot.y, slot.w, slot.h);

  if (photo) {
    const pw = photo.naturalWidth || photo.width || slot.w;
    const ph = photo.naturalHeight || photo.height || slot.h;
    const b = calculateImageBounds(pw, ph, slot, {
      zoom: framing.zoom ?? 1,
      panX: framing.panX ?? 0,
      panY: framing.panY ?? 0,
      fitMode: 'cover'
    });
    try {
      ctx.drawImage(photo, b.drawX, b.drawY, b.drawW, b.drawH);
    } catch {
      // Safe fallback
    }
  }
  ctx.restore();
}

/**
 * Assembles and renders the full Clementine Story composition.
 */
export function drawClementineStoryComposition(ctx, photos, state = {}) {
  const cw = 736;
  const ch = 1308;

  // 1. Warm vanilla backdrop
  renderClementineBackdrop(ctx, cw, ch);

  // 2. Photos in 3 slots
  const p0 = photos[0] || null;
  const p1 = photos[1] || p0;
  const p2 = photos[2] || p1;

  const framings = state?.framings || [];
  renderSlotPhoto(ctx, p0, CLEMENTINE_STORY_SLOTS[0], framings[0] || state);
  renderSlotPhoto(ctx, p1, CLEMENTINE_STORY_SLOTS[1], framings[1] || state);
  renderSlotPhoto(ctx, p2, CLEMENTINE_STORY_SLOTS[2], framings[2] || state);

  // 3. Top-right Vinyl Card (Floral art + Vinyl disc)
  const card = CLEMENTINE_VINYL_CARD;
  renderFloralArt(ctx, card.x, card.y, card.w, card.h);

  const discCx = card.x + card.w / 2;
  const discCy = card.y + card.h / 2 - 20;
  const discRadius = 96;
  const caption = state?.caption || 'Clementine';
  const subtitle = state?.subtitle || 'grentperez';
  renderVinylDisc(ctx, discCx, discCy, discRadius, p0, caption, subtitle);

  // 4. Atmospheric Story Vignettes
  renderStoryVignettes(ctx, cw, ch);

  // 5. Instagram Story Header (music badge) & Input Bar
  renderStoryHeader(ctx, caption, subtitle, p0);
  renderStoryInputBar(ctx, cw, ch);
}
