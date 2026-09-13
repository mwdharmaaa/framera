import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { downloadCanvasImage, copyCanvasImage } from '../src/features/export/exporter.js';
import { bindExportActions } from '../src/features/export/export_actions.js';

describe('Studio Exporter & Actions Engine', () => {
  it('should trigger browser download link with correct filename and href', () => {
    let clicked = false;
    let appended = false;
    let removed = false;

    const mockLink = {
      download: '',
      href: '',
      click: () => { clicked = true; }
    };

    const originalDocument = globalThis.document;
    globalThis.document = {
      createElement: (tag) => (tag === 'a' ? mockLink : {}),
      body: {
        appendChild: () => { appended = true; },
        removeChild: () => { removed = true; }
      }
    };

    const mockCanvas = {
      toDataURL: () => 'data:image/png;base64,mockdata'
    };

    downloadCanvasImage(mockCanvas, 'test-export.png');

    assert.strictEqual(mockLink.download, 'test-export.png');
    assert.strictEqual(mockLink.href, 'data:image/png;base64,mockdata');
    assert.ok(clicked);
    assert.ok(appended);
    assert.ok(removed);

    globalThis.document = originalDocument;
  });

  it('should return false when canvas is null or invalid in copyCanvasImage', async () => {
    const res = await copyCanvasImage(null);
    assert.strictEqual(res, false);
  });

  it('should bind download and copy click handlers properly', () => {
    let downloadCalled = false;
    let copyCalled = false;

    const downloadBtn = {
      listeners: {},
      addEventListener(e, fn) { this.listeners[e] = fn; },
      click() { if (this.listeners.click) this.listeners.click(); }
    };

    const copyBtn = {
      listeners: {},
      addEventListener(e, fn) { this.listeners[e] = fn; },
      click() { if (this.listeners.click) this.listeners.click(); }
    };

    const copyBtnLabel = { textContent: 'Copy Image' };

    const mockCanvas = {
      toDataURL: () => 'data:image/png;base64,mock'
    };

    const originalDocument = globalThis.document;
    globalThis.document = {
      createElement: () => ({ click: () => { downloadCalled = true; } }),
      body: { appendChild: () => {}, removeChild: () => {} }
    };

    bindExportActions({
      downloadBtn,
      copyBtn,
      copyBtnLabel,
      getActiveCanvas: () => mockCanvas,
      getState: () => ({ caption: 'MY ARTWORK' })
    });

    downloadBtn.click();
    assert.ok(downloadCalled);

    globalThis.document = originalDocument;
  });
});
