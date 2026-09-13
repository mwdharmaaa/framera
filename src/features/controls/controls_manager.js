import { FILTER_PRESETS } from '../../core/canvas/filters.js';

/**
 * Initializes controls UI and binds user input events.
 * @param {object} elements
 * @param {object} initialState
 * @param {(updater: (prev: object) => object) => void} updateState
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

  // 3. File Input & Drag-and-Drop Handling
  const handleSelectedFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        updateState((prev) => ({
          ...prev,
          photoDataUrl: String(e.target?.result),
          photoImg: img,
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
      img.src = String(e.target?.result);
    };
    reader.readAsDataURL(file);
  };

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      if (e.target.files?.[0]) handleSelectedFile(e.target.files[0]);
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
      if (e.dataTransfer?.files?.[0]) handleSelectedFile(e.dataTransfer.files[0]);
    });
  }

  // 4. Zoom & Pan Controls
  if (zoomSlider) {
    zoomSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10) / 100;
      if (zoomValueLabel) zoomValueLabel.textContent = `${e.target.value}%`;
      updateState((prev) => ({ ...prev, zoom: val }));
    });
  }

  if (panXSlider) {
    panXSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      updateState((prev) => ({ ...prev, panX: val }));
    });
  }

  if (panYSlider) {
    panYSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      updateState((prev) => ({ ...prev, panY: val }));
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
      updateState((prev) => ({ ...prev, caption: e.target.value }));
    });
  }
  if (subtitleInput) {
    subtitleInput.addEventListener('input', (e) => {
      updateState((prev) => ({ ...prev, subtitle: e.target.value }));
    });
  }
  if (dateInput) {
    dateInput.addEventListener('input', (e) => {
      updateState((prev) => ({ ...prev, date: e.target.value }));
    });
  }
}
