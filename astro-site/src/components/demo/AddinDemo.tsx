import { useState, useCallback, useMemo } from 'react'
import DemoWorkflow, { getPptUI } from './DemoWorkflow'
import type { DemoWorkflowConfig } from './DemoWorkflow'
import { defaultSlides, frenchSlide2, makeBlankSlide } from './slides'

const demoText: Record<string, {
  w1Prompt: string; w1Ai: string; w1Search: string; w1Tools: string[]
  w2Prompt: string; w2Ai: string; w2Tool: string; w2Followup: string
}> = {
  en: {
    w1Prompt: 'Can you make me a 3 slides presentation on the current oil market?',
    w1Ai: "I'll create a 3-slide presentation on the current oil market.",
    w1Search: 'Searching "current oil market 2026"',
    w1Tools: [
      'Adding title, subtitle, date and confidentiality notice',
      'Creating supply vs demand chart with KPI cards and analysis',
      'Building price trend visualization with sector breakdown',
    ],
    w2Prompt: 'Translate this slide to French',
    w2Ai: "Translating to French: c'est parti!",
    w2Tool: 'Translating all text elements to French',
    w2Followup: 'Done! Do you need me to translate the other slides as well?',
  },
  fr: {
    w1Prompt: 'Crée-moi une présentation de 3 slides sur le marché pétrolier actuel',
    w1Ai: 'Je vais créer une présentation de 3 slides sur le marché pétrolier actuel.',
    w1Search: 'Recherche "marché pétrolier actuel 2026"',
    w1Tools: [
      'Ajout du titre, sous-titre, date et mention de confidentialité',
      'Création du graphique offre/demande avec KPIs et analyse',
      'Construction de la visualisation des tendances de prix par secteur',
    ],
    w2Prompt: 'Traduis ce slide en français',
    w2Ai: "Traduction en français : c'est parti !",
    w2Tool: 'Traduction de tous les éléments textuels en français',
    w2Followup: 'C\'est fait ! Voulez-vous que je traduise les autres slides aussi ?',
  },
  es: {
    w1Prompt: '¿Puedes crearme una presentación de 3 slides sobre el mercado petrolero actual?',
    w1Ai: 'Voy a crear una presentación de 3 slides sobre el mercado petrolero actual.',
    w1Search: 'Buscando "mercado petrolero actual 2026"',
    w1Tools: [
      'Añadiendo título, subtítulo, fecha y aviso de confidencialidad',
      'Creando gráfico de oferta y demanda con KPIs y análisis',
      'Construyendo visualización de tendencias de precios por sector',
    ],
    w2Prompt: 'Traduce esta diapositiva al francés',
    w2Ai: "Traduciendo al francés: c'est parti!",
    w2Tool: 'Traduciendo todos los elementos de texto al francés',
    w2Followup: '¡Listo! ¿Necesitas que traduzca las demás diapositivas también?',
  },
  de: {
    w1Prompt: 'Kannst du mir eine 3-Folien-Präsentation zum aktuellen Ölmarkt erstellen?',
    w1Ai: 'Ich erstelle eine 3-Folien-Präsentation zum aktuellen Ölmarkt.',
    w1Search: 'Suche "aktueller Ölmarkt 2026"',
    w1Tools: [
      'Titel, Untertitel, Datum und Vertraulichkeitshinweis hinzufügen',
      'Angebots-/Nachfragediagramm mit KPIs und Analyse erstellen',
      'Preistrend-Visualisierung mit Sektoraufschlüsselung erstellen',
    ],
    w2Prompt: 'Übersetze diese Folie ins Französische',
    w2Ai: "Übersetze ins Französische: c'est parti!",
    w2Tool: 'Alle Textelemente ins Französische übersetzen',
    w2Followup: 'Fertig! Soll ich die anderen Folien auch übersetzen?',
  },
}

const fileTitles: Record<string, string> = {
  en: 'Oil Market Outlook Q1 2026.pptx',
  fr: 'Perspectives Marché Pétrolier T1 2026.pptx',
  es: 'Perspectivas Mercado Petrolero T1 2026.pptx',
  de: 'Ölmarkt-Ausblick Q1 2026.pptx',
}

type Workflow = 'create' | 'edit'

export default function AddinDemo({ lang = 'en' }: { lang?: string }) {
  const [activeWorkflow, setActiveWorkflow] = useState<Workflow>('create')

  const t = demoText[lang] || demoText.en
  const ui = getPptUI(lang, fileTitles[lang] || fileTitles.en)

  const createConfig = useMemo((): DemoWorkflowConfig => {
    const blankAndSlides = [makeBlankSlide(), ...defaultSlides]
    return {
      allSlides: blankAndSlides,
      initialVisible: [0],
      initialActive: 0,
      turns: [{
        prompt: t.w1Prompt,
        aiResponse: t.w1Ai,
        search: { toolName: 'google_search', label: t.w1Search },
        tools: t.w1Tools.map((label, i) => ({
          toolName: i === 0 ? 'edit_slide' : 'insert_slide',
          label,
          slideUpdate: {
            ...(i === 0 ? { replaceVisible: [i + 1] } : { addVisible: [i + 1] }),
            setActive: i + 1,
          },
        })),
      }],
      ui,
      loopDelay: 1500,
    }
  }, [t, ui])

  const editConfig = useMemo((): DemoWorkflowConfig => ({
    allSlides: [...defaultSlides.slice(0, 1), frenchSlide2, ...defaultSlides.slice(2)],
    initialVisible: [0, 1, 2],
    initialActive: 1,
    turns: [{
      prompt: t.w2Prompt,
      aiResponse: t.w2Ai,
      tools: [{
        toolName: 'edit_slide',
        label: t.w2Tool,
        slideUpdate: { replaceSlide: { at: 1, with: 1 } },
      }],
      followup: t.w2Followup,
    }],
    ui,
    loopDelay: 1500,
  }), [t, ui])

  const handleComplete = useCallback(() => {
    setActiveWorkflow(w => w === 'create' ? 'edit' : 'create')
  }, [])

  const config = activeWorkflow === 'create' ? createConfig : editConfig

  return <DemoWorkflow key={activeWorkflow} config={config} onComplete={handleComplete} />
}
