# Framera

High-Resolution Photo Template Studio & Frame Synthesizer.

Framera allows users to select high-aesthetic frames (vintage instant film, editorial magazine cover, sci-fi cyber telemetry, neo-brutalist poster, and 35mm cinematic film strip), adjust framing and filters, customize dynamic typography overlays, and export publication-ready Ultra-HD PNG cards.

---

## 1. Key Features

- **28 Curated Studio Templates**:
  - `focus_editorial`: Editorial Halftone Poster with procedural CMYK dot-matrix and vertical typography.
  - `wincore`: Retro Y2K Media Player & System Error Warning dialogs with pixel cursor.
  - `cinema_poster`: 35mm Cinema Letterbox with chromatic blur backdrop and film credits.
  - `astral_koi`: Celestial Koi fish swimming over frame with golden chalk title card.
  - `tokyo_brutalist`: Avant-garde Japanese architectural red grid with scarlet face portal and gothic banner.
  - `instagram95`: Retro Windows 95 application window with CRT scanlines, classic menu bar, and vintage filter strip.
  - `ai_vision`: Machine perception HUD with object detection boxes, confidence telemetry, and morse sky symbols.
  - `fisheye`: Ultra-wide 180-degree circular fisheye lens aperture with manual focus barrel and dark vignette.
  - `comic_portal`: Editorial portrait with chalk-stitched manga eye cutout, anime duotone filter, and starburst accents.
  - `folded_poster`: Tactile 4-quadrant creased print poster with security guilloche engraving waves and bold streetwear typography.
  - `future_awaits`: Avant-garde noir poster with motion-blurred portrait, sharp crimson red vertical eye portal, and neon calligraphy.
  - `eyes_trend`: Viral TikTok/Pinterest eyes trend with letterbox eye slit, hand-drawn frog mascot, lucky clover, and spiral doodles.
  - `final_girl`: Dual-tone split risograph poster with zoom eye portal, blush-pink halftone raster, heart doodle, and crimson quote card.
  - `vinyl_trio`: Analog vinyl LP disc collage with 3 tilted Polaroid instant frames and handwritten annotations.
  - `cyan_motion`: Cinematic editorial portrait with horizontal directional motion blur trails and electric cyan duotone grading.
  - `inverted_duet`: Symmetrical vertical 50/50 dual-photo composition with film perforation strip.
  - `analog_tide`: 35mm coastal film stock with ocean grain overlay and minimalist typography.
  - `ocean_vinyl_trio`: Aquatic vinyl record turntable collage with floating photo cards.
  - `locker_playlist_trio`: School locker cassette player aesthetic with 3 photo slots.
  - `impasto_oil_atelier`: Thick oil paint impasto texture with tactile brush ridges.
  - `ocean_stories_quad`: 3-card vertical landscape story stack over aquatic wave background.
  - `life_offline_trio`: 3-frame editorial collage celebrating offline outdoor moments.
  - `golden_hour_hana`: Warm sunset orange color grading with 4 photo slots and floating amber music player.
  - `memory_tree_deca`: Bare tree branches across cerulean sky with 10 organic photo snapshots.
  - `ios_photosheet`: Native iOS photo share sheet modal overlay with interactive carousel card.
  - `trip_to_hill`: 3-photo torn paper collage with realistic tactile deckled paper rips and drop shadows.
  - `meadow_patch_trio`: 3-photo meadow collage with tilted center card, stitched fabric love badge, and orange hibiscus blossom.
  - `imessage_cascade`: Viral iOS dark chat aesthetic with 3 staggered floating rounded photo cards, Live Photo badge, and authentic iMessage text bar.
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
│           ├── analog_tide_helpers.js       # Monochrome film grain, dust specks, and inset helpers
│           ├── analog_tide_template.js      # 2-photo Analog Tide film inset template
│           ├── astral_koi_template.js       # Hand-drawn celestial koi and chalk letterbox frame
│           ├── cinema_poster_template.js    # Cinema lens and pixelated blur poster
│           ├── comic_portal_template.js     # Chalk-stitched manga eye cutout, anime duotone filter
│           ├── cyan_motion_helpers.js       # Directional motion smear and cyan duotone grading
│           ├── cyan_motion_template.js      # Cyan Motion Smear editorial template
│           ├── eyes_trend_helpers.js        # Doodle stars, aura atmosphere, and typography routines
│           ├── eyes_trend_template.js       # Emerald Eyes Trend template with frog mascot & doodles
│           ├── final_girl_helpers.js        # Risograph duotone halftone, heart doodle, and quote card
│           ├── final_girl_template.js       # Final Girl Studios dual-split risograph template
│           ├── fisheye_helpers.js           # Radial fisheye barrel distortion, 2.5x zoom LUT, glass glare
│           ├── fisheye_template.js          # Ultra-wide 180-degree circular fisheye aperture
│           ├── focus_editorial_template.js  # Editorial halftone poster template
│           ├── folded_poster_creases.js     # 4-quadrant paper crease folds, ink distress, and scotch tape
│           ├── folded_poster_helpers.js     # Twilight sky cables, guilloche ripples, and poster typography
│           ├── folded_poster_template.js    # 4-quadrant creased poster with guilloche engraving
│           ├── impasto_oil_helpers.js       # Palette-knife impasto ridges, canvas primer, and signature
│           ├── impasto_oil_template.js      # 1-photo Impasto Oil Atelier fine-art painting template
│           ├── instagram95_helpers.js       # Win95 bevels, scanlines, and filter carousel routines
│           ├── instagram95_template.js      # Retro Windows 95 application window template
│           ├── inverted_duet_helpers.js     # Symmetrical 50/50 split coordinates and framing helpers
│           ├── inverted_duet_template.js    # 2-photo Inverted Duet split template
│           ├── locker_playlist_helpers.js   # 3-polaroid slot coordinates, audio player typography
│           ├── locker_playlist_template.js  # 3-photo Locker Playlist Trio collage template
│           ├── ocean_vinyl_helpers.js       # Ocean vinyl turntable slots, typography, and overlay
│           ├── ocean_vinyl_template.js      # 3-photo Ocean Vinyl Turntable Trio template
│           ├── template_registry.js         # Dynamic registry and template dispatcher
│           ├── template_samples.js          # Preset sample reference imagery & metadata
│           ├── tokyo_brutalist_template.js  # Avant-garde Japanese red grid brutalist template
│           ├── vinyl_trio_helpers.js        # Polaroid transform slots, marker annotations, overlay
│           ├── vinyl_trio_template.js       # 3-photo Vinyl Record Polaroid Trio template
│           ├── wincore_helpers.js           # Classic Windows XP and pixel cursor routines
│           └── wincore_template.js          # Retro Y2K media player & warning dialogs
└── tests/
    ├── ai_vision_template.test.js
    ├── analog_tide_template.test.js
    ├── astral_koi_template.test.js
    ├── bounds.test.js
    ├── cinema_poster_template.test.js
    ├── comic_portal_template.test.js
    ├── controls_manager.test.js
    ├── exporter.test.js
    ├── filters.test.js
    ├── fisheye_template.test.js
    ├── focus_editorial_template.test.js
    ├── folded_poster_template.test.js
    ├── gallery.test.js
    ├── impasto_oil_template.test.js
    ├── instagram95_template.test.js
    ├── inverted_duet_template.test.js
    ├── locker_playlist_template.test.js
    ├── ocean_vinyl_template.test.js
    ├── preview_orchestrator.test.js
    ├── template_registry.test.js
    ├── theme_manager.test.js
    ├── tokyo_brutalist_template.test.js
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
