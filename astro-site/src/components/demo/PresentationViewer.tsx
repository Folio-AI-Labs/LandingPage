const ACCENT = '#2563EB'

interface SlideContent {
  title: string
  render: () => React.ReactNode
}

const slides: SlideContent[] = [
  {
    title: 'Title Slide',
    render: () => (
      <div className="flex flex-col items-center justify-center h-full px-8 text-center">
        <div className="w-16 h-1 mb-6" style={{ background: ACCENT }} />
        <h3 className="text-[18px] font-semibold text-[#1a1a1a] mb-3 font-sans">The Current Oil Market</h3>
        <p className="text-[11px] text-[#666] font-sans">Market Analysis & Outlook 2026</p>
        <div className="w-16 h-1 mt-6" style={{ background: ACCENT }} />
      </div>
    ),
  },
  {
    title: 'Supply & Demand',
    render: () => (
      <div className="flex flex-col h-full px-6 py-5">
        <h3 className="text-[13px] font-semibold text-[#1a1a1a] mb-3 font-sans">Supply & Demand Overview</h3>
        <div className="flex gap-4 flex-1">
          <ul className="text-[9px] text-[#444] space-y-2 flex-1 font-sans leading-relaxed">
            <li className="flex gap-1.5"><span style={{ color: ACCENT }}>•</span> Global demand at 103.5M barrels/day, up 1.2% YoY</li>
            <li className="flex gap-1.5"><span style={{ color: ACCENT }}>•</span> OPEC+ production cuts extended through Q3 2026</li>
            <li className="flex gap-1.5"><span style={{ color: ACCENT }}>•</span> US shale output plateauing at 13.2M barrels/day</li>
          </ul>
          <svg viewBox="0 0 120 80" className="w-[120px] shrink-0">
            <rect x="10" y="16" width="22" height="54" rx="3" fill={ACCENT} opacity={0.8} />
            <rect x="42" y="26" width="22" height="44" rx="3" fill={ACCENT} opacity={0.5} />
            <rect x="74" y="36" width="22" height="34" rx="3" fill={ACCENT} opacity={0.3} />
            <text x="21" y="78" textAnchor="middle" className="text-[6px] fill-[#666]" fontFamily="sans-serif">2024</text>
            <text x="53" y="78" textAnchor="middle" className="text-[6px] fill-[#666]" fontFamily="sans-serif">2025</text>
            <text x="85" y="78" textAnchor="middle" className="text-[6px] fill-[#666]" fontFamily="sans-serif">2026</text>
          </svg>
        </div>
      </div>
    ),
  },
  {
    title: 'Price Trends',
    render: () => (
      <div className="flex flex-col h-full px-6 py-5">
        <h3 className="text-[13px] font-semibold text-[#1a1a1a] mb-3 font-sans">Price Trends & Forecast</h3>
        <div className="flex-1 flex items-center justify-center">
          <svg viewBox="0 0 200 80" className="w-full max-w-[200px]">
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ACCENT} stopOpacity={0.3} />
                <stop offset="100%" stopColor={ACCENT} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <line x1="20" y1="15" x2="190" y2="15" stroke="#e5e5e5" strokeWidth="0.5" />
            <line x1="20" y1="35" x2="190" y2="35" stroke="#e5e5e5" strokeWidth="0.5" />
            <line x1="20" y1="55" x2="190" y2="55" stroke="#e5e5e5" strokeWidth="0.5" />
            <text x="16" y="17" textAnchor="end" className="text-[5px] fill-[#999]" fontFamily="sans-serif">$90</text>
            <text x="16" y="37" textAnchor="end" className="text-[5px] fill-[#999]" fontFamily="sans-serif">$75</text>
            <text x="16" y="57" textAnchor="end" className="text-[5px] fill-[#999]" fontFamily="sans-serif">$60</text>
            <path d="M20,45 Q50,50 80,38 T140,30 T190,25 L190,65 L20,65 Z" fill="url(#areaGrad)" />
            <path d="M20,45 Q50,50 80,38 T140,30 T190,25" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" />
            <circle cx="190" cy="25" r="3" fill={ACCENT} />
            <text x="20" y="73" className="text-[5px] fill-[#999]" fontFamily="sans-serif">Jan</text>
            <text x="62" y="73" className="text-[5px] fill-[#999]" fontFamily="sans-serif">Apr</text>
            <text x="105" y="73" className="text-[5px] fill-[#999]" fontFamily="sans-serif">Jul</text>
            <text x="148" y="73" className="text-[5px] fill-[#999]" fontFamily="sans-serif">Oct</text>
            <text x="183" y="73" className="text-[5px] fill-[#999]" fontFamily="sans-serif">Dec</text>
          </svg>
        </div>
      </div>
    ),
  },
]

function SlideThumbnail({ index, isActive }: { index: number; isActive: boolean }) {
  const slide = slides[index]
  return (
    <div
      className={`demo-scale-in relative cursor-default rounded-sm overflow-hidden border bg-white ${
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

function MainSlide({ index }: { index: number }) {
  const slide = slides[index]
  return (
    <div className="demo-slide-in bg-white rounded shadow-sm border border-[#e0e0e0]" style={{ aspectRatio: '16 / 9' }}>
      {slide.render()}
    </div>
  )
}

interface PresentationViewerProps {
  visibleSlides: number[]
  activeSlide: number
  sidePanel?: React.ReactNode
}

export default function PresentationViewer({ visibleSlides, activeSlide, sidePanel }: PresentationViewerProps) {
  return (
    <div className="flex flex-col rounded-xl border border-[#d5d5d5] shadow-lg bg-[#f5f5f5]"
      style={{ fontFamily: 'Inter, sans-serif', height: '480px' }}>
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
          {visibleSlides.map((idx) => (
            <div key={idx} className="flex gap-1.5 items-start">
              <span className="text-[8px] text-[#aaa] mt-1.5 w-2.5 text-right shrink-0">{idx + 1}</span>
              <div className="flex-1">
                <SlideThumbnail index={idx} isActive={idx === activeSlide} />
              </div>
            </div>
          ))}
        </div>

        {/* Slide canvas */}
        <div className="flex-1 py-6 pr-6 pl-4 flex items-center justify-start bg-[#e8e8e8]">
          {visibleSlides.length > 0 ? (
            <div className="w-full max-w-[520px]">
              <MainSlide key={activeSlide} index={activeSlide} />
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
