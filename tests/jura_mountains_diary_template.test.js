import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { juraMountainsDiaryTemplate } from '../src/features/templates/jura_mountains_diary_template.js';
import {
  JURA_SLOT_COORDINATES,
  drawDiaryTitle,
  drawSlotNumbers,
  drawClippedSlotPhoto
} from '../src/features/templates/jura_mountains_diary_helpers.js';
import { filterTemplatesByCategory } from '../src/features/gallery/category_filter.js';

describe('Jura Mountains Diary 9-Photo Editorial Template', () => {
  it('should have valid metadata and 4:5 (736x920) canvas configuration for 9 photos', () => {
    assert.strictEqual(juraMountainsDiaryTemplate.id, 'jura_mountains_diary');
    assert.strictEqual(juraMountainsDiaryTemplate.name, 'Jura Mountains Diary');
    assert.strictEqual(juraMountainsDiaryTemplate.photoCount, 9);
    assert.strictEqual(juraMountainsDiaryTemplate.category, '9');
    assert.strictEqual(juraMountainsDiaryTemplate.aspectRatio, '4:5');
    assert.strictEqual(juraMountainsDiaryTemplate.config.canvasWidth, 736);
    assert.strictEqual(juraMountainsDiaryTemplate.config.canvasHeight, 920);
    assert.strictEqual(juraMountainsDiaryTemplate.config.slots.length, 9);
    assert.strictEqual(typeof juraMountainsDiaryTemplate.render, 'function');
  });

  it('should define precise 3x3 slot coordinates with matching row geometry', () => {
    assert.strictEqual(JURA_SLOT_COORDINATES.length, 9);

    // Row 1
    assert.deepStrictEqual(JURA_SLOT_COORDINATES[0], { x: 0, y: 102, w: 245, h: 190, numberY: 326 });
    assert.deepStrictEqual(JURA_SLOT_COORDINATES[1], { x: 245, y: 102, w: 246, h: 190, numberY: 326 });
    assert.deepStrictEqual(JURA_SLOT_COORDINATES[2], { x: 491, y: 102, w: 245, h: 190, numberY: 326 });

    // Row 2
    assert.deepStrictEqual(JURA_SLOT_COORDINATES[3], { x: 0, y: 365, w: 245, h: 190, numberY: 593 });
    assert.deepStrictEqual(JURA_SLOT_COORDINATES[4], { x: 245, y: 365, w: 246, h: 190, numberY: 593 });
    assert.deepStrictEqual(JURA_SLOT_COORDINATES[5], { x: 491, y: 365, w: 245, h: 190, numberY: 593 });

    // Row 3
    assert.deepStrictEqual(JURA_SLOT_COORDINATES[6], { x: 0, y: 635, w: 245, h: 190, numberY: 863 });
    assert.deepStrictEqual(JURA_SLOT_COORDINATES[7], { x: 245, y: 635, w: 246, h: 190, numberY: 863 });
    assert.deepStrictEqual(JURA_SLOT_COORDINATES[8], { x: 491, y: 635, w: 245, h: 190, numberY: 863 });
  });

  it('should render safely with mock context in single, multi, and null photo states', () => {
    const mockCtx = {
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      closePath: () => {},
      rect: () => {},
      clip: () => {},
      fillRect: () => {},
      fillText: () => {},
      drawImage: () => {},
      fillStyle: '',
      font: '',
      textAlign: '',
      textBaseline: '',
      letterSpacing: ''
    };

    const mockImg = {
      naturalWidth: 800,
      naturalHeight: 600,
      width: 800,
      height: 600
    };

    const bounds = { drawX: 0, drawY: 0, drawW: 736, drawH: 920 };

    // 1. Single photo fallback
    assert.doesNotThrow(() => {
      juraMountainsDiaryTemplate.render(mockCtx, mockImg, bounds, { caption: 'custom trip' });
    });

    // 2. 9-photo array
    const photos9 = Array.from({ length: 9 }, () => mockImg);
    assert.doesNotThrow(() => {
      juraMountainsDiaryTemplate.render(mockCtx, null, bounds, { photoImgs: photos9 });
    });

    // 3. Multi-slot configuration
    const slots9 = JURA_SLOT_COORDINATES.map((slot, idx) => ({
      id: idx,
      img: mockImg,
      zoom: 1.2,
      panX: 5,
      panY: -5
    }));
    assert.doesNotThrow(() => {
      juraMountainsDiaryTemplate.render(mockCtx, null, bounds, { slots: slots9 });
    });

    // 4. Null / empty state
    assert.doesNotThrow(() => {
      juraMountainsDiaryTemplate.render(mockCtx, null, bounds, {});
    });
  });

  it('should execute helper routines cleanly without throwing', () => {
    const mockCtx = {
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      rect: () => {},
      clip: () => {},
      fillRect: () => {},
      fillText: () => {},
      drawImage: () => {}
    };

    assert.doesNotThrow(() => drawDiaryTitle(mockCtx, 'test title'));
    assert.doesNotThrow(() => drawDiaryTitle(null, 'test'));
    assert.doesNotThrow(() => drawSlotNumbers(mockCtx));
    assert.doesNotThrow(() => drawSlotNumbers(null));
    assert.doesNotThrow(() => drawClippedSlotPhoto(mockCtx, null, { x: 0, y: 0, w: 100, h: 100 }));
  });

  it('should be retrievable through category filtering with category 9', () => {
    const templates = [
      juraMountainsDiaryTemplate,
      { id: 'other', photoCount: 1, category: '1' }
    ];
    const filtered = filterTemplatesByCategory(templates, '9');
    assert.strictEqual(filtered.length, 1);
    assert.strictEqual(filtered[0].id, 'jura_mountains_diary');
  });
});
