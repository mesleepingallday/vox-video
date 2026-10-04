'use strict';
/* v3 proof: sentences 4-16 ("It was a copy" -> QQ -> a million users -> no profit until 2001) in one continuous world. */
scene(S(4) - 1, { bg: 'ground', z0: 1, z1: 1 }, sc => {
  const Wd = world({ w: 12000, h: 3600 });
  const P = (html, x, y, o) => put(html, x, y, Object.assign({ w0: Wd }, o || {}));
  const cutW = (inner, x, y, w, h, o) => cut(inner, x, y, w, h, Object.assign({ w0: Wd }, o || {}));
  const T = (text, x, y, size, o) => ty(text, x, y, size, Object.assign({ w0: Wd }, o || {}));
  const rule = (x, y, w, t, o) => { o = o || {}; const n = P(`<div style="width:${w}px;height:${o.h || 2}px;background:${o.col || C.ink}"></div>`, x, y); if (t !== undefined) enter(n, 'wipe', t, .9); return n; };

  // page furniture: faint text columns and rules so the world reads as one editorial layout
  [[60, 1000, 300, 900], [2050, 1250, 560, 700], [3990, 1000, 560, 1300], [4100, 2560, 760, 700], [6450, 900, 520, 600], [6600, 2500, 1300, 500], [8600, 1250, 560, 900], [10950, 260, 420, 1100]].forEach(([x, y, w, h], k) => {
    const cols = Math.max(1, Math.round(w / 200)), cw = (w - (cols - 1) * 24) / cols; let html = '';
    for (let c = 0; c < cols; c++) for (let r = 0; r < Math.floor(h / 26); r++) html += `<i style="position:absolute;left:${c * (cw + 24)}px;top:${r * 26}px;width:${(r % 7 === 6 ? .55 : .97) * cw}px;height:7px;background:${C.ink};opacity:.09;display:block"></i>`;
    P(`<div style="position:relative;width:${w}px;height:${h}px"><i style="position:absolute;left:0;top:-22px;width:${w}px;height:2px;background:${C.ink};opacity:.25;display:block"></i>${html}</div>`, x, y);
  });
  /* ---- A · the copy (4-5) ---- */
  T('Technology', 380, 230, 22, { f: 'm', wt: 600, upper: true, ls: '.16em', t: S(4) - .6, reveal: 'fade' });
  rule(380, 268, 1880, S(4) - .6);
  T('COPY', 1230, 360, 400, { f: 'd', wt: 900, col: C.blue, t: Wt(5, 'copy') - .1, z: 1, css: { opacity: .95 } });
  const icq = l => W98('ICQ', contactList('ICQ', flower('#3DAA5C', 26), [['Yossi', flower('#3DAA5C', 18)], ['Arik', flower('#3DAA5C', 18)], ['Sefi', flower('#E5402B', 18)], ['Amnon', flower('#3DAA5C', 18)], ['Dana', flower('#3DAA5C', 18)]], 19), { w: 400, h: 500, ic: flower('#3DAA5C', 22) });
  const a1 = cutW(icq(), 420, 330, 420, 520, { t: S(4), z: 5, rot: -2 });
  const a2 = cutW(icq(), 420, 330, 420, 520, { z: 4, rot: -2 });
  a2.to(Wt(5, 'copy') - .25, .7, { x: 380, y: 90, r: 5 }, E3.out);
  caption('ICQ, 1996: the template for instant messaging.', 1240, 800, S(4) + .6, { w0: Wd, w: 560, size: 28 });

  /* ---- B · ICQ, Israel; bought by America Online (6) ---- */
  const map = dotMap(2700, 180, 1300, 1000, [24, 42, 26, 38], { w0: Wd, hi: { il: 1 }, t: S(6) - .9, d: 1.4, pitch: 12, r: 3.6, col: 'rgba(21,21,21,.75)' });
  const ta = map.P(34.78, 32.08);
  P(`<div style="width:22px;height:22px;border-radius:50%;background:${C.blue};box-shadow:0 0 0 6px rgba(0,82,217,.18)"></div>`, ta[0] - 11, ta[1] - 11, { in: 'fade', t: Wt(6, 'israeli') });
  T('Tel Aviv', ta[0] + 26, ta[1] - 16, 30, { f: 't', wt: 600, t: Wt(6, 'israeli') + .1 });
  sticker('icq', ta[0] - 330, ta[1] - 470, 300, { w0: Wd, col: '#3DAA5C', t: Wt(6, 'icq'), z: 10, rot: -4 });
  caption('ICQ was built by Mirabilis, an Israeli start-up, and launched in 1996 as one of the first internet chat programs.', 4050, 380, Wt(6, 'first') - .3, { w0: Wd, w: 520, size: 28 });
  const aol = cutW(`<div style="width:100%;height:100%;background:#fff;display:flex;align-items:center;justify-content:center">${markSVG('aol', 230, '#0A0A0A')}</div>`, ta[0] - 70, ta[1] - 300, 420, 230, { t: Wt(6, 'america'), z: 12, rot: 5, enter: 'slide', dx: 260, dy: -60 });
  caption('1998: America Online buys ICQ.', 4050, 780, Wt(6, 'bought'), { w0: Wd, w: 520, size: 28 });

  /* ---- C · Shenzhen, February 1999: OICQ (7-8) ---- */
  dateline('Shenzhen · February 1999', 4740, 160, Wt(7, 'february'), { w0: Wd, size: 26 });
  rule(4740, 205, 1300, Wt(7, 'february'));
  const crt = crtV(4800, 260, 1100, { w0: Wd, t: S(7) - 1, z: 5 });
  const s = crt.screen;
  el3(s, `<div style="position:absolute;left:0;right:0;bottom:0;height:40px;background:#C3C3C3;box-shadow:inset 0 2px 0 #fff;display:flex;align-items:center;justify-content:space-between;padding:0 10px;font:700 19px 'Text'"><span style="padding:3px 12px;box-shadow:inset -2px -2px 0 #404040,inset 2px 2px 0 #fff">Start</span><span style="padding:3px 12px;box-shadow:inset 1px 1px 0 #808080,inset -1px -1px 0 #fff;font-family:Mono">2/1999 21:41</span></div>`);
  ['My Computer', 'Network', 'Recycle Bin'].forEach((nm, k) => el3(s, `<div style="position:absolute;left:22px;top:${22 + k * 100}px;width:90px;text-align:center;font:16px 'Text';color:#fff"><div style="width:46px;height:40px;margin:0 auto 6px;background:#C3C3C3;box-shadow:inset -2px -2px 0 #404040,inset 2px 2px 0 #fff"></div>${nm}</div>`));
  const ow = el3(s, `<div style="position:absolute;left:220px;top:40px">${W98('<span class="o1">O</span><span class="opn" style="display:inline-block;overflow:hidden;max-width:0;vertical-align:top">pen&nbsp;</span>ICQ', contactList('网络寻呼机', qq(C.ink, 24), [['马化腾', qq(C.ink, 16)], ['张志东', qq(C.ink, 16)], ['许晨晔', qq(C.ink, 16)], ['陈一丹', qq(C.ink, 16)], ['曾李青', qq(C.ink, 16)]], 18), { w: 470, h: 470, th: 34, ic: qq('#fff', 24) })}</div>`);
  A(ow, [{ transform: 'scale(.2)', opacity: 0, transformOrigin: '0 0' }, { transform: 'scale(1)', opacity: 1, transformOrigin: '0 0' }], L0(Wt(7, 'released')), .5, E3.out);
  A(ow.querySelector('.opn'), [{ maxWidth: '0px' }, { maxWidth: '110px' }], L0(S(8)), .6, E3.out);
  A(ow.querySelector('.o1'), [{ background: 'transparent' }, { background: C.blue }], L0(S(8)), .3);
  caption('A Chinese-language version, released by Tencent.', 5960, 860, Wt(7, 'chinese'), { w0: Wd, w: 480, size: 28 });

  /* ---- D · AOL objects: arbitration over the web addresses (9-10) ---- */
  const doc = cutW(`<div style="padding:56px 60px;font:400 20px/1.6 'News';color:${C.ink}">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:34px">${markSVG('aol', 90, '#0A0A0A')}<span style="font:500 15px 'Mono';letter-spacing:.1em">ARBITRATION · 1999</span></div>
      <div style="font:700 44px/1.1 'News';margin-bottom:22px">Claim regarding the domain names<br><span class="dm" style="position:relative">oicq.com <span style="color:${C.grey}">&amp;</span> oicq.net</span></div>
      ${[...Array(9)].map((_, k) => `<div style="height:9px;background:${C.ink};opacity:.16;margin:15px 0;width:${k % 4 === 3 ? 58 : 96}%"></div>`).join('')}
      <div style="margin-top:26px;font:italic 400 22px 'News'">…infringes the <b style="font-style:normal">ICQ</b> trademark.</div></div>`, 4900, 1450, 820, 1040, { t: Wt(9, 'objected') - .2, z: 5, rot: -1.5 });
  const dm = doc.i.querySelector('.dm');
  el3(dm, `<i style="position:absolute;left:0;right:0;bottom:-6px;height:5px;background:${C.red};transform-origin:0 50%;display:block"></i>`);
  A(dm.lastChild, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], L0(Wt(10, 'web')), .6, E3.inOut);
  T('ICQ<span style="font-size:.35em;vertical-align:top;font-weight:700">®</span>', 5860, 1700, 300, { f: 'd', wt: 900, col: '#3DAA5C', t: Wt(10, 'trademark') - .1 });
  caption('AOL filed an arbitration claim in the United States.', 5880, 2080, Wt(10, 'arbitration'), { w0: Wd, w: 500, size: 28 });

  /* ---- E · renamed: OICQ loses three letters; QQ (11-13) ---- */
  const wd = cutWord('OICQ', 7000, 1820, 430, { w0: Wd, t: S(11) - .9, step: .08 });
  const [lO, lI, lC, lQ] = wd.letters, ren = L0(Wt(11, 'renamed')) + .1;
  [lO, lI, lC].forEach((L, k) => A(L.o, [{ transform: 'translate(0,0) rotate(0deg)', opacity: 1 }, { transform: `translate(${(k - 1) * 60}px,${-90 - k * 20}px) rotate(${[-8, 5, 10][k]}deg)`, opacity: 1, offset: .35 }, { transform: `translate(${(k - 1) * 140}px,900px) rotate(${[-40, 30, 55][k]}deg)`, opacity: 0 }], ren + k * .08, 1.1, 'cubic-bezier(.5,0,.75,0)'));
  A(lQ.o, [{ transform: 'translateX(0)' }, { transform: `translateX(${-wd.width + 430 * .8}px)` }], L0(Wt(12, 'letters')) - .3, .7, E3.inOut);
  const q2 = cutWord('Q', 7000 + 430 * .8, 1820, 430, { w0: Wd, col: C.blue });
  enter(q2.letters[0], 'lay', Wt(12, 'qq') - .05, .7);
  // the penguin takes off: rises out of the letters, the camera follows it up
  const pg = P(`<svg width="300" height="300" class="pgs" viewBox="-1.6 -1.6 27.2 27.2" style="display:block;overflow:visible"><path d="${LOGO.tencentqq}" fill="${C.white}" stroke="${C.white}" stroke-width="2.6" stroke-linejoin="round"/><path d="${LOGO.tencentqq}" fill="${C.ink}"/></svg>`, 7230, 1900, { cls: 'co', z: 20 });
  A(pg.i, [{ transform: 'translateY(260px) scale(.6)', opacity: 0 }, { transform: 'translateY(0) scale(1)', opacity: 1, offset: .25 }, { transform: 'translateY(-1180px) scale(.9)', opacity: 1 }], L0(S(13)) - .1, 1.6, 'cubic-bezier(.45,0,.2,1)');
  A(pg.o, [{ opacity: 1 }, { opacity: 0 }], L0(Wt(14, 'million')) - .2, .4);

  /* ---- F · a million users in the first year (14) ---- */
  const big = dotNumber('1,000,000', 6520, 300, 380, Wt(14, 'million') - .7, 1.5, { w0: Wd, mark: 'tencentqq', cell: 21 });
  caption('QQ users in its first year.', 6560, 760, Wt(14, 'first'), { w0: Wd, w: 480, size: 28 });

  /* ---- G · free, but every user costs servers and bandwidth; no profit until 2001 (15-16) ---- */
  const zero = cutWord('¥0', 8820, 260, 300, { w0: Wd, cols: [C.blue, C.blue], t: Wt(15, 'free') - .1, adv: () => 300 * .66 });
  caption('The service was free.', 8840, 640, Wt(15, 'free') + .2, { w0: Wd, w: 400, size: 28 });
  [0, 1, 2].forEach(k => { const r = cutW(rackV(220, 560), 9420 + k * 260, 240, 240, 580, { t: Wt(15, 'servers') + k * .1, z: 5 }); blinkLeds(r); });
  for (let k = 0; k < 9; k++) { const x0 = 9420 + 260 * (k % 3) + 90 + Math.floor(k / 3) * 24, yy = 900 + k * 14;  // neat cable bundle routed to the results table
    stroke(`M${x0} 822 L${x0} ${yy - 30} Q${x0} ${yy} ${x0 + 30} ${yy} L${10560 - k * 6} ${yy} Q${10590 - k * 6} ${yy} ${10590 - k * 6} ${yy - 30} L${10590 - k * 6} 830`, Wt(15, 'bandwidth') + k * .05, 1.1, { svg: wsvg(Wd), sw: 4, col: k % 3 === 1 ? C.blue : C.ink }); }
  caption('Every new user meant more servers and bandwidth.', 8840, 1060, Wt(15, 'every'), { w0: Wd, w: 640, size: 28 });
  const tb = cutW(`<div style="padding:34px 40px;font:400 18px 'Text';color:${C.ink}">
      <div style="font:700 34px/1.1 'News';border-bottom:2px solid ${C.ink};padding-bottom:12px;margin-bottom:8px">Tencent, results</div>
      <div style="font:500 14px 'Mono';letter-spacing:.1em;color:${C.grey};margin-bottom:6px">FISCAL YEAR · NET RESULT</div>
      ${[['1999', 'LOSS', C.red, 0], ['2000', 'LOSS', C.red, 1], ['2001', 'PROFIT', C.blue, 2]].map(([y, v, c, k]) => `<div class="row" style="display:flex;justify-content:space-between;border-bottom:1px solid rgba(21,21,21,.2);padding:14px 0;font:600 34px 'Mono'"><span>${y}</span><span style="color:${c}">${v}</span></div>`).join('')}</div>`,
    10250, 300, 600, 520, { t: S(16) - .4, z: 6, rot: 1.5 });
  tb.i.querySelectorAll('.row').forEach((r, k) => A(r, [{ opacity: 0, transform: 'translateX(-20px)' }, { opacity: 1, transform: 'translateX(0)' }], L0(S(16)) + .1 + k * .35, .5, E3.out));

  /* ---- camera ---- */
  Wd.cam([
    { t: S(4) - 1, d: 0, x: 900, y: 600, z: 1.18 },
    { t: Wt(5, 'copy') + .3, d: 1.3, x: 1290, y: 600, z: 1.0 },
    { t: S(6) + .4, d: 1.6, x: 3560, y: 690, z: .92 },
    { t: S(7) + .5, d: 1.7, x: 5420, y: 780, z: .9 },
    { t: S(8) + .5, d: 1.0, x: 5330, y: 520, z: 1.45 },
    { t: S(9) + .6, d: 1.4, x: 5700, y: 1960, z: .9 },
    { t: S(11) + .4, d: 1.4, x: 7620, y: 2060, z: 1.0 },
    { t: Wt(12, 'letters') + .5, d: .9, x: 7350, y: 2060, z: 1.12 },
    { t: S(13) + 1.1, d: 1.3, x: 7460, y: 580, z: .98 },
    { t: S(15) + .6, d: 1.6, x: 9640, y: 660, z: .95 },
    { t: S(16) + .6, d: 1.2, x: 9880, y: 640, z: .9 },
  ]);
});
scene(S(17), { bg: 'ground' }, () => {});

/* helpers local to the proof */
function el3(parent, html) { const d = document.createElement('div'); d.innerHTML = html.trim(); const e = d.firstChild; parent.appendChild(e); return e; }
function wsvg(Wd) { if (!Wd._svg) { const s = document.createElementNS(SVGNS, 'svg'); s.setAttribute('width', 12000); s.setAttribute('height', 3600); s.style.cssText = 'position:absolute;left:0;top:0;overflow:visible;pointer-events:none'; Wd.el.appendChild(s); Wd._svg = s; } return Wd._svg; }
