import { listTemplates } from '../templates/template_registry.js';

/**
 * Calculates the adjacent template in the registered template sequence.
 * Wraps around cyclically for seamless carousel navigation.
 * @param {string} currentId
 * @param {Array<object>} templates
 * @param {number} step - 1 for next, -1 for previous
 * @returns {{ template: object, index: number, total: number }|null}
 */
export function getAdjacentTemplate(currentId, templates, step = 1) {
  if (!Array.isArray(templates) || templates.length === 0) return null;
  const currentIndex = templates.findIndex((t) => t.id === currentId);
  const total = templates.length;

  let nextIndex;
  if (currentIndex === -1) {
    nextIndex = 0;
  } else {
    nextIndex = (currentIndex + step + total) % total;
  }

  return {
    template: templates[nextIndex],
    index: nextIndex + 1,
    total
  };
}

/**
 * Updates stage header indicator badge for active template and counter.
 * @param {string} currentId
 * @param {HTMLElement|null} nameEl
 * @param {HTMLElement|null} counterEl
 */
export function updateTemplateIndicator(currentId, nameEl, counterEl) {
  const templates = listTemplates();
  const currentIndex = templates.findIndex((t) => t.id === currentId);
  if (currentIndex === -1) return;

  const tpl = templates[currentIndex];
  if (nameEl) nameEl.textContent = tpl.name;
  if (counterEl) counterEl.textContent = `${currentIndex + 1} / ${templates.length}`;
}

/**
 * Initializes in-stage arrow navigation buttons and keyboard shortcuts.
 * Allows one-click switching across all templates without leaving studio workspace.
 * @param {object} options
 */
export function initStageNavigator(options) {
  const {
    prevBtn,
    nextBtn,
    nameEl,
    counterEl,
    getActiveTemplateId,
    onSwitchTemplate
  } = options;

  const navigate = (step) => {
    const templates = listTemplates();
    const currentId = typeof getActiveTemplateId === 'function' ? getActiveTemplateId() : null;
    const result = getAdjacentTemplate(currentId, templates, step);
    if (!result || !result.template) return;

    if (nameEl) nameEl.textContent = result.template.name;
    if (counterEl) counterEl.textContent = `${result.index} / ${result.total}`;

    if (typeof onSwitchTemplate === 'function') {
      onSwitchTemplate(result.template.id);
    }
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navigate(-1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navigate(1);
    });
  }

  // Keyboard left/right arrow shortcuts when studio workspace is open
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', (e) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') return;

      const studio = document.getElementById('studioWorkspace');
      if (!studio || studio.style.display === 'none') return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigate(-1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigate(1);
      }
    });
  }
}
