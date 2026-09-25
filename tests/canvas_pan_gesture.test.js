import { describe, it } from 'node:test';
import assert from 'node:assert';
import { clamp, initCanvasPanGesture } from '../src/features/stage/canvas_pan_gesture.js';

describe('Canvas Drag Pan Gesture Engine', () => {
  it('should clamp numbers accurately within bounds', () => {
    assert.strictEqual(clamp(50, 0, 100), 50);
    assert.strictEqual(clamp(-10, 0, 100), 0);
    assert.strictEqual(clamp(150, 0, 100), 100);
  });

  it('should return null if viewportEl is null or undefined', () => {
    const res = initCanvasPanGesture({ viewportEl: null });
    assert.strictEqual(res, null);
  });

  it('should handle pointerdown, move, and up lifecycle updating state and sliders', () => {
    const listeners = {};
    const classes = new Set();
    const viewportEl = {
      classList: {
        add: (c) => classes.add(c),
        remove: (c) => classes.delete(c),
        contains: (c) => classes.has(c)
      },
      addEventListener: (e, fn) => { listeners[e] = fn; },
      removeEventListener: (e) => { delete listeners[e]; },
      setPointerCapture: () => {},
      releasePointerCapture: () => {}
    };

    const panXSlider = { value: '0' };
    const panYSlider = { value: '0' };
    let currentState = { panX: 0, panY: 0, zoom: 1 };
    let recordedHistory = null;

    const controller = initCanvasPanGesture({
      viewportEl,
      panXSlider,
      panYSlider,
      getState: () => currentState,
      updateState: (updater, options) => {
        currentState = typeof updater === 'function' ? updater(currentState) : { ...currentState, ...updater };
        if (options?.recordHistory) recordedHistory = true;
      }
    });

    assert.ok(controller);
    assert.strictEqual(typeof controller.destroy, 'function');

    // 1. Pointer Down
    listeners.pointerdown({ button: 0, clientX: 100, clientY: 100, pointerId: 1 });
    assert.strictEqual(classes.has('is-dragging'), true);

    // 2. Pointer Move (drag right 50px, down 30px)
    listeners.pointermove({ clientX: 150, clientY: 130 });
    assert.strictEqual(currentState.panX, 50);
    assert.strictEqual(currentState.panY, 30);
    assert.strictEqual(panXSlider.value, '50');
    assert.strictEqual(panYSlider.value, '30');

    // 3. Pointer Up
    listeners.pointerup({ pointerId: 1 });
    assert.strictEqual(classes.has('is-dragging'), false);
    assert.strictEqual(recordedHistory, true);

    controller.destroy();
    assert.strictEqual(Object.keys(listeners).length, 0);
  });

  it('should handle ctrl+wheel zoom scaling safely', () => {
    const listeners = {};
    const viewportEl = {
      addEventListener: (e, fn) => { listeners[e] = fn; },
      removeEventListener: (e) => { delete listeners[e]; }
    };
    const zoomSlider = { value: '100' };
    let currentState = { zoom: 1 };

    initCanvasPanGesture({
      viewportEl,
      zoomSlider,
      getState: () => currentState,
      updateState: (updater) => {
        currentState = typeof updater === 'function' ? updater(currentState) : { ...currentState, ...updater };
      }
    });

    // Ignored without ctrl/meta key
    listeners.wheel({ ctrlKey: false, metaKey: false, deltaY: -100 });
    assert.strictEqual(currentState.zoom, 1);

    // Zoom in with ctrlKey
    listeners.wheel({ ctrlKey: true, deltaY: -100, preventDefault: () => {} });
    assert.strictEqual(currentState.zoom, 1.05);
    assert.strictEqual(zoomSlider.value, '105');

    // Zoom out with ctrlKey
    listeners.wheel({ ctrlKey: true, deltaY: 100, preventDefault: () => {} });
    assert.strictEqual(currentState.zoom, 1);
  });
});
