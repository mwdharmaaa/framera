/**
 * Studio State Persistence Manager for Framera.
 * Manages saving, restoring, and clearing drafts from browser storage.
 */

import { createSnapshot } from '../history/history_manager.js';

const STORAGE_KEY = 'framera_studio_draft_v1';

/**
 * Saves current studio state snapshot to localStorage.
 * @param {object} state
 * @returns {boolean} Success status
 */
export function saveDraft(state) {
  if (typeof window === 'undefined' || !window.localStorage) return false;

  try {
    const snapshot = createSnapshot(state);
    if (!snapshot) return false;

    // Avoid storing massive base64 payloads if exceeding storage quota
    const payload = JSON.stringify({
      ...snapshot,
      savedAt: Date.now()
    });

    window.localStorage.setItem(STORAGE_KEY, payload);
    return true;
  } catch (err) {
    console.warn('[Persistence] Failed to persist draft to localStorage:', err);
    return false;
  }
}

/**
 * Retrieves saved draft from localStorage.
 * @returns {object|null}
 */
export function loadDraft() {
  if (typeof window === 'undefined' || !window.localStorage) return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;

    return parsed;
  } catch (err) {
    console.warn('[Persistence] Corrupted draft encountered, clearing:', err);
    clearDraft();
    return null;
  }
}

/**
 * Clears saved studio draft from localStorage.
 */
export function clearDraft() {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage access error handling
  }
}

/**
 * Checks if a persisted draft exists in storage.
 * @returns {boolean}
 */
export function hasDraft() {
  if (typeof window === 'undefined' || !window.localStorage) return false;
  try {
    return Boolean(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return false;
  }
}
