import { calculateImageBounds } from './core/canvas/bounds.js';
import { applyCanvasFilter } from './core/canvas/filters.js';
import { createStudioCanvas } from './core/canvas/renderer.js';
import { getTemplate } from './features/templates/template_registry.js';
import { initControls } from './features/controls/controls_manager.js';
import { downloadCanvasImage, copyCanvasImage } from './features/export/exporter.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Global Studio State
  let state = {
    templateId: 'polaroid',
    photoDataUrl: null,
    photoImg: null,
    zoom: 1,
    panX: 0,
    panY: 0,
    filter: 'none',
    caption: 'Cherished Moments',
    subtitle: 'Memories Archive',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  };

  const previewImage = document.getElementById('studioPreview');
  const previewLoader = document.getElementById('previewLoader');
  const downloadBtn = document.getElementById('downloadBtn');
  const copyBtn = document.getElementById('copyBtn');
  const copyBtnLabel = document.getElementById('copyBtnLabel');

  let activeCanvas = null;

  /**
   * Re-renders the studio canvas based on current state.
   */
  const renderStudioCanvas = async () => {
    if (previewLoader) previewLoader.style.display = 'flex';

    if (typeof document !== 'undefined' && document.fonts?.ready) {
      try {
        await document.fonts.ready;
      } catch {
        // Non-blocking font load fallback
      }
    }

    const tpl = getTemplate(state.templateId);
    const canvasWidth = tpl?.config?.canvasWidth || 1080;
    const canvasHeight = tpl?.config?.canvasHeight || 1350;
    const frame = tpl?.config?.frame || { x: 60, y: 60, w: canvasWidth - 120, h: canvasHeight - 160 };

    const { canvas, ctx } = createStudioCanvas(canvasWidth, canvasHeight);

    let bounds = {
      drawX: frame.x,
      drawY: frame.y,
      drawW: frame.w,
      drawH: frame.h
    };

    if (state.photoImg) {
      bounds = calculateImageBounds(
        state.photoImg.naturalWidth || state.photoImg.width,
        state.photoImg.naturalHeight || state.photoImg.height,
        frame,
        {
          zoom: state.zoom,
          panX: state.panX,
          panY: state.panY,
          fitMode: 'cover'
        }
      );
    }

    // Apply color grading filter
    applyCanvasFilter(ctx, state.filter);

    if (tpl && typeof tpl.render === 'function') {
      tpl.render(ctx, state.photoImg, bounds, state);
    } else {
      // Clean, neutral standalone photo studio canvas
      ctx.fillStyle = '#0e1017';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Clean card boundary
      ctx.fillStyle = '#161922';
      ctx.fillRect(frame.x - 12, frame.y - 12, frame.w + 24, frame.h + 24);

      ctx.save();
      ctx.beginPath();
      ctx.rect(frame.x, frame.y, frame.w, frame.h);
      ctx.clip();

      if (state.photoImg) {
        ctx.drawImage(state.photoImg, bounds.drawX, bounds.drawY, bounds.drawW, bounds.drawH);
      } else {
        // Neutral subtle placeholder
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 1;
        ctx.strokeRect(frame.x, frame.y, frame.w, frame.h);
        ctx.beginPath();
        ctx.moveTo(frame.x, frame.y);
        ctx.lineTo(frame.x + frame.w, frame.y + frame.h);
        ctx.moveTo(frame.x + frame.w, frame.y);
        ctx.lineTo(frame.x, frame.y + frame.h);
        ctx.stroke();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.font = '600 18px "Poppins", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('UPLOAD PHOTO TO PREVIEW FRAMING', canvasWidth / 2, canvasHeight / 2);
      }
      ctx.restore();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 2;
      ctx.strokeRect(frame.x, frame.y, frame.w, frame.h);

      // Minimal footer text
      if (state.caption) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '600 24px "Poppins", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(state.caption, canvasWidth / 2, canvasHeight - 50);
      }
    }

    activeCanvas = canvas;
    if (previewImage) {
      previewImage.src = canvas.toDataURL('image/png');
      previewImage.style.display = 'block';
    }
    if (previewLoader) previewLoader.style.display = 'none';
  };

  const updateState = (updater) => {
    state = typeof updater === 'function' ? updater(state) : { ...state, ...updater };
    renderStudioCanvas();
  };

  // Initialize UI Controls
  initControls(
    {
      templateListEl: document.getElementById('templateList'),
      fileInput: document.getElementById('photoInput'),
      dropzone: document.getElementById('uploadDropzone'),
      zoomSlider: document.getElementById('zoomSlider'),
      zoomValueLabel: document.getElementById('zoomVal'),
      panXSlider: document.getElementById('panXSlider'),
      panYSlider: document.getElementById('panYSlider'),
      resetPanBtn: document.getElementById('resetPanBtn'),
      filterChipsContainer: document.getElementById('filterChips'),
      captionInput: document.getElementById('captionInput'),
      subtitleInput: document.getElementById('subtitleInput'),
      dateInput: document.getElementById('dateInput')
    },
    state,
    updateState
  );

  // Export Action Triggers
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      if (!activeCanvas) return;
      const slug = (state.caption || 'photo')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      downloadCanvasImage(activeCanvas, `framera-${slug || 'photo'}.png`);
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      if (!activeCanvas) return;
      const success = await copyCanvasImage(activeCanvas);
      if (success && copyBtnLabel) {
        copyBtnLabel.textContent = 'Copied!';
        setTimeout(() => {
          copyBtnLabel.textContent = 'Copy Image';
        }, 2000);
      }
    });
  }

  // Initial render
  renderStudioCanvas();
});
