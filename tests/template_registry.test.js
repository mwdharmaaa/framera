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
    assert.strictEqual(listTemplates().length, 46);
    assert.ok(getTemplate('red_cooked'));
    assert.ok(getTemplate('japan_travel_diary'));
    assert.ok(getTemplate('binder_clip_duo'));
    assert.ok(getTemplate('metropolis_story'));
    assert.ok(getTemplate('silver_gelatin_duo'));
    assert.ok(getTemplate('seaside_diptych'));
    assert.ok(getTemplate('leopard_duo'));
    assert.ok(getTemplate('the_sentimental'));
    assert.ok(getTemplate('midnight_formula'));
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
    assert.ok(getTemplate('imessage_cascade'));
    assert.ok(getTemplate('whatsapp_chat_trio'));
    assert.ok(getTemplate('ambient_duo_card'));
    assert.ok(getTemplate('photobooth_strip'));
    assert.ok(getTemplate('life_memories_quad'));
    assert.ok(getTemplate('ios_share_story'));
    assert.ok(getTemplate('kraken_eyes'));
    assert.ok(getTemplate('bnw_duo_prints'));
    assert.ok(getTemplate('bloom_alone'));
    assert.ok(getTemplate('jura_mountains_diary'));
  });

  it('should enforce all registered templates define rich tags array', () => {
    initDefaultTemplates();
    const templates = listTemplates();
    assert.ok(templates.length > 0);
    for (const tpl of templates) {
      assert.ok(
        Array.isArray(tpl.tags) && tpl.tags.length >= 2,
        `Template "${tpl.id}" (${tpl.name}) must have a tags array with at least 2 hashtags, got: ${JSON.stringify(tpl.tags)}`
      );
      tpl.tags.forEach((tag) => {
        assert.strictEqual(typeof tag, 'string');
        assert.ok(tag.length > 0);
        assert.ok(!tag.startsWith('#'), `Tag "${tag}" in "${tpl.id}" should not have leading #`);
      });
    }
  });
});
