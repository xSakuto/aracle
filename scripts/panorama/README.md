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

## Einzelansichten und Höhenkarte

Jeder Leitberg hat einen festen Platz und steht für einen Bereich (`lib/mountains.ts`):

| Berg | Darstellung | Standpunkt | Einsatz |
| --- | --- | --- | --- |
| Glärnisch | Silhouette (`views.py`, 22°) | Schilt | Creative Production, Journey |
| Tödi | Silhouette (`views.py`, 22°) | Schilt | Digital Experiences, Projektübersicht |
| Gross Chärpf | Höhenlinien (`contours.py`, 50 m, Zählkurven 250 m) | Draufsicht | Cloud & Infrastructure, Hosting, Kontakt |
| Wiggis | Silhouette (`views.py`, 34°) | Ennenda, 5.1 km | Community & Gaming, Footer |

Der Gross Chärpf ist aus keinem Tal wirklich dominant (der Hausstock überragt ihn
von fast überall), deshalb wird er als Karte gezeigt statt als Silhouette.
Der Wiggis liegt tiefer als der Schilt und wirkt von dort flach; von Ennenda aus
steht er dagegen als Pyramide 19° über dem Ort.

Die Horizontlinie wird pro Spalte als höchster sichtbarer Punkt berechnet und als
durchgehende Linie gespeichert. Gipfelmarken rasten auf den höchsten Punkt dieser
Linie in ihrer Nähe ein, weil die Gipfelkoordinaten auf eine Bogensekunde gerundet sind.

```sh
python3 -I views.py dem out
for v in toedi glaernisch wiggis; do
  python3 -I export.py out/$v.json ../../data/panorama/$v.ts 0.9 560 $(echo $v | tr a-z A-Z) 40
done
python3 -I contours.py dem ../../data/panorama/kaerpf.ts
```

## Genauigkeit (Stand Oktober 2026)

- Abtastung entlang der Sichtstrahlen alle 8 m (bis 3 km), 14 m (bis 12 km) und 20 m,
  also feiner als das 30-m-Raster. Doppelte Spaltenzahl gegenüber der Bildbreite.
- Gratkanten nur dort, wo dahinter Gelände über mindestens 180 m bzw. 3.5 % der
  Distanz verdeckt ist. Kurze Aussetzer bis 3 Spalten werden überbrückt.
- Prüfung: Für jeden Gipfel auf der Horizontlinie wird verglichen, wo er laut
  offizieller Höhe erscheinen muss und wo die berechnete Silhouette ihre Spitze hat.
  Ergebnis: Tödi 0.008°, Bifertenstock 0.008°, Clariden 0.003°, Ruchen 0.025°,
  Wiggis 0.027°, Vrenelisgärtli 0.049°, Gross Chärpf 0.051°.

## Abstieg (Datenschutz, Impressum)

`profile.py` berechnet das Geländeprofil in Luftlinie vom Vrenelisgärtli (2904 m)
nach Glarus (472 m), 5.3 km. Die Komponente `Descent` zeigt beim Lesen die aktuelle
Höhe auf diesem Profil.
