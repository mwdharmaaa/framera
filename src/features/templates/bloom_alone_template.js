import {
  drawHopeGangBadge,
  drawChunkyHeadline
} from './bloom_alone_helpers.js';

export const bloomAloneTemplate = {
  id: 'bloom_alone',
  name: 'Bloom Alone',
  description: 'Streetwear urban quote poster with casual hand-drawn typography and Hope Gang parental advisory badge',
  previewImage: 'assets/bloom_alone_reference.png',
  aspectRatio: '1:1',
  tag: 'STREETWEAR',
  tags: ['streetwear', 'bloom', 'minimal', 'urban', 'typography', 'single'],
  category: '1',
  photoCount: 1,
  config: {
    canvasWidth: 1080,
    canvasHeight: 1080,
    frame: { x: 0, y: 0, w: 1080, h: 1080 }
  },

  render(ctx, img, bounds, state = {}) {
    const { canvasWidth: cw, canvasHeight: ch, frame } = this.config;

    // 1. Dark minimalist canvas base
    ctx.fillStyle = '#121214';
    ctx.fillRect(0, 0, cw, ch);

    // 2. Base Real Photo with full-bleed cover
    if (img) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(frame.x, frame.y, frame.w, frame.h);
      ctx.clip();
      ctx.drawImage(img, bounds.drawX, bounds.drawY, bounds.drawW, bounds.drawH);
      ctx.restore();
    }

    // 3. Subtle ambient shading to guarantee text & badge readability
    ctx.save();
    // Top-right headline contrast gradient
    const trGrad = ctx.createRadialGradient(cw * 0.72, ch * 0.28, 50, cw * 0.72, ch * 0.28, 480);
    trGrad.addColorStop(0, 'rgba(0, 0, 0, 0.22)');
    trGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = trGrad;
    ctx.fillRect(cw * 0.35, 0, cw * 0.65, ch * 0.6);

    // Bottom-left badge contrast gradient
    const blGrad = ctx.createLinearGradient(60, ch, 360, ch - 220);
    blGrad.addColorStop(0, 'rgba(0, 0, 0, 0.3)');
    blGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = blGrad;
    ctx.fillRect(0, ch - 260, 420, 260);
    ctx.restore();

    // 4. Chunky Bubbly Streetwear Headline
    const headline = state.caption || 'ITS OKAY\nTO BLOOM\nALONE';
    drawChunkyHeadline(ctx, headline, 740, 175, 116);

    // 5. Hope Gang / Restricted Parental Advisory Badge
    drawHopeGangBadge(ctx, 88, 924);
  }
};
