import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ambientDuoTemplate } from '../src/features/templates/ambient_duo_template.js';
import { getTemplate } from '../src/features/templates/template_registry.js';
import {
  AMBIENT_DUO_SLOTS,
  drawRoundedRect,
  renderDarkenedBackdrop,
  renderFloatingCard,
  drawSpotifyBadge
} from '../src/features/templates/ambient_duo_helpers.js';
import {
  drawHeadphones,
  drawFingerprintHeart,
  drawSparkleStars
} from '../src/features/templates/ambient_duo_decorations.js';

describe('Ambient Headphone Duo Card Template', () => {
  it('should have valid metadata and native 9:16 (736x1308) canvas configuration with 2 photos', () => {
    assert.strictEqual(ambientDuoTemplate.id, 'ambient_duo_card');
    assert.strictEqual(ambientDuoTemplate.name, 'Ambient Headphone Duo Card');
    assert.strictEqual(ambientDuoTemplate.aspectRatio, '9:16');
    assert.strictEqual(ambientDuoTemplate.photoCount, 2);
    assert.strictEqual(ambientDuoTemplate.category, '2');
    assert.strictEqual(ambientDuoTemplate.config.canvasWidth, 736);
    assert.strictEqual(ambientDuoTemplate.config.canvasHeight, 1308);
    assert.strictEqual(AMBIENT_DUO_SLOTS.length, 2);
  });

  it('should be registered in the global template registry', () => {
    const registered = getTemplate('ambient_duo_card');
    assert.ok(registered, 'ambient_duo_card should be registered in template registry');
    assert.strictEqual(registered.id, 'ambient_duo_card');
    assert.strictEqual(registered.category, '2');
  });

  it('should define precise slot coordinates for backdrop and floating card', () => {
    const [backdropSlot, cardSlot] = AMBIENT_DUO_SLOTS;

    assert.strictEqual(backdropSlot.id, 0);
    assert.strictEqual(backdropSlot.w, 736);
    assert.strictEqual(backdropSlot.h, 1308);

    assert.strictEqual(cardSlot.id, 1);
    assert.strictEqual(cardSlot.w, 460);
    assert.strictEqual(cardSlot.h, 320);
    assert.strictEqual(cardSlot.r, 18);
  });

  it('should render safely with mock context in various photo configurations', () => {
    const createMockContext = () => ({
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      closePath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      arc: () => {},
      rect: () => {},
      strokeRect: () => {},
      fillRect: () => {},
      stroke: () => {},
      fill: () => {},
      clip: () => {},
      drawImage: () => {},
      fillText: () => {},
      rotate: () => {},
      translate: () => {},
      setLineDash: () => {},
      bezierCurveTo: () => {},
      quadraticCurveTo: () => {},
      createLinearGradient: () => ({
        addColorStop: () => {}
      })
    });

    const mockPhoto = { width: 800, height: 600, naturalWidth: 800, naturalHeight: 600 };
    const mockCtx = createMockContext();

    // 1. Single photo fallback
    assert.doesNotThrow(() => {
      ambientDuoTemplate.render(mockCtx, mockPhoto, null, {
        caption: 'Spotify'
      });
    });

    // 2. 2-photo array
    assert.doesNotThrow(() => {
      ambientDuoTemplate.render(mockCtx, null, null, {
        photoImgs: [mockPhoto, mockPhoto],
        isUserUploaded: true,
        caption: 'Spotify'
      });
    });

    // 3. Null photo graceful fallback
    assert.doesNotThrow(() => {
      ambientDuoTemplate.render(mockCtx, null, null, {});
    });
  });

  it('should execute helper drawing routines safely without throwing', () => {
    const createMockContext = () => ({
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      closePath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      arc: () => {},
      rect: () => {},
      fillRect: () => {},
      stroke: () => {},
      fill: () => {},
      clip: () => {},
      drawImage: () => {},
      fillText: () => {},
      rotate: () => {},
      translate: () => {},
      setLineDash: () => {},
      bezierCurveTo: () => {},
      quadraticCurveTo: () => {},
      createLinearGradient: () => ({ addColorStop: () => {} })
    });

    const mockCtx = createMockContext();
    const mockPhoto = { naturalWidth: 400, naturalHeight: 300 };

    assert.doesNotThrow(() => drawRoundedRect(mockCtx, 10, 10, 100, 100, 10));
    assert.doesNotThrow(() => renderDarkenedBackdrop(mockCtx, mockPhoto, 736, 1308));
    assert.doesNotThrow(() => renderFloatingCard(mockCtx, mockPhoto, AMBIENT_DUO_SLOTS[1], 'Spotify'));
    assert.doesNotThrow(() => drawSpotifyBadge(mockCtx, 100, 100, 'Spotify'));
    assert.doesNotThrow(() => drawHeadphones(mockCtx, 585, 475));
    assert.doesNotThrow(() => drawFingerprintHeart(mockCtx, 110, 840));
    assert.doesNotThrow(() => drawSparkleStars(mockCtx, 600, 835));
  });
});
