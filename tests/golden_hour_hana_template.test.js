import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { goldenHourHanaTemplate } from '../src/features/templates/golden_hour_hana_template.js';
import { getTemplate } from '../src/features/templates/template_registry.js';
import {
  HANA_SUNSET_SLOTS,
  renderWarmSlotPhoto,
  renderHanaMusicPlayer,
  renderDarkBotanicalBase
} from '../src/features/templates/golden_hour_hana_helpers.js';

describe('Golden Hour Hana Quad Template', () => {
  it('should have valid metadata and native 9:16 (736x1308) canvas configuration with 4 photos', () => {
    assert.strictEqual(goldenHourHanaTemplate.id, 'golden_hour_hana');
    assert.strictEqual(goldenHourHanaTemplate.name, 'Golden Hour Hana Quad');
    assert.strictEqual(goldenHourHanaTemplate.aspectRatio, '9:16');
    assert.strictEqual(goldenHourHanaTemplate.photoCount, 4);
    assert.strictEqual(goldenHourHanaTemplate.category, '4');
    assert.strictEqual(goldenHourHanaTemplate.config.canvasWidth, 736);
    assert.strictEqual(goldenHourHanaTemplate.config.canvasHeight, 1308);
    assert.strictEqual(HANA_SUNSET_SLOTS.length, 4);
  });

  it('should be registered in the global template registry', () => {
    const registered = getTemplate('golden_hour_hana');
    assert.ok(registered, 'golden_hour_hana should be registered');
    assert.strictEqual(registered.id, 'golden_hour_hana');
    assert.strictEqual(registered.category, '4');
  });

  it('should have 4 precise coordinates for sunset photo slots', () => {
    const [s0, s1, s2, s3] = HANA_SUNSET_SLOTS;

    // Top Horizon banner
    assert.strictEqual(s0.id, 0);
    assert.strictEqual(s0.x, 55);
    assert.strictEqual(s0.y, 150);
    assert.strictEqual(s0.w, 636);
    assert.strictEqual(s0.h, 355);

    // Middle Right detail
    assert.strictEqual(s1.id, 1);
    assert.strictEqual(s1.x, 356);
    assert.strictEqual(s1.y, 505);
    assert.strictEqual(s1.w, 340);
    assert.strictEqual(s1.h, 275);

    // Bottom Left eyes focus
    assert.strictEqual(s2.id, 2);
    assert.strictEqual(s2.x, 58);
    assert.strictEqual(s2.y, 685);
    assert.strictEqual(s2.w, 298);
    assert.strictEqual(s2.h, 300);

    // Bottom Right golden portrait
    assert.strictEqual(s3.id, 3);
    assert.strictEqual(s3.x, 230);
    assert.strictEqual(s3.y, 780);
    assert.strictEqual(s3.w, 506);
    assert.strictEqual(s3.h, 366);
  });

  it('should render safely with mock context in various photo configurations', () => {
    const mockCtx = {
      save() {},
      restore() {},
      fillRect() {},
      strokeRect() {},
      beginPath() {},
      rect() {},
      roundRect() {},
      fill() {},
      stroke() {},
      clip() {},
      drawImage() {},
      fillText() {},
      createLinearGradient() {
        return { addColorStop() {} };
      },
      font: '',
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      shadowColor: '',
      shadowBlur: 0,
      shadowOffsetY: 0,
      textAlign: '',
      textBaseline: '',
      filter: 'none',
      globalCompositeOperation: 'source-over'
    };

    const mockImg = {
      src: 'assets/golden_hour_hana_reference.jpg',
      naturalWidth: 736,
      naturalHeight: 1308,
      width: 736,
      height: 1308
    };

    // 1. Initial preset reference mode
    assert.doesNotThrow(() => {
      goldenHourHanaTemplate.render(mockCtx, mockImg, {}, { isUserUploaded: false });
    });

    // 2. Full 4-photo user uploaded state
    const photos4 = [
      { width: 800, height: 600 },
      { width: 800, height: 600 },
      { width: 800, height: 600 },
      { width: 800, height: 600 }
    ];
    assert.doesNotThrow(() => {
      goldenHourHanaTemplate.render(mockCtx, photos4[0], {}, {
        isUserUploaded: true,
        photoImgs: photos4,
        caption: 'Hana',
        subtitle: 'Fujii Kaze',
        date: '00:23 / 02:39'
      });
    });

    // 3. Fallbacks for 3, 2, 1, and 0 photos
    assert.doesNotThrow(() => {
      goldenHourHanaTemplate.render(mockCtx, photos4[0], {}, {
        isUserUploaded: true,
        photoImgs: [photos4[0], photos4[1], photos4[2]]
      });
      goldenHourHanaTemplate.render(mockCtx, photos4[0], {}, {
        isUserUploaded: true,
        photoImgs: [photos4[0], photos4[1]]
      });
      goldenHourHanaTemplate.render(mockCtx, photos4[0], {}, {
        isUserUploaded: true,
        photoImgs: [photos4[0]]
      });
      goldenHourHanaTemplate.render(mockCtx, null, {}, {
        isUserUploaded: true,
        photoImgs: []
      });
    });
  });

  it('should execute helper routines safely without throwing', () => {
    const mockCtx = {
      save() {},
      restore() {},
      fillRect() {},
      strokeRect() {},
      beginPath() {},
      rect() {},
      roundRect() {},
      fill() {},
      stroke() {},
      clip() {},
      drawImage() {},
      fillText() {},
      createLinearGradient() {
        return { addColorStop() {} };
      }
    };

    const photo = { naturalWidth: 800, naturalHeight: 600, width: 800, height: 600 };
    const slot = HANA_SUNSET_SLOTS[0];

    assert.doesNotThrow(() => {
      renderWarmSlotPhoto(mockCtx, photo, slot);
      renderWarmSlotPhoto(null, photo, slot);
      renderHanaMusicPlayer(mockCtx, { caption: 'Hana', subtitle: 'Fujii Kaze' });
      renderHanaMusicPlayer(mockCtx, {});
      renderHanaMusicPlayer(null, {});
      renderDarkBotanicalBase(mockCtx, 736, 1308);
      renderDarkBotanicalBase(null, 736, 1308);
    });
  });
});
