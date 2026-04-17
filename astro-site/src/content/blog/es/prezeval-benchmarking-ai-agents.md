---
title: "PrezEval: evaluando agentes de IA en presentaciones profesionales"
date: 2026-04-06
description: "¿Qué tan bien puede un agente de IA reproducir una diapositiva de consultoría profesional a partir de una captura de pantalla? Construimos un benchmark para averiguarlo."
lang: es
---

## Objetivo

¿Qué tan bien puede un agente de IA reproducir diapositivas de consultoría profesional a partir de una imagen de referencia?

Tras construir Verso, hemos llegado a la convicción de que nuestro enfoque produce resultados muy superiores a los de otros sistemas.

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

Comparamos cinco configuraciones:

| Configuración                   | Puntuación | Tiempo   | Pasos | Tareas |
|---------------------------------|------------|----------|-------|--------|
| **Verso Max**                   | 70,8%      | 293,4s   | 6,3   | 60/61  |
| **Verso Medium**                | 49,6%      | 207,7s   | 8,8   | 61/61  |
| **Verso Fast**                  | 38,9%      | 157,5s   | 9,5   | 61/61  |
| Claude for Powerpoint (Opus)    | 36,5%      | 176,5s   | 11,6  | 61/61  |
| Claude for Powerpoint (Sonnet)  | 32,4%      | 154,4s   | 9,2   | 61/61  |

**Verso Max** lidera con amplia ventaja con un 70,8%, casi duplicando la puntuación del siguiente agente no-Verso. Lo logra con el menor número de pasos promedio (6,3), lo que sugiere un enfoque más eficiente en la reproducción de diapositivas, aunque tarda más por tarea (293,4s) debido a un razonamiento más profundo.

**Verso Medium** obtiene un 49,6%: la mayoría de las reproducciones capturan la estructura y el contenido correctos, pero presentan diferencias notables en estilo o posicionamiento.

**Verso Fast** sacrifica precisión por velocidad, completando las tareas un 24% más rápido que Verso Medium con una puntuación del 38,9%. Curiosamente, usa más pasos en promedio (9,5 vs 8,8), lo que sugiere que el modelo más pequeño realiza más acciones exploratorias.

**Claude for Powerpoint (Opus)** obtiene un 36,5% a pesar de usar más pasos (11,6) y significativamente más cómputo. **Claude for Powerpoint (Sonnet)** obtiene un 32,4%, el más bajo de todas las configuraciones, siendo el más rápido con 154,4s por tarea.

<div id="prezeval-chart"></div>

### Desglose de puntuaciones por tipo de contenido

Desglosar las puntuaciones según el contenido de cada diapositiva revela patrones claros:

| Tipo de contenido        | Verso Medium | Claude for PPT |
|--------------------------|--------------|----------------|
| Texto denso              | 66,8%        | 48,3%          |
| Diapositivas sin gráfica | 63,5%        | 44,8%          |
| Tablas                   | 48,3%        | 38,3%          |
| Diagramas                | 47,3%        | 25,0%          |
| Gráficas                 | 38,0%        | 29,5%          |
| Mapas                    | 12,5%        | 12,5%          |
| **Total**                | **49,5%**    | **36,5%**      |

Las diapositivas con mucho texto son la categoría más fácil, mientras que los mapas son los más difíciles (igual de malos para ambos agentes). Las gráficas, que representan el 54% del benchmark, tiran considerablemente la puntuación global hacia abajo.

### Donde Verso destaca

Verso obtiene sistemáticamente buenas puntuaciones en diapositivas de texto estructurado: texto legal formateado, maquetaciones de varias secciones con cajas de color, páginas estilo índice y maquetaciones multicolumna con iconos. En estas, Verso Max logra habitualmente puntuaciones casi perfectas, e incluso Verso Medium y Verso Fast alcanzan el 75-100%, mientras que ambas variantes de Claude for Powerpoint suelen quedar significativamente por detrás.

### Lo que sigue siendo difícil

Alrededor del 20% del benchmark está esencialmente sin resolver: los cinco agentes obtienen un 25% o menos en las tareas más difíciles. Los modos de fallo más comunes:

- **Mapas geográficos.** Los agentes tienen dificultades para producir visualizaciones de mapas precisas. Pueden sustituir el mapa por una forma sin relación, renderizarlo a una escala incorrecta o perder la codificación de colores por estados. Verso sí intenta los mapas, pero los resultados son consistentemente pobres: un mapa de EE.UU. puede aparecer reducido con detalles que faltan, o un mapa mundial puede ser reemplazado por un diagrama circular.
- **Gráficas complejas con datos densos.** Las gráficas combinadas (barras + líneas en doble eje), los paneles de múltiples gráficas y las matrices de mapa de calor rompen consistentemente todos los agentes. Los fallos habituales incluyen gráficas enteras que desaparecen, etiquetas de ejes que se pierden y valores de datos que faltan.
- **Formas compuestas personalizadas.** Embudos construidos con trapecios, gráficas de cuadrantes con divisores curvos y construcciones similares requieren capas y alineación precisas que los agentes aún no pueden lograr de forma fiable.

### Donde Verso aún tiene margen de mejora

Incluso Verso Max, a pesar de su media del 70,8%, sigue teniendo dificultades en algunas tareas (puntuando 25% o menos). Estas tienden a ser diapositivas con grandes cuadrículas estructuradas, logotipos de marca incrustados en gráficas o elementos decorativos. Esto sugiere oportunidades específicas para mejorar el manejo de estos patrones en Verso.

La velocidad también es un área de foco. Verso Max tarda casi 5 minutos por tarea, e incluso Verso Fast promedia más de 2,5 minutos. Un buen asistente de IA debería sentirse más como una continuación fluida de tu trabajo que como un partido de tenis donde esperas a que te devuelvan la pelota. Trabajaremos en reducir la latencia significativamente en las próximas semanas.

Todos los resultados, incluyendo las imágenes generadas frente a las de referencia por tarea y las críticas del evaluador, están disponibles en [el repositorio de PrezEval](https://github.com/VersoLabs/PrezEvalPublic).
