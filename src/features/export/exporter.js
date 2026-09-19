/**
 * Canvas Image Exporter for Framera Studio.
 * Supports PNG, JPEG, WEBP encoding, clipboard bitmaps, Web Share API, and native Android bridge.
 */

/**
 * Triggers file download or native Android gallery save of canvas content.
 * @param {HTMLCanvasElement} canvas
 * @param {string} [filename='framera-photo.png']
 * @param {object} [options={}]
 * @param {'png'|'jpeg'|'webp'} [options.format='png']
 * @param {number} [options.quality=0.92]
 */
export function downloadCanvasImage(canvas, filename = 'framera-photo.png', options = {}) {
  if (!canvas) return;

  const format = options.format || (filename.endsWith('.jpg') || filename.endsWith('.jpeg') ? 'jpeg' : filename.endsWith('.webp') ? 'webp' : 'png');
  const mimeType = format === 'jpeg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
  const quality = options.quality ?? (format === 'png' ? undefined : 0.92);

  const dataUrl = canvas.toDataURL(mimeType, quality);

  // Check for native Android WebView bridge
  if (typeof window !== 'undefined' && window.FrameraNative?.saveImageToGallery) {
    try {
      window.FrameraNative.saveImageToGallery(dataUrl, filename);
      return;
    } catch (err) {
      console.warn('[Exporter] Native gallery save failed, falling back to browser download:', err);
    }
  }

  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Copies canvas PNG bitmap directly to system clipboard.
 * @param {HTMLCanvasElement} canvas
 * @returns {Promise<boolean>}
 */
export async function copyCanvasImage(canvas) {
  if (!canvas) return false;

  return new Promise((resolve) => {
    canvas.toBlob(async (blob) => {
      if (!blob) return resolve(false);

      try {
        if (navigator.clipboard && window.ClipboardItem) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          resolve(true);
        } else {
          const dataUrl = canvas.toDataURL('image/png');
          await navigator.clipboard.writeText(dataUrl);
          resolve(true);
        }
      } catch (err) {
        console.warn('[Exporter] Failed to copy canvas image:', err);
        resolve(false);
      }
    }, 'image/png');
  });
}

/**
 * Shares canvas image via Web Share API or native Android Intent.
 * @param {HTMLCanvasElement} canvas
 * @param {string} [title='Framera Photo']
 * @returns {Promise<boolean>}
 */
export async function shareCanvasImage(canvas, title = 'Framera Photo') {
  if (!canvas) return false;

  const dataUrl = canvas.toDataURL('image/png');

  if (typeof window !== 'undefined' && window.FrameraNative?.shareImage) {
    try {
      window.FrameraNative.shareImage(dataUrl, title);
      return true;
    } catch {
      // Fallback to Web Share API
    }
  }

  if (typeof navigator !== 'undefined' && navigator.share && canvas.toBlob) {
    return new Promise((resolve) => {
      canvas.toBlob(async (blob) => {
        if (!blob) return resolve(false);
        try {
          const file = new File([blob], 'framera-photo.png', { type: 'image/png' });
          if (navigator.canShare && !navigator.canShare({ files: [file] })) {
            return resolve(false);
          }
          await navigator.share({ title, files: [file] });
          resolve(true);
        } catch {
          resolve(false);
        }
      }, 'image/png');
    });
  }

  return false;
}
