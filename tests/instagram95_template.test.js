import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { instagram95Template } from '../src/features/templates/instagram95_template.js';

describe('Instagram 95 Template', () => {
  it('should have valid metadata and 3:4 canvas configuration', () => {
    assert.strictEqual(instagram95Template.id, 'instagram95');
    assert.strictEqual(instagram95Template.config.canvasWidth, 1200);
    assert.strictEqual(instagram95Template.config.canvasHeight, 1600);
    assert.strictEqual(typeof instagram95Template.render, 'function');
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
      filter: ''
    };

    const mockState = {
      caption: 'Instagram.exe',
      subtitle: 'Photo Studio',
      date: '1995-10-24'
    };

    const bounds = { drawX: 0, drawY: 0, drawW: 1200, drawH: 1600 };

    assert.doesNotThrow(() => {
      instagram95Template.render(mockCtx, null, bounds, mockState);
    });
  });
});
