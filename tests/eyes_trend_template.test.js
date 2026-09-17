import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { eyesTrendTemplate } from '../src/features/templates/eyes_trend_template.js';
import {
  getEyesTrendOverlayImage,
  resetEyesTrendOverlayImage,
  drawDoodleStar,
  drawSparkleGlint,
  drawEmeraldAura,
  drawEyesTrendTypography
} from '../src/features/templates/eyes_trend_helpers.js';
import { getTemplate } from '../src/features/templates/template_registry.js';

describe('Emerald Eyes Trend Template', () => {
  it('should have valid metadata and 3:4 canvas configuration', () => {
    assert.strictEqual(eyesTrendTemplate.id, 'eyes_trend');
    assert.strictEqual(eyesTrendTemplate.name, 'Emerald Eyes Trend');
    assert.strictEqual(eyesTrendTemplate.aspectRatio, '3:4');
    assert.strictEqual(eyesTrendTemplate.photoCount, 1);
    assert.strictEqual(eyesTrendTemplate.config.canvasWidth, 1200);
    assert.strictEqual(eyesTrendTemplate.config.canvasHeight, 1600);
    assert.deepStrictEqual(eyesTrendTemplate.config.frame, { x: 0, y: 644, w: 1200, h: 329 });
    assert.strictEqual(typeof eyesTrendTemplate.render, 'function');
  });

  it('should be registered in the global template registry', () => {
    const tpl = getTemplate('eyes_trend');
    assert.ok(tpl, 'Template should exist in registry');
    assert.strictEqual(tpl.id, 'eyes_trend');
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
      quadraticCurveTo: () => {},
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      font: '',
      textAlign: '',
      textBaseline: '',
      letterSpacing: '',
      globalAlpha: 1,
      globalCompositeOperation: 'source-over'
    };

    const mockBounds = { drawX: 0, drawY: 644, drawW: 1200, drawH: 329 };
    const mockImg = {};

    assert.doesNotThrow(() => {
      eyesTrendTemplate.render(mockCtx, mockImg, mockBounds, {
        caption: 'MY CUSTOM EYES',
        subtitle: 'Doodle Vibe',
        date: '2026 // EDITION'
      });
    });

    assert.doesNotThrow(() => {
      eyesTrendTemplate.render(mockCtx, null, mockBounds, {});
    });
  });

  it('should execute helper routines safely without throwing', () => {
    const mockCtx = {
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      closePath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      quadraticCurveTo: () => {},
      fill: () => {},
      stroke: () => {},
      fillRect: () => {},
      fillText: () => {},
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      font: '',
      textAlign: '',
      letterSpacing: '',
      globalCompositeOperation: 'source-over'
    };

    assert.doesNotThrow(() => drawDoodleStar(mockCtx, 100, 100, 20, '#22c55e'));
    assert.doesNotThrow(() => drawSparkleGlint(mockCtx, 150, 150, 12, '#ffffff'));
    assert.doesNotThrow(() => drawEmeraldAura(mockCtx, { x: 0, y: 644, w: 1200, h: 329 }, 0.1));
    assert.doesNotThrow(() => drawEyesTrendTypography(mockCtx, 1200, 1600, {
      caption: 'CUSTOM TITLE',
      subtitle: 'SUBTITLE TEXT',
      date: 'TODAY'
    }));

    // Test overlay cache and reset
    resetEyesTrendOverlayImage();
    const overlay = getEyesTrendOverlayImage();
    // In Node test environment without Image global, returns null
    assert.strictEqual(overlay, null);
  });
});
