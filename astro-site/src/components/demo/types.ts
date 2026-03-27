export interface Message {
  role: 'user' | 'assistant'
  text: string
  visibleChars?: number
  toolCalls?: ToolCall[]
}

export interface ToolCall {
  toolName: string
  label: string
  status: 'running' | 'complete'
}

export interface Slide {
  index: number
  title: string
}

export type Phase = 'idle' | 'typing' | 'sent' | 'responding' | 'tools' | 'done'
