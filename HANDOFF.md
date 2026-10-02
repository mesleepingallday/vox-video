# Tencent explainer video: handoff

Everything done so far on the "Tencent" YouTube explainer, written so a new Claude Code session can pick it up without the original chat.

**Status: no video has been rendered.** The engine and illustration library below are written but have never been loaded in a browser. No frame has been looked at. Treat all code as a first draft.

## 1. The job

- **Deliverable:** one complete MP4, 1080p (or 2K), synced to the supplied voiceover, for YouTube.
- **Inputs:** `input/voice_1.mp3` (586.8 s, mono, 44.1 kHz) and `input/script.md` (7 chapters plus an ending, about 2,283 spoken words).
- **Style brief:** Vox-style editorial explainer, paper-cut collage, clean infographics, subtle hand-drawn sketch textures, fast-paced economic visualization. Intelligent, premium.
- **Owner preferences:** chat in Vietnamese; all outputs (scripts, on-screen text, prompts) in English. 16:9 only. Quality over time.
- **Constraints adopted:** no real logos and no likenesses of real people (typographic name tags and generic halftone silhouettes instead). No music or sound effects; the owner adds those in CapCut.

## 2. The blocker: audio-to-script sync

The first environment had no network and no speech-recognition model, so the voiceover could not be transcribed. The timing table in section 7 is an **estimate**.

What is known about the audio:

- About 233 words per minute, far faster than normal narration. Roughly 7.3 syllables per second of speech by the syllable counter in `textprep.py`.
- Almost no pauses: 211 gaps of 0.12 s or more, none longer than 0.6 s. Many sentence boundaries have no detectable pause.
- Chapter titles appear to be read aloud. Evidence is suggestive, not conclusive: a sound matching the opening word recurs at 77.2 s, where the estimate puts "Chapter 2".

What was tried, and how it went:

| Method | Result |
| --- | --- |
| Pause-based dynamic programming (`align3.py`) | Produces the current estimate. A permutation test showed it fits shuffled sentence orders equally well, so the pause structure alone does not validate it. |
| Crude HMM on silence / vowel / sibilant classes (`hmm.py`) | Unusable; sentence rates varied wildly. |
| DTW against a flite-synthesized reference (`mkref.py`, `dtw.py`) | Method works on synthetic test audio (17 ms median error) but did not lock onto the real voice; true and shuffled orders scored the same. |
| Repeated-phrase acoustic anchors (`anchors2.py`, `chain.py`) | Finds real repeats, but too many false matches to trust. |

Expected error of the estimate: about 1 to 3 seconds in places, possibly more. At this pace that is a whole sentence.

**First thing to do in the new session:** get real timestamps. Either the owner supplies an SRT (CapCut auto-captions export), or install a Whisper-family model and transcribe `voice_1.mp3` with word timestamps. Then regenerate `app/timing.js` in the same shape (section 7). Also confirm whether chapter titles and the closing disclaimer are spoken.

## 3. Architecture

Scenes are code. Every frame is a pure function of time, so a change is one edit and a re-render.

- **Page:** one HTML file, a 1920×1080 stage. All scenes are built as DOM on load and hidden.
- **Timeline:** every animation is a paused Web Animations API animation; `seek(T)` sets `currentTime` on the animations of the active scene and runs per-scene tick functions (counters, pie wedges, travelling dots, paper "boil" jitter at 8 steps per second).
- **Capture:** Playwright + headless Chromium, `Page.captureScreenshot` as JPEG, piped to ffmpeg. Measured about 90 ms per frame without a full-screen blend layer, about 128 ms with one. So no `mix-blend-mode` overlay in the page; add film grain in ffmpeg (`noise=c0s=5:c0f=t+u`).
- **Frame rate:** 24 fps, 14,083 frames. Estimated 25 to 40 minutes on one core.
- **Render in segments** (for example one per minute) to separate video-only files, then concat and mux the audio. A failed or revised segment is re-rendered alone.
- Remotion or HyperFrames would also work if the new environment has npm access. The scene plan and art carry over either way.

## 4. Design system

**Palette**

| Name | Hex | Use |
| --- | --- | --- |
| cream | `#EDE4CF` | default background paper |
| white | `#FAF6EA` | cards, documents |
| ink | `#1A1814` | text, dark tags |
| yellow | `#FFCF2B` | highlighter, date tags |
| red | `#E2432A` | China, alerts, losses |
| blue | `#2553C7` | United States |
| navy | `#17223F` | Washington chapters background |
| teal | `#1A8A70` | money, confirmations |
| kraft | `#C7A374` | map land, secondary paper |

**Type** (all installed in the first environment; substitute if missing)

- Display: TeX Gyre Heros Cn Bold, uppercase. Class `d`.
- Serif: Lora, regular and italic, for quotes and annotations. Classes `s`, `si`, `sb`.
- Typewriter: TeX Gyre Cursor Bold, for dates, sources, documents. Class `m`.
- Labels: Poppins Medium, uppercase, tracked. Class `p`.
- Chinese accents: Noto Serif CJK SC Black. Class `cjk`. Used sparingly: 腾讯 (Tencent), 深圳 (Shenzhen), 精神鸦片 (spiritual opium), 微信 (Weixin).

**Motion language**

- Hard cuts between beats; clip-path wipes for emphasis; a full-colour chapter card per chapter.
- Paper pieces pop, drop or stamp in; highlighter sweeps; hand-drawn arrows, circles and underlines draw on.
- A slow camera push on every scene.
- Source credit bottom-left in typewriter face whenever the script cites an outlet.

## 5. What index.html must provide

Not written yet. The engine expects:

- `<div id="stage"><div id="scenes"></div></div>`, stage 1920×1080 with `overflow:hidden`.
- A global `TOTAL` (586.8) and a call to `buildAll()` after scenes are declared, then `seek(t)` exposed for the renderer.
- CSS: `.scene` (absolute, `display:none`), `.cam`, `.bg` (inset about -54px -96px, `background-size:cover`), `.e` (absolute), `.e.ctr` (`transform:translate(-50%,-50%); transform-origin:0 0`), `.i` (relative), `.tx` (`white-space:nowrap; line-height:1.02`), font classes above, `.w` (`inline-block`), `.sh` and `.pp` (absolute, inset 0; `.pp` with `background-size:1024px 1024px`), `.tape`, `.tg`, `.stamp` (7px border, slight radius).
- `mk` (highlighter) and `sk` (strike-through) inline elements drawn with a no-repeat linear-gradient background whose `background-size` the engine animates.
- A hidden SVG `<defs>` with: `#gr` (radial shading gradient), `#ht` (dark halftone dots), `#htl` (light halftone for map land), `#hatch` (diagonal hatch).

**Known issues to fix on first run**

- `Nd.hl()` and `Nd.strike()` animate `background-size` to `100% 100%`; the intended heights are about 82% and 12%.
- `stroke()` with a dash pattern only fades in; it does not draw on.
- `chart()` and `travel()` have never executed. Check `getPointAtLength` on hidden scenes.
- The world map coastlines were typed by hand from memory. Look at a rendered still before using it.

## 6. Storyboard (about 75 scenes)

Numbers in brackets are sentence ids from the timing table.

**Chapter 1: The Copycat From Shenzhen**

1. [0] Chapter card.
2. [1] "NOVEMBER 1998 · SHENZHEN" date tag, skyline, five silhouettes.
3. [2–3] Leader silhouette, name tag "Ma Huateng", arrow "Pony", card 马 = horse.
4. [4–5] "IT WAS A COPY." stamp over two offset chat windows.
5. [6] ICQ card (Israel) → "acquired by" → AOL card; CRT monitor.
6. [7–8] "FEBRUARY 1999", monitor showing OICQ, note "Open ICQ".
7. [9–10] "AOL OBJECTED", arbitration document, ICQ circled inside OICQ.
8. [11–13] OICQ struck through, giant "QQ".
9. [14–16] Users line rising to one million; server racks; "no profit until 2001".
10. [17–20] "EARLY 2001": Growing fast / Burning cash / Looking for a backer.
11. [21–23] World map, arc South Africa → Shenzhen; Naspers card (est. 1915); $32 million for 46.5% pie.
12. [24–25] Giant "$32,000,000".
13. [26–28] 2019 Amsterdam listing; $32M → €118B ≈ $130B; "×4,000"; note that part was already sold. Source: CNN.
14. [29–30] "One of the most successful technology investments ever made."

**Chapter 2: The $400 Million Bet**

15. [31] Chapter card.
16. [32–34] Late 2000s; games business; "needs: HITS".
17. [35–37] Map pin Los Angeles; Riot Games; League of Legends box; "early investor", "China distributor".
18. [38–39] February 2011; $400 million; 93% pie.
19. [40] Quote: "Riot is going to remain completely independent." Brandon Beck.
20. [41–44] December 2015 blog post mock; pie 93 → 100%; stamp "PRICE: UNDISCLOSED".
21. [45–49] The Tencent playbook checklist; "Nothing on the box changes."
22. [50–53] Honor of Kings vs League of Legends boxes; "clone?"; players pulled between. Source: The Motley Fool.
23. [54–55] June 2012; map pin Cary, North Carolina; Epic Games; $330 million.
24. [56] Pie 48.4% of outstanding shares → 40% with options. Source: Tim Sweeney via Polygon.
25. [57–59] "Sweeney kept control"; departures: Mike Capps, Cliff Bleszinski. Source: Variety.
26. [60–61] "FORTNITE"; April 2022, $31.5 billion.
27. [62–65] The math on graph paper: 28% × $31.5B ≈ $8.8B against a $330M check.

**Chapter 3: The Quiet Empire**

28. [66] Chapter card.
29. [67–69] Map pin Helsinki; Supercell 84%, mostly from SoftBank; $8.6B deal, $10.2B valuation.
30. [70–72] Familiar promise ticks; gaming is more than half of revenue.
31. [73–75] Wall of studio tags: stakes in Ubisoft, Paradox, Remedy, Techland, Krafton, FromSoftware; owns Funcom and Grinding Gear Games.
32. [76–79] November 2025 Ubisoft rescue; €1.16B into a new subsidiary; 26.32% pie.
33. [80–82] "Ubisoft kept control"; quote "deleverages the Group"; handwritten "= pays down debt".
34. [83–88] Three game boxes (Riot, Epic, Supercell); nothing on the box says Tencent.
35. [89–92] Phone, 微信; 1.439 billion monthly users; ¥204.8B revenue, up 11%; about ¥2.25B a day.
36. [93–94] Flow: copycat chat app → cash machine → a piece of global gaming.
37. [95–98] Split screen: Beijing (red) and Washington (blue).

**Chapter 4: Beijing Bites**

38. [99] Chapter card.
39. [100–102] Newspaper clipping, 3 August 2021; "spiritual opium" highlighted; Honor of Kings; eight hours a day.
40. [103–106] Stock chart: down as much as 11%; phrase struck out; closed down 6.1%.
41. [107–109] Tencent's limits; under-12 purchase ban; stamp "NOT ENOUGH".
42. [110–112] Clock 8–9 p.m.; calendar Fri/Sat/Sun; "3 hours a week".
43. [113–116] "At home, it doesn't make the rules"; money flows west.
44. [117–118] Source: TechCrunch, 2019; "the West was getting less comfortable".

**Chapter 5: Washington Wakes Up**

45. [119] Chapter card (navy).
46. [120–122] August 2020 executive order document; WeChat and TikTok; "national security".
47. [123–126] Court: Judge Laurel Beeler blocks the ban; quote "the specific evidence about WeChat is modest."
48. [127–129] June 2021, orders revoked; Round one to Tencent; Round two.
49. [130–131] 18 December 2024, Justice Department; boardroom with two chairs leaving; Clayton Act, 1914.
50. [132–135] Logic diagram: Tencent owns Riot; Riot competes with Epic.
51. [136–139] Resigned voluntarily; gave up appointment right; no court fight.
52. [140–142] January 2025; Pentagon; Section 1260H list.
53. [143–144] Tencent quote: "clearly a mistake… not a military company or supplier."
54. [145–146] Hong Kong shares down 7.3%; $35.4 billion. Source: Reuters.
55. [147–150] What the label does and does not do; procurement ban from end of June 2026.
56. [151–155] June 2026 list, 188 entities; "indirectly affiliated"; evidence not public.

**Chapter 6: The Divestment Question**

57. [156] Chapter card.
58. [157–158] March 2026, Financial Times; the question; Epic, Riot, Supercell tags.
59. [159–163] The concern is data; what is known versus what is asked.
60. [164–166] U.S. Army and Unreal Engine. Source: Tom's Hardware citing the FT.
61. [167–170] CFIUS across two administrations; forced sale versus safeguards; no resolution.
62. [171] Declined to comment; shares fell.
63. [172–174] July 2025 lobbyist registration; $175,000. Source: Washington Examiner.
64. [175–176] Two McEntee quotes. Source: Bloomberg.
65. [177–180] Status board, early October 2026.

**Chapter 7: What's Really at Stake**

66. [181–182] Chapter card with label "ANALYSIS, NOT REPORTING".
67. [183–186] Riot owned outright; Epic minority, no board seats; "a short list" of buyers.
68. [187–190] Scissors on a cord; "a source of money".
69. [191–195] Two-way flow: Valorant record in China; Tencent funds Western studios.

**Ending: Why It Matters**

70. [196–197] The question.
71. [198–205] "Patience. Cash. A playbook."; recap tags.
72. [206–208] Logo on the screen versus the list of shareholders.
73. [209–210] Connected globe tears apart.
74. [211–213] Washington, Beijing, Tencent between them.
75. [214–216] "Decided by two governments"; disclaimer card.

## 7. Timing table (estimated)

`app/timing.js` defines `TM[id] = {t0, t1, kind, text, words: [[word, t0], …]}`. Regenerate it in this shape from real timestamps. Sentence starts below, in seconds:

| id | start (s) | text |
| --- | --- | --- |
| 0 | 0.0 | **Chapter 1 — The Copycat From Shenzhen** |
| 1 | 1.3 | In November 1998, five young men in Shenzhen started a small software company. |
| 2 | 5.6 | Their leader was Ma Huateng. |
| 3 | 6.7 | In English, he goes by Pony, a play on his family name, Ma, which means "horse." |
| 4 | 10.0 | Their first big product wasn't original. |
| 5 | 11.9 | It was a copy. |
| 6 | 12.7 | An Israeli company had built ICQ, one of the world's first internet chat programs, and America Online had bought it. |
| 7 | 18.7 | In February 1999, Tencent released a Chinese-language version and called it OICQ. |
| 8 | 23.4 | Open ICQ. |
| 9 | 25.1 | AOL objected. |
| 10 | 26.1 | It filed an arbitration claim in the United States, arguing that Tencent's OICQ web addresses infringed the ICQ trademark. |
| 11 | 31.0 | So Tencent renamed the product. |
| 12 | 32.1 | The new name was just two letters: QQ. |
| 13 | 33.4 | QQ took off. |
| 14 | 34.0 | It hit a million users in its first year. |
| 15 | 36.1 | But it was free, and every new user cost money in servers and bandwidth. |
| 16 | 39.2 | Tencent didn't turn a profit until 2001. |
| 17 | 42.0 | So picture the company in early 2001. |
| 18 | 43.9 | Growing fast. |
| 19 | 44.9 | Burning cash. |
| 20 | 45.4 | And looking for someone willing to bet on it. |
| 21 | 47.5 | That someone came from the other side of the world. |
| 22 | 49.1 | Naspers was a South African media group that started out in 1915. |
| 23 | 52.3 | In 2001, it paid about 32 million dollars for a 46.5% stake in Tencent. |
| 24 | 56.3 | Hold on to that number. |
| 25 | 57.2 | Thirty-two million dollars. |
| 26 | 58.4 | In 2019, Naspers moved its Tencent holding into a new company listed in Amsterdam. |
| 27 | 61.7 | By then, CNN reported, the stake was worth about 118 billion euros, or roughly 130 billion dollars. |
| 28 | 66.4 | That's around four thousand dollars of value for every dollar Naspers put in, and that's after Naspers had already sold part of the stake along the way. |
| 29 | 72.3 | It became one of the most successful technology investments ever made. |
| 30 | 74.7 | And it gave Tencent the fuel for everything that came next. |
| 31 | 77.1 | **Chapter 2 — The $400 Million Bet** |
| 32 | 78.5 | By the late 2000s, QQ had made Tencent a giant in China. |
| 33 | 81.3 | It was also building a games business. |
| 34 | 83.3 | And every games business needs the same thing: hits. |
| 35 | 84.8 | One of those hits came from a small studio in Los Angeles called Riot Games. |
| 36 | 87.6 | Its game was League of Legends. |
| 37 | 88.5 | Tencent was already an early investor in Riot and the game's distributor in China. |
| 38 | 92.5 | Then, in February 2011, Tencent went much further. |
| 39 | 94.8 | It paid about 400 million dollars for a 93% stake in Riot. |
| 40 | 97.9 | At the time, Riot's CEO Brandon Beck told the trade press that "Riot is going to remain completely independent." |
| 41 | 102.5 | Four years later, in December 2015, Riot mentioned something almost in passing. |
| 42 | 105.5 | In a blog post about changes to employee pay, it noted that Tencent had bought the rest of the company. |
| 43 | 110.5 | The price was never disclosed. |
| 44 | 112.0 | Riot was now wholly owned by Tencent. |
| 45 | 113.4 | That's the Tencent playbook in miniature. |
| 46 | 114.7 | Buy in big. |
| 47 | 115.2 | Promise independence. |
| 48 | 116.4 | Let the studio keep its name, its offices, and its culture. |
| 49 | 118.6 | Nothing on the box changes. |
| 50 | 119.8 | But independence has limits. |
| 51 | 121.0 | Tencent went on to release Honor of Kings, which became its highest-grossing mobile game. |
| 52 | 124.6 | According to reporting by The Motley Fool, Riot considered Honor of Kings a League of Legends clone that could pull players away from its own game. |
| 53 | 130.0 | The owner and the studio it owned were competing for the same players. |
| 54 | 132.9 | In June 2012, Tencent made its second big American move. |
| 55 | 136.0 | It invested 330 million dollars in Epic Games of Cary, North Carolina, then best known for Gears of War. |
| 56 | 140.5 | Founder Tim Sweeney later told Polygon that the deal bought about 48.4% of Epic's outstanding shares, or 40% of the company once employee stock options were counted. |
| 57 | 148.3 | Sweeney kept control. |
| 58 | 149.0 | But Variety later reported that the deal fundamentally changed how Epic built and released games. |
| 59 | 152.7 | Several of its best-known leaders left, including president Mike Capps and designer Cliff Bleszinski. |
| 60 | 156.5 | And the new direction led to the game that changed everything: Fortnite. |
| 61 | 159.1 | By April 2022, Epic was valued at 31.5 billion dollars. |
| 62 | 163.0 | Now do the math. |
| 63 | 163.4 | Over the years, Tencent's stake has been diluted to around 28%, according to multiple reports. |
| 64 | 167.9 | Even at that size, at Epic's 2022 valuation, it would be worth close to nine billion dollars on paper. |
| 65 | 173.6 | The original check was 330 million. |
| 66 | 175.3 | **Chapter 3 — The Quiet Empire** |
| 67 | 176.4 | Then Tencent went shopping in Europe. |
| 68 | 178.2 | In June 2016, it agreed to buy about 84% of Supercell, the Finnish maker of Clash of Clans, mostly from Japan's SoftBank. |
| 69 | 183.2 | The deal was valued at roughly 8.6 billion dollars, and it valued Supercell as a whole at about 10.2 billion. |
| 70 | 188.2 | The promise was familiar. |
| 71 | 189.0 | Supercell's management would keep its operational independence, and the company would stay in Finland. |
| 72 | 192.8 | By then, gaming made up more than half of Tencent's revenue. |
| 73 | 195.1 | The list kept growing. |
| 74 | 196.4 | Tencent took stakes in Ubisoft, Paradox, Remedy, Techland, Krafton, and FromSoftware. |
| 75 | 199.9 | It owns Funcom, the studio behind Dune: Awakening, and Grinding Gear Games, the studio behind Path of Exile, outright. |
| 76 | 205.3 | Then, in November 2025, came a deal that looked a lot like a rescue. |
| 77 | 208.1 | Ubisoft, the French publisher, was under pressure and carrying debt. |
| 78 | 210.4 | Tencent put 1.16 billion euros into a new Ubisoft subsidiary built around Assassin's Creed, Far Cry, and Rainbow Six. |
| 79 | 215.8 | In return, it got a 26.32% economic interest. |
| 80 | 218.6 | Ubisoft kept control. |
| 81 | 219.3 | CEO Yves Guillemot said the money "deleverages the Group." |
| 82 | 221.7 | In plain English, it helped pay down debt. |
| 83 | 222.8 | Here's what makes all of this so unusual. |
| 84 | 224.3 | Tencent rarely puts its own name on the box. |
| 85 | 226.0 | Riot is still Riot. |
| 86 | 227.0 | Epic is still Epic. |
| 87 | 228.3 | Supercell is still Supercell. |
| 88 | 229.2 | The empire is built out of other people's brands. |
| 89 | 231.1 | And paying for it all is the machine back home: WeChat, called Weixin in China. |
| 90 | 233.3 | In the second quarter of 2026, Tencent reported 1.439 billion monthly users across Weixin and WeChat. |
| 91 | 237.3 | Its revenue for those three months was 204.8 billion yuan, up 11% from a year earlier. |
| 92 | 241.2 | That's about 2.25 billion yuan coming in every single day. |
| 93 | 243.9 | So that's the rise. |
| 94 | 244.9 | A copycat chat app becomes a cash machine, and the cash machine buys a piece of global gaming. |
| 95 | 248.1 | But there was a problem. |
| 96 | 248.8 | Two of them, actually. |
| 97 | 249.7 | One in Beijing. |
| 98 | 250.7 | And one in Washington. |
| 99 | 251.4 | **Chapter 4 — Beijing Bites** |
| 100 | 252.1 | On August 3, 2021, a newspaper affiliated with Xinhua, China's state news agency, published an article about kids and video games. |
| 101 | 257.4 | It called online games "spiritual opium." |
| 102 | 259.1 | It singled out Tencent's own Honor of Kings, and it cited a student who said some kids played the game for eight hours a day. |
| 103 | 263.9 | In China, the word "opium" carries heavy history. |
| 104 | 266.5 | Tencent's stock fell as much as 11%. |
| 105 | 268.3 | Later that day, the article reappeared with the phrase "spiritual opium" removed. |
| 106 | 272.1 | Tencent's shares still closed down 6.1%. |
| 107 | 273.5 | Within hours, Tencent announced new limits on how long minors could play. |
| 108 | 275.8 | It also banned children under 12 from making in-game purchases. |
| 109 | 278.6 | It wasn't enough. |
| 110 | 279.2 | At the end of August, regulators set new rules. |
| 111 | 280.9 | Anyone under 18 could play online games only from 8 to 9 p.m., and only on Fridays, weekends, and public holidays. |
| 112 | 285.6 | For most weeks of the year, that's three hours. |
| 113 | 286.9 | This is the part of the story Western audiences tend to miss. |
| 114 | 289.3 | Tencent is enormous. |
| 115 | 290.5 | But at home, it doesn't make the rules. |
| 116 | 291.6 | And that helps explain why so much of its money kept flowing west. |
| 117 | 293.7 | As TechCrunch noted back in 2019, regulatory risk at home is one reason Tencent kept buying stakes in game studios overseas. |
| 118 | 298.7 | But the West was getting less comfortable, too. |
| 119 | 300.6 | **Chapter 5 — Washington Wakes Up** |
| 120 | 301.6 | The first shot came in August 2020. |
| 121 | 303.4 | President Trump signed an executive order targeting WeChat, alongside a similar order for TikTok. |
| 122 | 306.8 | The administration said apps developed and owned by Chinese companies threatened national security. |
| 123 | 311.3 | WeChat users in the United States sued. |
| 124 | 312.7 | In September 2020, a federal magistrate judge, Laurel Beeler, blocked the ban. |
| 125 | 316.6 | She wrote that there was considerable evidence some Chinese technologies posed a real security threat, but "the specific evidence about WeChat is modest." |
| 126 | 322.7 | The ban never took effect. |
| 127 | 324.2 | In June 2021, President Biden revoked the orders and replaced them with a new review process. |
| 128 | 327.4 | Round one went to Tencent. |
| 129 | 328.2 | Round two was quieter, and it hit gaming directly. |
| 130 | 330.6 | On December 18, 2024, the Justice Department announced that two Tencent-nominated directors had left the board of Epic Games. |
| 131 | 336.8 | The issue was a 1914 antitrust law, the Clayton Act, which bars the same people from sitting on the boards of competing companies. |
| 132 | 341.5 | The department's reasoning was simple. |
| 133 | 342.9 | Tencent owns Riot. |
| 134 | 343.8 | Riot competes with Epic. |
| 135 | 345.3 | So Tencent's people shouldn't sit in Epic's boardroom. |
| 136 | 347.5 | Epic said the two directors resigned voluntarily because of the department's concerns. |
| 137 | 352.3 | Tencent also gave up its right to appoint directors to Epic's board on its own. |
| 138 | 355.2 | There was no court fight. |
| 139 | 356.1 | Under pressure, Tencent simply stepped back. |
| 140 | 358.1 | Then came the bigger blow. |
| 141 | 358.9 | In January 2025, the Pentagon added Tencent to something called the Section 1260H list. |
| 142 | 363.5 | It's a roster, required by a 2021 defense law, of companies the Pentagon considers "Chinese military companies" operating in the United States. |
| 143 | 369.6 | Tencent's response was blunt: "Tencent's inclusion on this list is clearly a mistake. |
| 144 | 372.7 | We are not a military company or supplier." |
| 145 | 375.0 | Investors weren't so sure. |
| 146 | 376.0 | According to Reuters, Tencent's Hong Kong shares fell 7.3% the next day, wiping out about 35.4 billion dollars in market value. |
| 147 | 382.5 | So what does the label actually do? |
| 148 | 384.2 | Less than it sounds, at least at first. |
| 149 | 385.4 | It isn't a sanctions list, and it doesn't ban Tencent from doing business in America. |
| 150 | 389.2 | But the Pentagon can't work with listed companies, and a ban on the Pentagon buying goods and services from them took effect at the end of June 2026. |
| 151 | 396.7 | Tencent wanted off. |
| 152 | 397.4 | In June 2026, the Pentagon published its updated list, now 188 entities long. |
| 153 | 401.6 | Tencent was still on it. |
| 154 | 402.7 | The Pentagon's document says Tencent is "indirectly affiliated" with the People's Liberation Army. |
| 155 | 406.1 | The designation doesn't require the Pentagon to lay out its evidence publicly, and Tencent has been seeking its removal ever since. |
| 156 | 410.9 | **Chapter 6 — The Divestment Question** |
| 157 | 412.3 | Which brings us to March 2026. |
| 158 | 414.2 | The Financial Times reported that senior White House officials had held meetings on a striking question: should Tencent be allowed to keep its stakes in Epic, Riot, and Supercell at all? |
| 159 | 421.4 | The concern, as reported, is data. |
| 160 | 423.1 | Officials were weighing whether Tencent's ownership could give it access to information on millions of American players. |
| 161 | 427.0 | Let's be precise about what's known. |
| 162 | 428.5 | The reporting we reviewed doesn't describe any finding that Tencent has actually accessed American player data. |
| 163 | 433.7 | The question officials were debating is whether it could. |
| 164 | 436.1 | There's a technology angle, too. |
| 165 | 437.5 | Citing the FT, Tom's Hardware reported that the U.S. Army has worked directly with Epic for years on early versions of its Unreal Engine technology. |
| 166 | 444.6 | Tencent's stake in the company that builds that engine added to the scrutiny. |
| 167 | 447.8 | This review isn't new. |
| 168 | 448.8 | According to the same reporting, it sits with CFIUS, a Treasury-led committee that screens foreign investment, and it has dragged on across two administrations without a resolution. |
| 169 | 456.3 | Under President Biden, then–Deputy Attorney General Lisa Monaco reportedly pushed for a forced sale. |
| 170 | 460.7 | The Treasury Department reportedly preferred letting the investments stay, under data-protection safeguards. |
| 171 | 464.7 | When the FT story broke, Tencent declined to comment, and Tencent's shares fell. |
| 172 | 467.9 | Meanwhile, Tencent has been fighting back the Washington way. |
| 173 | 469.8 | In July 2025, John McEntee, who ran presidential personnel in Trump's first term, registered as a lobbyist for Tencent's American arm. |
| 174 | 475.4 | According to a disclosure reported by the Washington Examiner, he was paid 175,000 dollars for his work between July and September 2025. |
| 175 | 482.0 | His argument, as he told Bloomberg in September 2026, is that the designations are "an unnecessary point of tension" in the relationship with China. |
| 176 | 490.1 | "Trump's appointees," he said, "should update the lists to reflect their boss's thinking." |
| 177 | 493.0 | So here's where things stand as of early October 2026. |
| 178 | 495.7 | Tencent is still on the Pentagon's list. |
| 179 | 497.0 | Public reporting shows no final decision on the divestment review. |
| 180 | 499.9 | And when Presidents Trump and Xi met in Washington in late September, that list was one of the irritants hanging over the talks. |
| 181 | 505.4 | **Chapter 7 — What's Really at Stake** |
| 182 | 506.5 | This part is analysis, not reporting. |
| 183 | 508.3 | If Washington ever forced a sale, Riot would be the most obvious target, because Tencent owns it outright. |
| 184 | 513.3 | At Epic, Tencent is a minority shareholder with no board seats left. |
| 185 | 516.7 | Any forced sale of Riot would need a buyer big enough to afford it and acceptable to regulators. |
| 186 | 521.1 | That's a short list. |
| 187 | 521.7 | But cutting the cord would cut both ways. |
| 188 | 523.3 | Tencent isn't just an owner. |
| 189 | 524.6 | It's a source of money. |
| 190 | 525.7 | Ubisoft used Tencent's cash to pay down debt. |
| 191 | 528.0 | And the flow runs back the other way, too. |
| 192 | 529.3 | In the second quarter of 2026, Tencent said Riot's Valorant hit a record for daily players on PC in China. |
| 193 | 534.3 | That's the irony at the center of this story. |
| 194 | 536.2 | An American-made game is helping drive a Chinese company's growth at home. |
| 195 | 539.3 | And that Chinese company is helping fund studios in America and Europe. |
| 196 | 542.5 | **Ending — Why It Matters** |
| 197 | 543.7 | So how did Tencent end up with a piece of so much of Western gaming? |
| 198 | 546.5 | Patience. |
| 199 | 546.7 | Cash. |
| 200 | 546.9 | And a playbook. |
| 201 | 547.4 | It bought in early, often when studios needed money. |
| 202 | 549.8 | Most of Riot cost 400 million dollars. |
| 203 | 551.4 | A huge piece of Epic cost 330 million. |
| 204 | 553.1 | It let founders keep their names and their cultures. |
| 205 | 554.5 | And it never needed you to know who it was. |
| 206 | 556.4 | That's the deeper lesson about power in the modern economy. |
| 207 | 559.0 | The most influential owner isn't always the one with its logo on the screen. |
| 208 | 562.7 | Sometimes it's the one on the list of shareholders. |
| 209 | 564.8 | For two decades, that model worked because the world was getting more connected. |
| 210 | 568.0 | Now the world is splitting apart. |
| 211 | 569.1 | Washington sees ownership as a security question. |
| 212 | 571.6 | Beijing sees games as a social question. |
| 213 | 572.8 | And Tencent is standing right between them, holding a stake in some of the biggest games on Earth. |
| 214 | 576.6 | Whether it gets to keep them may not be decided by players, or even by markets. |
| 215 | 579.8 | It may be decided by two governments. |
| 216 | 581.5 | This video is for educational purposes only and isn't investment advice. |

## 8. Source: app/engine.js

```js
'use strict';
/* ---------- deterministic timeline engine (every frame = pure function of time) ---------- */
const FPS = 24, LEAD = 0.10, W = 1920, H = 1080;
const $ = id => document.getElementById(id);
const DEFS = [], SC = [];
let cur = null;
const OV = { anims: [], tick: [] };
function rnd(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
let R = rnd(20261002);
const rr = (a, b) => a + (b - a) * R();
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const EZ = { out: 'cubic-bezier(.16,1,.3,1)', back: 'cubic-bezier(.34,1.56,.64,1)', io: 'cubic-bezier(.65,0,.35,1)', inn: 'cubic-bezier(.5,0,.75,0)', soft: 'cubic-bezier(.3,.6,.3,1)' };
const easeOut = x => 1 - Math.pow(1 - clamp(x, 0, 1), 3);
const easeIO = x => { x = clamp(x, 0, 1); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };

/* ---------- timing lookups (sentence ids from the script) ---------- */
const S = id => TM[id].t0, En = id => TM[id].t1;
function Wt(id, word, nth) {
  const key = word.toLowerCase(); let k = 0;
  for (const [w, t] of TM[id].words) { if (w.toLowerCase().replace(/[^a-z0-9$%.']/g, '').startsWith(key)) { if (k === (nth || 0)) return t; k++; } }
  console.warn('WORD NOT FOUND', id, word); return TM[id].t0;
}

/* ---------- animation primitive ---------- */
function A(node, kf, t, dur, ease, fill) {
  const a = node.animate(kf, { delay: Math.max(0, t) * 1000, duration: Math.max(1, dur * 1000), fill: fill || 'both', easing: ease || 'linear' });
  a.pause(); (cur ? cur.anims : OV.anims).push(a); return a;
}
function tick(f) { (cur ? cur.tick : OV.tick).push(f); }

/* ---------- scenes ---------- */
function scene(t0, o, build) { DEFS.push({ t0, o: o || {}, build }); }
function buildAll() {
  DEFS.sort((a, b) => a.t0 - b.t0);
  DEFS.forEach((d, i) => {
    const t1 = i + 1 < DEFS.length ? DEFS[i + 1].t0 : TOTAL;
    const o = d.o, root = document.createElement('div'), cam = document.createElement('div'), bg = document.createElement('div');
    root.className = 'scene'; cam.className = 'cam'; bg.className = 'bg';
    bg.style.backgroundImage = `url(tex/bg_${o.bg || 'cream'}.jpg)`; cam.appendChild(bg); root.appendChild(cam); $('scenes').appendChild(root);
    const sc = { t0: d.t0, t1, root, cam, anims: [], tick: [], boil: [], o, ext: 0, idx: i, dark: /navy|ink|blue|red/.test(o.bg || '') };
    SC.push(sc); cur = sc; R = rnd(1000 + i * 77);
    const dur = t1 - d.t0, z0 = o.z0 || 1.0, z1 = o.z1 || (1 + Math.min(0.06, 0.008 * dur + 0.012));
    cam.style.transformOrigin = `${o.ox === undefined ? [42, 58, 50, 46, 55][i % 5] : o.ox}% ${o.oy === undefined ? [46, 54, 50, 58, 44][i % 5] : o.oy}%`;
    A(cam, [{ transform: `scale(${z0}) translate(${o.px0 || 0}px,${o.py0 || 0}px)` }, { transform: `scale(${z1}) translate(${o.px1 || 0}px,${o.py1 || 0}px)` }], d.t0, dur + .6, 'linear');
    if (o.tr === 'wipe' || o.tr === 'wipeL' || o.tr === 'wipeU') {
      const from = o.tr === 'wipeU' ? 'inset(100% 0 0 0)' : o.tr === 'wipeL' ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)';
      A(root, [{ clipPath: from }, { clipPath: 'inset(0 0 0 0)' }], d.t0, .38, EZ.io);
      if (i > 0) SC[i - 1].ext = .42;
    }
    sc.T0 = d.t0; sc.T1 = t1; sc.D = dur;
    d.build(sc);
  });
  cur = null;
}
function seek(T) {
  const ms = T * 1000, k = Math.floor(T * 8);
  for (const sc of SC) {
    const on = T >= sc.t0 - 1e-6 && T < sc.t1 + sc.ext - 1e-6;
    if (on !== sc.on) { sc.root.style.display = on ? 'block' : 'none'; sc.on = on; }
    if (!on) continue;
    for (const a of sc.anims) a.currentTime = ms;
    for (const f of sc.tick) f(T);
    if (sc.bk !== k) { sc.bk = k; sc.boil.forEach((b, j) => { const h = rnd(k * 131 + j * 17 + sc.idx); b.n.style.translate = `${((h() - .5) * 2.2 * b.a).toFixed(2)}px ${((h() - .5) * 2.2 * b.a).toFixed(2)}px`; b.n.style.rotate = `${((h() - .5) * .7 * b.a).toFixed(3)}deg`; }); }
  }
  for (const a of OV.anims) a.currentTime = ms;
  for (const f of OV.tick) f(T);
}

/* ---------- nodes ---------- */
class Nd {
  constructor(o, i) { this.o = o; this.i = i; this.st = { x: 0, y: 0, r: 0, s: 1 }; }
  in(type, t, d, opt) {
    opt = opt || {}; t = t - LEAD; const n = this.i, dist = opt.dist || 80;
    const sl = (dx, dy) => A(n, [{ transform: `translate(${dx}px,${dy}px) rotate(${opt.r0 || 0}deg)`, opacity: 0 }, { opacity: 1, offset: .35 }, { transform: 'translate(0,0) rotate(0deg)', opacity: 1 }], t, d || .55, EZ.out);
    switch (type) {
      case 'pop': A(n, [{ transform: `scale(.5) rotate(${opt.r0 === undefined ? -8 : opt.r0}deg)`, opacity: 0 }, { opacity: 1, offset: .3 }, { transform: 'scale(1) rotate(0deg)', opacity: 1 }], t, d || .42, EZ.back); break;
      case 'up': sl(0, dist); break; case 'down': sl(0, -dist); break; case 'left': sl(dist, 0); break; case 'right': sl(-dist, 0); break;
      case 'fade': A(n, [{ opacity: 0 }, { opacity: 1 }], t, d || .4, 'ease-out'); break;
      case 'drop': A(n, [{ transform: 'translateY(-160px) rotate(-10deg)', opacity: 0 }, { opacity: 1, offset: .2 }, { transform: 'translateY(9px) rotate(1.6deg)', offset: .68 }, { transform: 'translateY(0) rotate(0deg)', opacity: 1 }], t, d || .5, 'cubic-bezier(.35,0,.3,1)'); break;
      case 'stamp': A(n, [{ transform: 'scale(2.3) rotate(9deg)', opacity: 0 }, { opacity: 1, offset: .45 }, { transform: 'scale(.93) rotate(-1.2deg)', offset: .72 }, { transform: 'scale(1) rotate(0deg)', opacity: 1 }], t, d || .3, 'ease-in'); break;
      case 'wipe': A(n, [{ clipPath: 'inset(-20% 105% -20% -5%)' }, { clipPath: 'inset(-20% -5% -20% -5%)' }], t, d || .55, EZ.io); break;
      case 'wipeUp': A(n, [{ clipPath: 'inset(105% -5% -5% -5%)' }, { clipPath: 'inset(-5% -5% -5% -5%)' }], t, d || .55, EZ.io); break;
      case 'grow': n.style.transformOrigin = opt.origin || '0 50%'; A(n, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], t, d || .45, EZ.out); break;
      case 'growY': n.style.transformOrigin = opt.origin || '50% 100%'; A(n, [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], t, d || .5, EZ.out); break;
      case 'flip': A(n, [{ transform: 'perspective(900px) rotateX(-88deg)', opacity: 0 }, { opacity: 1, offset: .2 }, { transform: 'perspective(900px) rotateX(0deg)', opacity: 1 }], t, d || .5, EZ.back); n.style.transformOrigin = '50% 0'; break;
    }
    return this;
  }
  out(t, d, type) {
    t -= LEAD; const n = this.o;
    if (type === 'down') A(n, [{ opacity: 1, translate: '0 0' }, { opacity: 0, translate: '0 60px' }], t, d || .3, EZ.inn);
    else if (type === 'right') A(n, [{ opacity: 1, translate: '0 0', rotate: (this.st.r) + 'deg' }, { opacity: 0, translate: '500px 40px', rotate: (this.st.r + 14) + 'deg' }], t, d || .5, EZ.inn);
    else A(n, [{ opacity: 1 }, { opacity: 0 }], t, d || .25, 'ease-in');
    return this;
  }
  to(t, d, p, ease) {
    t -= LEAD; const a = this.st, b = Object.assign({}, a, p);
    A(this.o, [{ translate: `${a.x}px ${a.y}px`, rotate: a.r + 'deg', scale: a.s }, { translate: `${b.x}px ${b.y}px`, rotate: b.r + 'deg', scale: b.s }], t, d, ease || EZ.io);
    this.st = b; return this;
  }
  dim(t, v, d) { A(this.i, [{ filter: 'opacity(1)' }, { filter: `opacity(${v === undefined ? .25 : v})` }], t - LEAD, d || .3, 'ease-out'); return this; }
  boil(a) { cur.boil.push({ n: this.i, a: a || 1 }); return this; }
  hl(t, d, k) { const m = this.i.querySelectorAll('mk')[k || 0]; if (m) A(m, [{ backgroundSize: '0% 100%' }, { backgroundSize: '100% 100%' }], t - LEAD, d || .45, EZ.io); return this; }
  strike(t, d, k) { const m = this.i.querySelectorAll('sk')[k || 0]; if (m) A(m, [{ backgroundSize: '0% 100%' }, { backgroundSize: '100% 100%' }], t - LEAD, d || .35, EZ.io); return this; }
}
function mk(html, x, y, o) {
  o = o || {};
  const out = document.createElement('div'), inn = document.createElement('div');
  out.className = 'e' + (o.c ? ' ctr' : ''); inn.className = 'i ' + (o.cls || '');
  out.appendChild(inn);
  if (typeof html === 'string') inn.innerHTML = html; else if (html) inn.appendChild(html);
  out.style.left = x + 'px'; out.style.top = y + 'px';
  if (o.w) out.style.width = o.w + 'px'; if (o.h) { out.style.height = o.h + 'px'; inn.style.cssText += 'position:absolute;inset:0;'; }
  if (o.z) out.style.zIndex = o.z;
  if (o.css) Object.assign(inn.style, o.css);
  (o.p ? o.p.i : cur.cam).appendChild(out);
  const n = new Nd(out, inn);
  if (o.rot) { out.style.rotate = o.rot + 'deg'; n.st.r = o.rot; }
  if (o.in) n.in(o.in, o.t, o.d, o);
  if (o.boil) n.boil(o.boil);
  return n;
}

/* ---------- text ---------- */
// cls: d (display condensed), s (serif), si (serif italic), m (mono), p (poppins label)
function txt(html, x, y, size, o) {
  o = o || {}; const css = Object.assign({ fontSize: size + 'px', color: o.col || (cur.dark ? '#F4EEDD' : '#1A1814') }, o.css || {});
  if (o.al) css.textAlign = o.al; if (o.lh) css.lineHeight = o.lh; if (o.ls) css.letterSpacing = o.ls;
  return mk(html, x, y, Object.assign({}, o, { cls: 'tx ' + (o.f || 'd'), css }));
}
// words pop one after another (kinetic line). times: start time + step
function words(text, x, y, size, t, o) {
  o = o || {}; const step = o.step === undefined ? .09 : o.step; const ws = text.split(' ');
  const html = ws.map(w => `<span class="w">${w}</span>`).join(' ');
  const n = txt(html, x, y, size, o);
  n.i.querySelectorAll('.w').forEach((sp, k) => {
    const tt = (Array.isArray(t) ? t[Math.min(k, t.length - 1)] : t + k * step) - LEAD;
    A(sp, [{ transform: `translateY(${o.dy === undefined ? 36 : o.dy}px) rotate(${(k % 2 ? 4 : -4)}deg)`, opacity: 0 }, { opacity: 1, offset: .4 }, { transform: 'translateY(0) rotate(0deg)', opacity: 1 }], tt, o.wd || .34, EZ.back);
  });
  return n;
}
function type(text, x, y, size, t, d, o) {  // typewriter
  const n = txt('', x, y, size, Object.assign({ f: 'm' }, o || {})); const el = n.i;
  tick(T => { const k = Math.round(clamp((T - (t - LEAD)) / d, 0, 1) * text.length); if (el._k !== k) { el._k = k; el.textContent = text.slice(0, k) + (k < text.length && k > 0 ? '▌' : ''); } });
  return n;
}
function num(x, y, size, o) {  // count-up number. o: {from,to,t,d,fmt,pre,suf}
  const n = txt('', x, y, size, o); const el = n.i; const f = o.fmt || (v => Math.round(v).toLocaleString('en-US'));
  tick(T => { const p = easeOut((T - (o.t - LEAD)) / (o.d || 1)); const v = o.from + (o.to - o.from) * p; const s = (o.pre || '') + f(v) + (o.suf || ''); if (el._s !== s) { el._s = s; el.innerHTML = s; } });
  return n;
}

/* ---------- paper ---------- */
function cutPoly(w, h, j, torn) {  // irregular hand-cut rectangle, px coords
  const pts = []; const seg = (x1, y1, x2, y2, tornSide) => {
    const len = Math.hypot(x2 - x1, y2 - y1), n = Math.max(2, Math.round(len / (tornSide ? 16 : 110)));
    for (let k = 0; k < n; k++) { const f = k / n, jj = tornSide ? rr(3, 9) : j; pts.push([(x1 + (x2 - x1) * f + (k ? (R() - .5) * 2 * jj : (R() - .5) * j)).toFixed(1), (y1 + (y2 - y1) * f + (k ? (R() - .5) * 2 * jj : (R() - .5) * j)).toFixed(1)]); }
  };
  torn = torn || ''; const m = 3;
  seg(m, m, w - m, m, torn.includes('t')); seg(w - m, m, w - m, h - m, torn.includes('r')); seg(w - m, h - m, m, h - m, torn.includes('b')); seg(m, h - m, m, m, torn.includes('l'));
  return 'polygon(' + pts.map(p => p[0] + 'px ' + p[1] + 'px').join(',') + ')';
}
function paper(x, y, w, h, o) {
  o = o || {}; const poly = cutPoly(w, h, o.j === undefined ? 2.2 : o.j, o.torn), col = o.col || 'white';
  const sh = o.sh === undefined ? 10 : o.sh;
  const html = (sh ? `<div class="sh" style="clip-path:${poly};translate:${sh * .8}px ${sh}px"></div>` : '') + `<div class="pp" style="clip-path:${poly};background-image:url(tex/p_${col}.jpg);background-position:${-Math.round(rr(0, 500))}px ${-Math.round(rr(0, 500))}px"></div>` + (o.tape ? `<div class="tape" style="left:${o.tape === 'r' ? w - 150 : o.tape === 'c' ? w / 2 - 65 : 30}px;rotate:${rr(-7, 7).toFixed(1)}deg"></div>` : '');
  const n = mk(html, x, y, Object.assign({}, o, { w, h })); n.w = w; n.h = h; n.dark = /ink|navy|blue|red|teal/.test(col);
  return n;
}
function tag(text, x, y, size, o) {  // auto-sized paper label
  o = o || {}; const col = o.col || 'ink', j = () => (R() * 3).toFixed(1);
  const poly = `polygon(${j()}px ${j()}px, calc(100% - ${j()}px) ${j()}px, calc(100% - ${j()}px) calc(100% - ${j()}px), ${j()}px calc(100% - ${j()}px))`;
  const tc = o.tc || (/ink|navy|blue|red|teal/.test(col) ? '#F6F0E0' : '#1A1814');
  const html = `<div class="sh" style="clip-path:${poly};translate:6px 7px"></div><div class="pp" style="clip-path:${poly};background-image:url(tex/p_${col}.jpg);background-position:${-Math.round(rr(0, 600))}px ${-Math.round(rr(0, 600))}px"></div><div class="tg tx ${o.f || 'd'}" style="font-size:${size}px;color:${tc};padding:${o.pad || `${size * .22}px ${size * .5}px ${size * .16}px`}">${text}</div>`;
  return mk(html, x, y, Object.assign({}, o, { cls: 'tagw' }));
}
function stamp(text, x, y, size, t, o) {
  o = o || {}; const col = o.col || '#D5321C';
  return mk(`<div class="stamp tx d" style="font-size:${size}px;color:${col};border-color:${col}">${text}</div>`, x, y, Object.assign({ c: true, rot: -8, in: 'stamp', t }, o));
}

/* ---------- hand-drawn strokes ---------- */
function roughD(pts, j) {
  const p = pts.map(([x, y]) => [x + (R() - .5) * 2 * j, y + (R() - .5) * 2 * j]);
  let d = `M${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`;
  for (let i = 1; i < p.length - 1; i++) { const mx = (p[i][0] + p[i + 1][0]) / 2, my = (p[i][1] + p[i + 1][1]) / 2; d += ` Q${p[i][0].toFixed(1)} ${p[i][1].toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`; }
  const l = p[p.length - 1]; d += ` L${l[0].toFixed(1)} ${l[1].toFixed(1)}`; return d;
}
function overlaySvg(o) {
  o = o || {}; const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('width', W); s.setAttribute('height', H); s.setAttribute('viewBox', `0 0 ${W} ${H}`); s.style.cssText = 'position:absolute;left:0;top:0;overflow:visible;pointer-events:none;' + (o.z ? 'z-index:' + o.z : '');
  (o.p ? o.p.i : cur.cam).appendChild(s); return s;
}
function stroke(d, t, dur, o) {  // draw-on path
  o = o || {}; const s = o.svg || overlaySvg(o);
  const mkp = (dd, w, op) => { const p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); p.setAttribute('d', dd); p.setAttribute('pathLength', '1'); p.setAttribute('fill', 'none'); p.setAttribute('stroke', o.col || (cur.dark ? '#F4EEDD' : '#1A1814')); p.setAttribute('stroke-width', w); p.setAttribute('stroke-linecap', 'round'); p.setAttribute('stroke-linejoin', 'round'); if (o.dash) p.setAttribute('stroke-dasharray', o.dash); else p.style.strokeDasharray = '1'; p.style.opacity = op; s.appendChild(p); return p; };
  const p = mkp(d, o.sw || 6, 1);
  if (o.dash) { // dashed: reveal with mask-like clip via opacity+pathLength trick -> use clip by animating stroke-dashoffset not possible; fade/wipe instead
    A(p, [{ opacity: 0 }, { opacity: 1 }], t - LEAD, .3);
  } else A(p, [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], t - LEAD, dur, o.ease || EZ.io);
  return { svg: s, path: p };
}
function line(x1, y1, x2, y2, t, dur, o) { o = o || {}; const n = Math.max(2, Math.round(Math.hypot(x2 - x1, y2 - y1) / 90)), pts = []; for (let k = 0; k <= n; k++) pts.push([x1 + (x2 - x1) * k / n, y1 + (y2 - y1) * k / n]); return stroke(roughD(pts, o.j === undefined ? 2 : o.j), t, dur || .4, o); }
function arrow(x1, y1, x2, y2, t, o) {
  o = o || {}; const bend = o.bend === undefined ? .22 : o.bend, mx = (x1 + x2) / 2 - (y2 - y1) * bend, my = (y1 + y2) / 2 + (x2 - x1) * bend, pts = [];
  for (let k = 0; k <= 10; k++) { const f = k / 10, a = (1 - f) * (1 - f), b = 2 * f * (1 - f), c = f * f; pts.push([a * x1 + b * mx + c * x2, a * y1 + b * my + c * y2]); }
  const r = stroke(roughD(pts, o.j === undefined ? 1.5 : o.j), t, o.d || .5, o);
  const ang = Math.atan2(y2 - my, x2 - mx), L = o.head || 26, h = a => [x2 - L * Math.cos(ang + a), y2 - L * Math.sin(ang + a)];
  const p1 = h(.5), p2 = h(-.5);
  stroke(`M${p1[0].toFixed(1)} ${p1[1].toFixed(1)} L${x2} ${y2} L${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`, t + (o.d || .5) - .05, .18, Object.assign({}, o, { svg: r.svg, dash: null }));
  return r;
}
function scribble(cx, cy, rx, ry, t, o) {  // hand-drawn ellipse around something
  o = o || {}; const pts = [], a0 = rr(2.6, 3.4);
  for (let k = 0; k <= 26; k++) { const a = a0 + k / 24 * Math.PI * 2 * 1.06, g = 1 + (k / 26) * .05; pts.push([cx + Math.cos(a) * rx * g, cy + Math.sin(a) * ry * g]); }
  return stroke(roughD(pts, o.j === undefined ? 2.5 : o.j), t, o.d || .5, o);
}
function underline(x, y, w, t, o) { o = o || {}; const pts = []; for (let k = 0; k <= 6; k++) pts.push([x + w * k / 6, y + Math.sin(k * 1.3) * 3]); return stroke(roughD(pts, 2), t, o.d || .35, Object.assign({ sw: 8, col: '#E2432A' }, o)); }
function cross(cx, cy, s, t, o) { o = Object.assign({ col: '#E2432A', sw: 12 }, o || {}); const r = line(cx - s, cy - s, cx + s, cy + s, t, .16, o); line(cx + s, cy - s, cx - s, cy + s, t + .12, .16, Object.assign({}, o, { svg: r.svg })); return r; }
function check(cx, cy, s, t, o) { o = Object.assign({ col: '#1A8A70', sw: 12 }, o || {}); return stroke(roughD([[cx - s, cy], [cx - s * .3, cy + s * .7], [cx + s, cy - s * .8]], 1.5), t, .25, o); }

/* ---------- svg helpers ---------- */
function svgEl(inner, x, y, w, h, o) {
  o = o || {}; return mk(`<svg width="${w}" height="${h}" viewBox="${o.vb || `0 0 ${w} ${h}`}" style="overflow:visible;display:block">${inner}</svg>`, x, y, Object.assign({ w, h }, o));
}
function icon(name, x, y, size, o) {  // ICON[name] is svg inner markup with viewBox 0 0 200 200 (or [vbw,vbh,markup])
  o = o || {}; const ic = ICON[name]; const vb = Array.isArray(ic) ? [ic[0], ic[1]] : [200, 200], body = Array.isArray(ic) ? ic[2] : ic;
  const w = size, h = size * vb[1] / vb[0];
  return mk(`<svg width="${w}" height="${h}" viewBox="0 0 ${vb[0]} ${vb[1]}" style="overflow:visible;display:block;filter:drop-shadow(${o.shx === undefined ? 7 : o.shx}px ${o.shy === undefined ? 8 : o.shy}px 0 rgba(20,15,5,${o.sha === undefined ? .2 : o.sha}))">${body}</svg>`, x, y, Object.assign({ w, h }, o));
}
// pie wedge (paper pie). pct animates from p0 to p1
function pie(cx, cy, r, o) {
  const id = 'pie' + (pie.n = (pie.n || 0) + 1), base = o.base || '#D9D1BD', col = o.col || '#E2432A';
  const n = mk(`<svg width="${r * 2 + 30}" height="${r * 2 + 30}" viewBox="${-r - 15} ${-r - 15} ${r * 2 + 30} ${r * 2 + 30}" style="overflow:visible;display:block"><circle cx="8" cy="10" r="${r}" fill="rgba(20,15,5,.2)"/><circle r="${r}" fill="${base}"/><path id="${id}" fill="${col}"/>${o.col2 ? `<path id="${id}b" fill="${o.col2}"/>` : ''}<circle r="${r}" fill="url(#gr)" opacity=".5"/>${o.hole ? `<circle r="${r * o.hole}" fill="${o.holeCol || '#EDE4CF'}"/>` : ''}</svg>`, cx - r - 15, cy - r - 15, Object.assign({ w: r * 2 + 30, h: r * 2 + 30 }, o));
  const wedge = (a0, a1) => { if (a1 - a0 >= 359.99) return `M0 ${-r} A${r} ${r} 0 1 1 -0.01 ${-r} Z`; if (a1 - a0 <= 0.01) return ''; const p = a => [Math.sin(a * Math.PI / 180) * r, -Math.cos(a * Math.PI / 180) * r], s = p(a0), e = p(a1); return `M0 0 L${s[0].toFixed(2)} ${s[1].toFixed(2)} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${e[0].toFixed(2)} ${e[1].toFixed(2)} Z`; };
  const el = n.i.querySelector('#' + id), el2 = o.col2 ? n.i.querySelector('#' + id + 'b') : null; const st = o.steps || [[o.t, o.d || .9, o.p0 || 0, o.p1]];
  tick(T => { let v = st[0][2]; for (const [t, d, a, b] of st) { if (T >= t - LEAD) v = a + (b - a) * easeIO((T - (t - LEAD)) / d); } const k = v.toFixed(2); if (el._k !== k) { el._k = k; el.setAttribute('d', wedge(0, v * 3.6)); if (el2) el2.setAttribute('d', wedge(v * 3.6, Math.min(360, (v + (o.p2 || 0)) * 3.6))); } });
  return n;
}
// generic sketch line chart inside a box. pts: [[x,y]...] in 0..1 (y up)
function chart(x, y, w, h, pts, t, d, o) {
  o = o || {}; const s = overlaySvg(o); const P = pts.map(([a, b]) => [x + a * w, y + h - b * h]);
  if (!o.noaxes) { line(x, y - 10, x, y + h, t - .3, .3, { svg: s, sw: 4, col: o.axis }); line(x, y + h, x + w + 10, y + h, t - .2, .35, { svg: s, sw: 4, col: o.axis }); }
  let dd = 'M' + P.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L');
  if (o.fill) { const f = document.createElementNS('http://www.w3.org/2000/svg', 'path'); f.setAttribute('d', dd + ` L${x + w} ${y + h} L${x} ${y + h} Z`); f.setAttribute('fill', o.fill); f.style.opacity = 0; s.appendChild(f); A(f, [{ opacity: 0 }, { opacity: o.fo || .25 }], t + d * .6, .5); }
  const r = stroke(dd, t, d, { svg: s, sw: o.sw || 9, col: o.col || '#E2432A', ease: o.ease || 'cubic-bezier(.4,0,.6,1)' });
  return { svg: s, P, path: r.path };
}
// dot travelling along an svg path element
function travel(pathEl, t, d, o) {
  o = o || {}; const dot = mk(o.html || `<div style="width:${o.s || 26}px;height:${o.s || 26}px;border-radius:50%;background:${o.col || '#FFCF2B'};border:4px solid #1A1814;box-sizing:border-box"></div>`, 0, 0, { c: true, z: 30, p: o.p });
  const L = pathEl.getTotalLength(); dot.o.style.opacity = 0;
  tick(T => { const p = (T - (t - LEAD)) / d; if (p < 0 || p > 1.02) { dot.o.style.opacity = 0; return; } const q = pathEl.getPointAtLength(L * easeIO(p)); dot.o.style.opacity = 1; dot.o.style.left = q.x + 'px'; dot.o.style.top = q.y + 'px'; });
  return dot;
}
// source credit bottom-left
function source(text, t) { return txt('SOURCE: ' + text, 70, 1010, 21, { f: 'm', ls: '.06em', in: 'fade', t, col: cur.dark ? 'rgba(244,238,221,.75)' : 'rgba(26,24,20,.62)', z: 40 }); }
```

## 9. Source: app/art.js

```js
'use strict';
const INK = '#1A1814', CREAM = '#EDE4CF', WHITE = '#FAF6EA', YEL = '#FFCF2B', RED = '#E2432A', BLUE = '#2553C7', TEAL = '#1A8A70', KRAFT = '#C7A374', PINK = '#F0B8A4', GREY = '#CDC6B5', NAVY = '#17223F', GREEN = '#3DAA5C';
const ICON = {};
/* person bust — halftone cutout with white sticker edge */
function personSvg(col, o) {
  o = o || {}; const hair = o.hair || INK;
  const body = `<path d="M14 244 C14 172 52 138 100 138 C148 138 186 172 186 244 Z"/><circle cx="100" cy="76" r="50"/>`;
  return [200, 244, `<g fill="${WHITE}" stroke="${WHITE}" stroke-width="16" stroke-linejoin="round">${body}</g><g fill="${col}">${body}</g><g fill="url(#ht)" opacity=".42">${body}</g><path d="M52 66 C52 30 80 20 104 22 C134 24 152 44 148 74 C140 54 120 46 96 50 C76 52 62 56 52 66Z" fill="${hair}"/><path d="M70 150 L100 186 L130 150" fill="none" stroke="${WHITE}" stroke-width="7" opacity=".85"/>`];
}
ICON.person = personSvg(GREY); ICON.personY = personSvg(YEL); ICON.personR = personSvg(RED); ICON.personB = personSvg('#7FA0E8'); ICON.personK = personSvg(KRAFT);
ICON.monitor = [260, 230, `<rect x="10" y="8" width="240" height="176" rx="14" fill="#D8CFB8"/><rect x="10" y="150" width="240" height="34" rx="8" fill="#C4B99E"/><rect x="28" y="24" width="204" height="128" rx="8" fill="#12333A"/><rect x="28" y="24" width="204" height="20" rx="6" fill="#2553C7"/><circle cx="40" cy="34" r="4" fill="#FAF6EA"/><rect x="50" y="30" width="60" height="8" rx="3" fill="#FAF6EA" opacity=".8"/><rect x="40" y="56" width="92" height="20" rx="9" fill="#FAF6EA"/><rect x="118" y="84" width="100" height="20" rx="9" fill="${YEL}"/><rect x="40" y="112" width="70" height="20" rx="9" fill="#FAF6EA"/><circle cx="222" cy="167" r="5" fill="#3DAA5C"/><rect x="100" y="184" width="60" height="22" fill="#B7AC90"/><rect x="62" y="204" width="136" height="18" rx="6" fill="#C4B99E"/>`];
ICON.server = [150, 230, `<rect x="8" y="6" width="134" height="218" rx="8" fill="${INK}"/>${[0, 1, 2, 3].map(k => `<rect x="20" y="${20 + k * 50}" width="110" height="38" rx="5" fill="#3A3832"/><circle cx="34" cy="${39 + k * 50}" r="5" fill="${k % 2 ? YEL : '#3DAA5C'}"/><circle cx="50" cy="${39 + k * 50}" r="5" fill="${RED}"/><rect x="66" y="${33 + k * 50}" width="54" height="4" fill="#77736A"/><rect x="66" y="${42 + k * 50}" width="54" height="4" fill="#77736A"/>`).join('')}`];
ICON.coin = [120, 120, `<circle cx="60" cy="60" r="54" fill="#E0A914"/><circle cx="60" cy="60" r="54" fill="url(#gr)" opacity=".6"/><circle cx="60" cy="60" r="41" fill="${YEL}"/><text x="60" y="84" text-anchor="middle" font-family="TeX Gyre Heros Cn" font-weight="700" font-size="68" fill="#9A6F00">$</text>`];
ICON.cash = [240, 150, `<rect x="22" y="30" width="200" height="104" rx="6" fill="#1F7A4A"/><rect x="12" y="18" width="200" height="104" rx="6" fill="#2F9C5F"/><rect x="2" y="6" width="200" height="104" rx="6" fill="#49B878"/><rect x="14" y="18" width="176" height="80" rx="4" fill="none" stroke="#DDF3E4" stroke-width="4"/><circle cx="102" cy="58" r="27" fill="#DDF3E4"/><text x="102" y="76" text-anchor="middle" font-family="TeX Gyre Heros Cn" font-weight="700" font-size="50" fill="#1F7A4A">$</text>`];
ICON.pad = [260, 170, `<path d="M62 20 H198 C236 20 256 72 256 118 C256 152 232 164 212 142 L186 112 H74 L48 142 C28 164 4 152 4 118 C4 72 24 20 62 20Z" fill="${INK}"/><rect x="58" y="52" width="16" height="44" rx="3" fill="${CREAM}"/><rect x="44" y="66" width="44" height="16" rx="3" fill="${CREAM}"/><circle cx="196" cy="56" r="10" fill="${YEL}"/><circle cx="176" cy="76" r="10" fill="${RED}"/><circle cx="216" cy="76" r="10" fill="#7FA0E8"/><circle cx="196" cy="96" r="10" fill="#3DAA5C"/><rect x="116" y="60" width="28" height="8" rx="4" fill="#77736A"/>`];
ICON.phone = [150, 270, `<rect x="6" y="4" width="138" height="262" rx="22" fill="${INK}"/><rect x="16" y="26" width="118" height="212" rx="6" fill="#F4F0E4"/><rect x="16" y="26" width="118" height="30" fill="#2FA85F"/><rect x="26" y="68" width="66" height="22" rx="10" fill="#D9D3C2"/><rect x="58" y="98" width="66" height="22" rx="10" fill="#8FDC8A"/><rect x="26" y="128" width="50" height="22" rx="10" fill="#D9D3C2"/><rect x="48" y="158" width="76" height="22" rx="10" fill="#8FDC8A"/><rect x="26" y="188" width="60" height="22" rx="10" fill="#D9D3C2"/><rect x="56" y="248" width="38" height="6" rx="3" fill="#77736A"/>`];
ICON.db = [170, 200, `<path d="M10 40 V160 C10 182 160 182 160 160 V40Z" fill="#2553C7"/><ellipse cx="85" cy="40" rx="75" ry="26" fill="#6E93EE"/><path d="M10 82 C10 106 160 106 160 82" fill="none" stroke="#FAF6EA" stroke-width="6"/><path d="M10 122 C10 146 160 146 160 122" fill="none" stroke="#FAF6EA" stroke-width="6"/>`];
ICON.pentagon = [240, 230, (() => { const p = (r) => [0, 1, 2, 3, 4].map(k => { const a = -Math.PI / 2 + k * 2 * Math.PI / 5; return (120 + Math.cos(a) * r).toFixed(1) + ',' + (122 + Math.sin(a) * r).toFixed(1); }).join(' '); return `<polygon points="${p(112)}" fill="#8E8A7E"/><polygon points="${p(112)}" fill="url(#hatch)"/><polygon points="${p(88)}" fill="#B9B4A5"/><polygon points="${p(66)}" fill="#8E8A7E"/><polygon points="${p(44)}" fill="#B9B4A5"/><polygon points="${p(24)}" fill="#3F7A4C"/>`; })()];
ICON.capitol = [280, 230, `<rect x="10" y="150" width="260" height="62" fill="#F4F0E4"/><rect x="0" y="208" width="280" height="18" fill="#D9D3C2"/><rect x="84" y="112" width="112" height="44" fill="#F4F0E4"/><path d="M96 112 C96 60 184 60 184 112Z" fill="#F4F0E4"/><rect x="128" y="34" width="24" height="32" fill="#F4F0E4"/><rect x="137" y="8" width="6" height="28" fill="#D9D3C2"/><path d="M84 150 L140 126 L196 150Z" fill="#D9D3C2"/>${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(k => `<rect x="${24 + k * 25}" y="160" width="10" height="46" fill="#B9B4A5"/>`).join('')}<path d="M96 112 C96 60 184 60 184 112" fill="url(#hatch)" opacity=".5"/>`];
ICON.gate = [320, 220, `<rect x="30" y="110" width="260" height="96" fill="#B5281B"/><rect x="18" y="202" width="284" height="16" fill="#7D1A12"/><path d="M6 110 C40 104 60 92 70 74 H250 C260 92 280 104 314 110Z" fill="#D9A21B"/><path d="M40 74 C66 70 82 60 90 44 H230 C238 60 254 70 280 74Z" fill="#E8B92E"/><rect x="88" y="78" width="144" height="28" fill="#B5281B"/><path d="M138 206 V160 C138 140 182 140 182 160 V206Z" fill="#3A0F0A"/><rect x="60" y="150" width="30" height="56" rx="14" fill="#3A0F0A"/><rect x="230" y="150" width="30" height="56" rx="14" fill="#3A0F0A"/>${[0, 1, 2, 3, 4, 5].map(k => `<rect x="${44 + k * 46}" y="116" width="8" height="30" fill="#E8B92E"/>`).join('')}`];
ICON.gavel = [220, 200, `<rect x="92" y="18" width="94" height="54" rx="8" transform="rotate(38 139 45)" fill="#8A5A2B"/><rect x="82" y="26" width="16" height="54" rx="4" transform="rotate(38 90 53)" fill="#D9A21B"/><rect x="176" y="20" width="16" height="54" rx="4" transform="rotate(38 184 47)" fill="#D9A21B"/><rect x="28" y="92" width="118" height="18" rx="8" transform="rotate(-38 87 101)" fill="#6B4320"/><rect x="26" y="168" width="130" height="22" rx="6" fill="#6B4320"/><rect x="42" y="152" width="98" height="18" rx="5" fill="#8A5A2B"/>`];
ICON.scissors = [220, 200, `<path d="M70 150 L196 30" stroke="#B9B4A5" stroke-width="16" stroke-linecap="round"/><path d="M70 50 L196 170" stroke="#D9D3C2" stroke-width="16" stroke-linecap="round"/><circle cx="46" cy="42" r="26" fill="none" stroke="${RED}" stroke-width="13"/><circle cx="46" cy="158" r="26" fill="none" stroke="${RED}" stroke-width="13"/><circle cx="112" cy="100" r="7" fill="${INK}"/>`];
ICON.globe = [220, 220, `<circle cx="110" cy="110" r="100" fill="#7FA0E8"/><circle cx="110" cy="110" r="100" fill="url(#gr)" opacity=".5"/><g fill="none" stroke="#FAF6EA" stroke-width="5" opacity=".9"><ellipse cx="110" cy="110" rx="100" ry="100"/><ellipse cx="110" cy="110" rx="50" ry="100"/><path d="M10 110 H210 M24 60 H196 M24 160 H196 M110 10 V210"/></g>`];
ICON.star = [200, 200, `<circle cx="100" cy="100" r="92" fill="#4A5B3A"/><polygon points="100,26 118,78 174,78 128,110 146,164 100,130 54,164 72,110 26,78 82,78" fill="${WHITE}"/>`];
ICON.flame = [140, 190, `<path d="M70 6 C94 46 130 70 130 120 C130 160 104 184 70 184 C36 184 10 160 10 122 C10 94 28 78 40 58 C46 76 54 84 62 88 C56 58 60 30 70 6Z" fill="${RED}"/><path d="M72 84 C86 106 104 118 104 142 C104 164 90 176 70 176 C50 176 38 162 38 144 C38 128 48 120 54 108 C58 118 62 122 68 124 C66 108 68 96 72 84Z" fill="${YEL}"/>`];
ICON.news = [240, 180, `<rect x="6" y="6" width="228" height="168" fill="#F4F0E4"/><rect x="20" y="20" width="200" height="22" fill="${INK}"/><rect x="20" y="54" width="92" height="64" fill="#B9B4A5"/>${[0, 1, 2, 3, 4].map(k => `<rect x="124" y="${56 + k * 14}" width="96" height="6" fill="#8E8A7E"/>`).join('')}${[0, 1, 2].map(k => `<rect x="20" y="${130 + k * 14}" width="200" height="6" fill="#8E8A7E"/>`).join('')}`];
ICON.lockopen = [160, 200, `<path d="M40 92 V60 C40 16 120 16 120 60" fill="none" stroke="#8E8A7E" stroke-width="18"/><rect x="18" y="88" width="124" height="104" rx="14" fill="${YEL}"/><circle cx="80" cy="132" r="14" fill="${INK}"/><rect x="74" y="136" width="12" height="30" fill="${INK}"/>`];
/* flags as little paper rectangles (300x200) */
ICON.cn = [300, 200, `<rect width="300" height="200" fill="#DE2910"/><polygon points="60,24 69,52 99,52 75,70 84,98 60,81 36,98 45,70 21,52 51,52" fill="#FFDE00"/><circle cx="118" cy="26" r="7" fill="#FFDE00"/><circle cx="138" cy="48" r="7" fill="#FFDE00"/><circle cx="138" cy="78" r="7" fill="#FFDE00"/><circle cx="118" cy="100" r="7" fill="#FFDE00"/>`];
ICON.us = [300, 200, `<rect width="300" height="200" fill="#FAF6EA"/>${[0, 2, 4, 6, 8, 10, 12].map(k => `<rect y="${k * 15.4}" width="300" height="15.4" fill="#B22234"/>`).join('')}<rect width="124" height="108" fill="#3C3B6E"/>${[0, 1, 2, 3, 4].map(r => [0, 1, 2, 3, 4, 5].map(c => `<circle cx="${12 + c * 20}" cy="${12 + r * 21}" r="4" fill="#FAF6EA"/>`).join('')).join('')}`];
ICON.fi = [300, 200, `<rect width="300" height="200" fill="#FAF6EA"/><rect x="82" width="54" height="200" fill="#003580"/><rect y="73" width="300" height="54" fill="#003580"/>`];
ICON.fr = [300, 200, `<rect width="100" height="200" fill="#0055A4"/><rect x="100" width="100" height="200" fill="#FAF6EA"/><rect x="200" width="100" height="200" fill="#EF4135"/>`];
ICON.jp = [300, 200, `<rect width="300" height="200" fill="#FAF6EA"/><circle cx="150" cy="100" r="58" fill="#BC002D"/>`];
ICON.skyline = [1920, 420, (() => { let s = '', x = -20; const r = rnd(99); while (x < 1940) { const w = 60 + r() * 110, h = 110 + r() * 250, c = ['#2B2824', '#3A3630', '#4A453C'][Math.floor(r() * 3)]; s += `<rect x="${x.toFixed(0)}" y="${(420 - h).toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}" fill="${c}"/>`; for (let yy = 420 - h + 16; yy < 400; yy += 26) for (let xx = x + 10; xx < x + w - 14; xx += 20) if (r() > .45) s += `<rect x="${xx.toFixed(0)}" y="${yy.toFixed(0)}" width="9" height="13" fill="${r() > .5 ? YEL : '#8E8A7E'}" opacity=".85"/>`; if (r() > .6) s += `<rect x="${(x + w / 2 - 3).toFixed(0)}" y="${(420 - h - 40).toFixed(0)}" width="6" height="40" fill="${c}"/>`; x += w + 4 + r() * 16; } return s; })()];

/* ---------- world map (hand-simplified coastlines, lon/lat) ---------- */
const LAND = {
  na: [[-168, 66], [-162, 70], [-152, 71], [-140, 70], [-128, 70], [-115, 68.5], [-105, 68.5], [-96, 68], [-88, 68.5], [-82, 69.5], [-81, 66], [-87, 64.5], [-93, 61.5], [-94, 58.5], [-88, 56.5], [-82, 55], [-80, 51.5], [-79, 54.5], [-77, 57.5], [-78, 62], [-72, 62], [-65, 60], [-61, 56], [-56, 52.5], [-59, 48.5], [-65, 49.5], [-64, 46], [-60, 46], [-66, 44], [-70, 42], [-74, 40.5], [-76, 37.5], [-75.5, 35.5], [-78, 34], [-81, 31.5], [-80, 27], [-80.5, 25], [-82.5, 27.5], [-84, 30], [-88, 30.5], [-90.5, 29], [-94, 29.5], [-97.5, 27], [-97.5, 22], [-95, 18.5], [-91, 19], [-90, 21], [-87, 21.5], [-88.5, 17.5], [-88, 15.5], [-83.5, 15], [-83.5, 10.5], [-81, 8.8], [-79, 9.5], [-77.5, 8], [-80, 7.2], [-83, 8.3], [-86, 11], [-90, 13.5], [-94.5, 16], [-98, 16], [-103, 18.5], [-105.5, 21], [-108, 25], [-112, 29], [-114.8, 32], [-117.2, 32.6], [-120.5, 34.5], [-122.5, 37.5], [-124.3, 40.5], [-124, 46], [-124.7, 48.4], [-128, 51], [-131, 54.5], [-134, 57.5], [-138, 59.5], [-143, 60], [-148, 60.5], [-152, 59], [-156, 57], [-161, 55], [-164.5, 54.5], [-159, 58], [-162, 60], [-165.5, 62.5], [-161, 64.5], [-166, 65.5]],
  gl: [[-72, 78], [-62, 81.8], [-45, 83], [-25, 82], [-18, 78], [-21, 73], [-25, 70], [-33, 67], [-41, 64], [-43.5, 60], [-48, 61], [-52, 65], [-54, 69.5], [-58, 75], [-67, 76.5]],
  sa: [[-77.5, 8], [-75, 11], [-71.5, 12.3], [-68, 11], [-62, 10.7], [-57, 6], [-52, 4.8], [-50, 1], [-48, -1], [-44, -2.5], [-39, -3.3], [-35.2, -5.5], [-35, -8.5], [-37.5, -12], [-39, -16.5], [-40.5, -21.5], [-44, -23.2], [-48.5, -26], [-48.8, -28.8], [-52.5, -33], [-55, -35], [-57.5, -36.5], [-57.8, -38.5], [-62, -39.5], [-64.5, -41.5], [-65.5, -45], [-68, -48], [-69, -51.5], [-68.5, -54.5], [-71, -54], [-74.5, -52], [-75, -47], [-73.5, -42], [-73.5, -37], [-71.5, -31], [-70.5, -24], [-70.3, -18.5], [-74, -15.5], [-77, -12], [-79.5, -7.5], [-81, -5], [-80, -2.5], [-80.5, 0], [-78.5, 2], [-77.5, 5]],
  af: [[-17, 21], [-17, 14.7], [-15, 11], [-13, 8.5], [-10.5, 6.2], [-7.5, 4.4], [-3, 5], [1, 6], [4.5, 6.3], [6.5, 4.3], [9, 4], [9.5, 1], [9, -1], [11.5, -4.5], [12.5, -6.5], [13.5, -11], [12, -15.5], [12, -18], [14.5, -22.5], [15.5, -27.5], [17.5, -31.5], [18.4, -34.2], [20, -34.8], [23, -34], [26.5, -34], [29, -32], [31, -29.5], [32.8, -26], [35.5, -23.5], [35, -20], [38, -17], [40.5, -14.5], [40.5, -11], [39.5, -7], [39, -5], [41, -2], [43.5, 0.5], [47, 4.5], [49.5, 8], [51.2, 11.8], [47, 11.2], [43.5, 11.3], [43, 12.7], [40, 15], [38.5, 18], [37, 21.5], [35.5, 24], [34, 27.5], [32.5, 30], [32, 31.3], [29, 31], [25, 31.7], [22, 33], [20, 31], [15.5, 31.8], [11, 33.5], [10.5, 37], [5, 36.8], [0, 35.8], [-5.5, 35.8], [-9.5, 31], [-13, 27.5], [-16, 24]],
  ea: [[-9, 37], [-9.3, 39], [-8.8, 43.2], [-2, 43.5], [-1.3, 46], [-2.5, 47.5], [-4.7, 48.3], [-1.5, 48.7], [1.5, 50.5], [3.5, 51.5], [5, 53.3], [8.5, 53.8], [8.2, 56.5], [10.5, 57.7], [10.5, 55.5], [12, 54.2], [14.5, 54], [18.5, 54.6], [21, 55.5], [21.2, 57.3], [24, 57.5], [23.5, 59.3], [28, 59.8], [30, 60], [27, 60.5], [23, 60], [21.3, 61], [21.5, 63.2], [25, 65.3], [23.5, 65.8], [21.5, 65], [17.5, 62.5], [17, 61], [18.8, 59.8], [16.5, 57], [14.3, 55.6], [12.8, 56], [11, 58.8], [8, 58], [5.3, 59.2], [5, 62], [9.5, 64], [13, 66.5], [16.5, 69], [21.5, 70], [26, 71], [31, 70], [33, 69.5], [41, 67.5], [40.5, 66], [35, 66.5], [34.5, 64.5], [38, 64], [40, 65.5], [44, 66.3], [44.5, 68.3], [51, 68.3], [57, 68.6], [61, 69.5], [67, 68.8], [68.5, 71], [73, 72.5], [74.5, 68], [78, 72], [86, 73.8], [98, 76], [104, 77.6], [112, 76.4], [114, 73.8], [127, 73], [131, 71], [140, 72.8], [152, 71], [160, 69.8], [170, 69.9], [178, 69], [180, 68.8], [180, 65], [178, 64.5], [177, 62.5], [171, 60.5], [164, 59.8], [162.5, 57.5], [161.5, 55], [156.8, 51.2], [155.8, 56], [158, 58.5], [160.5, 61], [157, 61.5], [154, 59.5], [148, 59.3], [142, 59.2], [135.3, 54.8], [137.5, 53.8], [141, 53], [140.3, 50], [138, 46.5], [134, 43], [131, 42.5], [129.5, 41], [128, 39.5], [129.4, 37], [129, 35.2], [126.6, 34.5], [126.3, 37], [125, 38.5], [124.5, 40], [122, 40.4], [121.3, 39], [118.5, 39], [118.3, 37.8], [120.5, 37.5], [122.3, 37], [120.2, 35.8], [119.5, 34.5], [121.5, 32], [122, 30], [121, 28], [119.5, 25.5], [117.3, 23.6], [114.3, 22.4], [111, 21.3], [109, 21.5], [106.5, 20.5], [105.8, 18.8], [108.5, 15.5], [109.3, 12.5], [107, 10.3], [105, 8.8], [104.8, 10.3], [102.5, 12.2], [100.8, 13.2], [100, 11], [99.3, 9.2], [101.2, 6.5], [103.3, 4], [104, 1.5], [103.2, 1.4], [101, 3], [100.2, 6], [98.3, 8], [98.5, 12], [97.5, 16.5], [95.5, 15.8], [94.3, 18.5], [92, 21.5], [90.3, 22], [88, 21.7], [86.8, 20.5], [84, 18.5], [80.3, 15.5], [80, 12.5], [79.5, 10.3], [77.5, 8.1], [76, 11], [74.5, 14.5], [73, 17.5], [72.7, 21], [70, 21], [68.8, 23], [67, 24.8], [62, 25.2], [57.5, 25.5], [56.5, 27], [53.5, 26.6], [51, 28.5], [49, 30.3], [48, 29.8], [48.5, 28], [50.2, 26.3], [51, 24.6], [52.5, 24.2], [54.5, 24.5], [56.3, 26], [56.5, 24.3], [59.5, 22.6], [58.5, 20.4], [57.5, 18.8], [55, 17.3], [52, 16], [48.5, 14], [45, 12.8], [43.5, 12.8], [42.6, 16], [41, 19], [39, 21.5], [37.5, 24.5], [35, 28], [34.8, 29.5], [34.3, 31.3], [35.5, 33.5], [36, 36], [34, 36.3], [31, 36.6], [28.5, 36.8], [27, 37.5], [26.3, 39.5], [27, 40.6], [29, 41.1], [31.5, 41.3], [35, 42], [38, 41], [41.5, 41.5], [41.5, 42.8], [39.5, 44], [37.5, 45], [38, 47], [35, 46.2], [33.5, 45], [32, 46.5], [30.5, 46], [29, 44.5], [28, 43], [28.5, 41.5], [26.5, 40.9], [24, 40.8], [23.5, 40], [24, 38], [23, 36.5], [21.5, 37], [20.5, 39], [19.5, 41], [19.3, 42.2], [16, 43.5], [13.7, 45.5], [12.3, 45.3], [12.5, 44], [14, 42.3], [16, 41.8], [18.5, 40.2], [17, 40.5], [16.5, 39.3], [16, 38], [15.7, 39.8], [14, 41], [12.3, 41.8], [10.5, 43], [9.5, 44.3], [7.5, 43.8], [5, 43.3], [3.2, 43.2], [3.2, 41.8], [0.8, 41], [-0.3, 39.5], [-0.5, 38], [-2, 36.8], [-4.5, 36.7], [-6.2, 36.5], [-7.5, 37.2]],
  jp: [[130.2, 31.3], [131.5, 33.5], [130.5, 34], [132, 35.3], [135.5, 35.6], [136.8, 37.2], [138.5, 37.5], [140, 40], [140.5, 41.5], [141.5, 40], [142, 38.5], [140.9, 36.5], [140.5, 35], [138.5, 34.7], [136.5, 34.3], [135, 33.6], [132.5, 33.8], [131.5, 31.5]],
  hk: [[140.3, 41.6], [141.5, 43.2], [141.8, 45.4], [143.5, 44.3], [145.3, 43.8], [144, 42.9], [143.2, 42], [141.5, 42.5]],
  uk: [[-5.5, 50], [-3, 50.6], [1.3, 51.2], [1.7, 52.7], [0.3, 53], [-0.3, 54.5], [-1.6, 55.6], [-2.2, 57.7], [-4, 57.8], [-3.2, 58.6], [-5.2, 58.6], [-6, 57.3], [-5.5, 56], [-4.8, 54.8], [-3.2, 54.8], [-3, 53.4], [-4.5, 53.2], [-4.2, 52.3], [-5.2, 51.8], [-3.5, 51.4], [-4.3, 51]],
  ie: [[-10, 51.8], [-6.2, 52.2], [-6, 54], [-5.6, 54.7], [-7.5, 55.3], [-8.5, 54.6], [-10, 54.2], [-9.7, 53.2]],
  is: [[-24, 65.5], [-22, 66.4], [-16, 66.5], [-13.6, 65], [-15, 64.2], [-18.5, 63.4], [-22.5, 63.8], [-22, 64.8]],
  au: [[114, -22], [113.5, -26], [115, -31], [115.2, -34.3], [118, -35], [123.5, -33.9], [126, -32.3], [129, -31.6], [131.5, -31.5], [134, -32.8], [136, -34.8], [137.5, -33], [138, -35.5], [139.8, -37], [141.5, -38.3], [144.5, -38], [146.5, -39], [149.8, -37.5], [151.3, -33.5], [153, -30], [153.3, -25.5], [150.8, -22.8], [148.8, -20.3], [146.2, -18.8], [145.3, -15], [142.5, -10.8], [141.7, -14], [140.8, -17.5], [138, -16.5], [135.5, -15], [136.5, -12], [133, -11.5], [130.5, -12.5], [129.5, -15], [126.5, -14], [124, -16.3], [122.2, -18], [120.5, -19.8], [117, -20.7]],
  nzn: [[172.8, -34.5], [174.8, -36.8], [176, -37.5], [178.3, -37.7], [177, -39.5], [175.3, -41.5], [174.6, -39.5], [173.8, -39.2], [174.6, -37.5]],
  nzs: [[172.7, -40.6], [174.2, -41.7], [172.8, -43.5], [171.2, -44.3], [170.6, -46], [168.3, -46.5], [166.6, -45.8], [168.5, -44], [171, -42.3]],
  ng: [[131, -0.8], [134, -0.8], [137.5, -1.6], [141, -2.6], [145, -4.3], [147.5, -6], [147.8, -8], [150.5, -10.3], [146, -8.8], [143, -9], [140.5, -8.3], [138.5, -8.2], [137.5, -5.3], [135, -4.3], [132.5, -3.5]],
  bo: [[109, 1.8], [111, 1.5], [113, 3.5], [115.5, 5.5], [117, 7], [119, 5.2], [117.8, 3.5], [118.8, 1], [117.5, -0.8], [116.5, -3.5], [114.5, -4], [111.5, -3.2], [110, -1.5]],
  su: [[95.3, 5.5], [97.5, 5.2], [100.5, 2.3], [103.5, -0.8], [106, -3.3], [105.8, -5.8], [104, -5.7], [101.5, -3], [99, 0], [97, 2.8]],
  jv: [[105.3, -6.3], [108.5, -6.6], [111, -6.5], [114.5, -7.7], [114.3, -8.6], [110, -8.2], [106.5, -7.4]],
  sw: [[119.8, 0.8], [122, 1], [124.8, 1.3], [123.5, 0.2], [121, 0.3], [121.5, -1.8], [123.3, -1], [122.5, -3.5], [122.8, -5], [121.5, -4.5], [120.5, -2.8], [120.3, -5.5], [119.5, -5.3], [119, -2.8]],
  ph: [[120.5, 18.4], [122.2, 18.3], [122.3, 16], [121.6, 14.2], [124, 12.8], [125.5, 10.5], [126.5, 8], [126, 6.3], [124, 6.5], [122, 7], [123, 9], [122.5, 11], [120.2, 13.5], [120.3, 16]],
  mg: [[44, -25], [47, -25], [49.5, -18], [50.2, -15.5], [49.2, -12.2], [47.5, -14.8], [44.5, -16.3], [43.6, -21.5]],
  lk: [[79.8, 9.7], [81.2, 8.5], [81.8, 7], [80.5, 6], [79.8, 7.5]], tw: [[121, 25.2], [121.9, 24.8], [120.8, 22], [120.1, 23]], hn: [[108.7, 19.2], [110.5, 20], [111, 19.5], [109.5, 18.3]],
  cu: [[-84.8, 21.9], [-82.5, 23], [-79.5, 22.8], [-75.5, 20.7], [-74.2, 20.1], [-77.5, 19.9], [-78.5, 21.5], [-82, 22.3]], hi: [[-74.4, 19.7], [-71.5, 19.9], [-68.5, 18.6], [-71.5, 17.7], [-74.3, 18.5]]
};
const CASPIAN = [[47, 45], [49.5, 46.5], [52, 46.8], [53, 45], [51, 43.5], [52.5, 41.5], [54, 40.5], [53.8, 37.2], [51, 36.7], [49, 37.5], [49.5, 40.5], [47.5, 42.8]];
const CITY = { shenzhen: [114.06, 22.54], capetown: [18.42, -33.92], amsterdam: [4.9, 52.37], la: [-118.24, 34.05], cary: [-78.78, 35.79], helsinki: [24.94, 60.17], paris: [2.35, 48.86], stockholm: [18.07, 59.33], espoo: [24.3, 61.2], wroclaw: [17.03, 51.1], seoul: [127.1, 37.5], tokyo: [139.7, 35.68], oslo: [10.75, 59.91], auckland: [174.76, -36.85], beijing: [116.4, 39.9], dc: [-77.04, 38.9], telaviv: [34.78, 32.08] };
// map: view=[lon0,lon1,lat0,lat1]; returns {n, P(lon,lat)} with absolute scene coords
function mapView(x, y, w, h, view, o) {
  o = o || {}; const [a0, a1, b0, b1] = view; const px = l => (l - a0) / (a1 - a0) * w, py = l => (b1 - l) / (b1 - b0) * h;
  const land = o.land || '#D3C5A2', edge = o.edge || '#BDAE89', sea = o.sea || 'none';
  const r = rnd(5); const d = pts => 'M' + pts.map(([lo, la]) => (px(lo) + (r() - .5) * 1.6).toFixed(1) + ' ' + (py(la) + (r() - .5) * 1.6).toFixed(1)).join('L') + 'Z';
  let all = ''; for (const k in LAND) all += d(LAND[k]);
  const inner = `<path d="${all}" fill="rgba(20,15,5,.22)" transform="translate(5,6)"/><path d="${all}" fill="${land}" stroke="${edge}" stroke-width="1.5"/><path d="${all}" fill="url(#htl)" opacity="${o.ht === undefined ? .16 : o.ht}"/><path d="${d(CASPIAN)}" fill="${o.lake || CREAM}"/>`;
  const n = mk(`<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="display:block;overflow:hidden;${sea !== 'none' ? 'background:' + sea : ''}">${inner}</svg>`, x, y, Object.assign({ w, h }, o));
  return { n, P: (lo, la) => [x + px(lo), y + py(la)], PC: k => [x + px(CITY[k][0]), y + py(CITY[k][1])] };
}
const WORLD = [-170, 182, -57, 79];
// pin with label. dir: label offset direction
function pin(p, label, t, o) {
  o = o || {}; const col = o.col || RED, s = o.s || 30;
  const dot = mk(`<div style="width:${s}px;height:${s}px;border-radius:50%;background:${col};border:${Math.round(s * .17)}px solid ${o.ring || WHITE};box-sizing:border-box;box-shadow:4px 5px 0 rgba(20,15,5,.25)"></div>`, p[0], p[1], { c: true, in: 'pop', t, z: 20, p: o.p });
  let lab = null;
  if (label) { const dx = o.dx === undefined ? 26 : o.dx, dy = o.dy === undefined ? -34 : o.dy; lab = tag(label, p[0] + dx, p[1] + dy, o.size || 30, { col: o.tcol || 'ink', in: o.lin || 'right', t: t + .12, rot: o.rot === undefined ? -2 : o.rot, z: 21, f: o.f, p: o.p, dist: 40 }); }
  return { dot, lab };
}
// money arc between two points with travelling coin
function arc(p1, p2, t, d, o) {
  o = o || {}; const bend = o.bend === undefined ? -.28 : o.bend, mx = (p1[0] + p2[0]) / 2 - (p2[1] - p1[1]) * bend, my = (p1[1] + p2[1]) / 2 + (p2[0] - p1[0]) * bend;
  const r = stroke(`M${p1[0].toFixed(1)} ${p1[1].toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`, t, d, Object.assign({ col: RED, sw: 6, z: 15, ease: EZ.io }, o));
  if (o.coin !== false) travel(r.path, t, d, { col: o.coinCol || YEL, s: o.cs || 28 });
  return r;
}
/* ---------- composite components ---------- */
// generic game box (no real logos): big title on coloured front
function gamebox(title, x, y, w, o) {
  o = o || {}; const h = o.h || w * 1.32, col = o.col || 'red';
  const b = paper(x, y, w, h, Object.assign({ col, j: 1.5 }, o));
  mk(`<div style="position:absolute;left:0;top:0;width:${w * .09}px;height:${h}px;background:rgba(0,0,0,.22)"></div><div style="position:absolute;left:${w * .16}px;top:${h * .07}px;right:${w * .08}px;height:${h * .5}px;background:rgba(255,255,255,.14);border:3px solid rgba(255,255,255,.5)"></div>`, 0, 0, { p: b, w, h });
  txt(title, w * .55, h * .32, o.ts || w * .17, { p: b, c: true, col: o.tc || WHITE, al: 'center', lh: .95, css: { whiteSpace: 'normal', width: w * .7 + 'px' } });
  if (o.sub) txt(o.sub, w * .55, h * .68, w * .075, { p: b, c: true, f: 'p', col: o.tc || WHITE, al: 'center', css: { whiteSpace: 'normal', width: w * .7 + 'px', lineHeight: 1.25, opacity: .92 } });
  if (o.foot) txt(o.foot, w * .55, h * .88, w * .085, { p: b, c: true, f: 'm', col: o.tc || WHITE, al: 'center' });
  return b;
}
// document sheet with header + faux text lines
function docu(x, y, w, h, o) {
  o = o || {}; const n = paper(x, y, w, h, Object.assign({ col: 'white' }, o)); let s = '';
  const r = rnd(o.seed || 3), top = o.top || 150, lh = o.lh || 30, n0 = Math.floor((h - top - 50) / lh);
  for (let k = 0; k < n0; k++) { if (o.skip && o.skip.includes(k)) continue; const ww = (k % 5 === 4 ? .45 + r() * .3 : .86 + r() * .1) * (w - 110); s += `<div style="position:absolute;left:56px;top:${top + k * lh}px;width:${ww.toFixed(0)}px;height:${o.lw || 9}px;background:#1A1814;opacity:.2;border-radius:2px"></div>`; }
  mk(s, 0, 0, { p: n, w, h });
  if (o.head) txt(o.head, 56, 46, o.hs || 38, { p: n, col: INK, f: o.hf || 'd' });
  if (o.sub) txt(o.sub, 56, 46 + (o.hs || 38) * 1.25, o.ss || 22, { p: n, col: 'rgba(26,24,20,.7)', f: 'm' });
  return n;
}
function person(x, y, size, o) { o = o || {}; return icon(o.k || 'person', x, y, size, Object.assign({ boil: 1 }, o)); }
// big kicker label: small caps line with rule
function kicker(text, x, y, t, o) { o = o || {}; const n = txt(`<span style="display:inline-block;width:54px;height:6px;background:${o.bar || RED};vertical-align:middle;margin-right:18px;translate:0 -3px"></span>${text}`, x, y, o.size || 28, Object.assign({ f: 'p', in: 'right', t, dist: 40 }, o)); return n; }
// date flag: mono text on yellow paper strip
function dateTag(text, x, y, t, o) { o = o || {}; return tag(text, x, y, o.size || 40, Object.assign({ col: 'yellow', f: 'm', in: 'drop', t, rot: -3, boil: 1, pad: '14px 26px 10px' }, o)); }
// quote block
function quote(text, who, x, y, w, size, t, o) {
  o = o || {}; const q = txt('“', x - size * .62, y - size * .5, size * 3.2, { f: 'sb', col: o.qcol || RED, in: 'pop', t });
  const n = txt(text, x, y, size, { f: 'si', in: 'wipe', t: t + .1, d: o.d || .9, lh: 1.22, col: o.col, css: { whiteSpace: 'normal', width: w + 'px' } });
  const a = txt('— ' + who, x, y + (o.ah || size * 1.22 * (o.lines || 2) + 34), o.as || 30, { f: 'p', in: 'up', t: t + (o.ad === undefined ? .7 : o.ad), dist: 30, col: o.col, ls: '.1em' });
  return { q, n, a };
}
// chapter title card
function chapter(id, no, title, col, tcol) {
  const t0 = S(id);
  scene(t0, { bg: col, z0: 1.0, z1: 1.07, ox: 50, oy: 50 }, sc => {
    const ink = tcol || WHITE;
    txt(no === 'END' ? '∎' : ('0' + no), 1500, 560, 900, { c: true, col: 'rgba(0,0,0,.13)', in: 'left', t: t0 + .02, d: .8, dist: 200 });
    const cjk = { 1: '腾讯', 2: '豪赌', 3: '帝国', 4: '北京', 5: '华府', 6: '剥离', 7: '博弈', END: '意义' }[no];
    txt(cjk, 1730, 150, 150, { c: true, f: 'cjk', col: 'rgba(0,0,0,.18)', in: 'fade', t: t0 + .2, rot: 0, css: { writingMode: 'vertical-rl' } });
    tag(no === 'END' ? 'ENDING' : 'CHAPTER ' + no, 150, 300, 46, { col: 'ink', f: 'm', in: 'drop', t: t0 + .02, rot: -3, boil: 1, pad: '16px 30px 11px' });
    const lines = title.split('|'); let y = 420;
    lines.forEach((l, k) => { words(l, 150, y, lines.length > 2 ? 150 : 190, t0 + .16 + k * .16, { col: ink, step: .07, wd: .32 }); y += (lines.length > 2 ? 150 : 190) * .98; });
    const u = mk(`<div style="width:520px;height:16px;background:${ink === WHITE ? YEL : INK}"></div>`, 152, y + 26, { in: 'grow', t: t0 + .55, d: .5 });
  });
}
```

## 10. Source: tools/make_textures.py

```python
# Generates paper textures into app/tex/. Run from the repo root: python3 tools/make_textures.py
import numpy as np, os
from PIL import Image, ImageFilter, ImageDraw
os.makedirs('app/tex', exist_ok=True)
def grainmap(w,h,seed,fib=1.0):
    r=np.random.default_rng(seed)
    fine=np.asarray(Image.fromarray(np.clip(128+r.normal(0,1,(h,w))*46,0,255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.7)),np.float32)/128-1
    mid=np.asarray(Image.fromarray(np.clip(128+r.normal(0,1,(h//6,w//6))*50,0,255).astype(np.uint8)).resize((w,h),Image.BICUBIC),np.float32)/128-1
    big=np.asarray(Image.fromarray(np.clip(128+r.normal(0,1,(h//60+2,w//60+2))*50,0,255).astype(np.uint8)).resize((w,h),Image.BICUBIC).filter(ImageFilter.GaussianBlur(20)),np.float32)/128-1
    g=fine*0.055+mid*0.03+big*0.04
    im=Image.new('L',(w,h),128); d=ImageDraw.Draw(im)
    for _ in range(int(w*h/2600*fib)):
        x,y=r.integers(0,w),r.integers(0,h); L=r.integers(5,30); a=r.uniform(0,np.pi); c=int(r.choice([96,104,150,158]))
        d.line([(x,y),(x+L*np.cos(a),y+L*np.sin(a))],fill=c,width=1)
    f=np.asarray(im.filter(ImageFilter.GaussianBlur(0.5)),np.float32)/128-1
    return g+f*0.22
def hexrgb(h): return np.array([int(h[i:i+2],16) for i in (1,3,5)],np.float32)
def tex(name,col,w,h,seed,dark=False,grid=None,vig=0.0,q=90):
    g=grainmap(w,h,seed); c=hexrgb(col)[None,None,:]
    if dark: out=c+(255-c)*np.clip(g*1.3+0.02,0,1)[:,:,None]*0.55+c*np.minimum(g,0)[:,:,None]*0.8
    else: out=c*(1+g[:,:,None]*0.9)
    if grid:
        gm=np.zeros((h,w),np.float32); gm[::grid,:]=1; gm[:,::grid]=1; gm[::grid*5,:]=2; gm[:,::grid*5]=2
        gm=np.asarray(Image.fromarray((gm*60).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6)),np.float32)/120
        out=out*(1-gm[:,:,None]*0.16)+np.array([60,110,170],np.float32)[None,None,:]*gm[:,:,None]*0.16
    if vig>0:
        yy,xx=np.mgrid[0:h,0:w]; rr=np.sqrt(((xx-w/2)/(w/2))**2+((yy-h/2)/(h/2))**2)
        out=out*(1-vig*np.clip(rr-0.55,0,1)**1.6)[:,:,None]
    Image.fromarray(np.clip(out,0,255).astype(np.uint8)).save('app/tex/%s.jpg'%name,quality=q)
BW,BH=2112,1188
tex('bg_cream','#EDE4CF',BW,BH,1,vig=0.22); tex('bg_grid','#F1EAD9',BW,BH,2,grid=44,vig=0.18)
tex('bg_navy','#17223F',BW,BH,3,dark=True,vig=0.35); tex('bg_ink','#1B1916',BW,BH,4,dark=True,vig=0.3)
tex('bg_red','#D93E27',BW,BH,5,vig=0.3); tex('bg_kraft','#C4A070',BW,BH,6,vig=0.25)
tex('bg_blue','#2450C0',BW,BH,7,vig=0.3); tex('bg_yellow','#FFCF2B',BW,BH,8,vig=0.2)
for i,(n,c,d) in enumerate([('white','#FAF6EA',0),('cream','#EDE4CF',0),('yellow','#FFCF2B',0),('red','#E2432A',0),('blue','#2553C7',0),('ink','#1B1916',1),('kraft','#C7A374',0),('teal','#1A8A70',0),('pink','#F0B8A4',0),('navy','#17223F',1),('grey','#CDC6B5',0),('green','#3DAA5C',0)]):
    tex('p_'+n,c,1024,1024,20+i,dark=bool(d),q=88)
```

## 11. Source: alignment/textprep.py

Parses the script into sentences and phrases with spoken-syllable estimates.

```python
import re, json
raw=open('/mnt/user-data/uploads/Untitled_document.md').read()
raw=raw.replace('\\','')
ones="zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split()
tens="x x twenty thirty forty fifty sixty seventy eighty ninety".split()
def n2w(n):
    n=int(n)
    if n<20: return ones[n]
    if n<100: return tens[n//10]+('' if n%10==0 else ' '+ones[n%10])
    if n<1000: return ones[n//100]+' hundred'+('' if n%100==0 else ' '+n2w(n%100))
    if n<1000000: return n2w(n//1000)+' thousand'+('' if n%1000==0 else ' '+n2w(n%1000))
    return str(n)
def year(y):
    y=int(y)
    if 2000<=y<=2009: return 'two thousand'+('' if y==2000 else ' '+ones[y-2000])
    return n2w(y//100)+' '+(n2w(y%100) if y%100>=10 else 'oh '+ones[y%100])
def dec(m):
    a,b=m.group(1),m.group(2)
    return n2w(a)+' point '+' '.join(ones[int(c)] for c in b)
def spoken(t):
    t=t.replace('$400 Million','four hundred million dollar')
    t=t.replace('1260H','twelve sixty H').replace('175,000','one hundred seventy five thousand')
    t=t.replace('8 to 9 p.m.','eight to nine pee em').replace('2000s','two thousands')
    t=t.replace('U.S.','you ess')
    t=re.sub(r'\b(1[89]\d\d|20\d\d)\b',lambda m:year(m.group(1)),t)
    t=re.sub(r'(\d+)\.(\d+)',dec,t)
    t=re.sub(r'\d+',lambda m:n2w(m.group(0)),t)
    t=t.replace('%',' percent')
    for a,b in [('OICQ','oh eye see cue'),('ICQ','eye see cue'),('QQ','cue cue'),('AOL','ay oh el'),('CNN','see en en'),('CEO','see ee oh'),('CFIUS','siffius'),('FT','eff tee'),('PC','pee see')]:
        t=re.sub(r'\b'+a+r'\b',b,t)
    return t
def syl(word):
    w=re.sub(r"[^a-z]","",word.lower())
    if not w: return 0
    special={'the':1,'people':2,'business':2,'every':2,'riot':2,'being':2,'science':2,'area':3,'idea':3,'create':2,'created':3,'video':3,'media':3,'studio':3,'studios':3,'quiet':2,'chinese':2,'league':1,'tongue':1,'one':1,'once':1,'ubisoft':3,'tencent':2,'naspers':2,'beijing':2,'shenzhen':2,'weixin':2,'wechat':2,'fortnite':2,'valorant':3,'huateng':2,'guillemot':3,'employee':3,'something':2,'sometimes':2,'someone':2,'themselves':2,'games':1,'game':1,'named':1,'renamed':2,'based':1,'issue':2,'euros':2,'euro':2,'yuan':2,'value':2,'valued':2,'issue':2,'rescue':2,'argue':2,'continue':3,'fuel':2,'cruel':2,'really':2,'real':1,'idea':3,'reappeared':3,'financial':3,'social':2,'special':2,'official':3,'officials':3,'national':3,'operational':5,'million':2,'billion':2,'companies':3,'company':3,'opium':3,'spiritual':4,'actually':4,'usually':4,'influential':4,'period':3,'experience':4,'serious':3,'previous':3,'obvious':3,'various':3,'eight':1,'isn':1,"isnt":2,'wasnt':2,'doesnt':2,'didnt':2,'shouldnt':2,'couldnt':2,'werent':1,'arent':1,'owned':1,'called':1,'moved':1,'filed':1,'played':1,'signed':1,'blocked':1,'worked':1,'pushed':1,'changed':1,'helped':1,'released':2,'announced':2,'published':2,'removed':2,'revoked':2,'replaced':2,'resigned':2,'stepped':1,'dragged':1,'declined':2,'registered':3,'weighed':1,'noticed':2,'closed':1,'banned':1,'argued':2,'described':2,'reviewed':2,'cited':2,'reported':3,'invested':3,'counted':2,'noted':2,'diluted':3,'disclosed':2,'mentioned':2,'considered':3,'required':2,'preferred':2,'forced':1,'fired':1,'paid':1,'singled':2,'affiliated':5,'listed':2,'added':2,'started':2,'objected':3,'infringed':2,'wanted':2,'targeted':3,'voluntarily':5,'shareholder':3,'shareholders':3,'sometimes':2,'safeguards':2,'elsewhere':2,'lines':1,'rules':1,'stakes':1,'makes':1,'takes':1,'sales':1,'shares':1,'names':1,'times':1,'homes':1,'sides':1,'drives':1,'cultures':2,'pieces':2,'offices':3,'services':3,'changes':2,'pages':2,'prices':2,'bases':2,'addresses':3,'websites':2,'designations':4,'entities':3,'technologies':4,'industries':3,'studies':2,'countries':2,'parties':2,'agencies':3,'economies':4,'subsidiary':5,'fundamentally':5,'independence':4,'independent':4,'graduate':3,'immediately':5,'separate':3,'separately':4,'evidence':3,'audience':3,'audiences':4,'license':2,'science':2,'sweeney':2,'bleszinski':3,'capps':1,'polygon':3,'reuters':2,'mcentee':3,'monaco':3,'biden':2,'beeler':2,'laurel':2,'pentagon':3,'washington':3,'awakening':4,'clayton':2,'huge':1,'theyre':1,'were':1,'there':1,'where':1,'here':1,'are':1,'fire':2,'hour':2,'hours':2,'our':2,'quietly':3,'eye':1,'cue':1,'ay':1,'ee':1,'ess':1,'eff':1,'tee':1,'pee':1,'see':1,'oh':1,'el':1,'en':1,'em':1,'h':1}
    if w in special: return special[w]
    n=len(re.findall(r'[aeiouy]+',w))
    if w.endswith('e') and not w.endswith('le') and n>1: n-=1
    if w.endswith('es') and not re.search(r'(s|x|z|ch|sh|c|g)es$',w) and n>1: n-=1
    if w.endswith('ed') and not re.search(r'(t|d)ed$',w) and n>1: n-=1
    return max(1,n)
def nsyl(t): return sum(syl(w) for w in re.findall(r"[A-Za-z']+",spoken(t)))
# parse paragraphs -> sentences -> phrases
items=[]
for para in raw.split('\n'):
    para=para.strip()
    if not para: continue
    hm=re.match(r'^\*\*(.+)\*\*$',para)
    if hm:
        items.append(dict(kind='title',text=hm.group(1))); continue
    prot=para.replace('U.S.','U_S_').replace('p.m.','p_m_')
    prot=re.sub(r'(\d)\.(\d)',r'\1_DOT_\2',prot)
    parts=re.split(r'(?<=[.!?])\s+|(?<=[.!?]["”])\s+',prot)
    merged=[]
    for p in parts:
        p=p.strip().replace('U_S_','U.S.').replace('p_m_','p.m.').replace('_DOT_','.')
        if not p: continue
        if merged and re.search(r'(U\.S\.|p\.m\.)$',merged[-1]) and not p[0].isupper(): merged[-1]+=' '+p
        else: merged.append(p)
    for s in merged: items.append(dict(kind='sent',text=s))
for i,it in enumerate(items):
    it['id']=i; it['syl']=nsyl(it['text'])
    # phrases split at , ; : — and internal punctuation
    ph=[p.strip() for p in re.split(r'(?<=[,;:—])\s+|\s+—\s+',it['text']) if p.strip()]
    it['phr']=[(p,nsyl(p)) for p in ph]
json.dump(items,open('items.json','w'),indent=1)
print(len(items), sum(1 for i in items if i['kind']=='title'))
print('syl sents',sum(i['syl'] for i in items if i['kind']=='sent'),'syl titles',sum(i['syl'] for i in items if i['kind']=='title'))
print('words',sum(len(i['text'].split()) for i in items if i['kind']=='sent'))
for it in items[:14]: print(it['id'],it['kind'],it['syl'],it['text'][:90])
for it in items: 
    if re.search(r'U\.S\.|p\.m\.|\d\.\d',it['text']): print('CHK',it['id'],it['syl'],it['text'][:120],'=>',spoken(it['text'])[:140])
```

## 12. Source: alignment/align3.py and words3.py

The pause-based estimate. Needs `sil.txt` (ffmpeg `silencedetect=noise=-38dB:d=0.12`), `items.json` and `nuclei.npy` in the same folder.

```python
import re, json, numpy as np, sys
exec(open('textprep.py').read().split("# parse paragraphs")[0])
items=json.load(open('items.json'))
s=open('sil.txt').read()
st=[float(x) for x in re.findall(r"silence_start: ([\d.]+)",s)]
en=[float(x) for x in re.findall(r"silence_end: ([\d.]+)",s)]
TOTAL=586.7945
nuc=np.load('nuclei.npy')
# build chunks, merging blips (<0.16s or <=1 nuclei & <0.25s) into pauses
bounds=[0.0]+[x for p in zip(st,en) for x in p]+[TOTAL]
raw=[(bounds[2*i],bounds[2*i+1]) for i in range(len(bounds)//2)]
chunks=[]
for a,b in raw:
    k=int(((nuc>=a)&(nuc<b)).sum())
    if b-a<0.16 or (b-a<0.25 and k<=1): continue
    chunks.append([a,b,k])
m=len(chunks)
cd=np.array([c[1]-c[0] for c in chunks]); pa=np.array([chunks[i+1][0]-chunks[i][1] for i in range(m-1)]+[0.5])
print('chunks',m,'speech',cd.sum().round(1))
# phrases
PH=[]
for it in items:
    ph=it['phr']
    for k,(p,sy) in enumerate(ph):
        PH.append(dict(item=it['id'],kind=it['kind'],text=p,syl=max(sy,1),end=2 if k==len(ph)-1 else 1,first=(k==0),nph=len(ph)))
n=len(PH); sy=np.array([p['syl'] for p in PH],float); cs=np.concatenate([[0],np.cumsum(sy)])
endc=np.array([p['end'] for p in PH]); se=np.concatenate([[0],np.cumsum(endc==2)])
ccs=np.concatenate([[0],np.cumsum(cd)])
def run(rate,ret=False):
    INF=1e15
    D=np.full((n+1,m+1),INF); B={}
    D[0,0]=0
    for i in range(n+1):
        for j in range(m+1):
            d=D[i,j]
            if d>=INF: continue
            # skip chunk
            if j<m:
                c=d+3+4*cd[j]
                if c<D[i,j+1]: D[i,j+1]=c;B[(i,j+1)]=(i,j,'skipchunk')
            # skip sentence (only at sentence start)
            if i<n and PH[i]['first']:
                k=i+PH[i]['nph']; c=d+8+0.5*(cs[k]-cs[i])
                if c<D[k,j]: D[k,j]=c;B[(k,j)]=(i,j,'skipsent')
            if i<n and j<m:
                for c_ in (1,2,3):
                    if j+c_>m: break
                    dur=ccs[j+c_]-ccs[j]
                    for p in range(1,10):
                        if i+p>n: break
                        S=cs[i+p]-cs[i]; ex=S/rate
                        if ex>dur*1.6+0.6: break
                        if ex<dur*0.55-0.4: continue
                        cost=((dur-ex)**2)/((0.12+0.08*ex)**2)
                        cost+=3.0*(c_-1)                      # pauses at non-punct
                        cost+=1.0*(se[i+p-1]-se[i])           # sentence end w/o pause
                        e=endc[i+p-1]; pz=pa[j+c_-1]
                        cost+= (-3.0*min(pz,0.5) if e==2 else 0.6-1.0*min(pz,0.3))
                        v=d+cost
                        if v<D[i+p,j+c_]: D[i+p,j+c_]=v;B[(i+p,j+c_)]=(i,j,'m')
    if not ret: return D[n,m]
    path=[];cur=(n,m)
    while cur!=(0,0):
        i0,j0,k=B[cur]; path.append((i0,j0,cur[0],cur[1],k)); cur=(i0,j0)
    return D[n,m],path[::-1]
if __name__=='__main__':
    for rate in (5.0,5.5,6.0,6.3,6.6,6.9,7.2,7.5,7.8):
        c,path=run(rate,True)
        ss=sum(1 for p in path if p[4]=='skipsent'); sc=sum(1 for p in path if p[4]=='skipchunk')
        skl=sum(cs[p[2]]-cs[p[0]] for p in path if p[4]=='skipsent'); skd=sum(ccs[p[3]]-ccs[p[1]] for p in path if p[4]=='skipchunk')
        print(rate,'cost',round(c,1),'skipped sents',ss,'(syl',int(skl),') skipped chunks',sc,'(sec',round(skd,1),')')
    json.dump(dict(chunks=chunks,PH=PH),open('al3_in.json','w'))
```

```python
# word-level predicted times from align3 path (interpolating by syllables inside each matched group)
import json,re,sys
from align3 import *
rate=7.3
c,path=run(rate,True)
exec(open('textprep.py').read().split("# parse paragraphs")[0])
words=[]
for (i0,j0,i1,j1,k) in path:
    if k=='skipchunk': continue
    toks=[]
    for p in PH[i0:i1]:
        for t in p['text'].split():
            if not re.search(r'[A-Za-z0-9]',t): continue
            sy_=max(1,sum(syl(w) for w in re.findall(r"[A-Za-z']+",spoken(t))))
            toks.append([t,sy_,p['item']])
    if k=='skipsent':
        for t in toks: words.append(dict(w=t[0],item=t[2],t0=None))
        continue
    # speech time segments of chunks j0..j1
    segs=[(chunks[j][0],chunks[j][1]) for j in range(j0,j1)]
    tot=sum(b-a for a,b in segs); S=sum(t[1] for t in toks); acc=0
    def tm(frac):
        x=frac*tot
        for a,b in segs:
            if x<=b-a+1e-9: return a+x
            x-=b-a
        return segs[-1][1]
    for t in toks:
        words.append(dict(w=t[0],item=t[2],t0=round(tm(acc/S),3),t1=round(tm((acc+t[1])/S),3))); acc+=t[1]
json.dump(words,open('words3.json','w'))
print(len(words)); print([ (w['w'],w['t0']) for w in words[:12]])
```

## 13. Next steps

1. Get real word timestamps and rebuild `app/timing.js`.
2. Write `index.html` and load the engine with two or three test scenes. Fix what breaks.
3. Render one still per scene type and look at each before animating more.
4. Write the scenes from section 6.
5. Write the segment renderer, render, concat, mux the voiceover, add grain.
6. Watch the result against the audio before calling it done.
