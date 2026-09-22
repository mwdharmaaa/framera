import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { saveDraft, loadDraft, clearDraft, hasDraft, saveDraftDebounced, flushPendingDraft } from '../src/features/persistence/persistence_manager.js';

describe('Persistence Manager Engine (Draft Sync)', () => {
  let mockStore = {};

  beforeEach(() => {
    mockStore = {};
    globalThis.window = {
      localStorage: {
        getItem: (k) => mockStore[k] || null,
        setItem: (k, v) => { mockStore[k] = String(v); },
        removeItem: (k) => { delete mockStore[k]; }
      }
    };
  });

  test('should return null when no draft is saved', () => {
    assert.equal(hasDraft(), false);
    assert.equal(loadDraft(), null);
  });

  test('should save and retrieve draft snapshot correctly', () => {
    const state = {
      templateId: 'astral_koi',
      zoom: 1.2,
      panX: 5,
      panY: -10,
      filter: 'cyber_flux',
      caption: 'ASTRAL',
      subtitle: 'Celestial flow',
      date: '2026.09'
    };

    const saved = saveDraft(state);
    assert.equal(saved, true);
    assert.equal(hasDraft(), true);

    const draft = loadDraft();
    assert.ok(draft);
    assert.equal(draft.templateId, 'astral_koi');
    assert.equal(draft.zoom, 1.2);
    assert.equal(draft.caption, 'ASTRAL');
    assert.ok(draft.savedAt > 0);
  });

  test('should clear draft correctly', () => {
    saveDraft({ templateId: 'fisheye' });
    assert.equal(hasDraft(), true);

    clearDraft();
    assert.equal(hasDraft(), false);
    assert.equal(loadDraft(), null);
  });

  test('should handle corrupted JSON gracefully and purge it', () => {
    mockStore['framera_studio_draft_v1'] = 'INVALID_JSON{{{';
    const draft = loadDraft();
    assert.equal(draft, null);
    assert.equal(hasDraft(), false);
  });

  test('should debounce draft saving and flush immediately when requested', async () => {
    saveDraftDebounced({ templateId: 'debounced_tpl', zoom: 1.5 }, 50);
    // Before flush, draft might not be stored yet
    flushPendingDraft();
    assert.equal(hasDraft(), true);
    const draft = loadDraft();
    assert.equal(draft?.templateId, 'debounced_tpl');
    assert.equal(draft?.zoom, 1.5);
  });
});
