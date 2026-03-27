import { useMemo } from 'react'
import DemoWorkflow, { getPptUI } from './DemoWorkflow'
import type { DemoWorkflowConfig } from './DemoWorkflow'
import { evSlides, makeBlankSlide } from './evSlides'

const demoText: Record<string, { prompt: string; ai: string; search: string; tools: string[] }> = {
  en: {
    prompt: 'Create a 10-slide presentation on the evolution of the EV market in Japan.',
    ai: "I'll create a presentation on the EV market evolution in Japan.",
    search: 'Searching "EV market evolution Japan 2026"',
    tools: [
      'Creating title slide with company template',
      'Building market evolution timeline with key milestones',
      'Adding financial analysis with charts and projections',
      'Adding consumer adoption insights',
      'Building technology innovation roadmap',
      'Creating strategic outlook and recommendations',
    ],
  },
  fr: {
    prompt: 'Crée une présentation de 10 slides sur l\'évolution du marché des VE au Japon.',
    ai: 'Je vais créer une présentation sur l\'évolution du marché des VE au Japon.',
    search: 'Recherche "évolution marché VE Japon 2026"',
    tools: [
      'Création de la slide titre avec le template entreprise',
      'Construction de la chronologie du marché avec jalons clés',
      'Ajout de l\'analyse financière avec graphiques et projections',
      'Ajout des informations sur l\'adoption par les consommateurs',
      'Construction de la feuille de route d\'innovation technologique',
      'Création des perspectives stratégiques et recommandations',
    ],
  },
  es: {
    prompt: 'Crea una presentación de 10 diapositivas sobre la evolución del mercado de VE en Japón.',
    ai: 'Voy a crear una presentación sobre la evolución del mercado de VE en Japón.',
    search: 'Buscando "evolución mercado VE Japón 2026"',
    tools: [
      'Creando diapositiva título con plantilla corporativa',
      'Construyendo cronología del mercado con hitos clave',
      'Añadiendo análisis financiero con gráficos y proyecciones',
      'Añadiendo información sobre adopción del consumidor',
      'Construyendo hoja de ruta de innovación tecnológica',
      'Creando perspectivas estratégicas y recomendaciones',
    ],
  },
  de: {
    prompt: 'Erstelle eine 10-Folien-Präsentation über die Entwicklung des EV-Marktes in Japan.',
    ai: 'Ich erstelle eine Präsentation über die EV-Marktentwicklung in Japan.',
    search: 'Suche "EV-Marktentwicklung Japan 2026"',
    tools: [
      'Titelfolie mit Unternehmensvorlage erstellen',
      'Marktentwicklungs-Zeitstrahl mit Meilensteinen erstellen',
      'Finanzanalyse mit Diagrammen und Prognosen hinzufügen',
      'Einblicke in die Verbraucherakzeptanz hinzufügen',
      'Technologie-Innovationsfahrplan erstellen',
      'Strategische Aussichten und Empfehlungen erstellen',
    ],
  },
}

const fileTitles: Record<string, string> = {
  en: 'EV Market Evolution Japan.pptx',
  fr: 'Évolution Marché VE Japon.pptx',
  es: 'Evolución Mercado VE Japón.pptx',
  de: 'EV-Marktentwicklung Japan.pptx',
}

export default function PromptToDeckDemo({ lang = 'en' }: { lang?: string }) {
  const config = useMemo((): DemoWorkflowConfig => {
    const t = demoText[lang] || demoText.en
    const allSlides = [makeBlankSlide(), ...Array.from({ length: 6 }, (_, i) => evSlides[i % evSlides.length])]

    return {
      allSlides,
      initialVisible: [0],
      initialActive: 0,
      turns: [{
        prompt: t.prompt,
        aiResponse: t.ai,
        search: { toolName: 'google_search', label: t.search },
        tools: t.tools.map((label, i) => ({
          toolName: 'insert_slide',
          label,
          slideUpdate: {
            ...(i === 0 ? { replaceVisible: [i + 1] } : { addVisible: [i + 1] }),
            setActive: i + 1,
          },
        })),
      }],
      ui: getPptUI(lang, fileTitles[lang] || fileTitles.en),
      loopDelay: 2000,
    }
  }, [lang])

  return <DemoWorkflow config={config} />
}
