import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { perfectEditorialTemplate } from '../src/features/templates/perfect_editorial_template.js';

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
      arc: () => {},
      translate: () => {},
      rotate: () => {},
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
      caption: 'erfect',
      subtitle: 'There is a crack in everything',
      date: 'OCT 24 / 2026'
    };

    const bounds = { drawX: 0, drawY: 0, drawW: 1200, drawH: 1600 };

    assert.doesNotThrow(() => {
      perfectEditorialTemplate.render(mockCtx, null, bounds, mockState);
    });
  });
});
