export const FILTER_PRESETS = {
  none: {
    label: 'Normal',
    css: 'none'
  },
  bw: {
    label: 'B&W',
    css: 'grayscale(100%) contrast(115%) brightness(105%)'
  },
  warm: {
    label: 'Warm Film',
    css: 'sepia(30%) saturate(125%) brightness(102%)'
  },
  cyber: {
    label: 'Cyber Flux',
    css: 'contrast(125%) saturate(140%) hue-rotate(180deg)'
  },
  fade: {
    label: 'Matte Fade',
    css: 'contrast(92%) brightness(108%) saturate(85%)'
  },
  noir: {
    label: 'High Noir',
    css: 'grayscale(100%) contrast(160%) brightness(95%)'
  }
};

/**
 * Returns CSS filter string for a given preset key.
 * @param {string} presetKey
 * @returns {string}
 */
export function getFilterCss(presetKey) {
  const preset = FILTER_PRESETS[presetKey] || FILTER_PRESETS.none;
  return preset.css;
}

/**
 * Applies filter preset to 2D canvas context.
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} presetKey
 */
export function applyCanvasFilter(ctx, presetKey) {
  if (!ctx) return;
  const filterVal = getFilterCss(presetKey);
  try {
    ctx.filter = filterVal;
  } catch {
    ctx.filter = 'none';
  }
}
