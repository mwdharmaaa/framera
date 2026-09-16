import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { futureAwaitsTemplate } from '../src/features/templates/future_awaits_template.js';
import {
  drawGrainyNoiseBackdrop,
  drawGlitchScanlines,
  drawCurvedHeadline,
  drawOverlaidScript
} from '../src/features/templates/future_awaits_helpers.js';
import { getTemplate } from '../src/features/templates/template_registry.js';

describe('Future Awaits Template', () => {
  it('should have valid metadata and 3:4 canvas configuration', () => {
    assert.strictEqual(futureAwaitsTemplate.id, 'future_awaits');
    assert.strictEqual(futureAwaitsTemplate.name, 'Future Awaits');
    assert.strictEqual(futureAwaitsTemplate.aspectRatio, '3:4');
    assert.strictEqual(futureAwaitsTemplate.photoCount, 1);
    assert.strictEqual(futureAwaitsTemplate.config.canvasWidth, 1200);
    assert.strictEqual(futureAwaitsTemplate.config.canvasHeight, 1600);
    assert.deepStrictEqual(futureAwaitsTemplate.config.frame, { x: 0, y: 0, w: 1200, h: 1600 });
    assert.strictEqual(typeof futureAwaitsTemplate.render, 'function');
  });

  it('should be registered in the global template registry', () => {
    const tpl = getTemplate('future_awaits');
    assert.ok(tpl, 'Template should exist in registry');
    assert.strictEqual(tpl.id, 'future_awaits');
  });

  it('should render safely with mock context without throwing', () => {
    const mockCtx = {
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      closePath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      rect: () => {},
      clip: () => {},
      fill: () => {},
      stroke: () => {},
      fillRect: () => {},
      strokeRect: () => {},
      fillText: () => {},
      strokeText: () => {},
      drawImage: () => {},
      translate: () => {},
      scale: () => {},
      createRadialGradient: () => ({ addColorStop: () => {} }),
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      font: '',
      textAlign: '',
      textBaseline: '',
      letterSpacing: '',
      shadowColor: '',
      shadowBlur: 0,
      globalAlpha: 1
    };

    const mockState = {
      caption: 'FUTURE',
      subtitle: 'Awaits',
      date: '2026 // VOL.01'
    };

    const bounds = { drawX: 0, drawY: 0, drawW: 1200, drawH: 1600 };

    assert.doesNotThrow(() => {
      futureAwaitsTemplate.render(mockCtx, null, bounds, mockState);
    });

    const mockImg = { width: 800, height: 1200 };
    assert.doesNotThrow(() => {
      futureAwaitsTemplate.render(mockCtx, mockImg, bounds, mockState);
    });
  });

  it('should execute helper routines safely without throwing', () => {
    const mockCtx = {
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      stroke: () => {},
      fillRect: () => {},
      fillText: () => {},
      strokeText: () => {},
      translate: () => {},
      scale: () => {},
      createRadialGradient: () => ({ addColorStop: () => {} }),
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      font: '',
      textAlign: '',
      textBaseline: '',
      letterSpacing: '',
      shadowColor: '',
      shadowBlur: 0,
      globalAlpha: 1
    };

    assert.doesNotThrow(() => {
      drawGrainyNoiseBackdrop(mockCtx, 1200, 1600);
      drawGlitchScanlines(mockCtx, 1200, 1000, 1500);
      drawCurvedHeadline(mockCtx, 'FUTURE', 1200, 1380);
      drawOverlaidScript(mockCtx, 'Awaits', 1200, 1300);
    });
  });
});
