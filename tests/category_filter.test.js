import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  CATEGORY_LABELS,
  filterTemplatesByCategory,
  updateCategoryCounts,
  initCategoryDropdown
} from '../src/features/gallery/category_filter.js';

describe('Category Filter & Dropdown Engine', () => {
  it('should have standard category labels defined', () => {
    assert.strictEqual(CATEGORY_LABELS.all, 'Semua');
    assert.strictEqual(CATEGORY_LABELS['1'], '1 Foto');
    assert.strictEqual(CATEGORY_LABELS['2'], '2 Foto');
    assert.strictEqual(CATEGORY_LABELS['3'], '3 Foto');
    assert.strictEqual(CATEGORY_LABELS['4'], '4 Foto');
    assert.strictEqual(CATEGORY_LABELS['5'], '5 Foto');
    assert.strictEqual(CATEGORY_LABELS['6'], '6 Foto');
    assert.strictEqual(CATEGORY_LABELS['9'], '9 Foto');
    assert.strictEqual(CATEGORY_LABELS['10'], '10 Foto');
  });

  it('should filter templates properly across photo counts and categories', () => {
    const templates = [
      { id: 't1', photoCount: 1 },
      { id: 't2', photoCount: 2 },
      { id: 't3', photoCount: 2, category: '2' },
      { id: 't4', photoCount: 3 },
      { id: 't5', photoCount: 4 },
      { id: 't6', photoCount: 5, category: '5' },
      { id: 't7', photoCount: 6, category: '6' }
    ];

    assert.strictEqual(filterTemplatesByCategory(templates, 'all').length, 7);
    assert.strictEqual(filterTemplatesByCategory(templates, '').length, 7);
    assert.strictEqual(filterTemplatesByCategory(templates, '1').length, 1);
    assert.strictEqual(filterTemplatesByCategory(templates, '2').length, 2);
    assert.strictEqual(filterTemplatesByCategory(templates, '3').length, 1);
    assert.strictEqual(filterTemplatesByCategory(templates, '4').length, 1);
    assert.strictEqual(filterTemplatesByCategory(templates, '5').length, 1);
    assert.strictEqual(filterTemplatesByCategory(templates, '6').length, 1);
    assert.strictEqual(filterTemplatesByCategory(null, '1').length, 0);
  });

  it('should update category counts inside pill elements accurately', () => {
    const originalDocument = globalThis.document;
    const pills = [
      {
        dataset: { category: 'all' },
        badge: null,
        querySelector(sel) { return sel === '.pill-count' ? this.badge : null; },
        appendChild(el) { this.badge = el; }
      },
      {
        dataset: { category: '2' },
        badge: null,
        querySelector(sel) { return sel === '.pill-count' ? this.badge : null; },
        appendChild(el) { this.badge = el; }
      }
    ];

    globalThis.document = {
      createElement(tag) {
        return { tagName: tag.toUpperCase(), className: '', textContent: '' };
      }
    };

    const container = {
      querySelectorAll(sel) {
        if (sel === '.category-pill') return pills;
        return [];
      }
    };

    const templates = [
      { id: 'a', photoCount: 1 },
      { id: 'b', photoCount: 2 },
      { id: 'c', photoCount: 2 }
    ];

    try {
      updateCategoryCounts(container, templates);
      assert.strictEqual(pills[0].badge.textContent, '3');
      assert.strictEqual(pills[1].badge.textContent, '2');
    } finally {
      globalThis.document = originalDocument;
    }
  });

  it('should initialize dropdown toggle and option selection lifecycle', () => {
    let selectedCategory = null;
    let focused = false;

    const listeners = {
      doc: {},
      trigger: {},
      dropdown: {}
    };

    const originalDocument = globalThis.document;
    globalThis.document = {
      addEventListener(event, fn) {
        listeners.doc[event] = fn;
      }
    };

    const createClassList = () => {
      const set = new Set();
      return {
        add(c) { set.add(c); },
        remove(c) { set.delete(c); },
        contains(c) { return set.has(c); }
      };
    };

    const triggerBtn = {
      attributes: { 'aria-expanded': 'false' },
      classList: createClassList(),
      getAttribute(k) { return this.attributes[k]; },
      setAttribute(k, v) { this.attributes[k] = String(v); },
      addEventListener(event, fn) { listeners.trigger[event] = fn; },
      focus() { focused = true; },
      contains(target) { return target === this; }
    };

    const dropdown = {
      style: { display: 'none' },
      classList: createClassList(),
      contains(target) { return target === this || target.parent === this; }
    };

    const activeLabel = { textContent: '' };

    const pillOption = {
      dataset: { category: '3' },
      classList: createClassList(),
      attributes: {},
      setAttribute(k, v) { this.attributes[k] = v; },
      parent: dropdown
    };

    const optionsContainer = {
      addEventListener(event, fn) { listeners.dropdown[event] = fn; },
      querySelectorAll(sel) {
        if (sel === '.category-pill') return [pillOption];
        return [];
      }
    };

    try {
      const controller = initCategoryDropdown({
        triggerBtn,
        dropdown,
        activeLabel,
        optionsContainer,
        onSelectCategory: (cat) => {
          selectedCategory = cat;
        }
      });

      assert.ok(controller, 'controller should be returned');

      // 1. Click trigger to open
      listeners.trigger.click({ stopPropagation: () => {} });
      assert.strictEqual(triggerBtn.getAttribute('aria-expanded'), 'true');
      assert.strictEqual(dropdown.style.display, 'block');

      // 2. Select category pill option
      listeners.dropdown.click({
        target: {
          closest: (sel) => (sel === '.category-pill' ? pillOption : null)
        }
      });

      assert.strictEqual(selectedCategory, '3');
      assert.strictEqual(activeLabel.textContent, '3 Foto');
      assert.strictEqual(dropdown.style.display, 'none');
      assert.strictEqual(triggerBtn.getAttribute('aria-expanded'), 'false');

      // 3. Open and close via Escape
      listeners.trigger.click({ stopPropagation: () => {} });
      assert.strictEqual(triggerBtn.getAttribute('aria-expanded'), 'true');
      listeners.doc.keydown({ key: 'Escape' });
      assert.strictEqual(dropdown.style.display, 'none');
      assert.strictEqual(triggerBtn.getAttribute('aria-expanded'), 'false');
      assert.strictEqual(focused, true);

      // 4. Open and close via Outside Click
      listeners.trigger.click({ stopPropagation: () => {} });
      assert.strictEqual(triggerBtn.getAttribute('aria-expanded'), 'true');
      listeners.doc.click({ target: { dummy: 'outside' } });
      assert.strictEqual(dropdown.style.display, 'none');
      assert.strictEqual(triggerBtn.getAttribute('aria-expanded'), 'false');
    } finally {
      globalThis.document = originalDocument;
    }
  });
});
