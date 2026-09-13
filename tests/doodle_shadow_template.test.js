import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { doodleShadowTemplate } from '../src/features/templates/doodle_shadow_template.js';

describe('Doodle Shadow Template', () => {
  it('should have valid template metadata and 3:4 canvas configuration', () => {
    assert.strictEqual(doodleShadowTemplate.id, 'doodle_shadow');
    assert.strictEqual(doodleShadowTemplate.name, 'Alter-Ego Doodle Shadow');
    assert.strictEqual(doodleShadowTemplate.config.canvasWidth, 1200);
    assert.strictEqual(doodleShadowTemplate.config.canvasHeight, 1600);
    assert.strictEqual(typeof doodleShadowTemplate.render, 'function');
  });

  it('should execute render safely with mock context and state without crashing', () => {
    const mockCtx = {
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      bezierCurveTo: () => {},
      closePath: () => {},
      rect: () => {},
      clip: () => {},
      fill: () => {},
      stroke: () => {},
      fillRect: () => {},
      strokeRect: () => {},
      fillText: () => {},
      measureText: (text) => ({ width: text.length * 10 }),
      drawImage: () => {},
      translate: () => {},
      scale: () => {},
      rotate: () => {},
      arc: () => {},
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      lineCap: 'round',
      lineJoin: 'round',
      font: '',
      textAlign: '',
      textBaseline: '',
      filter: ''
    };

    const mockState = {
      caption: 'ALTER-EGO // SHADOWPLAY',
      subtitle: 'Memories Archive',
      date: '2026 - VOL.02'
    };

    const bounds = { drawX: 0, drawY: 0, drawW: 1200, drawH: 1600 };

    assert.doesNotThrow(() => {
      doodleShadowTemplate.render(mockCtx, null, bounds, mockState);
    });
  });
});
