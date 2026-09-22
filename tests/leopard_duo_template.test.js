import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { leopardDuoTemplate } from '../src/features/templates/leopard_duo_template.js';
import {
  LEOPARD_DUO_SLOTS,
  LEOPARD_FRAME_BOX,
  renderSplitBackdrop,
  renderSlotPhoto,
  renderLeopardAssemblage
} from '../src/features/templates/leopard_duo_helpers.js';
import {
  drawLeopardPattern,
  drawLipstickKiss,
  drawGlitterStar,
  drawDriedFlower
} from '../src/features/templates/leopard_duo_decorations.js';
import { getTemplate } from '../src/features/templates/template_registry.js';

describe('Leopard Chic Duo Template', () => {
  it('should have valid metadata and 9:16 (736x1308) canvas configuration with 2 photos in category 2', () => {
    assert.strictEqual(leopardDuoTemplate.id, 'leopard_duo');
    assert.strictEqual(leopardDuoTemplate.photoCount, 2);
    assert.strictEqual(leopardDuoTemplate.category, '2');
    assert.strictEqual(leopardDuoTemplate.aspectRatio, '9:16');
    assert.strictEqual(leopardDuoTemplate.config.canvasWidth, 736);
    assert.strictEqual(leopardDuoTemplate.config.canvasHeight, 1308);
    assert.ok(leopardDuoTemplate.name.includes('Leopard'));
    assert.ok(typeof leopardDuoTemplate.render === 'function');
  });

  it('should be registered in the global template registry', () => {
    const registered = getTemplate('leopard_duo');
    assert.ok(registered);
    assert.strictEqual(registered.id, 'leopard_duo');
  });

  it('should define 2 precise layout slot coordinates and cheetah frame box', () => {
    assert.strictEqual(LEOPARD_DUO_SLOTS.length, 2);

    const top = LEOPARD_DUO_SLOTS[0];
    const bot = LEOPARD_DUO_SLOTS[1];

    assert.strictEqual(top.x, 49);
    assert.strictEqual(top.y, 212);
    assert.strictEqual(top.w, 482);
    assert.strictEqual(top.h, 339);

    assert.strictEqual(bot.x, 48);
    assert.strictEqual(bot.y, 582);
    assert.strictEqual(bot.w, 482);
    assert.strictEqual(bot.h, 356);

    assert.strictEqual(LEOPARD_FRAME_BOX.x, 25);
    assert.strictEqual(LEOPARD_FRAME_BOX.y, 149);
    assert.strictEqual(LEOPARD_FRAME_BOX.w, 536);
    assert.strictEqual(LEOPARD_FRAME_BOX.h, 830);
  });

  it('should render safely with mock context in various photo configurations', () => {
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
      measureText: () => ({ width: 80 }),
      drawImage: () => {},
      arc: () => {},
      ellipse: () => {},
      translate: () => {},
      rotate: () => {},
      scale: () => {},
      bezierCurveTo: () => {},
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      font: '',
      textAlign: '',
      textBaseline: ''
    };

    const mockPhoto1 = { naturalWidth: 600, naturalHeight: 450, src: 'photo1.jpg' };
    const mockPhoto2 = { naturalWidth: 600, naturalHeight: 450, src: 'photo2.jpg' };

    // 1. Dual photos
    leopardDuoTemplate.render(mockCtx, mockPhoto1, null, {
      isUserUploaded: true,
      photos: [mockPhoto1, mockPhoto2]
    });

    // 2. Single photo duplicated
    leopardDuoTemplate.render(mockCtx, mockPhoto1, null, {
      isUserUploaded: true,
      photos: [mockPhoto1]
    });

    // 3. Null photos fallback
    leopardDuoTemplate.render(mockCtx, null, null, {
      isUserUploaded: true,
      photos: []
    });

    // 4. Reference fallback
    leopardDuoTemplate.render(mockCtx, { src: 'assets/leopard_duo_reference.png' }, null, {
      isUserUploaded: false
    });
  });

  it('should execute helper and decoration routines safely without throwing', () => {
    const mockCtx = {
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      closePath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      arc: () => {},
      ellipse: () => {},
      stroke: () => {},
      rect: () => {},
      clip: () => {},
      fill: () => {},
      fillRect: () => {},
      strokeRect: () => {},
      fillText: () => {},
      translate: () => {},
      rotate: () => {},
      scale: () => {},
      bezierCurveTo: () => {}
    };

    renderSplitBackdrop(mockCtx, 736, 1308);
    renderSlotPhoto(mockCtx, null, LEOPARD_DUO_SLOTS[0]);
    drawLeopardPattern(mockCtx, 25, 149, 536, 830);
    drawLipstickKiss(mockCtx, 105, 955);
    drawGlitterStar(mockCtx, 635, 310, 18, 8);
    drawDriedFlower(mockCtx, 560, 645, 85);
    renderLeopardAssemblage(mockCtx, [null, null]);
  });
});
