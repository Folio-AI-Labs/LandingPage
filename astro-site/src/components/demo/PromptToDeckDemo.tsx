import { useMemo } from 'react'
import DemoWorkflow, { getPptUI } from './DemoWorkflow'
import type { DemoWorkflowConfig } from './DemoWorkflow'
import { evSlides, makeBlankSlide } from './evSlides'

const demoText: Record<string, { prompt: string; ai: string; search: string; tools: string[] }> = {
  en: {
    prompt: "Create an executive summary deck of Air France–KLM's FY2025 consolidated financial statements.",
    ai: "I'll build an executive summary of Air France–KLM's FY2025 results.",
    search: 'Searching "Air France-KLM FY2025 full-year results"',
    tools: [
      'Creating title slide with Air France–KLM branding',
      'Building FY2025 financial highlights with key figures',
      'Adding profitability analysis: EBITDA and net income',
      'Adding asset base deep dive on fleet investment',
      'Adding cash flow and capital-expenditure analysis',
      'Creating risks and key investor takeaways',
    ],
  },
  fr: {
    prompt: 'Crée un deck de synthèse des comptes consolidés FY2025 d\'Air France–KLM.',
    ai: 'Je vais préparer une synthèse des résultats FY2025 d\'Air France–KLM.',
    search: 'Recherche "résultats annuels Air France-KLM FY2025"',
    tools: [
      'Création de la slide titre aux couleurs d\'Air France–KLM',
      'Construction des chiffres clés FY2025',
      'Ajout de l\'analyse de rentabilité : EBITDA et résultat net',
      'Ajout de l\'analyse des actifs et de la flotte',
      'Ajout de l\'analyse des flux de trésorerie et des investissements',
      'Création des risques et messages clés pour les investisseurs',
    ],
  },
  es: {
    prompt: 'Crea un deck de resumen ejecutivo de los estados financieros consolidados FY2025 de Air France–KLM.',
    ai: 'Voy a preparar un resumen ejecutivo de los resultados FY2025 de Air France–KLM.',
    search: 'Buscando "resultados anuales Air France-KLM FY2025"',
    tools: [
      'Creando diapositiva título con la marca Air France–KLM',
      'Construyendo cifras clave de FY2025',
      'Añadiendo análisis de rentabilidad: EBITDA y resultado neto',
      'Añadiendo análisis de activos y flota',
      'Añadiendo análisis de flujo de caja e inversiones',
      'Creando riesgos y conclusiones clave para inversores',
    ],
  },
  de: {
    prompt: 'Erstelle ein Executive-Summary-Deck zum Konzernabschluss FY2025 von Air France–KLM.',
    ai: 'Ich erstelle eine Zusammenfassung der FY2025-Ergebnisse von Air France–KLM.',
    search: 'Suche "Air France-KLM FY2025 Jahresergebnisse"',
    tools: [
      'Titelfolie im Air France–KLM-Design erstellen',
      'FY2025-Kennzahlen erstellen',
      'Profitabilitätsanalyse hinzufügen: EBITDA und Nettoergebnis',
      'Analyse der Vermögenswerte und Flotte hinzufügen',
      'Cashflow- und Investitionsanalyse hinzufügen',
      'Risiken und zentrale Investoren-Erkenntnisse erstellen',
    ],
  },
}

const fileTitles: Record<string, string> = {
  en: 'Air France-KLM FY2025 Results.pptx',
  fr: 'Résultats Air France-KLM FY2025.pptx',
  es: 'Resultados Air France-KLM FY2025.pptx',
  de: 'Air France-KLM FY2025 Ergebnisse.pptx',
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
