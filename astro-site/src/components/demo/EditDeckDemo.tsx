import { useMemo } from 'react'
import DemoWorkflow, { getPptUI } from './DemoWorkflow'
import type { DemoWorkflowConfig } from './DemoWorkflow'
import { editSlides } from './editSlides'

const demoText: Record<string, {
  w1Prompt: string; w1Ai: string; w1Tools: string[]
  w2Prompt: string; w2Ai: string; w2Tools: string[]
}> = {
  en: {
    w1Prompt: 'Rework slide 3 to break the productivity gap into its three root-cause shocks.',
    w1Ai: "I'll restructure slide 3 around the three shocks behind the gap.",
    w1Tools: [
      'Analyzing current slide 3 structure',
      'Rebuilding slide 3 around the three growth shocks',
    ],
    w2Prompt: 'Now refocus slide 3 on the innovation gap, where Europe loses most.',
    w2Ai: "I'll refocus slide 3 on the innovation and scale-up gap.",
    w2Tools: [
      'Reviewing the slide content',
      'Rebuilding slide 3 around the innovation gap',
    ],
  },
  fr: {
    w1Prompt: 'Retravaille la slide 3 pour décomposer l\'écart de productivité en ses trois chocs d\'origine.',
    w1Ai: 'Je vais restructurer la slide 3 autour des trois chocs à l\'origine de l\'écart.',
    w1Tools: [
      'Analyse de la structure actuelle de la slide 3',
      'Reconstruction de la slide 3 autour des trois chocs de croissance',
    ],
    w2Prompt: 'Maintenant recentre la slide 3 sur l\'écart d\'innovation, là où l\'Europe perd le plus.',
    w2Ai: 'Je vais recentrer la slide 3 sur l\'écart d\'innovation et de passage à l\'échelle.',
    w2Tools: [
      'Revue du contenu de la slide',
      'Reconstruction de la slide 3 autour de l\'écart d\'innovation',
    ],
  },
  es: {
    w1Prompt: 'Reelabora la diapositiva 3 para desglosar la brecha de productividad en sus tres choques de origen.',
    w1Ai: 'Voy a reestructurar la diapositiva 3 en torno a los tres choques detrás de la brecha.',
    w1Tools: [
      'Analizando estructura actual de diapositiva 3',
      'Reconstruyendo la diapositiva 3 en torno a los tres choques de crecimiento',
    ],
    w2Prompt: 'Ahora reenfoca la diapositiva 3 en la brecha de innovación, donde Europa pierde más.',
    w2Ai: 'Voy a reenfocar la diapositiva 3 en la brecha de innovación y escalado.',
    w2Tools: [
      'Revisando el contenido de la diapositiva',
      'Reconstruyendo la diapositiva 3 en torno a la brecha de innovación',
    ],
  },
  de: {
    w1Prompt: 'Überarbeite Folie 3, um die Produktivitätslücke in ihre drei Ursachen-Schocks aufzuschlüsseln.',
    w1Ai: 'Ich strukturiere Folie 3 um die drei Schocks hinter der Lücke neu.',
    w1Tools: [
      'Analyse der aktuellen Struktur von Folie 3',
      'Neuaufbau von Folie 3 rund um die drei Wachstumsschocks',
    ],
    w2Prompt: 'Richte Folie 3 nun auf die Innovationslücke aus, wo Europa am meisten verliert.',
    w2Ai: 'Ich richte Folie 3 auf die Innovations- und Scale-up-Lücke aus.',
    w2Tools: [
      'Überprüfung des Folieninhalts',
      'Neuaufbau von Folie 3 rund um die Innovationslücke',
    ],
  },
}

const fileTitles: Record<string, string> = {
  en: 'European Competitiveness — Draghi.pptx',
  fr: 'Compétitivité européenne — Draghi.pptx',
  es: 'Competitividad europea — Draghi.pptx',
  de: 'Europäische Wettbewerbsfähigkeit — Draghi.pptx',
}

// Rail of 8 slides. Pages 4 & 5 (indices 3, 4) are held back so the edited
// "slide 3" can morph into them without any thumbnail appearing twice.
const initialRail = [0, 1, 2, 5, 6, 7, 8, 9]

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
      totalSlideCount: 8,
      loopDelay: 2000,
    }
  }, [lang])

  return <DemoWorkflow config={config} />
}
