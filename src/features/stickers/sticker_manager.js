/**
 * Sticker Manager & UI Controller for Framera Studio.
 * Handles adding, removing, scaling, and rotating stickers with live canvas redraw.
 */

import { STICKER_TYPES, createStickerInstance } from './sticker_types.js';

/**
 * Initializes sticker selection and active sticker control list.
 * @param {object} options
 * @param {HTMLElement|null} options.chipsContainer
 * @param {HTMLElement|null} options.listContainer
 * @param {() => object} options.getState
 * @param {(updater: (prev: object) => object, options?: object) => void} options.updateState
 */
export function initStickerManager({ chipsContainer, listContainer, getState, updateState }) {
  function renderChips() {
    if (!chipsContainer) return;
    chipsContainer.innerHTML = '';

    Object.values(STICKER_TYPES).forEach((meta) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'sticker-chip';
      chip.dataset.stickerType = meta.id;
      chip.textContent = meta.label;

      chip.addEventListener('click', () => {
        const state = getState();
        const tpl = state.template;
        const cx = (tpl?.config?.canvasWidth || 736) / 2;
        const cy = (tpl?.config?.canvasHeight || 1080) / 2;
        const newSticker = createStickerInstance(meta.id, cx, cy);

        updateState((prev) => {
          const currentList = Array.isArray(prev.stickers) ? prev.stickers : [];
          return {
            ...prev,
            stickers: [...currentList, newSticker]
          };
        });
        renderList();
      });

      chipsContainer.appendChild(chip);
    });
  }

  function renderList() {
    if (!listContainer) return;
    listContainer.innerHTML = '';

    const state = getState();
    const stickers = Array.isArray(state.stickers) ? state.stickers : [];

    if (!stickers.length) {
      const emptyNote = document.createElement('div');
      emptyNote.className = 'sticker-empty-note';
      emptyNote.textContent = 'No stickers added yet. Click above to add stamps.';
      listContainer.appendChild(emptyNote);
      return;
    }

    stickers.forEach((sticker, idx) => {
      const item = document.createElement('div');
      item.className = 'sticker-item-row';

      const info = document.createElement('span');
      info.className = 'sticker-item-name';
      const meta = STICKER_TYPES[sticker.type] || {};
      info.textContent = `#${idx + 1} ${meta.label || sticker.type}`;

      const controls = document.createElement('div');
      controls.className = 'sticker-item-actions';

      // Scale slider
      const scaleInput = document.createElement('input');
      scaleInput.type = 'range';
      scaleInput.min = '40';
      scaleInput.max = '250';
      scaleInput.value = String(Math.round((sticker.scale || 1) * 100));
      scaleInput.title = 'Size scale';
      scaleInput.addEventListener('input', (e) => {
        const scaleVal = parseInt(e.target.value, 10) / 100;
        updateState((prev) => {
          const next = (prev.stickers || []).map((s) => (s.id === sticker.id ? { ...s, scale: scaleVal } : s));
          return { ...prev, stickers: next };
        }, { recordHistory: false });
      });

      // Rotation slider
      const rotInput = document.createElement('input');
      rotInput.type = 'range';
      rotInput.min = '-180';
      rotInput.max = '180';
      rotInput.value = String(Math.round(sticker.rotation || 0));
      rotInput.title = 'Rotation angle';
      rotInput.addEventListener('input', (e) => {
        const rotVal = parseInt(e.target.value, 10);
        updateState((prev) => {
          const next = (prev.stickers || []).map((s) => (s.id === sticker.id ? { ...s, rotation: rotVal } : s));
          return { ...prev, stickers: next };
        }, { recordHistory: false });
      });

      // Remove button
      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'sticker-remove-btn';
      removeBtn.innerHTML = '&times;';
      removeBtn.title = 'Remove sticker';
      removeBtn.addEventListener('click', () => {
        updateState((prev) => {
          const next = (prev.stickers || []).filter((s) => s.id !== sticker.id);
          return { ...prev, stickers: next };
        });
        renderList();
      });

      controls.appendChild(scaleInput);
      controls.appendChild(rotInput);
      controls.appendChild(removeBtn);

      item.appendChild(info);
      item.appendChild(controls);
      listContainer.appendChild(item);
    });
  }

  renderChips();
  renderList();

  return { renderList };
}
