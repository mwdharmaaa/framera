# Framera

High-Resolution Photo Template Studio & Frame Synthesizer.

Framera allows users to select high-aesthetic frames (vintage instant film, editorial magazine cover, sci-fi cyber telemetry, neo-brutalist poster, and 35mm cinematic film strip), adjust framing and filters, customize dynamic typography overlays, and export publication-ready Ultra-HD PNG cards.

---

## 1. Key Features

- **Focus Editorial Halftone Template**: High-fashion 3:4 portrait layout featuring dual procedural CMYK halftone dot-matrix portals, monochrome base photo treatment, bold geometric vertical typography, and rotated telemetry metadata.
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
├── package.json                # Project manifest and dev server
├── server.js                   # Node HTTP dev server with CORS headers
├── index.html                  # Semantic application markup
├── assets/
│   └── focus_reference.jpg     # Editorial studio reference photo asset
├── css/
│   ├── base.css                # Design tokens, reset, typography, and buttons
│   ├── layout.css              # App container, header, and studio grid
│   ├── controls.css            # Template picker, dropzone, sliders, and chips
│   ├── canvas_stage.css        # Sticky preview viewport and export toolbar
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
│       │   └── exporter.js          # PNG download and ClipboardItem export
│       └── templates/
│           ├── focus_editorial_template.js # Editorial halftone poster template
│           └── template_registry.js        # Dynamic registry and template dispatcher
└── tests/
    ├── bounds.test.js
    ├── filters.test.js
    ├── focus_editorial_template.test.js
    └── template_registry.test.js
```

---

## 3. Quick Start & Deployment

### Run Locally (Development)

```bash
npm run dev
# Server accessible at http://localhost:8080
```

### Run Automated Tests

```bash
npm test
# Or using the shell runner:
./runtest.sh
```

### Deploy via Docker (Single Enter)

```bash
./deploy.sh
```

---

## License

MIT - Authored by Mahendra Wira Dharma (@mwdhrmaaa)
