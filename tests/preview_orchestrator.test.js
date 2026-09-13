import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { renderStudioFrame } from '../src/features/stage/preview_orchestrator.js';

describe('Preview Orchestrator Engine', () => {
  it('should render studio frame and update preview image without throwing', async () => {
    let loaderDisplay = '';
    let previewSrc = '';
    let previewDisplay = '';

    const mockCtx = {
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      closePath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      rect: () => {},
      roundRect: () => {},
      clip: () => {},
      fill: () => {},
      stroke: () => {},
      fillRect: () => {},
      strokeRect: () => {},
      fillText: () => {},
      measureText: () => ({ width: 50 }),
      drawImage: () => {},
      arc: () => {},
      translate: () => {},
      rotate: () => {},
      createLinearGradient: () => ({ addColorStop: () => {} }),
      createRadialGradient: () => ({ addColorStop: () => {} }),
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      font: '',
      textAlign: '',
      textBaseline: '',
      letterSpacing: '',
      filter: '',
      shadowColor: '',
      shadowBlur: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0
    };

    const mockCanvas = {
      width: 1080,
      height: 1350,
      getContext: () => mockCtx,
      toDataURL: () => 'data:image/png;base64,mockframe'
    };

    const originalDocument = globalThis.document;
    globalThis.document = {
      createElement: (tag) => (tag === 'canvas' ? mockCanvas : {}),
      fonts: { ready: Promise.resolve() }
    };

    const previewLoader = {
      style: {
        set display(val) { loaderDisplay = val; },
        get display() { return loaderDisplay; }
      }
    };

    const previewImage = {
      style: {
        set display(val) { previewDisplay = val; },
        get display() { return previewDisplay; }
      },
      set src(val) { previewSrc = val; },
      get src() { return previewSrc; }
    };

    const mockState = {
      templateId: 'wincore',
      photoImg: null,
      zoom: 1,
      panX: 0,
      panY: 0,
      filter: 'none',
      caption: 'Warning',
      subtitle: 'SUBTITLE TEST',
      date: '2026'
    };

    let redrawn = false;
    const canvas = await renderStudioFrame({
      state: mockState,
      previewImage,
      previewLoader,
      onRedraw: () => { redrawn = true; }
    });

    assert.ok(canvas);
    assert.strictEqual(typeof canvas.toDataURL, 'function');
    assert.strictEqual(loaderDisplay, 'none');
    assert.strictEqual(previewDisplay, 'block');
    assert.ok(previewSrc.startsWith('data:image/png'));

    globalThis.document = originalDocument;
  });
});
