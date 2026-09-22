/**
 * Normalizes text for clean substring and token matching.
 * @param {string} text
 * @returns {string}
 */
export function normalizeText(text) {
  if (!text || typeof text !== 'string') return '';
  return text.toLowerCase().trim().replace(/^#+/, '');
}

/**
 * Extracts all searchable keyword tokens from a template instance.
 * @param {object} tpl
 * @returns {Array<string>}
 */
export function getTemplateTokens(tpl) {
  if (!tpl) return [];
  const tokens = new Set();

  const addStr = (str) => {
    if (!str || typeof str !== 'string') return;
    str.toLowerCase().split(/[\s,_\-/#]+/).forEach((word) => {
      const clean = word.trim();
      if (clean.length > 0) tokens.add(clean);
    });
  };

  addStr(tpl.id);
  addStr(tpl.name);
  addStr(tpl.description);
  addStr(tpl.tag);
  addStr(tpl.aspectRatio);

  if (Array.isArray(tpl.tags)) {
    tpl.tags.forEach((t) => addStr(t));
  }

  if (tpl.photoCount) {
    tokens.add(String(tpl.photoCount));
    tokens.add(`${tpl.photoCount}foto`);
    if (tpl.photoCount === 1) tokens.add('single');
    if (tpl.photoCount === 2) tokens.add('duo');
    if (tpl.photoCount === 3) tokens.add('trio');
    if (tpl.photoCount === 4) tokens.add('quad');
  }

  return Array.from(tokens);
}

/**
 * Checks if a template matches a free-text search query.
 * @param {object} tpl
 * @param {string} query
 * @returns {boolean}
 */
export function matchesSearchQuery(tpl, query) {
  const q = normalizeText(query);
  if (!q) return true;

  const terms = q.split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;

  const tokens = getTemplateTokens(tpl);
  const fullHaystack = `${tpl.name || ''} ${tpl.description || ''} ${tpl.tag || ''} ${tpl.id || ''}`.toLowerCase();

  // Every search term must match either as a token prefix or within the full text
  return terms.every((term) => {
    return fullHaystack.includes(term) || tokens.some((tok) => tok.startsWith(term) || tok.includes(term));
  });
}

/**
 * Checks if a template matches a selected hashtag.
 * @param {object} tpl
 * @param {string} tag
 * @returns {boolean}
 */
export function matchesHashtag(tpl, tag) {
  const t = normalizeText(tag);
  if (!t || t === 'all' || t === 'semua') return true;

  const tokens = getTemplateTokens(tpl);
  return tokens.some((tok) => tok === t || tok.startsWith(t) || tok.includes(t));
}

/**
 * Derives unique curated hashtag chips with frequency counts from templates.
 * @param {Array<object>} templates
 * @returns {Array<{ tag: string, label: string, count: number }>}
 */
export function extractAvailableTags(templates) {
  if (!Array.isArray(templates)) return [];

  const tagCounts = new Map();

  templates.forEach((tpl) => {
    const seenInTpl = new Set();
    const tokens = getTemplateTokens(tpl);

    // Prioritize explicit tag property, fallback to aesthetic keywords
    const candidateTags = [];
    if (tpl.tag) {
      tpl.tag.split(/[\s/]+/).forEach((w) => candidateTags.push(w.toLowerCase()));
    }
    if (Array.isArray(tpl.tags)) {
      tpl.tags.forEach((w) => candidateTags.push(String(w).toLowerCase()));
    }

    // Common curated aesthetic keywords across photography templates
    const curatedKeywords = [
      'vintage', 'editorial', 'minimal', 'bnw', 'y2k', 'film',
      'cinema', 'scrapbook', 'ios', 'poster', 'analog', 'outdoor',
      'journal', 'split', 'duo', 'trio', 'chat', 'aesthetic'
    ];

    curatedKeywords.forEach((kw) => {
      if (tokens.some((tok) => tok === kw || tok.includes(kw))) {
        candidateTags.push(kw);
      }
    });

    candidateTags.forEach((raw) => {
      const clean = normalizeText(raw);
      if (clean && clean.length > 1 && !seenInTpl.has(clean)) {
        seenInTpl.add(clean);
        tagCounts.set(clean, (tagCounts.get(clean) || 0) + 1);
      }
    });
  });

  // Sort by popularity / count descending
  return Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, label: `#${tag}`, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Unified filter combining category, search query, and active hashtag.
 * @param {Array<object>} templates
 * @param {object} criteria
 * @param {string|number} [criteria.category='all']
 * @param {string} [criteria.query='']
 * @param {string} [criteria.tag='all']
 * @returns {Array<object>}
 */
export function filterTemplates(templates, criteria = {}) {
  if (!Array.isArray(templates)) return [];
  const { category = 'all', query = '', tag = 'all' } = criteria;

  return templates.filter((tpl) => {
    // 1. Category check (photo count)
    if (category !== 'all' && category) {
      const count = Number(category);
      const matchesCat = (tpl.category && String(tpl.category) === String(category)) ||
        (tpl.photoCount || 1) === count;
      if (!matchesCat) return false;
    }

    // 2. Hashtag check
    if (!matchesHashtag(tpl, tag)) {
      return false;
    }

    // 3. Search query check
    if (!matchesSearchQuery(tpl, query)) {
      return false;
    }

    return true;
  });
}
