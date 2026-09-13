import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { foldedPosterTemplate } from '../src/features/templates/folded_poster_template.js';
import {
  drawSkyAndCables,
  drawPosterCardBase,
  drawPosterTypography
} from '../src/features/templates/folded_poster_helpers.js';
import {
  drawScotchTape,
  drawTactileCreases
} from '../src/features/templates/folded_poster_creases.js';

describe('Y2K Folded Print Poster Template', () => {
  it('should have valid metadata and 3:4 canvas configuration', () => {
    assert.strictEqual(foldedPosterTemplate.id, 'folded_poster');
    assert.strictEqual(foldedPosterTemplate.config.canvasWidth, 1200);
    assert.strictEqual(foldedPosterTemplate.config.canvasHeight, 1600);
    assert.strictEqual(typeof foldedPosterTemplate.render, 'function');
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
      ellipse: () => {},
      rect: () => {},
      clip: () => {},
      fill: () => {},
      stroke: () => {},
      fillRect: () => {},
      strokeRect: () => {},
      fillText: () => {},
      drawImage: () => {},
      translate: () => {},
      rotate: () => {},
      setLineDash: () => {},
      createLinearGradient: () => ({ addColorStop: () => {} }),
      createRadialGradient: () => ({ addColorStop: () => {} }),
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      font: '',
      textAlign: '',
      textBaseline: '',
      filter: '',
      shadowColor: '',
      shadowBlur: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0
    };

    const mockState = {
      caption: 'FAST',
      subtitle: 'LIVE\nLAUGH\nCRASH OUT',
      date: '12/12/2025'
    };

    const bounds = { drawX: 180, drawY: 225, drawW: 840, drawH: 1125 };

    assert.doesNotThrow(() => {
      foldedPosterTemplate.render(mockCtx, null, bounds, mockState);
    });

    assert.doesNotThrow(() => {
      foldedPosterTemplate.render(mockCtx, {}, bounds, mockState);
    });
  });

  it('should execute folded poster helper routines safely', () => {
    const mockCtx = {
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      closePath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      quadraticCurveTo: () => {},
      ellipse: () => {},
      rect: () => {},
      clip: () => {},
      fill: () => {},
      stroke: () => {},
      fillRect: () => {},
      strokeRect: () => {},
      fillText: () => {},
      translate: () => {},
      rotate: () => {},
      setLineDash: () => {},
      createLinearGradient: () => ({ addColorStop: () => {} }),
      createRadialGradient: () => ({ addColorStop: () => {} }),
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1
    };

    const poster = { x: 125, y: 95, w: 950, h: 1410 };
    const frame = { x: 180, y: 225, w: 840, h: 1125 };

    assert.doesNotThrow(() => {
      drawSkyAndCables(mockCtx, 1200, 1600);
      drawPosterCardBase(mockCtx, poster, frame);
      drawPosterTypography(mockCtx, poster, frame, { caption: 'FAST', subtitle: 'LIVE\nLAUGH\nCRASH OUT', date: '12/12/2025' });
      drawScotchTape(mockCtx, poster.x + 40, poster.y + 15);
      drawTactileCreases(mockCtx, 1200, 1600, poster);
    });
  });
});
