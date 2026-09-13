import {
  drawDoodleStar,
  drawDoodleQuestionExclamation,
  drawDoodleHeart,
  drawActionSwoosh
} from '../../core/canvas/doodle_renderer.js';
import { drawAlterEgoShadow } from '../../core/canvas/shadow_character.js';
import { renderPlaceholder, wrapCanvasText } from '../../core/canvas/renderer.js';

/**
 * Alter-Ego Doodle Shadow Studio Template.
 * Places a lively hand-drawn charcoal alter-ego shadow and playful manga doodles.
 */
export const doodleShadowTemplate = {
  id: 'doodle_shadow',
  name: 'Alter-Ego Doodle Shadow',
  description: 'Hand-drawn charcoal sketch shadow with playful manga face and floating doodles',
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

    // 3. Hand-Drawn Charcoal Alter-Ego Shadow Character
    drawAlterEgoShadow(ctx, 800, 1420, 1.05);

    // 4. Playful Manga Floating Doodles
    // Question & exclamation mark near subject's head
    drawDoodleQuestionExclamation(ctx, 280, 220, 1.1);

    // Floating sketch stars
    drawDoodleStar(ctx, 480, 390, 20, false);
    drawDoodleStar(ctx, 720, 240, 26, false);
    drawDoodleStar(ctx, 960, 470, 18, false);
    drawDoodleStar(ctx, 920, 710, 16, false);
    drawDoodleStar(ctx, 920, 1260, 22, true);

    // Doodle heart & spiral accents
    drawDoodleHeart(ctx, 1070, 480, 18);

    // Dynamic foot action swoosh marks
    drawActionSwoosh(ctx, 1080, 960, 45, 0.2 * Math.PI, 0.8 * Math.PI);
    drawActionSwoosh(ctx, 1040, 1000, 38, 0.1 * Math.PI, 0.7 * Math.PI);

    // Movement tick marks near hand and foot
    ctx.save();
    ctx.strokeStyle = '#1c1d22';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    [[820, 210], [835, 230], [850, 250]].forEach(([mx, my]) => {
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
