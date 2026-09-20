import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { lifeQuadTemplate } from '../src/features/templates/life_quad_template.js';
import { getTemplate } from '../src/features/templates/template_registry.js';
import {
  LIFE_QUAD_SLOTS,
  drawRoundedSlit,
  renderQuadBackground,
  renderSlitPhoto
} from '../src/features/templates/life_quad_helpers.js';
import {
  render3DLetter,
  renderColumnSubtitle,
  renderQuadTypography
} from '../src/features/templates/life_quad_typography.js';

describe('Life Memories Quad Slits Template', () => {
  it('should have valid metadata and native 9:16 (736x1308) canvas configuration with 4 photos', () => {
    assert.strictEqual(lifeQuadTemplate.id, 'life_memories_quad');
    assert.strictEqual(lifeQuadTemplate.name, 'Life Memories Quad Slits');
    assert.strictEqual(lifeQuadTemplate.aspectRatio, '9:16');
    assert.strictEqual(lifeQuadTemplate.photoCount, 4);
    assert.strictEqual(lifeQuadTemplate.category, '4');
    assert.strictEqual(lifeQuadTemplate.config.canvasWidth, 736);
    assert.strictEqual(lifeQuadTemplate.config.canvasHeight, 1308);
    assert.strictEqual(LIFE_QUAD_SLOTS.length, 4);
  });

  it('should be registered in the global template registry', () => {
    const registered = getTemplate('life_memories_quad');
    assert.ok(registered, 'life_memories_quad should be registered in template registry');
    assert.strictEqual(registered.id, 'life_memories_quad');
    assert.strictEqual(registered.category, '4');
  });

  it('should define precise slot coordinates for all 4 vertical rounded slit windows', () => {
    const [c0, c1, c2, c3] = LIFE_QUAD_SLOTS;

    assert.strictEqual(c0.id, 0);
    assert.strictEqual(c0.x, 16);
    assert.strictEqual(c0.y, 16);
    assert.strictEqual(c0.w, 164);
    assert.strictEqual(c0.h, 1276);
    assert.strictEqual(c0.r, 24);

    assert.strictEqual(c1.id, 1);
    assert.strictEqual(c1.x, 196);
    assert.strictEqual(c1.y, 16);
    assert.strictEqual(c1.w, 164);
    assert.strictEqual(c1.h, 1276);
    assert.strictEqual(c1.r, 24);

    assert.strictEqual(c2.id, 2);
    assert.strictEqual(c2.x, 376);
    assert.strictEqual(c2.y, 16);
    assert.strictEqual(c2.w, 164);
    assert.strictEqual(c2.h, 1276);
    assert.strictEqual(c2.r, 24);

    assert.strictEqual(c3.id, 3);
    assert.strictEqual(c3.x, 556);
    assert.strictEqual(c3.y, 16);
    assert.strictEqual(c3.w, 164);
    assert.strictEqual(c3.h, 1276);
    assert.strictEqual(c3.r, 24);
  });

  it('should render safely with mock context in single, multi, and null photo configurations', () => {
    const createMockContext = () => ({
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      closePath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      quadraticCurveTo: () => {},
      rect: () => {},
      fillRect: () => {},
      stroke: () => {},
      fill: () => {},
      clip: () => {},
      drawImage: () => {},
      fillText: () => {},
      createLinearGradient: () => ({ addColorStop: () => {} })
    });

    const mockPhoto = { width: 800, height: 600, naturalWidth: 800, naturalHeight: 600 };
    const mockCtx = createMockContext();

    // 1. Single photo panorama fallback
    assert.doesNotThrow(() => {
      lifeQuadTemplate.render(mockCtx, mockPhoto, null, {
        caption: 'LIFE',
        subtitle: 'Is A Collection Of Memories!'
      });
    });

    // 2. 4-photo multi-photo array
    assert.doesNotThrow(() => {
      lifeQuadTemplate.render(mockCtx, null, null, {
        photoImgs: [mockPhoto, mockPhoto, mockPhoto, mockPhoto],
        isUserUploaded: true,
        caption: 'TRIP',
        subtitle: 'Days Spent In The Wild'
      });
    });

    // 3. Null photo graceful fallback
    assert.doesNotThrow(() => {
      lifeQuadTemplate.render(mockCtx, null, null, {});
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
      quadraticCurveTo: () => {},
      rect: () => {},
      fillRect: () => {},
      stroke: () => {},
      fill: () => {},
      clip: () => {},
      drawImage: () => {},
      fillText: () => {},
      createLinearGradient: () => ({ addColorStop: () => {} })
    });

    const mockCtx = createMockContext();
    const mockPhoto = { naturalWidth: 400, naturalHeight: 300 };

    assert.doesNotThrow(() => drawRoundedSlit(mockCtx, 16, 16, 164, 1276, 24));
    assert.doesNotThrow(() => renderQuadBackground(mockCtx, 736, 1308));
    assert.doesNotThrow(() => renderSlitPhoto(mockCtx, mockPhoto, LIFE_QUAD_SLOTS[0], false));
    assert.doesNotThrow(() => renderSlitPhoto(mockCtx, mockPhoto, LIFE_QUAD_SLOTS[0], true, { x: 16, y: 16, w: 704, h: 1276 }));
    assert.doesNotThrow(() => render3DLetter(mockCtx, 'L', 98, 106));
    assert.doesNotThrow(() => renderColumnSubtitle(mockCtx, 'Is A', 98, 181));
    assert.doesNotThrow(() => renderQuadTypography(mockCtx, LIFE_QUAD_SLOTS, { caption: 'LIFE', subtitle: 'Is A Collection Of Memories!' }));
  });
});
