import { PlusSquare, Search, Sparkles, Check } from 'lucide-react'

const TOOL_ICONS: Record<string, typeof PlusSquare> = {
  insert_slide: PlusSquare,
  google_search: Search,
  edit_slide: Sparkles,
}

interface ToolCallBubbleProps {
  toolName: string
  label: string
  status: 'running' | 'complete'
}

export default function ToolCallBubble({ toolName, label, status }: ToolCallBubbleProps) {
  const isRunning = status === 'running'
  const isComplete = status === 'complete'
  const Icon = TOOL_ICONS[toolName] || PlusSquare

  const bgColor = isComplete
    ? 'bg-[hsl(217,91%,53%,0.12)]'
    : 'bg-[hsl(0,0%,95%)]'
  const textColor = isComplete
    ? 'text-[hsl(217,91%,53%,0.85)]'
    : 'text-[hsl(0,0%,46%)]'
  const borderColor = isComplete
    ? 'border-[hsl(217,91%,53%,0.3)]'
    : 'border-[hsl(0,0%,90%)]'

  return (
    <div className={`rounded-lg border text-[0.85em] my-0.5 ${bgColor} ${textColor} ${borderColor}`}>
      <div className="flex items-center gap-1.5 px-2.5 py-1.5">
        <Icon className="w-[1em] h-[1em] shrink-0" />
        <span className={`truncate ${isRunning ? 'demo-shimmer' : ''}`}>{label}</span>
        <span className="flex-1" />
        {isRunning && (
          <span className="w-[1em] h-[1em] shrink-0 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {isComplete && <Check className="w-[1em] h-[1em] shrink-0" />}
      </div>
    </div>
  )
}
