'use strict';
/* v3 print kit: one physical world of printed, cut-out objects filmed by one camera. See DESIGN_SYSTEM.md. */
const C = { paper: '#F2EFE8', ink: '#151515', blue: '#0052D9', red: '#E5402B', grey: '#8C8A84', white: '#FBFAF6', line: 'rgba(21,21,21,.85)' };
const E3 = { out: 'cubic-bezier(.16,1,.3,1)', inOut: 'cubic-bezier(.65,0,.35,1)', in: 'cubic-bezier(.55,0,1,.45)' };
const SVGNS = 'http://www.w3.org/2000/svg';
const L0 = t => t - LEAD, lerp = (a, b, x) => a + (b - a) * x, seg01 = (T, t, d) => clamp((T - t) / d, 0, 1);
const eOut = x => x >= 1 ? 1 : 1 - Math.pow(2, -10 * x), eIO = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

/* ---------- the world and its camera ---------- */
// A large layout plane inside the current scene. cam keys: [{t, d, x, y, z, r}] -> the camera centres on world (x, y).
function world(o) {
  o = o || {}; const el = document.createElement('div');
  el.style.cssText = `position:absolute;left:0;top:0;width:${o.w || 12000}px;height:${o.h || 6000}px;transform-origin:0 0;will-change:transform`;
  cur.cam.appendChild(el);
  if (o.ground !== false) el.style.background = `${C.paper} url(tex/bg_ground.jpg) 0 0/1024px`;
  const W = { el, i: el, keys: [] };
  W.cam = keys => { W.keys = keys; return W; };
  W.at = T => {  // camera state at time T (eased between keys, with a slow drift on top)
    const k = W.keys; let s = k[0];
    for (let j = 1; j < k.length; j++) { const a = k[j - 1], b = k[j]; if (T >= b.t) { s = b; continue; }
      if (T > b.t - b.d) { const p = eIO((T - (b.t - b.d)) / b.d); s = { x: lerp(a.x, b.x, p), y: lerp(a.y, b.y, p), z: Math.exp(lerp(Math.log(a.z), Math.log(b.z), p)), r: lerp(a.r || 0, b.r || 0, p), t: a.t }; } else s = a; break; }
    const drift = 1 + Math.min(T - (s.t || 0), 8) * (o.drift === undefined ? .004 : o.drift);
    return { x: s.x + Math.sin(T * .21) * 6, y: s.y + Math.cos(T * .17) * 4, z: s.z * drift, r: (s.r || 0) + Math.sin(T * .13) * .15 };
  };
  tick(T => { const c = W.at(T); el.style.transform = `translate(960px,540px) rotate(${c.r.toFixed(3)}deg) scale(${c.z.toFixed(5)}) translate(${(-c.x).toFixed(2)}px,${(-c.y).toFixed(2)}px)`; });
  return W;
}
// add a node to the world (or another parent) at world coordinates
function put(html, x, y, o) { o = o || {}; return mk(html, x, y, Object.assign({}, o, { p: o.p || (o.w0 ? { i: o.w0.el } : undefined) })); }

/* ---------- printed cut-out ---------- */
function cutEdge(w, h, seed) {  // scissor-cut polygon: straight runs with slight deviation
  const R2 = rnd(seed || Math.floor(w * 7 + h * 13)), pts = [], j = 1.2;
  const side = (x1, y1, x2, y2) => { const L = Math.hypot(x2 - x1, y2 - y1), n = Math.max(1, Math.round(L / 90));
    for (let k = 0; k < n; k++) { const f = k / n; pts.push([x1 + (x2 - x1) * f + (R2() - .5) * 2 * j, y1 + (y2 - y1) * f + (R2() - .5) * 2 * j]); } };
  side(0, 0, w, 0); side(w, 0, w, h); side(w, h, 0, h); side(0, h, 0, 0);
  return 'polygon(' + pts.map(p => `${p[0].toFixed(1)}px ${p[1].toFixed(1)}px`).join(',') + ')';
}
// cut(innerHTML, x, y, w, h, o): w/h are the printed area INCLUDING the 10 px border. o.enter: 'lay'|'slide'|'drop'|'fade'|null
function cut(inner, x, y, w, h, o) {
  o = o || {};
  const n = put(`<div class="pr" style="width:${w}px;height:${h}px;clip-path:${cutEdge(w, h, o.seed)};${o.bg ? 'background:' + o.bg : ''};padding:${o.pad === undefined ? 10 : o.pad}px"><div style="position:relative;width:100%;height:100%;overflow:hidden">${inner}</div></div>`, x, y, Object.assign({}, o, { cls: 'co ' + (o.cls || ''), in: null }));
  if (o.rot) { n.o.style.rotate = o.rot + 'deg'; n.st.r = o.rot; }
  enter(n, o.enter === undefined ? 'lay' : o.enter, o.t, o.d, o);
  n.body = n.i.querySelector('.pr>div'); n.w = w; n.h = h; return n;
}
function enter(n, how, t, d, o) {
  if (!how || t === undefined) return n; o = o || {}; const e = n.i;
  const k = {
    lay: [{ transform: 'translate(-24px,-40px) scale(1.035)', opacity: 0 }, { opacity: 1, offset: .35 }, { transform: 'translate(0,0) scale(1)', opacity: 1 }],
    slide: [{ transform: `translate(${o.dx || -160}px,${o.dy || 0}px)`, opacity: 0 }, { opacity: 1, offset: .3 }, { transform: 'translate(0,0)', opacity: 1 }],
    drop: [{ transform: 'translate(0,-120px)', opacity: 0 }, { opacity: 1, offset: .3 }, { transform: 'translate(0,0)', opacity: 1 }],
    fade: [{ opacity: 0 }, { opacity: 1 }],
    rise: [{ transform: 'translate(0,60px)', opacity: 0 }, { opacity: 1, offset: .4 }, { transform: 'translate(0,0)', opacity: 1 }],
    wipe: [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)' }],
  }[how];
  A(e, k, L0(t), d || (how === 'fade' ? .5 : .8), how === 'wipe' ? E3.inOut : E3.out); return n;
}
function leave(n, t, how, d) {
  const k = { fade: [{ opacity: 1 }, { opacity: 0 }], up: [{ translate: '0 0', opacity: 1 }, { translate: '0 -140px', opacity: 0 }], left: [{ translate: '0 0', opacity: 1 }, { translate: '-300px 0', opacity: 0 }] }[how || 'fade'];
  A(n.o, k, L0(t), d || .4, E3.in); return n;
}

/* ---------- type ---------- */
// ty(text, x, y, size, o): o.f 'd' display | 't' text | 'm' mono | 'n' newspaper serif | 'ni'; o.w wraps; o.reveal 'lines'|'words'|'fade'|'wipe'
function ty(text, x, y, size, o) {
  o = o || {};
  const css = { fontSize: size + 'px', color: o.col || C.ink, lineHeight: o.lh || (o.f === 't' || o.f === 'm' ? 1.35 : 1.0), letterSpacing: o.ls || (o.f === 'm' ? '.02em' : (o.f === 't' ? '0' : '-.02em')) };
  if (o.wt) css.fontWeight = o.wt; if (o.al) css.textAlign = o.al; if (o.w) { css.whiteSpace = 'normal'; css.width = o.w + 'px'; }
  if (o.upper) css.textTransform = 'uppercase'; if (o.css) Object.assign(css, o.css);
  const lines = Array.isArray(text) ? text : [text];
  const html = lines.map(l => `<div class="ln" style="overflow:hidden;padding-bottom:.08em;margin-bottom:-.08em"><div class="li">${o.reveal === 'words' ? l.split(' ').map(w => `<span class="w">${w}</span>`).join(' ') : l}</div></div>`).join('');
  const n = put(html, x, y, Object.assign({}, o, { cls: 'tx ' + (o.f || 'd'), css, in: null, c: o.c }));
  const t = o.t; if (t === undefined) return n;
  if (o.reveal === 'words') n.i.querySelectorAll('.w').forEach((s, k) => A(s, [{ transform: 'translateY(105%)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }], L0(t) + k * (o.step || .06), o.d || .7, E3.out));
  else if (o.reveal === 'fade') A(n.i, [{ opacity: 0 }, { opacity: 1 }], L0(t), o.d || .6, 'ease-out');
  else if (o.reveal === 'wipe') A(n.i, [{ clipPath: 'inset(-10% 100% -10% 0)' }, { clipPath: 'inset(-10% -2% -10% 0)' }], L0(t), o.d || .8, E3.inOut);
  else n.i.querySelectorAll('.li').forEach((s, k) => A(s, [{ transform: 'translateY(110%)' }, { transform: 'translateY(0)' }], L0(t) + k * (o.step || .08), o.d || .8, E3.out));
  return n;
}
function caption(text, x, y, t, o) {  // newspaper caption: hairline rule + Inter
  o = o || {}; const w = o.w || 420;
  const n = put(`<div style="width:${w}px;border-top:1.5px solid ${o.col || C.ink};padding-top:10px;font:500 ${o.size || 21}px/1.35 'Text';color:${o.col || C.ink}">${text}</div>`, x, y, o);
  A(n.i, [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }], L0(t), .6, E3.out); return n;
}
function dateline(text, x, y, t, o) { o = o || {}; return ty(text, x, y, o.size || 22, Object.assign({ f: 'm', wt: 600, upper: true, ls: '.14em', t, col: o.col || C.ink }, o)); }
function credit(text, t) { const n = ty('SOURCE · ' + text, 70, 1012, 18, { f: 'm', ls: '.1em', col: 'rgba(21,21,21,.6)', t, reveal: 'fade', z: 50 }); return n; }

/* ---------- marks ---------- */
const markSVG = (name, size, col, o) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" style="display:block;overflow:visible"><path d="${LOGO[name]}" fill="${col || C.ink}"/></svg>`;
// a printed sticker of a brand mark: the mark itself is cut out with a white border following its outline
function sticker(name, x, y, size, o) {
  o = o || {}; const col = o.col || C.ink;
  const n = put(`<svg width="${size}" height="${size}" viewBox="-1.6 -1.6 27.2 27.2" style="display:block;overflow:visible"><path d="${LOGO[name]}" fill="${C.white}" stroke="${C.white}" stroke-width="2.6" stroke-linejoin="round"/><path d="${LOGO[name]}" fill="${col}"/></svg>`, x, y, Object.assign({}, o, { cls: 'co', in: null }));
  enter(n, o.enter === undefined ? 'lay' : o.enter, o.t, o.d, o); return n;
}

/* ---------- cut-paper letters (each glyph a separate printed piece) ---------- */
function cutWord(word, x, y, size, o) {
  o = o || {}; const g = put('', x, y, o); g.letters = [];
  let cx = 0; const adv = o.adv || (ch => size * (ch === 'I' ? .32 : ch === 'Q' || ch === 'O' ? .8 : .72));
  [...word].forEach((ch, k) => {
    const L = put(`<svg width="${size}" height="${size * 1.1}" style="display:block;overflow:visible"><text x="0" y="${size * .86}" font-family="Display" font-weight="900" font-size="${size}" letter-spacing="-.02em" fill="${(o.cols && o.cols[k]) || o.col || C.ink}" stroke="${C.white}" stroke-width="${size * .07}" stroke-linejoin="round" paint-order="stroke">${ch}</text></svg>`, cx, 0, { p: g, cls: 'co' });
    if (o.t !== undefined) enter(L, o.enter || 'lay', o.t + k * (o.step || .07), .7);
    g.letters.push(L); cx += adv(ch);
  });
  g.width = cx; return g;
}

/* ---------- halftone dot map (Natural Earth land as printed dots) ---------- */
function dotMap(x, y, w, h, view, o) {
  o = o || {}; const [a0, a1, b0, b1] = view, px = l => (l - a0) / (a1 - a0) * w, py = l => (b1 - l) / (b1 - b0) * h;
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const cx = cv.getContext('2d');
  const off = document.createElement('canvas'); off.width = w; off.height = h; const ox = off.getContext('2d');
  const paint = (rings, col) => { ox.fillStyle = col; ox.beginPath(); for (const r of rings) { r.forEach(([lo, la], i) => i ? ox.lineTo(px(lo), py(la)) : ox.moveTo(px(lo), py(la))); ox.closePath(); } ox.fill('evenodd'); };
  paint(LAND50, '#f00'); for (const k in (o.hi || {})) paint(COUNTRY[k], '#00f');
  const data = ox.getImageData(0, 0, w, h).data, pitch = o.pitch || 11;
  for (let yy = pitch / 2; yy < h; yy += pitch) for (let xx = ((yy / pitch) % 2) * pitch / 2 + pitch / 2; xx < w; xx += pitch) {
    const i = (Math.floor(yy) * w + Math.floor(xx)) * 4; if (data[i + 3] < 10) continue;
    cx.fillStyle = data[i + 2] > 128 ? (o.hiCol || C.blue) : (o.col || C.ink); cx.beginPath(); cx.arc(xx, yy, (o.r || 3.2) * (data[i + 2] > 128 ? 1.15 : 1), 0, Math.PI * 2); cx.fill(); }
  const n = put('', x, y, Object.assign({ w, h }, o)); n.i.appendChild(cv); cv.style.display = 'block';
  if (o.t !== undefined) A(n.i, [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)' }], L0(o.t), o.d || 1.2, E3.inOut);
  n.P = (lo, la) => [x + px(lo), y + py(la)]; return n;
}

/* ---------- numbers made of marks (dot-matrix numerals) ---------- */
// marks fill the glyph shapes of `text` progressively between t and t+d. o.mark: 'dot' | logo name
function dotNumber(text, x, y, H, t, d, o) {
  o = o || {}; const cell = o.cell || 14, W = Math.ceil(H * .62 * text.length) + 40, Hh = Math.ceil(H * 1.1);
  const cv = document.createElement('canvas'); cv.width = W; cv.height = Hh; const cx = cv.getContext('2d');
  const n = put('', x, y, Object.assign({ w: W, h: Hh }, o)); n.i.appendChild(cv);
  const glyph = o.mark && o.mark !== 'dot' ? new Path2D(LOGO[o.mark]) : null; let order = null;
  const init = () => {  // measured lazily, after the web fonts have loaded
    const off = document.createElement('canvas'); off.width = W; off.height = Hh; const c2 = off.getContext('2d');
    c2.font = `900 ${H}px Display`; c2.fillStyle = '#000'; c2.fillText(text, 10, H * .9);
    const dt = c2.getImageData(0, 0, W, Hh).data, pts = [];
    for (let yy = cell / 2; yy < Hh; yy += cell) for (let xx = cell / 2; xx < W; xx += cell) if (dt[(Math.floor(yy) * W + Math.floor(xx)) * 4 + 3] > 128) pts.push([xx, yy]);
    const R2 = rnd(5); order = pts.map(p => [p, R2() * .6 + p[0] / W * .4]).sort((a, b) => a[1] - b[1]).map(a => a[0]); n.count = pts.length;
  };
  tick(T => { if (!order) init(); const k = Math.floor(order.length * eOut(seg01(T, L0(t), d))); if (cv._k === k) return; cv._k = k; cx.clearRect(0, 0, W, Hh);
    for (let i = 0; i < k; i++) { const [px2, py2] = order[i]; cx.fillStyle = o.col || C.ink;
      if (glyph) { cx.save(); cx.translate(px2 - cell * .45, py2 - cell * .45); cx.scale(cell * .9 / 24, cell * .9 / 24); cx.fill(glyph); cx.restore(); }
      else { cx.beginPath(); cx.arc(px2, py2, cell * .36, 0, Math.PI * 2); cx.fill(); } } });
  return n;
}

/* ---------- reconstructed objects and interfaces (printed vector) ---------- */
// Late-90s beige CRT, vector with halftone shading. Returns node with .screen (div) of size sw x sh.
function crtV(x, y, w, o) {
  o = o || {}; const h = w * .9, sw = w * .74, sh = w * .55, sx = (w - sw) / 2, sy = w * .085;
  const svg = `<svg width="${w}" height="${h + w * .16}" style="position:absolute;left:0;top:0;overflow:visible">
    <rect x="0" y="0" width="${w}" height="${h}" rx="${w * .04}" fill="#E3DCC8"/><rect x="0" y="0" width="${w}" height="${h}" rx="${w * .04}" fill="url(#shade)"/>
    <rect x="${w * .62}" y="${h * .88}" width="${w * .3}" height="${h * .05}" rx="4" fill="#CFC6AE"/><circle cx="${w * .92}" cy="${h * .905}" r="${w * .012}" fill="#3DAA5C"/>
    <rect x="0" y="${h * .55}" width="${w}" height="${h * .45}" rx="${w * .04}" fill="url(#dotsL)" opacity=".35"/>
    <rect x="${sx - w * .025}" y="${sy - w * .025}" width="${sw + w * .05}" height="${sh + w * .05}" rx="${w * .03}" fill="#BFB59A"/>
    <path d="M${w * .36} ${h} L${w * .64} ${h} L${w * .7} ${h + w * .1} L${w * .3} ${h + w * .1}Z" fill="#CFC6AE"/><rect x="${w * .2}" y="${h + w * .095}" width="${w * .6}" height="${w * .06}" rx="${w * .02}" fill="#D8D0B8"/>
    <rect x="${w * .2}" y="${h + w * .095}" width="${w * .6}" height="${w * .06}" rx="${w * .02}" fill="url(#dotsL)" opacity=".35"/></svg>
    <div class="scr" style="position:absolute;left:${sx}px;top:${sy}px;width:${sw}px;height:${sh}px;border-radius:${w * .02}px;overflow:hidden;background:${o.scr || '#0F7C80'};box-shadow:inset 0 0 ${w * .04}px rgba(0,0,0,.5)"></div>`;
  const n = cut(svg, x, y, w + 20, h + w * .16 + 20, Object.assign({ bg: 'transparent', pad: 10 }, o));
  n.i.querySelector('.pr').style.background = 'transparent'; n.i.querySelector('.pr').style.clipPath = 'none';
  n.screen = n.i.querySelector('.scr'); n.sw = sw; n.sh = sh; n.sx = sx + 10; n.sy = sy + 10; return n;
}
const W98 = (title, body, o) => { o = o || {}; return `<div style="position:relative;width:${o.w}px;height:${o.h}px;background:#C3C3C3;box-shadow:inset -2px -2px 0 #404040,inset 2px 2px 0 #fff;font:${o.fs || 17}px 'Text';color:#000">
  <div class="tb" style="position:absolute;left:4px;right:4px;top:4px;height:${o.th || 28}px;background:linear-gradient(90deg,#00007B,#1084D0);color:#fff;font:700 ${(o.th || 28) * .6}px/${o.th || 28}px 'Text';padding-left:${o.ic ? 36 : 8}px;white-space:nowrap">${title}</div>
  ${o.ic ? `<div style="position:absolute;left:9px;top:7px;width:${(o.th || 28) - 6}px;height:${(o.th || 28) - 6}px">${o.ic}</div>` : ''}
  ${['_', '□', '×'].map((c, k) => `<div style="position:absolute;top:8px;right:${8 + (2 - k) * 24}px;width:20px;height:18px;background:#C3C3C3;box-shadow:inset -1px -1px 0 #404040,inset 1px 1px 0 #fff;font:700 13px/16px Arial;text-align:center">${c}</div>`).join('')}
  <div style="position:absolute;left:8px;right:8px;top:${(o.th || 28) + 10}px;bottom:8px;background:#fff;box-shadow:inset 2px 2px 0 #808080;overflow:hidden">${body}</div></div>`; };
const flower = (c, s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" style="display:block"><path d="${LOGO.icq}" fill="${c || '#3DAA5C'}"/></svg>`;
const qq = (c, s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" style="display:block"><path d="${LOGO.tencentqq}" fill="${c || C.ink}"/></svg>`;
function contactList(title, icon, rows, fs) {
  return `<div style="padding:8px 10px;font:600 ${fs || 18}px 'Text'"><div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">${icon}<b style="font-size:1.3em">${title}</b></div>
    <div style="background:#000080;color:#fff;padding:1px 8px;font-size:.85em">Online</div>${rows.map(([nm, ic]) => `<div style="display:flex;align-items:center;gap:8px;padding:4px 6px">${ic}<span class="sc" style="font-weight:600">${nm}</span></div>`).join('')}</div>`;
}
function rackV(w, h) {  // server rack, printed vector
  const u = Math.floor((h - 30) / 34);
  return `<svg width="${w}" height="${h}" style="display:block"><rect width="${w}" height="${h}" rx="6" fill="#26241F"/>${[...Array(u)].map((_, k) => `<rect x="12" y="${15 + k * 34}" width="${w - 24}" height="28" rx="3" fill="#3B3933"/><rect x="12" y="${15 + k * 34}" width="${w - 24}" height="28" rx="3" fill="url(#dotsL)" opacity=".25"/>
    <circle class="led" cx="28" cy="${29 + k * 34}" r="3.5" fill="${k % 3 ? '#3DAA5C' : '#E8A93B'}"/><circle class="led" cx="42" cy="${29 + k * 34}" r="3.5" fill="#3DAA5C"/><rect x="${w * .45}" y="${24 + k * 34}" width="${w * .4}" height="3" fill="#77736A"/><rect x="${w * .45}" y="${31 + k * 34}" width="${w * .3}" height="3" fill="#77736A"/>`).join('')}</svg>`;
}
function blinkLeds(n) { const leds = [...n.i.querySelectorAll('.led')]; tick(T => { const k = Math.floor(T * 6); leds.forEach((l, i) => l.setAttribute('opacity', rnd(k * 37 + i)() > .35 ? 1 : .25)); }); }
