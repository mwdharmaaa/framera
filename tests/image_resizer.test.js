import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateFitDimensions,
  normalizeImageDimensions,
  MAX_INTAKE_DIMENSION
} from '../src/core/canvas/image_resizer.js';

describe('Image Intake Resizer Engine', () => {
  it('should return original dimensions when within limits', () => {
    const result = calculateFitDimensions(800, 600, 1920);
    assert.strictEqual(result.width, 800);
    assert.strictEqual(result.height, 600);
    assert.strictEqual(result.wasResized, false);
  });

  it('should downscale landscape 4K image preserving aspect ratio', () => {
    const result = calculateFitDimensions(3840, 2160, 1920);
    assert.strictEqual(result.width, 1920);
    assert.strictEqual(result.height, 1080);
    assert.strictEqual(result.wasResized, true);
  });

  it('should downscale portrait 48MP camera photo preserving aspect ratio', () => {
    // 6000x8000 portrait
    const result = calculateFitDimensions(6000, 8000, 1920);
    assert.strictEqual(result.height, 1920);
    assert.strictEqual(result.width, 1440);
    assert.strictEqual(result.wasResized, true);
  });

  it('should handle zero or falsy dimensions gracefully', () => {
    const result = calculateFitDimensions(0, 0, 1920);
    assert.strictEqual(result.width, 0);
    assert.strictEqual(result.height, 0);
    assert.strictEqual(result.wasResized, false);
  });

  it('should pass through images within max limits without creating canvas', async () => {
    const mockImg = {
      naturalWidth: 1080,
      naturalHeight: 1350,
      src: 'data:image/png;base64,mock'
    };
    const res = await normalizeImageDimensions(mockImg, MAX_INTAKE_DIMENSION);
    assert.strictEqual(res.img, mockImg);
    assert.strictEqual(res.dataUrl, mockImg.src);
  });
});
