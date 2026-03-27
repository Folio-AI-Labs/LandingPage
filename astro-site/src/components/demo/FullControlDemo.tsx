import { useState, useEffect, useCallback, useRef } from 'react'
import ChatPanel from './ChatPanel'
import PresentationViewer from './PresentationViewer'
import { controlSlides } from './controlSlides'
import type { SlideContent } from './controlSlides'
import './demo-styles.css'
import type { Message, ToolCall, Phase } from './types'

// --- Shared constants ---
const CHAR_DELAY = 36
const AI_CHAR_DELAY = 23
const TOOL_RUNNING_TIME = 1170
const PAUSE_SHORT = 325

const demoText: Record<string, {
  w1Prompt: string; w1Ai: string; w1Tools: string[]
}> = {
  en: {
    w1Prompt: 'Move the revenue chart to the right side and make all three KPI cards orange.',
    w1Ai: "I'll reposition the chart and update the card colors to orange.",
    w1Tools: [
      'Repositioning revenue chart to right column',
      'Updating KPI card colors to orange theme',
    ],
  },
  fr: {
    w1Prompt: 'Déplace le graphique des revenus vers la droite et rends les trois cartes KPI orange.',
    w1Ai: 'Je vais repositionner le graphique et mettre à jour les couleurs des cartes en orange.',
    w1Tools: [
      'Repositionnement du graphique vers la colonne droite',
      'Mise à jour des couleurs des cartes KPI en orange',
    ],
  },
  es: {
    w1Prompt: 'Mueve el gráfico de ingresos al lado derecho y haz que las tres tarjetas KPI sean naranjas.',
    w1Ai: 'Voy a reposicionar el gráfico y actualizar los colores de las tarjetas a naranja.',
    w1Tools: [
      'Reposicionando gráfico de ingresos a columna derecha',
      'Actualizando colores de tarjetas KPI a tema naranja',
    ],
  },
  de: {
    w1Prompt: 'Verschiebe das Umsatzdiagramm nach rechts und mache alle drei KPI-Karten orange.',
    w1Ai: 'Ich positioniere das Diagramm neu und aktualisiere die Kartenfarben auf Orange.',
    w1Tools: [
      'Neupositionierung des Umsatzdiagramms zur rechten Spalte',
      'Aktualisierung der KPI-Kartenfarben auf Orange-Thema',
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
    fileTitle: 'Q1 Performance Report.pptx',
    tabs: ['Home', 'Insert', 'Design', 'Transitions', 'Slide Show'],
    slideOf: (c, t) => `Slide ${c} of ${t}`,
    ready: 'Ready',
    clickTitle: 'Click to add title',
    clickSubtitle: 'Click to add subtitle',
    composerPlaceholder: 'Ask Verso to edit your slides',
  },
  fr: {
    fileTitle: 'Rapport Performance T1.pptx',
    tabs: ['Accueil', 'Insertion', 'Création', 'Transitions', 'Diaporama'],
    slideOf: (c, t) => `Diapositive ${c} sur ${t}`,
    ready: 'Prêt',
    clickTitle: 'Cliquez pour ajouter un titre',
    clickSubtitle: 'Cliquez pour ajouter un sous-titre',
    composerPlaceholder: 'Demandez à Verso de modifier vos slides',
  },
  es: {
    fileTitle: 'Informe Rendimiento T1.pptx',
    tabs: ['Inicio', 'Insertar', 'Diseño', 'Transiciones', 'Presentación con diapositivas'],
    slideOf: (c, t) => `Diapositiva ${c} de ${t}`,
    ready: 'Listo',
    clickTitle: 'Haga clic para agregar título',
    clickSubtitle: 'Haga clic para agregar subtítulo',
    composerPlaceholder: 'Pide a Verso que edite tus diapositivas',
  },
  de: {
    fileTitle: 'Q1-Leistungsbericht.pptx',
    tabs: ['Start', 'Einfügen', 'Entwurf', 'Übergänge', 'Bildschirmpräsentation'],
    slideOf: (c, t) => `Folie ${c} von ${t}`,
    ready: 'Bereit',
    clickTitle: 'Titel durch Klicken hinzufügen',
    clickSubtitle: 'Untertitel durch Klicken hinzufügen',
    composerPlaceholder: 'Bitten Sie Verso, Ihre Folien zu bearbeiten',
  },
}

export default function FullControlDemo({ lang = 'en' }: { lang?: string }) {
  const ui = pptUI[lang] || pptUI.en

  const [phase, setPhase] = useState<Phase>('idle')
  const [composerText, setComposerText] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [toolCalls, setToolCalls] = useState<ToolCall[]>([])
  const [slides, setSlides] = useState<SlideContent[]>(controlSlides)
  const [visibleSlides, setVisibleSlides] = useState<number[]>([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14])
  const [activeSlide, setActiveSlide] = useState(1)
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
    // Use first 15 unique slides from controlSlides
    setSlides(controlSlides)
    setVisibleSlides([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14])
    setActiveSlide(1)
    setIsRunning(false)
    setChatScale(1.25)

    const editTools: ToolCall[] = []

    let elapsed = 500

    // Start with slide 1 showing (original layout)
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
        setMessages([{ role: 'user', text: t.w1Prompt }, { role: 'assistant', text: t.w1Ai, visibleChars: ci, toolCalls: editTools }])
      }, elapsed + i * AI_CHAR_DELAY)
    }
    elapsed += t.w1Ai.length * AI_CHAR_DELAY

    // 2 tool calls
    for (let toolIdx = 0; toolIdx < 2; toolIdx++) {
      elapsed += PAUSE_SHORT * 2
      const tIdx = toolIdx
      schedule(() => {
        setPhase('tools')
        editTools.push({ toolName: 'modify_objects', label: t.w1Tools[tIdx], status: 'running' })
        setMessages([{ role: 'user', text: t.w1Prompt }, { role: 'assistant', text: t.w1Ai, toolCalls: [...editTools] }])
      }, elapsed)
      elapsed += TOOL_RUNNING_TIME
      schedule(() => {
        editTools[tIdx].status = 'complete'
        setMessages([{ role: 'user', text: t.w1Prompt }, { role: 'assistant', text: t.w1Ai, toolCalls: [...editTools] }])
        // After both tools complete, switch to modified layout (slide at index 1)
        if (tIdx === 1) {
          setSlides(prev => {
            const newSlides = [...prev]
            newSlides[1] = controlSlides[2] // Replace slide 1 with modified version
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
      totalSlideCount={81}
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
