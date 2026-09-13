import { renderPolaroidTemplate, POLAROID_CONFIG } from './polaroid_template.js';
import { renderMagazineTemplate, MAGAZINE_CONFIG } from './magazine_template.js';
import { renderCyberTemplate, CYBER_CONFIG } from './cyber_template.js';
import { renderBrutalistTemplate, BRUTALIST_CONFIG } from './brutalist_template.js';
import { renderCinematicTemplate, CINEMATIC_CONFIG } from './cinematic_template.js';

export const TEMPLATE_REGISTRY = {
  polaroid: {
    id: 'polaroid',
    name: 'Polaroid Instant',
    description: 'Classic warm cream vintage border with handwritten caption',
    config: POLAROID_CONFIG,
    render: renderPolaroidTemplate
  },
  magazine: {
    id: 'magazine',
    name: 'Vogue Editorial',
    description: 'High-fashion editorial cover with bold typography and barcode',
    config: MAGAZINE_CONFIG,
    render: renderMagazineTemplate
  },
  cyber: {
    id: 'cyber',
    name: 'Cyber Telemetry',
    description: 'Sci-Fi HUD targeting frame with coordinates and neon grid',
    config: CYBER_CONFIG,
    render: renderCyberTemplate
  },
  brutalist: {
    id: 'brutalist',
    name: 'Neo-Brutalist',
    description: 'Industrial heavy borders with lime accents and telemetry specs',
    config: BRUTALIST_CONFIG,
    render: renderBrutalistTemplate
  },
  cinematic: {
    id: 'cinematic',
    name: '35mm Film Strip',
    description: 'Authentic Kodak perforated film borders with exposure stamps',
    config: CINEMATIC_CONFIG,
    render: renderCinematicTemplate
  }
};

/**
 * Retrieves template definition by ID with fallback to polaroid.
 * @param {string} id
 * @returns {object}
 */
export function getTemplate(id) {
  return TEMPLATE_REGISTRY[id] || TEMPLATE_REGISTRY.polaroid;
}

/**
 * Returns an array of all registered templates.
 * @returns {Array<object>}
 */
export function listTemplates() {
  return Object.values(TEMPLATE_REGISTRY);
}
