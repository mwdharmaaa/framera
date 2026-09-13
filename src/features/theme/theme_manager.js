/**
 * Studio Theme Manager.
 * Supports switching between default Dark Studio and Rose Light Mode (white & soft pink).
 * Persists user preference via localStorage.
 */

export const THEMES = {
  DARK: 'dark',
  ROSE_LIGHT: 'pink-light'
};

const STORAGE_KEY = 'framera_theme';

/**
 * Retrieves the currently active theme preference.
 * @param {Storage} [storage=localStorage]
 * @returns {string}
 */
export function getSavedTheme(storage = typeof localStorage !== 'undefined' ? localStorage : null) {
  if (!storage) return THEMES.DARK;
  try {
    const saved = storage.getItem(STORAGE_KEY);
    return saved === THEMES.ROSE_LIGHT ? THEMES.ROSE_LIGHT : THEMES.DARK;
  } catch {
    return THEMES.DARK;
  }
}

/**
 * Applies the given theme to the document root element.
 * @param {string} theme
 * @param {Document} [doc=document]
 * @param {Storage} [storage=localStorage]
 */
export function applyTheme(theme, doc = typeof document !== 'undefined' ? document : null, storage = typeof localStorage !== 'undefined' ? localStorage : null) {
  const targetTheme = theme === THEMES.ROSE_LIGHT ? THEMES.ROSE_LIGHT : THEMES.DARK;
  if (doc?.documentElement) {
    doc.documentElement.setAttribute('data-theme', targetTheme);
  }
  if (storage) {
    try {
      storage.setItem(STORAGE_KEY, targetTheme);
    } catch {
      // Storage unavailable or disabled
    }
  }
  return targetTheme;
}

/**
 * Toggles the theme between Dark and Rose Light.
 * @param {string} currentTheme
 * @returns {string}
 */
export function getNextTheme(currentTheme) {
  return currentTheme === THEMES.ROSE_LIGHT ? THEMES.DARK : THEMES.ROSE_LIGHT;
}

/**
 * Initializes theme switcher button and synchronizes UI state.
 * @param {object} params
 * @param {HTMLElement} params.buttonEl
 * @param {Document} [params.doc=document]
 * @param {Storage} [params.storage=localStorage]
 * @returns {object} theme controller
 */
export function initTheme({ buttonEl, doc = document, storage = localStorage }) {
  let currentTheme = getSavedTheme(storage);
  applyTheme(currentTheme, doc, storage);

  const updateButtonUI = () => {
    if (!buttonEl) return;
    const isLight = currentTheme === THEMES.ROSE_LIGHT;
    const sunIcon = buttonEl.querySelector('.theme-icon-sun');
    const moonIcon = buttonEl.querySelector('.theme-icon-moon');
    const label = buttonEl.querySelector('.theme-toggle-label');

    if (sunIcon) sunIcon.style.display = isLight ? 'none' : 'inline-block';
    if (moonIcon) moonIcon.style.display = isLight ? 'inline-block' : 'none';
    if (label) label.textContent = isLight ? 'Dark Studio' : 'Rose Light';
  };

  updateButtonUI();

  if (buttonEl) {
    buttonEl.addEventListener('click', () => {
      currentTheme = getNextTheme(currentTheme);
      applyTheme(currentTheme, doc, storage);
      updateButtonUI();
    });
  }

  return {
    getCurrentTheme: () => currentTheme,
    setTheme: (t) => {
      currentTheme = applyTheme(t, doc, storage);
      updateButtonUI();
    }
  };
}
