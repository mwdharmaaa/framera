import { FILTER_PRESETS } from '../../core/canvas/filters.js';
import { loadAndNormalizeFile } from '../../core/canvas/image_resizer.js';

/**
 * Initializes controls UI and binds user input events.
 * @param {object} elements
 * @param {object} initialState
 * @param {(updater: (prev: object) => object, options?: object) => void} updateState
 */
export function initControls(elements, initialState, updateState) {
  const {
    fileInput,
    dropzone,
    zoomSlider,
    zoomValueLabel,
    panXSlider,
    panYSlider,
    resetPanBtn,
    filterChipsContainer,
    captionInput,
    subtitleInput,
    dateInput
  } = elements;

  // 2. Render Filter Chips
  if (filterChipsContainer) {
    filterChipsContainer.innerHTML = '';
    Object.entries(FILTER_PRESETS).forEach(([key, preset]) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = `filter-chip ${key === initialState.filter ? 'active' : ''}`;
      chip.dataset.filter = key;
      chip.textContent = preset.label;
      chip.addEventListener('click', () => {
        filterChipsContainer.querySelectorAll('.filter-chip').forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        updateState((prev) => ({ ...prev, filter: key }));
      });
      filterChipsContainer.appendChild(chip);
    });
  }

  // 3. File Input & Drag-and-Drop Handling with Low-RAM Protection
  const handleSelectedFiles = async (fileList) => {
    const files = Array.from(fileList || []).filter((f) => f && f.type?.startsWith('image/'));
    if (!files.length) return;

    const loaded = await Promise.all(files.map((file) => loadAndNormalizeFile(file)));
    const loadedImgs = loaded.map((l) => l.img);

    updateState((prev) => ({
      ...prev,
      photoDataUrl: loaded[0]?.dataUrl || prev.photoDataUrl,
      photoImg: loadedImgs[0] || prev.photoImg,
      photos: loadedImgs,
      photoImgs: loadedImgs,
      isUserUploaded: true,
      zoom: 1,
      panX: 0,
      panY: 0
    }));

    if (zoomSlider) zoomSlider.value = '100';
    if (zoomValueLabel) zoomValueLabel.textContent = '100%';
    if (panXSlider) panXSlider.value = '0';
    if (panYSlider) panYSlider.value = '0';
  };

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      if (e.target.files?.length) handleSelectedFiles(e.target.files);
    });
  }

  if (dropzone) {
    dropzone.addEventListener('click', () => fileInput?.click());
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      if (e.dataTransfer?.files?.length) handleSelectedFiles(e.dataTransfer.files);
    });
  }

  // 4. Zoom & Pan Controls (High-Frequency rAF without history flood)
  if (zoomSlider) {
    zoomSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10) / 100;
      if (zoomValueLabel) zoomValueLabel.textContent = `${e.target.value}%`;
      updateState((prev) => ({ ...prev, zoom: val }), { recordHistory: false });
    });
    zoomSlider.addEventListener('change', () => {
      updateState((prev) => prev, { recordHistory: true });
    });
  }

  if (panXSlider) {
    panXSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      updateState((prev) => ({ ...prev, panX: val }), { recordHistory: false });
    });
    panXSlider.addEventListener('change', () => {
      updateState((prev) => prev, { recordHistory: true });
    });
  }

  if (panYSlider) {
    panYSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      updateState((prev) => ({ ...prev, panY: val }), { recordHistory: false });
    });
    panYSlider.addEventListener('change', () => {
      updateState((prev) => prev, { recordHistory: true });
    });
  }

  if (resetPanBtn) {
    resetPanBtn.addEventListener('click', () => {
      if (zoomSlider) zoomSlider.value = '100';
      if (zoomValueLabel) zoomValueLabel.textContent = '100%';
      if (panXSlider) panXSlider.value = '0';
      if (panYSlider) panYSlider.value = '0';
      updateState((prev) => ({ ...prev, zoom: 1, panX: 0, panY: 0 }));
    });
  }

  // 5. Typography Text Input Listeners
  if (captionInput) {
    captionInput.addEventListener('input', (e) => {
      updateState((prev) => ({ ...prev, caption: e.target.value }), { recordHistory: false });
    });
    captionInput.addEventListener('change', () => {
      updateState((prev) => prev, { recordHistory: true });
    });
  }
  if (subtitleInput) {
    subtitleInput.addEventListener('input', (e) => {
      updateState((prev) => ({ ...prev, subtitle: e.target.value }), { recordHistory: false });
    });
    subtitleInput.addEventListener('change', () => {
      updateState((prev) => prev, { recordHistory: true });
    });
  }
  if (dateInput) {
    dateInput.addEventListener('input', (e) => {
      updateState((prev) => ({ ...prev, date: e.target.value }), { recordHistory: false });
    });
    dateInput.addEventListener('change', () => {
      updateState((prev) => prev, { recordHistory: true });
    });
  }
}

/**
 * Dynamically updates dropzone copy and guidance based on active template photo count.
 * @param {HTMLElement|null} dropzone
 * @param {object|null} template
 */
export function updateDropzoneHelper(dropzone, template) {
  if (!dropzone) return;
  const labelEl = dropzone.querySelector('.dropzone-label');
  const subEl = dropzone.querySelector('.dropzone-sub');
  const count = template?.photoCount || 1;
  if (count > 1) {
    if (labelEl) labelEl.textContent = `Click or Drag & Drop ${count} Photos`;
    if (subEl) subEl.textContent = `Multi-frame layout: ${template.name || `${count} Photos`}`;
  } else {
    if (labelEl) labelEl.textContent = 'Click or Drag & Drop Photo';
    if (subEl) subEl.textContent = 'Single or multi-photo (JPG, PNG, WEBP)';
  }
}
