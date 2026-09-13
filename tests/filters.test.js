import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { FILTER_PRESETS, getFilterCss, applyCanvasFilter } from '../src/core/canvas/filters.js';

describe('Canvas Filters & Color Grade Presets', () => {
  it('should have standard presets registered', () => {
    assert.ok(FILTER_PRESETS.none);
    assert.ok(FILTER_PRESETS.bw);
    assert.ok(FILTER_PRESETS.warm);
    assert.ok(FILTER_PRESETS.cyber);
    assert.ok(FILTER_PRESETS.fade);
    assert.ok(FILTER_PRESETS.noir);
    assert.ok(FILTER_PRESETS.negative);
  });

  it('should return valid CSS filter strings', () => {
    assert.strictEqual(getFilterCss('none'), 'none');
    assert.ok(getFilterCss('bw').includes('grayscale'));
    assert.ok(getFilterCss('warm').includes('sepia'));
    assert.ok(getFilterCss('negative').includes('invert'));
  });


  it('should fallback gracefully to none for unknown presets', () => {
    assert.strictEqual(getFilterCss('unknown_xyz'), 'none');
  });

  it('should apply filter to mock canvas context', () => {
    const mockCtx = { filter: 'none' };
    applyCanvasFilter(mockCtx, 'bw');
    assert.ok(mockCtx.filter.includes('grayscale'));
  });
});
