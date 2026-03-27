import { useMemo } from 'react'
import DemoWorkflow, { getPptUI } from './DemoWorkflow'
import type { DemoWorkflowConfig } from './DemoWorkflow'
import { controlSlides } from './controlSlides'

const demoText: Record<string, { prompt: string; ai: string; tools: string[] }> = {
  en: {
    prompt: 'Move the revenue chart to the right side and make all three KPI cards orange.',
    ai: "I'll reposition the chart and update the card colors to orange.",
    tools: [
      'Repositioning revenue chart to right column',
      'Updating KPI card colors to orange theme',
    ],
  },
  fr: {
    prompt: 'Déplace le graphique des revenus vers la droite et rends les trois cartes KPI orange.',
    ai: 'Je vais repositionner le graphique et mettre à jour les couleurs des cartes en orange.',
    tools: [
      'Repositionnement du graphique vers la colonne droite',
      'Mise à jour des couleurs des cartes KPI en orange',
    ],
  },
  es: {
    prompt: 'Mueve el gráfico de ingresos al lado derecho y haz que las tres tarjetas KPI sean naranjas.',
    ai: 'Voy a reposicionar el gráfico y actualizar los colores de las tarjetas a naranja.',
    tools: [
      'Reposicionando gráfico de ingresos a columna derecha',
      'Actualizando colores de tarjetas KPI a tema naranja',
    ],
  },
  de: {
    prompt: 'Verschiebe das Umsatzdiagramm nach rechts und mache alle drei KPI-Karten orange.',
    ai: 'Ich positioniere das Diagramm neu und aktualisiere die Kartenfarben auf Orange.',
    tools: [
      'Neupositionierung des Umsatzdiagramms zur rechten Spalte',
      'Aktualisierung der KPI-Kartenfarben auf Orange-Thema',
    ],
  },
}

const fileTitles: Record<string, string> = {
  en: 'Q1 Performance Report.pptx',
  fr: 'Rapport Performance T1.pptx',
  es: 'Informe Rendimiento T1.pptx',
  de: 'Q1-Leistungsbericht.pptx',
}

const visible15 = Array.from({ length: 15 }, (_, i) => i)

export default function FullControlDemo({ lang = 'en' }: { lang?: string }) {
  const config = useMemo((): DemoWorkflowConfig => {
    const t = demoText[lang] || demoText.en
    return {
      allSlides: controlSlides,
      initialVisible: visible15,
      initialActive: 1,
      turns: [{
        prompt: t.prompt,
        aiResponse: t.ai,
        tools: t.tools.map((label, i) => ({
          toolName: 'modify_objects',
          label,
          slideUpdate: i === 1 ? { replaceSlide: { at: 1, with: 2 } } : undefined,
        })),
      }],
      ui: getPptUI(lang, fileTitles[lang] || fileTitles.en),
      totalSlideCount: 81,
      loopDelay: 2500,
    }
  }, [lang])

  return <DemoWorkflow config={config} />
}
