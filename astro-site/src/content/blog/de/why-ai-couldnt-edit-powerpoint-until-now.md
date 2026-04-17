---
title: "Warum KI PowerPoint bisher nicht bearbeiten konnte"
date: 2026-04-12
description: "Jedes KI-Tool generiert neue Folien, statt bestehende zu bearbeiten. Hier ist der technische Grund dafür - und wie wir das Problem gelöst haben."
lang: de
---

Wer eines der KI-Folien-Tools auf dem Markt ausprobiert hat, wird etwas bemerkt haben: Sie alle generieren neue Decks. Keines öffnet eine bestehende PowerPoint-Datei und bearbeitet sie.

Das ist keine Nachlässigkeit. Es ist eine technische Einschränkung - eine, um die die gesamte Branche stillschweigend herumgearbeitet hat, anstatt sie zu lösen.

Wir haben uns entschieden, sie zu lösen.

## Das Problem: PowerPoint ist nicht LLM-freundlich

PowerPoint-Dateien (.pptx) verwenden ein Format namens OOXML (Office Open XML). Es wurde von Microsoft standardisiert und 2008 als ISO-Standard übernommen. Es ist nach jedem vernünftigen Maßstab eines der komplexesten Dokumentformate, die je entwickelt wurden.

Ein paar Beispiele zur Veranschaulichung:

**Einheiten, die für Menschen (oder Modelle) keinen Sinn ergeben**

OOXML verwendet EMU (English Metric Units) als Basismaßeinheit. Ein Zoll entspricht 914.400 EMU. Eine typische Folie misst 9.144.000 × 6.858.000 EMU. Das sind die Zahlen, die in der Datei gespeichert sind. Wenn man einem LLM sagt „verschiebe diese Form um 5 cm nach rechts", muss es verstehen, dass das bedeutet, 1.828.800 zum `off x`-Attribut zu addieren.

**Zehn Verschachtelungsebenen für eine Textbox**

In OOXML erfordert die Beschreibung einer einfachen Textbox mit zwei Zeilen Text das Durchnavigieren von: dem Shape-Element, den Shape-Properties, dem Text-Body, den Body-Properties, dem List-Style, dem Paragraph, den Paragraph-Properties, dem Run, den Run-Properties und schließlich dem eigentlichen Textinhalt. Ändert man ein Attribut auf der falschen Ebene, bricht die Datei lautlos zusammen.

**Tausende impliziter Standardwerte**

OOXML hat ein Konzept namens „Vererbung": Ist ein Attribut nicht gesetzt, erbt es vom Folienlayout, das vom Folienmaster erbt, der vom Theme erbt. Die meisten Eigenschaften werden in der Datei nie explizit geschrieben. Ein LLM, das das XML einer bestimmten Textbox liest, sieht nur die Überschreibungen - nicht das vollständige Bild.

**Keine Schema-Validierung beim Bearbeiten**

Bei der Bearbeitung einer PPTX mit roher XML-Manipulation gibt es keine Echtzeit-Validierung. Die Datei kann syntaktisch korrekt aussehen und sich dennoch nicht in PowerPoint öffnen lassen - oder mit korrumpierten Folien öffnen - aufgrund subtiler semantischer Verstöße.

## Was passiert, wenn man OOXML einem LLM übergibt

Wir haben es versucht. Ausgiebig.

Die Fehlermuster sind konsistent. LLMs produzieren selbstsicher XML mit gültig aussehendem, aber semantisch falschem Elementnamen, lassen dann erforderliche Attribute weg oder erfinden welche, die nicht existieren. Sie brechen die Vererbungskette, indem sie Werte explizit setzen, die eigentlich vererbt bleiben sollten. Am schlimmsten ist, dass sie gelegentlich Dateien produzieren, die PowerPoint öffnet, aber fehlerhaft rendert - was schwerer zu erkennen ist als ein direkter Fehler.

Der Benchmark, den wir intern entwickelt haben - PrezEval - misst erfolgreiche Bearbeitungen: wie oft produziert ein Modell eine gültige, korrekt formatierte Folie, die der Anweisung entspricht? Mit rohem OOXML lagen selbst die besten Modelle bei komplexen Bearbeitungen unter 30 % Erfolgsrate.

Das ist nicht nutzbar. Es erklärt, warum jedes andere Tool auf Bearbeitung verzichtet und sich stattdessen auf Generierung konzentriert hat.

## Unsere Lösung: SimpleXML

Wir haben Monate damit verbracht, einen alternativen Ansatz zu entwickeln.

Anstatt LLMs dazu zu bringen, OOXML direkt zu lesen und zu schreiben, haben wir ein Zwei-Schichten-System aufgebaut:

**Schicht 1: Vereinfachung (OOXML zu SimpleXML)**

Wir haben einen Codec geschrieben, der OOXML in ein benutzerdefiniertes Format konvertiert, das wir SimpleXML nennen. Es hat mehrere Eigenschaften, die es für LLMs erheblich freundlicher machen:

- *Menschenlesbare Einheiten.* Zoll, Punkte, Grad und Prozentangaben statt EMU. „width: 4in" statt „cx: 3657600".
- *Flache Struktur.* Wir reduzieren die 10-stufige Verschachtelung auf eine flache, CSS-ähnliche Darstellung. Ein Text-Run sieht aus wie ein Text-Run - nicht wie eine russische Matroschka aus XML-Elementen.
- *Explizit statt implizit.* Wir lösen alle Vererbungen beim Parsen auf, damit das LLM immer das vollständige Bild jedes Elements sieht.
- *Eingeschränktes Vokabular.* Das LLM muss nur eine kleine Menge von Elementen und Attributen kennen. Wir kümmern uns um die Abbildung auf die OOXML-Semantik.

**Schicht 2: Wiederherstellung (SimpleXML zu OOXML)**

Nachdem das LLM sein bearbeitetes SimpleXML produziert hat, läuft es durch den umgekehrten Codec, der es validiert, auflöst und zurück in gültiges OOXML konvertiert. Diese Schicht behandelt alle Randfälle: Einheiten neu kodieren, Verschachtelungen aufbauen, Vererbung wiederherstellen und gegen die OOXML-Spezifikation validieren.

Das Ergebnis: LLMs berühren OOXML nie direkt. Sie arbeiten in einem Format, das für sie so natürlich ist wie das Schreiben von Code oder das Bearbeiten von Text.

## Der Performance-Unterschied

Auf unserem PrezEval-Benchmark:

- Rohes OOXML-Editing: ca. 25 % Erfolgsrate bei komplexen Bearbeitungen
- SimpleXML mit unserem besten Modell: ca. 85 % Erfolgsrate

Das ist keine marginale Verbesserung. Es ist der Unterschied zwischen einem Tool, das gelegentlich funktioniert, und einem, auf das man sich verlassen kann.

Es bedeutet auch, dass Verso Dinge kann, die andere Tools schlicht nicht können: bestehende Folien bearbeiten und dabei ihre Struktur erhalten, template-bewusstes Formatieren anwenden, Charts mit echten Daten anpassen und die volle Komplexität von PowerPoint-Objekten handhaben - ohne eine neue Datei zu generieren.

## Warum das ein Graben ist

Der Aufbau dieses Codecs hat erheblichen Engineering-Aufwand erfordert, und er entwickelt sich weiter, wenn wir Randfälle in realen PowerPoint-Dateien entdecken. Das lässt sich nicht schnell replizieren.

Wichtiger noch: Er wird mit jedem Fortschritt der LLMs wertvoller. Jedes Mal, wenn ein neues Frontier-Modell erscheint, verbessert sich Versos Performance automatisch - denn der Flaschenhals war nie das Modell. Er war die Schnittstelle zwischen dem Modell und dem Dateiformat.

Diese Schnittstelle haben wir gelöst.
