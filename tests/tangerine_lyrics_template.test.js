import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { tangerineLyricsTemplate } from '../src/features/templates/tangerine_lyrics_template.js';
import { getTemplate } from '../src/features/templates/template_registry.js';
import {
  TANGERINE_LYRICS_SLOTS,
  TANGERINE_BAND,
  SPOTIFY_CARD_BOUNDS,
  renderTangerineComposition
} from '../src/features/templates/tangerine_lyrics_helpers.js';
import {
  drawStar,
  drawCelestialSun,
  drawTopStars
} from '../src/features/templates/tangerine_lyrics_decorations.js';
import {
  drawTropicalLily,
  drawHibiscus,
  drawY2kStarCluster
} from '../src/features/templates/tangerine_lyrics_botanical.js';
import { drawSpotifyLyricsCard } from '../src/features/templates/tangerine_lyrics_player.js';

function createMockContext() {
  const calls = [];
  return {
    calls,
    save() { calls.push(['save']); },
    restore() { calls.push(['restore']); },
    beginPath() { calls.push(['beginPath']); },
    closePath() { calls.push(['closePath']); },
    rect(x, y, w, h) { calls.push(['rect', x, y, w, h]); },
    fillRect(x, y, w, h) { calls.push(['fillRect', x, y, w, h]); },
    strokeRect(x, y, w, h) { calls.push(['strokeRect', x, y, w, h]); },
    stroke() { calls.push(['stroke']); },
    fill() { calls.push(['fill']); },
    clip() { calls.push(['clip']); },
    moveTo(x, y) { calls.push(['moveTo', x, y]); },
    lineTo(x, y) { calls.push(['lineTo', x, y]); },
    quadraticCurveTo(cpx, cpy, x, y) { calls.push(['quadraticCurveTo', cpx, cpy, x, y]); },
    arc(x, y, r, sa, ea, ac) { calls.push(['arc', x, y, r, sa, ea, ac]); },
    translate(x, y) { calls.push(['translate', x, y]); },
    rotate(angle) { calls.push(['rotate', angle]); },
    fillText(text, x, y) { calls.push(['fillText', text, x, y]); },
    createLinearGradient() {
      return { addColorStop() {} };
    },
    createRadialGradient() {
      return { addColorStop() {} };
    },
    drawImage(...args) {
      calls.push(['drawImage', ...args]);
    }
  };
}

describe('Tangerine Sunset Lyrics Duo 2-Photo Template', () => {
  it('should have valid metadata and native 9:16 (736x1308) canvas configuration with category 2', () => {
    assert.strictEqual(tangerineLyricsTemplate.id, 'tangerine_lyrics_duo');
    assert.strictEqual(tangerineLyricsTemplate.name, 'Tangerine Sunset Lyrics Duo');
    assert.strictEqual(tangerineLyricsTemplate.aspectRatio, '9:16');
    assert.strictEqual(tangerineLyricsTemplate.photoCount, 2);
    assert.strictEqual(tangerineLyricsTemplate.category, '2');
    assert.strictEqual(tangerineLyricsTemplate.config.canvasWidth, 736);
    assert.strictEqual(tangerineLyricsTemplate.config.canvasHeight, 1308);
    assert.ok(Array.isArray(tangerineLyricsTemplate.tags));
    assert.ok(tangerineLyricsTemplate.tags.includes('tangerine'));
    assert.ok(tangerineLyricsTemplate.tags.includes('spotify'));
    assert.ok(tangerineLyricsTemplate.tags.includes('lyrics'));
    assert.ok(tangerineLyricsTemplate.tags.includes('duo'));
    assert.strictEqual(TANGERINE_LYRICS_SLOTS.length, 2);
  });

  it('should be registered in the global template registry', () => {
    const registered = getTemplate('tangerine_lyrics_duo');
    assert.ok(registered, 'tangerine_lyrics_duo should be registered in template registry');
    assert.strictEqual(registered.id, 'tangerine_lyrics_duo');
    assert.strictEqual(registered.category, '2');
  });

  it('should define precise slot coordinates matching the composition', () => {
    const [topSlot, btmSlot] = TANGERINE_LYRICS_SLOTS;

    // Slot 0 (Top Portrait)
    assert.strictEqual(topSlot.id, 0);
    assert.strictEqual(topSlot.x, 0);
    assert.strictEqual(topSlot.y, 0);
    assert.strictEqual(topSlot.w, 736);
    assert.strictEqual(topSlot.h, 512);

    // Orange Band
    assert.strictEqual(TANGERINE_BAND.x, 0);
    assert.strictEqual(TANGERINE_BAND.y, 512);
    assert.strictEqual(TANGERINE_BAND.w, 736);
    assert.strictEqual(TANGERINE_BAND.h, 172);

    // Slot 1 (Bottom Portrait)
    assert.strictEqual(btmSlot.id, 1);
    assert.strictEqual(btmSlot.x, 0);
    assert.strictEqual(btmSlot.y, 684);
    assert.strictEqual(btmSlot.w, 736);
    assert.strictEqual(btmSlot.h, 624);

    // Spotify Card Bounds
    assert.strictEqual(SPOTIFY_CARD_BOUNDS.x, 476);
    assert.strictEqual(SPOTIFY_CARD_BOUNDS.y, 566);
    assert.strictEqual(SPOTIFY_CARD_BOUNDS.w, 232);
    assert.strictEqual(SPOTIFY_CARD_BOUNDS.h, 228);
  });

  it('should render safely with mock context in various photo configurations', () => {
    const ctx = createMockContext();
    const mockImg = { width: 1000, height: 1000, naturalWidth: 1000, naturalHeight: 1000 };

    // 1. Dual photo array
    tangerineLyricsTemplate.render(ctx, null, null, {
      isUserUploaded: true,
      photos: [mockImg, mockImg],
      caption: 'Track Title',
      subtitle: 'Artist Name'
    });
    assert.ok(ctx.calls.length > 0);

    // 2. Single photo fallback
    ctx.calls.length = 0;
    tangerineLyricsTemplate.render(ctx, mockImg, null, {
      isUserUploaded: true,
      photoImg: mockImg
    });
    assert.ok(ctx.calls.length > 0);

    // 3. Null fallback
    ctx.calls.length = 0;
    tangerineLyricsTemplate.render(ctx, null, null, { isUserUploaded: true });
    assert.ok(ctx.calls.length > 0);
  });

  it('should execute helper and decoration routines safely without throwing', () => {
    const ctx = createMockContext();
    const mockImg = { width: 800, height: 600, naturalWidth: 800, naturalHeight: 600 };

    // Decorations
    drawStar(ctx, 50, 50, 5, 15, 7, '#f97316');
    drawCelestialSun(ctx, 600, 100, 80);
    drawTopStars(ctx);
    drawTropicalLily(ctx, 10, 500, 100);
    drawHibiscus(ctx, 500, 600, 80);
    drawY2kStarCluster(ctx, 20, 1000, 120);
    drawSpotifyLyricsCard(ctx, 400, 500, 200, 200, 'Song', 'Artist');

    // Composition Helper
    renderTangerineComposition(ctx, [mockImg, mockImg], 736, 1308);

    assert.ok(ctx.calls.length > 0);
  });
});
