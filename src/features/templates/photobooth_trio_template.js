import { calculateImageBounds } from '../../core/canvas/bounds.js';

/**
 * Retro Photobooth Trio Template (3 Foto).
 * Classic 3-cut vertical photo strip with rounded frame windows, timestamp header, and barcode stamp.
 */
export const photoboothTrioTemplate = {
  id: 'photobooth_trio',
  name: 'Photobooth Trio Strip',
  description: 'Classic 3-cut vertical photobooth strip with rounded photo frames, studio stamp, and timestamp metadata',
  previewImage: 'assets/focus_reference.jpg',
  aspectRatio: '3:4',
  tag: 'PHOTOBOOTH',
  photoCount: 3,
  config: {
    canvasWidth: 1200,
    canvasHeight: 1600,
    strip: { x: 260, y: 50, w: 680, h: 1500 },
    slots: [
      { x: 310, y: 170, w: 580, h: 380 },
      { x: 310, y: 580, w: 580, h: 380 },
      { x: 310, y: 990, w: 580, h: 380 }
    ]
  },
  render(ctx, img, bounds, state = {}) {
    const { canvasWidth: cw, canvasHeight: ch, strip, slots } = this.config;

    // 1. Dark Studio canvas backdrop
    ctx.fillStyle = '#0b0c0e';
    ctx.fillRect(0, 0, cw, ch);

    // 2. Photobooth physical strip card with shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
    ctx.shadowBlur = 36;
    ctx.shadowOffsetY = 16;
    ctx.fillStyle = '#f6f7fa';
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(strip.x, strip.y, strip.w, strip.h, 16) : ctx.rect(strip.x, strip.y, strip.w, strip.h);
    ctx.fill();
    ctx.restore();

    // Subtle inner border
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.lineWidth = 1;
    ctx.strokeRect(strip.x + 8, strip.y + 8, strip.w - 16, strip.h - 16);

    // 3. Header branding on paper strip
    ctx.save();
    ctx.fillStyle = '#181a20';
    ctx.font = '800 20px "Space Mono", monospace, sans-serif';
    ctx.letterSpacing = '5px';
    ctx.textAlign = 'center';
    const headline = (state.caption && state.caption !== 'FOCUS') ? state.caption : 'PHOTOBOOTH';
    ctx.fillText(headline.toUpperCase(), strip.x + strip.w / 2, strip.y + 60);

    ctx.font = '500 11px "Space Mono", monospace, sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillStyle = '#646875';
    const dateStr = state.date || '2026.09.14 // STUDIO CUT';
    ctx.fillText(dateStr.toUpperCase(), strip.x + strip.w / 2, strip.y + 88);
    ctx.restore();

    // 4. Render 3 Photo Cutouts
    const photos = state.photos || [];
    slots.forEach((slot, idx) => {
      const slotImg = photos[idx] || img;

      // Slot cutout background
      ctx.fillStyle = '#202229';
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(slot.x, slot.y, slot.w, slot.h, 10) : ctx.rect(slot.x, slot.y, slot.w, slot.h);
      ctx.fill();

      if (slotImg) {
        ctx.save();
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(slot.x, slot.y, slot.w, slot.h, 10) : ctx.rect(slot.x, slot.y, slot.w, slot.h);
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

      // Cutout rim border
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.18)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(slot.x, slot.y, slot.w, slot.h, 10) : ctx.rect(slot.x, slot.y, slot.w, slot.h);
      ctx.stroke();
    });

    // 5. Footer studio stamp and decorative barcode
    ctx.save();
    const footY = strip.y + strip.h - 90;
    ctx.fillStyle = '#22252e';
    ctx.font = '700 12px "Space Mono", monospace, sans-serif';
    ctx.letterSpacing = '3px';
    ctx.textAlign = 'center';
    ctx.fillText('FRAMERA AUTOMATIC MEMORY', strip.x + strip.w / 2, footY);

    // Mini barcode lines
    ctx.fillStyle = '#1c1e24';
    const barX = strip.x + strip.w / 2 - 80;
    const barY = footY + 16;
    for (let i = 0; i < 32; i++) {
      const bw = (i % 3 === 0) ? 4 : (i % 2 === 0) ? 2 : 3;
      ctx.fillRect(barX + i * 5, barY, bw, 24);
    }
    ctx.restore();
  }
};
