# Framera

High-Resolution Photo Template Studio & Frame Synthesizer.

Framera allows users to select high-aesthetic frames (vintage instant film, editorial magazine cover, sci-fi cyber telemetry, neo-brutalist poster, and 35mm cinematic film strip), adjust framing and filters, customize dynamic typography overlays, and export publication-ready Ultra-HD PNG cards.

---

## 1. Key Features

- **12 Curated Studio Templates**:
  - `focus_editorial`: Editorial Halftone Poster with procedural CMYK dot-matrix and vertical typography.
  - `wincore`: Retro Y2K Media Player & System Error Warning dialogs with pixel cursor.
  - `cinema_poster`: 35mm Cinema Letterbox with chromatic blur backdrop and film credits.
  - `astral_koi`: Celestial Koi fish swimming over frame with golden chalk title card.
  - `tokyo_brutalist`: Avant-garde Japanese architectural red grid with scarlet face portal and gothic banner.
  - `viewfinder`: Smartphone camera HUD screen held over subject with live focus reticle, zoom pills, and iOS controls.
  - `instagram95`: Retro Windows 95 application window with CRT scanlines, classic menu bar, and vintage filter strip.
  - `cctv_surveillance`: Cybersecurity monitoring HUD with facial detection, inspection callout crops, and pixel UI icons.
  - `ai_vision`: Machine perception HUD with object detection boxes, confidence telemetry, and morse sky symbols.
  - `fisheye`: Ultra-wide 180-degree circular fisheye lens aperture with manual focus barrel and dark vignette.
  - `comic_portal`: Editorial portrait with chalk-stitched manga eye cutout, anime duotone filter, and starburst accents.
  - `folded_poster`: Tactile 4-quadrant creased print poster with security guilloche engraving waves and bold streetwear typography.
- **Dynamic Template Engine**: Pluggable registry architecture designed to register, hot-swap, and render high-resolution templates seamlessly.
- **Standalone Photo Studio Fallback**: Full interactive framing, pan/zoom adjustments, and color grading available out of the box even without registered templates.
- **Interactive Transform Controls**: Live zoom scaling (50% to 250%) and horizontal/vertical pan offsets.
- **Color Grading Presets**: Normal, B&W, Warm Film, Cyber Flux, Matte Fade, and High Noir.
- **Dynamic Text Overlays**: Live reactive headline, subtitle, and date customization with smart multiline text wrapping.
- **Single-Click Export**: Ultra-HD PNG download and one-click direct clipboard bitmap copy.

---

## 2. Architectural Blueprint

Built strictly upon Semantic Atomic Architecture with Single Responsibility Files (<150 lines per module):

```text
framera/
├── Dockerfile                  # Production Nginx 1.25-alpine SPA server with security headers
├── docker-compose.yml          # Container orchestration (port 8080)
├── deploy.sh                   # Single-enter test-and-deploy bundle
├── redeploy.sh                 # Zero-friction git pull and redeploy bundle
├── runtest.sh                  # Isolated automated test runner
├── runtest.bat                 # Native Windows automated test runner
├── runapp.bat                  # Native Windows dev server launcher
├── package.json                # Project manifest and dev server
├── server.js                   # Node HTTP dev server with CORS headers
├── index.html                  # Semantic application markup
├── assets/                     # Curated reference artwork and samples
├── css/
│   ├── base.css                # Design tokens, reset, typography, and buttons
│   ├── layout.css              # App container, header, and studio grid
│   ├── controls.css            # Upload dropzone, sliders, and chips
│   ├── canvas_stage.css        # Sticky preview viewport and export toolbar
│   ├── gallery.css             # Template showcase showcase and slide transitions
│   └── style.css               # Aggregator root stylesheet
├── src/
│   ├── app.js                  # Modular bootstrap and global studio state
│   ├── core/
│   │   └── canvas/
│   │       ├── bounds.js       # Aspect-ratio cover/contain & pan/zoom calculations
│   │       ├── fallback_renderer.js # Standalone raw photo canvas fallback
│   │       ├── filters.js      # CSS canvas filter presets
│   │       ├── halftone.js     # Procedural color-halftone dot raster portal engine
│   │       └── renderer.js     # Offscreen canvas setup and multiline text wrapper
│   └── features/
│       ├── controls/
│       │   └── controls_manager.js  # User interaction bindings and state dispatch
│       ├── export/
│       │   ├── export_actions.js    # Download and clipboard UI action bindings
│       │   └── exporter.js          # PNG download and ClipboardItem export
│       ├── gallery/
│       │   └── gallery_manager.js   # Landing gallery cards and slide transitions
│       ├── stage/
│       │   └── preview_orchestrator.js # Real-time frame synthesis and preview update
│       ├── theme/
│       │   └── theme_manager.js     # Dark Studio and Rose Light switcher
│       └── templates/
│           ├── ai_vision_template.js        # Machine perception and confidence HUD
│           ├── astral_koi_template.js       # Hand-drawn celestial koi and chalk letterbox frame
│           ├── cctv_surveillance_template.js # Facial detection, inspection callout crops, pixel icons
│           ├── cinema_poster_template.js    # Cinema lens and pixelated blur poster
│           ├── comic_portal_template.js     # Chalk-stitched manga eye cutout, anime duotone filter
│           ├── fisheye_helpers.js           # Radial fisheye barrel distortion, 2.5x zoom LUT, glass glare
│           ├── fisheye_template.js          # Ultra-wide 180-degree circular fisheye aperture
│           ├── focus_editorial_template.js  # Editorial halftone poster template
│           ├── folded_poster_template.js    # 4-quadrant creased poster with guilloche engraving
│           ├── instagram95_helpers.js       # Win95 bevels, scanlines, and filter carousel routines
│           ├── instagram95_template.js      # Retro Windows 95 application window template
│           ├── template_registry.js         # Dynamic registry and template dispatcher
│           ├── template_samples.js          # Preset sample reference imagery & metadata
│           ├── tokyo_brutalist_template.js  # Avant-garde Japanese red grid brutalist template
│           ├── viewfinder_helpers.js        # Viewfinder HUD brackets, zoom pills, shutter routines
│           ├── viewfinder_template.js       # Smartphone camera viewfinder overlay template
│           ├── wincore_helpers.js           # Classic Windows XP and pixel cursor routines
│           └── wincore_template.js          # Retro Y2K media player & warning dialogs
└── tests/
    ├── ai_vision_template.test.js
    ├── astral_koi_template.test.js
    ├── bounds.test.js
    ├── cctv_surveillance_template.test.js
    ├── cinema_poster_template.test.js
    ├── comic_portal_template.test.js
    ├── controls_manager.test.js
    ├── exporter.test.js
    ├── filters.test.js
    ├── fisheye_template.test.js
    ├── focus_editorial_template.test.js
    ├── folded_poster_template.test.js
    ├── gallery.test.js
    ├── instagram95_template.test.js
    ├── preview_orchestrator.test.js
    ├── template_registry.test.js
    ├── theme_manager.test.js
    ├── tokyo_brutalist_template.test.js
    ├── viewfinder_template.test.js
    └── wincore_template.test.js
```

---

## 3. Quick Start & Deployment

### Run Locally (Development)

```bash
npm run dev
# Or on Windows:
runapp.bat
# Server accessible at http://localhost:8080
```

### Run Automated Tests

```bash
npm test
# Or using the shell runner (Linux/macOS):
./runtest.sh
# Or on Windows:
runtest.bat
```

### Deploy via Docker (Single Enter)

```bash
./deploy.sh
```

---

## License

MIT - Authored by Mahendra Wira Dharma (@mwdhrmaaa)
