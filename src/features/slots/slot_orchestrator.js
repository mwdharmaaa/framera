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
  } else if (Array.isArray(state.photoImgs) && state.photoImgs.length > 0) {
    state.slots.forEach((slot, idx) => {
      if (state.photoImgs[idx]) {
        slot.img = state.photoImgs[idx];
      }
    });
  }

  const validActiveIdx = Math.min(state.activeSlotIndex ?? 0, photoCount - 1);
  state.activeSlotIndex = validActiveIdx;

  renderSlotSelectorStrip(container, state.slots, validActiveIdx, (selectedIdx) => {
    state.activeSlotIndex = selectedIdx;
    const activeSlot = state.slots?.[selectedIdx];
    const newZoom = activeSlot?.zoom ?? 1;
    const newPanX = activeSlot?.panX ?? 0;
    const newPanY = activeSlot?.panY ?? 0;

    const zs = document.getElementById('zoomSlider');
    const zv = document.getElementById('zoomVal');
    const px = document.getElementById('panXSlider');
    const py = document.getElementById('panYSlider');
    if (zs) zs.value = String(Math.round(newZoom * 100));
    if (zv) zv.textContent = `${Math.round(newZoom * 100)}%`;
    if (px) px.value = String(newPanX);
    if (py) py.value = String(newPanY);

    updateState((prev) => ({
      ...prev,
      activeSlotIndex: selectedIdx,
      zoom: newZoom,
      panX: newPanX,
      panY: newPanY
    }));
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
