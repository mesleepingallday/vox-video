'use strict';
/* Rotoscope player: draws a clip vectorised by tools/roto.py as paper-cut shapes, held "on twos".
   rotoClip(name, t0, o) -> Nd
   o.map   : fill for each palette slot (dark -> light). Strings are colours or paper names ('kraft', 'white', ...).
   o.ink   : ink line colour (null to hide), o.inkOp: opacity
   o.people: fill for the person mask layer (e.g. RED or 'url(#ht)'), drawn over the set
   o.speed : playback rate (0.5 = half speed), o.loop: loop the clip, o.hold: freeze on frame index
   o.x,o.y,o.w : placement (default full frame), o.clip: clip-path for the whole layer */
const PAPER_PAT = {};
function paperPattern(svg, col) {  // per-svg <pattern> that tiles a paper texture
  const id = 'pp_' + col + '_' + (paperPattern.n = (paperPattern.n || 0) + 1), NS = 'http://www.w3.org/2000/svg';
  let defs = svg.querySelector('defs'); if (!defs) { defs = document.createElementNS(NS, 'defs'); svg.prepend(defs); }
  const p = document.createElementNS(NS, 'pattern'); p.setAttribute('id', id); p.setAttribute('patternUnits', 'userSpaceOnUse');
  p.setAttribute('width', 1024); p.setAttribute('height', 1024);
  const im = document.createElementNS(NS, 'image'); im.setAttribute('href', `tex/p_${col}.jpg`); im.setAttribute('width', 1024); im.setAttribute('height', 1024);
  p.appendChild(im); defs.appendChild(p); return `url(#${id})`;
}
function rotoClip(name, t0, o) {
  o = o || {}; const R = ROTO[name], NS = 'http://www.w3.org/2000/svg';
  const w = o.w || 1920, h = w * R.h / R.w, k = R.pal.length;
  const n = mk(`<svg width="${w}" height="${h}" viewBox="0 0 ${R.w} ${R.h}" style="display:block;overflow:hidden"></svg>`, o.x || 0, o.y === undefined ? (1080 - h) / 2 : o.y, Object.assign({ w, h }, o));
  const svg = n.i.querySelector('svg');
  if (o.clip) svg.style.clipPath = o.clip;
  const map = o.map || ['ink', 'navy', 'kraft', 'grey', 'cream', 'white'].slice(0, k);
  const fills = map.map(m => /^(#|rgb|url)/.test(m) ? m : paperPattern(svg, m));
  const grp = document.createElementNS(NS, 'g'); svg.appendChild(grp);
  const reg = [...Array(k)].map((_, ci) => { const p = document.createElementNS(NS, 'path'); p.setAttribute('fill', fills[ci] || fills[fills.length - 1]); p.setAttribute('fill-rule', 'evenodd'); grp.appendChild(p); return p; });
  let ppl = null;
  if (o.people) { ppl = document.createElementNS(NS, 'path'); ppl.setAttribute('fill', o.people); ppl.setAttribute('fill-rule', 'evenodd'); ppl.style.mixBlendMode = o.peopleBlend || 'normal'; ppl.setAttribute('opacity', o.peopleOp || 1); svg.appendChild(ppl); }
  let ink = null;
  if (o.ink !== null) { ink = document.createElementNS(NS, 'path'); ink.setAttribute('fill', o.ink || INK); ink.setAttribute('opacity', o.inkOp === undefined ? .9 : o.inkOp); svg.appendChild(ink); }
  const N = R.frames.length, sp = o.speed || 1;
  tick(T => {
    let f = o.hold !== undefined ? o.hold : Math.floor((T - t0) * R.fps * sp);
    f = o.loop ? ((f % N) + N) % N : clamp(f, 0, N - 1);
    if (n._f === f) return; n._f = f;
    const fr = R.frames[f], byC = Array(k).fill('');
    for (const [ci, d] of fr.r) byC[ci] += d;
    reg.forEach((p, ci) => p.setAttribute('d', byC[ci]));
    if (ink) ink.setAttribute('d', fr.l || '');
    if (ppl) ppl.setAttribute('d', fr.m || '');
  });
  return n;
}
