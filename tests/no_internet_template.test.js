import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { noInternetTemplate } from '../src/features/templates/no_internet_template.js';

describe('No Internet / Green Oasis Template', () => {
  it('should have valid metadata and 3:4 canvas configuration', () => {
    assert.strictEqual(noInternetTemplate.id, 'no_internet');
    assert.strictEqual(noInternetTemplate.config.canvasWidth, 1200);
    assert.strictEqual(noInternetTemplate.config.canvasHeight, 1600);
    assert.strictEqual(typeof noInternetTemplate.render, 'function');
  });

  it('should render safely with mock context without throwing', () => {
    const mockCtx = {
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      closePath: () => {},
      rect: () => {},
      clip: () => {},
      fill: () => {},
      stroke: () => {},
      fillRect: () => {},
      strokeRect: () => {},
      fillText: () => {},
      drawImage: () => {},
      createLinearGradient: () => ({ addColorStop: () => {} }),
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      font: '',
      textAlign: '',
      filter: ''
    };

    const mockState = {
      caption: 'Throw your phone away',
      subtitle: 'Find a quiet spot in nature',
      date: 'Take a deep breath and enjoy'
    };

    const bounds = { drawX: 70, drawY: 70, drawW: 1060, drawH: 1460 };

    assert.doesNotThrow(() => {
      noInternetTemplate.render(mockCtx, null, bounds, mockState);
    });
  });
});
