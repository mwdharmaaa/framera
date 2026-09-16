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

  it('should render large, prominent font size for overlaid cursive script', () => {
    let capturedFont = '';
    const mockCtx = {
      save: () => {},
      restore: () => {},
      fillText: () => {},
      strokeText: () => {},
      set font(val) { capturedFont = val; },
      get font() { return capturedFont; }
    };

    drawOverlaidScript(mockCtx, 'Awaits', 1200, 1285);
    assert.match(capturedFont, /295px/, 'Font size should be scaled to 295px for high impact');
  });

  it('should render headline with uniform scale, snug packing, and wavy baseline', () => {
    const renderedChars = [];
    let currentAlpha = 1;
    const mockCtx = {
      save: () => {},
      restore: () => { currentAlpha = 1; },
      set globalAlpha(v) { currentAlpha = v; },
      get globalAlpha() { return currentAlpha; },
      measureText: () => ({ width: 160 }),
      fillText: (char, x, y) => {
        renderedChars.push({ char, x, y, alpha: currentAlpha });
      }
    };

    drawCurvedHeadline(mockCtx, 'FUTURE', 1200, 1380);

    // Verify dense horizontal motion blur passes exist across letters
    assert.strictEqual(renderedChars.length, 128);

    const motionPasses = renderedChars.filter((r) => r.alpha < 0.5);
    assert.strictEqual(motionPasses.length, 122, 'Must have dense horizontal motion blur passes');

    // Filter core letters (alpha >= 0.9)
    const coreChars = renderedChars.filter((r) => r.alpha >= 0.9);
    assert.strictEqual(coreChars.length, 6);

    // Verify snug packing on core letters
    const span = coreChars[5].x - coreChars[0].x;
    assert.ok(span < 900, 'Letters must be compact (dempet)');

    // Verify wavy motion on core letters: middle letters crest while trailing letters trough
    const yOffsets = coreChars.map((c) => c.y - 1380);
    assert.ok(yOffsets[2] < yOffsets[0], 'Peak crest should be higher than starting letter');
    assert.ok(yOffsets[4] > yOffsets[2], 'Trough should dip lower than crest');

    // Verify outer motion blur reaches beyond core bounds (horizontal streak smear)
    const minBlurX = Math.min(...motionPasses.map((m) => m.x));
    const maxBlurX = Math.max(...motionPasses.map((m) => m.x));
    assert.ok(minBlurX < coreChars[0].x - 40, 'Motion blur should stretch outward on left edge');
    assert.ok(maxBlurX > coreChars[5].x + 40, 'Motion blur should stretch outward on right edge');
  });
});
