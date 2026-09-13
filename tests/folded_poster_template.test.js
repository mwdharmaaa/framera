import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { foldedPosterTemplate } from '../src/features/templates/folded_poster_template.js';

describe('Y2K Folded Print Poster Template', () => {
  it('should have valid metadata and 3:4 canvas configuration', () => {
    assert.strictEqual(foldedPosterTemplate.id, 'folded_poster');
    assert.strictEqual(foldedPosterTemplate.config.canvasWidth, 1200);
    assert.strictEqual(foldedPosterTemplate.config.canvasHeight, 1600);
    assert.strictEqual(typeof foldedPosterTemplate.render, 'function');
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
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      font: '',
      textAlign: '',
      filter: ''
    };

    const mockState = {
      caption: 'LIVE LAUGH CRASH OUT',
      subtitle: 'LIMITED EDITION STREETWEAR FOLDED PRINT',
      date: 'ISSUE #07 // EDITION 1/500'
    };

    const bounds = { drawX: 80, drawY: 160, drawW: 1040, drawH: 1140 };

    assert.doesNotThrow(() => {
      foldedPosterTemplate.render(mockCtx, null, bounds, mockState);
    });
  });
});
