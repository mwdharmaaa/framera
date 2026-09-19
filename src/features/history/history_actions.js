/**
 * UI and Keyboard Shortcut Bindings for Studio Undo / Redo History.
 */

/**
 * Binds undo/redo UI buttons and keyboard shortcuts (Ctrl+Z / Ctrl+Y).
 * @param {object} params
 * @param {HTMLElement|null} params.undoBtn
 * @param {HTMLElement|null} params.redoBtn
 * @param {object} params.history
 * @param {() => object} params.getState
 * @param {(restoredState: object) => void} params.onApplyState
 */
export function bindHistoryActions({ undoBtn, redoBtn, history, getState, onApplyState }) {
  const updateButtons = () => {
    if (undoBtn) undoBtn.disabled = !history.canUndo();
    if (redoBtn) redoBtn.disabled = !history.canRedo();
  };

  const executeUndo = () => {
    const currentState = getState();
    const prev = history.undo(currentState);
    if (prev) {
      onApplyState(prev);
      updateButtons();
    }
  };

  const executeRedo = () => {
    const currentState = getState();
    const next = history.redo(currentState);
    if (next) {
      onApplyState(next);
      updateButtons();
    }
  };

  if (undoBtn) undoBtn.addEventListener('click', executeUndo);
  if (redoBtn) redoBtn.addEventListener('click', executeRedo);

  if (typeof document !== 'undefined') {
    document.addEventListener('keydown', (e) => {
      // Don't intercept when user is typing inside input or textarea
      if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) return;

      const isMac = typeof navigator !== 'undefined' && /Mac/i.test(navigator.userAgent || '');
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      if (modifier && (e.key === 'z' || e.key === 'Z') && !e.shiftKey) {
        e.preventDefault();
        executeUndo();
      } else if (
        modifier &&
        (e.key === 'y' || e.key === 'Y' || (e.shiftKey && (e.key === 'z' || e.key === 'Z')))
      ) {
        e.preventDefault();
        executeRedo();
      }
    });
  }

  updateButtons();

  return {
    updateButtons,
    executeUndo,
    executeRedo
  };
}
