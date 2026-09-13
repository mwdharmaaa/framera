/**
 * Analyzes uploaded image to detect subject silhouette, bounding box, and pose proportions.
 */

/**
 * Analyzes the subject in the photo to compute adaptive alter-ego shadow placement.
 * @param {HTMLImageElement|null} photoImg
 * @param {{ drawX: number, drawY: number, drawW: number, drawH: number }} bounds
 * @param {number} [canvasWidth=1200]
 * @param {number} [canvasHeight=1600]
 * @returns {object}
 */
export function analyzeSubject(photoImg, bounds, canvasWidth = 1200, canvasHeight = 1600) {
  // Default metrics when photo is absent or analysis is unavailable
  const defaults = {
    subjectBox: { minX: 160, maxX: 480, minY: 180, maxY: 1420, w: 320, h: 1240 },
    headPoint: { x: 320, y: 220 },
    shadowPlacement: {
      ox: 800,
      oy: 1420,
      scaleX: 1.05,
      scaleY: 1.05,
      flipX: false
    },
    hasSubject: false
  };

  if (!photoImg || typeof document === 'undefined') {
    return defaults;
  }

  try {
    const sw = 160;
    const sh = 213;
    const offCanvas = document.createElement('canvas');
    offCanvas.width = sw;
    offCanvas.height = sh;
    const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
    if (!offCtx) return defaults;

    // Draw photo into small analysis buffer matching canvas aspect ratio
    const scaleFactorX = sw / canvasWidth;
    const scaleFactorY = sh / canvasHeight;
    offCtx.drawImage(
      photoImg,
      bounds.drawX * scaleFactorX,
      bounds.drawY * scaleFactorY,
      bounds.drawW * scaleFactorX,
      bounds.drawH * scaleFactorY
    );

    const imgData = offCtx.getImageData(0, 0, sw, sh);
    const data = imgData.data;

    // Sample background color from top corners and middle edge
    const sampleIndices = [0, (sw - 1) * 4, (Math.floor(sh / 2) * sw) * 4];
    let avgBgR = 0;
    let avgBgG = 0;
    let avgBgB = 0;
    for (const idx of sampleIndices) {
      avgBgR += data[idx] / sampleIndices.length;
      avgBgG += data[idx + 1] / sampleIndices.length;
      avgBgB += data[idx + 2] / sampleIndices.length;
    }

    let minX = sw;
    let maxX = 0;
    let minY = sh;
    let maxY = 0;
    let count = 0;

    for (let y = 0; y < sh; y++) {
      for (let x = 0; x < sw; x++) {
        const i = (y * sw + x) * 4;
        const a = data[i + 3];
        if (a < 50) continue;

        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const colorDiff = Math.hypot(r - avgBgR, g - avgBgG, b - avgBgB);

        // Pixel qualifies as subject if significantly different from background wall
        if (colorDiff > 32) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
          count++;
        }
      }
    }

    if (count < 200 || minX >= maxX || minY >= maxY) {
      return defaults;
    }

    // Convert normalized coordinates back to canvas dimensions
    const cMinX = (minX / sw) * canvasWidth;
    const cMaxX = (maxX / sw) * canvasWidth;
    const cMinY = (minY / sh) * canvasHeight;
    const cMaxY = (maxY / sh) * canvasHeight;
    const cW = cMaxX - cMinX;
    const cH = cMaxY - cMinY;
    const cCenterX = (cMinX + cMaxX) / 2;

    const headX = Math.round(cCenterX);
    const headY = Math.round(cMinY + cH * 0.1);

    // If subject is on the left half, project shadow to the right; else to the left
    const subjectOnLeft = cCenterX < canvasWidth * 0.52;
    const flipX = !subjectOnLeft;

    const ox = subjectOnLeft
      ? Math.max(cMaxX + cW * 0.45, Math.min(canvasWidth - 280, 800))
      : Math.min(cMinX - cW * 0.45, Math.max(280, 400));

    const oy = Math.min(canvasHeight - 60, Math.max(1200, Math.round(cMaxY)));

    // Scale alter ego shadow to match character's detected height and body build
    const scaleY = Math.max(0.65, Math.min(1.35, cH / 1150));
    const scaleX = Math.max(0.65, Math.min(1.3, cW / 360));

    return {
      subjectBox: { minX: cMinX, maxX: cMaxX, minY: cMinY, maxY: cMaxY, w: cW, h: cH },
      headPoint: { x: headX, y: headY },
      shadowPlacement: {
        ox,
        oy,
        scaleX,
        scaleY,
        flipX
      },
      hasSubject: true
    };
  } catch {
    return defaults;
  }
}
