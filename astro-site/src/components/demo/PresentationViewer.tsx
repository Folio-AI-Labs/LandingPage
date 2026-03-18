const NAVY = '#0C1F3F'
const GOLD = '#C5A55A'
const SLATE = '#64748B'

interface SlideContent {
  title: string
  render: () => React.ReactNode
}

const slides: SlideContent[] = [
  {
    title: 'Title Slide',
    render: () => (
      <div className="flex flex-col justify-between h-full" style={{ background: NAVY, fontFamily: "Calibri, 'Inter', sans-serif" }}>
        {/* Top accent strip */}
        <div style={{ height: '3px', background: `linear-gradient(90deg, ${GOLD}, ${GOLD}80, transparent)` }} />
        {/* Center content */}
        <div className="flex flex-col items-start px-8">
          <div className="text-[6px] font-medium tracking-[0.25em] uppercase mb-3" style={{ color: GOLD }}>
            Market Analysis
          </div>
          <h3 className="text-[18px] font-bold text-white mb-1.5 leading-tight" style={{ letterSpacing: '-0.01em' }}>
            The Current<br />Oil Market
          </h3>
          <div className="w-8 mt-2 mb-3" style={{ height: '1.5px', background: GOLD }} />
          <p className="text-[8px] font-normal" style={{ color: '#8CA3C4' }}>
            Outlook & Strategic Positioning — Q1 2026
          </p>
        </div>
        {/* Bottom bar */}
        <div className="flex items-center justify-between px-10 py-3" style={{ borderTop: '1px solid #1A3158' }}>
          <span className="text-[7px] font-medium tracking-wider uppercase" style={{ color: '#4A6A8A' }}>Confidential</span>
          <span className="text-[7px]" style={{ color: '#4A6A8A' }}>March 2026</span>
        </div>
      </div>
    ),
  },
  {
    title: 'Supply & Demand',
    render: () => {
      const boxStyle = { background: '#F2F2F2', border: '1px solid #D9D9D9' }
      return (
      <div className="flex flex-col h-full" style={{ background: '#FFFFFF', fontFamily: "Calibri, 'Inter', sans-serif" }}>
        {/* Navy ribbon with title */}
        <div className="px-5 py-2" style={{ background: NAVY }}>
          <h3 className="text-[11px] font-semibold text-white">Supply & Demand Overview</h3>
        </div>
        <div style={{ height: '2px', background: GOLD }} />
        {/* 3-column layout: info | chart | info */}
        <div className="flex flex-1 px-4 pt-2.5 pb-1.5 gap-2.5 min-h-0">
          {/* Left info column */}
          <div className="flex flex-col gap-1.5 justify-center" style={{ width: '115px', flexShrink: 0 }}>
            <div className="px-2 py-1.5" style={boxStyle}>
              <div className="flex items-center gap-1 mb-0.5">
                <div style={{ width: '4px', height: '4px', background: '#ED7D31' }} />
                <span className="text-[5px] font-semibold" style={{ color: NAVY }}>Global Demand</span>
              </div>
              <span className="text-[10px] font-bold" style={{ color: NAVY }}>104.5M</span>
              <span className="text-[4px] ml-0.5" style={{ color: '#595959' }}>bbl/day</span>
              <div className="text-[4px]" style={{ color: '#16A34A' }}>+0.9M YoY (+0.9%)</div>
            </div>
            <div className="px-2 py-1.5" style={boxStyle}>
              <div className="flex items-center gap-1 mb-0.5">
                <div style={{ width: '4px', height: '4px', background: '#A5A5A5' }} />
                <span className="text-[5px] font-semibold" style={{ color: NAVY }}>US Production</span>
              </div>
              <span className="text-[10px] font-bold" style={{ color: NAVY }}>13.6M</span>
              <span className="text-[4px] ml-0.5" style={{ color: '#595959' }}>bbl/day</span>
              <div className="text-[4px]" style={{ color: '#595959' }}>Plateau amid capex discipline</div>
            </div>
            <div className="px-2 py-1.5" style={boxStyle}>
              <div className="flex items-center gap-1 mb-0.5">
                <div style={{ width: '4px', height: '4px', background: '#70AD47' }} />
                <span className="text-[5px] font-semibold" style={{ color: NAVY }}>Demand Growth</span>
              </div>
              <span className="text-[10px] font-bold" style={{ color: NAVY }}>+0.9M</span>
              <span className="text-[4px] ml-0.5" style={{ color: '#595959' }}>bbl/day</span>
              <div className="text-[4px]" style={{ color: '#595959' }}>Led by Asian refinery expansion</div>
            </div>
          </div>
          {/* Center chart */}
          <div className="flex-1 flex items-center justify-center min-w-0">
            <svg viewBox="0 0 200 140" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
              <rect x="30" y="8" width="155" height="90" fill="#F2F2F2" />
              {[8, 30.5, 53, 75.5, 98].map(y => (
                <line key={y} x1="30" y1={y} x2="185" y2={y} stroke="#D9D9D9" strokeWidth="0.4" />
              ))}
              <text x="27" y="11" textAnchor="end" fontSize="5" fill="#595959" fontFamily="Calibri, sans-serif">108</text>
              <text x="27" y="33" textAnchor="end" fontSize="5" fill="#595959" fontFamily="Calibri, sans-serif">104</text>
              <text x="27" y="56" textAnchor="end" fontSize="5" fill="#595959" fontFamily="Calibri, sans-serif">100</text>
              <text x="27" y="78" textAnchor="end" fontSize="5" fill="#595959" fontFamily="Calibri, sans-serif">96</text>
              <line x1="30" y1="8" x2="30" y2="98" stroke="#808080" strokeWidth="0.5" />
              <line x1="30" y1="98" x2="185" y2="98" stroke="#808080" strokeWidth="0.5" />
              {[8, 30.5, 53, 75.5, 98].map(y => (
                <line key={`t${y}`} x1="27" y1={y} x2="30" y2={y} stroke="#808080" strokeWidth="0.5" />
              ))}
              {/* 2024: Supply 102.8, Demand 103.0 */}
              <rect x="48" y="58.5" width="16" height="39.5" fill="#4472C4" />
              <rect x="66" y="57.4" width="16" height="40.6" fill="#ED7D31" />
              {/* 2025: Supply 104.5, Demand 103.7 */}
              <rect x="98" y="39.2" width="16" height="58.8" fill="#4472C4" />
              <rect x="116" y="48.3" width="16" height="49.7" fill="#ED7D31" />
              {/* 2026E: Supply 106.1, Demand 104.5 */}
              <rect x="148" y="21.3" width="16" height="76.7" fill="#4472C4" />
              <rect x="166" y="39.2" width="16" height="58.8" fill="#ED7D31" />
              {/* Data labels */}
              <text x="56" y="55.5" textAnchor="middle" fontSize="4.5" fill="#595959" fontFamily="Calibri, sans-serif">102.8</text>
              <text x="74" y="54.5" textAnchor="middle" fontSize="4.5" fill="#595959" fontFamily="Calibri, sans-serif">103.0</text>
              <text x="106" y="36" textAnchor="middle" fontSize="4.5" fill="#595959" fontFamily="Calibri, sans-serif">104.5</text>
              <text x="124" y="45" textAnchor="middle" fontSize="4.5" fill="#595959" fontFamily="Calibri, sans-serif">103.7</text>
              <text x="156" y="18" textAnchor="middle" fontSize="4.5" fill="#595959" fontFamily="Calibri, sans-serif">106.1</text>
              <text x="174" y="36" textAnchor="middle" fontSize="4.5" fill="#595959" fontFamily="Calibri, sans-serif">104.5</text>
              {/* Surplus annotation */}
              <line x1="172" y1="39.2" x2="180" y2="30" stroke="#808080" strokeWidth="0.4" strokeDasharray="1.5,1" />
              <text x="181" y="31" fontSize="4" fill="#DC2626" fontFamily="Calibri, sans-serif" fontWeight="600">+1.6M surplus</text>
              {/* Category labels */}
              <text x="65" y="107" textAnchor="middle" fontSize="5.5" fill="#595959" fontFamily="Calibri, sans-serif">2024</text>
              <text x="115" y="107" textAnchor="middle" fontSize="5.5" fill="#595959" fontFamily="Calibri, sans-serif">2025</text>
              <text x="165" y="107" textAnchor="middle" fontSize="5.5" fill="#595959" fontFamily="Calibri, sans-serif">2026E</text>
              {/* Legend */}
              <rect x="55" y="118" width="6" height="6" fill="#4472C4" />
              <text x="64" y="123" fontSize="5" fill="#595959" fontFamily="Calibri, sans-serif">Supply</text>
              <rect x="95" y="118" width="6" height="6" fill="#ED7D31" />
              <text x="104" y="123" fontSize="5" fill="#595959" fontFamily="Calibri, sans-serif">Demand</text>
              <text x="107" y="134" textAnchor="middle" fontSize="4.5" fill="#808080" fontFamily="Calibri, sans-serif">Global Liquids (M bbl/day)</text>
            </svg>
          </div>
          {/* Right info column */}
          <div className="flex flex-col gap-1.5 justify-center" style={{ width: '115px', flexShrink: 0 }}>
            <div className="px-2 py-1.5" style={boxStyle}>
              <div className="flex items-center gap-1 mb-0.5">
                <div style={{ width: '4px', height: '4px', background: '#4472C4' }} />
                <span className="text-[5px] font-semibold" style={{ color: NAVY }}>OPEC+ Output</span>
              </div>
              <span className="text-[10px] font-bold" style={{ color: NAVY }}>+1.2M</span>
              <span className="text-[4px] ml-0.5" style={{ color: '#595959' }}>bbl/day added</span>
              <div className="text-[4px]" style={{ color: '#595959' }}>Unwinding cuts from Apr '26</div>
            </div>
            <div className="px-2 py-1.5" style={boxStyle}>
              <div className="flex items-center gap-1 mb-0.5">
                <div style={{ width: '4px', height: '4px', background: '#70AD47' }} />
                <span className="text-[5px] font-semibold" style={{ color: NAVY }}>Non-OPEC+ Growth</span>
              </div>
              <span className="text-[10px] font-bold" style={{ color: NAVY }}>+1.6M</span>
              <span className="text-[4px] ml-0.5" style={{ color: '#595959' }}>bbl/day</span>
              <div className="text-[4px]" style={{ color: '#595959' }}>US, Brazil, Guyana, Canada</div>
            </div>
            <div className="px-2 py-1.5" style={boxStyle}>
              <div className="flex items-center gap-1 mb-0.5">
                <div style={{ width: '4px', height: '4px', background: '#DC2626' }} />
                <span className="text-[5px] font-semibold" style={{ color: NAVY }}>Inventory Build</span>
              </div>
              <span className="text-[10px] font-bold" style={{ color: NAVY }}>+1.9M</span>
              <span className="text-[4px] ml-0.5" style={{ color: '#595959' }}>bbl/day surplus</span>
              <div className="text-[4px]" style={{ color: '#DC2626' }}>Bearish pressure on prices</div>
            </div>
          </div>
        </div>
        {/* Source */}
        <div className="px-4 pb-1">
          <span className="text-[3.5px]" style={{ color: '#A0A0A0' }}>Source: IEA Oil Market Report, EIA STEO — March 2026</span>
        </div>
      </div>
      )
    },
  },
  {
    title: 'Price Trends',
    render: () => (
      <div className="flex flex-col h-full" style={{ background: '#FFFFFF', fontFamily: "Calibri, 'Inter', sans-serif" }}>
        {/* Navy ribbon with title */}
        <div className="px-6 py-2.5" style={{ background: NAVY }}>
          <h3 className="text-[12px] font-semibold text-white">Price Trends & Forecast</h3>
        </div>
        {/* Gold separator */}
        <div style={{ height: '2px', background: GOLD }} />
        {/* Price callout row */}
        <div className="flex items-center gap-5 px-6 pt-2.5 pb-1.5">
          <div>
            <div className="text-[5.5px] font-medium uppercase tracking-wider" style={{ color: '#595959' }}>Brent Crude</div>
            <div className="flex items-baseline gap-1">
              <span className="text-[16px] font-bold" style={{ color: NAVY }}>$84.30</span>
              <span className="text-[6px] font-semibold" style={{ color: '#16A34A' }}>+12.4% YTD</span>
            </div>
          </div>
          <div style={{ width: '1px', height: '22px', background: '#D9D9D9' }} />
          <div>
            <div className="text-[5.5px] font-medium uppercase tracking-wider" style={{ color: '#595959' }}>WTI Crude</div>
            <div className="flex items-baseline gap-1">
              <span className="text-[16px] font-bold" style={{ color: NAVY }}>$79.85</span>
              <span className="text-[6px] font-semibold" style={{ color: '#16A34A' }}>+9.7% YTD</span>
            </div>
          </div>
        </div>
        {/* Chart */}
        <div className="flex-1 flex items-center justify-center px-6 pb-3">
          <svg viewBox="0 0 250 95" className="w-full">
            {/* Plot area background */}
            <rect x="30" y="5" width="205" height="60" fill="#F2F2F2" />
            {/* Horizontal gridlines */}
            {[5, 20, 35, 50, 65].map(y => (
              <line key={y} x1="30" y1={y} x2="235" y2={y} stroke="#D9D9D9" strokeWidth="0.5" />
            ))}
            {/* Y-axis labels */}
            <text x="27" y="8" textAnchor="end" fontSize="5" fill="#595959" fontFamily="Calibri, sans-serif">$95</text>
            <text x="27" y="23" textAnchor="end" fontSize="5" fill="#595959" fontFamily="Calibri, sans-serif">$85</text>
            <text x="27" y="38" textAnchor="end" fontSize="5" fill="#595959" fontFamily="Calibri, sans-serif">$75</text>
            <text x="27" y="53" textAnchor="end" fontSize="5" fill="#595959" fontFamily="Calibri, sans-serif">$65</text>
            <text x="27" y="68" textAnchor="end" fontSize="5" fill="#595959" fontFamily="Calibri, sans-serif">$55</text>
            {/* Y-axis line */}
            <line x1="30" y1="5" x2="30" y2="65" stroke="#808080" strokeWidth="0.6" />
            {/* X-axis line */}
            <line x1="30" y1="65" x2="235" y2="65" stroke="#808080" strokeWidth="0.6" />
            {/* Tick marks on Y-axis */}
            {[5, 20, 35, 50, 65].map(y => (
              <line key={y} x1="27" y1={y} x2="30" y2={y} stroke="#808080" strokeWidth="0.6" />
            ))}
            {/* Brent line — straight segments between data points */}
            <polyline points="47,42 81,45 115,35 149,30 183,22 217,18" fill="none" stroke="#4472C4" strokeWidth="1.5" />
            {/* Brent markers — small squares */}
            {[[47,42],[81,45],[115,35],[149,30],[183,22],[217,18]].map(([cx,cy], i) => (
              <rect key={i} x={cx-2} y={cy-2} width="4" height="4" fill="#4472C4" />
            ))}
            {/* WTI line */}
            <polyline points="47,48 81,50 115,42 149,37 183,30 217,26" fill="none" stroke="#ED7D31" strokeWidth="1.5" />
            {/* WTI markers — small squares */}
            {[[47,48],[81,50],[115,42],[149,37],[183,30],[217,26]].map(([cx,cy], i) => (
              <rect key={i} x={cx-2} y={cy-2} width="4" height="4" fill="#ED7D31" />
            ))}
            {/* X-axis category labels */}
            {['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'].map((m, i) => (
              <text key={m} x={47 + i * 34} y="73" textAnchor="middle" fontSize="5" fill="#595959" fontFamily="Calibri, sans-serif">{m}</text>
            ))}
            {/* Legend */}
            <line x1="70" y1="83" x2="80" y2="83" stroke="#4472C4" strokeWidth="1.5" />
            <rect x="74" y="81" width="4" height="4" fill="#4472C4" />
            <text x="83" y="85" fontSize="4.5" fill="#595959" fontFamily="Calibri, sans-serif">Brent Crude</text>
            <line x1="120" y1="83" x2="130" y2="83" stroke="#ED7D31" strokeWidth="1.5" />
            <rect x="124" y="81" width="4" height="4" fill="#ED7D31" />
            <text x="133" y="85" fontSize="4.5" fill="#595959" fontFamily="Calibri, sans-serif">WTI Crude</text>
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

function MainSlide({ index }: { index: number }) {
  const slide = slides[index]
  return (
    <div className="demo-slide-in shadow-sm border border-[#e0e0e0] overflow-hidden" style={{ aspectRatio: '16 / 9' }}>
      {slide.render()}
    </div>
  )
}

interface PresentationViewerProps {
  visibleSlides: number[]
  activeSlide: number
  sidePanel?: React.ReactNode
  onSlideClick?: (index: number) => void
}

export default function PresentationViewer({ visibleSlides, activeSlide, sidePanel, onSlideClick }: PresentationViewerProps) {
  return (
    <div className="flex flex-col border border-[#d5d5d5] shadow-lg bg-[#f5f5f5]"
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
            <div
              key={idx}
              className="flex gap-1.5 items-start"
              style={{ cursor: onSlideClick ? 'pointer' : 'default' }}
              onClick={() => onSlideClick?.(idx)}
            >
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
