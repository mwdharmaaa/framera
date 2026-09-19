import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  TEMPLATE_REGISTRY,
  getTemplate,
  listTemplates,
  registerTemplate,
  clearTemplates,
  initDefaultTemplates
} from '../src/features/templates/template_registry.js';

describe('Dynamic Template Registry Engine', () => {
  beforeEach(() => {
    clearTemplates();
  });

  it('should start with an empty template list when no templates are registered', () => {
    assert.strictEqual(listTemplates().length, 0);
    assert.strictEqual(getTemplate('any_id'), null);
  });

  it('should register and retrieve a template successfully', () => {
    const mockTpl = {
      id: 'custom_ref_01',
      name: 'Custom Reference Frame',
      render: () => {}
    };

    registerTemplate(mockTpl);
    assert.strictEqual(listTemplates().length, 1);
    assert.strictEqual(getTemplate('custom_ref_01').name, 'Custom Reference Frame');
  });

  it('should reject invalid template registrations missing id or render', () => {
    assert.throws(() => registerTemplate(null), /valid id and render function/);
    assert.throws(() => registerTemplate({ id: 'test' }), /valid id and render function/);
    assert.throws(() => registerTemplate({ render: () => {} }), /valid id and render function/);
  });

  it('should clear all templates from registry', () => {
    registerTemplate({ id: 'a', render: () => {} });
    registerTemplate({ id: 'b', render: () => {} });
    assert.strictEqual(listTemplates().length, 2);

    clearTemplates();
    assert.strictEqual(listTemplates().length, 0);
  });

  it('should initialize default curated studio templates', () => {
    initDefaultTemplates();
    assert.strictEqual(listTemplates().length, 27);
    assert.ok(getTemplate('focus_editorial'));
    assert.ok(getTemplate('wincore'));
    assert.ok(getTemplate('cinema_poster'));
    assert.ok(getTemplate('astral_koi'));
    assert.ok(getTemplate('tokyo_brutalist'));
    assert.ok(getTemplate('instagram95'));
    assert.ok(getTemplate('ai_vision'));
    assert.ok(getTemplate('fisheye'));
    assert.ok(getTemplate('comic_portal'));
    assert.ok(getTemplate('folded_poster'));
    assert.ok(getTemplate('future_awaits'));
    assert.ok(getTemplate('eyes_trend'));
    assert.ok(getTemplate('final_girl'));
    assert.ok(getTemplate('vinyl_trio'));
    assert.ok(getTemplate('cyan_motion'));
    assert.ok(getTemplate('inverted_duet'));
    assert.ok(getTemplate('analog_tide'));
    assert.ok(getTemplate('ocean_vinyl_trio'));
    assert.ok(getTemplate('locker_playlist_trio'));
    assert.ok(getTemplate('impasto_oil_atelier'));
    assert.ok(getTemplate('ocean_stories_quad'));
    assert.ok(getTemplate('life_offline_trio'));
    assert.ok(getTemplate('golden_hour_hana'));
    assert.ok(getTemplate('memory_tree_deca'));
    assert.ok(getTemplate('ios_photosheet'));
    assert.ok(getTemplate('trip_to_hill'));
    assert.ok(getTemplate('meadow_patch_trio'));
  });
});
