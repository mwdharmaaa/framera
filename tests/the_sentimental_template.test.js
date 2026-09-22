import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { theSentimentalTemplate } from '../src/features/templates/the_sentimental_template.js';
import {
  SENTIMENTAL_SLOTS,
  renderSentimentalBackground,
  renderSentimentalCard,
  renderSentimentalTypography
} from '../src/features/templates/the_sentimental_helpers.js';
import { getTemplate } from '../src/features/templates/template_registry.js';

describe('The Sentimental Duo Template', () => {
  it('should have valid metadata and 3:4 (736x1041) canvas configuration with 2 photos in category 2', () => {
    assert.strictEqual(theSentimentalTemplate.id, 'the_sentimental');
    assert.strictEqual(theSentimentalTemplate.photoCount, 2);
    assert.strictEqual(theSentimentalTemplate.category, '2');
    assert.strictEqual(theSentimentalTemplate.aspectRatio, '3:4');
    assert.strictEqual(theSentimentalTemplate.config.canvasWidth, 736);
    assert.strictEqual(theSentimentalTemplate.config.canvasHeight, 1041);
    assert.ok(theSentimentalTemplate.name.includes('The Sentimental'));
    assert.ok(typeof theSentimentalTemplate.render === 'function');
  });

  it('should be registered in the global template registry', () => {
    const registered = getTemplate('the_sentimental');
    assert.ok(registered);
    assert.strictEqual(registered.id, 'the_sentimental');
  });

  it('should define 2 precise layout slot coordinates matching the reference composition', () => {
    assert.strictEqual(SENTIMENTAL_SLOTS.length, 2);

    const left = SENTIMENTAL_SLOTS[0];
    const right = SENTIMENTAL_SLOTS[1];

    assert.strictEqual(left.photo.x, 118);
    assert.strictEqual(left.photo.y, 329);
    assert.strictEqual(left.photo.w, 232);
    assert.strictEqual(left.photo.h, 296);

    assert.strictEqual(right.photo.x, 398);
    assert.strictEqual(right.photo.y, 329);
    assert.strictEqual(right.photo.w, 232);
    assert.strictEqual(right.photo.h, 296);

    // Frame margins
    assert.strictEqual(left.frame.x, 109);
    assert.strictEqual(left.frame.y, 320);
    assert.strictEqual(right.frame.x, 389);
    assert.strictEqual(right.frame.y, 320);
  });

  it('should render safely with mock context in various photo configurations', () => {
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
      measureText: () => ({ width: 100 }),
      drawImage: () => {},
      arc: () => {},
      createRadialGradient: () => ({
        addColorStop: () => {}
      }),
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      font: '',
      textAlign: '',
      textBaseline: '',
      letterSpacing: '',
      shadowColor: '',
      shadowBlur: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0
    };

    const mockPhoto1 = { naturalWidth: 400, naturalHeight: 500, src: 'photo1.jpg' };
    const mockPhoto2 = { naturalWidth: 400, naturalHeight: 500, src: 'photo2.jpg' };

    // 1. Dual photos
    theSentimentalTemplate.render(mockCtx, mockPhoto1, null, {
      isUserUploaded: true,
      photos: [mockPhoto1, mockPhoto2]
    });

    // 2. Single photo duplicated
    theSentimentalTemplate.render(mockCtx, mockPhoto1, null, {
      isUserUploaded: true,
      photos: [mockPhoto1]
    });

    // 3. Null photos fallback
    theSentimentalTemplate.render(mockCtx, null, null, {
      isUserUploaded: true,
      photos: []
    });

    // 4. Reference fallback
    theSentimentalTemplate.render(mockCtx, { src: 'assets/the_sentimental_reference.png' }, null, {
      isUserUploaded: false
    });
  });

  it('should execute helper routines safely without throwing', () => {
    const mockCtx = {
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      closePath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      arc: () => {},
      stroke: () => {},
      rect: () => {},
      clip: () => {},
      fill: () => {},
      fillRect: () => {},
      strokeRect: () => {},
      fillText: () => {},
      createRadialGradient: () => ({ addColorStop: () => {} })
    };

    renderSentimentalBackground(mockCtx, 736, 1041);
    renderSentimentalCard(mockCtx, null, SENTIMENTAL_SLOTS[0]);
    renderSentimentalTypography(mockCtx, 736, 1041, {
      caption: 'the "sentimental"',
      subtitle: '...... trying very best version of me'
    });
  });
});
