/**
 * 3D Typography and Editorial Phrase Overlays for Life Memories Quad Slits.
 * Handles dimensional letter block rendering and distributed column phrases.
 */

export function render3DLetter(ctx, char, cx, cy) {
  if (!ctx || !char) return;
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '800 82px "Poppins", sans-serif';

  // 1. Soft deep ambient drop shadow
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 6;
  ctx.fillStyle = '#485563';
  ctx.fillText(char, cx, cy + 3);
  ctx.restore();

  // 2. Extrusion depth layers (bevel sides)
  const depthColors = ['#5a6775', '#718096', '#8795a8', '#a0aec0'];
  depthColors.forEach((color, idx) => {
    ctx.fillStyle = color;
    ctx.fillText(char, cx + (idx * 0.8), cy + (idx * 1.0));
  });

  // 3. Top face
  ctx.fillStyle = '#e2e8f0';
  ctx.fillText(char, cx, cy);

  // 4. Subtle top specular highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.fillText(char, cx - 1, cy - 1);

  ctx.restore();
}

export function renderColumnSubtitle(ctx, text, cx, cy) {
  if (!ctx || !text) return;
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '600 16px "Poppins", sans-serif';
  ctx.fillStyle = '#172435';
  ctx.fillText(text, cx, cy);
  ctx.restore();
}

export function renderQuadTypography(ctx, slots, state = {}) {
  if (!ctx || !Array.isArray(slots)) return;

  // Resolve 4 letters for top header
  const rawCaption = (state?.caption || 'LIFE').trim().toUpperCase();
  const letters = rawCaption.length >= 4
    ? [rawCaption[0], rawCaption[1], rawCaption[2], rawCaption[3]]
    : ['L', 'I', 'F', 'E'];

  // Resolve 4 sub-phrases distributed across all 4 columns
  const rawSubtitle = (state?.subtitle || 'Is A Collection Of Memories!').trim();
  let phrases = ['Is A', 'Collection', 'Of', 'Memories!'];

  if (rawSubtitle && rawSubtitle !== 'Is A Collection Of Memories!') {
    const words = rawSubtitle.split(/\s+/).filter(Boolean);
    if (words.length <= 4) {
      phrases = [words[0] || '', words[1] || '', words[2] || '', words[3] || ''];
    } else {
      phrases = ['', '', '', ''];
      words.forEach((w, i) => {
        const bucket = Math.min(3, Math.floor((i * 4) / words.length));
        phrases[bucket] = phrases[bucket] ? `${phrases[bucket]} ${w}` : w;
      });
    }
  }

  slots.forEach((slot, idx) => {
    const cx = slot.x + slot.w / 2;
    render3DLetter(ctx, letters[idx] || '', cx, slot.y + 90);
    renderColumnSubtitle(ctx, phrases[idx] || '', cx, slot.y + 165);
  });
}
