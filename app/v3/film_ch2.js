'use strict';
/* v3 film · chapter 2 (sentences 32-65): QQ giant -> Riot -> $400M for 93% -> "independent" -> wholly owned -> the playbook
   -> Honor of Kings vs League -> Epic $330M -> Sweeney 48.4% -> leaders leave -> Fortnite -> the math. */

function drawGamepad(cx, w, h) {
  const g = cx.createLinearGradient(0, 0, w, h); g.addColorStop(0, '#6A6A6A'); g.addColorStop(1, '#1C1C1C'); cx.fillStyle = g;
  const p = new Path2D(`M${w * .24} ${h * .12} H${w * .76} C${w * .95} ${h * .12} ${w} ${h * .5} ${w} ${h * .72} C${w} ${h * .95} ${w * .86} ${h} ${w * .78} ${h * .86} L${w * .68} ${h * .66} H${w * .32} L${w * .22} ${h * .86} C${w * .14} ${h} 0 ${h * .95} 0 ${h * .72} C0 ${h * .5} ${w * .05} ${h * .12} ${w * .24} ${h * .12}Z`); cx.fill(p);
  cx.fillStyle = '#D8D8D8'; cx.fillRect(w * .19, h * .36, w * .04, h * .2); cx.fillRect(w * .15, h * .42, w * .12, h * .08);
  [[.76, .34], [.82, .46], [.7, .46], [.76, .58]].forEach(([a, b]) => { cx.beginPath(); cx.arc(w * a, h * b, h * .05, 0, 7); cx.fill(); });
}
function drawBox(cx, w, h) {  // a generic game box (front), lit from the upper left
  const g = cx.createLinearGradient(0, 0, w, h); g.addColorStop(0, '#E0574A'); g.addColorStop(1, '#8E1F1A'); cx.fillStyle = g; cx.fillRect(0, 0, w, h);
  cx.fillStyle = 'rgba(0,0,0,.25)'; cx.fillRect(0, 0, w * .06, h);
}

scene(S(31), { bg: 'ground' }, sc => {
  const Wd = world({ w: 17000, h: 3600 }), w = W3(Wd);
  furniture(Wd, [[2200, 1500, 600, 900], [4300, 1650, 520, 800], [6600, 1600, 700, 900], [9200, 1500, 520, 1000], [11600, 1550, 640, 900], [14100, 1500, 600, 1000]]);

  /* 32-34 · QQ made Tencent a giant in China; games; every games business needs hits */
  const map = dotMap(200, 200, 1700, 1300, [72, 136, 16, 54], { w0: Wd, hi: { cn: 1 }, pitch: 13, r: 4.2, col: 'rgba(21,21,21,.35)' });
  w.date('Late 2000s', 200, 150, S(32) + .2);
  const qqS = w.stk('tencentqq', 760, 520, 520, { t: Wt(32, 'qq') - .2, z: 6 });
  qqS.to(Wt(32, 'giant') - .2, .9, { s: 1.25 }, E3.out);
  w.T('A giant in China.', 230, 1560, 96, { f: 'd', wt: 800, t: Wt(32, 'giant') });
  w.obj(drawGamepad, 2050, 520, 560, 330, { t: Wt(33, 'games'), z: 5 });
  w.cap('Then a games business.', 2060, 900, Wt(33, 'business'), { w: 520 });
  w.T('Every games business needs the same thing:', 2050, 1000, 46, { f: 't', wt: 600, t: S(34) });
  const hits = w.word('HITS', 2040, 1070, 360, { t: Wt(34, 'hits') - .1, step: .07, cols: [C.blue, C.blue, C.blue, C.blue], adv: c => 360 * (c === 'I' ? .3 : .7) });

  /* 35-37 · Riot Games, Los Angeles; League of Legends; early investor and China distributor */
  const usm = dotMap(3900, 260, 1200, 820, [-126, -100, 26, 44], { w0: Wd, pitch: 12, r: 3.8, col: 'rgba(21,21,21,.35)', t: S(35) - .5 });
  const la = usm.P(-118.24, 34.05);
  w.P(`<div style="width:24px;height:24px;border-radius:50%;background:${C.blue};box-shadow:0 0 0 7px rgba(0,82,217,.18)"></div>`, la[0] - 12, la[1] - 12, { in: 'fade', t: Wt(35, 'los') });
  w.T('Los Angeles', la[0] + 30, la[1] - 18, 36, { f: 't', wt: 600, t: Wt(35, 'los') + .1 });
  w.stk('riotgames', 4700, 330, 380, { col: BRAND.riot, t: Wt(35, 'riot'), z: 6, rot: -3 });
  w.T('Riot Games', 4720, 760, 64, { f: 'd', wt: 800, t: Wt(35, 'riot') + .2 });
  w.stk('leagueoflegends', 5260, 900, 300, { col: BRAND.lol, t: Wt(36, 'league'), z: 6, rot: 4 });
  w.cap('League of Legends', 5240, 1240, Wt(36, 'legends'), { w: 360 });
  w.cap('Tencent: an early investor in Riot, and the game’s distributor in China.', 3920, 1180, Wt(37, 'early'), { w: 900 });
  w.line(`M${la[0]} ${la[1]} C ${la[0] + 900} ${la[1] - 900}, ${1400} ${-200}, 1000 700`, Wt(37, 'china') - .3, 1.2, { sw: 5, col: C.blue, dash: '16 12' });

  /* 38-39 · February 2011: ~$400M for 93% of Riot */
  w.date('February 2011', 6200, 200, Wt(38, 'february')); w.rule(6200, 246, 2200, Wt(38, 'february'));
  w.T('Tencent went much further.', 6200, 300, 80, { f: 'd', wt: 800, t: Wt(38, 'went') });
  markFill(Wd, 'riotgames', 6250, 520, 640, [[Wt(39, '93') - .1, 1.2, 0, 93]], { t: Wt(39, 'paid') - .3, col: C.blue });
  w.T('93%', 6950, 600, 240, { f: 'd', wt: 900, col: C.blue, t: Wt(39, '93') + .4 });
  w.T('$400,000,000', 6960, 880, 96, { f: 'd', wt: 800, t: Wt(39, '400') - .1 });
  w.cap('Paid for a 93% stake in Riot Games.', 6970, 1010, Wt(39, 'stake'), { w: 640 });

  /* 40 · Brandon Beck: "Riot is going to remain completely independent." (magazine spread) */
  const mg = w.cut(`<div style="position:absolute;left:50%;top:0;bottom:0;width:2px;background:${C.ink};opacity:.12"></div>
      <div style="position:absolute;left:44px;top:34px;font:600 18px 'Mono';letter-spacing:.14em">TRADE PRESS · 2011</div>`, 8600, 260, 1700, 980, { t: S(40) - .2, rot: -1, z: 4 });
  w.photo('R08', 8700, 360, 760, { t: S(40), ar: .8, z: 6 });
  w.T('Brandon Beck', 8710, 1150, 34, { f: 't', wt: 600, t: S(40) + .3, reveal: 'fade', z: 7 });
  w.T('“Riot is going to remain <span style="color:#0052D9">completely independent.</span>”', 9520, 420, 84, { f: 'n', wt: 700, lh: 1.08, w: 700, t: Wt(40, 'riot', 1) - .1, z: 7 });
  w.T('Riot co-founder and CEO, 2011', 9520, 1080, 30, { f: 't', wt: 500, col: C.grey, t: Wt(40, 'independent'), reveal: 'fade', z: 7 });

  /* 41-44 · December 2015 blog post: Tencent bought the rest; price undisclosed; wholly owned */
  w.date('December 2015', 10600, 200, Wt(41, 'december')); w.rule(10600, 246, 2300, Wt(41, 'december'));
  const bp = browser3(Wd, 10600, 300, 1200, 900, 'riotgames.com/news', `<div style="padding:46px 60px;font:400 26px/1.55 'Text';color:#222"><div style="font:800 52px/1.1 'Display';margin-bottom:10px">Changes to pay at Riot</div><div style="font:500 19px 'Mono';color:#888;margin-bottom:30px">DEC 2015 · RIOT GAMES</div>
      ${[...Array(4)].map(() => '<div style="height:13px;background:#E3E3E3;margin:18px 0;border-radius:4px"></div>').join('')}<p style="margin:26px 0">…<mk class="hl1">Tencent has bought the remaining equity in Riot</mk> from former shareholders…</p>${[...Array(5)].map(() => '<div style="height:13px;background:#E3E3E3;margin:18px 0;border-radius:4px"></div>').join('')}</div>`, S(41), { z: 4 });
  const hl = bp.i.querySelector('.hl1'); hl.style.color = '#fff'; A(hl, [{ backgroundSize: '0% 100%', color: '#222' }, { backgroundSize: '100% 100%', color: '#fff' }], L0(Wt(42, 'tencent')), .7, E3.inOut);
  markFill(Wd, 'riotgames', 12000, 360, 520, [[S(41), .01, 93, 93], [Wt(42, 'rest'), 1.1, 93, 100]], { t: S(41) + .3, col: C.blue });
  w.T('93% → 100%', 12000, 920, 80, { f: 'd', wt: 800, t: Wt(42, 'rest') + .2 });
  const pr = w.T('Price: <span style="background:#151515;color:#151515">$0,000,000,000</span>', 12000, 1060, 54, { f: 'm', wt: 600, t: Wt(43, 'price') });
  w.cap('Never disclosed. Riot is now wholly owned by Tencent.', 12000, 1160, Wt(44, 'wholly'), { w: 640 });

  /* 45-49 · the playbook: three load-bearing lines; nothing on the box changes */
  w.date('The Tencent playbook', 13200, 200, S(45)); w.rule(13200, 246, 1600, S(45));
  w.T('1 · Buy in big.', 13200, 320, 110, { f: 'd', wt: 800, t: S(46) - .1 });
  w.T('2 · Promise independence.', 13200, 480, 110, { f: 'd', wt: 800, t: S(47) - .1 });
  w.T('3 · Keep the name, the offices, the culture.', 13200, 640, 110, { f: 'd', wt: 800, t: S(48) - .1, w: 1500, lh: 1.02 });
  const box = w.cut(`<div style="position:absolute;inset:0;background:linear-gradient(135deg,#E0574A,#8E1F1A)"></div><div style="position:absolute;left:0;top:0;bottom:0;width:7%;background:rgba(0,0,0,.25)"></div>
      <div style="position:absolute;left:50%;top:44%;transform:translate(-50%,-50%)">${markSVG('riotgames', 260, '#fff')}</div>
      <div class="xr" style="position:absolute;inset:0;background:#0E2A3A;display:flex;align-items:center;justify-content:center;clip-path:inset(0 0 100% 0)"><div style="filter:invert(1);opacity:.9">${markSVG('tencentqq', 280, '#151515')}</div><i style="position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(120,220,255,.12) 0 3px,transparent 3px 8px);display:block"></i></div>`, 13900, 1000, 520, 680, { t: S(49) - .4, rot: 2, z: 5 });
  A(box.i.querySelector('.xr'), [{ clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', offset: .4 }, { clipPath: 'inset(0 0 0% 0)', offset: .7 }, { clipPath: 'inset(100% 0 0% 0)' }], L0(Wt(49, 'box')) - .1, 1.8, 'linear');
  w.cap('Nothing on the box changes.', 14480, 1600, Wt(49, 'nothing'), { w: 460 });

  /* 50-53 · independence has limits: Honor of Kings vs League of Legends; competing for the same players */
  w.T('But independence has limits.', 15100, 300, 96, { f: 'd', wt: 800, t: S(50) });
  const ph = phone3(Wd, 15150, 520, 330, Wt(51, 'honor') - .3, { rot: -5, z: 5 });
  ph.screen.innerHTML = `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">${MOBA(290, '#2F5D3A')}</div>`;
  w.cap('Honor of Kings (Tencent): its highest-grossing mobile game.', 15110, 1240, Wt(51, 'highest'), { w: 460 });
  const mn = monitor3(Wd, 15700, 560, 860, Wt(52, 'league') - .3, { z: 5 });
  mn.screen.innerHTML = `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">${MOBA(480, '#1E3B2A')}</div>`;
  w.stk('leagueoflegends', 16420, 470, 170, { col: BRAND.lol, t: Wt(52, 'league'), z: 7 });
  const ov = w.P(`<div style="opacity:.55">${MOBA(290, '#2F5D3A')}</div>`, 15172, 760, { z: 8 });
  ov.to(Wt(52, 'clone') - .2, 1, { x: 695, y: -69, s: 1.655 }, E3.inOut); A(ov.o, [{ opacity: 0 }, { opacity: 1 }], L0(Wt(52, 'clone')) - .3, .3);
  w.T('“a League of Legends clone”', 15700, 1240, 56, { f: 'n', wt: 700, t: Wt(52, 'clone') + .2 });
  credit('THE MOTLEY FOOL', Wt(52, 'motley'));
  units(Wd, 15400, 1460, 25, 4, 30, [[Wt(53, 'players') - .3, 50, '#B23A2E'], [Wt(53, 'same'), 0, C.blue]], { t: S(53) - .2 });
  w.cap('Owner and studio, competing for the same players.', 15400, 1680, Wt(53, 'competing'), { w: 760 });

  Wd.cam([
    { t: S(31), d: 0, x: 1010, y: 860, z: 40 },
    { t: S(32) + .4, d: 1.4, x: 1050, y: 880, z: .84, ease: 'out' },
    { t: S(33) + .3, d: 1.5, x: 2450, y: 960, z: .86 },
    { t: S(35) + .5, d: 1.6, x: 4600, y: 760, z: .86 },
    { t: S(38) + .5, d: 1.6, x: 7100, y: 680, z: .9 },
    { t: S(40) + .5, d: 1.5, x: 9450, y: 750, z: .9 },
    { t: S(41) + .6, d: 1.6, x: 11500, y: 760, z: .86 },
    { t: S(45) + .5, d: 1.6, x: 14000, y: 640, z: .86 },
    { t: S(49) + .2, d: 1.2, x: 14150, y: 1150, z: .9 },
    { t: S(50) + .5, d: 1.5, x: 15950, y: 900, z: .84 },
    { t: S(53) + .3, d: 1.2, x: 15950, y: 1150, z: .82 },
    { t: S(54) + .05, d: .45, x: 17400, y: 1150, z: .82, ease: 'in' },
  ]);
});

/* 54-65 · Epic: a second world (whip-pan in) */
scene(S(54) + .1, { bg: 'ground' }, sc => {
  const Wd = world({ w: 11000, h: 3400 }), w = W3(Wd);
  furniture(Wd, [[200, 1500, 640, 900], [2700, 1600, 520, 800], [5100, 1500, 600, 1000], [7600, 1500, 700, 900]]);
  // 54-55 · June 2012: $330M into Epic Games (Cary, NC), known for Gears of War
  w.date('June 2012', 200, 200, Wt(54, 'june')); w.rule(200, 246, 2300, Wt(54, 'june'));
  w.T('A second big American move.', 200, 300, 80, { f: 'd', wt: 800, t: Wt(54, 'second') });
  const em = dotMap(1200, 420, 1300, 1000, [-92, -70, 28, 42], { w0: Wd, pitch: 12, r: 3.8, col: 'rgba(21,21,21,.35)', t: S(55) - .6 });
  const cary = em.P(-78.78, 35.79);
  w.P(`<div style="width:24px;height:24px;border-radius:50%;background:${C.blue};box-shadow:0 0 0 7px rgba(0,82,217,.18)"></div>`, cary[0] - 12, cary[1] - 12, { in: 'fade', t: Wt(55, 'cary') });
  w.T('Cary, North Carolina', cary[0] + 30, cary[1] - 20, 36, { f: 't', wt: 600, t: Wt(55, 'cary') + .1 });
  w.stk('epicgames', 260, 470, 380, { col: BRAND.epic, t: Wt(55, 'epic'), z: 6, rot: -3 });
  w.T('$330,000,000', 240, 920, 110, { f: 'd', wt: 800, col: C.blue, t: Wt(55, '330') - .1 });
  w.cap('Then best known for Gears of War.', 250, 1070, Wt(55, 'gears'), { w: 520 });

  // 56 · Tim Sweeney via Polygon: ~48.4% of shares, ~40% counting options
  w.photo('R09', 2700, 330, 760, { t: S(56) - .2, ar: .8, z: 6 });
  w.T('Tim Sweeney, founder', 2710, 1120, 34, { f: 't', wt: 600, t: S(56) + .2, reveal: 'fade' });
  units(Wd, 3450, 380, 10, 10, 54, [[Wt(56, '48.4') - .2, 48, C.blue]], { t: S(56) });
  w.T('48.4%', 4250, 360, 150, { f: 'd', wt: 900, col: C.blue, t: Wt(56, '48.4') });
  w.cap('of Epic’s outstanding shares.', 4260, 540, Wt(56, 'outstanding'), { w: 420 });
  const opt = units(Wd, 3450, 1090, 10, 2, 54, [[Wt(56, 'employee'), 20, '#C9B9A0']], { t: Wt(56, 'employee') - .3 });
  w.T('≈ 40%', 4250, 760, 150, { f: 'd', wt: 900, t: Wt(56, '40') });
  w.cap('once employee stock options are counted.', 4260, 940, Wt(56, 'options'), { w: 420 });
  w.stk('polygon', 4270, 1080, 90, { col: BRAND.polygon, t: Wt(56, 'polygon') });
  credit('TIM SWEENEY VIA POLYGON', Wt(56, 'polygon'));

  // 57-59 · Sweeney kept control; Variety: the deal changed Epic; leaders left
  w.T('Sweeney kept control.', 5100, 300, 96, { f: 'd', wt: 800, t: S(57) });
  const vr = w.cut(`<div style="padding:40px 48px;font:400 22px/1.5 'News'"><div style="font:700 92px/1 'News';color:#B40F14;text-align:center">Variety</div>
      <div style="border-top:3px solid ${C.ink};border-bottom:1px solid ${C.ink};margin:14px 0 22px;padding:6px 0;font:600 15px 'Mono';letter-spacing:.14em;text-align:center">GAMING</div>
      <div style="font:700 44px/1.12 'News';margin-bottom:18px">Tencent deal <span style="color:#0052D9">fundamentally changed</span> how Epic built and released games</div>
      <div style="columns:2;column-gap:22px">${[...Array(16)].map((_, k) => `<i style="display:block;height:9px;background:${C.ink};opacity:.2;margin:0 0 13px;width:${k % 6 === 5 ? 55 : 100}%"></i>`).join('')}</div></div>`, 5100, 480, 760, 1000, { t: Wt(58, 'variety') - .2, rot: -1.5, z: 5 });
  credit('VARIETY', Wt(58, 'variety'));
  w.photo('R10a', 6050, 560, 520, { t: Wt(59, 'capps') - .3, ar: .8, z: 6 });
  w.T('Mike Capps, president', 6060, 1100, 30, { f: 't', wt: 600, t: Wt(59, 'capps') });
  w.photo('R10b', 6560, 600, 520, { t: Wt(59, 'cliff') - .3, ar: .8, z: 6 });
  w.T('Cliff Bleszinski, designer', 6570, 1140, 30, { f: 't', wt: 600, t: Wt(59, 'cliff') });
  w.cap('Several of Epic’s best-known leaders left.', 6060, 1240, Wt(59, 'left'), { w: 600 });

  // 60-61 · Fortnite; April 2022: Epic valued at $31.5B
  w.stk('fortnite', 7500, 300, 520, { col: C.ink, t: Wt(60, 'fortnite') - .2, z: 6, rot: -3 });
  w.T('Fortnite', 7520, 880, 120, { f: 'd', wt: 900, t: Wt(60, 'fortnite') });
  w.cap('The game that changed everything.', 7530, 1040, Wt(60, 'everything'), { w: 520 });
  w.date('April 2022', 8300, 200, Wt(61, 'april')); w.rule(8300, 246, 1500, Wt(61, 'april'));
  bar(Wd, 8350, 1400, 200, 1000, Wt(61, 'valued'), 1.4, C.blue, { z: 4 });
  w.T('$31.5B', 8600, 420, 160, { f: 'd', wt: 900, col: C.blue, t: Wt(61, '31.5') - .1 });
  w.cap('Epic’s valuation.', 8610, 610, Wt(61, '31.5') + .3, { w: 400 });

  // 62-65 · Now do the math
  const mx = 9700;
  w.T('Now do the math.', mx, 300, 96, { f: 'd', wt: 800, t: S(62) });
  w.T('Tencent’s stake, diluted to ≈ 28%', mx, 480, 46, { f: 't', wt: 600, t: Wt(63, 'diluted') });
  credit('MULTIPLE REPORTS', Wt(63, 'multiple'));
  w.T('0.28 × $31.5B', mx, 580, 130, { f: 'm', wt: 600, t: Wt(64, 'valuation') - .2 });
  w.rule(mx, 760, 1100, Wt(64, 'worth') - .3, { h: 4 });
  w.T('≈ $8.8B', mx, 800, 200, { f: 'd', wt: 900, col: C.blue, t: Wt(64, 'nine') });
  w.cap('on paper, at Epic’s 2022 valuation.', mx, 1030, Wt(64, 'paper'), { w: 560 });
  bar(Wd, mx + 1250, 1500, 120, 1000, Wt(64, 'nine'), 1.2, C.blue, { z: 4 });
  bar(Wd, mx + 1100, 1500, 120, Math.round(1000 * .33 / 8.8), S(65), .6, C.ink, { z: 4 });
  w.T('$330M', mx + 1060, 1530, 40, { f: 'm', wt: 600, t: S(65) });
  w.T('$8.8B', mx + 1240, 1530, 40, { f: 'm', wt: 600, t: Wt(64, 'nine') + .3, col: C.blue });
  cheque3(Wd, mx + 50, 1140, 620, { bank: 'TENCENT HOLDINGS', date: '2012', payee: 'Epic Games', amount: '$330,000,000' }, S(65) - .3, { rot: 3, z: 6 });

  Wd.cam([
    { t: S(54), d: 0, x: 1150, y: 700, z: .86 },
    { t: S(56) + .3, d: 1.5, x: 3700, y: 760, z: .88 },
    { t: S(57) + .3, d: 1.5, x: 5900, y: 800, z: .82 },
    { t: S(60) + .3, d: 1.4, x: 8200, y: 760, z: .86 },
    { t: S(62) + .4, d: 1.4, x: 10450, y: 900, z: .82 },
    { t: S(65) + 1.6, d: 2.4, x: 5400, y: 900, z: .2 },
  ]);
});
