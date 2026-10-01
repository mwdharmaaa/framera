import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { sparkleCascadeTemplate } from '../src/features/templates/sparkle_cascade_template.js';
import { getTemplate } from '../src/features/templates/template_registry.js';
import {
  SPARKLE_CASCADE_SLOTS,
  SPARKLE_VINYL_CONFIG,
  renderSparkleAtmosphere,
  renderCascadeCard
} from '../src/features/templates/sparkle_cascade_helpers.js';
import {
  drawRoundedRect,
  drawVinylRecord
} from '../src/features/templates/sparkle_cascade_decorations.js';

describe('Sparkle Vinyl Cascade Trio 3-Photo Template', () => {
  it('should have valid metadata and native 9:16 (736x1308) canvas configuration with 3 photos', () => {
    assert.strictEqual(sparkleCascadeTemplate.id, 'sparkle_cascade_trio');
    assert.strictEqual(sparkleCascadeTemplate.name, 'Sparkle Vinyl Cascade Trio');
    assert.strictEqual(sparkleCascadeTemplate.aspectRatio, '9:16');
    assert.strictEqual(sparkleCascadeTemplate.photoCount, 3);
    assert.strictEqual(sparkleCascadeTemplate.category, '3');
    assert.strictEqual(sparkleCascadeTemplate.config.canvasWidth, 736);
    assert.strictEqual(sparkleCascadeTemplate.config.canvasHeight, 1308);
    assert.ok(Array.isArray(sparkleCascadeTemplate.tags));
    assert.ok(sparkleCascadeTemplate.tags.includes('vinyl'));
    assert.ok(sparkleCascadeTemplate.tags.includes('cascade'));
    assert.strictEqual(SPARKLE_CASCADE_SLOTS.length, 3);
  });

  it('should be registered in the global template registry', () => {
    const registered = getTemplate('sparkle_cascade_trio');
    assert.ok(registered, 'sparkle_cascade_trio should be registered in template registry');
    assert.strictEqual(registered.id, 'sparkle_cascade_trio');
    assert.strictEqual(registered.category, '3');
  });

  it('should define precise slot coordinates matching the cascading composition', () => {
    const [card0, card1, card2] = SPARKLE_CASCADE_SLOTS;

    // Slot 0 (Top-Left)
    assert.strictEqual(card0.id, 0);
    assert.strictEqual(card0.x, 24);
    assert.strictEqual(card0.y, 102);
    assert.strictEqual(card0.w, 364);
    assert.strictEqual(card0.h, 484);
    assert.strictEqual(card0.r, 18);

    // Slot 1 (Middle-Center)
    assert.strictEqual(card1.id, 1);
    assert.strictEqual(card1.x, 134);
    assert.strictEqual(card1.y, 462);
    assert.strictEqual(card1.w, 424);
    assert.strictEqual(card1.h, 320);
    assert.strictEqual(card1.r, 18);

    // Slot 2 (Bottom-Right)
    assert.strictEqual(card2.id, 2);
    assert.strictEqual(card2.x, 322);
    assert.strictEqual(card2.y, 742);
    assert.strictEqual(card2.w, 384);
    assert.strictEqual(card2.h, 510);
    assert.strictEqual(card2.r, 18);

    // Vinyl Config
    assert.strictEqual(SPARKLE_VINYL_CONFIG.cx, 586);
    assert.strictEqual(SPARKLE_VINYL_CONFIG.cy, 254);
    assert.strictEqual(SPARKLE_VINYL_CONFIG.radius, 82);
  });

  it('should render safely with mock context in various photo configurations', () => {
    const mockCtx = {
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      closePath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      quadraticCurveTo: () => {},
      rect: () => {},
      roundRect: () => {},
      ellipse: () => {},
      arc: () => {},
      clip: () => {},
      fill: () => {},
      stroke: () => {},
      fillRect: () => {},
      strokeRect: () => {},
      fillText: () => {},
      drawImage: () => {},
      createLinearGradient: () => ({ addColorStop: () => {} }),
      createRadialGradient: () => ({ addColorStop: () => {} }),
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      font: '',
      textAlign: '',
      textBaseline: '',
      shadowColor: '',
      shadowBlur: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      filter: 'none'
    };

    const mockBounds = { drawX: 0, drawY: 0, drawW: 736, drawH: 1308 };
    const mockImg1 = { width: 800, height: 600, naturalWidth: 800, naturalHeight: 600 };
    const mockImg2 = { width: 600, height: 800, naturalWidth: 600, naturalHeight: 800 };
    const mockImg3 = { width: 900, height: 900, naturalWidth: 900, naturalHeight: 900 };

    // 1. Reference preview fallback
    assert.doesNotThrow(() => {
      sparkleCascadeTemplate.render(mockCtx, { src: 'assets/sparkle_cascade_reference.jpg' }, mockBounds, {});
    });

    // 2. Single photo render
    assert.doesNotThrow(() => {
      sparkleCascadeTemplate.render(mockCtx, mockImg1, mockBounds, {
        isUserUploaded: true,
        photoImg: mockImg1,
        caption: 'Sparkle',
        subtitle: 'Jesse Barrera'
      });
    });

    // 3. 2 photos array
    assert.doesNotThrow(() => {
      sparkleCascadeTemplate.render(mockCtx, mockImg1, mockBounds, {
        isUserUploaded: true,
        photoImgs: [mockImg1, mockImg2]
      });
    });

    // 4. Full 3 photos array with slot framings
    assert.doesNotThrow(() => {
      sparkleCascadeTemplate.render(mockCtx, mockImg1, mockBounds, {
        isUserUploaded: true,
        photoImgs: [mockImg1, mockImg2, mockImg3],
        slotFramings: [
          { zoom: 1.1, panX: 10, panY: 0 },
          { zoom: 1.0, panX: 0, panY: -5 },
          { zoom: 1.2, panX: -10, panY: 5 }
        ],
        caption: 'Custom Track',
        subtitle: 'Custom Artist'
      });
    });
  });

  it('should execute helper and decoration routines safely without throwing', () => {
    const mockCtx = {
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      closePath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      quadraticCurveTo: () => {},
      rect: () => {},
      arc: () => {},
      clip: () => {},
      fill: () => {},
      stroke: () => {},
      fillRect: () => {},
      fillText: () => {},
      drawImage: () => {},
      createLinearGradient: () => ({ addColorStop: () => {} }),
      createRadialGradient: () => ({ addColorStop: () => {} }),
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      font: '',
      textAlign: '',
      shadowColor: '',
      shadowBlur: 0,
      shadowOffsetY: 0,
      filter: 'none'
    };

    assert.doesNotThrow(() => {
      renderSparkleAtmosphere(mockCtx, null, 736, 1308);
      renderSparkleAtmosphere(mockCtx, { width: 400, height: 600 }, 736, 1308);
      renderCascadeCard(mockCtx, null, SPARKLE_CASCADE_SLOTS[0]);
      renderCascadeCard(mockCtx, { width: 500, height: 500 }, SPARKLE_CASCADE_SLOTS[1], { zoom: 1.1 });
      drawVinylRecord(mockCtx, 586, 254, 82, null, 'Track', 'Artist');
      drawVinylRecord(mockCtx, 586, 254, 82, { width: 100, height: 100 }, 'Track', 'Artist');
      drawRoundedRect(mockCtx, 10, 10, 100, 100, 12);
    });
  });
});
