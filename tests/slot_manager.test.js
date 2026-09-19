import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { createSlotList, updateSlotAtIndex, renderSlotSelectorStrip } from '../src/features/slots/slot_manager.js';

describe('Multi-Slot Photo Manager Engine', () => {
  test('should create slot list with proper default structure and length', () => {
    const mockImgs = [{ width: 100 }, { width: 200 }];
    const slots = createSlotList(3, mockImgs);

    assert.equal(slots.length, 3);
    assert.equal(slots[0].id, 0);
    assert.equal(slots[0].img, mockImgs[0]);
    assert.equal(slots[1].id, 1);
    assert.equal(slots[1].img, mockImgs[1]);
    // slot 3 falls back to first image
    assert.equal(slots[2].id, 2);
    assert.equal(slots[2].img, mockImgs[0]);
    assert.equal(slots[0].zoom, 1);
    assert.equal(slots[0].panX, 0);
  });

  test('should update specific slot immutably without mutating siblings', () => {
    const slots = createSlotList(2);
    const updated = updateSlotAtIndex(slots, 1, { zoom: 1.4, panX: 50 });

    assert.equal(updated[0].zoom, 1);
    assert.equal(updated[0].panX, 0);
    assert.equal(updated[1].zoom, 1.4);
    assert.equal(updated[1].panX, 50);
  });

  test('should render tab elements into DOM container when multiple slots exist', () => {
    const slots = createSlotList(3);
    const mockDoc = {
      createElement: (tag) => ({
        tag,
        className: '',
        attributes: {},
        children: [],
        listeners: {},
        setAttribute(k, v) { this.attributes[k] = v; },
        appendChild(child) { this.children.push(child); },
        addEventListener(event, fn) { this.listeners[event] = fn; }
      })
    };
    const mockContainer = {
      ownerDocument: mockDoc,
      style: {},
      innerHTML: '',
      children: [],
      appendChild(el) { this.children.push(el); }
    };

    let selectedIdx = -1;
    renderSlotSelectorStrip(mockContainer, slots, 1, (idx) => { selectedIdx = idx; });

    assert.equal(mockContainer.style.display, 'flex');
    assert.equal(mockContainer.children.length, 3);
  });

  test('should hide container when slot count is 1', () => {
    const slots = createSlotList(1);
    const mockContainer = {
      style: {},
      innerHTML: 'existing',
      children: []
    };

    renderSlotSelectorStrip(mockContainer, slots, 0);
    assert.equal(mockContainer.style.display, 'none');
    assert.equal(mockContainer.innerHTML, '');
  });
});
