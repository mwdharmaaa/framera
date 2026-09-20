import { listTemplates } from '../templates/template_registry.js';

export const CATEGORY_LABELS = {
  all: 'Semua',
  '1': '1 Foto',
  '2': '2 Foto',
  '3': '3 Foto',
  '4': '4 Foto',
  '5': '5 Foto',
  '10': '10 Foto'
};

/**
 * Filters templates by category (all, 1, 2, 3, 4 photo count).
 * @param {Array<object>} templates
 * @param {string|number} category
 * @returns {Array<object>}
 */
export function filterTemplatesByCategory(templates, category = 'all') {
  if (!Array.isArray(templates)) return [];
  if (category === 'all' || !category) return templates;
  const count = Number(category);
  return templates.filter((tpl) => {
    if (tpl.category && String(tpl.category) === String(category)) return true;
    return (tpl.photoCount || 1) === count;
  });
}

/**
 * Updates count badges inside category option pills.
 * @param {HTMLElement|null} container
 * @param {Array<object>} [templates]
 */
export function updateCategoryCounts(container, templates) {
  if (!container || typeof document === 'undefined') return;
  const all = Array.isArray(templates) ? templates : listTemplates();
  container.querySelectorAll('.category-pill').forEach((pill) => {
    const cat = pill.dataset.category || 'all';
    const count = filterTemplatesByCategory(all, cat).length;
    let countBadge = pill.querySelector('.pill-count');
    if (!countBadge) {
      countBadge = document.createElement('span');
      countBadge.className = 'pill-count';
      pill.appendChild(countBadge);
    }
    countBadge.textContent = String(count);
  });
}

/**
 * Initializes the category dropdown trigger, toggle behavior, and option selection.
 * @param {object} params
 * @param {HTMLElement|null} params.triggerBtn
 * @param {HTMLElement|null} params.dropdown
 * @param {HTMLElement|null} [params.activeLabel]
 * @param {HTMLElement|null} [params.optionsContainer]
 * @param {(category: string) => void} params.onSelectCategory
 */
export function initCategoryDropdown({
  triggerBtn,
  dropdown,
  activeLabel,
  optionsContainer,
  onSelectCategory
}) {
  if (!triggerBtn || !dropdown) return null;

  const closeDropdown = () => {
    dropdown.style.display = 'none';
    dropdown.classList.remove('open');
    triggerBtn.setAttribute('aria-expanded', 'false');
    triggerBtn.classList.remove('active');
  };

  const openDropdown = () => {
    dropdown.style.display = 'block';
    dropdown.classList.add('open');
    triggerBtn.setAttribute('aria-expanded', 'true');
    triggerBtn.classList.add('active');
  };

  const toggleDropdown = () => {
    const isOpen = triggerBtn.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  };

  triggerBtn.addEventListener('click', (e) => {
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
    toggleDropdown();
  });

  // Handle outside click to close
  if (typeof document !== 'undefined' && document.addEventListener) {
    document.addEventListener('click', (e) => {
      const target = e.target;
      const insideDropdown = dropdown.contains ? dropdown.contains(target) : false;
      const insideTrigger = triggerBtn.contains ? triggerBtn.contains(target) : false;
      if (!insideDropdown && !insideTrigger) {
        closeDropdown();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && triggerBtn.getAttribute('aria-expanded') === 'true') {
        closeDropdown();
        if (typeof triggerBtn.focus === 'function') triggerBtn.focus();
      }
    });
  }

  // Handle option click
  const container = optionsContainer || dropdown;
  container.addEventListener('click', (e) => {
    const pill = e.target && e.target.closest ? e.target.closest('.category-pill') : null;
    if (!pill) return;

    if (container.querySelectorAll) {
      container.querySelectorAll('.category-pill').forEach((p) => {
        p.classList.remove('active');
        p.setAttribute('aria-selected', 'false');
      });
    }
    pill.classList.add('active');
    pill.setAttribute('aria-selected', 'true');

    const cat = pill.dataset.category || 'all';
    if (activeLabel) {
      activeLabel.textContent = CATEGORY_LABELS[cat] || 'Semua';
    }

    if (typeof onSelectCategory === 'function') {
      onSelectCategory(cat);
    }

    closeDropdown();
  });

  return { closeDropdown, openDropdown, toggleDropdown };
}
