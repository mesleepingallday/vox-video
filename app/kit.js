'use strict';
/* v2 kit: objects, interfaces, puppets and props that carry the story instead of text cards.
   All motion is a pure function of time (WAAPI via A(), or tick(T => ...)), so frames are deterministic. */
const NS = 'http://www.w3.org/2000/svg';
const L0 = t => t - LEAD;  // the engine starts entrances LEAD early; keep custom motion in step with it
const lerp = (a, b, x) => a + (b - a) * x;
const seg01 = (T, t, d) => clamp((T - L0(t)) / d, 0, 1);

/* ---------- GSAP (MorphSVG) driven by the engine clock ---------- */
function gtl() {  // a paused timeline whose positions are absolute video seconds
  const tl = gsap.timeline({ paused: true }); tick(T => tl.seek(Math.max(0, T), false)); return tl;
}
function morph(pathEl, toD, t, d, ease) {
  const tl = gtl(); tl.to(pathEl, { morphSVG: toD, duration: d, ease: ease || 'power2.inOut' }, Math.max(0, L0(t))); return tl;
}

/* ---------- handwriting ---------- */
// marker/pen text revealed left to right as if written; o.f: 'hm' (marker) | 'hp' (pen)
function write(text, x, y, size, t, d, o) {
  o = o || {}; const n = txt(text, x, y, size, Object.assign({ f: o.f || 'hm', col: o.col || INK }, o, { in: null }));
  A(n.i, [{ clipPath: 'inset(-30% 101% -30% -2%)' }, { clipPath: 'inset(-30% -2% -30% -2%)' }], L0(t), d || Math.max(.35, text.length * .045), o.ease || 'cubic-bezier(.4,.1,.6,1)');
  return n;
}
function scrawl(d, t, dur, o) { return stroke(d, t, dur, Object.assign({ sw: 7, col: RED }, o || {})); }

/* ---------- logos (simple-icons, 24x24) ---------- */
function logo(name, x, y, size, o) {
  o = o || {}; const col = o.col || INK;
  const back = o.plate ? `<circle cx="12" cy="12" r="15" fill="${o.plate}"/>` : '';
  return mk(`<svg width="${size}" height="${size}" viewBox="${o.plate ? '-3 -3 30 30' : '0 0 24 24'}" style="display:block;overflow:visible;filter:drop-shadow(${o.sh === 0 ? '0 0 0 transparent' : '6px 7px 0 rgba(20,15,5,.22)'})">${back}<path d="${LOGO[name]}" fill="${col}"/></svg>`,
    x, y, Object.assign({ w: size, h: size }, o));
}
// logo as a cut-out paper sticker (white sticker rim around the mark)
function logoSticker(name, x, y, size, o) {
  o = o || {}; const col = o.col || INK, rim = o.rim || WHITE;
  return mk(`<svg width="${size}" height="${size}" viewBox="-2 -2 28 28" style="display:block;overflow:visible;filter:drop-shadow(7px 8px 0 rgba(20,15,5,.22))">
    <path d="${LOGO[name]}" fill="${rim}" stroke="${rim}" stroke-width="3.2" stroke-linejoin="round"/><path d="${LOGO[name]}" fill="${col}"/></svg>`, x, y, Object.assign({ w: size, h: size }, o));
}
// a logo that fills up like a gauge (share of ownership). pct animates p0->p1 at t (or steps)
function logoFill(name, x, y, size, o) {
  const id = 'lf' + (logoFill.n = (logoFill.n || 0) + 1);
  const n = mk(`<svg width="${size}" height="${size}" viewBox="0 0 24 24" style="display:block;overflow:visible;filter:drop-shadow(7px 8px 0 rgba(20,15,5,.22))">
    <defs><clipPath id="${id}"><rect id="${id}r" x="0" y="24" width="24" height="0"/></clipPath></defs>
    <path d="${LOGO[name]}" fill="${o.base || '#D9D1BD'}"/><path d="${LOGO[name]}" fill="${o.col || BLUE}" clip-path="url(#${id})"/></svg>`, x, y, Object.assign({ w: size, h: size }, o));
  const r = n.i.querySelector('#' + id + 'r'); const st = o.steps || [[o.t, o.d || 1, o.p0 || 0, o.p1]];
  tick(T => { let v = st[0][2]; for (const [t, d, a, b] of st) if (T >= L0(t)) v = lerp(a, b, easeIO((T - L0(t)) / d)); const hh = 24 * v / 100; r.setAttribute('y', 24 - hh); r.setAttribute('height', hh); });
  return n;
}

/* ---------- photo slots (real photos when present in PHOTO, otherwise a redrawn paper portrait) ---------- */
// PHOTO[name] = 'photos/name.png' (background removed). mode: 'cutout' (sticker rim + halftone duotone) | 'plain'
window.PHOTO = window.PHOTO || {};
function portrait(name, x, y, h, o) {
  o = o || {}; const src = PHOTO[name];
  if (src) {
    const duo = o.duo || [INK, o.tint || YEL];
    return mk(`<div style="position:relative;height:${h}px;width:${h * (o.ar || .8)}px">
      <img src="${src}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;object-position:bottom;filter:url(#stickerRim) drop-shadow(8px 10px 0 rgba(20,15,5,.25))">
      <img src="${src}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;object-position:bottom;filter:url(#duo_${duo[1].slice(1)}) contrast(1.15);mix-blend-mode:multiply;opacity:${o.photoOp || 1}">
    </div>`, x, y, o);
  }
  return icon(o.k || 'person', x, y, h * .82, o);  // fallback: generic paper bust
}

/* ---------- cut-paper puppet with jointed limbs ---------- */
// parts are nested divs so children inherit the parent's rotation. pose(T) returns joint angles (deg).
function puppet(x, y, s, o) {
  o = o || {}; const sk = o.skin || '#E9C9A6', sh = o.shirt || 'white', pa = o.pants || 'navy', hair = o.hair || INK;
  const P = (cls, css, inner) => `<div class="pp-${cls}" style="position:absolute;${css}">${inner || ''}</div>`;
  const tex = c => /^#/.test(c) ? `background:${c}` : `background:url(tex/p_${c}.jpg) ${Math.round(rr(0, 600))}px ${Math.round(rr(0, 600))}px/1024px`;
  const limb = (w, h, c, r) => `${tex(c)};width:${w}px;height:${h}px;border-radius:${r || w / 2}px;box-shadow:3px 4px 0 rgba(20,15,5,.18)`;
  const arm = side => P('ua' + side, `left:${side === 'l' ? 6 : 58}px;top:8px;transform-origin:9px 9px;${limb(18, 58, sh)}`,
    P('la' + side, `left:1px;top:46px;transform-origin:8px 6px;${limb(16, 54, sh)}`, P('hd' + side, `left:1px;top:46px;${limb(14, 14, sk)}`)));
  const leg = side => P('ul' + side, `left:${side === 'l' ? 12 : 42}px;top:96px;transform-origin:11px 8px;${limb(22, 64, pa, 9)}`,
    P('ll' + side, `left:1px;top:54px;transform-origin:10px 6px;${limb(20, 62, pa, 8)}`, P('ft' + side, `left:-4px;top:52px;${limb(30, 14, INK, 7)}`)));
  const head = P('head', `left:21px;top:-58px;width:40px;height:52px;transform-origin:20px 50px`,
    P('', `left:0;top:4px;width:40px;height:48px;border-radius:50% 50% 46% 46%;${tex(sk)};box-shadow:3px 4px 0 rgba(20,15,5,.18)`) +
    P('', `left:-2px;top:0;width:44px;height:24px;border-radius:22px 22px 6px 6px;background:${hair}`) +
    (o.glasses ? P('', `left:6px;top:24px;width:28px;height:9px;border:3px solid ${INK};border-radius:4px;box-sizing:border-box`) : ''));
  const html = P('root', `left:0;top:0;width:82px;height:0;transform-origin:41px 96px`,
    leg('l') + arm('l') + P('torso', `left:4px;top:0;width:74px;height:104px;border-radius:18px 18px 10px 10px;${tex(sh)};box-shadow:4px 5px 0 rgba(20,15,5,.2)`) + head + leg('r') + arm('r'));
  const n = mk(`<div style="transform:scale(${s * (o.flip ? -1 : 1)},${s});transform-origin:41px 0">${html}</div>`, x, y, o);
  const q = c => n.i.querySelector('.pp-' + c);
  const J = { root: q('root'), head: q('head'), ual: q('ual'), lal: q('lal'), uar: q('uar'), lar: q('lar'), ull: q('ull'), lll: q('lll'), ulr: q('ulr'), llr: q('llr') };
  n.pose = fn => { tick(T => { const p = fn(T); for (const k in J) if (p[k] !== undefined) J[k].style.rotate = p[k].toFixed(1) + 'deg'; if (p.y !== undefined) J.root.style.translate = `0 ${p.y.toFixed(1)}px`; }); return n; };
  n.pose(() => ({ ual: 8, uar: -8, lal: -6, lar: 6, ull: 2, ulr: -2 }));
  return n;
}
// common poses (functions of time) for puppet.pose()
const POSE = {
  idle: (ph = 0) => T => { const b = Math.sin(T * 2.1 + ph); return { root: b * 1.2, head: b * 2, ual: 8 + b * 3, uar: -8 - b * 3, lal: -8, lar: 8, ull: 2, ulr: -2, lll: 0, llr: 0, y: 0 }; },
  walk: (t0, sp = 1, ph = 0) => T => { const p = (T - t0) * 5.2 * sp + ph, s = Math.sin(p); return { root: 2, head: -2 + Math.sin(p * 2) * 2, ull: s * 26, ulr: -s * 26, lll: Math.max(0, -Math.cos(p)) * 34, llr: Math.max(0, Math.cos(p)) * 34, ual: -s * 22, uar: s * 22, lal: -16, lar: -16, y: -Math.abs(Math.cos(p)) * 6 }; },
  cheer: (t0, ph = 0) => T => { const b = Math.sin((T - t0) * 9 + ph); return { root: b * 2, head: b * 4, ual: 150 + b * 14, uar: -150 - b * 14, lal: 20, lar: -20, ull: 4, ulr: -4, y: -Math.abs(b) * 8 }; },
  point: (ph = 0) => T => { const b = Math.sin(T * 2 + ph); return { root: -3, head: -6, uar: -96 + b * 3, lar: -6, ual: 10, lal: -8, ull: 3, ulr: -3 }; },
  type: (ph = 0) => T => { const b = Math.sin(T * 14 + ph); return { root: 6, head: 10, ual: -40 + b * 4, uar: -44 - b * 4, lal: -60, lar: -58, ull: 2, ulr: -2 }; },
};

/* ---------- interfaces (Win98 era / 2015 web / phone) ---------- */
function win98(x, y, w, h, title, o) {
  o = o || {};
  const n = mk(`<div style="width:${w}px;height:${h}px;background:#C3C3C3;box-shadow:inset -2px -2px 0 #404040,inset 2px 2px 0 #fff,8px 10px 0 rgba(20,15,5,.25);font:${o.fs || 18}px 'Liberation Sans',Arial,sans-serif;color:#000">
    <div style="position:absolute;left:4px;right:4px;top:4px;height:${o.th || 30}px;background:linear-gradient(90deg,#00007B,#1084D0);color:#fff;font-weight:700;display:flex;align-items:center;padding-left:${o.ic ? 40 : 8}px;font-size:${(o.th || 30) * .6}px;box-sizing:border-box">${title}</div>
    ${o.ic ? `<div style="position:absolute;left:10px;top:7px;width:24px;height:24px">${o.ic}</div>` : ''}
    ${['_', '□', '×'].map((c, k) => `<div style="position:absolute;top:8px;right:${8 + (2 - k) * 26}px;width:22px;height:20px;background:#C3C3C3;box-shadow:inset -1px -1px 0 #404040,inset 1px 1px 0 #fff;font:700 14px/18px Arial;text-align:center">${c}</div>`).join('')}
    <div class="wb" style="position:absolute;left:8px;right:8px;top:${(o.th || 30) + 10}px;bottom:8px;background:${o.bg || '#fff'};box-shadow:inset 2px 2px 0 #808080,inset -1px -1px 0 #fff;overflow:hidden"></div></div>`, x, y, o);
  n.body = n.i.querySelector('.wb'); return n;
}
function into(n, html) { const d = document.createElement('div'); d.innerHTML = html; while (d.firstChild) n.body.appendChild(d.firstChild); return n; }
function crt(x, y, w, o) {  // beige CRT; returns {n, screen} where screen is a div of size w*.78 x w*.58
  o = o || {}; const h = w * .82, sw = w * .78, shh = w * .56;
  const n = mk(`<div style="width:${w}px;height:${h + w * .2}px">
    <div style="position:absolute;left:0;top:0;width:${w}px;height:${h}px;border-radius:${w * .05}px;background:linear-gradient(160deg,#E4DCC4,#C9BEA0);box-shadow:inset -6px -8px 0 rgba(0,0,0,.12),10px 12px 0 rgba(20,15,5,.25)"></div>
    <div class="scr" style="position:absolute;left:${(w - sw) / 2}px;top:${w * .06}px;width:${sw}px;height:${shh}px;border-radius:${w * .025}px;background:${o.scr || '#008080'};overflow:hidden;box-shadow:inset 0 0 ${w * .05}px rgba(0,0,0,.55)"></div>
    <div style="position:absolute;left:${w * .82}px;top:${h - w * .1}px;width:${w * .03}px;height:${w * .03}px;border-radius:50%;background:#3DAA5C"></div>
    <div style="position:absolute;left:${w * .38}px;top:${h}px;width:${w * .24}px;height:${w * .08}px;background:#B7AC90"></div>
    <div style="position:absolute;left:${w * .22}px;top:${h + w * .07}px;width:${w * .56}px;height:${w * .07}px;border-radius:${w * .02}px;background:#C9BEA0;box-shadow:6px 7px 0 rgba(20,15,5,.2)"></div></div>`, x, y, o);
  n.screen = n.i.querySelector('.scr'); n.sw = sw; n.sh = shh; return n;
}
function el(parent, html) { const d = document.createElement('div'); d.innerHTML = html.trim(); const e = d.firstChild; parent.appendChild(e); return e; }
const PENGUIN = `<svg viewBox="0 0 100 120" style="width:100%;height:100%;display:block;overflow:visible"><ellipse cx="50" cy="66" rx="38" ry="48" fill="#111"/><ellipse cx="50" cy="74" rx="26" ry="36" fill="#fff"/><ellipse cx="50" cy="34" rx="28" ry="26" fill="#111"/><ellipse cx="40" cy="32" rx="7" ry="9" fill="#fff"/><ellipse cx="60" cy="32" rx="7" ry="9" fill="#fff"/><circle cx="41" cy="33" r="4" fill="#111"/><circle cx="59" cy="33" r="4" fill="#111"/><path d="M36 44 Q50 54 64 44 Q50 50 36 44Z" fill="#F5B21B"/><path d="M22 62 Q50 72 78 62 L78 72 Q50 80 22 72Z" fill="#E2432A"/><ellipse cx="34" cy="114" rx="14" ry="6" fill="#F5B21B"/><ellipse cx="66" cy="114" rx="14" ry="6" fill="#F5B21B"/></svg>`;
function addressBar(x, y, w, t0, steps, o) {  // IE-style; steps: [[t, text], ...] typed/erased char by char
  o = o || {};
  const n = mk(`<div style="width:${w}px;height:${o.h || 44}px;background:#C3C3C3;box-shadow:inset -1px -1px 0 #404040,inset 1px 1px 0 #fff;font:${o.fs || 24}px 'Liberation Sans',Arial;display:flex;align-items:center;padding:0 8px;box-sizing:border-box;gap:8px">
    <span style="font-size:.8em">Address</span><div class="ab" style="flex:1;height:72%;background:#fff;box-shadow:inset 1px 1px 0 #808080;padding:0 8px;display:flex;align-items:center;white-space:nowrap;overflow:hidden"></div></div>`, x, y, o);
  const box = n.i.querySelector('.ab');
  tick(T => { let cur = steps[0][1]; let prevTxt = '';
    for (let i = 0; i < steps.length; i++) { const [t, s] = steps[i]; if (T < L0(t)) break; const from = i ? steps[i - 1][1] : ''; const k = (T - L0(t)) / .07;
      let common = 0; while (common < from.length && common < s.length && from[common] === s[common]) common++;
      const del = from.length - common, add = s.length - common;
      cur = k < del ? from.slice(0, from.length - Math.floor(k)) : s.slice(0, common + Math.min(add, Math.floor(k - del))); }
    const html = cur.replace(o.mark || /$^/, m => `<b style="background:${YEL}">${m}</b>`) + (Math.floor(T * 2) % 2 ? '|' : '&nbsp;');
    if (box._h !== html) { box._h = html; box.innerHTML = html; } });
  return n;
}
function browser(x, y, w, h, url, o) {  // flat 2015 browser
  o = o || {};
  const n = mk(`<div style="width:${w}px;height:${h}px;background:#fff;border-radius:10px;overflow:hidden;box-shadow:10px 12px 0 rgba(20,15,5,.22);font-family:'Label',sans-serif">
    <div style="height:54px;background:#E6E6E6;display:flex;align-items:center;gap:10px;padding:0 18px">${['#FF5F57', '#FEBC2E', '#28C840'].map(c => `<i style="width:14px;height:14px;border-radius:50%;background:${c};display:block"></i>`).join('')}
    <div style="flex:1;margin-left:16px;height:32px;border-radius:6px;background:#fff;color:#555;font:20px 'Liberation Sans',Arial;display:flex;align-items:center;padding-left:14px">${url}</div></div>
    <div class="wb" style="position:absolute;left:0;right:0;top:54px;bottom:0;overflow:hidden"></div></div>`, x, y, o);
  n.body = n.i.querySelector('.wb'); return n;
}
function phone(x, y, w, o) {
  o = o || {}; const h = w * 2.05;
  const n = mk(`<div style="width:${w}px;height:${h}px;border-radius:${w * .14}px;background:#16161A;box-shadow:10px 12px 0 rgba(20,15,5,.25)">
    <div class="wb" style="position:absolute;left:${w * .05}px;right:${w * .05}px;top:${w * .1}px;bottom:${w * .1}px;border-radius:${w * .08}px;overflow:hidden;background:${o.scr || '#222'}"></div></div>`, x, y, o);
  n.body = n.i.querySelector('.wb'); return n;
}
// 3-lane MOBA minimap (generic, no game art)
function mobaMap(size, col) {
  return `<svg viewBox="0 0 100 100" width="${size}" height="${size}" style="display:block"><rect width="100" height="100" fill="${col || '#2F5D3A'}"/><path d="M8 92 L8 8 L92 8 M8 92 L92 92 L92 8 M8 92 L92 8" stroke="#D9C38A" stroke-width="5" fill="none"/>
  <path d="M30 30 Q50 40 70 70" stroke="#3A79B8" stroke-width="4" fill="none" opacity=".8"/><circle cx="10" cy="90" r="8" fill="#2553C7"/><circle cx="90" cy="10" r="8" fill="#E2432A"/>${[[8, 50], [50, 92], [36, 64], [50, 8], [92, 50], [64, 36]].map(([a, b], k) => `<circle cx="${a}" cy="${b}" r="3.2" fill="${k < 3 ? '#7FA0E8' : '#F08A7A'}"/>`).join('')}</svg>`;
}

/* ---------- props ---------- */
function wallCalendar(x, y, w, pages, o) {  // pages: [[t, 'NOV', '1998'], ...]; the first page shows at once, later ones flip in
  o = o || {}; const h = w * 1.2;
  const n = mk(`<div style="width:${w}px;height:${h}px;perspective:1200px"><div style="position:absolute;inset:0;background:#2B2824;border-radius:6px;box-shadow:8px 10px 0 rgba(20,15,5,.25)"></div></div>`, x, y, o);
  pages.forEach(([t, m, yr], k) => {
    const pg = el(n.i, `<div style="position:absolute;left:${w * .05}px;top:${w * .12}px;width:${w * .9}px;height:${h * .85}px;background:url(tex/p_white.jpg) ${k * 177}px 0/1024px;transform-origin:50% 0;box-shadow:0 4px 0 rgba(0,0,0,.15);overflow:hidden">
      <div style="height:${h * .26}px;background:${o.col || RED};color:#fff;font:700 ${w * .2}px/1 'Display';display:flex;align-items:center;justify-content:center;text-transform:uppercase">${m}</div>
      <div style="font:700 ${w * .26}px/1.2 'Display';text-align:center;color:${INK}">${yr}</div>
      <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:${w * .015}px;padding:0 ${w * .06}px">${[...Array(28)].map(() => `<i style="display:block;height:${w * .045}px;background:${INK};opacity:.15"></i>`).join('')}</div></div>`);
    if (k) A(pg, [{ transform: 'rotateX(-100deg)', opacity: 0 }, { opacity: 1, offset: .25 }, { transform: 'rotateX(0deg)', opacity: 1 }], L0(t), .45, EZ.out);
  });
  for (let k = 0; k < 6; k++) el(n.i, `<i style="position:absolute;top:${w * .06}px;left:${w * (.12 + k * .15)}px;width:${w * .04}px;height:${w * .1}px;border-radius:9px;background:#999;display:block"></i>`);
  return n;
}
function cheque(x, y, w, payee, amount, words, t, o) {  // bank cheque; payee/amount handwritten at t + offsets
  o = o || {}; const h = w * .44;
  const n = paper(x, y, w, h, Object.assign({ col: 'cream', j: 1.2, sh: 10 }, o));
  mk(`<div style="position:absolute;inset:0;background:repeating-linear-gradient(135deg,rgba(26,138,112,.08) 0 6px,transparent 6px 14px)"></div>
    <div style="position:absolute;left:${w * .04}px;top:${h * .08}px;font:700 ${w * .032}px 'Mono';color:${TEAL}">${o.bank || 'NASPERS LTD · CAPE TOWN'}</div>
    <div style="position:absolute;right:${w * .05}px;top:${h * .08}px;font:${w * .028}px 'Mono';color:${INK}">DATE ${o.date || '2001'}</div>
    <div style="position:absolute;left:${w * .04}px;top:${h * .36}px;font:${w * .026}px 'Mono';color:${INK}">PAY TO THE<br>ORDER OF</div>
    <div style="position:absolute;left:${w * .2}px;right:${w * .3}px;top:${h * .5}px;height:3px;background:${INK};opacity:.5"></div>
    <div style="position:absolute;right:${w * .05}px;top:${h * .33}px;width:${w * .24}px;height:${h * .2}px;border:3px solid ${INK};box-sizing:border-box"></div>
    <div style="position:absolute;left:${w * .04}px;right:${w * .05}px;top:${h * .72}px;height:3px;background:${INK};opacity:.5"></div>
    <div style="position:absolute;right:${w * .05}px;top:${h * .83}px;width:${w * .3}px;height:3px;background:${INK};opacity:.5"></div>`, 0, 0, { p: n, w, h });
  write(payee, w * .21, h * .32, w * .055, t, .7, { p: n, f: 'hp' });
  write(amount, w * .715, h * .345, Math.min(w * .05, w * .24 / (amount.length * .5)), t + .5, .6, { p: n, f: 'hm', col: o.amtCol || INK });
  if (words) write(words, w * .05, h * .58, w * .036, t + .9, .9, { p: n, f: 'hp' });
  write(o.sign || '~ J. Bekker', w * .66, h * .74, w * .045, t + 1.3, .6, { p: n, f: 'hp', col: BLUE });
  return n;
}
function rubberStamp(text, x, y, size, t, o) {  // a handle slams down, leaves the ink mark, lifts away
  o = o || {}; const col = o.col || '#D5321C';
  const mark = mk(`<div class="stamp tx d" style="font-size:${size}px;color:${col};border-color:${col};mix-blend-mode:multiply">${text}</div>`, x, y, Object.assign({ c: true, rot: o.rot === undefined ? -8 : o.rot }, o));
  A(mark.i, [{ opacity: 0, transform: 'scale(1.06)' }, { opacity: .92, transform: 'scale(1)' }], L0(t) + .14, .08);
  const hw = size * 3.4, hd = mk(`<div style="width:${hw}px;height:${size * 3.2}px">
    <div style="position:absolute;left:${hw * .38}px;top:0;width:${hw * .24}px;height:${size * 1.9}px;border-radius:${size * .4}px ${size * .4}px 6px 6px;background:linear-gradient(90deg,#6B4320,#8A5A2B)"></div>
    <div style="position:absolute;left:0;top:${size * 1.8}px;width:${hw}px;height:${size * .9}px;background:#2B2824;border-radius:6px"></div>
    <div style="position:absolute;left:${hw * .04}px;top:${size * 2.6}px;width:${hw * .92}px;height:${size * .35}px;background:${col}"></div></div>`, x, y - size * 1.6, { c: true, z: 50 });
  A(hd.i, [{ transform: 'translateY(-900px)' }, { transform: 'translateY(0)', offset: .45 }, { transform: 'translateY(0)', offset: .62 }, { transform: 'translateY(-900px)' }], L0(t) - .12, .7, 'cubic-bezier(.5,0,.5,1)');
  return mark;
}
function odometer(x, y, size, digits, from, to, t, d, o) {  // rolling mechanical counter
  o = o || {}; const ch = size * .62, hh = size * 1.1;
  const n = mk(`<div style="display:flex;gap:${size * .08}px;padding:${size * .12}px;background:#1A1814;border-radius:${size * .12}px;box-shadow:8px 10px 0 rgba(20,15,5,.25)">${[...Array(digits)].map(() => `<div class="dg" style="position:relative;width:${ch}px;height:${hh}px;overflow:hidden;background:linear-gradient(#ddd,#fff 40%,#fff 60%,#ccc);border-radius:4px"><div class="st" style="position:absolute;left:0;top:0;width:100%;font:700 ${size}px/${hh}px 'Display';text-align:center;color:${INK}">${[...Array(11)].map((_, k) => `<div>${k % 10}</div>`).join('')}</div></div>`).join('')}</div>`, x, y, o);
  const sts = [...n.i.querySelectorAll('.st')];
  tick(T => { const v = lerp(from, to, easeOut(seg01(T, t, d)));
    sts.forEach((s, k) => { const p = Math.pow(10, digits - 1 - k), f = (v / p) % 10;
      s.style.transform = `translateY(${(-f * hh).toFixed(1)}px)`; }); });
  return n;
}
function serverRack(x, y, h, t, o) {  // rack with blinking LEDs
  o = o || {}; const w = h * .45, u = Math.floor(h / 46);
  const n = mk(`<div style="width:${w}px;height:${h}px;background:#22201C;border-radius:6px;box-shadow:8px 10px 0 rgba(20,15,5,.25);padding:8px;box-sizing:border-box">${[...Array(u)].map(() => `<div style="height:38px;margin-bottom:6px;background:#3A3832;border-radius:3px;position:relative">${[0, 1, 2].map(k => `<i class="led" style="position:absolute;left:${10 + k * 16}px;top:14px;width:9px;height:9px;border-radius:50%;background:${['#3DAA5C', YEL, RED][k]};display:block"></i>`).join('')}<i style="position:absolute;right:10px;top:12px;width:${w * .4}px;height:4px;background:#77736A;display:block"></i><i style="position:absolute;right:10px;top:22px;width:${w * .4}px;height:4px;background:#77736A;display:block"></i></div>`).join('')}</div>`, x, y, Object.assign({ in: 'drop', t }, o));
  const leds = [...n.i.querySelectorAll('.led')];
  tick(T => { const k = Math.floor(T * 8); leds.forEach((l, i) => { const h2 = rnd(k * 31 + i)(); l.style.opacity = h2 > .45 ? 1 : .25; }); });
  return n;
}
function banknote(w, col) { col = col || '#49B878'; return `<div style="width:${w}px;height:${w * .46}px;background:${col};border-radius:4px;box-shadow:inset 0 0 0 ${w * .03}px #DDF3E4,3px 4px 0 rgba(20,15,5,.18);display:flex;align-items:center;justify-content:center;font:700 ${w * .28}px 'Display';color:#1F7A4A">$</div>`; }
function cashStack(x, y, w, n, t, o) {  // a stack of n bills that builds up
  o = o || {}; const g = mk('', x, y, o);
  for (let k = 0; k < n; k++) { const b = el(g.i, `<div style="position:absolute;left:${rr(-3, 3)}px;top:${-k * (w * .07)}px">${banknote(w)}</div>`);
    A(b, [{ transform: 'translateY(-300px)', opacity: 0 }, { opacity: 1, offset: .3 }, { transform: 'translateY(0)', opacity: 1 }], L0(t) + k * (o.step || .03), .3, EZ.out); }
  return g;
}
function flames(x, y, w, t, o) {  // flickering paper flames over something
  o = o || {}; const g = mk('', x, y, Object.assign({ z: 20 }, o));
  for (let k = 0; k < (o.n || 5); k++) {
    const f = icon('flame', k * w / (o.n || 5) - 20, -rr(60, 140), rr(.5, .9) * w / 2.6, { p: g, in: 'growY', t: t + k * .06 });
    tick(T => { const s = 1 + Math.sin(T * 13 + k * 2) * .08; f.i.style.scale = `${2 - s} ${s}`; });
  }
  return g;
}
function pushpin(x, y, t, col) { return mk(`<div style="width:34px;height:34px;border-radius:50%;background:${col || RED};box-shadow:inset -5px -6px 0 rgba(0,0,0,.25),4px 6px 0 rgba(20,15,5,.3)"></div>`, x, y, { c: true, in: 'drop', t, z: 40 }); }
function medal(x, y, size, label, t) {
  return svgEl(`<path d="M${size * .35} ${size * .55} L${size * .25} ${size * 1.05} L${size * .42} ${size * .95} L${size * .5} ${size * 1.12} L${size * .58} ${size * .7}Z" fill="${RED}"/><path d="M${size * .65} ${size * .55} L${size * .75} ${size * 1.05} L${size * .58} ${size * .95} L${size * .5} ${size * 1.12} L${size * .42} ${size * .7}Z" fill="${BLUE}"/>
    <circle cx="${size / 2}" cy="${size * .45}" r="${size * .38}" fill="#E0A914"/><circle cx="${size / 2}" cy="${size * .45}" r="${size * .3}" fill="${YEL}" stroke="#B8860B" stroke-width="3" stroke-dasharray="4 4"/>
    <text x="${size / 2}" y="${size * .5}" text-anchor="middle" font-family="Display" font-weight="800" font-size="${size * .16}" fill="#7A5600">${label}</text>`, x, y, size, size * 1.15, { in: 'stamp', t, rot: -10 });
}

/* ---------- environments ---------- */
function skylineSZ(y, t, o) {  // layered Shenzhen 1998: hills, low blocks, cranes
  o = o || {}; const R2 = rnd(o.seed || 7), layers = [];
  const hill = `<path d="M0 260 Q240 120 520 210 T1080 180 T1600 150 T1920 200 L1920 420 L0 420Z" fill="#7C8F6A"/><path d="M0 300 Q300 200 700 270 T1400 240 T1920 280 L1920 420 L0 420Z" fill="#5E7352"/>`;
  layers.push(svgEl(hill, 0, y - 220, 1920, 420, { in: 'wipeUp', t, d: .9 }));
  let s = ''; let xx = -20; while (xx < 1940) { const w = 70 + R2() * 120, h = 90 + R2() * 170; s += `<rect x="${xx}" y="${420 - h}" width="${w}" height="${h}" fill="${['#3A3630', '#4A453C', '#2B2824'][Math.floor(R2() * 3)]}"/>`;
    for (let yy = 420 - h + 14; yy < 404; yy += 24) for (let x2 = xx + 8; x2 < xx + w - 12; x2 += 18) if (R2() > .5) s += `<rect x="${x2}" y="${yy}" width="8" height="12" fill="${R2() > .6 ? YEL : '#8E8A7E'}" opacity=".85"/>`; xx += w + 6 + R2() * 20; }
  layers.push(svgEl(s, 0, y, 1920, 420, { in: 'wipeUp', t: t + .15, d: .9 }));
  let c = ''; [[260, 120], [980, 80], [1560, 140]].forEach(([cx, hh]) => { c += `<g stroke="${INK}" stroke-width="5" fill="none"><path d="M${cx} 420 L${cx} ${hh} M${cx + 14} 420 L${cx + 14} ${hh}"/>${[...Array(12)].map((_, k) => `<path d="M${cx} ${hh + k * 25} L${cx + 14} ${hh + k * 25 + 25}"/>`).join('')}<path d="M${cx - 160} ${hh} L${cx + 260} ${hh} M${cx + 7} ${hh - 40} L${cx - 160} ${hh} M${cx + 7} ${hh - 40} L${cx + 260} ${hh}"/><path d="M${cx + 200} ${hh} L${cx + 200} ${hh + 120}"/></g><rect x="${cx + 186}" y="${hh + 120}" width="28" height="20" fill="${YEL}"/>`; });
  layers.push(svgEl(c, 0, y - 40, 1920, 460, { in: 'wipeUp', t: t + .3, d: 1 }));
  return layers;
}
function canalHouses(x, y, w, t, o) {
  o = o || {}; const R2 = rnd(11); let s = '', xx = 0; const cols = ['#7A3B2E', '#3E4A3D', '#2B2824', '#8E5A3C', '#5B3A2E', '#40546B'];
  while (xx < w) { const hw = 110 + R2() * 60, h = 320 + R2() * 160, c = cols[Math.floor(R2() * cols.length)], top = 520 - h;
    s += `<path d="M${xx} 520 L${xx} ${top + 60} L${xx + hw * .2} ${top + 60} L${xx + hw * .2} ${top + 30} L${xx + hw * .35} ${top + 30} L${xx + hw / 2} ${top} L${xx + hw * .65} ${top + 30} L${xx + hw * .8} ${top + 30} L${xx + hw * .8} ${top + 60} L${xx + hw} ${top + 60} L${xx + hw} 520Z" fill="${c}"/>`;
    for (let r = 0; r < 4; r++) for (let k = 0; k < 3; k++) s += `<rect x="${xx + hw * (.14 + k * .27)}" y="${top + 90 + r * 95}" width="${hw * .18}" height="56" fill="#F4EEDD" opacity=".9"/>`;
    xx += hw + 4; }
  s += `<rect x="0" y="520" width="${w}" height="120" fill="#5D7FA6"/><path d="M0 560 Q${w / 4} 545 ${w / 2} 560 T${w} 560" stroke="#C9D8E8" stroke-width="5" fill="none"/>`;
  return svgEl(s, x, y, w, 640, Object.assign({ in: 'wipeUp', t, d: .9 }, o));
}
function palms(x, y, t, o) {
  let s = `<path d="M0 300 Q300 160 700 260 T1400 210 T1920 260 L1920 420 L0 420Z" fill="#C9845A"/>`;
  [[200, 1], [420, .8], [1500, 1.1], [1720, .85]].forEach(([px, k]) => { s += `<path d="M${px} 420 Q${px + 20 * k} ${420 - 200 * k} ${px + 10 * k} ${420 - 330 * k}" stroke="#3A2A1E" stroke-width="${12 * k}" fill="none"/>`;
    for (let a = 0; a < 7; a++) { const ang = -Math.PI + a * Math.PI / 6, ex = px + 10 * k + Math.cos(ang) * 130 * k, ey = 420 - 330 * k + Math.sin(ang) * 70 * k + 40 * k; s += `<path d="M${px + 10 * k} ${420 - 330 * k} Q${(px + 10 * k + ex) / 2} ${420 - 360 * k} ${ex} ${ey}" stroke="#2F5D3A" stroke-width="${16 * k}" fill="none" stroke-linecap="round"/>`; } });
  return svgEl(s, x, y, 1920, 420, Object.assign({ in: 'wipeUp', t, d: .9 }, o));
}

/* ---------- orthographic paper globe (Natural Earth land), rotating lon0 over time ---------- */
function globe(cx, cy, r, t, d, lon0, lon1, lat0, o) {
  o = o || {}; const n = mk(`<svg width="${r * 2 + 40}" height="${r * 2 + 40}" viewBox="${-r - 20} ${-r - 20} ${r * 2 + 40} ${r * 2 + 40}" style="display:block;overflow:visible">
    <circle cx="10" cy="12" r="${r}" fill="rgba(20,15,5,.22)"/><circle r="${r}" fill="${o.sea || '#9FC2D9'}"/><path class="ld" fill="${o.land || '#D3C5A2'}" stroke="#A8996F" stroke-width="1.2" fill-rule="nonzero"/><path class="hl" fill="${o.hiCol || '#E9806C'}"/>
    <circle r="${r}" fill="url(#gr)" opacity=".55"/><g class="pins"></g></svg>`, cx - r - 20, cy - r - 20, Object.assign({ w: r * 2 + 40, h: r * 2 + 40, in: 'pop', t: o.tin === undefined ? t - .3 : o.tin }, o));
  const ld = n.i.querySelector('.ld'), hl = n.i.querySelector('.hl'); const R = Math.PI / 180;
  const proj = (lo, la, l0, p0) => { const c = Math.cos(la * R), x = c * Math.sin((lo - l0) * R), y = Math.cos(p0 * R) * Math.sin(la * R) - Math.sin(p0 * R) * c * Math.cos((lo - l0) * R), z = Math.sin(p0 * R) * Math.sin(la * R) + Math.cos(p0 * R) * c * Math.cos((lo - l0) * R); return [x * r, -y * r, z]; };
  const path = (rings, l0, p0) => { let s = ''; for (const ring of rings) { const P = ring.map(([lo, la]) => proj(lo, la, l0, p0)); if (!P.some(p => p[2] > 0)) continue;
      s += 'M' + P.map(([x, y, z]) => { if (z >= 0) return x.toFixed(1) + ' ' + y.toFixed(1); const m = Math.hypot(x, y) || 1; return (x / m * r).toFixed(1) + ' ' + (y / m * r).toFixed(1); }).join('L') + 'Z'; } return s; };
  n.lonAt = T => lerp(lon0, lon1, easeIO(seg01(T, t, d))); n.lat = lat0; n.proj = (lo, la, T) => proj(lo, la, n.lonAt(T), lat0);
  tick(T => { const l0 = n.lonAt(T), k = l0.toFixed(1); if (n._k === k) return; n._k = k; ld.setAttribute('d', path(LAND50, l0, lat0)); if (o.hi) hl.setAttribute('d', path(o.hi.flatMap(c => COUNTRY[c]), l0, lat0)); });
  return n;
}

/* ---------- unit chart / thermometer ---------- */
function unitChart(x, y, cols, rows, cell, o) {  // o.steps: [[t, count, colour], ...] cumulative fills
  o = o || {}; const n = mk(`<div style="display:grid;grid-template-columns:repeat(${cols},${cell}px);gap:${cell * .25}px">${[...Array(cols * rows)].map(() => `<div class="u" style="width:${cell}px;height:${cell * 1.25}px">${`<svg viewBox="0 0 20 25" width="${cell}" height="${cell * 1.25}"><circle cx="10" cy="6" r="5.5" fill="currentColor"/><path d="M1 25 Q1 13 10 13 Q19 13 19 25Z" fill="currentColor"/></svg>`}</div>`).join('')}</div>`, x, y, o);
  const us = [...n.i.querySelectorAll('.u')]; us.forEach(u => u.style.color = o.base || '#CDC6B5');
  tick(T => { let last = 0; const col = Array(us.length).fill(o.base || '#CDC6B5');
    for (const [t, cnt, c, total] of o.steps || []) if (T >= L0(t)) { const k = Math.round(cnt * clamp((T - L0(t)) / .8, 0, 1)); for (let i = 0; i < k; i++) col[i] = c; }
    us.forEach((u, i) => { if (u._c !== col[i]) { u._c = col[i]; u.style.color = col[i]; } }); });
  return n;
}
function thermometer(x, y, h, t, d, frac, o) {
  o = o || {}; const n = mk(`<div style="width:90px;height:${h + 90}px"><div style="position:absolute;left:25px;top:0;width:40px;height:${h}px;border-radius:20px;background:#F4EEDD;box-shadow:inset 0 0 0 5px ${INK}"></div>
    <div class="mq" style="position:absolute;left:35px;bottom:70px;width:20px;height:0;background:${RED};border-radius:10px"></div><div style="position:absolute;left:5px;top:${h - 20}px;width:80px;height:80px;border-radius:50%;background:${RED};box-shadow:inset 0 0 0 5px ${INK},6px 8px 0 rgba(20,15,5,.25)"></div></div>`, x, y, Object.assign({ in: 'up', t: t - .4 }, o));
  const mq = n.i.querySelector('.mq'); tick(T => { mq.style.height = (lerp(.05, frac, easeOut(seg01(T, t, d))) * (h - 30)).toFixed(1) + 'px'; });
  return n;
}
function rocket(x, y, size, t, o) {
  o = o || {}; const n = svgEl(`<path d="M50 0 Q85 40 80 120 L20 120 Q15 40 50 0Z" fill="${WHITE}" stroke="${INK}" stroke-width="5"/><circle cx="50" cy="55" r="15" fill="#7FA0E8" stroke="${INK}" stroke-width="5"/><path d="M20 90 L0 135 L22 120Z M80 90 L100 135 L78 120Z" fill="${RED}" stroke="${INK}" stroke-width="4"/><path class="fl" d="M30 122 Q50 200 70 122Z" fill="${YEL}"/>`, x, y, size, size * 1.6, Object.assign({ vb: '0 0 100 160' }, o));
  const fl = n.i.querySelector('.fl'); tick(T => { const s = 1 + Math.sin(T * 30) * .15; fl.setAttribute('transform', `translate(50 122) scale(1 ${s.toFixed(2)}) translate(-50 -122)`); });
  return n;
}
