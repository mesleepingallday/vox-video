# Tencent film: design system v3

Benchmark: could this run as a public-facing branded editorial film about Tencent?
Reference blend: Bloomberg Businessweek × modern Tencent TVC × light newspaper collage × contemporary motion design.
Not Vox, not scrapbook, not traditional Chinese, not AI-looking. Clean, premium, intelligent, confident.

## 1. One physical world

Everything is a printed object on newsprint, filmed by one camera.

| Layer | Treatment |
|---|---|
| Ground | Light newsprint `#F2EFE8` with fine fibre grain (one shared texture, never per-object). |
| Printed objects | Every photo, logo, UI, chart, map and word block is printed, cut out and laid on the ground. |
| Light | One key light from top-left (azimuth 315°). All shadows fall down-right. |
| Camera | Continuous. Slow dolly at all times (2–4% scale per beat), pans across a single large layout, zooms *through* objects into the next idea. Never a hard reset to an empty frame unless it is a deliberate chapter breath. |

## 2. The print rules (apply to every asset)

| Rule | Value at 1920×1080 |
|---|---|
| Paper border | 10 px clean white `#FBFAF6` around every cut-out (photos, logos, UI, objects). Type set *on* a newspaper page has no border. |
| Cut edge | Slightly imperfect: 1.2 px random deviation, straight segments ~90 px long (scissors, not torn). No torn edges. |
| Halftone | Photos and tonal images only. Round dots, 45°, 6.5 px pitch, ink `#151515` (mono) or ink + Tencent blue (duotone). Flat vectors (logos, UI, type) print as solid ink, no dots. |
| Grain | One global newsprint grain overlay, multiply, 6% (applied once over the frame, so all objects share it). |
| Shadow | Two layers, same for everything: contact `0 2px 3px rgba(20,18,15,.20)` + ambient `0 16px 28px rgba(20,18,15,.14)`. Lifted objects: offsets ×(1+z), blur ×(1+z). |
| Ink colours | Ink `#151515`, Tencent blue `#0052D9` (brand accent, from TDesign; confirm against the official logo file), Signal red `#E5402B` (losses, warnings, only), Newsprint grey `#8C8A84`, Paper `#F2EFE8`, Border white `#FBFAF6`. Brand logos keep their own official colours. |
| Misregistration | None. This is a clean modern print, not a riso zine. |

## 3. Typography

| Role | Face | Use |
|---|---|---|
| Display | **Inter Tight** 700–900, tracking −2% | Big words, numbers, kinetic type, names. |
| Text | **Inter** 400–600 | Captions, labels, UI text, datelines. |
| Data | **IBM Plex Mono** 400–600 | Figures, tickers, tables, sources, timestamps. |
| Newspaper | **Newsreader** 600–700 (+400 italic) | Only inside newspaper/magazine layouts (headlines, pull quotes), as real print. |
| Chinese | **Noto Sans SC** 700 | Product/company names (腾讯, 微信, QQ UI). Never calligraphic. |

Rules: no handwriting fonts, no marker fonts, no decorative display faces. Hierarchy comes from size and weight, not from boxes.
Numbers are set in Inter Tight with tabular figures, or Plex Mono in tables.

## 4. Information without cards

- Numbers are objects: they are printed, cut and placed (or formed by dots, coins, stacks).
- Headlines live inside newspaper layouts (columns, rules, datelines, captions).
- Charts grow out of the page (a printed line becomes a cable, a road, a skyline).
- UI emerges from devices; logos are printed stickers that move into transitions.
- Captions are newspaper captions: small Inter under the object, with a hairline rule.
- Sources: Plex Mono 18 px, bottom-left, `SOURCE · OUTLET`.
- Rectangles with text inside are allowed only when the rectangle is a real object (a ticket, a cheque, a document, a screen).

## 5. Motion

| Element | Ease / timing |
|---|---|
| Entrances | `expo.out`, 0.7–0.9 s, slide 40–80 px along the light direction or "lay down" (scale 1.04→1, shadow lifts→settles). |
| Exits | `power2.in`, 0.35 s, or leave the frame with the camera. |
| Camera | `power3.inOut`, 1.2–2.4 s between beats; a constant slow drift on top. |
| Type | Words set per line, 0.05 s stagger, mask reveal from baseline; no bounce, no overshoot. |
| Holds | Every key image holds still ≥ 1.2 s before the next move. |
| Frame rate | 24 fps. Objects move on ones; nothing "boils". |

## 5b. Transitions (continuity grammar)

1. **Zoom-through**: the camera flies into an object (a screen, a window, a photo, a dot) until it fills the frame; the next scene is inside it.
2. **Match-object**: an object becomes the next one by shape (penguin icon → coin → dot in a crowd; chart line → road; logo → node of a network).
3. **Table pan**: the camera slides along the same newspaper layout to the next story block.
4. **Page turn**: rarely, for a chapter breath; a full newspaper page flips over to reveal the next spread.

## 6. Technology split

- 70% editorial 2D: SVG + DOM + GSAP-style timelines (deterministic, seekable), real cut-out imagery.
- 20% dimensional: layered parallax on depth planes (CSS 3D / Three.js planes), camera moves through layers.
- 10% hero: Three.js / WebGL moments (globe, network of studios, the world splitting).

## 7. Asset pipeline

1. Real assets (photos, archival, logos, screenshots) where licensable.
2. High-fidelity SVG reconstruction for logos, UI, maps, diagrams, simple objects.
3. Generated assets from precise prompts (see ASSETS.md), delivered clean (no halftone, no border).
   All raster assets then go through `tools/print.py`: cut-out (if needed), halftone, white border, edge jitter, so every
   image obeys the same rules regardless of its source.
