import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { aiVisionTemplate } from '../src/features/templates/ai_vision_template.js';

describe('AI Neural Vision Template', () => {
  it('should have valid metadata and 3:4 canvas configuration', () => {
    assert.strictEqual(aiVisionTemplate.id, 'ai_vision');
    assert.strictEqual(aiVisionTemplate.config.canvasWidth, 1200);
    assert.strictEqual(aiVisionTemplate.config.canvasHeight, 1600);
    assert.strictEqual(typeof aiVisionTemplate.render, 'function');
  });

  it('should render safely with mock context without throwing', () => {
    const mockCtx = {
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      closePath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      arc: () => {},
      rect: () => {},
      clip: () => {},
      fill: () => {},
      stroke: () => {},
      fillRect: () => {},
      strokeRect: () => {},
      fillText: () => {},
      drawImage: () => {},
      measureText: () => ({ width: 100 }),
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      font: '',
      textAlign: '',
      filter: ''
    };

    const mockState = {
      caption: 'TARGET ACQUIRED',
      subtitle: 'MODEL: YOLO-VISION-NEURAL-X',
      date: 'LAT: 35.6762 // LNG: 139.6503'
    };

    const bounds = { drawX: 50, drawY: 50, drawW: 1100, drawH: 1500 };

    assert.doesNotThrow(() => {
      aiVisionTemplate.render(mockCtx, null, bounds, mockState);
    });
  });
});
