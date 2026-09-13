import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { clamp, calculateImageBounds } from '../src/core/canvas/bounds.js';

describe('Canvas Bounds & Transformation Engine', () => {
  it('should clamp numbers accurately within bounds', () => {
    assert.strictEqual(clamp(5, 0, 10), 5);
    assert.strictEqual(clamp(-5, 0, 10), 0);
    assert.strictEqual(clamp(15, 0, 10), 10);
  });

  it('should scale landscape image to cover vertical frame without gaps', () => {
    const frame = { x: 50, y: 50, w: 400, h: 600 };
    // 16:9 landscape photo
    const bounds = calculateImageBounds(1600, 900, frame, { fitMode: 'cover' });

    assert.strictEqual(bounds.drawH, 600);
    assert.ok(bounds.drawW >= 400);
  });

  it('should scale portrait image to cover wide frame without gaps', () => {
    const frame = { x: 0, y: 0, w: 800, h: 400 };
    // 9:16 portrait photo
    const bounds = calculateImageBounds(900, 1600, frame, { fitMode: 'cover' });

    assert.strictEqual(bounds.drawW, 800);
    assert.ok(bounds.drawH >= 400);
  });

  it('should apply zoom and pan offsets correctly', () => {
    const frame = { x: 0, y: 0, w: 500, h: 500 };
    const base = calculateImageBounds(500, 500, frame, { zoom: 1 });
    const zoomed = calculateImageBounds(500, 500, frame, { zoom: 2, panX: 20, panY: -30 });

    assert.strictEqual(zoomed.drawW, base.drawW * 2);
    assert.strictEqual(zoomed.drawH, base.drawH * 2);
    assert.ok(zoomed.drawX > (frame.w - zoomed.drawW) / 2);
  });

  it('should return default frame dimensions for zero or negative inputs', () => {
    const frame = { x: 20, y: 30, w: 200, h: 300 };
    const bounds = calculateImageBounds(0, 500, frame);
    assert.deepStrictEqual(bounds, { drawX: 20, drawY: 30, drawW: 200, drawH: 300 });
  });
});
