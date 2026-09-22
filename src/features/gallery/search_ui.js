import { extractAvailableTags } from './search_filter.js';

/**
 * Renders interactive hashtag chips into the tags container.
 * @param {HTMLElement} container
 * @param {Array<object>} templates
 * @param {string} activeTag
 * @param {(tag: string) => void} onTagSelect
 */
export function renderHashtagChips(container, templates, activeTag, onTagSelect) {
  if (!container) return;
  container.innerHTML = '';

  const tags = extractAvailableTags(templates);
  const normalizedActive = (activeTag || 'all').toLowerCase().replace(/^#+/, '');

  // Add 'All / Semua' default pill
  const allBtn = document.createElement('button');
  allBtn.type = 'button';
  allBtn.className = `tag-chip ${normalizedActive === 'all' ? 'active' : ''}`;
  allBtn.dataset.tag = 'all';
  allBtn.setAttribute('aria-pressed', normalizedActive === 'all' ? 'true' : 'false');
  allBtn.innerHTML = `
    <span class="tag-label">Semua</span>
    <span class="tag-count">${templates.length}</span>
  `;
  allBtn.addEventListener('click', () => {
    if (typeof onTagSelect === 'function') onTagSelect('all');
  });
  container.appendChild(allBtn);

  // Add dynamic chips
  tags.forEach(({ tag, label, count }) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    const isActive = normalizedActive === tag;
    btn.className = `tag-chip ${isActive ? 'active' : ''}`;
    btn.dataset.tag = tag;
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    btn.innerHTML = `
      <span class="tag-label">${label}</span>
      <span class="tag-count">${count}</span>
    `;

    btn.addEventListener('click', () => {
      // Toggle off if clicking already active tag, otherwise set
      const nextTag = isActive ? 'all' : tag;
      if (typeof onTagSelect === 'function') onTagSelect(nextTag);
    });

    container.appendChild(btn);
  });
}

/**
 * Initializes the gallery search bar, tags bar, and results counter.
 * @param {object} options
 * @returns {object} Controller API
 */
export function initSearchUi(options) {
  const {
    searchInput,
    clearBtn,
    tagsBar,
    resultsMeta,
    resultsCount,
    resetBtn,
    onFilterChange
  } = options;

  let currentQuery = '';
  let currentTag = 'all';
  let debounceTimer = null;

  const notifyChange = () => {
    if (typeof onFilterChange === 'function') {
      onFilterChange({ query: currentQuery, tag: currentTag });
    }
  };

  const updateClearBtnVisibility = () => {
    if (!clearBtn) return;
    clearBtn.style.display = currentQuery.trim().length > 0 ? 'inline-flex' : 'none';
  };

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentQuery = e.target.value || '';
      updateClearBtnVisibility();

      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        notifyChange();
      }, 120);
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        currentQuery = '';
        searchInput.value = '';
        updateClearBtnVisibility();
        notifyChange();
        searchInput.blur();
      }
    });

    // Global keyboard shortcut '/' to jump to search
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', (e) => {
        const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
        const isEditable = activeTag === 'input' || activeTag === 'textarea' || document.activeElement?.isContentEditable;
        if (e.key === '/' && !isEditable) {
          e.preventDefault();
          searchInput.focus();
          searchInput.select();
        }
      });
    }
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      currentQuery = '';
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      updateClearBtnVisibility();
      notifyChange();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      currentQuery = '';
      currentTag = 'all';
      if (searchInput) searchInput.value = '';
      updateClearBtnVisibility();
      notifyChange();
    });
  }

  updateClearBtnVisibility();

  return {
    getQuery: () => currentQuery,
    getTag: () => currentTag,
    setTag: (tag) => {
      currentTag = tag || 'all';
      notifyChange();
    },
    setQuery: (q) => {
      currentQuery = q || '';
      if (searchInput) searchInput.value = currentQuery;
      updateClearBtnVisibility();
      notifyChange();
    },
    reset: () => {
      currentQuery = '';
      currentTag = 'all';
      if (searchInput) searchInput.value = '';
      updateClearBtnVisibility();
      notifyChange();
    },
    updateMeta: (shown, total, isFiltered) => {
      if (!resultsMeta || !resultsCount) return;
      if (!isFiltered) {
        resultsMeta.style.display = 'none';
      } else {
        resultsMeta.style.display = 'flex';
        resultsCount.textContent = `Menampilkan ${shown} dari ${total} template`;
      }
    }
  };
}
