---
title: "PrezEval: KI-Agenten auf professionellen Folien benchmarken"
date: 2026-04-06
description: "Wie gut kann ein KI-Agent eine professionelle Beratungsfolie anhand eines Screenshots reproduzieren? Wir haben einen Benchmark entwickelt, um genau das herauszufinden."
lang: de
---

## Ziel

Wie gut kann ein KI-Agent professionelle Beratungsfolien anhand visueller Vorgaben reproduzieren?

Beim Aufbau von Folio sind wir zu der Überzeugung gelangt, dass unser Ansatz deutlich bessere Ergebnisse liefert als alle anderen. Aber halten wir das mit Zahlen fest.

PrezEval ist ein Benchmark, der genau das misst. Gegeben ein Zielbild einer Folie und die originale Quellpräsentation (mit dem bereits ausgewählten korrekten Layout) muss ein Agent die Folie so bearbeiten, dass sie dem Ziel so nah wie möglich kommt. Ein Vision-Language-Modell bewertet das Ergebnis anschließend durch Vergleich von Struktur, Inhalt, Hierarchie und Styling.

Diese Aufgabe ist trügerisch schwer. Echte Beratungsfolien sind dichte, präzise Artefakte: eine falsch ausgerichtete Chart-Legende, ein fehlender Achsenbeschriftung oder eine falsche Farbe in einer Heatmap-Zelle gelten als Fehler. Der Benchmark testet nicht nur, ob ein Agent Text auf eine Folie schreiben kann, sondern ob er Charts, Tabellen, benutzerdefinierte Formen, mehrspältige Layouts und markenspezifisches Styling beherrscht - alles gleichzeitig.

## Benchmark-Aufbau

### Quellmaterial

Wir haben 61 Folien aus 10 professionellen Präsentationsdecks zusammengestellt, die bedeutende Beratungs- und Wirtschaftsprüfungsgesellschaften abdecken: McKinsey, Bain, BCG, PwC, EY und Deloitte sowie die Kanzleien Cleary Gottlieb und Mattos Filho. Es handelt sich um reale Decks zu Themen wie Gesundheitsökonomie, Energiewende und Verbraucherdatenschutz.

Die Folien wurden ausgewählt, um maximale visuelle Komplexität und Elementvielfalt zu gewährleisten. Hier ist, was der Benchmark enthält:

| Element                              | Folien | Anteil |
|--------------------------------------|--------|--------|
| Charts (Balken, Linie, Kreis, Kombi…)| 33     | 54 %   |
| Mehrspältige Layouts                 | 24     | 39 %   |
| Logos und Icons                      | 17*    | 28 %   |
| Tabellen                             | 14     | 23 %   |
| Textschwere Layouts                  | 13     | 21 %   |
| Komplexe Diagramme / Timelines       | 8      | 13 %   |
| Karten                               | 5      | 8 %    |
| Benutzerdefinierte Verbundformen      | 3      | 5 %    |

*\*Nur substanzielle illustrative Icons gezählt, ohne Unternehmenslogos (die auf ca. 45 Folien erscheinen).*

### Was es so schwer macht

- **Stilvielfalt.** Jede Quellfirma hat ihre eigene visuelle Identität: Farbpaletten, Schriftenwahl, Layout-Konventionen. Der Agent kann sich nicht auf ein einziges Template verlassen - er muss sich an 10 verschiedene Design-Systeme über 21 verschiedene Folienlayouts hinweg anpassen.
- **Charts dominieren.** Mehr als die Hälfte der Folien enthält mindestens einen Chart: gestapelte Balken, Kombicharts mit dualen Achsen, Heatmap-Matrizen, Flächencharts. Einen Chart zu reproduzieren bedeutet, Datenwerte, Achsenbeschriftungen, Legenden, Farben und Positionierung alle korrekt zu treffen.
- **Layouts sind komplex.** 39 % der Folien nutzen mehrspältige Layouts, bei denen Inhalte präzise platziert werden müssen. Eine McKinsey-Folie könnte links einen Balkendiagramm, rechts eine Aufzählung und unten eine Fußnoten-Leiste haben - alles innerhalb eines Marken-Templates.
- **Benutzerdefinierte Formen fordern die Grenzen aus.** Einige Folien enthalten Formen, die aus geometrischen Grundelementen aufgebaut sind: ein Trichter, der sich von 43.000 auf 13.000 Kandidaten verengt, ein kegelförmiger Prozessfluss, eine Wippe, die Preispunkte vergleicht. Diese erfordern vom Agenten, mehrere Basisformen zu einem kohärenten Bild zu fügen.

### Aufgaben-Setup

Für jede der 61 Aufgaben erhält der Agent:
- Die `.pptx`-Quelldatei mit dem bereits ausgewählten korrekten Folienlayout (das reproduziert die reale Situation, in der der Nutzer mit dem Template seiner Firma beginnt)
- Einen Screenshot der zu reproduzierenden Zielfolie
- Die Anweisung: *„Erstelle die im beigefügten Bild gezeigte Folie nach: Reproduziere sie exakt."*

Der Agent bearbeitet die Folie dann per Tool-Calls, das Ergebnis wird als PNG gerendert und von einem Vision-Language-Modell bewertet. Das Modell vergibt ganzzahlige Werte von 1 bis 5, da [Forschungsergebnisse zeigen](https://arxiv.org/abs/2601.03444), dass eine kompakte ganzzahlige Skala die Übereinstimmung zwischen Mensch und LLM bei LLM-as-a-Judge-Setups maximiert. Zur besseren Lesbarkeit wandeln wir die Bewertungen in einen Prozentwert von 0-100 % um.

## Ergebnisse

Wir haben fünf Konfigurationen verglichen:

| Konfiguration                   | Score  | Zeit    | Schritte | Aufgaben |
|---------------------------------|--------|---------|----------|----------|
| **Folio Max**                   | 70,8 % | 293,4 s | 6,3      | 60/61    |
| **Folio Medium**                | 49,6 % | 207,7 s | 8,8      | 61/61    |
| **Folio Fast**                  | 38,9 % | 157,5 s | 9,5      | 61/61    |
| Claude for Powerpoint (Opus)    | 36,5 % | 176,5 s | 11,6     | 61/61    |
| Claude for Powerpoint (Sonnet)  | 32,4 % | 154,4 s | 9,2      | 61/61    |

**Folio Max** führt mit weitem Abstand bei 70,8 % - fast doppelt so hoch wie der nächstbeste Nicht-Folio-Agent. Das erreicht er mit durchschnittlich den wenigsten Schritten (6,3), was auf einen effizienteren Ansatz hindeutet, obwohl er pro Aufgabe länger braucht (293,4 s) aufgrund tieferer Reasoning-Prozesse.

**Folio Medium** erreicht 49,6 %: Die meisten Reproduktionen treffen Struktur und Inhalt, weisen aber spürbare Unterschiede in Styling oder Positionierung auf.

**Folio Fast** tauscht Genauigkeit gegen Geschwindigkeit - 24 % schneller als Folio Medium bei 38,9 % Score. Interessanterweise verwendet er im Schnitt mehr Schritte (9,5 vs. 8,8), was darauf hindeutet, dass das kleinere Modell explorativere Aktionen unternimmt.

**Claude for Powerpoint (Opus)** erreicht 36,5 % trotz der meisten Schritte (11,6) und deutlich mehr Rechenaufwand. **Claude for Powerpoint (Sonnet)** erzielt mit 32,4 % den niedrigsten Wert aller Konfigurationen - bei gleichzeitig der schnellsten Ausführungszeit von 154,4 s.

<div id="prezeval-chart"></div>

### Score-Aufschlüsselung nach Inhaltstyp

Die Aufschlüsselung der Scores nach Folieninhalt zeigt klare Muster:

| Inhaltstyp           | Folio Medium | Claude for PPT |
|----------------------|--------------|----------------|
| Textschwere Folien   | 66,8 %       | 48,3 %         |
| Folien ohne Charts   | 63,5 %       | 44,8 %         |
| Tabellen             | 48,3 %       | 38,3 %         |
| Diagramme            | 47,3 %       | 25,0 %         |
| Charts               | 38,0 %       | 29,5 %         |
| Karten               | 12,5 %       | 12,5 %         |
| **Gesamt**           | **49,5 %**   | **36,5 %**     |

Textschwere Folien sind die einfachste Kategorie, Karten die schwierigste (für beide Agenten gleich schlecht). Charts, die 54 % des Benchmarks ausmachen, ziehen den Gesamtscore erheblich nach unten.

### Wo Folio glänzt

Folio erzielt durchgehend gute Ergebnisse bei strukturierten Textfolien: formatierter juristischer Text, mehrgliedrige Layouts mit farbigen Boxen, Inhaltsverzeichnis-Seiten und mehrspältige Icon-Layouts. Dort erreicht Folio Max regelmäßig nahezu perfekte Scores, und selbst Folio Medium und Folio Fast kommen auf 75-100 %, während beide Claude-for-Powerpoint-Varianten typischerweise deutlich zurückfallen.

### Was nach wie vor schwierig ist

Etwa 20 % des Benchmarks sind praktisch ungelöst: Alle fünf Agenten erzielen bei den schwierigsten Aufgaben 25 % oder weniger. Die häufigsten Fehlermuster:

- **Geografische Karten.** Agenten haben Schwierigkeiten, genaue Kartenvisualisierungen zu produzieren. Sie ersetzen die Karte unter Umständen durch eine unpassende Form, rendern sie in der falschen Größe, oder verlieren die farbliche Kodierung auf Staatsebene. Folio versucht Karten, aber die Ergebnisse sind durchgehend schwach: Eine USA-Karte kann verkleinert mit fehlenden Details erscheinen, oder eine Weltkarte durch ein kreisförmiges Diagramm ersetzt werden.
- **Komplexe Charts mit dichten Daten.** Kombicharts (Balken und Linien auf dualen Achsen), Multi-Panel-Dashboards und Heatmap-Matrizen überfordern alle Agenten. Typische Fehler: komplette Charts fehlen, Achsenbeschriftungen werden ausgelassen, Datenwerte verschwinden.
- **Benutzerdefinierte Verbundformen.** Trichter aus Trapezen, Quadrantendiagramme mit gekrümmten Trennlinien und ähnliche Konstruktionen erfordern präzise Schichtung und Ausrichtung, die Agenten noch nicht zuverlässig beherrschen.

### Wo Folio noch Potenzial hat

Selbst Folio Max kämpft bei einigen Aufgaben (Score 25 % oder weniger), obwohl der Gesamtdurchschnitt bei 70,8 % liegt. Das betrifft vor allem Folien mit großen strukturierten Rastern, in Charts eingebetteten Markenlogos oder dekorativen Elementen. Das zeigt konkrete Ansatzpunkte für die Weiterentwicklung.

Auch Geschwindigkeit bleibt ein Fokusthema. Folio Max benötigt fast 5 Minuten pro Aufgabe, selbst Folio Fast im Schnitt über 2,5 Minuten. Ein guter KI-Assistent sollte sich wie eine nahtlose Fortsetzung der eigenen Arbeit anfühlen - nicht wie ein Tennis-Rallye, bei dem man auf den Ball wartet. Wir arbeiten daran, die Latenz in den kommenden Wochen deutlich zu reduzieren.

Alle Ergebnisse - einschließlich generierter und Referenzbilder pro Aufgabe sowie Evaluator-Kommentare - sind im [PrezEval-Repository](https://github.com/FolioLabs/PrezEvalPublic) verfügbar.
