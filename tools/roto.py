# Rotoscope: turn a reference clip (e.g. Seedance) into vector "paper-cut" frames for the JS engine.
# The footage itself never reaches the video; only these shapes do.
#   python3 tools/roto.py <clip.mp4> <name> [--fps 12] [--k 6] [--t0 0] [--t1 999]
#   -> app/roto/<name>.js  (ROTO[name] = {w, h, fps, pal:[...], frames:[{r:[[ci,'path'],..], l:'ink path', p:[pose pts]}]})
# Per frame: colour regions from a k-means palette fitted once per clip (stable over time), each region
# vectorised as simplified polygons; ink lines from an XDoG edge pass; person masks from MediaPipe
# (selfie multiclass) so people can be styled separately from the set.
import sys, json, os, argparse, numpy as np, cv2

ap = argparse.ArgumentParser()
ap.add_argument('clip'); ap.add_argument('name')
ap.add_argument('--fps', type=float, default=12); ap.add_argument('--k', type=int, default=6)
ap.add_argument('--t0', type=float, default=0); ap.add_argument('--t1', type=float, default=1e9)
ap.add_argument('--w', type=int, default=960)  # working width; output coords are scaled to 1920
ap.add_argument('--eps', type=float, default=1.6)  # polygon simplification (working px)
ap.add_argument('--minarea', type=float, default=60)
ap.add_argument('--people', action='store_true', help='add MediaPipe person masks as their own layer')
a = ap.parse_args()

cap = cv2.VideoCapture(a.clip); src_fps = cap.get(cv2.CAP_PROP_FPS) or 24
frames = []; t = 0; idx = 0; step = src_fps / a.fps; nxt = a.t0 * src_fps
while True:
    ok, f = cap.read()
    if not ok: break
    if idx >= nxt and idx / src_fps <= a.t1:
        h0, w0 = f.shape[:2]; H = int(round(h0 * a.w / w0))
        frames.append(cv2.resize(f, (a.w, H), interpolation=cv2.INTER_AREA)); nxt += step
    idx += 1
print(len(frames), 'frames at', a.fps, 'fps from', a.clip)
W, H = a.w, frames[0].shape[0]; S = 1920 / W

# temporally smoothed, edge-preserving frames (reduces k-means flicker)
sm = [cv2.bilateralFilter(cv2.pyrMeanShiftFiltering(f, 8, 18), 7, 40, 7) for f in frames]
lab = [cv2.cvtColor(f, cv2.COLOR_BGR2LAB).astype(np.float32) for f in sm]
for i in range(1, len(lab) - 1): lab[i] = (lab[i - 1] + 2 * lab[i] + lab[i + 1]) / 4

# one palette per clip
samp = np.concatenate([l[::6, ::6].reshape(-1, 3) for l in lab[::max(1, len(lab) // 12)]])
crit = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 50, .5)
_, _, cent = cv2.kmeans(samp, a.k, None, crit, 4, cv2.KMEANS_PP_CENTERS)
order = np.argsort(cent[:, 0]); cent = cent[order]  # dark -> light
pal = [cv2.cvtColor(np.uint8([[c]]), cv2.COLOR_LAB2BGR)[0, 0][::-1].tolist() for c in cent]

seg = None
if a.people:
    import mediapipe as mp
    from mediapipe.tasks.python import vision, BaseOptions
    seg = vision.ImageSegmenter.create_from_options(vision.ImageSegmenterOptions(
        base_options=BaseOptions(model_asset_path='/tmp/claude-0/models/selfie_multiclass_256x256.tflite'), output_category_mask=True))

def poly_paths(mask):
    cs, hier = cv2.findContours(mask, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)
    out = []
    for c in cs:
        if abs(cv2.contourArea(c)) < a.minarea: continue
        p = cv2.approxPolyDP(c, a.eps, True)[:, 0]
        if len(p) < 3: continue
        out.append('M' + 'L'.join(f'{x * S:.0f} {y * S:.0f}' for x, y in p) + 'Z')
    return ''.join(out)

def xdog(g, sig=1.1, k=1.6, tau=.985, eps=-.06, phi=12):
    g = g.astype(np.float32) / 255
    d = cv2.GaussianBlur(g, (0, 0), sig) - tau * cv2.GaussianBlur(g, (0, 0), sig * k)
    e = np.where(d >= eps, 1, 1 + np.tanh(phi * (d - eps)))
    return (e < .55).astype(np.uint8) * 255

out = []; prev = None
for i, l in enumerate(lab):
    d = ((l[:, :, None, :] - cent[None, None, :, :]) ** 2).sum(-1); lbl = d.argmin(-1).astype(np.uint8)
    if prev is not None:  # hysteresis: keep previous label unless clearly better (less boil)
        dp = np.take_along_axis(d, prev[:, :, None].astype(np.int64), 2)[:, :, 0]
        lbl = np.where(d.min(-1) < dp * .8, lbl, prev)
    lbl = cv2.medianBlur(lbl, 5); prev = lbl
    regions = []
    for ci in range(a.k):  # paint order dark -> light is irrelevant: regions are disjoint
        m = (lbl == ci).astype(np.uint8) * 255
        m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
        pth = poly_paths(m)
        if pth: regions.append([ci, pth])
    ink = xdog(cv2.cvtColor(sm[i], cv2.COLOR_BGR2GRAY))
    ink = cv2.morphologyEx(ink, cv2.MORPH_OPEN, np.ones((2, 2), np.uint8))
    fr = {'r': regions, 'l': poly_paths(ink)}
    if seg is not None:
        rgb = cv2.cvtColor(frames[i], cv2.COLOR_BGR2RGB)
        cm = seg.segment(mp.Image(image_format=mp.ImageFormat.SRGB, data=np.ascontiguousarray(rgb))).category_mask.numpy_view()
        pm = cv2.medianBlur(((cm > 0) * 255).astype(np.uint8), 7)
        fr['m'] = poly_paths(pm)
    out.append(fr)

os.makedirs('app/roto', exist_ok=True)
js = f"window.ROTO = window.ROTO || {{}};\nROTO[{json.dumps(a.name)}] = " + json.dumps({'w': 1920, 'h': round(H * S), 'fps': a.fps, 'pal': pal, 'frames': out}, separators=(',', ':')) + ';\n'
open(f'app/roto/{a.name}.js', 'w').write(js)
files = sorted(f for f in os.listdir('app/roto') if f.endswith('.js') and f != 'manifest.js')
open('app/roto/manifest.js', 'w').write('window.ROTO_FILES = ' + json.dumps(files) + ';\n')
print('wrote', f'app/roto/{a.name}.js', f'{len(js) / 1e6:.1f} MB', 'palette', pal)
