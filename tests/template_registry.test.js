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

  it('should initialize default templates with focusEditorialTemplate and doodleShadowTemplate', () => {
    initDefaultTemplates();
    assert.strictEqual(listTemplates().length, 2);
    const tplFocus = getTemplate('focus_editorial');
    assert.ok(tplFocus);
    assert.strictEqual(tplFocus.id, 'focus_editorial');
    assert.strictEqual(typeof tplFocus.render, 'function');

    const tplDoodle = getTemplate('doodle_shadow');
    assert.ok(tplDoodle);
    assert.strictEqual(tplDoodle.id, 'doodle_shadow');
    assert.strictEqual(tplDoodle.name, 'Alter-Ego Doodle Shadow');
    assert.strictEqual(typeof tplDoodle.render, 'function');
  });
});
