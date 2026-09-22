import {
  ANALOG_TIDE_LAYOUT,
  renderMonochromeFilmBackground,
  renderColorInsetCard,
  drawAnalogTideAnnotations
} from './analog_tide_helpers.js';

/**
 * Analog Tide Vintage Film Inset Template.
 * Features a high-contrast 35mm monochrome background portrait with authentic analog dust/scratches,
 * contrasted against an offset vertical vibrant full-color cutout portal card on the right.
 * Designed for 2 complementary photos with graceful fallback for single photo uploads.
 */
export const analogTideTemplate = {
  id: 'analog_tide',
  name: 'Analog Tide',
  description: 'Monochrome vintage 35mm film portrait with dust specks and an offset vertical color cutout portal',
  previewImage: 'assets/analog_tide_reference.jpg',
  aspectRatio: '3:4',
  tag: 'ANALOG TIDE',
  tags: ['analog', 'tide', 'duo', 'ocean', 'film', 'minimal'],
  photoCount: 2,
  category: '2',
  config: {
    canvasWidth: 1200,
    canvasHeight: 1600,
    frame: { x: 0, y: 0, w: 1200, h: 1600 }
  },
  render(ctx, img, bounds, state = {}) {
    const { canvasWidth: cw, canvasHeight: ch } = this.config;

    // 1. Base dark neutral backing
    ctx.fillStyle = '#101216';
    ctx.fillRect(0, 0, cw, ch);

    // 2. Direct reference render when in preset preview mode before user upload
    const isReferencePreview = !state?.isUserUploaded && img && (
      (typeof img.src === 'string' && img.src.includes('analog_tide_reference')) ||
      (!state?.photoImgs?.length && !state?.photos?.length)
    );

    if (isReferencePreview && img) {
      try {
        ctx.drawImage(img, 0, 0, cw, ch);
      } catch {
        // Fallback for mock unit test environments
      }
      drawAnalogTideAnnotations(ctx, cw, ch, state);
      return;
    }

    // 3. Resolve user photo instances
    const rawPhotos = state?.photoImgs || state?.photos;
    let photoA = img;
    let photoB = img;

    if (Array.isArray(rawPhotos) && rawPhotos.length > 0) {
      photoA = rawPhotos[0] || img;
      photoB = rawPhotos[1] || rawPhotos[0] || img;
    }

    if (!photoA && !photoB) {
      return;
    }

    const zoom = state?.zoom || 1;
    const panX = state?.panX || 0;
    const panY = state?.panY || 0;

    const baseOptions = { zoom, panX, panY, fitMode: 'cover' };
    const isSinglePhoto = (photoA === photoB);

    // For single-photo fallback, zoom the inset portal slightly to create an artistic color-pop portal
    const insetOptions = isSinglePhoto
      ? { zoom: zoom * 1.35, panX, panY, fitMode: 'cover' }
      : baseOptions;

    // 4. Render Background in 35mm monochrome film grain & vintage dust
    if (photoA) {
      renderMonochromeFilmBackground(ctx, photoA, ANALOG_TIDE_LAYOUT.backgroundFrame, baseOptions);
    }

    // 5. Render Inset Card in vibrant full color
    if (photoB) {
      renderColorInsetCard(ctx, photoB, ANALOG_TIDE_LAYOUT.insetFrame, insetOptions);
    }

    // 6. Minimalist typography annotations
    drawAnalogTideAnnotations(ctx, cw, ch, state);
  }
};
