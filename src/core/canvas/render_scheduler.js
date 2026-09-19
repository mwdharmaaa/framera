/**
 * Frame-Rate Optimized Render Scheduler for Framera Canvas.
 * Coalesces rapid state updates into requestAnimationFrame ticks.
 */

/**
 * Creates an isolated render scheduler.
 * @returns {object} Scheduler instance
 */
export function createRenderScheduler() {
  let rafId = null;
  let isRendering = false;
  let pendingTask = null;

  const flush = async () => {
    rafId = null;
    if (!pendingTask || isRendering) return;

    const task = pendingTask;
    pendingTask = null;
    isRendering = true;

    try {
      await task();
    } catch (err) {
      console.warn('[RenderScheduler] Render frame error:', err);
    } finally {
      isRendering = false;
      if (pendingTask) {
        scheduleNext();
      }
    }
  };

  const scheduleNext = () => {
    if (rafId !== null) return;
    if (typeof requestAnimationFrame === 'function') {
      rafId = requestAnimationFrame(flush);
    } else {
      // Fallback for non-browser or node environments
      rafId = setTimeout(flush, 16);
    }
  };

  return {
    /**
     * Schedules a render task on the next animation frame.
     * Overwrites any pending task with the freshest task.
     * @param {() => Promise<void>|void} task
     */
    schedule(task) {
      pendingTask = task;
      if (!isRendering) {
        scheduleNext();
      }
    },

    /**
     * Cancels any pending scheduled render task.
     */
    cancel() {
      if (rafId !== null) {
        if (typeof cancelAnimationFrame === 'function') {
          cancelAnimationFrame(rafId);
        } else {
          clearTimeout(rafId);
        }
        rafId = null;
      }
      pendingTask = null;
    },

    /**
     * Returns whether a render is currently in-flight or scheduled.
     * @returns {boolean}
     */
    isBusy() {
      return isRendering || pendingTask !== null || rafId !== null;
    }
  };
}

export const globalRenderScheduler = createRenderScheduler();
