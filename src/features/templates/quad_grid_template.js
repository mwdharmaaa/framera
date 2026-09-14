import { calculateImageBounds } from '../../core/canvas/bounds.js';

/**
 * 2x2 Polaroid Contact Quad Grid Template (4 Foto).
 * Four square polaroid contact frames arranged in a 2x2 gallery grid with editorial captions and date stamps.
 */
export const quadGridTemplate = {
  id: 'quad_grid',
  name: '2x2 Polaroid Quad',
  description: 'Four square polaroid contact frames in a 2x2 gallery layout with individual frame labels and studio stamps',
  previewImage: 'assets/focus_reference.jpg',
  aspectRatio: '3:4',
  tag: 'POLAROID',
  photoCount: 4,
  config: {
    canvasWidth: 1200,
    canvasHeight: 1600,
    slots: [
      { x: 90, y: 180, w: 480, h: 540 },
      { x: 630, y: 180, w: 480, h: 540 },
      { x: 90, y: 800, w: 480, h: 540 },
      { x: 630, y: 800, w: 480, h: 540 }
    ]
  },
  render(ctx, img, bounds, state = {}) {
    const { canvasWidth: cw, canvasHeight: ch, slots } = this.config;

    // 1. Warm dark gallery backing
    ctx.fillStyle = '#111217';
    ctx.fillRect(0, 0, cw, ch);

    // 2. Header Title
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 24px "Space Mono", monospace, sans-serif';
    ctx.letterSpacing = '6px';
    const headline = (state.caption && state.caption !== 'FOCUS') ? state.caption : 'QUADRANT';
    ctx.fillText(headline.toUpperCase(), 90, 95);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '500 12px "Space Mono", monospace, sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillText('2x2 POLAROID CONTACT ARCHIVE // SERIES 04', 90, 125);

    ctx.textAlign = 'right';
    const dateStr = state.date || 'VOL. 04 // 2026';
    ctx.fillText(dateStr.toUpperCase(), cw - 90, 125);

    // Header divider line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(90, 145);
    ctx.lineTo(cw - 90, 145);
    ctx.stroke();
    ctx.restore();

    // 3. Render 4 Polaroid Frames in 2x2 Grid
    const photos = state.photos || [];
    slots.forEach((card, idx) => {
      const slotImg = photos[idx] || img;

      // Polaroid Card Paper
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 24;
      ctx.shadowOffsetY = 10;
      ctx.fillStyle = '#f5f6f9';
      ctx.fillRect(card.x, card.y, card.w, card.h);
      ctx.restore();

      // Photo Window inside Polaroid (square aspect)
      const photoBox = {
        x: card.x + 24,
        y: card.y + 24,
        w: card.w - 48,
        h: card.h - 110
      };

      ctx.fillStyle = '#1e2028';
      ctx.fillRect(photoBox.x, photoBox.y, photoBox.w, photoBox.h);

      if (slotImg) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(photoBox.x, photoBox.y, photoBox.w, photoBox.h);
        ctx.clip();

        const slotBounds = calculateImageBounds(
          slotImg.naturalWidth || slotImg.width,
          slotImg.naturalHeight || slotImg.height,
          photoBox,
          { zoom: state.zoom || 1, panX: state.panX || 0, panY: state.panY || 0, fitMode: 'cover' }
        );
        ctx.drawImage(slotImg, slotBounds.drawX, slotBounds.drawY, slotBounds.drawW, slotBounds.drawH);
        ctx.restore();
      }

      // Polaroid caption area
      ctx.save();
      ctx.fillStyle = '#262933';
      ctx.font = '700 13px "Space Mono", monospace, sans-serif';
      ctx.letterSpacing = '2px';
      ctx.fillText(`FRAME #0${idx + 1}`, card.x + 28, card.y + card.h - 45);

      ctx.fillStyle = '#7a7f8e';
      ctx.font = '500 10px "Space Mono", monospace, sans-serif';
      ctx.fillText('POLAROID SX-70 INSTANT', card.x + 28, card.y + card.h - 25);
      ctx.restore();
    });

    // 4. Footer Note
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '500 11px "Space Mono", monospace, sans-serif';
    ctx.letterSpacing = '2px';
    const sub = state.subtitle || 'Four fragments captured in unison.';
    ctx.fillText(sub.toUpperCase(), 90, 1420);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(90, 1450);
    ctx.lineTo(cw - 90, 1450);
    ctx.stroke();

    ctx.fillText('FRAMERA STUDIO ARCHIVE', 90, 1485);
    ctx.textAlign = 'right';
    ctx.fillText('ALL RIGHTS RESERVED // 2026', cw - 90, 1485);
    ctx.restore();
  }
};
