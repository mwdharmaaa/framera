/**
 * Triggers a browser file download of the canvas content.
 * @param {HTMLCanvasElement} canvas
 * @param {string} [filename='framera-photo.png']
 */
export function downloadCanvasImage(canvas, filename = 'framera-photo.png') {
  if (!canvas) return;
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Copies the canvas PNG bitmap directly to the system clipboard.
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
          // Fallback to dataURL text copy
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
