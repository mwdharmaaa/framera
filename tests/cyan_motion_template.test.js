import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { cyanMotionTemplate } from '../src/features/templates/cyan_motion_template.js';
import {
  drawHorizontalMotionSmear,
  applyCyanDuotoneGrading,
  drawCyanMotionTypography
} from '../src/features/templates/cyan_motion_helpers.js';
import { getTemplate } from '../src/features/templates/template_registry.js';

describe('Cyan Motion Smear Template', () => {
  it('should have valid metadata and 3:4 canvas configuration', () => {
    assert.strictEqual(cyanMotionTemplate.id, 'cyan_motion');
    assert.strictEqual(cyanMotionTemplate.name, 'Cyan Motion Smear');
    assert.strictEqual(cyanMotionTemplate.aspectRatio, '3:4');
    assert.strictEqual(cyanMotionTemplate.photoCount, 1);
    assert.strictEqual(cyanMotionTemplate.config.canvasWidth, 1200);
    assert.strictEqual(cyanMotionTemplate.config.canvasHeight, 1600);
    assert.strictEqual(typeof cyanMotionTemplate.render, 'function');
  });

  it('should be registered in the global template registry', () => {
    const tpl = getTemplate('cyan_motion');
    assert.ok(tpl, 'Template should exist in registry');
    assert.strictEqual(tpl.id, 'cyan_motion');
  });

  it('should render safely with mock context without throwing', () => {
    const mockCtx = {
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      rect: () => {},
      clip: () => {},
      fill: () => {},
      stroke: () => {},
      fillRect: () => {},
      fillText: () => {},
      drawImage: () => {},
      fillStyle: '',
      font: '',
      textAlign: '',
      letterSpacing: '',
      globalAlpha: 1,
      globalCompositeOperation: 'source-over',
      filter: 'none'
    };

    const mockBounds = { drawX: 0, drawY: 0, drawW: 1200, drawH: 1600 };
    const mockImg = {};

    assert.doesNotThrow(() => {
      cyanMotionTemplate.render(mockCtx, mockImg, mockBounds, {
        caption: 'VELOCITY ECHO',
        subtitle: 'ANALOG 35MM',
        date: 'ISO 400'
      });
    });

    assert.doesNotThrow(() => {
      cyanMotionTemplate.render(mockCtx, null, mockBounds, {});
    });
  });

  it('should execute helper routines safely without throwing', () => {
    const mockCtx = {
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      rect: () => {},
      clip: () => {},
      fillRect: () => {},
      fillText: () => {},
      drawImage: () => {},
      fillStyle: '',
      font: '',
      textAlign: '',
      letterSpacing: '',
      globalAlpha: 1,
      globalCompositeOperation: 'source-over'
    };

    assert.doesNotThrow(() => drawHorizontalMotionSmear(mockCtx, {}, { drawX: 0, drawY: 0, drawW: 1200, drawH: 1600 }));
    assert.doesNotThrow(() => applyCyanDuotoneGrading(mockCtx, 1200, 1600));
    assert.doesNotThrow(() => drawCyanMotionTypography(mockCtx, 1200, 1600, {
      caption: 'CYAN',
      subtitle: 'MOTION',
      date: 'TODAY'
    }));
  });
});
