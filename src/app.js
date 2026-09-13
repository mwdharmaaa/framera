import { calculateImageBounds } from './core/canvas/bounds.js';
import { applyCanvasFilter } from './core/canvas/filters.js';
import { createStudioCanvas } from './core/canvas/renderer.js';
import { getTemplate } from './features/templates/template_registry.js';
import { initControls } from './features/controls/controls_manager.js';
import { downloadCanvasImage, copyCanvasImage } from './features/export/exporter.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Global Studio State
  let state = {
    templateId: 'polaroid',
    photoDataUrl: null,
    photoImg: null,
    zoom: 1,
    panX: 0,
    panY: 0,
    filter: 'none',
    caption: 'Cherished Moments',
    subtitle: 'Memories Archive',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  };

  const previewImage = document.getElementById('studioPreview');
  const previewLoader = document.getElementById('previewLoader');
  const downloadBtn = document.getElementById('downloadBtn');
  const copyBtn = document.getElementById('copyBtn');
  const copyBtnLabel = document.getElementById('copyBtnLabel');

  let activeCanvas = null;

  /**
   * Re-renders the studio canvas based on current state.
   */
  const renderStudioCanvas = async () => {
    if (previewLoader) previewLoader.style.display = 'flex';

    if (typeof document !== 'undefined' && document.fonts?.ready) {
      try {
        await document.fonts.ready;
      } catch {
        // Non-blocking font load fallback
      }
    }

    const tpl = getTemplate(state.templateId);
    const { canvas, ctx } = createStudioCanvas(tpl.config.canvasWidth, tpl.config.canvasHeight);

    let bounds = {
      drawX: tpl.config.frame.x,
      drawY: tpl.config.frame.y,
      drawW: tpl.config.frame.w,
      drawH: tpl.config.frame.h
    };

    if (state.photoImg) {
      bounds = calculateImageBounds(
        state.photoImg.naturalWidth || state.photoImg.width,
        state.photoImg.naturalHeight || state.photoImg.height,
        tpl.config.frame,
        {
          zoom: state.zoom,
          panX: state.panX,
          panY: state.panY,
          fitMode: 'cover'
        }
      );
    }

    // Apply color grading filter
    applyCanvasFilter(ctx, state.filter);

    // Render template layout
    tpl.render(ctx, state.photoImg, bounds, state);

    activeCanvas = canvas;
    if (previewImage) {
      previewImage.src = canvas.toDataURL('image/png');
      previewImage.style.display = 'block';
    }
    if (previewLoader) previewLoader.style.display = 'none';
  };

  const updateState = (updater) => {
    state = typeof updater === 'function' ? updater(state) : { ...state, ...updater };
    renderStudioCanvas();
  };

  // Initialize UI Controls
  initControls(
    {
      templateListEl: document.getElementById('templateList'),
      fileInput: document.getElementById('photoInput'),
      dropzone: document.getElementById('uploadDropzone'),
      zoomSlider: document.getElementById('zoomSlider'),
      zoomValueLabel: document.getElementById('zoomVal'),
      panXSlider: document.getElementById('panXSlider'),
      panYSlider: document.getElementById('panYSlider'),
      resetPanBtn: document.getElementById('resetPanBtn'),
      filterChipsContainer: document.getElementById('filterChips'),
      captionInput: document.getElementById('captionInput'),
      subtitleInput: document.getElementById('subtitleInput'),
      dateInput: document.getElementById('dateInput')
    },
    state,
    updateState
  );

  // Export Action Triggers
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      if (!activeCanvas) return;
      const slug = (state.caption || 'photo')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      downloadCanvasImage(activeCanvas, `framera-${slug || 'photo'}.png`);
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      if (!activeCanvas) return;
      const success = await copyCanvasImage(activeCanvas);
      if (success && copyBtnLabel) {
        copyBtnLabel.textContent = 'Copied!';
        setTimeout(() => {
          copyBtnLabel.textContent = 'Copy Image';
        }, 2000);
      }
    });
  }

  // Initial render
  renderStudioCanvas();
});
