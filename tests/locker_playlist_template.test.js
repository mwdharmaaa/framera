import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { lockerPlaylistTemplate } from '../src/features/templates/locker_playlist_template.js';
import {
  LOCKER_POLAROID_SLOTS,
  renderLockerPolaroidPhoto,
  renderLockerChassisBackground,
  drawLockerPlayerTypography,
  getLockerPlaylistOverlayImage,
  resetLockerPlaylistOverlayImage
} from '../src/features/templates/locker_playlist_helpers.js';
import { getTemplate } from '../src/features/templates/template_registry.js';

describe('Locker Playlist Trio Template', () => {
  it('should have valid metadata and native 9:16 (736x1308) canvas configuration with 3 photos', () => {
    assert.strictEqual(lockerPlaylistTemplate.id, 'locker_playlist_trio');
    assert.strictEqual(lockerPlaylistTemplate.name, 'Locker Playlist Trio');
    assert.strictEqual(lockerPlaylistTemplate.aspectRatio, '9:16');
    assert.strictEqual(lockerPlaylistTemplate.photoCount, 3);
    assert.strictEqual(lockerPlaylistTemplate.category, '3');
    assert.strictEqual(lockerPlaylistTemplate.config.canvasWidth, 736);
    assert.strictEqual(lockerPlaylistTemplate.config.canvasHeight, 1308);
    assert.strictEqual(LOCKER_POLAROID_SLOTS.length, 3);
    assert.strictEqual(typeof lockerPlaylistTemplate.render, 'function');
  });

  it('should be registered in the global template registry', () => {
    const tpl = getTemplate('locker_playlist_trio');
    assert.ok(tpl, 'Template should exist in registry');
    assert.strictEqual(tpl.id, 'locker_playlist_trio');
  });

  it('should render safely with mock context in single, multi, and null photo states', () => {
    const mockCtx = {
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      rect: () => {},
      clip: () => {},
      fillRect: () => {},
      fillText: () => {},
      drawImage: () => {},
      translate: () => {},
      rotate: () => {},
      fillStyle: '',
      font: '',
      textAlign: '',
      textBaseline: ''
    };

    const mockBounds = { drawX: 0, drawY: 0, drawW: 736, drawH: 1308 };
    const mockPhoto = { width: 800, height: 600 };

    // 1. Single photo
    assert.doesNotThrow(() => {
      lockerPlaylistTemplate.render(mockCtx, mockPhoto, mockBounds, {
        caption: 'bad',
        subtitle: 'wave to earth',
        date: '2026'
      });
    });

    // 2. Multi-photo array
    assert.doesNotThrow(() => {
      lockerPlaylistTemplate.render(mockCtx, mockPhoto, mockBounds, {
        photoImgs: [mockPhoto, mockPhoto, mockPhoto]
      });
    });

    // 3. Null photo
    assert.doesNotThrow(() => {
      lockerPlaylistTemplate.render(mockCtx, null, mockBounds, {});
    });
  });

  it('should execute helper routines safely without throwing', () => {
    const mockCtx = {
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      rect: () => {},
      clip: () => {},
      drawImage: () => {},
      translate: () => {},
      rotate: () => {},
      fillRect: () => {},
      fillText: () => {},
      fillStyle: '',
      font: '',
      textAlign: '',
      textBaseline: ''
    };

    assert.doesNotThrow(() => renderLockerPolaroidPhoto(mockCtx, { width: 100, height: 100 }, LOCKER_POLAROID_SLOTS[0]));
    assert.doesNotThrow(() => renderLockerPolaroidPhoto(mockCtx, null, LOCKER_POLAROID_SLOTS[0]));
    assert.doesNotThrow(() => renderLockerChassisBackground(mockCtx, 736, 1308));
    assert.doesNotThrow(() => drawLockerPlayerTypography(mockCtx, 736, 1308, {
      caption: 'custom title',
      subtitle: 'custom artist'
    }));
    assert.doesNotThrow(() => drawLockerPlayerTypography(mockCtx, 736, 1308, {}));

    resetLockerPlaylistOverlayImage();
    const img = getLockerPlaylistOverlayImage();
    assert.strictEqual(img, null);
  });
});
