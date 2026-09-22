import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { silverGelatinTemplate } from '../src/features/templates/silver_gelatin_template.js';
import {
  SILVER_GELATIN_SLOTS,
  renderPaperBackdrop,
  renderPhotographicCard,
  renderPlaceholderText
} from '../src/features/templates/silver_gelatin_helpers.js';
import { getTemplate } from '../src/features/templates/template_registry.js';

describe('Silver Gelatin Analog Duo Template', () => {
  it('should have valid metadata and 9:16 (736x1308) canvas configuration with 2 photos in category 2', () => {
    assert.strictEqual(silverGelatinTemplate.id, 'silver_gelatin_duo');
    assert.strictEqual(silverGelatinTemplate.photoCount, 2);
    assert.strictEqual(silverGelatinTemplate.category, '2');
    assert.strictEqual(silverGelatinTemplate.aspectRatio, '9:16');
    assert.strictEqual(silverGelatinTemplate.config.canvasWidth, 736);
    assert.strictEqual(silverGelatinTemplate.config.canvasHeight, 1308);
    assert.ok(silverGelatinTemplate.name.includes('Silver Gelatin'));
    assert.ok(typeof silverGelatinTemplate.render === 'function');
  });

  it('should be registered in the global template registry', () => {
    const registered = getTemplate('silver_gelatin_duo');
    assert.ok(registered);
    assert.strictEqual(registered.id, 'silver_gelatin_duo');
  });

  it('should define 2 precise layout slot coordinates for vintage prints with inner photo margins', () => {
    assert.strictEqual(SILVER_GELATIN_SLOTS.length, 2);

    const top = SILVER_GELATIN_SLOTS[0];
    const bottom = SILVER_GELATIN_SLOTS[1];

    // Card frames
    assert.strictEqual(top.cardX, 32);
    assert.strictEqual(top.cardY, 170);
    assert.strictEqual(top.cardW, 672);
    assert.strictEqual(top.cardH, 450);

    assert.strictEqual(bottom.cardX, 32);
    assert.strictEqual(bottom.cardY, 658);
    assert.strictEqual(bottom.cardW, 672);
    assert.strictEqual(bottom.cardH, 450);

    // Inner photos (16px border inset)
    assert.strictEqual(top.x, 48);
    assert.strictEqual(top.y, 186);
    assert.strictEqual(top.w, 640);
    assert.strictEqual(top.h, 418);

    assert.strictEqual(bottom.x, 48);
    assert.strictEqual(bottom.y, 674);
    assert.strictEqual(bottom.w, 640);
    assert.strictEqual(bottom.h, 418);
  });

  it('should render safely with mock context in various photo configurations', () => {
    const mockCtx = {
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      rect: () => {},
      clip: () => {},
      fillRect: () => {},
      strokeRect: () => {},
      drawImage: () => {},
      moveTo: () => {},
      lineTo: () => {},
      stroke: () => {},
      fillText: () => {}
    };

    const mockImg = {
      src: 'assets/silver_gelatin_duo_reference.png',
      width: 736,
      height: 1308,
      naturalWidth: 736,
      naturalHeight: 1308
    };

    // 1. Reference preview fallback
    assert.doesNotThrow(() => {
      silverGelatinTemplate.render(mockCtx, mockImg, { drawX: 0, drawY: 0, drawW: 736, drawH: 1308 }, {
        isUserUploaded: false
      });
    });

    // 2. User uploaded 2 photos
    const photoA = { width: 1200, height: 800, naturalWidth: 1200, naturalHeight: 800 };
    const photoB = { width: 1000, height: 750, naturalWidth: 1000, naturalHeight: 750 };
    assert.doesNotThrow(() => {
      silverGelatinTemplate.render(mockCtx, null, {}, {
        isUserUploaded: true,
        photos: [photoA, photoB],
        slots: [
          { zoom: 1.1, panX: 5, panY: -10 },
          { zoom: 1.0, panX: 0, panY: 0 }
        ]
      });
    });

    // 3. Single photo fallback
    assert.doesNotThrow(() => {
      silverGelatinTemplate.render(mockCtx, null, {}, {
        isUserUploaded: true,
        photos: [photoA]
      });
    });

    // 4. Empty photos fallback
    assert.doesNotThrow(() => {
      silverGelatinTemplate.render(mockCtx, null, {}, {
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
      strokeRect: () => {},
      drawImage: () => {},
      moveTo: () => {},
      lineTo: () => {},
      stroke: () => {},
      fillText: () => {}
    };

    assert.doesNotThrow(() => {
      renderPaperBackdrop(mockCtx, 736, 1308);
    });

    assert.doesNotThrow(() => {
      renderPhotographicCard(mockCtx, null, SILVER_GELATIN_SLOTS[0], {}, true);
    });

    assert.doesNotThrow(() => {
      renderPlaceholderText(mockCtx, SILVER_GELATIN_SLOTS[1]);
    });
  });
});
