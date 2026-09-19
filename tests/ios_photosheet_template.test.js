import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { iosPhotosheetTemplate } from '../src/features/templates/ios_photosheet_template.js';
import { getTemplate } from '../src/features/templates/template_registry.js';
import {
  IOS_PHOTOSHEET_LAYOUT,
  drawRoundRectPath,
  renderCardPhoto,
  renderSheetHeader,
  renderCardBadges
} from '../src/features/templates/ios_photosheet_helpers.js';

describe('iOS Photosheet Live Share Template', () => {
  it('should have valid metadata and 4:5 (736x920) canvas configuration for 1 photo', () => {
    assert.strictEqual(iosPhotosheetTemplate.id, 'ios_photosheet');
    assert.strictEqual(iosPhotosheetTemplate.name, 'iOS Photosheet Live Share');
    assert.strictEqual(iosPhotosheetTemplate.aspectRatio, '4:5');
    assert.strictEqual(iosPhotosheetTemplate.photoCount, 1);
    assert.strictEqual(iosPhotosheetTemplate.category, '1');
    assert.strictEqual(iosPhotosheetTemplate.config.canvasWidth, 736);
    assert.strictEqual(iosPhotosheetTemplate.config.canvasHeight, 920);
    assert.strictEqual(iosPhotosheetTemplate.tag, 'IOS SHARE');
  });

  it('should be registered in the global template registry', () => {
    const registered = getTemplate('ios_photosheet');
    assert.ok(registered, 'ios_photosheet should be registered');
    assert.strictEqual(registered.id, 'ios_photosheet');
    assert.strictEqual(registered.category, '1');
  });

  it('should define precise carousel and header layout coordinates', () => {
    assert.strictEqual(IOS_PHOTOSHEET_LAYOUT.canvasWidth, 736);
    assert.strictEqual(IOS_PHOTOSHEET_LAYOUT.canvasHeight, 920);
    assert.strictEqual(IOS_PHOTOSHEET_LAYOUT.headerHeight, 230);
    assert.strictEqual(IOS_PHOTOSHEET_LAYOUT.card.x, 130);
    assert.strictEqual(IOS_PHOTOSHEET_LAYOUT.card.y, 254);
    assert.strictEqual(IOS_PHOTOSHEET_LAYOUT.card.w, 472);
    assert.strictEqual(IOS_PHOTOSHEET_LAYOUT.card.h, 666);
    assert.strictEqual(IOS_PHOTOSHEET_LAYOUT.leftPeek.x, -364);
    assert.strictEqual(IOS_PHOTOSHEET_LAYOUT.rightPeek.x, 624);
    assert.strictEqual(IOS_PHOTOSHEET_LAYOUT.thumbnail.w, 118);
    assert.strictEqual(IOS_PHOTOSHEET_LAYOUT.thumbnail.h, 128);
  });

  it('should render safely with mock context in various configurations', () => {
    const mockCtx = {
      save() {},
      restore() {},
      fillRect() {},
      beginPath() {},
      rect() {},
      roundRect() {},
      fill() {},
      stroke() {},
      clip() {},
      drawImage() {},
      fillText() {},
      arc() {},
      moveTo() {},
      lineTo() {},
      bezierCurveTo() {},
      font: '',
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      shadowColor: '',
      shadowBlur: 0,
      textAlign: '',
      textBaseline: ''
    };

    const mockImg = {
      src: 'assets/ios_photosheet_reference.jpg',
      naturalWidth: 736,
      naturalHeight: 920,
      width: 736,
      height: 920
    };

    // 1. Direct reference preview mode
    assert.doesNotThrow(() => {
      iosPhotosheetTemplate.render(mockCtx, mockImg, {
        drawX: 0,
        drawY: 0,
        drawW: 736,
        drawH: 920
      }, { isUserUploaded: false });
    });

    // 2. Custom photo upload mode
    const customPhoto = { width: 800, height: 1000, naturalWidth: 800, naturalHeight: 1000 };
    assert.doesNotThrow(() => {
      iosPhotosheetTemplate.render(mockCtx, null, {}, {
        isUserUploaded: true,
        photos: [customPhoto],
        caption: 'Summer Trip',
        subtitle: 'Bali, Indonesia',
        date: 'Options >'
      });
    });

    // 3. Fallback when photos array is empty or null
    assert.doesNotThrow(() => {
      iosPhotosheetTemplate.render(mockCtx, null, {}, { isUserUploaded: true });
    });
  });

  it('should execute helper functions safely', () => {
    let rectCalled = false;
    let roundRectCalled = false;
    const mockCtx = {
      save() {},
      restore() {},
      beginPath() {},
      rect() { rectCalled = true; },
      roundRect() { roundRectCalled = true; },
      clip() {},
      drawImage() {},
      fill() {},
      stroke() {},
      fillText() {},
      arc() {},
      moveTo() {},
      lineTo() {},
      bezierCurveTo() {}
    };

    drawRoundRectPath(mockCtx, 10, 10, 100, 100, 8);
    assert.ok(roundRectCalled);

    const fallbackCtx = {
      rect() { rectCalled = true; }
    };
    drawRoundRectPath(fallbackCtx, 10, 10, 100, 100, 8);
    assert.ok(rectCalled);

    const cardBounds = { x: 100, y: 100, w: 200, h: 300, radius: 16 };
    const mockPhoto = { width: 400, height: 400 };

    assert.doesNotThrow(() => renderCardPhoto(mockCtx, mockPhoto, cardBounds));
    assert.doesNotThrow(() => renderSheetHeader(mockCtx, mockPhoto, { caption: 'Test' }));
    assert.doesNotThrow(() => renderSheetHeader(mockCtx, null, {}));
    assert.doesNotThrow(() => renderCardBadges(mockCtx, cardBounds));
  });
});
