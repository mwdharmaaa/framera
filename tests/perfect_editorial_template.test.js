import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { perfectEditorialTemplate } from '../src/features/templates/perfect_editorial_template.js';
import {
  drawNegativePortrait,
  drawTornLetterP,
  drawEditorialTypography
} from '../src/features/templates/perfect_editorial_helpers.js';

describe('Perfect Editorial Template', () => {
  it('should have valid metadata and 3:4 canvas configuration', () => {
    assert.strictEqual(perfectEditorialTemplate.id, 'perfect_editorial');
    assert.strictEqual(perfectEditorialTemplate.config.canvasWidth, 1200);
    assert.strictEqual(perfectEditorialTemplate.config.canvasHeight, 1600);
    assert.strictEqual(typeof perfectEditorialTemplate.render, 'function');
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
      drawImage: () => {},
      bezierCurveTo: () => {},
      createRadialGradient: () => ({ addColorStop: () => {} }),
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      font: '',
      textAlign: '',
      textBaseline: '',
      letterSpacing: '',
      filter: '',
      globalCompositeOperation: '',
      shadowColor: '',
      shadowBlur: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0
    };

    const mockState = {
      caption: 'Perfect',
      subtitle: 'being perfect is an\nimpossibility among\nthe many mistakes that\nexist',
      date: '10 May 2026'
    };

    const bounds = { drawX: 0, drawY: 0, drawW: 1200, drawH: 1600 };

    assert.doesNotThrow(() => {
      perfectEditorialTemplate.render(mockCtx, null, bounds, mockState);
    });
  });

  it('should apply negative filter and render editorial helpers safely', () => {
    let appliedFilter = '';
    const mockCtx = {
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      closePath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      bezierCurveTo: () => {},
      fill: () => {},
      stroke: () => {},
      fillRect: () => {},
      fillText: () => {},
      drawImage: () => {},
      createRadialGradient: () => ({ addColorStop: () => {} }),
      set filter(val) { appliedFilter = val; },
      get filter() { return appliedFilter; },
      fillStyle: '',
      strokeStyle: '',
      globalCompositeOperation: '',
      font: '',
      textAlign: ''
    };

    const mockImg = { width: 800, height: 1000 };
    const bounds = { drawX: 0, drawY: 0, drawW: 1200, drawH: 1600 };

    assert.doesNotThrow(() => {
      drawNegativePortrait(mockCtx, mockImg, bounds);
      drawTornLetterP(mockCtx);
      drawEditorialTypography(mockCtx, {
        caption: 'Perfect',
        subtitle: 'being perfect is an impossibility',
        date: '10 May 2026',
        cw: 1200,
        ch: 1600
      });
    });

    assert.ok(appliedFilter.includes('invert'));
  });
});

