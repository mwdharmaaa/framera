import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { impastoOilTemplate } from '../src/features/templates/impasto_oil_template.js';
import {
  renderOilCanvasPrimer,
  renderImpastoPhoto,
  renderImpastoReliefPass,
  drawAtelierDetails,
  getImpastoRidgesImage,
  resetImpastoRidgesImage
} from '../src/features/templates/impasto_oil_helpers.js';
import { getTemplate } from '../src/features/templates/template_registry.js';

describe('Impasto Oil Atelier Template', () => {
  it('should have valid metadata and native 9:19.5 (555x1200) canvas configuration with 1 photo', () => {
    assert.strictEqual(impastoOilTemplate.id, 'impasto_oil_atelier');
    assert.strictEqual(impastoOilTemplate.name, 'Impasto Oil Atelier');
    assert.strictEqual(impastoOilTemplate.aspectRatio, '9:19.5');
    assert.strictEqual(impastoOilTemplate.photoCount, 1);
    assert.strictEqual(impastoOilTemplate.category, '1');
    assert.strictEqual(impastoOilTemplate.config.canvasWidth, 555);
    assert.strictEqual(impastoOilTemplate.config.canvasHeight, 1200);
    assert.strictEqual(typeof impastoOilTemplate.render, 'function');
  });

  it('should be registered in the global template registry', () => {
    const tpl = getTemplate('impasto_oil_atelier');
    assert.ok(tpl, 'Template should exist in registry');
    assert.strictEqual(tpl.id, 'impasto_oil_atelier');
  });

  it('should render safely with mock context with and without user photo', () => {
    const mockCtx = {
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      rect: () => {},
      strokeRect: () => {},
      fillRect: () => {},
      fillText: () => {},
      drawImage: () => {},
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 0,
      globalCompositeOperation: '',
      globalAlpha: 1.0,
      filter: '',
      font: '',
      textAlign: '',
      textBaseline: '',
      shadowColor: '',
      shadowBlur: 0
    };

    const mockBounds = { drawX: 0, drawY: 0, drawW: 555, drawH: 1200 };
    const mockPhoto = { width: 600, height: 800 };

    // 1. Initial template click state (before user upload, rendering reference directly)
    let drawnDirectly = false;
    const directCtx = {
      ...mockCtx,
      drawImage: () => { drawnDirectly = true; }
    };
    assert.doesNotThrow(() => {
      impastoOilTemplate.render(directCtx, mockPhoto, mockBounds, {
        isUserUploaded: false
      });
    });
    assert.strictEqual(drawnDirectly, true, 'Should draw reference directly when isUserUploaded is false');

    // 2. User uploaded photo state with custom caption
    assert.doesNotThrow(() => {
      impastoOilTemplate.render(mockCtx, mockPhoto, mockBounds, {
        isUserUploaded: true,
        caption: 'M. Wira',
        subtitle: 'Impasto No. 4',
        date: '2026 // OIL ON LINEN'
      });
    });

    // 3. Without photo (null photo)
    assert.doesNotThrow(() => {
      impastoOilTemplate.render(mockCtx, null, mockBounds, {});
    });
  });

  it('should execute helper routines safely without throwing', () => {
    const mockCtx = {
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      rect: () => {},
      strokeRect: () => {},
      fillRect: () => {},
      fillText: () => {},
      drawImage: () => {},
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 0,
      globalCompositeOperation: '',
      globalAlpha: 1.0,
      filter: '',
      font: '',
      textAlign: '',
      textBaseline: '',
      shadowColor: '',
      shadowBlur: 0
    };

    assert.doesNotThrow(() => renderOilCanvasPrimer(mockCtx, 555, 1200));
    assert.doesNotThrow(() => renderImpastoPhoto(mockCtx, { width: 100, height: 100 }, null, 555, 1200));
    assert.doesNotThrow(() => renderImpastoPhoto(mockCtx, null, null, 555, 1200));
    assert.doesNotThrow(() => renderImpastoReliefPass(mockCtx, { width: 100, height: 100 }, 555, 1200));
    assert.doesNotThrow(() => drawAtelierDetails(mockCtx, 555, 1200, {
      caption: 'Claude M.',
      date: '1888'
    }));
    assert.doesNotThrow(() => drawAtelierDetails(mockCtx, 555, 1200, {}));

    resetImpastoRidgesImage();
    const img = getImpastoRidgesImage();
    assert.strictEqual(img, null);
  });
});
