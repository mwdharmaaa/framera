import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { comicPortalTemplate } from '../src/features/templates/comic_portal_template.js';

describe('Comic Sketch Eye Portal Template', () => {
  it('should have valid metadata and 3:4 canvas configuration', () => {
    assert.strictEqual(comicPortalTemplate.id, 'comic_portal');
    assert.strictEqual(comicPortalTemplate.config.canvasWidth, 1200);
    assert.strictEqual(comicPortalTemplate.config.canvasHeight, 1600);
    assert.strictEqual(typeof comicPortalTemplate.render, 'function');
  });

  it('should render safely with mock context without throwing', () => {
    const mockCtx = {
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      closePath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      quadraticCurveTo: () => {},
      rect: () => {},
      clip: () => {},
      fill: () => {},
      stroke: () => {},
      fillRect: () => {},
      strokeRect: () => {},
      fillText: () => {},
      drawImage: () => {},
      setLineDash: () => {},
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      font: '',
      textAlign: '',
      filter: ''
    };

    const mockState = {
      caption: 'EYES OF THE BEHOLDER',
      subtitle: 'HAND-CRAFTED COMIC SKETCH EDITION',
      date: 'SIGNATURE #042 // 2026'
    };

    const bounds = { drawX: 70, drawY: 70, drawW: 1060, drawH: 1460 };

    assert.doesNotThrow(() => {
      comicPortalTemplate.render(mockCtx, null, bounds, mockState);
    });
  });
});
