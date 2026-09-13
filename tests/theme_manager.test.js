import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { THEMES, getSavedTheme, applyTheme, getNextTheme, initTheme } from '../src/features/theme/theme_manager.js';

describe('Theme Manager Engine', () => {
  it('should default to rose-light theme when storage is empty', () => {
    const mockStorage = {
      getItem: () => null,
      setItem: () => {}
    };
    assert.strictEqual(getSavedTheme(mockStorage), THEMES.ROSE_LIGHT);
  });

  it('should read saved dark theme from storage', () => {
    const mockStorage = {
      getItem: (key) => (key === 'framera_theme' ? 'dark' : null),
      setItem: () => {}
    };
    assert.strictEqual(getSavedTheme(mockStorage), THEMES.DARK);
  });

  it('should toggle theme cleanly between dark and pink-light', () => {
    assert.strictEqual(getNextTheme(THEMES.DARK), THEMES.ROSE_LIGHT);
    assert.strictEqual(getNextTheme(THEMES.ROSE_LIGHT), THEMES.DARK);
  });

  it('should apply theme attribute on document root and persist', () => {
    let savedKey = '';
    let savedVal = '';
    const mockStorage = {
      getItem: () => null,
      setItem: (k, v) => {
        savedKey = k;
        savedVal = v;
      }
    };

    let setAttrKey = '';
    let setAttrVal = '';
    const mockDoc = {
      documentElement: {
        setAttribute: (k, v) => {
          setAttrKey = k;
          setAttrVal = v;
        }
      }
    };

    const result = applyTheme(THEMES.ROSE_LIGHT, mockDoc, mockStorage);
    assert.strictEqual(result, THEMES.ROSE_LIGHT);
    assert.strictEqual(savedKey, 'framera_theme');
    assert.strictEqual(savedVal, 'pink-light');
    assert.strictEqual(setAttrKey, 'data-theme');
    assert.strictEqual(setAttrVal, 'pink-light');
  });

  it('should handle button click and toggle theme dynamically', () => {
    let currentAttr = '';
    const mockDoc = {
      documentElement: {
        setAttribute: (k, v) => {
          currentAttr = v;
        }
      }
    };

    const storageMap = new Map();
    const mockStorage = {
      getItem: (k) => storageMap.get(k) || null,
      setItem: (k, v) => storageMap.set(k, v)
    };

    let clickHandler = null;
    const mockButton = {
      addEventListener: (event, handler) => {
        if (event === 'click') clickHandler = handler;
      },
      querySelector: (selector) => {
        return { style: {}, textContent: '' };
      }
    };

    const controller = initTheme({
      buttonEl: mockButton,
      doc: mockDoc,
      storage: mockStorage
    });

    assert.strictEqual(controller.getCurrentTheme(), THEMES.ROSE_LIGHT);
    assert.strictEqual(currentAttr, THEMES.ROSE_LIGHT);

    // Trigger click -> switches to dark
    clickHandler();
    assert.strictEqual(controller.getCurrentTheme(), THEMES.DARK);
    assert.strictEqual(currentAttr, THEMES.DARK);

    // Trigger click again -> switches back to rose-light
    clickHandler();
    assert.strictEqual(controller.getCurrentTheme(), THEMES.ROSE_LIGHT);
    assert.strictEqual(currentAttr, THEMES.ROSE_LIGHT);
  });
});
