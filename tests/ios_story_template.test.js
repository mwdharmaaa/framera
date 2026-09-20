import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { iosStoryTemplate } from '../src/features/templates/ios_story_template.js';
import { getTemplate } from '../src/features/templates/template_registry.js';
import {
  IOS_STORY_SLOTS,
  renderHeroBackdrop,
  renderFloatingCard,
  renderSheetCard
} from '../src/features/templates/ios_story_helpers.js';
import {
  renderSheetContainer,
  drawCheckmarkBadge,
  drawHeartBadge,
  drawHomeIndicator
} from '../src/features/templates/ios_story_decorations.js';

describe('iOS Share Sheet Story 6-Photo Template', () => {
  it('should have valid metadata and native 9:16 (736x1308) canvas configuration with 6 photos', () => {
    assert.strictEqual(iosStoryTemplate.id, 'ios_share_story');
    assert.strictEqual(iosStoryTemplate.name, 'iOS Share Sheet Story 6-Photo');
    assert.strictEqual(iosStoryTemplate.aspectRatio, '9:16');
    assert.strictEqual(iosStoryTemplate.photoCount, 6);
    assert.strictEqual(iosStoryTemplate.category, '6');
    assert.strictEqual(iosStoryTemplate.config.canvasWidth, 736);
    assert.strictEqual(iosStoryTemplate.config.canvasHeight, 1308);
    assert.strictEqual(IOS_STORY_SLOTS.length, 6);
  });

  it('should be registered in the global template registry', () => {
    const registered = getTemplate('ios_share_story');
    assert.ok(registered, 'ios_share_story should be registered in template registry');
    assert.strictEqual(registered.id, 'ios_share_story');
    assert.strictEqual(registered.category, '6');
  });

  it('should define precise slot coordinates for backdrop, 2 floating cards, and 3 sheet cards', () => {
    const [hero, float1, float2, sheet1, sheet2, sheet3] = IOS_STORY_SLOTS;

    // Slot 0: Top Hero Backdrop
    assert.strictEqual(hero.id, 0);
    assert.strictEqual(hero.w, 736);
    assert.strictEqual(hero.h, 831);

    // Slots 1 & 2: Floating Framed Cards
    assert.strictEqual(float1.id, 1);
    assert.strictEqual(float1.x, 112);
    assert.strictEqual(float1.y, 144);
    assert.strictEqual(float1.w, 310);
    assert.strictEqual(float1.h, 232);

    assert.strictEqual(float2.id, 2);
    assert.strictEqual(float2.x, 384);
    assert.strictEqual(float2.y, 302);
    assert.strictEqual(float2.w, 200);
    assert.strictEqual(float2.h, 230);

    // Slots 3, 4, 5: Bottom 3 Share Sheet Cards
    assert.strictEqual(sheet1.id, 3);
    assert.strictEqual(sheet1.x, 22);
    assert.strictEqual(sheet1.y, 886);
    assert.strictEqual(sheet1.w, 220);
    assert.strictEqual(sheet1.h, 398);

    assert.strictEqual(sheet2.id, 4);
    assert.strictEqual(sheet2.x, 258);
    assert.strictEqual(sheet2.y, 886);
    assert.strictEqual(sheet2.w, 220);
    assert.strictEqual(sheet2.h, 398);

    assert.strictEqual(sheet3.id, 5);
    assert.strictEqual(sheet3.x, 494);
    assert.strictEqual(sheet3.y, 886);
    assert.strictEqual(sheet3.w, 220);
    assert.strictEqual(sheet3.h, 398);
  });

  it('should render safely with mock context across photo states', () => {
    const createMockContext = () => ({
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      closePath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      arc: () => {},
      bezierCurveTo: () => {},
      rect: () => {},
      fillRect: () => {},
      strokeRect: () => {},
      stroke: () => {},
      fill: () => {},
      clip: () => {},
      drawImage: () => {},
      fillText: () => {}
    });

    const mockPhoto = { width: 600, height: 800, naturalWidth: 600, naturalHeight: 800 };
    const mockCtx = createMockContext();

    // 1. Single photo fallback
    assert.doesNotThrow(() => {
      iosStoryTemplate.render(mockCtx, mockPhoto, null, {
        caption: '3 Photos Selected'
      });
    });

    // 2. 6-photo array
    assert.doesNotThrow(() => {
      iosStoryTemplate.render(mockCtx, null, null, {
        photoImgs: [mockPhoto, mockPhoto, mockPhoto, mockPhoto, mockPhoto, mockPhoto],
        isUserUploaded: true,
        caption: 'Waterfall Trip'
      });
    });

    // 3. Null photo fallback
    assert.doesNotThrow(() => {
      iosStoryTemplate.render(mockCtx, null, null, {});
    });
  });

  it('should execute helper and decoration routines safely without throwing', () => {
    const createMockContext = () => ({
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      closePath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      arc: () => {},
      bezierCurveTo: () => {},
      rect: () => {},
      fillRect: () => {},
      strokeRect: () => {},
      stroke: () => {},
      fill: () => {},
      clip: () => {},
      drawImage: () => {},
      fillText: () => {}
    });

    const mockCtx = createMockContext();
    const mockPhoto = { naturalWidth: 400, naturalHeight: 300 };

    assert.doesNotThrow(() => renderHeroBackdrop(mockCtx, mockPhoto, 736, 831));
    assert.doesNotThrow(() => renderFloatingCard(mockCtx, mockPhoto, IOS_STORY_SLOTS[1]));
    assert.doesNotThrow(() => renderSheetCard(mockCtx, mockPhoto, IOS_STORY_SLOTS[3], true, true));
    assert.doesNotThrow(() => renderSheetContainer(mockCtx, 831, 736, 1308, '3 Photos Selected'));
    assert.doesNotThrow(() => drawCheckmarkBadge(mockCtx, 100, 100));
    assert.doesNotThrow(() => drawHeartBadge(mockCtx, 120, 100));
    assert.doesNotThrow(() => drawHomeIndicator(mockCtx, 368, 1295));
  });
});
