'use strict';
/* v4 skin: the v2 story and characters, re-printed as light newspaper cut-outs.
   Loaded after engine/art/kit: it wraps their builders so every object obeys one print system
   (white paper border, halftone stock from tex/, one soft two-layer shadow, light newsprint ground, TVC type). */
const V4 = { ink: '#151515', blue: '#0052D9', red: '#E5402B', white: '#FBFAF6' };
const V4_SH = 'drop-shadow(0 2px 2px rgba(20,18,15,.22)) drop-shadow(0 14px 22px rgba(20,18,15,.14))';
const V4_RIM = 'drop-shadow(3px 0 0 #FBFAF6) drop-shadow(-3px 0 0 #FBFAF6) drop-shadow(0 3px 0 #FBFAF6) drop-shadow(0 -3px 0 #FBFAF6)';
const V4_PHOTO = { mahuateng: 'R01', brandonbeck: 'R08', timsweeney: 'R09' };

function v4lum(c) {
  if (!c || typeof c !== 'string') return null;
  let r, g, b, m;
  if ((m = /^#([0-9a-f]{6})$/i.exec(c))) { const n = parseInt(m[1], 16); r = n >> 16; g = n >> 8 & 255; b = n & 255; }
  else if ((m = /rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)/.exec(c))) { r = +m[1]; g = +m[2]; b = +m[3]; }
  else return null;
  return (r * .299 + g * .587 + b * .114) / 255;
}
const v4fix = col => { const l = v4lum(col); if (l === null) return col; if (col === YEL || col === '#FFCF2B') return V4.blue; return l > .78 ? V4.ink : col; };

// 1 · one ground for the whole film: light newsprint
const _v4scene = scene;
scene = function (t0, o, build) { o = Object.assign({}, o || {}); o.bg = 'cream'; return _v4scene(t0, o, build); };

// 2 · light text that sat on coloured backgrounds becomes ink on newsprint (text inside a printed object keeps its colour)
const _v4txt = txt;
txt = function (html, x, y, size, o) { o = Object.assign({}, o || {}); if (!o.p) o.col = v4fix(o.col); return _v4txt(html, x, y, size, o); };

// 3 · paper: white border following the scissor cut, halftone stock inset 10 px, soft shadow
const _v4paper = paper;
paper = function (x, y, w, h, o) {
  const n = _v4paper(x, y, w, h, o), pp = n.i.querySelector('.pp'), col = (o && o.col) || 'white';
  const wb = document.createElement('div'); wb.style.cssText = `position:absolute;inset:0;background:${V4.white};clip-path:${pp.style.clipPath}`; pp.before(wb);
  if (col !== 'white' && col !== 'cream') { pp.style.clipPath = 'none'; pp.style.inset = '10px'; }
  n.o.style.filter = V4_SH; return n;
};
const _v4tag = tag;
tag = function (text, x, y, size, o) {
  const n = _v4tag(text, x, y, size, o), pp = n.i.querySelector('.pp'), col = (o && o.col) || 'ink';
  const wb = document.createElement('div'); wb.style.cssText = `position:absolute;inset:0;background:${V4.white};clip-path:${pp.style.clipPath}`; pp.before(wb);
  if (col !== 'white' && col !== 'cream') { pp.style.clipPath = 'none'; pp.style.inset = `${Math.max(5, size * .12)}px`; }
  n.o.style.filter = V4_SH; return n;
};

// 4 · drawn objects, marks and characters: white cut-out rim + the same soft shadow
const v4rim = n => { const s = n.i.querySelector('svg'); if (s) s.style.filter = 'none'; n.o.style.filter = V4_RIM + ' ' + V4_SH; return n; };
const _v4icon = icon; icon = function (name, x, y, size, o) { return v4rim(_v4icon(name, x, y, size, o)); };
const _v4logo = logo; logo = function (name, x, y, size, o) { o = Object.assign({}, o || {}); if (!o.p) o.col = v4fix(o.col || V4.ink); return v4rim(_v4logo(name, x, y, size, o)); };
const _v4stk = logoSticker; logoSticker = function (name, x, y, size, o) { const n = _v4stk(name, x, y, size, o); const s = n.i.querySelector('svg'); if (s) s.style.filter = 'none'; n.o.style.filter = V4_SH; return n; };
const _v4pup = puppet;
puppet = function (x, y, s, o) {
  const n = _v4pup(x, y, s, o);
  n.i.querySelectorAll('div').forEach(d => { if (d.style.boxShadow) d.style.boxShadow = 'none'; });
  n.o.style.filter = V4_RIM + ' ' + V4_SH; return n;
};
// 5 · portraits: real photos when supplied; until then a marked halftone placeholder (never an invented face)
const _v4portrait = portrait;
portrait = function (name, x, y, h, o) {
  const n = _v4portrait(name, x, y, h, Object.assign({ k: 'person' }, o || {}));
  if (!PHOTO[name] && V4_PHOTO[name]) mk(`<div style="font:600 18px 'Mono';letter-spacing:.08em;color:${V4.red};background:${V4.white};padding:4px 8px;border:2px solid ${V4.red}">ASSET ${V4_PHOTO[name]}</div>`, 20, 20, { p: n, z: 5 });
  return n;
};
// 6 · after build: replace every hard offset shadow left in inline styles with the soft print shadow
const _v4buildAll = buildAll;
buildAll = function () {
  _v4buildAll();
  document.querySelectorAll('#scenes *').forEach(e => {
    const bs = e.style && e.style.boxShadow; if (bs && /\d+px \d+px 0(px)? rgba\(20,\s*15,\s*5/.test(bs)) e.style.boxShadow = '0 2px 2px rgba(20,18,15,.2), 0 12px 20px rgba(20,18,15,.12)';
    const f = e.style && e.style.filter; if (f && /drop-shadow\(\d+px \d+px 0/.test(f)) e.style.filter = V4_SH;
  });
};

// 7 · maps and globe: land and highlighted countries printed as halftone dots, no flat colour fills
const v4hi = c => { const l = v4lum(c); if (l === null) return 'url(#v4hiB)'; const m = /^#([0-9a-f]{6})$/i.exec(c); if (!m) return 'url(#v4hiB)'; const n = parseInt(m[1], 16), r = n >> 16, g = n >> 8 & 255, b = n & 255;
  return g > r && g > b ? 'url(#v4hiG)' : (r > b + 40 && g < r - 40 ? 'url(#v4hiR)' : 'url(#v4hiB)'); };
const _v4map = mapView;
mapView = function (x, y, w, h, view, o) { o = Object.assign({}, o || {}); o.land = 'url(#v4land)'; o.edge = 'none'; o.ht = 0; o.sea = 'none';
  if (o.hi) { const hi = {}; for (const k in o.hi) hi[k] = v4hi(o.hi[k]); o.hi = hi; } return _v4map(x, y, w, h, view, o); };
const _v4globe = globe;
globe = function (cx, cy, r, t, d, lon0, lon1, lat0, o) { o = Object.assign({}, o || {}); o.sea = '#EFEBE3'; o.land = 'url(#v4land)'; o.hiCol = 'url(#v4hiB)';
  const n = _v4globe(cx, cy, r, t, d, lon0, lon1, lat0, o); n.o.style.filter = V4_RIM + ' ' + V4_SH; return n; };
// 8 · sweep: drop full-frame colour washes, full-width colour floor bands and baked hard shadows inside SVGs
const _v4build2 = buildAll;
buildAll = function () {
  _v4build2();
  document.querySelectorAll('#scenes [fill="rgba(20,15,5,.22)"],#scenes [fill="rgba(20,15,5,.2)"]').forEach(e => e.remove());
  document.querySelectorAll('#scenes div').forEach(e => {
    const st = e.style; if (!st) return; const w = parseFloat(st.width);
    if (w >= 1900 && (/gradient/.test(st.background) || /tex\/p_/.test(st.background)) && !e.closest('.pp')) e.style.display = 'none';
    if (st.mixBlendMode === 'multiply' && w >= 1900) e.style.display = 'none';
  });
};

// 9 · text containment rules (run once after build, on static layout):
//   R1 text inside a printed object stays inside that object, with a 14 px inner margin;
//   R2 free text stays inside the 1920×1080 title-safe area (64 px margin; the slow camera push stays inside it too);
//   order of fixes: shrink (to 62 %), then wrap to the available width, then nudge back inside. Text that sits wholly
//   off-frame is a deliberate camera reveal and is left alone. Violations are listed on window.V4_FIT for checks.
const V4_SAFE = 64, V4_PAD = 14;
function v4box(e, stop) {   // layout box of e relative to stop, transforms of ancestors ignored
  let x = 0, y = 0, n = e;
  while (n && n !== stop) {
    x += n.offsetLeft; y += n.offsetTop;
    if (n.classList.contains('ctr')) { x -= n.offsetWidth / 2; y -= n.offsetHeight / 2; }
    const tr = n.style.translate; if (tr) { const p = tr.split(' ').map(parseFloat); x += p[0] || 0; y += p[1] || 0; }
    n = n.offsetParent;
  }
  return { x, y, w: e.offsetWidth, h: e.offsetHeight };
}
function v4fitOne(out, inn, cont, sc) {
  const frame = !cont, cw = frame ? 1920 : cont.offsetWidth, ch = frame ? 1080 : cont.offsetHeight, m = frame ? V4_SAFE : V4_PAD;
  if (!frame && (cw < 40 || ch < 20)) return null;
  const ref = frame ? sc.cam : cont, avail = (cw - 2 * m) / (frame ? 1.08 : 1);
  let b = v4box(out, ref);
  if (b.w === 0) return null;
  if (frame && (b.x > 1920 || b.x + b.w < 0 || b.y > 1080 || b.y + b.h < 0)) return null;
  const fix = [];
  if (b.w > avail) {
    const k = Math.max(.62, avail / b.w); inn.style.zoom = k.toFixed(3); fix.push('shrink ' + k.toFixed(2));
    b = v4box(out, ref);
    if (b.w > avail + 1) { inn.style.whiteSpace = 'normal'; out.style.width = (avail / k) + 'px'; inn.style.width = '100%'; fix.push('wrap'); b = v4box(out, ref); }
  }
  if (frame) {   // check in screen space at the camera's widest framing (push-in around its transform origin, plus any pan)
    const o = sc.o, z = Math.max(o.z0 || 1, o.z1 || 1.06), to = (sc.cam.style.transformOrigin || '50% 50%').split(' ').map(parseFloat);
    const ox = to[0] / 100 * 1920, oy = to[1] / 100 * 1080, px = Math.max(Math.abs(o.px0 || 0), Math.abs(o.px1 || 0)) * z, py = Math.max(Math.abs(o.py0 || 0), Math.abs(o.py1 || 0)) * z;
    const sx = ox + (b.x - ox) * z, sy = oy + (b.y - oy) * z, sw = b.w * z, sh = b.h * z;
    let dx = 0, dy = 0;
    if (sx - px < m) dx = (m - sx + px) / z; else if (sx + sw + px > cw - m) dx = (cw - m - sx - sw - px) / z;
    if (sy - py < m) dy = (m - sy + py) / z; else if (sy + sh + py > ch - m) dy = (ch - m - sy - sh - py) / z;
    if (dx || dy) { out.v4pre = v4box(out, ref); out.v4dx = dx; out.v4dy = dy; out.style.left = (parseFloat(out.style.left) || 0) + dx + 'px'; out.style.top = (parseFloat(out.style.top) || 0) + dy + 'px'; fix.push(`nudge ${Math.round(dx)},${Math.round(dy)}`); }
    return fix.length ? fix.join(' + ') : null;
  }
  let dx = 0, dy = 0;
  if (b.x < m) dx = m - b.x; else if (b.x + b.w > cw - m) dx = cw - m - b.x - b.w;
  if (b.y < m) dy = m - b.y; else if (b.y + b.h > ch - m) dy = ch - m - b.y - b.h;
  if (!frame && b.h > ch) dy = 0;   // tall text in a short tag: shrink handled it; never push it out vertically
  if (dx || dy) { out.style.left = (parseFloat(out.style.left) || 0) + dx + 'px'; out.style.top = (parseFloat(out.style.top) || 0) + dy + 'px'; fix.push(`nudge ${Math.round(dx)},${Math.round(dy)}`); }
  return fix.length ? fix.join(' + ') : null;
}
const _v4build3 = buildAll;
buildAll = function () {
  _v4build3();
  window.V4_FIT = [];
  SC.forEach(sc => {
    const was = sc.root.style.display; sc.root.style.display = 'block';
    sc.root.querySelectorAll('.tx').forEach(inn => {
      const out = inn.parentElement; if (!out || !out.classList.contains('e')) return;
      const host = out.parentElement && out.parentElement.closest('.e');
      const cont = host && host !== out && sc.root.contains(host) ? host : null;
      const r = v4fitOne(out, inn, cont, sc);
      if (r) V4_FIT.push({ scene: sc.idx, text: inn.textContent.trim().slice(0, 40), fix: r });
    });
    v4unclash(sc);
    sc.root.style.display = was;
  });
};
// R3 · a nudge must not land text on other text: free texts that overlap after the fixes (but did not before) are
//   pushed apart along the nudge axis, the neighbour moving away from the frame edge with it (stacked labels move as a group)
const v4in = b => ({ x: b.x + 8, y: b.y + 8, w: b.w - 16, h: b.h - 16 });   // touching edges before the fix do not count as a clash
function v4unclash(sc) {
  const L = [...sc.root.querySelectorAll('.tx')].map(i => i.parentElement).filter(o => o && o.parentElement === sc.cam);
  const box = o => v4box(o, sc.cam), hit = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
  const pre = new Map(L.map(o => [o, o.v4pre || box(o)]));
  for (let pass = 0; pass < 4; pass++) {
    let moved = false;
    for (const a of L) for (const b of L) {
      if (a === b || !a.v4dy && !a.v4dx) continue;
      const A_ = box(a), B_ = box(b); if (!hit(A_, B_) || hit(v4in(pre.get(a)), v4in(pre.get(b)))) continue;
      if (a.v4dy) { const up = a.v4dy < 0, d = up ? (B_.y + B_.h) - A_.y + 6 : (A_.y + A_.h) - B_.y + 6; b.style.top = (parseFloat(b.style.top) || 0) + (up ? -d : d) + 'px'; b.v4dy = (b.v4dy || 0) + (up ? -d : d); }
      else { const lf = a.v4dx < 0, d = lf ? (B_.x + B_.w) - A_.x + 10 : (A_.x + A_.w) - B_.x + 10; b.style.left = (parseFloat(b.style.left) || 0) + (lf ? -d : d) + 'px'; b.v4dx = (b.v4dx || 0) + (lf ? -d : d); }
      V4_FIT.push({ scene: sc.idx, text: b.textContent.trim().slice(0, 40), fix: 'unclash' }); moved = true;
    }
    if (!moved) break;
  }
}
// 10 · odometer: thousands separators (1,000,000)
const _v4odo = odometer;
odometer = function (x, y, size, digits, from, to, t, d, o) {
  const n = _v4odo(x, y, size, digits, from, to, t, d, o), dg = [...n.i.querySelectorAll('.dg')];
  dg.forEach((e, k) => { const left = digits - k; if (k && left % 3 === 0) { const c = document.createElement('div'); c.textContent = ','; c.style.cssText = `font:800 ${size}px/${size * 1.1}px 'Display';color:${V4.white};margin:0 -${size * .06}px;align-self:flex-end`; e.before(c); } });
  return n;
};
