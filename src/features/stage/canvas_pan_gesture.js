/**
 * Interactive touch and pointer drag-to-pan gesture controller for Framera Studio canvas preview.
 * Allows users on desktop and mobile to drag directly on the canvas preview to adjust photo framing.
 */

export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

/**
 * Initializes pointer drag-to-pan gestures on the preview viewport.
 * @param {object} params
 * @param {HTMLElement|null} params.viewportEl
 * @param {HTMLInputElement|null} params.panXSlider
 * @param {HTMLInputElement|null} params.panYSlider
 * @param {HTMLInputElement|null} [params.zoomSlider]
 * @param {() => object} params.getState
 * @param {(updater: object | ((prev: object) => object), options?: object) => void} params.updateState
 * @returns {{ destroy: () => void } | null}
 */
export function initCanvasPanGesture({
  viewportEl,
  panXSlider,
  panYSlider,
  zoomSlider,
  getState,
  updateState
}) {
  if (!viewportEl) return null;

  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let initialPanX = 0;
  let initialPanY = 0;

  const onPointerDown = (e) => {
    if (e.button && e.button !== 0) return;
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    const currentState = typeof getState === 'function' ? getState() : {};
    initialPanX = currentState?.panX ?? 0;
    initialPanY = currentState?.panY ?? 0;
    viewportEl.classList?.add('is-dragging');
    if (typeof viewportEl.setPointerCapture === 'function' && e.pointerId != null) {
      try {
        viewportEl.setPointerCapture(e.pointerId);
      } catch {
        // Safe catch for synthetic or detached events
      }
    }
  };

  const onPointerMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    const state = typeof getState === 'function' ? getState() : {};
    const zoom = state?.zoom || 1;
    const sensitivity = 1 / zoom;

    const newPanX = Math.round(clamp(initialPanX + dx * sensitivity, -250, 250));
    const newPanY = Math.round(clamp(initialPanY + dy * sensitivity, -250, 250));

    if (panXSlider) panXSlider.value = String(newPanX);
    if (panYSlider) panYSlider.value = String(newPanY);

    if (typeof updateState === 'function') {
      updateState(
        (prev) => ({ ...prev, panX: newPanX, panY: newPanY }),
        { recordHistory: false }
      );
    }
  };

  const onPointerUp = (e) => {
    if (!isDragging) return;
    isDragging = false;
    viewportEl.classList?.remove('is-dragging');
    if (typeof viewportEl.releasePointerCapture === 'function' && e.pointerId != null) {
      try {
        viewportEl.releasePointerCapture(e.pointerId);
      } catch {
        // Safe catch
      }
    }
    const state = typeof getState === 'function' ? getState() : {};
    if (typeof updateState === 'function') {
      updateState({ panX: state.panX, panY: state.panY }, { recordHistory: true });
    }
  };

  const onWheel = (e) => {
    if (!e.ctrlKey && !e.metaKey) return;
    if (typeof e.preventDefault === 'function') e.preventDefault();
    const state = typeof getState === 'function' ? getState() : {};
    const currentZoom = state?.zoom || 1;
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    const newZoom = Number(clamp(currentZoom + delta, 0.5, 2.5).toFixed(2));

    if (zoomSlider) zoomSlider.value = String(Math.round(newZoom * 100));
    if (typeof updateState === 'function') {
      updateState({ zoom: newZoom });
    }
  };

  viewportEl.addEventListener('pointerdown', onPointerDown);
  viewportEl.addEventListener('pointermove', onPointerMove);
  viewportEl.addEventListener('pointerup', onPointerUp);
  viewportEl.addEventListener('pointercancel', onPointerUp);
  viewportEl.addEventListener('wheel', onWheel, { passive: false });

  return {
    destroy() {
      viewportEl.removeEventListener('pointerdown', onPointerDown);
      viewportEl.removeEventListener('pointermove', onPointerMove);
      viewportEl.removeEventListener('pointerup', onPointerUp);
      viewportEl.removeEventListener('pointercancel', onPointerUp);
      viewportEl.removeEventListener('wheel', onWheel);
    }
  };
}
