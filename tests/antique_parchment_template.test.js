import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { antiqueParchmentTemplate } from '../src/features/templates/antique_parchment_template.js';
import {
  ANTIQUE_PARCHMENT_SLOT,
  DEFAULT_PARCHMENT_CONFIG,
  renderDarkBackdrop,
  clipDeckledParchment,
  renderVerticalCalligraphy
} from '../src/features/templates/antique_parchment_helpers.js';
import {
  renderParchmentBase,
  renderParchmentVignettes,
  renderMonochromeHero,
  renderVermilionChop
} from '../src/features/templates/antique_parchment_fx.js';
import { getTemplate } from '../src/features/templates/template_registry.js';

describe('Antique Parchment Template (3:4, 1-Photo BnW)', () => {
  it('should have valid metadata and 3:4 (1200x1600) canvas configuration in category 1', () => {
    assert.strictEqual(antiqueParchmentTemplate.id, 'antique_parchment');
    assert.strictEqual(antiqueParchmentTemplate.name, 'Antique Parchment');
    assert.strictEqual(antiqueParchmentTemplate.aspectRatio, '3:4');
    assert.strictEqual(antiqueParchmentTemplate.category, '1');
    assert.strictEqual(antiqueParchmentTemplate.photoCount, 1);
    assert.strictEqual(antiqueParchmentTemplate.config.canvasWidth, 1200);
    assert.strictEqual(antiqueParchmentTemplate.config.canvasHeight, 1600);
    assert.strictEqual(antiqueParchmentTemplate.previewImage, 'assets/antique_parchment_preview.png');
    assert.ok(Array.isArray(antiqueParchmentTemplate.tags));
    assert.ok(antiqueParchmentTemplate.tags.includes('bnw'));
    assert.ok(antiqueParchmentTemplate.tags.includes('vintage'));
    assert.ok(antiqueParchmentTemplate.tags.includes('parchment'));
    assert.ok(antiqueParchmentTemplate.tags.includes('washi'));
    assert.ok(antiqueParchmentTemplate.tags.includes('calligraphy'));
  });

  it('should be registered in the global template registry', () => {
    const reg = getTemplate('antique_parchment');
    assert.ok(reg);
    assert.strictEqual(reg.id, 'antique_parchment');
  });

  it('should define precise slot coordinates covering parchment interior', () => {
    assert.strictEqual(antiqueParchmentTemplate.slots.length, 1);
    assert.strictEqual(ANTIQUE_PARCHMENT_SLOT.id, 0);
    assert.strictEqual(ANTIQUE_PARCHMENT_SLOT.x, 38);
    assert.strictEqual(ANTIQUE_PARCHMENT_SLOT.y, 38);
    assert.strictEqual(ANTIQUE_PARCHMENT_SLOT.w, 1124);
    assert.strictEqual(ANTIQUE_PARCHMENT_SLOT.h, 1524);
  });

  it('should render safely with mock context in various configurations', () => {
    const mockCtx = {
      save() {},
      restore() {},
      beginPath() {},
      closePath() {},
      moveTo() {},
      lineTo() {},
      clip() {},
      fillRect() {},
      strokeRect() {},
      fillText() {},
      stroke() {},
      drawImage() {},
      createRadialGradient() {
        return { addColorStop() {} };
      },
      createLinearGradient() {
        return { addColorStop() {} };
      },
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      font: '',
      textAlign: '',
      textBaseline: '',
      shadowColor: '',
      shadowBlur: 0,
      globalCompositeOperation: '',
      globalAlpha: 1
    };

    const mockImg = {
      src: 'assets/antique_parchment_reference.png',
      width: 1200,
      height: 1600,
      naturalWidth: 1200,
      naturalHeight: 1600
    };

    // 1. Reference preview fallback
    assert.doesNotThrow(() => {
      antiqueParchmentTemplate.render(mockCtx, mockImg, null, { isUserUploaded: false });
    });

    // 2. User uploaded photo with default state
    assert.doesNotThrow(() => {
      antiqueParchmentTemplate.render(mockCtx, mockImg, null, { isUserUploaded: true });
    });

    // 3. User uploaded photo with custom state overrides
    assert.doesNotThrow(() => {
      antiqueParchmentTemplate.render(mockCtx, mockImg, null, {
        isUserUploaded: true,
        photoImg: mockImg,
        caption: '春风吹',
        zoom: 1.15,
        panX: 10,
        panY: -10
      });
    });

    // 4. Null photo fallback
    assert.doesNotThrow(() => {
      antiqueParchmentTemplate.render(mockCtx, null, null, { isUserUploaded: true });
    });
  });

  it('should execute helper drawing routines safely without throwing', () => {
    const mockCtx = {
      save() {},
      restore() {},
      beginPath() {},
      closePath() {},
      moveTo() {},
      lineTo() {},
      clip() {},
      fillRect() {},
      strokeRect() {},
      fillText() {},
      stroke() {},
      drawImage() {},
      createRadialGradient() {
        return { addColorStop() {} };
      },
      createLinearGradient() {
        return { addColorStop() {} };
      },
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      font: '',
      textAlign: '',
      textBaseline: '',
      shadowColor: '',
      shadowBlur: 0,
      globalCompositeOperation: '',
      globalAlpha: 1
    };

    assert.doesNotThrow(() => {
      renderDarkBackdrop(mockCtx, 1200, 1600);
      clipDeckledParchment(mockCtx, 1200, 1600);
      renderParchmentBase(mockCtx, 1200, 1600);
      renderParchmentVignettes(mockCtx, 1200, 1600);
      renderMonochromeHero(mockCtx, null, ANTIQUE_PARCHMENT_SLOT);
      renderMonochromeHero(mockCtx, { width: 800, height: 600 }, ANTIQUE_PARCHMENT_SLOT, { zoom: 1.2, panX: 5, panY: -5 });
      renderVerticalCalligraphy(mockCtx, '菲奥娜', 76, 110);
      renderVermilionChop(mockCtx, 56, 360, '印');
    });
  });

  it('should fallback from default FOCUS caption to traditional calligraphy', () => {
    const textCalls = [];
    const mockCtx = {
      save() {},
      restore() {},
      fillText(text, x, y) {
        textCalls.push({ text, x, y });
      },
      fillRect() {},
      strokeRect() {},
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      font: '',
      textAlign: '',
      textBaseline: '',
      shadowColor: '',
      shadowBlur: 0
    };

    renderVerticalCalligraphy(mockCtx, DEFAULT_PARCHMENT_CONFIG.caption, 76, 110);
    assert.strictEqual(textCalls.length, 3);
    assert.strictEqual(textCalls[0].text, '菲');
    assert.strictEqual(textCalls[1].text, '奥');
    assert.strictEqual(textCalls[2].text, '娜');
  });
});
