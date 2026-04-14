---
title: "PrezEval : évaluer les agents IA sur des slides professionnelles"
date: 2026-04-06
description: "Dans quelle mesure un agent IA est-il capable de reproduire une slide de conseil professionnel à partir d'une simple capture d'écran ? Nous avons conçu un benchmark pour le découvrir."
lang: fr
---

## Objectif

Dans quelle mesure un agent IA est-il capable de reproduire des slides de conseil professionnel à partir d'une guidance visuelle ?

Après avoir développé Verso, nous sommes convaincus que notre approche produit des résultats nettement supérieurs à ceux des autres solutions.

Mais mettons des chiffres dessus.

PrezEval est un benchmark qui mesure exactement cela. Étant donné une image de slide cible et la présentation source d'origine (avec la mise en page correcte présélectionnée), un agent doit modifier la slide pour qu'elle corresponde le plus fidèlement possible à la cible. Un modèle de langage multimodal évalue ensuite le résultat en comparant la structure, le contenu, la hiérarchie et le style.

Cette tâche est trompeusement difficile. Les slides de conseil réelles sont des artefacts denses et précis : une légende de graphique mal alignée, un intitulé d'axe manquant ou une couleur incorrecte dans une cellule de heatmap sont autant d'échecs. Le benchmark ne teste pas seulement si un agent peut écrire du texte sur une slide, mais s'il est capable de gérer des graphiques, des tableaux, des formes personnalisées, des mises en page multi-colonnes et un style aux couleurs de la marque, le tout simultanément.

## Construction du benchmark

### Matériau source

Nous avons sélectionné 61 slides issues de 10 présentations professionnelles couvrant les grands cabinets de conseil et d'audit : McKinsey, Bain, BCG, PwC, EY et Deloitte, ainsi que les cabinets juridiques Cleary Gottlieb et Mattos Filho. Il s'agit de présentations réelles traitant de sujets allant de l'économie de la santé aux transitions énergétiques, en passant par la réglementation sur la confidentialité des données.

Les slides ont été sélectionnées pour maximiser la complexité visuelle et la diversité des éléments. Voici ce que contient le benchmark :

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

*\*Ne comptant que les icônes illustratives substantielles, sans les logos d'entreprise (présents sur environ 45 slides).*

### Ce qui le rend difficile

- **Diversité des styles.** Chaque cabinet source possède sa propre identité visuelle : palettes de couleurs, choix de polices, conventions de mise en page. L'agent ne peut pas s'appuyer sur un seul modèle : il doit s'adapter à 10 systèmes de design différents répartis sur 21 mises en page de slides distinctes.
- **Les graphiques dominent.** Plus de la moitié des slides contiennent au moins un graphique : barres empilées, graphiques combinés à double axe, matrices de heatmap, graphiques en aires. Reproduire un graphique implique d'obtenir correctement les valeurs de données, les intitulés d'axes, les légendes, les couleurs et le positionnement.
- **Les mises en page sont complexes.** 39 % des slides utilisent des mises en page multi-colonnes où le contenu doit être placé avec précision. Une slide McKinsey peut comporter un graphique à barres à gauche, une liste à puces à droite et une barre de notes de bas de page en dessous — le tout dans un modèle aux couleurs de la marque.
- **Les formes personnalisées repoussent les limites.** Quelques slides contiennent des formes construites à partir de primitives géométriques : un entonnoir se réduisant de 43 000 à 13 000 candidats, un flux de processus en forme de cône, un levier comparant des niveaux de prix. Ces éléments exigent de l'agent qu'il compose plusieurs formes de base en un visuel cohérent.

### Paramétrage des tâches

Pour chacune des 61 tâches, l'agent reçoit :
- Le fichier source `.pptx` avec la mise en page de slide correcte présélectionnée (ce qui reproduit le contexte réel où l'utilisateur commence par charger le modèle pptx de son entreprise)
- Une capture d'écran de la slide cible à reproduire
- L'instruction : *« Recréez la slide représentée dans l'image ci-jointe : reproduisez-la à l'identique. »*

L'agent modifie ensuite la slide via des appels d'outils, et le résultat final est rendu en PNG puis évalué par un modèle de langage multimodal. L'évaluateur note chaque résultat sur une échelle entière de 1 à 5, car [des recherches montrent](https://arxiv.org/abs/2601.03444) qu'une échelle entière compacte maximise l'alignement humain-LLM dans les configurations LLM-as-a-judge. Nous convertissons ensuite les notes en score de 0 à 100 % pour plus de lisibilité.

## Résultats

Nous avons comparé cinq configurations :

| Configuration                    | Score   | Temps   | Étapes | Tâches  |
|----------------------------------|---------|---------|--------|---------|
| **Verso Max**                    | 70,8 %  | 293,4 s | 6,3    | 60/61   |
| **Verso Medium**                 | 49,6 %  | 207,7 s | 8,8    | 61/61   |
| **Verso Fast**                   | 38,9 %  | 157,5 s | 9,5    | 61/61   |
| Claude for Powerpoint (Opus)     | 36,5 %  | 176,5 s | 11,6   | 61/61   |
| Claude for Powerpoint (Sonnet)   | 32,4 %  | 154,4 s | 9,2    | 61/61   |

**Verso Max** domine largement avec 70,8 %, soit près du double du score du meilleur agent non-Verso. Il y parvient avec le moins d'étapes en moyenne (6,3), ce qui suggère une approche plus efficace de la reproduction de slides, bien qu'il prenne plus de temps par tâche (293,4 s) en raison d'un raisonnement plus approfondi.

**Verso Medium** obtient 49,6 % : la plupart des reproductions capturent la bonne structure et le bon contenu, mais présentent des différences notables dans le style ou le positionnement.

**Verso Fast** sacrifie la précision au profit de la vitesse, en complétant les tâches 24 % plus rapidement que Verso Medium tout en atteignant un score de 38,9 %. Fait intéressant, il utilise davantage d'étapes en moyenne (9,5 contre 8,8), ce qui suggère que le modèle plus léger effectue davantage d'actions exploratoires.

**Claude for Powerpoint (Opus)** obtient un score de 36,5 % malgré l'utilisation du plus grand nombre d'étapes (11,6) et d'une puissance de calcul significativement supérieure. **Claude for Powerpoint (Sonnet)** obtient 32,4 %, le score le plus bas de toutes les configurations, tout en étant le plus rapide à 154,4 s par tâche.

<div id="prezeval-chart"></div>

### Décomposition des scores par type de contenu

La décomposition des scores selon le contenu des slides révèle des tendances claires :

| Type de contenu        | Verso Medium | Claude for PPT |
|------------------------|--------------|----------------|
| Texte dense            | 66,8 %       | 48,3 %         |
| Slides sans graphique  | 63,5 %       | 44,8 %         |
| Tableaux               | 48,3 %       | 38,3 %         |
| Diagrammes             | 47,3 %       | 25,0 %         |
| Graphiques             | 38,0 %       | 29,5 %         |
| Cartes                 | 12,5 %       | 12,5 %         |
| **Global**             | **49,5 %**   | **36,5 %**     |

Les slides à forte densité textuelle constituent la catégorie la plus facile, tandis que les cartes sont les plus difficiles (également mauvaises pour les deux agents). Les graphiques, qui représentent 54 % du benchmark, tirent considérablement le score global vers le bas.

### Là où Verso excelle

Verso obtient systématiquement de bons scores sur les slides à texte structuré : texte juridique mis en forme, mises en page multi-sections avec encadrés colorés, pages de type table des matières et mises en page multi-colonnes avec icônes. Sur ces éléments, Verso Max atteint régulièrement des scores quasi parfaits, et même Verso Medium et Verso Fast obtiennent entre 75 et 100 %, tandis que les deux variantes Claude for Powerpoint restent généralement bien en deçà.

### Ce qui reste difficile

Environ 20 % du benchmark est pour ainsi dire non résolu : les cinq agents y obtiennent un score de 25 % ou moins sur les tâches les plus difficiles. Les modes d'échec récurrents sont :

- **Cartes géographiques.** Les agents peinent à produire des visualisations cartographiques précises. Ils peuvent substituer la carte par une forme sans rapport, la restituer à la mauvaise échelle ou perdre le codage couleur par État. Verso tente bien de produire des cartes, mais les résultats sont systématiquement médiocres : une carte des États-Unis peut apparaître réduite avec des détails manquants, ou une carte du monde peut être remplacée par un diagramme circulaire.
- **Graphiques complexes à données denses.** Les graphiques combinés (barres + courbes sur double axe), les tableaux de bord multi-panneaux et les matrices de heatmap mettent systématiquement tous les agents en échec. Parmi les erreurs fréquentes : des graphiques entiers manquants, des intitulés d'axes supprimés et des valeurs de données absentes.
- **Formes composites personnalisées.** Les entonnoirs construits à partir de trapèzes, les graphiques en quadrants avec des séparateurs courbes et des constructions similaires exigent un empilage et un alignement précis que les agents ne parviennent pas encore à réaliser de manière fiable.

### Là où Verso a encore des marges de progression

Même Verso Max, malgré sa moyenne de 70,8 %, peine encore sur certaines tâches (score de 25 % ou moins). Il s'agit généralement de slides comportant de grandes grilles structurées, des logos de marque intégrés dans des graphiques ou des éléments décoratifs. Cela suggère des axes d'amélioration spécifiques pour la gestion de ces types de contenu par Verso.

La vitesse est également un axe de travail. Verso Max prend près de 5 minutes par tâche, et même Verso Fast dépasse en moyenne 2,5 minutes. Un bon assistant IA devrait ressembler davantage à une continuation en continu de votre travail qu'à une partie de tennis où l'on attend que la balle revienne. Nous travaillerons à réduire significativement la latence dans les semaines à venir.

Tous les résultats, y compris les images générées et de référence par tâche ainsi que les critiques de l'évaluateur, sont disponibles dans [le dépôt PrezEval](https://github.com/VersoLabs/PrezEvalPublic).
