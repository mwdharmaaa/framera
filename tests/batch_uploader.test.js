import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  filterImageFiles,
  planSlotDistribution,
  processBatchUpload
} from '../src/features/slots/batch_uploader.js';
import { registerTemplate, clearTemplates } from '../src/features/templates/template_registry.js';

describe('Batch Uploader & Smart Slot Auto-Fill Engine', () => {
  it('should filter only valid image files from list', () => {
    const mockFiles = [
      { name: 'photo1.jpg', type: 'image/jpeg' },
      { name: 'doc.pdf', type: 'application/pdf' },
      { name: 'photo2.png', type: 'image/png' },
      { name: 'notes.txt', type: 'text/plain' },
      null,
      undefined
    ];

    const filtered = filterImageFiles(mockFiles);
    assert.strictEqual(filtered.length, 2);
    assert.strictEqual(filtered[0].name, 'photo1.jpg');
    assert.strictEqual(filtered[1].name, 'photo2.png');
  });

  it('should plan single file assignment to target active slot', () => {
    const singleFile = [{ name: 'single.jpg', type: 'image/jpeg' }];
    const plan = planSlotDistribution(singleFile, 3, 1);

    assert.deepStrictEqual(plan.assignedIndices, [1]);
    assert.strictEqual(plan.overflowCount, 0);
    assert.strictEqual(plan.message, 'Assigned to Slot 2 of 3');
  });

  it('should plan multi-file batch auto-fill sequentially across slots', () => {
    const files = [
      { name: '1.jpg', type: 'image/jpeg' },
      { name: '2.jpg', type: 'image/jpeg' },
      { name: '3.jpg', type: 'image/jpeg' }
    ];
    const plan = planSlotDistribution(files, 3, 0);

    assert.deepStrictEqual(plan.assignedIndices, [0, 1, 2]);
    assert.strictEqual(plan.overflowCount, 0);
    assert.strictEqual(plan.message, 'Auto-filled 3 of 3 slots');
  });

  it('should plan multi-file batch with overflow gracefully', () => {
    const files = [
      { name: '1.jpg', type: 'image/jpeg' },
      { name: '2.jpg', type: 'image/jpeg' },
      { name: '3.jpg', type: 'image/jpeg' },
      { name: '4.jpg', type: 'image/jpeg' }
    ];
    const plan = planSlotDistribution(files, 2, 0);

    assert.deepStrictEqual(plan.assignedIndices, [0, 1]);
    assert.strictEqual(plan.overflowCount, 2);
    assert.strictEqual(plan.message, 'Auto-filled 2 of 2 slots (2 excess photos ignored)');
  });

  it('should process batch upload into updated slot state with template registry', async () => {
    clearTemplates();
    registerTemplate({
      id: 'mock_trio',
      name: 'Mock Trio',
      photoCount: 3,
      tags: ['trio'],
      render: () => {}
    });

    const mockFiles = [
      { name: 'a.jpg', type: 'image/jpeg' },
      { name: 'b.jpg', type: 'image/jpeg' }
    ];

    const mockFileLoader = async (file) => ({
      img: { width: 800, height: 600, name: file.name },
      dataUrl: `data:image/jpeg;base64,${file.name}`
    });

    const currentState = {
      templateId: 'mock_trio',
      activeSlotIndex: 0,
      slots: [],
      photoImgs: []
    };

    const result = await processBatchUpload(mockFiles, currentState, mockFileLoader);
    assert.ok(result);
    assert.strictEqual(result.slots.length, 3);
    assert.strictEqual(result.photos.length, 3);
    assert.strictEqual(result.message, 'Auto-filled 2 of 3 slots');
  });
});
