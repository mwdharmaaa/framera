import { calculateImageBounds } from '../../core/canvas/bounds.js';

/**
 * Editorial Diptych Duo Template (2 Foto).
 * Minimalist gallery exhibition diptych with side-by-side twin windows, Swiss typography, and clean hairlines.
 */
export const diptychDuoTemplate = {
  id: 'diptych_duo',
  name: 'Editorial Diptych',
  description: 'Minimalist museum exhibition diptych with dual portrait frames, Swiss typography, and fine hairlines',
  previewImage: 'assets/focus_reference.jpg',
  aspectRatio: '3:4',
  tag: 'GALLERY',
  photoCount: 2,
  config: {
    canvasWidth: 1200,
    canvasHeight: 1600,
    slots: [
      { x: 90, y: 220, w: 490, h: 1080 },
      { x: 620, y: 220, w: 490, h: 1080 }
    ]
  },
  render(ctx, img, bounds, state = {}) {
    const { canvasWidth: cw, canvasHeight: ch, slots } = this.config;

    // 1. Warm gallery backdrop
    ctx.fillStyle = '#0f1013';
    ctx.fillRect(0, 0, cw, ch);

    // 2. Exhibition Header
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 28px "Space Mono", monospace, sans-serif';
    ctx.letterSpacing = '6px';
    const headline = (state.caption && state.caption !== 'FOCUS') ? state.caption : 'DIPTYCH';
    ctx.fillText(headline.toUpperCase(), 90, 110);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '400 13px "Space Mono", monospace, sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillText('EXHIBITION SERIES // DUAL PERSPECTIVE', 90, 145);

    ctx.textAlign = 'right';
    const dateStr = state.date || 'VOL. 02 // 2026';
    ctx.fillText(dateStr.toUpperCase(), cw - 90, 145);

    // Fine top separator
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(90, 175);
    ctx.lineTo(cw - 90, 175);
    ctx.stroke();
    ctx.restore();

    // 3. Render Dual Slots
    const photos = state.photos || [];
    slots.forEach((slot, idx) => {
      const slotImg = photos[idx] || img;

      ctx.fillStyle = '#14151a';
      ctx.fillRect(slot.x, slot.y, slot.w, slot.h);

      if (slotImg) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(slot.x, slot.y, slot.w, slot.h);
        ctx.clip();

        const slotBounds = calculateImageBounds(
          slotImg.naturalWidth || slotImg.width,
          slotImg.naturalHeight || slotImg.height,
          slot,
          { zoom: state.zoom || 1, panX: state.panX || 0, panY: state.panY || 0, fitMode: 'cover' }
        );
        ctx.drawImage(slotImg, slotBounds.drawX, slotBounds.drawY, slotBounds.drawW, slotBounds.drawH);
        ctx.restore();
      }

      // Elegant inner bevel
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(slot.x, slot.y, slot.w, slot.h);

      // Plate Roman numeral label
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '600 12px "Space Mono", monospace, sans-serif';
      ctx.fillText(`PLATE ${idx === 0 ? 'I' : 'II'}`, slot.x, slot.y + slot.h + 30);
      ctx.restore();
    });

    // 4. Exhibition footer
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.font = '400 13px "Space Mono", monospace, sans-serif';
    ctx.letterSpacing = '1px';
    const sub = state.subtitle || 'Form in dual symmetry. An examination of light and negative space.';
    ctx.fillText(sub, 90, 1440);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(90, 1480);
    ctx.lineTo(cw - 90, 1480);
    ctx.stroke();

    ctx.font = '600 11px "Space Mono", monospace, sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText('CURATED BY FRAMERA STUDIO', 90, 1515);
    ctx.textAlign = 'right';
    ctx.fillText('LIMITED EDITION ARCHIVE', cw - 90, 1515);
    ctx.restore();
  }
};
