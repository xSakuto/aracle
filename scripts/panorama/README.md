# Glarner Panorama: Herleitung der Bergsilhouetten

Die Berglinien auf der Website sind nicht gezeichnet, sondern aus Höhendaten
berechnet. So stimmen Gipfel, Grate und Beschriftungen mit der Wirklichkeit überein.

## Standpunkt

**Schilt, 2299 m ü. M.** (47.0444° N, 9.1122° E), der Hausberg über Ennenda.
Von dort sind alle vier Leitberge aus derselben Perspektive sichtbar:

| Berg | Gipfel | Höhe | Distanz | Azimut | sichtbar |
| --- | --- | --- | --- | --- | --- |
| Tödi | Piz Russein | 3614 m | 30.0 km | 210° | ja, höchster Punkt seines Abschnitts |
| Glärnisch | Vrenelisgärtli | 2904 m | 8.3 km | 241° | ja |
| Glärnisch | Ruchen | 2901 m | 9.2 km | 246° | ja |
| Glärnisch | Bächistock | 2914 m | 11.0 km | 239° | nein, hinter dem Vrenelisgärtli; als "verdeckt" markiert |
| Gross Chärpf | | 2794 m | 14.3 km | 186° | ja |
| Wiggis | | 2282 m | 7.0 km | 290° | ja |

Höhen und Koordinaten: Gipfelverzeichnis `alps.txt` (EPFL-Projekt Alpano),
abgeglichen mit Wikipedia (Liste der Berge des Kantons Glarus, Glärnisch) und
glarnerland.ch (Wiggis 2282 m, Ruchen 2901 m).

## Daten

SRTM-Höhenmodell mit 1 Bogensekunde Auflösung (rund 30 m), Kacheln
N46E008, N46E009, N47E008, N47E009, bezogen aus dem öffentlichen Repository
`geofot96/Project-Alpano` (je 25.9 MB, nicht im Repo eingecheckt).

```sh
for t in N46E008 N46E009 N47E008 N47E009; do
  curl -sSo dem/$t.hgt https://raw.githubusercontent.com/geofot96/Project-Alpano/master/$t.hgt
done
```

## Verfahren (`pano.py`)

1. Pro Bildspalte (Zylinderprojektion, 120° Bildwinkel, 2400 Spalten) wird ein
   Strahl vom Standpunkt über das Gelände verfolgt.
2. Erdkrümmung und Refraktion (k = 0.13) werden berücksichtigt.
3. Gezeichnet werden **sichtbare Gratkanten**: Stellen, an denen sichtbares Gelände
   endet und dahinterliegendes Gelände verdeckt ist. Das ergibt die Linien einer
   Panoramazeichnung, nicht bloss ein Höhenprofil.
4. Kanten benachbarter Spalten werden zu Linien verbunden, kurze Fragmente verworfen.
5. Gipfel werden aus ihren Koordinaten projiziert und auf Sichtbarkeit geprüft.

`export.py` vereinfacht die Linien (Douglas-Peucker), rundet auf ganze Einheiten
und schreibt `data/panorama/schilt.ts` (rund 23 KB, gzip rund 8 KB).

```sh
python3 -I final.py dem schilt.json
python3 -I export.py schilt.json ../../data/panorama/schilt.ts 0.7 520
```

Im Browser wird nichts neu berechnet; die Komponente `components/alpine/Panorama.tsx`
zeichnet nur die vorbereiteten Pfade.
