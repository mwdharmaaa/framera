import {
  TRIP_TO_HILL_LAYOUT,
  TOP_TEAR_PROFILE,
  BOTTOM_TEAR_PROFILE,
  traceTornEdgePath,
  drawTornPaperRibbon,
  renderTornSlotPhoto,
  renderTripToHillOverlays
} from './trip_to_hill_helpers.js';

/**
 * Trip To Hill Torn Trio Template.
 * Aesthetic 9:16 outdoor story collage featuring 3 vertical photo panels
 * separated by tactile organic torn paper rips, cursive title typography, and wisdom quotes.
 */
export const tripToHillTemplate = {
  id: 'trip_to_hill',
  name: 'Trip To Hill Torn Trio',
  description: 'Aesthetic 9:16 outdoor story collage with 3 photos separated by organic torn paper rips and cursive typography',
  previewImage: 'assets/trip_to_hill_reference.jpg',
  aspectRatio: '9:16',
  tag: 'TORN TRIO',
  photoCount: 3,
  category: '3',
  config: {
    canvasWidth: 736,
    canvasHeight: 1308,
    frame: { x: 0, y: 0, w: 736, h: 1308 }
  },
  render(ctx, img, bounds, state = {}) {
    const { canvasWidth: cw, canvasHeight: ch, slots } = TRIP_TO_HILL_LAYOUT;

    // 1. Direct reference preview before user uploads custom photos
    const isReferencePreview = !state?.isUserUploaded && img && (
      (typeof img.src === 'string' && img.src.includes('trip_to_hill_reference')) ||
      (!state?.photoImgs?.length && !state?.photos?.length && !state?.photoImg)
    );

    if (isReferencePreview && img) {
      const drawX = typeof bounds?.drawX === 'number' ? bounds.drawX : 0;
      const drawY = typeof bounds?.drawY === 'number' ? bounds.drawY : 0;
      const drawW = typeof bounds?.drawW === 'number' ? bounds.drawW : cw;
      const drawH = typeof bounds?.drawH === 'number' ? bounds.drawH : ch;
      try {
        ctx.drawImage(img, drawX, drawY, drawW, drawH);
      } catch {}
      return;
    }

    // 2. Base canvas dark paper tone
    ctx.fillStyle = '#1c1b18';
    if (typeof ctx.fillRect === 'function') {
      ctx.fillRect(0, 0, cw, ch);
    }

    // 3. Resolve user photos (supports 3, 2, or single photo repeated)
    const rawPhotos = state?.photoImgs || state?.photos || (state?.photoImg ? [state.photoImg] : null);
    let photos = [];
    if (Array.isArray(rawPhotos) && rawPhotos.length >= 3) {
      photos = [rawPhotos[0], rawPhotos[1], rawPhotos[2]];
    } else if (Array.isArray(rawPhotos) && rawPhotos.length === 2) {
      photos = [rawPhotos[0], rawPhotos[1], rawPhotos[0]];
    } else if (Array.isArray(rawPhotos) && rawPhotos.length === 1) {
      photos = [rawPhotos[0], rawPhotos[0], rawPhotos[0]];
    } else if (img) {
      photos = [img, img, img];
    }

    const options = {
      zoom: state?.zoom || 1,
      panX: state?.panX || 0,
      panY: state?.panY || 0
    };

    // 4. Render Slot 0 (Top Panel)
    const p0 = photos[0] || img;
    if (p0) {
      renderTornSlotPhoto(ctx, p0, () => {
        ctx.moveTo(0, 0);
        ctx.lineTo(cw, 0);
        traceTornEdgePath(ctx, TOP_TEAR_PROFILE, true);
        ctx.closePath();
      }, { y: 0, h: slots[0].h }, options);
    }

    // 5. Render Slot 1 (Center Panel)
    const p1 = photos[1] || img;
    if (p1) {
      renderTornSlotPhoto(ctx, p1, () => {
        traceTornEdgePath(ctx, TOP_TEAR_PROFILE, false);
        ctx.lineTo(cw, BOTTOM_TEAR_PROFILE[BOTTOM_TEAR_PROFILE.length - 1][1]);
        traceTornEdgePath(ctx, BOTTOM_TEAR_PROFILE, true);
        ctx.closePath();
      }, { y: 310, h: slots[1].h }, options);
    }

    // 6. Render Slot 2 (Bottom Panel)
    const p2 = photos[2] || img;
    if (p2) {
      renderTornSlotPhoto(ctx, p2, () => {
        traceTornEdgePath(ctx, BOTTOM_TEAR_PROFILE, false);
        ctx.lineTo(cw, ch);
        ctx.lineTo(0, ch);
        ctx.closePath();
      }, { y: 830, h: slots[2].h }, options);
    }

    // 7. Render Realistic White Torn Paper Ribbons with Drop Shadow
    drawTornPaperRibbon(ctx, TOP_TEAR_PROFILE, 14);
    drawTornPaperRibbon(ctx, BOTTOM_TEAR_PROFILE, 14);

    // 8. Typography, Wisdom Quotes, and Instagram Badges
    renderTripToHillOverlays(ctx, state);
  }
};
