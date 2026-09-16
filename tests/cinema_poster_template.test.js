import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { cinemaPosterTemplate } from '../src/features/templates/cinema_poster_template.js';
import {
  traceSpectacleLensPath,
  drawGlassesFrame,
  drawCinemaTypography
} from '../src/features/templates/cinema_poster_helpers.js';

describe('Cinema Poster Template', () => {
  it('should have valid metadata and 3:4 canvas configuration', () => {
    assert.strictEqual(cinemaPosterTemplate.id, 'cinema_poster');
    assert.strictEqual(cinemaPosterTemplate.config.canvasWidth, 1200);
    assert.strictEqual(cinemaPosterTemplate.config.canvasHeight, 1600);
    assert.deepStrictEqual(cinemaPosterTemplate.config.frame, { x: 0, y: 0, w: 1200, h: 1600 });
    assert.strictEqual(typeof cinemaPosterTemplate.render, 'function');
  });

  it('should render safely with mock context without throwing', () => {
    const mockCtx = {
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      closePath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      bezierCurveTo: () => {},
      rect: () => {},
      clip: () => {},
      fill: () => {},
      stroke: () => {},
      fillRect: () => {},
      strokeRect: () => {},
      fillText: () => {},
      drawImage: () => {},
      arc: () => {},
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      font: '',
      textAlign: '',
      textBaseline: '',
      letterSpacing: '',
      shadowColor: '',
      shadowBlur: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0
    };

    const mockState = {
      caption: 'HELLO',
      subtitle: 'Open your eyes and look the vibes of your world.',
      date: '17 AGUSTUS 2026'
    };

    const bounds = { drawX: 0, drawY: 0, drawW: 1200, drawH: 1600 };

    assert.doesNotThrow(() => {
      cinemaPosterTemplate.render(mockCtx, null, bounds, mockState);
    });
  });

  it('should execute cinema poster helper routines safely', () => {
    const mockCtx = {
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      closePath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      bezierCurveTo: () => {},
      rect: () => {},
      clip: () => {},
      fill: () => {},
      stroke: () => {},
      fillRect: () => {},
      strokeRect: () => {},
      fillText: () => {},
      arc: () => {},
      createLinearGradient: () => ({ addColorStop: () => {} }),
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      font: '',
      textAlign: '',
      textBaseline: '',
      letterSpacing: '',
      shadowColor: '',
      shadowBlur: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0
    };

    assert.doesNotThrow(() => {
      traceSpectacleLensPath(mockCtx, 1200, 1600);
      drawGlassesFrame(mockCtx, 1200, 1600);
      drawCinemaTypography(mockCtx, 1200, 1600, { caption: 'HELLO', subtitle: 'Open your eyes', date: '17 AGUSTUS 2025' });
    });
  });

  it('should trace an authentic rounded continuous dome flushed against the top-left edge', () => {
    let moveToCall = null;
    const bezierCalls = [];
    const mockCtx = {
      beginPath: () => {},
      closePath: () => {},
      moveTo: (x, y) => { moveToCall = { x, y }; },
      bezierCurveTo: (cp1x, cp1y, cp2x, cp2y, x, y) => {
        bezierCalls.push({ cp1x, cp1y, cp2x, cp2y, x, y });
      }
    };

    traceSpectacleLensPath(mockCtx, 1200, 1600);

    assert.ok(moveToCall, 'moveTo must be called');
    assert.strictEqual(moveToCall.y, 0, 'Top apex must be flushed directly against top edge (y = 0)');

    const firstBezier = bezierCalls[0];
    assert.ok(firstBezier, 'First bezier segment must exist');
    assert.strictEqual(firstBezier.cp1y, 0, 'cp1y must remain tangent to top edge');

    // Check that the left hinge approaches x = 0 (flushed against left edge)
    const leftHingeSegment = bezierCalls[6];
    assert.ok(leftHingeSegment, 'Left hinge segment must exist');
    assert.ok(leftHingeSegment.cp1x <= 0, 'Left rim must hug/align with left border (x <= 0)');
  });
});
