import { useMemo } from 'react'
import DemoWorkflow, { getPptUI } from './DemoWorkflow'
import type { DemoWorkflowConfig } from './DemoWorkflow'
import { editSlides } from './editSlides'

const demoText: Record<string, {
  w1Prompt: string; w1Ai: string; w1Tools: string[]
  w2Prompt: string; w2Ai: string; w2Tools: string[]
}> = {
  en: {
    w1Prompt: 'Rework slide 3 to show how companies structure AI governance: centralized versus hybrid.',
    w1Ai: "I'll rebuild slide 3 around the governance centralization pattern.",
    w1Tools: [
      'Analyzing current slide 3 structure',
      'Rebuilding slide 3 around the governance model',
    ],
    w2Prompt: 'Now refocus slide 3 on the value question: business-unit gains versus enterprise EBIT.',
    w2Ai: "I'll refocus slide 3 on where gains appear and why EBIT lags.",
    w2Tools: [
      'Reviewing the slide content',
      'Rebuilding slide 3 around the EBIT value story',
    ],
  },
  fr: {
    w1Prompt: 'Retravaille la slide 3 pour montrer comment les entreprises structurent la gouvernance de l\'IA : centralisée ou hybride.',
    w1Ai: 'Je vais reconstruire la slide 3 autour du modèle de gouvernance.',
    w1Tools: [
      'Analyse de la structure actuelle de la slide 3',
      'Reconstruction de la slide 3 autour du modèle de gouvernance',
    ],
    w2Prompt: 'Maintenant recentre la slide 3 sur la valeur : gains des unités contre EBIT de l\'entreprise.',
    w2Ai: 'Je vais recentrer la slide 3 sur les gains locaux et le retard de l\'EBIT.',
    w2Tools: [
      'Revue du contenu de la slide',
      'Reconstruction de la slide 3 autour de la création de valeur',
    ],
  },
  es: {
    w1Prompt: 'Reelabora la diapositiva 3 para mostrar cómo las empresas estructuran la gobernanza de la IA: centralizada o híbrida.',
    w1Ai: 'Voy a reconstruir la diapositiva 3 en torno al modelo de gobernanza.',
    w1Tools: [
      'Analizando estructura actual de diapositiva 3',
      'Reconstruyendo la diapositiva 3 en torno al modelo de gobernanza',
    ],
    w2Prompt: 'Ahora reenfoca la diapositiva 3 en el valor: ganancias de las unidades frente al EBIT de la empresa.',
    w2Ai: 'Voy a reenfocar la diapositiva 3 en las ganancias locales y el rezago del EBIT.',
    w2Tools: [
      'Revisando el contenido de la diapositiva',
      'Reconstruyendo la diapositiva 3 en torno a la historia de valor',
    ],
  },
  de: {
    w1Prompt: 'Überarbeite Folie 3, um zu zeigen, wie Unternehmen ihre KI-Governance strukturieren: zentralisiert oder hybrid.',
    w1Ai: 'Ich baue Folie 3 rund um das Governance-Modell neu auf.',
    w1Tools: [
      'Analyse der aktuellen Struktur von Folie 3',
      'Neuaufbau von Folie 3 rund um das Governance-Modell',
    ],
    w2Prompt: 'Richte Folie 3 nun auf die Wertfrage aus: Gewinne der Einheiten gegenüber dem EBIT des Unternehmens.',
    w2Ai: 'Ich richte Folie 3 auf lokale Gewinne und den EBIT-Rückstand aus.',
    w2Tools: [
      'Überprüfung des Folieninhalts',
      'Neuaufbau von Folie 3 rund um die Wertstory',
    ],
  },
}

const fileTitles: Record<string, string> = {
  en: 'State of AI - McKinsey.pptx',
  fr: 'État de l\'IA - McKinsey.pptx',
  es: 'Estado de la IA - McKinsey.pptx',
  de: 'Stand der KI - McKinsey.pptx',
}

// Rail of 6 slides. Pages 4 & 5 (indices 3, 4) are held back so the edited
// "slide 3" can morph into them without any thumbnail appearing twice.
const initialRail = [0, 1, 2, 5, 6, 7]

export default function EditDeckDemo({ lang = 'en' }: { lang?: string }) {
  const config = useMemo((): DemoWorkflowConfig => {
    const t = demoText[lang] || demoText.en
    return {
      allSlides: editSlides,
      initialVisible: initialRail,
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
      totalSlideCount: 6,
      loopDelay: 2000,
    }
  }, [lang])

  return <DemoWorkflow config={config} />
}
