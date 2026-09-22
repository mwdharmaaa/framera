import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { seasideDiptychTemplate } from '../src/features/templates/seaside_diptych_template.js';
import {
  SEASIDE_DIPTYCH_SLOTS,
  SEASIDE_DIVIDER_BAR,
  renderSlotPhoto,
  renderWhiteDivider,
  renderPlaceholderText
} from '../src/features/templates/seaside_diptych_helpers.js';
import { getTemplate } from '../src/features/templates/template_registry.js';

describe('Seaside Minimal Diptych Template', () => {
  it('should have valid metadata and 4:5 (736x920) canvas configuration with 2 photos in category 2', () => {
    assert.strictEqual(seasideDiptychTemplate.id, 'seaside_diptych');
    assert.strictEqual(seasideDiptychTemplate.photoCount, 2);
    assert.strictEqual(seasideDiptychTemplate.category, '2');
    assert.strictEqual(seasideDiptychTemplate.aspectRatio, '4:5');
    assert.strictEqual(seasideDiptychTemplate.config.canvasWidth, 736);
    assert.strictEqual(seasideDiptychTemplate.config.canvasHeight, 920);
    assert.ok(seasideDiptychTemplate.name.includes('Seaside Minimal Diptych'));
    assert.ok(typeof seasideDiptychTemplate.render === 'function');
  });

  it('should be registered in the global template registry', () => {
    const registered = getTemplate('seaside_diptych');
    assert.ok(registered);
    assert.strictEqual(registered.id, 'seaside_diptych');
  });

  it('should define 2 precise layout slot coordinates matching the 4:5 split composition', () => {
    assert.strictEqual(SEASIDE_DIPTYCH_SLOTS.length, 2);

    const topSlot = SEASIDE_DIPTYCH_SLOTS[0];
    const bottomSlot = SEASIDE_DIPTYCH_SLOTS[1];

    assert.strictEqual(topSlot.x, 0);
    assert.strictEqual(topSlot.y, 0);
    assert.strictEqual(topSlot.w, 736);
    assert.strictEqual(topSlot.h, 448);

    assert.strictEqual(bottomSlot.x, 0);
    assert.strictEqual(bottomSlot.y, 490);
    assert.strictEqual(bottomSlot.w, 736);
    assert.strictEqual(bottomSlot.h, 430);

    assert.strictEqual(SEASIDE_DIVIDER_BAR.x, 0);
    assert.strictEqual(SEASIDE_DIVIDER_BAR.y, 448);
    assert.strictEqual(SEASIDE_DIVIDER_BAR.w, 736);
    assert.strictEqual(SEASIDE_DIVIDER_BAR.h, 42);
  });

  it('should render safely with mock context in various photo configurations', () => {
    const mockCtx = {
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      rect: () => {},
      clip: () => {},
      fillRect: () => {},
      drawImage: () => {},
      fillText: () => {}
    };

    const mockImg = {
      src: 'assets/seaside_diptych_reference.png',
      width: 736,
      height: 920,
      naturalWidth: 736,
      naturalHeight: 920
    };

    // 1. Reference preview fallback
    assert.doesNotThrow(() => {
      seasideDiptychTemplate.render(mockCtx, mockImg, { drawX: 0, drawY: 0, drawW: 736, drawH: 920 }, {
        isUserUploaded: false
      });
    });

    // 2. User uploaded with 2 photos
    const photoA = { width: 800, height: 600, naturalWidth: 800, naturalHeight: 600 };
    const photoB = { width: 1200, height: 800, naturalWidth: 1200, naturalHeight: 800 };
    assert.doesNotThrow(() => {
      seasideDiptychTemplate.render(mockCtx, null, {}, {
        isUserUploaded: true,
        photos: [photoA, photoB],
        slots: [
          { zoom: 1.2, panX: 10, panY: -5 },
          { zoom: 1.0, panX: 0, panY: 0 }
        ]
      });
    });

    // 3. Single photo fallback
    assert.doesNotThrow(() => {
      seasideDiptychTemplate.render(mockCtx, null, {}, {
        isUserUploaded: true,
        photos: [photoA]
      });
    });

    // 4. Fallback when photos array is empty
    assert.doesNotThrow(() => {
      seasideDiptychTemplate.render(mockCtx, null, {}, {
        isUserUploaded: true,
        photos: []
      });
    });
  });

  it('should execute helper routines safely without throwing', () => {
    const mockCtx = {
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      rect: () => {},
      clip: () => {},
      fillRect: () => {},
      drawImage: () => {},
      fillText: () => {}
    };

    assert.doesNotThrow(() => {
      renderWhiteDivider(mockCtx, 736, 920);
    });

    assert.doesNotThrow(() => {
      renderSlotPhoto(mockCtx, null, SEASIDE_DIPTYCH_SLOTS[0]);
    });

    assert.doesNotThrow(() => {
      renderPlaceholderText(mockCtx, SEASIDE_DIPTYCH_SLOTS[1]);
    });
  });
});
