import { focusEditorialTemplate } from './focus_editorial_template.js';

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
}

// Initialize with default template on module load
initDefaultTemplates();
