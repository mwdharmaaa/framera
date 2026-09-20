import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { whatsappChatTemplate } from '../src/features/templates/whatsapp_chat_template.js';
import { getTemplate } from '../src/features/templates/template_registry.js';
import {
  WHATSAPP_CARD_SLOTS,
  drawRoundedRect,
  renderChatMessageCard,
  renderChatHeader,
  renderChatInputBar
} from '../src/features/templates/whatsapp_chat_helpers.js';

describe('WhatsApp Dark Chat Trio Template', () => {
  it('should have valid metadata and native 9:16 (736x1308) canvas configuration with 3 photos', () => {
    assert.strictEqual(whatsappChatTemplate.id, 'whatsapp_chat_trio');
    assert.strictEqual(whatsappChatTemplate.name, 'WhatsApp Dark Chat Trio');
    assert.strictEqual(whatsappChatTemplate.aspectRatio, '9:16');
    assert.strictEqual(whatsappChatTemplate.photoCount, 3);
    assert.strictEqual(whatsappChatTemplate.category, '3');
    assert.strictEqual(whatsappChatTemplate.config.canvasWidth, 736);
    assert.strictEqual(whatsappChatTemplate.config.canvasHeight, 1308);
    assert.strictEqual(WHATSAPP_CARD_SLOTS.length, 3);
  });

  it('should be registered in the global template registry', () => {
    const registered = getTemplate('whatsapp_chat_trio');
    assert.ok(registered, 'whatsapp_chat_trio should be registered in template registry');
    assert.strictEqual(registered.id, 'whatsapp_chat_trio');
    assert.strictEqual(registered.category, '3');
  });

  it('should define precise slot coordinates for all 3 stacked message cards', () => {
    const [card0, card1, card2] = WHATSAPP_CARD_SLOTS;

    assert.strictEqual(card0.id, 0);
    assert.strictEqual(card0.w, 480);
    assert.strictEqual(card0.h, 295);

    assert.strictEqual(card1.id, 1);
    assert.strictEqual(card1.w, 480);
    assert.strictEqual(card1.h, 320);

    assert.strictEqual(card2.id, 2);
    assert.strictEqual(card2.w, 480);
    assert.strictEqual(card2.h, 320);
  });

  it('should render safely with mock context in various photo configurations', () => {
    const createMockContext = () => ({
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      closePath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      arc: () => {},
      rect: () => {},
      strokeRect: () => {},
      fillRect: () => {},
      stroke: () => {},
      fill: () => {},
      clip: () => {},
      drawImage: () => {},
      fillText: () => {},
      quadraticCurveTo: () => {},
      createLinearGradient: () => ({
        addColorStop: () => {}
      })
    });

    const mockPhoto = { width: 800, height: 600 };
    const mockCtx = createMockContext();

    // 1. Single photo fallback
    assert.doesNotThrow(() => {
      whatsappChatTemplate.render(mockCtx, mockPhoto, null, {
        caption: 'Message yourself',
        subtitle: 'Type a message',
        date: '1:57 AM'
      });
    });

    // 2. 3-photo array
    assert.doesNotThrow(() => {
      whatsappChatTemplate.render(mockCtx, null, null, {
        photoImgs: [mockPhoto, mockPhoto, mockPhoto],
        isUserUploaded: true,
        caption: 'Chat Note',
        subtitle: 'Hello!',
        date: '12:00 AM'
      });
    });

    // 3. Null photo graceful fallback
    assert.doesNotThrow(() => {
      whatsappChatTemplate.render(mockCtx, null, null, {});
    });
  });

  it('should execute helper drawing routines safely without throwing', () => {
    const createMockContext = () => ({
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      closePath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      arc: () => {},
      rect: () => {},
      fillRect: () => {},
      stroke: () => {},
      fill: () => {},
      clip: () => {},
      drawImage: () => {},
      fillText: () => {},
      quadraticCurveTo: () => {},
      createLinearGradient: () => ({ addColorStop: () => {} })
    });

    const mockCtx = createMockContext();
    const mockPhoto = { naturalWidth: 400, naturalHeight: 300 };

    assert.doesNotThrow(() => drawRoundedRect(mockCtx, 10, 10, 100, 100, 10));
    assert.doesNotThrow(() => renderChatMessageCard(mockCtx, mockPhoto, WHATSAPP_CARD_SLOTS[0], '1:57 AM'));
    assert.doesNotThrow(() => renderChatHeader(mockCtx, 'Custom Chat', 736));
    assert.doesNotThrow(() => renderChatInputBar(mockCtx, 'Custom Input', 736, 1308));
  });
});
