import { loadStudioImage } from './core/canvas/renderer.js';
import { TEMPLATE_SAMPLES } from './features/templates/template_samples.js';
import { initControls } from './features/controls/controls_manager.js';
import { initGallery } from './features/gallery/gallery_manager.js';
import { initTheme } from './features/theme/theme_manager.js';
import { renderStudioFrame } from './features/stage/preview_orchestrator.js';
import { bindExportActions } from './features/export/export_actions.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Global Studio State
  let state = {
    templateId: 'focus_editorial',
    photoDataUrl: null,
    photoImg: null,
    isUserUploaded: false,
    zoom: 1,
    panX: 0,
    panY: 0,
    filter: 'none',
    caption: TEMPLATE_SAMPLES.focus_editorial.caption,
    subtitle: TEMPLATE_SAMPLES.focus_editorial.subtitle,
    date: TEMPLATE_SAMPLES.focus_editorial.date
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
    activeCanvas = await renderStudioFrame({
      state,
      previewImage,
      previewLoader,
      onRedraw: () => renderStudioCanvas()
    });
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
          state.date = sample.date;
          const ci = document.getElementById('captionInput');
          if (ci) ci.value = sample.caption;
          const si = document.getElementById('subtitleInput');
          if (si) si.value = sample.subtitle;
          const di = document.getElementById('dateInput');
          if (di) di.value = sample.date;
        } catch {
          // Keep existing photoImg if asset fetch fails
        }
      }
    }

    renderStudioCanvas();
  };

  // Initialize Theme Switcher (Dark Studio / Rose Light)
  initTheme({
    buttonEl: document.getElementById('themeToggleBtn')
  });

  // Initialize Landing Template Gallery
  initGallery({
    galleryView: document.getElementById('galleryView'),
    galleryGrid: document.getElementById('galleryGrid'),
    studioWorkspace: document.getElementById('studioWorkspace'),
    backBtn: document.getElementById('backToGalleryBtn'),
    onSelectTemplate: async (templateId) => {
      await updateState((prev) => ({ ...prev, templateId }));
    }
  });

  // Initialize Studio Controls
  initControls(
    {
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

  // Bind Export Actions
  bindExportActions({
    downloadBtn,
    copyBtn,
    copyBtnLabel,
    getActiveCanvas: () => activeCanvas,
    getState: () => state
  });

  // Preload initial studio reference photo and essential overlay assets
  try {
    const sampleImg = await loadStudioImage(TEMPLATE_SAMPLES.focus_editorial.src);
    if (!state.photoImg) {
      state.photoImg = sampleImg;
    }
    loadStudioImage('assets/astral_overlay.png').catch(() => {});
  } catch {
    // Non-blocking fallback if asset is missing or blocked
  }

  // Initial render
  renderStudioCanvas();
});
