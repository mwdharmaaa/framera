/**
 * Lightweight Client-Side Image Intake Resizer for Framera.
 * Prevents memory exhaustion on low-end mobile devices ("hp kentang")
 * by downscaling high-megapixel camera uploads before entering studio state.
 */

export const MAX_INTAKE_DIMENSION = 1920;

/**
 * Calculates constrained dimensions while preserving aspect ratio.
 * @param {number} width
 * @param {number} height
 * @param {number} [maxDim=MAX_INTAKE_DIMENSION]
 * @returns {{ width: number, height: number, wasResized: boolean }}
 */
export function calculateFitDimensions(width, height, maxDim = MAX_INTAKE_DIMENSION) {
  if (!width || !height || (width <= maxDim && height <= maxDim)) {
    return { width, height, wasResized: false };
  }

  const ratio = Math.min(maxDim / width, maxDim / height);
  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
    wasResized: true
  };
}

/**
 * Downscales an HTMLImageElement if it exceeds maximum dimensions.
 * Returns the original image if within bounds, or a downscaled image.
 * @param {HTMLImageElement} img
 * @param {number} [maxDim=MAX_INTAKE_DIMENSION]
 * @returns {Promise<{ img: HTMLImageElement, dataUrl?: string }>}
 */
export async function normalizeImageDimensions(img, maxDim = MAX_INTAKE_DIMENSION) {
  if (!img) return { img };

  const srcWidth = img.naturalWidth || img.width || 0;
  const srcHeight = img.naturalHeight || img.height || 0;

  const { width: targetW, height: targetH, wasResized } = calculateFitDimensions(srcWidth, srcHeight, maxDim);

  if (!wasResized || typeof document === 'undefined') {
    return { img, dataUrl: img.src };
  }

  try {
    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return { img, dataUrl: img.src };

    ctx.drawImage(img, 0, 0, targetW, targetH);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.90);

    return new Promise((resolve) => {
      const resizedImg = new Image();
      resizedImg.onload = () => resolve({ img: resizedImg, dataUrl });
      resizedImg.onerror = () => resolve({ img, dataUrl: img.src });
      resizedImg.src = dataUrl;
    });
  } catch {
    return { img, dataUrl: img.src };
  }
}

/**
 * Loads a File object and normalizes it to safe dimensions.
 * @param {File} file
 * @param {number} [maxDim=MAX_INTAKE_DIMENSION]
 * @returns {Promise<{ img: HTMLImageElement, dataUrl: string }>}
 */
export function loadAndNormalizeFile(file, maxDim = MAX_INTAKE_DIMENSION) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type?.startsWith('image/')) {
      return reject(new Error('Invalid image file'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = async (e) => {
      const rawDataUrl = String(e.target?.result || '');
      const tempImg = new Image();
      tempImg.onerror = () => reject(new Error('Failed to decode image'));
      tempImg.onload = async () => {
        try {
          const result = await normalizeImageDimensions(tempImg, maxDim);
          resolve({
            img: result.img,
            dataUrl: result.dataUrl || rawDataUrl
          });
        } catch {
          resolve({ img: tempImg, dataUrl: rawDataUrl });
        }
      };
      tempImg.src = rawDataUrl;
    };

    reader.readAsDataURL(file);
  });
}
