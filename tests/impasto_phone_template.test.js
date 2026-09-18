import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { impastoPhoneTemplate } from '../src/features/templates/impasto_phone_template.js';
import {
  renderImpastoPhoneBackground,
  renderImpastoUserPhoto,
  drawImpastoInterfaceChrome,
  getImpastoPhoneOverlayImage,
  resetImpastoPhoneOverlayImage
} from '../src/features/templates/impasto_phone_helpers.js';
import { getTemplate } from '../src/features/templates/template_registry.js';

describe('Impasto iOS Homescreen Template', () => {
  it('should have valid metadata and native 9:19.5 (555x1200) canvas configuration with 1 photo', () => {
    assert.strictEqual(impastoPhoneTemplate.id, 'impasto_canvas_phone');
    assert.strictEqual(impastoPhoneTemplate.name, 'Impasto iOS Homescreen');
    assert.strictEqual(impastoPhoneTemplate.aspectRatio, '9:19.5');
    assert.strictEqual(impastoPhoneTemplate.photoCount, 1);
    assert.strictEqual(impastoPhoneTemplate.category, '1');
    assert.strictEqual(impastoPhoneTemplate.config.canvasWidth, 555);
    assert.strictEqual(impastoPhoneTemplate.config.canvasHeight, 1200);
    assert.strictEqual(typeof impastoPhoneTemplate.render, 'function');
  });

  it('should be registered in the global template registry', () => {
    const tpl = getTemplate('impasto_canvas_phone');
    assert.ok(tpl, 'Template should exist in registry');
    assert.strictEqual(tpl.id, 'impasto_canvas_phone');
  });

  it('should render safely with mock context with and without user photo', () => {
    const mockCtx = {
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      rect: () => {},
      roundRect: () => {},
      strokeRect: () => {},
      fill: () => {},
      fillRect: () => {},
      fillText: () => {},
      drawImage: () => {},
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 0,
      font: '',
      textAlign: '',
      textBaseline: ''
    };

    const mockBounds = { drawX: 0, drawY: 0, drawW: 555, drawH: 1200 };
    const mockPhoto = { width: 600, height: 800 };

    // 1. With photo and custom caption
    assert.doesNotThrow(() => {
      impastoPhoneTemplate.render(mockCtx, mockPhoto, mockBounds, {
        caption: '10:24',
        subtitle: 'oil paint notes',
        date: 'FRIDAY, SEP 19'
      });
    });

    // 2. Without photo (null photo)
    assert.doesNotThrow(() => {
      impastoPhoneTemplate.render(mockCtx, null, mockBounds, {});
    });
  });

  it('should execute helper routines safely without throwing', () => {
    const mockCtx = {
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      rect: () => {},
      roundRect: () => {},
      strokeRect: () => {},
      fill: () => {},
      fillRect: () => {},
      fillText: () => {},
      drawImage: () => {},
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 0,
      font: '',
      textAlign: '',
      textBaseline: ''
    };

    assert.doesNotThrow(() => renderImpastoPhoneBackground(mockCtx, 555, 1200));
    assert.doesNotThrow(() => renderImpastoUserPhoto(mockCtx, { width: 100, height: 100 }, null, 555, 1200));
    assert.doesNotThrow(() => renderImpastoUserPhoto(mockCtx, null, null, 555, 1200));
    assert.doesNotThrow(() => drawImpastoInterfaceChrome(mockCtx, 555, 1200, {
      caption: '9:41',
      subtitle: 'notes'
    }));
    assert.doesNotThrow(() => drawImpastoInterfaceChrome(mockCtx, 555, 1200, {}));

    resetImpastoPhoneOverlayImage();
    const img = getImpastoPhoneOverlayImage();
    assert.strictEqual(img, null);
  });
});
