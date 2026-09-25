/**
 * Direct Webcam Photobooth Engine for Framera Studio.
 * Handles WebRTC camera streams, mirror preview, 3-2-1 countdown timers, and burst photo capture.
 */

let activeMediaStream = null;

/**
 * Starts camera stream and binds it to video element.
 * @param {HTMLVideoElement} videoEl
 * @param {'user'|'environment'} [facingMode='user']
 * @returns {Promise<MediaStream>}
 */
export async function startCameraStream(videoEl, facingMode = 'user') {
  if (!navigator?.mediaDevices?.getUserMedia) {
    throw new Error('Camera access not supported on this browser/environment');
  }

  stopCameraStream(videoEl);

  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      facingMode,
      width: { ideal: 1280 },
      height: { ideal: 720 }
    },
    audio: false
  });

  activeMediaStream = stream;
  if (videoEl) {
    videoEl.srcObject = stream;
    await videoEl.play().catch(() => {});
  }
  return stream;
}

/**
 * Stops active camera stream and frees hardware tracks.
 * @param {HTMLVideoElement|null} [videoEl]
 */
export function stopCameraStream(videoEl) {
  if (activeMediaStream) {
    activeMediaStream.getTracks().forEach((track) => track.stop());
    activeMediaStream = null;
  }
  if (videoEl) {
    videoEl.srcObject = null;
  }
}

/**
 * Captures high-res still image from video element onto canvas.
 * @param {HTMLVideoElement} videoEl
 * @param {object} [options={}]
 * @param {boolean} [options.mirror=true]
 * @returns {{ dataUrl: string, width: number, height: number }}
 */
export function captureVideoFrame(videoEl, options = {}) {
  if (!videoEl || !videoEl.videoWidth || !videoEl.videoHeight) {
    throw new Error('Video frame not ready for snapshot');
  }

  const { mirror = true } = options;
  const width = videoEl.videoWidth;
  const height = videoEl.videoHeight;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (mirror) {
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
  }

  ctx.drawImage(videoEl, 0, 0, width, height);
  const dataUrl = canvas.toDataURL('image/jpeg', 0.95);

  return { dataUrl, width, height };
}

/**
 * Executes an animated 3-2-1 countdown timer.
 * @param {number} seconds
 * @param {(count: number) => void} onTick
 * @returns {Promise<void>}
 */
export function runCountdown(seconds = 3, onTick) {
  return new Promise((resolve) => {
    let current = seconds;
    if (typeof onTick === 'function') onTick(current);

    let timer = null;
    timer = setInterval(() => {
      current -= 1;
      if (typeof onTick === 'function') onTick(current);
      if (current <= 0) {
        if (timer) clearInterval(timer);
        resolve();
      }
    }, 1000);
  });
}

/**
 * Executes a photobooth burst capture sequence across multiple slots.
 * @param {object} params
 * @param {HTMLVideoElement} params.videoEl
 * @param {number} params.photoCount
 * @param {number} [params.countdownSeconds=3]
 * @param {(slotIndex: number, remainingSeconds: number) => void} [params.onTick]
 * @param {(slotIndex: number, result: { dataUrl: string, width: number, height: number }) => void} params.onSnap
 * @param {() => void} [params.onFlash]
 * @returns {Promise<Array<{ dataUrl: string, width: number, height: number }>>}
 */
export async function executePhotoboothBurst({
  videoEl,
  photoCount = 1,
  countdownSeconds = 3,
  onTick,
  onSnap,
  onFlash
}) {
  const count = Math.max(1, photoCount);
  const snapshots = [];

  for (let i = 0; i < count; i++) {
    await runCountdown(countdownSeconds, (sec) => {
      if (typeof onTick === 'function') onTick(i, sec);
    });

    if (typeof onFlash === 'function') onFlash();
    const frame = captureVideoFrame(videoEl, { mirror: true });
    snapshots.push(frame);

    if (typeof onSnap === 'function') {
      onSnap(i, frame);
    }

    // Short breathing delay between snaps if multiple photos
    if (i < count - 1) {
      await new Promise((r) => setTimeout(r, 600));
    }
  }

  return snapshots;
}
