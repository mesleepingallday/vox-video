# v3 shared paper: newsprint ground (tileable) + one grain overlay. python3 tools/make_v3_tex.py
import numpy as np, cv2
rng = np.random.default_rng(7); N = 2048
def tile_noise(scale, n=N):
    s = max(2, n // scale); g = rng.standard_normal((s, s)).astype(np.float32)
    g = np.tile(g, (3, 3)); g = cv2.resize(g, (n * 3, n * 3), interpolation=cv2.INTER_CUBIC)
    return g[n:2 * n, n:2 * n]
base = np.array([232, 239, 242], np.float32)  # BGR of #F2EFE8
lum = .55 * tile_noise(6) + .3 * tile_noise(48) + .15 * tile_noise(256)
fib = np.zeros((N, N), np.float32)  # short paper fibres
for _ in range(9000):
    x, y = rng.integers(0, N, 2); a = rng.uniform(0, np.pi); L = rng.uniform(6, 26)
    cv2.line(fib, (int(x), int(y)), (int(x + np.cos(a) * L), int(y + np.sin(a) * L)), float(rng.uniform(.3, 1)), 1, cv2.LINE_AA)
fib = cv2.GaussianBlur(fib, (0, 0), .6)
img = base[None, None, :] + lum[..., None] * 2.2 - fib[..., None] * 5
cv2.imwrite('app/v3/tex/bg_ground.jpg', np.clip(img, 0, 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 92])
g = rng.normal(0, 1, (1024, 1024)).astype(np.float32); g = cv2.GaussianBlur(g, (0, 0), .7)
g = np.clip(128 + g * 60, 0, 255).astype(np.uint8)
cv2.imwrite('app/v3/tex/grain.jpg', g[:512, :512], [cv2.IMWRITE_JPEG_QUALITY, 90])
print('ok')
