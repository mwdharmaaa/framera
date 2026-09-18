let deferredInstallPrompt = null;

/**
 * Checks if the application is currently running in standalone PWA mode.
 * @returns {boolean}
 */
export function isRunningStandalone() {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true ||
    document.referrer.includes('android-app://')
  );
}

/**
 * Detects whether the current device is running iOS.
 * @returns {boolean}
 */
export function isIosDevice() {
  if (typeof navigator === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

/**
 * Initializes PWA Service Worker and Install App button trigger.
 * @param {object} options
 * @param {HTMLElement|null} options.installBtn
 * @param {HTMLElement|null} [options.iosModal]
 */
export function initPwaInstall(options = {}) {
  const { installBtn, iosModal } = options;

  // 1. Register Service Worker for offline and PWA readiness
  if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {
        // Non-blocking registration fallback
      });
    });
  }

  // 2. Hide button if already installed as standalone
  if (isRunningStandalone()) {
    if (installBtn) installBtn.style.display = 'none';
    return;
  }

  // 3. Handle Chromium beforeinstallprompt (Android / Desktop)
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredInstallPrompt = e;
      if (installBtn) {
        installBtn.style.display = 'inline-flex';
      }
    });

    window.addEventListener('appinstalled', () => {
      deferredInstallPrompt = null;
      if (installBtn) installBtn.style.display = 'none';
    });
  }

  // 4. Bind install button action
  if (installBtn) {
    // Show button on iOS as well so users can learn how to install to home screen
    if (isIosDevice() && !isRunningStandalone()) {
      installBtn.style.display = 'inline-flex';
    }

    installBtn.addEventListener('click', async () => {
      if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        const { outcome } = await deferredInstallPrompt.userChoice;
        if (outcome === 'accepted') {
          deferredInstallPrompt = null;
          installBtn.style.display = 'none';
        }
      } else if (isIosDevice()) {
        if (iosModal) {
          iosModal.style.display = 'flex';
        } else {
          alert('To install Framera on your iPhone/iPad: tap the Share icon at the bottom of Safari, then choose "Add to Home Screen".');
        }
      } else {
        alert('To install Framera: open your browser menu and choose "Install App" or "Add to Home Screen".');
      }
    });
  }
}
