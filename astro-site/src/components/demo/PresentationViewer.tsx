import { defaultSlides } from './slides'
import type { SlideContent } from './slides'

export { defaultSlides }
export type { SlideContent }

function SlideThumbnail({ slide, isActive }: { slide: SlideContent; isActive: boolean }) {
  return (
    <div
      className={`demo-scale-in relative cursor-default overflow-hidden border bg-white ${
        isActive ? 'border-[#999] shadow-sm' : 'border-[#d5d5d5]'
      }`}
      style={{ aspectRatio: '16 / 9', width: '100%' }}
    >
      <div className="absolute overflow-hidden" style={{ width: '520px', height: '293px', transform: 'scale(0.115)', transformOrigin: 'top left' }}>
        {slide.render()}
      </div>
    </div>
  )
}

function MainSlide({ slide }: { slide: SlideContent }) {
  return (
    <div className="demo-slide-in shadow-sm border border-[#e0e0e0] overflow-hidden" style={{ aspectRatio: '16 / 9' }}>
      {slide.render()}
    </div>
  )
}

interface PresentationViewerProps {
  slides: SlideContent[]
  visibleSlides: number[]
  activeSlide: number
  sidePanel?: React.ReactNode
  onSlideClick?: (index: number) => void
  fileTitle?: string
  ribbonTabs?: string[]
  statusSlideOf?: (current: number, total: number) => string
  statusReady?: string
  totalSlideCount?: number
}

export default function PresentationViewer({ slides: slideData, visibleSlides, activeSlide, sidePanel, onSlideClick, fileTitle = 'Oil Market Outlook Q1 2026.pptx', ribbonTabs = ['Home', 'Insert', 'Design', 'Transitions', 'Slide Show'], statusSlideOf = (c, t) => `Slide ${c} of ${t}`, statusReady = 'Ready', totalSlideCount }: PresentationViewerProps) {
  return (
    <div className="flex flex-col border border-[#d5d5d5] bg-[#f5f5f5]"
      style={{ fontFamily: 'Inter, sans-serif', height: '420px', boxShadow: '0 8px 40px rgba(0,0,0,0.15), 0 0 20px rgba(0,0,0,0.08)', borderRadius: '8px', overflow: 'visible' }}>
      {/* PowerPoint title bar */}
      <div className="px-4 py-1 text-[10px] text-white font-medium tracking-wide text-center" style={{ background: '#B7472A', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}>
        {fileTitle}
      </div>
      {/* Ribbon */}
      <div className="flex items-center gap-4 px-4 py-1.5 bg-[#f0f0f0] border-b border-[#d5d5d5] text-[11px] text-[#888]">
        {ribbonTabs.map((tab, i) => (
          <span key={tab} className={i === 0 ? 'font-medium text-[#444]' : undefined}>{tab}</span>
        ))}
      </div>

      {/* Main area */}
      <div className="flex flex-1 min-h-0">
        {/* Thumbnail panel */}
        <div className="w-[75px] shrink-0 bg-[#f0f0f0] border-r border-[#d5d5d5] py-2 pl-0.5 pr-1 space-y-2 overflow-hidden">
          {visibleSlides.map((idx, pos) => {
            const slide = slideData[idx]
            if (!slide) return null
            return (
              <div
                key={pos}
                className="flex gap-1.5 items-start"
                style={{ cursor: onSlideClick ? 'pointer' : 'default' }}
                onClick={() => onSlideClick?.(idx)}
              >
                <span className="text-[8px] text-[#aaa] mt-1.5 w-1.5 text-right shrink-0">{pos + 1}</span>
                <div className="flex-1">
                  <SlideThumbnail slide={slide} isActive={idx === activeSlide} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Slide canvas */}
        <div className="flex-1 py-2 px-2 flex items-center justify-center bg-[#e8e8e8]">
          {visibleSlides.length > 0 && slideData[activeSlide] ? (
            <div className="w-full">
              <MainSlide key={activeSlide} slide={slideData[activeSlide]} />
            </div>
          ) : (
            <div className="text-[12px] text-[#bbb]" />
          )}
        </div>

        {/* Addin side panel */}
        {sidePanel && (
          <div className="shrink-0 border-l border-[#d5d5d5]" style={{ overflow: 'visible', zIndex: 20 }}>
            {sidePanel}
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="px-3 py-1 bg-[#f0f0f0] border-t border-[#d5d5d5] text-[10px] text-[#aaa]" style={{ borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px' }}>
        {visibleSlides.length > 0 ? statusSlideOf(visibleSlides.indexOf(activeSlide) + 1, totalSlideCount || visibleSlides.length) : statusReady}
      </div>
    </div>
  )
}
