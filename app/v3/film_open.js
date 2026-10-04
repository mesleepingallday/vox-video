'use strict';
/* v3 film · cold open (sentences 1-3): Shenzhen, November 1998 -> Ma Huateng -> "Pony" / 马 = horse. */

// tonal drawings that get printed as halftone photographs
function drawShenzhen(cx, w, h) {
  const sky = cx.createLinearGradient(0, 0, 0, h * .7); sky.addColorStop(0, '#C9D6E2'); sky.addColorStop(1, '#EEE7D8'); cx.fillStyle = sky; cx.fillRect(0, 0, w, h);
  cx.fillStyle = 'rgba(255,240,210,.9)'; cx.beginPath(); cx.arc(w * .74, h * .26, h * .09, 0, 7); cx.fill();
  const hill = (y0, amp, col, seed) => { const R = rnd(seed); cx.fillStyle = col; cx.beginPath(); cx.moveTo(0, h); for (let x = 0; x <= w; x += 20) cx.lineTo(x, y0 - Math.sin(x / w * 5 + seed) * amp - R() * 6); cx.lineTo(w, h); cx.fill(); };
  hill(h * .52, h * .07, '#A7B0A2', 2); hill(h * .6, h * .05, '#8C9589', 5);
  const R = rnd(11); let x = -10;
  while (x < w) { const bw = 40 + R() * 90, bh = h * (.12 + R() * .3), tone = 70 + R() * 70; const g = cx.createLinearGradient(x, 0, x + bw, 0); g.addColorStop(0, `rgb(${tone + 30},${tone + 28},${tone + 24})`); g.addColorStop(1, `rgb(${tone},${tone - 2},${tone - 6})`);
    cx.fillStyle = g; cx.fillRect(x, h * .78 - bh, bw, bh + h * .3);
    cx.fillStyle = 'rgba(40,38,34,.55)'; for (let yy = h * .78 - bh + 10; yy < h * .78; yy += 16) for (let xx = x + 6; xx < x + bw - 8; xx += 14) if (R() > .35) cx.fillRect(xx, yy, 7, 9);
    x += bw + 3 + R() * 10; }
  cx.strokeStyle = '#3A3A3A'; cx.lineWidth = 4; [[w * .2, h * .2], [w * .52, h * .14], [w * .83, h * .22]].forEach(([cxx, top]) => {
    cx.beginPath(); cx.moveTo(cxx, h * .8); cx.lineTo(cxx, top); cx.moveTo(cxx + 12, h * .8); cx.lineTo(cxx + 12, top); cx.stroke();
    for (let yy = top; yy < h * .8; yy += 22) { cx.beginPath(); cx.moveTo(cxx, yy); cx.lineTo(cxx + 12, yy + 22); cx.stroke(); }
    cx.beginPath(); cx.moveTo(cxx - 160, top); cx.lineTo(cxx + 300, top); cx.moveTo(cxx + 6, top - 50); cx.lineTo(cxx - 160, top); cx.moveTo(cxx + 6, top - 50); cx.lineTo(cxx + 300, top); cx.moveTo(cxx + 240, top); cx.lineTo(cxx + 240, top + 140); cx.stroke(); });
  const road = cx.createLinearGradient(0, h * .8, 0, h); road.addColorStop(0, '#77756F'); road.addColorStop(1, '#4A4844'); cx.fillStyle = road; cx.fillRect(0, h * .8, w, h * .2);
  cx.fillStyle = 'rgba(240,236,226,.8)'; for (let xx = 0; xx < w; xx += 90) cx.fillRect(xx, h * .9, 50, 5);
}
function drawFounders(cx, w, h) {  // five young men seen from behind (no faces), 1998 clothes
  const tones = [['#D8D6CE', '#2B2B2B'], ['#5C7FB8', '#232323'], ['#E9E6DD', '#2E2E2E'], ['#7E8C7A', '#262626'], ['#BFC6CF', '#2A2A2A']];
  tones.forEach(([shirt, hair], k) => {
    const x = w * (.1 + k * .2), s = h / 620 * (k % 2 ? .96 : 1), y0 = h - 600 * s;
    const g = cx.createLinearGradient(x - 90 * s, 0, x + 90 * s, 0); g.addColorStop(0, shirt); g.addColorStop(1, shade(shirt, -.28));
    cx.fillStyle = shade(shirt, -.55); cx.fillRect(x - 70 * s, y0 + 360 * s, 60 * s, 240 * s); cx.fillRect(x + 10 * s, y0 + 360 * s, 60 * s, 240 * s);
    cx.fillStyle = g; cx.beginPath(); cx.moveTo(x - 95 * s, y0 + 380 * s); cx.lineTo(x - 100 * s, y0 + 170 * s); cx.quadraticCurveTo(x, y0 + 120 * s, x + 100 * s, y0 + 170 * s); cx.lineTo(x + 95 * s, y0 + 380 * s); cx.fill();
    cx.beginPath(); cx.moveTo(x - 100 * s, y0 + 175 * s); cx.lineTo(x - 128 * s, y0 + 360 * s); cx.lineTo(x - 100 * s, y0 + 365 * s); cx.fill(); cx.beginPath(); cx.moveTo(x + 100 * s, y0 + 175 * s); cx.lineTo(x + 128 * s, y0 + 360 * s); cx.lineTo(x + 100 * s, y0 + 365 * s); cx.fill();
    cx.fillStyle = '#C9A587'; cx.fillRect(x - 18 * s, y0 + 98 * s, 36 * s, 40 * s);
    const hg = cx.createRadialGradient(x - 15 * s, y0 + 50 * s, 5, x, y0 + 70 * s, 60 * s); hg.addColorStop(0, shade(hair, .25)); hg.addColorStop(1, hair);
    cx.fillStyle = hg; cx.beginPath(); cx.ellipse(x, y0 + 70 * s, 50 * s, 60 * s, 0, 0, 7); cx.fill();
  });
}
function shade(hex, f) { const n = parseInt(hex.slice(1), 16), r = n >> 16, g = n >> 8 & 255, b = n & 255, m = c => Math.round(f < 0 ? c * (1 + f) : c + (255 - c) * f); return `rgb(${m(r)},${m(g)},${m(b)})`; }
function drawHorse(cx, w, h) {
  const p = new Path2D('M18 92 Q14 70 30 60 Q44 52 60 54 L104 50 Q118 34 126 18 Q130 10 138 12 L146 6 L148 16 Q160 22 164 34 Q166 42 158 44 Q150 44 146 40 Q140 52 132 58 Q136 74 134 90 L142 120 L132 122 L124 96 Q116 92 110 96 L104 124 L94 124 L98 94 Q80 96 62 92 L56 122 L46 122 L48 94 Q40 98 36 112 L30 124 L22 122 L28 104 Q22 98 18 92Z');
  cx.save(); cx.scale(w / 170, h / 130); const g = cx.createLinearGradient(0, 0, 170, 130); g.addColorStop(0, '#6E5A48'); g.addColorStop(1, '#2A211A'); cx.fillStyle = g; cx.fill(p); cx.restore();
}

scene(0, { bg: 'ground' }, sc => {
  const Wd = world({ w: 7000, h: 2400 }), w = W3(Wd);
  furniture(Wd, [[120, 1320, 760, 700], [2300, 1420, 640, 560], [5400, 300, 500, 1500]]);
  // broadsheet top: dateline, rule, headline
  w.date('Shenzhen · November 1998', 150, 140, .5);
  w.rule(150, 186, 2050, .5);
  const ph = w.ht(drawShenzhen, 150, 230, 2050, 820, { t: .2, duo: true, enter: 'fade', d: 1.2 });
  w.cap('Shenzhen, a special economic zone built from fishing villages in barely two decades.', 150, 1080, 2.2, { w: 760 });
  w.T(['Five young men.', 'One small software company.'], 1000, 1080, 74, { f: 'd', wt: 800, t: Wt(1, 'five') - .1, step: .35 });
  // the five founders as printed name strips laid onto the photograph (real names, no invented faces; G02 replaces if supplied)
  if (PHOTO3.G02) w.photo('G02', 1120, 520, 540, { t: Wt(1, 'five') - .3, z: 6 });
  else [['马化腾', 'Ma Huateng'], ['张志东', 'Zhang Zhidong'], ['许晨晔', 'Xu Chenye'], ['陈一丹', 'Chen Yidan'], ['曾李青', 'Zeng Liqing']].forEach(([zh, en], k) => {
    const n = w.cut(`<div style="display:flex;align-items:baseline;gap:18px;padding:14px 22px;height:100%;box-sizing:border-box"><span class="sc" style="font-size:40px">${zh}</span><span style="font:600 30px 'Text'">${en}</span></div>`, 1240 + (k % 2) * 60, 360 + k * 112, 520, 92, { t: Wt(1, 'five') + k * .14, z: 6, rot: [-1.5, 1, -.5, 1.5, -1][k], enter: 'slide', dx: 120 });
  });
  // Ma Huateng: real photo slot (R01), name and nickname as type, 马 -> horse
  const mx = 2600;
  w.rule(mx, 186, 1900, Wt(2, 'leader') - .4);
  w.date('Co-founder', mx, 140, Wt(2, 'leader') - .4);
  w.photo('R01', mx + 40, 260, 780, { t: Wt(2, 'leader') - .2, ar: .8 });
  w.T('Ma Huateng', mx + 760, 330, 150, { f: 'd', wt: 800, t: Wt(2, 'ma') - .1 });
  w.T('马化腾', mx + 770, 500, 64, { f: 'sc', t: Wt(2, 'huateng'), col: C.grey, reveal: 'fade' });
  w.T('“Pony”', mx + 760, 620, 150, { f: 'd', wt: 800, col: C.blue, t: Wt(3, 'pony') - .1 });
  const ma = w.T('马', mx + 1540, 600, 300, { f: 'sc', t: Wt(3, 'family') - .2, reveal: 'fade', z: 4 });
  A(ma.o, [{ opacity: 1 }, { opacity: 0 }], L0(Wt(3, 'horse')) - .1, .35, E3.in);
  w.obj(drawHorse, mx + 1430, 640, 470, 360, { t: Wt(3, 'horse') - .25, z: 5, mode: 'mono' });
  w.cap('马 (mǎ) means “horse.” In English, Ma goes by Pony.', mx + 770, 1000, Wt(3, 'means'), { w: 720 });
  // camera: slow push on the photo, glide to the founders, then to Ma; whip right into the next world
  Wd.cam([
    { t: 0, d: 0, x: 1180, y: 640, z: 1.0 },
    { t: Wt(1, 'five') + .4, d: 1.8, x: 1300, y: 760, z: .92 },
    { t: S(2) + .5, d: 1.5, x: 3500, y: 620, z: .9 },
    { t: Wt(3, 'horse') + .6, d: 1.2, x: 3780, y: 640, z: .98 },
    { t: S(4) - .6, d: .4, x: 3820, y: 640, z: .98 },
    { t: S(4) - .22, d: .38, x: 6600, y: 640, z: .98, ease: 'in' },
  ]);
});
