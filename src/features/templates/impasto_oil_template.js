import {
  getImpastoRidgesImage,
  renderOilCanvasPrimer,
  renderImpastoPhoto,
  renderImpastoReliefPass,
  drawAtelierDetails
} from './impasto_oil_helpers.js';

/**
 * Impasto Oil Atelier Template.
 * Transforms any user photo into a physical fine-art oil painting with palette-knife ridges,
 * buttery paint depth, and specular glaze relief.
 */
export const impastoOilTemplate = {
  id: 'impasto_oil_atelier',
  name: 'Impasto Oil Atelier',
  description: 'Fine-art physical oil painting synthesizer with thick impasto palette-knife ridges and canvas relief',
  previewImage: 'assets/impasto_oil_reference.jpg',
  aspectRatio: '9:19.5',
  tag: 'IMPASTO OIL',
  tags: ['oilpaint', 'impasto', 'atelier', 'artistic', 'textured', 'single'],
  photoCount: 1,
  category: '1',
  config: {
    canvasWidth: 555,
    canvasHeight: 1200,
    frame: { x: 0, y: 0, w: 555, h: 1200 }
  },
  render(ctx, img, bounds, state = {}) {
    const { canvasWidth: cw, canvasHeight: ch } = this.config;

    // When displaying the reference sample (before user photo upload),
    // render the reference image directly to match reference 1:1
    if (!state.isUserUploaded && img) {
      const drawX = typeof bounds?.drawX === 'number' ? bounds.drawX : 0;
      const drawY = typeof bounds?.drawY === 'number' ? bounds.drawY : 0;
      const drawW = typeof bounds?.drawW === 'number' ? bounds.drawW : cw;
      const drawH = typeof bounds?.drawH === 'number' ? bounds.drawH : ch;
      try {
        ctx.drawImage(img, drawX, drawY, drawW, drawH);
      } catch {
        // Fallback for mock unit test environments
      }
      drawAtelierDetails(ctx, cw, ch, state);
      return;
    }

    // 1. Render dark canvas primer
    renderOilCanvasPrimer(ctx, cw, ch);

    // 2. Render user photo with painterly color grade & directional paint drag
    if (img) {
      renderImpastoPhoto(ctx, img, bounds, cw, ch);
    }

    // 3. Render 3D physical impasto knife ridges & texture
    const texture = getImpastoRidgesImage();
    if (texture && (texture.complete || typeof Image === 'undefined')) {
      renderImpastoReliefPass(ctx, texture, cw, ch);
    } else if (texture) {
      texture.onload = () => {
        if (typeof state?.onRedraw === 'function') state.onRedraw();
      };
    }

    // 4. Artist signature & catalog stamp if provided
    drawAtelierDetails(ctx, cw, ch, state);
  }
};
