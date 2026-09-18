import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { analogTideTemplate } from '../src/features/templates/analog_tide_template.js';
import {
  ANALOG_TIDE_LAYOUT,
  renderMonochromeFilmBackground,
  renderColorInsetCard,
  drawAnalogTideAnnotations
} from '../src/features/templates/analog_tide_helpers.js';
import { getTemplate } from '../src/features/templates/template_registry.js';

describe('Analog Tide Template', () => {
  it('should have valid metadata and 3:4 canvas configuration with 2 photos', () => {
    assert.strictEqual(analogTideTemplate.id, 'analog_tide');
    assert.strictEqual(analogTideTemplate.name, 'Analog Tide');
    assert.strictEqual(analogTideTemplate.aspectRatio, '3:4');
    assert.strictEqual(analogTideTemplate.photoCount, 2);
    assert.strictEqual(analogTideTemplate.category, '2');
    assert.strictEqual(analogTideTemplate.config.canvasWidth, 1200);
    assert.strictEqual(analogTideTemplate.config.canvasHeight, 1600);
    assert.strictEqual(typeof analogTideTemplate.render, 'function');
  });

  it('should be registered in the global template registry', () => {
    const tpl = getTemplate('analog_tide');
    assert.ok(tpl, 'Template should exist in registry');
    assert.strictEqual(tpl.id, 'analog_tide');
  });

  it('should define valid full bleed background and offset vertical inset coordinates', () => {
    const { backgroundFrame, insetFrame } = ANALOG_TIDE_LAYOUT;

    assert.deepStrictEqual(backgroundFrame, { x: 0, y: 0, w: 1200, h: 1600 });
    assert.deepStrictEqual(insetFrame, { x: 468, y: 440, w: 650, h: 1005 });
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
      arc: () => {},
      moveTo: () => {},
      lineTo: () => {},
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      font: '',
      textAlign: '',
      globalAlpha: 1,
      filter: 'none',
      shadowColor: '',
      shadowBlur: 0
    };

    const mockBounds = { drawX: 0, drawY: 0, drawW: 1200, drawH: 1600 };
    const mockPhoto1 = { width: 800, height: 1000 };
    const mockPhoto2 = { width: 600, height: 900 };

    // 1. Dual photo array
    assert.doesNotThrow(() => {
      analogTideTemplate.render(mockCtx, mockPhoto1, mockBounds, {
        photoImgs: [mockPhoto1, mockPhoto2],
        isUserUploaded: true,
        zoom: 1.1,
        panX: 15,
        panY: -10
      });
    });

    // 2. Single photo fallback
    assert.doesNotThrow(() => {
      analogTideTemplate.render(mockCtx, mockPhoto1, mockBounds, {
        isUserUploaded: true
      });
    });

    // 3. Direct reference preview
    assert.doesNotThrow(() => {
      analogTideTemplate.render(mockCtx, { src: 'assets/analog_tide_reference.jpg' }, mockBounds, {
        isUserUploaded: false
      });
    });

    // 4. Null photo
    assert.doesNotThrow(() => {
      analogTideTemplate.render(mockCtx, null, mockBounds, {});
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
      arc: () => {},
      fill: () => {},
      moveTo: () => {},
      lineTo: () => {},
      stroke: () => {},
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      font: '',
      textAlign: '',
      globalAlpha: 1,
      filter: 'none',
      shadowColor: '',
      shadowBlur: 0
    };

    assert.doesNotThrow(() => renderMonochromeFilmBackground(mockCtx, { width: 200, height: 200 }, ANALOG_TIDE_LAYOUT.backgroundFrame));
    assert.doesNotThrow(() => renderMonochromeFilmBackground(mockCtx, null, ANALOG_TIDE_LAYOUT.backgroundFrame));
    assert.doesNotThrow(() => renderColorInsetCard(mockCtx, { width: 100, height: 100 }, ANALOG_TIDE_LAYOUT.insetFrame));
    assert.doesNotThrow(() => renderColorInsetCard(mockCtx, null, ANALOG_TIDE_LAYOUT.insetFrame));
    assert.doesNotThrow(() => drawAnalogTideAnnotations(mockCtx, 1200, 1600, {
      caption: 'CUSTOM TITLE',
      subtitle: 'CUSTOM SUBTITLE',
      date: '2026'
    }));
    assert.doesNotThrow(() => drawAnalogTideAnnotations(mockCtx, 1200, 1600, {}));
  });
});
