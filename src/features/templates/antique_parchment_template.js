import {
  ANTIQUE_PARCHMENT_SLOT,
  DEFAULT_PARCHMENT_CONFIG,
  renderDarkBackdrop,
  clipDeckledParchment,
  renderVerticalCalligraphy
} from './antique_parchment_helpers.js';
import {
  renderParchmentBase,
  renderMonochromeHero,
  renderParchmentVignettes,
  renderVermilionChop
} from './antique_parchment_fx.js';

/**
 * Antique Parchment Template (3:4, 1200x1600).
 * Category: '1' (1 photo).
 * Features an aged washi paper sheet with organic torn ragged deckle edges,
 * high-contrast monochrome chiaroscuro photo grading, and vertical calligraphy sumi ink.
 */
export const antiqueParchmentTemplate = {
  id: 'antique_parchment',
  name: 'Antique Parchment',
  description: 'Aged washi parchment with organic torn ragged deckle edges, chiaroscuro monochrome grading, and vertical calligraphy',
  previewImage: 'assets/antique_parchment_preview.png',
  aspectRatio: '3:4',
  tag: 'VINTAGE WASHI',
  tags: ['bnw', 'vintage', 'parchment', 'washi', 'calligraphy', 'antique', 'minimal', 'monochrome', 'botanical'],
  photoCount: 1,
  category: '1',
  config: {
    canvasWidth: 1200,
    canvasHeight: 1600,
    slots: [ANTIQUE_PARCHMENT_SLOT]
  },
  slots: [ANTIQUE_PARCHMENT_SLOT],

  render(ctx, img, bounds, state = {}) {
    const { canvasWidth: cw, canvasHeight: ch } = this.config;

    // 1. Reference preview fallback
    const isReferencePreview = !state?.isUserUploaded && img && (
      (typeof img.src === 'string' && img.src.includes('antique_parchment_reference')) ||
      (!state?.photoImgs?.length && !state?.photos?.length && !state?.photoImg)
    );

    if (isReferencePreview && img) {
      const drawX = typeof bounds?.drawX === 'number' ? bounds.drawX : 0;
      const drawY = typeof bounds?.drawY === 'number' ? bounds.drawY : 0;
      const drawW = typeof bounds?.drawW === 'number' ? bounds.drawW : cw;
      const drawH = typeof bounds?.drawH === 'number' ? bounds.drawH : ch;
      try {
        ctx.drawImage(img, drawX, drawY, drawW, drawH);
      } catch {
        // Safe fallback for test environments
      }
      return;
    }

    // 2. Pitch black exterior backdrop
    renderDarkBackdrop(ctx, cw, ch);

    // 3. Torn ragged deckled paper interior
    ctx.save();
    clipDeckledParchment(ctx, cw, ch);

    // 4. Aged washi gradient & fibers
    renderParchmentBase(ctx, cw, ch);

    // 5. User hero photo in chiaroscuro monochrome
    const photo = state?.photoImg ||
      (Array.isArray(state?.photos) && state.photos[0] ? state.photos[0] : null) ||
      (Array.isArray(state?.photoImgs) && state.photoImgs[0] ? state.photoImgs[0] : null) ||
      img;

    const slotState = Array.isArray(state?.slots) ? state.slots[0] : null;
    const framing = {
      zoom: slotState?.zoom ?? (state?.zoom ?? 1),
      panX: slotState?.panX ?? (state?.panX ?? 0),
      panY: slotState?.panY ?? (state?.panY ?? 0)
    };

    renderMonochromeHero(ctx, photo, ANTIQUE_PARCHMENT_SLOT, framing);

    // 6. Deep atmospheric antique vignettes over photo
    renderParchmentVignettes(ctx, cw, ch);

    // 7. Top-left vertical calligraphy & seal stamp
    const rawCaption = state?.caption;
    const isDefaultFocus = !rawCaption || rawCaption.trim().toUpperCase() === 'FOCUS';
    const calligraphyText = (!isDefaultFocus && rawCaption) || DEFAULT_PARCHMENT_CONFIG.caption;

    renderVerticalCalligraphy(ctx, calligraphyText, 76, 110);
    renderVermilionChop(ctx, 56, 110 + Array.from(calligraphyText).length * 82 + 12, '印');

    ctx.restore();
  }
};
