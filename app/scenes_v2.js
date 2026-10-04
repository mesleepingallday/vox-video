'use strict';
/* v2 scenes, chapters 1-2 (sentences 1-65). See STORYBOARD_V2.md. No chapter cards; text lives on objects. */

/* ---------- local builders ---------- */
const FLOWER = c => `<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="${LOGO.icq}" fill="${c || '#3DAA5C'}"/></svg>`;
function icqList(n, title, icon, rows) {  // contact list inside a win98 window body
  into(n, `<div style="padding:10px 12px;font:600 20px 'Liberation Sans',Arial">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px"><div style="width:34px;height:34px">${icon}</div><b style="font-size:26px">${title}</b></div>
    <div style="background:#000080;color:#fff;padding:2px 8px;font-size:17px">Online</div>
    ${rows.map(([nm, c]) => `<div style="display:flex;align-items:center;gap:10px;padding:5px 6px"><div style="width:22px;height:22px">${c}</div>${nm}</div>`).join('')}</div>`);
}
const HORSE = 'M18 92 Q14 70 30 60 Q44 52 60 54 L104 50 Q118 34 126 18 Q130 10 138 12 L146 6 L148 16 Q160 22 164 34 Q166 42 158 44 Q150 44 146 40 Q140 52 132 58 Q136 74 134 90 L142 120 L132 122 L124 96 Q116 92 110 96 L104 124 L94 124 L98 94 Q80 96 62 92 L56 122 L46 122 L48 94 Q40 98 36 112 L30 124 L22 122 L28 104 Q22 98 18 92Z';
function hand(x, y, s, o) {  // a big cut-paper hand with a cuff (for "acquired by")
  o = o || {};
  return svgEl(`<path d="M0 70 L120 60 L130 100 L0 110Z" fill="${o.cuff || BLUE}"/><path d="M118 58 Q150 40 190 46 L250 40 Q262 40 262 50 Q262 60 250 60 L200 64 L260 66 Q272 68 270 80 Q268 90 256 90 L204 88 L250 96 Q262 98 260 110 Q256 120 244 118 L200 112 L236 122 Q246 126 242 136 Q236 144 226 140 L170 130 Q140 128 128 104Z" fill="#E9C9A6" stroke="${INK}" stroke-width="3"/>`,
    x, y, 280 * s, 150 * s, Object.assign({ vb: '0 0 280 150' }, o));
}
function paperPlane(x, y, s, o) { return svgEl(`<path d="M0 40 L120 0 L60 80 L50 52Z" fill="${WHITE}" stroke="${INK}" stroke-width="3"/><path d="M50 52 L120 0 L40 46Z" fill="#E6DFC9" stroke="${INK}" stroke-width="3"/>`, x, y, 120 * s, 80 * s, Object.assign({ vb: '0 0 120 80' }, o)); }
function arcadeCab(x, y, h, label, t, o) {
  o = o || {}; const w = h * .5;
  const n = mk(`<div style="width:${w}px;height:${h}px">
    <div style="position:absolute;inset:0;background:#2B2824;clip-path:polygon(8% 0,92% 0,92% 55%,100% 62%,100% 100%,0 100%,0 62%,8% 55%);box-shadow:8px 10px 0 rgba(20,15,5,.25)"></div>
    <div class="mq" style="position:absolute;left:12%;right:12%;top:3%;height:13%;background:#3A1A40;border-radius:6px;display:flex;align-items:center;justify-content:center;font:800 ${h * .1}px 'Display';color:#5B3A60;letter-spacing:.06em">${label}</div>
    <div style="position:absolute;left:14%;right:14%;top:20%;height:30%;background:#12333A;border-radius:6px;box-shadow:inset 0 0 20px #000">${mobaMap(w * .5, '#1E3B2A').replace('<svg', '<svg style="display:block;margin:8% auto;opacity:.8"')}</div>
    <div style="position:absolute;left:10%;right:10%;top:58%;height:9%;background:#3A3832;border-radius:4px"></div>
    <i style="position:absolute;left:30%;top:59%;width:${w * .08}px;height:${w * .08}px;border-radius:50%;background:${RED};display:block"></i><i style="position:absolute;left:55%;top:59%;width:${w * .08}px;height:${w * .08}px;border-radius:50%;background:${YEL};display:block"></i></div>`, x, y, o);
  const mq = n.i.querySelector('.mq');
  A(mq, [{ color: '#5B3A60', textShadow: 'none', background: '#3A1A40' }, { color: '#FFF4D0', textShadow: '0 0 18px #FF5FA0, 0 0 40px #FF5FA0', background: '#5A1F55' }], L0(t), .25, 'steps(3)');
  return n;
}
function gear(x, y, size, t, o) {
  o = o || {}; const teeth = 10, r1 = size * .5, r2 = size * .38; let d = '';
  for (let k = 0; k < teeth * 2; k++) { const a = k * Math.PI / teeth, r = k % 2 ? r2 : r1, a2 = (k + 1) * Math.PI / teeth; d += (k ? 'L' : 'M') + (Math.cos(a) * r).toFixed(1) + ' ' + (Math.sin(a) * r).toFixed(1) + 'L' + (Math.cos(a2) * r).toFixed(1) + ' ' + (Math.sin(a2) * r).toFixed(1); }
  const n = svgEl(`<path d="${d}Z" fill="${o.col || '#8E8A7E'}" stroke="${INK}" stroke-width="4"/><circle r="${size * .14}" fill="${CREAM}" stroke="${INK}" stroke-width="4"/>`, x, y, size, size, Object.assign({ vb: `${-size / 2} ${-size / 2} ${size} ${size}`, in: 'pop', t }, o));
  tick(T => { n.i.style.rotate = ((T - t) * (o.speed || 40)).toFixed(1) + 'deg'; });
  return n;
}
function wheel(x, y, size, o) { return svgEl(`<circle r="${size * .44}" fill="none" stroke="${INK}" stroke-width="${size * .08}"/><circle r="${size * .1}" fill="${INK}"/><path d="M${-size * .42} 0 L${size * .42} 0 M0 0 L0 ${size * .42}" stroke="${INK}" stroke-width="${size * .07}"/>`, x, y, size, size, Object.assign({ vb: `${-size / 2} ${-size / 2} ${size} ${size}` }, o)); }
function door(x, y, h, o) { o = o || {}; return mk(`<div style="width:${h * .48}px;height:${h}px;background:#2B2824;box-shadow:inset 0 0 0 ${h * .03}px #6B4320,8px 10px 0 rgba(20,15,5,.25)"><div style="position:absolute;left:12%;right:12%;top:6%;bottom:0;background:#FFE7A0;box-shadow:inset 0 0 40px rgba(255,180,60,.8)"></div></div>`, x, y, o); }

/* =================== CHAPTER 1 =================== */

// [1] Shenzhen, November 1998: five young men start a small software company
scene(0, { bg: 'cream', z0: 1, z1: 1.16, ox: 74, oy: 72 }, sc => {
  mk('<div style="width:1920px;height:1080px;background:linear-gradient(#F2A65A 0%,#E8845C 38%,#5E5A7E 100%);opacity:.82;mix-blend-mode:multiply"></div>', 0, 0, { in: 'fade', t: 0, d: .6 });
  mk(`<div style="width:170px;height:170px;border-radius:50%;background:#FFD27A;box-shadow:0 0 80px #FFD27A"></div>`, 1240, 170, { in: 'up', t: .1, d: 1.2, dist: 120 });
  // roadside billboard: the date lives on it
  const bb = mk(`<div style="width:640px;height:300px"><div style="position:absolute;left:150px;top:290px;width:16px;height:200px;background:${INK}"></div><div style="position:absolute;left:470px;top:290px;width:16px;height:200px;background:${INK}"></div>
    <div style="position:absolute;inset:0;background:url(tex/p_red.jpg) 0 0/1024px;box-shadow:inset 0 0 0 12px ${INK},10px 12px 0 rgba(20,15,5,.25)"></div></div>`, 300, 150, { in: 'drop', t: .2, rot: -1.5 });
  txt('1998', 320, 50, 120, { p: bb, c: false, f: 'd', col: YEL, css: { fontWeight: 800, left: '60px', top: '30px', position: 'absolute' } });
  write('November', 60, 175, 70, Wt(1, 'november'), .6, { p: bb, col: WHITE });
  txt('深圳', 470, 205, 64, { p: bb, f: 'cjk', col: YEL, in: 'fade', t: Wt(1, 'shenzhen') });
  skylineSZ(560, .05);
  // office front with a small sign that lights up
  const of = mk(`<div style="width:380px;height:330px;background:url(tex/p_grey.jpg) 0 0/1024px;box-shadow:10px 12px 0 rgba(20,15,5,.3)"><div style="position:absolute;left:40px;top:110px;width:120px;height:90px;background:#FFE7A0;box-shadow:inset 0 0 0 6px ${INK}"></div><div style="position:absolute;left:220px;top:110px;width:120px;height:220px;background:#2B2824"></div></div>`, 1380, 690, { in: 'up', t: .3, dist: 60 });
  const sign = mk(`<div style="padding:8px 26px;background:#2B2824;font:900 70px 'CJK';color:#5A3020;border-radius:8px;box-shadow:6px 8px 0 rgba(20,15,5,.3)">腾讯</div>`, 1430, 600, {});
  A(sign.i, [{ color: '#5A3020', textShadow: 'none' }, { color: '#FF6A4A', textShadow: '0 0 16px #FF3A2A,0 0 36px #FF3A2A' }], L0(Wt(1, 'company')), .3, 'steps(4)');
  // five founders walk in
  [0, 1, 2, 3, 4].forEach(k => { const p = puppet(-200 - k * 150, 770, 1.05, { shirt: ['white', 'blue', 'cream', 'teal', 'grey'][k], z: 10, glasses: k === 2 });
    p.pose(POSE.walk(Wt(1, 'five') - .4, 1, k)); p.to(Wt(1, 'five') - .4, 4.2, { x: 1680 + k * 60 }, 'linear'); });
});

// [2-3] Ma Huateng; "Pony"; 马 = horse
scene(S(2), { bg: 'kraft', tr: 'wipe' }, sc => {
  mk(`<div style="width:820px;height:980px;background:radial-gradient(circle at 50% 45%,rgba(255,207,43,.55),transparent 62%)"></div>`, 60, 60, { in: 'fade', t: S(2) });
  portrait('mahuateng', 180, 140, 820, { in: 'up', t: S(2), k: 'personY', tint: YEL, dist: 60 });
  write('Ma Huateng', 760, 300, 120, Wt(2, 'ma'), .7, { f: 'hm' });
  scrawl(roughD([[760, 440], [900, 470], [1060, 445]], 2), Wt(2, 'huateng') + .2, .35, { col: RED, sw: 9 });
  write('"Pony"', 980, 520, 150, Wt(3, 'pony'), .5, { f: 'hm', col: RED });
  const ma = txt('马', 1420, 680, 330, { f: 'cjk', col: INK });
  A(ma.i, [{ clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)' }], L0(Wt(3, 'family')), .7, EZ.io);
  A(ma.i, [{ opacity: 1, scale: 1 }, { opacity: 0, scale: .6 }], L0(Wt(3, 'horse')) - .25, .3, EZ.inn);
  const hs = svgEl(`<path d="${HORSE}" fill="${INK}"/>`, 1340, 720, 360, 230, { vb: '0 0 170 130', in: 'pop', t: Wt(3, 'horse') - .05 });
  tick(T => { const p = (T - Wt(3, 'horse')) * 9; hs.i.style.translate = `0 ${(-Math.abs(Math.sin(p)) * 26).toFixed(1)}px`; hs.i.style.rotate = (Math.sin(p) * 4).toFixed(1) + 'deg'; });
  write('= horse', 1420, 970, 60, Wt(3, 'horse') + .1, .5, { f: 'hp' });
});

// [4-5] Their first product wasn't original: ICQ goes through the photocopier; COPY stamp
scene(S(4), { bg: 'cream' }, sc => {
  // photocopier
  const cp = mk(`<div style="width:760px;height:560px">
    <div style="position:absolute;left:0;top:120px;width:760px;height:440px;background:linear-gradient(#D8D3C6,#B9B4A5);border-radius:14px;box-shadow:12px 14px 0 rgba(20,15,5,.25)"></div>
    <div style="position:absolute;left:30px;top:80px;width:700px;height:60px;background:#8E8A7E;border-radius:10px"></div>
    <div class="lb" style="position:absolute;left:40px;top:96px;width:30px;height:30px;background:#BFF4FF;box-shadow:0 0 30px 12px #9FF0FF;opacity:0"></div>
    <div style="position:absolute;left:560px;top:180px;width:150px;height:90px;background:#2B2824;border-radius:8px"><i style="position:absolute;left:20px;top:28px;width:30px;height:30px;border-radius:50%;background:#3DAA5C;display:block"></i></div>
    <div style="position:absolute;left:-120px;top:320px;width:140px;height:20px;background:#8E8A7E;transform:skewY(-6deg)"></div></div>`, 580, 330, { in: 'up', t: S(4) });
  const lb = cp.i.querySelector('.lb');
  A(lb, [{ opacity: 0, translate: '0 0' }, { opacity: 1, translate: '40px 0', offset: .1 }, { opacity: 1, translate: '640px 0', offset: .9 }, { opacity: 0, translate: '660px 0' }], L0(Wt(4, 'original')), .9, 'linear');
  const w1 = win98(680, 40, 460, 380, 'ICQ', { ic: FLOWER(), in: 'down', t: S(4) + .1, dist: 120 });
  icqList(w1, 'ICQ', FLOWER(), [['Eyal', FLOWER()], ['Moshe', FLOWER()], ['Sefi', FLOWER('#E2432A')], ['Arik', FLOWER()]]);
  w1.to(Wt(4, 'original') - .3, .4, { y: 260 }, EZ.inn); w1.out(Wt(4, 'original') + .05, .1);
  // the copy slides out of the tray
  const w2 = win98(190, 560, 460, 380, 'ICQ', { ic: FLOWER(), in: 'right', t: S(5) - .15, d: .5, dist: 280, rot: -4 });
  icqList(w2, 'ICQ', FLOWER(), [['Eyal', FLOWER()], ['Moshe', FLOWER()], ['Sefi', FLOWER('#E2432A')], ['Arik', FLOWER()]]);
  w2.i.style.filter = 'grayscale(.6) contrast(1.3)';
  rubberStamp('COPY', 420, 760, 120, Wt(5, 'copy'), { rot: -12 });
});

// [6] ICQ, built in Israel, bought by America Online
scene(S(6), { bg: 'cream', tr: 'wipeL' }, sc => {
  const m = mapView(0, 0, 1920, 1080, [8, 62, 16, 46], { hi: { il: '#3DAA5C' } });
  const il = m.P(34.9, 31.6);
  pin(il, null, Wt(6, 'israeli'), { s: 34 });
  write('Israel', il[0] - 210, il[1] + 30, 64, Wt(6, 'israeli') + .1, .5, { f: 'hm' });
  const fl = logo('icq', il[0] - 110, il[1] - 290, 220, { col: '#3DAA5C', in: 'growY', t: Wt(6, 'icq'), origin: '50% 100%' });
  svgEl(`<path d="M0 0 Q20 120 0 240" stroke="#2F7D3A" stroke-width="10" fill="none"/>`, il[0] - 5, il[1] - 80, 30, 90, { in: 'growY', t: Wt(6, 'icq') - .15 });
  ['hi!', 'uh-oh!', 'brb', 'a/s/l?'].forEach((s, k) => { const b = mk(`<div style="padding:10px 18px;background:${WHITE};border-radius:20px;font:700 34px 'Liberation Sans',Arial;box-shadow:5px 6px 0 rgba(20,15,5,.2)">${s}</div>`, il[0] + [-460, 160, -400, 190][k], il[1] + [-420, -440, -230, -250][k], { in: 'pop', t: Wt(6, 'first') + k * .12 }); b.boil(1); });
  const hd = hand(2000, il[1] - 420, 1.8, { cuff: BLUE, z: 30 });
  logo('aol', 2080, il[1] - 330, 120, { col: WHITE, sh: 0, z: 31 }).to(Wt(6, 'america') - .2, .7, { x: -1260 }, EZ.out).to(Wt(6, 'bought') + .2, .6, { x: -700, y: -260 }, EZ.inn);
  hd.to(Wt(6, 'america') - .2, .7, { x: -1260 }, EZ.out).to(Wt(6, 'bought') + .2, .6, { x: -700, y: -260 }, EZ.inn);
  fl.to(Wt(6, 'bought') + .2, .6, { x: 560, y: -260 }, EZ.inn);
});

// [7-8] February 1999: OICQ on a Win98 desktop; O = "Open"
scene(S(7), { bg: 'kraft' }, sc => {
  const c = crt(330, 70, 1260, { in: 'up', t: S(7) - .1 });
  const s = c.screen;
  el(s, `<div style="position:absolute;left:0;right:0;bottom:0;height:46px;background:#C3C3C3;box-shadow:inset 0 2px 0 #fff;display:flex;align-items:center;justify-content:space-between;padding:0 10px;font:700 22px 'Liberation Sans',Arial">
    <span style="padding:4px 12px;box-shadow:inset -2px -2px 0 #404040,inset 2px 2px 0 #fff">⊞ Start</span><span style="padding:4px 14px;box-shadow:inset 1px 1px 0 #808080,inset -1px -1px 0 #fff">Feb 1999 &nbsp; 9:41 PM</span></div>`);
  ['My Computer', 'Recycle Bin', 'Network'].forEach((nm, k) => el(s, `<div style="position:absolute;left:24px;top:${24 + k * 110}px;width:90px;text-align:center;font:18px 'Liberation Sans';color:#fff"><div style="width:52px;height:46px;margin:0 auto 6px;background:#C3C3C3;box-shadow:inset -2px -2px 0 #404040,inset 2px 2px 0 #fff"></div>${nm}</div>`));
  const w = win98(560, 140, 720, 520, '<span class="ot">O</span><span class="pn" style="display:inline-block;overflow:hidden;max-width:0;vertical-align:bottom">pen&nbsp;</span>ICQ', { ic: PENGUIN, th: 46, in: 'pop', t: Wt(7, 'released') });
  icqList(w, '网络寻呼机', PENGUIN, [['马化腾', PENGUIN], ['张志东', PENGUIN], ['许晨晔', PENGUIN], ['陈一丹', PENGUIN], ['曾李青', PENGUIN]]);
  tag('CHINESE-LANGUAGE', 1250, 210, 30, { col: 'yellow', f: 'p', in: 'drop', t: Wt(7, 'chinese'), rot: 6, z: 30 });
  const pn = w.i.querySelector('.pn'), ot = w.i.querySelector('.ot');
  A(pn, [{ maxWidth: '0px' }, { maxWidth: '140px' }], L0(S(8)), .45, EZ.out);
  A(ot, [{ background: 'transparent', color: '#fff' }, { background: YEL, color: INK }], L0(S(8)), .2);
});

// [9-10] AOL objected: arbitration claim over the OICQ web addresses
scene(S(9), { bg: 'cream', tr: 'wipe' }, sc => {
  const al = logo('aol', 180, 160, 360, { col: BLUE, in: 'pop', t: S(9) - .1 });
  A(al.i.querySelector('path'), [{ fill: BLUE }, { fill: RED }], L0(Wt(9, 'objected')), .25);
  tick(T => { const k = T - L0(Wt(9, 'objected')); al.i.style.translate = k > 0 && k < .6 ? `${(Math.sin(k * 70) * 8 * (1 - k / .6)).toFixed(1)}px 0` : '0 0'; });
  const pl = paperPlane(-200, 700, 1.4, { z: 30 });
  pl.to(Wt(10, 'filed') - .4, .8, { x: 900, y: -360, r: -8 }, EZ.out); pl.out(Wt(10, 'filed') + .4, .1);
  const d = docu(760, 150, 640, 780, { head: 'NOTICE OF ARBITRATION', hs: 40, sub: 'AMERICA ONLINE, INC. v. TENCENT', ss: 18, in: 'flip', t: Wt(10, 'filed') + .3, rot: 2, top: 200 });
  const ab = addressBar(560, 860, 980, S(9), [[S(9), 'http://www.oicq.com']], { mark: /icq/, in: 'up', t: Wt(10, 'web') - .2, z: 20 });
  scrawl(roughD([[850, 850], [775, 862], [770, 900], [850, 918], [935, 902], [930, 860], [845, 850]], 3), Wt(10, 'trademark'), .5, { col: RED, sw: 8, z: 40 });
  write('trademark!', 1180, 940, 64, Wt(10, 'trademark') + .2, .5, { f: 'hm', col: RED, z: 40 });
});

// [11-13] Renamed to QQ (address bar retyped); the penguin takes off
scene(S(11), { bg: 'yellow' }, sc => {
  addressBar(470, 140, 980, S(11), [[S(11), 'http://www.oicq.com'], [Wt(11, 'renamed'), 'http://www.qq.com']], { in: 'pop', t: S(11) - .1, h: 64, fs: 34 });
  const pg = mk(`<div style="width:420px;height:504px">${PENGUIN}</div>`, 750, 360, { in: 'pop', t: Wt(12, 'letters') + .2, z: 10 });
  pg.boil(1.2);
  txt('QQ', 1390, 560, 260, { f: 'd', col: INK, in: 'stamp', t: Wt(12, 'letters') + .35, css: { fontWeight: 800 } });
  pg.to(S(13) + .1, .9, { y: -1300, r: -6 }, EZ.inn);
  flames(820, 880, 280, S(13), { n: 4 }).to(S(13) + .1, .9, { y: -1300 }, EZ.inn);
});

// [14] A million users in year one
scene(S(14), { bg: 'cream' }, sc => {
  for (let k = 0; k < 90; k++) { const x = rr(40, 1820), y = rr(40, 980), s = rr(50, 110);
    mk(`<div style="width:${s}px;height:${s * 1.2}px">${PENGUIN}</div>`, x, y, { in: 'pop', t: S(14) + (k / 90) * 1.6, rot: rr(-20, 20) }); }
  odometer(560, 420, 120, 7, 0, 1000000, S(14), 1.8, { z: 30 });
  write('users, year one', 700, 640, 70, Wt(14, 'first'), .6, { f: 'hm', col: RED, z: 30 });
});

// [15-16] Free service, real costs; no profit until 2001
scene(S(15), { bg: 'grid', tr: 'wipeU' }, sc => {
  write('free!', 140, 110, 120, Wt(15, 'free'), .4, { f: 'hm', col: TEAL });
  [0, 1, 2].forEach(k => serverRack(150 + k * 270, 360, 540, Wt(15, 'servers') + k * .1));
  for (let k = 0; k < 12; k++) { const b = mk(banknote(110), 360, 620, { z: 20 }); A(b.i, [{ transform: 'translate(0,0) rotate(0)', opacity: 1 }, { transform: `translate(${rr(-400, 500)}px,${rr(-700, -300)}px) rotate(${rr(-200, 200)}deg)`, opacity: 0 }], L0(Wt(15, 'cost')) + k * .12, 1.2, 'ease-out'); }
  const lg = paper(1000, 170, 780, 760, { col: 'white', in: 'drop', t: S(16) - .4, rot: 2, tape: 'c' });
  mk([...Array(14)].map((_, k) => `<div style="position:absolute;left:0;top:${k * 50}px;width:700px;height:2px;background:#9FB4E6"></div>`).join('') + `<div style="position:absolute;left:130px;top:-20px;width:3px;height:720px;background:${RED};opacity:.6"></div>`, 40, 60, { p: lg, w: 700, h: 700 });
  write('LEDGER', 180, 40, 50, S(16) - .3, .4, { p: lg, f: 'hm' });
  [['1999', '– loss', RED], ['2000', '– loss', RED], ['2001', '+ profit ✓', INK]].forEach(([yr, v, c], k) => { write(yr, 60, 160 + k * 150, 70, S(16) + k * .35, .4, { p: lg, f: 'hp' }); write(v, 260, 160 + k * 150, 70, S(16) + .15 + k * .35, .5, { p: lg, f: 'hm', col: c }); });
});

// [17-20] Early 2001: growing fast, burning cash, looking for a backer
scene(S(17), { bg: 'cream' }, sc => {
  mk(`<div style="width:1920px;height:300px;background:url(tex/p_kraft.jpg) 0 0/1024px"></div>`, 0, 780, {});
  mk(`<div style="width:700px;height:520px;background:#26344F;box-shadow:inset 0 0 0 18px #6B4320,10px 12px 0 rgba(20,15,5,.25)"></div>`, 1080, 120, {});
  svgEl(`${[...Array(9)].map((_, k) => `<rect x="${30 + k * 72}" y="${180 + (k * 53) % 160}" width="58" height="${400 - (k * 53) % 160}" fill="#1A2338"/>`).join('')}${[...Array(40)].map((_, k) => `<rect x="${44 + (k % 9) * 72 + (k % 2) * 20}" y="${240 + Math.floor(k / 9) * 50}" width="10" height="14" fill="${YEL}" opacity=".8"/>`).join('')}`, 1098, 138, 664, 484, { vb: '0 0 664 484' });
  const sg = paper(1180, 220, 480, 300, { col: 'white', in: 'drop', t: S(20) - .05, rot: -3, tape: 'c', z: 30 });
  write('INVESTOR', 40, 40, 90, S(20) + .1, .5, { p: sg, f: 'hm' }); write('WANTED!', 60, 150, 100, S(20) + .5, .5, { p: sg, f: 'hm', col: RED });
  wallCalendar(160, 140, 240, [[S(17) - .5, 'DEC', '2000'], [Wt(17, 'early'), 'JAN', '2001']]);
  mk(`<div style="width:900px;height:40px;background:#6B4320;box-shadow:8px 10px 0 rgba(20,15,5,.25)"></div>`, 120, 760, {});
  const pot = mk(`<div style="width:110px;height:90px;background:#B5532E;clip-path:polygon(0 0,100% 0,85% 100%,15% 100%)"></div>`, 200, 670, {});
  const pl = svgEl(`<path d="M55 300 L55 60" stroke="#2F7D3A" stroke-width="10"/>${[0, 1, 2, 3, 4].map(k => `<ellipse cx="${k % 2 ? 90 : 20}" cy="${260 - k * 50}" rx="38" ry="16" fill="#3DAA5C" transform="rotate(${k % 2 ? -25 : 25} ${k % 2 ? 90 : 20} ${260 - k * 50})"/>`).join('')}`, 175, 370, 110, 300, { vb: '0 0 110 300', in: 'growY', t: S(18), d: .8, origin: '50% 100%' });
  cashStack(560, 700, 200, 10, S(19) - .4);
  flames(560, 690, 220, Wt(19, 'cash') - .1, { n: 4 });
  puppet(780, 440, 1.6, { shirt: 'blue' }).pose(POSE.point());
});

// [21-22] Help from the other side of the world: Naspers, est. 1915
scene(S(21), { bg: 'navy', z1: 1.05, ox: 50, oy: 50 }, sc => {
  const g = globe(1260, 560, 420, Wt(21, 'other') - .2, 1.6, 22, 112, 6, { hi: ['za', 'cn'] });
  const np = paper(110, 200, 620, 680, { col: 'cream', in: 'drop', t: Wt(22, 'naspers') - .2, rot: -2, torn: 'b' });
  txt('De Burger', 310, 90, 96, { p: np, c: true, f: 'sb', col: INK });
  mk(`<div style="width:540px;height:4px;background:${INK}"></div><div style="width:540px;height:2px;background:${INK};margin-top:6px"></div>`, 40, 150, { p: np });
  txt('KAAPSTAD · 26 JULIE 1915', 310, 190, 26, { p: np, c: true, f: 'm', col: INK });
  mk([...Array(10)].map((_, k) => `<div style="position:absolute;left:${k % 2 ? 280 : 0}px;top:${Math.floor(k / 2) * 46}px;width:240px;height:10px;background:${INK};opacity:.2"></div>`).join(''), 40, 240, { p: np, w: 540, h: 260 });
  write('Naspers, est. 1915', 60, 520, 64, Wt(22, '1915'), .7, { p: np, f: 'hm', col: RED });
  write('South Africa', 120, 940, 56, Wt(22, 'south'), .6, { f: 'hm', col: WHITE });
});

// [23] 2001: ~$32 million for 46.5%
scene(S(23), { bg: 'cream', tr: 'wipe' }, sc => {
  const ch = cheque(120, 250, 1000, 'Tencent', '$32,000,000', 'Thirty-two million dollars', Wt(23, 'paid') - .2, { in: 'drop', t: S(23) - .1, rot: -2 });
  ch.to(Wt(23, '46.5') - .5, .6, { x: -40, y: -60, r: -5, s: .8 }, EZ.io);
  logoFill('tencentqq', 1180, 220, 600, { col: BLUE, t: Wt(23, '46.5'), d: 1, p1: 46.5, in: 'pop', tin: 0 });
  write('46.5%', 1270, 860, 130, Wt(23, '46.5') + .4, .5, { f: 'hm', col: BLUE });
  write('of Tencent', 1310, 990, 56, Wt(23, 'stake'), .5, { f: 'hp' });
});

// [24-25] Hold on to that number: the cheque pinned to a corkboard
scene(S(24), { bg: 'kraft', z0: 1.08, z1: 1.0, ox: 50, oy: 50 }, sc => {
  mk(`<div style="width:1920px;height:1080px;background:radial-gradient(#0000 1.5px,transparent 2px) 0 0/14px 14px,radial-gradient(rgba(60,30,10,.25) 1.5px,transparent 2px) 7px 7px/14px 14px"></div>`, 0, 0, {});
  const ch = cheque(300, 280, 1320, 'Tencent', '$32,000,000', 'Thirty-two million dollars', S(24) - 3, { rot: -3 });
  pushpin(960, 300, Wt(24, 'hold'));
  scrawl(roughD([[1500, 425], [1240, 440], [1230, 520], [1500, 548], [1760, 520], [1750, 440], [1490, 425]], 3), S(25), .6, { col: RED, sw: 10 });
});

// [26-27] 2019: holding moved into an Amsterdam listing; worth ~€118B (~$130B). CNN
scene(S(26), { bg: 'cream', tr: 'wipeL', py1: 0 }, sc => {
  canalHouses(0, 440, 1920, S(26));
  const tk = mk(`<div style="width:1920px;height:96px;background:#111;overflow:hidden;box-shadow:0 8px 0 rgba(20,15,5,.25)"><div class="tt" style="position:absolute;top:14px;white-space:nowrap;font:700 60px 'Mono';color:#FFB000;text-shadow:0 0 12px #FF8A00">${'AMSTERDAM 2019 · NEW LISTING · PRX ▲ · NASPERS SPINS OFF TENCENT STAKE · '.repeat(4)}</div></div>`, 0, 80, { in: 'fade', t: Wt(26, '2019') - .3 });
  const tt = tk.i.querySelector('.tt'); tick(T => { tt.style.left = (400 - (T - S(26)) * 260).toFixed(0) + 'px'; });
  const ch = cheque(110, 270, 520, 'Tencent', '$32M', null, S(26) - 3, { rot: -4, z: 30 });
  const towerH = 760, tw = mk(`<div style="width:380px;height:${towerH}px">${[...Array(38)].map((_, k) => `<div style="position:absolute;left:${(k % 2) * 6}px;bottom:${k * 20}px">${banknote(370)}</div>`).join('')}</div>`, 1500, 280, { z: 25 });
  tw.i.style.transformOrigin = '50% 100%';
  A(tw.i, [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], L0(Wt(27, 'worth')), 1.4, EZ.out);
  write('€118 billion', 720, 220, 90, Wt(27, '118'), .6, { f: 'hm', col: INK, z: 40 });
  write('≈ $130 billion', 750, 330, 70, Wt(27, '130'), .6, { f: 'hm', col: RED, z: 40 });
  source('CNN', Wt(27, 'cnn'));
  logo('cnn', 1720, 960, 110, { col: RED, in: 'pop', t: Wt(27, 'cnn'), z: 40 });
});

// [28] ~$4,000 of value for every dollar; even after selling part
scene(S(28), { bg: 'grid' }, sc => {
  const one = mk(banknote(220), 150, 420, { in: 'pop', t: S(28) });
  write('$1', 210, 560, 90, S(28) + .2, .3, { f: 'hm' });
  txt('→', 470, 470, 120, { f: 'd', in: 'pop', t: Wt(28, 'value') });
  const cols = 80, rows = 50, cs = 13;
  const grid = mk(`<canvas width="${cols * cs}" height="${rows * cs}"></canvas>`, 640, 230, {});
  const cv = grid.i.querySelector('canvas'), cx = cv.getContext('2d');
  tick(T => { const k = Math.floor(4000 * easeOut(seg01(T, Wt(28, 'four'), 1.6))), cut = T > L0(Wt(28, 'already')) ? 500 : 0; if (cv._k === k + cut * 10) return; cv._k = k + cut * 10;
    cx.clearRect(0, 0, cv.width, cv.height); for (let i = 0; i < k; i++) { const x = (i % cols) * cs, y = Math.floor(i / cols) * cs; cx.fillStyle = i >= 4000 - cut ? 'rgba(73,184,120,.18)' : '#49B878'; cx.fillRect(x + 1, y + 1, cs - 3, cs * .55); } });
  write('≈ $4,000', 640, 910, 110, Wt(28, 'four') + .9, .5, { f: 'hm', col: TEAL });
  icon('scissors', 1520, 860, 160, { in: 'pop', t: Wt(28, 'already') - .2, rot: -20 });
  write('…after selling part', 1150, 1010, 46, Wt(28, 'sold'), .6, { f: 'hp' });
});

// [29-30] One of the best tech investments ever; the fuel for what came next
scene(S(29), { bg: 'kraft', tr: 'wipe' }, sc => {
  cheque(160, 300, 900, 'Tencent', '$32,000,000', 'Thirty-two million dollars', S(29) - 3, { rot: -3 });
  medal(820, 160, 300, 'BEST BET', Wt(29, 'successful'));
  const rk = rocket(1450, 380, 260, S(30) - .3, { in: 'up', t: S(30) - .3, z: 20 });
  for (let k = 0; k < 10; k++) { const b = mk(banknote(120), 900 + k * 20, 520, { z: 15 }); A(b.i, [{ transform: 'translate(0,0) rotate(0)', opacity: 0 }, { opacity: 1, offset: .1 }, { transform: `translate(${560 - k * 20}px,${80}px) rotate(${rr(-90, 90)}deg) scale(.4)`, opacity: 0 }], L0(Wt(30, 'fuel')) + k * .08, .7, 'ease-in'); }
  rk.to(Wt(30, 'next') - .2, 1.2, { y: -1400 }, EZ.inn);
  flames(1480, 820, 200, Wt(30, 'next') - .3, { n: 3 }).to(Wt(30, 'next') - .2, 1.2, { y: -1400 }, EZ.inn);
});

/* =================== CHAPTER 2 =================== */

// [32-34] Late 2000s: QQ made Tencent a giant in China; games; every games business needs hits
scene(S(32), { bg: 'cream', tr: 'wipeU' }, sc => {
  const m = mapView(0, 0, 1320, 1080, [72, 136, 15, 55], { hi: { cn: '#E9806C' } });
  const lg = paper(60, 860, 380, 160, { col: 'white', in: 'drop', t: S(32), rot: -2 });
  txt('MAP · LATE 2000s', 190, 80, 34, { p: lg, c: true, f: 'm', col: INK });
  const pg = mk(`<div style="width:300px;height:360px">${PENGUIN}</div>`, 520, 420, { z: 10 });
  pg.i.style.transformOrigin = '50% 100%';
  A(pg.i, [{ transform: 'scale(.3)' }, { transform: 'scale(1.9)' }], L0(Wt(32, 'giant')) - .2, .8, EZ.back);
  icon('pad', 560, 760, 230, { in: 'pop', t: Wt(33, 'games'), z: 12, rot: -8 });
  arcadeCab(1400, 200, 760, 'HITS', Wt(34, 'hits'), { in: 'left', t: S(34) - .3 });
});

// [35-37] Riot Games, Los Angeles; League of Legends; Tencent early investor and China distributor
scene(S(35), { bg: 'cream', tr: 'wipe' }, sc => {
  mk('<div style="width:1920px;height:1080px;background:linear-gradient(#F7C66B,#F29A6A 60%,#E8845C);opacity:.7;mix-blend-mode:multiply"></div>', 0, 0, {});
  palms(0, 620, S(35));
  write('Los Angeles', 140, 120, 90, Wt(35, 'los'), .6, { f: 'hm', col: INK });
  const st = mk(`<div style="width:520px;height:520px;background:url(tex/p_white.jpg) 0 0/1024px;box-shadow:12px 14px 0 rgba(20,15,5,.25)"></div>`, 700, 340, { in: 'up', t: S(35) + .2 });
  const dr = door(195, 140, 380, { p: st });
  logoSticker('riotgames', 830, 370, 260, { col: RED, in: 'stamp', t: Wt(35, 'riot') });
  logoSticker('leagueoflegends', 1300, 300, 300, { col: '#C89B3C', rim: '#0A1428', in: 'pop', t: Wt(36, 'league') });
  const pg = mk(`<div style="width:160px;height:192px">${PENGUIN}</div>`, 1360, 690, { in: 'up', t: Wt(37, 'investor') - .3 });
  const bag = svgEl(`<path d="M20 30 Q40 0 60 30 L76 90 Q40 110 4 90Z" fill="#C7A374" stroke="${INK}" stroke-width="4"/><text x="40" y="78" text-anchor="middle" font-family="Display" font-weight="800" font-size="36" fill="${INK}">$</text>`, 1300, 760, 90, 110, { vb: '0 0 80 110', in: 'pop', t: Wt(37, 'investor') });
  bag.to(Wt(37, 'riot') + .1, .5, { x: -260, y: -40 }, EZ.io);
  const box = mk(`<div style="width:240px;height:170px;background:#C7A374;box-shadow:inset 0 0 0 4px #8E6A3E,8px 10px 0 rgba(20,15,5,.25)"><div style="position:absolute;left:0;right:0;top:70px;height:24px;background:#E6D3A8"></div></div>`, 1560, 820, { in: 'drop', t: Wt(37, 'distributor') - .2 });
  write('→ China', 30, 100, 54, Wt(37, 'china'), .4, { p: box, f: 'hm', col: RED });
  box.to(Wt(37, 'china') + .3, .8, { x: 600 }, EZ.inn);
});

// [38-39] February 2011: ~$400M for 93% of Riot
scene(S(38), { bg: 'kraft' }, sc => {
  wallCalendar(120, 100, 300, [[S(38) - 1, 'JAN', '2011'], [Wt(38, 'february'), 'FEB', '2011']]);
  mk(`<div style="width:1920px;height:330px;background:url(tex/p_navy.jpg) 0 0/1024px"></div>`, 0, 750, {});
  const bc = mk(`<div style="width:460px;height:320px"><div style="position:absolute;left:170px;top:0;width:120px;height:60px;border:14px solid #2B2824;border-bottom:0;border-radius:20px 20px 0 0;box-sizing:border-box"></div><div style="position:absolute;left:0;top:50px;width:460px;height:270px;background:#5B3A2E;border-radius:16px;box-shadow:inset 0 -10px 0 rgba(0,0,0,.25),10px 12px 0 rgba(20,15,5,.3)"></div><div style="position:absolute;left:200px;top:150px;width:60px;height:40px;background:#E0A914;border-radius:6px"></div></div>`, 1950, 470, { z: 20 });
  bc.to(Wt(39, '400') - .5, .8, { x: -1500 }, EZ.out);
  const tg = paper(1950, 420, 300, 150, { col: 'cream', z: 21, rot: 8 });
  write('$400,000,000', 20, 40, 52, Wt(39, '400'), .6, { p: tg, f: 'hm' });
  tg.to(Wt(39, '400') - .5, .8, { x: -1240 }, EZ.out);
  logoFill('riotgames', 1180, 120, 520, { col: BLUE, base: '#E7D9D3', t: Wt(39, '93'), d: 1, p1: 93, in: 'pop', tin: 0 });
  write('93%', 1350, 640, 140, Wt(39, '93') + .5, .4, { f: 'hm', col: BLUE });
});

// [40] Brandon Beck: "Riot is going to remain completely independent."
scene(S(40), { bg: 'cream', tr: 'wipeL' }, sc => {
  const mg = paper(100, 80, 1720, 920, { col: 'white', in: 'drop', t: S(40) - .1, rot: -1 });
  mk(`<div style="position:absolute;left:860px;top:0;width:2px;height:920px;background:${INK};opacity:.15"></div>`, 0, 0, { p: mg });
  txt('GAMES INDUSTRY · 2011', 60, 40, 26, { p: mg, f: 'm', col: INK });
  portrait('brandonbeck', 120, 140, 680, { p: mg, k: 'personR', tint: RED, in: 'up', t: S(40) + .1 });
  txt('Brandon Beck, Riot Games CEO', 80, 850, 30, { p: mg, f: 'si', col: INK, in: 'fade', t: S(40) + .3 });
  txt('“', 920, 40, 300, { p: mg, f: 'sb', col: RED, in: 'pop', t: Wt(40, 'riot', 1) - .2 });
  const q = txt('Riot is going to remain <mk>completely independent.</mk>”', 960, 260, 92, { p: mg, f: 'si', col: INK, lh: 1.15, in: 'wipe', t: Wt(40, 'riot', 1) - .1, d: 1.6, css: { whiteSpace: 'normal', width: '700px' } });
  q.hl(Wt(40, 'completely'), .6);
});

// [41-44] Dec 2015 blog post: Tencent bought the rest; price undisclosed; wholly owned
scene(S(41), { bg: 'kraft' }, sc => {
  const b = browser(120, 90, 1080, 900, 'riotgames.com/blog/changes-to-pay', { in: 'up', t: S(41) });
  el(b.body, `<div style="padding:40px 60px;font:400 28px/1.5 'Serif'"><div style="font:700 50px 'Display';margin-bottom:8px">Changes to Pay at Riot</div><div style="font:20px 'Mono';color:#777;margin-bottom:30px">DECEMBER 2015</div>
    ${[...Array(5)].map(() => '<div style="height:12px;background:#ddd;margin:16px 0;border-radius:4px"></div>').join('')}<p class="hl" style="margin:24px 0">…<mk>Tencent has bought the remaining equity</mk> in Riot…</p>${[...Array(6)].map(() => '<div style="height:12px;background:#ddd;margin:16px 0;border-radius:4px"></div>').join('')}</div>`);
  const mkk = b.body.querySelector('mk'); A(mkk, [{ backgroundSize: '0% 82%' }, { backgroundSize: '100% 82%' }], L0(Wt(42, 'tencent')), .6, EZ.io);
  logoFill('riotgames', 1310, 150, 460, { col: BLUE, base: '#E7D9D3', steps: [[S(41), .01, 93, 93], [Wt(42, 'rest'), 1, 93, 100]], in: 'pop', t: S(41) + .2 });
  const pt = mk(`<div style="width:260px;height:140px;background:#F4EEDD;clip-path:polygon(18% 0,100% 0,100% 100%,18% 100%,0 50%);box-shadow:6px 8px 0 rgba(20,15,5,.25)"><div style="position:absolute;left:70px;top:44px;width:160px;height:52px;background:${INK}"></div></div>`, 1400, 700, { in: 'drop', t: Wt(43, 'price') - .1, rot: 12 });
  write('price?', 1460, 880, 64, Wt(43, 'never'), .4, { f: 'hm', col: RED });
  mk(`<div style="width:110px;height:132px">${PENGUIN}</div>`, 1640, 420, { in: 'stamp', t: Wt(44, 'wholly'), rot: 12, z: 30 });
});

// [45-49] The Tencent playbook (chalk on a coach's clipboard); nothing on the box changes (X-ray)
scene(S(45), { bg: 'cream', tr: 'wipeU' }, sc => {
  const cb = mk(`<div style="width:900px;height:960px"><div style="position:absolute;inset:0;background:#8A5A2B;border-radius:24px;box-shadow:12px 14px 0 rgba(20,15,5,.25)"></div><div style="position:absolute;left:40px;top:90px;right:40px;bottom:40px;background:#2F4A3A;border-radius:8px;box-shadow:inset 0 0 40px rgba(0,0,0,.4)"></div><div style="position:absolute;left:330px;top:10px;width:240px;height:90px;background:#B9B4A5;border-radius:14px"></div></div>`, 120, 60, { in: 'up', t: S(45) - .2 });
  const chalk = 'rgba(245,242,230,.92)';
  write('THE TENCENT PLAYBOOK', 90, 140, 56, S(45) + .2, .8, { p: cb, f: 'hm', col: chalk });
  write('1. BUY IN BIG', 100, 290, 64, S(46), .5, { p: cb, f: 'hm', col: chalk });
  svgEl(`<path d="M0 0 L50 50 M50 0 L0 50" stroke="${chalk}" stroke-width="8"/>`, 700, 300, 60, 60, { p: cb, in: 'pop', t: S(46) + .3 });
  write('2. PROMISE INDEPENDENCE', 100, 440, 56, S(47), .6, { p: cb, f: 'hm', col: chalk });
  write('3. KEEP NAME, OFFICES, CULTURE', 100, 590, 42, S(48), .9, { p: cb, f: 'hm', col: chalk });
  [0, 1, 2].forEach(k => svgEl(`<circle cx="30" cy="30" r="24" stroke="${chalk}" stroke-width="7" fill="none"/>`, 180 + k * 200, 720, 60, 60, { p: cb, in: 'pop', t: S(48) + .3 + k * .25 }));
  // the box looks the same; an X-ray band shows who is inside
  const bx = paper(1220, 180, 520, 680, { col: 'red', in: 'drop', t: S(49) - .3, rot: 2 });
  logo('riotgames', 110, 140, 300, { p: bx, col: WHITE, sh: 0 });
  const xr = mk(`<div style="width:520px;height:680px;background:#0E2A3A;overflow:hidden"><div style="position:absolute;left:150px;top:200px;width:220px;height:264px;opacity:.95;filter:invert(1) hue-rotate(180deg)">${PENGUIN}</div><div style="position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(120,220,255,.12) 0 3px,transparent 3px 8px)"></div></div>`, 0, 0, { p: bx, w: 520, h: 680 });
  A(xr.i, [{ clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', offset: .4 }, { clipPath: 'inset(0 0 0% 0)', offset: .7 }, { clipPath: 'inset(100% 0 0% 0)' }], L0(Wt(49, 'box')) - .2, 1.6, 'linear');
  write('nothing on the box changes', 1150, 920, 54, Wt(49, 'nothing'), .8, { f: 'hp' });
});

// [50-52] Independence has limits: Honor of Kings vs League of Legends (Motley Fool)
scene(S(50), { bg: 'cream' }, sc => {
  write('but independence has limits', 160, 90, 70, S(50), .8, { f: 'hm' });
  const ph = phone(220, 230, 360, { in: 'up', t: Wt(51, 'honor') - .2, rot: -6 });
  el(ph.body, `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">${mobaMap(300, '#2F5D3A')}</div>`);
  const nt = paper(130, 870, 470, 120, { col: 'yellow', in: 'drop', t: Wt(51, 'honor'), rot: 3 });
  write('Honor of Kings · Tencent', 24, 26, 46, Wt(51, 'honor') + .1, .7, { p: nt, f: 'hp' });
  tag('HIGHEST-GROSSING', 600, 300, 40, { col: 'red', in: 'stamp', t: Wt(51, 'highest'), rot: -8 });
  const mn = crt(960, 230, 820, { in: 'up', t: Wt(52, 'league') - .3, scr: '#0A1428' });
  el(mn.screen, `<div class="mm" style="position:absolute;left:${mn.sw / 2 - 170}px;top:${mn.sh / 2 - 170}px">${mobaMap(340, '#1E3B2A')}</div>`);
  logoSticker('leagueoflegends', 1680, 190, 170, { col: '#C89B3C', rim: '#0A1428', in: 'pop', t: Wt(52, 'league') });
  const ov = mk(`<div style="width:300px;height:300px;opacity:.55">${mobaMap(300, '#2F5D3A')}</div>`, 250, 450, { z: 30 });
  ov.to(Wt(52, 'clone') - .2, .8, { x: 952, y: -50, s: 1.13 }, EZ.io);
  write('a clone?', 1150, 830, 100, Wt(52, 'clone') + .5, .5, { f: 'hm', col: RED });
  source('THE MOTLEY FOOL', Wt(52, 'motley'));
});

// [53] Owner and studio compete for the same players (tug of war)
scene(S(53), { bg: 'kraft', tr: 'wipe' }, sc => {
  const ph = phone(80, 260, 300, { in: 'left', t: S(53) - .1, rot: -8 });
  el(ph.body, `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">${mobaMap(250, '#2F5D3A')}</div>`);
  const mn = crt(1380, 300, 480, { in: 'right', t: S(53) - .1, scr: '#0A1428' });
  el(mn.screen, `<div style="position:absolute;left:${mn.sw / 2 - 110}px;top:${mn.sh / 2 - 110}px">${mobaMap(220, '#1E3B2A')}</div>`);
  const sway = T => Math.sin((T - S(53)) * 2.4) * 40;
  const rope = mk(`<div style="width:1000px;height:14px;background:repeating-linear-gradient(45deg,#C7A374 0 10px,#8E6A3E 10px 20px);border-radius:7px"></div>`, 440, 640, {});
  tick(T => { rope.o.style.translate = `${sway(T).toFixed(1)}px 0`; });
  [0, 1, 2, 3, 4, 5].forEach(k => { const lft = k < 3, p = puppet(560 + k * 150, 480, 1.1, { shirt: lft ? 'red' : 'blue', in: 'pop', t: Wt(53, 'players') - .3 + k * .05 });
    p.pose(T => ({ root: (lft ? -1 : 1) * 14, ual: lft ? -70 : 70, uar: lft ? -75 : 75, lal: 0, lar: 0, ull: (lft ? 1 : -1) * 18, ulr: (lft ? -1 : 1) * 10, head: (lft ? -1 : 1) * 6 }));
    tick(T => { p.o.style.translate = `${sway(T).toFixed(1)}px 0`; }); });
  write('the same players', 760, 860, 80, Wt(53, 'same'), .6, { f: 'hm' });
});

// [54-55] June 2012: $330M into Epic Games (Cary, NC), known for Gears of War
scene(S(54), { bg: 'cream', tr: 'wipeL' }, sc => {
  const m = mapView(700, 0, 1220, 1080, [-92, -66, 26, 44], { hi: { us: '#E9C46A' } });
  const cy = m.PC('cary'); pin(cy, null, Wt(55, 'cary'), { s: 34 });
  write('Cary, North Carolina', cy[0] - 640, cy[1] - 110, 56, Wt(55, 'cary') + .1, .7, { f: 'hm' });
  wallCalendar(100, 80, 260, [[S(54) - 1, 'MAY', '2012'], [Wt(54, 'june'), 'JUN', '2012']]);
  logoSticker('epicgames', 460, 120, 280, { col: INK, in: 'stamp', t: Wt(55, 'epic') });
  cheque(80, 520, 760, 'Epic Games', '$330,000,000', null, Wt(55, '330') - .3, { in: 'drop', t: Wt(55, 'invested') - .2, rot: -3, bank: 'TENCENT HOLDINGS', date: '2012' });
  gear(1540, 780, 220, Wt(55, 'gears'), { col: '#8E2F2A' }); gear(1700, 680, 140, Wt(55, 'gears') + .1, { col: '#5B3A2E', speed: -63 });
  write('Gears of War', 1330, 960, 54, Wt(55, 'war'), .6, { f: 'hp' });
});

// [56] Tim Sweeney via Polygon: ~48.4% of shares, ~40% counting employee options
scene(S(56), { bg: 'grid' }, sc => {
  portrait('timsweeney', 90, 200, 720, { k: 'personB', tint: '#2553C7', in: 'up', t: S(56) });
  write('Tim Sweeney, founder', 120, 940, 52, S(56) + .3, .7, { f: 'hm' });
  logo('polygon', 1760, 70, 110, { col: '#FF0052', in: 'pop', t: Wt(56, 'polygon') });
  const uc = unitChart(900, 250, 12, 10, 52, { steps: [[Wt(56, '48.4') - .2, 58, BLUE]] });
  write('≈ 48.4% of shares', 900, 110, 64, Wt(56, '48.4'), .6, { f: 'hm', col: BLUE });
  // employee options join: the same stake becomes ~40%
  const ex = unitChart(900, 1030, 12, 2, 52, { base: '#E9C9A6' });
  ex.o.style.zIndex = 5; A(ex.i, [{ opacity: 0, transform: 'translateY(60px)' }, { opacity: 1, transform: 'translateY(-180px)' }], L0(Wt(56, 'employee')), .6, EZ.out);
  A(uc.i, [{ transform: 'translateY(0)' }, { transform: 'translateY(-60px)' }], L0(Wt(56, 'employee')), .6, EZ.out);
  write('→ ≈ 40% with options', 1400, 112, 50, Wt(56, '40'), .6, { f: 'hm', col: RED });
  source('TIM SWEENEY VIA POLYGON', Wt(56, 'polygon'));
});

// [57-59] Sweeney kept control; Variety: the deal changed Epic; Capps and Bleszinski left
scene(S(57), { bg: 'cream', tr: 'wipe' }, sc => {
  const p = puppet(170, 300, 1.7, { shirt: 'ink', glasses: true, in: 'up', t: S(57) - .2 });
  p.pose(T => ({ ual: -60 + Math.sin(T * 3) * 6, uar: 60 - Math.sin(T * 3) * 6, lal: -50, lar: 50, head: Math.sin(T * 2) * 3 }));
  wheel(150, 330, 230, { in: 'pop', t: S(57), z: 15 });
  write('Sweeney kept control', 70, 70, 60, S(57) + .1, .6, { f: 'hm', col: TEAL });
  const vp = paper(620, 180, 640, 760, { col: 'white', in: 'drop', t: Wt(58, 'variety') - .2, rot: -2 });
  txt('Variety', 320, 90, 120, { p: vp, c: true, f: 'sb', col: '#B40F14' });
  mk(`<div style="width:540px;height:4px;background:${INK}"></div>`, 50, 170, { p: vp });
  txt('Tencent deal “fundamentally changed” how Epic built and released games', 50, 210, 46, { p: vp, f: 'sb', col: INK, lh: 1.15, css: { whiteSpace: 'normal', width: '540px' }, in: 'wipe', t: Wt(58, 'fundamentally') - .3, d: .9 });
  mk([...Array(8)].map((_, k) => `<div style="position:absolute;left:0;top:${k * 36}px;width:${k % 3 === 2 ? 300 : 540}px;height:10px;background:${INK};opacity:.18"></div>`).join(''), 50, 440, { p: vp, w: 540, h: 300 });
  source('VARIETY', Wt(58, 'variety'));
  door(1560, 260, 600, { in: 'up', t: Wt(59, 'several') - .2 });
  [['mikecapps', 'Mike Capps', 'capps', 'grey'], ['cliffb', 'Cliff Bleszinski', 'cliff', 'red']].forEach(([key, nm, w, sh], k) => {
    const pp = puppet(1250 + k * 120, 480, 1.25, { shirt: sh, in: 'pop', t: Wt(59, w) - .3, z: 20 + k });
    pp.pose(POSE.walk(Wt(59, w) + .2, 1, k)); pp.to(Wt(59, w) + .2, 2.2, { x: 420 - k * 40 }, 'linear'); pp.out(Wt(59, w) + 2.1, .3);
    write(nm, 1230 + k * 70, 920 + k * 70, 50, Wt(59, w), .6, { f: 'hm', col: k ? RED : INK, z: 30 });
  });
});

// [60-61] The new direction led to Fortnite; April 2022: Epic valued at $31.5B
scene(S(60), { bg: 'navy', tr: 'wipeU' }, sc => {
  logo('fortnite', 260, 140, 520, { col: WHITE, in: 'drop', t: Wt(60, 'fortnite') - .1 });
  write('Fortnite', 300, 760, 140, Wt(60, 'fortnite') + .2, .6, { f: 'hm', col: YEL });
  wallCalendar(1050, 130, 230, [[S(61) - 1, 'MAR', '2022'], [Wt(61, 'april'), 'APR', '2022']], { col: BLUE });
  thermometer(1440, 140, 640, Wt(61, 'valued'), 1.4, .95, {});
  write('$31.5 billion', 1100, 860, 100, Wt(61, '31.5'), .7, { f: 'hm', col: WHITE });
  write('Epic valuation', 1130, 980, 50, Wt(61, '31.5') + .4, .5, { f: 'hp', col: 'rgba(244,238,221,.85)' });
});

// [62-65] Now do the math: ~28% of $31.5B ≈ ~$9B on paper vs a $330M check
scene(S(62), { bg: 'grid' }, sc => {
  write('Now do the math.', 140, 80, 90, S(62), .6, { f: 'hm' });
  write('stake diluted to ≈ 28%', 160, 260, 76, Wt(63, '28') - .4, .9, { f: 'hp' });
  write('28%  ×  $31.5B', 160, 400, 120, Wt(64, 'valuation') - .4, .9, { f: 'hm', col: INK });
  scrawl(roughD([[150, 560], [700, 556], [1000, 562]], 2), Wt(64, 'worth') - .3, .4, { col: INK, sw: 7 });
  write('≈ $8.8B on paper', 160, 590, 130, Wt(64, 'nine'), .7, { f: 'hm', col: TEAL });
  const base = 980;
  const b1 = mk(`<div style="width:120px;height:${(.33 / 8.8) * 700}px;background:${RED};box-shadow:6px 8px 0 rgba(20,15,5,.25)"></div>`, 1280, base - (.33 / 8.8) * 700, { in: 'growY', t: S(65) });
  const b2 = mk(`<div style="width:120px;height:700px;background:${TEAL};box-shadow:6px 8px 0 rgba(20,15,5,.25)"></div>`, 1500, base - 700, { in: 'growY', t: Wt(64, 'nine') });
  write('$330M', 1250, base + 10, 50, S(65) + .2, .4, { f: 'hm', col: RED });
  write('$8.8B', 1490, base + 10, 50, Wt(64, 'nine') + .3, .4, { f: 'hm', col: TEAL });
  cheque(700, 760, 460, 'Epic Games', '$330M', null, S(65) - .2, { in: 'drop', t: S(65) - .3, rot: 5, bank: 'TENCENT HOLDINGS' });
});

// end of preview: a teaser into chapter 3 (Tencent goes shopping in Europe)
scene(S(66), { bg: 'cream', tr: 'wipe' }, sc => {
  const p = mk(`<div style="width:220px;height:264px">${PENGUIN}</div>`, -300, 600, {});
  p.to(S(66), 3, { x: 1200 }, 'linear');
  tick(T => { p.i.style.translate = `0 ${(-Math.abs(Math.sin((T - S(66)) * 7)) * 18).toFixed(1)}px`; });
  const bag = mk(`<div style="width:150px;height:110px;background:#5B3A2E;border-radius:12px;box-shadow:6px 8px 0 rgba(20,15,5,.25)"></div>`, -150, 760, {});
  bag.to(S(66), 3, { x: 1200 }, 'linear');
  write('→ Europe', 1250, 520, 90, S(66) + 1, .6, { f: 'hm', col: BLUE });
});
