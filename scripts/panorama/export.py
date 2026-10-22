"""Exportiert das Schilt-Panorama als kompaktes TS-Datenmodul für die Website."""
import json, math, sys

src = json.load(open(sys.argv[1]))
out_ts = sys.argv[2]
EPS = float(sys.argv[3]) if len(sys.argv) > 3 else 0.7
BAND = float(sys.argv[4]) if len(sys.argv) > 4 else 560  # Höhe unterhalb des höchsten Punkts


def rdp(pts, eps):
    if len(pts) < 3:
        return pts
    (x1, y1), (x2, y2) = pts[0], pts[-1]
    dx, dy = x2 - x1, y2 - y1
    L = math.hypot(dx, dy) or 1e-9
    dmax, idx = 0, 0
    for i in range(1, len(pts) - 1):
        x0, y0 = pts[i]
        d = abs(dy * x0 - dx * y0 + x2 * y1 - y2 * x1) / L
        if d > dmax:
            dmax, idx = d, i
    if dmax > eps:
        return rdp(pts[: idx + 1], eps)[:-1] + rdp(pts[idx:], eps)
    return [pts[0], pts[-1]]


lines = src["lines"]
top = min(p[1] for l in lines for p in l["pts"])
y0 = top - 90  # Platz für Beschriftungen
y1 = top + BAND
W = src["W"]

paths = []
for l in lines:
    pts = [(x, y - y0) for x, y in l["pts"] if y <= y1]
    if len(pts) < 8:
        continue
    pts = rdp(pts, EPS)
    # Tiefenklasse: 0 nah, 1 mittel, 2 fern, Horizont separat
    d = l["d"]
    depth = 0 if d < 5000 else 1 if d < 12000 else 2
    # ganze Einheiten reichen (Zeichenfläche 2400 breit); doppelte Punkte entfernen
    ip = []
    for x, y in pts:
        q = (round(x), round(y))
        if not ip or ip[-1] != q:
            ip.append(q)
    if len(ip) < 2:
        continue
    d_attr = "M" + "L".join(f"{x} {y}" for x, y in ip)
    paths.append({"d": d_attr, "depth": depth, "sky": bool(l["sky"]), "km": round(d / 1000, 1)})

# Horizont zuerst, dann fern nach nah (Zeichenreihenfolge)
paths.sort(key=lambda p: (not p["sky"], -p["depth"]))

peaks = []
for p in src["peaks"]:
    peaks.append({
        "name": p["name"], "sub": p.get("sub"), "m": p["m"], "x": round(p["x"], 1), "y": round(p["y"] - y0, 1),
        "visible": p["visible"], "km": round(p["dist"] / 1000, 1), "az": round(p["bearing"], 1),
    })

H = round(y1 - y0)
meta = src.get("meta", {})
size = sum(len(p["d"]) for p in paths)
with open(out_ts, "w") as f:
    f.write("// Automatisch erzeugt aus SRTM-Höhendaten (1\"), siehe scripts/panorama/README.md.\n")
    f.write("// Nicht von Hand bearbeiten.\n")
    f.write("import type { Panorama } from \"@/lib/panorama\";\n\n")
    f.write("export const SCHILT: Panorama = ")
    json.dump({"w": W, "h": H, "fov": meta.get("fov"), "az0": meta.get("az") - meta.get("fov") / 2,
               "horizon": round(-y0, 1), "paths": paths, "peaks": peaks, "standpoint": meta.get("standpoint")}, f, ensure_ascii=False, separators=(",", ":"))
    f.write(";\n")
print("paths", len(paths), "bytes", size, "H", H)
for p in peaks:
    print(p)
