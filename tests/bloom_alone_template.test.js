import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { bloomAloneTemplate } from '../src/features/templates/bloom_alone_template.js';
import {
  drawHopeGangBadge,
  drawBloomFlower,
  drawChunkyHeadline
} from '../src/features/templates/bloom_alone_helpers.js';

describe('Bloom Alone 1-Photo Template', () => {
  it('should have valid metadata and 1:1 canvas configuration for 1 photo', () => {
    assert.strictEqual(bloomAloneTemplate.id, 'bloom_alone');
    assert.strictEqual(bloomAloneTemplate.photoCount, 1);
    assert.strictEqual(bloomAloneTemplate.category, '1');
    assert.strictEqual(bloomAloneTemplate.aspectRatio, '1:1');
    assert.strictEqual(bloomAloneTemplate.config.canvasWidth, 1080);
    assert.strictEqual(bloomAloneTemplate.config.canvasHeight, 1080);
    assert.strictEqual(typeof bloomAloneTemplate.render, 'function');
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
      arc: () => {},
      rect: () => {},
      clip: () => {},
      fill: () => {},
      stroke: () => {},
      fillRect: () => {},
      strokeRect: () => {},
      fillText: () => {},
      strokeText: () => {},
      drawImage: () => {},
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
      shadowOffsetY: 0,
      lineJoin: '',
      lineCap: ''
    };

    const mockState = {
      caption: 'ITS OKAY\nTO BLOOM\nALONE',
      subtitle: 'HOPE GANG',
      date: '2026'
    };

    const bounds = { drawX: 0, drawY: 0, drawW: 1080, drawH: 1080 };

    assert.doesNotThrow(() => {
      bloomAloneTemplate.render(mockCtx, null, bounds, mockState);
    });

    const mockImg = { naturalWidth: 1080, naturalHeight: 1080, width: 1080, height: 1080 };
    assert.doesNotThrow(() => {
      bloomAloneTemplate.render(mockCtx, mockImg, bounds, mockState);
    });
  });

  it('should execute helper routines without throwing', () => {
    const mockCtx = {
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      closePath: () => {},
      arc: () => {},
      ellipse: () => {},
      fill: () => {},
      stroke: () => {},
      fillRect: () => {},
      strokeRect: () => {},
      fillText: () => {},
      strokeText: () => {},
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      font: '',
      textAlign: '',
      textBaseline: '',
      shadowColor: '',
      shadowBlur: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      lineJoin: '',
      lineCap: ''
    };

    assert.doesNotThrow(() => {
      drawHopeGangBadge(mockCtx, 80, 900);
      drawBloomFlower(mockCtx, 500, 500, 40);
      drawChunkyHeadline(mockCtx, 'TEST\nLINE', 500, 200);
    });

    assert.ok(mockCtx.font.includes('Chewy'));
  });
});
