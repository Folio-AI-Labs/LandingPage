import { useEffect, useRef } from 'react'
import { Paperclip, Send, Square } from 'lucide-react'
import ToolCallBubble from './ToolCallBubble'
import type { Message, ToolCall } from './types'

interface ChatPanelProps {
  messages: Message[]
  toolCalls: ToolCall[]
  isTyping: boolean
  composerText: string
  isRunning: boolean
  composerPlaceholder?: string
  uploadedFile?: string | null
}

export default function ChatPanel({ messages, toolCalls, isTyping, composerText, isRunning, composerPlaceholder = 'Ask Folio to edit your slides', uploadedFile }: ChatPanelProps) {
  const threadRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTo({ top: threadRef.current.scrollHeight, behavior: 'smooth' })
    }
  }, [messages, toolCalls, isTyping])

  return (
    <div className="demo-chat flex flex-col flex-1 min-h-0 overflow-hidden relative">
      {/* Folio logo watermark — pinned to the chat window, so it doesn't shift
          when the composer/thread heights change while typing. */}
      {messages.length === 0 && toolCalls.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <img src="/folio_logo.png" alt="" className="w-32 h-32" />
        </div>
      )}

      {/* Thread — matches ThreadPrimitive.Viewport */}
      <div ref={threadRef} className="flex-1 min-h-0 overflow-y-hidden relative">
        {/* padding matches addin: pt-12 on viewport, px-3 py-2 on messages */}
        <div className="pt-4">
          {(() => {
            // If there are legacy toolCalls prop, find where to insert them after first assistant message
            const legacyToolInsertIdx = toolCalls.length > 0
              ? messages.findIndex(m => m.role === 'assistant') + 1
              : -1
            return messages.map((msg, i) => (
              <div key={i}>
                {msg.role === 'user' ? (
                  <div className="flex justify-end py-0.5 px-2">
                    <div className="max-w-[85%] break-words rounded-2xl bg-[hsl(0,0%,95%)] px-2.5 py-1.5 text-[13px] leading-relaxed">
                      {msg.text}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col py-0.5 px-2">
                    <div className="max-w-full break-words text-[13px] leading-relaxed">
                      {msg.visibleChars !== undefined ? msg.text.slice(0, msg.visibleChars) : msg.text}
                    </div>
                  </div>
                )}
                {/* Render tool calls attached to this message */}
                {msg.toolCalls && msg.toolCalls.map((tc, j) => (
                  <div key={`msg-tc-${i}-${j}`} className="px-3 py-px">
                    <ToolCallBubble toolName={tc.toolName} label={tc.label} status={tc.status} />
                  </div>
                ))}
                {/* Legacy: Insert all tool calls after the first assistant message (for backwards compatibility) */}
                {i + 1 === legacyToolInsertIdx && toolCalls.map((tc, j) => (
                  <div key={`tc-${j}`} className="px-3 py-px">
                    <ToolCallBubble toolName={tc.toolName} label={tc.label} status={tc.status} />
                  </div>
                ))}
              </div>
            ))
          })()}

          {/* RunningIndicator: inline-block w-2 h-2 bg-foreground rounded-full animate-blink */}
          {isRunning && (
            <div className="px-2 py-1">
              <span className="inline-block w-2 h-2 bg-[hsl(0,0%,4%)] rounded-full demo-dot-blink" />
            </div>
          )}
        </div>
      </div>

      {/* Composer — matches ComposerPrimitive.Root */}
      <div className="p-2 border-t shrink-0">
        {uploadedFile && (
          <div className="mb-2 px-1">
            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-[hsl(217,91%,97%)] border border-[hsl(217,91%,85%)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[hsl(217,91%,53%)]">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                <circle cx="9" cy="9" r="2"/>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
              </svg>
              <span className="text-[11px] font-medium text-[hsl(217,91%,40%)]">{uploadedFile}</span>
            </div>
          </div>
        )}
        <div className="flex items-center rounded-lg border border-[hsl(217,91%,53%)] shadow-sm bg-white transition-all">
          <button className="ml-1 p-1 text-[hsl(0,0%,46%)] rounded" tabIndex={-1} aria-label="Attach file">
            <Paperclip className="w-4 h-4" />
          </button>
          <div className="flex-grow min-h-[38px] max-h-48 px-1 py-2 text-[13px] text-[hsl(0,0%,4%)]">
            {composerText || (
              <span className="text-[hsl(0,0%,46%)] italic">{composerPlaceholder}</span>
            )}
          </div>
          {isRunning ? (
            <button className="mr-1 flex h-7 w-7 items-center justify-center rounded bg-[hsl(217,91%,53%)] text-white" tabIndex={-1} aria-label="Stop">
              <Square className="w-3.5 h-3.5 fill-current" />
            </button>
          ) : (
            <button className="mr-1 flex h-7 w-7 items-center justify-center text-[hsl(217,91%,53%)] transition-all" tabIndex={-1} aria-label="Send message">
              <Send className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
