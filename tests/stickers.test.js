import { describe, it } from 'node:test';
import assert from 'node:assert';
import { STICKER_TYPES, createStickerInstance } from '../src/features/stickers/sticker_types.js';
import { renderStickerOnCanvas } from '../src/features/stickers/sticker_renderer.js';
import { initStickerManager } from '../src/features/stickers/sticker_manager.js';

describe('Stickers & Tape Stamp Engine', () => {
  it('should define rich aesthetic sticker collection', () => {
    assert.ok(STICKER_TYPES.washi_cream);
    assert.ok(STICKER_TYPES.washi_pink);
    assert.ok(STICKER_TYPES.postal_stamp);
    assert.ok(STICKER_TYPES.barcode);
    assert.ok(STICKER_TYPES.sparkle_star);
    assert.ok(STICKER_TYPES.heart_doodle);
    assert.ok(STICKER_TYPES.date_badge);
    assert.ok(STICKER_TYPES.film_mark);
  });

  it('should create sticker instances with unique ID and coordinates', () => {
    const s1 = createStickerInstance('washi_cream', 100, 200);
    const s2 = createStickerInstance('barcode', 300, 400);

    assert.notStrictEqual(s1.id, s2.id);
    assert.strictEqual(s1.x, 100);
    assert.strictEqual(s1.y, 200);
    assert.strictEqual(s2.type, 'barcode');
  });

  it('should render sticker safely onto mock context without throwing', () => {
    const mockCtx = {
      save() {},
      restore() {},
      translate() {},
      rotate() {},
      scale() {},
      beginPath() {},
      moveTo() {},
      lineTo() {},
      closePath() {},
      fill() {},
      stroke() {},
      fillRect() {},
      strokeRect() {},
      fillText() {},
      arc() {},
      quadraticCurveTo() {},
      bezierCurveTo() {},
      roundRect() {}
    };

    Object.keys(STICKER_TYPES).forEach((type) => {
      const sticker = createStickerInstance(type, 200, 300);
      assert.doesNotThrow(() => {
        renderStickerOnCanvas(mockCtx, sticker);
      });
    });
  });

  it('should initialize sticker manager and render chips and empty list', () => {
    const chipChildren = [];
    const listChildren = [];

    const chipsContainer = {
      innerHTML: '',
      appendChild: (c) => chipChildren.push(c)
    };
    const listContainer = {
      innerHTML: '',
      appendChild: (c) => listChildren.push(c)
    };

    globalThis.document = {
      createElement: () => ({
        dataset: {},
        classList: { add() {} },
        addEventListener() {}
      })
    };

    const manager = initStickerManager({
      chipsContainer,
      listContainer,
      getState: () => ({ stickers: [] }),
      updateState: () => {}
    });

    assert.strictEqual(chipChildren.length, Object.keys(STICKER_TYPES).length);
    assert.strictEqual(listChildren.length, 1);
    assert.strictEqual(typeof manager.renderList, 'function');
  });
});
