---
title: "PrezEval: evaluando agentes de IA en presentaciones profesionales"
date: 2026-04-06
description: "¿Qué tan bien puede un agente de IA reproducir una diapositiva de consultoría profesional a partir de una captura de pantalla? Construimos un benchmark para averiguarlo."
lang: es
---

## Objetivo

¿Qué tan bien puede un agente de IA reproducir diapositivas de consultoría profesional a partir de una imagen de referencia?

Tras construir Folio, hemos llegado a la convicción de que nuestro enfoque produce resultados muy superiores a los de otros sistemas.

Pero pongamos números sobre la mesa.

PrezEval es un benchmark que mide exactamente esto. Dado una imagen de diapositiva objetivo y la presentación fuente original (con el layout correcto preseleccionado), el agente debe editar la diapositiva para que coincida con el objetivo lo más fielmente posible. Luego, un modelo de visión-lenguaje evalúa el resultado comparando estructura, contenido, jerarquía y estilo visual.

La tarea es engañosamente difícil. Las diapositivas de consultoría reales son artefactos densos y precisos: una leyenda de gráfica desalineada, una etiqueta de eje que falta, o un color incorrecto en una celda de mapa de calor son todos errores que cuentan. El benchmark no evalúa únicamente si un agente puede escribir texto en una diapositiva, sino si puede manejar gráficas, tablas, formas personalizadas, maquetaciones multicolumna y estilos de marca específicos, todo a la vez.

## Construcción del benchmark

### Material fuente

Cubrimos 61 diapositivas procedentes de 10 presentaciones profesionales de grandes firmas de consultoría y asesoría: McKinsey, Bain, BCG, PwC, EY y Deloitte, así como los despachos de abogados Cleary Gottlieb y Mattos Filho. Son presentaciones reales sobre temas que van desde la economía sanitaria hasta las transiciones energéticas y la regulación de privacidad del consumidor.

Las diapositivas se seleccionaron para maximizar la complejidad visual y la diversidad de elementos. Esto es lo que contiene el benchmark:

| Elemento                               | Diapositivas | Proporción |
|----------------------------------------|--------------|------------|
| Gráficas (barras, líneas, tarta...)    | 33           | 54%        |
| Maquetaciones multicolumna             | 24           | 39%        |
| Logos e iconos                         | 17*          | 28%        |
| Tablas                                 | 14           | 23%        |
| Maquetaciones de texto denso           | 13           | 21%        |
| Diagramas complejos / líneas de tiempo | 8            | 13%        |
| Mapas                                  | 5            | 8%         |
| Formas compuestas personalizadas       | 3            | 5%         |

*\*Contando únicamente iconos ilustrativos sustantivos, no logotipos de empresas (que aparecen en ~45 diapositivas).*

### Por qué es difícil

- **Diversidad de estilos.** Cada firma tiene su propia identidad visual: paletas de colores, tipografías, convenciones de maquetación. El agente no puede apoyarse en una sola plantilla: debe adaptarse a 10 sistemas de diseño diferentes en 21 layouts distintos.
- **Las gráficas dominan.** Más de la mitad de las diapositivas contienen al menos una gráfica: barras apiladas, gráficas combinadas con doble eje, matrices de mapa de calor, gráficas de área. Reproducir una gráfica implica acertar con los valores de los datos, las etiquetas de los ejes, las leyendas, los colores y el posicionamiento.
- **Las maquetaciones son intrincadas.** El 39% de las diapositivas usan maquetaciones multicolumna donde el contenido debe colocarse con precisión. Una diapositiva de McKinsey puede tener una gráfica de barras a la izquierda, una lista de puntos a la derecha y una barra de pie de página al fondo, todo dentro de una plantilla con marca propia.
- **Las formas personalizadas llevan al límite.** Algunas diapositivas contienen formas construidas a partir de primitivas geométricas: un embudo que se estrecha de 43K a 13K candidatos, un flujo de proceso en forma de cono, un balancín comparando precios. Esto requiere que el agente componga varias formas básicas en un conjunto visual coherente.

### Configuración de las tareas

Para cada una de las 61 tareas, el agente recibe:
- El archivo `.pptx` fuente con el layout de diapositiva correcto preseleccionado (reproduciendo el escenario real donde el usuario comienza cargando la plantilla pptx de su empresa)
- Una captura de pantalla de la diapositiva objetivo a reproducir
- La instrucción: *"Recrea la diapositiva que se muestra en la imagen adjunta: reprodúcela exactamente."*

El agente edita la diapositiva mediante llamadas a herramientas, y el resultado final se renderiza como PNG y lo evalúa un modelo de visión-lenguaje. El evaluador puntúa cada resultado en una escala entera de 1 a 5, ya que la [investigación demuestra](https://arxiv.org/abs/2601.03444) que una escala entera compacta maximiza la alineación humano-LLM en configuraciones de LLM-como-juez. Luego convertimos las puntuaciones a un porcentaje de 0-100% para mayor legibilidad.

## Resultados

Comparamos cuatro configuraciones:

| Configuración                   | Puntuación | Tiempo | Pasos |
|---------------------------------|------------|--------|-------|
| **Folio Max**                   | 70,0%      | 2:19   | 5,5   |
| **Folio Medium**                | 66,8%      | 2:44   | 5,2   |
| **Folio Fast**                  | 43,0%      | 1:32   | 13,7  |
| Claude for PowerPoint (Sonnet 4.6) | 46,9%   | 16:03  | 25,5  |

**Folio Max** lidera con un 70,0%, superando al siguiente agente no-Folio por 23 puntos (una ventaja relativa del 49%). Alcanza esa puntuación en 138,9s por tarea, unas 7 veces más rápido que Claude for PowerPoint (962,8s, casi 16 minutos), y con muchos menos pasos (5,5 frente a 25,5). Folio Max y Folio Fast trazan juntos la frontera de Pareto - uno marca el extremo de máxima precisión y el otro el de mínima latencia - mientras que Claude for PowerPoint queda dominado: más lento y menos preciso que Folio Max.

**Folio Medium** obtiene un 66,8%, a tiro de piedra de Max, con un coste algo menor. Razona menos pero resuelve con limpieza casi tantas reproducciones.

**Folio Fast** es el nivel económico y de baja latencia: con 0,21 $ por tarea cuesta unas 5 veces menos que Folio Max y 9 veces menos que Claude for PowerPoint, y con cerca de 1,5 minutos por diapositiva es la configuración más rápida del conjunto. El compromiso es la fidelidad (43,0%) y más acciones exploratorias (13,7 pasos), ya que funciona con un modelo más pequeño y barato.

**Claude for PowerPoint (Sonnet 4.6)** obtiene un 46,9%, pero lo paga caro: 962,8s por tarea (unas 7 veces más lento que Folio Max), 25,5 pasos, 1,80 $ y 5 de 61 tareas sin completar. Edita OOXML en bruto directamente, lo que resulta lento y propenso a errores frente al enfoque estructurado de Folio.

<div id="prezeval-chart"></div>

### Desglose de puntuaciones por tipo de contenido

Desglosar las puntuaciones según el contenido de cada diapositiva revela patrones claros:

| Tipo de contenido        | Folio Medium | Claude for PPT |
|--------------------------|--------------|----------------|
| Gráficas                 | 68,5%        | 42,3%          |
| Texto denso              | 66,7%        | 50,0%          |
| Diagramas                | 66,1%        | 43,8%          |
| Tablas                   | 65,9%        | 47,7%          |
| Mapas                    | 43,8%        | 41,7%          |
| **Total**                | **66,8%**    | **46,9%**      |

Lo llamativo es lo consistente que se ha vuelto Folio Medium: se mantiene en una banda estrecha del 65-69% en gráficas, texto denso, diagramas y tablas. Las gráficas, que representan más de la mitad del benchmark y solían ser la categoría que tiraba las puntuaciones hacia abajo, son ahora la categoría más fuerte de Folio. Los mapas son el único punto débil que queda, y son difíciles para todos (igual de malos para ambos agentes). Claude for PowerPoint queda por detrás en todas y cada una de las categorías, con las mayores diferencias en gráficas (+26 puntos) y diagramas (+22 puntos).

### Donde Folio destaca

Folio maneja toda la gama de elementos de una diapositiva de consultoría: texto legal formateado, maquetaciones de varias secciones con cajas de color, páginas estilo índice, maquetaciones multicolumna con iconos, gráficas de datos y tablas. Folio Max puntúa un 75% o más en 47 de las 61 diapositivas (y un 100% perfecto en un par), mientras que Claude for PowerPoint suele quedar muy por detrás. La diferencia es más visible en las diapositivas con muchas gráficas y diagramas, justo el contenido denso y estructurado que llena los decks reales.

### Donde Folio aún tiene margen de mejora

Los mapas siguen siendo la oportunidad más clara: cerrar solo esa brecha elevaría la puntuación global de forma notable. Más allá de eso, las tareas restantes que puntúan al 50% son en su mayoría casi-aciertos en gráficas densas y formas compuestas, donde la estructura es correcta pero el estilo o la alineación quedan ligeramente desviados.

La velocidad, que solía ser una preocupación, es ahora una fortaleza: Folio Max completa una diapositiva en unos 2,3 minutos y Folio Fast en 1,5, frente a casi 16 minutos de Claude for PowerPoint. Seguiremos reduciendo la latencia para que trabajar con Folio se sienta como una continuación fluida de tu trabajo y no como un partido de tenis donde esperas a que te devuelvan la pelota.

Todos los resultados, incluyendo las imágenes generadas frente a las de referencia por tarea y las críticas del evaluador, están disponibles en [el repositorio de PrezEval](https://github.com/FolioLabs/PrezEvalPublic).
