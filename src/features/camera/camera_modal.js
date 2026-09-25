/**
 * Photobooth Camera Modal UI Controller.
 * Manages modal visibility, camera lifecycle, flash animation, and slot photo assignment.
 */

import {
  startCameraStream,
  stopCameraStream,
  executePhotoboothBurst
} from './camera_photobooth.js';
import { loadStudioImage } from '../../core/canvas/renderer.js';

/**
 * Initializes photobooth camera modal and event bindings.
 * @param {object} elements
 * @param {() => object} getState
 * @param {(updater: (prev: object) => object) => Promise<void>} updateState
 * @returns {{ open: () => Promise<void>, close: () => void }}
 */
export function initCameraModal(elements, getState, updateState) {
  const {
    modalEl,
    videoEl,
    countdownEl,
    flashEl,
    snapBtn,
    facingBtn,
    closeBtn,
    openBtn,
    statusLabel
  } = elements;

  let currentFacingMode = 'user';
  let isCapturing = false;

  async function open() {
    if (!modalEl) return;
    modalEl.style.display = 'flex';
    if (countdownEl) countdownEl.style.display = 'none';
    if (statusLabel) {
      const state = getState();
      statusLabel.textContent = `Live Camera Ready (${state.slots?.length || 1} Photo Slots)`;
    }
    try {
      await startCameraStream(videoEl, currentFacingMode);
    } catch (err) {
      if (statusLabel) statusLabel.textContent = `Camera Error: ${err.message || 'Access Denied'}`;
    }
  }

  function close() {
    if (isCapturing) return;
    stopCameraStream(videoEl);
    if (modalEl) modalEl.style.display = 'none';
  }

  function triggerFlash() {
    if (!flashEl) return;
    flashEl.classList.remove('active');
    void flashEl.offsetWidth; // Force CSS reflow
    flashEl.classList.add('active');
    setTimeout(() => flashEl.classList.remove('active'), 350);
  }

  async function handleSnap() {
    if (isCapturing) return;
    isCapturing = true;
    if (snapBtn) snapBtn.disabled = true;

    const state = getState();
    const photoCount = state.slots?.length || 1;

    try {
      if (countdownEl) countdownEl.style.display = 'flex';

      await executePhotoboothBurst({
        videoEl,
        photoCount,
        countdownSeconds: 3,
        onTick: (slotIdx, remainingSec) => {
          if (countdownEl) {
            countdownEl.textContent = remainingSec > 0 ? remainingSec : 'SMILE!';
          }
          if (statusLabel) {
            statusLabel.textContent = `Capturing Frame ${slotIdx + 1} of ${photoCount}...`;
          }
        },
        onFlash: triggerFlash,
        onSnap: async (slotIdx, frame) => {
          const img = await loadStudioImage(frame.dataUrl).catch(() => null);
          if (!img) return;

          await updateState((prev) => {
            const slots = Array.isArray(prev.slots) ? prev.slots.map((s) => ({ ...s })) : [];
            const nextPhotos = Array.isArray(prev.photoImgs) ? [...prev.photoImgs] : [];

            if (slots[slotIdx]) {
              slots[slotIdx] = {
                ...slots[slotIdx],
                img,
                dataUrl: frame.dataUrl,
                zoom: 1,
                panX: 0,
                panY: 0
              };
            }
            nextPhotos[slotIdx] = img;

            return {
              ...prev,
              slots,
              photoImgs: nextPhotos,
              photoImg: nextPhotos[0] || img,
              photoDataUrl: frame.dataUrl,
              isUserUploaded: true
            };
          });
        }
      });

      if (statusLabel) statusLabel.textContent = 'All photobooth frames captured!';
      setTimeout(() => {
        close();
        isCapturing = false;
        if (snapBtn) snapBtn.disabled = false;
        if (countdownEl) countdownEl.style.display = 'none';
      }, 700);
    } catch {
      isCapturing = false;
      if (snapBtn) snapBtn.disabled = false;
      if (countdownEl) countdownEl.style.display = 'none';
    }
  }

  async function toggleFacingMode() {
    if (isCapturing) return;
    currentFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
    await startCameraStream(videoEl, currentFacingMode).catch(() => {});
  }

  if (openBtn) openBtn.addEventListener('click', open);
  if (closeBtn) closeBtn.addEventListener('click', close);
  if (snapBtn) snapBtn.addEventListener('click', handleSnap);
  if (facingBtn) facingBtn.addEventListener('click', toggleFacingMode);

  return { open, close };
}
