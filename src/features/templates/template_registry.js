import { focusEditorialTemplate } from './focus_editorial_template.js';
import { wincoreTemplate } from './wincore_template.js';
import { cinemaPosterTemplate } from './cinema_poster_template.js';
import { astralKoiTemplate } from './astral_koi_template.js';
import { tokyoBrutalistTemplate } from './tokyo_brutalist_template.js';
import { perfectEditorialTemplate } from './perfect_editorial_template.js';
import { viewfinderTemplate } from './viewfinder_template.js';
import { instagram95Template } from './instagram95_template.js';

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
  registerTemplate(perfectEditorialTemplate);
  registerTemplate(viewfinderTemplate);
  registerTemplate(instagram95Template);
}

// Initialize with default template on module load
initDefaultTemplates();
