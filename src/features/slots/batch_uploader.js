/**
 * Batch File Uploader & Auto-Fill Orchestrator for Multi-Slot Templates.
 * Automatically distributes multiple dropped/selected images sequentially across template slots.
 */

import { loadAndNormalizeFile } from '../../core/canvas/image_resizer.js';
import { getTemplate } from '../templates/template_registry.js';
import { createSlotList } from './slot_manager.js';

/**
 * Filters and validates file list for supported image types.
 * @param {FileList|File[]} fileList
 * @returns {File[]}
 */
export function filterImageFiles(fileList) {
  if (!fileList) return [];
  return Array.from(fileList).filter((f) => f && typeof f.type === 'string' && f.type.startsWith('image/'));
}

/**
 * Plans distribution of uploaded image files across template slots.
 * @param {File[]} imageFiles
 * @param {number} photoCount
 * @param {number} [activeSlotIndex=0]
 * @returns {{ assignedIndices: number[], overflowCount: number, message: string }}
 */
export function planSlotDistribution(imageFiles, photoCount, activeSlotIndex = 0) {
  const count = Math.max(1, photoCount);
  const totalFiles = imageFiles.length;

  if (totalFiles === 0) {
    return { assignedIndices: [], overflowCount: 0, message: '' };
  }

  if (totalFiles === 1 && count > 1) {
    const targetIdx = Math.max(0, Math.min(activeSlotIndex, count - 1));
    return {
      assignedIndices: [targetIdx],
      overflowCount: 0,
      message: `Assigned to Slot ${targetIdx + 1} of ${count}`
    };
  }

  const assignedIndices = [];
  for (let i = 0; i < Math.min(totalFiles, count); i++) {
    assignedIndices.push(i);
  }

  const overflowCount = Math.max(0, totalFiles - count);
  let message = `Auto-filled ${assignedIndices.length} of ${count} slots`;
  if (overflowCount > 0) {
    message += ` (${overflowCount} excess photos ignored)`;
  }

  return { assignedIndices, overflowCount, message };
}

/**
 * Synchronously computes updated slots and photo collections from already-loaded image objects.
 * @param {Array<{ img: object, dataUrl?: string }>} loadedResults
 * @param {object} currentState
 * @returns {{ slots: object[], photos: object[], photoImgs: object[], photoImg: object|null, photoDataUrl: string|null, message: string }|null}
 */
export function applyBatchLoadedImages(loadedResults, currentState) {
  if (!Array.isArray(loadedResults) || !loadedResults.length) return null;

  const tpl = getTemplate(currentState?.templateId);
  const photoCount = tpl?.photoCount || 1;
  const activeIdx = Math.min(currentState?.activeSlotIndex ?? 0, photoCount - 1);

  const plan = planSlotDistribution(loadedResults, photoCount, activeIdx);
  if (!plan.assignedIndices.length) return null;

  let slots = Array.isArray(currentState?.slots) && currentState.slots.length === photoCount
    ? currentState.slots.map((s) => ({ ...s }))
    : createSlotList(photoCount, currentState?.photoImgs || (currentState?.photoImg ? [currentState.photoImg] : []));

  let nextPhotos = Array.isArray(currentState?.photoImgs) ? [...currentState.photoImgs] : [];
  while (nextPhotos.length < photoCount) {
    nextPhotos.push(currentState?.photoImg || null);
  }

  plan.assignedIndices.forEach((slotIdx, i) => {
    const res = loadedResults[i];
    if (res && res.img) {
      slots[slotIdx] = {
        ...slots[slotIdx],
        img: res.img,
        dataUrl: res.dataUrl || null,
        zoom: 1,
        panX: 0,
        panY: 0
      };
      nextPhotos[slotIdx] = res.img;
    }
  });

  return {
    slots,
    photos: nextPhotos,
    photoImgs: nextPhotos,
    photoImg: nextPhotos[0] || currentState?.photoImg || null,
    photoDataUrl: loadedResults[0]?.dataUrl || currentState?.photoDataUrl || null,
    message: plan.message
  };
}

/**
 * Processes batch of image files and returns updated slot state payload.
 * @param {File[]} imageFiles
 * @param {object} currentState
 * @param {(file: File) => Promise<{ img: object, dataUrl: string }>} [fileLoader=loadAndNormalizeFile]
 * @returns {Promise<{ slots: object[], photos: object[], photoImg: object|null, photoDataUrl: string|null, message: string }|null>}
 */
export async function processBatchUpload(imageFiles, currentState, fileLoader = loadAndNormalizeFile) {
  const validFiles = filterImageFiles(imageFiles);
  if (!validFiles.length) return null;

  const tpl = getTemplate(currentState?.templateId);
  const photoCount = tpl?.photoCount || 1;
  const activeIdx = Math.min(currentState?.activeSlotIndex ?? 0, photoCount - 1);

  const plan = planSlotDistribution(validFiles, photoCount, activeIdx);
  if (!plan.assignedIndices.length) return null;

  const loadedResults = await Promise.all(
    plan.assignedIndices.map((slotIdx, i) => fileLoader(validFiles[i]))
  );

  return applyBatchLoadedImages(loadedResults, currentState);
}
