import { listTemplates } from '../templates/template_registry.js';
import {
  renderSidebarCategories,
  renderSidebarTemplateList,
  highlightActiveSidebarCard
} from './sidebar_renderer.js';

/**
 * Filters templates for the quick drawer list.
 * @param {Array<object>} templates
 * @param {string} category
 * @param {string} query
 * @returns {Array<object>}
 */
export function filterSidebarTemplates(templates, category = 'all', query = '') {
  if (!Array.isArray(templates)) return [];
  const q = query.trim().toLowerCase();

  return templates.filter((tpl) => {
    // 1. Category match
    if (category === '4+') {
      if ((tpl.photoCount || 1) < 4) return false;
    } else if (category !== 'all') {
      const targetCount = parseInt(category, 10);
      if (tpl.photoCount !== targetCount && tpl.category !== category) return false;
    }

    // 2. Query match
    if (!q) return true;
    const name = (tpl.name || '').toLowerCase();
    const id = (tpl.id || '').toLowerCase();
    const tag = (tpl.tag || '').toLowerCase();
    const tags = Array.isArray(tpl.tags) ? tpl.tags.join(' ').toLowerCase() : '';
    return name.includes(q) || id.includes(q) || tag.includes(q) || tags.includes(q);
  });
}

/**
 * Initializes Framera Studio Left Slide Bar (Quick Templates Drawer).
 * @param {object} options
 */
export function initSidebar(options) {
  const {
    sidebarEl,
    backdropEl,
    floatingToggleBtn,
    headerToggleBtn,
    appHeaderToggleBtn,
    closeBtn,
    shuffleBtn,
    searchInput,
    categoriesContainer,
    listContainer,
    countEl,
    getActiveTemplateId,
    onSelectTemplate
  } = options;

  let activeCategory = 'all';
  let activeQuery = '';
  let isOpen = false;

  const refreshList = () => {
    const all = listTemplates();
    const filtered = filterSidebarTemplates(all, activeCategory, activeQuery);
    const activeId = typeof getActiveTemplateId === 'function' ? getActiveTemplateId() : '';

    if (countEl) countEl.textContent = String(all.length);
    renderSidebarTemplateList(listContainer, filtered, activeId, (tplId) => {
      if (typeof onSelectTemplate === 'function') {
        onSelectTemplate(tplId);
      }
      highlightActiveSidebarCard(listContainer, tplId);
      // Auto close on small screens
      if (typeof window !== 'undefined' && window.innerWidth <= 768) {
        close();
      }
    });
  };

  const open = () => {
    isOpen = true;
    if (sidebarEl) sidebarEl.classList.add('open');
    if (backdropEl) backdropEl.classList.add('active');
    if (floatingToggleBtn) {
      floatingToggleBtn.setAttribute('aria-expanded', 'true');
      floatingToggleBtn.classList.add('hidden');
    }
    refreshList();
    if (searchInput) searchInput.focus();
  };

  const close = () => {
    isOpen = false;
    if (sidebarEl) sidebarEl.classList.remove('open');
    if (backdropEl) backdropEl.classList.remove('active');
    if (floatingToggleBtn) {
      floatingToggleBtn.setAttribute('aria-expanded', 'false');
      floatingToggleBtn.classList.remove('hidden');
    }
  };

  const toggle = () => (isOpen ? close() : open());

  // Bind Buttons
  if (floatingToggleBtn) floatingToggleBtn.addEventListener('click', toggle);
  if (headerToggleBtn) headerToggleBtn.addEventListener('click', toggle);
  if (appHeaderToggleBtn) appHeaderToggleBtn.addEventListener('click', toggle);
  if (closeBtn) closeBtn.addEventListener('click', close);
  if (backdropEl) backdropEl.addEventListener('click', close);

  // Bind Search
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      activeQuery = e.target.value;
      refreshList();
    });
  }

  // Bind Categories
  renderSidebarCategories(categoriesContainer, activeCategory, (catId) => {
    activeCategory = catId;
    renderSidebarCategories(categoriesContainer, activeCategory, null);
    refreshList();
  });

  // Bind Shuffle (Surprise Me)
  if (shuffleBtn) {
    shuffleBtn.addEventListener('click', () => {
      const all = listTemplates();
      if (!all.length) return;
      const randomTpl = all[Math.floor(Math.random() * all.length)];
      if (randomTpl && typeof onSelectTemplate === 'function') {
        onSelectTemplate(randomTpl.id);
        highlightActiveSidebarCard(listContainer, randomTpl.id);
      }
    });
  }

  // Keyboard shortcut: '['
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', (e) => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      if (e.key === '[' || (e.ctrlKey && e.key.toLowerCase() === 'b')) {
        e.preventDefault();
        toggle();
      } else if (e.key === 'Escape' && isOpen) {
        close();
      }
    });
  }

  return {
    open,
    close,
    toggle,
    refresh: refreshList,
    isOpen: () => isOpen,
    updateActive: (templateId) => highlightActiveSidebarCard(listContainer, templateId)
  };
}
