import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { filterSidebarTemplates, initSidebar } from '../src/features/sidebar/sidebar_manager.js';
import {
  renderSidebarCategories,
  renderSidebarTemplateList,
  highlightActiveSidebarCard
} from '../src/features/sidebar/sidebar_renderer.js';

function createMockElement(initial = {}) {
  const listeners = {};
  const classes = new Set(initial.className ? initial.className.split(' ') : []);
  const children = [];

  const el = {
    value: initial.value ?? '',
    textContent: initial.textContent ?? '',
    dataset: initial.dataset ?? {},
    innerHTML: '',
    children,
    get className() {
      return Array.from(classes).join(' ');
    },
    set className(val) {
      classes.clear();
      if (val) val.split(' ').filter(Boolean).forEach((c) => classes.add(c));
    },
    classList: {
      add: (c) => classes.add(c),
      remove: (c) => classes.delete(c),
      contains: (c) => classes.has(c),
      toggle: (c, force) => {
        if (force === undefined) {
          if (classes.has(c)) classes.delete(c);
          else classes.add(c);
        } else if (force) classes.add(c);
        else classes.delete(c);
      }
    },
    addEventListener: (event, fn) => {
      listeners[event] = fn;
    },
    trigger: (event, eventObj = {}) => {
      if (listeners[event]) listeners[event]({ target: { value: eventObj.value ?? '' }, ...eventObj });
    },
    appendChild: (child) => {
      children.push(child);
    },
    setAttribute: () => {},
    focus: () => {},
    scrollIntoView: () => {},
    querySelectorAll: (selector) => {
      return children.filter(() => true);
    }
  };
  return el;
}

describe('Studio Left Slide Bar (Quick Templates Drawer)', () => {
  const mockTemplates = [
    { id: 'focus_editorial', name: 'Focus Editorial', photoCount: 1, category: '1', tag: 'EDITORIAL' },
    { id: 'bnw_duo', name: 'B&W Duo Prints', photoCount: 2, category: '2', tag: 'ANALOG' },
    { id: 'trip_to_hill', name: 'Trip To Hill', photoCount: 3, category: '3', tag: 'TORN' },
    { id: 'ocean_stories', name: 'Ocean Stories', photoCount: 4, category: '4+', tag: 'STORIES' }
  ];

  it('should filter templates accurately by category', () => {
    const all = filterSidebarTemplates(mockTemplates, 'all', '');
    assert.strictEqual(all.length, 4);

    const single = filterSidebarTemplates(mockTemplates, '1', '');
    assert.strictEqual(single.length, 1);
    assert.strictEqual(single[0].id, 'focus_editorial');

    const multi = filterSidebarTemplates(mockTemplates, '4+', '');
    assert.strictEqual(multi.length, 1);
    assert.strictEqual(multi[0].id, 'ocean_stories');
  });

  it('should filter templates accurately by search query', () => {
    const matchName = filterSidebarTemplates(mockTemplates, 'all', 'editorial');
    assert.strictEqual(matchName.length, 1);
    assert.strictEqual(matchName[0].id, 'focus_editorial');

    const matchTag = filterSidebarTemplates(mockTemplates, 'all', 'analog');
    assert.strictEqual(matchTag.length, 1);
    assert.strictEqual(matchTag[0].id, 'bnw_duo');

    const none = filterSidebarTemplates(mockTemplates, 'all', 'nonexistent');
    assert.strictEqual(none.length, 0);
  });

  it('should render category pills and template list items into DOM', () => {
    const origDoc = globalThis.document;
    globalThis.document = {
      createElement: () => createMockElement()
    };

    const catContainer = createMockElement();
    let selectedCat = null;
    renderSidebarCategories(catContainer, 'all', (catId) => {
      selectedCat = catId;
    });

    assert.ok(catContainer.children.length >= 4);
    catContainer.children[1].trigger('click');
    assert.strictEqual(selectedCat, '1');

    const listContainer = createMockElement();
    let selectedTpl = null;
    renderSidebarTemplateList(listContainer, mockTemplates, 'bnw_duo', (id) => {
      selectedTpl = id;
    });

    assert.strictEqual(listContainer.children.length, 4);
    assert.ok(listContainer.children[1].classList.contains('active'));

    listContainer.children[0].trigger('click');
    assert.strictEqual(selectedTpl, 'focus_editorial');

    globalThis.document = origDoc;
  });

  it('should toggle open and close state via manager API', () => {
    const sidebarEl = createMockElement();
    const backdropEl = createMockElement();
    const floatingToggleBtn = createMockElement();
    const appHeaderToggleBtn = createMockElement();
    const closeBtn = createMockElement();

    const manager = initSidebar({
      sidebarEl,
      backdropEl,
      floatingToggleBtn,
      appHeaderToggleBtn,
      closeBtn,
      getActiveTemplateId: () => 'focus_editorial'
    });

    assert.strictEqual(manager.isOpen(), false);

    manager.open();
    assert.strictEqual(manager.isOpen(), true);
    assert.ok(sidebarEl.classList.contains('open'));
    assert.ok(backdropEl.classList.contains('active'));

    manager.close();
    assert.strictEqual(manager.isOpen(), false);
    assert.strictEqual(sidebarEl.classList.contains('open'), false);

    floatingToggleBtn.trigger('click');
    assert.strictEqual(manager.isOpen(), true);

    closeBtn.trigger('click');
    assert.strictEqual(manager.isOpen(), false);

    appHeaderToggleBtn.trigger('click');
    assert.strictEqual(manager.isOpen(), true);

    closeBtn.trigger('click');
    assert.strictEqual(manager.isOpen(), false);
  });
});
