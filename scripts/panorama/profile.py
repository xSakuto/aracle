"""Geländeprofil vom Vrenelisgärtli nach Glarus (Luftlinie über das Gelände) aus SRTM."""
import sys, json, math
import numpy as np

sys.argv = ['x', sys.argv[1], sys.argv[2]]
here = __file__.rsplit('/', 1)[0]
exec(open(f'{here}/pano.py').read().split('if __name__')[0])

A = {"name": "Vrenelisgärtli", "m": 2904, "lat": 47.00806, "lon": 9.01722}
B = {"name": "Glarus", "m": 472, "lat": 47.0404, "lon": 9.0680}
total = dist(A["lat"], A["lon"], B["lat"], B["lon"])
b = bearing(A["lat"], A["lon"], B["lat"], B["lon"])
N = 420
ds = np.linspace(0, total, N)
la, lo = dest(A["lat"], A["lon"], b, ds)
h = elev(la, lo)
h[0] = A["m"]  # Gipfelhöhe aus dem Verzeichnis statt aus dem Raster
pts = [[round(float(x) / 1000, 3), round(float(y))] for x, y in zip(ds, h)]

# Vereinfachen (Douglas-Peucker in normierten Koordinaten)
def rdp(p, eps):
    if len(p) < 3:
        return p
    a, c = np.array(p[0], float), np.array(p[-1], float)
    q = np.array(p[1:-1], float) - a
    ab = c - a
    L = np.hypot(*ab) or 1e-9
    d = np.abs(ab[0] * q[:, 1] - ab[1] * q[:, 0]) / L
    i = int(np.argmax(d)) + 1
    if d[i - 1] > eps:
        return rdp(p[: i + 1], eps)[:-1] + rdp(p[i:], eps)
    return [p[0], p[-1]]

norm = [[x / (total / 1000), (A["m"] - y) / (A["m"] - 400)] for x, y in pts]
keep = rdp(norm, 0.002)
idx = [norm.index(k) for k in keep]
out = {"from": {k: A[k] for k in ("name", "m")}, "to": {k: B[k] for k in ("name", "m")},
       "km": round(total / 1000, 2), "bearing": round(b, 1), "points": [pts[i] for i in idx]}
with open(sys.argv[2], "w") as f:
    f.write("// Automatisch erzeugt aus SRTM-Höhendaten, siehe scripts/panorama/README.md.\n")
    f.write("export const DESCENT = ")
    json.dump(out, f, ensure_ascii=False, separators=(",", ":"))
    f.write(" as const;\n")
print("km", out["km"], "points", len(out["points"]), "min", min(p[1] for p in pts), "max", max(p[1] for p in pts))
