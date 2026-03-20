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
}

export default function ChatPanel({ messages, toolCalls, isTyping, composerText, isRunning }: ChatPanelProps) {
  const threadRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTo({ top: threadRef.current.scrollHeight, behavior: 'smooth' })
    }
  }, [messages, toolCalls, isTyping])

  return (
    <div className="demo-chat flex flex-col flex-1 min-h-0 overflow-hidden">

      {/* Thread — matches ThreadPrimitive.Viewport */}
      <div ref={threadRef} className="flex-1 min-h-0 overflow-y-hidden relative">
        {/* V logo watermark — centered in thread area above composer */}
        {messages.length === 0 && toolCalls.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="10.0000 4.1214 80.0000 69.8179" className="w-20 h-20" style={{ opacity: 0.08 }}>
              <polygon points="12.0000,6.1214 34.0400,6.1214 61.0200,52.8521 50.0000,71.9393" fill="currentColor"/>
              <polygon points="61.4000,6.1214 88.0000,6.1214 74.7000,29.1577" fill="currentColor"/>
            </svg>
          </div>
        )}
        {/* padding matches addin: pt-12 on viewport, px-3 py-2 on messages */}
        <div className="pt-8">
          {messages.map((msg, i) => (
            msg.role === 'user' ? (
              /* UserMessage: flex justify-end py-2 px-3 → max-w-[85%] rounded-2xl bg-muted px-3 py-2 */
              <div key={i} className="flex justify-end py-2 px-3">
                <div className="max-w-[85%] break-words rounded-2xl bg-[hsl(0,0%,95%)] px-3 py-2 text-[13px] leading-relaxed">
                  {msg.text}
                </div>
              </div>
            ) : (
              /* AssistantMessage: flex flex-col py-2 px-3 → max-w-full break-words */
              <div key={i} className="flex flex-col py-2 px-3">
                <div className="max-w-full break-words text-[13px] leading-relaxed">
                  {msg.visibleChars !== undefined ? msg.text.slice(0, msg.visibleChars) : msg.text}
                </div>
              </div>
            )
          ))}

          {/* Tool calls — rendered inside the last assistant message area */}
          {toolCalls.map((tc, i) => (
            <div key={i} className="px-3 py-px">
              <ToolCallBubble toolName={tc.toolName} label={tc.label} status={tc.status} />
            </div>
          ))}

          {/* RunningIndicator: inline-block w-2 h-2 bg-foreground rounded-full animate-blink */}
          {isRunning && (
            <div className="px-3 py-2">
              <span className="inline-block w-2 h-2 bg-[hsl(0,0%,4%)] rounded-full demo-dot-blink" />
            </div>
          )}
        </div>
      </div>

      {/* Composer — matches ComposerPrimitive.Root: flex items-center rounded-lg border */}
      <div className="p-2 border-t shrink-0">
        <div className="flex items-center rounded-lg border border-[hsl(217,91%,53%)] shadow-sm bg-white transition-all">
          <button className="ml-1 p-1 text-[hsl(0,0%,46%)] rounded" tabIndex={-1}>
            <Paperclip className="w-4 h-4" />
          </button>
          <div className="flex-grow min-h-[38px] max-h-48 px-1 py-2 text-[13px] text-[hsl(0,0%,4%)]">
            {composerText || (
              <span className="text-[hsl(0,0%,46%)] italic">Ask Verso to edit your slides</span>
            )}
          </div>
          {isRunning ? (
            <button className="mr-1 flex h-7 w-7 items-center justify-center rounded bg-[hsl(217,91%,53%)] text-white" tabIndex={-1}>
              <Square className="w-3.5 h-3.5 fill-current" />
            </button>
          ) : (
            <button className="mr-1 flex h-7 w-7 items-center justify-center text-[hsl(217,91%,53%)] transition-all" tabIndex={-1}>
              <Send className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
