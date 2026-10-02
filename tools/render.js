// Renderer: drives app/index.html in headless Chromium, one seek() per frame.
//   node tools/render.js stills <t> [t ...]            -> out/stills/t_<t>.png   (t in video seconds)
//   node tools/render.js scenes [i0] [i1]               -> one still per scene, 0.3 s before it ends (out/stills/sc_<i>.png)
//   node tools/render.js seg <from> <to> <file.mp4>     -> video-only H.264 segment, frames [from*FPS, to*FPS)
// Run from the repo root.
const http = require('http'), fs = require('fs'), path = require('path'), { spawn } = require('child_process');
const { chromium } = require(process.env.PLAYWRIGHT || '/opt/node22/lib/node_modules/playwright');
const ROOT = path.resolve(__dirname, '..'), FPS = 24;
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2', '.mp3': 'audio/mpeg', '.css': 'text/css' };

function serve() {
  return new Promise(res => {
    const srv = http.createServer((q, r) => {
      const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]));
      if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); }
      r.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r);
    }).listen(0, '127.0.0.1', () => res(srv));
  });
}

(async () => {
  const [mode, ...args] = process.argv.slice(2);
  const srv = await serve(), port = srv.address().port;
  const browser = await chromium.launch({ args: ['--disable-gpu', '--force-color-profile=srgb', '--font-render-hinting=none', '--disable-lcd-text'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  const errs = []; page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.text()); }); page.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  await page.goto(`http://127.0.0.1:${port}/app/index.html`);
  await page.evaluate(() => window.READY);
  const cdp = await page.context().newCDPSession(page);
  const shot = async (fmt) => Buffer.from((await cdp.send('Page.captureScreenshot', { format: fmt, quality: fmt === 'jpeg' ? 93 : undefined, optimizeForSpeed: true, clip: { x: 0, y: 0, width: 1920, height: 1080, scale: 1 } })).data, 'base64');
  // when a scene first appears, Chromium may raster its paper textures over a few frames; wait for that before capturing
  const seekTo = async t => {
    const changed = await page.evaluate(t => { const a = SC.map(s => !!s.on).join(); seek(t); return a !== SC.map(s => !!s.on).join(); }, t);
    await page.evaluate(n => new Promise(r => { const f = k => k ? requestAnimationFrame(() => f(k - 1)) : r(); f(n); }), changed ? 4 : 1);
    if (changed) await page.waitForTimeout(120);
  };

  if (mode === 'stills') {
    const dir = path.join(ROOT, 'out', 'stills'); fs.mkdirSync(dir, { recursive: true });
    for (const a of args) { const t = +a; await seekTo(t); fs.writeFileSync(path.join(dir, `t_${t.toFixed(2)}.png`), await shot('png')); console.log('still', t); }
  } else if (mode === 'scenes') {
    const dir = path.join(ROOT, 'out', 'stills'); fs.mkdirSync(dir, { recursive: true });
    const sc = await page.evaluate(() => SC.map(s => [s.t0, s.t1]));
    const i0 = +(args[0] || 0), i1 = Math.min(sc.length, +(args[1] || sc.length));
    for (let i = i0; i < i1; i++) { const t = Math.max(sc[i][0], sc[i][1] - .3); await seekTo(t); fs.writeFileSync(path.join(dir, `sc_${String(i).padStart(3, '0')}.png`), await shot('png')); console.log('scene', i, t.toFixed(2)); }
  } else if (mode === 'seg') {
    const [from, to, out] = [+args[0], +args[1], args[2]];
    const f0 = Math.round(from * FPS), f1 = Math.round(to * FPS);
    const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', '-r', String(FPS), out], { stdio: ['pipe', 'inherit', 'inherit'] });
    const t0 = Date.now();
    for (let f = f0; f < f1; f++) {
      await seekTo(f / FPS);
      const buf = await shot('jpeg');
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if ((f - f0) % 240 === 0) console.log(`frame ${f}/${f1}  ${((Date.now() - t0) / Math.max(1, f - f0)).toFixed(0)} ms/frame`);
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
    console.log(`done ${out}: ${f1 - f0} frames in ${((Date.now() - t0) / 1000).toFixed(1)} s`);
  }
  if (errs.length) console.log('BROWSER MESSAGES:\n' + [...new Set(errs)].slice(0, 30).join('\n'));
  await browser.close(); srv.close();
})();
