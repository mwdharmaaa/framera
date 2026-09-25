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

  it('should route save through window.FrameraNative if native Android bridge is available', () => {
    let nativeSaved = false;
    let savedFilename = '';

    globalThis.window = {
      FrameraNative: {
        saveImageToGallery: (dataUrl, filename) => {
          nativeSaved = true;
          savedFilename = filename;
        }
      }
    };

    const mockCanvas = {
      toDataURL: () => 'data:image/jpeg;base64,nativejpeg'
    };

    downloadCanvasImage(mockCanvas, 'custom.jpg', { format: 'jpeg' });
    assert.strictEqual(nativeSaved, true);
    assert.strictEqual(savedFilename, 'custom.jpg');

    delete globalThis.window;
  });

  it('should return false for shareCanvasImage when canvas is null or unsupported', async () => {
    const res = await (await import('../src/features/export/exporter.js')).shareCanvasImage(null);
    assert.strictEqual(res, false);
  });

  it('should handle header export button and format selection modal', async () => {
    let downloadCalled = false;
    let modalOpened = false;
    let modalClosed = false;

    const headerExportBtn = {
      listeners: {},
      addEventListener(e, fn) { this.listeners[e] = fn; },
      click() { if (this.listeners.click) this.listeners.click(); }
    };

    const formatBtnPng = {
      dataset: { exportFormat: 'png' },
      listeners: {},
      addEventListener(e, fn) { this.listeners[e] = fn; },
      click() { if (this.listeners.click) this.listeners.click(); },
      querySelector: () => null
    };

    const exportModal = {
      classList: {
        add: () => { modalOpened = true; },
        remove: () => { modalClosed = true; },
        contains: () => true
      },
      setAttribute: () => {},
      addEventListener: () => {},
      querySelectorAll: (sel) => sel === '[data-export-format]' ? [formatBtnPng] : []
    };

    const mockCanvas = {
      toDataURL: () => 'data:image/png;base64,mock'
    };

    const originalDocument = globalThis.document;
    globalThis.document = {
      createElement: () => ({ click: () => { downloadCalled = true; } }),
      body: { appendChild: () => {}, removeChild: () => {} },
      addEventListener: () => {}
    };

    bindExportActions({
      headerExportBtn,
      exportModal,
      getActiveCanvas: () => mockCanvas,
      getState: () => ({ caption: 'MODAL EXPORT' })
    });

    headerExportBtn.click();
    assert.strictEqual(modalOpened, true);

    formatBtnPng.click();
    assert.strictEqual(downloadCalled, true);
    assert.strictEqual(modalClosed, true);

    modalClosed = false;
    const formatBtnShare = {
      dataset: { exportFormat: 'share' },
      listeners: {},
      addEventListener(e, fn) { this.listeners[e] = fn; },
      click() { if (this.listeners.click) this.listeners.click(); },
      querySelector: () => null
    };
    exportModal.querySelectorAll = (sel) => sel === '[data-export-format]' ? [formatBtnShare] : [];
    bindExportActions({
      headerExportBtn,
      exportModal,
      getActiveCanvas: () => mockCanvas,
      getState: () => ({ caption: 'SHARE EXPORT' })
    });
    await formatBtnShare.click();
    assert.strictEqual(modalClosed, true);

    globalThis.document = originalDocument;
  });
});
