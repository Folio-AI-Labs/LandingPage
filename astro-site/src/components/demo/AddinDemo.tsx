import { useState, useEffect, useCallback, useRef } from 'react'
import ChatPanel from './ChatPanel'
import PresentationViewer from './PresentationViewer'
import { defaultSlides, frenchSlide2, makeBlankSlide } from './slides'
import type { SlideContent } from './slides'
import './demo-styles.css'
import type { Message, ToolCall, Phase } from './types'

// --- Workflow content per locale ---
const W1_TOOL_NAMES = ['edit_slide', 'insert_slide', 'insert_slide'] as const

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

// --- Shared constants ---
const CHAR_DELAY = 28
const AI_CHAR_DELAY = 18
const TOOL_RUNNING_TIME = 900
const PAUSE_SHORT = 250

type Workflow = 'create' | 'edit'

const workflowLabels: Record<string, Record<Workflow, string>> = {
  en: { create: 'Create from your template', edit: 'Edit your existing deck' },
  fr: { create: 'Partez de votre template', edit: 'Éditez un deck existant' },
  es: { create: 'Crea desde tu plantilla', edit: 'Edita tu deck existente' },
  de: { create: 'Aus Vorlage erstellen', edit: 'Bestehendes Deck bearbeiten' },
}

const workflowLabelsShort: Record<string, Record<Workflow, string>> = {
  en: { create: 'Start from scratch', edit: 'Edit your deck' },
  fr: { create: 'Partez de zéro', edit: 'Éditez votre deck' },
  es: { create: 'Desde cero', edit: 'Edita tu deck' },
  de: { create: 'Neu erstellen', edit: 'Deck bearbeiten' },
}

// PowerPoint UI chrome translations (real PowerPoint localizations)
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
    fileTitle: 'Oil Market Outlook Q1 2026.pptx',
    tabs: ['Home', 'Insert', 'Design', 'Transitions', 'Slide Show'],
    slideOf: (c, t) => `Slide ${c} of ${t}`,
    ready: 'Ready',
    clickTitle: 'Click to add title',
    clickSubtitle: 'Click to add subtitle',
    composerPlaceholder: 'Ask Verso to edit your slides',
  },
  fr: {
    fileTitle: 'Perspectives Marché Pétrolier T1 2026.pptx',
    tabs: ['Accueil', 'Insertion', 'Création', 'Transitions', 'Diaporama'],
    slideOf: (c, t) => `Diapositive ${c} sur ${t}`,
    ready: 'Prêt',
    clickTitle: 'Cliquez pour ajouter un titre',
    clickSubtitle: 'Cliquez pour ajouter un sous-titre',
    composerPlaceholder: 'Demandez à Verso de modifier vos slides',
  },
  es: {
    fileTitle: 'Perspectivas Mercado Petrolero T1 2026.pptx',
    tabs: ['Inicio', 'Insertar', 'Diseño', 'Transiciones', 'Presentación con diapositivas'],
    slideOf: (c, t) => `Diapositiva ${c} de ${t}`,
    ready: 'Listo',
    clickTitle: 'Haga clic para agregar título',
    clickSubtitle: 'Haga clic para agregar subtítulo',
    composerPlaceholder: 'Pide a Verso que edite tus diapositivas',
  },
  de: {
    fileTitle: 'Ölmarkt-Ausblick Q1 2026.pptx',
    tabs: ['Start', 'Einfügen', 'Entwurf', 'Übergänge', 'Bildschirmpräsentation'],
    slideOf: (c, t) => `Folie ${c} von ${t}`,
    ready: 'Bereit',
    clickTitle: 'Titel durch Klicken hinzufügen',
    clickSubtitle: 'Untertitel durch Klicken hinzufügen',
    composerPlaceholder: 'Bitten Sie Verso, Ihre Folien zu bearbeiten',
  },
}

export default function AddinDemo({ lang = 'en' }: { lang?: string }) {
  const [activeWorkflow, setActiveWorkflow] = useState<Workflow>('create')
  const [phase, setPhase] = useState<Phase>('idle')
  const [composerText, setComposerText] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [toolCalls, setToolCalls] = useState<ToolCall[]>([])
  const [slides, setSlides] = useState<SlideContent[]>(defaultSlides)
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

  const autoplayRef = useRef(false)

  const t = demoText[lang] || demoText.en
  const ui = pptUI[lang] || pptUI.en

  // --- Workflow 1: Create from scratch ---
  const runCreateWorkflow = useCallback(() => {
    clearAllTimeouts()
    setPhase('idle')
    setComposerText('')
    setMessages([])
    setToolCalls([])
    setSlides([makeBlankSlide(ui.clickTitle, ui.clickSubtitle), ...defaultSlides])
    setVisibleSlides([0])
    setActiveSlide(0)
    setIsRunning(false)
    setChatScale(1.25)

    let elapsed = autoplayRef.current ? 100 : 0

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

    // 3 slide inserts (indices 1,2,3 in the slides array — 0 is the blank)
    for (let toolIdx = 0; toolIdx < 3; toolIdx++) {
      elapsed += PAUSE_SHORT * 2
      const tIdx = toolIdx
      const slideIdx = tIdx + 1  // offset past blank slide
      const tcIdx = tIdx + 1
      schedule(() => {
        setPhase('tools')
        setToolCalls(prev => [...prev, { toolName: W1_TOOL_NAMES[tIdx], label: t.w1Tools[tIdx], status: 'running' }])
      }, elapsed)
      elapsed += TOOL_RUNNING_TIME
      schedule(() => {
        setToolCalls(prev => prev.map((tc, i) => i === tcIdx ? { ...tc, status: 'complete' as const } : tc))
        // First insert replaces the blank slide; subsequent ones append
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
    // Auto-switch to edit workflow after a pause
    elapsed += 1500
    schedule(() => { autoplayRef.current = true; setActiveWorkflow('edit') }, elapsed)
  }, [clearAllTimeouts, schedule, t, ui])

  // --- Workflow 2: Edit existing ---
  const runEditWorkflow = useCallback(() => {
    clearAllTimeouts()
    setPhase('idle')
    setComposerText('')
    setMessages([])
    setToolCalls([])
    setSlides(defaultSlides)
    setVisibleSlides([0, 1, 2])
    setActiveSlide(1)
    setIsRunning(false)
    setChatScale(1.25)

    let elapsed = autoplayRef.current ? 100 : 0

    elapsed += 100
    schedule(() => setPhase('typing'), elapsed)
    for (let i = 1; i <= t.w2Prompt.length; i++) {
      const ci = i
      schedule(() => setComposerText(t.w2Prompt.slice(0, ci)), elapsed + i * CHAR_DELAY)
    }
    elapsed += t.w2Prompt.length * CHAR_DELAY

    elapsed += PAUSE_SHORT
    schedule(() => {
      setPhase('sent'); setComposerText(''); setMessages([{ role: 'user', text: t.w2Prompt }])
      setIsRunning(true); setChatScale(1)
    }, elapsed)

    elapsed += PAUSE_SHORT * 2
    for (let i = 0; i <= t.w2Ai.length; i++) {
      const ci = i
      schedule(() => {
        setPhase('responding')
        setMessages([{ role: 'user', text: t.w2Prompt }, { role: 'assistant', text: t.w2Ai, visibleChars: ci }])
      }, elapsed + i * AI_CHAR_DELAY)
    }
    elapsed += t.w2Ai.length * AI_CHAR_DELAY

    // Edit slide tool call
    elapsed += PAUSE_SHORT * 2
    schedule(() => {
      setPhase('tools')
      setToolCalls([{ toolName: 'edit_slide', label: t.w2Tool, status: 'running' }])
    }, elapsed)

    elapsed += TOOL_RUNNING_TIME
    schedule(() => {
      setToolCalls(prev => prev.map(tc => ({ ...tc, status: 'complete' as const })))
      // Swap slide 2 with French version
      setSlides(prev => {
        const updated = [...prev]
        updated[1] = frenchSlide2
        return updated
      })
      setVisibleSlides([0, 1, 2])
      setActiveSlide(1)
    }, elapsed)

    // Follow-up text — appended as a new assistant message
    elapsed += PAUSE_SHORT * 2
    schedule(() => setIsRunning(false), elapsed)
    for (let i = 0; i <= t.w2Followup.length; i++) {
      const ci = i
      schedule(() => {
        setMessages([
          { role: 'user', text: t.w2Prompt },
          { role: 'assistant', text: t.w2Ai },
          { role: 'assistant', text: t.w2Followup, visibleChars: ci },
        ])
      }, elapsed + i * AI_CHAR_DELAY)
    }
    elapsed += t.w2Followup.length * AI_CHAR_DELAY

    elapsed += PAUSE_SHORT
    schedule(() => { setPhase('done') }, elapsed)
    // Auto-switch to create workflow after a pause
    elapsed += 1500
    schedule(() => { autoplayRef.current = true; setActiveWorkflow('create') }, elapsed)
  }, [clearAllTimeouts, schedule, t])

  // Run animation when workflow changes
  useEffect(() => {
    if (activeWorkflow === 'create') runCreateWorkflow()
    else runEditWorkflow()
    return () => clearAllTimeouts()
  }, [activeWorkflow, runCreateWorkflow, runEditWorkflow, clearAllTimeouts])

  const handleSlideClick = useCallback((index: number) => {
    setActiveSlide(index)
  }, [])

  const handleTabSwitch = useCallback((workflow: Workflow) => {
    if (workflow !== activeWorkflow) {
      autoplayRef.current = false
      setActiveWorkflow(workflow)
    }
  }, [activeWorkflow])

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

  const labels = workflowLabels[lang] || workflowLabels.en
  const shortLabels = workflowLabelsShort[lang] || workflowLabelsShort.en
  const workflows: { key: Workflow; label: string; shortLabel: string }[] = [
    { key: 'create', label: labels.create, shortLabel: shortLabels.create },
    { key: 'edit', label: labels.edit, shortLabel: shortLabels.edit },
  ]

  const segmentedControl = (
    <div
      className="demo-segmented-control rounded-full relative flex"
      style={{
        background: 'rgba(160,160,160,0.35)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.25)',
        padding: '3px',
      }}
    >
      {/* Sliding highlight */}
      <div
        className="demo-segmented-highlight absolute rounded-full transition-all duration-300 ease-in-out"
        style={{
          height: 'calc(100% - 6px)',
          top: '3px',
          left: activeWorkflow === 'create' ? '3px' : '50%',
          background: 'rgba(10,10,10,0.85)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        }}
      />
      {workflows.map(({ key, label, shortLabel }) => (
        <button
          key={key}
          onClick={() => handleTabSwitch(key)}
          className="demo-segmented-btn relative z-10 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-300"
          style={{
            color: activeWorkflow === key ? '#fff' : 'rgba(255,255,255,0.85)',
            background: 'transparent',
            border: 'none',
            textAlign: 'center',
          }}
        >
          <span className="demo-label-full">{label}</span>
          <span className="demo-label-short">{shortLabel}</span>
        </button>
      ))}
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
      {/* Segmented control - hidden for auto-loop */}
      {/* <div className="flex justify-center mb-3">
        {segmentedControl}
      </div> */}
      {/* Viewer — scaled down on narrow screens, centered when wide */}
      <div className="demo-viewer-outer" style={{ marginTop: '0', position: 'relative', zIndex: 0 }}>
        <div className="demo-viewer-inner">
          {viewer}
        </div>
      </div>
    </div>
  )
}
