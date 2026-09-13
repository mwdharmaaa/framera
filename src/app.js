import { calculateImageBounds } from './core/canvas/bounds.js';
import { applyCanvasFilter } from './core/canvas/filters.js';
import { createStudioCanvas, loadStudioImage } from './core/canvas/renderer.js';
import { renderFallbackStudioCanvas } from './core/canvas/fallback_renderer.js';
import { getTemplate } from './features/templates/template_registry.js';
import { initControls } from './features/controls/controls_manager.js';
import { downloadCanvasImage, copyCanvasImage } from './features/export/exporter.js';

const TEMPLATE_SAMPLES = {
  doodle_shadow: {
    src: 'assets/doodle_reference.jpg',
    caption: 'ALTER-EGO // SHADOWPLAY',
    subtitle: 'Unhinged alter-ego doodle shadow',
    date: '2026 - VOL.02'
  },
  focus_editorial: {
    src: 'assets/focus_reference.jpg',
    caption: 'FOCUS',
    subtitle: 'In a world obsessed with attention, focus becomes rare. It is not loud, dramatic, or rushed: it moves quietly, shaping dreams in silence while the distracted never notice.',
    date: '2026 - VOL.02'
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  // Global Studio State
  let state = {
    templateId: 'doodle_shadow',
    photoDataUrl: null,
    photoImg: null,
    isUserUploaded: false,
    zoom: 1,
    panX: 0,
    panY: 0,
    filter: 'none',
    caption: TEMPLATE_SAMPLES.doodle_shadow.caption,
    subtitle: TEMPLATE_SAMPLES.doodle_shadow.subtitle,
    date: TEMPLATE_SAMPLES.doodle_shadow.date
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
    const canvasWidth = tpl?.config?.canvasWidth || 1080;
    const canvasHeight = tpl?.config?.canvasHeight || 1350;
    const frame = tpl?.config?.frame || { x: 60, y: 60, w: canvasWidth - 120, h: canvasHeight - 160 };

    const { canvas, ctx } = createStudioCanvas(canvasWidth, canvasHeight);

    let bounds = {
      drawX: frame.x,
      drawY: frame.y,
      drawW: frame.w,
      drawH: frame.h
    };

    if (state.photoImg) {
      bounds = calculateImageBounds(
        state.photoImg.naturalWidth || state.photoImg.width,
        state.photoImg.naturalHeight || state.photoImg.height,
        frame,
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

    if (tpl && typeof tpl.render === 'function') {
      tpl.render(ctx, state.photoImg, bounds, state);
    } else {
      renderFallbackStudioCanvas(ctx, canvasWidth, canvasHeight, frame, state, bounds);
    }

    activeCanvas = canvas;
    if (previewImage) {
      previewImage.src = canvas.toDataURL('image/png');
      previewImage.style.display = 'block';
    }
    if (previewLoader) previewLoader.style.display = 'none';
  };

  const updateState = async (updater) => {
    const prevTemplateId = state.templateId;
    state = typeof updater === 'function' ? updater(state) : { ...state, ...updater };

    if (state.templateId !== prevTemplateId && !state.isUserUploaded) {
      const sample = TEMPLATE_SAMPLES[state.templateId];
      if (sample) {
        try {
          const img = await loadStudioImage(sample.src);
          state.photoImg = img;
          state.caption = sample.caption;
          state.subtitle = sample.subtitle;
          const ci = document.getElementById('captionInput');
          if (ci) ci.value = sample.caption;
          const si = document.getElementById('subtitleInput');
          if (si) si.value = sample.subtitle;
        } catch {
          // Keep existing photoImg if asset fetch fails
        }
      }
    }

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

  // Preload initial studio reference photo (Moof.jpg)
  try {
    const sampleImg = await loadStudioImage(TEMPLATE_SAMPLES.doodle_shadow.src);
    if (!state.photoImg) {
      state.photoImg = sampleImg;
    }
  } catch {
    // Non-blocking fallback if asset is missing or blocked
  }

  // Initial render
  renderStudioCanvas();
});
