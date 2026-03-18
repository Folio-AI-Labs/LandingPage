import { useState, useEffect, useCallback, useRef } from 'react'
import { RotateCcw } from 'lucide-react'
import ChatPanel from './ChatPanel'
import PresentationViewer, { defaultSlides, type SlideContent } from './PresentationViewer'
import './demo-styles.css'
import type { Message, ToolCall, Phase } from './types'

// --- Workflow 1: Create from scratch ---
const W1_PROMPT = 'Can you make me a 3 slides presentation on the current oil market?'
const W1_AI_TEXT = "I'll create a 3-slide presentation on the current oil market for you."
const W1_TOOL_LABELS = [
  'Inserting title slide — "The Current Oil Market"',
  'Inserting slide — "Supply & Demand Overview"',
  'Inserting slide — "Price Trends & Forecast"',
]

// --- Workflow 2: Edit existing ---
const W2_PROMPT = 'Translate this slide to French'
const W2_AI_TEXT = "I'll translate the current slide to French for you."

const NAVY = '#0C1F3F'
const GOLD = '#C5A55A'

const frenchSlide3: SlideContent = {
  title: 'Tendances des Prix',
  render: () => (
    <div className="flex flex-col h-full" style={{ background: '#FFFFFF', fontFamily: "Calibri, 'Inter', sans-serif" }}>
      <div className="px-6 py-2.5" style={{ background: NAVY }}>
        <h3 className="text-[12px] font-semibold text-white">Tendances des Prix & Prévisions</h3>
      </div>
      <div style={{ height: '2px', background: GOLD }} />
      <div className="flex items-center gap-5 px-6 pt-2.5 pb-1.5">
        <div>
          <div className="text-[5.5px] font-medium uppercase tracking-wider" style={{ color: '#595959' }}>Brent Brut</div>
          <div className="flex items-baseline gap-1">
            <span className="text-[16px] font-bold" style={{ color: NAVY }}>84,30 $</span>
            <span className="text-[6px] font-semibold" style={{ color: '#16A34A' }}>+12,4 % cum. an.</span>
          </div>
        </div>
        <div style={{ width: '1px', height: '22px', background: '#D9D9D9' }} />
        <div>
          <div className="text-[5.5px] font-medium uppercase tracking-wider" style={{ color: '#595959' }}>WTI Brut</div>
          <div className="flex items-baseline gap-1">
            <span className="text-[16px] font-bold" style={{ color: NAVY }}>79,85 $</span>
            <span className="text-[6px] font-semibold" style={{ color: '#16A34A' }}>+9,7 % cum. an.</span>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center px-6 pb-3">
        <svg viewBox="0 0 250 95" className="w-full">
          <rect x="30" y="5" width="205" height="60" fill="#F2F2F2" />
          {[5, 20, 35, 50, 65].map(y => (
            <line key={y} x1="30" y1={y} x2="235" y2={y} stroke="#D9D9D9" strokeWidth="0.5" />
          ))}
          <text x="27" y="8" textAnchor="end" fontSize="5" fill="#595959" fontFamily="Calibri, sans-serif">95 $</text>
          <text x="27" y="23" textAnchor="end" fontSize="5" fill="#595959" fontFamily="Calibri, sans-serif">85 $</text>
          <text x="27" y="38" textAnchor="end" fontSize="5" fill="#595959" fontFamily="Calibri, sans-serif">75 $</text>
          <text x="27" y="53" textAnchor="end" fontSize="5" fill="#595959" fontFamily="Calibri, sans-serif">65 $</text>
          <text x="27" y="68" textAnchor="end" fontSize="5" fill="#595959" fontFamily="Calibri, sans-serif">55 $</text>
          <line x1="30" y1="5" x2="30" y2="65" stroke="#808080" strokeWidth="0.6" />
          <line x1="30" y1="65" x2="235" y2="65" stroke="#808080" strokeWidth="0.6" />
          {[5, 20, 35, 50, 65].map(y => (
            <line key={y} x1="27" y1={y} x2="30" y2={y} stroke="#808080" strokeWidth="0.6" />
          ))}
          <polyline points="47,42 81,45 115,35 149,30 183,22 217,18" fill="none" stroke="#4472C4" strokeWidth="1.5" />
          {[[47,42],[81,45],[115,35],[149,30],[183,22],[217,18]].map(([cx,cy], i) => (
            <rect key={i} x={cx-2} y={cy-2} width="4" height="4" fill="#4472C4" />
          ))}
          <polyline points="47,48 81,50 115,42 149,37 183,30 217,26" fill="none" stroke="#ED7D31" strokeWidth="1.5" />
          {[[47,48],[81,50],[115,42],[149,37],[183,30],[217,26]].map(([cx,cy], i) => (
            <rect key={i} x={cx-2} y={cy-2} width="4" height="4" fill="#ED7D31" />
          ))}
          {['Janv', 'Mars', 'Mai', 'Juil', 'Sept', 'Nov'].map((m, i) => (
            <text key={m} x={47 + i * 34} y="73" textAnchor="middle" fontSize="5" fill="#595959" fontFamily="Calibri, sans-serif">{m}</text>
          ))}
          <line x1="70" y1="83" x2="80" y2="83" stroke="#4472C4" strokeWidth="1.5" />
          <rect x="74" y="81" width="4" height="4" fill="#4472C4" />
          <text x="83" y="85" fontSize="4.5" fill="#595959" fontFamily="Calibri, sans-serif">Brent Brut</text>
          <line x1="120" y1="83" x2="130" y2="83" stroke="#ED7D31" strokeWidth="1.5" />
          <rect x="124" y="81" width="4" height="4" fill="#ED7D31" />
          <text x="133" y="85" fontSize="4.5" fill="#595959" fontFamily="Calibri, sans-serif">WTI Brut</text>
        </svg>
      </div>
    </div>
  ),
}

// --- Shared constants ---
const CHAR_DELAY = 28
const AI_CHAR_DELAY = 18
const TOOL_RUNNING_TIME = 900
const PAUSE_SHORT = 250

type Workflow = 'create' | 'edit'

export default function AddinDemo() {
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

  // --- Workflow 1: Create from scratch ---
  const runCreateWorkflow = useCallback(() => {
    clearAllTimeouts()
    setPhase('idle')
    setComposerText('')
    setMessages([])
    setToolCalls([])
    setSlides(defaultSlides)
    setVisibleSlides([])
    setActiveSlide(0)
    setIsRunning(false)
    setChatScale(1.25)

    let elapsed = 0
    const startAt = Math.floor(W1_PROMPT.length / 2)

    elapsed += 100
    schedule(() => { setPhase('typing'); setComposerText(W1_PROMPT.slice(0, startAt)) }, elapsed)
    elapsed += 200
    for (let i = startAt; i <= W1_PROMPT.length; i++) {
      const ci = i
      schedule(() => setComposerText(W1_PROMPT.slice(0, ci)), elapsed + (i - startAt) * CHAR_DELAY)
    }
    elapsed += (W1_PROMPT.length - startAt) * CHAR_DELAY

    elapsed += PAUSE_SHORT
    schedule(() => {
      setPhase('sent'); setComposerText(''); setMessages([{ role: 'user', text: W1_PROMPT }])
      setIsRunning(true); setChatScale(1)
    }, elapsed)

    elapsed += PAUSE_SHORT * 2
    for (let i = 0; i <= W1_AI_TEXT.length; i++) {
      const ci = i
      schedule(() => {
        setPhase('responding')
        setMessages([{ role: 'user', text: W1_PROMPT }, { role: 'assistant', text: W1_AI_TEXT, visibleChars: ci }])
      }, elapsed + i * AI_CHAR_DELAY)
    }
    elapsed += W1_AI_TEXT.length * AI_CHAR_DELAY

    // Google search
    elapsed += PAUSE_SHORT * 2
    schedule(() => {
      setPhase('tools')
      setToolCalls(prev => [...prev, { toolName: 'google_search', label: 'Searching "current oil market 2026"', status: 'running' }])
    }, elapsed)
    elapsed += TOOL_RUNNING_TIME / 2
    schedule(() => setToolCalls(prev => prev.map((tc, i) => i === 0 ? { ...tc, status: 'complete' as const } : tc)), elapsed)
    elapsed += PAUSE_SHORT

    // 3 slide inserts
    for (let toolIdx = 0; toolIdx < 3; toolIdx++) {
      elapsed += PAUSE_SHORT * 2
      const tIdx = toolIdx
      const tcIdx = tIdx + 1
      schedule(() => {
        setPhase('tools')
        setToolCalls(prev => [...prev, { toolName: 'insert_slide', label: W1_TOOL_LABELS[tIdx], status: 'running' }])
      }, elapsed)
      elapsed += TOOL_RUNNING_TIME
      schedule(() => {
        setToolCalls(prev => prev.map((tc, i) => i === tcIdx ? { ...tc, status: 'complete' as const } : tc))
        setVisibleSlides(prev => [...prev, tIdx])
        setActiveSlide(tIdx)
      }, elapsed)
      elapsed += PAUSE_SHORT
    }

    elapsed += PAUSE_SHORT
    schedule(() => { setPhase('done'); setIsRunning(false) }, elapsed)
  }, [clearAllTimeouts, schedule])

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

    let elapsed = 0
    const startAt = Math.floor(W2_PROMPT.length / 2)

    elapsed += 100
    schedule(() => { setPhase('typing'); setComposerText(W2_PROMPT.slice(0, startAt)) }, elapsed)
    elapsed += 200
    for (let i = startAt; i <= W2_PROMPT.length; i++) {
      const ci = i
      schedule(() => setComposerText(W2_PROMPT.slice(0, ci)), elapsed + (i - startAt) * CHAR_DELAY)
    }
    elapsed += (W2_PROMPT.length - startAt) * CHAR_DELAY

    elapsed += PAUSE_SHORT
    schedule(() => {
      setPhase('sent'); setComposerText(''); setMessages([{ role: 'user', text: W2_PROMPT }])
      setIsRunning(true); setChatScale(1)
    }, elapsed)

    elapsed += PAUSE_SHORT * 2
    for (let i = 0; i <= W2_AI_TEXT.length; i++) {
      const ci = i
      schedule(() => {
        setPhase('responding')
        setMessages([{ role: 'user', text: W2_PROMPT }, { role: 'assistant', text: W2_AI_TEXT, visibleChars: ci }])
      }, elapsed + i * AI_CHAR_DELAY)
    }
    elapsed += W2_AI_TEXT.length * AI_CHAR_DELAY

    // Edit slide tool call
    elapsed += PAUSE_SHORT * 2
    schedule(() => {
      setPhase('tools')
      setToolCalls([{ toolName: 'edit_slide', label: 'Translating slide 2 to French', status: 'running' }])
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

    elapsed += PAUSE_SHORT
    schedule(() => { setPhase('done'); setIsRunning(false) }, elapsed)
  }, [clearAllTimeouts, schedule])

  // Run animation when workflow changes
  useEffect(() => {
    if (activeWorkflow === 'create') runCreateWorkflow()
    else runEditWorkflow()
    return () => clearAllTimeouts()
  }, [activeWorkflow, runCreateWorkflow, runEditWorkflow, clearAllTimeouts])

  const handleSlideClick = useCallback((index: number) => {
    setActiveSlide(index)
  }, [])

  const handleReplay = useCallback(() => {
    if (activeWorkflow === 'create') runCreateWorkflow()
    else runEditWorkflow()
  }, [activeWorkflow, runCreateWorkflow, runEditWorkflow])

  const handleTabSwitch = useCallback((workflow: Workflow) => {
    if (workflow !== activeWorkflow) {
      setActiveWorkflow(workflow)
    }
  }, [activeWorkflow])

  const chatPanel = (
    <div
      style={{
        width: '280px',
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
      />
    </div>
  )

  return (
    <div>
      {/* Tabs + Replay — centered, never cropped */}
      <div className="flex items-center justify-center gap-3 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
        <div className="flex gap-1">
          <button
            onClick={() => handleTabSwitch('create')}
            className="px-4 py-1.5 text-[13px] font-medium rounded-md transition-colors"
            style={{
              background: activeWorkflow === 'create' ? '#1a1a1a' : 'transparent',
              color: activeWorkflow === 'create' ? '#fff' : '#888',
            }}
          >
            Create from scratch
          </button>
          <button
            onClick={() => handleTabSwitch('edit')}
            className="px-4 py-1.5 text-[13px] font-medium rounded-md transition-colors"
            style={{
              background: activeWorkflow === 'edit' ? '#1a1a1a' : 'transparent',
              color: activeWorkflow === 'edit' ? '#fff' : '#888',
            }}
          >
            Edit your presentation
          </button>
        </div>
        {phase === 'done' && (
          <button
            onClick={handleReplay}
            className="flex items-center gap-1.5 text-[12px] text-[#888] hover:text-[#444] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Replay
          </button>
        )}
      </div>

      {/* Viewer — right-aligned, overflows left when narrow */}
      <div style={{ width: '920px', float: 'right', clear: 'both' }}>
          <PresentationViewer
            slides={slides}
            visibleSlides={visibleSlides}
            activeSlide={activeSlide}
            sidePanel={chatPanel}
            onSlideClick={handleSlideClick}
          />
      </div>
    </div>
  )
}
