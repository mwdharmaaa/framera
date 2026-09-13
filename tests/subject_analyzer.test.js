import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { analyzeSubject } from '../src/core/canvas/subject_analyzer.js';

describe('Subject Silhouette & Pose Analyzer', () => {
  it('should return safe default placement when photoImg or document is undefined', () => {
    const analysis = analyzeSubject(null, { drawX: 0, drawY: 0, drawW: 1200, drawH: 1600 });
    assert.ok(analysis);
    assert.strictEqual(typeof analysis.shadowPlacement.ox, 'number');
    assert.strictEqual(typeof analysis.shadowPlacement.oy, 'number');
    assert.strictEqual(typeof analysis.shadowPlacement.scaleX, 'number');
    assert.strictEqual(typeof analysis.shadowPlacement.scaleY, 'number');
    assert.strictEqual(typeof analysis.shadowPlacement.flipX, 'boolean');
    assert.strictEqual(typeof analysis.headPoint.x, 'number');
    assert.strictEqual(typeof analysis.headPoint.y, 'number');
    assert.strictEqual(analysis.hasSubject, false);
  });

  it('should compute valid shadow placement bounds within canvas viewport', () => {
    const analysis = analyzeSubject(null, { drawX: 0, drawY: 0, drawW: 1200, drawH: 1600 });
    const { ox, oy, scaleX, scaleY } = analysis.shadowPlacement;
    assert.ok(ox > 0 && ox < 1200);
    assert.ok(oy > 0 && oy <= 1600);
    assert.ok(scaleX > 0.5 && scaleX < 2.0);
    assert.ok(scaleY > 0.5 && scaleY < 2.0);
  });
});
