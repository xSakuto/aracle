import sys, json
sys.argv=['x', sys.argv[1], sys.argv[2]]
exec(open(__file__.replace('final.py','pano.py')).read().split('if __name__')[0])
allp={p['name']:p for p in json.load(open(__file__.replace('final.py','peaks.json')))}
use=['Kärpf','Tödi','Bächistock','Vrenelisgärtli','Ruchen','Vorder Glärnisch','Wiggis']
cfg={"lat":47.0444,"lon":9.1122,"eye":2,"az":237,"fov":120,"proj":"cyl","width":2400,"cols":4800,"dmin":1200,"min_len":50,
     "peaks":[allp[n] for n in use]}
r=render(cfg)
r["meta"]={"fov":cfg["fov"],"az":cfg["az"],"standpoint":{"name":"Schilt","m":2299,"lat":47.0444,"lon":9.1122}}
json.dump(r,open(sys.argv[2],'w'))
