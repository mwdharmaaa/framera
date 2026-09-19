/**
 * Command/Snapshot-based History Manager for Framera Studio.
 * Handles Undo/Redo operations with bounded stack depth.
 */

const DEFAULT_MAX_DEPTH = 30;

/**
 * Creates a serializable snapshot of the studio state.
 * @param {object} state
 * @returns {object}
 */
export function createSnapshot(state) {
  if (!state) return null;
  return {
    templateId: state.templateId,
    photoDataUrl: state.photoDataUrl,
    isUserUploaded: Boolean(state.isUserUploaded),
    zoom: state.zoom ?? 1,
    panX: state.panX ?? 0,
    panY: state.panY ?? 0,
    filter: state.filter || 'none',
    caption: state.caption || '',
    subtitle: state.subtitle || '',
    date: state.date || '',
    activeSlotIndex: state.activeSlotIndex ?? 0,
    slots: Array.isArray(state.slots)
      ? state.slots.map((s) => ({
          id: s.id,
          dataUrl: s.dataUrl || null,
          zoom: s.zoom ?? 1,
          panX: s.panX ?? 0,
          panY: s.panY ?? 0
        }))
      : []
  };
}

/**
 * Factory for creating an isolated History Manager instance.
 * @param {object} [options]
 * @param {number} [options.maxDepth=30]
 */
export function createHistoryManager(options = {}) {
  const maxDepth = options.maxDepth || DEFAULT_MAX_DEPTH;
  const undoStack = [];
  const redoStack = [];

  return {
    record(state) {
      const snapshot = createSnapshot(state);
      if (!snapshot) return;

      undoStack.push(snapshot);
      if (undoStack.length > maxDepth) {
        undoStack.shift();
      }
      redoStack.length = 0;
    },

    undo(currentState) {
      if (undoStack.length === 0) return null;

      const currentSnapshot = createSnapshot(currentState);
      if (currentSnapshot) {
        redoStack.push(currentSnapshot);
        if (redoStack.length > maxDepth) {
          redoStack.shift();
        }
      }

      return undoStack.pop();
    },

    redo(currentState) {
      if (redoStack.length === 0) return null;

      const currentSnapshot = createSnapshot(currentState);
      if (currentSnapshot) {
        undoStack.push(currentSnapshot);
        if (undoStack.length > maxDepth) {
          undoStack.shift();
        }
      }

      return redoStack.pop();
    },

    canUndo() {
      return undoStack.length > 0;
    },

    canRedo() {
      return redoStack.length > 0;
    },

    clear() {
      undoStack.length = 0;
      redoStack.length = 0;
    },

    getDepth() {
      return { undo: undoStack.length, redo: redoStack.length };
    }
  };
}
