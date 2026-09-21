import { downloadCanvasImage, copyCanvasImage } from './exporter.js';

/**
 * Executes canvas export for a specified format.
 * @param {HTMLCanvasElement} canvas
 * @param {object} state
 * @param {string} format
 */
export function executeCanvasExport(canvas, state, format = 'png') {
  if (!canvas) return;
  const slug = (state?.caption || 'photo')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const ext = format === 'jpeg' ? 'jpg' : format;
  const filename = `framera-${slug || 'photo'}.${ext}`;
  downloadCanvasImage(canvas, filename, { format });
}

/**
 * Binds download, format selection, header export, and clipboard copy action handlers.
 * @param {object} params
 * @param {HTMLElement|null} [params.downloadBtn]
 * @param {HTMLElement|null} [params.copyBtn]
 * @param {HTMLElement|null} [params.copyBtnLabel]
 * @param {HTMLSelectElement|null} [params.formatSelect]
 * @param {HTMLElement|null} [params.headerExportBtn]
 * @param {HTMLElement|null} [params.exportModal]
 * @param {HTMLElement|null} [params.exportModalCloseBtn]
 * @param {() => HTMLCanvasElement|null} params.getActiveCanvas
 * @param {() => object} params.getState
 */
export function bindExportActions({
  downloadBtn,
  copyBtn,
  copyBtnLabel,
  formatSelect,
  headerExportBtn,
  exportModal,
  exportModalCloseBtn,
  getActiveCanvas,
  getState
}) {
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const canvas = getActiveCanvas();
      if (!canvas) return;
      const format = formatSelect?.value || 'png';
      executeCanvasExport(canvas, getState(), format);
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

  if (headerExportBtn && exportModal) {
    const openModal = () => {
      exportModal.classList.add('active');
      exportModal.setAttribute('aria-hidden', 'false');
    };

    const closeModal = () => {
      exportModal.classList.remove('active');
      exportModal.setAttribute('aria-hidden', 'true');
    };

    headerExportBtn.addEventListener('click', openModal);

    if (exportModalCloseBtn) {
      exportModalCloseBtn.addEventListener('click', closeModal);
    }

    exportModal.addEventListener('click', (e) => {
      if (e.target === exportModal || e.target.classList?.contains('export-modal-backdrop')) {
        closeModal();
      }
    });

    const formatButtons = exportModal.querySelectorAll('[data-export-format]');
    formatButtons.forEach((btn) => {
      btn.addEventListener('click', async () => {
        const format = btn.dataset?.exportFormat;
        const canvas = getActiveCanvas();
        if (!canvas) {
          closeModal();
          return;
        }

        if (format === 'copy') {
          const success = await copyCanvasImage(canvas);
          const labelEl = btn.querySelector('.export-btn-title') || btn;
          const origText = labelEl.textContent;
          if (success) {
            labelEl.textContent = 'Copied!';
            setTimeout(() => {
              labelEl.textContent = origText;
              closeModal();
            }, 800);
          } else {
            closeModal();
          }
          return;
        }

        executeCanvasExport(canvas, getState(), format);
        closeModal();
      });
    });

    if (typeof document !== 'undefined') {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && exportModal.classList.contains('active')) {
          closeModal();
        }
      });
    }
  }
}
