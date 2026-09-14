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
});
