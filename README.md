# Framera

High-Resolution Photo Template Studio & Frame Synthesizer.

Framera allows users to select high-aesthetic frames (vintage instant film, editorial magazine cover, sci-fi cyber telemetry, neo-brutalist poster, and 35mm cinematic film strip), adjust framing and filters, customize dynamic typography overlays, and export publication-ready Ultra-HD PNG cards.

---

## 1. Key Features

- **5 Handcrafted Frame Templates**:
  - *Polaroid Instant*: Warm cream card with recessed photo framing and date stamp.
  - *Vogue Editorial*: High-fashion cover with bold serif masthead and barcode metadata.
  - *Cyber Telemetry*: Dark sci-fi HUD with targeting crosshairs, coordinates, and neon cyan accents.
  - *Neo-Brutalist*: Industrial poster with heavy borders, lime telemetry, and monospace specs.
  - *35mm Film Strip*: Authentic Kodak film perforations with exposure stamps and anamorphic aspect tags.
- **Interactive Transform Controls**: Live zoom scaling (50% - 250%) and horizontal/vertical pan offsets.
- **Color Grading Presets**: Normal, B&W, Warm Film, Cyber Flux, Matte Fade, and High Noir.
- **Dynamic Text Overlays**: Live reactive headline, subtitle, and date customization.
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
├── index.html                  # Semantic application markup
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
│   │       ├── filters.js      # CSS canvas filter presets
│   │       └── renderer.js     # Offscreen canvas setup and multiline text wrapper
│   └── features/
│       ├── controls/
│       │   └── controls_manager.js  # User interaction bindings and state dispatch
│       ├── export/
│       │   └── exporter.js          # PNG download and ClipboardItem export
│       └── templates/
│           ├── brutalist_template.js
│           ├── cinematic_template.js
│           ├── cyber_template.js
│           ├── magazine_template.js
│           ├── polaroid_template.js
│           └── template_registry.js # Registry and metadata dispatcher
└── tests/
    ├── bounds.test.js
    ├── filters.test.js
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
