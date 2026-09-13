/**
 * High-Fashion Perfect Editorial Poster Template.
 * Features electric cyan lighting accent, cutout letter P motif,
 * cursive editorial typography, and philosophical imperfection quotes.
 */

export const perfectEditorialTemplate = {
  id: 'perfect_editorial',
  name: 'Perfect Editorial',
  description: 'High-fashion editorial collage with cyan tint, torn paper cutout P, cursive typography, and archival quotes',
  previewImage: 'assets/perfect_editorial_reference.jpg',
  aspectRatio: '3:4',
  tag: 'EDITORIAL',
  config: {
    canvasWidth: 1200,
    canvasHeight: 1600,
    frame: { x: 0, y: 0, w: 1200, h: 1600 }
  },
  render(ctx, img, bounds, state) {
    const { canvasWidth: cw, canvasHeight: ch } = this.config;

    // 1. Editorial dark studio backdrop
    ctx.fillStyle = '#111215';
    ctx.fillRect(0, 0, cw, ch);

    // 2. Base portrait layer with fashion grain & contrast
    if (img) {
      ctx.save();
      ctx.filter = 'contrast(115%) brightness(98%) saturate(108%)';
      ctx.drawImage(img, bounds.drawX, bounds.drawY, bounds.drawW, bounds.drawH);
      ctx.restore();

      // Electric Cyan / Neon Blue Ambient Tint on upper area
      ctx.save();
      const cyanGlow = ctx.createRadialGradient(cw * 0.4, ch * 0.25, 40, cw * 0.4, ch * 0.25, 480);
      cyanGlow.addColorStop(0, 'rgba(0, 240, 255, 0.45)');
      cyanGlow.addColorStop(0.5, 'rgba(0, 180, 255, 0.2)');
      cyanGlow.addColorStop(1, 'rgba(0, 180, 255, 0)');
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = cyanGlow;
      ctx.fillRect(0, 0, cw, ch * 0.7);
      ctx.restore();
    }

    // 3. Cutout paper card for giant letter P
    const cardX = 90;
    const cardY = 160;
    const cardW = 280;
    const cardH = 360;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetX = -6;
    ctx.shadowOffsetY = 12;

    // Paper card background
    ctx.fillStyle = '#f6f5f0';
    ctx.fillRect(cardX, cardY, cardW, cardH);

    // Subtle paper edge border
    ctx.strokeStyle = '#d9d7ce';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(cardX, cardY, cardW, cardH);
    ctx.restore();

    // Giant serif P inside card
    ctx.save();
    ctx.fillStyle = '#121214';
    ctx.font = '900 240px "Playfair Display", "Didot", "Times New Roman", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('P', cardX + cardW / 2, cardY + cardH / 2 + 10);
    ctx.restore();

    // 4. Overlapping cursive "erfect"
    const title = state.caption || 'erfect';
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 4;
    ctx.font = 'italic 400 136px "Playfair Display", "Caveat", "Brush Script MT", cursive';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(title, cardX + cardW - 30, cardY + cardH / 2 + 30);
    ctx.restore();

    // 5. Header Archival Stamp
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 15px "Space Mono", monospace, sans-serif';
    ctx.letterSpacing = '5px';
    ctx.textAlign = 'left';
    ctx.fillText(state.date || 'ISSUE // NO. 024 - FALL 2026', 90, 100);

    ctx.textAlign = 'right';
    ctx.fillText('PARIS / MILAN / TOKYO', cw - 90, 100);

    // 6. Philosophical Imperfection Quote Block
    const quoteY = ch - 220;
    ctx.fillStyle = '#ffffff';
    ctx.font = '600 18px "Poppins", "Inter", sans-serif';
    ctx.letterSpacing = '2px';
    ctx.textAlign = 'left';

    const sub = state.subtitle || 'THERE IS A CRACK IN EVERYTHING, THAT IS HOW THE LIGHT GETS IN.';
    ctx.fillText(sub, 90, quoteY);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '400 14px "Space Mono", monospace, sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText('BEAUTY IN THE IRREGULAR, RAW, AND UNTOUCHED HUMAN FORM', 90, quoteY + 36);

    // Mini bottom border bar
    ctx.fillStyle = '#00f0ff';
    ctx.fillRect(90, quoteY + 68, 140, 3);
  }
};
