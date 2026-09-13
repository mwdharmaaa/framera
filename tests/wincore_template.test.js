import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { wincoreTemplate } from '../src/features/templates/wincore_template.js';

describe('Wincore Retro Y2K Template', () => {
  it('should have valid metadata and 3:4 canvas configuration', () => {
    assert.strictEqual(wincoreTemplate.id, 'wincore');
    assert.strictEqual(wincoreTemplate.config.canvasWidth, 1200);
    assert.strictEqual(wincoreTemplate.config.canvasHeight, 1600);
    assert.strictEqual(typeof wincoreTemplate.render, 'function');
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
      createLinearGradient: () => ({ addColorStop: () => {} }),
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      font: '',
      textAlign: '',
      textBaseline: '',
      shadowColor: '',
      shadowBlur: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0
    };

    const mockState = {
      caption: 'Warning',
      subtitle: 'Your existence will now be erased.',
      date: "Finally I'll be free"
    };

    const bounds = { drawX: 0, drawY: 0, drawW: 1200, drawH: 1600 };

    assert.doesNotThrow(() => {
      wincoreTemplate.render(mockCtx, null, bounds, mockState);
    });
  });
});
