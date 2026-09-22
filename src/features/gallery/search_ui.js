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

  // Add 'Semua' default chip
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
      const nextTag = isActive ? 'all' : tag;
      if (typeof onTagSelect === 'function') onTagSelect(nextTag);
    });

    container.appendChild(btn);
  });
}

/**
 * Initializes the gallery search bar, tag dropdown toggle, and results counter.
 * @param {object} options
 * @returns {object} Controller API
 */
export function initSearchUi(options) {
  const {
    searchInput,
    clearBtn,
    tagsBar,
    tagMenuBtn,
    tagMenuDropdown,
    tagActiveName,
    categoryMenuBtn,
    categoryMenuDropdown,
    resultsMeta,
    resultsCount,
    resetBtn,
    onFilterChange
  } = options;

  let currentQuery = '';
  let currentTag = 'all';
  let debounceTimer = null;

  const updateTagBadge = (tag) => {
    if (!tagActiveName) return;
    if (!tag || tag === 'all') {
      tagActiveName.textContent = 'Semua';
    } else {
      tagActiveName.textContent = tag.startsWith('#') ? tag : `#${tag}`;
    }
  };

  const closeTagDropdown = () => {
    if (!tagMenuDropdown || !tagMenuBtn) return;
    tagMenuDropdown.style.display = 'none';
    tagMenuDropdown.classList?.remove('open');
    tagMenuBtn.setAttribute('aria-expanded', 'false');
    tagMenuBtn.classList?.remove('active');
  };

  const openTagDropdown = () => {
    if (!tagMenuDropdown || !tagMenuBtn) return;
    // Close category dropdown if open
    if (categoryMenuDropdown) {
      categoryMenuDropdown.style.display = 'none';
      categoryMenuDropdown.classList?.remove('open');
    }
    if (categoryMenuBtn) {
      categoryMenuBtn.setAttribute('aria-expanded', 'false');
      categoryMenuBtn.classList?.remove('active');
    }
    tagMenuDropdown.style.display = 'block';
    tagMenuDropdown.classList?.add('open');
    tagMenuBtn.setAttribute('aria-expanded', 'true');
    tagMenuBtn.classList?.add('active');
  };

  const toggleTagDropdown = () => {
    if (!tagMenuBtn) return;
    const isOpen = tagMenuBtn.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeTagDropdown();
    } else {
      openTagDropdown();
    }
  };

  if (tagMenuBtn) {
    if (!tagMenuBtn.getAttribute('aria-expanded')) {
      tagMenuBtn.setAttribute('aria-expanded', 'false');
    }
    tagMenuBtn.addEventListener('click', (e) => {
      if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
      toggleTagDropdown();
    });
  }

  // Outside click and Escape key listeners
  if (typeof document !== 'undefined' && document.addEventListener) {
    document.addEventListener('click', (e) => {
      if (!tagMenuDropdown || !tagMenuBtn) return;
      const target = e.target;
      const insideDropdown = tagMenuDropdown.contains ? tagMenuDropdown.contains(target) : false;
      const insideTrigger = tagMenuBtn.contains ? tagMenuBtn.contains(target) : false;
      if (!insideDropdown && !insideTrigger) {
        closeTagDropdown();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && tagMenuBtn && tagMenuBtn.getAttribute('aria-expanded') === 'true') {
        closeTagDropdown();
        if (typeof tagMenuBtn.focus === 'function') tagMenuBtn.focus();
      }
    });
  }

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

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', (e) => {
        const activeTagEl = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
        const isEditable = activeTagEl === 'input' || activeTagEl === 'textarea' || document.activeElement?.isContentEditable;
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
      updateTagBadge('all');
      closeTagDropdown();
      if (searchInput) searchInput.value = '';
      updateClearBtnVisibility();
      notifyChange();
    });
  }

  updateClearBtnVisibility();
  updateTagBadge(currentTag);

  return {
    getQuery: () => currentQuery,
    getTag: () => currentTag,
    setTag: (tag, shouldClose = false) => {
      currentTag = tag || 'all';
      updateTagBadge(currentTag);
      if (shouldClose) closeTagDropdown();
      notifyChange();
    },
    setQuery: (q) => {
      currentQuery = q || '';
      if (searchInput) searchInput.value = currentQuery;
      updateClearBtnVisibility();
      notifyChange();
    },
    closeTagDropdown,
    openTagDropdown,
    reset: () => {
      currentQuery = '';
      currentTag = 'all';
      updateTagBadge('all');
      closeTagDropdown();
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
