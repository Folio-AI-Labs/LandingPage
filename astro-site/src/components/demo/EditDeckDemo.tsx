import { useMemo } from 'react'
import DemoWorkflow, { getPptUI } from './DemoWorkflow'
import type { DemoWorkflowConfig } from './DemoWorkflow'
import { editSlides } from './editSlides'

const demoText: Record<string, {
  w1Prompt: string; w1Ai: string; w1Tools: string[]
  w2Prompt: string; w2Ai: string; w2Tools: string[]
}> = {
  en: {
    w1Prompt: 'Update slide 3 to add a competitive analysis section with key players.',
    w1Ai: "I'll add a competitive analysis section to slide 3.",
    w1Tools: [
      'Analyzing current slide 3 structure',
      'Adding competitive landscape section with market players',
    ],
    w2Prompt: 'Make the title more impactful and add growth percentages.',
    w2Ai: "I'll enhance the title and add specific growth metrics.",
    w2Tools: [
      'Updating slide title for stronger impact',
      'Adding YoY growth percentages to competitive data',
    ],
  },
  fr: {
    w1Prompt: 'Mets à jour la slide 3 pour ajouter une section d\'analyse concurrentielle avec les acteurs clés.',
    w1Ai: 'Je vais ajouter une section d\'analyse concurrentielle à la slide 3.',
    w1Tools: [
      'Analyse de la structure actuelle de la slide 3',
      'Ajout de la section paysage concurrentiel avec acteurs du marché',
    ],
    w2Prompt: 'Rends le titre plus percutant et ajoute les pourcentages de croissance.',
    w2Ai: 'Je vais améliorer le titre et ajouter des métriques de croissance spécifiques.',
    w2Tools: [
      'Mise à jour du titre pour plus d\'impact',
      'Ajout des pourcentages de croissance annuelle aux données concurrentielles',
    ],
  },
  es: {
    w1Prompt: 'Actualiza la diapositiva 3 para agregar una sección de análisis competitivo con jugadores clave.',
    w1Ai: 'Voy a agregar una sección de análisis competitivo a la diapositiva 3.',
    w1Tools: [
      'Analizando estructura actual de diapositiva 3',
      'Agregando sección de panorama competitivo con actores del mercado',
    ],
    w2Prompt: 'Haz el título más impactante y agrega porcentajes de crecimiento.',
    w2Ai: 'Voy a mejorar el título y agregar métricas de crecimiento específicas.',
    w2Tools: [
      'Actualizando título para mayor impacto',
      'Agregando porcentajes de crecimiento interanual a datos competitivos',
    ],
  },
  de: {
    w1Prompt: 'Aktualisiere Folie 3, um einen Wettbewerbsanalyse-Abschnitt mit Hauptakteuren hinzuzufügen.',
    w1Ai: 'Ich füge der Folie 3 einen Wettbewerbsanalyse-Abschnitt hinzu.',
    w1Tools: [
      'Analyse der aktuellen Struktur von Folie 3',
      'Hinzufügen des Wettbewerbslandschaft-Abschnitts mit Marktakteuren',
    ],
    w2Prompt: 'Mache den Titel wirkungsvoller und füge Wachstumsprozentsätze hinzu.',
    w2Ai: 'Ich verbessere den Titel und füge spezifische Wachstumsmetriken hinzu.',
    w2Tools: [
      'Aktualisierung des Titels für stärkere Wirkung',
      'Hinzufügen von YoY-Wachstumsprozentsätzen zu Wettbewerbsdaten',
    ],
  },
}

const fileTitles: Record<string, string> = {
  en: 'Tech Market Analysis.pptx',
  fr: 'Analyse Marché Tech.pptx',
  es: 'Análisis Mercado Tech.pptx',
  de: 'Tech-Marktanalyse.pptx',
}

const visible15 = Array.from({ length: 15 }, (_, i) => i)

export default function EditDeckDemo({ lang = 'en' }: { lang?: string }) {
  const config = useMemo((): DemoWorkflowConfig => {
    const t = demoText[lang] || demoText.en
    return {
      allSlides: editSlides,
      initialVisible: visible15,
      initialActive: 2,
      turns: [
        {
          prompt: t.w1Prompt,
          aiResponse: t.w1Ai,
          tools: t.w1Tools.map((label, i) => ({
            toolName: 'edit_slide',
            label,
            slideUpdate: i === 1 ? { replaceSlide: { at: 2, with: 3 } } : undefined,
          })),
        },
        {
          prompt: t.w2Prompt,
          aiResponse: t.w2Ai,
          tools: t.w2Tools.map((label, i) => ({
            toolName: 'edit_slide',
            label,
            slideUpdate: i === 1 ? { replaceSlide: { at: 2, with: 4 } } : undefined,
          })),
        },
      ],
      ui: getPptUI(lang, fileTitles[lang] || fileTitles.en),
      totalSlideCount: 55,
      loopDelay: 2000,
      variant: 'ribbon-only' as const,
    }
  }, [lang])

  return <DemoWorkflow config={config} />
}
