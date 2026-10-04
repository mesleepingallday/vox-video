# Real-photo cutout for portrait() in app/kit.js.
#   python3 tools/photo.py <image or URL> <name> [--credit "Photographer / licence"]
#   -> app/photos/<name>.png (background removed, cropped to head and shoulders) and an entry in app/photos/manifest.js
# Use freely licensed sources only (Wikimedia Commons CC BY / CC BY-SA / public domain) and keep the credit.
import sys, os, json, argparse, urllib.request, numpy as np, cv2
import mediapipe as mp
from mediapipe.tasks.python import vision, BaseOptions

ap = argparse.ArgumentParser(); ap.add_argument('src'); ap.add_argument('name'); ap.add_argument('--credit', default='')
a = ap.parse_args()
if a.src.startswith('http'):
    req = urllib.request.Request(a.src, headers={'User-Agent': 'vox-video/1.0 (editorial explainer)'})
    data = np.frombuffer(urllib.request.urlopen(req, timeout=60).read(), np.uint8); img = cv2.imdecode(data, cv2.IMREAD_COLOR)
else:
    img = cv2.imread(a.src)
h, w = img.shape[:2]; s = 1400 / max(h, w)
if s < 1: img = cv2.resize(img, (int(w * s), int(h * s)), interpolation=cv2.INTER_AREA); h, w = img.shape[:2]

seg = vision.ImageSegmenter.create_from_options(vision.ImageSegmenterOptions(
    base_options=BaseOptions(model_asset_path='/tmp/claude-0/models/selfie_multiclass_256x256.tflite'), output_confidence_masks=True))
res = seg.segment(mp.Image(image_format=mp.ImageFormat.SRGB, data=np.ascontiguousarray(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))))
bg = res.confidence_masks[0].numpy_view()  # category 0 = background
alpha = np.clip((1 - bg - .25) / .5, 0, 1)
alpha = cv2.GaussianBlur(alpha, (0, 0), 1.2)
# keep the largest connected person blob
m = (alpha > .5).astype(np.uint8); n, lab, st, _ = cv2.connectedComponentsWithStats(m)
if n > 1: keep = 1 + np.argmax(st[1:, cv2.CC_STAT_AREA]); alpha = alpha * (lab == keep)
ys, xs = np.where(alpha > .5); x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
pad = int(.04 * max(x1 - x0, y1 - y0)); x0, y0 = max(0, x0 - pad), max(0, y0 - pad); x1, y1 = min(w, x1 + pad), min(h, y1 + pad)
rgba = np.dstack([img, (alpha * 255).astype(np.uint8)])[y0:y1, x0:x1]
os.makedirs('app/photos', exist_ok=True); out = f'app/photos/{a.name}.png'; cv2.imwrite(out, rgba)
man = 'app/photos/manifest.js'; d = {}
if os.path.exists(man):
    t = open(man).read()
    if 'PHOTO_DATA' in t: d = json.loads(t.split('PHOTO_DATA = ')[1].split(';\n')[0])
d[a.name] = {'src': f'photos/{a.name}.png', 'credit': a.credit, 'ar': round((x1 - x0) / (y1 - y0), 3)}
open(man, 'w').write('window.PHOTO_DATA = ' + json.dumps(d, indent=1) + ';\nwindow.PHOTO = Object.fromEntries(Object.entries(PHOTO_DATA).map(([k, v]) => [k, v.src]));\n')
print('wrote', out, rgba.shape, 'credit:', a.credit)
