import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  COLORWAY_PRESETS,
  createColorwayProxy,
  renderColorwaySelector
} from '../src/features/colorway/colorway_manager.js';

describe('Colorway Presets & Background Proxy Engine', () => {
  it('should define comprehensive aesthetic colorway presets', () => {
    assert.ok(COLORWAY_PRESETS.default);
    assert.ok(COLORWAY_PRESETS.cream);
    assert.ok(COLORWAY_PRESETS.noir);
    assert.ok(COLORWAY_PRESETS.vintage);
    assert.ok(COLORWAY_PRESETS.sage);
    assert.ok(COLORWAY_PRESETS.lavender);
  });

  it('should return original context if colorway has no custom background', () => {
    const mockCtx = { fillRect: () => {} };
    const proxy = createColorwayProxy(mockCtx, COLORWAY_PRESETS.default, 1000, 1000);
    assert.strictEqual(proxy, mockCtx);
  });

  it('should intercept background full-bleed fillRect and substitute colorway background', () => {
    let interceptedFill = '';
    const mockCtx = {
      fillStyle: '#ffffff',
      saved: false,
      restored: false,
      save() { this.saved = true; },
      restore() { this.restored = true; },
      fillRect(x, y, w, h) {
        interceptedFill = `${this.fillStyle}@${x},${y},${w},${h}`;
      }
    };

    const proxy = createColorwayProxy(mockCtx, COLORWAY_PRESETS.cream, 800, 1000);

    // Initial background fill
    proxy.fillRect(0, 0, 800, 1000);
    assert.strictEqual(interceptedFill, `${COLORWAY_PRESETS.cream.bg}@0,0,800,1000`);

    // Secondary element fill (e.g. photo border or card) should not be overridden
    mockCtx.fillStyle = '#111111';
    proxy.fillRect(50, 50, 700, 800);
    assert.strictEqual(interceptedFill, '#111111@50,50,700,800');
  });

  it('should render colorway selector chips into DOM container', () => {
    const children = [];
    const container = {
      innerHTML: '',
      appendChild(child) {
        children.push(child);
      },
      querySelectorAll() {
        return children;
      }
    };

    globalThis.document = {
      createElement: () => ({
        style: {},
        dataset: {},
        classList: { add() {}, remove() {} },
        setAttribute() {},
        appendChild() {},
        addEventListener() {}
      })
    };

    renderColorwaySelector(container, 'default', () => {});
    assert.strictEqual(children.length, Object.keys(COLORWAY_PRESETS).length);
  });
});
