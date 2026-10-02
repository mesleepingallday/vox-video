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
  hl(t, d, k) { const m = this.i.querySelectorAll('mk')[k || 0]; if (m) A(m, [{ backgroundSize: '0% 82%' }, { backgroundSize: '100% 82%' }], t - LEAD, d || .45, EZ.io); return this; }
  strike(t, d, k) { const m = this.i.querySelectorAll('sk')[k || 0]; if (m) A(m, [{ backgroundSize: '0% 12%' }, { backgroundSize: '100% 12%' }], t - LEAD, d || .35, EZ.io); return this; }
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
function stroke(d, t, dur, o) {  // draw-on path; dashed paths draw on through a solid mask
  o = o || {}; const s = o.svg || overlaySvg(o), NS = 'http://www.w3.org/2000/svg';
  const p = document.createElementNS(NS, 'path'); p.setAttribute('d', d); p.setAttribute('fill', 'none');
  p.setAttribute('stroke', o.col || (cur.dark ? '#F4EEDD' : '#1A1814')); p.setAttribute('stroke-width', o.sw || 6);
  p.setAttribute('stroke-linecap', 'round'); p.setAttribute('stroke-linejoin', 'round'); s.appendChild(p);
  const draw = el => A(el, [{ strokeDashoffset: 1, opacity: 0 }, { strokeDashoffset: .985, opacity: 1, offset: .015 }, { strokeDashoffset: 0, opacity: 1 }], t - LEAD, dur || .4, o.ease || EZ.io);
  if (o.dash) {
    p.setAttribute('stroke-dasharray', o.dash);
    const id = 'mk' + (stroke.n = (stroke.n || 0) + 1), m = document.createElementNS(NS, 'mask');
    m.setAttribute('id', id); m.setAttribute('maskUnits', 'userSpaceOnUse');
    m.setAttribute('x', -W); m.setAttribute('y', -H); m.setAttribute('width', W * 3); m.setAttribute('height', H * 3);
    const q = document.createElementNS(NS, 'path'); q.setAttribute('d', d); q.setAttribute('fill', 'none'); q.setAttribute('stroke', '#fff');
    q.setAttribute('stroke-width', (o.sw || 6) + 8); q.setAttribute('stroke-linecap', 'round'); q.setAttribute('pathLength', '1'); q.style.strokeDasharray = '1 2';
    m.appendChild(q); s.appendChild(m); p.setAttribute('mask', `url(#${id})`); draw(q);
  } else { p.setAttribute('pathLength', '1'); p.style.strokeDasharray = '1 2'; draw(p); }
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
