---
title: "PrezEval : évaluer les agents IA sur des slides professionnelles"
date: 2026-04-06
description: "Dans quelle mesure un agent IA est-il capable de reproduire une slide de conseil professionnel à partir d'une simple capture d'écran ? Nous avons conçu un benchmark pour le découvrir."
lang: fr
---

## Objectif

Dans quelle mesure un agent IA est-il capable de reproduire des slides de conseil professionnel à partir d'une simple image ?

Après avoir développé Folio, nous sommes convaincus que notre approche donne des résultats nettement supérieurs à ceux des autres solutions.

Encore faut-il le démontrer chiffres à l'appui.

C'est précisément ce que mesure PrezEval. À partir d'une image cible et de la présentation source d'origine (avec la mise en page correcte présélectionnée), un agent doit modifier la slide pour qu'elle corresponde le plus fidèlement possible à la cible. Un modèle de langage multimodal note ensuite le résultat en comparant la structure, le contenu, la hiérarchie et le style.

L'exercice est plus difficile qu'il n'y paraît. Les vraies slides de conseil sont des artefacts denses et précis : une légende mal alignée, un intitulé d'axe oublié ou une couleur erronée dans une heatmap comptent comme des échecs. Le benchmark ne vérifie pas seulement qu'un agent sait écrire du texte sur une slide, mais aussi qu'il sait gérer simultanément graphiques, tableaux, formes personnalisées, mises en page multi-colonnes et codes graphiques de la marque.

## Construction du benchmark

### Matériau source

Nous avons sélectionné 61 slides issues de 10 présentations professionnelles couvrant les grands cabinets de conseil et d'audit : McKinsey, Bain, BCG, PwC, EY et Deloitte, ainsi que les cabinets juridiques Cleary Gottlieb et Mattos Filho. Ce sont des présentations réelles, sur des sujets allant de l'économie de la santé aux transitions énergétiques, en passant par la réglementation sur les données personnelles.

Les slides ont été choisies pour maximiser la complexité visuelle et la diversité des éléments. Voici la composition du benchmark :

| Élément                                  | Slides | Part  |
|------------------------------------------|--------|-------|
| Graphiques (barres, lignes, camembert…)  | 33     | 54 %  |
| Mises en page multi-colonnes             | 24     | 39 %  |
| Logos et icônes                          | 17*    | 28 %  |
| Tableaux                                 | 14     | 23 %  |
| Mises en page à texte dense              | 13     | 21 %  |
| Diagrammes complexes / chronologies      | 8      | 13 %  |
| Cartes                                   | 5      | 8 %   |
| Formes composites personnalisées         | 3      | 5 %   |

*\*Seules les icônes illustratives notables sont comptées, sans les logos d'entreprise (présents sur environ 45 slides).*

### Pourquoi c'est difficile

- **Diversité des styles.** Chaque cabinet a sa propre identité visuelle : palette, polices, conventions de mise en page. L'agent ne peut pas se reposer sur un seul modèle : il doit s'adapter à 10 systèmes graphiques différents répartis sur 21 mises en page distinctes.
- **Les graphiques dominent.** Plus de la moitié des slides contiennent au moins un graphique : barres empilées, graphiques combinés à double axe, heatmaps, graphiques en aires. Reproduire un graphique suppose d'obtenir simultanément les bonnes valeurs, les bons intitulés d'axes, les bonnes légendes, les bonnes couleurs et le bon positionnement.
- **Les mises en page sont complexes.** 39 % des slides utilisent des mises en page multi-colonnes où le contenu doit être placé au pixel près. Une slide McKinsey peut comporter un graphique à barres à gauche, une liste à puces à droite et une bande de notes de bas de page en dessous, le tout dans un modèle aux couleurs de la marque.
- **Les formes personnalisées poussent les limites.** Quelques slides contiennent des formes construites à partir de primitives géométriques : un entonnoir passant de 43 000 à 13 000 candidats, un flux de processus en cône, une balance comparant des niveaux de prix. Ces éléments demandent à l'agent de combiner plusieurs formes de base en un visuel cohérent.

### Paramétrage des tâches

Pour chacune des 61 tâches, l'agent reçoit :
- Le fichier source `.pptx` avec la mise en page correcte présélectionnée (ce qui reproduit le contexte réel où l'utilisateur charge d'abord le modèle pptx de son entreprise)
- Une capture d'écran de la slide cible à reproduire
- L'instruction : *« Recréez la slide montrée dans l'image ci-jointe : reproduisez-la à l'identique. »*

L'agent modifie ensuite la slide via des appels d'outils, et le résultat final est rendu en PNG puis évalué par un modèle de langage multimodal. L'évaluateur note chaque résultat sur une échelle entière de 1 à 5, car [des recherches montrent](https://arxiv.org/abs/2601.03444) qu'une échelle entière courte maximise l'accord entre humains et LLM dans les configurations LLM-as-a-judge. Les notes sont ensuite converties en score de 0 à 100 % pour plus de lisibilité.

## Résultats

Nous avons comparé cinq configurations :

| Configuration                    | Score   | Temps   | Étapes | Tâches  |
|----------------------------------|---------|---------|--------|---------|
| **Folio Max**                    | 70,8 %  | 293,4 s | 6,3    | 60/61   |
| **Folio Medium**                 | 49,6 %  | 207,7 s | 8,8    | 61/61   |
| **Folio Fast**                   | 38,9 %  | 157,5 s | 9,5    | 61/61   |
| Claude for Powerpoint (Opus)     | 36,5 %  | 176,5 s | 11,6   | 61/61   |
| Claude for Powerpoint (Sonnet)   | 32,4 %  | 154,4 s | 9,2    | 61/61   |

**Folio Max** se détache largement avec 70,8 %, soit près du double du meilleur agent non-Folio. Il y parvient en moyenne avec le moins d'étapes (6,3), signe d'une approche plus efficace, même s'il prend plus de temps par tâche (293,4 s) en raison d'un raisonnement plus poussé.

**Folio Medium** atteint 49,6 % : la plupart des reproductions capturent la bonne structure et le bon contenu, mais présentent des écarts notables sur le style ou le positionnement.

**Folio Fast** sacrifie la précision à la vitesse, en achevant les tâches 24 % plus vite que Folio Medium pour un score de 38,9 %. Curieusement, il fait davantage d'étapes en moyenne (9,5 contre 8,8), ce qui suggère que le modèle plus léger explore davantage avant de trouver la bonne action.

**Claude for Powerpoint (Opus)** obtient 36,5 % malgré le plus grand nombre d'étapes (11,6) et beaucoup plus de calcul. **Claude for Powerpoint (Sonnet)** ferme la marche à 32,4 %, le score le plus bas de la comparaison, tout en étant le plus rapide à 154,4 s par tâche.

<div id="prezeval-chart"></div>

### Décomposition des scores par type de contenu

Décomposer les scores selon ce que contient la slide fait apparaître des tendances nettes :

| Type de contenu        | Folio Medium | Claude for PPT |
|------------------------|--------------|----------------|
| Texte dense            | 66,8 %       | 48,3 %         |
| Slides sans graphique  | 63,5 %       | 44,8 %         |
| Tableaux               | 48,3 %       | 38,3 %         |
| Diagrammes             | 47,3 %       | 25,0 %         |
| Graphiques             | 38,0 %       | 29,5 %         |
| Cartes                 | 12,5 %       | 12,5 %         |
| **Global**             | **49,5 %**   | **36,5 %**     |

Les slides à forte densité textuelle constituent la catégorie la plus facile, tandis que les cartes sont les plus difficiles (et les deux agents s'y cassent les dents à part égale). Les graphiques, qui représentent 54 % du benchmark, tirent fortement le score global vers le bas.

### Là où Folio excelle

Folio obtient systématiquement de bons scores sur les slides à texte structuré : texte juridique mis en forme, mises en page multi-sections avec encadrés colorés, pages de type sommaire et mises en page multi-colonnes avec icônes. Sur ces tâches, Folio Max décroche régulièrement des scores quasi parfaits, et même Folio Medium et Folio Fast atteignent 75 à 100 %, alors que les deux variantes Claude for Powerpoint restent généralement loin derrière.

### Ce qui reste difficile

Environ 20 % du benchmark est en pratique non résolu : sur les tâches les plus dures, les cinq agents plafonnent à 25 % ou moins. Les modes d'échec récurrents :

- **Cartes géographiques.** Les agents peinent à produire des cartes précises. Ils peuvent remplacer la carte par une forme sans rapport, la rendre à la mauvaise échelle ou perdre le code couleur par État. Folio essaie bien de produire des cartes, mais les résultats sont systématiquement médiocres : une carte des États-Unis peut apparaître réduite avec des détails manquants, ou une carte du monde être remplacée par un diagramme circulaire.
- **Graphiques complexes à données denses.** Les graphiques combinés (barres + courbes sur double axe), les tableaux de bord multi-panneaux et les heatmaps mettent systématiquement tous les agents en échec. Erreurs fréquentes : graphiques entièrement manquants, intitulés d'axes oubliés, valeurs absentes.
- **Formes composites personnalisées.** Les entonnoirs construits à partir de trapèzes, les graphiques en quadrants avec séparateurs courbes et les constructions du même genre exigent un empilage et un alignement précis que les agents ne maîtrisent pas encore de manière fiable.

### Là où Folio peut encore progresser

Même Folio Max, malgré sa moyenne de 70,8 %, peine encore sur certaines tâches (score de 25 % ou moins). Ce sont généralement des slides avec de grandes grilles structurées, des logos de marque intégrés dans des graphiques ou des éléments décoratifs. Autant de pistes d'amélioration concrètes pour Folio sur ces types de contenu.

La vitesse aussi reste un chantier. Folio Max prend près de 5 minutes par tâche, et même Folio Fast dépasse 2,5 minutes en moyenne. Un bon assistant IA devrait ressembler davantage à un prolongement fluide de votre travail qu'à une partie de tennis où l'on attend que la balle revienne. Nous travaillerons à réduire cette latence de manière significative dans les semaines qui viennent.

L'intégralité des résultats (images générées, références par tâche et critiques de l'évaluateur) est disponible dans [le repo PrezEval](https://github.com/FolioLabs/PrezEvalPublic).