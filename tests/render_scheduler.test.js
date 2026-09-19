import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { createRenderScheduler } from '../src/core/canvas/render_scheduler.js';

describe('Render Scheduler Engine (rAF Throttling)', () => {
  let scheduler;

  beforeEach(() => {
    scheduler = createRenderScheduler();
  });

  test('should coalesce multiple rapid schedule calls into the latest frame', async () => {
    let executionCount = 0;
    let lastValue = 0;

    scheduler.schedule(() => {
      executionCount++;
      lastValue = 1;
    });

    scheduler.schedule(() => {
      executionCount++;
      lastValue = 2;
    });

    scheduler.schedule(() => {
      executionCount++;
      lastValue = 3;
    });

    assert.equal(scheduler.isBusy(), true);

    // Wait for setTimeout/rAF flush
    await new Promise((r) => setTimeout(r, 40));

    assert.equal(executionCount, 1);
    assert.equal(lastValue, 3);
    assert.equal(scheduler.isBusy(), false);
  });

  test('should allow cancelling pending render tasks', async () => {
    let executed = false;

    scheduler.schedule(() => {
      executed = true;
    });

    scheduler.cancel();
    assert.equal(scheduler.isBusy(), false);

    await new Promise((r) => setTimeout(r, 30));
    assert.equal(executed, false);
  });
});
