import { calculateImageBounds } from '../../core/canvas/bounds.js';

/**
 * Cinematic Storyboard Triptych Template (3 Foto).
 * Three 16:9 widescreen letterbox cinema cuts with scene timecodes, subtitle bars, and audio waveform telemetry.
 */
export const cinemaTriptychTemplate = {
  id: 'cinema_triptych',
  name: 'Cinema Storyboard Triptych',
  description: 'Three 16:9 widescreen cinema cuts with scene timecodes, subtitle bars, and director notes',
  previewImage: 'assets/focus_reference.jpg',
  aspectRatio: '3:4',
  tag: 'CINEMA',
  photoCount: 3,
  config: {
    canvasWidth: 1200,
    canvasHeight: 1600,
    slots: [
      { x: 100, y: 160, w: 1000, h: 420 },
      { x: 100, y: 620, w: 1000, h: 420 },
      { x: 100, y: 1080, w: 1000, h: 420 }
    ]
  },
  render(ctx, img, bounds, state = {}) {
    const { canvasWidth: cw, canvasHeight: ch, slots } = this.config;

    // 1. Dark cinema stage backdrop
    ctx.fillStyle = '#0a0a0c';
    ctx.fillRect(0, 0, cw, ch);

    // 2. Cinematic Header
    ctx.save();
    ctx.fillStyle = '#e50914';
    ctx.beginPath();
    ctx.arc ? ctx.arc(110, 80, 6, 0, Math.PI * 2) : ctx.rect(104, 74, 12, 12);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 18px "Space Mono", monospace, sans-serif';
    ctx.letterSpacing = '4px';
    const headline = (state.caption && state.caption !== 'FOCUS') ? state.caption : 'STORYBOARD';
    ctx.fillText(headline.toUpperCase(), 130, 86);

    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '500 13px "Space Mono", monospace, sans-serif';
    ctx.letterSpacing = '2px';
    const dateStr = state.date || 'SCENE 01 - 03 // 24FPS';
    ctx.fillText(dateStr.toUpperCase(), cw - 100, 86);
    ctx.restore();

    // 3. Render 3 Widescreen Cinema Cuts
    const photos = state.photos || [];
    const timecodes = ['00:14:22:18', '00:28:45:04', '00:43:10:12'];

    slots.forEach((slot, idx) => {
      const slotImg = photos[idx] || img;

      // Letterbox frame background
      ctx.fillStyle = '#111216';
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

        // Letterbox dark gradient overlay at top/bottom of slot
        const slotGrad = ctx.createLinearGradient ? ctx.createLinearGradient(slot.x, slot.y, slot.x, slot.y + slot.h) : null;
        if (slotGrad) {
          slotGrad.addColorStop(0, 'rgba(0, 0, 0, 0.4)');
          slotGrad.addColorStop(0.15, 'transparent');
          slotGrad.addColorStop(0.85, 'transparent');
          slotGrad.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
          ctx.fillStyle = slotGrad;
          ctx.fillRect(slot.x, slot.y, slot.w, slot.h);
        }
        ctx.restore();
      }

      // Border and corner ticks
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(slot.x, slot.y, slot.w, slot.h);

      // Timecode telemetry on top-left of each slot
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.font = '600 12px "Space Mono", monospace, sans-serif';
      ctx.fillText(`TAKE 0${idx + 1}  •  ${timecodes[idx]}`, slot.x + 16, slot.y + 24);

      // Subtitle line at bottom of each slot
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = '500 13px "Space Mono", monospace, sans-serif';
      ctx.textAlign = 'center';
      const sub = state.subtitle || 'Every quiet moment unfolds a cinematic universe.';
      ctx.fillText(sub, slot.x + slot.w / 2, slot.y + slot.h - 16);
      ctx.restore();
    });

    // 4. Cinema footer
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '500 11px "Space Mono", monospace, sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText('ANAMORPHIC WIDESCREEN 2.39:1 // 4K MASTER', 100, ch - 40);
    ctx.textAlign = 'right';
    ctx.fillText('DIRECTOR CUT // FRAMERA', cw - 100, ch - 40);
    ctx.restore();
  }
};
