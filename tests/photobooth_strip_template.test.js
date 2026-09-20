import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { photoboothStripTemplate } from '../src/features/templates/photobooth_strip_template.js';
import { getTemplate } from '../src/features/templates/template_registry.js';
import {
  PHOTOBOOTH_STRIP_SLOTS,
  renderHeroPortrait,
  renderStripFrame
} from '../src/features/templates/photobooth_strip_helpers.js';
import {
  renderStripShadow,
  renderParchmentTexture,
  renderStripFooter
} from '../src/features/templates/photobooth_strip_decorations.js';

describe('Vintage Photobooth Split Strip Template', () => {
  it('should have valid metadata and native 9:16 (736x1308) canvas configuration with 5 photos', () => {
    assert.strictEqual(photoboothStripTemplate.id, 'photobooth_strip');
    assert.strictEqual(photoboothStripTemplate.name, 'Vintage Photobooth Split Strip');
    assert.strictEqual(photoboothStripTemplate.aspectRatio, '9:16');
    assert.strictEqual(photoboothStripTemplate.photoCount, 5);
    assert.strictEqual(photoboothStripTemplate.category, '5');
    assert.strictEqual(photoboothStripTemplate.config.canvasWidth, 736);
    assert.strictEqual(photoboothStripTemplate.config.canvasHeight, 1308);
    assert.strictEqual(PHOTOBOOTH_STRIP_SLOTS.length, 5);
  });

  it('should be registered in the global template registry', () => {
    const registered = getTemplate('photobooth_strip');
    assert.ok(registered, 'photobooth_strip should be registered in template registry');
    assert.strictEqual(registered.id, 'photobooth_strip');
    assert.strictEqual(registered.category, '5');
  });

  it('should define precise slot coordinates for hero panel and 4 photobooth frames', () => {
    const [hero, f1, f2, f3, f4] = PHOTOBOOTH_STRIP_SLOTS;

    // Slot 0: Full height left hero portrait
    assert.strictEqual(hero.id, 0);
    assert.strictEqual(hero.x, 0);
    assert.strictEqual(hero.y, 0);
    assert.strictEqual(hero.w, 380);
    assert.strictEqual(hero.h, 1308);

    // Slots 1 to 4: Stacked frames inside right parchment strip
    assert.strictEqual(f1.id, 1);
    assert.strictEqual(f1.x, 400);
    assert.strictEqual(f1.y, 16);
    assert.strictEqual(f1.w, 316);
    assert.strictEqual(f1.h, 260);

    assert.strictEqual(f2.id, 2);
    assert.strictEqual(f2.x, 400);
    assert.strictEqual(f2.y, 292);
    assert.strictEqual(f2.w, 316);
    assert.strictEqual(f2.h, 260);

    assert.strictEqual(f3.id, 3);
    assert.strictEqual(f3.x, 400);
    assert.strictEqual(f3.y, 568);
    assert.strictEqual(f3.w, 316);
    assert.strictEqual(f3.h, 260);

    assert.strictEqual(f4.id, 4);
    assert.strictEqual(f4.x, 400);
    assert.strictEqual(f4.y, 844);
    assert.strictEqual(f4.w, 316);
    assert.strictEqual(f4.h, 260);
  });

  it('should render safely with mock context in various photo configurations', () => {
    const createMockContext = () => ({
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      closePath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      rect: () => {},
      fillRect: () => {},
      strokeRect: () => {},
      stroke: () => {},
      fill: () => {},
      clip: () => {},
      drawImage: () => {},
      fillText: () => {},
      createLinearGradient: () => ({ addColorStop: () => {} })
    });

    const mockPhoto = { width: 600, height: 800, naturalWidth: 600, naturalHeight: 800 };
    const mockCtx = createMockContext();

    // 1. Single photo fallback
    assert.doesNotThrow(() => {
      photoboothStripTemplate.render(mockCtx, mockPhoto, null, {
        caption: 'PHOTOBOOTH',
        subtitle: 'STUDIO ARCHIVE',
        date: 'NO. 0824 // 2026'
      });
    });

    // 2. 5-photo array
    assert.doesNotThrow(() => {
      photoboothStripTemplate.render(mockCtx, null, null, {
        photoImgs: [mockPhoto, mockPhoto, mockPhoto, mockPhoto, mockPhoto],
        isUserUploaded: true,
        caption: 'PHOTOBOOTH',
        subtitle: 'SUMMER TRIP',
        date: '2026.09.20'
      });
    });

    // 3. Null photo graceful fallback
    assert.doesNotThrow(() => {
      photoboothStripTemplate.render(mockCtx, null, null, {});
    });
  });

  it('should execute helper drawing routines safely without throwing', () => {
    const createMockContext = () => ({
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      closePath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      rect: () => {},
      fillRect: () => {},
      strokeRect: () => {},
      stroke: () => {},
      fill: () => {},
      clip: () => {},
      drawImage: () => {},
      fillText: () => {},
      createLinearGradient: () => ({ addColorStop: () => {} })
    });

    const mockCtx = createMockContext();
    const mockPhoto = { naturalWidth: 400, naturalHeight: 300 };

    assert.doesNotThrow(() => renderHeroPortrait(mockCtx, mockPhoto, PHOTOBOOTH_STRIP_SLOTS[0]));
    assert.doesNotThrow(() => renderStripFrame(mockCtx, mockPhoto, PHOTOBOOTH_STRIP_SLOTS[1]));
    assert.doesNotThrow(() => renderStripShadow(mockCtx, 380, 1308));
    assert.doesNotThrow(() => renderParchmentTexture(mockCtx, 380, 0, 356, 1308));
    assert.doesNotThrow(() => renderStripFooter(mockCtx, 380, 0, 356, 1308, { caption: 'TEST' }));
  });
});
