import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { redCookedTemplate } from '../src/features/templates/red_cooked_template.js';
import {
  RED_COOKED_SLOT,
  DEFAULT_RED_COOKED_CONFIG,
  renderBackdrop,
  renderFramedPhoto,
  renderYellowQuote
} from '../src/features/templates/red_cooked_helpers.js';
import { renderLockscreenOverlay } from '../src/features/templates/red_cooked_player.js';
import { getTemplate } from '../src/features/templates/template_registry.js';

describe("Nah I'm Cooked Red Lockscreen Template (9:16, 1-Photo)", () => {
  it('should have valid metadata and 9:16 (736x1308) canvas configuration in category 1', () => {
    assert.strictEqual(redCookedTemplate.id, 'red_cooked');
    assert.strictEqual(redCookedTemplate.name, "Nah I'm Cooked");
    assert.strictEqual(redCookedTemplate.aspectRatio, '9:16');
    assert.strictEqual(redCookedTemplate.category, '1');
    assert.strictEqual(redCookedTemplate.photoCount, 1);
    assert.strictEqual(redCookedTemplate.config.canvasWidth, 736);
    assert.strictEqual(redCookedTemplate.config.canvasHeight, 1308);
    assert.strictEqual(redCookedTemplate.previewImage, 'assets/red_cooked_preview.png');
    assert.ok(Array.isArray(redCookedTemplate.tags));
    assert.ok(redCookedTemplate.tags.includes('red'));
    assert.ok(redCookedTemplate.tags.includes('lockscreen'));
    assert.ok(redCookedTemplate.tags.includes('quote'));
    assert.ok(redCookedTemplate.tags.includes('poster'));
  });

  it('should be registered in the global template registry', () => {
    const reg = getTemplate('red_cooked');
    assert.ok(reg);
    assert.strictEqual(reg.id, 'red_cooked');
  });

  it('should define precise centered layout slot coordinates', () => {
    assert.strictEqual(redCookedTemplate.slots.length, 1);
    assert.strictEqual(RED_COOKED_SLOT.id, 0);
    assert.strictEqual(RED_COOKED_SLOT.x, 116);
    assert.strictEqual(RED_COOKED_SLOT.y, 486);
    assert.strictEqual(RED_COOKED_SLOT.w, 504);
    assert.strictEqual(RED_COOKED_SLOT.h, 332);
  });

  it('should render safely with mock context in various configurations', () => {
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
      drawImage() {},
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      font: '',
      textAlign: '',
      textBaseline: '',
      shadowColor: '',
      shadowBlur: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0
    };

    const mockImg = {
      src: 'assets/red_cooked_reference.png',
      width: 736,
      height: 1308,
      naturalWidth: 736,
      naturalHeight: 1308
    };

    // 1. Reference preview fallback
    assert.doesNotThrow(() => {
      redCookedTemplate.render(mockCtx, mockImg, null, { isUserUploaded: false });
    });

    // 2. User uploaded photo with default quotes and overlay
    assert.doesNotThrow(() => {
      redCookedTemplate.render(mockCtx, mockImg, null, { isUserUploaded: true });
    });

    // 3. User uploaded photo with custom state overrides
    assert.doesNotThrow(() => {
      redCookedTemplate.render(mockCtx, mockImg, null, {
        isUserUploaded: true,
        photoImg: mockImg,
        trackTitle: 'Custom Track Title',
        artist: 'Custom Artist',
        currentTime: '1:23',
        duration: '3:45',
        progress: 0.45,
        quoteLine1: 'Custom Punchline',
        quoteLine2: 'Another Bold Statement',
        zoom: 1.25,
        panX: 10,
        panY: -10
      });
    });

    // 4. Fallback when image is null
    assert.doesNotThrow(() => {
      redCookedTemplate.render(mockCtx, null, null, { isUserUploaded: true });
    });
  });

  it('should execute helper drawing routines safely without throwing', () => {
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
      fillRect() {},
      fillText() {},
      drawImage() {},
      fillStyle: '',
      font: '',
      textAlign: '',
      textBaseline: '',
      shadowColor: '',
      shadowBlur: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0
    };

    assert.doesNotThrow(() => {
      renderBackdrop(mockCtx, 736, 1308, '#fe0000');
      renderFramedPhoto(mockCtx, null, RED_COOKED_SLOT);
      renderFramedPhoto(mockCtx, { width: 500, height: 350 }, RED_COOKED_SLOT, { zoom: 1.2, panX: 5, panY: -5 });
      renderLockscreenOverlay(mockCtx, RED_COOKED_SLOT, {});
      renderLockscreenOverlay(mockCtx, RED_COOKED_SLOT, { progress: 0.8, trackTitle: 'Test' });
      renderYellowQuote(mockCtx, 736, {});
      renderYellowQuote(mockCtx, 736, { quoteLine1: 'Line 1', quoteLine2: 'Line 2' });
    });
  });

  it('should ignore default FOCUS caption and render reference quotes', () => {
    const textCalls = [];
    const mockCtx = {
      save() {},
      restore() {},
      fillText(text, x, y) {
        textCalls.push({ text, x, y });
      },
      fillStyle: '',
      font: '',
      textAlign: '',
      textBaseline: ''
    };

    // State coming from default app initial state with caption='FOCUS'
    const stateWithFocus = {
      caption: 'FOCUS',
      subtitle: 'In a world obsessed with attention, focus becomes rare.'
    };

    renderYellowQuote(mockCtx, 736, stateWithFocus);

    assert.strictEqual(textCalls.length, 2);
    assert.strictEqual(textCalls[0].text, "Nah, I'm cooked.");
    assert.strictEqual(textCalls[1].text, "I know I look too damn good.");
    assert.strictEqual(textCalls[0].x, 368);
    assert.strictEqual(textCalls[1].x, 368);
    assert.strictEqual(textCalls[0].y, 838);
    assert.strictEqual(textCalls[1].y, 884);
  });
});
