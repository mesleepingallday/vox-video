'use strict';
const INK = '#1A1814', CREAM = '#EDE4CF', WHITE = '#FAF6EA', YEL = '#FFCF2B', RED = '#E2432A', BLUE = '#2553C7', TEAL = '#1A8A70', KRAFT = '#C7A374', PINK = '#F0B8A4', GREY = '#CDC6B5', NAVY = '#17223F', GREEN = '#3DAA5C';
const ICON = {};
/* person bust — halftone cutout with white sticker edge */
function personSvg(col, o) {
  o = o || {}; const hair = o.hair || INK;
  const body = `<path d="M14 244 C14 172 52 138 100 138 C148 138 186 172 186 244 Z"/><circle cx="100" cy="76" r="50"/>`;
  return [200, 244, `<g fill="${WHITE}" stroke="${WHITE}" stroke-width="16" stroke-linejoin="round">${body}</g><g fill="${col}">${body}</g><g fill="url(#ht)" opacity=".42">${body}</g><path d="M52 66 C52 30 80 20 104 22 C134 24 152 44 148 74 C140 54 120 46 96 50 C76 52 62 56 52 66Z" fill="${hair}"/><path d="M70 150 L100 186 L130 150" fill="none" stroke="${WHITE}" stroke-width="7" opacity=".85"/>`];
}
ICON.person = personSvg(GREY); ICON.personY = personSvg(YEL); ICON.personR = personSvg(RED); ICON.personB = personSvg('#7FA0E8'); ICON.personK = personSvg(KRAFT);
ICON.monitor = [260, 230, `<rect x="10" y="8" width="240" height="176" rx="14" fill="#D8CFB8"/><rect x="10" y="150" width="240" height="34" rx="8" fill="#C4B99E"/><rect x="28" y="24" width="204" height="128" rx="8" fill="#12333A"/><rect x="28" y="24" width="204" height="20" rx="6" fill="#2553C7"/><circle cx="40" cy="34" r="4" fill="#FAF6EA"/><rect x="50" y="30" width="60" height="8" rx="3" fill="#FAF6EA" opacity=".8"/><rect x="40" y="56" width="92" height="20" rx="9" fill="#FAF6EA"/><rect x="118" y="84" width="100" height="20" rx="9" fill="${YEL}"/><rect x="40" y="112" width="70" height="20" rx="9" fill="#FAF6EA"/><circle cx="222" cy="167" r="5" fill="#3DAA5C"/><rect x="100" y="184" width="60" height="22" fill="#B7AC90"/><rect x="62" y="204" width="136" height="18" rx="6" fill="#C4B99E"/>`];
ICON.server = [150, 230, `<rect x="8" y="6" width="134" height="218" rx="8" fill="${INK}"/>${[0, 1, 2, 3].map(k => `<rect x="20" y="${20 + k * 50}" width="110" height="38" rx="5" fill="#3A3832"/><circle cx="34" cy="${39 + k * 50}" r="5" fill="${k % 2 ? YEL : '#3DAA5C'}"/><circle cx="50" cy="${39 + k * 50}" r="5" fill="${RED}"/><rect x="66" y="${33 + k * 50}" width="54" height="4" fill="#77736A"/><rect x="66" y="${42 + k * 50}" width="54" height="4" fill="#77736A"/>`).join('')}`];
ICON.coin = [120, 120, `<circle cx="60" cy="60" r="54" fill="#E0A914"/><circle cx="60" cy="60" r="54" fill="url(#gr)" opacity=".6"/><circle cx="60" cy="60" r="41" fill="${YEL}"/><text x="60" y="84" text-anchor="middle" font-family="Display" font-weight="700" font-size="68" fill="#9A6F00">$</text>`];
ICON.cash = [240, 150, `<rect x="22" y="30" width="200" height="104" rx="6" fill="#1F7A4A"/><rect x="12" y="18" width="200" height="104" rx="6" fill="#2F9C5F"/><rect x="2" y="6" width="200" height="104" rx="6" fill="#49B878"/><rect x="14" y="18" width="176" height="80" rx="4" fill="none" stroke="#DDF3E4" stroke-width="4"/><circle cx="102" cy="58" r="27" fill="#DDF3E4"/><text x="102" y="76" text-anchor="middle" font-family="Display" font-weight="700" font-size="50" fill="#1F7A4A">$</text>`];
ICON.pad = [260, 170, `<path d="M62 20 H198 C236 20 256 72 256 118 C256 152 232 164 212 142 L186 112 H74 L48 142 C28 164 4 152 4 118 C4 72 24 20 62 20Z" fill="${INK}"/><rect x="58" y="52" width="16" height="44" rx="3" fill="${CREAM}"/><rect x="44" y="66" width="44" height="16" rx="3" fill="${CREAM}"/><circle cx="196" cy="56" r="10" fill="${YEL}"/><circle cx="176" cy="76" r="10" fill="${RED}"/><circle cx="216" cy="76" r="10" fill="#7FA0E8"/><circle cx="196" cy="96" r="10" fill="#3DAA5C"/><rect x="116" y="60" width="28" height="8" rx="4" fill="#77736A"/>`];
ICON.phone = [150, 270, `<rect x="6" y="4" width="138" height="262" rx="22" fill="${INK}"/><rect x="16" y="26" width="118" height="212" rx="6" fill="#F4F0E4"/><rect x="16" y="26" width="118" height="30" fill="#2FA85F"/><rect x="26" y="68" width="66" height="22" rx="10" fill="#D9D3C2"/><rect x="58" y="98" width="66" height="22" rx="10" fill="#8FDC8A"/><rect x="26" y="128" width="50" height="22" rx="10" fill="#D9D3C2"/><rect x="48" y="158" width="76" height="22" rx="10" fill="#8FDC8A"/><rect x="26" y="188" width="60" height="22" rx="10" fill="#D9D3C2"/><rect x="56" y="248" width="38" height="6" rx="3" fill="#77736A"/>`];
ICON.db = [170, 200, `<path d="M10 40 V160 C10 182 160 182 160 160 V40Z" fill="#2553C7"/><ellipse cx="85" cy="40" rx="75" ry="26" fill="#6E93EE"/><path d="M10 82 C10 106 160 106 160 82" fill="none" stroke="#FAF6EA" stroke-width="6"/><path d="M10 122 C10 146 160 146 160 122" fill="none" stroke="#FAF6EA" stroke-width="6"/>`];
ICON.pentagon = [240, 230, (() => { const p = (r) => [0, 1, 2, 3, 4].map(k => { const a = -Math.PI / 2 + k * 2 * Math.PI / 5; return (120 + Math.cos(a) * r).toFixed(1) + ',' + (122 + Math.sin(a) * r).toFixed(1); }).join(' '); return `<polygon points="${p(112)}" fill="#8E8A7E"/><polygon points="${p(112)}" fill="url(#hatch)"/><polygon points="${p(88)}" fill="#B9B4A5"/><polygon points="${p(66)}" fill="#8E8A7E"/><polygon points="${p(44)}" fill="#B9B4A5"/><polygon points="${p(24)}" fill="#3F7A4C"/>`; })()];
ICON.capitol = [280, 230, `<rect x="10" y="150" width="260" height="62" fill="#F4F0E4"/><rect x="0" y="208" width="280" height="18" fill="#D9D3C2"/><rect x="84" y="112" width="112" height="44" fill="#F4F0E4"/><path d="M96 112 C96 60 184 60 184 112Z" fill="#F4F0E4"/><rect x="128" y="34" width="24" height="32" fill="#F4F0E4"/><rect x="137" y="8" width="6" height="28" fill="#D9D3C2"/><path d="M84 150 L140 126 L196 150Z" fill="#D9D3C2"/>${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(k => `<rect x="${24 + k * 25}" y="160" width="10" height="46" fill="#B9B4A5"/>`).join('')}<path d="M96 112 C96 60 184 60 184 112" fill="url(#hatch)" opacity=".5"/>`];
ICON.gate = [320, 220, `<rect x="30" y="110" width="260" height="96" fill="#B5281B"/><rect x="18" y="202" width="284" height="16" fill="#7D1A12"/><path d="M6 110 C40 104 60 92 70 74 H250 C260 92 280 104 314 110Z" fill="#D9A21B"/><path d="M40 74 C66 70 82 60 90 44 H230 C238 60 254 70 280 74Z" fill="#E8B92E"/><rect x="88" y="78" width="144" height="28" fill="#B5281B"/><path d="M138 206 V160 C138 140 182 140 182 160 V206Z" fill="#3A0F0A"/><rect x="60" y="150" width="30" height="56" rx="14" fill="#3A0F0A"/><rect x="230" y="150" width="30" height="56" rx="14" fill="#3A0F0A"/>${[0, 1, 2, 3, 4, 5].map(k => `<rect x="${44 + k * 46}" y="116" width="8" height="30" fill="#E8B92E"/>`).join('')}`];
ICON.gavel = [220, 200, `<rect x="92" y="18" width="94" height="54" rx="8" transform="rotate(38 139 45)" fill="#8A5A2B"/><rect x="82" y="26" width="16" height="54" rx="4" transform="rotate(38 90 53)" fill="#D9A21B"/><rect x="176" y="20" width="16" height="54" rx="4" transform="rotate(38 184 47)" fill="#D9A21B"/><rect x="28" y="92" width="118" height="18" rx="8" transform="rotate(-38 87 101)" fill="#6B4320"/><rect x="26" y="168" width="130" height="22" rx="6" fill="#6B4320"/><rect x="42" y="152" width="98" height="18" rx="5" fill="#8A5A2B"/>`];
ICON.scissors = [220, 200, `<path d="M70 150 L196 30" stroke="#B9B4A5" stroke-width="16" stroke-linecap="round"/><path d="M70 50 L196 170" stroke="#D9D3C2" stroke-width="16" stroke-linecap="round"/><circle cx="46" cy="42" r="26" fill="none" stroke="${RED}" stroke-width="13"/><circle cx="46" cy="158" r="26" fill="none" stroke="${RED}" stroke-width="13"/><circle cx="112" cy="100" r="7" fill="${INK}"/>`];
ICON.globe = [220, 220, `<circle cx="110" cy="110" r="100" fill="#7FA0E8"/><circle cx="110" cy="110" r="100" fill="url(#gr)" opacity=".5"/><g fill="none" stroke="#FAF6EA" stroke-width="5" opacity=".9"><ellipse cx="110" cy="110" rx="100" ry="100"/><ellipse cx="110" cy="110" rx="50" ry="100"/><path d="M10 110 H210 M24 60 H196 M24 160 H196 M110 10 V210"/></g>`];
ICON.star = [200, 200, `<circle cx="100" cy="100" r="92" fill="#4A5B3A"/><polygon points="100,26 118,78 174,78 128,110 146,164 100,130 54,164 72,110 26,78 82,78" fill="${WHITE}"/>`];
ICON.flame = [140, 190, `<path d="M70 6 C94 46 130 70 130 120 C130 160 104 184 70 184 C36 184 10 160 10 122 C10 94 28 78 40 58 C46 76 54 84 62 88 C56 58 60 30 70 6Z" fill="${RED}"/><path d="M72 84 C86 106 104 118 104 142 C104 164 90 176 70 176 C50 176 38 162 38 144 C38 128 48 120 54 108 C58 118 62 122 68 124 C66 108 68 96 72 84Z" fill="${YEL}"/>`];
ICON.news = [240, 180, `<rect x="6" y="6" width="228" height="168" fill="#F4F0E4"/><rect x="20" y="20" width="200" height="22" fill="${INK}"/><rect x="20" y="54" width="92" height="64" fill="#B9B4A5"/>${[0, 1, 2, 3, 4].map(k => `<rect x="124" y="${56 + k * 14}" width="96" height="6" fill="#8E8A7E"/>`).join('')}${[0, 1, 2].map(k => `<rect x="20" y="${130 + k * 14}" width="200" height="6" fill="#8E8A7E"/>`).join('')}`];
ICON.lockopen = [160, 200, `<path d="M40 92 V60 C40 16 120 16 120 60" fill="none" stroke="#8E8A7E" stroke-width="18"/><rect x="18" y="88" width="124" height="104" rx="14" fill="${YEL}"/><circle cx="80" cy="132" r="14" fill="${INK}"/><rect x="74" y="136" width="12" height="30" fill="${INK}"/>`];
/* flags as little paper rectangles (300x200) */
ICON.cn = [300, 200, `<rect width="300" height="200" fill="#DE2910"/><polygon points="60,24 69,52 99,52 75,70 84,98 60,81 36,98 45,70 21,52 51,52" fill="#FFDE00"/><circle cx="118" cy="26" r="7" fill="#FFDE00"/><circle cx="138" cy="48" r="7" fill="#FFDE00"/><circle cx="138" cy="78" r="7" fill="#FFDE00"/><circle cx="118" cy="100" r="7" fill="#FFDE00"/>`];
ICON.us = [300, 200, `<rect width="300" height="200" fill="#FAF6EA"/>${[0, 2, 4, 6, 8, 10, 12].map(k => `<rect y="${k * 15.4}" width="300" height="15.4" fill="#B22234"/>`).join('')}<rect width="124" height="108" fill="#3C3B6E"/>${[0, 1, 2, 3, 4].map(r => [0, 1, 2, 3, 4, 5].map(c => `<circle cx="${12 + c * 20}" cy="${12 + r * 21}" r="4" fill="#FAF6EA"/>`).join('')).join('')}`];
ICON.fi = [300, 200, `<rect width="300" height="200" fill="#FAF6EA"/><rect x="82" width="54" height="200" fill="#003580"/><rect y="73" width="300" height="54" fill="#003580"/>`];
ICON.fr = [300, 200, `<rect width="100" height="200" fill="#0055A4"/><rect x="100" width="100" height="200" fill="#FAF6EA"/><rect x="200" width="100" height="200" fill="#EF4135"/>`];
ICON.jp = [300, 200, `<rect width="300" height="200" fill="#FAF6EA"/><circle cx="150" cy="100" r="58" fill="#BC002D"/>`];
ICON.skyline = [1920, 420, (() => { let s = '', x = -20; const r = rnd(99); while (x < 1940) { const w = 60 + r() * 110, h = 110 + r() * 250, c = ['#2B2824', '#3A3630', '#4A453C'][Math.floor(r() * 3)]; s += `<rect x="${x.toFixed(0)}" y="${(420 - h).toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}" fill="${c}"/>`; for (let yy = 420 - h + 16; yy < 400; yy += 26) for (let xx = x + 10; xx < x + w - 14; xx += 20) if (r() > .45) s += `<rect x="${xx.toFixed(0)}" y="${yy.toFixed(0)}" width="9" height="13" fill="${r() > .5 ? YEL : '#8E8A7E'}" opacity=".85"/>`; if (r() > .6) s += `<rect x="${(x + w / 2 - 3).toFixed(0)}" y="${(420 - h - 40).toFixed(0)}" width="6" height="40" fill="${c}"/>`; x += w + 4 + r() * 16; } return s; })()];

/* ---------- world map (Natural Earth 1:50m land from land.js, equirectangular) ---------- */
const CITY = { shenzhen: [114.06, 22.54], capetown: [18.42, -33.92], amsterdam: [4.9, 52.37], la: [-118.24, 34.05], cary: [-78.78, 35.79], helsinki: [24.94, 60.17], paris: [2.35, 48.86], stockholm: [18.07, 59.33], espoo: [24.3, 61.2], wroclaw: [17.03, 51.1], seoul: [127.1, 37.5], tokyo: [139.7, 35.68], oslo: [10.75, 59.91], auckland: [174.76, -36.85], beijing: [116.4, 39.9], dc: [-77.04, 38.9], telaviv: [34.78, 32.08], hongkong: [114.17, 22.32] };
// map: view=[lon0,lon1,lat0,lat1]; o.hi = {cn: RED, ...} fills those countries. Returns {n, P(lon,lat), PC(city)} in scene coords.
function mapView(x, y, w, h, view, o) {
  o = o || {}; const [a0, a1, b0, b1] = view; const px = l => (l - a0) / (a1 - a0) * w, py = l => (b1 - l) / (b1 - b0) * h;
  const land = o.land || '#D3C5A2', edge = o.edge || '#BDAE89', sea = o.sea || 'none', m = 3;
  const vis = r => { let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; for (const [lo, la] of r) { if (lo < x0) x0 = lo; if (lo > x1) x1 = lo; if (la < y0) y0 = la; if (la > y1) y1 = la; } return x1 > a0 - m && x0 < a1 + m && y1 > b0 - m && y0 < b1 + m; };
  const d = rings => rings.filter(vis).map(r => 'M' + r.map(([lo, la]) => px(lo).toFixed(1) + ' ' + py(la).toFixed(1)).join('L') + 'Z').join('');
  const all = d(LAND50);
  let inner = `<path d="${all}" fill="rgba(20,15,5,.22)" fill-rule="evenodd" transform="translate(5,6)"/><path d="${all}" fill="${land}" fill-rule="evenodd" stroke="${edge}" stroke-width="1.5" stroke-linejoin="round"/>`;
  for (const k in (o.hi || {})) inner += `<path d="${d(COUNTRY[k])}" fill="${o.hi[k]}" fill-rule="evenodd" stroke="rgba(20,15,5,.35)" stroke-width="1.5" stroke-linejoin="round"/>`;
  inner += `<path d="${all}" fill="url(#htl)" fill-rule="evenodd" opacity="${o.ht === undefined ? .16 : o.ht}"/>`;
  const n = mk(`<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="display:block;overflow:hidden;${sea !== 'none' ? 'background:' + sea : ''}">${inner}</svg>`, x, y, Object.assign({ w, h }, o));
  return { n, P: (lo, la) => [x + px(lo), y + py(la)], PC: k => [x + px(CITY[k][0]), y + py(CITY[k][1])] };
}
const WORLD = [-170, 182, -57, 79];
// pin with label. dir: label offset direction
function pin(p, label, t, o) {
  o = o || {}; const col = o.col || RED, s = o.s || 30;
  const dot = mk(`<div style="width:${s}px;height:${s}px;border-radius:50%;background:${col};border:${Math.round(s * .17)}px solid ${o.ring || WHITE};box-sizing:border-box;box-shadow:4px 5px 0 rgba(20,15,5,.25)"></div>`, p[0], p[1], { c: true, in: 'pop', t, z: 20, p: o.p });
  let lab = null;
  if (label) { const dx = o.dx === undefined ? 26 : o.dx, dy = o.dy === undefined ? -34 : o.dy; lab = tag(label, p[0] + dx, p[1] + dy, o.size || 30, { col: o.tcol || 'ink', in: o.lin || 'right', t: t + .12, rot: o.rot === undefined ? -2 : o.rot, z: 21, f: o.f, p: o.p, dist: 40 }); }
  return { dot, lab };
}
// money arc between two points with travelling coin
function arc(p1, p2, t, d, o) {
  o = o || {}; const bend = o.bend === undefined ? -.28 : o.bend, mx = (p1[0] + p2[0]) / 2 - (p2[1] - p1[1]) * bend, my = (p1[1] + p2[1]) / 2 + (p2[0] - p1[0]) * bend;
  const r = stroke(`M${p1[0].toFixed(1)} ${p1[1].toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`, t, d, Object.assign({ col: RED, sw: 6, z: 15, ease: EZ.io }, o));
  if (o.coin !== false) travel(r.path, t, d, { col: o.coinCol || YEL, s: o.cs || 28 });
  return r;
}
/* ---------- composite components ---------- */
// generic game box (no real logos): big title on coloured front
function gamebox(title, x, y, w, o) {
  o = o || {}; const h = o.h || w * 1.32, col = o.col || 'red';
  const b = paper(x, y, w, h, Object.assign({ col, j: 1.5 }, o));
  mk(`<div style="position:absolute;left:0;top:0;width:${w * .09}px;height:${h}px;background:rgba(0,0,0,.22)"></div><div style="position:absolute;left:${w * .16}px;top:${h * .07}px;right:${w * .08}px;height:${h * .5}px;background:rgba(255,255,255,.14);border:3px solid rgba(255,255,255,.5)"></div>`, 0, 0, { p: b, w, h });
  txt(title, w * .55, h * .32, o.ts || w * .17, { p: b, c: true, col: o.tc || WHITE, al: 'center', lh: .95, css: { whiteSpace: 'normal', width: w * .7 + 'px' } });
  if (o.sub) txt(o.sub, w * .55, h * .68, w * .075, { p: b, c: true, f: 'p', col: o.tc || WHITE, al: 'center', css: { whiteSpace: 'normal', width: w * .7 + 'px', lineHeight: 1.25, opacity: .92 } });
  if (o.foot) txt(o.foot, w * .55, h * .88, w * .085, { p: b, c: true, f: 'm', col: o.tc || WHITE, al: 'center' });
  return b;
}
// document sheet with header + faux text lines
function docu(x, y, w, h, o) {
  o = o || {}; const n = paper(x, y, w, h, Object.assign({ col: 'white' }, o)); let s = '';
  const r = rnd(o.seed || 3), top = o.top || 150, lh = o.lh || 30, n0 = Math.floor((h - top - 50) / lh);
  for (let k = 0; k < n0; k++) { if (o.skip && o.skip.includes(k)) continue; const ww = (k % 5 === 4 ? .45 + r() * .3 : .86 + r() * .1) * (w - 110); s += `<div style="position:absolute;left:56px;top:${top + k * lh}px;width:${ww.toFixed(0)}px;height:${o.lw || 9}px;background:#1A1814;opacity:.2;border-radius:2px"></div>`; }
  mk(s, 0, 0, { p: n, w, h });
  if (o.head) txt(o.head, 56, 46, o.hs || 38, { p: n, col: INK, f: o.hf || 'd' });
  if (o.sub) txt(o.sub, 56, 46 + (o.hs || 38) * 1.25, o.ss || 22, { p: n, col: 'rgba(26,24,20,.7)', f: 'm' });
  return n;
}
function person(x, y, size, o) { o = o || {}; return icon(o.k || 'person', x, y, size, Object.assign({ boil: 1 }, o)); }
// big kicker label: small caps line with rule
function kicker(text, x, y, t, o) { o = o || {}; const n = txt(`<span style="display:inline-block;width:54px;height:6px;background:${o.bar || RED};vertical-align:middle;margin-right:18px;translate:0 -3px"></span>${text}`, x, y, o.size || 28, Object.assign({ f: 'p', in: 'right', t, dist: 40 }, o)); return n; }
// date flag: mono text on yellow paper strip
function dateTag(text, x, y, t, o) { o = o || {}; return tag(text, x, y, o.size || 40, Object.assign({ col: 'yellow', f: 'm', in: 'drop', t, rot: -3, boil: 1, pad: '14px 26px 10px' }, o)); }
// quote block
function quote(text, who, x, y, w, size, t, o) {
  o = o || {}; const q = txt('“', x - size * 1.2, y - size * .62, size * 3.2, { f: 'sb', col: o.qcol || RED, in: 'pop', t });
  const n = txt(text, x, y, size, { f: 'si', in: 'wipe', t: t + .1, d: o.d || .9, lh: 1.22, col: o.col, css: { whiteSpace: 'normal', width: w + 'px' } });
  const a = txt('— ' + who, x, y + (o.ah || size * 1.22 * (o.lines || 2) + 34), o.as || 30, { f: 'p', in: 'up', t: t + (o.ad === undefined ? .7 : o.ad), dist: 30, col: o.col, ls: '.1em' });
  return { q, n, a };
}
// chapter title card
function chapter(id, no, title, col, tcol) {
  const t0 = S(id);
  scene(t0, { bg: col, z0: 1.0, z1: 1.07, ox: 50, oy: 50 }, sc => {
    const ink = tcol || WHITE, ghost = /ink|navy/.test(col) ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.13)';
    txt(no === 'END' ? '∎' : ('0' + no), 1500, 560, 900, { c: true, col: ghost, in: 'left', t: t0 + .02, d: .8, dist: 200 });
    const cjk = { 1: '腾讯', 2: '豪赌', 3: '帝国', 4: '北京', 5: '华府', 6: '剥离', 7: '博弈', END: '意义' }[no];
    txt(cjk, 1730, 150, 150, { c: true, f: 'cjk', col: /ink|navy/.test(col) ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.18)', in: 'fade', t: t0 + .2, rot: 0, css: { writingMode: 'vertical-rl' } });
    tag(no === 'END' ? 'ENDING' : 'CHAPTER ' + no, 150, 300, 46, { col: 'ink', f: 'm', in: 'drop', t: t0 + .02, rot: -3, boil: 1, pad: '16px 30px 11px' });
    const lines = title.split('|'); let y = 420;
    lines.forEach((l, k) => { words(l, 150, y, lines.length > 2 ? 150 : 190, t0 + .16 + k * .16, { col: ink, step: .07, wd: .32 }); y += (lines.length > 2 ? 150 : 190) * .98; });
    const u = mk(`<div style="width:520px;height:16px;background:${ink === WHITE ? YEL : INK}"></div>`, 152, y + 26, { in: 'grow', t: t0 + .55, d: .5 });
  });
}
