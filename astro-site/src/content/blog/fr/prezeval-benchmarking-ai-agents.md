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

Nous avons comparé quatre configurations :

| Configuration                    | Score   | Temps | Étapes |
|----------------------------------|---------|-------|--------|
| **Folio Max**                    | 70,0 %  | 2:19  | 5,5    |
| **Folio Medium**                 | 66,8 %  | 2:44  | 5,2    |
| **Folio Fast**                   | 43,0 %  | 1:32  | 13,7   |
| Claude for PowerPoint (Sonnet 4.6) | 46,9 % | 16:03 | 25,5  |

**Folio Max** se détache avec 70,0 %, devançant le meilleur agent non-Folio de 23 points (49 % d'avance relative). Il atteint ce score en 138,9 s par tâche, soit environ 7 fois plus vite que Claude for PowerPoint (962,8 s, près de 16 minutes), et avec bien moins d'étapes (5,5 contre 25,5). Folio Max et Folio Fast tracent ensemble la frontière de Pareto - l'un tient le bout de la précision maximale, l'autre celui de la latence minimale - tandis que Claude for PowerPoint est dominé : à la fois plus lent et moins précis que Folio Max.

**Folio Medium** atteint 66,8 %, à portée de Max, pour un coût légèrement inférieur. Il raisonne moins mais réussit proprement presque autant de reproductions.

**Folio Fast** est le niveau économique à faible latence : à 0,21 $ par tâche, il coûte environ 5 fois moins que Folio Max et 9 fois moins que Claude for PowerPoint, et avec environ 1,5 minute par slide, c'est la configuration la plus rapide du lot. Le compromis porte sur la fidélité (43,0 %) et un plus grand nombre d'actions exploratoires (13,7 étapes), car il tourne sur un modèle plus léger et moins cher.

**Claude for PowerPoint (Sonnet 4.6)** obtient 46,9 %, mais le paie cher : 962,8 s par tâche (environ 7 fois plus lent que Folio Max), 25,5 étapes, 1,80 $, et 5 tâches sur 61 laissées inachevées. Il édite directement le OOXML brut, ce qui est lent et source d'erreurs face à l'approche structurée de Folio.

<div id="prezeval-chart"></div>

### Décomposition des scores par type de contenu

Décomposer les scores selon ce que contient la slide fait apparaître des tendances nettes :

| Type de contenu        | Folio Medium | Claude for PPT |
|------------------------|--------------|----------------|
| Graphiques             | 68,5 %       | 42,3 %         |
| Texte dense            | 66,7 %       | 50,0 %         |
| Diagrammes             | 66,1 %       | 43,8 %         |
| Tableaux               | 65,9 %       | 47,7 %         |
| Cartes                 | 43,8 %       | 41,7 %         |
| **Global**             | **66,8 %**   | **46,9 %**     |

Ce qui frappe, c'est à quel point Folio Medium est devenu régulier : il se tient dans une bande étroite de 65 à 69 % sur les graphiques, le texte dense, les diagrammes et les tableaux. Les graphiques, qui représentent plus de la moitié du benchmark et qui tiraient autrefois les scores vers le bas, sont désormais la catégorie la plus forte de Folio. Les cartes sont le seul point faible qui subsiste, et elles sont difficiles pour tout le monde (les deux agents s'y cassent les dents à part égale). Claude for PowerPoint reste derrière dans chacune des catégories, avec les écarts les plus marqués sur les graphiques (+26 points) et les diagrammes (+22 points).

### Là où Folio excelle

Folio gère toute la palette des éléments d'une slide de conseil : texte juridique mis en forme, mises en page multi-sections avec encadrés colorés, pages de type sommaire, mises en page multi-colonnes avec icônes, graphiques de données et tableaux. Folio Max obtient 75 % ou plus sur 47 des 61 slides (et un 100 % parfait sur quelques-unes), tandis que Claude for PowerPoint reste généralement loin derrière. L'écart est le plus visible sur les slides riches en graphiques et en diagrammes, précisément le contenu dense et structuré qui remplit les vrais decks.

### Là où Folio peut encore progresser

Les cartes restent l'opportunité la plus claire : combler ce seul écart relèverait sensiblement le score global. Au-delà, les tâches restantes notées à 50 % sont surtout des quasi-réussites sur des graphiques denses et des formes composites, où la structure est bonne mais le style ou l'alignement légèrement décalés.

La vitesse, autrefois un sujet d'inquiétude, est désormais un atout : Folio Max produit une slide en environ 2,3 minutes et Folio Fast en 1,5, contre près de 16 minutes pour Claude for PowerPoint. Nous continuerons à réduire la latence pour que travailler avec Folio ressemble à un prolongement fluide de votre travail plutôt qu'à une partie de tennis où l'on attend que la balle revienne.

L'intégralité des résultats (images générées, références par tâche et critiques de l'évaluateur) est disponible dans [le repo PrezEval](https://github.com/FolioLabs/PrezEvalPublic).