import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { initControls, updateDropzoneHelper } from '../src/features/controls/controls_manager.js';

function createMockElement(initial = {}) {
  const listeners = {};
  const classes = new Set(initial.className ? initial.className.split(' ') : []);
  const children = [];

  return {
    value: initial.value ?? '',
    textContent: initial.textContent ?? '',
    dataset: initial.dataset ?? {},
    innerHTML: '',
    children,
    classList: {
      add: (c) => classes.add(c),
      remove: (c) => classes.delete(c),
      contains: (c) => classes.has(c)
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
    querySelectorAll: (selector) => {
      return children.filter(() => true);
    }
  };
}

describe('Studio Controls Manager Engine', () => {
  it('should render filter chips and toggle active state on selection', () => {
    const filterContainer = createMockElement();
    const originalDocument = globalThis.document;
    globalThis.document = {
      createElement: () => createMockElement()
    };

    let updatedState = null;
    const updateState = (updater) => {
      updatedState = updater({ filter: 'none' });
    };

    initControls(
      { filterChipsContainer: filterContainer },
      { filter: 'none' },
      updateState
    );

    assert.ok(filterContainer.children.length > 0);
    const chip = filterContainer.children[1];
    chip.trigger('click');
    assert.ok(updatedState);
    assert.strictEqual(updatedState.filter, chip.dataset.filter);

    globalThis.document = originalDocument;
  });

  it('should handle zoom and pan slider adjustments', () => {
    const zoomSlider = createMockElement({ value: '100' });
    const zoomValLabel = createMockElement({ textContent: '100%' });
    const panXSlider = createMockElement({ value: '0' });
    const panYSlider = createMockElement({ value: '0' });
    const resetPanBtn = createMockElement();

    let state = { zoom: 1, panX: 0, panY: 0 };
    const updateState = (updater) => {
      state = updater(state);
    };

    initControls(
      {
        zoomSlider,
        zoomValueLabel: zoomValLabel,
        panXSlider,
        panYSlider,
        resetPanBtn
      },
      state,
      updateState
    );

    // Zoom slider input
    zoomSlider.trigger('input', { value: '150' });
    assert.strictEqual(state.zoom, 1.5);
    assert.strictEqual(zoomValLabel.textContent, '150%');

    // Pan X slider input
    panXSlider.trigger('input', { value: '50' });
    assert.strictEqual(state.panX, 50);

    // Pan Y slider input
    panYSlider.trigger('input', { value: '-30' });
    assert.strictEqual(state.panY, -30);

    // Reset button click
    resetPanBtn.trigger('click');
    assert.strictEqual(state.zoom, 1);
    assert.strictEqual(state.panX, 0);
    assert.strictEqual(state.panY, 0);
    assert.strictEqual(zoomSlider.value, '100');
    assert.strictEqual(zoomValLabel.textContent, '100%');
  });

  it('should synchronize text inputs for caption, subtitle, and date', () => {
    const captionInput = createMockElement({ value: 'FOCUS' });
    const subtitleInput = createMockElement({ value: 'SUBTITLE' });
    const dateInput = createMockElement({ value: '2026' });

    let state = { caption: 'FOCUS', subtitle: 'SUBTITLE', date: '2026' };
    const updateState = (updater) => {
      state = updater(state);
    };

    initControls(
      { captionInput, subtitleInput, dateInput },
      state,
      updateState
    );

    captionInput.trigger('input', { value: 'NEW CAPTION' });
    assert.strictEqual(state.caption, 'NEW CAPTION');

    subtitleInput.trigger('input', { value: 'NEW SUBTITLE' });
    assert.strictEqual(state.subtitle, 'NEW SUBTITLE');

    dateInput.trigger('input', { value: '2027' });
    assert.strictEqual(state.date, '2027');
  });

  it('should update dropzone copy dynamically for multi-photo templates', () => {
    const labelEl = createMockElement({ textContent: 'Default' });
    const subEl = createMockElement({ textContent: 'Default Sub' });
    const dropzone = {
      querySelector: (selector) => {
        if (selector === '.dropzone-label') return labelEl;
        if (selector === '.dropzone-sub') return subEl;
        return null;
      }
    };

    updateDropzoneHelper(dropzone, { photoCount: 3, name: 'Vinyl Trio' });
    assert.ok(labelEl.textContent.includes('3 Photos'));
    assert.ok(subEl.textContent.includes('Vinyl Trio'));

    updateDropzoneHelper(dropzone, { photoCount: 1, name: 'Focus Editorial' });
    assert.strictEqual(labelEl.textContent, 'Click or Drag & Drop Photo');
  });

  it('should target active slot when uploading single photo in multi-slot template', async () => {
    const fileInput = createMockElement();
    const originalFileReader = globalThis.FileReader;
    const originalImage = globalThis.Image;

    globalThis.FileReader = class {
      readAsDataURL() {
        setTimeout(() => {
          this.result = 'data:image/png;base64,mock';
          if (this.onload) this.onload({ target: this });
        }, 0);
      }
    };
    globalThis.Image = class {
      constructor() {
        this.naturalWidth = 800;
        this.naturalHeight = 600;
        setTimeout(() => {
          if (this.onload) this.onload();
        }, 0);
      }
    };

    const initialPhoto0 = { name: 'PhotoA' };
    const initialPhoto1 = { name: 'PhotoB' };

    let state = {
      templateId: 'the_sentimental',
      activeSlotIndex: 1,
      photoImgs: [initialPhoto0, initialPhoto1],
      photoImg: initialPhoto0,
      slots: [
        { id: 0, img: initialPhoto0, zoom: 1, panX: 0, panY: 0 },
        { id: 1, img: initialPhoto1, zoom: 1, panX: 0, panY: 0 }
      ]
    };

    const updateState = (updater) => {
      state = updater(state);
    };

    initControls({ fileInput }, state, updateState);

    const mockFile = { type: 'image/png', name: 'uploaded.png' };
    fileInput.trigger('change', { target: { files: [mockFile] } });

    await new Promise((resolve) => setTimeout(resolve, 80));

    assert.strictEqual(state.slots[0].img, initialPhoto0);
    assert.strictEqual(state.photoImgs[0], initialPhoto0);
    assert.notStrictEqual(state.slots[1].img, initialPhoto1);
    assert.notStrictEqual(state.photoImgs[1], initialPhoto1);
    assert.ok(state.isUserUploaded);

    globalThis.FileReader = originalFileReader;
    globalThis.Image = originalImage;
  });
});
