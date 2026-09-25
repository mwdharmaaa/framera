import {
  drawHorizontalMotionSmear,
  applyCyanDuotoneGrading,
  drawCyanMotionTypography
} from './cyan_motion_helpers.js';

/**
 * Cyan Motion Smear Editorial Template.
 * Features an out-of-focus directional horizontal motion blur trail dragging across the face,
 * high-contrast monochrome base, and electric cobalt-cyan duotone color grading.
 */
export const cyanMotionTemplate = {
  id: 'cyan_motion',
  name: 'Cyan Motion Smear',
  description: 'Cinematic editorial portrait with horizontal directional motion blur trails and electric cyan duotone grading',
  previewImage: 'assets/cyan_motion_reference.jpg',
  aspectRatio: '3:4',
  tag: 'NOIR CYAN',
  tags: ['cyan', 'motion', 'noir', 'cinematic', 'blur', 'minimal'],
  photoCount: 1,
  category: '1',
  config: {
    canvasWidth: 1200,
    canvasHeight: 1600,
    frame: { x: 0, y: 0, w: 1200, h: 1600 }
  },
  render(ctx, img, bounds, state = {}) {
    const { canvasWidth: cw, canvasHeight: ch } = this.config;

    // 1. Base deep navy-black backdrop
    ctx.fillStyle = '#000814';
    ctx.fillRect(0, 0, cw, ch);

    // 2. High-contrast monochrome portrait base
    if (img) {
      ctx.save();
      if (ctx.filter !== undefined) {
        ctx.filter = 'grayscale(100%) contrast(155%) brightness(92%)';
      }
      ctx.drawImage(img, bounds.drawX, bounds.drawY, bounds.drawW, bounds.drawH);
      if (ctx.filter !== undefined) ctx.filter = 'none';
      ctx.restore();

      // 3. Directional horizontal motion smear streaks
      drawHorizontalMotionSmear(ctx, img, bounds);

      // 4. Electric cobalt and cyan duotone grading pass
      applyCyanDuotoneGrading(ctx, cw, ch);
    }

    // 5. Aesthetic editorial typography overlay
    drawCyanMotionTypography(ctx, cw, ch, state);
  }
};
