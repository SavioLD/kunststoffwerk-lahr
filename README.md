# Bernauer Group — B2B-Website-Redesign

Konzern-Website für die **Bernauer Group** mit ihren drei spezialisierten
Unternehmen. Statisches HTML/CSS/JS, keine Build-Tools, keine externen
Abhängigkeiten — einfach `index.html` im Browser öffnen oder das Verzeichnis
auf einen beliebigen Webserver legen.

## Konzernstruktur

| Unternehmen | Rolle | Schwerpunkt | Seite |
|---|---|---|---|
| **Textilwerke Todtnau Bernauer KG** | Muttergesellschaft | BERATEX® Mitläufer-/Trenngewebe aus 100 % PE, seit 1971 | `beratex.html` |
| **Kunststoffwerk Lahr GmbH** | Tochtergesellschaft (1991) | Mono- und Coexblasfolien aus PE, PP, EVA | `kunststoffwerk-lahr.html` |
| **TEXPAK GmbH** | Vertrieb & Konfektion (1979) | Niederschmelzende EVA-Folien und -Beutel, PoLAflex | `texpak.html` |

Die Gruppenübersicht liegt auf `index.html`.

## Dateien

```
.
├── index.html                 Konzern-Startseite (Struktur, Historie, Weiche)
├── kunststoffwerk-lahr.html   Anker-Unternehmen
├── beratex.html               Muttergesellschaft, inkl. technischer Daten
├── texpak.html                EVA-Folien und -Beutel
├── assets/
│   ├── styles.css             Design-System (Tokens, Komponenten, Responsive)
│   └── app.js                 Sprachumschaltung, Mobil-Navigation, Reveal
└── README.md
```

## Navigation / Konzern-Weiche

Die Zugehörigkeit zur Gruppe ist auf jeder Seite an drei Stellen sichtbar:

1. **Kopfzeile, Zeile 1** — dunkles Konzernband mit Bernauer-Marke und der
   Weiche über alle drei Sparten. Die aktive Sparte ist weiß hinterlegt und
   trägt oben ihre Sparten-Farbe.
2. **Kopfzeile, Zeile 2** — Navigation der jeweiligen Sparte.
3. **Abschnitt „Teil eines größeren Ganzen"** — Querverweis auf die beiden
   Schwester­unternehmen am Seitenende.

Unter 1080 px Breite wandert die Weiche in die mobile Schublade (oberhalb der
Seiten­navigation, durch eine Trennlinie abgesetzt).

## Sprachen

Deutsch ist die Ausgangssprache und steht im Markup. Englisch liegt in
`data-en` (reiner Text) bzw. `data-en-html` (Text mit Auszeichnung) am
jeweiligen Element. Der Umschalter **DE / EN** sitzt rechts im Konzernband.

- Die Wahl wird in `localStorage` gespeichert und gilt für alle Seiten.
- `<title>`, `<meta name="description">` und `<html lang>` werden mitgeführt.
- Ohne JavaScript bleibt die vollständige deutsche Fassung sichtbar.

Neue Übersetzung ergänzen:

```html
<h2 data-en="Technical data">Technische Daten</h2>
<p data-en-html="See <strong>data sheet</strong>">Siehe <strong>Datenblatt</strong></p>
```

## Farben

Die Palette ist an den Logos der bestehenden Auftritte ausgerichtet.

| Rolle | Farbton | Wert |
|---|---|---|
| Bernauer Group | Rot des Schriftzugs BERNAUER | `#9e1b22` |
| Kunststoffwerk Lahr | Navy/Stahlblau | `#2b4c8c` |
| Textilwerke Todtnau / BERATEX® | Ziegelrot | `#9b1c1f` |
| TEXPAK | Anthrazit (schwarzes Logo) | `#2f3439` |

Dunkle Flächen (Kopfleiste, Hero, CTA) nutzen `--ink: #1c2837`, ein
Schieferblau in Anlehnung an die dunkle Kopfleiste der alten Seiten.

Jede Sparten­seite setzt ihre Leitfarbe über eine Zeile im `<head>`:

```html
<style>:root { --brand: var(--kwl); --brand-dark: var(--kwl-dark); }</style>
```

Alle Akzente (Buttons, Eyebrows, Icons, Kennzahlen) folgen automatisch.

Zusätzlich gibt es `--brand-light` für Elemente auf dunklem Grund. Sie
entspricht standardmäßig `--brand`; nur TEXPAK weicht ab, weil reines
Anthrazit auf der dunklen Hero- und CTA-Fläche nicht mehr zu erkennen wäre:

```html
<style>:root { --brand: var(--texpak); --brand-dark: var(--texpak-dark);
               --brand-light: #4f5862; }</style>
```

## Grafiken

Die technischen Abbildungen — Organigramm, Blasfolienanlage, Webbindung,
EVA-Beutel im Mischer — sind handgeschriebenes Inline-SVG. Keine Bilddateien,
keine externen Requests; Beschriftungen werden mit übersetzt.

## Getestet

- Struktur aller vier Seiten geprüft (Verschachtelung, keine offenen Tags)
- Keine toten Links, Anker oder Asset-Pfade
- Kein waagerechtes Überlaufen bei 360 / 390 / 480 / 768 / 900 / 1024 / 1100 /
  1200 / 1280 / 1440 / 1920 px
- DE↔EN inklusive Rückweg auf allen Seiten, Wahl bleibt beim Seitenwechsel
- Klebende Kopfzeile, mobile Schublade, Sprungziele unterhalb der Kopfzeile
- Keine JavaScript-Fehler

## Inhalte

Firmengeschichte, Produktbeschreibungen sowie die technischen Daten und die
Artikel­tabelle zu BERATEX® stammen aus den bestehenden Auftritten der Gruppe.
Als Kontakt ist durchgehend der zentrale Anschluss der Gruppe hinterlegt
(`+49 7671 9117 0`, `info@beratex.com`); für Lahr und TEXPAK lagen keine
eigenen Durchwahlen vor. Impressum, AGB und Datenschutz sind als Platzhalter
verlinkt und noch zu hinterlegen.
