import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { finalGirlTemplate } from '../src/features/templates/final_girl_template.js';
import {
  getFinalGirlOverlayImage,
  resetFinalGirlOverlayImage,
  drawHandDrawnHeart,
  renderDuotoneRisographHalftone,
  drawCustomQuote
} from '../src/features/templates/final_girl_helpers.js';
import { getTemplate } from '../src/features/templates/template_registry.js';

describe('Final Girl Studios Template', () => {
  it('should have valid metadata and 3:4 canvas configuration', () => {
    assert.strictEqual(finalGirlTemplate.id, 'final_girl');
    assert.strictEqual(finalGirlTemplate.name, 'Final Girl Studios');
    assert.strictEqual(finalGirlTemplate.aspectRatio, '3:4');
    assert.strictEqual(finalGirlTemplate.photoCount, 1);
    assert.strictEqual(finalGirlTemplate.config.canvasWidth, 1200);
    assert.strictEqual(finalGirlTemplate.config.canvasHeight, 1600);
    assert.deepStrictEqual(finalGirlTemplate.config.frame, { x: 298, y: 176, w: 603, h: 459 });
    assert.deepStrictEqual(finalGirlTemplate.config.bottomFrame, { x: 0, y: 765, w: 1200, h: 835 });
    assert.deepStrictEqual(finalGirlTemplate.config.cardRect, { x: 300, y: 878, w: 598, h: 454 });
    assert.strictEqual(typeof finalGirlTemplate.render, 'function');
  });

  it('should be registered in the global template registry', () => {
    const tpl = getTemplate('final_girl');
    assert.ok(tpl, 'Template should exist in registry');
    assert.strictEqual(tpl.id, 'final_girl');
  });

  it('should render safely with mock context without throwing', () => {
    const mockCtx = {
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      closePath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      rect: () => {},
      clip: () => {},
      fill: () => {},
      stroke: () => {},
      fillRect: () => {},
      strokeRect: () => {},
      fillText: () => {},
      strokeText: () => {},
      drawImage: () => {},
      translate: () => {},
      rotate: () => {},
      scale: () => {},
      bezierCurveTo: () => {},
      arc: () => {},
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      lineCap: 'round',
      lineJoin: 'round',
      font: '',
      textAlign: '',
      textBaseline: '',
      globalAlpha: 1
    };

    const mockBounds = { drawX: 0, drawY: 0, drawW: 1200, drawH: 1600 };
    const mockImg = {};

    assert.doesNotThrow(() => {
      finalGirlTemplate.render(mockCtx, mockImg, mockBounds, {
        caption: 'custom caption',
        subtitle: 'custom subtitle'
      });
    });

    assert.doesNotThrow(() => {
      finalGirlTemplate.render(mockCtx, null, mockBounds, {});
    });
  });

  it('should execute helper routines safely without throwing', () => {
    const mockCtx = {
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      closePath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      rect: () => {},
      clip: () => {},
      fill: () => {},
      stroke: () => {},
      fillRect: () => {},
      fillText: () => {},
      drawImage: () => {},
      translate: () => {},
      rotate: () => {},
      bezierCurveTo: () => {},
      arc: () => {},
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      lineCap: 'round',
      lineJoin: 'round',
      font: '',
      textAlign: ''
    };

    assert.doesNotThrow(() => drawHandDrawnHeart(mockCtx, 500, 200, 25, 0.1));
    assert.doesNotThrow(() => renderDuotoneRisographHalftone(mockCtx, {}, { drawX: 0, drawY: 0, drawW: 100, drawH: 100 }, { x: 0, y: 0, w: 100, h: 100 }));
    assert.doesNotThrow(() => drawCustomQuote(mockCtx, { x: 100, y: 100, w: 400, h: 300 }, {
      caption: 'modified headline',
      subtitle: 'modified script'
    }));

    // Test overlay cache and reset
    resetFinalGirlOverlayImage();
    const overlay = getFinalGirlOverlayImage();
    assert.strictEqual(overlay, null);
  });
});
