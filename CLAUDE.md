# Tencent explainer video

Read HANDOFF.md first. It holds the brief, the current status, the sync problem, the design system, the storyboard and the next steps.

- Nothing has been rendered. app/engine.js and app/art.js are untested first drafts.
- The voiceover is input/voice.mp3 (912.8 s). input/voice_1.mp3 belongs to a different video; ignore it.
- app/timing.js holds REAL word timestamps from ASR (alignment/transcribe.py + alignment/align_asr.py). Chapter titles are not spoken; their entries span the silent gap before the chapter (`spoken: false`).
- Talk to the owner in Vietnamese. All on-screen text and other outputs are in English.
- No real logos, no likenesses of real people, no music or sound effects.
