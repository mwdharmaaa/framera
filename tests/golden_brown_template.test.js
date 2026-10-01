import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { goldenBrownTemplate } from '../src/features/templates/golden_brown_template.js';
import { getTemplate } from '../src/features/templates/template_registry.js';
import {
  GOLDEN_BROWN_SLOTS,
  renderGoldenBrownPhoto,
  drawGoldenBrownComposition
} from '../src/features/templates/golden_brown_helpers.js';
import {
  drawGoldenBloom,
  drawBronzeAster,
  drawTopLeftFlowerCluster,
  drawBottomRightFlowerCluster
} from '../src/features/templates/golden_brown_botanical.js';
import {
  drawTopRightFlourish,
  drawBottomLeftFlourish
} from '../src/features/templates/golden_brown_flourishes.js';

function createMockContext() {
  const calls = [];
  return {
    calls,
    save() { calls.push(['save']); },
    restore() { calls.push(['restore']); },
    beginPath() { calls.push(['beginPath']); },
    closePath() { calls.push(['closePath']); },
    rect(x, y, w, h) { calls.push(['rect', x, y, w, h]); },
    fillRect(x, y, w, h) { calls.push(['fillRect', x, y, w, h]); },
    strokeRect(x, y, w, h) { calls.push(['strokeRect', x, y, w, h]); },
    stroke() { calls.push(['stroke']); },
    fill() { calls.push(['fill']); },
    clip() { calls.push(['clip']); },
    moveTo(x, y) { calls.push(['moveTo', x, y]); },
    lineTo(x, y) { calls.push(['lineTo', x, y]); },
    quadraticCurveTo(cpx, cpy, x, y) { calls.push(['quadraticCurveTo', cpx, cpy, x, y]); },
    bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) { calls.push(['bezierCurveTo', cp1x, cp1y, cp2x, cp2y, x, y]); },
    arc(x, y, r, sa, ea, ac) { calls.push(['arc', x, y, r, sa, ea, ac]); },
    translate(x, y) { calls.push(['translate', x, y]); },
    rotate(angle) { calls.push(['rotate', angle]); },
    fillText(text, x, y) { calls.push(['fillText', text, x, y]); },
    createLinearGradient() {
      return { addColorStop() {} };
    },
    createRadialGradient() {
      return { addColorStop() {} };
    },
    drawImage(...args) {
      calls.push(['drawImage', ...args]);
    }
  };
}

describe('Golden Brown Botanical Duo 2-Photo Template', () => {
  it('should have valid metadata and native 9:16 (736x1308) canvas configuration with category 2', () => {
    assert.strictEqual(goldenBrownTemplate.id, 'golden_brown_duo');
    assert.strictEqual(goldenBrownTemplate.name, 'Golden Brown Botanical Duo');
    assert.strictEqual(goldenBrownTemplate.aspectRatio, '9:16');
    assert.strictEqual(goldenBrownTemplate.category, '2');
    assert.strictEqual(goldenBrownTemplate.photoCount, 2);
    assert.strictEqual(goldenBrownTemplate.config.canvasWidth, 736);
    assert.strictEqual(goldenBrownTemplate.config.canvasHeight, 1308);
    assert.ok(Array.isArray(goldenBrownTemplate.tags));
    assert.ok(goldenBrownTemplate.tags.includes('golden hour'));
    assert.ok(goldenBrownTemplate.tags.includes('botanical'));
    assert.strictEqual(goldenBrownTemplate.previewImage, 'assets/golden_brown_preview.png');
  });

  it('should be registered in the global template registry', () => {
    const registered = getTemplate('golden_brown_duo');
    assert.ok(registered);
    assert.strictEqual(registered.id, 'golden_brown_duo');
    assert.strictEqual(registered.name, 'Golden Brown Botanical Duo');
  });

  it('should define precise slot coordinates matching the composition', () => {
    assert.strictEqual(GOLDEN_BROWN_SLOTS.length, 2);
    const [slot0, slot1] = GOLDEN_BROWN_SLOTS;

    // Slot 0 (Top portrait)
    assert.strictEqual(slot0.id, 0);
    assert.strictEqual(slot0.x, 164);
    assert.strictEqual(slot0.y, 130);
    assert.strictEqual(slot0.w, 408);
    assert.strictEqual(slot0.h, 510);

    // Slot 1 (Bottom portrait)
    assert.strictEqual(slot1.id, 1);
    assert.strictEqual(slot1.x, 164);
    assert.strictEqual(slot1.y, 704);
    assert.strictEqual(slot1.w, 408);
    assert.strictEqual(slot1.h, 510);
  });

  it('should render safely with mock context in various photo configurations', () => {
    const ctx = createMockContext();
    const mockImg1 = { naturalWidth: 800, naturalHeight: 1000, width: 800, height: 1000 };
    const mockImg2 = { naturalWidth: 900, naturalHeight: 1200, width: 900, height: 1200 };

    // Standard multi-photo state
    assert.doesNotThrow(() => {
      goldenBrownTemplate.render(ctx, mockImg1, null, {
        photoImgs: [mockImg1, mockImg2],
        isUserUploaded: true
      });
    });

    // Single photo state
    assert.doesNotThrow(() => {
      goldenBrownTemplate.render(ctx, mockImg1, null, {
        photoImg: mockImg1,
        isUserUploaded: true
      });
    });

    // Empty state
    assert.doesNotThrow(() => {
      goldenBrownTemplate.render(ctx, null, null, {});
    });

    // Stock reference preview fallback
    assert.doesNotThrow(() => {
      goldenBrownTemplate.render(ctx, { src: 'golden_brown_preview.png' }, { drawX: 0, drawY: 0, drawW: 736, drawH: 1308 }, {
        isUserUploaded: false
      });
    });
  });

  it('should execute helper and decoration routines safely without throwing', () => {
    const ctx = createMockContext();
    const mockImg = { width: 500, height: 600, naturalWidth: 500, naturalHeight: 600 };

    assert.doesNotThrow(() => renderGoldenBrownPhoto(ctx, mockImg, GOLDEN_BROWN_SLOTS[0]));
    assert.doesNotThrow(() => renderGoldenBrownPhoto(ctx, mockImg, GOLDEN_BROWN_SLOTS[1]));
    assert.doesNotThrow(() => drawTopRightFlourish(ctx));
    assert.doesNotThrow(() => drawBottomLeftFlourish(ctx));
    assert.doesNotThrow(() => drawGoldenBloom(ctx, 200, 200, 80));
    assert.doesNotThrow(() => drawBronzeAster(ctx, 150, 150, 40));
    assert.doesNotThrow(() => drawTopLeftFlowerCluster(ctx));
    assert.doesNotThrow(() => drawBottomRightFlowerCluster(ctx));
    assert.doesNotThrow(() => drawGoldenBrownComposition(ctx, [mockImg, mockImg], {}));
  });
});
