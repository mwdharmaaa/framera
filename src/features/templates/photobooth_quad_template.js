import { calculateImageBounds } from '../../core/canvas/bounds.js';

/**
 * Korean Photobooth Quad Strip Template (4 Foto).
 * Iconic 4-cut vertical strip with pastel paper framing, rounded photo windows, and studio logo footer.
 */
export const photoboothQuadTemplate = {
  id: 'photobooth_quad',
  name: 'K-Photobooth 4-Cut',
  description: 'Iconic Korean 4-cut vertical strip with clean photo windows, studio timestamp, and pastel border',
  previewImage: 'assets/focus_reference.jpg',
  aspectRatio: '3:4',
  tag: 'PHOTOBOOTH',
  photoCount: 4,
  config: {
    canvasWidth: 1200,
    canvasHeight: 1600,
    strip: { x: 270, y: 40, w: 660, h: 1520 },
    slots: [
      { x: 310, y: 130, w: 580, h: 300 },
      { x: 310, y: 450, w: 580, h: 300 },
      { x: 310, y: 770, w: 580, h: 300 },
      { x: 310, y: 1090, w: 580, h: 300 }
    ]
  },
  render(ctx, img, bounds, state = {}) {
    const { canvasWidth: cw, canvasHeight: ch, strip, slots } = this.config;

    // 1. Warm charcoal studio background
    ctx.fillStyle = '#0a0a0d';
    ctx.fillRect(0, 0, cw, ch);

    // 2. Physical photo strip card with drop shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 32;
    ctx.shadowOffsetY = 16;
    ctx.fillStyle = '#1c1e26';
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(strip.x, strip.y, strip.w, strip.h, 14) : ctx.rect(strip.x, strip.y, strip.w, strip.h);
    ctx.fill();
    ctx.restore();

    // Subtle inner border line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(strip.x + 8, strip.y + 8, strip.w - 16, strip.h - 16);

    // 3. Top Strip Header
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 18px "Space Mono", monospace, sans-serif';
    ctx.letterSpacing = '6px';
    ctx.textAlign = 'center';
    const headline = (state.caption && state.caption !== 'FOCUS') ? state.caption : 'FOUR CUTS';
    ctx.fillText(headline.toUpperCase(), strip.x + strip.w / 2, strip.y + 55);

    ctx.font = '500 11px "Space Mono", monospace, sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    const dateStr = state.date || '2026.09.14 // HARU FILM';
    ctx.fillText(dateStr.toUpperCase(), strip.x + strip.w / 2, strip.y + 80);
    ctx.restore();

    // 4. Render 4 Photo Cutout Slots
    const photos = state.photos || [];
    slots.forEach((slot, idx) => {
      const slotImg = photos[idx] || img;

      // Cutout base
      ctx.fillStyle = '#101116';
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(slot.x, slot.y, slot.w, slot.h, 8) : ctx.rect(slot.x, slot.y, slot.w, slot.h);
      ctx.fill();

      if (slotImg) {
        ctx.save();
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(slot.x, slot.y, slot.w, slot.h, 8) : ctx.rect(slot.x, slot.y, slot.w, slot.h);
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

      // Slot inner outline
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(slot.x, slot.y, slot.w, slot.h, 8) : ctx.rect(slot.x, slot.y, slot.w, slot.h);
      ctx.stroke();

      // Number badge
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '700 11px "Space Mono", monospace, sans-serif';
      ctx.fillText(`0${idx + 1}`, slot.x + slot.w - 28, slot.y + 24);
      ctx.restore();
    });

    // 5. Strip Footer Studio Signature
    ctx.save();
    const footY = strip.y + strip.h - 75;
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 14px "Space Mono", monospace, sans-serif';
    ctx.letterSpacing = '4px';
    ctx.textAlign = 'center';
    ctx.fillText('FRAMERA STUDIO', strip.x + strip.w / 2, footY);

    ctx.font = '400 10px "Space Mono", monospace, sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.fillText('LIFE MOMENTS CAPTURED IN 4 CUTS', strip.x + strip.w / 2, footY + 24);
    ctx.restore();
  }
};
