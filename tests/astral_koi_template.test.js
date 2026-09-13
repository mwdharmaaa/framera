import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { astralKoiTemplate } from '../src/features/templates/astral_koi_template.js';

describe('Astral Koi Template', () => {
  it('should have valid metadata and 3:4 canvas configuration', () => {
    assert.strictEqual(astralKoiTemplate.id, 'astral_koi');
    assert.strictEqual(astralKoiTemplate.config.canvasWidth, 1200);
    assert.strictEqual(astralKoiTemplate.config.canvasHeight, 1600);
    assert.strictEqual(typeof astralKoiTemplate.render, 'function');
  });

  it('should render safely with mock context without throwing', () => {
    const mockCtx = {
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      closePath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      bezierCurveTo: () => {},
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
      scale: () => {},
      createRadialGradient: () => ({ addColorStop: () => {} }),
      createLinearGradient: () => ({ addColorStop: () => {} }),
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      font: '',
      textAlign: '',
      textBaseline: '',
      letterSpacing: '',
      shadowColor: '',
      shadowBlur: 0
    };

    const mockState = {
      caption: 'ASTRAL REVERIE',
      subtitle: 'Deep within the quiet waters of consciousness.',
      date: 'VOL. 03'
    };

    const bounds = { drawX: 70, drawY: 520, drawW: 1060, drawH: 480 };

    assert.doesNotThrow(() => {
      astralKoiTemplate.render(mockCtx, null, bounds, mockState);
    });
  });
});
