/**
 * Creates and initializes an offscreen HTMLCanvas element.
 * @param {number} [width=1200]
 * @param {number} [height=1500]
 * @returns {{ canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D }}
 */
export function createStudioCanvas(width = 1200, height = 1500) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to acquire 2D canvas context.');
  }
  return { canvas, ctx };
}

/**
 * Loads an image from URI or data URL asynchronously.
 * @param {string} src
 * @returns {Promise<HTMLImageElement>}
 */
export function loadStudioImage(src) {
  return new Promise((resolve, reject) => {
    if (!src) return reject(new Error('Image source is empty.'));
    const img = new Image();
    if (!src.startsWith('data:')) {
      img.crossOrigin = 'anonymous';
    }
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image asset.'));
    img.src = src;
  });
}

/**
 * Wraps text into multiline blocks with maxLines limitation.
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} text
 * @param {number} x
 * @param {number} y
 * @param {number} maxWidth
 * @param {number} lineHeight
 * @param {number} [maxLines=4]
 */
export function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 4) {
  const paragraphs = String(text || '').split('\n');
  let currentY = y;
  let linesDrawn = 0;

  for (const para of paragraphs) {
    const words = para.split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line.trim(), x, currentY);
        linesDrawn++;
        if (linesDrawn >= maxLines) return;
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    if (line.trim()) {
      ctx.fillText(line.trim(), x, currentY);
      linesDrawn++;
      if (linesDrawn >= maxLines) return;
      currentY += lineHeight;
    }
  }
}

/**
 * Draws a subtle placeholder inside frame when no user photo is loaded.
 * @param {CanvasRenderingContext2D} ctx
 * @param {{ x: number, y: number, w: number, h: number }} frame
 * @param {string} [themeColor='#3b82f6']
 */
export function renderPlaceholder(ctx, frame, themeColor = 'rgba(255,255,255,0.15)') {
  const { x, y, w, h } = frame;
  const cx = x + w / 2;
  const cy = y + h / 2;

  ctx.save();
  ctx.strokeStyle = themeColor;
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, w, h);

  // Subtle diagonal watermark
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w, y + h);
  ctx.moveTo(x + w, y);
  ctx.lineTo(x, y + h);
  ctx.stroke();

  // Central circle and cross
  ctx.beginPath();
  ctx.arc(cx, cy, 36, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx - 15, cy);
  ctx.lineTo(cx + 15, cy);
  ctx.moveTo(cx, cy - 15);
  ctx.lineTo(cx, cy + 15);
  ctx.stroke();

  ctx.restore();
}
