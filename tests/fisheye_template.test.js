import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { fisheyeTemplate } from '../src/features/templates/fisheye_template.js';

describe('8mm Circular Fisheye Template', () => {
  it('should have valid metadata and 3:4 canvas configuration', () => {
    assert.strictEqual(fisheyeTemplate.id, 'fisheye');
    assert.strictEqual(fisheyeTemplate.config.canvasWidth, 1200);
    assert.strictEqual(fisheyeTemplate.config.canvasHeight, 1600);
    assert.strictEqual(typeof fisheyeTemplate.render, 'function');
  });

  it('should render safely with mock context without throwing', () => {
    const mockCtx = {
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      closePath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      arc: () => {},
      rect: () => {},
      clip: () => {},
      fill: () => {},
      stroke: () => {},
      fillRect: () => {},
      strokeRect: () => {},
      fillText: () => {},
      drawImage: () => {},
      createRadialGradient: () => ({ addColorStop: () => {} }),
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      font: '',
      textAlign: '',
      filter: ''
    };

    const mockState = {
      caption: 'CURVATURE REALITY',
      subtitle: 'SPHERICAL PERSPECTIVE DISTORTION',
      date: 'ISO 400 // 1/250s'
    };

    const bounds = { drawX: 80, drawY: 220, drawW: 1040, drawH: 1040 };

    assert.doesNotThrow(() => {
      fisheyeTemplate.render(mockCtx, null, bounds, mockState);
    });
  });
});
