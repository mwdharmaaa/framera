/**
 * Helper drawing routines for Perfect Editorial Poster Template.
 */

export function drawEditorialPortrait(ctx, img, bounds, cw, ch) {
  if (!img) return;

  // 1. High-Key Editorial Portrait Layer
  ctx.save();
  ctx.filter = 'contrast(118%) brightness(102%) saturate(108%)';
  ctx.drawImage(img, bounds.drawX, bounds.drawY, bounds.drawW, bounds.drawH);
  ctx.restore();

  // 2. Electric Cyan / Blue Editorial Ambient Tint on Hair & Upper Frame
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const cyanGlow = ctx.createRadialGradient(cw * 0.45, ch * 0.28, 50, cw * 0.45, ch * 0.28, 620);
  cyanGlow.addColorStop(0, 'rgba(0, 220, 255, 0.42)');
  cyanGlow.addColorStop(0.5, 'rgba(14, 165, 233, 0.20)');
  cyanGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = cyanGlow;
  ctx.fillRect(0, 0, cw, ch * 0.75);
  ctx.restore();
}

export function drawTornLetterP(ctx) {
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 8;
  ctx.fillStyle = '#f8f8f6';
  ctx.strokeStyle = '#f8f8f6';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Outer loop of the P (arching across forehead to mid-face)
  ctx.beginPath();
  ctx.lineWidth = 32;
  ctx.moveTo(0, 520);
  ctx.bezierCurveTo(120, 500, 200, 340, 360, 320);
  ctx.bezierCurveTo(460, 305, 580, 335, 630, 420);
  ctx.bezierCurveTo(660, 480, 620, 550, 520, 570);
  ctx.bezierCurveTo(440, 585, 360, 560, 330, 540);
  ctx.stroke();

  // Main vertical stem with torn organic contour
  ctx.beginPath();
  ctx.moveTo(335, 390);
  ctx.bezierCurveTo(325, 480, 310, 560, 280, 650);
  ctx.bezierCurveTo(260, 710, 220, 745, 120, 755);
  ctx.lineTo(80, 750);
  ctx.bezierCurveTo(140, 730, 200, 710, 230, 650);
  ctx.bezierCurveTo(265, 570, 285, 490, 295, 410);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

export function drawEditorialTypography(ctx, { caption, subtitle, date, cw, ch }) {
  // Top Header Attribution
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.font = '600 24px "Poppins", "Space Mono", sans-serif';
  ctx.letterSpacing = '4px';
  ctx.textAlign = 'center';
  ctx.fillText('DESIGN BY ALESHALILIANAA', cw / 2, 100);
  ctx.restore();

  // Cursive script following the P
  const fullText = (caption || 'Perfect').trim();
  const scriptPart = fullText.toLowerCase() === 'perfect' ? 'erfect' : (fullText.length > 1 ? fullText.slice(1) : '');

  if (scriptPart) {
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 6;
    ctx.font = 'italic 700 136px "Playfair Display", "Brush Script MT", "Caveat", "Segoe Script", cursive, serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(scriptPart, 220, 725);
    ctx.restore();
  }

  // Multi-line Imperfection Philosophy Quote
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.font = '500 28px "Poppins", -apple-system, sans-serif';
  ctx.letterSpacing = '0.5px';
  ctx.textAlign = 'left';

  const defaultQuote = 'being perfect is an\nimpossibility among\nthe many mistakes that\nexist';
  const quoteLines = (subtitle || defaultQuote).split('\n');
  const quoteStartY = 1260;
  quoteLines.forEach((line, idx) => {
    ctx.fillText(line, 110, quoteStartY + idx * 42);
  });
  ctx.restore();

  // Bottom Date Stamp
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.font = '500 26px "Poppins", "Space Mono", sans-serif';
  ctx.letterSpacing = '1px';
  ctx.textAlign = 'left';
  ctx.fillText(date || '10 May 2026', 110, 1490);
  ctx.restore();
}
