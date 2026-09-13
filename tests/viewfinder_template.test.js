import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { viewfinderTemplate } from '../src/features/templates/viewfinder_template.js';
import {
  drawPhoneChassis,
  drawCameraHUD
} from '../src/features/templates/viewfinder_helpers.js';

describe('Phone Viewfinder Template', () => {
  it('should have valid metadata and 3:4 canvas configuration', () => {
    assert.strictEqual(viewfinderTemplate.id, 'viewfinder');
    assert.strictEqual(viewfinderTemplate.config.canvasWidth, 1200);
    assert.strictEqual(viewfinderTemplate.config.canvasHeight, 1600);
    assert.strictEqual(typeof viewfinderTemplate.render, 'function');
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
      roundRect: () => {},
      ellipse: () => {},
      clip: () => {},
      fill: () => {},
      stroke: () => {},
      fillRect: () => {},
      strokeRect: () => {},
      fillText: () => {},
      drawImage: () => {},
      arc: () => {},
      translate: () => {},
      rotate: () => {},
      scale: () => {},
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      font: '',
      textAlign: '',
      textBaseline: '',
      letterSpacing: '',
      filter: '',
      shadowColor: '',
      shadowBlur: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0
    };

    const mockState = {
      caption: '00:00:00',
      subtitle: '',
      date: '2026-09-13'
    };

    const bounds = { drawX: 0, drawY: 0, drawW: 1200, drawH: 1600 };

    assert.doesNotThrow(() => {
      viewfinderTemplate.render(mockCtx, null, bounds, mockState);
    });

    assert.doesNotThrow(() => {
      viewfinderTemplate.render(mockCtx, {}, bounds, mockState);
    });
  });

  it('should execute viewfinder helpers safely without throwing', () => {
    const mockCtx = {
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      closePath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      arc: () => {},
      stroke: () => {},
      fill: () => {},
      roundRect: () => {},
      fillRect: () => {},
      strokeRect: () => {},
      fillText: () => {},
      translate: () => {},
      scale: () => {},
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      font: '',
      textAlign: ''
    };

    assert.doesNotThrow(() => {
      drawPhoneChassis(mockCtx, 1060, 580);
      drawCameraHUD(mockCtx, 860, 536, { caption: '00:00:00' });
    });
  });
});
