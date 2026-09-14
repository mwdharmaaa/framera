import { calculateImageBounds } from '../../core/canvas/bounds.js';

/**
 * 35mm Analog Filmstrip Duo Template (2 Foto).
 * Renders twin 35mm negative frames with sprocket perforations, Kodak rebate markings, and analog grain.
 */
export const filmstripDuoTemplate = {
  id: 'filmstrip_duo',
  name: '35mm Filmstrip Duo',
  description: 'Twin 35mm negative frames with authentic sprocket holes, Kodak Portra 400 rebate, and analog frame counters',
  previewImage: 'assets/focus_reference.jpg',
  aspectRatio: '3:4',
  tag: 'ANALOG',
  photoCount: 2,
  config: {
    canvasWidth: 1200,
    canvasHeight: 1600,
    slots: [
      { x: 170, y: 130, w: 860, h: 620 },
      { x: 170, y: 830, w: 860, h: 620 }
    ]
  },
  render(ctx, img, bounds, state = {}) {
    const { canvasWidth: cw, canvasHeight: ch, slots } = this.config;

    // 1. Analog negative dark substrate
    ctx.fillStyle = '#0e0f13';
    ctx.fillRect(0, 0, cw, ch);

    // 2. Film border runner tracks
    ctx.fillStyle = '#16171d';
    ctx.fillRect(0, 0, 130, ch);
    ctx.fillRect(cw - 130, 0, 130, ch);

    // 3. Sprocket holes along left and right runners
    ctx.fillStyle = '#060608';
    ctx.strokeStyle = '#252732';
    ctx.lineWidth = 1.5;
    for (let y = 50; y < ch - 40; y += 95) {
      // Left sprocket
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(40, y, 50, 65, 8) : ctx.rect(40, y, 50, 65);
      ctx.fill();
      ctx.stroke();

      // Right sprocket
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(cw - 90, y, 50, 65, 8) : ctx.rect(cw - 90, y, 50, 65);
      ctx.fill();
      ctx.stroke();
    }

    // 4. Analog film rebate markings (Kodak Portra 400 aesthetic)
    ctx.save();
    ctx.fillStyle = '#e59a35';
    ctx.font = '700 13px "Space Mono", monospace, sans-serif';
    ctx.letterSpacing = '2px';

    ctx.save();
    ctx.translate(110, 440);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('KODAK PORTRA 400', 0, 0);
    ctx.restore();

    ctx.save();
    ctx.translate(110, 1140);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('SAFETY FILM • 24 EXP', 0, 0);
    ctx.restore();

    ctx.save();
    ctx.translate(cw - 105, 440);
    ctx.rotate(Math.PI / 2);
    ctx.fillText('FRAME 24A ►', 0, 0);
    ctx.restore();

    ctx.save();
    ctx.translate(cw - 105, 1140);
    ctx.rotate(Math.PI / 2);
    ctx.fillText('FRAME 25 ►', 0, 0);
    ctx.restore();
    ctx.restore();

    // 5. Render 2 Photo Slots
    const photos = state.photos || [];
    slots.forEach((slot, idx) => {
      const slotImg = photos[idx] || img;

      // Slot backing
      ctx.fillStyle = '#14151b';
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

      // Fine negative border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 2;
      ctx.strokeRect(slot.x, slot.y, slot.w, slot.h);

      // Frame badge
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '600 12px "Space Mono", monospace, sans-serif';
      ctx.fillText(`CUT 0${idx + 1}`, slot.x + 16, slot.y - 12);
    });

    // 6. Header & Footer metadata
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = '700 18px "Space Mono", monospace, sans-serif';
    ctx.letterSpacing = '3px';
    const headline = (state.caption && state.caption !== 'FOCUS') ? state.caption : 'DUO FILMSTRIP';
    ctx.fillText(headline.toUpperCase(), 170, 75);

    const dateStr = state.date || 'ISO 400 • 35MM REBATE';
    ctx.font = '500 13px "Space Mono", monospace, sans-serif';
    ctx.textAlign = 'right';
    ctx.letterSpacing = '1px';
    ctx.fillText(dateStr.toUpperCase(), cw - 170, 75);
    ctx.restore();
  }
};
