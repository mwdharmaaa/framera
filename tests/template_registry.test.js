import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { TEMPLATE_REGISTRY, getTemplate, listTemplates } from '../src/features/templates/template_registry.js';

describe('Template Registry & Definition Tests', () => {
  it('should have 5 unique registered templates', () => {
    const list = listTemplates();
    assert.strictEqual(list.length, 5);
    const keys = Object.keys(TEMPLATE_REGISTRY);
    assert.ok(keys.includes('polaroid'));
    assert.ok(keys.includes('magazine'));
    assert.ok(keys.includes('cyber'));
    assert.ok(keys.includes('brutalist'));
    assert.ok(keys.includes('cinematic'));
  });

  it('each template should have valid config and render function', () => {
    listTemplates().forEach((tpl) => {
      assert.ok(tpl.id);
      assert.ok(tpl.name);
      assert.strictEqual(typeof tpl.render, 'function');
      assert.ok(tpl.config.canvasWidth > 0);
      assert.ok(tpl.config.canvasHeight > 0);
      assert.ok(tpl.config.frame.w > 0);
      assert.ok(tpl.config.frame.h > 0);
    });
  });

  it('should fallback gracefully to polaroid for invalid template id', () => {
    const tpl = getTemplate('non_existent_key');
    assert.strictEqual(tpl.id, 'polaroid');
  });
});
