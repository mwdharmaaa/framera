import { calculateImageBounds } from '../../core/canvas/bounds.js';
import {
  drawCelestialSun,
  drawTopStars
} from './tangerine_lyrics_decorations.js';
import {
  drawTropicalLily,
  drawHibiscus,
  drawY2kStarCluster
} from './tangerine_lyrics_botanical.js';
import { drawSpotifyLyricsCard } from './tangerine_lyrics_player.js';

export const TANGERINE_LYRICS_SLOTS = [
  { id: 0, name: 'Top Portrait Panel', x: 0, y: 0, w: 736, h: 512 },
  { id: 1, name: 'Bottom Portrait Panel', x: 0, y: 684, w: 736, h: 624 }
];

export const TANGERINE_BAND = {
  x: 0,
  y: 512,
  w: 736,
  h: 172,
  color: '#fa8b02'
};

export const SPOTIFY_CARD_BOUNDS = {
  x: 476,
  y: 566,
  w: 232,
  h: 228
};

function drawCoverSlot(ctx, photo, slot, framing = {}) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(slot.x, slot.y, slot.w, slot.h);
  ctx.clip();

  // Neutral dark backing
  ctx.fillStyle = '#18181b';
  ctx.fillRect(slot.x, slot.y, slot.w, slot.h);

  if (photo) {
    const pw = photo.naturalWidth || photo.width || slot.w;
    const ph = photo.naturalHeight || photo.height || slot.h;
    const b = calculateImageBounds(pw, ph, slot, {
      zoom: framing.zoom ?? 1,
      panX: framing.panX ?? 0,
      panY: framing.panY ?? 0,
      fitMode: 'cover'
    });

    try {
      ctx.drawImage(photo, b.drawX, b.drawY, b.drawW, b.drawH);
    } catch {
      // Safe fallback for unit tests
    }
  }

  // Subtle cinematic edge vignette
  const vig = ctx.createLinearGradient(0, slot.y, 0, slot.y + slot.h);
  vig.addColorStop(0, 'rgba(0, 0, 0, 0.18)');
  vig.addColorStop(0.2, 'rgba(0, 0, 0, 0.02)');
  vig.addColorStop(0.8, 'rgba(0, 0, 0, 0.02)');
  vig.addColorStop(1, 'rgba(0, 0, 0, 0.22)');
  ctx.fillStyle = vig;
  ctx.fillRect(slot.x, slot.y, slot.w, slot.h);

  ctx.restore();
}

/**
 * Assembles and renders the entire Tangerine Sunset Lyrics composition.
 */
export function renderTangerineComposition(ctx, photos, cw, ch, state = {}) {
  if (!ctx) return;
  const [topSlot, btmSlot] = TANGERINE_LYRICS_SLOTS;
  const pTop = photos?.[0] || null;
  const pBtm = photos?.[1] || photos?.[0] || null;

  // 1. Render Top & Bottom Photo Panels
  drawCoverSlot(ctx, pTop, topSlot, state);
  drawCoverSlot(ctx, pBtm, btmSlot, state);

  // 2. Render Middle Orange Solid Band
  ctx.save();
  ctx.fillStyle = state?.bgColor || TANGERINE_BAND.color;
  ctx.fillRect(TANGERINE_BAND.x, TANGERINE_BAND.y, TANGERINE_BAND.w, TANGERINE_BAND.h);
  ctx.restore();

  // 3. Render Top Photo Overlays: Celestial Sun & Stars
  drawCelestialSun(ctx, 646, 85, 92);
  drawTopStars(ctx);

  // 4. Render Middle Overlays: Lily, Spotify Card, Hibiscus
  drawTropicalLily(ctx, -10, 460, 142);

  const track = state?.caption || 'presente de d';
  const artist = state?.subtitle || 'Link do Zap, EF';
  const lyrics = state?.lyrics || state?.lyricsLines;
  drawSpotifyLyricsCard(ctx, SPOTIFY_CARD_BOUNDS.x, SPOTIFY_CARD_BOUNDS.y, SPOTIFY_CARD_BOUNDS.w, SPOTIFY_CARD_BOUNDS.h, track, artist, lyrics);

  drawHibiscus(ctx, 608, 730, 96);

  // 5. Render Bottom Overlays: Y2K Astrological Cluster
  drawY2kStarCluster(ctx, 10, 1120, 175);
}
