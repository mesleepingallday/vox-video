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
