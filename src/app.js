import { loadStudioImage } from './core/canvas/renderer.js';
import { TEMPLATE_SAMPLES } from './features/templates/template_samples.js';
import { getTemplate } from './features/templates/template_registry.js';
import { initControls, updateDropzoneHelper } from './features/controls/controls_manager.js';
import { initGallery } from './features/gallery/gallery_manager.js';
import { initTheme } from './features/theme/theme_manager.js';
import { renderStudioFrame } from './features/stage/preview_orchestrator.js';
import { initStageNavigator, updateTemplateIndicator } from './features/stage/stage_navigator.js';
import { initCanvasPanGesture } from './features/stage/canvas_pan_gesture.js';
import { bindExportActions } from './features/export/export_actions.js';
import { initPwaInstall } from './features/pwa/install_manager.js';
import { createHistoryManager } from './features/history/history_manager.js';
import { bindHistoryActions } from './features/history/history_actions.js';
import { saveDraft, loadDraft, saveDraftDebounced, flushPendingDraft } from './features/persistence/persistence_manager.js';
import { globalRenderScheduler } from './core/canvas/render_scheduler.js';
import { syncSlotsWithTemplate, updateActiveSlotFraming } from './features/slots/slot_orchestrator.js';
import { renderTypographySelector, FONT_PRESETS } from './features/typography/typography_manager.js';
import { renderColorwaySelector, COLORWAY_PRESETS } from './features/colorway/colorway_manager.js';
import { initCameraModal } from './features/camera/camera_modal.js';
import { initStickerManager } from './features/stickers/sticker_manager.js';

document.addEventListener('DOMContentLoaded', async () => {
  const initialDraft = loadDraft();

  const activeTplId = initialDraft?.templateId || 'focus_editorial';
  const defaultSample = TEMPLATE_SAMPLES[activeTplId] || TEMPLATE_SAMPLES.focus_editorial;
  const isStaleFocusCap = activeTplId !== 'focus_editorial' && initialDraft?.caption === 'FOCUS';
  const isStaleFocusSub = activeTplId !== 'focus_editorial' && typeof initialDraft?.subtitle === 'string' && initialDraft.subtitle.includes('obsessed with attention');

  let state = {
    templateId: activeTplId,
    photoDataUrl: initialDraft?.photoDataUrl || null,
    photoImg: null,
    isUserUploaded: initialDraft?.isUserUploaded || false,
    zoom: initialDraft?.zoom ?? 1,
    panX: initialDraft?.panX ?? 0,
    panY: initialDraft?.panY ?? 0,
    filter: initialDraft?.filter || 'none',
    caption: (!isStaleFocusCap && initialDraft?.caption) || defaultSample?.caption || '',
    subtitle: (!isStaleFocusSub && initialDraft?.subtitle) || defaultSample?.subtitle || '',
    date: initialDraft?.date || defaultSample?.date || '',
    activeSlotIndex: initialDraft?.activeSlotIndex ?? 0,
    slots: initialDraft?.slots || []
  };

  const previewImage = document.getElementById('studioPreview');
  const previewLoader = document.getElementById('previewLoader');
  const slotContainer = document.getElementById('slotSelectorStrip');
  let activeCanvas = null;

  const history = createHistoryManager({ maxDepth: 30 });

  const renderStudioCanvas = () => {
    globalRenderScheduler.schedule(async () => {
      activeCanvas = await renderStudioFrame({
        state,
        previewImage,
        previewLoader,
        onRedraw: () => renderStudioCanvas()
      });
    });
  };

  const updateState = async (updater, options = { recordHistory: true }) => {
    if (options.recordHistory !== false) {
      history.record(state);
    }
    const prevTemplateId = state.templateId;
    state = typeof updater === 'function' ? updater(state) : { ...state, ...updater };
    updateActiveSlotFraming(state, { zoom: state.zoom, panX: state.panX, panY: state.panY });

    if (state.templateId !== prevTemplateId) {
      const sample = TEMPLATE_SAMPLES[state.templateId];
      if (sample && !state.isUserUploaded) {
        try {
          if (Array.isArray(sample.photos) && sample.photos.length > 0) {
            const loaded = await Promise.all(sample.photos.map((p) => loadStudioImage(p).catch(() => null)));
            state.photoImgs = loaded.filter(Boolean);
            state.photoImg = state.photoImgs[0] || null;
          } else {
            const img = await loadStudioImage(sample.src);
            state.photoImg = img;
            state.photoImgs = [img];
          }
        } catch {
          // Keep existing photoImg if asset fetch fails
        }
      }

      updateTemplateIndicator(
        state.templateId,
        document.getElementById('activeTemplateName'),
        document.getElementById('activeTemplateCounter')
      );

      const prevSample = TEMPLATE_SAMPLES[prevTemplateId];
      const isDefaultCap = !state.caption || state.caption === 'FOCUS' || state.caption === prevSample?.caption;
      const isDefaultSub = !state.subtitle || (typeof state.subtitle === 'string' && state.subtitle.includes('obsessed with attention')) || state.subtitle === prevSample?.subtitle;
      const isDefaultDate = !state.date || state.date === prevSample?.date;

      if (sample?.caption && isDefaultCap) {
        state.caption = sample.caption;
        const ci = document.getElementById('captionInput');
        if (ci) ci.value = sample.caption;
      }
      if (sample?.subtitle && isDefaultSub) {
        state.subtitle = sample.subtitle;
        const si = document.getElementById('subtitleInput');
        if (si) si.value = sample.subtitle;
      }
      if (sample?.date && isDefaultDate) {
        state.date = sample.date;
        const di = document.getElementById('dateInput');
        if (di) di.value = sample.date;
      }
    }

    updateDropzoneHelper(document.getElementById('uploadDropzone'), getTemplate(state.templateId), state.activeSlotIndex);
    syncSlotsWithTemplate({
      template: getTemplate(state.templateId),
      state,
      container: slotContainer,
      updateState
    });

    historyActions.updateButtons();
    saveDraftDebounced(state);
    renderStudioCanvas();
  };

  const historyActions = bindHistoryActions({
    undoBtn: document.getElementById('undoBtn'),
    redoBtn: document.getElementById('redoBtn'),
    history,
    getState: () => state,
    onApplyState: (restored) => {
      state = { ...state, ...restored };
      const ci = document.getElementById('captionInput');
      const si = document.getElementById('subtitleInput');
      const di = document.getElementById('dateInput');
      if (ci) ci.value = state.caption;
      if (si) si.value = state.subtitle;
      if (di) di.value = state.date;

      updateTemplateIndicator(
        state.templateId,
        document.getElementById('activeTemplateName'),
        document.getElementById('activeTemplateCounter')
      );
      syncSlotsWithTemplate({
        template: getTemplate(state.templateId),
        state,
        container: slotContainer,
        updateState
      });
      renderStudioCanvas();
    }
  });

  initTheme({ buttonEl: document.getElementById('themeToggleBtn') });

  initGallery({
    galleryView: document.getElementById('galleryView'),
    galleryGrid: document.getElementById('galleryGrid'),
    categoryContainer: document.getElementById('galleryCategories'),
    categoryMenuBtn: document.getElementById('categoryMenuBtn'),
    categoryMenuDropdown: document.getElementById('categoryMenuDropdown'),
    categoryActiveName: document.getElementById('categoryActiveName'),
    searchInput: document.getElementById('gallerySearchInput'),
    searchClearBtn: document.getElementById('gallerySearchClear'),
    tagsBar: document.getElementById('galleryTagsBar'),
    tagMenuBtn: document.getElementById('tagMenuBtn'),
    tagMenuDropdown: document.getElementById('tagMenuDropdown'),
    tagActiveName: document.getElementById('tagActiveName'),
    resultsMeta: document.getElementById('galleryResultsMeta'),
    resultsCount: document.getElementById('galleryResultsCount'),
    resultsResetBtn: document.getElementById('galleryResetFiltersBtn'),
    studioWorkspace: document.getElementById('studioWorkspace'),
    backBtn: document.getElementById('backToGalleryBtn'),
    stageBackBtn: document.getElementById('stageBackBtn'),
    onSelectTemplate: async (templateId) => {
      await updateState((prev) => ({ ...prev, templateId }));
    }
  });

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

  bindExportActions({
    downloadBtn: document.getElementById('downloadBtn'),
    copyBtn: document.getElementById('copyBtn'),
    copyBtnLabel: document.getElementById('copyBtnLabel'),
    formatSelect: document.getElementById('exportFormatSelect'),
    headerExportBtn: document.getElementById('headerExportBtn'),
    exportModal: document.getElementById('exportModal'),
    exportModalCloseBtn: document.getElementById('exportModalCloseBtn'),
    getActiveCanvas: () => activeCanvas,
    getState: () => state
  });

  initStageNavigator({
    prevBtn: document.getElementById('prevTemplateBtn'),
    nextBtn: document.getElementById('nextTemplateBtn'),
    nameEl: document.getElementById('activeTemplateName'),
    counterEl: document.getElementById('activeTemplateCounter'),
    getActiveTemplateId: () => state.templateId,
    onSwitchTemplate: async (templateId) => {
      await updateState((prev) => ({ ...prev, templateId }));
    }
  });

  initCanvasPanGesture({
    viewportEl: document.querySelector('.viewport-container'),
    panXSlider: document.getElementById('panXSlider'),
    panYSlider: document.getElementById('panYSlider'),
    zoomSlider: document.getElementById('zoomSlider'),
    getState: () => state,
    updateState
  });

  updateTemplateIndicator(
    state.templateId,
    document.getElementById('activeTemplateName'),
    document.getElementById('activeTemplateCounter')
  );
  updateDropzoneHelper(document.getElementById('uploadDropzone'), getTemplate(state.templateId));
  syncSlotsWithTemplate({
    template: getTemplate(state.templateId),
    state,
    container: slotContainer,
    updateState
  });

  initPwaInstall({
    installBtn: document.getElementById('pwaInstallBtn'),
    iosModal: document.getElementById('iosInstallModal')
  });

  renderTypographySelector(
    document.getElementById('fontPresetContainer'),
    state.fontPreset || 'default',
    (presetId) => {
      const preset = FONT_PRESETS[presetId];
      updateState((prev) => ({
        ...prev,
        fontPreset: presetId,
        fontOverride: preset?.family || null
      }));
    }
  );

  renderColorwaySelector(
    document.getElementById('colorwayContainer'),
    state.colorwayPreset || 'default',
    (colorwayId) => {
      const preset = COLORWAY_PRESETS[colorwayId];
      updateState((prev) => ({
        ...prev,
        colorwayPreset: colorwayId,
        colorway: preset?.bg ? preset : null
      }));
    }
  );

  const cameraController = initCameraModal(
    {
      modalEl: document.getElementById('photoboothModal'),
      videoEl: document.getElementById('cameraVideo'),
      countdownEl: document.getElementById('cameraCountdown'),
      flashEl: document.getElementById('cameraFlash'),
      snapBtn: document.getElementById('cameraSnapBtn'),
      facingBtn: document.getElementById('cameraFlipBtn'),
      closeBtn: document.getElementById('closeCameraBtn'),
      openBtn: document.getElementById('openPhotoboothBtn'),
      statusLabel: document.getElementById('cameraStatusLabel')
    },
    () => state,
    updateState
  );

  const panelCameraBtn = document.getElementById('panelCameraBtn');
  if (panelCameraBtn) {
    panelCameraBtn.addEventListener('click', () => cameraController.open());
  }

  initStickerManager({
    chipsContainer: document.getElementById('stickerChipsContainer'),
    listContainer: document.getElementById('stickerListContainer'),
    getState: () => ({ ...state, template: getTemplate(state.templateId) }),
    updateState
  });

  try {
    const curSample = TEMPLATE_SAMPLES[state.templateId] || TEMPLATE_SAMPLES.focus_editorial;
    if (Array.isArray(curSample?.photos) && curSample.photos.length > 0) {
      const loaded = await Promise.all(curSample.photos.map((p) => loadStudioImage(p).catch(() => null)));
      state.photoImgs = loaded.filter(Boolean);
      if (!state.photoImg) state.photoImg = state.photoImgs[0] || null;
    } else {
      const sampleImg = await loadStudioImage(curSample?.src || TEMPLATE_SAMPLES.focus_editorial.src);
      if (!state.photoImg) state.photoImg = sampleImg;
      state.photoImgs = [state.photoImg];
    }
    loadStudioImage('assets/astral_overlay.png').catch(() => {});
  } catch {
    // Non-blocking fallback
  }

  updateDropzoneHelper(document.getElementById('uploadDropzone'), getTemplate(state.templateId), state.activeSlotIndex);
  syncSlotsWithTemplate({
    template: getTemplate(state.templateId),
    state,
    container: slotContainer,
    updateState
  });

  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', flushPendingDraft);
  }

  renderStudioCanvas();
});
