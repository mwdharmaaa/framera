import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { tokyoBrutalistTemplate } from '../src/features/templates/tokyo_brutalist_template.js';

describe('Tokyo Brutalist Template', () => {
  it('should have valid metadata and 3:4 canvas configuration', () => {
    assert.strictEqual(tokyoBrutalistTemplate.id, 'tokyo_brutalist');
    assert.strictEqual(tokyoBrutalistTemplate.config.canvasWidth, 1200);
    assert.strictEqual(tokyoBrutalistTemplate.config.canvasHeight, 1600);
    assert.strictEqual(typeof tokyoBrutalistTemplate.render, 'function');
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
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      font: '',
      textAlign: '',
      textBaseline: '',
      letterSpacing: '',
      filter: '',
      globalCompositeOperation: ''
    };

    const mockState = {
      caption: 'TOKYO',
      subtitle: 'Architectural avant-garde grid',
      date: '2026 - ARCHIVE'
    };

    const bounds = { drawX: 0, drawY: 0, drawW: 1200, drawH: 1600 };

    assert.doesNotThrow(() => {
      tokyoBrutalistTemplate.render(mockCtx, null, bounds, mockState);
    });
  });
});
