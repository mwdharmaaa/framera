import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { memoryTreeTemplate } from '../src/features/templates/memory_tree_template.js';
import { getTemplate } from '../src/features/templates/template_registry.js';
import {
  MEMORY_TREE_SLOTS,
  getMemoryTreeBackgroundImage,
  resetMemoryTreeBackgroundImage,
  renderTreeBackground,
  renderTreeSnapshotPhoto,
  drawTreeTypography
} from '../src/features/templates/memory_tree_helpers.js';

describe('Memory Tree Deca Story Template', () => {
  it('should have valid metadata and native 9:16 (736x1308) canvas configuration with 10 photos', () => {
    assert.strictEqual(memoryTreeTemplate.id, 'memory_tree_deca');
    assert.strictEqual(memoryTreeTemplate.name, 'Memory Tree Deca Story');
    assert.strictEqual(memoryTreeTemplate.aspectRatio, '9:16');
    assert.strictEqual(memoryTreeTemplate.photoCount, 10);
    assert.strictEqual(memoryTreeTemplate.category, '10');
    assert.strictEqual(memoryTreeTemplate.config.canvasWidth, 736);
    assert.strictEqual(memoryTreeTemplate.config.canvasHeight, 1308);
    assert.strictEqual(MEMORY_TREE_SLOTS.length, 10);
  });

  it('should be registered in the global template registry', () => {
    const registered = getTemplate('memory_tree_deca');
    assert.ok(registered, 'memory_tree_deca should be registered in template registry');
    assert.strictEqual(registered.id, 'memory_tree_deca');
    assert.strictEqual(registered.category, '10');
  });

  it('should have 10 precise slot coordinates across tree branches', () => {
    assert.strictEqual(MEMORY_TREE_SLOTS[0].id, 0);
    assert.strictEqual(MEMORY_TREE_SLOTS[0].x, 294);
    assert.strictEqual(MEMORY_TREE_SLOTS[0].y, 72);

    assert.strictEqual(MEMORY_TREE_SLOTS[9].id, 9);
    assert.strictEqual(MEMORY_TREE_SLOTS[9].x, 22);
    assert.strictEqual(MEMORY_TREE_SLOTS[9].y, 1040);
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
      src: 'assets/memory_tree_reference.jpg',
      naturalWidth: 736,
      naturalHeight: 1308,
      width: 736,
      height: 1308
    };

    // 1. Initial preset reference mode
    assert.doesNotThrow(() => {
      memoryTreeTemplate.render(mockCtx, mockImg, {}, { isUserUploaded: false });
    });

    // 2. Full 10-photo user uploaded state
    const photos10 = Array.from({ length: 10 }, (_, i) => ({
      width: 600,
      height: 600,
      src: `user_photo_${i}.jpg`
    }));
    assert.doesNotThrow(() => {
      memoryTreeTemplate.render(mockCtx, photos10[0], {}, {
        isUserUploaded: true,
        photoImgs: photos10,
        caption: 'Vyborg Trip',
        date: '2026 // VOL.01'
      });
    });

    // 3. Partial upload with cyclic wrap (3 photos across 10 slots)
    assert.doesNotThrow(() => {
      memoryTreeTemplate.render(mockCtx, photos10[0], {}, {
        isUserUploaded: true,
        photoImgs: [photos10[0], photos10[1], photos10[2]]
      });
    });

    // 4. Single photo upload
    assert.doesNotThrow(() => {
      memoryTreeTemplate.render(mockCtx, photos10[0], {}, {
        isUserUploaded: true,
        photoImgs: [photos10[0]]
      });
    });

    // 5. Empty photos array
    assert.doesNotThrow(() => {
      memoryTreeTemplate.render(mockCtx, null, {}, {
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
      fillText() {}
    };

    const photo = { naturalWidth: 400, naturalHeight: 400, width: 400, height: 400 };
    const slot = MEMORY_TREE_SLOTS[0];

    assert.doesNotThrow(() => {
      resetMemoryTreeBackgroundImage();
      getMemoryTreeBackgroundImage();
      renderTreeBackground(mockCtx, photo, 736, 1308);
      renderTreeBackground(null, photo, 736, 1308);
      renderTreeSnapshotPhoto(mockCtx, photo, slot);
      renderTreeSnapshotPhoto(null, photo, slot);
      drawTreeTypography(mockCtx, 736, 1308, { caption: 'Memories', date: '2026' });
      drawTreeTypography(mockCtx, 736, 1308, {});
      drawTreeTypography(null, 736, 1308, { caption: 'Test' });
    });
  });
});
