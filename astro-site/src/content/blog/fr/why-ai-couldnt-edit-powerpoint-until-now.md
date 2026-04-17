---
title: "Pourquoi l'IA ne pouvait pas éditer PowerPoint - jusqu'à maintenant"
date: 2026-04-12
description: "Tous les outils IA génèrent de nouveaux decks au lieu d'éditer les existants. Voici la raison technique, et comment nous l'avons résolue."
lang: fr
---

Si vous avez essayé l'un des outils IA pour slides sur le marché, vous avez remarqué quelque chose : ils génèrent tous de nouveaux decks. Aucun n'ouvre votre fichier PowerPoint existant pour l'éditer.

Ce n'est pas un oubli. C'est une contrainte technique, que tout le secteur a discrètement contournée plutôt que résolue.

Nous avons choisi de la résoudre.

## Le problème : PowerPoint n'est pas compatible avec les LLM

Les fichiers PowerPoint (.pptx) utilisent un format appelé OOXML (Office Open XML). Il a été standardisé par Microsoft et adopté comme norme ISO en 2008. C'est, à tout point de vue raisonnable, l'un des formats de document les plus complexes jamais conçus.

Quelques exemples pour illustrer :

**Des unités qui n'ont aucun sens pour les humains (ni pour les modèles)**

OOXML utilise les EMU (English Metric Units) comme unité de mesure de base. Un pouce équivaut à 914 400 EMU. Une slide standard fait 9 144 000 × 6 858 000 EMU. Ce sont les chiffres stockés dans le fichier. Quand vous dites à un LLM « déplace cette forme de 5 cm vers la droite », il doit comprendre que cela revient à ajouter 1 828 800 à l'attribut `off x`.

**Dix niveaux d'imbrication pour une zone de texte**

Dans OOXML, décrire une simple zone de texte avec deux lignes nécessite de traverser : l'élément de forme, les propriétés de la forme, le corps de texte, les propriétés du corps, le style de liste, le paragraphe, les propriétés du paragraphe, le run, les propriétés du run, et enfin le contenu textuel. Modifiez un attribut au mauvais niveau, et le fichier se casse silencieusement.

**Des milliers de valeurs par défaut implicites**

OOXML a un concept d'« héritage » : si un attribut n'est pas défini, il hérite du layout de la slide, qui hérite du master, qui hérite du thème. La plupart des propriétés ne sont jamais écrites explicitement dans le fichier. Un LLM qui lit le XML d'une zone de texte donnée ne voit que les surcharges, pas le tableau complet.

**Aucune validation de schéma à l'édition**

Quand vous éditez un PPTX par manipulation XML brute, il n'y a pas de validation en temps réel. Le fichier peut sembler syntaxiquement correct et échouer à s'ouvrir dans PowerPoint - ou s'ouvrir avec des slides corrompues - à cause de violations sémantiques subtiles.

## Ce qui se passe quand on envoie de l'OOXML à un LLM

Nous avons essayé. Longuement.

Les modes d'échec sont constants. Les LLM produisent en toute confiance du XML avec des noms d'éléments qui semblent valides mais sont sémantiquement faux, omettent des attributs requis ou en inventent qui n'existent pas. Ils cassent la chaîne d'héritage en définissant explicitement des valeurs qui devraient rester héritées. Pire encore, ils produisent parfois des fichiers que PowerPoint ouvre mais affiche de manière incorrecte - ce qui est plus difficile à détecter qu'un échec franc.

Le benchmark que nous avons construit en interne, PrezEval, mesure les éditions réussies : à quelle fréquence un modèle produit-il une slide valide et correctement mise en forme qui correspond à l'instruction ? Avec de l'OOXML brut, même les meilleurs modèles obtenaient moins de 30 % sur les éditions complexes.

Ce n'est pas utilisable. C'est ce qui explique pourquoi tous les autres outils ont abandonné l'édition pour se concentrer sur la génération.

## Notre solution : SimpleXML

Nous avons passé des mois à construire une approche alternative.

Plutôt que de demander aux LLM de lire et d'écrire de l'OOXML directement, nous avons construit un système en deux couches :

**Couche 1 : Simplification (OOXML vers SimpleXML)**

Nous avons écrit un codec qui convertit l'OOXML en un format personnalisé que nous appelons SimpleXML. Il possède plusieurs propriétés qui le rendent beaucoup plus adapté aux LLM :

- *Des unités lisibles par l'humain.* Pouces, points, degrés et pourcentages plutôt que des EMU. « width: 4in » au lieu de « cx: 3657600 ».
- *Une structure plate.* Nous aplatissons les 10 niveaux d'imbrication en une représentation plate, à la CSS. Un run de texte ressemble à un run de texte, pas à une poupée gigogne d'éléments XML.
- *Explicite plutôt qu'implicite.* Nous résolvons tout l'héritage au moment du parsing, de sorte que le LLM voit toujours l'image complète pour chaque élément.
- *Un vocabulaire contraint.* Le LLM n'a besoin de connaître qu'un petit ensemble d'éléments et d'attributs. Nous gérons la correspondance avec la sémantique OOXML.

**Couche 2 : Restauration (SimpleXML vers OOXML)**

Après que le LLM a produit son SimpleXML édité, nous le faisons passer par le codec inverse, qui valide, résout et reconvertit en OOXML valide. Cette couche gère tous les cas particuliers : ré-encodage des unités, reconstruction de l'imbrication, restauration de l'héritage, et validation contre la spécification OOXML.

Le résultat : les LLM ne touchent jamais à l'OOXML directement. Ils travaillent dans un format aussi naturel pour eux qu'écrire du code ou éditer du texte.

## La différence de performance

Sur notre benchmark PrezEval :

- Édition OOXML brute : ~25 % de taux de réussite sur les éditions complexes
- SimpleXML avec notre meilleur modèle : ~85 % de taux de réussite

Ce n'est pas une amélioration marginale. C'est la différence entre un outil qui fonctionne de temps en temps et un outil sur lequel on peut compter.

Cela signifie aussi que Verso peut faire des choses que les autres outils ne peuvent tout simplement pas faire : éditer des slides existantes en préservant leur structure, appliquer une mise en forme conforme au template, modifier des graphiques avec de vraies données, et gérer toute la complexité des objets PowerPoint - sans générer un nouveau fichier.

## Pourquoi c'est un avantage durable

Construire ce codec a demandé un investissement ingénierie significatif, et il continue d'évoluer au fil des cas particuliers rencontrés dans des fichiers PowerPoint réels. Ce n'est pas une fonctionnalité qui peut être rapidement reproduite.

Plus important encore, il ne fait que gagner en valeur à mesure que les LLM progressent. Chaque fois qu'un nouveau modèle frontier sort, les performances de Verso s'améliorent automatiquement - parce que le goulot d'étranglement n'a jamais été le modèle, mais l'interface entre le modèle et le format de fichier.

Nous avons résolu cette interface.
