import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { vinylTrioTemplate } from '../src/features/templates/vinyl_trio_template.js';
import {
  getVinylTrioOverlayImage,
  resetVinylTrioOverlayImage,
  POLAROID_SLOTS,
  renderPolaroidPhoto,
  drawPolaroidMarkerText
} from '../src/features/templates/vinyl_trio_helpers.js';
import { getTemplate } from '../src/features/templates/template_registry.js';

describe('Vinyl Record Polaroid Trio Template', () => {
  it('should have valid metadata and 3:4 canvas configuration with 3 photos', () => {
    assert.strictEqual(vinylTrioTemplate.id, 'vinyl_trio');
    assert.strictEqual(vinylTrioTemplate.name, 'Vinyl Record Polaroid Trio');
    assert.strictEqual(vinylTrioTemplate.aspectRatio, '3:4');
    assert.strictEqual(vinylTrioTemplate.photoCount, 3);
    assert.strictEqual(vinylTrioTemplate.config.canvasWidth, 1200);
    assert.strictEqual(vinylTrioTemplate.config.canvasHeight, 1600);
    assert.strictEqual(POLAROID_SLOTS.length, 3);
    assert.strictEqual(typeof vinylTrioTemplate.render, 'function');
  });

  it('should be registered in the global template registry', () => {
    const tpl = getTemplate('vinyl_trio');
    assert.ok(tpl, 'Template should exist in registry');
    assert.strictEqual(tpl.id, 'vinyl_trio');
  });

  it('should render safely with single photo, multi-photo array, and mock context without throwing', () => {
    const mockCtx = {
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      closePath: () => {},
      rect: () => {},
      clip: () => {},
      fill: () => {},
      stroke: () => {},
      fillRect: () => {},
      fillText: () => {},
      drawImage: () => {},
      translate: () => {},
      rotate: () => {},
      fillStyle: '',
      font: '',
      textAlign: '',
      letterSpacing: ''
    };

    const mockBounds = { drawX: 0, drawY: 0, drawW: 1200, drawH: 1600 };
    const mockImg = {};

    // Test with single photo
    assert.doesNotThrow(() => {
      vinylTrioTemplate.render(mockCtx, mockImg, mockBounds, {
        caption: 'SIDE A TRACK 01',
        subtitle: 'ACOUSTIC',
        date: '2026'
      });
    });

    // Test with multi-photo array in state
    assert.doesNotThrow(() => {
      vinylTrioTemplate.render(mockCtx, mockImg, mockBounds, {
        photoImgs: [mockImg, mockImg, mockImg]
      });
    });

    // Test with null photo
    assert.doesNotThrow(() => {
      vinylTrioTemplate.render(mockCtx, null, mockBounds, {});
    });
  });

  it('should execute helper routines safely without throwing', () => {
    const mockCtx = {
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      rect: () => {},
      clip: () => {},
      drawImage: () => {},
      translate: () => {},
      rotate: () => {},
      fillText: () => {},
      fillStyle: '',
      font: '',
      textAlign: '',
      letterSpacing: ''
    };

    assert.doesNotThrow(() => renderPolaroidPhoto(mockCtx, {}, POLAROID_SLOTS[0]));
    assert.doesNotThrow(() => drawPolaroidMarkerText(mockCtx, 'TEST CAPTION', POLAROID_SLOTS[0].cx, POLAROID_SLOTS[0].cy, POLAROID_SLOTS[0].angle, POLAROID_SLOTS[0].labelY));

    // Test overlay cache and reset
    resetVinylTrioOverlayImage();
    const overlay = getVinylTrioOverlayImage();
    assert.strictEqual(overlay, null);
  });
});
