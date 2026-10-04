'use strict';
/* v3 film · chapter 1, second half (sentences 17-30): early 2001 -> Naspers -> $32M for 46.5% -> 2019 Amsterdam -> 4,000x. */

function drawBills(cx, w, h) {
  for (let k = 0; k < 5; k++) { const y = h * .55 - k * 26, x = w * .12 + k * 8;
    const g = cx.createLinearGradient(x, y, x + w * .7, y + h * .3); g.addColorStop(0, '#9DB59A'); g.addColorStop(1, '#5E7C5C'); cx.fillStyle = g; cx.fillRect(x, y, w * .7, h * .32);
    cx.strokeStyle = 'rgba(30,50,30,.5)'; cx.lineWidth = 3; cx.strokeRect(x + 10, y + 10, w * .7 - 20, h * .32 - 20);
    cx.fillStyle = 'rgba(30,50,30,.45)'; cx.beginPath(); cx.ellipse(x + w * .35, y + h * .16, h * .09, h * .11, 0, 0, 7); cx.fill(); }
  const f = cx.createLinearGradient(0, 0, 0, h * .55); f.addColorStop(0, 'rgba(60,60,60,0)'); f.addColorStop(.35, '#8A8A8A'); f.addColorStop(1, '#1E1E1E');
  cx.fillStyle = f; cx.beginPath(); cx.moveTo(w * .2, h * .5);
  for (let k = 0; k <= 8; k++) { const x = w * (.2 + k * .07); cx.quadraticCurveTo(x - w * .03, h * (.15 + (k % 2) * .12), x, h * (.02 + (k % 3) * .08)); cx.quadraticCurveTo(x + w * .02, h * .3, x + w * .035, h * .5); }
  cx.lineTo(w * .2, h * .5); cx.fill();
}
function drawCanal(cx, w, h) {
  const sky = cx.createLinearGradient(0, 0, 0, h); sky.addColorStop(0, '#D5DEE6'); sky.addColorStop(1, '#F1ECE2'); cx.fillStyle = sky; cx.fillRect(0, 0, w, h);
  const R = rnd(13); let x = 0; const cols = ['#5A3328', '#3B3F35', '#2B2622', '#6E4430', '#4B2E25', '#3E4D5E'];
  while (x < w) { const hw = 120 + R() * 70, hh = h * (.55 + R() * .2), top = h * .82 - hh, c = cols[Math.floor(R() * cols.length)];
    const g = cx.createLinearGradient(x, 0, x + hw, 0); g.addColorStop(0, c); g.addColorStop(1, c); cx.fillStyle = g;
    cx.beginPath(); cx.moveTo(x, h * .82); cx.lineTo(x, top + 60); cx.lineTo(x + hw * .2, top + 60); cx.lineTo(x + hw * .2, top + 28); cx.lineTo(x + hw * .36, top + 28); cx.lineTo(x + hw / 2, top); cx.lineTo(x + hw * .64, top + 28); cx.lineTo(x + hw * .8, top + 28); cx.lineTo(x + hw * .8, top + 60); cx.lineTo(x + hw, top + 60); cx.lineTo(x + hw, h * .82); cx.fill();
    cx.fillStyle = 'rgba(245,240,230,.92)'; for (let r = 0; r < 4; r++) for (let k = 0; k < 3; k++) cx.fillRect(x + hw * (.14 + k * .27), top + 90 + r * (hh - 110) / 4, hw * .18, (hh - 110) / 4 * .6);
    x += hw + 4; }
  const wt = cx.createLinearGradient(0, h * .82, 0, h); wt.addColorStop(0, '#6F8496'); wt.addColorStop(1, '#3D4D5C'); cx.fillStyle = wt; cx.fillRect(0, h * .82, w, h * .18);
  cx.fillStyle = 'rgba(230,236,240,.6)'; for (let k = 0; k < 40; k++) cx.fillRect(R() * w, h * .84 + R() * h * .14, 40 + R() * 80, 3);
}

scene(S(17), { bg: 'ground' }, sc => {
  const Wd = world({ w: 11000, h: 3200 }), w = W3(Wd);
  furniture(Wd, [[100, 1500, 700, 900], [2300, 1700, 520, 800], [5300, 1500, 600, 900], [7900, 1700, 700, 700], [9700, 1200, 700, 1400]]);

  /* A · early 2001: growing, burning, looking (17-20) */
  w.date('Early 2001', 200, 200, S(17) + .2); w.rule(200, 246, 1900, S(17) + .2);
  w.stk('tencentqq', 1600, 300, 260, { t: S(17) + .3, rot: 6 });
  w.T('Tencent, 2001', 1560, 600, 30, { f: 'm', wt: 600, upper: true, ls: '.12em', t: S(17) + .5, reveal: 'fade' });
  w.T('Growing fast.', 200, 300, 120, { f: 'd', wt: 800, t: S(18) - .1 });
  w.line('M220 600 C 500 590, 700 560, 900 500 S 1300 380, 1500 300 S 1900 230, 2080 210', S(18), 1.1, { sw: 8, col: C.blue });
  w.T('Burning cash.', 200, 660, 120, { f: 'd', wt: 800, t: S(19) - .1 });
  w.obj(drawBills, 1230, 560, 760, 430, { t: S(19) - .05, z: 5 });
  w.T('Looking for someone willing to bet on it.', 200, 1020, 64, { f: 'd', wt: 700, t: S(20) - .1, w: 1500, lh: 1.08 });
  const ad = w.cut(`<div style="padding:26px 30px;font:400 24px/1.35 'News'"><div style="font:700 15px 'Mono';letter-spacing:.2em;border-bottom:1.5px solid ${C.ink};padding-bottom:8px;margin-bottom:12px">CLASSIFIED · BUSINESS</div>
      <div style="font:700 50px/1 'News';margin-bottom:10px">Investor wanted.</div>Fast-growing internet messaging company seeks long-term backer. Serious enquiries only.<div style="font:600 19px 'Mono';margin-top:14px">SHENZHEN · 2001</div></div>`, 1420, 1080, 600, 420, { t: Wt(20, 'someone'), rot: 2, z: 5 });

  /* B · Naspers, South Africa, 1915 (21-22): Three.js printed globe */
  const g = globe3(3700, 1180, 560, [
    { t: S(21) - .5, d: 0, lon: 18, lat: 20, zoom: 1 },
    { t: Wt(21, 'world') + .2, d: 2.4, lon: 70, lat: -4, zoom: 1 },
    { t: S(22) + 2.4, d: 2.2, lon: 22, lat: 26, zoom: 1 },
    { t: Wt(23, 'paid') + 1.5, d: 2.2, lon: 100, lat: -14, zoom: 1 }], { w0: Wd, t: S(21) - .4, hi: { za: 1, cn: 1 },
    arcs: [{ from: [18.42, -33.92], to: [114.06, 22.54], t: Wt(21, 'other') - .2, d: 2.4 }], pins: [{ lon: 18.42, lat: -33.92 }, { lon: 114.06, lat: 22.54 }] });
  w.T('Cape Town → Shenzhen', 3700, 1830, 30, { f: 'm', wt: 600, ls: '.12em', upper: true, c: true, t: Wt(21, 'world'), reveal: 'fade' });
  const db = w.cut(`<div style="padding:30px 34px;font:400 19px/1.45 'News'"><div style="text-align:center;font:700 74px/1 'News'">Die Burger</div>
      <div style="border-top:3px solid ${C.ink};border-bottom:1px solid ${C.ink};margin:12px 0 14px;padding:6px 0;display:flex;justify-content:space-between;font:600 14px 'Mono';letter-spacing:.12em"><span>KAAPSTAD</span><span>26 JULIE 1915</span><span>No. 1</span></div>
      <div style="columns:3;column-gap:18px">${[...Array(18)].map((_, k) => `<i style="display:block;height:8px;background:${C.ink};opacity:.22;margin:0 0 11px;width:${k % 6 === 5 ? 60 : 100}%"></i>`).join('')}</div></div>`, 2280, 560, 620, 520, { t: Wt(22, 'naspers') - .3, rot: -2, z: 6 });
  w.T('Naspers', 2290, 1120, 120, { f: 'd', wt: 800, t: Wt(22, 'naspers') });
  w.cap('South African media group. Its first newspaper, Die Burger, appeared in 1915.', 2300, 1280, Wt(22, 'started'), { w: 600 });

  /* 23 · 2001: ~$32 million for 46.5% */
  const ch = cheque3(Wd, 4500, 500, 1000, { bank: 'NASPERS LTD · CAPE TOWN', date: '2001', payee: 'Tencent', amount: '$32,000,000', words: 'Thirty-two million US dollars' }, Wt(23, 'paid') - .3, { rot: -2.5, z: 8 });
  markFill(Wd, 'tencentqq', 4700, 1060, 520, [[Wt(23, '46.5') - .1, 1.1, 0, 46.5]], { t: Wt(23, '46.5') - .5, z: 7 });
  w.T('46.5%', 5250, 1240, 150, { f: 'd', wt: 800, col: C.blue, t: Wt(23, '46.5') + .4 });
  w.cap('of Tencent, for about $32 million.', 5260, 1420, Wt(23, 'stake'), { w: 460 });

  /* 24-25 · hold on to that number */
  const big = w.word('$32,000,000', 4520, 1700, 210, { t: S(25) - .1, step: .05, adv: c => 210 * (c === ',' ? .28 : c === '$' ? .62 : .64) });
  w.cap('Hold on to that number.', 4540, 1980, S(24), { w: 460 });

  /* 26-27 · 2019, Amsterdam listing; worth ~€118B (~$130B) */
  w.date('Amsterdam · 2019', 6000, 200, Wt(26, '2019')); w.rule(6000, 246, 2600, Wt(26, '2019'));
  w.ht(drawCanal, 6000, 300, 1500, 640, { t: S(26), duo: true, enter: 'fade', d: 1 });
  const tape = w.P(`<div style="width:1500px;height:64px;background:${C.ink};overflow:hidden;position:relative"><div class="tp" style="position:absolute;top:12px;white-space:nowrap;font:600 32px 'Mono';color:#F2EFE8;letter-spacing:.06em">${'EURONEXT AMSTERDAM · NEW LISTING · TENCENT HOLDING SPUN OFF · '.repeat(4)}</div></div>`, 6000, 960, { cls: 'co' });
  enter(tape, 'wipe', Wt(26, 'listed') - .4, .8); const tp = tape.i.querySelector('.tp'); tick(T => { tp.style.left = (200 - (T - S(26)) * 180).toFixed(0) + 'px'; });
  w.cap('Naspers moves its Tencent holding into a new company listed in Amsterdam.', 6000, 1060, Wt(26, 'new'), { w: 760 });
  const base = 1900;
  bar(Wd, 7700, base, 90, 4, Wt(27, 'stake'), .5, C.ink, { z: 4 });
  w.T('$32M', 7690, base + 20, 34, { f: 'm', wt: 600, t: Wt(27, 'stake'), reveal: 'fade' });
  bar(Wd, 7880, base, 220, 1600, Wt(27, 'worth') - .2, 1.6, C.blue, { z: 4 });
  w.T('€118B', 8140, 360, 140, { f: 'd', wt: 800, t: Wt(27, '118'), col: C.blue });
  w.T('≈ $130 billion', 8150, 520, 54, { f: 'd', wt: 700, t: Wt(27, 'roughly') });
  w.stk('cnn', 8150, 640, 110, { col: BRAND.cnn, t: Wt(27, 'cnn') });
  w.cap('By then, CNN reported, the stake was worth about €118 billion.', 8150, 790, Wt(27, 'cnn') + .2, { w: 480 });

  /* 28 · ~$4,000 of value for every $1 */
  const gx = 8900, gy = 1150;
  w.T('$1', gx, gy - 130, 90, { f: 'd', wt: 800, t: Wt(28, 'every') - .3 });
  const one = w.P(`<div style="width:16px;height:16px;border-radius:50%;background:${C.blue}"></div>`, gx + 20, gy + 10, {}); enter(one, 'fade', Wt(28, 'every') - .3);
  const cols = 80, rows = 50, cs = 15, cv = document.createElement('canvas'); cv.width = cols * cs; cv.height = rows * cs;
  const grid = w.P('', gx + 150, gy, {}); grid.i.appendChild(cv); const c2 = cv.getContext('2d');
  tick(T => { const k = Math.floor(4000 * eOut(seg01(T, L0(Wt(28, 'four')), 2))), sold = T > L0(Wt(28, 'already')) ? 1 : 0; if (cv._k === k * 2 + sold) return; cv._k = k * 2 + sold;
    c2.clearRect(0, 0, cv.width, cv.height); for (let i = 0; i < k; i++) { c2.fillStyle = sold && i > 3500 ? 'rgba(21,21,21,.18)' : C.ink; c2.beginPath(); c2.arc((i % cols) * cs + cs / 2, Math.floor(i / cols) * cs + cs / 2, cs * .34, 0, 7); c2.fill(); } });
  w.T('≈ $4,000', gx + 150, gy - 150, 110, { f: 'd', wt: 800, col: C.blue, t: Wt(28, 'four') + .6 });
  w.cap('…even after Naspers had sold part of the stake along the way.', gx + 150, gy + rows * cs + 40, Wt(28, 'already'), { w: 700 });

  /* 29-30 · headline; zoom through a halftone dot into chapter 2 */
  const hx = 9900;
  w.date('Analysis', hx, 200, S(29) - .3); w.rule(hx, 246, 1000, S(29) - .3);
  w.T(['One of the most', 'successful technology', 'investments ever made.'], hx, 300, 96, { f: 'n', wt: 700, lh: 1.04, t: S(29), step: .14 });
  w.T('And the fuel for everything that came next.', hx, 680, 44, { f: 'ni', t: S(30), reveal: 'fade', lh: 1.2, w: 900 });
  const dot = w.P(`<div style="width:26px;height:26px;border-radius:50%;background:${C.blue}"></div>`, hx + 985, 728, {}); enter(dot, 'fade', Wt(30, 'next'));

  Wd.cam([
    { t: S(17), d: 0, x: 1150, y: 640, z: 1.0 },
    { t: S(19) + .5, d: 1.6, x: 1150, y: 860, z: .94 },
    { t: S(21) + .6, d: 1.8, x: 3500, y: 1150, z: .8 },
    { t: Wt(22, 'naspers') + .4, d: 1.2, x: 3150, y: 1050, z: .86 },
    { t: Wt(23, 'paid') + .6, d: 1.4, x: 5050, y: 1000, z: .9 },
    { t: S(25) + .3, d: 1.2, x: 5450, y: 1750, z: .82 },
    { t: S(26) + .5, d: 1.6, x: 6900, y: 800, z: .82 },
    { t: Wt(27, 'worth') + .2, d: 1.6, x: 8200, y: 900, z: .62 },
    { t: S(28) + .3, d: 1.5, x: 9550, y: 1450, z: .72 },
    { t: S(29) + .3, d: 1.5, x: 10400, y: 600, z: .95 },
    { t: S(31) - 1.2, d: .6, x: hx + 998, y: 741, z: 1.4 },
    { t: S(31) + .15, d: 1.35, x: hx + 998, y: 741, z: 90, ease: 'in' },
  ]);
});
