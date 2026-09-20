import {
  WHATSAPP_CARD_SLOTS,
  renderChatMessageCard,
  renderChatHeader,
  renderChatInputBar
} from './whatsapp_chat_helpers.js';

/**
 * WhatsApp Dark Chat Trio Template.
 * Aesthetic 9:16 dark messenger composition with 3 stacked photo cards,
 * forward buttons, timestamps with double cyan checkmarks, and bottom chat bar.
 */
export const whatsappChatTemplate = {
  id: 'whatsapp_chat_trio',
  name: 'WhatsApp Dark Chat Trio',
  description: 'Viral desktop dark messenger aesthetic with 3 stacked photo messages, forward telemetry, timestamps, and chat input bar',
  previewImage: 'assets/whatsapp_chat_reference.jpg',
  aspectRatio: '9:16',
  tag: 'DARK CHAT',
  photoCount: 3,
  category: '3',
  config: {
    canvasWidth: 736,
    canvasHeight: 1308,
    frame: { x: 0, y: 0, w: 736, h: 1308 }
  },
  render(ctx, img, bounds, state = {}) {
    const { canvasWidth: cw, canvasHeight: ch } = this.config;

    // 1. Direct reference rendering before custom photos are uploaded
    const isReferencePreview = !state?.isUserUploaded && img && (
      (typeof img.src === 'string' && img.src.includes('whatsapp_chat_reference')) ||
      (!state?.photoImgs?.length && !state?.photos?.length && !state?.photoImg)
    );

    if (isReferencePreview && img) {
      const drawX = typeof bounds?.drawX === 'number' ? bounds.drawX : 0;
      const drawY = typeof bounds?.drawY === 'number' ? bounds.drawY : 0;
      const drawW = typeof bounds?.drawW === 'number' ? bounds.drawW : cw;
      const drawH = typeof bounds?.drawH === 'number' ? bounds.drawH : ch;
      try {
        ctx.drawImage(img, drawX, drawY, drawW, drawH);
      } catch {
        // Safe fallback for unit tests
      }
      return;
    }

    // 2. Deep Charcoal Messenger Wallpaper Backdrop
    ctx.fillStyle = '#0c1317';
    ctx.fillRect(0, 0, cw, ch);

    // Subtle dark chat doodle pattern background
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.lineWidth = 1;
    for (let x = 20; x < cw; x += 60) {
      for (let y = 80; y < ch - 90; y += 60) {
        ctx.strokeRect(x, y, 20, 20);
      }
    }
    ctx.restore();

    // 3. Resolve 3 photos for the message slots
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

    // 4. Render 3 stacked chat message cards
    const timeText = state?.date || '1:57 AM';
    WHATSAPP_CARD_SLOTS.forEach((slot) => {
      const photo = photos[slot.id] || img;
      if (photo) {
        renderChatMessageCard(ctx, photo, slot, timeText);
      }
    });

    // 5. Render Top Chat Header
    const headerTitle = state?.caption || 'Message yourself';
    renderChatHeader(ctx, headerTitle, cw);

    // 6. Render Bottom Input Bar
    const inputPlaceholder = state?.subtitle || 'Type a message';
    renderChatInputBar(ctx, inputPlaceholder, cw, ch);
  }
};
