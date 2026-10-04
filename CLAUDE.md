# Tencent explainer video

**Current direction is v3** (DESIGN_SYSTEM.md, ASSETS.md, app/v3/). v1 (app/scenes.js) and v2 (app/scenes_v2.js) are superseded.
- v3 stills: `PAGE=v3/index.html SCENES=proof.js node tools/render.js stills <t>...`; raster assets go through `tools/print.py` (cut-out, halftone, border) before use.
- Supplied assets land in assets/gen/ and assets/real/ (see ASSETS.md for IDs).

Read HANDOFF.md for history. It holds the brief, the current status, the sync problem, the design system, the storyboard and the next steps.

- All 75 storyboard scenes are written in app/scenes.js and render. Check work with stills before rendering video:
  `node tools/render.js scenes [i0] [i1]` -> out/stills/sc_NNN.png (one per scene), `node tools/render.js stills <t>...`.
- Full build: `tools/build.sh` (parallel segments -> out/tencent.mp4). Re-render a range of segments: `tools/build.sh 4 7`.
- Browser preview with audio: serve the repo root (e.g. `npx serve .`) and open /app/index.html?preview (space = play, arrows = seek).
- Video time = audio time + PRE (1.6 s pre-roll for the Chapter 1 card, set in app/index.html); build.sh delays the audio to match.
- Fonts are open substitutes (Roboto Condensed, Lora, Courier Prime, Poppins, Noto Serif SC) in app/fonts; maps use Natural Earth data in app/land.js.
- The voiceover is input/voice.mp3 (912.8 s). input/voice_1.mp3 belongs to a different video; ignore it.
- app/timing.js holds REAL word timestamps from ASR (alignment/transcribe.py + alignment/align_asr.py). Chapter titles are not spoken; their entries span the silent gap before the chapter (`spoken: false`).
- Talk to the owner in Vietnamese. All on-screen text and other outputs are in English.
- No real logos, no likenesses of real people, no music or sound effects.
