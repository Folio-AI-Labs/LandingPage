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

Wir haben vier Konfigurationen verglichen:

| Konfiguration                   | Score  | Zeit  | Schritte |
|---------------------------------|--------|-------|----------|
| **Folio Max**                   | 70,0 % | 2:19  | 5,5      |
| **Folio Medium**                | 66,8 % | 2:44  | 5,2      |
| **Folio Fast**                  | 43,0 % | 1:32  | 13,7     |
| Claude for PowerPoint (Sonnet 4.6) | 46,9 % | 16:03 | 25,5  |

**Folio Max** führt mit 70,0 % und übertrifft den nächstbesten Nicht-Folio-Agenten um 23 Punkte (49 % relativer Vorsprung). Diesen Score erreicht er in 138,9 s pro Aufgabe - rund 7x schneller als Claude for PowerPoint (962,8 s, fast 16 Minuten) - und mit weit weniger Schritten (5,5 statt 25,5). Folio Max und Folio Fast bilden zusammen die Pareto-Front - der eine markiert das Ende höchster Genauigkeit, der andere das niedrigster Latenz - während Claude for PowerPoint dominiert wird: langsamer und ungenauer als Folio Max.

**Folio Medium** erreicht 66,8 % und liegt damit in Schlagdistanz zu Max, bei etwas geringeren Kosten. Es nutzt weniger Reasoning, trifft aber fast ebenso viele Reproduktionen sauber.

**Folio Fast** ist die günstige Tier mit geringer Latenz: Mit 0,21 $ pro Aufgabe kostet er rund 5x weniger als Folio Max und 9x weniger als Claude for PowerPoint, und mit etwa 1,5 Minuten pro Folie ist er die schnellste Konfiguration im Feld. Der Kompromiss ist die Genauigkeit (43,0 %) und mehr explorative Aktionen (13,7 Schritte), da er auf einem kleineren, günstigeren Modell läuft.

**Claude for PowerPoint (Sonnet 4.6)** erreicht 46,9 %, bezahlt dafür aber teuer: 962,8 s pro Aufgabe (rund 7x langsamer als Folio Max), 25,5 Schritte, 1,80 $ und 5 von 61 Aufgaben unvollständig. Es bearbeitet rohes OOXML direkt, was im Vergleich zu Folios strukturiertem Ansatz langsam und fehleranfällig ist.

<div id="prezeval-chart"></div>

### Score-Aufschlüsselung nach Inhaltstyp

Die Aufschlüsselung der Scores nach Folieninhalt zeigt klare Muster:

| Inhaltstyp           | Folio Medium | Claude for PPT |
|----------------------|--------------|----------------|
| Charts               | 68,5 %       | 42,3 %         |
| Textschwere Folien   | 66,7 %       | 50,0 %         |
| Diagramme            | 66,1 %       | 43,8 %         |
| Tabellen             | 65,9 %       | 47,7 %         |
| Karten               | 43,8 %       | 41,7 %         |
| **Gesamt**           | **66,8 %**   | **46,9 %**     |

Bemerkenswert ist, wie konstant Folio Medium geworden ist: Es liegt in einem engen Band von 65-69 % über Charts, textschwere Folien, Diagramme und Tabellen hinweg. Charts, die über die Hälfte des Benchmarks ausmachen und früher die Kategorie waren, die die Scores nach unten zog, sind jetzt Folios stärkste Kategorie. Karten sind der eine verbleibende Schwachpunkt, und sie sind für alle schwer (für beide Agenten gleich schlecht). Claude for PowerPoint fällt in jeder einzelnen Kategorie zurück, mit den größten Abständen bei Charts (+26 Punkte) und Diagrammen (+22 Punkte).

### Wo Folio glänzt

Folio bewältigt das gesamte Spektrum an Beratungsfolien-Elementen: formatierter juristischer Text, mehrgliedrige Layouts mit farbigen Boxen, Inhaltsverzeichnis-Seiten, mehrspältige Icon-Layouts, Datencharts und Tabellen. Folio Max erreicht bei 47 der 61 Folien 75 % oder mehr (und bei einigen sogar 100 %), während Claude for PowerPoint typischerweise deutlich zurückfällt. Der Abstand ist bei chart- und diagrammlastigen Folien am deutlichsten - genau dem dichten, strukturierten Inhalt, der echte Decks füllt.

### Wo Folio noch Potenzial hat

Karten bleiben die klarste Chance: allein diese Lücke zu schließen würde den Gesamtscore spürbar heben. Darüber hinaus sind die verbleibenden Aufgaben mit 50 %-Score überwiegend Beinahe-Treffer bei dichten Charts und Verbundformen, bei denen die Struktur stimmt, aber Styling oder Ausrichtung leicht daneben liegen.

Geschwindigkeit, früher ein Sorgenkind, ist jetzt eine Stärke: Folio Max erstellt eine Folie in etwa 2,3 Minuten und Folio Fast in 1,5 - gegenüber fast 16 Minuten bei Claude for PowerPoint. Wir werden die Latenz weiter senken, damit sich die Arbeit mit Folio wie eine nahtlose Fortsetzung der eigenen Arbeit anfühlt und nicht wie ein Tennis-Rallye, bei dem man auf den Ball wartet.

Alle Ergebnisse - einschließlich generierter und Referenzbilder pro Aufgabe sowie Evaluator-Kommentare - sind im [PrezEval-Repository](https://github.com/FolioLabs/PrezEvalPublic) verfügbar.
