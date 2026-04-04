import { useMemo } from 'react'
import DemoWorkflow, { getPptUI } from './DemoWorkflow'
import type { DemoWorkflowConfig } from './DemoWorkflow'
import { uploadSlides } from './uploadSlides'

const demoText: Record<string, { uploadFileName: string; prompt: string; ai: string; tools: string[] }> = {
  en: {
    uploadFileName: 'new-logo.png',
    prompt: 'Replace all logos in the deck with the uploaded image.',
    ai: "I'll replace the logos across all slides with your new image.",
    tools: [
      'Processing uploaded logo image',
      'Replacing logo on slide 1',
      'Replacing logo on slide 2',
      'Replacing logo on slide 3',
    ],
  },
  fr: {
    uploadFileName: 'nouveau-logo.png',
    prompt: 'Remplace tous les logos de la présentation par l\'image téléchargée.',
    ai: 'Je vais remplacer les logos sur toutes les slides avec votre nouvelle image.',
    tools: [
      'Traitement de l\'image du logo téléchargé',
      'Remplacement du logo sur la slide 1',
      'Remplacement du logo sur la slide 2',
      'Remplacement du logo sur la slide 3',
    ],
  },
  es: {
    uploadFileName: 'nuevo-logo.png',
    prompt: 'Reemplaza todos los logos en la presentación con la imagen cargada.',
    ai: 'Voy a reemplazar los logos en todas las diapositivas con tu nueva imagen.',
    tools: [
      'Procesando imagen del logo cargado',
      'Reemplazando logo en diapositiva 1',
      'Reemplazando logo en diapositiva 2',
      'Reemplazando logo en diapositiva 3',
    ],
  },
  de: {
    uploadFileName: 'neues-logo.png',
    prompt: 'Ersetze alle Logos in der Präsentation durch das hochgeladene Bild.',
    ai: 'Ich ersetze die Logos auf allen Folien durch Ihr neues Bild.',
    tools: [
      'Verarbeitung des hochgeladenen Logo-Bildes',
      'Ersetzen des Logos auf Folie 1',
      'Ersetzen des Logos auf Folie 2',
      'Ersetzen des Logos auf Folie 3',
    ],
  },
}

const fileTitles: Record<string, string> = {
  en: 'Company Overview.pptx',
  fr: 'Présentation Entreprise.pptx',
  es: 'Presentación Empresa.pptx',
  de: 'Unternehmensübersicht.pptx',
}

const visible15 = Array.from({ length: 15 }, (_, i) => i)

// Slide replacement mapping: tool index -> { at, with }
const slideReplacements: Record<number, { at: number; with: number }> = {
  1: { at: 0, with: 20 },
  2: { at: 1, with: 21 },
  3: { at: 2, with: 22 },
}

export default function UploadFilesDemo({ lang = 'en' }: { lang?: string }) {
  const config = useMemo((): DemoWorkflowConfig => {
    const t = demoText[lang] || demoText.en
    return {
      allSlides: uploadSlides,
      initialVisible: visible15,
      initialActive: 0,
      turns: [{
        uploadFile: t.uploadFileName,
        prompt: t.prompt,
        aiResponse: t.ai,
        tools: t.tools.map((label, i) => ({
          toolName: 'upload_process',
          label,
          slideUpdate: slideReplacements[i] ? { replaceSlide: slideReplacements[i] } : undefined,
        })),
      }],
      ui: getPptUI(lang, fileTitles[lang] || fileTitles.en),
      totalSlideCount: 76,
      loopDelay: 2500,
      variant: 'half-bar' as const,
    }
  }, [lang])

  return <DemoWorkflow config={config} />
}
