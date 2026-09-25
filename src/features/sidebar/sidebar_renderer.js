/**
 * Pure DOM rendering routines for Studio Left Slide Bar (Quick Templates Drawer).
 */

const SIDEBAR_CATEGORIES = [
  { id: 'all', label: 'Semua' },
  { id: '1', label: '1 Foto' },
  { id: '2', label: '2 Foto' },
  { id: '3', label: '3 Foto' },
  { id: '4+', label: '4+ Foto' }
];

/**
 * Renders quick category filter pills into the sidebar category bar.
 * @param {HTMLElement|null} container
 * @param {string} activeCategory
 * @param {(catId: string) => void} onSelectCategory
 */
export function renderSidebarCategories(container, activeCategory, onSelectCategory) {
  if (!container) return;
  container.innerHTML = '';

  SIDEBAR_CATEGORIES.forEach((cat) => {
    const pill = document.createElement('button');
    pill.type = 'button';
    pill.className = `sidebar-cat-pill ${cat.id === activeCategory ? 'active' : ''}`;
    pill.dataset.category = cat.id;
    pill.textContent = cat.label;
    pill.addEventListener('click', () => {
      if (typeof onSelectCategory === 'function') {
        onSelectCategory(cat.id);
      }
    });
    container.appendChild(pill);
  });
}

/**
 * Renders compact template items into the scrollable sidebar list.
 * @param {HTMLElement|null} container
 * @param {Array<object>} templates
 * @param {string} activeTemplateId
 * @param {(templateId: string) => void} onSelectTemplate
 */
export function renderSidebarTemplateList(container, templates, activeTemplateId, onSelectTemplate) {
  if (!container) return;
  container.innerHTML = '';

  if (!Array.isArray(templates) || templates.length === 0) {
    const emptyNotice = document.createElement('div');
    emptyNotice.className = 'sidebar-empty-notice';
    emptyNotice.style.padding = '18px 8px';
    emptyNotice.style.textAlign = 'center';
    emptyNotice.style.color = 'var(--text-muted)';
    emptyNotice.style.fontSize = '0.78rem';
    emptyNotice.textContent = 'Tidak ada template yang cocok';
    container.appendChild(emptyNotice);
    return;
  }

  templates.forEach((tpl) => {
    const card = document.createElement('div');
    const isActive = tpl.id === activeTemplateId;
    card.className = `sidebar-card ${isActive ? 'active' : ''}`;
    card.dataset.templateId = tpl.id;
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Pilih template ${tpl.name}`);

    const previewSrc = tpl.previewImage || 'assets/focus_reference.jpg';
    const ratio = tpl.aspectRatio || '3:4';
    const photoCount = tpl.photoCount || 1;

    card.innerHTML = `
      <img src="${previewSrc}" alt="" class="sidebar-card-thumb" loading="lazy" decoding="async" aria-hidden="true" />
      <div class="sidebar-card-info">
        <div class="sidebar-card-name">${tpl.name}</div>
        <div class="sidebar-card-badges">
          <span class="sidebar-badge sidebar-badge-accent">${photoCount} FOTO</span>
          <span class="sidebar-badge">${ratio}</span>
        </div>
      </div>
    `;

    card.addEventListener('click', () => {
      if (typeof onSelectTemplate === 'function') {
        onSelectTemplate(tpl.id);
      }
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (typeof onSelectTemplate === 'function') {
          onSelectTemplate(tpl.id);
        }
      }
    });

    container.appendChild(card);
  });
}

/**
 * Highlights active template card in sidebar without re-rendering all nodes.
 * @param {HTMLElement|null} container
 * @param {string} activeTemplateId
 */
export function highlightActiveSidebarCard(container, activeTemplateId) {
  if (!container) return;
  const cards = container.querySelectorAll('.sidebar-card');
  cards.forEach((card) => {
    const isActive = card.dataset.templateId === activeTemplateId;
    card.classList.toggle('active', isActive);
    if (isActive) {
      card.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  });
}
