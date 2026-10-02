'use strict';
/* Scenes. Every scene starts on a sentence (S) or word (Wt) time from timing.js; numbers in comments are sentence ids. */

/* ---------- small local builders ---------- */
function chatWin(x, y, w, h, title, col, o) {  // paper chat window with bubbles (generic, no real UI)
  o = o || {}; const b = paper(x, y, w, h, Object.assign({ col: 'white' }, o));
  mk(`<div style="position:absolute;left:0;top:0;right:0;height:58px;background:${col}"></div>
      <div style="position:absolute;left:22px;top:20px;width:18px;height:18px;border-radius:50%;background:${WHITE}"></div>
      ${[[40, 96, .55, GREY], [w * .4, 168, .5, col], [40, 240, .42, GREY], [w * .33, 312, .55, col]].filter(r => r[1] + 50 < h).map(([l, t, ww, c]) =>
        `<div style="position:absolute;left:${l}px;top:${t}px;width:${w * ww}px;height:44px;border-radius:22px;background:${c};opacity:.9"></div>`).join('')}`, 0, 0, { p: b, w, h });
  txt(title, 56, 13, 32, { p: b, f: 'd', col: WHITE });
  return b;
}
function bigNum(text, x, y, size, t, o) { return txt(text, x, y, size, Object.assign({ c: true, f: 'd', in: 'pop', t, css: { fontWeight: 800 } }, o || {})); }
function note(text, x, y, size, t, o) { return txt(text, x, y, size, Object.assign({ f: 'si', in: 'wipe', t, d: .5, col: RED }, o || {})); }

/* =================== CHAPTER 1 — THE COPYCAT FROM SHENZHEN =================== */
chapter(0, 1, 'The Copycat|From Shenzhen', 'red');

// [1] November 1998, Shenzhen, five young men
scene(S(1), { bg: 'cream' }, sc => {
  txt('深圳', 1500, 300, 330, { c: true, f: 'cjk', col: 'rgba(26,24,20,.1)', in: 'fade', t: S(1) });
  icon('skyline', 0, 640, 1920, { in: 'wipeUp', t: S(1), d: .8, shy: 0, shx: 0, sha: 0 });
  dateTag('NOVEMBER 1998', 150, 150, Wt(1, 'november'), { size: 58 });
  tag('SHENZHEN, CHINA', 160, 262, 34, { col: 'ink', f: 'p', in: 'right', t: Wt(1, 'shenzhen'), rot: 2 });
  const xs = [560, 790, 1020, 1250, 1480];
  xs.forEach((x, k) => person(x, 470, 200, { k: k === 2 ? 'personY' : 'person', in: 'drop', t: Wt(1, 'five') + k * .09 }));
  tag('A SMALL SOFTWARE COMPANY', 960, 930, 44, { c: true, col: 'yellow', in: 'pop', t: Wt(1, 'small'), rot: -1.5 });
});

// [2-3] Ma Huateng, "Pony", 马 = horse
scene(S(2), { bg: 'kraft', tr: 'wipe' }, sc => {
  person(260, 250, 420, { k: 'personY', in: 'up', t: S(2) });
  tag('MA HUATENG', 300, 760, 64, { col: 'ink', in: 'drop', t: Wt(2, 'ma'), rot: -2 });
  txt('the leader', 330, 860, 40, { f: 'si', in: 'fade', t: Wt(2, 'leader') });
  const a = arrow(760, 420, 1000, 330, Wt(3, 'pony') - .25, { col: INK, sw: 7 });
  txt('“PONY”', 1030, 230, 150, { f: 'd', in: 'pop', t: Wt(3, 'pony'), css: { fontWeight: 800 } });
  const card = paper(1080, 520, 560, 330, { col: 'white', in: 'drop', t: Wt(3, 'family'), rot: 3, tape: 'c' });
  txt('马', 150, 165, 220, { p: card, c: true, f: 'cjk', col: RED });
  txt('= HORSE', 390, 165, 70, { p: card, c: true, f: 'd', col: INK, in: 'right', t: Wt(3, 'horse'), dist: 30 });
});

// [4-5] Their first big product wasn't original. It was a copy.
scene(S(4), { bg: 'cream' }, sc => {
  kicker('PRODUCT NO. 1', 150, 120, S(4));
  chatWin(330, 260, 600, 420, 'CHAT', BLUE, { in: 'drop', t: S(4) + .15, rot: -4 });
  chatWin(990, 330, 600, 420, 'CHAT', BLUE, { in: 'drop', t: Wt(4, 'original'), rot: 3 });
  txt('=', 960, 520, 160, { c: true, f: 'd', in: 'pop', t: Wt(4, 'original') + .2, col: RED });
  stamp('IT WAS A COPY.', 960, 860, 110, Wt(5, 'copy'));
});

// [6] ICQ (Israel) acquired by America Online
scene(S(6), { bg: 'cream', tr: 'wipeL' }, sc => {
  icon('monitor', 120, 450, 420, { in: 'up', t: S(6) });
  const icq = paper(640, 380, 420, 300, { col: 'white', in: 'drop', t: Wt(6, 'icq'), rot: -3 });
  txt('ICQ', 210, 120, 140, { p: icq, c: true, f: 'd', col: GREEN, css: { fontWeight: 800 } });
  txt('BUILT IN ISRAEL', 210, 235, 30, { p: icq, c: true, f: 'p', col: INK });
  txt('one of the world’s first internet chat programs', 640, 730, 38, { f: 'si', in: 'wipe', t: Wt(6, 'first'), d: .8, css: { whiteSpace: 'normal', width: '520px' }, lh: 1.2 });
  arrow(1090, 520, 1310, 520, Wt(6, 'bought') - .6, { col: RED, sw: 7, bend: -.15 });
  txt('acquired by', 1110, 420, 34, { f: 'si', col: RED, in: 'fade', t: Wt(6, 'bought') - .4 });
  const aol = paper(1340, 370, 440, 300, { col: 'blue', in: 'drop', t: Wt(6, 'america'), rot: 2 });
  txt('AMERICA<br>ONLINE', 220, 150, 84, { p: aol, c: true, f: 'd', col: WHITE, al: 'center', lh: .95 });
});

// [7-8] February 1999, OICQ. "Open ICQ."
scene(S(7), { bg: 'kraft' }, sc => {
  dateTag('FEBRUARY 1999', 150, 130, Wt(7, 'february'), { size: 54 });
  icon('monitor', 560, 250, 800, { in: 'up', t: S(7) + .1 });
  mk('<div style="width:600px;height:340px;background:#12333A"></div>', 640, 345, { in: 'fade', t: Wt(7, 'released') });
  tag('CHINESE-LANGUAGE VERSION', 640, 365, 30, { col: 'yellow', f: 'p', in: 'right', t: Wt(7, 'chinese') });
  txt('OICQ', 940, 560, 190, { c: true, f: 'd', col: WHITE, in: 'pop', t: Wt(7, 'oicq'), css: { fontWeight: 800 } });
  note('= “Open ICQ”', 1400, 800, 70, S(8), { col: INK });
  underline(1400, 890, 430, S(8) + .35, { col: RED });
});

// [9-10] AOL objected: arbitration claim over the trademark
scene(S(9), { bg: 'cream', tr: 'wipe' }, sc => {
  words('AOL OBJECTED.', 130, 110, 150, S(9), { step: .12, css: { fontWeight: 800 } });
  const d = docu(260, 330, 760, 680, { head: 'ARBITRATION CLAIM', sub: 'FILED IN THE UNITED STATES', in: 'up', t: Wt(10, 'arbitration'), rot: -2, top: 190 });
  txt('www.<span style="color:#E2432A">o</span>icq.com', 1160, 470, 74, { f: 'm', in: 'pop', t: Wt(10, 'web') });
  scribble(1452, 512, 98, 58, Wt(10, 'trademark') - .1, { col: RED, sw: 7 });
  tag('“ICQ” TRADEMARK', 1240, 640, 44, { col: 'red', in: 'drop', t: Wt(10, 'trademark'), rot: 3 });
});

// [11-13] OICQ renamed QQ; QQ took off
scene(S(11), { bg: 'yellow' }, sc => {
  const o = txt('<sk>OICQ</sk>', 960, 300, 210, { c: true, f: 'd', in: 'pop', t: S(11), css: { fontWeight: 800 } });
  o.strike(Wt(11, 'renamed'), .4);
  txt('new name, just two letters', 960, 520, 54, { c: true, f: 'si', in: 'fade', t: Wt(12, 'two') });
  bigNum('QQ', 960, 760, 360, Wt(12, 'letters') + .45, { col: RED });
  const up = arrow(1260, 900, 1640, 560, S(13) + .1, { col: INK, sw: 9, bend: .1 });
  txt('TOOK OFF', 1500, 470, 64, { f: 'd', in: 'pop', t: S(13) + .4 });
});

// [14-16] 1 million users in year one; servers and bandwidth cost money; no profit until 2001
scene(S(14), { bg: 'grid' }, sc => {
  chart(170, 230, 900, 560, [[0, .02], [.2, .06], [.4, .15], [.6, .3], [.8, .6], [1, .95]], S(14), 1.4, { col: RED, sw: 10, fill: RED });
  num(180, 110, 110, { from: 0, to: 1000000, t: S(14), d: 1.6, f: 'd', css: { fontWeight: 800 } });
  txt('USERS IN YEAR ONE', 190, 225, 34, { f: 'p', in: 'fade', t: Wt(14, 'users') });
  [0, 1, 2].forEach(k => icon('server', 1220 + k * 170, 360, 150, { in: 'drop', t: Wt(15, 'servers') + k * .1 }));
  tag('FREE', 1240, 250, 60, { col: 'teal', in: 'stamp', t: Wt(15, 'free') });
  txt('every new user = more servers + bandwidth', 1200, 640, 34, { f: 'si', in: 'wipe', t: Wt(15, 'every'), d: .9, css: { whiteSpace: 'normal', width: '540px' }, lh: 1.2 });
  tag('NO PROFIT UNTIL 2001', 1200, 820, 54, { col: 'red', in: 'drop', t: S(16), rot: -2 });
});

// [17-20] Early 2001: growing fast, burning cash, looking for a backer
scene(S(17), { bg: 'cream', tr: 'wipeU' }, sc => {
  dateTag('EARLY 2001', 150, 120, Wt(17, 'early'), { size: 58 });
  const rows = [[18, 'GROWING FAST', 'teal'], [19, 'BURNING CASH', 'red'], [20, 'LOOKING FOR A BACKER', 'ink']];
  rows.forEach(([id, t, c], k) => tag(t, 260, 330 + k * 200, 92, { col: c, in: 'left', t: S(id), rot: [-2, 1.5, -1][k] }));
  icon('flame', 1350, 470, 170, { in: 'pop', t: Wt(19, 'cash') });
  icon('cash', 1160, 520, 240, { in: 'drop', t: S(19) });
  check(990, 395, 44, S(18) + .3);
});

// [21-23] Naspers (South Africa, 1915) pays $32M for 46.5%
scene(S(21), { bg: 'cream', z1: 1.04 }, sc => {
  const m = mapView(0, 0, 1920, 1080, [-25, 165, -50, 61], { hi: { cn: '#E9806C', za: '#E8B95A' } });
  const ct = m.PC('capetown'), sz = m.PC('shenzhen');
  pin(ct, 'SOUTH AFRICA', Wt(21, 'other') - .2, { dx: 30, dy: 10 });
  pin(sz, 'SHENZHEN', Wt(21, 'world') - .1, { dx: -250, dy: -86 });
  arc(ct, sz, Wt(21, 'world'), 1.6, { bend: -.3 });
  const card = paper(160, 190, 520, 290, { col: 'white', in: 'drop', t: Wt(22, 'naspers'), rot: -2, tape: 'l' });
  txt('NASPERS', 260, 100, 100, { p: card, c: true, f: 'd', col: INK, css: { fontWeight: 800 } });
  txt('SOUTH AFRICAN MEDIA GROUP', 260, 175, 26, { p: card, c: true, f: 'p', col: INK });
  txt('EST. 1915', 260, 235, 36, { p: card, c: true, f: 'm', col: RED, in: 'fade', t: Wt(22, '1915') });
  const deal = paper(1250, 560, 600, 420, { col: 'white', in: 'drop', t: Wt(23, '2001') - .1, rot: 2, tape: 'c' });
  txt('2001 DEAL', 50, 40, 34, { p: deal, f: 'm', col: INK });
  txt('~$32M', 50, 92, 96, { p: deal, f: 'd', col: INK, in: 'pop', t: Wt(23, '32'), css: { fontWeight: 800 } });
  pie(1700, 820, 120, { in: 'pop', t: Wt(23, '46.5'), p1: 46.5, col: RED, z: 5 });
  txt('46.5%', 1360, 840, 84, { f: 'd', col: RED, in: 'pop', t: Wt(23, '46.5') + .5, css: { fontWeight: 800 } });
  txt('OF TENCENT', 1364, 930, 28, { f: 'p', in: 'fade', t: Wt(23, 'stake'), col: INK });
});

// [24-25] Hold on to that number. Thirty-two million dollars.
scene(S(24), { bg: 'ink', z1: 1.09, ox: 50, oy: 50 }, sc => {
  txt('HOLD ON TO THAT NUMBER', 960, 300, 46, { c: true, f: 'p', in: 'fade', t: S(24) });
  paper(330, 400, 1260, 330, { col: 'yellow', in: 'grow', t: S(25) - .1, rot: -1.5 });
  bigNum('$32,000,000', 960, 565, 230, S(25), { col: INK });
});

// [26-28] 2019 Amsterdam listing; ~€118B (~$130B); ~4,000x
scene(S(26), { bg: 'grid' }, sc => {
  dateTag('2019 · AMSTERDAM', 150, 110, Wt(26, '2019'), { size: 52 });
  txt('a new company, listed in Amsterdam', 160, 220, 40, { f: 'si', in: 'wipe', t: Wt(26, 'listed'), d: .7 });
  const a = paper(150, 360, 520, 300, { col: 'white', in: 'drop', t: Wt(27, 'stake') - .3, rot: -2 });
  txt('2001', 260, 70, 40, { p: a, c: true, f: 'm', col: INK });
  txt('$32M', 260, 175, 150, { p: a, c: true, f: 'd', col: INK, css: { fontWeight: 800 } });
  arrow(700, 510, 900, 510, Wt(27, 'worth') - .3, { col: RED, sw: 8, bend: -.12 });
  const b = paper(930, 300, 840, 420, { col: 'teal', in: 'drop', t: Wt(27, 'worth'), rot: 1.5 });
  txt('2019', 420, 70, 40, { p: b, c: true, f: 'm', col: WHITE });
  txt('€118B', 420, 195, 190, { p: b, c: true, f: 'd', col: WHITE, css: { fontWeight: 800 } });
  txt('≈ $130 BILLION', 420, 330, 60, { p: b, c: true, f: 'd', col: YEL, in: 'fade', t: Wt(27, 'roughly') });
  source('CNN', Wt(27, 'cnn'));
  tag('×4,000', 1320, 780, 120, { col: 'red', in: 'stamp', t: Wt(28, 'four'), rot: -4 });
  txt('$1 in → ~$4,000 of value', 150, 760, 56, { f: 'd', in: 'wipe', t: Wt(28, 'every'), d: .6 });
  note('…even after selling part of the stake', 150, 860, 46, Wt(28, 'already'), { col: INK });
});

// [29-30] One of the most successful tech investments ever; the fuel for what came next
scene(S(29), { bg: 'cream', tr: 'wipe' }, sc => {
  txt('“', 150, 120, 300, { f: 'sb', col: RED, in: 'pop', t: S(29) });
  const st = txt('One of the <mk>most successful</mk> technology investments ever made.', 300, 250, 92, { f: 'si', in: 'wipe', t: S(29) + .05, d: 1.2, lh: 1.2, css: { whiteSpace: 'normal', width: '1350px' } });
  st.hl(Wt(29, 'successful') - .1, .5);
  icon('flame', 1560, 690, 150, { in: 'pop', t: Wt(30, 'fuel') });
  txt('FUEL FOR WHAT CAME NEXT', 820, 760, 60, { f: 'd', in: 'right', t: Wt(30, 'fuel') + .1 });
});

/* first word of sentence id spoken at or after time t (used to give chapter cards a readable hold) */
function wAfter(id, t) { for (const [, tt] of TM[id].words) if (tt >= t - 1e-6) return tt; return TM[id].t1; }
function card(text, x, y, w, h, t, o) {  // paper card with one centred display line
  o = o || {}; const p = paper(x, y, w, h, Object.assign({ col: 'white', in: 'drop', t }, o));
  txt(text, w / 2, h / 2, o.size || h * .42, { p, c: true, f: o.f || 'd', col: o.tc || (/ink|navy|blue|red|teal/.test(o.col || '') ? WHITE : INK), al: 'center', lh: .95, css: { fontWeight: 800, whiteSpace: 'normal', width: (w - 60) + 'px' } });
  return p;
}

/* =================== CHAPTER 2 — THE $400 MILLION BET =================== */
chapter(31, 2, 'The $400|Million Bet', 'blue');

// [32-34] late 2000s: QQ a giant in China; building games; every games business needs hits
scene(wAfter(32, S(31) + 2.4), { bg: 'cream' }, sc => {
  const t0 = sc.T0;
  dateTag('LATE 2000s', 150, 120, t0, { size: 54 });
  txt('QQ', 420, 470, 300, { c: true, f: 'd', col: RED, in: 'pop', t: t0 + .1, css: { fontWeight: 800 } });
  tag('A GIANT IN CHINA', 190, 660, 56, { col: 'ink', in: 'right', t: Wt(32, 'giant'), rot: -2 });
  icon('pad', 900, 330, 380, { in: 'drop', t: Wt(33, 'games') });
  tag('+ A GAMES BUSINESS', 900, 620, 50, { col: 'teal', in: 'up', t: Wt(33, 'business'), rot: 1.5 });
  txt('every games business needs…', 1250, 300, 40, { f: 'si', in: 'wipe', t: S(34), d: .7 });
  stamp('HITS', 1530, 470, 170, Wt(34, 'hits'), { rot: -10 });
});

// [35-37] Riot Games, Los Angeles; League of Legends; Tencent early investor + China distributor
scene(S(35), { bg: 'cream', tr: 'wipe' }, sc => {
  const m = mapView(0, 150, 1100, 760, [-128, -64, 18, 54], { hi: { us: '#9FB4E6' } });
  pin(m.PC('la'), 'LOS ANGELES', Wt(35, 'los'), { dx: 30, dy: -70, size: 34 });
  card('RIOT GAMES', 300, 760, 520, 150, Wt(35, 'riot'), { col: 'red', rot: -2 });
  gamebox('LEAGUE OF LEGENDS', 1180, 170, 380, { col: 'navy', in: 'drop', t: S(36), rot: 3, sub: 'A RIOT GAMES TITLE' });
  tag('EARLY INVESTOR: TENCENT', 1150, 760, 46, { col: 'ink', in: 'right', t: Wt(37, 'early'), rot: -1.5 });
  tag('CHINA DISTRIBUTOR: TENCENT', 1150, 860, 46, { col: 'red', in: 'right', t: Wt(37, 'distributor'), rot: 1 });
});

// [38-39] February 2011: ~$400M for 93% of Riot
scene(S(38), { bg: 'grid' }, sc => {
  dateTag('FEBRUARY 2011', 150, 120, Wt(38, 'february'), { size: 54 });
  words('TENCENT WENT MUCH FURTHER', 160, 250, 80, Wt(38, 'went'), { step: .1 });
  num(170, 430, 240, { from: 0, to: 400, t: Wt(39, '400') - .1, d: .9, pre: '$', suf: 'M', f: 'd', css: { fontWeight: 800 } });
  txt('PAID FOR A STAKE IN RIOT', 180, 700, 40, { f: 'p', in: 'fade', t: Wt(39, 'stake') });
  pie(1390, 560, 290, { in: 'pop', t: Wt(39, '93') - .1, p1: 93, col: RED });
  txt('93%', 1390, 560, 150, { c: true, f: 'd', col: WHITE, in: 'pop', t: Wt(39, '93') + .6, css: { fontWeight: 800, textShadow: '4px 5px 0 rgba(0,0,0,.25)' } });
});

// [40] "Riot is going to remain completely independent." Brandon Beck, 2011
scene(S(40), { bg: 'kraft', tr: 'wipeU' }, sc => {
  kicker('RIOT CEO, TO THE TRADE PRESS, 2011', 300, 200, S(40));
  quote('Riot is going to remain completely independent.', 'BRANDON BECK, RIOT CEO', 300, 380, 1300, 100, Wt(40, 'riot', 1) - .1, { lines: 2 });
  underline(300, 616, 1000, Wt(40, 'completely') + .2, { col: RED, sw: 9 });
});

// [41-44] December 2015 blog post: Tencent bought the rest; price undisclosed; wholly owned
scene(S(41), { bg: 'cream' }, sc => {
  dateTag('DECEMBER 2015', 150, 110, Wt(41, 'december'), { size: 54 });
  txt('mentioned almost in passing…', 160, 220, 40, { f: 'si', in: 'wipe', t: Wt(41, 'passing') - .3, d: .6 });
  const d = docu(170, 320, 900, 680, { head: 'BLOG POST', sub: 'RE: CHANGES TO EMPLOYEE PAY', in: 'up', t: Wt(42, 'blog'), rot: -1.5, top: 330, skip: [] });
  const ln = txt('“…<mk>Tencent has bought the rest of the company</mk>…”', 56, 205, 38, { p: d, f: 'si', col: INK, css: { whiteSpace: 'normal', width: '780px' }, lh: 1.25 });
  ln.hl(Wt(42, 'tencent'), .6);
  pie(1450, 420, 210, { steps: [[Wt(42, 'tencent') - .4, .01, 93, 93], [Wt(42, 'rest'), .9, 93, 100]], col: RED, in: 'pop', t: Wt(42, 'noted') });
  txt('93% → 100%', 1450, 680, 64, { c: true, f: 'd', in: 'fade', t: Wt(42, 'rest'), css: { fontWeight: 800 } });
  stamp('PRICE: UNDISCLOSED', 1450, 820, 70, Wt(43, 'never'), { rot: -6 });
  tag('WHOLLY OWNED BY TENCENT', 1180, 930, 46, { col: 'ink', in: 'up', t: Wt(44, 'wholly'), rot: 1 });
});

// [45-49] The Tencent playbook
scene(S(45), { bg: 'kraft', tr: 'wipe' }, sc => {
  const pad = paper(130, 110, 960, 880, { col: 'white', in: 'drop', t: S(45), rot: -1.5, tape: 'c' });
  txt('THE TENCENT PLAYBOOK', 70, 70, 76, { p: pad, f: 'd', col: INK, css: { fontWeight: 800 } });
  txt('in miniature', 74, 160, 40, { p: pad, f: 'si', col: RED });
  const items = [[46, 'buy', '1. BUY IN BIG'], [47, 'promise', '2. PROMISE INDEPENDENCE'], [48, 'name', '3. KEEP THE NAME, OFFICES, CULTURE']];
  items.forEach(([id, w, label], k) => {
    txt(label, 150, 290 + k * 150, 50, { p: pad, f: 'd', col: INK, in: 'right', t: Wt(id, w), dist: 40 });
    check(232, 428 + k * 150, 26, Wt(id, w) + .35);
  });
  gamebox('THE STUDIO', 1290, 230, 440, { col: 'teal', in: 'drop', t: Wt(48, 'studio'), rot: 3, sub: 'SAME NAME · SAME LOGO', foot: 'EST. HERE' });
  txt('Nothing on the box changes.', 1150, 900, 52, { f: 'si', in: 'wipe', t: S(49), d: .7 });
});

// [50-53] Independence has limits: Honor of Kings vs League of Legends
scene(S(50), { bg: 'cream' }, sc => {
  words('BUT INDEPENDENCE HAS LIMITS', 140, 100, 84, S(50), { step: .1 });
  gamebox('HONOR OF KINGS', 220, 300, 400, { col: 'red', in: 'drop', t: Wt(51, 'honor'), rot: -3, sub: 'TENCENT · MOBILE' });
  tag('TENCENT’S HIGHEST-GROSSING MOBILE GAME', 150, 880, 36, { col: 'yellow', in: 'up', t: Wt(51, 'highest'), rot: -1 });
  gamebox('LEAGUE OF LEGENDS', 1300, 300, 400, { col: 'navy', in: 'drop', t: Wt(52, 'league'), rot: 3, sub: 'RIOT · PC' });
  note('a clone?', 760, 360, 96, Wt(52, 'clone'));
  [0, 1, 2].forEach(k => person(830 + k * 100, 560, 110, { in: 'pop', t: Wt(53, 'players') - .3 + k * .08, k: 'person' }));
  arrow(860, 760, 660, 800, Wt(53, 'competing'), { col: RED, sw: 7, bend: .2 });
  arrow(1040, 760, 1260, 800, Wt(53, 'competing') + .15, { col: BLUE, sw: 7, bend: -.2 });
  txt('COMPETING FOR THE SAME PLAYERS', 960, 980, 46, { c: true, f: 'd', in: 'fade', t: Wt(53, 'same') });
  source('THE MOTLEY FOOL', Wt(52, 'motley'));
});

// [54-55] June 2012: $330M into Epic Games, Cary NC (Gears of War)
scene(S(54), { bg: 'cream', tr: 'wipeL' }, sc => {
  dateTag('JUNE 2012', 150, 110, Wt(54, 'june'), { size: 54 });
  txt('second big American move', 160, 220, 42, { f: 'si', in: 'wipe', t: Wt(54, 'second'), d: .6 });
  const m = mapView(820, 120, 1000, 900, [-104, -60, 20, 52], { hi: { us: '#9FB4E6' } });
  pin(m.PC('cary'), 'CARY, NORTH CAROLINA', Wt(55, 'cary'), { dx: -480, dy: -80, size: 34 });
  card('EPIC GAMES', 170, 380, 560, 170, Wt(55, 'epic'), { col: 'ink', rot: -2 });
  num(180, 620, 170, { from: 0, to: 330, t: Wt(55, '330') - .1, d: .8, pre: '$', suf: 'M', f: 'd', css: { fontWeight: 800 } });
  tag('BEST KNOWN FOR: GEARS OF WAR', 170, 850, 40, { col: 'kraft', in: 'up', t: Wt(55, 'gears'), rot: 1.5 });
});

// [56] 48.4% of outstanding shares, 40% counting options (Sweeney via Polygon)
scene(S(56), { bg: 'grid' }, sc => {
  kicker('WHAT $330M BOUGHT', 150, 120, S(56));
  pie(560, 560, 260, { in: 'pop', t: Wt(56, 'deal'), steps: [[Wt(56, '48.4') - .1, .9, 0, 48.4], [Wt(56, '40') - .1, .8, 48.4, 40]], col: RED });
  num(1000, 330, 170, { from: 0, to: 48.4, t: Wt(56, '48.4') - .1, d: .9, fmt: v => v.toFixed(1), suf: '%', f: 'd', css: { fontWeight: 800 } });
  txt('OF OUTSTANDING SHARES', 1010, 520, 40, { f: 'p', in: 'fade', t: Wt(56, 'outstanding') });
  txt('<sk>48.4%</sk> → 40%', 1000, 640, 110, { f: 'd', in: 'pop', t: Wt(56, '40') - .1, css: { fontWeight: 800 } }).strike(Wt(56, '40') + .2);
  txt('of the company, counting employee stock options', 1010, 790, 40, { f: 'si', in: 'wipe', t: Wt(56, 'employee'), d: .7, lh: 1.25, css: { whiteSpace: 'normal', width: '760px' } });
  source('TIM SWEENEY VIA POLYGON', Wt(56, 'polygon'));
});

// [57-59] Sweeney kept control; Variety: the deal changed Epic; leaders left
scene(S(57), { bg: 'cream' }, sc => {
  tag('SWEENEY KEPT CONTROL', 150, 120, 70, { col: 'teal', in: 'drop', t: S(57), rot: -2 });
  txt('the deal <mk>fundamentally changed</mk> how Epic built and released games', 150, 300, 64, { f: 'si', in: 'wipe', t: Wt(58, 'deal'), d: 1, lh: 1.2, css: { whiteSpace: 'normal', width: '1500px' } }).hl(Wt(58, 'fundamentally'), .5);
  person(420, 520, 260, { in: 'up', t: Wt(59, 'capps') - .5 }).to(Wt(59, 'designer'), 1.2, { x: -160, r: -4 });
  tag('MIKE CAPPS · PRESIDENT', 300, 830, 40, { col: 'ink', in: 'right', t: Wt(59, 'capps') - .2 });
  person(1150, 520, 260, { in: 'up', t: Wt(59, 'cliff') - .5 }).to(En(59), 1.2, { x: 160, r: 4 });
  tag('CLIFF BLESZINSKI · DESIGNER', 1010, 830, 40, { col: 'ink', in: 'right', t: Wt(59, 'cliff') - .2 });
  txt('LEADERS WHO LEFT', 960, 980, 36, { c: true, f: 'p', in: 'fade', t: Wt(59, 'left') });
  source('VARIETY', Wt(58, 'variety'));
});

// [60-61] Fortnite; April 2022: $31.5B valuation
scene(S(60), { bg: 'yellow', tr: 'wipe' }, sc => {
  txt('the game that changed everything', 960, 220, 50, { c: true, f: 'si', in: 'fade', t: Wt(60, 'game') });
  bigNum('FORTNITE', 960, 440, 280, Wt(60, 'fortnite'), { col: INK });
  dateTag('APRIL 2022', 380, 690, Wt(61, 'april'), { size: 50 });
  txt('EPIC VALUED AT', 380, 810, 44, { f: 'p', in: 'fade', t: Wt(61, 'valued') });
  num(900, 760, 170, { from: 0, to: 31.5, t: Wt(61, '31.5') - .1, d: 1, fmt: v => v.toFixed(1), pre: '$', suf: 'B', f: 'd', col: RED, css: { fontWeight: 800 } });
});

// [62-65] Now do the math: ~28% x $31.5B ≈ ~$9B on paper vs a $330M check
scene(S(62), { bg: 'grid' }, sc => {
  words('NOW DO THE MATH.', 150, 100, 90, S(62), { step: .08 });
  txt('stake diluted to', 160, 300, 44, { f: 'si', in: 'fade', t: Wt(63, 'diluted') });
  txt('~28%', 160, 360, 170, { f: 'd', in: 'pop', t: Wt(63, '28'), css: { fontWeight: 800 } });
  txt('×', 650, 400, 140, { f: 'd', col: RED, in: 'pop', t: Wt(64, 'valuation') - .3 });
  txt('$31.5B', 790, 360, 170, { f: 'd', in: 'pop', t: Wt(64, 'valuation') - .1, css: { fontWeight: 800 } });
  line(150, 590, 1420, 590, Wt(64, 'worth') - .3, .5, { sw: 8 });
  txt('≈ $9B', 160, 630, 220, { f: 'd', col: TEAL, in: 'pop', t: Wt(64, 'nine'), css: { fontWeight: 800 } });
  txt('on paper', 760, 720, 60, { f: 'si', in: 'fade', t: Wt(64, 'paper') });
  const ch = paper(1240, 700, 560, 260, { col: 'white', in: 'drop', t: S(65), rot: 4 });
  txt('ORIGINAL CHECK', 280, 70, 34, { p: ch, c: true, f: 'm', col: INK });
  txt('$330M', 280, 160, 120, { p: ch, c: true, f: 'd', col: RED, css: { fontWeight: 800 } });
  source('MULTIPLE REPORTS', Wt(63, 'multiple'));
});

/* =================== CHAPTER 3 — THE QUIET EMPIRE =================== */
chapter(66, 3, 'The Quiet|Empire', 'ink');

// [67-69] Supercell (Helsinki): ~84% mostly from SoftBank; $8.6B deal, $10.2B valuation
scene(wAfter(67, S(66) + 2.4), { bg: 'cream' }, sc => {
  const t0 = sc.T0;
  const m = mapView(0, 40, 1100, 1040, [-12, 50, 36, 71], { hi: { fi: '#9FB4E6' } });
  pin(m.PC('helsinki'), 'HELSINKI', t0, { dx: 30, dy: -70, size: 34 });
  txt('shopping in Europe', 160, 110, 50, { f: 'si', in: 'wipe', t: t0, d: .6 });
  dateTag('JUNE 2016', 160, 200, Wt(68, 'june'), { size: 48 });
  card('SUPERCELL', 1240, 140, 560, 160, Wt(68, 'supercell'), { col: 'blue', rot: 2 });
  txt('maker of Clash of Clans', 1270, 330, 40, { f: 'si', in: 'fade', t: Wt(68, 'clash') });
  pie(1400, 590, 170, { in: 'pop', t: Wt(68, '84') - .1, p1: 84, col: RED });
  txt('~84%', 1400, 590, 84, { c: true, f: 'd', col: WHITE, in: 'pop', t: Wt(68, '84') + .5, css: { fontWeight: 800, textShadow: '3px 4px 0 rgba(0,0,0,.25)' } });
  icon('jp', 1640, 470, 150, { in: 'drop', t: Wt(68, 'softbank') - .2, rot: 4 });
  txt('mostly from SoftBank', 1610, 600, 34, { f: 'si', in: 'fade', t: Wt(68, 'softbank'), css: { whiteSpace: 'normal', width: '240px' } });
  tag('DEAL: ~$8.6B', 1180, 820, 54, { col: 'yellow', in: 'drop', t: Wt(69, '8.6'), rot: -2 });
  tag('SUPERCELL VALUED AT ~$10.2B', 1180, 930, 40, { col: 'ink', in: 'up', t: Wt(69, '10.2'), rot: 1 });
});

// [70-72] Familiar promise; gaming > half of revenue
scene(S(70), { bg: 'kraft', tr: 'wipe' }, sc => {
  words('THE PROMISE WAS FAMILIAR', 150, 110, 84, S(70), { step: .1 });
  txt('OPERATIONAL INDEPENDENCE', 230, 320, 64, { f: 'd', in: 'right', t: Wt(71, 'operational') }); check(180, 355, 30, Wt(71, 'independence'));
  txt('STAYS IN FINLAND', 230, 450, 64, { f: 'd', in: 'right', t: Wt(71, 'stay') }); check(180, 485, 30, Wt(71, 'finland'));
  icon('fi', 760, 430, 140, { in: 'drop', t: Wt(71, 'finland'), rot: -4 });
  const bar = paper(150, 680, 1620, 150, { col: 'cream', in: 'grow', t: Wt(72, 'gaming') - .3, sh: 6 });
  mk(`<div style="position:absolute;left:0;top:0;bottom:0;width:58%;background:${RED}"></div>`, 0, 0, { p: bar, w: 1620, h: 150, in: 'grow', t: Wt(72, 'more') });
  txt('GAMING: MORE THAN HALF OF REVENUE', 40, 48, 54, { p: bar, f: 'd', col: WHITE, in: 'fade', t: Wt(72, 'half') });
  line(960, 650, 960, 860, Wt(72, 'half'), .3, { dash: '14 12', sw: 5 });
  txt('50%', 975, 870, 34, { f: 'm', in: 'fade', t: Wt(72, 'half') });
});

// [73-75] The list kept growing: stakes + owned outright
scene(S(73), { bg: 'cream' }, sc => {
  words('THE LIST KEPT GROWING', 150, 90, 80, S(73), { step: .1 });
  kicker('STAKES IN', 160, 230, Wt(74, 'stakes'));
  ['UBISOFT', 'PARADOX', 'REMEDY', 'TECHLAND', 'KRAFTON', 'FROMSOFTWARE'].forEach((n, k) =>
    tag(n, 170 + (k % 3) * 520, 310 + Math.floor(k / 3) * 140, 64, { col: ['white', 'kraft', 'white', 'kraft', 'white', 'kraft'][k], in: 'drop', t: Wt(74, n.toLowerCase().slice(0, 6)), rot: [-2, 1.5, -1, 2, -1.5, 1][k] }));
  kicker('OWNS OUTRIGHT', 160, 640, Wt(75, 'owns'), { bar: RED });
  const f = tag('FUNCOM', 170, 720, 76, { col: 'red', in: 'drop', t: Wt(75, 'funcom'), rot: -2 });
  txt('Dune: Awakening', 200, 860, 40, { f: 'si', in: 'fade', t: Wt(75, 'dune') });
  tag('GRINDING GEAR GAMES', 760, 720, 76, { col: 'red', in: 'drop', t: Wt(75, 'grinding'), rot: 1.5 });
  txt('Path of Exile', 790, 860, 40, { f: 'si', in: 'fade', t: Wt(75, 'path') });
});

// [76-79] November 2025: Ubisoft rescue; €1.16B into a new subsidiary; 26.32%
scene(S(76), { bg: 'cream', tr: 'wipeL' }, sc => {
  dateTag('NOVEMBER 2025', 150, 100, Wt(76, 'november'), { size: 50 });
  note('a rescue?', 160, 190, 56, Wt(76, 'rescue'));
  card('UBISOFT', 150, 300, 480, 160, Wt(77, 'ubisoft'), { col: 'blue', rot: -2 });
  icon('fr', 520, 270, 120, { in: 'drop', t: Wt(77, 'french'), rot: 6 });
  tag('UNDER PRESSURE', 170, 510, 40, { col: 'ink', in: 'right', t: Wt(77, 'pressure') });
  tag('CARRYING DEBT', 170, 590, 40, { col: 'red', in: 'right', t: Wt(77, 'debt') });
  tag('€1.16B', 700, 400, 90, { col: 'yellow', in: 'stamp', t: Wt(78, '1.16'), rot: -3 });
  arrow(780, 560, 980, 640, Wt(78, 'subsidiary') - .4, { col: RED, sw: 7 });
  const sub = paper(1000, 300, 760, 560, { col: 'white', in: 'drop', t: Wt(78, 'new'), rot: 1.5, tape: 'c' });
  txt('NEW UBISOFT SUBSIDIARY', 380, 70, 46, { p: sub, c: true, f: 'd', col: INK });
  [['ASSASSIN’S CREED', 'assassin'], ['FAR CRY', 'far'], ['RAINBOW SIX', 'rainbow']].forEach(([n, w], k) =>
    tag(n, 60, 140 + k * 100, 44, { p: sub, col: ['red', 'teal', 'navy'][k], in: 'right', t: Wt(78, w), dist: 30 }));
  pie(1580, 690, 120, { in: 'pop', t: Wt(79, '26.32') - .1, p1: 26.32, col: RED, z: 5 });
  txt('26.32%', 1060, 880, 90, { f: 'd', col: RED, in: 'pop', t: Wt(79, '26.32'), css: { fontWeight: 800 } });
  txt('ECONOMIC INTEREST', 1068, 990, 32, { f: 'p', in: 'fade', t: Wt(79, 'economic') });
});

// [80-82] Ubisoft kept control; "deleverages the Group" = pays down debt
scene(S(80), { bg: 'kraft' }, sc => {
  tag('UBISOFT KEPT CONTROL', 150, 120, 70, { col: 'teal', in: 'drop', t: S(80), rot: -2 });
  quote('deleverages the Group.', 'YVES GUILLEMOT, UBISOFT CEO', 330, 400, 1300, 120, Wt(81, 'deleverages') - .1, { lines: 1 });
  note('= it helped pay down debt', 360, 760, 80, Wt(82, 'plain'), { col: RED });
  underline(360, 870, 820, Wt(82, 'debt'), { col: INK });
});

// [83-88] Tencent rarely puts its name on the box; built from other people's brands
scene(S(83), { bg: 'cream', tr: 'wipe' }, sc => {
  txt('here’s what makes this unusual', 960, 110, 48, { c: true, f: 'si', in: 'fade', t: S(83) });
  words('TENCENT RARELY PUTS ITS NAME ON THE BOX', 960, 200, 70, Wt(84, 'tencent'), { c: true, step: .08 });
  gamebox('RIOT', 230, 330, 380, { col: 'red', in: 'drop', t: S(85), rot: -3, foot: 'STILL RIOT' });
  gamebox('EPIC', 770, 330, 380, { col: 'ink', in: 'drop', t: S(86), rot: 1, foot: 'STILL EPIC' });
  gamebox('SUPERCELL', 1310, 330, 380, { col: 'blue', in: 'drop', t: S(87), rot: 3, foot: 'STILL SUPERCELL', ts: 56 });
  tag('BUILT FROM OTHER PEOPLE’S BRANDS', 960, 990, 50, { c: true, col: 'yellow', in: 'up', t: Wt(88, 'other'), rot: -1 });
});

// [89-92] WeChat / Weixin: 1.439B users; ¥204.8B quarterly revenue (+11%); ~¥2.25B a day
scene(S(89), { bg: 'cream' }, sc => {
  txt('the machine back home', 160, 110, 50, { f: 'si', in: 'wipe', t: Wt(89, 'machine') - .2, d: .6 });
  icon('phone', 200, 240, 330, { in: 'up', t: Wt(89, 'wechat') - .3 });
  txt('微信', 365, 900, 90, { c: true, f: 'cjk', col: GREEN, in: 'pop', t: Wt(89, 'weixin') });
  tag('WECHAT', 600, 300, 70, { col: 'green', in: 'drop', t: Wt(89, 'wechat'), rot: -2 });
  txt('called Weixin in China', 610, 420, 40, { f: 'si', in: 'fade', t: Wt(89, 'weixin') });
  kicker('Q2 2026', 620, 540, Wt(90, 'second'));
  num(620, 600, 120, { from: 0, to: 1.439, t: Wt(90, '1.439') - .1, d: 1, fmt: v => v.toFixed(3), suf: 'B', f: 'd', css: { fontWeight: 800 } });
  txt('MONTHLY USERS', 630, 740, 36, { f: 'p', in: 'fade', t: Wt(90, 'monthly') });
  num(1180, 600, 120, { from: 0, to: 204.8, t: Wt(91, '204.8') - .1, d: 1, fmt: v => v.toFixed(1), pre: '¥', suf: 'B', f: 'd', css: { fontWeight: 800 } });
  txt('QUARTERLY REVENUE', 1190, 740, 36, { f: 'p', in: 'fade', t: Wt(91, 'revenue') });
  tag('+11% YEAR ON YEAR', 1190, 800, 40, { col: 'teal', in: 'pop', t: Wt(91, '11') });
  tag('≈ ¥2.25 BILLION EVERY DAY', 620, 930, 58, { col: 'yellow', in: 'drop', t: Wt(92, '2.25'), rot: -1.5 });
});

// [93-94] The rise: copycat chat app -> cash machine -> a piece of global gaming
scene(S(93), { bg: 'kraft', tr: 'wipeU' }, sc => {
  words('SO THAT’S THE RISE.', 960, 160, 90, S(93), { c: true, step: .1 });
  card('COPYCAT CHAT APP', 120, 420, 500, 220, Wt(94, 'copycat'), { col: 'white', size: 64, rot: -2 });
  arrow(650, 530, 760, 530, Wt(94, 'becomes'), { col: RED, sw: 8, bend: -.2 });
  card('CASH MACHINE', 790, 420, 420, 220, Wt(94, 'cash'), { col: 'teal', size: 70, rot: 1.5 });
  arrow(1240, 530, 1350, 530, Wt(94, 'buys'), { col: RED, sw: 8, bend: -.2 });
  card('A PIECE OF GLOBAL GAMING', 1380, 400, 440, 260, Wt(94, 'global'), { col: 'red', size: 62, rot: 2 });
  icon('globe', 1520, 720, 160, { in: 'pop', t: Wt(94, 'gaming') });
});

// [95-98] But there was a problem. Two: Beijing and Washington
scene(S(95), { bg: 'cream' }, sc => {
  words('BUT THERE WAS A PROBLEM.', 960, 140, 80, S(95), { c: true, step: .08 });
  txt('two of them, actually', 960, 250, 50, { c: true, f: 'si', in: 'fade', t: S(96) });
  const L = paper(60, 330, 880, 690, { col: 'red', in: 'drop', t: S(97) - .1, rot: -1.5 });
  icon('gate', 280, 120, 320, { p: L, sha: .3 });
  txt('BEIJING', 440, 520, 120, { p: L, c: true, f: 'd', col: WHITE, css: { fontWeight: 800 } });
  const Rr = paper(980, 330, 880, 690, { col: 'blue', in: 'drop', t: S(98) - .1, rot: 1.5 });
  icon('capitol', 300, 120, 290, { p: Rr, sha: .3 });
  txt('WASHINGTON', 440, 520, 120, { p: Rr, c: true, f: 'd', col: WHITE, css: { fontWeight: 800 } });
});

/* ---------- more local builders ---------- */
function clock(cx, cy, r, h0, h1, t, o) {  // paper clock face with the h0..h1 sector highlighted
  o = o || {}; const a = h => (h % 12) / 12 * 360, P = (d, rr) => [Math.sin(d * Math.PI / 180) * rr, -Math.cos(d * Math.PI / 180) * rr];
  const s = P(a(h0), r * .9), e = P(a(h1), r * .9);
  const ticks = [...Array(12)].map((_, k) => { const p1 = P(k * 30, r * .82), p2 = P(k * 30, r * .94); return `<line x1="${p1[0]}" y1="${p1[1]}" x2="${p2[0]}" y2="${p2[1]}" stroke="${INK}" stroke-width="6"/>`; }).join('');
  const n = svgEl(`<circle cx="7" cy="9" r="${r}" fill="rgba(20,15,5,.22)"/><circle r="${r}" fill="${WHITE}" stroke="${INK}" stroke-width="10"/>
    <path d="M0 0 L${s[0]} ${s[1]} A${r * .9} ${r * .9} 0 0 1 ${e[0]} ${e[1]} Z" fill="${YEL}" class="sector"/>${ticks}
    <line x1="0" y1="0" x2="${P(a(h0) + 30 * .0, r * .5)[0]}" y2="${P(a(h0), r * .5)[1]}" stroke="${INK}" stroke-width="12" stroke-linecap="round"/>
    <line x1="0" y1="0" x2="0" y2="${-r * .72}" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><circle r="10" fill="${RED}"/>`,
    cx - r, cy - r, r * 2, r * 2, Object.assign({ vb: `${-r} ${-r} ${r * 2} ${r * 2}`, in: 'pop', t }, o));
  return n;
}
function calendar(x, y, t, hiAt, o) {  // week strip; hiAt = [time for Fri, Sat, Sun]
  o = o || {}; const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'], w = 150;
  const p = paper(x, y, w * 7 + 40, 220, Object.assign({ col: 'white', in: 'drop', t }, o));
  days.forEach((d, k) => {
    const hi = k >= 4, cell = mk(`<div style="width:${w - 14}px;height:150px;border:4px solid ${INK};box-sizing:border-box;background:${hi ? YEL : 'transparent'}"></div>`, 20 + k * w, 46, { p, in: hi ? 'pop' : null, t: hi ? hiAt[k - 4] : 0 });
    txt(d, 20 + k * w + (w - 14) / 2, 120, 40, { p, c: true, f: 'd', col: INK });
  });
  return p;
}
function statusRow(label, value, x, y, t, col, o) {
  o = o || {}; txt(label, x, y, o.ls || 44, { f: 'p', in: 'right', t, dist: 30 });
  return tag(value, x + (o.vx || 760), y - 14, o.vs || 54, { col, in: 'stamp', t: t + .25, rot: o.rot === undefined ? -2 : o.rot });
}

/* =================== CHAPTER 4 — BEIJING BITES =================== */
chapter(99, 4, 'Beijing|Bites', 'red');

// [100-102] Aug 3 2021: Xinhua-affiliated paper calls games "spiritual opium"; Honor of Kings; 8 hours a day
scene(wAfter(100, S(99) + 2.4), { bg: 'kraft' }, sc => {
  const t0 = sc.T0;
  const np = paper(140, 120, 1020, 860, { col: 'white', in: 'drop', t: t0, rot: -1.5, torn: 'b' });
  txt('AUGUST 3, 2021', 60, 50, 34, { p: np, f: 'm', col: INK });
  mk(`<div style="width:900px;height:6px;background:${INK}"></div>`, 60, 100, { p: np });
  const hd = txt('Online games are <mk>“spiritual opium”</mk>', 60, 140, 84, { p: np, f: 'sb', col: INK, lh: 1.08, css: { whiteSpace: 'normal', width: '900px' }, in: 'wipe', t: Wt(101, 'called'), d: .7 });
  hd.hl(Wt(101, 'spiritual'), .6);
  txt('精神鸦片', 60, 360, 110, { p: np, f: 'cjk', col: RED, in: 'fade', t: Wt(101, 'opium') });
  mk([...Array(9)].map((_, k) => `<div style="position:absolute;left:0;top:${k * 34}px;width:${k % 4 === 3 ? 520 : 900}px;height:10px;background:${INK};opacity:.18"></div>`).join(''), 60, 520, { p: np, w: 900, h: 320 });
  tag('AFFILIATED WITH XINHUA, CHINA’S STATE NEWS AGENCY', 180, 1000, 32, { col: 'ink', in: 'up', t: Wt(100, 'xinhua'), rot: 1 });
  gamebox('HONOR OF KINGS', 1310, 180, 380, { col: 'red', in: 'drop', t: Wt(102, 'honor'), rot: 4, sub: 'TENCENT · MOBILE' });
  stamp('8 HOURS A DAY', 1500, 820, 76, Wt(102, 'eight'), { rot: -7 });
});

// [103-106] "opium" carries history; stock -11%; phrase removed; closed -6.1%
scene(S(103), { bg: 'grid', tr: 'wipe' }, sc => {
  txt('In China, the word “opium” carries heavy history.', 150, 100, 52, { f: 'si', in: 'wipe', t: S(103), d: .9 });
  kicker('TENCENT SHARES, AUG 3, 2021', 160, 220, S(104) - .3);
  chart(160, 300, 1000, 560, [[0, .9], [.12, .86], [.22, .5], [.3, .18], [.45, .3], [.6, .26], [.75, .38], [.9, .4], [1, .42]], S(104), 1.6, { col: RED, sw: 10, fill: RED, fo: .15 });
  tag('−11% AT WORST', 1190, 720, 64, { col: 'red', in: 'drop', t: Wt(104, '11'), rot: -2 });
  const ph = txt('<sk>“spiritual opium”</sk>', 1190, 330, 70, { f: 'si', in: 'pop', t: Wt(105, 'article') });
  ph.strike(Wt(105, 'removed'), .4);
  txt('later that day, the phrase was removed', 1200, 440, 40, { f: 'si', in: 'fade', t: Wt(105, 'removed') });
  tag('CLOSED −6.1%', 1190, 860, 64, { col: 'ink', in: 'stamp', t: Wt(106, '6.1'), rot: 2 });
});

// [107-109] Within hours: Tencent's own limits; under-12 purchase ban; not enough
scene(S(107), { bg: 'cream' }, sc => {
  tag('WITHIN HOURS', 150, 110, 60, { col: 'yellow', f: 'm', in: 'drop', t: S(107), rot: -2 });
  const d = docu(200, 250, 1000, 700, { head: 'TENCENT: NEW LIMITS', sub: 'FOR MINORS', in: 'up', t: S(107) + .2, rot: -1, top: 420 });
  txt('• LESS PLAYTIME FOR MINORS', 56, 200, 50, { p: d, f: 'd', col: INK, in: 'right', t: Wt(107, 'limits'), dist: 30 });
  txt('• NO IN-GAME PURCHASES UNDER 12', 56, 290, 50, { p: d, f: 'd', col: INK, in: 'right', t: Wt(108, 'banned'), dist: 30 });
  stamp('NOT ENOUGH', 1400, 600, 120, S(109) + .1, { rot: -9 });
});

// [110-112] End of August: regulators' rules for under-18s: 8-9 p.m., Fri/Sat/Sun + holidays; 3 hours a week
scene(S(110), { bg: 'kraft', tr: 'wipeL' }, sc => {
  dateTag('END OF AUGUST 2021', 150, 100, S(110), { size: 46 });
  txt('REGULATORS SET NEW RULES', 160, 200, 64, { f: 'd', in: 'right', t: Wt(110, 'regulators') });
  tag('UNDER 18', 170, 330, 80, { col: 'red', in: 'stamp', t: Wt(111, '18'), rot: -3 });
  clock(430, 640, 200, 8, 9, Wt(111, '8') - .2);
  txt('8–9 P.M. ONLY', 300, 880, 56, { f: 'd', in: 'up', t: Wt(111, '9') });
  calendar(760, 330, Wt(111, 'only', 1) - .2, [Wt(111, 'fridays'), Wt(111, 'weekends'), Wt(111, 'weekends') + .12]);
  tag('+ PUBLIC HOLIDAYS', 780, 580, 40, { col: 'ink', in: 'right', t: Wt(111, 'holidays') });
  bigNum('= 3 HOURS A WEEK', 1290, 790, 110, Wt(112, 'three'), { col: RED });
  txt('for most weeks of the year', 1290, 890, 40, { c: true, f: 'si', in: 'fade', t: S(112) });
});

// [113-116] The part Western audiences miss: enormous, but doesn't make the rules at home; money flows west
scene(S(113), { bg: 'cream' }, sc => {
  txt('the part Western audiences tend to miss', 960, 110, 50, { c: true, f: 'si', in: 'fade', t: S(113) });
  bigNum('TENCENT IS ENORMOUS', 960, 250, 120, S(114), { col: INK });
  const g = paper(120, 380, 760, 560, { col: 'red', in: 'drop', t: S(115), rot: -2 });
  icon('gate', 230, 60, 300, { p: g, sha: .3 });
  txt('AT HOME, IT DOESN’T MAKE THE RULES', 380, 440, 52, { p: g, c: true, f: 'd', col: WHITE, al: 'center', css: { whiteSpace: 'normal', width: '640px' } });
  icon('cash', 1450, 520, 220, { in: 'pop', t: Wt(116, 'money') }).to(Wt(116, 'west') - .2, 1, { x: -380 });
  arrow(1700, 800, 1000, 800, Wt(116, 'flowing') - .2, { col: TEAL, sw: 10, bend: .12, head: 34, d: .7 });
  txt('MONEY FLOWS WEST', 1100, 860, 60, { f: 'd', col: TEAL, in: 'fade', t: Wt(116, 'west') });
});

// [117-118] TechCrunch 2019: regulatory risk at home -> stakes abroad; the West less comfortable
scene(S(117), { bg: 'grid', tr: 'wipe' }, sc => {
  kicker('TECHCRUNCH, 2019', 150, 120, S(117));
  card('REGULATORY RISK AT HOME', 150, 260, 620, 230, Wt(117, 'regulatory'), { col: 'red', size: 70, rot: -2 });
  arrow(800, 380, 1060, 380, Wt(117, 'reason') - .2, { col: INK, sw: 9, bend: -.15 });
  card('STAKES IN STUDIOS OVERSEAS', 1090, 260, 660, 230, Wt(117, 'stakes'), { col: 'teal', size: 70, rot: 1.5 });
  const w = paper(560, 620, 800, 330, { col: 'navy', in: 'drop', t: S(118), rot: -1 });
  icon('capitol', 40, 60, 230, { p: w, sha: .3 });
  txt('BUT THE WEST WAS GETTING LESS COMFORTABLE', 290, 70, 54, { p: w, f: 'd', col: WHITE, css: { whiteSpace: 'normal', width: '470px' }, lh: 1.05 });
  source('TECHCRUNCH', S(117) + .3);
});

/* =================== CHAPTER 5 — WASHINGTON WAKES UP =================== */
chapter(119, 5, 'Washington|Wakes Up', 'navy');

// [120-122] Aug 2020 executive orders: WeChat (and TikTok); "national security"
scene(wAfter(120, S(119) + 2.3), { bg: 'cream' }, sc => {
  const t0 = sc.T0;
  dateTag('AUGUST 2020', 150, 110, t0, { size: 52 });
  txt('the first shot', 160, 220, 46, { f: 'si', in: 'fade', t: t0 });
  const d = docu(220, 300, 820, 700, { head: 'EXECUTIVE ORDER', sub: 'SIGNED BY PRESIDENT TRUMP', in: 'up', t: Wt(121, 'signed'), rot: -1.5, top: 200 });
  tag('TARGET: WECHAT', 1150, 330, 70, { col: 'green', in: 'drop', t: Wt(121, 'wechat'), rot: -2 });
  tag('+ A SIMILAR ORDER: TIKTOK', 1150, 470, 46, { col: 'ink', in: 'right', t: Wt(121, 'tiktok') });
  txt('apps developed and owned by Chinese companies…', 1150, 610, 40, { f: 'si', in: 'wipe', t: Wt(122, 'apps'), d: .8, css: { whiteSpace: 'normal', width: '640px' }, lh: 1.2 });
  stamp('NATIONAL SECURITY', 1450, 840, 76, Wt(122, 'national'), { rot: -6 });
});

// [123-126] WeChat users sued; Sept 2020 judge Laurel Beeler blocked the ban: "the specific evidence about WeChat is modest"
scene(S(123), { bg: 'navy', tr: 'wipe' }, sc => {
  tag('WECHAT USERS IN THE U.S. SUED', 150, 110, 56, { col: 'white', in: 'drop', t: S(123), rot: -1.5 });
  icon('gavel', 1450, 120, 300, { in: 'drop', t: Wt(124, 'judge') });
  dateTag('SEPTEMBER 2020', 150, 250, Wt(124, 'september'), { size: 44 });
  tag('FEDERAL MAGISTRATE JUDGE LAUREL BEELER', 150, 360, 40, { col: 'ink', in: 'right', t: Wt(124, 'laurel') });
  stamp('BAN BLOCKED', 1550, 520, 80, Wt(124, 'blocked'), { col: YEL, rot: -8 });
  txt('“…the specific evidence about WeChat is <mk>modest</mk>.”', 150, 560, 76, { f: 'si', in: 'wipe', t: Wt(125, 'specific') - .1, d: 1, lh: 1.2, css: { whiteSpace: 'normal', width: '1200px' } }).hl(Wt(125, 'modest'), .4);
  tag('THE BAN NEVER TOOK EFFECT', 150, 880, 56, { col: 'yellow', in: 'up', t: S(126), rot: 1 });
});

// [127-129] June 2021 Biden revoked orders -> new review; round one to Tencent; round two hit gaming
scene(S(127), { bg: 'cream' }, sc => {
  dateTag('JUNE 2021', 150, 110, Wt(127, 'june'), { size: 52 });
  const d = txt('<sk>EXECUTIVE ORDERS</sk>', 150, 260, 110, { f: 'd', in: 'pop', t: Wt(127, 'biden'), css: { fontWeight: 800 } });
  d.strike(Wt(127, 'revoked'), .4);
  txt('revoked by President Biden → replaced with a new review process', 160, 400, 44, { f: 'si', in: 'wipe', t: Wt(127, 'replaced'), d: .8 });
  const b = paper(150, 540, 760, 400, { col: 'ink', in: 'drop', t: S(128), rot: -2 });
  txt('ROUND 1', 380, 120, 70, { p: b, c: true, f: 'm', col: YEL });
  txt('TENCENT', 380, 250, 130, { p: b, c: true, f: 'd', col: WHITE, css: { fontWeight: 800 } });
  const c = paper(1010, 540, 760, 400, { col: 'white', in: 'drop', t: S(129), rot: 1.5 });
  txt('ROUND 2', 380, 120, 70, { p: c, c: true, f: 'm', col: RED });
  txt('quieter, and aimed at gaming', 380, 250, 54, { p: c, c: true, f: 'si', col: INK });
});

// [130-131] Dec 18 2024 DOJ: two Tencent-nominated directors left Epic's board; Clayton Act 1914
scene(S(130), { bg: 'kraft', tr: 'wipeU' }, sc => {
  dateTag('DECEMBER 18, 2024', 150, 100, Wt(130, 'december'), { size: 46 });
  tag('JUSTICE DEPARTMENT', 150, 200, 50, { col: 'navy', in: 'right', t: Wt(130, 'justice') });
  const tb = paper(560, 430, 900, 260, { col: 'white', in: 'drop', t: Wt(130, 'board') - .6, rot: 0, sh: 12 });
  txt('EPIC GAMES BOARD', 450, 130, 50, { p: tb, c: true, f: 'd', col: INK });
  [0, 1, 2, 3, 4, 5].forEach(k => {
    const red = k === 1 || k === 4, ch = mk(`<div style="width:100px;height:120px;border-radius:18px 18px 8px 8px;background:${red ? RED : GREY};box-shadow:5px 6px 0 rgba(20,15,5,.2)"></div>`, 610 + k * 140, 320, { in: 'pop', t: Wt(130, 'board') - .5 + k * .05 });
    if (red) { ch.to(Wt(130, 'left'), .9, { y: -170, x: k === 1 ? -120 : 120, r: k === 1 ? -14 : 14 }); ch.out(Wt(130, 'left') + .7, .3); }
  });
  txt('2 TENCENT-NOMINATED DIRECTORS LEFT', 560, 730, 36, { f: 'p', in: 'fade', t: Wt(130, 'tencentnominated') });
  const ca = paper(1380, 780, 500, 250, { col: 'cream', in: 'drop', t: Wt(131, 'clayton'), rot: 3, tape: 'c' });
  txt('CLAYTON ACT · 1914', 260, 70, 44, { p: ca, c: true, f: 'm', col: INK });
  txt('no shared directors at competing companies', 260, 160, 32, { p: ca, c: true, f: 'si', col: INK, al: 'center', css: { whiteSpace: 'normal', width: '440px' } });
});

// [132-135] The reasoning: Tencent owns Riot; Riot competes with Epic; so no Tencent people in Epic's boardroom
scene(S(132), { bg: 'cream' }, sc => {
  txt('the department’s reasoning was simple', 960, 110, 50, { c: true, f: 'si', in: 'fade', t: S(132) });
  card('TENCENT', 110, 380, 440, 200, S(133), { col: 'ink', size: 90, rot: -2 });
  arrow(580, 480, 730, 480, Wt(133, 'owns'), { col: INK, sw: 9, bend: -.2 });
  txt('OWNS', 655, 400, 36, { c: true, f: 'p', in: 'fade', t: Wt(133, 'owns') });
  card('RIOT', 760, 380, 340, 200, Wt(133, 'riot'), { col: 'red', size: 100, rot: 1 });
  arrow(1130, 480, 1300, 480, Wt(134, 'competes'), { col: RED, sw: 9, bend: -.2 });
  txt('COMPETES', 1215, 400, 36, { c: true, f: 'p', in: 'fade', t: Wt(134, 'competes') });
  card('EPIC', 1330, 380, 400, 200, Wt(134, 'epic'), { col: 'white', size: 100, rot: -1.5 });
  txt('so Tencent’s people shouldn’t sit in Epic’s boardroom', 900, 780, 58, { c: true, f: 'si', in: 'wipe', t: S(135), d: .8 });
  mk(`<div style="width:100px;height:120px;border-radius:18px 18px 8px 8px;background:${RED};box-shadow:5px 6px 0 rgba(20,15,5,.2)"></div>`, 1620, 720, { in: 'pop', t: Wt(135, 'sit') });
  cross(1670, 780, 70, Wt(135, 'boardroom'));
});

// [136-139] Resigned voluntarily; gave up appointment right; no court fight; Tencent stepped back
scene(S(136), { bg: 'kraft', tr: 'wipe' }, sc => {
  const pad = paper(200, 110, 1100, 860, { col: 'white', in: 'drop', t: S(136), rot: -1 });
  txt('WHAT HAPPENED', 70, 60, 70, { p: pad, f: 'd', col: INK, css: { fontWeight: 800 } });
  [[Wt(136, 'resigned'), 'Directors resigned “voluntarily”'], [S(137), 'Gave up its own right to appoint Epic directors'], [S(138), 'No court fight']].forEach(([t, s], k) => {
    txt(s, 140, 230 + k * 170, 54, { p: pad, f: 'si', col: INK, in: 'right', t, dist: 30, css: { whiteSpace: 'normal', width: '880px' } });
    check(270, 380 + k * 170, 28, t + .3);
  });
  tag('TENCENT STEPPED BACK', 1080, 860, 66, { col: 'red', in: 'drop', t: Wt(139, 'stepped'), rot: 3 });
});

// [140-142] Jan 2025: Pentagon adds Tencent to the Section 1260H list ("Chinese military companies")
scene(S(140), { bg: 'navy' }, sc => {
  words('THEN CAME THE BIGGER BLOW', 150, 100, 80, S(140), { step: .1 });
  icon('pentagon', 150, 290, 360, { in: 'pop', t: Wt(141, 'pentagon') });
  dateTag('JANUARY 2025', 150, 680, Wt(141, 'january'), { size: 46 });
  const d = paper(640, 250, 1120, 760, { col: 'white', in: 'drop', t: Wt(141, 'section') - .3, rot: 1 });
  txt('SECTION 1260H LIST', 60, 50, 64, { p: d, f: 'd', col: INK, css: { fontWeight: 800 } });
  txt('“Chinese military companies” operating in the U.S.', 60, 140, 36, { p: d, f: 'si', col: INK, in: 'fade', t: Wt(142, 'chinese') });
  mk([...Array(8)].map((_, k) => `<div style="position:absolute;left:0;top:${k * 46}px;width:${560 + (k * 137 % 300)}px;height:12px;background:${INK};opacity:.2"></div>`).join(''), 60, 230, { p: d, w: 1000, h: 400 });
  const tl = txt('<mk>TENCENT</mk>', 60, 600, 60, { p: d, f: 'm', col: INK, in: 'right', t: Wt(141, 'added'), dist: 30 });
  tl.hl(Wt(141, 'added') + .3, .5);
  tag('REQUIRED BY A 2021 DEFENSE LAW', 700, 960, 38, { col: 'yellow', in: 'up', t: Wt(142, 'required'), rot: -1 });
});

// [143-144] Tencent: "clearly a mistake… not a military company or supplier."
scene(S(143), { bg: 'cream', tr: 'wipeL' }, sc => {
  kicker('TENCENT’S RESPONSE', 300, 180, S(143));
  quote('Tencent’s inclusion on this list is clearly a mistake. We are not a military company or supplier.', 'TENCENT STATEMENT', 300, 330, 1340, 86, Wt(143, 'tencent', 1) - .1, { lines: 3, d: 1.4, ad: 5.5 });
});

// [145-146] Reuters: HK shares -7.3% next day, ~$35.4B wiped out
scene(S(145), { bg: 'grid' }, sc => {
  txt('investors weren’t so sure', 150, 100, 52, { f: 'si', in: 'wipe', t: S(145), d: .6 });
  chart(160, 260, 1000, 560, [[0, .8], [.4, .78], [.5, .75], [.62, .3], [.8, .26], [1, .24]], Wt(146, 'shares') - .3, 1.4, { col: RED, sw: 10, fill: RED, fo: .15 });
  txt('HONG KONG SHARES, NEXT DAY', 170, 850, 34, { f: 'p', in: 'fade', t: Wt(146, 'hong') });
  bigNum('−7.3%', 1480, 380, 200, Wt(146, '7.3'), { col: RED });
  num(1250, 560, 110, { from: 0, to: 35.4, t: Wt(146, '35.4') - .2, d: 1, fmt: v => v.toFixed(1), pre: '−$', suf: 'B', f: 'd', css: { fontWeight: 800 } });
  txt('MARKET VALUE WIPED OUT', 1260, 690, 34, { f: 'p', in: 'fade', t: Wt(146, 'market') });
  source('REUTERS', Wt(146, 'reuters'));
});

// [147-150] What the label does and doesn't do; procurement ban from end of June 2026
scene(S(147), { bg: 'cream', tr: 'wipe' }, sc => {
  words('SO WHAT DOES THE LABEL ACTUALLY DO?', 150, 90, 74, S(147), { step: .07 });
  txt('less than it sounds, at least at first', 160, 200, 44, { f: 'si', in: 'fade', t: S(148) });
  const L = paper(140, 300, 780, 640, { col: 'white', in: 'drop', t: S(149) - .1, rot: -1.5 });
  txt('IT IS NOT', 60, 50, 60, { p: L, f: 'd', col: RED, css: { fontWeight: 800 } });
  txt('a sanctions list', 120, 190, 50, { p: L, f: 'si', col: INK, in: 'right', t: Wt(149, 'sanctions'), dist: 30 }); cross(225, 518, 26, Wt(149, 'list') + .1);
  txt('a ban on doing business in America', 120, 330, 50, { p: L, f: 'si', col: INK, in: 'right', t: Wt(149, 'ban'), dist: 30, css: { whiteSpace: 'normal', width: '600px' } }); cross(225, 658, 26, Wt(149, 'america'));
  const Rr = paper(1000, 300, 780, 640, { col: 'white', in: 'drop', t: S(150) - .1, rot: 1.5 });
  txt('IT DOES', 60, 50, 60, { p: Rr, f: 'd', col: TEAL, css: { fontWeight: 800 } });
  txt('stop the Pentagon working with listed companies', 120, 190, 50, { p: Rr, f: 'si', col: INK, in: 'right', t: Wt(150, 'work'), dist: 30, css: { whiteSpace: 'normal', width: '600px' } }); check(1085, 518, 26, Wt(150, 'companies'));
  txt('ban Pentagon purchases from them', 120, 380, 50, { p: Rr, f: 'si', col: INK, in: 'right', t: Wt(150, 'buying'), dist: 30, css: { whiteSpace: 'normal', width: '600px' } }); check(1085, 708, 26, Wt(150, 'goods'));
  dateTag('FROM END OF JUNE 2026', 1100, 860, Wt(150, 'june'), { size: 40 });
});

// [151-155] Tencent wanted off; June 2026 list (188 entities) still includes it; "indirectly affiliated"; evidence not public
scene(S(151), { bg: 'navy' }, sc => {
  tag('TENCENT WANTED OFF', 150, 100, 66, { col: 'white', in: 'drop', t: S(151), rot: -2 });
  dateTag('JUNE 2026 · UPDATED LIST', 150, 230, Wt(152, 'june'), { size: 42 });
  const d = paper(150, 340, 900, 660, { col: 'white', in: 'drop', t: Wt(152, 'updated'), rot: -1 });
  num(60, 40, 120, { p: d, from: 0, to: 188, t: Wt(152, '188') - .2, d: .9, f: 'd', col: INK, suf: ' ENTITIES', css: { fontWeight: 800 } });
  mk([...Array(9)].map((_, k) => `<div style="position:absolute;left:0;top:${k * 44}px;width:${420 + (k * 173 % 340)}px;height:12px;background:${INK};opacity:.2"></div>`).join(''), 60, 210, { p: d, w: 800, h: 400 });
  txt('<mk>TENCENT</mk> — still listed', 60, 560, 54, { p: d, f: 'm', col: INK, in: 'right', t: S(153), dist: 30 }).hl(S(153) + .3, .5);
  txt('“indirectly affiliated” with the People’s Liberation Army', 1150, 380, 54, { f: 'si', in: 'wipe', t: Wt(154, 'indirectly') - .1, d: 1, lh: 1.2, css: { whiteSpace: 'normal', width: '650px' } });
  source('PENTAGON 1260H LIST, JUNE 2026', Wt(154, 'document'));
  stamp('EVIDENCE NOT PUBLIC', 1470, 720, 60, Wt(155, 'evidence'), { col: YEL, rot: -7 });
  tag('TENCENT SEEKING REMOVAL', 1180, 880, 44, { col: 'red', in: 'up', t: Wt(155, 'seeking') });
});

/* =================== CHAPTER 6 — THE DIVESTMENT QUESTION =================== */
chapter(156, 6, 'The Divestment|Question', 'yellow', INK);

// [157-158] March 2026, FT: White House meetings on whether Tencent should keep Epic, Riot, Supercell
scene(wAfter(157, S(156) + 2.3), { bg: 'cream' }, sc => {
  const t0 = sc.T0;
  dateTag('MARCH 2026', 150, 110, t0, { size: 52 });
  txt('senior White House officials met on a striking question:', 160, 230, 46, { f: 'si', in: 'wipe', t: Wt(158, 'senior'), d: .8 });
  words('SHOULD TENCENT KEEP ITS STAKES IN', 160, 330, 80, Wt(158, 'should'), { step: .07 });
  [['EPIC', 'epic', 'ink'], ['RIOT', 'riot', 'red'], ['SUPERCELL', 'supercell', 'blue']].forEach(([n, w, c], k) => card(n, 170 + k * 520, 520, 460, 220, Wt(158, w), { col: c, size: 90, rot: [-2, 1, 2.5][k] }));
  bigNum('?', 1720, 880, 260, Wt(158, 'all') , { col: RED });
  source('FINANCIAL TIMES', Wt(158, 'financial'));
});

// [159-163] The concern is data; what is known vs. what is asked
scene(S(159), { bg: 'cream', tr: 'wipe' }, sc => {
  tag('THE CONCERN: DATA', 150, 100, 70, { col: 'ink', in: 'drop', t: S(159), rot: -2 });
  icon('db', 180, 260, 200, { in: 'pop', t: Wt(159, 'data') });
  [...Array(12)].forEach((_, k) => person(470 + (k % 6) * 105, 250 + Math.floor(k / 6) * 130, 90, { in: 'pop', t: Wt(160, 'millions') + k * .04, k: k % 5 === 2 ? 'personB' : 'person', boil: 0 }));
  txt('millions of American players', 470, 540, 40, { f: 'si', in: 'fade', t: Wt(160, 'american') });
  txt('let’s be precise', 1250, 140, 50, { f: 'si', in: 'fade', t: S(161), col: RED });
  const k1 = paper(140, 640, 780, 330, { col: 'white', in: 'drop', t: S(162), rot: -1.5 });
  txt('KNOWN', 50, 40, 46, { p: k1, f: 'd', col: TEAL, css: { fontWeight: 800 } });
  txt('No reported finding that Tencent accessed American player data', 50, 120, 44, { p: k1, f: 'si', col: INK, css: { whiteSpace: 'normal', width: '680px' }, lh: 1.2 });
  const k2 = paper(1000, 640, 780, 330, { col: 'yellow', in: 'drop', t: S(163), rot: 1.5 });
  txt('THE QUESTION', 50, 40, 46, { p: k2, f: 'd', col: RED, css: { fontWeight: 800 } });
  txt('Could it?', 50, 130, 110, { p: k2, f: 'si', col: INK });
});

// [164-166] Technology angle: U.S. Army worked with Epic on Unreal Engine (Tom's Hardware citing the FT)
scene(S(164), { bg: 'grid' }, sc => {
  txt('there’s a technology angle, too', 150, 100, 52, { f: 'si', in: 'wipe', t: S(164), d: .6 });
  card('U.S. ARMY', 150, 330, 560, 230, Wt(165, 'army'), { col: 'green', size: 110, rot: -2 });
  line(740, 445, 1150, 445, Wt(165, 'worked'), .6, { dash: '18 14', sw: 7 });
  txt('worked directly with Epic for years', 760, 360, 36, { f: 'si', in: 'fade', t: Wt(165, 'directly') });
  card('EPIC · UNREAL ENGINE', 1180, 300, 600, 290, Wt(165, 'unreal'), { col: 'ink', size: 80, rot: 2 });
  card('TENCENT STAKE', 1240, 700, 480, 170, Wt(166, 'stake'), { col: 'red', size: 70, rot: -2 });
  arrow(1480, 690, 1480, 600, Wt(166, 'builds'), { col: INK, sw: 8, bend: .1 });
  tag('= MORE SCRUTINY', 700, 760, 60, { col: 'yellow', in: 'stamp', t: Wt(166, 'scrutiny'), rot: -3 });
  source('TOM’S HARDWARE, CITING THE FT', Wt(165, 'citing'));
});

// [167-170] CFIUS review across two administrations: forced sale vs. safeguards; no resolution
scene(S(167), { bg: 'cream', tr: 'wipeU' }, sc => {
  tag('THIS REVIEW ISN’T NEW', 150, 90, 56, { col: 'ink', in: 'drop', t: S(167), rot: -1.5 });
  card('CFIUS', 150, 220, 420, 200, Wt(168, 'cfius'), { col: 'navy', size: 110, rot: -1 });
  txt('Treasury-led committee that screens foreign investment', 610, 260, 44, { f: 'si', in: 'wipe', t: Wt(168, 'treasury'), d: .8, css: { whiteSpace: 'normal', width: '640px' }, lh: 1.2 });
  line(150, 520, 1770, 520, Wt(168, 'dragged') - .2, 1, { sw: 7 });
  txt('ADMINISTRATION 1', 200, 545, 30, { f: 'm', in: 'fade', t: Wt(168, 'two') });
  txt('ADMINISTRATION 2', 1100, 545, 30, { f: 'm', in: 'fade', t: Wt(168, 'two') + .2 });
  const a = paper(150, 620, 780, 340, { col: 'white', in: 'drop', t: Wt(169, 'monaco') - .3, rot: -1.5 });
  txt('LISA MONACO, THEN–DEPUTY AG', 50, 40, 38, { p: a, f: 'p', col: INK });
  txt('FORCED SALE', 50, 130, 110, { p: a, f: 'd', col: RED, css: { fontWeight: 800 } });
  const b = paper(990, 620, 780, 340, { col: 'white', in: 'drop', t: Wt(170, 'treasury') - .2, rot: 1.5 });
  txt('TREASURY DEPARTMENT', 50, 40, 38, { p: b, f: 'p', col: INK });
  txt('STAY, WITH SAFEGUARDS', 50, 120, 76, { p: b, f: 'd', col: TEAL, lh: .98, css: { fontWeight: 800, whiteSpace: 'normal', width: '680px' } });
  stamp('NO RESOLUTION', 1560, 330, 66, Wt(168, 'resolution'), { rot: 7 });
  txt('(both reportedly)', 980, 980, 30, { f: 'si', in: 'fade', t: Wt(170, 'reportedly') });
});

// [171] Tencent declined to comment; shares fell
scene(S(171), { bg: 'kraft' }, sc => {
  card('TENCENT: “DECLINED TO COMMENT”', 260, 300, 1000, 260, Wt(171, 'declined'), { col: 'white', size: 74, rot: -2 });
  arrow(1450, 280, 1600, 700, Wt(171, 'shares'), { col: RED, sw: 14, bend: -.1, head: 44, d: .5 });
  txt('SHARES FELL', 1340, 760, 76, { f: 'd', col: RED, in: 'pop', t: Wt(171, 'fell') });
});

// [172-174] Lobbying: July 2025 John McEntee registers for Tencent's U.S. arm; $175,000 (Jul-Sep 2025)
scene(S(172), { bg: 'cream', tr: 'wipe' }, sc => {
  txt('fighting back the Washington way', 150, 100, 52, { f: 'si', in: 'wipe', t: Wt(172, 'fighting'), d: .7 });
  const d = docu(150, 220, 900, 780, { head: 'LOBBYING REGISTRATION', sub: 'JULY 2025', in: 'up', t: Wt(173, 'july'), rot: -1.5, top: 420 });
  txt('LOBBYIST: JOHN McENTEE', 56, 200, 46, { p: d, f: 'm', col: INK, in: 'right', t: Wt(173, 'mcentee'), dist: 30 });
  txt('CLIENT: TENCENT’S AMERICAN ARM', 56, 280, 46, { p: d, f: 'm', col: INK, in: 'right', t: Wt(173, 'american'), dist: 30 });
  txt('ran presidential personnel in Trump’s first term', 1130, 300, 42, { f: 'si', in: 'fade', t: Wt(173, 'presidential'), css: { whiteSpace: 'normal', width: '640px' }, lh: 1.2 });
  num(1130, 520, 150, { from: 0, to: 175000, t: Wt(174, '175') - .2, d: 1, pre: '$', f: 'd', col: TEAL, css: { fontWeight: 800 } });
  txt('PAID, JULY–SEPTEMBER 2025', 1140, 700, 36, { f: 'p', in: 'fade', t: Wt(174, 'july') });
  source('DISCLOSURE VIA WASHINGTON EXAMINER', Wt(174, 'washington'));
});

// [175-176] McEntee to Bloomberg (Sept 2026): "an unnecessary point of tension"; "update the lists"
scene(S(175), { bg: 'kraft' }, sc => {
  kicker('McENTEE TO BLOOMBERG, SEPTEMBER 2026', 260, 130, S(175));
  quote('an unnecessary point of tension', 'ON THE DESIGNATIONS', 260, 290, 1500, 92, Wt(175, 'unnecessary') - .1, { lines: 1, ah: 140 });
  const q2 = txt('“Trump’s appointees should update the lists to reflect their boss’s thinking.”', 260, 640, 70, { f: 'si', in: 'wipe', t: S(176), d: 1.2, lh: 1.2, css: { whiteSpace: 'normal', width: '1400px' } });
  source('BLOOMBERG', S(175) + .4);
});

// [177-180] Status board, early October 2026
scene(S(177), { bg: 'navy', tr: 'wipeL' }, sc => {
  dateTag('AS OF EARLY OCTOBER 2026', 150, 100, Wt(177, 'early'), { size: 46 });
  const b = paper(150, 230, 1620, 760, { col: 'ink', in: 'drop', t: S(177) + .2, rot: 0, sh: 14 });
  txt('WHERE THINGS STAND', 60, 50, 60, { p: b, f: 'd', col: WHITE, css: { fontWeight: 800 } });
  statusRow('PENTAGON 1260H LIST', 'STILL ON IT', 260, 420, S(178), 'red');
  statusRow('DIVESTMENT REVIEW', 'NO FINAL DECISION', 260, 590, S(179), 'yellow');
  statusRow('TRUMP–XI TALKS, LATE SEPT.', 'LIST A KEY IRRITANT', 260, 760, Wt(180, 'irritants'), 'white');
});

/* =================== CHAPTER 7 — WHAT'S REALLY AT STAKE =================== */
chapter(181, 7, 'What’s Really|at Stake', 'kraft', INK, (sc, y) => {
  tag('ANALYSIS, NOT REPORTING', 150, y + 90, 50, { col: 'red', in: 'stamp', t: Wt(182, 'analysis'), rot: -2 });
});

// [183-186] If a forced sale: Riot is the obvious target; Epic minority; buyer must be big + acceptable -> short list
scene(S(183), { bg: 'cream' }, sc => {
  txt('if Washington ever forced a sale…', 150, 100, 52, { f: 'si', in: 'wipe', t: S(183), d: .7 });
  gamebox('RIOT', 220, 230, 380, { col: 'red', in: 'drop', t: Wt(183, 'riot'), rot: -3, foot: 'OWNED OUTRIGHT' });
  scribble(410, 480, 290, 330, Wt(183, 'obvious'), { col: RED, sw: 9 });
  tag('MOST OBVIOUS TARGET', 170, 900, 46, { col: 'red', in: 'up', t: Wt(183, 'target') });
  gamebox('EPIC', 760, 290, 320, { col: 'ink', in: 'drop', t: Wt(184, 'epic'), rot: 2, foot: 'MINORITY STAKE' });
  tag('NO BOARD SEATS LEFT', 740, 790, 40, { col: 'ink', in: 'up', t: Wt(184, 'board') });
  const l = paper(1240, 200, 560, 760, { col: 'white', in: 'drop', t: Wt(185, 'buyer'), rot: 2, tape: 'c' });
  txt('A BUYER MUST BE', 50, 50, 44, { p: l, f: 'd', col: INK });
  txt('• big enough to afford it', 50, 140, 40, { p: l, f: 'si', col: INK, in: 'right', t: Wt(185, 'afford'), dist: 20 });
  txt('• acceptable to regulators', 50, 220, 40, { p: l, f: 'si', col: INK, in: 'right', t: Wt(185, 'regulators'), dist: 20 });
  mk([...Array(3)].map((_, k) => `<div style="position:absolute;left:0;top:${k * 70}px;width:400px;height:4px;background:${INK};opacity:.35"></div>`).join(''), 60, 420, { p: l, w: 440, h: 220 });
  txt('A SHORT LIST', 280, 680, 60, { p: l, c: true, f: 'd', col: RED, in: 'pop', t: Wt(186, 'short'), css: { fontWeight: 800 } });
});

// [187-190] Cutting the cord cuts both ways: Tencent is a source of money (Ubisoft paid down debt)
scene(S(187), { bg: 'kraft', tr: 'wipe' }, sc => {
  card('TENCENT', 150, 300, 440, 200, S(187), { col: 'ink', size: 90, rot: -2 });
  card('WESTERN STUDIOS', 1330, 300, 440, 200, S(187) + .15, { col: 'white', size: 70, rot: 2 });
  line(600, 400, 1320, 400, S(187) + .2, .6, { sw: 9, col: RED, j: 3 });
  icon('scissors', 860, 300, 200, { in: 'pop', t: Wt(187, 'cutting') });
  txt('cuts both ways', 960, 580, 60, { c: true, f: 'si', in: 'fade', t: Wt(187, 'both') });
  tag('NOT JUST AN OWNER', 300, 720, 54, { col: 'white', in: 'right', t: S(188), rot: -1.5 });
  tag('A SOURCE OF MONEY', 300, 830, 64, { col: 'teal', in: 'right', t: Wt(189, 'source'), rot: 1 });
  icon('cash', 900, 790, 190, { in: 'drop', t: Wt(189, 'money') });
  txt('Ubisoft: Tencent’s cash → paid down debt', 1150, 830, 44, { f: 'si', in: 'wipe', t: S(190), d: .8, css: { whiteSpace: 'normal', width: '660px' } });
});

// [191-195] Flow runs both ways: Valorant record in China; the irony; Chinese money funds Western studios
scene(S(191), { bg: 'cream' }, sc => {
  txt('and the flow runs back the other way, too', 960, 100, 50, { c: true, f: 'si', in: 'fade', t: S(191) });
  const m = mapView(0, 160, 1920, 760, [-130, 150, 5, 65], { hi: { us: '#9FB4E6', cn: '#E9806C' } });
  const us = m.P(-98, 40), cn = m.P(104, 34);
  arc(us, cn, Wt(192, 'valorant') - .2, 1.6, { bend: -.18, col: BLUE, coinCol: WHITE });
  tag('VALORANT: RECORD DAILY PC PLAYERS IN CHINA (Q2 2026)', 560, 200, 34, { col: 'white', in: 'drop', t: Wt(192, 'record'), rot: -1 });
  stamp('THE IRONY', 960, 560, 90, S(193), { rot: -5 });
  txt('an American-made game helps drive a Chinese company’s growth', 140, 900, 40, { f: 'si', in: 'wipe', t: Wt(194, 'american'), d: .8, css: { whiteSpace: 'normal', width: '760px' } });
  arc(cn, m.P(-80, 42), Wt(195, 'fund') - .3, 1.4, { bend: -.12, col: RED });
  arc(cn, m.P(5, 48), Wt(195, 'europe') - .5, 1, { bend: .15, col: RED });
  txt('…and a Chinese company helps fund studios in America and Europe', 1020, 900, 40, { f: 'si', in: 'wipe', t: Wt(195, 'helping'), d: .8, css: { whiteSpace: 'normal', width: '780px' } });
});

/* =================== ENDING — WHY IT MATTERS =================== */
chapter(196, 'END', 'Why It|Matters', 'ink');

// [197-205] How did it end up with a piece of Western gaming? Patience. Cash. A playbook.
scene(wAfter(197, S(196) + 2.4), { bg: 'cream' }, sc => {
  const t0 = sc.T0;
  txt('so how did Tencent end up with a piece of so much of Western gaming?', 150, 90, 46, { f: 'si', in: 'wipe', t: t0, d: .9 });
  [[198, 'PATIENCE.', 'ink'], [199, 'CASH.', 'teal'], [200, 'A PLAYBOOK.', 'red']].forEach(([id, w, c], k) => tag(w, [150, 690, 1060][k], 220, 96, { col: c, in: 'stamp', t: S(id), rot: [-3, 2, -1.5][k] }));
  const rows = [[201, 'early', 'BOUGHT IN EARLY, OFTEN WHEN STUDIOS NEEDED MONEY'], [202, '400', 'MOST OF RIOT: $400M'], [203, '330', 'A HUGE PIECE OF EPIC: $330M'], [204, 'founders', 'FOUNDERS KEPT THEIR NAMES AND CULTURES'], [205, 'never', 'NEVER NEEDED YOU TO KNOW WHO IT WAS']];
  rows.forEach(([id, w, s], k) => { txt(s, 230, 480 + k * 105, 54, { f: 'd', in: 'right', t: Wt(id, w), dist: 40 }); check(180, 510 + k * 105, 22, Wt(id, w) + .2); });
});

// [206-208] Power in the modern economy: the logo on the screen vs. the list of shareholders
scene(S(206), { bg: 'kraft', tr: 'wipe' }, sc => {
  txt('the deeper lesson about power in the modern economy', 960, 100, 50, { c: true, f: 'si', in: 'fade', t: S(206) });
  icon('monitor', 160, 260, 640, { in: 'up', t: Wt(207, 'influential') });
  mk('<div style="width:502px;height:315px;background:#12333A;border-radius:18px"></div>', 229, 319, { in: 'fade', t: Wt(207, 'influential') + .2 });
  txt('LOGO', 480, 476, 130, { c: true, f: 'd', col: YEL, in: 'pop', t: Wt(207, 'logo'), css: { fontWeight: 800 } });
  cross(480, 476, 110, Wt(207, 'isn\'t') + .1, { sw: 14 });
  const d = paper(1030, 230, 720, 760, { col: 'white', in: 'drop', t: S(208) - .2, rot: 2, tape: 'c' });
  txt('LIST OF SHAREHOLDERS', 50, 50, 50, { p: d, f: 'd', col: INK });
  mk([...Array(7)].map((_, k) => `<div style="position:absolute;left:0;top:${k * 62}px;width:${330 + (k * 97 % 220)}px;height:12px;background:${INK};opacity:.2"></div>`).join(''), 60, 170, { p: d, w: 600, h: 440 });
  txt('<mk>TENCENT</mk>', 60, 620, 70, { p: d, f: 'm', col: INK, in: 'right', t: Wt(208, 'shareholders') - .2, dist: 30 }).hl(Wt(208, 'shareholders'), .4);
});

// [209-210] Two decades of connection; now the world is splitting apart
scene(S(209), { bg: 'cream' }, sc => {
  txt('for two decades, the world was getting more connected', 960, 110, 50, { c: true, f: 'si', in: 'fade', t: S(209) });
  const half = (side) => { const n = svgEl(ICON.globe[2], 740, 330, 440, 440, { vb: '0 0 220 220', in: 'pop', t: S(209) + .2 }); n.i.style.clipPath = side === 'L' ? 'inset(-5% 50% -5% -5%)' : 'inset(-5% -5% -5% 50%)'; return n; };
  const L = half('L'), Rr = half('R');
  L.to(Wt(210, 'splitting'), 1, { x: -260, r: -8 }); Rr.to(Wt(210, 'splitting'), 1, { x: 260, r: 8 });
  words('NOW THE WORLD IS SPLITTING APART', 960, 900, 80, Wt(210, 'world'), { c: true, step: .08 });
});

// [211-213] Washington: ownership = security; Beijing: games = social; Tencent in between
scene(S(211), { bg: 'cream', tr: 'wipeU' }, sc => {
  const L = paper(60, 120, 780, 640, { col: 'blue', in: 'drop', t: S(211), rot: -1.5 });
  icon('capitol', 250, 60, 280, { p: L, sha: .3 });
  txt('WASHINGTON', 390, 330, 90, { p: L, c: true, f: 'd', col: WHITE, css: { fontWeight: 800 } });
  txt('ownership = a security question', 390, 450, 48, { p: L, c: true, f: 'si', col: WHITE });
  const Rr = paper(1080, 120, 780, 640, { col: 'red', in: 'drop', t: S(212), rot: 1.5 });
  icon('gate', 230, 60, 320, { p: Rr, sha: .3 });
  txt('BEIJING', 390, 330, 90, { p: Rr, c: true, f: 'd', col: WHITE, css: { fontWeight: 800 } });
  txt('games = a social question', 390, 450, 48, { p: Rr, c: true, f: 'si', col: WHITE });
  card('TENCENT', 740, 600, 440, 200, Wt(213, 'tencent'), { col: 'ink', size: 96, rot: 0 });
  txt('holding stakes in some of the biggest games on Earth', 960, 900, 46, { c: true, f: 'si', in: 'wipe', t: Wt(213, 'holding'), d: .8 });
});

// [214-216] Not players, not markets: two governments; disclaimer
scene(S(214), { bg: 'ink' }, sc => {
  txt('<sk>PLAYERS</sk>', 560, 260, 110, { c: true, f: 'd', in: 'pop', t: Wt(214, 'players') }).strike(Wt(214, 'players') + .4);
  txt('<sk>MARKETS</sk>', 1360, 260, 110, { c: true, f: 'd', in: 'pop', t: Wt(214, 'markets') }).strike(Wt(214, 'markets') + .4);
  txt('it may be decided by', 960, 450, 56, { c: true, f: 'si', in: 'fade', t: S(215) });
  paper(360, 520, 1200, 240, { col: 'yellow', in: 'grow', t: Wt(215, 'two') - .15, rot: -1.5 });
  bigNum('TWO GOVERNMENTS', 960, 640, 140, Wt(215, 'two'), { col: INK });
  txt('This video is for educational purposes only and isn’t investment advice.', 960, 960, 30, { c: true, f: 'm', in: 'fade', t: S(216), col: 'rgba(244,238,221,.85)' });
});
