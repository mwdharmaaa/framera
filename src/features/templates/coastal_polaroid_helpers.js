import { calculateImageBounds } from '../../core/canvas/bounds.js';
import { drawRoundedRect, drawPolaroidFooter } from './coastal_polaroid_decorations.js';

/**
 * Layout Coordinates and Card Renderers for Coastal Polaroid Story Template (9:16, 736x1308).
 * Arranges dual stacked monochrome seaside backdrops and an overlapping floating polaroid snapshot.
 */

export const COASTAL_POLAROID_SLOTS = [
  { id: 0, name: 'Top Horizon Backdrop', x: 0, y: 0, w: 736, h: 654 },
  { id: 1, name: 'Bottom Surf Backdrop', x: 0, y: 654, w: 736, h: 654 },
  { id: 2, name: 'Polaroid Snapshot Card', x: 416, y: 354, w: 294, h: 574, r: 8 }
];

export const POLAROID_CARD_CONFIG = {
  x: 416,
  y: 354,
  w: 294,
  h: 574,
  innerX: 428,
  innerY: 366,
  innerW: 270,
  innerH: 456,
  r: 8
};

function drawCoverPhoto(ctx, photo, frame, filter) {
  if (!photo) return;
  const pw = photo.naturalWidth || photo.width || frame.w;
  const ph = photo.naturalHeight || photo.height || frame.h;
  const b = calculateImageBounds(pw, ph, frame, { fitMode: 'cover' });

  ctx.save();
  ctx.beginPath();
  ctx.rect(frame.x, frame.y, frame.w, frame.h);
  ctx.clip();
  if (filter) ctx.filter = filter;
  try {
    ctx.drawImage(photo, b.drawX, b.drawY, b.drawW, b.drawH);
  } catch {
    // Safe fallback for unit tests
  }
  ctx.restore();
}

/**
 * Renders the stacked monochrome seaside backdrops with silver-gelatin grade.
 */
export function renderSeasideBackdrop(ctx, photos, cw, ch) {
  if (!ctx) return;
  ctx.save();

  // Neutral dark slate base
  ctx.fillStyle = '#1c1d21';
  ctx.fillRect(0, 0, cw, ch);

  const topPhoto = photos?.[0] || null;
  const btmPhoto = photos?.[1] || photos?.[0] || null;
  const midY = Math.round(ch / 2);

  // 1. Top & bottom half backdrops
  drawCoverPhoto(ctx, topPhoto, { x: 0, y: 0, w: cw, h: midY }, 'grayscale(100%) contrast(118%) brightness(90%)');
  drawCoverPhoto(ctx, btmPhoto, { x: 0, y: midY, w: cw, h: ch - midY }, 'grayscale(100%) contrast(118%) brightness(92%)');

  // 2. Subtle horizontal split line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, midY);
  ctx.lineTo(cw, midY);
  ctx.stroke();

  // 3. Cinematic vignette shading
  const vig = ctx.createLinearGradient(0, 0, 0, ch);
  vig.addColorStop(0, 'rgba(0, 0, 0, 0.25)');
  vig.addColorStop(0.15, 'rgba(0, 0, 0, 0.05)');
  vig.addColorStop(0.85, 'rgba(0, 0, 0, 0.05)');
  vig.addColorStop(1, 'rgba(0, 0, 0, 0.35)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, cw, ch);

  ctx.restore();
}

/**
 * Renders the floating white Polaroid card with photo and footer details.
 */
export function renderPolaroidCard(ctx, photo, config, caption) {
  if (!ctx) return;
  const { x, y, w, h, innerX, innerY, innerW, innerH, r } = config;
  ctx.save();

  // 1. Soft contact drop shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.38)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetX = -4;
  ctx.shadowOffsetY = 12;

  // 2. Polaroid white card body
  drawRoundedRect(ctx, x, y, w, h, r);
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  ctx.shadowColor = 'transparent';

  // 3. Card border
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // 4. Inner photo slot
  const innerFrame = { x: innerX, y: innerY, w: innerW, h: innerH };
  if (photo) {
    drawCoverPhoto(ctx, photo, innerFrame, 'grayscale(100%) contrast(112%) brightness(95%)');
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.12)';
    ctx.lineWidth = 1;
    ctx.strokeRect(innerX, innerY, innerW, innerH);
  } else {
    ctx.fillStyle = '#27272a';
    ctx.fillRect(innerX, innerY, innerW, innerH);
  }

  // 5. Polaroid footer icons and caption
  const footerY = innerY + innerH + 12;
  drawPolaroidFooter(ctx, innerX, footerY, innerW, caption);

  ctx.restore();
}
