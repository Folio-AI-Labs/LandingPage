---
title: "Por qué la IA no podía editar PowerPoint hasta ahora"
date: 2026-04-12
description: "Todas las herramientas de IA generan nuevas presentaciones en lugar de editar las existentes. Aquí está la razón técnica, y cómo la resolvimos."
lang: es
---

Si has probado alguna de las herramientas de IA para presentaciones disponibles en el mercado, habrás notado algo: todas generan nuevas presentaciones. Ninguna abre tu archivo PowerPoint existente y lo edita.

No es un descuido. Es una limitación técnica que todo el sector ha esquivado en silencio en lugar de resolver.

Nosotros decidimos resolverla.

## El problema: PowerPoint no es amigable para los LLMs

Los archivos PowerPoint (.pptx) usan un formato llamado OOXML (Office Open XML). Lo estandarizó Microsoft y fue adoptado como norma ISO en 2008. Es, por cualquier criterio razonable, uno de los formatos de documento más complejos jamás diseñados.

Algunos ejemplos para ilustrarlo:

**Unidades que no tienen sentido para los humanos (ni para los modelos)**

OOXML usa EMU (English Metric Units) como unidad base de medida. Un pulgada equivale a 914.400 EMU. Una diapositiva típica mide 9.144.000 × 6.858.000 EMU. Estos son los números almacenados en el archivo. Cuando le dices a un LLM "mueve esta forma 2 pulgadas a la derecha", necesita entender que eso significa sumar 1.828.800 al atributo `off x`.

**Diez niveles de anidamiento para un cuadro de texto**

En OOXML, describir un simple cuadro de texto con dos líneas de texto requiere navegar por: el elemento de forma, las propiedades de forma, el cuerpo de texto, las propiedades del cuerpo, el estilo de lista, el párrafo, las propiedades del párrafo, la ejecución de texto, las propiedades de la ejecución y, finalmente, el contenido del texto. Si cambias un atributo en el nivel equivocado, el archivo se rompe silenciosamente.

**Miles de valores predeterminados implícitos**

OOXML tiene un concepto de "herencia": si un atributo no está establecido, lo hereda del layout de la diapositiva, que lo hereda del master de la diapositiva, que lo hereda del tema. La mayoría de las propiedades nunca se escriben explícitamente en el archivo. Un LLM que lee el XML de un cuadro de texto dado solo ve las sobreescrituras, no el cuadro completo.

**Sin validación de esquema en tiempo de edición**

Cuando editas un PPTX con manipulación directa de XML, no hay validación en tiempo real. El archivo puede parecer sintácticamente correcto y aun así fallar al abrirse en PowerPoint, o abrirse con diapositivas corruptas, por violaciones semánticas sutiles.

## Qué ocurre cuando alimentas OOXML a un LLM

Lo probamos. Extensamente.

Los modos de fallo son consistentes. Los LLMs producen con confianza XML con nombres de elementos que parecen válidos pero son semánticamente incorrectos, luego omiten atributos requeridos o inventan otros que no existen. Rompen la cadena de herencia al establecer explícitamente valores que deberían permanecer heredados. Peor aún, ocasionalmente producen archivos que PowerPoint abre pero renderiza incorrectamente - algo más difícil de detectar que un error directo.

El benchmark que construimos internamente, PrezEval, mide las ediciones exitosas: ¿con qué frecuencia produce un modelo una diapositiva válida y correctamente formateada que coincide con la instrucción? Con OOXML puro, incluso los mejores modelos puntuaron por debajo del 30% en ediciones complejas.

Eso no es utilizable. Explica por qué todas las demás herramientas abandonaron la edición y se centraron en la generación.

## Nuestra solución: SimpleXML

Pasamos meses construyendo un enfoque alternativo.

En lugar de pedirle a los LLMs que lean y escriban OOXML directamente, construimos un sistema de dos capas:

**Capa 1: Simplificación (OOXML a SimpleXML)**

Escribimos un codec que convierte OOXML en un formato personalizado que llamamos SimpleXML. Tiene varias propiedades que lo hacen mucho más amigable para los LLMs:

- *Unidades legibles por humanos.* Pulgadas, puntos, grados y porcentajes en lugar de EMU. "width: 4in" en lugar de "cx: 3657600".
- *Estructura plana.* Colapsamos el anidamiento de 10 niveles en una representación plana similar a CSS. Una ejecución de texto parece una ejecución de texto, no una muñeca rusa de elementos XML.
- *Explícito en lugar de implícito.* Resolvemos toda la herencia en el momento del análisis, para que el LLM siempre vea el cuadro completo de cada elemento.
- *Vocabulario restringido.* El LLM solo necesita conocer un pequeño conjunto de elementos y atributos. Nosotros nos encargamos del mapeo hacia la semántica OOXML.

**Capa 2: Restauración (SimpleXML a OOXML)**

Tras producir el SimpleXML editado el LLM, lo procesamos con el codec inverso, que valida, resuelve y convierte de vuelta a OOXML válido. Esta capa maneja todos los casos extremos: recodificación de unidades, reconstrucción del anidamiento, restauración de la herencia y validación contra la especificación OOXML.

El resultado es que los LLMs nunca tocan OOXML directamente. Trabajan en un formato que les resulta tan natural como escribir código o editar texto.

## La diferencia de rendimiento

En nuestro benchmark PrezEval:

- Edición con OOXML puro: ~25% de tasa de éxito en ediciones complejas
- SimpleXML con nuestro mejor modelo: ~85% de tasa de éxito

No es una mejora marginal. Es la diferencia entre una herramienta que funciona de vez en cuando y una en la que puedes confiar.

También significa que Verso puede hacer cosas que otras herramientas simplemente no pueden: editar diapositivas existentes preservando su estructura, aplicar formatos que respetan las plantillas, modificar gráficas con datos reales y manejar toda la complejidad de los objetos de PowerPoint, sin generar un archivo nuevo.

## Por qué esto es una ventaja competitiva duradera

Construir este codec requirió un tiempo de ingeniería considerable, y sigue evolucionando a medida que encontramos casos extremos en archivos PowerPoint del mundo real. No es una función que se pueda replicar rápidamente.

Más importante aún, solo se vuelve más valioso a medida que los LLMs mejoran. Cada vez que se lanza un nuevo modelo de frontera, el rendimiento de Verso mejora automáticamente, porque el cuello de botella nunca fue el modelo - fue la interfaz entre el modelo y el formato de archivo.

Esa interfaz ya está resuelta.
