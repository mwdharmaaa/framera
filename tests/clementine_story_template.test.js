import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { clementineStoryTemplate } from '../src/features/templates/clementine_story_template.js';
import { getTemplate } from '../src/features/templates/template_registry.js';
import {
  CLEMENTINE_STORY_SLOTS,
  CLEMENTINE_VINYL_CARD,
  renderClementineBackdrop,
  renderSlotPhoto,
  drawClementineStoryComposition
} from '../src/features/templates/clementine_story_helpers.js';
import {
  renderFloralArt,
  renderVinylDisc
} from '../src/features/templates/clementine_story_vinyl.js';
import {
  renderStoryVignettes,
  renderStoryHeader,
  renderStoryInputBar
} from '../src/features/templates/clementine_story_decorations.js';

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
    roundRect(x, y, w, h, r) { calls.push(['roundRect', x, y, w, h, r]); },
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

describe('Clementine Story Vinyl Trio 3-Photo Template', () => {
  it('should have valid metadata and native 9:16 (736x1308) canvas configuration with category 3', () => {
    assert.strictEqual(clementineStoryTemplate.id, 'clementine_story');
    assert.strictEqual(clementineStoryTemplate.name, 'Clementine Story Vinyl Trio');
    assert.strictEqual(clementineStoryTemplate.aspectRatio, '9:16');
    assert.strictEqual(clementineStoryTemplate.category, '3');
    assert.strictEqual(clementineStoryTemplate.photoCount, 3);
    assert.strictEqual(clementineStoryTemplate.config.canvasWidth, 736);
    assert.strictEqual(clementineStoryTemplate.config.canvasHeight, 1308);
    assert.ok(Array.isArray(clementineStoryTemplate.tags));
    assert.ok(clementineStoryTemplate.tags.includes('story'));
    assert.ok(clementineStoryTemplate.tags.includes('vinyl'));
    assert.strictEqual(clementineStoryTemplate.previewImage, 'assets/clementine_story_preview.png');
  });

  it('should be registered in the global template registry', () => {
    const registered = getTemplate('clementine_story');
    assert.ok(registered);
    assert.strictEqual(registered.id, 'clementine_story');
    assert.strictEqual(registered.name, 'Clementine Story Vinyl Trio');
  });

  it('should define precise slot and vinyl card coordinates matching the 2x2 grid', () => {
    assert.strictEqual(CLEMENTINE_STORY_SLOTS.length, 3);
    const [slot0, slot1, slot2] = CLEMENTINE_STORY_SLOTS;

    // Slot 0 (Top-left photo)
    assert.strictEqual(slot0.id, 0);
    assert.strictEqual(slot0.x, 34);
    assert.strictEqual(slot0.y, 364);
    assert.strictEqual(slot0.w, 330);
    assert.strictEqual(slot0.h, 330);

    // Slot 1 (Bottom-left photo)
    assert.strictEqual(slot1.id, 1);
    assert.strictEqual(slot1.x, 34);
    assert.strictEqual(slot1.y, 704);
    assert.strictEqual(slot1.w, 330);
    assert.strictEqual(slot1.h, 330);

    // Slot 2 (Bottom-right photo)
    assert.strictEqual(slot2.id, 2);
    assert.strictEqual(slot2.x, 372);
    assert.strictEqual(slot2.y, 704);
    assert.strictEqual(slot2.w, 330);
    assert.strictEqual(slot2.h, 330);

    // Top-right Vinyl Card
    assert.strictEqual(CLEMENTINE_VINYL_CARD.x, 372);
    assert.strictEqual(CLEMENTINE_VINYL_CARD.y, 364);
    assert.strictEqual(CLEMENTINE_VINYL_CARD.w, 330);
    assert.strictEqual(CLEMENTINE_VINYL_CARD.h, 330);
  });

  it('should render safely with mock context in various photo configurations', () => {
    const ctx = createMockContext();
    const mockImg1 = { naturalWidth: 800, naturalHeight: 800, width: 800, height: 800 };
    const mockImg2 = { naturalWidth: 900, naturalHeight: 900, width: 900, height: 900 };
    const mockImg3 = { naturalWidth: 1000, naturalHeight: 1000, width: 1000, height: 1000 };

    // Standard 3-photo state
    assert.doesNotThrow(() => {
      clementineStoryTemplate.render(ctx, mockImg1, null, {
        photoImgs: [mockImg1, mockImg2, mockImg3],
        isUserUploaded: true
      });
    });

    // 2-photo fallback state
    assert.doesNotThrow(() => {
      clementineStoryTemplate.render(ctx, mockImg1, null, {
        photoImgs: [mockImg1, mockImg2],
        isUserUploaded: true
      });
    });

    // Single photo state
    assert.doesNotThrow(() => {
      clementineStoryTemplate.render(ctx, mockImg1, null, {
        photoImg: mockImg1,
        isUserUploaded: true
      });
    });

    // Empty state
    assert.doesNotThrow(() => {
      clementineStoryTemplate.render(ctx, null, null, {});
    });

    // Stock reference preview fallback
    assert.doesNotThrow(() => {
      clementineStoryTemplate.render(ctx, { src: 'clementine_story_preview.png' }, { drawX: 0, drawY: 0, drawW: 736, drawH: 1308 }, {
        isUserUploaded: false
      });
    });
  });

  it('should execute helper and decoration routines safely without throwing', () => {
    const ctx = createMockContext();
    const mockImg = { width: 500, height: 500, naturalWidth: 500, naturalHeight: 500 };

    assert.doesNotThrow(() => renderClementineBackdrop(ctx, 736, 1308));
    assert.doesNotThrow(() => renderSlotPhoto(ctx, mockImg, CLEMENTINE_STORY_SLOTS[0]));
    assert.doesNotThrow(() => renderSlotPhoto(ctx, null, CLEMENTINE_STORY_SLOTS[1]));
    assert.doesNotThrow(() => renderFloralArt(ctx, 372, 364, 330, 330));
    assert.doesNotThrow(() => renderVinylDisc(ctx, 537, 509, 96, mockImg, 'Clementine', 'grentperez'));
    assert.doesNotThrow(() => renderStoryVignettes(ctx, 736, 1308));
    assert.doesNotThrow(() => renderStoryHeader(ctx, 'Clementine', 'grentperez', mockImg));
    assert.doesNotThrow(() => renderStoryInputBar(ctx, 736, 1308));
    assert.doesNotThrow(() => drawClementineStoryComposition(ctx, [mockImg, mockImg, mockImg], {}));
  });
});
