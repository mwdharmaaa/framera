import { calculateImageBounds } from '../../core/canvas/bounds.js';

export const BINDER_CLIP_DUO_SLOTS = [
  {
    id: 0,
    name: 'Top Journal Print',
    x: 144,
    y: 112,
    w: 448,
    h: 284
  },
  {
    id: 1,
    name: 'Bottom Hero Photo',
    x: 0,
    y: 490,
    w: 736,
    h: 491
  }
];

/**
 * Renders the clean off-white journal paper background.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cw
 * @param {number} ch
 */
export function renderBackdrop(ctx, cw = 736, ch = 981) {
  if (!ctx) return;
  ctx.save();
  ctx.fillStyle = '#fafaf8';
  ctx.fillRect(0, 0, cw, ch);
  ctx.restore();
}

/**
 * Renders the top photo print with subtle drop shadow and B&W analog grading.
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement|null} photo
 * @param {object} slot
 * @param {object} framing
 */
export function renderTopPhoto(ctx, photo, slot, framing = {}) {
  if (!ctx || !slot) return;
  const { x, y, w, h } = slot;

  ctx.save();

  // Subtle paper elevation shadow
  ctx.shadowColor = 'rgba(20, 20, 25, 0.12)';
  ctx.shadowBlur = 14;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 6;
  ctx.fillStyle = '#101113';
  ctx.fillRect(x, y, w, h);

  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // Clip photo
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();

  if (photo) {
    const pw = photo.naturalWidth || photo.width || w;
    const ph = photo.naturalHeight || photo.height || h;
    const b = calculateImageBounds(pw, ph, { x, y, w, h }, {
      zoom: framing.zoom ?? 1,
      panX: framing.panX ?? 0,
      panY: framing.panY ?? 0,
      fitMode: 'cover'
    });

    try {
      if (ctx.filter !== undefined) {
        ctx.filter = 'grayscale(100%) contrast(124%) brightness(98%)';
      }
      ctx.drawImage(photo, b.drawX, b.drawY, b.drawW, b.drawH);
    } catch {
      // Safe fallback
    } finally {
      if (ctx.filter !== undefined) {
        ctx.filter = 'none';
      }
    }
  }

  // Inner hairline photo edge
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.18)';
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, w, h);

  ctx.restore();
}

/**
 * Renders the 4 metallic binder rings and punched grommet holes.
 * @param {CanvasRenderingContext2D} ctx
 */
export function renderBinderRings(ctx) {
  if (!ctx) return;
  const ringXs = [216, 317, 418, 520];
  const topHoleY = 76;
  const bottomHoleY = 142;

  ctx.save();

  ringXs.forEach((rx) => {
    // 1. Top Grommet (background wall punched hole)
    ctx.beginPath();
    ctx.arc(rx, topHoleY, 7.5, 0, Math.PI * 2);
    ctx.fillStyle = '#d4d4d8';
    ctx.fill();
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = '#52525b';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(rx, topHoleY, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = '#18181b';
    ctx.fill();

    // 2. Bottom Grommet (punched hole inside top photo)
    ctx.beginPath();
    ctx.arc(rx, bottomHoleY, 7.5, 0, Math.PI * 2);
    ctx.fillStyle = '#d4d4d8';
    ctx.fill();
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = '#3f3f46';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(rx, bottomHoleY, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = '#09090b';
    ctx.fill();

    // 3. Metallic Steel Ring Loop (vertical stadium hoop)
    ctx.save();
    // Drop shadow cast onto paper and photo
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;

    ctx.beginPath();
    ctx.moveTo(rx - 5, topHoleY);
    ctx.bezierCurveTo(rx - 8, topHoleY - 12, rx + 8, topHoleY - 12, rx + 5, topHoleY);
    ctx.lineTo(rx + 5, bottomHoleY);
    ctx.bezierCurveTo(rx + 8, bottomHoleY + 12, rx - 8, bottomHoleY + 12, rx - 5, bottomHoleY);
    ctx.closePath();

    ctx.lineWidth = 4.2;
    ctx.strokeStyle = '#a1a1aa';
    ctx.stroke();

    // Specular highlight line along left rim
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.stroke();

    // Dark core shadow line along right rim
    ctx.beginPath();
    ctx.moveTo(rx + 5, topHoleY);
    ctx.lineTo(rx + 5, bottomHoleY);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(39, 39, 42, 0.6)';
    ctx.stroke();

    ctx.restore();
  });

  ctx.restore();
}

/**
 * Renders the elegant serif prose between the two photographs.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cw
 * @param {object} state
 */
export function renderCenterProse(ctx, cw = 736, state = {}) {
  if (!ctx) return;
  const line1 = state?.caption || 'Life is made up of small joys: nice food,';
  const line2 = state?.subtitle || 'gentle breeze, lazy afternoons and peaceful nights.';

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '400 13.5px "Times New Roman", "Playfair Display", Georgia, serif';
  ctx.fillStyle = '#2d2d2d';

  ctx.fillText(line1, cw / 2, 436);
  ctx.fillText(line2, cw / 2, 458);

  ctx.restore();
}

/**
 * Renders the bottom hero photo spanning full width with B&W analog grading.
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement|null} photo
 * @param {object} slot
 * @param {object} framing
 */
export function renderBottomPhoto(ctx, photo, slot, framing = {}) {
  if (!ctx || !slot) return;
  const { x, y, w, h } = slot;

  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();

  ctx.fillStyle = '#0f1115';
  ctx.fillRect(x, y, w, h);

  if (photo) {
    const pw = photo.naturalWidth || photo.width || w;
    const ph = photo.naturalHeight || photo.height || h;
    const b = calculateImageBounds(pw, ph, { x, y, w, h }, {
      zoom: framing.zoom ?? 1,
      panX: framing.panX ?? 0,
      panY: framing.panY ?? 0,
      fitMode: 'cover'
    });

    try {
      if (ctx.filter !== undefined) {
        ctx.filter = 'grayscale(100%) contrast(124%) brightness(98%)';
      }
      ctx.drawImage(photo, b.drawX, b.drawY, b.drawW, b.drawH);
    } catch {
      // Safe fallback
    } finally {
      if (ctx.filter !== undefined) {
        ctx.filter = 'none';
      }
    }
  }

  // Top edge separator hairline
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.12)';
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, w, h);

  ctx.restore();
}

/**
 * Renders the metallic paperclip clipped over the top-right edge of the bottom photo.
 * @param {CanvasRenderingContext2D} ctx
 */
export function renderPaperclip(ctx) {
  if (!ctx) return;
  const cx = 608;
  const cy = 545;
  const tilt = -0.10; // ~5.7 degrees tilt

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(tilt);

  // Drop shadow onto bottom photo
  ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetX = 3.5;
  ctx.shadowOffsetY = 4.5;

  ctx.beginPath();
  // Standard nested paperclip wire path with exact scale
  // 1. Inner tongue end starts at (10, 35)
  ctx.moveTo(10, 35);
  // 2. Straight line up inner right leg to (10, -50)
  ctx.lineTo(10, -50);
  // 3. Inner top bend (radius 15, center at -5, -50)
  ctx.arc(-5, -50, 15, 0, Math.PI, true);
  // 4. Straight line down middle left leg from (-20, -50) to (-20, 65)
  ctx.lineTo(-20, 65);
  // 5. Outer bottom bend (radius 24, center at 4, 65)
  ctx.arc(4, 65, 24, Math.PI, 0, true);
  // 6. Straight line up outer right leg from (28, 65) to (28, -68)
  ctx.lineTo(28, -68);
  // 7. Outer top bend (radius 28, center at 0, -68)
  ctx.arc(0, -68, 28, 0, Math.PI, true);
  // 8. Straight line down outer left leg from (-28, -68) to (-28, 45)
  ctx.lineTo(-28, 45);

  ctx.lineWidth = 4.6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = '#a1a1aa';
  ctx.stroke();

  // Crisp metallic sheen highlight stroke
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.lineWidth = 1.3;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.stroke();

  // Subtle core wire shading
  ctx.lineWidth = 0.8;
  ctx.strokeStyle = 'rgba(39, 39, 42, 0.4)';
  ctx.stroke();

  ctx.restore();
}
