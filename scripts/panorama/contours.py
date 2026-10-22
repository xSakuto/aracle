"""Topografische Höhenlinien (Draufsicht) um den Kärpf aus dem SRTM-Modell."""
import sys, json, math
import numpy as np
from scipy.ndimage import gaussian_filter
from skimage.measure import find_contours

sys.argv = ['x', sys.argv[1], sys.argv[2]]
here = __file__.rsplit('/', 1)[0]
exec(open(f'{here}/pano.py').read().split('if __name__')[0])

LAT, LON, M = 46.91667, 9.09333, 2794  # Kärpf
HALF_LAT, HALF_LON = 0.027, 0.05        # rund 3 x 3.8 km
STEP = 50                                # Äquidistanz 50 m, Zählkurven alle 250 m

r0 = int((48.0 - (LAT + HALF_LAT)) * 3600); r1 = int((48.0 - (LAT - HALF_LAT)) * 3600)
c0 = int((LON - HALF_LON - 8.0) * 3600); c1 = int((LON + HALF_LON - 8.0) * 3600)
Z = gaussian_filter(G[r0:r1, c0:c1].astype(float), 1.2)
rows, cols = Z.shape
# Pixel sind in Ost-West-Richtung um cos(Breite) kürzer
sx = math.cos(math.radians(LAT))
W = 1600
scale = W / (cols * sx)
Hh = rows * scale


def rdp(pts, eps):
    if len(pts) < 3:
        return pts
    a, b = np.array(pts[0]), np.array(pts[-1])
    ab = b - a
    L = np.hypot(*ab) or 1e-9
    q = np.array(pts[1:-1]) - a
    d = np.abs(ab[0] * q[:, 1] - ab[1] * q[:, 0]) / L
    i = int(np.argmax(d)) + 1
    if d[i - 1] > eps:
        return rdp(pts[: i + 1], eps)[:-1] + rdp(pts[i:], eps)
    return [pts[0], pts[-1]]


paths = []
for level in range(1500, 2800, STEP):
    for c in find_contours(Z, level):
        if len(c) < 8:
            continue
        pts = [(p[1] * sx * scale, p[0] * scale) for p in c]
        if len(pts) > 4 and pts[0] == pts[-1]:
            # geschlossener Ring: in zwei Hälften vereinfachen, sonst kollabiert er
            h = len(pts) // 2
            pts = rdp(pts[: h + 1], 1.6)[:-1] + rdp(pts[h:], 1.6)
        else:
            pts = rdp(pts, 1.6)
        ip = []
        for x, y in pts:
            q = (round(x), round(y))
            if not ip or ip[-1] != q:
                ip.append(q)
        if len(ip) < 3:
            continue
        closed = abs(c[0][0] - c[-1][0]) < 1e-6 and abs(c[0][1] - c[-1][1]) < 1e-6
        d = "M" + "L".join(f"{x} {y}" for x, y in ip) + ("Z" if closed else "")
        paths.append({"d": d, "m": level, "index": level % 250 == 0})

# Gipfel in Kartenkoordinaten
px = ((LON - 8.0) * 3600 - c0) * sx * scale
py = ((48.0 - LAT) * 3600 - r0) * scale
out = {"w": W, "h": round(Hh), "step": STEP, "paths": paths,
       "summit": {"name": "Kärpf", "m": M, "x": round(px, 1), "y": round(py, 1)},
       "extent": {"lat": LAT, "lon": LON, "km_w": round(2 * HALF_LON * 111.32 * sx, 2), "km_h": round(2 * HALF_LAT * 111.32, 2)}}
with open(sys.argv[2], "w") as f:
    f.write("// Automatisch erzeugt aus SRTM-Höhendaten, siehe scripts/panorama/README.md.\n")
    f.write("import type { ContourMap } from \"@/lib/panorama\";\n\n")
    f.write("export const KAERPF: ContourMap = ")
    json.dump(out, f, ensure_ascii=False, separators=(",", ":"))
    f.write(";\n")
print("paths", len(paths), "bytes", sum(len(p["d"]) for p in paths), "size", W, round(Hh), out["extent"])
