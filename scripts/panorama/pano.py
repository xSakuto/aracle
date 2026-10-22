"""
Panorama-Linienzeichnung aus SRTM-Höhendaten (1", 4 Kacheln N46/N47 E008/E009).

Für einen Standort (lat, lon, Augenhöhe) und einen Blickwinkel werden pro
Bildspalte Strahlen über das Gelände verfolgt. Gezeichnet werden sichtbare
Gratkanten (Silhouetten), nicht Höhenprofile: Eine Kante entsteht dort, wo
sichtbares Gelände endet und dahinter verdecktes Gelände liegt.
Erdkrümmung und Refraktion (k = 0.13) sind berücksichtigt.

Ausgabe: JSON mit Polylinien in Bildkoordinaten, Distanz je Linie und
projizierten Gipfelpositionen.
"""
import json, math, sys
import numpy as np
from scipy.ndimage import map_coordinates

DEM_DIR = sys.argv[1] if len(sys.argv) > 1 else "."
N = 3601
R = 6371000.0
K = 0.13


def load():
    tiles = {}
    for lat in (46, 47):
        for lon in (8, 9):
            a = np.fromfile(f"{DEM_DIR}/N{lat}E{lon:03d}.hgt", dtype=">i2").reshape(N, N).astype(np.float32)
            a[a < -1000] = np.nan
            tiles[(lat, lon)] = a
    # Gitter 48°N oben bis 46°N unten, 8°E links bis 10°E rechts
    top = np.hstack([tiles[(47, 8)][:, :-1], tiles[(47, 9)]])
    bot = np.hstack([tiles[(46, 8)][:, :-1], tiles[(46, 9)]])
    g = np.vstack([top[:-1], bot])
    g = np.nan_to_num(g, nan=np.nanmean(g))
    return g


G = load()
SIZE = G.shape[0]  # 7201


def elev(lat, lon):
    row = np.atleast_1d((48.0 - np.asarray(lat, dtype=np.float64)) * 3600.0)
    col = np.atleast_1d((np.asarray(lon, dtype=np.float64) - 8.0) * 3600.0)
    out = map_coordinates(G, [row, col], order=1, mode="nearest")
    return out if np.ndim(lat) else out[0]


def dest(lat, lon, az, d):
    """Zielpunkt bei Azimut az (Grad) und Distanz d (m), sphärisch."""
    la1 = math.radians(lat)
    lo1 = math.radians(lon)
    th = np.radians(az)
    dr = np.asarray(d) / R
    la2 = np.arcsin(np.sin(la1) * np.cos(dr) + np.cos(la1) * np.sin(dr) * np.cos(th))
    lo2 = lo1 + np.arctan2(np.sin(th) * np.sin(dr) * np.cos(la1), np.cos(dr) - np.sin(la1) * np.sin(la2))
    return np.degrees(la2), np.degrees(lo2)


def bearing(lat1, lon1, lat2, lon2):
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dl = math.radians(lon2 - lon1)
    y = math.sin(dl) * math.cos(p2)
    x = math.cos(p1) * math.sin(p2) - math.sin(p1) * math.cos(p2) * math.cos(dl)
    return (math.degrees(math.atan2(y, x)) + 360) % 360


def dist(lat1, lon1, lat2, lon2):
    p1, p2 = math.radians(lat1), math.radians(lat2)
    a = math.sin((p2 - p1) / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(math.radians(lon2 - lon1) / 2) ** 2
    return 2 * R * math.asin(math.sqrt(a))


def render(cfg):
    lat, lon = cfg["lat"], cfg["lon"]
    eye = float(elev(lat, lon)) + cfg.get("eye", 2.0)
    az_c, fov = cfg["az"], cfg["fov"]
    W = cfg.get("width", 1600)
    CYL = cfg.get("proj") == "cyl"
    f = W / math.radians(fov) if CYL else (W / 2) / math.tan(math.radians(fov / 2))
    pitch = math.radians(cfg.get("pitch", 0.0))
    dmax = cfg.get("dmax", 60000)
    dmin = cfg.get("dmin", 60)
    d = np.concatenate([np.arange(60, 3000, 15), np.arange(3000, 15000, 30), np.arange(15000, dmax, 60)]).astype(np.float64)
    d = d[d >= dmin]
    cols = cfg.get("cols", 1200)
    min_gap = cfg.get("min_gap", 0.0025)  # rad: wie viel Gelände dahinter verdeckt sein muss
    crests_per_col = []
    xs = []
    for i in range(cols):
        x = -W / 2 + (i + 0.5) * W / cols
        daz = (x / W) * fov if CYL else math.degrees(math.atan(x / f))
        az = az_c + daz
        la, lo = dest(lat, lon, az, d)
        h = elev(la, lo)
        drop = d * d / (2 * R) * (1 - K)
        ang = np.arctan2(h - eye - drop, d)
        # sichtbare Grate: lokale Maxima, die über dem bisherigen Maximum liegen
        runmax = np.maximum.accumulate(ang)
        prev = np.concatenate([[-9], runmax[:-1]])
        vis = ang >= prev
        crest = []
        n = len(ang)
        j = 1
        while j < n - 1:
            if vis[j] and ang[j] >= ang[j - 1] and ang[j] > ang[j + 1]:
                # wie tief fällt das Gelände dahinter ab, bevor es wieder auftaucht?
                k = j + 1
                low = ang[j]
                while k < n and ang[k] < ang[j]:
                    low = min(low, ang[k])
                    k += 1
                gap = ang[j] - low
                if k >= n or gap > min_gap:
                    crest.append((float(ang[j]), float(d[j]), k >= n))
                j = k
            else:
                j += 1
        crests_per_col.append(crest)
        xs.append(x)

    def proj(x, a):
        # Rechtwinklige Projektion mit Neigung
        if CYL:
            return x + W / 2, -f * math.tan(a - pitch)
        cosd = math.cos(math.atan(x / f))
        y = -f * math.tan(a - pitch) / cosd
        return x + W / 2, y

    # Kanten über Spalten verbinden
    lines = []  # dict(points, d)
    open_lines = []
    for i, crest in enumerate(crests_per_col):
        used = set()
        new_open = []
        for ln in open_lines:
            la_, ld = ln["last"]
            best, bi = None, -1
            for ci, (a, dd, sky) in enumerate(crest):
                if ci in used:
                    continue
                if abs(a - la_) * f > cfg.get("link_px", 4) or abs(dd - ld) / ld > 0.12:
                    continue
                score = abs(a - la_) * f + abs(dd - ld) / ld * 20
                if best is None or score < best:
                    best, bi = score, ci
            if bi >= 0:
                a, dd, sky = crest[bi]
                used.add(bi)
                ln["pts"].append(proj(xs[i], a))
                ln["ds"].append(dd)
                ln["sky"] += sky
                ln["last"] = (a, dd)
                new_open.append(ln)
            else:
                lines.append(ln)
        for ci, (a, dd, sky) in enumerate(crest):
            if ci not in used:
                new_open.append({"pts": [proj(xs[i], a)], "ds": [dd], "sky": int(sky), "last": (a, dd)})
        open_lines = new_open
    lines += open_lines

    out = []
    min_len = cfg.get("min_len", 12)
    for ln in lines:
        if len(ln["pts"]) < min_len:
            continue
        out.append({
            "pts": ln["pts"],
            "d": float(np.median(ln["ds"])),
            "sky": ln["sky"] / len(ln["pts"]) > 0.5,
        })

    peaks = []
    for p in cfg.get("peaks", []):
        b = bearing(lat, lon, p["lat"], p["lon"])
        daz = (b - az_c + 540) % 360 - 180
        if abs(daz) >= fov / 2:
            continue
        dd = dist(lat, lon, p["lat"], p["lon"])
        # Höhe aus der Gipfelangabe, nicht aus dem 30-m-Raster
        a = math.atan2(p["m"] - eye - dd * dd / (2 * R) * (1 - K), dd)
        x = (daz / fov) * W if CYL else f * math.tan(math.radians(daz))
        # Sichtbarkeit: Strahl zum Gipfel prüfen
        la, lo = dest(lat, lon, b, np.arange(60, dd - 200, 30))
        hh = elev(la, lo)
        dds = np.arange(60, dd - 200, 30)
        aa = np.arctan2(hh - eye - dds * dds / (2 * R) * (1 - K), dds)
        visible = bool((aa < a - 0.0008).all())
        px, py = proj(x, a)
        peaks.append({**p, "x": px, "y": py, "dist": dd, "visible": visible, "bearing": b})
    return {"eye": eye, "W": W, "lines": out, "peaks": peaks, "f": f}


if __name__ == "__main__":
    cfg = json.loads(sys.argv[2])
    res = render(cfg)
    json.dump(res, open(sys.argv[3], "w"))
    ys = [p[1] for l in res["lines"] for p in l["pts"]]
    print("eye", round(res["eye"]), "lines", len(res["lines"]), "y", round(min(ys)), round(max(ys)))
    for p in res["peaks"]:
        print(p["name"], round(p["x"]), round(p["y"]), round(p["dist"]), "visible" if p["visible"] else "HIDDEN", round(p["bearing"], 1))
