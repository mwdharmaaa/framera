import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { viewfinderTemplate } from '../src/features/templates/viewfinder_template.js';

describe('Phone Viewfinder Template', () => {
  it('should have valid metadata and 3:4 canvas configuration', () => {
    assert.strictEqual(viewfinderTemplate.id, 'viewfinder');
    assert.strictEqual(viewfinderTemplate.config.canvasWidth, 1200);
    assert.strictEqual(viewfinderTemplate.config.canvasHeight, 1600);
    assert.strictEqual(typeof viewfinderTemplate.render, 'function');
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
      roundRect: () => {},
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
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      font: '',
      textAlign: '',
      textBaseline: '',
      letterSpacing: '',
      filter: '',
      shadowColor: '',
      shadowBlur: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0
    };

    const mockState = {
      caption: 'RAW 48MP // ISO 64',
      subtitle: '',
      date: '2026-09-13'
    };

    const bounds = { drawX: 0, drawY: 0, drawW: 1200, drawH: 1600 };

    assert.doesNotThrow(() => {
      viewfinderTemplate.render(mockCtx, null, bounds, mockState);
    });
  });
});
