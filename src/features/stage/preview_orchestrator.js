import { calculateImageBounds } from '../../core/canvas/bounds.js';
import { applyCanvasFilter } from '../../core/canvas/filters.js';
import { createStudioCanvas } from '../../core/canvas/renderer.js';
import { renderFallbackStudioCanvas } from '../../core/canvas/fallback_renderer.js';
import { getTemplate } from '../templates/template_registry.js';

let fontsPreloaded = false;
let cachedCanvas = null;
let cachedCtx = null;
let currentPreviewBlobUrl = null;

/**
 * Preloads and caches studio typography fonts once to avoid microtask delays on every rAF frame.
 */
export async function ensureStudioFonts() {
  if (fontsPreloaded) return;
  if (typeof document !== 'undefined' && document.fonts?.load) {
    try {
      await Promise.all([
        document.fonts.load('240px "Anton"'),
        document.fonts.load('240px "Bebas Neue"'),
        document.fonts.load('120px "Fredoka"'),
        document.fonts.load('220px "Great Vibes"'),
        document.fonts.load('20px "Space Mono"'),
        document.fonts.ready
      ]);
      fontsPreloaded = true;
    } catch {
      // Non-blocking font load fallback
    }
  } else if (typeof document !== 'undefined' && document.fonts?.ready) {
    try {
      await document.fonts.ready;
      fontsPreloaded = true;
    } catch {
      // Non-blocking font load fallback
    }
  }
}

/**
 * Reuses or allocates an offscreen studio canvas buffer to eliminate GC memory thrashing.
 * @param {number} width
 * @param {number} height
 * @returns {{ canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D }}
 */
export function getOrCreateStudioCanvas(width, height) {
  if (cachedCanvas && cachedCanvas.width === width && cachedCanvas.height === height && cachedCtx) {
    cachedCtx.save();
    cachedCtx.setTransform(1, 0, 0, 1, 0, 0);
    cachedCtx.clearRect(0, 0, width, height);
    cachedCtx.restore();
    return { canvas: cachedCanvas, ctx: cachedCtx };
  }

  const result = createStudioCanvas(width, height);
  cachedCanvas = result.canvas;
  cachedCtx = result.ctx;
  return result;
}

/**
 * Updates preview image using lightweight blob URL or fallback dataURL.
 * @param {HTMLImageElement|null} previewImage
 * @param {HTMLCanvasElement} canvas
 */
function updatePreviewImage(previewImage, canvas) {
  if (!previewImage) return;

  if (typeof canvas.toBlob === 'function' && typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
    canvas.toBlob((blob) => {
      if (!blob) return;
      if (currentPreviewBlobUrl) {
        URL.revokeObjectURL(currentPreviewBlobUrl);
      }
      currentPreviewBlobUrl = URL.createObjectURL(blob);
      previewImage.src = currentPreviewBlobUrl;
      previewImage.style.display = 'block';
    }, 'image/webp', 0.88);
    return;
  }

  previewImage.src = canvas.toDataURL('image/png');
  previewImage.style.display = 'block';
}

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

  await ensureStudioFonts();

  const tpl = getTemplate(state.templateId);
  const canvasWidth = tpl?.config?.canvasWidth || 1080;
  const canvasHeight = tpl?.config?.canvasHeight || 1350;
  const frame = tpl?.config?.frame || { x: 60, y: 60, w: canvasWidth - 120, h: canvasHeight - 160 };

  const { canvas, ctx } = getOrCreateStudioCanvas(canvasWidth, canvasHeight);

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

  updatePreviewImage(previewImage, canvas);
  if (previewLoader) previewLoader.style.display = 'none';

  return canvas;
}
