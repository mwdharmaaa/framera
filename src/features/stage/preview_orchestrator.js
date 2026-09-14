import { calculateImageBounds } from '../../core/canvas/bounds.js';
import { applyCanvasFilter } from '../../core/canvas/filters.js';
import { createStudioCanvas } from '../../core/canvas/renderer.js';
import { renderFallbackStudioCanvas } from '../../core/canvas/fallback_renderer.js';
import { getTemplate } from '../templates/template_registry.js';

/**
 * Synthesizes and renders the studio canvas based on current state.
 * @param {object} params
 * @param {object} params.state
 * @param {HTMLImageElement|null} params.previewImage
 * @param {HTMLElement|null} params.previewLoader
 * @param {() => void} [params.onRedraw]
 * @returns {Promise<HTMLCanvasElement>}
 */
export async function renderStudioFrame({ state, previewImage, previewLoader, onRedraw }) {
  if (previewLoader) previewLoader.style.display = 'flex';

  if (typeof document !== 'undefined' && document.fonts?.load) {
    try {
      await Promise.all([
        document.fonts.load('240px "Anton"'),
        document.fonts.load('240px "Bebas Neue"'),
        document.fonts.load('220px "Great Vibes"'),
        document.fonts.load('20px "Space Mono"'),
        document.fonts.ready
      ]);
    } catch {
      // Non-blocking font load fallback
    }
  } else if (typeof document !== 'undefined' && document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch {
      // Non-blocking font load fallback
    }
  }

  const tpl = getTemplate(state.templateId);
  const canvasWidth = tpl?.config?.canvasWidth || 1080;
  const canvasHeight = tpl?.config?.canvasHeight || 1350;
  const frame = tpl?.config?.frame || { x: 60, y: 60, w: canvasWidth - 120, h: canvasHeight - 160 };

  const { canvas, ctx } = createStudioCanvas(canvasWidth, canvasHeight);

  let bounds = {
    drawX: frame.x,
    drawY: frame.y,
    drawW: frame.w,
    drawH: frame.h
  };

  if (state.photoImg) {
    bounds = calculateImageBounds(
      state.photoImg.naturalWidth || state.photoImg.width,
      state.photoImg.naturalHeight || state.photoImg.height,
      frame,
      {
        zoom: state.zoom,
        panX: state.panX,
        panY: state.panY,
        fitMode: 'cover'
      }
    );
  }

  applyCanvasFilter(ctx, state.filter);

  state.onRedraw = onRedraw;
  if (tpl && typeof tpl.render === 'function') {
    tpl.render(ctx, state.photoImg, bounds, state);
  } else {
    renderFallbackStudioCanvas(ctx, canvasWidth, canvasHeight, frame, state, bounds);
  }

  if (previewImage) {
    previewImage.src = canvas.toDataURL('image/png');
    previewImage.style.display = 'block';
  }
  if (previewLoader) previewLoader.style.display = 'none';

  return canvas;
}
