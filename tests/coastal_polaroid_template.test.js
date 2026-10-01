import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { coastalPolaroidTemplate } from '../src/features/templates/coastal_polaroid_template.js';
import { getTemplate } from '../src/features/templates/template_registry.js';
import {
  COASTAL_POLAROID_SLOTS,
  POLAROID_CARD_CONFIG,
  renderSeasideBackdrop,
  renderPolaroidCard
} from '../src/features/templates/coastal_polaroid_helpers.js';
import {
  drawRoundedRect,
  drawHeadphoneIcon,
  drawPolaroidFooter
} from '../src/features/templates/coastal_polaroid_decorations.js';

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
    arc(x, y, r, sa, ea, ac) { calls.push(['arc', x, y, r, sa, ea, ac]); },
    translate(x, y) { calls.push(['translate', x, y]); },
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

describe('Coastal Polaroid Story 1-Photo Template', () => {
  it('should have valid metadata and native 9:16 (736x1308) canvas configuration with category 1', () => {
    assert.strictEqual(coastalPolaroidTemplate.id, 'coastal_polaroid_story');
    assert.strictEqual(coastalPolaroidTemplate.name, 'Coastal Polaroid Story');
    assert.strictEqual(coastalPolaroidTemplate.aspectRatio, '9:16');
    assert.strictEqual(coastalPolaroidTemplate.photoCount, 1);
    assert.strictEqual(coastalPolaroidTemplate.category, '1');
    assert.strictEqual(coastalPolaroidTemplate.config.canvasWidth, 736);
    assert.strictEqual(coastalPolaroidTemplate.config.canvasHeight, 1308);
    assert.ok(Array.isArray(coastalPolaroidTemplate.tags));
    assert.ok(coastalPolaroidTemplate.tags.includes('polaroid'));
    assert.ok(coastalPolaroidTemplate.tags.includes('coastal'));
    assert.ok(coastalPolaroidTemplate.tags.includes('monochrome'));
    assert.strictEqual(COASTAL_POLAROID_SLOTS.length, 3);
  });

  it('should be registered in the global template registry', () => {
    const registered = getTemplate('coastal_polaroid_story');
    assert.ok(registered, 'coastal_polaroid_story should be registered in template registry');
    assert.strictEqual(registered.id, 'coastal_polaroid_story');
    assert.strictEqual(registered.category, '1');
  });

  it('should define precise slot coordinates matching the composition', () => {
    const [topSlot, btmSlot, cardSlot] = COASTAL_POLAROID_SLOTS;

    // Slot 0 (Top Horizon)
    assert.strictEqual(topSlot.id, 0);
    assert.strictEqual(topSlot.x, 0);
    assert.strictEqual(topSlot.y, 0);
    assert.strictEqual(topSlot.w, 736);
    assert.strictEqual(topSlot.h, 654);

    // Slot 1 (Bottom Surf)
    assert.strictEqual(btmSlot.id, 1);
    assert.strictEqual(btmSlot.x, 0);
    assert.strictEqual(btmSlot.y, 654);
    assert.strictEqual(btmSlot.w, 736);
    assert.strictEqual(btmSlot.h, 654);

    // Slot 2 (Polaroid Card)
    assert.strictEqual(cardSlot.id, 2);
    assert.strictEqual(cardSlot.x, POLAROID_CARD_CONFIG.x);
    assert.strictEqual(cardSlot.y, POLAROID_CARD_CONFIG.y);
    assert.strictEqual(cardSlot.w, POLAROID_CARD_CONFIG.w);
    assert.strictEqual(cardSlot.h, POLAROID_CARD_CONFIG.h);
  });

  it('should render safely with mock context in various photo configurations', () => {
    const ctx = createMockContext();
    const mockImg = { width: 1000, height: 1000, naturalWidth: 1000, naturalHeight: 1000 };

    // 1. Single photo upload
    coastalPolaroidTemplate.render(ctx, mockImg, { drawX: 0, drawY: 0, drawW: 736, drawH: 1308 }, {
      isUserUploaded: true,
      photoImg: mockImg,
      caption: '@testuser'
    });
    assert.ok(ctx.calls.length > 0);

    // 2. Multi-photo array upload
    ctx.calls.length = 0;
    coastalPolaroidTemplate.render(ctx, null, null, {
      isUserUploaded: true,
      photos: [mockImg, mockImg, mockImg]
    });
    assert.ok(ctx.calls.length > 0);

    // 3. Null / empty fallback without crashing
    ctx.calls.length = 0;
    coastalPolaroidTemplate.render(ctx, null, null, { isUserUploaded: true });
    assert.ok(ctx.calls.length > 0);
  });

  it('should execute helper and decoration routines safely without throwing', () => {
    const ctx = createMockContext();
    const mockImg = { width: 800, height: 600, naturalWidth: 800, naturalHeight: 600 };

    // Decorations
    drawRoundedRect(ctx, 10, 10, 100, 100, 8);
    drawHeadphoneIcon(ctx, 50, 50, 20);
    drawPolaroidFooter(ctx, 20, 20, 200, '@imzzum');

    // Helpers
    renderSeasideBackdrop(ctx, [mockImg, mockImg], 736, 1308);
    renderPolaroidCard(ctx, mockImg, POLAROID_CARD_CONFIG, '@imzzum');

    assert.ok(ctx.calls.length > 0);
  });
});
