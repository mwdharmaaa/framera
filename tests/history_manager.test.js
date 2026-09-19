import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { createHistoryManager, createSnapshot } from '../src/features/history/history_manager.js';

describe('History Manager Engine (Undo / Redo)', () => {
  let history;

  beforeEach(() => {
    history = createHistoryManager({ maxDepth: 5 });
  });

  test('should create valid serializable state snapshots', () => {
    const rawState = {
      templateId: 'tokyo_brutalist',
      zoom: 1.5,
      panX: 10,
      panY: -20,
      filter: 'warm_film',
      caption: 'TOKYO',
      subtitle: 'Night vibe',
      date: '2026',
      photoDataUrl: 'data:image/png;base64,123',
      isUserUploaded: true,
      extraHeavyField: new Map() // Non-serializable
    };

    const snapshot = createSnapshot(rawState);
    assert.equal(snapshot.templateId, 'tokyo_brutalist');
    assert.equal(snapshot.zoom, 1.5);
    assert.equal(snapshot.panX, 10);
    assert.equal(snapshot.panY, -20);
    assert.equal(snapshot.filter, 'warm_film');
    assert.equal(snapshot.caption, 'TOKYO');
    assert.equal(snapshot.extraHeavyField, undefined);
  });

  test('should push state and allow undo/redo operations', () => {
    assert.equal(history.canUndo(), false);
    assert.equal(history.canRedo(), false);

    const s1 = { templateId: 'focus_editorial', caption: 'State 1' };
    const s2 = { templateId: 'focus_editorial', caption: 'State 2' };
    const s3 = { templateId: 'focus_editorial', caption: 'State 3' };

    history.record(s1);
    history.record(s2);

    assert.equal(history.canUndo(), true);
    assert.equal(history.canRedo(), false);

    // Undo from s3
    const reverted = history.undo(s3);
    assert.equal(reverted.caption, 'State 2');
    assert.equal(history.canRedo(), true);

    // Redo back to s3
    const restored = history.redo(reverted);
    assert.equal(restored.caption, 'State 3');
    assert.equal(history.canRedo(), false);
  });

  test('should respect bounded depth limit', () => {
    for (let i = 1; i <= 10; i++) {
      history.record({ templateId: 't1', caption: `State ${i}` });
    }

    const depth = history.getDepth();
    assert.equal(depth.undo, 5); // maxDepth was 5
  });

  test('should clear redo stack when new action is recorded', () => {
    const s1 = { caption: 'A' };
    const s2 = { caption: 'B' };
    const s3 = { caption: 'C' };

    history.record(s1);
    history.record(s2);
    history.undo(s3); // redoStack has s3

    assert.equal(history.canRedo(), true);

    history.record({ caption: 'D' });
    assert.equal(history.canRedo(), false);
  });
});
