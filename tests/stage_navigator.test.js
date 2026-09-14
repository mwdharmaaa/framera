import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  getAdjacentTemplate,
  updateTemplateIndicator,
  initStageNavigator
} from '../src/features/stage/stage_navigator.js';
import { initDefaultTemplates, listTemplates } from '../src/features/templates/template_registry.js';

describe('In-Stage Template Navigator Engine (Arrow Carousel)', () => {
  const mockTemplates = [
    { id: 'tpl_a', name: 'Template A' },
    { id: 'tpl_b', name: 'Template B' },
    { id: 'tpl_c', name: 'Template C' }
  ];

  it('should return null for empty or invalid template lists', () => {
    assert.strictEqual(getAdjacentTemplate('tpl_a', []), null);
    assert.strictEqual(getAdjacentTemplate('tpl_a', null), null);
  });

  it('should navigate forward cyclically', () => {
    const r1 = getAdjacentTemplate('tpl_a', mockTemplates, 1);
    assert.strictEqual(r1.template.id, 'tpl_b');
    assert.strictEqual(r1.index, 2);
    assert.strictEqual(r1.total, 3);

    const r2 = getAdjacentTemplate('tpl_b', mockTemplates, 1);
    assert.strictEqual(r2.template.id, 'tpl_c');
    assert.strictEqual(r2.index, 3);

    // Cyclic wrap to first
    const r3 = getAdjacentTemplate('tpl_c', mockTemplates, 1);
    assert.strictEqual(r3.template.id, 'tpl_a');
    assert.strictEqual(r3.index, 1);
  });

  it('should navigate backward cyclically', () => {
    // Cyclic wrap backward from first to last
    const r1 = getAdjacentTemplate('tpl_a', mockTemplates, -1);
    assert.strictEqual(r1.template.id, 'tpl_c');
    assert.strictEqual(r1.index, 3);

    const r2 = getAdjacentTemplate('tpl_c', mockTemplates, -1);
    assert.strictEqual(r2.template.id, 'tpl_b');
    assert.strictEqual(r2.index, 2);
  });

  it('should default to first template when currentId is not found', () => {
    const res = getAdjacentTemplate('unknown_id', mockTemplates, 1);
    assert.strictEqual(res.template.id, 'tpl_a');
    assert.strictEqual(res.index, 1);
  });

  it('should update template indicator elements accurately', () => {
    initDefaultTemplates();
    const nameEl = { textContent: '' };
    const counterEl = { textContent: '' };

    updateTemplateIndicator('focus_editorial', nameEl, counterEl);
    assert.strictEqual(nameEl.textContent, 'Focus Editorial Halftone');
    assert.ok(counterEl.textContent.startsWith('1 /'));
  });

  it('should bind arrow button click handlers and trigger template switch', () => {
    let switchedId = null;
    let prevListener = null;
    let nextListener = null;

    const prevBtn = {
      addEventListener: (event, fn) => { if (event === 'click') prevListener = fn; }
    };
    const nextBtn = {
      addEventListener: (event, fn) => { if (event === 'click') nextListener = fn; }
    };

    initDefaultTemplates();
    const all = listTemplates();

    initStageNavigator({
      prevBtn,
      nextBtn,
      getActiveTemplateId: () => all[0].id,
      onSwitchTemplate: (id) => { switchedId = id; }
    });

    assert.ok(prevListener);
    assert.ok(nextListener);

    // Click next -> switches to template 2
    nextListener({ stopPropagation: () => {} });
    assert.strictEqual(switchedId, all[1].id);

    // Click prev -> switches to template 17 (last)
    prevListener({ stopPropagation: () => {} });
    assert.strictEqual(switchedId, all[all.length - 1].id);
  });
});
