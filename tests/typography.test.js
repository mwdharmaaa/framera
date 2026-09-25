import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  FONT_PRESETS,
  createFontProxy,
  renderTypographySelector
} from '../src/features/typography/typography_manager.js';

describe('Typography Presets & Font Proxy Engine', () => {
  it('should define comprehensive curated font presets', () => {
    assert.ok(FONT_PRESETS.default);
    assert.ok(FONT_PRESETS.editorial);
    assert.ok(FONT_PRESETS.mono);
    assert.ok(FONT_PRESETS.bebas);
    assert.ok(FONT_PRESETS.fredoka);
    assert.ok(FONT_PRESETS.shantell);
    assert.ok(FONT_PRESETS.cursive);
  });

  it('should return untouched context when fontOverride is null or empty', () => {
    const mockCtx = { font: '16px sans-serif' };
    const proxy = createFontProxy(mockCtx, null);
    assert.strictEqual(proxy, mockCtx);
  });

  it('should dynamically override font family while preserving size and weight', () => {
    const mockCtx = { font: 'bold 24px Arial, sans-serif' };
    const proxy = createFontProxy(mockCtx, '"Space Mono", monospace');

    proxy.font = '700 28px "Playfair Display", serif';
    assert.strictEqual(mockCtx.font, '700 28px "Space Mono", monospace');

    proxy.font = 'italic 16px Roboto';
    assert.strictEqual(mockCtx.font, 'italic 16px "Space Mono", monospace');
  });

  it('should bind context methods seamlessly through proxy', () => {
    let filledText = '';
    const mockCtx = {
      font: '14px sans-serif',
      fillText(text, x, y) {
        filledText = `${text}@${x},${y}`;
      }
    };
    const proxy = createFontProxy(mockCtx, 'sans-serif');
    proxy.fillText('Framera', 10, 20);
    assert.strictEqual(filledText, 'Framera@10,20');
  });

  it('should render font preset chips into DOM container', () => {
    const listeners = {};
    const classes = new Set();
    const children = [];

    const container = {
      innerHTML: '',
      children,
      appendChild(el) {
        children.push(el);
      },
      querySelectorAll() {
        return children;
      }
    };

    let selectedId = null;
    globalThis.document = {
      createElement: (tag) => {
        const el = {
          tagName: tag.toUpperCase(),
          className: '',
          dataset: {},
          childNodes: [],
          classList: {
            add: (cls) => classes.add(cls),
            remove: (cls) => classes.delete(cls)
          },
          appendChild(child) {
            this.childNodes.push(child);
          },
          addEventListener(event, fn) {
            listeners[event] = fn;
          }
        };
        return el;
      }
    };

    renderTypographySelector(container, 'default', (id) => {
      selectedId = id;
    });

    assert.strictEqual(children.length, Object.keys(FONT_PRESETS).length);
  });
});
