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
