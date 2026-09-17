import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  renderGalleryCards,
  switchToStudio,
  switchToGallery,
  filterTemplatesByCategory
} from '../src/features/gallery/gallery_manager.js';

describe('Template Gallery & Transition Engine', () => {
  it('should render cards for registered templates with metadata and click listeners', () => {
    let capturedClick = null;
    const mockContainer = {
      innerHTML: '',
      children: [],
      appendChild(child) {
        this.children.push(child);
      }
    };

    // Lightweight mock DOM environment for node test
    const originalDocument = globalThis.document;
    globalThis.document = {
      createElement(tag) {
        const el = {
          tagName: tag.toUpperCase(),
          className: '',
          dataset: {},
          style: {},
          attributes: {},
          listeners: {},
          innerHTML: '',
          setAttribute(k, v) { this.attributes[k] = v; },
          addEventListener(event, fn) { this.listeners[event] = fn; },
          click() { if (this.listeners.click) this.listeners.click(); }
        };
        return el;
      }
    };

    const mockTemplates = [
      {
        id: 'test_tpl_1',
        name: 'Test Template 1',
        description: 'Test description 1',
        previewImage: 'assets/test.jpg',
        aspectRatio: '3:4',
        tag: 'EDITORIAL'
      }
    ];

    try {
      renderGalleryCards(mockContainer, mockTemplates, (id) => {
        capturedClick = id;
      });

      assert.strictEqual(mockContainer.children.length, 1);
      const card = mockContainer.children[0];
      assert.strictEqual(card.dataset.templateId, 'test_tpl_1');
      assert.ok(card.innerHTML.includes('Test Template 1'));
      assert.ok(card.innerHTML.includes('assets/test.jpg'));
      assert.ok(card.innerHTML.includes('EDITORIAL'));

      // Simulate card click
      card.click();
      assert.strictEqual(capturedClick, 'test_tpl_1');
    } finally {
      globalThis.document = originalDocument;
    }
  });

  it('should switch display styles properly between gallery and studio', () => {
    const galleryView = { style: { display: 'block' } };
    const studioWorkspace = {
      style: { display: 'none' },
      querySelector: () => null
    };

    switchToStudio({ galleryView, studioWorkspace });
    assert.strictEqual(galleryView.style.display, 'none');
    assert.strictEqual(studioWorkspace.style.display, 'grid');

    switchToGallery({ galleryView, studioWorkspace });
    assert.strictEqual(galleryView.style.display, 'block');
    assert.strictEqual(studioWorkspace.style.display, 'none');
  });

  it('should filter templates properly by category photo count and category attribute', () => {
    const list = [
      { id: 'a', photoCount: 1 },
      { id: 'b', photoCount: 1 },
      { id: 'c', photoCount: 2 },
      { id: 'd', photoCount: 3, category: '3' },
      { id: 'e', photoCount: 4 }
    ];

    assert.strictEqual(filterTemplatesByCategory(list, 'all').length, 5);
    assert.strictEqual(filterTemplatesByCategory(list, '1').length, 2);
    assert.strictEqual(filterTemplatesByCategory(list, '2').length, 1);
    assert.strictEqual(filterTemplatesByCategory(list, '3').length, 1);
    assert.strictEqual(filterTemplatesByCategory(list, '3')[0].id, 'd');
    assert.strictEqual(filterTemplatesByCategory(list, '4').length, 1);
    assert.strictEqual(filterTemplatesByCategory(null, '2').length, 0);
  });
});
