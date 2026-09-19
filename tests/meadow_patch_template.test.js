import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { meadowPatchTemplate } from '../src/features/templates/meadow_patch_template.js';
import { getTemplate } from '../src/features/templates/template_registry.js';
import {
  MEADOW_PATCH_SLOTS,
  renderMeadowSlotPhoto,
  renderCenterTiltedCard,
  renderStitchedClothPatch,
  renderHibiscusFlower
} from '../src/features/templates/meadow_patch_helpers.js';

describe('Love Patch Meadow Trio Template', () => {
  it('should have valid metadata and native 9:16 (736x1308) canvas configuration with 3 photos', () => {
    assert.strictEqual(meadowPatchTemplate.id, 'meadow_patch_trio');
    assert.strictEqual(meadowPatchTemplate.name, 'Love Patch Meadow Trio');
    assert.strictEqual(meadowPatchTemplate.aspectRatio, '9:16');
    assert.strictEqual(meadowPatchTemplate.photoCount, 3);
    assert.strictEqual(meadowPatchTemplate.category, '3');
    assert.strictEqual(meadowPatchTemplate.config.canvasWidth, 736);
    assert.strictEqual(meadowPatchTemplate.config.canvasHeight, 1308);
    assert.strictEqual(MEADOW_PATCH_SLOTS.length, 3);
  });

  it('should be registered in the global template registry', () => {
    const registered = getTemplate('meadow_patch_trio');
    assert.ok(registered, 'meadow_patch_trio should be registered in template registry');
    assert.strictEqual(registered.id, 'meadow_patch_trio');
    assert.strictEqual(registered.category, '3');
  });

  it('should define precise slot coordinates for top, center card, and bottom slots', () => {
    const [topSlot, centerCard, bottomSlot] = MEADOW_PATCH_SLOTS;

    // Top Meadow
    assert.strictEqual(topSlot.id, 0);
    assert.strictEqual(topSlot.x, 0);
    assert.strictEqual(topSlot.y, 0);
    assert.strictEqual(topSlot.w, 736);

    // Center Tilted Card
    assert.strictEqual(centerCard.id, 1);
    assert.strictEqual(centerCard.cx, 280);
    assert.strictEqual(centerCard.cy, 655);
    assert.strictEqual(centerCard.w, 460);
    assert.strictEqual(centerCard.h, 360);

    // Bottom Forest
    assert.strictEqual(bottomSlot.id, 2);
    assert.strictEqual(bottomSlot.x, 0);
    assert.strictEqual(bottomSlot.w, 736);
  });

  it('should render safely with mock context in various photo configurations', () => {
    const mockCtx = {
      save() {},
      restore() {},
      fillRect() {},
      strokeRect() {},
      beginPath() {},
      rect() {},
      fill() {},
      stroke() {},
      clip() {},
      drawImage() {},
      fillText() {},
      translate() {},
      rotate() {},
      setLineDash() {},
      arc() {},
      ellipse() {},
      moveTo() {},
      lineTo() {},
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
      src: 'assets/meadow_patch_reference.jpg',
      naturalWidth: 736,
      naturalHeight: 1308,
      width: 736,
      height: 1308
    };

    // 1. Initial reference preview mode
    assert.doesNotThrow(() => {
      meadowPatchTemplate.render(mockCtx, mockImg, {}, { isUserUploaded: false });
    });

    // 2. Full 3-photo user upload state
    const photos3 = [
      { width: 600, height: 600, naturalWidth: 600, naturalHeight: 600 },
      { width: 600, height: 600, naturalWidth: 600, naturalHeight: 600 },
      { width: 600, height: 600, naturalWidth: 600, naturalHeight: 600 }
    ];

    assert.doesNotThrow(() => {
      meadowPatchTemplate.render(mockCtx, photos3[0], {}, {
        isUserUploaded: true,
        photoImgs: photos3,
        caption: 'PRETTY',
        subtitle: 'SUMMER'
      });
    });

    // 3. Partial upload with 2 photos
    assert.doesNotThrow(() => {
      meadowPatchTemplate.render(mockCtx, photos3[0], {}, {
        isUserUploaded: true,
        photoImgs: [photos3[0], photos3[1]]
      });
    });

    // 4. Single photo upload fallback
    assert.doesNotThrow(() => {
      meadowPatchTemplate.render(mockCtx, photos3[0], {}, {
        isUserUploaded: true,
        photoImgs: [photos3[0]]
      });
    });

    // 5. Null photo fallback
    assert.doesNotThrow(() => {
      meadowPatchTemplate.render(mockCtx, null, {}, {
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
      fill() {},
      stroke() {},
      clip() {},
      drawImage() {},
      fillText() {},
      translate() {},
      rotate() {},
      setLineDash() {},
      arc() {},
      ellipse() {},
      moveTo() {},
      lineTo() {}
    };

    const photo = { naturalWidth: 500, naturalHeight: 500, width: 500, height: 500 };

    assert.doesNotThrow(() => {
      renderMeadowSlotPhoto(mockCtx, photo, MEADOW_PATCH_SLOTS[0]);
      renderMeadowSlotPhoto(null, photo, MEADOW_PATCH_SLOTS[0]);
      renderCenterTiltedCard(mockCtx, photo, MEADOW_PATCH_SLOTS[1]);
      renderCenterTiltedCard(null, photo, MEADOW_PATCH_SLOTS[1]);
      renderStitchedClothPatch(mockCtx, { caption: 'Love', subtitle: 'Story' });
      renderStitchedClothPatch(null);
      renderHibiscusFlower(mockCtx, 65, 520, 38);
      renderHibiscusFlower(null);
    });
  });
});
