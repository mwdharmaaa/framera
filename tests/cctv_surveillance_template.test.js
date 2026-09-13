import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { cctvSurveillanceTemplate } from '../src/features/templates/cctv_surveillance_template.js';

describe('CCTV Surveillance Template', () => {
  it('should have valid metadata and 3:4 canvas configuration', () => {
    assert.strictEqual(cctvSurveillanceTemplate.id, 'cctv_surveillance');
    assert.strictEqual(cctvSurveillanceTemplate.config.canvasWidth, 1200);
    assert.strictEqual(cctvSurveillanceTemplate.config.canvasHeight, 1600);
    assert.strictEqual(typeof cctvSurveillanceTemplate.render, 'function');
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
      drawImage: () => {},
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      font: '',
      textAlign: '',
      textBaseline: '',
      filter: ''
    };

    const mockState = {
      caption: 'FEMALE MUSE',
      subtitle: 'SURVEILLANCE ARCHIVE',
      date: '2026-09-13 // REC.ACTIVE'
    };

    const bounds = { drawX: 0, drawY: 0, drawW: 1200, drawH: 1600 };

    assert.doesNotThrow(() => {
      cctvSurveillanceTemplate.render(mockCtx, null, bounds, mockState);
    });
  });
});
