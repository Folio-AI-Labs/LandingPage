---
title: "PrezEval: Evaluación comparativa de agentes de IA en diapositivas profesionales"
date: 2026-04-06
description: "¿Qué tan bien puede un agente de IA reproducir una diapositiva de consultoría profesional a partir de una captura de pantalla? Construimos un benchmark para averiguarlo."
lang: es
---

## Objetivo

¿Qué tan bien puede un agente de IA reproducir diapositivas de consultoría profesional a partir de una guía visual?

Después de construir Verso, hemos llegado a la convicción de que nuestro enfoque produce resultados muy superiores a los demás.

Pero pongámosle números a eso.

PrezEval es un benchmark que mide exactamente esto. Dado un imagen de diapositiva objetivo y la presentación fuente original (con el diseño correcto preseleccionado), un agente debe editar la diapositiva para que coincida lo más posible con el objetivo. Luego, un modelo de visión-lenguaje puntúa el resultado comparando estructura, contenido, jerarquía y estilo.

Esta tarea es engañosamente difícil. Las diapositivas de consultoría reales son artefactos densos y precisos: una leyenda de gráfico mal alineada, una etiqueta de eje faltante, o un color incorrecto en una celda de mapa de calor se cuentan como fallos. El benchmark no solo prueba si un agente puede escribir texto en una diapositiva, sino si puede manejar gráficos, tablas, formas personalizadas, diseños de múltiples columnas y estilo específico de marca, todo al mismo tiempo.

## Construcción del benchmark

### Material fuente

Seleccionamos cuidadosamente 61 diapositivas de 10 presentaciones profesionales que abarcan las principales firmas de consultoría y asesoría: McKinsey, Bain, BCG, PwC, EY y Deloitte, así como los despachos de abogados Cleary Gottlieb y Mattos Filho. Estos son documentos del mundo real que cubren temas que van desde economía de la salud hasta transiciones energéticas y regulación de privacidad del consumidor.

Las diapositivas fueron seleccionadas para maximizar la complejidad visual y la diversidad de elementos. Esto es lo que contiene el benchmark:

| Elemento                                     | Diapositivas | Proporción |
|----------------------------------------------|--------------|------------|
| Gráficos (barras, líneas, circular, combo…)  | 33           | 54%        |
| Diseños de múltiples columnas                | 24           | 39%        |
| Logotipos e iconos                           | 17*          | 28%        |
| Tablas                                       | 14           | 23%        |
| Diseños de texto denso                       | 13           | 21%        |
| Diagramas complejos / líneas de tiempo       | 8            | 13%        |
| Mapas                                        | 5            | 8%         |
| Formas compuestas personalizadas             | 3            | 5%         |

*\*Contando únicamente iconos ilustrativos sustanciales, no logotipos de empresas (que aparecen en ~45 diapositivas).*

### Lo que lo hace difícil

- **Diversidad de estilos.** Cada firma fuente tiene su propia identidad visual: paletas de colores, elecciones tipográficas, convenciones de diseño. El agente no puede depender de una única plantilla: debe adaptarse a 10 sistemas de diseño diferentes en 21 diseños de diapositivas distintos.
- **Los gráficos dominan.** Más de la mitad de las diapositivas contienen al menos un gráfico: barras apiladas, gráficos combinados con doble eje, matrices de mapa de calor, gráficos de área. Reproducir un gráfico implica obtener correctamente los valores de datos, etiquetas de ejes, leyendas, colores y posicionamiento.
- **Los diseños son intrincados.** El 39% de las diapositivas utilizan diseños de múltiples columnas donde el contenido debe colocarse con precisión. Una diapositiva de McKinsey puede tener un gráfico de barras a la izquierda, una lista de puntos a la derecha y una barra de notas al pie en la parte inferior, todo dentro de una plantilla con marca corporativa.
- **Las formas personalizadas llevan al límite.** Algunas diapositivas contienen formas construidas a partir de primitivas geométricas: un embudo que se estrecha de 43K a 13K candidatos, un flujo de proceso en forma de cono, un balancín/palanca que compara precios. Esto requiere que el agente componga múltiples formas base en una visual coherente.

### Configuración de las tareas

Para cada una de las 61 tareas, el agente recibe:
- El archivo `.pptx` fuente con el diseño de diapositiva correcto preseleccionado (esto reproduce el escenario real en el que el usuario comienza cargando la plantilla pptx de su empresa)
- Una captura de pantalla de la diapositiva objetivo a reproducir
- La instrucción: *"Recrea la diapositiva que se muestra en la imagen adjunta: reprodúcela exactamente."*

El agente edita entonces la diapositiva mediante llamadas a herramientas, y el resultado final se renderiza como PNG y es puntuado por un evaluador de modelo de visión-lenguaje. El evaluador califica cada resultado en una escala entera de 1 a 5, ya que [las investigaciones muestran](https://arxiv.org/abs/2601.03444) que una escala entera compacta maximiza la alineación humano-LLM en configuraciones de LLM-como-juez. Luego convertimos las calificaciones a una puntuación de 0-100% para facilitar la lectura.

## Resultados

Comparamos cinco configuraciones:

| Configuración                    | Puntuación | Tiempo  | Pasos | Tareas |
|----------------------------------|------------|---------|-------|--------|
| **Verso Max**                    | 70,8%      | 293,4s  | 6,3   | 60/61  |
| **Verso Medium**                 | 49,6%      | 207,7s  | 8,8   | 61/61  |
| **Verso Fast**                   | 38,9%      | 157,5s  | 9,5   | 61/61  |
| Claude for Powerpoint (Opus)     | 36,5%      | 176,5s  | 11,6  | 61/61  |
| Claude for Powerpoint (Sonnet)   | 32,4%      | 154,4s  | 9,2   | 61/61  |

**Verso Max** lidera con amplia ventaja con un 70,8%, casi duplicando la puntuación del mejor agente no-Verso. Lo logra con el menor número de pasos en promedio (6,3), lo que sugiere un enfoque más eficiente para la reproducción de diapositivas, aunque tarda más por tarea (293,4s) debido a un razonamiento más profundo.

**Verso Medium** obtiene un 49,6%: la mayoría de las reproducciones capturan la estructura y el contenido correctos, pero presentan diferencias notables en estilo o posicionamiento.

**Verso Fast** sacrifica precisión por velocidad, completando las tareas un 24% más rápido que Verso Medium con una puntuación de 38,9%. Curiosamente, utiliza más pasos en promedio (9,5 frente a 8,8), lo que sugiere que el modelo más pequeño realiza más acciones exploratorias.

**Claude for Powerpoint (Opus)** obtiene un 36,5% a pesar de utilizar el mayor número de pasos (11,6) y significativamente más capacidad de cómputo. **Claude for Powerpoint (Sonnet)** obtiene un 32,4%, la puntuación más baja de todas las configuraciones, siendo al mismo tiempo el más rápido con 154,4s por tarea.

<div id="prezeval-chart"></div>

### Desglose de puntuación por tipo de contenido

El desglose de las puntuaciones según el contenido de cada diapositiva revela patrones claros:

| Tipo de contenido        | Verso Medium | Claude for PPT |
|--------------------------|--------------|----------------|
| Texto denso              | 66,8%        | 48,3%          |
| Diapositivas sin gráfico | 63,5%        | 44,8%          |
| Tablas                   | 48,3%        | 38,3%          |
| Diagramas                | 47,3%        | 25,0%          |
| Gráficos                 | 38,0%        | 29,5%          |
| Mapas                    | 12,5%        | 12,5%          |
| **Total**                | **49,5%**    | **36,5%**      |

Las diapositivas con mucho texto son la categoría más fácil, mientras que los mapas son la más difícil (igual de malos para ambos agentes). Los gráficos, que representan el 54% del benchmark, reducen significativamente la puntuación general.

### Dónde Verso destaca

Verso obtiene sistemáticamente buenas puntuaciones en diapositivas de texto estructurado: texto legal formateado, diseños de múltiples secciones con cuadros de colores, páginas estilo índice de contenidos y diseños de iconos en múltiples columnas. En estos casos, Verso Max logra rutinariamente puntuaciones casi perfectas, e incluso Verso Medium y Verso Fast alcanzan 75-100%, mientras que ambas variantes de Claude for Powerpoint suelen quedar significativamente por detrás.

### Lo que sigue siendo difícil

Aproximadamente el 20% del benchmark está esencialmente sin resolver: los cinco agentes obtienen un 25% o menos en las tareas más difíciles. Los modos de fallo más comunes son:

- **Mapas geográficos.** Los agentes tienen dificultades para producir visualizaciones de mapas precisas. Pueden sustituir el mapa por una forma no relacionada, renderizarlo a una escala incorrecta o perder la codificación de color a nivel de estado. Verso intenta los mapas, pero los resultados son consistentemente pobres: un mapa de EE. UU. puede aparecer reducido con detalles faltantes, o un mapa del mundo puede ser reemplazado por un diagrama circular.
- **Gráficos complejos con datos densos.** Los gráficos combinados (barras + líneas en doble eje), los paneles de múltiples secciones y las matrices de mapa de calor rompen sistemáticamente a todos los agentes. Los fallos más comunes incluyen gráficos completos faltantes, etiquetas de ejes eliminadas y valores de datos ausentes.
- **Formas compuestas personalizadas.** Los embudos construidos a partir de trapecios, los gráficos de cuadrantes con divisores curvos y construcciones similares requieren una superposición y alineación precisas que los agentes aún no pueden lograr de forma fiable.

### Dónde Verso aún tiene margen de mejora

Incluso Verso Max, a pesar de su promedio de 70,8%, sigue teniendo dificultades en algunas tareas (puntuando 25% o menos). Estas tienden a ser diapositivas con grandes cuadrículas estructuradas, logotipos de marca incrustados en gráficos o elementos decorativos. Esto sugiere oportunidades específicas para mejorar el manejo de Verso en estos patrones.

Todos los resultados, incluidas las imágenes generadas frente a las de referencia por tarea y las críticas del evaluador, están disponibles en [el repositorio de PrezEval](https://github.com/VersoLabs/PrezEvalPublic).
