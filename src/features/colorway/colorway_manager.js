/**
 * Colorway Presets & Canvas Background Color Orchestrator for Framera Studio.
 * Allows overriding canvas background colorways and paper textures across templates.
 */

export const COLORWAY_PRESETS = {
  default: {
    id: 'default',
    label: 'Default',
    bg: null,
    border: null,
    textColor: null,
    previewColor: 'var(--accent-primary)'
  },
  cream: {
    id: 'cream',
    label: 'Cream Paper',
    bg: '#FAF7F0',
    border: '#E8E2D5',
    textColor: '#2E2A25',
    previewColor: '#FAF7F0'
  },
  noir: {
    id: 'noir',
    label: 'Dark Noir',
    bg: '#141416',
    border: '#28282C',
    textColor: '#F2F2F5',
    previewColor: '#141416'
  },
  vintage: {
    id: 'vintage',
    label: 'Warm Vintage',
    bg: '#F3EDE2',
    border: '#DAD1C2',
    textColor: '#3A332B',
    previewColor: '#F3EDE2'
  },
  sage: {
    id: 'sage',
    label: 'Sage Minimal',
    bg: '#EAF0EA',
    border: '#D0DDD1',
    textColor: '#243326',
    previewColor: '#EAF0EA'
  },
  lavender: {
    id: 'lavender',
    label: 'Pastel Dream',
    bg: '#F3EDF8',
    border: '#E0D2EB',
    textColor: '#34253F',
    previewColor: '#F3EDF8'
  }
};

/**
 * Creates a canvas context proxy that intercepts background fillRect calls to apply custom colorways.
 * @param {CanvasRenderingContext2D} ctx
 * @param {object|null} colorway
 * @param {number} canvasWidth
 * @param {number} canvasHeight
 * @returns {CanvasRenderingContext2D}
 */
export function createColorwayProxy(ctx, colorway, canvasWidth, canvasHeight) {
  if (!colorway || !colorway.bg) {
    return ctx;
  }

  let backgroundReplaced = false;

  return new Proxy(ctx, {
    get(target, prop) {
      if (prop === 'fillRect') {
        return function (x, y, w, h) {
          // Detect background-level full-bleed rect
          if (!backgroundReplaced && x === 0 && y === 0 && w >= canvasWidth * 0.9 && h >= canvasHeight * 0.9) {
            backgroundReplaced = true;
            target.save();
            target.fillStyle = colorway.bg;
            target.fillRect(0, 0, canvasWidth, canvasHeight);
            target.restore();
            return;
          }
          return target.fillRect(x, y, w, h);
        };
      }

      const val = target[prop];
      if (typeof val === 'function') {
        return val.bind(target);
      }
      return val;
    }
  });
}

/**
 * Renders colorway preset buttons into DOM container.
 * @param {HTMLElement|null} container
 * @param {string} activeColorwayId
 * @param {(colorwayId: string) => void} onSelect
 */
export function renderColorwaySelector(container, activeColorwayId = 'default', onSelect) {
  if (!container) return;
  container.innerHTML = '';

  Object.values(COLORWAY_PRESETS).forEach((preset) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = `colorway-chip ${preset.id === activeColorwayId ? 'active' : ''}`;
    chip.dataset.colorway = preset.id;
    chip.title = preset.label;
    chip.setAttribute('aria-label', preset.label);

    const swatch = document.createElement('span');
    swatch.className = 'colorway-swatch';
    if (preset.bg) {
      swatch.style.backgroundColor = preset.bg;
    } else {
      swatch.classList.add('swatch-default');
    }

    const label = document.createElement('span');
    label.className = 'colorway-label';
    label.textContent = preset.label;

    chip.appendChild(swatch);
    chip.appendChild(label);

    chip.addEventListener('click', () => {
      container.querySelectorAll('.colorway-chip').forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      if (typeof onSelect === 'function') {
        onSelect(preset.id);
      }
    });

    container.appendChild(chip);
  });
}
