import { focusEditorialTemplate } from './focus_editorial_template.js';
import { wincoreTemplate } from './wincore_template.js';
import { cinemaPosterTemplate } from './cinema_poster_template.js';
import { astralKoiTemplate } from './astral_koi_template.js';
import { tokyoBrutalistTemplate } from './tokyo_brutalist_template.js';
import { viewfinderTemplate } from './viewfinder_template.js';
import { instagram95Template } from './instagram95_template.js';
import { aiVisionTemplate } from './ai_vision_template.js';
import { fisheyeTemplate } from './fisheye_template.js';
import { comicPortalTemplate } from './comic_portal_template.js';
import { foldedPosterTemplate } from './folded_poster_template.js';
import { filmstripDuoTemplate } from './filmstrip_duo_template.js';
import { diptychDuoTemplate } from './diptych_duo_template.js';
import { photoboothTrioTemplate } from './photobooth_trio_template.js';
import { cinemaTriptychTemplate } from './cinema_triptych_template.js';
import { photoboothQuadTemplate } from './photobooth_quad_template.js';
import { quadGridTemplate } from './quad_grid_template.js';

export const TEMPLATE_REGISTRY = {};

/**
 * Retrieves a registered template by ID.
 * @param {string} id
 * @returns {object|null}
 */
export function getTemplate(id) {
  return TEMPLATE_REGISTRY[id] || null;
}

/**
 * Returns a list of all registered templates.
 * @returns {Array<object>}
 */
export function listTemplates() {
  return Object.values(TEMPLATE_REGISTRY);
}

/**
 * Registers a new template into the registry.
 * @param {object} template
 */
export function registerTemplate(template) {
  if (!template || !template.id || typeof template.render !== 'function') {
    throw new Error('Template must have a valid id and render function.');
  }
  TEMPLATE_REGISTRY[template.id] = template;
}

/**
 * Clears all registered templates from the registry.
 */
export function clearTemplates() {
  Object.keys(TEMPLATE_REGISTRY).forEach((key) => delete TEMPLATE_REGISTRY[key]);
}

/**
 * Populates registry with default studio templates.
 */
export function initDefaultTemplates() {
  clearTemplates();
  registerTemplate(focusEditorialTemplate);
  registerTemplate(wincoreTemplate);
  registerTemplate(cinemaPosterTemplate);
  registerTemplate(astralKoiTemplate);
  registerTemplate(tokyoBrutalistTemplate);
  registerTemplate(viewfinderTemplate);
  registerTemplate(instagram95Template);
  registerTemplate(aiVisionTemplate);
  registerTemplate(fisheyeTemplate);
  registerTemplate(comicPortalTemplate);
  registerTemplate(foldedPosterTemplate);
  registerTemplate(filmstripDuoTemplate);
  registerTemplate(diptychDuoTemplate);
  registerTemplate(photoboothTrioTemplate);
  registerTemplate(cinemaTriptychTemplate);
  registerTemplate(photoboothQuadTemplate);
  registerTemplate(quadGridTemplate);
}

// Initialize with default template on module load
initDefaultTemplates();
