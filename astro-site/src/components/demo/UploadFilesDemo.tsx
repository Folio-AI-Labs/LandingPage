import { useState, useEffect, useCallback, useRef } from 'react'
import ChatPanel from './ChatPanel'
import PresentationViewer from './PresentationViewer'
import { uploadSlides } from './uploadSlides'
import type { SlideContent } from './uploadSlides'
import './demo-styles.css'
import type { Message, ToolCall, Phase } from './types'

// --- Shared constants ---
const CHAR_DELAY = 36
const AI_CHAR_DELAY = 23
const TOOL_RUNNING_TIME = 1170
const PAUSE_SHORT = 325
const FILE_UPLOAD_TIME = 800

const demoText: Record<string, {
  w1Prompt: string; w1Ai: string; w1Tools: string[]
  uploadFileName: string
}> = {
  en: {
    uploadFileName: 'new-logo.png',
    w1Prompt: 'Replace all logos in the deck with the uploaded image.',
    w1Ai: "I'll replace the logos across all slides with your new image.",
    w1Tools: [
      'Processing uploaded logo image',
      'Replacing logo on slide 1',
      'Replacing logo on slide 2',
      'Replacing logo on slide 3',
    ],
  },
  fr: {
    uploadFileName: 'nouveau-logo.png',
    w1Prompt: 'Remplace tous les logos de la présentation par l\'image téléchargée.',
    w1Ai: 'Je vais remplacer les logos sur toutes les slides avec votre nouvelle image.',
    w1Tools: [
      'Traitement de l\'image du logo téléchargé',
      'Remplacement du logo sur la slide 1',
      'Remplacement du logo sur la slide 2',
      'Remplacement du logo sur la slide 3',
    ],
  },
  es: {
    uploadFileName: 'nuevo-logo.png',
    w1Prompt: 'Reemplaza todos los logos en la presentación con la imagen cargada.',
    w1Ai: 'Voy a reemplazar los logos en todas las diapositivas con tu nueva imagen.',
    w1Tools: [
      'Procesando imagen del logo cargado',
      'Reemplazando logo en diapositiva 1',
      'Reemplazando logo en diapositiva 2',
      'Reemplazando logo en diapositiva 3',
    ],
  },
  de: {
    uploadFileName: 'neues-logo.png',
    w1Prompt: 'Ersetze alle Logos in der Präsentation durch das hochgeladene Bild.',
    w1Ai: 'Ich ersetze die Logos auf allen Folien durch Ihr neues Bild.',
    w1Tools: [
      'Verarbeitung des hochgeladenen Logo-Bildes',
      'Ersetzen des Logos auf Folie 1',
      'Ersetzen des Logos auf Folie 2',
      'Ersetzen des Logos auf Folie 3',
    ],
  },
}

const pptUI: Record<string, {
  fileTitle: string
  tabs: string[]
  slideOf: (current: number, total: number) => string
  ready: string
  clickTitle: string
  clickSubtitle: string
  composerPlaceholder: string
}> = {
  en: {
    fileTitle: 'Company Overview.pptx',
    tabs: ['Home', 'Insert', 'Design', 'Transitions', 'Slide Show'],
    slideOf: (c, t) => `Slide ${c} of ${t}`,
    ready: 'Ready',
    clickTitle: 'Click to add title',
    clickSubtitle: 'Click to add subtitle',
    composerPlaceholder: 'Ask Verso to edit your slides',
  },
  fr: {
    fileTitle: 'Présentation Entreprise.pptx',
    tabs: ['Accueil', 'Insertion', 'Création', 'Transitions', 'Diaporama'],
    slideOf: (c, t) => `Diapositive ${c} sur ${t}`,
    ready: 'Prêt',
    clickTitle: 'Cliquez pour ajouter un titre',
    clickSubtitle: 'Cliquez pour ajouter un sous-titre',
    composerPlaceholder: 'Demandez à Verso de modifier vos slides',
  },
  es: {
    fileTitle: 'Presentación Empresa.pptx',
    tabs: ['Inicio', 'Insertar', 'Diseño', 'Transiciones', 'Presentación con diapositivas'],
    slideOf: (c, t) => `Diapositiva ${c} de ${t}`,
    ready: 'Listo',
    clickTitle: 'Haga clic para agregar título',
    clickSubtitle: 'Haga clic para agregar subtítulo',
    composerPlaceholder: 'Pide a Verso que edite tus diapositivas',
  },
  de: {
    fileTitle: 'Unternehmensübersicht.pptx',
    tabs: ['Start', 'Einfügen', 'Entwurf', 'Übergänge', 'Bildschirmpräsentation'],
    slideOf: (c, t) => `Folie ${c} von ${t}`,
    ready: 'Bereit',
    clickTitle: 'Titel durch Klicken hinzufügen',
    clickSubtitle: 'Untertitel durch Klicken hinzufügen',
    composerPlaceholder: 'Bitten Sie Verso, Ihre Folien zu bearbeiten',
  },
}

export default function UploadFilesDemo({ lang = 'en' }: { lang?: string }) {
  const ui = pptUI[lang] || pptUI.en

  const [phase, setPhase] = useState<Phase>('idle')
  const [composerText, setComposerText] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [toolCalls, setToolCalls] = useState<ToolCall[]>([])
  const [slides, setSlides] = useState<SlideContent[]>(uploadSlides)
  const [visibleSlides, setVisibleSlides] = useState<number[]>([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14])
  const [activeSlide, setActiveSlide] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [chatScale, setChatScale] = useState(1.25)
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)

  const timeoutsRef = useRef<number[]>([])

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
  }, [])

  const schedule = useCallback((fn: () => void, delay: number) => {
    const id = window.setTimeout(fn, delay)
    timeoutsRef.current.push(id)
    return id
  }, [])

  const t = demoText[lang] || demoText.en

  const runWorkflow = useCallback(() => {
    clearAllTimeouts()
    setPhase('idle')
    setComposerText('')
    setMessages([])
    setToolCalls([])
    // Use first 15 unique slides from uploadSlides
    setSlides(uploadSlides)
    setVisibleSlides([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14])
    setActiveSlide(0)
    setIsRunning(false)
    setChatScale(1.25)
    setUploadedFile(null)

    const editTools: ToolCall[] = []

    let elapsed = 500

    // Show file upload animation
    elapsed += 300
    schedule(() => {
      setUploadedFile(t.uploadFileName)
    }, elapsed)

    elapsed += FILE_UPLOAD_TIME

    // Start typing the prompt
    elapsed += 400
    schedule(() => setPhase('typing'), elapsed)
    for (let i = 1; i <= t.w1Prompt.length; i++) {
      const ci = i
      schedule(() => setComposerText(t.w1Prompt.slice(0, ci)), elapsed + i * CHAR_DELAY)
    }
    elapsed += t.w1Prompt.length * CHAR_DELAY

    elapsed += PAUSE_SHORT
    schedule(() => {
      setPhase('sent'); setComposerText(''); setMessages([{ role: 'user', text: t.w1Prompt }])
      setIsRunning(true); setChatScale(1)
    }, elapsed)

    elapsed += PAUSE_SHORT * 2
    for (let i = 0; i <= t.w1Ai.length; i++) {
      const ci = i
      schedule(() => {
        setPhase('responding')
        setMessages([{ role: 'user', text: t.w1Prompt }, { role: 'assistant', text: t.w1Ai, visibleChars: ci, toolCalls: editTools }])
      }, elapsed + i * AI_CHAR_DELAY)
    }
    elapsed += t.w1Ai.length * AI_CHAR_DELAY

    // 4 tool calls: process image + replace on 3 slides
    for (let toolIdx = 0; toolIdx < 4; toolIdx++) {
      elapsed += PAUSE_SHORT * 2
      const tIdx = toolIdx
      schedule(() => {
        setPhase('tools')
        editTools.push({ toolName: 'upload_process', label: t.w1Tools[tIdx], status: 'running' })
        setMessages([{ role: 'user', text: t.w1Prompt }, { role: 'assistant', text: t.w1Ai, toolCalls: [...editTools] }])
      }, elapsed)
      elapsed += TOOL_RUNNING_TIME
      schedule(() => {
        editTools[tIdx].status = 'complete'
        setMessages([{ role: 'user', text: t.w1Prompt }, { role: 'assistant', text: t.w1Ai, toolCalls: [...editTools] }])
        // Replace logos progressively on first 3 slides
        if (tIdx === 1) {
          // After replacing slide 0 (title)
          setSlides(prev => {
            const newSlides = [...prev]
            newSlides[0] = uploadSlides[20] // New logo version of title (slide 20)
            return newSlides
          })
        } else if (tIdx === 2) {
          // After replacing slide 1 (mission)
          setSlides(prev => {
            const newSlides = [...prev]
            newSlides[1] = uploadSlides[21] // New logo version of mission (slide 21)
            return newSlides
          })
        } else if (tIdx === 3) {
          // After replacing slide 2 (team)
          setSlides(prev => {
            const newSlides = [...prev]
            newSlides[2] = uploadSlides[22] // New logo version of team (slide 22)
            return newSlides
          })
        }
      }, elapsed)
      elapsed += PAUSE_SHORT
    }

    elapsed += PAUSE_SHORT
    schedule(() => { setPhase('done'); setIsRunning(false) }, elapsed)

    // Loop the animation
    elapsed += 2500
    schedule(() => { runWorkflow() }, elapsed)
  }, [clearAllTimeouts, schedule, t])

  useEffect(() => {
    runWorkflow()
    return () => clearAllTimeouts()
  }, [runWorkflow, clearAllTimeouts])

  const handleSlideClick = useCallback((index: number) => {
    setActiveSlide(index)
  }, [])

  const chatPanel = (
    <div
      className="demo-chat-panel"
      style={{
        transform: `scale(${chatScale})`,
        transformOrigin: 'center',
        transition: 'transform 0.6s ease-out, border-radius 0.6s ease-out, box-shadow 0.6s ease-out',
        height: '100%',
        background: 'white',
        borderRadius: chatScale > 1 ? '12px' : '0',
        border: chatScale > 1 ? '1px solid hsl(0,0%,85%)' : 'none',
        boxShadow: chatScale > 1 ? '0 12px 40px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.1)' : 'none',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column' as const,
      }}
    >
      <div style={{
        background: '#e8e8e8', padding: '3px 10px', fontSize: '11px', fontWeight: 600,
        color: '#555', letterSpacing: '0.3px', fontFamily: 'Inter, sans-serif',
        borderBottom: '1px solid #d5d5d5', flexShrink: 0,
      }}>
        Verso AI
      </div>
      <ChatPanel
        messages={messages}
        toolCalls={toolCalls}
        isTyping={phase === 'typing'}
        composerText={composerText}
        isRunning={isRunning}
        composerPlaceholder={ui.composerPlaceholder}
        uploadedFile={uploadedFile}
      />
    </div>
  )

  const viewer = (
    <PresentationViewer
      slides={slides}
      visibleSlides={visibleSlides}
      activeSlide={activeSlide}
      sidePanel={chatPanel}
      onSlideClick={handleSlideClick}
      fileTitle={ui.fileTitle}
      ribbonTabs={ui.tabs}
      statusSlideOf={ui.slideOf}
      statusReady={ui.ready}
      totalSlideCount={76}
    />
  )

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="demo-viewer-outer" style={{ marginTop: '0', position: 'relative', zIndex: 0 }}>
        <div className="demo-viewer-inner">
          {viewer}
        </div>
      </div>
    </div>
  )
}
