import { useState, useEffect, useCallback, useRef } from 'react'
import ChatPanel from './ChatPanel'
import PresentationViewer from './PresentationViewer'
import type { PresentationVariant } from './PresentationViewer'
import type { SlideContent } from './slides'
import './demo-styles.css'
import type { Message, ToolCall, Phase } from './types'

// --- Timing constants (shared across all demos) ---
const CHAR_DELAY = 36
const AI_CHAR_DELAY = 23
const TOOL_RUNNING_TIME = 1170
const PAUSE_SHORT = 325
const FILE_UPLOAD_TIME = 800

// --- Config types ---

export interface SlideUpdate {
  addVisible?: number[]
  replaceVisible?: number[]
  setActive?: number
  replaceSlide?: { at: number; with: number }
}

export interface ToolDef {
  toolName: string
  label: string
  slideUpdate?: SlideUpdate
}

export interface ConversationTurn {
  uploadFile?: string
  prompt: string
  aiResponse: string
  search?: { toolName: string; label: string }
  tools: ToolDef[]
  followup?: string
}

export interface DemoWorkflowConfig {
  allSlides: SlideContent[]
  initialVisible: number[]
  initialActive: number
  turns: ConversationTurn[]
  ui: {
    fileTitle: string
    tabs: string[]
    slideOf: (c: number, t: number) => string
    ready: string
    composerPlaceholder: string
  }
  totalSlideCount?: number
  loopDelay?: number
  variant?: PresentationVariant
}

// --- Shared PPT UI strings per locale ---

interface PptUIStrings {
  tabs: string[]
  slideOf: (c: number, t: number) => string
  ready: string
  composerPlaceholder: string
}

export const defaultPptUI: Record<string, PptUIStrings> = {
  en: {
    tabs: ['Home', 'Insert', 'Design', 'Transitions', 'Slide Show'],
    slideOf: (c, t) => `Slide ${c} of ${t}`,
    ready: 'Ready',
    composerPlaceholder: 'Ask Verso to edit your slides',
  },
  fr: {
    tabs: ['Accueil', 'Insertion', 'Création', 'Transitions', 'Diaporama'],
    slideOf: (c, t) => `Diapositive ${c} sur ${t}`,
    ready: 'Prêt',
    composerPlaceholder: 'Demandez à Verso de modifier vos slides',
  },
  es: {
    tabs: ['Inicio', 'Insertar', 'Diseño', 'Transiciones', 'Presentación con diapositivas'],
    slideOf: (c, t) => `Diapositiva ${c} de ${t}`,
    ready: 'Listo',
    composerPlaceholder: 'Pide a Verso que edite tus diapositivas',
  },
  de: {
    tabs: ['Start', 'Einfügen', 'Entwurf', 'Übergänge', 'Bildschirmpräsentation'],
    slideOf: (c, t) => `Folie ${c} von ${t}`,
    ready: 'Bereit',
    composerPlaceholder: 'Bitten Sie Verso, Ihre Folien zu bearbeiten',
  },
}

export function getPptUI(lang: string, fileTitle: string): DemoWorkflowConfig['ui'] {
  const base = defaultPptUI[lang] || defaultPptUI.en
  return { ...base, fileTitle }
}

// --- Component ---

export default function DemoWorkflow({ config, onComplete }: { config: DemoWorkflowConfig; onComplete?: () => void }) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [composerText, setComposerText] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [toolCalls, setToolCalls] = useState<ToolCall[]>([])
  const [slides, setSlides] = useState<SlideContent[]>(config.allSlides)
  const [visibleSlides, setVisibleSlides] = useState<number[]>(config.initialVisible)
  const [activeSlide, setActiveSlide] = useState(config.initialActive)
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

  const runWorkflow = useCallback(() => {
    clearAllTimeouts()
    setPhase('idle')
    setComposerText('')
    setMessages([])
    setToolCalls([])
    setSlides(config.allSlides)
    setVisibleSlides(config.initialVisible)
    setActiveSlide(config.initialActive)
    setIsRunning(false)
    setChatScale(1.25)
    setUploadedFile(null)

    let elapsed = 500

    // Accumulate all messages across turns
    const allMessages: Message[] = []
    // Track tool call arrays per turn (for inline toolCalls on messages)
    const turnToolArrays: ToolCall[][] = []

    for (let turnIdx = 0; turnIdx < config.turns.length; turnIdx++) {
      const turn = config.turns[turnIdx]
      const turnTools: ToolCall[] = []
      turnToolArrays.push(turnTools)

      // File upload animation
      if (turn.uploadFile) {
        elapsed += 300
        const fileName = turn.uploadFile
        schedule(() => setUploadedFile(fileName), elapsed)
        elapsed += FILE_UPLOAD_TIME + 400
      }

      // If second+ turn, add a pause and reset phase
      if (turnIdx > 0) {
        elapsed += 1500
        schedule(() => { setPhase('idle'); setComposerText('') }, elapsed)
        elapsed += 300
      }

      // Type user prompt
      elapsed += 100
      schedule(() => setPhase('typing'), elapsed)
      for (let i = 1; i <= turn.prompt.length; i++) {
        const ci = i
        const text = turn.prompt
        schedule(() => setComposerText(text.slice(0, ci)), elapsed + i * CHAR_DELAY)
      }
      elapsed += turn.prompt.length * CHAR_DELAY

      // Send message
      elapsed += PAUSE_SHORT
      const userMsg: Message = { role: 'user', text: turn.prompt }
      const userMsgSnapshot = [...allMessages, userMsg]
      schedule(() => {
        setPhase('sent')
        setComposerText('')
        setMessages([...userMsgSnapshot])
        setIsRunning(true)
        setChatScale(1)
      }, elapsed)
      allMessages.push(userMsg)

      // AI response typed character by character
      elapsed += PAUSE_SHORT * 2
      const aiMsg: Message = { role: 'assistant', text: turn.aiResponse, toolCalls: turnTools }
      for (let i = 0; i <= turn.aiResponse.length; i++) {
        const ci = i
        const msgsBefore = [...allMessages]
        schedule(() => {
          setPhase('responding')
          setMessages([...msgsBefore, { ...aiMsg, visibleChars: ci, toolCalls: [...turnTools] }])
        }, elapsed + i * AI_CHAR_DELAY)
      }
      elapsed += turn.aiResponse.length * AI_CHAR_DELAY
      allMessages.push(aiMsg)

      // Optional search tool
      if (turn.search) {
        elapsed += PAUSE_SHORT * 2
        const searchTool = turn.search
        const searchIdx = turnTools.length
        schedule(() => {
          setPhase('tools')
          turnTools.push({ toolName: searchTool.toolName, label: searchTool.label, status: 'running' })
          const msgsCopy = [...allMessages.slice(0, -1), { ...aiMsg, toolCalls: [...turnTools] }]
          setMessages(msgsCopy)
        }, elapsed)
        elapsed += TOOL_RUNNING_TIME / 2
        schedule(() => {
          turnTools[searchIdx].status = 'complete'
          const msgsCopy = [...allMessages.slice(0, -1), { ...aiMsg, toolCalls: [...turnTools] }]
          setMessages(msgsCopy)
        }, elapsed)
        elapsed += PAUSE_SHORT
      }

      // Tool calls
      for (let toolIdx = 0; toolIdx < turn.tools.length; toolIdx++) {
        elapsed += PAUSE_SHORT * 2
        const toolDef = turn.tools[toolIdx]
        const tcIdx = turnTools.length // will be the index after push
        const currentTcIdx = tcIdx
        schedule(() => {
          setPhase('tools')
          turnTools.push({ toolName: toolDef.toolName, label: toolDef.label, status: 'running' })
          const msgsCopy = [...allMessages.slice(0, -1), { ...aiMsg, toolCalls: [...turnTools] }]
          setMessages(msgsCopy)
        }, elapsed)
        elapsed += TOOL_RUNNING_TIME
        const update = toolDef.slideUpdate
        schedule(() => {
          turnTools[currentTcIdx].status = 'complete'
          const msgsCopy = [...allMessages.slice(0, -1), { ...aiMsg, toolCalls: [...turnTools] }]
          setMessages(msgsCopy)

          // Apply slide updates
          if (update) {
            if (update.replaceSlide) {
              const { at, with: withIdx } = update.replaceSlide
              setSlides(prev => {
                const newSlides = [...prev]
                newSlides[at] = config.allSlides[withIdx]
                return newSlides
              })
            }
            if (update.replaceVisible) {
              setVisibleSlides(update.replaceVisible)
            }
            if (update.addVisible) {
              setVisibleSlides(prev => [...prev, ...update.addVisible!])
            }
            if (update.setActive !== undefined) {
              setActiveSlide(update.setActive)
            }
          }
        }, elapsed)
        elapsed += PAUSE_SHORT
      }

      // Optional follow-up message
      if (turn.followup) {
        elapsed += PAUSE_SHORT * 2
        schedule(() => setIsRunning(false), elapsed)
        const followupMsg: Message = { role: 'assistant', text: turn.followup }
        for (let i = 0; i <= turn.followup.length; i++) {
          const ci = i
          const msgsBefore = [...allMessages]
          schedule(() => {
            setMessages([...msgsBefore, { ...followupMsg, visibleChars: ci }])
          }, elapsed + i * AI_CHAR_DELAY)
        }
        elapsed += turn.followup.length * AI_CHAR_DELAY
        allMessages.push(followupMsg)
      }

      // Mark turn done
      elapsed += PAUSE_SHORT
      if (turnIdx === config.turns.length - 1) {
        schedule(() => { setPhase('done'); setIsRunning(false) }, elapsed)
      } else {
        schedule(() => { setPhase('done') }, elapsed)
      }
    }

    // Loop or notify parent
    elapsed += (config.loopDelay ?? 2000)
    if (onComplete) {
      schedule(() => onComplete(), elapsed)
    } else {
      schedule(() => runWorkflow(), elapsed)
    }
  }, [clearAllTimeouts, schedule, config, onComplete])

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
        composerPlaceholder={config.ui.composerPlaceholder}
        uploadedFile={uploadedFile}
      />
    </div>
  )

  return (
    <div aria-hidden="true" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="demo-viewer-outer" style={{ marginTop: '0', position: 'relative', zIndex: 0 }}>
        <div className="demo-viewer-inner">
          <PresentationViewer
            slides={slides}
            visibleSlides={visibleSlides}
            activeSlide={activeSlide}
            sidePanel={chatPanel}
            onSlideClick={handleSlideClick}
            fileTitle={config.ui.fileTitle}
            ribbonTabs={config.ui.tabs}
            statusSlideOf={config.ui.slideOf}
            statusReady={config.ui.ready}
            totalSlideCount={config.totalSlideCount}
            variant={config.variant}
          />
        </div>
      </div>
    </div>
  )
}
