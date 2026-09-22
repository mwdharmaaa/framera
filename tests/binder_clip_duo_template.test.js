import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { binderClipDuoTemplate } from '../src/features/templates/binder_clip_duo_template.js';
import {
  BINDER_CLIP_DUO_SLOTS,
  renderBackdrop,
  renderTopPhoto,
  renderBinderRings,
  renderCenterProse,
  renderBottomPhoto,
  renderPaperclip
} from '../src/features/templates/binder_clip_duo_helpers.js';
import { getTemplate } from '../src/features/templates/template_registry.js';

describe('Binder Clip Journal Duo Template (3:4, B&W 2-Photo)', () => {
  it('should have valid metadata and 3:4 (736x981) canvas configuration with 2 photos in category 2', () => {
    assert.strictEqual(binderClipDuoTemplate.id, 'binder_clip_duo');
    assert.strictEqual(binderClipDuoTemplate.name, 'Binder Clip Journal Duo');
    assert.strictEqual(binderClipDuoTemplate.aspectRatio, '3:4');
    assert.strictEqual(binderClipDuoTemplate.category, '2');
    assert.strictEqual(binderClipDuoTemplate.photoCount, 2);
    assert.strictEqual(binderClipDuoTemplate.config.canvasWidth, 736);
    assert.strictEqual(binderClipDuoTemplate.config.canvasHeight, 981);
    assert.strictEqual(binderClipDuoTemplate.previewImage, 'assets/binder_clip_duo_preview.png');
    assert.ok(binderClipDuoTemplate.tags.includes('bnw'));
    assert.ok(binderClipDuoTemplate.tags.includes('journal'));
  });

  it('should be registered in the global template registry', () => {
    const reg = getTemplate('binder_clip_duo');
    assert.ok(reg);
    assert.strictEqual(reg.id, 'binder_clip_duo');
  });

  it('should define 2 precise layout slot coordinates for top journal print and bottom hero photo', () => {
    assert.strictEqual(BINDER_CLIP_DUO_SLOTS.length, 2);

    const [slot0, slot1] = BINDER_CLIP_DUO_SLOTS;
    assert.strictEqual(slot0.id, 0);
    assert.strictEqual(slot0.x, 144);
    assert.strictEqual(slot0.y, 112);
    assert.strictEqual(slot0.w, 448);
    assert.strictEqual(slot0.h, 284);

    assert.strictEqual(slot1.id, 1);
    assert.strictEqual(slot1.x, 0);
    assert.strictEqual(slot1.y, 490);
    assert.strictEqual(slot1.w, 736);
    assert.strictEqual(slot1.h, 491);
  });

  it('should render safely with mock context in various photo configurations', () => {
    const mockCtx = {
      save() {},
      restore() {},
      beginPath() {},
      closePath() {},
      rect() {},
      arc() {},
      moveTo() {},
      lineTo() {},
      bezierCurveTo() {},
      fill() {},
      stroke() {},
      strokeRect() {},
      fillRect() {},
      fillText() {},
      measureText: () => ({ width: 100 }),
      drawImage() {},
      clip() {},
      translate() {},
      rotate() {},
      createLinearGradient: () => ({ addColorStop() {} }),
      filter: 'none'
    };

    const mockPhoto = { width: 800, height: 600, naturalWidth: 800, naturalHeight: 600 };

    // 1. Dual photos state
    assert.doesNotThrow(() => {
      binderClipDuoTemplate.render(mockCtx, mockPhoto, null, {
        photoImgs: [mockPhoto, mockPhoto],
        slots: [
          { zoom: 1, panX: 0, panY: 0 },
          { zoom: 1.2, panX: 10, panY: -5 }
        ],
        caption: 'Life is made up of small joys: nice food,',
        subtitle: 'gentle breeze, lazy afternoons and peaceful nights.'
      });
    });

    // 2. Single photo fallback state
    assert.doesNotThrow(() => {
      binderClipDuoTemplate.render(mockCtx, mockPhoto, null, {
        photoImg: mockPhoto
      });
    });

    // 3. Null photo placeholder state
    assert.doesNotThrow(() => {
      binderClipDuoTemplate.render(mockCtx, null, null, {});
    });
  });

  it('should execute helper routines safely without throwing', () => {
    const mockCtx = {
      save() {},
      restore() {},
      beginPath() {},
      closePath() {},
      rect() {},
      arc() {},
      moveTo() {},
      lineTo() {},
      bezierCurveTo() {},
      fill() {},
      stroke() {},
      strokeRect() {},
      fillRect() {},
      fillText() {},
      measureText: () => ({ width: 100 }),
      drawImage() {},
      clip() {},
      translate() {},
      rotate() {},
      filter: 'none'
    };

    assert.doesNotThrow(() => renderBackdrop(mockCtx, 736, 981));
    assert.doesNotThrow(() => renderTopPhoto(mockCtx, null, BINDER_CLIP_DUO_SLOTS[0], {}));
    assert.doesNotThrow(() => renderBinderRings(mockCtx));
    assert.doesNotThrow(() => renderCenterProse(mockCtx, 736, {}));
    assert.doesNotThrow(() => renderBottomPhoto(mockCtx, null, BINDER_CLIP_DUO_SLOTS[1], {}));
    assert.doesNotThrow(() => renderPaperclip(mockCtx));
  });
});
