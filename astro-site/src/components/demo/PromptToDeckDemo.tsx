import { useState, useEffect, useCallback, useRef } from 'react'
import ChatPanel from './ChatPanel'
import PresentationViewer from './PresentationViewer'
import { evSlides, makeBlankSlide } from './evSlides'
import type { SlideContent } from './evSlides'
import './demo-styles.css'
import type { Message, ToolCall, Phase } from './types'

// --- Shared constants ---
const CHAR_DELAY = 36
const AI_CHAR_DELAY = 23
const TOOL_RUNNING_TIME = 1170
const PAUSE_SHORT = 325

const W1_TOOL_NAMES = ['edit_slide', 'insert_slide', 'insert_slide'] as const

const demoText: Record<string, {
  w1Prompt: string; w1Ai: string; w1Search: string; w1Tools: string[]
}> = {
  en: {
    w1Prompt: 'Create a 10-slide presentation on the evolution of the EV market in Japan.',
    w1Ai: "I'll create a presentation on the EV market evolution in Japan.",
    w1Search: 'Searching "EV market evolution Japan 2026"',
    w1Tools: [
      'Creating title slide with company template',
      'Building market evolution timeline with key milestones',
      'Adding financial analysis with charts and projections',
    ],
  },
  fr: {
    w1Prompt: 'Crée une présentation de 10 slides sur l\'évolution du marché des VE au Japon.',
    w1Ai: 'Je vais créer une présentation sur l\'évolution du marché des VE au Japon.',
    w1Search: 'Recherche "évolution marché VE Japon 2026"',
    w1Tools: [
      'Création de la slide titre avec le template entreprise',
      'Construction de la chronologie du marché avec jalons clés',
      'Ajout de l\'analyse financière avec graphiques et projections',
    ],
  },
  es: {
    w1Prompt: 'Crea una presentación de 10 diapositivas sobre la evolución del mercado de VE en Japón.',
    w1Ai: 'Voy a crear una presentación sobre la evolución del mercado de VE en Japón.',
    w1Search: 'Buscando "evolución mercado VE Japón 2026"',
    w1Tools: [
      'Creando diapositiva título con plantilla corporativa',
      'Construyendo cronología del mercado con hitos clave',
      'Añadiendo análisis financiero con gráficos y proyecciones',
    ],
  },
  de: {
    w1Prompt: 'Erstelle eine 10-Folien-Präsentation über die Entwicklung des EV-Marktes in Japan.',
    w1Ai: 'Ich erstelle eine Präsentation über die EV-Marktentwicklung in Japan.',
    w1Search: 'Suche "EV-Marktentwicklung Japan 2026"',
    w1Tools: [
      'Titelfolie mit Unternehmensvorlage erstellen',
      'Marktentwicklungs-Zeitstrahl mit Meilensteinen erstellen',
      'Finanzanalyse mit Diagrammen und Prognosen hinzufügen',
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
    fileTitle: 'EV Market Evolution Japan.pptx',
    tabs: ['Home', 'Insert', 'Design', 'Transitions', 'Slide Show'],
    slideOf: (c, t) => `Slide ${c} of ${t}`,
    ready: 'Ready',
    clickTitle: 'Click to add title',
    clickSubtitle: 'Click to add subtitle',
    composerPlaceholder: 'Ask Verso to edit your slides',
  },
  fr: {
    fileTitle: 'Évolution Marché VE Japon.pptx',
    tabs: ['Accueil', 'Insertion', 'Création', 'Transitions', 'Diaporama'],
    slideOf: (c, t) => `Diapositive ${c} sur ${t}`,
    ready: 'Prêt',
    clickTitle: 'Cliquez pour ajouter un titre',
    clickSubtitle: 'Cliquez pour ajouter un sous-titre',
    composerPlaceholder: 'Demandez à Verso de modifier vos slides',
  },
  es: {
    fileTitle: 'Evolución Mercado VE Japón.pptx',
    tabs: ['Inicio', 'Insertar', 'Diseño', 'Transiciones', 'Presentación con diapositivas'],
    slideOf: (c, t) => `Diapositiva ${c} de ${t}`,
    ready: 'Listo',
    clickTitle: 'Haga clic para agregar título',
    clickSubtitle: 'Haga clic para agregar subtítulo',
    composerPlaceholder: 'Pide a Verso que edite tus diapositivas',
  },
  de: {
    fileTitle: 'EV-Marktentwicklung Japan.pptx',
    tabs: ['Start', 'Einfügen', 'Entwurf', 'Übergänge', 'Bildschirmpräsentation'],
    slideOf: (c, t) => `Folie ${c} von ${t}`,
    ready: 'Bereit',
    clickTitle: 'Titel durch Klicken hinzufügen',
    clickSubtitle: 'Untertitel durch Klicken hinzufügen',
    composerPlaceholder: 'Bitten Sie Verso, Ihre Folien zu bearbeiten',
  },
}

export default function PromptToDeckDemo({ lang = 'en' }: { lang?: string }) {
  const ui = pptUI[lang] || pptUI.en

  const [phase, setPhase] = useState<Phase>('idle')
  const [composerText, setComposerText] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [toolCalls, setToolCalls] = useState<ToolCall[]>([])
  const [slides, setSlides] = useState<SlideContent[]>(() => {
    const allSlides = [makeBlankSlide(ui.clickTitle, ui.clickSubtitle)]
    // Add the 3 unique slides twice to make 6 slides total
    for (let i = 0; i < 6; i++) {
      allSlides.push(evSlides[i % evSlides.length])
    }
    return allSlides
  })
  const [visibleSlides, setVisibleSlides] = useState<number[]>([])
  const [activeSlide, setActiveSlide] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [chatScale, setChatScale] = useState(1.25)

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
    // Create array with blank slide + 3 unique slides twice to make 6 total slides
    const allSlides = [makeBlankSlide(ui.clickTitle, ui.clickSubtitle)]
    for (let i = 0; i < 6; i++) {
      allSlides.push(evSlides[i % evSlides.length])
    }
    setSlides(allSlides)
    setVisibleSlides([0])
    setActiveSlide(0)
    setIsRunning(false)
    setChatScale(1.25)

    let elapsed = 500

    elapsed += 100
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
        setMessages([{ role: 'user', text: t.w1Prompt }, { role: 'assistant', text: t.w1Ai, visibleChars: ci }])
      }, elapsed + i * AI_CHAR_DELAY)
    }
    elapsed += t.w1Ai.length * AI_CHAR_DELAY

    // Google search
    elapsed += PAUSE_SHORT * 2
    schedule(() => {
      setPhase('tools')
      setToolCalls(prev => [...prev, { toolName: 'google_search', label: t.w1Search, status: 'running' }])
    }, elapsed)
    elapsed += TOOL_RUNNING_TIME / 2
    schedule(() => setToolCalls(prev => prev.map((tc, i) => i === 0 ? { ...tc, status: 'complete' as const } : tc)), elapsed)
    elapsed += PAUSE_SHORT

    // 6 slide inserts (indices 1-6 in the slides array — 0 is the blank)
    // Slide titles: Title, Market Timeline, Financial Analysis, Consumer Trends, Technology Roadmap, Market Outlook
    // Updated with descriptive labels instead of generic "Creating slide X"
    const slideLabels = [
      t.w1Tools[0],  // Use first custom label
      t.w1Tools[1],  // Use second custom label
      t.w1Tools[2],  // Use third custom label
      'Adding consumer adoption insights',
      'Building technology innovation roadmap',
      'Creating strategic outlook and recommendations',
    ]
    for (let toolIdx = 0; toolIdx < 6; toolIdx++) {
      elapsed += PAUSE_SHORT * 2
      const tIdx = toolIdx
      const slideIdx = tIdx + 1  // offset past blank slide
      const tcIdx = tIdx + 1
      const toolLabel = slideLabels[tIdx]
      schedule(() => {
        setPhase('tools')
        setToolCalls(prev => [...prev, { toolName: 'insert_slide', label: toolLabel, status: 'running' }])
      }, elapsed)
      elapsed += TOOL_RUNNING_TIME
      schedule(() => {
        setToolCalls(prev => prev.map((tc, i) => i === tcIdx ? { ...tc, status: 'complete' as const } : tc))
        if (tIdx === 0) {
          setVisibleSlides([slideIdx])
        } else {
          setVisibleSlides(prev => [...prev, slideIdx])
        }
        setActiveSlide(slideIdx)
      }, elapsed)
      elapsed += PAUSE_SHORT
    }

    elapsed += PAUSE_SHORT
    schedule(() => { setPhase('done'); setIsRunning(false) }, elapsed)

    // Loop the animation
    elapsed += 2000
    schedule(() => { runWorkflow() }, elapsed)
  }, [clearAllTimeouts, schedule, t, ui])

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
