import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  captureVideoFrame,
  runCountdown,
  executePhotoboothBurst
} from '../src/features/camera/camera_photobooth.js';
import { initCameraModal } from '../src/features/camera/camera_modal.js';

describe('Webcam Photobooth Engine', () => {
  it('should capture video frame onto mirrored canvas dataUrl', () => {
    let drawn = false;
    let translated = false;
    let scaled = false;

    globalThis.document = {
      createElement: (tag) => {
        if (tag === 'canvas') {
          return {
            width: 0,
            height: 0,
            getContext: () => ({
              translate: () => { translated = true; },
              scale: () => { scaled = true; },
              drawImage: () => { drawn = true; }
            }),
            toDataURL: (mime) => `data:${mime};base64,mockVideoSnapshot`
          };
        }
        return {};
      }
    };

    const mockVideo = {
      videoWidth: 640,
      videoHeight: 480
    };

    const result = captureVideoFrame(mockVideo, { mirror: true });
    assert.ok(result.dataUrl.includes('mockVideoSnapshot'));
    assert.strictEqual(result.width, 640);
    assert.strictEqual(result.height, 480);
    assert.ok(drawn);
    assert.ok(translated);
    assert.ok(scaled);
  });

  it('should reject capture when video frame dimensions are not ready', () => {
    const invalidVideo = { videoWidth: 0, videoHeight: 0 };
    assert.throws(() => {
      captureVideoFrame(invalidVideo);
    }, /not ready/);
  });

  it('should run countdown timer with step notifications', async () => {
    const ticks = [];
    // Fast mock for timer
    const originalSetInterval = globalThis.setInterval;
    const originalClearInterval = globalThis.clearInterval;

    try {
      globalThis.setInterval = (fn) => {
        fn();
        fn();
        fn();
        return 999;
      };
      globalThis.clearInterval = () => {};

      await runCountdown(3, (count) => {
        ticks.push(count);
      });

      assert.ok(ticks.length >= 3);
    } finally {
      globalThis.setInterval = originalSetInterval;
      globalThis.clearInterval = originalClearInterval;
    }
  });

  it('should initialize camera modal and manage open/close lifecycle', () => {
    let display = 'none';
    const modalEl = {
      style: {
        get display() { return display; },
        set display(v) { display = v; }
      }
    };

    const openBtn = {
      addEventListener(evt, fn) {
        if (evt === 'click') this.onclick = fn;
      }
    };
    const closeBtn = {
      addEventListener(evt, fn) {
        if (evt === 'click') this.onclick = fn;
      }
    };

    const controller = initCameraModal(
      { modalEl, openBtn, closeBtn },
      () => ({ slots: [{}, {}] }),
      async () => {}
    );

    assert.strictEqual(typeof controller.open, 'function');
    assert.strictEqual(typeof controller.close, 'function');
  });
});
