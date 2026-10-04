# v4 textures: every v2 paper colour becomes a halftone print on newsprint; every background becomes light newsprint.
import numpy as np, cv2, shutil
N = 1024; rng = np.random.default_rng(3)
ground = cv2.imread('app/v3/tex/bg_ground.jpg')
base = cv2.resize(ground, (N, N), interpolation=cv2.INTER_AREA).astype(np.float32)
for name in ['cream', 'kraft', 'navy', 'ink', 'yellow', 'blue', 'red', 'grid']:
    shutil.copy('app/v3/tex/bg_ground.jpg', f'app/v4/tex/bg_{name}.jpg')
cols = {'white': '#FBFAF6', 'cream': '#F1ECE0', 'red': '#E5402B', 'blue': '#0052D9', 'navy': '#1B2A4A', 'ink': '#151515', 'teal': '#1A8A70',
        'yellow': '#F2C230', 'kraft': '#C9A97E', 'grey': '#BDB8AE', 'green': '#2E9B57', 'pink': '#E9A795'}
p = 6.5; yy, xx = np.mgrid[0:N, 0:N].astype(np.float32)
u = (xx + yy) / np.sqrt(2) / p; v = (xx - yy) / np.sqrt(2) / p
d = np.sqrt((u - np.round(u)) ** 2 + (v - np.round(v)) ** 2)
paper = np.array([0xF6, 0xF8, 0xFB], np.float32)
for k, hx in cols.items():
    c = np.array([int(hx[5:7], 16), int(hx[3:5], 16), int(hx[1:3], 16)], np.float32)
    lum = (c @ np.array([.11, .59, .3])) / 255
    if k in ('white', 'cream'):  # light stocks: just paper with the faintest tint
        img = base * (c / 255) * 1.0 + 0
    else:
        cov = .52 if lum > .5 else .6  # dot coverage: round dots stay visible, like a light newspaper print
        r = np.sqrt(cov / np.pi) * 1.08
        ink = np.clip((r - d) * p * .9 + .5, 0, 1)[..., None]
        img = (base / 255 * paper) * (1 - ink) + c * ink
    cv2.imwrite(f'app/v4/tex/p_{k}.jpg', np.clip(img, 0, 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 92])
shutil.copy('app/v3/tex/grain.jpg', 'app/v4/tex/grain.jpg'); shutil.copy('app/v3/tex/bg_ground.jpg', 'app/v4/tex/bg_ground.jpg')
print('ok')
