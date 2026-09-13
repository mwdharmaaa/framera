import { downloadCanvasImage, copyCanvasImage } from './exporter.js';

/**
 * Binds download and clipboard copy action handlers for studio exports.
 * @param {object} params
 * @param {HTMLElement|null} params.downloadBtn
 * @param {HTMLElement|null} params.copyBtn
 * @param {HTMLElement|null} params.copyBtnLabel
 * @param {() => HTMLCanvasElement|null} params.getActiveCanvas
 * @param {() => object} params.getState
 */
export function bindExportActions({ downloadBtn, copyBtn, copyBtnLabel, getActiveCanvas, getState }) {
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const canvas = getActiveCanvas();
      if (!canvas) return;
      const state = getState();
      const slug = (state.caption || 'photo')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      downloadCanvasImage(canvas, `framera-${slug || 'photo'}.png`);
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const canvas = getActiveCanvas();
      if (!canvas) return;
      const success = await copyCanvasImage(canvas);
      if (success && copyBtnLabel) {
        copyBtnLabel.textContent = 'Copied!';
        setTimeout(() => {
          copyBtnLabel.textContent = 'Copy Image';
        }, 2000);
      }
    });
  }
}
