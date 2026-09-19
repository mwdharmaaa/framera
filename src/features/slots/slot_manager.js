/**
 * Multi-Slot Photo Manager for Framera Templates.
 * Manages per-slot photo instances, zoom/pan transforms, and slot selector UI.
 */

/**
 * Creates initialized slot array for given photo count and source photos.
 * @param {number} photoCount
 * @param {Array<HTMLImageElement>} [sourcePhotos=[]]
 * @param {Array<string>} [sourceDataUrls=[]]
 * @returns {Array<object>}
 */
export function createSlotList(photoCount = 1, sourcePhotos = [], sourceDataUrls = []) {
  const count = Math.max(1, photoCount);
  const slots = [];

  for (let i = 0; i < count; i++) {
    const img = sourcePhotos[i] || sourcePhotos[0] || null;
    const dataUrl = sourceDataUrls[i] || sourceDataUrls[0] || null;
    slots.push({
      id: i,
      name: `Slot ${i + 1}`,
      img,
      dataUrl,
      zoom: 1,
      panX: 0,
      panY: 0
    });
  }

  return slots;
}

/**
 * Updates a specific slot in the slot array immutably.
 * @param {Array<object>} slots
 * @param {number} slotIndex
 * @param {object} updates
 * @returns {Array<object>}
 */
export function updateSlotAtIndex(slots, slotIndex, updates) {
  if (!Array.isArray(slots) || slotIndex < 0 || slotIndex >= slots.length) {
    return slots;
  }
  return slots.map((slot, idx) => {
    if (idx !== slotIndex) return slot;
    return { ...slot, ...updates };
  });
}

/**
 * Renders or updates slot selector strip in the UI controls panel.
 * @param {HTMLElement|null} container
 * @param {Array<object>} slots
 * @param {number} activeIndex
 * @param {(index: number) => void} onSelectSlot
 */
export function renderSlotSelectorStrip(container, slots, activeIndex, onSelectSlot) {
  if (!container) return;

  if (!Array.isArray(slots) || slots.length <= 1) {
    container.style.display = 'none';
    container.innerHTML = '';
    return;
  }

  const doc = container.ownerDocument || (typeof document !== 'undefined' ? document : null);
  if (!doc) return;

  container.style.display = 'flex';
  container.innerHTML = '';

  slots.forEach((slot, idx) => {
    const btn = doc.createElement('button');
    btn.type = 'button';
    btn.className = `slot-tab-btn ${idx === activeIndex ? 'active' : ''}`;
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', idx === activeIndex ? 'true' : 'false');

    const label = doc.createElement('span');
    label.className = 'slot-tab-label';
    label.textContent = `Photo ${idx + 1}`;

    const indicator = doc.createElement('span');
    indicator.className = `slot-indicator-dot ${slot.img ? 'filled' : 'empty'}`;

    btn.appendChild(indicator);
    btn.appendChild(label);

    btn.addEventListener('click', () => {
      if (typeof onSelectSlot === 'function') {
        onSelectSlot(idx);
      }
    });

    container.appendChild(btn);
  });
}
