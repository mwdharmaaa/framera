import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { invertedDuetTemplate } from '../src/features/templates/inverted_duet_template.js';
import {
  INVERTED_DUET_LAYOUT,
  renderFramedPhoto,
  drawDuetAnnotations
} from '../src/features/templates/inverted_duet_helpers.js';
import { getTemplate } from '../src/features/templates/template_registry.js';

describe('Inverted Duet Template', () => {
  it('should have valid metadata and 3:4 canvas configuration with 2 photos', () => {
    assert.strictEqual(invertedDuetTemplate.id, 'inverted_duet');
    assert.strictEqual(invertedDuetTemplate.name, 'Inverted Duet');
    assert.strictEqual(invertedDuetTemplate.aspectRatio, '3:4');
    assert.strictEqual(invertedDuetTemplate.photoCount, 2);
    assert.strictEqual(invertedDuetTemplate.category, '2');
    assert.strictEqual(invertedDuetTemplate.config.canvasWidth, 1200);
    assert.strictEqual(invertedDuetTemplate.config.canvasHeight, 1600);
    assert.strictEqual(typeof invertedDuetTemplate.render, 'function');
  });

  it('should be registered in the global template registry', () => {
    const tpl = getTemplate('inverted_duet');
    assert.ok(tpl, 'Template should exist in registry');
    assert.strictEqual(tpl.id, 'inverted_duet');
  });

  it('should have precise symmetrical 50/50 split and 1/3 ratio grid coordinates', () => {
    const { topBackground, topInset, bottomBackground, bottomInset } = INVERTED_DUET_LAYOUT;

    assert.deepStrictEqual(topBackground, { x: 0, y: 0, w: 1200, h: 800 });
    assert.deepStrictEqual(topInset, { x: 400, y: 200, w: 400, h: 400 });
    assert.deepStrictEqual(bottomBackground, { x: 0, y: 800, w: 1200, h: 800 });
    assert.deepStrictEqual(bottomInset, { x: 400, y: 1000, w: 400, h: 400 });
  });

  it('should render safely with mock context in various photo configurations', () => {
    const mockCtx = {
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      closePath: () => {},
      rect: () => {},
      clip: () => {},
      fill: () => {},
      stroke: () => {},
      fillRect: () => {},
      fillText: () => {},
      drawImage: () => {},
      translate: () => {},
      rotate: () => {},
      fillStyle: '',
      font: '',
      textAlign: '',
      letterSpacing: '',
      shadowColor: '',
      shadowBlur: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0
    };

    const mockBounds = { drawX: 0, drawY: 0, drawW: 1200, drawH: 1600 };
    const mockPhoto1 = { width: 800, height: 600 };
    const mockPhoto2 = { width: 600, height: 800 };

    // 1. Dual photo array
    assert.doesNotThrow(() => {
      invertedDuetTemplate.render(mockCtx, mockPhoto1, mockBounds, {
        photoImgs: [mockPhoto1, mockPhoto2],
        isUserUploaded: true,
        zoom: 1.2,
        panX: 10,
        panY: -5
      });
    });

    // 2. Single photo fallback
    assert.doesNotThrow(() => {
      invertedDuetTemplate.render(mockCtx, mockPhoto1, mockBounds, {
        isUserUploaded: true
      });
    });

    // 3. Direct reference preview
    assert.doesNotThrow(() => {
      invertedDuetTemplate.render(mockCtx, { src: 'assets/inverted_duet_reference.jpg' }, mockBounds, {
        isUserUploaded: false
      });
    });

    // 4. Null photo
    assert.doesNotThrow(() => {
      invertedDuetTemplate.render(mockCtx, null, mockBounds, {});
    });
  });

  it('should execute helper routines safely without throwing', () => {
    const mockCtx = {
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      rect: () => {},
      clip: () => {},
      drawImage: () => {},
      fillText: () => {},
      fillStyle: '',
      font: '',
      textAlign: '',
      shadowColor: '',
      shadowBlur: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0
    };

    assert.doesNotThrow(() => renderFramedPhoto(mockCtx, { width: 100, height: 100 }, INVERTED_DUET_LAYOUT.topInset));
    assert.doesNotThrow(() => renderFramedPhoto(mockCtx, null, INVERTED_DUET_LAYOUT.topInset));
    assert.doesNotThrow(() => drawDuetAnnotations(mockCtx, 1200, 1600, {
      caption: 'CUSTOM TITLE',
      subtitle: 'CUSTOM SUB',
      date: '2026'
    }));
    assert.doesNotThrow(() => drawDuetAnnotations(mockCtx, 1200, 1600, {}));
  });
});
