'use strict';
/* Shared builders for the v3 film. Everything is a printed object in one world (DESIGN_SYSTEM.md). */
const BRAND = { riot: '#D32936', lol: '#C89B3C', epic: '#151515', qq: '#151515', icq: '#3DAA5C', fortnite: '#151515', cnn: '#CC0000', polygon: '#FF0052' };

// local shorthands bound to a world
function W3(Wd) {
  return {
    P: (html, x, y, o) => put(html, x, y, Object.assign({ w0: Wd }, o || {})),
    cut: (inner, x, y, w, h, o) => cut(inner, x, y, w, h, Object.assign({ w0: Wd }, o || {})),
    T: (text, x, y, size, o) => ty(text, x, y, size, Object.assign({ w0: Wd }, o || {})),
    cap: (text, x, y, t, o) => caption(text, x, y, t, Object.assign({ w0: Wd, size: 28, w: 520 }, o || {})),
    date: (text, x, y, t, o) => dateline(text, x, y, t, Object.assign({ w0: Wd, size: 28 }, o || {})),
    rule: (x, y, w, t, o) => { o = o || {}; const n = put(`<div style="width:${w}px;height:${o.h || 2}px;background:${o.col || C.ink}"></div>`, x, y, { w0: Wd }); if (t !== undefined) enter(n, 'wipe', t, .9); return n; },
    stk: (name, x, y, s, o) => sticker(name, x, y, s, Object.assign({ w0: Wd }, o || {})),
    ht: (draw, x, y, w, h, o) => htPhoto(draw, x, y, w, h, Object.assign({ w0: Wd }, o || {})),
    obj: (draw, x, y, w, h, o) => htObject(draw, x, y, w, h, Object.assign({ w0: Wd }, o || {})),
    photo: (id, x, y, h, o) => photo(id, x, y, h, Object.assign({ w0: Wd }, o || {})),
    word: (wd, x, y, s, o) => cutWord(wd, x, y, s, Object.assign({ w0: Wd }, o || {})),
    svg: () => { if (!Wd._svg) { const s = document.createElementNS(SVGNS, 'svg'); s.setAttribute('width', Wd.el.offsetWidth || 20000); s.setAttribute('height', 8000); s.style.cssText = 'position:absolute;left:0;top:0;overflow:visible;pointer-events:none;z-index:3'; Wd.el.appendChild(s); Wd._svg = s; } return Wd._svg; },
    line: (d, t, dur, o) => stroke(d, t, dur, Object.assign({ svg: null }, o || {}, { svg: (o && o.svg) || W3(Wd).svg() })),
  };
}
// faint newspaper text columns (page furniture) so every world reads as one editorial layout
function furniture(Wd, blocks) {
  blocks.forEach(([x, y, w, h]) => {
    const cols = Math.max(1, Math.round(w / 220)), cw = (w - (cols - 1) * 26) / cols; let html = '';
    for (let c = 0; c < cols; c++) for (let r = 0; r < Math.floor(h / 28); r++) html += `<i style="position:absolute;left:${c * (cw + 26)}px;top:${r * 28}px;width:${(r % 7 === 6 ? .55 : .97) * cw}px;height:8px;background:${C.ink};opacity:.08;display:block"></i>`;
    put(`<div style="position:relative;width:${w}px;height:${h}px"><i style="position:absolute;left:0;top:-24px;width:${w}px;height:2px;background:${C.ink};opacity:.22;display:block"></i>${html}</div>`, x, y, { w0: Wd });
  });
}
// a brand mark that fills like a gauge (ownership). steps: [[t, d, from%, to%], ...]
function markFill(Wd, name, x, y, size, steps, o) {
  o = o || {}; const id = 'mf' + (markFill.n = (markFill.n || 0) + 1);
  const n = put(`<svg width="${size}" height="${size}" viewBox="-1.6 -1.6 27.2 27.2" style="display:block;overflow:visible"><defs><clipPath id="${id}"><rect id="${id}r" x="-2" y="26" width="28" height="0"/></clipPath></defs>
    <path d="${LOGO[name]}" fill="${C.white}" stroke="${C.white}" stroke-width="2.6" stroke-linejoin="round"/><path d="${LOGO[name]}" fill="#D9D5CB"/><path d="${LOGO[name]}" fill="${o.col || C.blue}" clip-path="url(#${id})"/></svg>`, x, y, Object.assign({ w0: Wd }, o, { cls: 'co', in: null }));
  enter(n, o.enter === undefined ? 'lay' : o.enter, o.t, o.d, o);
  const r = n.i.querySelector('#' + id + 'r');
  tick(T => { let v = steps[0][2]; for (const [t, d, a, b] of steps) if (T >= L0(t)) v = lerp(a, b, eIO(clamp((T - L0(t)) / d, 0, 1))); const h = 24.4 * v / 100; r.setAttribute('y', 24.2 - h); r.setAttribute('height', h + .2); });
  return n;
}
// cheque printed in type (no handwriting)
function cheque3(Wd, x, y, w, f, t, o) {
  o = o || {}; const h = w * .44, s = w / 1000;
  return cut(`<div style="position:absolute;inset:0;background:repeating-linear-gradient(135deg,rgba(0,82,217,.06) 0 6px,transparent 6px 14px)"></div>
    <div style="position:absolute;left:${40 * s}px;top:${30 * s}px;font:600 ${26 * s}px 'Mono';letter-spacing:.08em;color:${C.blue}">${f.bank}</div>
    <div style="position:absolute;right:${40 * s}px;top:${30 * s}px;font:500 ${24 * s}px 'Mono'">DATE&nbsp; ${f.date}</div>
    <div style="position:absolute;left:${40 * s}px;top:${150 * s}px;font:500 ${22 * s}px/1.3 'Mono';color:${C.grey}">PAY TO THE<br>ORDER OF</div>
    <div style="position:absolute;left:${200 * s}px;top:${148 * s}px;font:700 ${54 * s}px 'Display';letter-spacing:-.01em">${f.payee}</div>
    <div style="position:absolute;left:${200 * s}px;right:${330 * s}px;top:${212 * s}px;height:2px;background:${C.ink}"></div>
    <div style="position:absolute;right:${40 * s}px;top:${140 * s}px;width:${270 * s}px;height:${80 * s}px;border:2px solid ${C.ink};display:flex;align-items:center;justify-content:center;font:800 ${40 * s}px 'Display'">${f.amount}</div>
    <div style="position:absolute;left:${40 * s}px;top:${262 * s}px;font:500 ${26 * s}px 'Text'">${f.words || ''}</div>
    <div style="position:absolute;left:${40 * s}px;right:${40 * s}px;top:${300 * s}px;height:1.5px;background:${C.ink};opacity:.6"></div>
    <div style="position:absolute;left:${40 * s}px;top:${370 * s}px;font:500 ${20 * s}px 'Mono';letter-spacing:.2em;color:${C.grey}">⑈0001⑈ 210:00419 ⑆ 2001</div>`, x, y, w, h, Object.assign({ w0: Wd, t, bg: '#FBF8EF' }, o));
}
// printed modern phone / monitor with a screen div
function phone3(Wd, x, y, w, t, o) {
  o = o || {}; const h = w * 2.05;
  const n = cut(`<div style="position:absolute;inset:0;border-radius:${w * .13}px;background:#141416"></div><div class="scr" style="position:absolute;left:${w * .05}px;right:${w * .05}px;top:${w * .06}px;bottom:${w * .06}px;border-radius:${w * .09}px;overflow:hidden;background:${o.scr || '#1E2A22'}"></div>`, x, y, w + 20, h + 20, Object.assign({ w0: Wd, t, bg: 'transparent' }, o));
  n.i.querySelector('.pr').style.clipPath = 'none'; n.i.querySelector('.pr').style.background = C.white; n.i.querySelector('.pr').style.borderRadius = (w * .15) + 'px';
  n.screen = n.i.querySelector('.scr'); return n;
}
function monitor3(Wd, x, y, w, t, o) {
  o = o || {}; const h = w * .62;
  const n = cut(`<div style="position:absolute;left:0;top:0;width:${w}px;height:${h}px;border-radius:12px;background:#141416"></div><div class="scr" style="position:absolute;left:${w * .02}px;top:${w * .02}px;width:${w * .96}px;height:${h - w * .04}px;overflow:hidden;background:${o.scr || '#0A1428'}"></div>
    <div style="position:absolute;left:${w * .44}px;top:${h}px;width:${w * .12}px;height:${w * .1}px;background:#2A2A2E"></div><div style="position:absolute;left:${w * .32}px;top:${h + w * .1}px;width:${w * .36}px;height:${w * .025}px;border-radius:6px;background:#2A2A2E"></div>`, x, y, w + 20, h + w * .125 + 20, Object.assign({ w0: Wd, t, bg: 'transparent' }, o));
  n.i.querySelector('.pr').style.clipPath = 'none'; n.i.querySelector('.pr').style.background = 'transparent';
  n.screen = n.i.querySelector('.scr'); return n;
}
const MOBA = (size, col) => `<svg viewBox="0 0 100 100" width="${size}" height="${size}" style="display:block"><rect width="100" height="100" fill="${col || '#2F5D3A'}"/><path d="M8 92 L8 8 L92 8 M8 92 L92 92 L92 8 M8 92 L92 8" stroke="#D9C38A" stroke-width="5" fill="none"/><path d="M30 30 Q50 40 70 70" stroke="#3A79B8" stroke-width="4" fill="none" opacity=".8"/><circle cx="10" cy="90" r="8" fill="#2553C7"/><circle cx="90" cy="10" r="8" fill="#E5402B"/>${[[8, 50], [50, 92], [36, 64], [50, 8], [92, 50], [64, 36]].map(([a, b], k) => `<circle cx="${a}" cy="${b}" r="3.2" fill="${k < 3 ? '#7FA0E8' : '#F08A7A'}"/>`).join('')}</svg>`;
// unit chart: rows*cols little figures; steps [[t, count, colour], ...] colour the first `count`
function units(Wd, x, y, cols, rows, cell, steps, o) {
  o = o || {}; const fig = `<svg viewBox="0 0 20 25" width="${cell}" height="${cell * 1.25}" style="display:block"><circle cx="10" cy="6" r="5.5" fill="currentColor"/><path d="M1 25 Q1 13 10 13 Q19 13 19 25Z" fill="currentColor"/></svg>`;
  const n = put(`<div style="display:grid;grid-template-columns:repeat(${cols},${cell}px);gap:${cell * .28}px">${[...Array(cols * rows)].map(() => `<i class="u" style="display:block;color:#CFCBC1">${fig}</i>`).join('')}</div>`, x, y, Object.assign({ w0: Wd }, o));
  const us = [...n.i.querySelectorAll('.u')];
  tick(T => { const col = Array(us.length).fill(o.base || '#CFCBC1');
    for (const [t, cnt, c] of steps) if (T >= L0(t)) { const k = Math.round(cnt * eOut(clamp((T - L0(t)) / .9, 0, 1))); for (let i = 0; i < Math.min(k, us.length); i++) col[i] = c; }
    us.forEach((u, i) => { if (u._c !== col[i]) { u._c = col[i]; u.style.color = col[i]; } }); });
  if (o.t !== undefined) enter(n, 'fade', o.t, .6);
  return n;
}
// a printed bar (paper strip) that grows to height h at t
function bar(Wd, x, base, w, h, t, d, col, o) {
  o = o || {}; const n = put(`<div style="width:${w}px;height:${h}px;background:${col};transform-origin:50% 100%"></div>`, x, base - h, Object.assign({ w0: Wd, cls: 'co' }, o));
  A(n.i.firstChild, [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], L0(t), d || 1, E3.out); return n;
}
// a printed browser window (screenshot treatment)
function browser3(Wd, x, y, w, h, url, body, t, o) {
  return cut(`<div style="position:absolute;inset:0;background:#fff"></div><div style="position:absolute;left:0;right:0;top:0;height:52px;background:#EDEDED;display:flex;align-items:center;gap:9px;padding:0 18px">${['#FF5F57', '#FEBC2E', '#28C840'].map(c => `<i style="width:14px;height:14px;border-radius:50%;background:${c};display:block"></i>`).join('')}
    <div style="flex:1;margin-left:16px;height:32px;border-radius:7px;background:#fff;font:500 19px 'Text';color:#555;display:flex;align-items:center;padding-left:14px">${url}</div></div><div class="bd" style="position:absolute;left:0;right:0;top:52px;bottom:0;overflow:hidden">${body}</div>`, x, y, w, h, Object.assign({ w0: Wd, t }, o || {}));
}
