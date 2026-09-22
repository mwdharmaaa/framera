import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeText,
  getTemplateTokens,
  matchesSearchQuery,
  matchesHashtag,
  extractAvailableTags,
  filterTemplates
} from '../src/features/gallery/search_filter.js';

describe('Gallery Search & Hashtag Filtering Engine', () => {
  const sampleTemplates = [
    {
      id: 'vintage_diptych',
      name: 'Vintage Minimal Diptych',
      description: 'Analog film borders with clean split layout',
      tag: 'VINTAGE',
      photoCount: 2,
      aspectRatio: '4:5',
      category: '2'
    },
    {
      id: 'urban_cinema_trio',
      name: 'Urban Cinema Trio',
      description: 'Letterbox cinematic frames for city photography',
      tag: 'CINEMA',
      tags: ['film', 'dark'],
      photoCount: 3,
      aspectRatio: '9:16',
      category: '3'
    },
    {
      id: 'silver_gelatin_duo',
      name: 'Silver Gelatin Analog Duo',
      description: 'Monochrome vintage analog paper prints in B&W',
      tag: 'ANALOG',
      tags: ['bnw', 'vintage'],
      photoCount: 2,
      aspectRatio: '9:16',
      category: '2'
    },
    {
      id: 'y2k_cyber_single',
      name: 'Y2K Cyber Glitch',
      description: 'Futuristic aesthetic with neon stickers and chrome',
      tag: 'Y2K',
      photoCount: 1,
      aspectRatio: '3:4',
      category: '1'
    }
  ];

  describe('normalizeText', () => {
    it('should lowercase, trim, and strip leading hash symbols', () => {
      assert.strictEqual(normalizeText('  #Vintage  '), 'vintage');
      assert.strictEqual(normalizeText('###FILM'), 'film');
      assert.strictEqual(normalizeText('Minimalist  '), 'minimalist');
    });

    it('should safely return empty string for non-string or falsy inputs', () => {
      assert.strictEqual(normalizeText(null), '');
      assert.strictEqual(normalizeText(undefined), '');
      assert.strictEqual(normalizeText(''), '');
      assert.strictEqual(normalizeText(123), '');
    });
  });

  describe('getTemplateTokens', () => {
    it('should extract comprehensive token set from template metadata', () => {
      const tokens = getTemplateTokens(sampleTemplates[0]);
      assert.ok(tokens.includes('vintage'));
      assert.ok(tokens.includes('minimal'));
      assert.ok(tokens.includes('diptych'));
      assert.ok(tokens.includes('analog'));
      assert.ok(tokens.includes('film'));
      assert.ok(tokens.includes('2'));
      assert.ok(tokens.includes('2foto'));
      assert.ok(tokens.includes('duo'));
    });

    it('should handle missing or empty fields gracefully', () => {
      const tokens = getTemplateTokens({});
      assert.deepStrictEqual(tokens, []);
      assert.deepStrictEqual(getTemplateTokens(null), []);
    });
  });

  describe('matchesSearchQuery', () => {
    it('should match any template when query is empty or whitespace', () => {
      assert.strictEqual(matchesSearchQuery(sampleTemplates[0], ''), true);
      assert.strictEqual(matchesSearchQuery(sampleTemplates[0], '   '), true);
      assert.strictEqual(matchesSearchQuery(sampleTemplates[0], null), true);
    });

    it('should match by name, description, id, or tag substring', () => {
      assert.strictEqual(matchesSearchQuery(sampleTemplates[0], 'vintage'), true);
      assert.strictEqual(matchesSearchQuery(sampleTemplates[0], 'analog'), true);
      assert.strictEqual(matchesSearchQuery(sampleTemplates[0], 'diptych'), true);
      assert.strictEqual(matchesSearchQuery(sampleTemplates[1], 'cinema'), true);
      assert.strictEqual(matchesSearchQuery(sampleTemplates[1], 'letterbox'), true);
    });

    it('should match queries prefixed with hash symbols', () => {
      assert.strictEqual(matchesSearchQuery(sampleTemplates[0], '#vintage'), true);
      assert.strictEqual(matchesSearchQuery(sampleTemplates[2], '#bnw'), true);
    });

    it('should enforce multi-term matching (AND logic)', () => {
      assert.strictEqual(matchesSearchQuery(sampleTemplates[0], 'vintage duo'), true);
      assert.strictEqual(matchesSearchQuery(sampleTemplates[0], 'vintage cyber'), false);
    });

    it('should match photo count aliases like duo or trio', () => {
      assert.strictEqual(matchesSearchQuery(sampleTemplates[0], 'duo'), true);
      assert.strictEqual(matchesSearchQuery(sampleTemplates[1], 'trio'), true);
      assert.strictEqual(matchesSearchQuery(sampleTemplates[3], 'single'), true);
    });
  });

  describe('matchesHashtag', () => {
    it('should match all when tag is all, semua, or empty', () => {
      assert.strictEqual(matchesHashtag(sampleTemplates[0], 'all'), true);
      assert.strictEqual(matchesHashtag(sampleTemplates[0], 'semua'), true);
      assert.strictEqual(matchesHashtag(sampleTemplates[0], ''), true);
      assert.strictEqual(matchesHashtag(sampleTemplates[0], null), true);
    });

    it('should match specific hashtag with or without leading hash', () => {
      assert.strictEqual(matchesHashtag(sampleTemplates[0], 'vintage'), true);
      assert.strictEqual(matchesHashtag(sampleTemplates[0], '#vintage'), true);
      assert.strictEqual(matchesHashtag(sampleTemplates[2], '#bnw'), true);
      assert.strictEqual(matchesHashtag(sampleTemplates[3], '#y2k'), true);
    });

    it('should reject non-matching hashtags', () => {
      assert.strictEqual(matchesHashtag(sampleTemplates[3], 'vintage'), false);
      assert.strictEqual(matchesHashtag(sampleTemplates[0], 'cinema'), false);
    });
  });

  describe('extractAvailableTags', () => {
    it('should derive unique aesthetic hashtag list with frequency counts sorted descending', () => {
      const tags = extractAvailableTags(sampleTemplates);
      assert.ok(Array.isArray(tags));
      assert.ok(tags.length > 0);

      // Vintage appears in sampleTemplates[0] and sampleTemplates[2]
      const vintageTag = tags.find((t) => t.tag === 'vintage');
      assert.ok(vintageTag);
      assert.strictEqual(vintageTag.count, 2);
      assert.strictEqual(vintageTag.label, '#vintage');

      // Check sorting descending by count
      for (let i = 0; i < tags.length - 1; i++) {
        assert.ok(tags[i].count >= tags[i + 1].count);
      }
    });

    it('should return empty array for non-array input', () => {
      assert.deepStrictEqual(extractAvailableTags(null), []);
      assert.deepStrictEqual(extractAvailableTags(undefined), []);
    });
  });

  describe('filterTemplates (Unified Filter Engine)', () => {
    it('should return all templates when default criteria is used', () => {
      const results = filterTemplates(sampleTemplates, {});
      assert.strictEqual(results.length, sampleTemplates.length);
    });

    it('should filter strictly by category (photo count)', () => {
      const duoResults = filterTemplates(sampleTemplates, { category: '2' });
      assert.strictEqual(duoResults.length, 2);
      assert.ok(duoResults.every((t) => t.photoCount === 2));
    });

    it('should filter strictly by hashtag', () => {
      const vintageResults = filterTemplates(sampleTemplates, { tag: '#vintage' });
      assert.strictEqual(vintageResults.length, 2);
      assert.ok(vintageResults.some((t) => t.id === 'vintage_diptych'));
      assert.ok(vintageResults.some((t) => t.id === 'silver_gelatin_duo'));
    });

    it('should filter strictly by search query', () => {
      const cinemaResults = filterTemplates(sampleTemplates, { query: 'cinema' });
      assert.strictEqual(cinemaResults.length, 1);
      assert.strictEqual(cinemaResults[0].id, 'urban_cinema_trio');
    });

    it('should compose category, hashtag, and search query together', () => {
      const combined = filterTemplates(sampleTemplates, {
        category: '2',
        tag: 'vintage',
        query: 'monochrome'
      });
      assert.strictEqual(combined.length, 1);
      assert.strictEqual(combined[0].id, 'silver_gelatin_duo');
    });

    it('should return empty list when no template satisfies combined criteria', () => {
      const none = filterTemplates(sampleTemplates, {
        category: '3',
        tag: 'y2k',
        query: 'cinema'
      });
      assert.strictEqual(none.length, 0);
    });
  });
});
