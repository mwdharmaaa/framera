import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { imessageCascadeTemplate } from '../src/features/templates/imessage_cascade_template.js';
import { getTemplate } from '../src/features/templates/template_registry.js';
import {
  IMESSAGE_CARD_SLOTS,
  drawRoundedRectPath,
  renderRoundedCardPhoto,
  renderLivePhotoBadge,
  renderIMessageBottomBar
} from '../src/features/templates/imessage_cascade_helpers.js';

describe('iMessage Dark Cascade Trio Template', () => {
  it('should have valid metadata and native 9:16 (736x1308) canvas configuration with 3 photos', () => {
    assert.strictEqual(imessageCascadeTemplate.id, 'imessage_cascade');
    assert.strictEqual(imessageCascadeTemplate.name, 'iMessage Dark Cascade Trio');
    assert.strictEqual(imessageCascadeTemplate.aspectRatio, '9:16');
    assert.strictEqual(imessageCascadeTemplate.photoCount, 3);
    assert.strictEqual(imessageCascadeTemplate.category, '3');
    assert.strictEqual(imessageCascadeTemplate.config.canvasWidth, 736);
    assert.strictEqual(imessageCascadeTemplate.config.canvasHeight, 1308);
    assert.strictEqual(IMESSAGE_CARD_SLOTS.length, 3);
  });

  it('should be registered in the global template registry', () => {
    const registered = getTemplate('imessage_cascade');
    assert.ok(registered, 'imessage_cascade should be registered in template registry');
    assert.strictEqual(registered.id, 'imessage_cascade');
    assert.strictEqual(registered.category, '3');
  });

  it('should define precise slot coordinates for all 3 staggered floating cards', () => {
    const [card0, card1, card2] = IMESSAGE_CARD_SLOTS;

    // Card 0: Top Live Photo
    assert.strictEqual(card0.id, 0);
    assert.strictEqual(card0.x, 215);
    assert.strictEqual(card0.y, 35);
    assert.strictEqual(card0.w, 375);
    assert.strictEqual(card0.h, 360);
    assert.strictEqual(card0.hasLiveBadge, true);

    // Card 1: Middle Right Stack
    assert.strictEqual(card1.id, 1);
    assert.strictEqual(card1.x, 410);
    assert.strictEqual(card1.y, 325);
    assert.strictEqual(card1.w, 300);
    assert.strictEqual(card1.h, 480);
    assert.strictEqual(card1.hasLiveBadge, false);

    // Card 2: Bottom Anchor Stack
    assert.strictEqual(card2.id, 2);
    assert.strictEqual(card2.x, 265);
    assert.strictEqual(card2.y, 765);
    assert.strictEqual(card2.w, 375);
    assert.strictEqual(card2.h, 360);
    assert.strictEqual(card2.hasLiveBadge, false);
  });

  it('should render safely with mock context in various photo configurations', () => {
    const mockCtx = {
      save() {},
      restore() {},
      fillRect() {},
      strokeRect() {},
      beginPath() {},
      rect() {},
      roundRect() {},
      moveTo() {},
      lineTo() {},
      quadraticCurveTo() {},
      closePath() {},
      fill() {},
      stroke() {},
      clip() {},
      drawImage() {},
      fillText() {},
      arc() {},
      setLineDash() {},
      font: '',
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      shadowColor: '',
      shadowBlur: 0,
      shadowOffsetY: 0,
      textAlign: '',
      textBaseline: ''
    };

    const mockImg = {
      src: 'assets/imessage_cascade_reference.jpg',
      naturalWidth: 736,
      naturalHeight: 1308,
      width: 736,
      height: 1308
    };

    // 1. Initial reference preview mode
    assert.doesNotThrow(() => {
      imessageCascadeTemplate.render(mockCtx, mockImg, {}, { isUserUploaded: false });
    });

    // 2. Full 3-photo user upload state
    const photos3 = [
      { width: 600, height: 600, naturalWidth: 600, naturalHeight: 600 },
      { width: 600, height: 600, naturalWidth: 600, naturalHeight: 600 },
      { width: 600, height: 600, naturalWidth: 600, naturalHeight: 600 }
    ];

    assert.doesNotThrow(() => {
      imessageCascadeTemplate.render(mockCtx, photos3[0], {}, {
        isUserUploaded: true,
        photoImgs: photos3,
        caption: 'Text Message'
      });
    });

    // 3. Partial upload with 2 photos
    assert.doesNotThrow(() => {
      imessageCascadeTemplate.render(mockCtx, photos3[0], {}, {
        isUserUploaded: true,
        photoImgs: [photos3[0], photos3[1]]
      });
    });

    // 4. Single photo upload fallback
    assert.doesNotThrow(() => {
      imessageCascadeTemplate.render(mockCtx, photos3[0], {}, {
        isUserUploaded: true,
        photoImgs: [photos3[0]]
      });
    });

    // 5. Null photo fallback
    assert.doesNotThrow(() => {
      imessageCascadeTemplate.render(mockCtx, null, {}, {
        isUserUploaded: true,
        photoImgs: []
      });
    });
  });

  it('should execute helper routines safely without throwing', () => {
    const mockCtx = {
      save() {},
      restore() {},
      fillRect() {},
      strokeRect() {},
      beginPath() {},
      rect() {},
      roundRect() {},
      moveTo() {},
      lineTo() {},
      quadraticCurveTo() {},
      closePath() {},
      fill() {},
      stroke() {},
      clip() {},
      drawImage() {},
      fillText() {},
      arc() {},
      setLineDash() {}
    };

    const photo = { naturalWidth: 500, naturalHeight: 500, width: 500, height: 500 };

    assert.doesNotThrow(() => {
      drawRoundedRectPath(mockCtx, 10, 10, 100, 100, 10);
      renderRoundedCardPhoto(mockCtx, photo, IMESSAGE_CARD_SLOTS[0]);
      renderRoundedCardPhoto(null, photo, IMESSAGE_CARD_SLOTS[0]);
      renderLivePhotoBadge(mockCtx, 50, 50);
      renderLivePhotoBadge(null, 50, 50);
      renderIMessageBottomBar(mockCtx, 736, 1308, { caption: 'Custom Text' });
      renderIMessageBottomBar(null, 736, 1308);
    });
  });
});
