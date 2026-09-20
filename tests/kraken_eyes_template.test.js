import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { krakenEyesTemplate } from '../src/features/templates/kraken_eyes_template.js';
import { getTemplate } from '../src/features/templates/template_registry.js';
import {
  KRAKEN_EYES_SLOTS,
  renderNoirBackground,
  renderSlitPhoto,
  renderSlitTypography
} from '../src/features/templates/kraken_eyes_helpers.js';
import {
  drawSuctionCup,
  drawTopTentacle,
  drawBottomTentacle,
  drawFloatingPetals
} from '../src/features/templates/kraken_eyes_decorations.js';

describe('Kraken Eyes Abyssal Slit 1-Photo Template', () => {
  it('should have valid metadata and native 9:16 (736x1308) canvas configuration with 1 photo', () => {
    assert.strictEqual(krakenEyesTemplate.id, 'kraken_eyes');
    assert.strictEqual(krakenEyesTemplate.name, 'Kraken Eyes Abyssal Slit');
    assert.strictEqual(krakenEyesTemplate.aspectRatio, '9:16');
    assert.strictEqual(krakenEyesTemplate.photoCount, 1);
    assert.strictEqual(krakenEyesTemplate.category, '1');
    assert.strictEqual(krakenEyesTemplate.config.canvasWidth, 736);
    assert.strictEqual(krakenEyesTemplate.config.canvasHeight, 1308);
    assert.deepStrictEqual(krakenEyesTemplate.config.frame, { x: 0, y: 485, w: 736, h: 374 });
    assert.strictEqual(KRAKEN_EYES_SLOTS.length, 1);
  });

  it('should be registered in the global template registry', () => {
    const registered = getTemplate('kraken_eyes');
    assert.ok(registered, 'kraken_eyes should be registered in template registry');
    assert.strictEqual(registered.id, 'kraken_eyes');
    assert.strictEqual(registered.category, '1');
  });

  it('should define precise slot coordinates for eye slit letterbox window', () => {
    const [slit] = KRAKEN_EYES_SLOTS;
    assert.strictEqual(slit.id, 0);
    assert.strictEqual(slit.x, 0);
    assert.strictEqual(slit.y, 485);
    assert.strictEqual(slit.w, 736);
    assert.strictEqual(slit.h, 374);
  });

  it('should render safely with mock context without throwing', () => {
    const mockCtx = {
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      closePath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      rect: () => {},
      clip: () => {},
      fill: () => {},
      stroke: () => {},
      fillRect: () => {},
      strokeRect: () => {},
      fillText: () => {},
      drawImage: () => {},
      translate: () => {},
      rotate: () => {},
      ellipse: () => {},
      bezierCurveTo: () => {},
      createRadialGradient: () => ({ addColorStop: () => {} }),
      createLinearGradient: () => ({ addColorStop: () => {} }),
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      font: '',
      textAlign: '',
      textBaseline: '',
      letterSpacing: '',
      lineCap: '',
      lineJoin: '',
      shadowColor: '',
      shadowBlur: 0,
      shadowOffsetY: 0
    };

    const mockBounds = { drawX: 0, drawY: 485, drawW: 736, drawH: 374 };
    const mockImg = { width: 800, height: 600, src: 'assets/user_samples/photo_rocky_tide.jpg' };

    // Reference preview render
    assert.doesNotThrow(() => {
      krakenEyesTemplate.render(mockCtx, { src: 'assets/kraken_eyes_reference.jpg' }, mockBounds, {});
    });

    // Custom user photo render
    assert.doesNotThrow(() => {
      krakenEyesTemplate.render(mockCtx, mockImg, mockBounds, {
        isUserUploaded: true,
        caption: 'ABYSSAL EYES',
        subtitle: 'The Deep Horizon',
        date: '2026 // SLIT'
      });
    });

    // Empty state render
    assert.doesNotThrow(() => {
      krakenEyesTemplate.render(mockCtx, null, mockBounds, {});
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
      rect: () => {},
      clip: () => {},
      fill: () => {},
      stroke: () => {},
      fillRect: () => {},
      fillText: () => {},
      drawImage: () => {},
      translate: () => {},
      rotate: () => {},
      ellipse: () => {},
      bezierCurveTo: () => {},
      createRadialGradient: () => ({ addColorStop: () => {} }),
      createLinearGradient: () => ({ addColorStop: () => {} })
    };

    assert.doesNotThrow(() => renderNoirBackground(mockCtx, 736, 1308));
    assert.doesNotThrow(() => renderSlitPhoto(mockCtx, { width: 100, height: 100 }, KRAKEN_EYES_SLOTS[0]));
    assert.doesNotThrow(() => renderSlitTypography(mockCtx, {}, 736, 1308));
    assert.doesNotThrow(() => drawSuctionCup(mockCtx, 100, 100, 10, 15, 0.2));
    assert.doesNotThrow(() => drawTopTentacle(mockCtx));
    assert.doesNotThrow(() => drawBottomTentacle(mockCtx));
    assert.doesNotThrow(() => drawFloatingPetals(mockCtx));
  });
});
