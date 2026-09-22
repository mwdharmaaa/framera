import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { renderHashtagChips, initSearchUi } from '../src/features/gallery/search_ui.js';

describe('Gallery Search UI Controller', () => {
  function createMockElement(tag = 'div') {
    return {
      tagName: tag.toUpperCase(),
      type: 'button',
      className: '',
      classList: {
        classes: new Set(),
        add(c) { this.classes.add(c); },
        remove(c) { this.classes.delete(c); },
        contains(c) { return this.classes.has(c); },
        toggle(c, force) {
          if (force === true) this.classes.add(c);
          else if (force === false) this.classes.delete(c);
          else if (this.classes.has(c)) this.classes.delete(c);
          else this.classes.add(c);
        }
      },
      innerHTML: '',
      textContent: '',
      value: '',
      style: {},
      dataset: {},
      attributes: {},
      children: [],
      listeners: {},
      setAttribute(k, v) { this.attributes[k] = v; },
      getAttribute(k) { return this.attributes[k]; },
      appendChild(child) { this.children.push(child); },
      addEventListener(event, fn) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(fn);
      },
      dispatchEvent(event) {
        const fns = this.listeners[event.type] || [];
        fns.forEach((fn) => fn(event));
      },
      click() {
        this.dispatchEvent({ type: 'click' });
      },
      focus() { this.isFocused = true; },
      blur() { this.isFocused = false; },
      select() { this.isSelected = true; }
    };
  }

  const sampleTemplates = [
    { id: 't1', name: 'Vintage 1', tag: 'VINTAGE', photoCount: 1 },
    { id: 't2', name: 'Cinema 2', tag: 'CINEMA', photoCount: 2 }
  ];

  describe('renderHashtagChips', () => {
    it('should render all pill and dynamic chips', () => {
      const container = createMockElement('div');
      const originalDocument = globalThis.document;
      globalThis.document = {
        createElement: (tag) => createMockElement(tag)
      };

      try {
        let selectedTag = null;
        renderHashtagChips(container, sampleTemplates, 'all', (tag) => {
          selectedTag = tag;
        });

        assert.ok(container.children.length >= 2);
        const allBtn = container.children[0];
        assert.strictEqual(allBtn.dataset.tag, 'all');
        assert.ok(allBtn.className.includes('active'));

        // Click dynamic chip
        const dynamicBtn = container.children[1];
        dynamicBtn.click();
        assert.strictEqual(selectedTag, dynamicBtn.dataset.tag);
      } finally {
        globalThis.document = originalDocument;
      }
    });

    it('should toggle back to all when clicking an active tag chip', () => {
      const container = createMockElement('div');
      const originalDocument = globalThis.document;
      globalThis.document = {
        createElement: (tag) => createMockElement(tag)
      };

      try {
        let selectedTag = null;
        renderHashtagChips(container, sampleTemplates, 'vintage', (tag) => {
          selectedTag = tag;
        });

        const vintageBtn = container.children.find((c) => c.dataset.tag === 'vintage');
        assert.ok(vintageBtn);
        assert.ok(vintageBtn.className.includes('active'));

        vintageBtn.click();
        assert.strictEqual(selectedTag, 'all');
      } finally {
        globalThis.document = originalDocument;
      }
    });
  });

  describe('initSearchUi', () => {
    it('should manage search input, clear button, and filter notifications', () => {
      const searchInput = createMockElement('input');
      const clearBtn = createMockElement('button');
      const resultsMeta = createMockElement('div');
      const resultsCount = createMockElement('span');
      const resetBtn = createMockElement('button');

      let lastChange = null;

      const controller = initSearchUi({
        searchInput,
        clearBtn,
        resultsMeta,
        resultsCount,
        resetBtn,
        onFilterChange: (change) => {
          lastChange = change;
        }
      });

      // Initial state
      assert.strictEqual(clearBtn.style.display, 'none');

      // Typing in search
      searchInput.value = 'vintage';
      searchInput.dispatchEvent({ type: 'input', target: searchInput });
      assert.strictEqual(clearBtn.style.display, 'inline-flex');

      // Escape key clears and notifies
      searchInput.dispatchEvent({ type: 'keydown', key: 'Escape' });
      assert.strictEqual(searchInput.value, '');
      assert.strictEqual(clearBtn.style.display, 'none');
      assert.strictEqual(lastChange.query, '');

      // Set query via controller
      controller.setQuery('editorial');
      assert.strictEqual(searchInput.value, 'editorial');
      assert.strictEqual(clearBtn.style.display, 'inline-flex');
      assert.strictEqual(lastChange.query, 'editorial');

      // Click clear button
      clearBtn.click();
      assert.strictEqual(searchInput.value, '');
      assert.strictEqual(clearBtn.style.display, 'none');
      assert.strictEqual(lastChange.query, '');

      // Update meta count
      controller.updateMeta(2, 10, true);
      assert.strictEqual(resultsMeta.style.display, 'flex');
      assert.strictEqual(resultsCount.textContent, 'Menampilkan 2 dari 10 template');

      controller.updateMeta(10, 10, false);
      assert.strictEqual(resultsMeta.style.display, 'none');

      // Reset button click
      controller.setQuery('test');
      controller.setTag('cinema');
      resetBtn.click();
      assert.strictEqual(controller.getQuery(), '');
      assert.strictEqual(controller.getTag(), 'all');
      assert.strictEqual(searchInput.value, '');
    });

    it('should manage tag dropdown menu toggle, badge text, and mutual close', () => {
      const tagMenuBtn = createMockElement('button');
      const tagMenuDropdown = createMockElement('div');
      const tagActiveName = createMockElement('span');
      const categoryMenuDropdown = createMockElement('div');
      const categoryMenuBtn = createMockElement('button');

      let lastFilter = null;

      const controller = initSearchUi({
        tagMenuBtn,
        tagMenuDropdown,
        tagActiveName,
        categoryMenuDropdown,
        categoryMenuBtn,
        onFilterChange: (f) => { lastFilter = f; }
      });

      // Initially closed and default label
      assert.strictEqual(tagActiveName.textContent, 'Semua');
      assert.strictEqual(tagMenuBtn.getAttribute('aria-expanded'), 'false');

      // Click toggle button opens dropdown
      tagMenuBtn.click();
      assert.strictEqual(tagMenuBtn.getAttribute('aria-expanded'), 'true');
      assert.strictEqual(tagMenuDropdown.style.display, 'block');

      // Click toggle again closes dropdown
      tagMenuBtn.click();
      assert.strictEqual(tagMenuBtn.getAttribute('aria-expanded'), 'false');
      assert.strictEqual(tagMenuDropdown.style.display, 'none');

      // Open and set tag
      controller.setTag('vintage', true);
      assert.strictEqual(tagActiveName.textContent, '#vintage');
      assert.strictEqual(controller.getTag(), 'vintage');
      assert.strictEqual(tagMenuDropdown.style.display, 'none');

      // Reset restores label and closes
      controller.openTagDropdown();
      assert.strictEqual(tagMenuDropdown.style.display, 'block');
      controller.reset();
      assert.strictEqual(tagActiveName.textContent, 'Semua');
      assert.strictEqual(tagMenuDropdown.style.display, 'none');
    });
  });
});
