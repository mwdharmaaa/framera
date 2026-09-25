/**
 * Curated Vector Stickers & Aesthetic Tape Stamps Definitions for Framera Studio.
 */

export const STICKER_TYPES = {
  washi_cream: {
    id: 'washi_cream',
    label: 'Washi Cream',
    category: 'tape',
    defaultScale: 1,
    defaultRotation: -5
  },
  washi_pink: {
    id: 'washi_pink',
    label: 'Washi Rose',
    category: 'tape',
    defaultScale: 1,
    defaultRotation: 4
  },
  postal_stamp: {
    id: 'postal_stamp',
    label: 'Air Mail Stamp',
    category: 'stamp',
    defaultScale: 1,
    defaultRotation: -2
  },
  barcode: {
    id: 'barcode',
    label: 'Studio Barcode',
    category: 'graphic',
    defaultScale: 1,
    defaultRotation: 0
  },
  sparkle_star: {
    id: 'sparkle_star',
    label: 'Golden Sparkle',
    category: 'doodle',
    defaultScale: 1,
    defaultRotation: 12
  },
  heart_doodle: {
    id: 'heart_doodle',
    label: 'Heart Doodle',
    category: 'doodle',
    defaultScale: 1,
    defaultRotation: -8
  },
  date_badge: {
    id: 'date_badge',
    label: 'Memory Badge',
    category: 'stamp',
    defaultScale: 1,
    defaultRotation: 0
  },
  film_mark: {
    id: 'film_mark',
    label: '35mm Exposure',
    category: 'graphic',
    defaultScale: 1,
    defaultRotation: 0
  }
};

/**
 * Creates a new sticker object instance with unique identifier and placement defaults.
 * @param {string} typeId
 * @param {number} x
 * @param {number} y
 * @returns {object}
 */
export function createStickerInstance(typeId, x = 400, y = 400) {
  const meta = STICKER_TYPES[typeId] || STICKER_TYPES.washi_cream;
  return {
    id: `sticker_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    type: meta.id,
    x,
    y,
    scale: meta.defaultScale,
    rotation: meta.defaultRotation
  };
}
