/**
 * Helper routines for Future Awaits Avant-Garde Poster Template.
 * Renders textured paper grain, CRT glitch scanlines, warped brutalist headline, and neon script.
 */

/**
 * Draws off-white risograph/newspaper textured paper grain background.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cw
 * @param {number} ch
 */
export function drawGrainyNoiseBackdrop(ctx, cw = 1200, ch = 1600) {
  // 1. Warm bone/cement base
  ctx.fillStyle = '#dbd8d0';
  ctx.fillRect(0, 0, cw, ch);

  // 2. Radial darkening towards edges
  const vignette = ctx.createRadialGradient ? ctx.createRadialGradient(cw / 2, ch * 0.45, 100, cw / 2, ch * 0.45, 900) : null;
  if (vignette) {
    vignette.addColorStop(0, 'rgba(235, 232, 224, 0.4)');
    vignette.addColorStop(0.7, 'rgba(200, 195, 185, 0.2)');
    vignette.addColorStop(1, 'rgba(140, 135, 125, 0.45)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, cw, ch);
  }

  // 3. Procedural tactile stipple film grain
  const grainCanvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
  if (grainCanvas) {
    const gw = 200;
    const gh = 200;
    grainCanvas.width = gw;
    grainCanvas.height = gh;
    const gctx = grainCanvas.getContext('2d');
    if (gctx) {
      const imgData = gctx.createImageData(gw, gh);
      const buf = imgData.data;
      for (let i = 0; i < buf.length; i += 4) {
        const val = Math.floor(Math.random() * 80);
        buf[i] = val;
        buf[i + 1] = val;
        buf[i + 2] = val;
        buf[i + 3] = Math.random() < 0.28 ? Math.floor(Math.random() * 55 + 15) : 0;
      }
      gctx.putImageData(imgData, 0, 0);

      ctx.save();
      ctx.globalAlpha = 0.42;
      ctx.fillStyle = ctx.createPattern ? ctx.createPattern(grainCanvas, 'repeat') : '#dbd8d0';
      ctx.fillRect(0, 0, cw, ch);
      ctx.restore();
    }
  }
}

/**
 * Draws CRT horizontal scanlines and analog digital glitch lines across typography area.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cw
 * @param {number} yStart
 * @param {number} yEnd
 */
export function drawGlitchScanlines(ctx, cw = 1200, yStart = 1000, yEnd = 1580) {
  ctx.save();
  ctx.lineWidth = 1.5;
  for (let y = yStart; y <= yEnd; y += 4) {
    const isDark = Math.random() < 0.35;
    const alpha = isDark ? (Math.random() * 0.22 + 0.1) : 0.05;
    ctx.strokeStyle = `rgba(18, 16, 22, ${alpha.toFixed(2)})`;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(cw, y);
    ctx.stroke();
  }
  // Random red digital micro-glitch streaks
  for (let i = 0; i < 6; i++) {
    const gy = yStart + Math.random() * (yEnd - yStart);
    const gx = Math.random() * (cw * 0.6);
    const gw = Math.random() * 250 + 80;
    ctx.fillStyle = 'rgba(255, 20, 20, 0.45)';
    ctx.fillRect(gx, gy, gw, 2);
  }
  ctx.restore();
}

/**
 * Draws the brutalist red headline with uniform letter height, compact kerning (dempet), and undulating wave motion.
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} text
 * @param {number} cw
 * @param {number} baseCY
 */
export function drawCurvedHeadline(ctx, text = 'FUTURE', cw = 1200, baseCY = 1380) {
  ctx.save();
  ctx.fillStyle = '#ff1111';
  ctx.font = '900 305px "Anton", "Impact", "Bebas Neue", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const chars = text.toUpperCase().split('');
  const totalChars = chars.length;
  if (totalChars === 0) {
    ctx.restore();
    return;
  }

  // Measure letter widths for tight, snug packing (dempet)
  const charWidths = chars.map((ch) => {
    if (ctx.measureText) {
      const m = ctx.measureText(ch);
      if (m && typeof m.width === 'number' && m.width > 0) {
        return m.width;
      }
    }
    return 170;
  });

  const tightKerning = -8;
  const totalWidth = charWidths.reduce((sum, w) => sum + w, 0) + (totalChars - 1) * tightKerning;
  let currentLeftX = (cw - totalWidth) / 2;

  // Subtle horizontal motion move trail (tasteful speed smear without harshness)
  const motionTrails = [
    { dx: -10, a: 0.14, b: 'blur(4px)' },
    { dx: 10, a: 0.14, b: 'blur(4px)' },
    { dx: -5, a: 0.24, b: 'blur(2px)' },
    { dx: 5, a: 0.24, b: 'blur(2px)' }
  ];

  chars.forEach((char, idx) => {
    // Normalised position across the word from 0 (left) to 1 (right)
    const norm = totalChars > 1 ? idx / (totalChars - 1) : 0.5;

    // Undulating sine wave displacement (all letters have identical height/scale, but wave up and down)
    const waveAngle = norm * Math.PI * 1.8 - 0.35;
    const waveY = -48 * Math.sin(waveAngle);

    const charW = charWidths[idx];
    const x = currentLeftX + charW / 2;
    const y = baseCY + waveY;

    // Subtle motion move trailing passes
    motionTrails.forEach(({ dx, a, b }) => {
      ctx.save();
      ctx.globalAlpha = a;
      if (ctx.filter !== undefined) ctx.filter = b;
      ctx.fillText(char, x + dx, y);
      ctx.restore();
    });

    // Render with uniform scale (sama ukurannya)
    ctx.fillText(char, x, y);

    currentLeftX += charW + tightKerning;
  });

  ctx.restore();
}

/**
 * Draws the glowing white calligraphy script overlaid across the headline.
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} text
 * @param {number} cw
 * @param {number} baseCY
 */
export function drawOverlaidScript(ctx, text = 'Awaits', cw = 1200, baseCY = 1285) {
  ctx.save();
  ctx.font = 'italic 295px "Great Vibes", "Alex Brush", "Brush Script MT", cursive';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Layer 1: Vivid crimson neon ambient glow
  ctx.shadowColor = 'rgba(255, 18, 18, 0.98)';
  ctx.shadowBlur = 42;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(text, cw / 2, baseCY);

  // Layer 2: Intense red halo
  ctx.shadowColor = 'rgba(255, 30, 30, 0.85)';
  ctx.shadowBlur = 20;
  ctx.fillText(text, cw / 2, baseCY);

  // Layer 3: Sharp white core glow
  ctx.shadowColor = 'rgba(255, 255, 255, 0.95)';
  ctx.shadowBlur = 8;
  ctx.fillText(text, cw / 2, baseCY);

  // Layer 4: Solid crisp white stroke outline for maximum definition and pop
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.lineWidth = 2.5;
  ctx.strokeText(text, cw / 2, baseCY);

  ctx.restore();
}
