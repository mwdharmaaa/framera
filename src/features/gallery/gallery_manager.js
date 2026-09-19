import { listTemplates } from '../templates/template_registry.js';
import {
  filterTemplatesByCategory,
  updateCategoryCounts,
  initCategoryDropdown
} from './category_filter.js';

export { filterTemplatesByCategory };

/**
 * Renders template showcase cards into the gallery grid.
 * @param {HTMLElement} container
 * @param {Array<object>} templates
 * @param {(templateId: string) => void} onSelect
 */
export function renderGalleryCards(container, templates, onSelect) {
  if (!container) return;
  container.innerHTML = '';

  if (!templates || templates.length === 0) {
    if (typeof document !== 'undefined') {
      const emptyNotice = document.createElement('div');
      emptyNotice.className = 'gallery-empty-state';
      emptyNotice.innerHTML = `
        <div class="empty-state-card">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          <h4>Template Segera Hadir</h4>
          <p>Koleksi template untuk kategori ini sedang disiapkan.</p>
        </div>
      `;
      container.appendChild(emptyNotice);
    }
    return;
  }

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
        <img src="${previewSrc}" alt="" class="gallery-thumb-backdrop" aria-hidden="true" />
        <div class="gallery-badges">
          <span class="gallery-badge gallery-badge-accent">${tag}</span>
          <span class="gallery-badge">${tpl.photoCount || 1} FOTO</span>
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
    categoryContainer,
    studioWorkspace,
    backBtn,
    onSelectTemplate
  } = options;

  let activeCategory = 'all';

  const catBox = categoryContainer || (typeof document !== 'undefined' ? document.getElementById('galleryCategories') : null);
  const triggerBtn = options.categoryMenuBtn || (typeof document !== 'undefined' ? document.getElementById('categoryMenuBtn') : null);
  const dropdown = options.categoryMenuDropdown || (typeof document !== 'undefined' ? document.getElementById('categoryMenuDropdown') : null);
  const activeLabel = options.categoryActiveName || (typeof document !== 'undefined' ? document.getElementById('categoryActiveName') : null);

  const refreshGallery = () => {
    if (!galleryGrid) return;
    const all = listTemplates();
    const filtered = filterTemplatesByCategory(all, activeCategory);
    renderGalleryCards(galleryGrid, filtered, (templateId) => {
      switchToStudio({ galleryView, studioWorkspace });
      if (typeof onSelectTemplate === 'function') {
        onSelectTemplate(templateId);
      }
    });
    updateCategoryCounts(catBox, all);
  };

  if (triggerBtn && dropdown) {
    initCategoryDropdown({
      triggerBtn,
      dropdown,
      activeLabel,
      optionsContainer: catBox,
      onSelectCategory: (cat) => {
        activeCategory = cat;
        refreshGallery();
      }
    });
  } else if (catBox) {
    // Fallback for direct click in test environments without dropdown
    catBox.addEventListener('click', (e) => {
      const pill = e.target && e.target.closest ? e.target.closest('.category-pill') : null;
      if (!pill) return;
      if (catBox.querySelectorAll) {
        catBox.querySelectorAll('.category-pill').forEach((p) => {
          p.classList.remove('active');
          p.setAttribute('aria-selected', 'false');
        });
      }
      pill.classList.add('active');
      pill.setAttribute('aria-selected', 'true');
      activeCategory = pill.dataset.category || 'all';
      refreshGallery();
    });
  }

  if (galleryGrid) {
    refreshGallery();
  }

  if (backBtn) {
    backBtn.addEventListener('click', () => {
      switchToGallery({ galleryView, studioWorkspace });
    });
  }
}
