"""Einzelansichten der vier Leitberge vom Schilt (rechtwinklige Projektion)."""
import sys, json
sys.argv = ['x', sys.argv[1], sys.argv[2]]
here = __file__.rsplit('/', 1)[0]
exec(open(f'{here}/pano.py').read().split('if __name__')[0])
allp = {p['name']: p for p in json.load(open(f'{here}/peaks.json'))}
SP = {"lat": 47.0444, "lon": 9.1122}
VIEWS = {
    "toedi": {"az": 210, "fov": 22, "peaks": ["Tödi", "Glarner Tödi", "Bifertenstock", "Clariden"]},
    "glaernisch": {"az": 243, "fov": 22, "peaks": ["Bächistock", "Vrenelisgärtli", "Ruchen", "Vorder Glärnisch"]},
    # Wiggis vom Talboden in Ennenda aus: dort steht er am markantesten über dem Ort
    "wiggis": {"az": 306, "fov": 34, "peaks": ["Wiggis", "Rautispitz"],
               "sp": {"name": "Ennenda", "m": 470, "lat": 47.0367, "lon": 9.0783}, "dmin": 900},
}
out = sys.argv[2]
for name, v in VIEWS.items():
    sp = v.get("sp", {"name": "Schilt", "m": 2299, **SP})
    cfg = {"lat": sp["lat"], "lon": sp["lon"], "eye": 2, "az": v["az"], "fov": v["fov"], "width": 1600, "cols": 1600, "dmin": v.get("dmin", 1500),
           "min_gap": 0.0012, "link_px": 5, "min_len": 14, "peaks": [allp[n] for n in v["peaks"]]}
    r = render(cfg)
    r["meta"] = {"fov": v["fov"], "az": v["az"], "proj": "rect",
                 "standpoint": sp}
    json.dump(r, open(f'{out}/{name}.json', 'w'))
    print(name, len(r["lines"]), [(p["name"], round(p["x"]), round(p["y"]), p["visible"]) for p in r["peaks"]])
