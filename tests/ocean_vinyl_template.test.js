import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { oceanVinylTemplate } from '../src/features/templates/ocean_vinyl_template.js';
import {
  OCEAN_POLAROID_SLOTS,
  renderOceanPolaroidPhoto,
  renderOceanVinylBackground,
  drawOceanVinylTypography,
  getOceanVinylOverlayImage,
  resetOceanVinylOverlayImage
} from '../src/features/templates/ocean_vinyl_helpers.js';
import { getTemplate } from '../src/features/templates/template_registry.js';

describe('Ocean Vinyl Turntable Trio Template', () => {
  it('should have valid metadata and 3:4 canvas configuration with 3 photos', () => {
    assert.strictEqual(oceanVinylTemplate.id, 'ocean_vinyl_trio');
    assert.strictEqual(oceanVinylTemplate.name, 'Ocean Vinyl Turntable Trio');
    assert.strictEqual(oceanVinylTemplate.aspectRatio, '3:4');
    assert.strictEqual(oceanVinylTemplate.photoCount, 3);
    assert.strictEqual(oceanVinylTemplate.category, '3');
    assert.strictEqual(oceanVinylTemplate.config.canvasWidth, 1200);
    assert.strictEqual(oceanVinylTemplate.config.canvasHeight, 1600);
    assert.strictEqual(OCEAN_POLAROID_SLOTS.length, 3);
    assert.strictEqual(typeof oceanVinylTemplate.render, 'function');
  });

  it('should be registered in the global template registry', () => {
    const tpl = getTemplate('ocean_vinyl_trio');
    assert.ok(tpl, 'Template should exist in registry');
    assert.strictEqual(tpl.id, 'ocean_vinyl_trio');
  });

  it('should render safely with mock context in single, multi, and null photo states', () => {
    const mockCtx = {
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      rect: () => {},
      clip: () => {},
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
    const mockPhoto = { width: 800, height: 600 };

    // 1. Single photo
    assert.doesNotThrow(() => {
      oceanVinylTemplate.render(mockCtx, mockPhoto, mockBounds, {
        caption: 'AQUA SIDE A',
        subtitle: 'TURNTABLE // VOL. 04',
        date: '2026'
      });
    });

    // 2. Multi photo array
    assert.doesNotThrow(() => {
      oceanVinylTemplate.render(mockCtx, mockPhoto, mockBounds, {
        photoImgs: [mockPhoto, mockPhoto, mockPhoto]
      });
    });

    // 3. Null photo
    assert.doesNotThrow(() => {
      oceanVinylTemplate.render(mockCtx, null, mockBounds, {});
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
      fillRect: () => {},
      fillText: () => {},
      fillStyle: '',
      font: '',
      textAlign: '',
      letterSpacing: ''
    };

    assert.doesNotThrow(() => renderOceanPolaroidPhoto(mockCtx, { width: 100, height: 100 }, OCEAN_POLAROID_SLOTS[0]));
    assert.doesNotThrow(() => renderOceanPolaroidPhoto(mockCtx, null, OCEAN_POLAROID_SLOTS[0]));
    assert.doesNotThrow(() => renderOceanVinylBackground(mockCtx, 1200, 1600));
    assert.doesNotThrow(() => drawOceanVinylTypography(mockCtx, 1200, 1600, {
      caption: 'CUSTOM TITLE',
      subtitle: 'CUSTOM SUBTITLE',
      date: '2026'
    }));
    assert.doesNotThrow(() => drawOceanVinylTypography(mockCtx, 1200, 1600, {}));

    resetOceanVinylOverlayImage();
    const img = getOceanVinylOverlayImage();
    assert.strictEqual(img, null);
  });
});
