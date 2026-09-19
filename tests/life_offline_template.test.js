import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { lifeOfflineTemplate } from '../src/features/templates/life_offline_template.js';
import { getTemplate } from '../src/features/templates/template_registry.js';
import {
  LIFE_OFFLINE_SLOTS,
  renderSlotPhoto,
  renderCenterCard,
  drawLifeOfflineTypography
} from '../src/features/templates/life_offline_helpers.js';

describe('Life Offline Outdoor Trio Template', () => {
  it('should have valid metadata and 4:5 (736x920) canvas configuration with 3 photos', () => {
    assert.strictEqual(lifeOfflineTemplate.id, 'life_offline_trio');
    assert.strictEqual(lifeOfflineTemplate.name, 'Life Offline Outdoor Trio');
    assert.strictEqual(lifeOfflineTemplate.aspectRatio, '4:5');
    assert.strictEqual(lifeOfflineTemplate.photoCount, 3);
    assert.strictEqual(lifeOfflineTemplate.category, '3');
    assert.strictEqual(lifeOfflineTemplate.config.canvasWidth, 736);
    assert.strictEqual(lifeOfflineTemplate.config.canvasHeight, 920);
    assert.strictEqual(LIFE_OFFLINE_SLOTS.length, 3);
  });

  it('should be registered in the global template registry', () => {
    const registered = getTemplate('life_offline_trio');
    assert.ok(registered, 'life_offline_trio should be present in registry');
    assert.strictEqual(registered.id, 'life_offline_trio');
    assert.strictEqual(registered.category, '3');
  });

  it('should have accurate slot coordinates for split horizon and center card', () => {
    const [topSlot, bottomSlot, centerSlot] = LIFE_OFFLINE_SLOTS;

    // Top background slot (top half)
    assert.strictEqual(topSlot.id, 0);
    assert.strictEqual(topSlot.x, 0);
    assert.strictEqual(topSlot.y, 0);
    assert.strictEqual(topSlot.w, 736);
    assert.strictEqual(topSlot.h, 460);

    // Bottom background slot (bottom half)
    assert.strictEqual(bottomSlot.id, 1);
    assert.strictEqual(bottomSlot.x, 0);
    assert.strictEqual(bottomSlot.y, 460);
    assert.strictEqual(bottomSlot.w, 736);
    assert.strictEqual(bottomSlot.h, 460);

    // Center floating card
    assert.strictEqual(centerSlot.id, 2);
    assert.strictEqual(centerSlot.x, 140);
    assert.strictEqual(centerSlot.y, 308);
    assert.strictEqual(centerSlot.w, 456);
    assert.strictEqual(centerSlot.h, 304);
    assert.strictEqual(centerSlot.borderWidth, 8);
  });

  it('should render safely with mock context in single, multi, and reference states', () => {
    const mockCtx = {
      save() {},
      restore() {},
      fillRect() {},
      strokeRect() {},
      beginPath() {},
      rect() {},
      clip() {},
      drawImage() {},
      fillText() {},
      font: '',
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      shadowColor: '',
      shadowBlur: 0,
      shadowOffsetY: 0,
      textAlign: '',
      textBaseline: ''
    };

    const mockImg = {
      src: 'assets/life_offline_reference.jpg',
      naturalWidth: 736,
      naturalHeight: 920,
      width: 736,
      height: 920
    };

    // 1. Reference mode before user upload
    assert.doesNotThrow(() => {
      lifeOfflineTemplate.render(mockCtx, mockImg, {}, { isUserUploaded: false });
    });

    // 2. Full 3-photo user upload state
    const photos3 = [
      { width: 1200, height: 800 },
      { width: 1200, height: 800 },
      { width: 800, height: 1200 }
    ];
    assert.doesNotThrow(() => {
      lifeOfflineTemplate.render(mockCtx, photos3[0], {}, {
        isUserUploaded: true,
        photoImgs: photos3,
        caption: 'Life Offline',
        date: '2026 // VOL.01'
      });
    });

    // 3. Fallback for 2 photos
    assert.doesNotThrow(() => {
      lifeOfflineTemplate.render(mockCtx, photos3[0], {}, {
        isUserUploaded: true,
        photoImgs: [photos3[0], photos3[1]]
      });
    });

    // 4. Fallback for 1 photo
    assert.doesNotThrow(() => {
      lifeOfflineTemplate.render(mockCtx, photos3[0], {}, {
        isUserUploaded: true,
        photoImgs: [photos3[0]]
      });
    });

    // 5. Fallback for null photos
    assert.doesNotThrow(() => {
      lifeOfflineTemplate.render(mockCtx, null, {}, {
        isUserUploaded: true,
        photoImgs: []
      });
    });
  });

  it('should execute helper routines safely without throwing', () => {
    const mockCtx = {
      save() {},
      restore() {},
      fillRect() {},
      strokeRect() {},
      beginPath() {},
      rect() {},
      clip() {},
      drawImage() {},
      fillText() {}
    };

    const photo = { naturalWidth: 800, naturalHeight: 600, width: 800, height: 600 };
    const slot = LIFE_OFFLINE_SLOTS[2];

    assert.doesNotThrow(() => {
      renderSlotPhoto(mockCtx, photo, slot);
      renderSlotPhoto(null, photo, slot);
      renderCenterCard(mockCtx, photo, slot);
      renderCenterCard(mockCtx, null, slot);
      renderCenterCard(null, photo, slot);
      drawLifeOfflineTypography(mockCtx, 736, 920, { caption: 'EXPLORE', date: '2026' });
      drawLifeOfflineTypography(mockCtx, 736, 920, {});
      drawLifeOfflineTypography(null, 736, 920, { caption: 'TEST' });
    });
  });
});
