import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { bnwDuoTemplate } from '../src/features/templates/bnw_duo_template.js';
import { getTemplate } from '../src/features/templates/template_registry.js';
import {
  BNW_DUO_SLOTS,
  renderPaperBackdrop,
  renderVintagePrint,
  renderBnwTypography
} from '../src/features/templates/bnw_duo_helpers.js';
import {
  drawCardPaperFrame,
  drawWornPaperCorner,
  drawSilverGelatinDust
} from '../src/features/templates/bnw_duo_decorations.js';

describe('Analog B&W Vintage Duo Prints 2-Photo Template', () => {
  it('should have valid metadata and native 9:16 (736x1308) canvas configuration with 2 photos', () => {
    assert.strictEqual(bnwDuoTemplate.id, 'bnw_duo_prints');
    assert.strictEqual(bnwDuoTemplate.name, 'Analog B&W Vintage Duo Prints');
    assert.strictEqual(bnwDuoTemplate.aspectRatio, '9:16');
    assert.strictEqual(bnwDuoTemplate.photoCount, 2);
    assert.strictEqual(bnwDuoTemplate.category, '2');
    assert.strictEqual(bnwDuoTemplate.config.canvasWidth, 736);
    assert.strictEqual(bnwDuoTemplate.config.canvasHeight, 1308);
    assert.strictEqual(BNW_DUO_SLOTS.length, 2);
  });

  it('should be registered in the global template registry', () => {
    const registered = getTemplate('bnw_duo_prints');
    assert.ok(registered, 'bnw_duo_prints should be registered in template registry');
    assert.strictEqual(registered.id, 'bnw_duo_prints');
    assert.strictEqual(registered.category, '2');
  });

  it('should define precise slot coordinates for top and bottom vintage print cards', () => {
    const [topPrint, bottomPrint] = BNW_DUO_SLOTS;

    // Top Print (Slot 0)
    assert.strictEqual(topPrint.id, 0);
    assert.strictEqual(topPrint.cardX, 32);
    assert.strictEqual(topPrint.cardY, 175);
    assert.strictEqual(topPrint.cardW, 672);
    assert.strictEqual(topPrint.cardH, 458);
    assert.strictEqual(topPrint.x, 46);
    assert.strictEqual(topPrint.y, 189);
    assert.strictEqual(topPrint.w, 644);
    assert.strictEqual(topPrint.h, 430);

    // Bottom Print (Slot 1)
    assert.strictEqual(bottomPrint.id, 1);
    assert.strictEqual(bottomPrint.cardX, 32);
    assert.strictEqual(bottomPrint.cardY, 653);
    assert.strictEqual(bottomPrint.cardW, 672);
    assert.strictEqual(bottomPrint.cardH, 458);
    assert.strictEqual(bottomPrint.x, 46);
    assert.strictEqual(bottomPrint.y, 667);
    assert.strictEqual(bottomPrint.w, 644);
    assert.strictEqual(bottomPrint.h, 430);
  });

  it('should render safely with mock context without throwing', () => {
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
      drawImage: () => {},
      arc: () => {},
      createRadialGradient: () => ({ addColorStop: () => {} }),
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      font: '',
      textAlign: '',
      textBaseline: '',
      letterSpacing: '',
      shadowColor: '',
      shadowBlur: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      filter: 'none'
    };

    const mockBounds = { drawX: 32, drawY: 175, drawW: 672, drawH: 936 };
    const mockImg1 = { width: 800, height: 600, naturalWidth: 800, naturalHeight: 600 };
    const mockImg2 = { width: 1200, height: 800, naturalWidth: 1200, naturalHeight: 800 };

    // Reference preview render
    assert.doesNotThrow(() => {
      bnwDuoTemplate.render(mockCtx, { src: 'assets/bnw_duo_reference.jpg' }, mockBounds, {});
    });

    // Custom 2-photo render
    assert.doesNotThrow(() => {
      bnwDuoTemplate.render(mockCtx, mockImg1, mockBounds, {
        isUserUploaded: true,
        photoImgs: [mockImg1, mockImg2],
        caption: 'MY BNW STORY',
        subtitle: 'SUMMER MEMORIES',
        date: '2026 // ANALOG'
      });
    });

    // Single photo duplicate fallback
    assert.doesNotThrow(() => {
      bnwDuoTemplate.render(mockCtx, mockImg1, mockBounds, {
        isUserUploaded: true,
        photoImgs: [mockImg1]
      });
    });

    // Empty state render
    assert.doesNotThrow(() => {
      bnwDuoTemplate.render(mockCtx, null, mockBounds, {});
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
      rect: () => {},
      clip: () => {},
      fill: () => {},
      stroke: () => {},
      fillRect: () => {},
      strokeRect: () => {},
      fillText: () => {},
      drawImage: () => {},
      arc: () => {},
      createRadialGradient: () => ({ addColorStop: () => {} })
    };

    assert.doesNotThrow(() => renderPaperBackdrop(mockCtx, 736, 1308));
    assert.doesNotThrow(() => renderVintagePrint(mockCtx, { width: 100, height: 100 }, BNW_DUO_SLOTS[0], true));
    assert.doesNotThrow(() => renderBnwTypography(mockCtx, {}, 736, 1308));
    assert.doesNotThrow(() => drawCardPaperFrame(mockCtx, 32, 175, 672, 458));
    assert.doesNotThrow(() => drawWornPaperCorner(mockCtx, 32, 175, 672));
    assert.doesNotThrow(() => drawSilverGelatinDust(mockCtx, 46, 189, 644, 430));
  });
});
