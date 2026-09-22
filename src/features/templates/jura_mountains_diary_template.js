import {
  JURA_SLOT_COORDINATES,
  drawDiaryTitle,
  drawSlotNumbers,
  drawClippedSlotPhoto
} from './jura_mountains_diary_helpers.js';

export const juraMountainsDiaryTemplate = {
  id: 'jura_mountains_diary',
  name: 'Jura Mountains Diary',
  description: 'Minimalist Swiss editorial 9-photo diary grid with clean lowercase typography and numbered indices (1)-(9)',
  previewImage: 'assets/jura_diary_reference.jpg',
  aspectRatio: '4:5',
  tag: 'EDITORIAL',
  tags: ['editorial', 'diary', 'mountains', 'nature', 'journal', 'multi'],
  category: '9',
  photoCount: 9,
  config: {
    canvasWidth: 736,
    canvasHeight: 920,
    slots: JURA_SLOT_COORDINATES
  },

  render(ctx, img, bounds, state = {}) {
    const { canvasWidth: cw, canvasHeight: ch, slots } = this.config;

    // 1. Clean minimal white gallery backdrop
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, cw, ch);

    // 2. Resolve photos and slot states
    const slotList = Array.isArray(state.slots) && state.slots.length === slots.length
      ? state.slots
      : null;
    const photoArray = Array.isArray(state.photoImgs) && state.photoImgs.length > 0
      ? state.photoImgs
      : (img ? [img] : []);

    // 3. Render 9 seamlessly tiled photos across 3 rows
    slots.forEach((slot, idx) => {
      const slotState = slotList ? slotList[idx] : null;
      const slotImg = slotState?.img || photoArray[idx] || photoArray[0] || null;
      const framing = {
        zoom: slotState?.zoom ?? (idx === 0 ? (state.zoom ?? 1) : 1),
        panX: slotState?.panX ?? (idx === 0 ? (state.panX ?? 0) : 0),
        panY: slotState?.panY ?? (idx === 0 ? (state.panY ?? 0) : 0)
      };
      drawClippedSlotPhoto(ctx, slotImg, slot, framing);
    });

    // 4. Clean lowercase Swiss editorial headline
    const headline = state.caption !== undefined && state.caption !== null
      ? state.caption
      : 'jura mountains diary';
    drawDiaryTitle(ctx, headline, 48, 66);

    // 5. Minimalist parenthesized numbers (1) to (9) under photos
    drawSlotNumbers(ctx, slots);
  }
};
