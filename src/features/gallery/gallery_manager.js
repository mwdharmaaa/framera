import { listTemplates } from '../templates/template_registry.js';

/**
 * Renders template showcase cards into the gallery grid.
 * @param {HTMLElement} container
 * @param {Array<object>} templates
 * @param {(templateId: string) => void} onSelect
 */
export function renderGalleryCards(container, templates, onSelect) {
  if (!container) return;
  container.innerHTML = '';

  templates.forEach((tpl) => {
    const card = document.createElement('div');
    card.className = 'gallery-card';
    card.dataset.templateId = tpl.id;
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Select ${tpl.name} template`);

    const previewSrc = tpl.previewImage || 'assets/focus_reference.jpg';
    const tag = tpl.tag || 'EDITORIAL';
    const ratio = tpl.aspectRatio || '3:4';

    card.innerHTML = `
      <div class="gallery-thumb-wrap">
        <div class="gallery-badges">
          <span class="gallery-badge gallery-badge-accent">${tag}</span>
          <span class="gallery-badge">${ratio}</span>
        </div>
        <img src="${previewSrc}" alt="${tpl.name} preview" class="gallery-thumb-img" loading="lazy" />
      </div>
      <div class="gallery-card-body">
        <h3 class="gallery-card-title">${tpl.name}</h3>
        <p class="gallery-card-desc">${tpl.description}</p>
        <div class="gallery-card-action">
          <span>Use Template</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </div>
      </div>
    `;

    const selectHandler = () => {
      if (typeof onSelect === 'function') {
        onSelect(tpl.id);
      }
    };

    card.addEventListener('click', selectHandler);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectHandler();
      }
    });

    container.appendChild(card);
  });
}

/**
 * Switches view from gallery landing to studio workspace.
 * @param {object} param0
 */
export function switchToStudio({ galleryView, studioWorkspace }) {
  if (galleryView) {
    galleryView.style.display = 'none';
  }
  if (studioWorkspace) {
    studioWorkspace.style.display = 'grid';

    // Re-trigger slide-in keyframe animations
    const stageCol = studioWorkspace.querySelector('.stage-column');
    const controlsCol = studioWorkspace.querySelector('.controls-column');

    if (stageCol) {
      stageCol.style.animation = 'none';
      void stageCol.offsetWidth;
      stageCol.style.animation = '';
    }
    if (controlsCol) {
      controlsCol.style.animation = 'none';
      void controlsCol.offsetWidth;
      controlsCol.style.animation = '';
    }
  }
}

/**
 * Switches view from studio workspace back to gallery landing.
 * @param {object} param0
 */
export function switchToGallery({ galleryView, studioWorkspace }) {
  if (studioWorkspace) {
    studioWorkspace.style.display = 'none';
  }
  if (galleryView) {
    galleryView.style.display = 'block';
  }
}

/**
 * Initializes gallery event bindings and lifecycle.
 * @param {object} options
 */
export function initGallery(options) {
  const {
    galleryView,
    galleryGrid,
    studioWorkspace,
    backBtn,
    onSelectTemplate
  } = options;

  if (galleryGrid) {
    const templates = listTemplates();
    renderGalleryCards(galleryGrid, templates, (templateId) => {
      switchToStudio({ galleryView, studioWorkspace });
      if (typeof onSelectTemplate === 'function') {
        onSelectTemplate(templateId);
      }
    });
  }

  if (backBtn) {
    backBtn.addEventListener('click', () => {
      switchToGallery({ galleryView, studioWorkspace });
    });
  }
}
