/**
 * Typography Presets & Dynamic Canvas Font Overrider for Framera Studio.
 * Allows users to override template typography with curated editorial font pairings.
 */

export const FONT_PRESETS = {
  default: {
    id: 'default',
    label: 'Default',
    family: null,
    preview: 'Original'
  },
  editorial: {
    id: 'editorial',
    label: 'Editorial Serif',
    family: '"Playfair Display", Georgia, serif',
    preview: 'Editorial'
  },
  mono: {
    id: 'mono',
    label: 'Brutalist Mono',
    family: '"Space Mono", monospace',
    preview: 'Mono 01'
  },
  bebas: {
    id: 'bebas',
    label: 'Modern Bold',
    family: '"Bebas Neue", sans-serif',
    preview: 'BEBAS'
  },
  fredoka: {
    id: 'fredoka',
    label: 'Playful Round',
    family: '"Fredoka", sans-serif',
    preview: 'Rounded'
  },
  shantell: {
    id: 'shantell',
    label: 'Casual Script',
    family: '"Shantell Sans", cursive',
    preview: 'Script'
  },
  cursive: {
    id: 'cursive',
    label: 'Elegant Cursive',
    family: '"Great Vibes", cursive',
    preview: 'Elegance'
  }
};

/**
 * Creates a transparent canvas context proxy that replaces font family on font assignment.
 * @param {CanvasRenderingContext2D} ctx
 * @param {string|null} fontOverride
 * @returns {CanvasRenderingContext2D}
 */
export function createFontProxy(ctx, fontOverride) {
  if (!fontOverride || typeof fontOverride !== 'string') {
    return ctx;
  }

  return new Proxy(ctx, {
    set(target, prop, value) {
      if (prop === 'font' && typeof value === 'string') {
        const match = value.match(/^([\w\s.-]+?\b\d+(?:\.\d+)?(?:px|pt|em|rem))\s+(.+)$/i);
        if (match) {
          target.font = `${match[1]} ${fontOverride}`;
          return true;
        }
      }
      target[prop] = value;
      return true;
    },
    get(target, prop) {
      const val = target[prop];
      if (typeof val === 'function') {
        return val.bind(target);
      }
      return val;
    }
  });
}

/**
 * Renders font preset selector chips into DOM container.
 * @param {HTMLElement|null} container
 * @param {string} activePresetId
 * @param {(presetId: string) => void} onSelect
 */
export function renderTypographySelector(container, activePresetId = 'default', onSelect) {
  if (!container) return;
  container.innerHTML = '';

  Object.values(FONT_PRESETS).forEach((preset) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = `font-preset-chip ${preset.id === activePresetId ? 'active' : ''}`;
    chip.dataset.fontPreset = preset.id;

    const labelSpan = document.createElement('span');
    labelSpan.className = 'font-preset-label';
    labelSpan.textContent = preset.label;

    chip.appendChild(labelSpan);

    chip.addEventListener('click', () => {
      container.querySelectorAll('.font-preset-chip').forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      if (typeof onSelect === 'function') {
        onSelect(preset.id);
      }
    });

    container.appendChild(chip);
  });
}
