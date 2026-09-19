import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { tripToHillTemplate } from '../src/features/templates/trip_to_hill_template.js';
import { getTemplate } from '../src/features/templates/template_registry.js';
import {
  TRIP_TO_HILL_LAYOUT,
  TOP_TEAR_PROFILE,
  BOTTOM_TEAR_PROFILE,
  traceTornEdgePath,
  drawTornPaperRibbon,
  renderTornSlotPhoto,
  renderTripToHillOverlays
} from '../src/features/templates/trip_to_hill_helpers.js';

describe('Trip To Hill Torn Trio Template', () => {
  it('should have valid metadata and 9:16 (736x1308) canvas configuration with 3 photos', () => {
    assert.strictEqual(tripToHillTemplate.id, 'trip_to_hill');
    assert.strictEqual(tripToHillTemplate.name, 'Trip To Hill Torn Trio');
    assert.strictEqual(tripToHillTemplate.aspectRatio, '9:16');
    assert.strictEqual(tripToHillTemplate.photoCount, 3);
    assert.strictEqual(tripToHillTemplate.category, '3');
    assert.strictEqual(tripToHillTemplate.config.canvasWidth, 736);
    assert.strictEqual(tripToHillTemplate.config.canvasHeight, 1308);
    assert.strictEqual(tripToHillTemplate.tag, 'TORN TRIO');
  });

  it('should be registered in the global template registry', () => {
    const registered = getTemplate('trip_to_hill');
    assert.ok(registered, 'trip_to_hill should be registered');
    assert.strictEqual(registered.id, 'trip_to_hill');
    assert.strictEqual(registered.category, '3');
  });

  it('should define precise torn edge coordinates spanning the full canvas width', () => {
    assert.strictEqual(TRIP_TO_HILL_LAYOUT.canvasWidth, 736);
    assert.strictEqual(TRIP_TO_HILL_LAYOUT.canvasHeight, 1308);
    assert.strictEqual(TRIP_TO_HILL_LAYOUT.slots.length, 3);

    // Top tear profile check
    assert.ok(TOP_TEAR_PROFILE.length >= 20);
    assert.strictEqual(TOP_TEAR_PROFILE[0][0], 0);
    assert.strictEqual(TOP_TEAR_PROFILE[TOP_TEAR_PROFILE.length - 1][0], 736);

    // Bottom tear profile check
    assert.ok(BOTTOM_TEAR_PROFILE.length >= 20);
    assert.strictEqual(BOTTOM_TEAR_PROFILE[0][0], 0);
    assert.strictEqual(BOTTOM_TEAR_PROFILE[BOTTOM_TEAR_PROFILE.length - 1][0], 736);
  });

  it('should render safely with mock context in various photo configurations', () => {
    const mockCtx = {
      save() {},
      restore() {},
      fillRect() {},
      beginPath() {},
      closePath() {},
      rect() {},
      moveTo() {},
      lineTo() {},
      fill() {},
      stroke() {},
      clip() {},
      drawImage() {},
      fillText() {},
      font: '',
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      shadowColor: '',
      shadowBlur: 0,
      shadowOffsetY: 0,
      textAlign: '',
      textBaseline: ''
    };

    const mockImg = {
      src: 'assets/trip_to_hill_reference.jpg',
      naturalWidth: 736,
      naturalHeight: 1308,
      width: 736,
      height: 1308
    };

    // 1. Direct reference preview mode
    assert.doesNotThrow(() => {
      tripToHillTemplate.render(mockCtx, mockImg, {
        drawX: 0,
        drawY: 0,
        drawW: 736,
        drawH: 1308
      }, { isUserUploaded: false });
    });

    // 2. Full 3-photo user uploaded state
    const photos3 = [
      { width: 800, height: 600, naturalWidth: 800, naturalHeight: 600 },
      { width: 800, height: 600, naturalWidth: 800, naturalHeight: 600 },
      { width: 800, height: 600, naturalWidth: 800, naturalHeight: 600 }
    ];

    assert.doesNotThrow(() => {
      tripToHillTemplate.render(mockCtx, photos3[0], {}, {
        isUserUploaded: true,
        photoImgs: photos3,
        caption: 'Trip To Hill',
        subtitle: 'Story behind',
        date: 'at Bukit Cita - Cita'
      });
    });

    // 3. Fallbacks for 2, 1, and 0 photos
    assert.doesNotThrow(() => {
      tripToHillTemplate.render(mockCtx, photos3[0], {}, {
        isUserUploaded: true,
        photos: [photos3[0], photos3[1]]
      });
      tripToHillTemplate.render(mockCtx, photos3[0], {}, {
        isUserUploaded: true,
        photoImg: photos3[0]
      });
      tripToHillTemplate.render(mockCtx, null, {}, {
        isUserUploaded: true,
        photoImgs: []
      });
    });
  });

  it('should execute helper routines safely without throwing', () => {
    let lineToCount = 0;
    const mockCtx = {
      save() {},
      restore() {},
      beginPath() {},
      closePath() {},
      moveTo() {},
      lineTo() { lineToCount++; },
      fill() {},
      stroke() {},
      clip() {},
      drawImage() {},
      fillText() {}
    };

    traceTornEdgePath(mockCtx, TOP_TEAR_PROFILE, false);
    assert.ok(lineToCount > 0);

    const prevCount = lineToCount;
    traceTornEdgePath(mockCtx, TOP_TEAR_PROFILE, true);
    assert.ok(lineToCount > prevCount);

    assert.doesNotThrow(() => drawTornPaperRibbon(mockCtx, TOP_TEAR_PROFILE, 14));
    assert.doesNotThrow(() => drawTornPaperRibbon(null, TOP_TEAR_PROFILE, 14));

    const photo = { naturalWidth: 800, naturalHeight: 600 };
    assert.doesNotThrow(() => renderTornSlotPhoto(mockCtx, photo, () => {}, { y: 0, h: 300 }));
    assert.doesNotThrow(() => renderTornSlotPhoto(null, photo, () => {}, { y: 0, h: 300 }));

    assert.doesNotThrow(() => renderTripToHillOverlays(mockCtx, { caption: 'Trip', subtitle: 'Story' }));
    assert.doesNotThrow(() => renderTripToHillOverlays(mockCtx, {}));
    assert.doesNotThrow(() => renderTripToHillOverlays(null, {}));
  });
});
