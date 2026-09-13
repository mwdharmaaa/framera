import {
  drawDoodleStar,
  drawDoodleQuestionExclamation,
  drawDoodleHeart,
  drawActionSwoosh
} from '../../core/canvas/doodle_renderer.js';
import { drawAlterEgoShadow } from '../../core/canvas/shadow_character.js';
import { analyzeSubject } from '../../core/canvas/subject_analyzer.js';
import { renderPlaceholder } from '../../core/canvas/renderer.js';

/**
 * Alter-Ego Doodle Shadow Studio Template.
 * Dynamically analyzes uploaded character shape to project an adaptive alter-ego shadow.
 */
export const doodleShadowTemplate = {
  id: 'doodle_shadow',
  name: 'Alter-Ego Doodle Shadow',
  description: 'Analyzes character shape to cast a playful charcoal sketch shadow with anime expression',
  config: {
    canvasWidth: 1200,
    canvasHeight: 1600,
    frame: { x: 0, y: 0, w: 1200, h: 1600 }
  },

  /**
   * Main render method for Doodle Shadow template.
   * @param {CanvasRenderingContext2D} ctx
   * @param {HTMLImageElement|null} photoImg
   * @param {{ drawX: number, drawY: number, drawW: number, drawH: number }} bounds
   * @param {object} state
   */
  render(ctx, photoImg, bounds, state) {
    const { canvasWidth, canvasHeight } = this.config;

    // 1. Warm neutral wall backdrop
    ctx.fillStyle = '#e8e5dc';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // 2. Base Photo Layer
    if (photoImg) {
      ctx.save();
      ctx.filter = 'contrast(104%) brightness(101%) saturate(103%)';
      ctx.drawImage(photoImg, bounds.drawX, bounds.drawY, bounds.drawW, bounds.drawH);
      ctx.restore();
    } else {
      renderPlaceholder(ctx, { x: 80, y: 80, w: canvasWidth - 160, h: canvasHeight - 160 });
    }

    // 3. Analyze Subject Silhouette & Adaptive Shadow Placement
    const analysis = analyzeSubject(photoImg, bounds, canvasWidth, canvasHeight);
    const { shadowPlacement, headPoint } = analysis;

    // Draw Alter-Ego Shadow dynamically adapted to detected subject proportions
    drawAlterEgoShadow(
      ctx,
      shadowPlacement.ox,
      shadowPlacement.oy,
      shadowPlacement.scaleX,
      shadowPlacement.scaleY,
      shadowPlacement.flipX
    );

    // 4. Playful Manga Floating Doodles (positioned relative to analyzed subject)
    // Question & exclamation mark directly above detected character head
    drawDoodleQuestionExclamation(ctx, headPoint.x, headPoint.y - 30, 1.1);

    // Floating sketch stars adapted to shadow position
    const sox = shadowPlacement.ox;
    const soy = shadowPlacement.oy;
    const sFlip = shadowPlacement.flipX ? -1 : 1;

    drawDoodleStar(ctx, sox - 220 * sFlip, soy - 1000, 20, false);
    drawDoodleStar(ctx, sox - 70 * sFlip, soy - 1140, 26, false);
    drawDoodleStar(ctx, sox + 160 * sFlip, soy - 920, 18, false);
    drawDoodleStar(ctx, sox + 130 * sFlip, soy - 680, 16, false);
    drawDoodleStar(ctx, sox + 130 * sFlip, soy - 160, 22, true);

    // Doodle heart near raised hand
    drawDoodleHeart(ctx, sox + 240 * sFlip, soy - 930, 18);

    // Dynamic foot action swoosh marks
    drawActionSwoosh(ctx, sox + 280 * sFlip, soy - 440, 45, 0.2 * Math.PI, 0.8 * Math.PI);
    drawActionSwoosh(ctx, sox + 240 * sFlip, soy - 400, 38, 0.1 * Math.PI, 0.7 * Math.PI);

    // Movement tick marks near hand and foot
    ctx.save();
    ctx.strokeStyle = '#1c1d22';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    [[sox + 20 * sFlip, soy - 1180], [sox + 35 * sFlip, soy - 1160], [sox + 50 * sFlip, soy - 1140]].forEach(([mx, my]) => {
      ctx.beginPath();
      ctx.moveTo(mx, my);
      ctx.lineTo(mx + 4, my + 18);
      ctx.stroke();
    });
    ctx.restore();

    // 5. Minimalist Editorial Metadata / Signature Tag
    if (state.caption) {
      ctx.save();
      ctx.fillStyle = '#14151a';
      ctx.font = '700 24px "Space Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(state.caption.toUpperCase(), 60, canvasHeight - 80);

      if (state.date) {
        ctx.font = '500 16px "Space Mono", monospace';
        ctx.fillStyle = 'rgba(20, 21, 26, 0.65)';
        ctx.fillText(state.date, 60, canvasHeight - 52);
      }
      ctx.restore();
    }
  }
};
