import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { japanTravelDiaryTemplate } from '../src/features/templates/japan_travel_diary_template.js';
import {
  JAPAN_DIARY_SLOTS,
  DEFAULT_DIARY_CAPTIONS,
  renderDiaryBackdrop,
  renderClippedDiaryPhoto,
  renderDiaryCaption
} from '../src/features/templates/japan_travel_diary_helpers.js';
import { getTemplate } from '../src/features/templates/template_registry.js';

describe('Japan Travel Film Diary Template (3:4, 12-Photo)', () => {
  it('should have valid metadata and 3:4 (736x1041) canvas configuration with 12 photos in category 12', () => {
    assert.strictEqual(japanTravelDiaryTemplate.id, 'japan_travel_diary');
    assert.strictEqual(japanTravelDiaryTemplate.name, 'Japan Travel Film Diary');
    assert.strictEqual(japanTravelDiaryTemplate.aspectRatio, '3:4');
    assert.strictEqual(japanTravelDiaryTemplate.category, '12');
    assert.strictEqual(japanTravelDiaryTemplate.photoCount, 12);
    assert.strictEqual(japanTravelDiaryTemplate.config.canvasWidth, 736);
    assert.strictEqual(japanTravelDiaryTemplate.config.canvasHeight, 1041);
    assert.strictEqual(japanTravelDiaryTemplate.previewImage, 'assets/japan_travel_preview.png');
    assert.ok(Array.isArray(japanTravelDiaryTemplate.tags));
    assert.ok(japanTravelDiaryTemplate.tags.includes('japan'));
    assert.ok(japanTravelDiaryTemplate.tags.includes('travel'));
    assert.ok(japanTravelDiaryTemplate.tags.includes('diary'));
  });

  it('should be registered in the global template registry', () => {
    const reg = getTemplate('japan_travel_diary');
    assert.ok(reg);
    assert.strictEqual(reg.id, 'japan_travel_diary');
  });

  it('should define 12 precise 35mm film layout slot coordinates across 4 rows and 3 columns', () => {
    assert.strictEqual(JAPAN_DIARY_SLOTS.length, 12);
    assert.strictEqual(DEFAULT_DIARY_CAPTIONS.length, 12);

    const slot0 = JAPAN_DIARY_SLOTS[0];
    assert.strictEqual(slot0.id, 0);
    assert.strictEqual(slot0.x, 40);
    assert.strictEqual(slot0.y, 44);
    assert.strictEqual(slot0.w, 201);
    assert.strictEqual(slot0.h, 134);

    const slot1 = JAPAN_DIARY_SLOTS[1];
    assert.strictEqual(slot1.id, 1);
    assert.strictEqual(slot1.x, 267);
    assert.strictEqual(slot1.y, 44);
    assert.strictEqual(slot1.w, 201);
    assert.strictEqual(slot1.h, 134);

    const slot11 = JAPAN_DIARY_SLOTS[11];
    assert.strictEqual(slot11.id, 11);
    assert.strictEqual(slot11.x, 494);
    assert.strictEqual(slot11.y, 710);
    assert.strictEqual(slot11.w, 201);
    assert.strictEqual(slot11.h, 134);
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
      clip() {},
      fill() {},
      stroke() {},
      fillRect() {},
      strokeRect() {},
      fillText() {},
      strokeText() {},
      measureText() { return { width: 40 }; },
      drawImage() {},
      createLinearGradient() {
        return { addColorStop() {} };
      },
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      font: '',
      textAlign: '',
      textBaseline: ''
    };

    const mockImg = {
      src: 'assets/japan_travel_reference.png',
      width: 736,
      height: 1041,
      naturalWidth: 736,
      naturalHeight: 1041
    };

    // 1. Reference preview fallback
    assert.doesNotThrow(() => {
      japanTravelDiaryTemplate.render(mockCtx, mockImg, null, { isUserUploaded: false });
    });

    // 2. User uploaded with empty photos array
    assert.doesNotThrow(() => {
      japanTravelDiaryTemplate.render(mockCtx, null, null, { isUserUploaded: true, photoImgs: [] });
    });

    // 3. User uploaded with 1 photo (cyclic fallback)
    assert.doesNotThrow(() => {
      japanTravelDiaryTemplate.render(mockCtx, mockImg, null, {
        isUserUploaded: true,
        photoImgs: [mockImg]
      });
    });

    // 4. User uploaded with 12 photos and custom captions
    const twelvePhotos = new Array(12).fill(mockImg);
    const customCaptions = new Array(12).fill('Tokyo Trip 2026');
    assert.doesNotThrow(() => {
      japanTravelDiaryTemplate.render(mockCtx, mockImg, null, {
        isUserUploaded: true,
        photoImgs: twelvePhotos,
        captions: customCaptions
      });
    });
  });

  it('should execute helper routines safely without throwing', () => {
    const mockCtx = {
      save() {},
      restore() {},
      beginPath() {},
      rect() {},
      clip() {},
      fillRect() {},
      fillText() {},
      drawImage() {}
    };

    assert.doesNotThrow(() => {
      renderDiaryBackdrop(mockCtx, 736, 1041);
      renderClippedDiaryPhoto(mockCtx, null, JAPAN_DIARY_SLOTS[0]);
      renderClippedDiaryPhoto(mockCtx, { width: 100, height: 100 }, JAPAN_DIARY_SLOTS[0], { zoom: 1.2, panX: 5, panY: -5 });
      renderDiaryCaption(mockCtx, 'Test\nLine 2', JAPAN_DIARY_SLOTS[0]);
    });
  });
});
