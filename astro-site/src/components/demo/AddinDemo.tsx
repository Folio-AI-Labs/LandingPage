import { useState, useEffect, useCallback, useRef } from 'react'
import { RotateCcw } from 'lucide-react'
import ChatPanel from './ChatPanel'
import PresentationViewer from './PresentationViewer'
import './demo-styles.css'
import type { Message, ToolCall, Phase } from './types'

const PROMPT_TEXT = 'Can you make me a 3 slides presentation on the current oil market?'
const AI_TEXT = "I'll create a 3-slide presentation on the current oil market for you."

const TOOL_LABELS = [
  'Inserting title slide — "The Current Oil Market"',
  'Inserting slide — "Supply & Demand Overview"',
  'Inserting slide — "Price Trends & Forecast"',
]

const CHAR_DELAY = 28
const AI_CHAR_DELAY = 18
const TOOL_RUNNING_TIME = 900
const PAUSE_SHORT = 250

export default function AddinDemo() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [composerText, setComposerText] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [toolCalls, setToolCalls] = useState<ToolCall[]>([])
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

  const resetState = useCallback(() => {
    clearAllTimeouts()
    setPhase('idle')
    setComposerText('')
    setMessages([])
    setToolCalls([])
    setVisibleSlides([])
    setActiveSlide(0)
    setIsRunning(false)
    setChatScale(1.25)
  }, [clearAllTimeouts])

  const runAnimation = useCallback(() => {
    resetState()
    let elapsed = 0

    // Phase 1: Type in composer (start with first half already visible)
    const startAt = Math.floor(PROMPT_TEXT.length / 2)
    elapsed += 100
    schedule(() => {
      setPhase('typing')
      setComposerText(PROMPT_TEXT.slice(0, startAt))
    }, elapsed)
    elapsed += 200
    for (let i = startAt; i <= PROMPT_TEXT.length; i++) {
      const charIndex = i
      schedule(() => {
        setComposerText(PROMPT_TEXT.slice(0, charIndex))
      }, elapsed + (i - startAt) * CHAR_DELAY)
    }
    elapsed += (PROMPT_TEXT.length - startAt) * CHAR_DELAY

    // Phase 2: Send message + scale chat back down
    elapsed += PAUSE_SHORT
    schedule(() => {
      setPhase('sent')
      setComposerText('')
      setMessages([{ role: 'user', text: PROMPT_TEXT }])
      setIsRunning(true)
      setChatScale(1)
    }, elapsed)

    // Phase 3: AI response char by char
    elapsed += PAUSE_SHORT * 2
    for (let i = 0; i <= AI_TEXT.length; i++) {
      const charIndex = i
      schedule(() => {
        setPhase('responding')
        setMessages([
          { role: 'user', text: PROMPT_TEXT },
          { role: 'assistant', text: AI_TEXT, visibleChars: charIndex },
        ])
      }, elapsed + i * AI_CHAR_DELAY)
    }
    elapsed += AI_TEXT.length * AI_CHAR_DELAY

    // Phase 4a: Google search tool call (no slide appears)
    elapsed += PAUSE_SHORT * 2
    schedule(() => {
      setPhase('tools')
      setToolCalls((prev) => [
        ...prev,
        { toolName: 'google_search', label: 'Searching "current oil market 2026"', status: 'running' },
      ])
    }, elapsed)
    elapsed += TOOL_RUNNING_TIME / 2
    schedule(() => {
      setToolCalls((prev) =>
        prev.map((tc, i) => (i === 0 ? { ...tc, status: 'complete' as const } : tc))
      )
    }, elapsed)
    elapsed += PAUSE_SHORT

    // Phase 4b: Insert slide tool calls
    for (let toolIdx = 0; toolIdx < 3; toolIdx++) {
      elapsed += PAUSE_SHORT * 2
      const tIdx = toolIdx
      const tcIndex = tIdx + 1 // offset by 1 because search is index 0
      schedule(() => {
        setPhase('tools')
        setToolCalls((prev) => [
          ...prev,
          { toolName: 'insert_slide', label: TOOL_LABELS[tIdx], status: 'running' },
        ])
      }, elapsed)

      elapsed += TOOL_RUNNING_TIME
      schedule(() => {
        setToolCalls((prev) =>
          prev.map((tc, i) => (i === tcIndex ? { ...tc, status: 'complete' as const } : tc))
        )
        setVisibleSlides((prev) => [...prev, tIdx])
        setActiveSlide(tIdx)
      }, elapsed)

      elapsed += PAUSE_SHORT
    }

    // Phase 5: Done — stays as-is, no restart
    elapsed += PAUSE_SHORT
    schedule(() => {
      setPhase('done')
      setIsRunning(false)
    }, elapsed)
  }, [resetState, schedule])

  useEffect(() => {
    runAnimation()
    return () => clearAllTimeouts()
  }, [runAnimation, clearAllTimeouts])

  const handleSlideClick = useCallback((index: number) => {
    if (phase === 'done') {
      setActiveSlide(index)
    }
  }, [phase])

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
      {/* Verso AI header ribbon */}
      <div style={{
        background: '#e8e8e8',
        padding: '3px 10px',
        fontSize: '11px',
        fontWeight: 600,
        color: '#555',
        letterSpacing: '0.3px',
        fontFamily: 'Inter, sans-serif',
        borderBottom: '1px solid #d5d5d5',
        flexShrink: 0,
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
    <div className="relative" style={{ width: '920px', margin: '0 auto' }}>
      {/* Replay button — top left */}
      {phase === 'done' && (
        <button
          onClick={runAnimation}
          className="absolute flex items-center gap-1.5 text-[12px] text-[#888] hover:text-[#444] transition-colors"
          style={{ top: '-28px', left: '0', zIndex: 30 }}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Replay
        </button>
      )}
      <PresentationViewer
        visibleSlides={visibleSlides}
        activeSlide={activeSlide}
        sidePanel={chatPanel}
        onSlideClick={phase === 'done' ? handleSlideClick : undefined}
      />
    </div>
  )
}
