---
title: "PrezEval: KI-Agenten auf professionellen Folien benchmarken"
date: 2026-04-06
description: "Wie gut kann ein KI-Agent eine professionelle Beratungsfolie anhand eines Screenshots reproduzieren? Wir haben einen Benchmark entwickelt, um das herauszufinden."
lang: de
---

## Ziel

Wie gut kann ein KI-Agent professionelle Beratungsfolien anhand visueller Vorgaben reproduzieren?

Nach der Entwicklung von Verso sind wir zu der Überzeugung gelangt, dass unser Ansatz deutlich bessere Ergebnisse liefert als andere.

Aber lassen wir Zahlen für sich sprechen.

PrezEval ist ein Benchmark, der genau das misst. Gegeben ein Zielfolienbild und die originale Quellpräsentation (mit dem bereits vorausgewählten korrekten Layout) muss ein Agent die Folie so bearbeiten, dass sie dem Ziel so genau wie möglich entspricht. Ein Vision-Language-Modell bewertet das Ergebnis anschließend anhand von Struktur, Inhalt, Hierarchie und Gestaltung.

Diese Aufgabe ist täuschend schwer. Echte Beratungsfolien sind dichte, präzise Artefakte: Eine falsch ausgerichtete Diagrammlegende, ein fehlender Achsenbeschriftung oder eine falsche Farbe in einer Heatmap-Zelle zählen allesamt als Fehler. Der Benchmark prüft nicht nur, ob ein Agent Text auf einer Folie platzieren kann, sondern ob er gleichzeitig Diagramme, Tabellen, benutzerdefinierte Formen, mehrspaltiger Layouts und markenspezifische Gestaltung beherrscht.

## Aufbau des Benchmarks

### Quellmaterial

Wir haben 61 Folien aus 10 professionellen Präsentationsdecks zusammengestellt, die von führenden Beratungs- und Wirtschaftsprüfungsunternehmen stammen: McKinsey, Bain, BCG, PwC, EY und Deloitte sowie von den Anwaltskanzleien Cleary Gottlieb und Mattos Filho. Es handelt sich um reale Decks zu Themen von Gesundheitsökonomie über Energiewende bis hin zu Verbraucherdatenschutz.

Die Folien wurden ausgewählt, um maximale visuelle Komplexität und Elementvielfalt abzudecken. Folgendes enthält der Benchmark:

| Element                                    | Folien | Anteil |
|--------------------------------------------|--------|--------|
| Diagramme (Balken, Linie, Kreis, Kombi...) | 33     | 54%    |
| Mehrspaltige Layouts                        | 24     | 39%    |
| Logos und Icons                             | 17*    | 28%    |
| Tabellen                                    | 14     | 23%    |
| Textdichte Layouts                          | 13     | 21%    |
| Komplexe Diagramme / Timelines              | 8      | 13%    |
| Karten                                      | 5      | 8%     |
| Benutzerdefinierte zusammengesetzte Formen  | 3      | 5%     |

*\*Nur wesentliche illustrative Icons werden gezählt, nicht Unternehmenslogos (die auf ~45 Folien erscheinen).*

### Was es so schwierig macht

- **Vielfalt der Stile.** Jedes Unternehmen hat seine eigene visuelle Identität: Farbpaletten, Schriftarten, Layout-Konventionen. Der Agent kann sich nicht auf eine einzige Vorlage verlassen: Er muss sich an 10 verschiedene Designsysteme mit 21 unterschiedlichen Folienlayouts anpassen.
- **Diagramme dominieren.** Über die Hälfte der Folien enthält mindestens ein Diagramm: gestapelte Balken, Kombi-Diagramme mit doppelten Achsen, Heatmap-Matrizen, Flächendiagramme. Ein Diagramm zu reproduzieren bedeutet, Datenwerte, Achsenbeschriftungen, Legenden, Farben und Positionierung korrekt zu erfassen.
- **Layouts sind komplex.** 39% der Folien verwenden mehrspaltige Layouts, bei denen Inhalte präzise platziert werden müssen. Eine McKinsey-Folie könnte links ein Balkendiagramm, rechts eine Aufzählungsliste und unten eine Fußnotezeile haben – alles innerhalb einer gebrandeten Vorlage.
- **Benutzerdefinierte Formen fordern das Maximum.** Einige Folien enthalten aus geometrischen Grundformen aufgebaute Shapes: ein Trichter, der sich von 43K auf 13K Kandidaten verjüngt, ein kegelförmiger Prozessfluss, eine Wippe/Hebel zum Vergleich von Preispunkten. Diese erfordern, dass der Agent mehrere Grundformen zu einem kohärenten visuellen Element zusammensetzt.

### Aufgaben-Setup

Für jede der 61 Aufgaben erhält der Agent:
- Die `.pptx`-Quelldatei mit dem bereits vorausgewählten korrekten Folienlayout (das reproduziert die reale Situation, in der der Nutzer mit dem Laden der firmeneigenen pptx-Vorlage beginnt)
- Einen Screenshot der zu reproduzierenden Zielfolie
- Die Anweisung: *"Recreate the slide shown in the attached image: reproduce it exactly."*

Der Agent bearbeitet die Folie anschließend über Tool-Aufrufe, und das finale Ergebnis wird als PNG gerendert und von einem Vision-Language-Modell-Evaluator bewertet. Der Evaluator bewertet jedes Ergebnis auf einer ganzzahligen Skala von 1 bis 5, da [Forschungsergebnisse zeigen](https://arxiv.org/abs/2601.03444), dass eine kompakte ganzzahlige Skala die Übereinstimmung zwischen Mensch und LLM bei LLM-as-a-judge-Setups maximiert. Die Bewertungen werden dann zur besseren Lesbarkeit in eine 0-100%-Skala umgerechnet.

## Ergebnisse

Wir haben fünf Konfigurationen verglichen:

| Konfiguration                    | Punkte | Zeit   | Schritte | Aufgaben |
|----------------------------------|--------|--------|----------|----------|
| **Verso Max**                    | 70,8%  | 293,4s | 6,3      | 60/61    |
| **Verso Medium**                 | 49,6%  | 207,7s | 8,8      | 61/61    |
| **Verso Fast**                   | 38,9%  | 157,5s | 9,5      | 61/61    |
| Claude for Powerpoint (Opus)     | 36,5%  | 176,5s | 11,6     | 61/61    |
| Claude for Powerpoint (Sonnet)   | 32,4%  | 154,4s | 9,2      | 61/61    |

**Verso Max** führt mit großem Abstand bei 70,8% – fast doppelt so hoch wie der beste Nicht-Verso-Agent. Es erreicht dies mit den wenigsten Schritten im Durchschnitt (6,3), was auf einen effizienteren Ansatz zur Folienreproduktion hindeutet, obwohl es aufgrund tiefergehender Analyse länger pro Aufgabe benötigt (293,4s).

**Verso Medium** erzielt 49,6%: Die meisten Reproduktionen erfassen die richtige Struktur und den richtigen Inhalt, weisen jedoch spürbare Unterschiede in Gestaltung oder Positionierung auf.

**Verso Fast** tauscht Genauigkeit gegen Geschwindigkeit: Es erledigt Aufgaben 24% schneller als Verso Medium und erreicht dabei 38,9%. Interessanterweise benötigt es im Durchschnitt mehr Schritte (9,5 vs. 8,8), was darauf hindeutet, dass das kleinere Modell mehr explorative Aktionen ausführt.

**Claude for Powerpoint (Opus)** erzielt 36,5%, obwohl es die meisten Schritte (11,6) und deutlich mehr Rechenleistung einsetzt. **Claude for Powerpoint (Sonnet)** erzielt 32,4%, die niedrigste Punktzahl aller Konfigurationen, bei gleichzeitig kürzester Laufzeit von 154,4s pro Aufgabe.

<div id="prezeval-chart"></div>

### Punkteverteilung nach Inhaltstyp

Die Aufschlüsselung der Punkte nach Folieninhalt zeigt klare Muster:

| Inhaltstyp           | Verso Medium | Claude for PPT |
|----------------------|--------------|----------------|
| Textdichte Folien    | 66,8%        | 48,3%          |
| Folien ohne Diagram  | 63,5%        | 44,8%          |
| Tabellen             | 48,3%        | 38,3%          |
| Diagramme            | 47,3%        | 25,0%          |
| Charts               | 38,0%        | 29,5%          |
| Karten               | 12,5%        | 12,5%          |
| **Gesamt**           | **49,5%**    | **36,5%**      |

Textlastige Folien sind die einfachste Kategorie, während Karten am schwersten sind (gleich schlecht für beide Agenten). Diagramme, die 54% des Benchmarks ausmachen, drücken die Gesamtpunktzahl erheblich nach unten.

### Wo Verso glänzt

Verso erzielt konstant gute Ergebnisse bei strukturierten Textfolien: formatierter Rechtstext, mehrgliedrige Layouts mit farbigen Kästen, Inhaltsverzeichnis-Seiten und mehrspaltige Icon-Layouts. Hier erzielt Verso Max routinemäßig nahezu perfekte Ergebnisse, und selbst Verso Medium und Verso Fast erreichen 75-100%, während beide Claude for Powerpoint-Varianten typischerweise deutlich zurückliegen.

### Was weiterhin schwierig bleibt

Etwa 20% des Benchmarks sind im Wesentlichen ungelöst: Alle fünf Agenten erzielen bei den schwierigsten Aufgaben 25% oder weniger. Die häufigsten Fehlertypen:

- **Geografische Karten.** Agenten haben Schwierigkeiten, genaue Kartenvisualisierungen zu erstellen. Sie ersetzen die Karte möglicherweise durch eine unrelated Form, rendern sie im falschen Maßstab oder verlieren die farbliche Kodierung auf Staatsebene. Verso versucht Karten zwar zu erstellen, aber die Ergebnisse sind durchgängig schlecht: Eine US-Karte könnte verkleinert mit fehlenden Details erscheinen, oder eine Weltkarte könnte durch ein kreisförmiges Diagramm ersetzt werden.
- **Komplexe Diagramme mit dichten Daten.** Kombi-Diagramme (Balken + Linien auf doppelten Achsen), mehrteilige Dashboards und Heatmap-Matrizen scheitern bei allen Agenten konsistent. Häufige Fehler sind vollständig fehlende Diagramme, weggefallene Achsenbeschriftungen und fehlende Datenwerte.
- **Benutzerdefinierte zusammengesetzte Formen.** Aus Trapezen aufgebaute Trichter, Quadrantendiagramme mit gebogenen Trennlinien und ähnliche Konstruktionen erfordern präzises Schichten und Ausrichten, das Agenten noch nicht zuverlässig beherrschen.

### Wo Verso noch Verbesserungspotenzial hat

Selbst Verso Max hat trotz seines Durchschnitts von 70,8% bei einigen Aufgaben noch Schwierigkeiten (Punktzahl 25% oder darunter). Diese Folien weisen in der Regel große strukturierte Raster, in Diagramme eingebettete Markenlogos oder dekorative Elemente auf. Das deutet auf konkrete Möglichkeiten hin, Versos Umgang mit diesen Mustern zu verbessern.

Alle Ergebnisse, einschließlich der je Aufgabe generierten und referenzierten Bilder sowie der Evaluator-Kritiken, sind im [PrezEval-Repository](https://github.com/VersoLabs/PrezEvalPublic) verfügbar.
