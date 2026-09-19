/**
 * Slot Orchestrator for Multi-Slot Template Framing and UI Synchronization.
 */

import { createSlotList, renderSlotSelectorStrip } from './slot_manager.js';

/**
 * Synchronizes slot state when active template changes.
 * @param {object} params
 * @param {object} params.template
 * @param {object} params.state
 * @param {HTMLElement|null} params.container
 * @param {(updater: (prev: object) => object) => void} params.updateState
 */
export function syncSlotsWithTemplate({ template, state, container, updateState }) {
  const photoCount = template?.photoCount || 1;
  const currentSlots = state.slots || [];

  if (currentSlots.length !== photoCount) {
    const rawPhotos = state.photoImgs || (state.photoImg ? [state.photoImg] : []);
    state.slots = createSlotList(photoCount, rawPhotos);
    state.activeSlotIndex = 0;
  }

  renderSlotSelectorStrip(container, state.slots, state.activeSlotIndex, (selectedIdx) => {
    updateState((prev) => {
      const activeSlot = prev.slots?.[selectedIdx];
      return {
        ...prev,
        activeSlotIndex: selectedIdx,
        zoom: activeSlot?.zoom ?? prev.zoom,
        panX: activeSlot?.panX ?? prev.panX,
        panY: activeSlot?.panY ?? prev.panY
      };
    });

    const zs = document.getElementById('zoomSlider');
    const zv = document.getElementById('zoomVal');
    const px = document.getElementById('panXSlider');
    const py = document.getElementById('panYSlider');
    const current = state.slots?.[selectedIdx];
    if (current) {
      if (zs) zs.value = String(Math.round((current.zoom ?? 1) * 100));
      if (zv) zv.textContent = `${Math.round((current.zoom ?? 1) * 100)}%`;
      if (px) px.value = String(current.panX ?? 0);
      if (py) py.value = String(current.panY ?? 0);
    }
  });
}

/**
 * Updates framing for the currently active slot.
 * @param {object} state
 * @param {object} framingUpdates
 */
export function updateActiveSlotFraming(state, framingUpdates) {
  if (!Array.isArray(state.slots) || state.slots.length === 0) return;
  const activeIdx = state.activeSlotIndex ?? 0;
  if (state.slots[activeIdx]) {
    state.slots[activeIdx] = {
      ...state.slots[activeIdx],
      ...framingUpdates
    };
  }
}
