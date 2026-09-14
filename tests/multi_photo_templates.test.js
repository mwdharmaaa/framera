import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { filmstripDuoTemplate } from '../src/features/templates/filmstrip_duo_template.js';
import { diptychDuoTemplate } from '../src/features/templates/diptych_duo_template.js';
import { photoboothTrioTemplate } from '../src/features/templates/photobooth_trio_template.js';
import { cinemaTriptychTemplate } from '../src/features/templates/cinema_triptych_template.js';
import { photoboothQuadTemplate } from '../src/features/templates/photobooth_quad_template.js';
import { quadGridTemplate } from '../src/features/templates/quad_grid_template.js';

describe('Multi-Photo Templates Suite (2, 3, 4 Foto)', () => {
  const createMockCtx = () => ({
    save: () => {},
    restore: () => {},
    beginPath: () => {},
    closePath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    bezierCurveTo: () => {},
    quadraticCurveTo: () => {},
    rect: () => {},
    roundRect: () => {},
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
    measureText: () => ({ width: 120 }),
    createLinearGradient: () => ({ addColorStop: () => {} }),
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    font: '',
    textAlign: '',
    textBaseline: '',
    letterSpacing: '',
    shadowColor: '',
    shadowBlur: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0
  });

  const mockBounds = { drawX: 0, drawY: 0, drawW: 1200, drawH: 1600 };
  const mockState = {
    caption: 'STUDIO TEST',
    subtitle: 'High resolution testing',
    date: '2026.09.14',
    photos: [
      { naturalWidth: 800, naturalHeight: 800, width: 800, height: 800 },
      { naturalWidth: 800, naturalHeight: 800, width: 800, height: 800 },
      { naturalWidth: 800, naturalHeight: 800, width: 800, height: 800 },
      { naturalWidth: 800, naturalHeight: 800, width: 800, height: 800 }
    ]
  };

  it('2-Foto templates should have correct metadata and render safely', () => {
    assert.strictEqual(filmstripDuoTemplate.photoCount, 2);
    assert.strictEqual(filmstripDuoTemplate.id, 'filmstrip_duo');
    assert.strictEqual(diptychDuoTemplate.photoCount, 2);
    assert.strictEqual(diptychDuoTemplate.id, 'diptych_duo');

    const ctx = createMockCtx();
    assert.doesNotThrow(() => {
      filmstripDuoTemplate.render(ctx, null, mockBounds, mockState);
      diptychDuoTemplate.render(ctx, null, mockBounds, mockState);
    });
  });

  it('3-Foto templates should have correct metadata and render safely', () => {
    assert.strictEqual(photoboothTrioTemplate.photoCount, 3);
    assert.strictEqual(photoboothTrioTemplate.id, 'photobooth_trio');
    assert.strictEqual(cinemaTriptychTemplate.photoCount, 3);
    assert.strictEqual(cinemaTriptychTemplate.id, 'cinema_triptych');

    const ctx = createMockCtx();
    assert.doesNotThrow(() => {
      photoboothTrioTemplate.render(ctx, null, mockBounds, mockState);
      cinemaTriptychTemplate.render(ctx, null, mockBounds, mockState);
    });
  });

  it('4-Foto templates should have correct metadata and render safely', () => {
    assert.strictEqual(photoboothQuadTemplate.photoCount, 4);
    assert.strictEqual(photoboothQuadTemplate.id, 'photobooth_quad');
    assert.strictEqual(quadGridTemplate.photoCount, 4);
    assert.strictEqual(quadGridTemplate.id, 'quad_grid');

    const ctx = createMockCtx();
    assert.doesNotThrow(() => {
      photoboothQuadTemplate.render(ctx, null, mockBounds, mockState);
      quadGridTemplate.render(ctx, null, mockBounds, mockState);
    });
  });
});
