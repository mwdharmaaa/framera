import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { midnightFormulaTemplate } from '../src/features/templates/midnight_formula_template.js';
import {
  MIDNIGHT_FORMULA_SLOTS,
  renderFormulaBackground,
  renderFormulaCard,
  drawMusicPlayerWidget
} from '../src/features/templates/midnight_formula_helpers.js';
import {
  drawMidnightLilies,
  drawLilyFlower
} from '../src/features/templates/midnight_formula_decorations.js';
import { getTemplate } from '../src/features/templates/template_registry.js';

describe('Midnight Formula Quad Template', () => {
  it('should have valid metadata and native 9:16 (736x1308) canvas configuration with 4 photos in category 4', () => {
    assert.strictEqual(midnightFormulaTemplate.id, 'midnight_formula');
    assert.strictEqual(midnightFormulaTemplate.name, 'Midnight Formula');
    assert.strictEqual(midnightFormulaTemplate.aspectRatio, '9:16');
    assert.strictEqual(midnightFormulaTemplate.photoCount, 4);
    assert.strictEqual(midnightFormulaTemplate.category, '4');
    assert.strictEqual(midnightFormulaTemplate.config.canvasWidth, 736);
    assert.strictEqual(midnightFormulaTemplate.config.canvasHeight, 1308);
    assert.strictEqual(typeof midnightFormulaTemplate.render, 'function');
  });

  it('should be registered in the global template registry', () => {
    const tpl = getTemplate('midnight_formula');
    assert.ok(tpl, 'Template should exist in registry');
    assert.strictEqual(tpl.id, 'midnight_formula');
    assert.strictEqual(tpl.category, '4');
  });

  it('should define 4 precise layout slot coordinates matching the reference composition', () => {
    assert.strictEqual(MIDNIGHT_FORMULA_SLOTS.length, 4);

    // Slot 0: Top hero portrait
    assert.strictEqual(MIDNIGHT_FORMULA_SLOTS[0].x, 0);
    assert.strictEqual(MIDNIGHT_FORMULA_SLOTS[0].y, 0);
    assert.strictEqual(MIDNIGHT_FORMULA_SLOTS[0].w, 736);
    assert.strictEqual(MIDNIGHT_FORMULA_SLOTS[0].h, 485);

    // Slot 1: Center crop on right
    assert.strictEqual(MIDNIGHT_FORMULA_SLOTS[1].x, 235);
    assert.strictEqual(MIDNIGHT_FORMULA_SLOTS[1].y, 485);
    assert.strictEqual(MIDNIGHT_FORMULA_SLOTS[1].w, 501);
    assert.strictEqual(MIDNIGHT_FORMULA_SLOTS[1].h, 360);

    // Slot 2: Bottom left detail
    assert.strictEqual(MIDNIGHT_FORMULA_SLOTS[2].x, 0);
    assert.strictEqual(MIDNIGHT_FORMULA_SLOTS[2].y, 845);
    assert.strictEqual(MIDNIGHT_FORMULA_SLOTS[2].w, 405);
    assert.strictEqual(MIDNIGHT_FORMULA_SLOTS[2].h, 463);

    // Slot 3: Bottom right portrait
    assert.strictEqual(MIDNIGHT_FORMULA_SLOTS[3].x, 395);
    assert.strictEqual(MIDNIGHT_FORMULA_SLOTS[3].y, 845);
    assert.strictEqual(MIDNIGHT_FORMULA_SLOTS[3].w, 341);
    assert.strictEqual(MIDNIGHT_FORMULA_SLOTS[3].h, 463);
  });

  it('should render safely with mock context in various photo configurations', () => {
    const mockCtx = {
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      closePath: () => {},
      rect: () => {},
      roundRect: () => {},
      strokeRect: () => {},
      fillRect: () => {},
      fillText: () => {},
      drawImage: () => {},
      clip: () => {},
      stroke: () => {},
      fill: () => {},
      translate: () => {},
      rotate: () => {},
      moveTo: () => {},
      lineTo: () => {},
      bezierCurveTo: () => {},
      quadraticCurveTo: () => {},
      arc: () => {},
      ellipse: () => {},
      createLinearGradient: () => ({ addColorStop: () => {} }),
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 0,
      font: '',
      textAlign: '',
      textBaseline: '',
      shadowColor: '',
      shadowBlur: 0,
      shadowOffsetY: 0
    };

    const mockBounds = { drawX: 0, drawY: 0, drawW: 736, drawH: 1308 };
    const mockPhoto = { width: 600, height: 400 };

    // 1. Initial click reference state
    let directDrawCalled = false;
    const directCtx = {
      ...mockCtx,
      drawImage: () => { directDrawCalled = true; }
    };
    assert.doesNotThrow(() => {
      midnightFormulaTemplate.render(directCtx, mockPhoto, mockBounds, {
        isUserUploaded: false
      });
    });
    assert.strictEqual(directDrawCalled, true);

    // 2. 4 photos array
    assert.doesNotThrow(() => {
      midnightFormulaTemplate.render(mockCtx, mockPhoto, mockBounds, {
        isUserUploaded: true,
        photoImgs: [mockPhoto, mockPhoto, mockPhoto, mockPhoto],
        caption: 'formula',
        subtitle: 'labyrinth'
      });
    });

    // 3. 3 photos array
    assert.doesNotThrow(() => {
      midnightFormulaTemplate.render(mockCtx, mockPhoto, mockBounds, {
        isUserUploaded: true,
        photoImgs: [mockPhoto, mockPhoto, mockPhoto]
      });
    });

    // 4. 2 photos array
    assert.doesNotThrow(() => {
      midnightFormulaTemplate.render(mockCtx, mockPhoto, mockBounds, {
        isUserUploaded: true,
        photoImgs: [mockPhoto, mockPhoto]
      });
    });

    // 5. 1 photo array
    assert.doesNotThrow(() => {
      midnightFormulaTemplate.render(mockCtx, mockPhoto, mockBounds, {
        isUserUploaded: true,
        photoImgs: [mockPhoto]
      });
    });

    // 6. Single img fallback
    assert.doesNotThrow(() => {
      midnightFormulaTemplate.render(mockCtx, mockPhoto, mockBounds, {
        isUserUploaded: true
      });
    });
  });

  it('should execute helper and decoration routines safely', () => {
    const mockCtx = {
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      closePath: () => {},
      rect: () => {},
      roundRect: () => {},
      strokeRect: () => {},
      fillRect: () => {},
      fillText: () => {},
      drawImage: () => {},
      clip: () => {},
      stroke: () => {},
      fill: () => {},
      translate: () => {},
      rotate: () => {},
      moveTo: () => {},
      lineTo: () => {},
      bezierCurveTo: () => {},
      quadraticCurveTo: () => {},
      arc: () => {},
      ellipse: () => {},
      createLinearGradient: () => ({ addColorStop: () => {} }),
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 0,
      font: '',
      textAlign: '',
      textBaseline: '',
      shadowColor: '',
      shadowBlur: 0,
      shadowOffsetY: 0
    };

    assert.doesNotThrow(() => renderFormulaBackground(mockCtx, 736, 1308));
    assert.doesNotThrow(() => renderFormulaCard(mockCtx, { width: 100, height: 100 }, MIDNIGHT_FORMULA_SLOTS[0]));
    assert.doesNotThrow(() => drawMusicPlayerWidget(mockCtx, { width: 100, height: 100 }, { caption: 'formula', subtitle: 'labyrinth' }));
    assert.doesNotThrow(() => drawLilyFlower(mockCtx, 100, 100, 60, 0, 'lavender'));
    assert.doesNotThrow(() => drawMidnightLilies(mockCtx, 736, 1308));
  });
});
