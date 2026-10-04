# Print pipeline: every raster asset gets the same treatment (DESIGN_SYSTEM.md section 2).
#   python3 tools/print.py <in> <out.png> --h 600 [--mode mono|duo|none] [--cut auto|white|person|none] [--border 10]
# --h is the height (px) the asset will be shown at in the 1920x1080 frame, so the halftone pitch (6.5 px) and border
# (10 px) come out identical on screen whatever the source resolution.
import argparse, numpy as np, cv2

ap = argparse.ArgumentParser()
ap.add_argument('src'); ap.add_argument('out')
ap.add_argument('--h', type=float, required=True); ap.add_argument('--mode', default='mono')
ap.add_argument('--cut', default='auto'); ap.add_argument('--border', type=float, default=10)
ap.add_argument('--pitch', type=float, default=6.5); ap.add_argument('--ss', type=int, default=2, help='supersampling of the output')
a = ap.parse_args()

img = cv2.imread(a.src, cv2.IMREAD_UNCHANGED)
if img.ndim == 2: img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGRA)
if img.shape[2] == 3: img = np.dstack([img, np.full(img.shape[:2], 255, np.uint8)])
S = a.h * a.ss / img.shape[0]  # scale to output pixels
img = cv2.resize(img, (round(img.shape[1] * S), round(img.shape[0] * S)), interpolation=cv2.INTER_AREA)
bgr, alpha = img[..., :3], img[..., 3].astype(np.float32) / 255
H, W = alpha.shape

# ---- cut-out ----
mode = a.cut
if mode == 'auto': mode = 'none' if alpha.min() < .99 else 'white'
if mode == 'white':  # flood the near-white background from the borders
    near = (bgr.min(2) > 236).astype(np.uint8)
    ff = near.copy(); mask = np.zeros((H + 2, W + 2), np.uint8)
    for x, y in [(0, 0), (W - 1, 0), (0, H - 1), (W - 1, H - 1)]:
        if ff[y, x]: cv2.floodFill(ff, mask, (x, y), 2)
    bg = (ff == 2).astype(np.float32); alpha = cv2.GaussianBlur(1 - bg, (0, 0), .8 * a.ss)
elif mode == 'person':
    import mediapipe as mp
    from mediapipe.tasks.python import vision, BaseOptions
    seg = vision.ImageSegmenter.create_from_options(vision.ImageSegmenterOptions(
        base_options=BaseOptions(model_asset_path='/tmp/claude-0/models/selfie_multiclass_256x256.tflite'), output_confidence_masks=True))
    r = seg.segment(mp.Image(image_format=mp.ImageFormat.SRGB, data=np.ascontiguousarray(cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB))))
    alpha = np.clip((1 - r.confidence_masks[0].numpy_view() - .25) / .5, 0, 1); alpha = cv2.GaussianBlur(alpha, (0, 0), a.ss)

# ---- halftone (round dots, 45 degrees, fixed on-screen pitch) ----
g = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY).astype(np.float32) / 255
g = np.clip((g - .06) / .9, 0, 1)  # print levels
if a.mode in ('mono', 'duo'):
    p = a.pitch * a.ss; yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    u = (xx + yy) / np.sqrt(2) / p; v = (xx - yy) / np.sqrt(2) / p
    du, dv = u - np.round(u), v - np.round(v); d = np.sqrt(du * du + dv * dv)  # distance to cell centre (cell units)
    cell_g = cv2.GaussianBlur(g, (0, 0), p * .35)
    rad = np.sqrt(np.clip(1 - cell_g, 0, 1) / np.pi) * 1.05  # dot radius for the tone
    ink = np.clip((rad - d) * p * .9 + .5, 0, 1)
    ink_col = np.array([0x15, 0x15, 0x15], np.float32)
    if a.mode == 'duo':  # blue carries the mid-tones, ink the darks
        blue = np.array([0xD9, 0x52, 0x00], np.float32)  # BGR of #0052D9
        mid = np.clip(1 - np.abs(cell_g - .45) / .35, 0, 1)[..., None]
        col = ink_col * (1 - mid) + blue * mid
    else: col = ink_col
    paper = np.array([0xF6, 0xF8, 0xFB], np.float32)
    out = paper * (1 - ink[..., None]) + col * ink[..., None]
else:
    out = bgr.astype(np.float32)

# ---- white border with a scissor-cut edge ----
b = a.border * a.ss
hard = (alpha > .5).astype(np.uint8)
dil = cv2.dilate(hard, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (int(2 * b) + 1, int(2 * b) + 1)))
pad = int(b + 4 * a.ss)
out = cv2.copyMakeBorder(out, pad, pad, pad, pad, cv2.BORDER_CONSTANT, value=(255, 255, 255))
alpha = cv2.copyMakeBorder(alpha, pad, pad, pad, pad, cv2.BORDER_CONSTANT, value=0)
dil = cv2.copyMakeBorder(dil, pad, pad, pad, pad, cv2.BORDER_CONSTANT, value=0)
cs, _ = cv2.findContours(dil, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
edge = np.zeros_like(dil); rng = np.random.default_rng(3)
for c in cs:  # straight runs (~90 px on screen) with 1.2 px deviation
    c = cv2.approxPolyDP(c, 1.5 * a.ss, True)[:, 0].astype(np.float32)
    seg_pts = []
    for i in range(len(c)):
        p0, p1 = c[i], c[(i + 1) % len(c)]; n = max(1, int(np.linalg.norm(p1 - p0) / (90 * a.ss)))
        for k in range(n): seg_pts.append(p0 + (p1 - p0) * k / n + rng.normal(0, 1.2 * a.ss, 2))
    cv2.fillPoly(edge, [np.array(seg_pts, np.int32)], 1)
border_white = np.array([0xF6, 0xFA, 0xFB], np.float32)
a3 = alpha[..., None]
rgb = out * a3 + border_white * (1 - a3)
A = np.maximum(edge.astype(np.float32), alpha)
A = cv2.GaussianBlur(A, (0, 0), .6 * a.ss)
res = np.dstack([np.clip(rgb, 0, 255).astype(np.uint8), (A * 255).astype(np.uint8)])
cv2.imwrite(a.out, res)
print('wrote', a.out, res.shape, 'cut:', mode, 'halftone:', a.mode)
