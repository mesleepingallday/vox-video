# Asset manifest (v3)

How to deliver:
- Generated images → `assets/gen/<ID>.png`
- Real photos/archival/logos → `assets/real/<ID>.<ext>`, plus one line per file in `assets/real/CREDITS.txt`
  (`ID | source URL | author | licence`)
- Push to the repo (or attach in chat).
- Deliver **clean** images: no halftone, no white border, no paper texture, no added grain. `tools/print.py` applies the
  same cut-out, halftone, border and edge treatment to every image, so all sources look like one print run.
- **P1** = needed for chapters 1–2 (do these first), **P2** = chapters 3–5, **P3** = chapters 6–7 and ending.
- Already in hand (no action): QQ, WeChat, ICQ, AOL, Riot Games, League of Legends, Valorant, Epic Games, Unreal Engine,
  Fortnite, Ubisoft, Supercell, TikTok, CNN, Polygon, TechCrunch marks (vector, simple-icons).
- I reconstruct in SVG/code (no action): Win98 desktop, ICQ and OICQ clients, browser windows, phone UIs, MOBA minimaps,
  maps and globes, charts, tickers, newspaper layouts, documents, cheques, calendars, clocks, server-room diagrams, studio network.

---

## A. Real assets (please download)

The cloud session cannot reach Wikimedia, so please fetch these (Wikimedia Commons is the safest source: CC BY / CC BY-SA
/ public domain; keep author + licence). Head-and-shoulders crops are ideal; I cut out the background myself.

| ID | P | What | Where to look | Notes |
|---|---|---|---|---|
| R01 | P1 | **Ma Huateng (Pony Ma)** portrait, front or 3/4, neutral background if possible | Commons category "Ma Huateng" (China News Service photos, CC BY 3.0) | 2 different photos if available (one smiling/speaking, one neutral). |
| R02 | P1 | **Tencent logo**, official vector (SVG/PDF) | Commons "Tencent Logo.svg" or Tencent's brand/newsroom page | Exact brand blue; I'll sample it. |
| R03 | P1 | **QQ penguin logo**, official colour version (SVG/PNG) | Commons "Tencent QQ" logo files | |
| R04 | P2 | **Tencent Binhai Mansion** (Shenzhen HQ), daylight, whole building | Commons category "Tencent Binhai Mansion" | Transition: phone → building. |
| R05 | P1 | **Naspers logo** and **Prosus logo** (vector) | Commons / company press pages | |
| R06 | P1 | **Die Burger** front page, 1915 (first issue) or any 1915–1920 issue | Commons / South African archives (public domain by age) | For "media group that started in 1915". |
| R07 | P1 | **Euronext Amsterdam** building (Beursplein 5) exterior | Commons category "Beurs van Berlage" / "Euronext Amsterdam" | 2019 listing of Prosus. |
| R08 | P1 | **Brandon Beck** portrait | Commons (if any) or Riot press kit | If nothing licensable exists, tell me; I'll stage the quote without a face. |
| R09 | P1 | **Tim Sweeney** portrait | Commons (e.g. GDC 2017 photos by Official GDC, CC BY 2.0) | |
| R10 | P1 | **Mike Capps** and **Cliff Bleszinski** portraits | Commons (GDC/PAX photos, CC BY/BY-SA) | |
| R11 | P1 | **Epic Games HQ**, Cary NC, exterior | Commons category "Epic Games" | |
| R12 | P1 | **Riot Games campus**, Los Angeles, exterior | Commons category "Riot Games" | |
| R13 | P2 | **Supercell office / Helsinki waterfront** | Commons category "Supercell" / "Helsinki" | |
| R14 | P2 | **Yves Guillemot** portrait | Commons (CC BY-SA, event photos) | |
| R15 | P2 | **Honor of Kings** and **Clash of Clans** logos | Official press kits / Commons | Editorial use. |
| R16 | P2 | **Ubisoft**, **Paradox**, **Remedy**, **Techland**, **Krafton**, **FromSoftware**, **Funcom**, **Grinding Gear Games** logos | Commons / official press kits | For the "list kept growing" wall. |
| R17 | P2 | **Donald Trump** and **Joe Biden** official portraits | Commons (White House official portraits, public domain) | |
| R18 | P2 | **Xi Jinping** portrait | Commons (kremlin.ru, CC BY 4.0) | |
| R19 | P2 | **The Pentagon** aerial; **U.S. Capitol**; **U.S. Treasury** building; **U.S. Department of Justice** building | Commons (U.S. government works, public domain) | |
| R20 | P2 | **Hong Kong Exchanges** / Exchange Square or HK skyline | Commons | Shares fell 7.3%. |
| R21 | P3 | **Lisa Monaco** official DOJ portrait (public domain); **John McEntee** photo (if licensable) | Commons | |
| R22 | P3 | **Financial Times** front page (reference only), **Bloomberg**, **Reuters**, **Variety**, **Washington Examiner**, **Motley Fool**, **Tom's Hardware** wordmarks (vector) | Commons / press pages | Source credits as real mastheads. |

---

## B. Generated assets (please generate)

### Global rules (apply to every prompt unless the asset says otherwise)
- **Style:** photorealistic documentary/editorial photograph, natural colour, real materials, sharp focus, no illustration, no CGI look.
- **Lighting:** soft key light from upper-left (about 45° up, 45° left), gentle fill, soft shadow falling down-right (this matches the film's single light).
- **Background (isolated objects):** seamless pure white `#FFFFFF`, or transparent PNG if your tool supports it. No props, no floor texture.
- **People:** anonymous. Never resemble a real, identifiable person. Real people only ever come from real photos (section A).
- **Never include:** text, logos, brand marks, watermarks, signatures, legible signage, legible screens.
- **Screens:** fill every screen with flat pure green `#00FF00` (no reflections) so I can place reconstructed UI on it.
- **Resolution:** ≥ 2048 px on the long edge. PNG.
- **Border / halftone:** do not add; I add the 10 px white border and the 6.5 px halftone in post.

Each entry lists: subject · pose · camera · crop · lighting · background · expression · clothing · style · transparency ·
ratio · border (added by me) · isolated · halftone (applied by me).

---

#### G01 · P1 · Shenzhen 1998, three parallax layers (cold open)
- Deliver three separate images of the same scene (same perspective): `G01a` background (hills, hazy sky), `G01b` midground
  (low-rise 1990s blocks with 2–3 tower cranes), `G01c` foreground (street edge, a few bicycles, a covered walkway).
- Camera: eye level, 35 mm, slight low angle; Crop: wide; Ratio 21:9; Lighting: late afternoon, warm, soft;
  Background: full scene (`G01b` and `G01c` on white so I can cut them out); Isolated: b, c yes; Halftone: duotone (ink + blue).
- Prompt:
  > Documentary photograph, Shenzhen China in 1998, a wide street-level view of a fast-growing city: low-rise concrete and
  > tiled apartment blocks from the 1980s and 1990s, two tall construction tower cranes, scaffolding, a wide avenue with a few
  > bicycles and a minibus, hazy subtropical late-afternoon light, warm soft sunlight from the upper left, realistic 35 mm film
  > look, natural colours, no legible signs, no text, no logos, 21:9.
  (Then ask the tool for the same scene split into background / midground / foreground layers, or generate each layer with
  "isolated on pure white background" for b and c.)

#### G02 · P1 · Five young founders, back view (sentence 1)
- Subject: five young men in their late twenties at a cluttered desk with two beige CRT computers, seen **from behind**
  (faces not visible). Pose: one points at the screen, one types, three lean in. Camera: from behind, eye level, 50 mm.
  Crop: waist-up, all five in frame. Lighting: overhead fluorescent + global rule. Background: plain light office wall.
  Expression: n/a (faces hidden). Clothing: 1998 casual: short-sleeve button shirts, polo shirts, dark trousers, short
  black hair. Ratio 16:9. Isolated: yes (people + desk on white). Halftone: mono.
- Prompt:
  > Documentary photograph from behind of five young Chinese men in their late twenties in 1998, gathered at a cluttered
  > office desk with two beige CRT computer monitors (screens flat pure green #00FF00), one pointing at a screen, one typing,
  > three leaning in with excitement, short-sleeve button shirts and polo shirts, dark trousers, short black hair, faces not
  > visible, soft key light from upper left, isolated on a seamless pure white background, photorealistic, no text, no logos, 16:9.

#### G03 · P1 · Beige CRT monitor + keyboard, 1998 (sentences 7–8)
- Subject: late-1990s beige 15-inch CRT monitor with matching keyboard. Pose: 3/4 view, screen turned ~20° toward camera.
  Camera: eye level, 85 mm (low distortion). Crop: whole object, small margin. Screen: flat #00FF00. Background: pure white.
  Ratio 4:3. Isolated: yes. Halftone: mono (screen excluded).
- Prompt:
  > Product photograph of a late-1990s beige 15-inch CRT computer monitor with a matching beige keyboard in front, three-quarter
  > view, screen turned slightly toward the camera, screen filled with flat pure green #00FF00, soft key light from upper left,
  > soft shadow down-right, isolated on seamless pure white background, photorealistic, no logos, no text, 4:3.

#### G04 · P1 · Server rack, around 2000 (sentence 15)
- Subject: a single 19-inch server rack with 1U/2U beige and black servers, green and amber LEDs. Front view, slight 3/4.
  Camera: eye level, 85 mm. Crop: full rack. Background: white. Ratio 2:3. Isolated: yes. Halftone: mono.
- Prompt:
  > Product photograph of a single 19-inch server rack from around the year 2000, filled with 1U and 2U beige and black
  > servers, small green and amber status LEDs, cables neatly bundled, front three-quarter view, soft key light from upper left,
  > isolated on seamless pure white background, photorealistic, no logos, no text, 2:3.

#### G05 · P1 · Bundled US-dollar banknotes (sentences 19, 23–28)
- Subject: three neat bundles of US $100 notes with paper bands, stacked; plus `G05b` a single loose note lying flat.
  Camera: 3/4 top-down 45°. Crop: object with margin. Background: white. Ratio 3:2. Isolated: yes. Halftone: duotone.
  Note: stylised, not an exact replica (no legible serial numbers).
- Prompt:
  > Product photograph of three neat bundles of US hundred-dollar banknotes with plain paper bands, stacked slightly
  > offset, three-quarter top-down view, stylised and not an exact replica, no legible serial numbers, soft key light from
  > upper left, isolated on seamless pure white background, photorealistic, 3:2.

#### G06 · P1 · Amsterdam canal houses (sentence 26)
- Subject: a row of five narrow 17th-century gabled canal houses, brick, white window frames, a canal edge in front.
  Camera: straight-on from across the canal, 50 mm. Crop: facades full height. Lighting: overcast bright daylight + global
  rule. Background: sky replaced with pure white. Ratio 21:9. Isolated: yes (houses on white). Halftone: duotone.
- Prompt:
  > Documentary photograph of a row of five narrow seventeenth-century Amsterdam canal houses with step and bell gables, dark
  > brick, white window frames, seen straight on from across the canal, canal edge at the bottom, bright overcast daylight,
  > sky replaced by seamless pure white, photorealistic, no text, no signs, 21:9.

#### G07 · P1 · Leather briefcase (sentence 39)
- Subject: closed dark-brown leather briefcase with brass latches. 3/4 view, eye level, 85 mm. White background, 4:3,
  isolated, halftone mono.
- Prompt:
  > Product photograph of a closed dark brown leather executive briefcase with brass latches, three-quarter view, soft key
  > light from upper left, isolated on seamless pure white background, photorealistic, no logos, 4:3.

#### G08 · P1 · Modern smartphone (sentences 51–53, later WeChat scenes)
- Subject: a modern black smartphone, thin bezels. Deliver two angles: `G08a` front, straight on; `G08b` 3/4 held in a hand
  (anonymous hand, neutral skin tone, no rings). Screen #00FF00. White background. 9:16 (a) and 4:5 (b). Isolated. Halftone mono (screen excluded).
- Prompt:
  > Product photograph of a modern black smartphone with very thin bezels, straight-on front view, screen filled with flat
  > pure green #00FF00, soft key light from upper left, isolated on seamless pure white background, photorealistic, no logos, 9:16.
  > / Same phone held in an anonymous adult hand at a three-quarter angle, neutral skin tone, no jewellery, 4:5.

#### G09 · P1 · Gaming monitor on desk (sentence 52)
- Subject: a 27-inch thin-bezel gaming monitor on a stand, keyboard and mouse in front. Front view slightly from above.
  Screen #00FF00. White background, 16:10, isolated, halftone mono (screen excluded).
- Prompt:
  > Product photograph of a 27-inch thin-bezel gaming monitor on a stand with a mechanical keyboard and mouse in front, front
  > view slightly from above, screen filled with flat pure green #00FF00, soft key light from upper left, isolated on seamless
  > pure white background, photorealistic, no logos, no RGB lighting, 16:10.

#### G10 · P1 · Players, back view (sentences 52–53, 192)
- Subject: six young adult gamers (mixed genders) standing in a row seen from behind, pulling on an invisible rope (tug of war
  pose, leaning back). Clothing: hoodies and t-shirts, plain colours, no prints. Camera: side-back 3/4, eye level. Crop: full
  body. White background, 21:9, isolated, halftone mono.
- Prompt:
  > Documentary photograph of six young adult gamers, mixed genders, plain hoodies and t-shirts with no prints, seen from the
  > side and behind, leaning back in a tug-of-war pose as if pulling an invisible rope, full body, faces turned away, soft key
  > light from upper left, isolated on seamless pure white background, photorealistic, no text, 21:9.

#### G11 · P2 · Teenager gaming at night (sentences 100–102)
- Subject: a teenager in a dark bedroom at night, lit only by a phone screen, holding the phone in landscape with both hands.
  Pose: hunched on the edge of a bed. Camera: side profile, slightly behind, 50 mm. Expression: absorbed (face mostly in
  shadow, not identifiable). Clothing: plain t-shirt. Background: dark room (full scene). Ratio 16:9. Not isolated.
  Halftone: duotone.
- Prompt:
  > Documentary photograph of a teenager sitting hunched on the edge of a bed in a dark bedroom at night, holding a smartphone
  > in landscape with both hands, face mostly in shadow and not identifiable, lit only by the blue glow of the screen, the screen
  > itself facing away from the camera, plain t-shirt, side profile from slightly behind, photorealistic, no text, 16:9.

#### G12 · P2 · Wooden gavel (sentences 123–126)
- Subject: a judge's wooden gavel resting on its sound block. 3/4 view, 85 mm, white background, 4:3, isolated, halftone mono.
- Prompt:
  > Product photograph of a wooden judge's gavel resting on a round wooden sound block, three-quarter view, soft key light from
  > upper left, isolated on seamless pure white background, photorealistic, 4:3.

#### G13 · P2 · Hand signing a document (sentences 120–122)
- Subject: an anonymous hand in a dark suit sleeve signing the bottom of a blank sheet with a fountain pen. Camera: top-down,
  50 mm. Crop: hand, pen and lower half of the sheet. Background: dark wooden desk (full scene). 16:9. Not isolated. Halftone mono.
- Prompt:
  > Top-down documentary photograph of an anonymous hand in a dark suit sleeve signing the bottom of a blank white sheet of
  > paper with a black fountain pen on a dark wooden desk, soft key light from upper left, photorealistic, no text on the paper, 16:9.

#### G14 · P2 · Boardroom, two empty chairs pushed back (sentences 130–131)
- Subject: a modern boardroom table with eight black leather chairs; two chairs pushed back and turned away. Camera:
  elevated 3/4, 24 mm. Lighting: soft window light from the left. Background: full scene, neutral walls. 16:9. Not isolated.
  Halftone duotone.
- Prompt:
  > Documentary photograph of a modern corporate boardroom with a long table and eight black leather chairs, two of the chairs
  > pushed back from the table and turned away as if two people just left, elevated three-quarter view, soft window light from
  > the left, neutral walls, no people, no screens, no logos, photorealistic, 16:9.

#### G15 · P3 · Data-centre aisle (sentences 159–163)
- Subject: a long, symmetrical data-centre cold aisle with server racks on both sides. Camera: centred, eye level, 24 mm,
  strong one-point perspective. Lighting: cool even overhead light. Full scene. 16:9. Not isolated. Halftone duotone.
- Prompt:
  > Documentary photograph of a long symmetrical data centre cold aisle, rows of black server racks on both sides with small
  > blue and green LEDs, strong one-point perspective, cool even overhead light, no people, no logos, photorealistic, 16:9.

#### G16 · P3 · Man in a suit climbing steps, from behind (sentences 172–176)
- Subject: an anonymous man in a dark suit with a leather folder walking up wide stone steps, seen from behind. Camera: low
  angle, 50 mm. Crop: full body. White background (steps included, isolated). 4:5. Halftone mono.
- Prompt:
  > Documentary photograph of an anonymous man in a dark suit carrying a leather folder, walking up wide pale stone steps, seen
  > from behind and slightly below, full body, face not visible, soft key light from upper left, isolated on seamless pure white
  > background, photorealistic, 4:5.

#### G17 · P3 · Esports crowd, back view (sentence 192)
- Subject: a dense crowd of young fans in an arena seen from behind, facing a bright stage (stage abstract, no screens content).
  Camera: from behind the crowd, slightly elevated, 35 mm. Lighting: stage backlight + rim. Full scene, 21:9, not isolated, halftone duotone.
- Prompt:
  > Documentary photograph from behind of a dense crowd of young esports fans in a dark arena facing a bright abstract stage,
  > silhouettes with rim light, raised hands, no screens with content, no logos, no text, photorealistic, 21:9.

#### G18 · P3 · Scissors (sentence 187)
- Subject: a pair of large steel tailor's scissors, open, side view. White background, 3:2, isolated, halftone mono.
- Prompt:
  > Product photograph of a pair of large open steel tailor's scissors, side view, soft key light from upper left, isolated on
  > seamless pure white background, photorealistic, 3:2.
