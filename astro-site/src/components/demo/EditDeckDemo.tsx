import { useState, useEffect, useCallback, useRef } from 'react'
import ChatPanel from './ChatPanel'
import PresentationViewer from './PresentationViewer'
import { editSlides, makeBlankSlide } from './editSlides'
import type { SlideContent } from './editSlides'
import './demo-styles.css'
import type { Message, ToolCall, Phase } from './types'

// --- Shared constants ---
const CHAR_DELAY = 36
const AI_CHAR_DELAY = 23
const TOOL_RUNNING_TIME = 1170
const PAUSE_SHORT = 325

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
    fileTitle: 'Tech Market Analysis.pptx',
    tabs: ['Home', 'Insert', 'Design', 'Transitions', 'Slide Show'],
    slideOf: (c, t) => `Slide ${c} of ${t}`,
    ready: 'Ready',
    clickTitle: 'Click to add title',
    clickSubtitle: 'Click to add subtitle',
    composerPlaceholder: 'Ask Verso to edit your slides',
  },
  fr: {
    fileTitle: 'Analyse Marché Tech.pptx',
    tabs: ['Accueil', 'Insertion', 'Création', 'Transitions', 'Diaporama'],
    slideOf: (c, t) => `Diapositive ${c} sur ${t}`,
    ready: 'Prêt',
    clickTitle: 'Cliquez pour ajouter un titre',
    clickSubtitle: 'Cliquez pour ajouter un sous-titre',
    composerPlaceholder: 'Demandez à Verso de modifier vos slides',
  },
  es: {
    fileTitle: 'Análisis Mercado Tech.pptx',
    tabs: ['Inicio', 'Insertar', 'Diseño', 'Transiciones', 'Presentación con diapositivas'],
    slideOf: (c, t) => `Diapositiva ${c} de ${t}`,
    ready: 'Listo',
    clickTitle: 'Haga clic para agregar título',
    clickSubtitle: 'Haga clic para agregar subtítulo',
    composerPlaceholder: 'Pide a Verso que edite tus diapositivas',
  },
  de: {
    fileTitle: 'Tech-Marktanalyse.pptx',
    tabs: ['Start', 'Einfügen', 'Entwurf', 'Übergänge', 'Bildschirmpräsentation'],
    slideOf: (c, t) => `Folie ${c} von ${t}`,
    ready: 'Bereit',
    clickTitle: 'Titel durch Klicken hinzufügen',
    clickSubtitle: 'Untertitel durch Klicken hinzufügen',
    composerPlaceholder: 'Bitten Sie Verso, Ihre Folien zu bearbeiten',
  },
}

export default function EditDeckDemo({ lang = 'en' }: { lang?: string }) {
  const ui = pptUI[lang] || pptUI.en

  const [phase, setPhase] = useState<Phase>('idle')
  const [composerText, setComposerText] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [toolCalls, setToolCalls] = useState<ToolCall[]>([])
  const [slides, setSlides] = useState<SlideContent[]>(editSlides)
  const [visibleSlides, setVisibleSlides] = useState<number[]>([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14])
  const [activeSlide, setActiveSlide] = useState(2)
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
    setToolCalls([]) // Keep this for backwards compatibility but won't use it
    // Use first 15 unique slides from editSlides
    setSlides(editSlides)
    setVisibleSlides([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14])
    setActiveSlide(2)
    setIsRunning(false)
    setChatScale(1.25)

    // Track tool calls for each assistant message
    const firstEditTools: ToolCall[] = []
    const secondEditTools: ToolCall[] = []

    let elapsed = 500

    // === First edit: Add competitive analysis ===
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
        setMessages([{ role: 'user', text: t.w1Prompt }, { role: 'assistant', text: t.w1Ai, visibleChars: ci, toolCalls: firstEditTools }])
      }, elapsed + i * AI_CHAR_DELAY)
    }
    elapsed += t.w1Ai.length * AI_CHAR_DELAY

    // First edit: 2 tool calls
    for (let toolIdx = 0; toolIdx < 2; toolIdx++) {
      elapsed += PAUSE_SHORT * 2
      const tIdx = toolIdx
      schedule(() => {
        setPhase('tools')
        firstEditTools.push({ toolName: 'edit_slide', label: t.w1Tools[tIdx], status: 'running' })
        setMessages([{ role: 'user', text: t.w1Prompt }, { role: 'assistant', text: t.w1Ai, toolCalls: [...firstEditTools] }])
      }, elapsed)
      elapsed += TOOL_RUNNING_TIME
      schedule(() => {
        firstEditTools[tIdx].status = 'complete'
        setMessages([{ role: 'user', text: t.w1Prompt }, { role: 'assistant', text: t.w1Ai, toolCalls: [...firstEditTools] }])
        // Update slide 2 (index 2) to show version with competitive analysis
        if (tIdx === 1) {
          setSlides(prev => {
            const newSlides = [...prev]
            newSlides[2] = editSlides[3] // Switch to version with competitive analysis
            return newSlides
          })
        }
      }, elapsed)
      elapsed += PAUSE_SHORT
    }

    elapsed += PAUSE_SHORT
    schedule(() => { setPhase('done') }, elapsed)

    // === Second edit: Make title more impactful ===
    elapsed += 1500
    schedule(() => { setPhase('idle'); setComposerText('') }, elapsed)

    elapsed += 300
    schedule(() => setPhase('typing'), elapsed)
    for (let i = 1; i <= t.w2Prompt.length; i++) {
      const ci = i
      schedule(() => setComposerText(t.w2Prompt.slice(0, ci)), elapsed + i * CHAR_DELAY)
    }
    elapsed += t.w2Prompt.length * CHAR_DELAY

    elapsed += PAUSE_SHORT
    schedule(() => {
      setPhase('sent'); setComposerText('')
      setMessages([
        { role: 'user', text: t.w1Prompt },
        { role: 'assistant', text: t.w1Ai, toolCalls: [...firstEditTools] },
        { role: 'user', text: t.w2Prompt }
      ])
    }, elapsed)

    elapsed += PAUSE_SHORT * 2
    for (let i = 0; i <= t.w2Ai.length; i++) {
      const ci = i
      schedule(() => {
        setPhase('responding')
        setMessages([
          { role: 'user', text: t.w1Prompt },
          { role: 'assistant', text: t.w1Ai, toolCalls: [...firstEditTools] },
          { role: 'user', text: t.w2Prompt },
          { role: 'assistant', text: t.w2Ai, visibleChars: ci, toolCalls: secondEditTools }
        ])
      }, elapsed + i * AI_CHAR_DELAY)
    }
    elapsed += t.w2Ai.length * AI_CHAR_DELAY

    // Second edit: 2 tool calls
    for (let toolIdx = 0; toolIdx < 2; toolIdx++) {
      elapsed += PAUSE_SHORT * 2
      const tIdx = toolIdx
      schedule(() => {
        setPhase('tools')
        secondEditTools.push({ toolName: 'edit_slide', label: t.w2Tools[tIdx], status: 'running' })
        setMessages([
          { role: 'user', text: t.w1Prompt },
          { role: 'assistant', text: t.w1Ai, toolCalls: [...firstEditTools] },
          { role: 'user', text: t.w2Prompt },
          { role: 'assistant', text: t.w2Ai, toolCalls: [...secondEditTools] }
        ])
      }, elapsed)
      elapsed += TOOL_RUNNING_TIME
      schedule(() => {
        secondEditTools[tIdx].status = 'complete'
        setMessages([
          { role: 'user', text: t.w1Prompt },
          { role: 'assistant', text: t.w1Ai, toolCalls: [...firstEditTools] },
          { role: 'user', text: t.w2Prompt },
          { role: 'assistant', text: t.w2Ai, toolCalls: [...secondEditTools] }
        ])
        // Update slide 2 to final version with enhanced title and growth percentages
        if (tIdx === 1) {
          setSlides(prev => {
            const newSlides = [...prev]
            newSlides[2] = editSlides[4] // Switch to final enhanced version
            return newSlides
          })
        }
      }, elapsed)
      elapsed += PAUSE_SHORT
    }

    elapsed += PAUSE_SHORT
    schedule(() => { setPhase('done'); setIsRunning(false) }, elapsed)

    // Loop the animation
    elapsed += 2000
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
      totalSlideCount={55}
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
