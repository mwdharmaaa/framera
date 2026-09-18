import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { oceanStoriesTemplate } from '../src/features/templates/ocean_stories_template.js';
import {
  STORY_CARD_SLOTS,
  renderStoryBackground,
  renderStoryCard,
  drawStoryDetails,
  getOceanStoryBackgroundImage,
  resetOceanStoryBackgroundImage
} from '../src/features/templates/ocean_stories_helpers.js';
import { getTemplate } from '../src/features/templates/template_registry.js';

describe('Ocean Stories Quad Template', () => {
  it('should have valid metadata and native 9:16 (736x1308) canvas configuration with 4 photos', () => {
    assert.strictEqual(oceanStoriesTemplate.id, 'ocean_stories_quad');
    assert.strictEqual(oceanStoriesTemplate.name, 'Ocean Stories Quad');
    assert.strictEqual(oceanStoriesTemplate.aspectRatio, '9:16');
    assert.strictEqual(oceanStoriesTemplate.photoCount, 4);
    assert.strictEqual(oceanStoriesTemplate.category, '4');
    assert.strictEqual(oceanStoriesTemplate.config.canvasWidth, 736);
    assert.strictEqual(oceanStoriesTemplate.config.canvasHeight, 1308);
    assert.strictEqual(typeof oceanStoriesTemplate.render, 'function');
  });

  it('should be registered in the global template registry', () => {
    const tpl = getTemplate('ocean_stories_quad');
    assert.ok(tpl, 'Template should exist in registry');
    assert.strictEqual(tpl.id, 'ocean_stories_quad');
  });

  it('should have 3 precise card slot coordinates', () => {
    assert.strictEqual(STORY_CARD_SLOTS.length, 3);
    assert.strictEqual(STORY_CARD_SLOTS[0].y, 171);
    assert.strictEqual(STORY_CARD_SLOTS[1].y, 505);
    assert.strictEqual(STORY_CARD_SLOTS[2].y, 845);
    STORY_CARD_SLOTS.forEach((slot) => {
      assert.strictEqual(slot.w, 463);
      assert.strictEqual(slot.h, 308);
      assert.strictEqual(slot.x, 141);
    });
  });

  it('should render safely with mock context in various photo configurations', () => {
    const mockCtx = {
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      rect: () => {},
      strokeRect: () => {},
      fillRect: () => {},
      fillText: () => {},
      drawImage: () => {},
      clip: () => {},
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 0,
      font: '',
      textAlign: '',
      textBaseline: '',
      shadowColor: '',
      shadowBlur: 0,
      shadowOffsetY: 0
    };

    const mockBounds = { drawX: 0, drawY: 0, drawW: 736, drawH: 1308 };
    const mockPhoto = { width: 600, height: 400 };

    // 1. Initial click state before user upload (direct reference rendering)
    let directDrawCalled = false;
    const directCtx = {
      ...mockCtx,
      drawImage: () => { directDrawCalled = true; }
    };
    assert.doesNotThrow(() => {
      oceanStoriesTemplate.render(directCtx, mockPhoto, mockBounds, {
        isUserUploaded: false
      });
    });
    assert.strictEqual(directDrawCalled, true);

    // 2. Multi-photo array with 4 photos (background + 3 cards)
    assert.doesNotThrow(() => {
      oceanStoriesTemplate.render(mockCtx, mockPhoto, mockBounds, {
        isUserUploaded: true,
        photoImgs: [mockPhoto, mockPhoto, mockPhoto, mockPhoto],
        caption: 'SEA WHISPERS',
        date: 'SUMMER 2026'
      });
    });

    // 3. Multi-photo array with 3 photos
    assert.doesNotThrow(() => {
      oceanStoriesTemplate.render(mockCtx, mockPhoto, mockBounds, {
        isUserUploaded: true,
        photoImgs: [mockPhoto, mockPhoto, mockPhoto]
      });
    });

    // 4. Multi-photo array with 2 photos
    assert.doesNotThrow(() => {
      oceanStoriesTemplate.render(mockCtx, mockPhoto, mockBounds, {
        isUserUploaded: true,
        photoImgs: [mockPhoto, mockPhoto]
      });
    });

    // 5. Single photo upload
    assert.doesNotThrow(() => {
      oceanStoriesTemplate.render(mockCtx, mockPhoto, mockBounds, {
        isUserUploaded: true,
        photoImgs: [mockPhoto]
      });
    });

    // 6. Null photo
    assert.doesNotThrow(() => {
      oceanStoriesTemplate.render(mockCtx, null, mockBounds, {});
    });
  });

  it('should execute helper routines safely without throwing', () => {
    const mockCtx = {
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      rect: () => {},
      strokeRect: () => {},
      fillRect: () => {},
      fillText: () => {},
      drawImage: () => {},
      clip: () => {},
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 0,
      font: '',
      textAlign: '',
      textBaseline: '',
      shadowColor: '',
      shadowBlur: 0,
      shadowOffsetY: 0
    };

    const mockPhoto = { width: 400, height: 300 };

    assert.doesNotThrow(() => renderStoryBackground(mockCtx, mockPhoto, null, 736, 1308));
    assert.doesNotThrow(() => renderStoryBackground(mockCtx, null, null, 736, 1308));
    assert.doesNotThrow(() => renderStoryCard(mockCtx, mockPhoto, STORY_CARD_SLOTS[0]));
    assert.doesNotThrow(() => renderStoryCard(mockCtx, null, STORY_CARD_SLOTS[0]));
    assert.doesNotThrow(() => drawStoryDetails(mockCtx, 736, 1308, { caption: 'BEACH', date: 'AUG 2026' }));
    assert.doesNotThrow(() => drawStoryDetails(mockCtx, 736, 1308, {}));

    resetOceanStoryBackgroundImage();
    const bg = getOceanStoryBackgroundImage();
    assert.strictEqual(bg, null);
  });
});
