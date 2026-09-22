import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { metropolisStoryTemplate } from '../src/features/templates/metropolis_story_template.js';
import {
  METROPOLIS_STORY_SLOTS,
  LOREM_IPSUM_DEFAULT,
  renderJournalBackdrop,
  renderSlotPhoto,
  renderLoremIpsumText,
  renderPlaceholderText
} from '../src/features/templates/metropolis_story_helpers.js';
import { getTemplate } from '../src/features/templates/template_registry.js';

describe('Metropolis Editorial Journal Template', () => {
  it('should have valid metadata and 4:5 (736x920) canvas configuration with 2 photos in category 2', () => {
    assert.strictEqual(metropolisStoryTemplate.id, 'metropolis_story');
    assert.strictEqual(metropolisStoryTemplate.photoCount, 2);
    assert.strictEqual(metropolisStoryTemplate.category, '2');
    assert.strictEqual(metropolisStoryTemplate.aspectRatio, '4:5');
    assert.strictEqual(metropolisStoryTemplate.config.canvasWidth, 736);
    assert.strictEqual(metropolisStoryTemplate.config.canvasHeight, 920);
    assert.ok(metropolisStoryTemplate.name.includes('Metropolis'));
    assert.ok(typeof metropolisStoryTemplate.render === 'function');
  });

  it('should be registered in the global template registry', () => {
    const registered = getTemplate('metropolis_story');
    assert.ok(registered);
    assert.strictEqual(registered.id, 'metropolis_story');
  });

  it('should define 2 precise layout slot coordinates for top hero and bottom portrait photo', () => {
    assert.strictEqual(METROPOLIS_STORY_SLOTS.length, 2);

    const topHero = METROPOLIS_STORY_SLOTS[0];
    const bottomPortrait = METROPOLIS_STORY_SLOTS[1];

    assert.strictEqual(topHero.x, 0);
    assert.strictEqual(topHero.y, 0);
    assert.strictEqual(topHero.w, 736);
    assert.strictEqual(topHero.h, 460);

    assert.strictEqual(bottomPortrait.x, 74);
    assert.strictEqual(bottomPortrait.y, 524);
    assert.strictEqual(bottomPortrait.w, 282);
    assert.strictEqual(bottomPortrait.h, 322);
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
      fillText: () => {},
      measureText: () => ({ width: 100 })
    };

    const mockImg = {
      src: 'assets/metropolis_story_reference.png',
      width: 736,
      height: 920,
      naturalWidth: 736,
      naturalHeight: 920
    };

    // 1. Reference preview fallback
    assert.doesNotThrow(() => {
      metropolisStoryTemplate.render(mockCtx, mockImg, { drawX: 0, drawY: 0, drawW: 736, drawH: 920 }, {
        isUserUploaded: false
      });
    });

    // 2. User uploaded 2 photos with custom Lorem Ipsum text
    const photoA = { width: 1200, height: 800, naturalWidth: 1200, naturalHeight: 800 };
    const photoB = { width: 600, height: 800, naturalWidth: 600, naturalHeight: 800 };
    assert.doesNotThrow(() => {
      metropolisStoryTemplate.render(mockCtx, null, {}, {
        isUserUploaded: true,
        photos: [photoA, photoB],
        subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        slots: [
          { zoom: 1.0, panX: 0, panY: 0 },
          { zoom: 1.2, panX: 10, panY: -5 }
        ]
      });
    });

    // 3. Single photo fallback
    assert.doesNotThrow(() => {
      metropolisStoryTemplate.render(mockCtx, null, {}, {
        isUserUploaded: true,
        photos: [photoA]
      });
    });

    // 4. Empty photos fallback
    assert.doesNotThrow(() => {
      metropolisStoryTemplate.render(mockCtx, null, {}, {
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
      fillText: () => {},
      measureText: () => ({ width: 80 })
    };

    assert.doesNotThrow(() => {
      renderJournalBackdrop(mockCtx, 736, 920);
    });

    assert.doesNotThrow(() => {
      renderSlotPhoto(mockCtx, null, METROPOLIS_STORY_SLOTS[0]);
    });

    assert.doesNotThrow(() => {
      renderPlaceholderText(mockCtx, METROPOLIS_STORY_SLOTS[1]);
    });

    assert.doesNotThrow(() => {
      renderLoremIpsumText(mockCtx, { subtitle: LOREM_IPSUM_DEFAULT });
    });
  });
});
