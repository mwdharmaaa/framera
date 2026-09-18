import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  isRunningStandalone,
  isIosDevice,
  initPwaInstall
} from '../src/features/pwa/install_manager.js';

describe('PWA Mobile Installation Engine', () => {
  it('should detect standalone state safely in node/mock environment', () => {
    assert.strictEqual(typeof isRunningStandalone(), 'boolean');
  });

  it('should detect iOS environment safely in node/mock environment', () => {
    assert.strictEqual(typeof isIosDevice(), 'boolean');
  });

  it('should initialize PWA bindings without throwing in mock environment', () => {
    const mockBtn = {
      style: { display: 'none' },
      addEventListener: () => {}
    };
    const mockModal = {
      style: { display: 'none' }
    };

    assert.doesNotThrow(() => {
      initPwaInstall({
        installBtn: mockBtn,
        iosModal: mockModal
      });
    });
  });
});
