import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { fisheyeTemplate } from '../src/features/templates/fisheye_template.js';
import {
  getFisheyeLUT,
  drawLensTicks,
  drawFisheyeGlassEffects,
  renderFisheyeWarp
} from '../src/features/templates/fisheye_helpers.js';

describe('8mm Circular Fisheye Template', () => {
  it('should have valid metadata and 3:4 canvas configuration', () => {
    assert.strictEqual(fisheyeTemplate.id, 'fisheye');
    assert.strictEqual(fisheyeTemplate.config.canvasWidth, 1200);
    assert.strictEqual(fisheyeTemplate.config.canvasHeight, 1600);
    assert.strictEqual(typeof fisheyeTemplate.render, 'function');
  });

  it('should generate valid radial distortion LUT with center magnification zoom', () => {
    const radius = 490;
    const lut = getFisheyeLUT(radius);
    assert.strictEqual(lut.length, radius + 1);
    // Center magnification coefficient ~0.40 (2.5x zoom)
    assert.ok(Math.abs(lut[0] - 0.40) < 0.01);
    // Edge mapped to 1.0 (no distortion at outer rim boundary)
    assert.ok(Math.abs(lut[radius] - 1.0) < 0.01);
    // Monotonically increasing
    assert.ok(lut[100] > lut[0]);
    assert.ok(lut[radius] > lut[250]);
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
      createLinearGradient: () => ({ addColorStop: () => {} }),
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

    const bounds = { drawX: 110, drawY: 230, drawW: 980, drawH: 980 };

    assert.doesNotThrow(() => {
      fisheyeTemplate.render(mockCtx, null, bounds, mockState);
    });

    assert.doesNotThrow(() => {
      fisheyeTemplate.render(mockCtx, {}, bounds, mockState);
    });
  });

  it('should execute fisheye helper routines safely', () => {
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
      drawImage: () => {},
      createRadialGradient: () => ({ addColorStop: () => {} }),
      createLinearGradient: () => ({ addColorStop: () => {} }),
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1
    };

    assert.doesNotThrow(() => {
      drawLensTicks(mockCtx, 600, 720, 490);
      drawFisheyeGlassEffects(mockCtx, 600, 720, 490);
      renderFisheyeWarp(mockCtx, {}, { drawX: 0, drawY: 0, drawW: 980, drawH: 980 }, 600, 720, 490);
    });
  });
});
