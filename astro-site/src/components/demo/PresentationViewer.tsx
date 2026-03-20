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
}

export default function PresentationViewer({ slides: slideData, visibleSlides, activeSlide, sidePanel, onSlideClick }: PresentationViewerProps) {
  return (
    <div className="flex flex-col border border-[#d5d5d5] shadow-lg bg-[#f5f5f5]"
      style={{ fontFamily: 'Inter, sans-serif', height: '420px' }}>
      {/* PowerPoint title bar */}
      <div className="px-4 py-1 text-[10px] text-white font-medium tracking-wide" style={{ background: '#B7472A' }}>
        Oil Market Outlook Q1 2026.pptx
      </div>
      {/* Ribbon */}
      <div className="flex items-center gap-4 px-4 py-1.5 bg-[#f0f0f0] border-b border-[#d5d5d5] text-[11px] text-[#888]">
        <span className="font-medium text-[#444]">Home</span>
        <span>Insert</span>
        <span>Design</span>
        <span>Transitions</span>
        <span>Slide Show</span>
      </div>

      {/* Main area */}
      <div className="flex flex-1 min-h-0">
        {/* Thumbnail panel */}
        <div className="w-[90px] shrink-0 bg-[#f0f0f0] border-r border-[#d5d5d5] py-2 pl-2 pr-1 space-y-2 overflow-y-auto">
          {visibleSlides.map((idx, pos) => (
            <div
              key={pos}
              className="flex gap-1.5 items-start"
              style={{ cursor: onSlideClick ? 'pointer' : 'default' }}
              onClick={() => onSlideClick?.(idx)}
            >
              <span className="text-[8px] text-[#aaa] mt-1.5 w-2.5 text-right shrink-0">{pos + 1}</span>
              <div className="flex-1">
                <SlideThumbnail slide={slideData[idx]} isActive={idx === activeSlide} />
              </div>
            </div>
          ))}
        </div>

        {/* Slide canvas */}
        <div className="flex-1 py-3 px-4 flex items-center justify-center bg-[#e8e8e8]">
          {visibleSlides.length > 0 && slideData[activeSlide] ? (
            <div className="w-full max-w-[440px]">
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
      <div className="px-3 py-1 bg-[#f0f0f0] border-t border-[#d5d5d5] text-[10px] text-[#aaa]">
        {visibleSlides.length > 0 ? `Slide ${activeSlide + 1} of ${visibleSlides.length}` : 'Ready'}
      </div>
    </div>
  )
}
