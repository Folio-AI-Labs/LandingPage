import React from 'react'

export interface SlideContent {
  title: string
  render: () => React.ReactNode
}

// Purple theme colors for edit workflow
const PURPLE = '#4A148C'  // Deep purple
const VIOLET = '#7B1FA2'  // Medium purple
const ORCHID = '#AB47BC'  // Light purple
const LAVENDER = '#CE93D8' // Pale purple

export function makeBlankSlide(titlePlaceholder = 'Click to add title', subtitlePlaceholder = 'Click to add subtitle'): SlideContent {
  return {
    title: 'Blank',
    render: () => (
      <div className="flex flex-col justify-center items-center h-full" style={{ background: '#FFFFFF', fontFamily: "Calibri, 'Inter', sans-serif" }}>
        {/* Title placeholder */}
        <div className="flex items-end justify-center" style={{
          width: '70%',
          height: '28%',
          border: '1px dashed #c0c0c0',
          marginBottom: '4px',
          paddingBottom: '6px',
        }}>
          <span className="text-[16px] font-normal" style={{ color: '#a0a0a0' }}>{titlePlaceholder}</span>
        </div>
        {/* Subtitle placeholder */}
        <div className="flex items-start justify-center" style={{
          width: '70%',
          height: '18%',
          border: '1px dashed #c0c0c0',
          paddingTop: '4px',
        }}>
          <span className="text-[10px] font-normal" style={{ color: '#a0a0a0' }}>{subtitlePlaceholder}</span>
        </div>
      </div>
    ),
  }
}

export const editSlides: SlideContent[] = [
  // Slide 0: Title slide
  {
    title: 'Title Slide',
    render: () => (
      <div className="flex flex-col justify-between h-full" style={{ background: PURPLE, fontFamily: "Calibri, 'Inter', sans-serif" }}>
        <div style={{ height: '3px', background: `linear-gradient(90deg, ${ORCHID}, ${ORCHID}80, transparent)` }} />
        <div className="flex flex-col items-start px-8">
          <div className="text-[6px] font-medium tracking-[0.25em] uppercase mb-3" style={{ color: ORCHID }}>
            Technology Sector
          </div>
          <h3 className="text-[18px] font-bold text-white mb-1.5 leading-tight" style={{ letterSpacing: '-0.01em' }}>
            AI Infrastructure<br />Market Overview
          </h3>
          <div className="w-8 mt-2 mb-3" style={{ height: '1.5px', background: ORCHID }} />
          <p className="text-[8px] font-normal" style={{ color: LAVENDER }}>
            Strategic Analysis & Market Positioning — 2026
          </p>
        </div>
        <div className="flex items-center justify-between px-10 py-3" style={{ borderTop: '1px solid #6A1B9A' }}>
          <span className="text-[7px] font-medium tracking-wider uppercase" style={{ color: '#BA68C8' }}>Confidential</span>
          <span className="text-[7px]" style={{ color: '#BA68C8' }}>March 2026</span>
        </div>
      </div>
    ),
  },
  // Slide 1: Market overview
  {
    title: 'Market Overview',
    render: () => (
      <div className="flex flex-col h-full" style={{ background: '#FFFFFF', fontFamily: "Calibri, 'Inter', sans-serif" }}>
        <div className="px-5 py-2" style={{ background: PURPLE }}>
          <h3 className="text-[11px] font-semibold text-white">Global AI Infrastructure Market</h3>
        </div>

        <div className="flex flex-1 px-4 pt-2.5 pb-1.5 gap-3">
          <div className="flex-1">
            <div className="text-[7px] font-bold mb-2" style={{ color: PURPLE }}>Market Highlights</div>
            <div className="space-y-1.5">
              {[
                'Market size reached $285B in 2025, growing 42% YoY',
                'GPU demand exceeding supply by 3:1 ratio',
                'Cloud providers investing $150B+ in infrastructure',
                'Enterprise adoption accelerating across sectors',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <div style={{ width: '3px', height: '3px', background: ORCHID, marginTop: '2px', flexShrink: 0 }} />
                  <span className="text-[5px] leading-[1.4]" style={{ color: '#404040' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
  },
  // Slide 2: Technology trends (BEFORE edit - no competitive section)
  {
    title: 'Technology Trends',
    render: () => (
      <div className="flex flex-col h-full" style={{ background: '#FFFFFF', fontFamily: "Calibri, 'Inter', sans-serif" }}>
        <div className="px-5 py-2" style={{ background: PURPLE }}>
          <h3 className="text-[11px] font-semibold text-white">Key Technology Trends</h3>
        </div>

        <div className="flex flex-1 px-4 pt-2 pb-1 gap-3">
          <div className="flex-1 space-y-2">
            <div>
              <div className="text-[6px] font-bold mb-1" style={{ color: PURPLE }}>Hardware Evolution</div>
              <div className="text-[4.5px] leading-[1.5]" style={{ color: '#404040' }}>
                Next-gen GPUs delivering 5x performance improvements. Custom AI chips emerging from major tech companies. Memory bandwidth becoming critical bottleneck.
              </div>
            </div>
            <div>
              <div className="text-[6px] font-bold mb-1" style={{ color: PURPLE }}>Software Stack</div>
              <div className="text-[4.5px] leading-[1.5]" style={{ color: '#404040' }}>
                Framework consolidation around PyTorch and JAX. Model serving infrastructure maturing. MLOps tools becoming enterprise-grade.
              </div>
            </div>
            <div>
              <div className="text-[6px] font-bold mb-1" style={{ color: PURPLE }}>Cloud Architecture</div>
              <div className="text-[4.5px] leading-[1.5]" style={{ color: '#404040' }}>
                Multi-cloud deployments standard for large models. Edge inference growing for latency-sensitive applications. Hybrid architectures balancing cost and performance.
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  // Slide 3: Technology trends (AFTER first edit - WITH competitive analysis)
  {
    title: 'Technology Trends',
    render: () => (
      <div className="flex flex-col h-full" style={{ background: '#FFFFFF', fontFamily: "Calibri, 'Inter', sans-serif" }}>
        <div className="px-5 py-2" style={{ background: PURPLE }}>
          <h3 className="text-[11px] font-semibold text-white">Key Technology Trends</h3>
        </div>

        <div className="flex flex-1 px-4 pt-2 pb-1 gap-2.5">
          <div className="flex-1 space-y-1.5">
            <div>
              <div className="text-[5.5px] font-bold mb-0.5" style={{ color: PURPLE }}>Hardware Evolution</div>
              <div className="text-[4px] leading-[1.4]" style={{ color: '#404040' }}>
                Next-gen GPUs delivering 5x performance. Custom AI chips from major tech companies. Memory bandwidth critical bottleneck.
              </div>
            </div>
            <div>
              <div className="text-[5.5px] font-bold mb-0.5" style={{ color: PURPLE }}>Software Stack</div>
              <div className="text-[4px] leading-[1.4]" style={{ color: '#404040' }}>
                Framework consolidation around PyTorch/JAX. Model serving maturing. MLOps enterprise-grade.
              </div>
            </div>
          </div>
          <div style={{ width: '1px', background: '#E0E0E0' }} />
          <div className="flex-1">
            <div className="text-[5.5px] font-bold mb-1.5" style={{ color: PURPLE }}>Competitive Landscape</div>
            <div className="space-y-1.5">
              {[
                { company: 'NVIDIA', position: 'Market leader with 80% GPU share' },
                { company: 'Google Cloud', position: 'Custom TPU infrastructure advantage' },
                { company: 'AWS', position: 'Broadest service portfolio and reach' },
                { company: 'Microsoft Azure', position: 'Strong enterprise integration via Office' },
              ].map((item, i) => (
                <div key={i}>
                  <div className="text-[4.5px] font-semibold" style={{ color: VIOLET }}>{item.company}</div>
                  <div className="text-[4px] leading-[1.3]" style={{ color: '#595959' }}>{item.position}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
  },
  // Slide 4: Technology trends (AFTER second edit - enhanced title + growth %)
  {
    title: 'Technology Trends',
    render: () => (
      <div className="flex flex-col h-full" style={{ background: '#FFFFFF', fontFamily: "Calibri, 'Inter', sans-serif" }}>
        <div className="px-5 py-2" style={{ background: PURPLE }}>
          <h3 className="text-[11px] font-semibold text-white">Technology Trends & Competitive Dynamics</h3>
        </div>

        <div className="flex flex-1 px-4 pt-2 pb-1 gap-2.5">
          <div className="flex-1 space-y-1.5">
            <div>
              <div className="text-[5.5px] font-bold mb-0.5" style={{ color: PURPLE }}>Hardware Evolution</div>
              <div className="text-[4px] leading-[1.4]" style={{ color: '#404040' }}>
                Next-gen GPUs delivering 5x performance. Custom AI chips from major tech companies. Memory bandwidth critical bottleneck.
              </div>
            </div>
            <div>
              <div className="text-[5.5px] font-bold mb-0.5" style={{ color: PURPLE }}>Software Stack</div>
              <div className="text-[4px] leading-[1.4]" style={{ color: '#404040' }}>
                Framework consolidation around PyTorch/JAX. Model serving maturing. MLOps enterprise-grade.
              </div>
            </div>
          </div>
          <div style={{ width: '1px', background: '#E0E0E0' }} />
          <div className="flex-1">
            <div className="text-[5.5px] font-bold mb-1.5" style={{ color: PURPLE }}>Competitive Landscape</div>
            <div className="space-y-1.5">
              {[
                { company: 'NVIDIA', position: 'Market leader with 80% GPU share', growth: '+127% YoY' },
                { company: 'Google Cloud', position: 'Custom TPU infrastructure advantage', growth: '+68% YoY' },
                { company: 'AWS', position: 'Broadest service portfolio and reach', growth: '+52% YoY' },
                { company: 'Microsoft Azure', position: 'Strong enterprise integration via Office', growth: '+71% YoY' },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[4.5px] font-semibold" style={{ color: VIOLET }}>{item.company}</span>
                    <span className="text-[3.5px] font-bold" style={{ color: '#66BB6A' }}>{item.growth}</span>
                  </div>
                  <div className="text-[4px] leading-[1.3]" style={{ color: '#595959' }}>{item.position}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
  },
  // Slide 5: Investment Landscape with bar chart
  {
    title: 'Investment Trends',
    render: () => (
      <div className="flex flex-col h-full" style={{ background: '#FFFFFF', fontFamily: "Calibri, 'Inter', sans-serif" }}>
        <div className="px-5 py-2" style={{ background: PURPLE }}>
          <h3 className="text-[11px] font-semibold text-white">AI Infrastructure Investment Landscape</h3>
        </div>

        <div className="flex flex-1 px-4 pt-2.5 pb-1.5 gap-3">
          <div style={{ width: '180px', flexShrink: 0 }}>
            <svg viewBox="0 0 160 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
              <text x="80" y="8" textAnchor="middle" fontSize="5" fontWeight="700" fill={PURPLE} fontFamily="Calibri, sans-serif">Venture Capital Investment ($B)</text>
              {[20, 40, 60, 80].map(y => (
                <line key={y} x1="25" y1={y} x2="155" y2={y} stroke="#E0E0E0" strokeWidth="0.3" />
              ))}
              <line x1="25" y1="20" x2="25" y2="85" stroke="#808080" strokeWidth="0.5" />
              <line x1="25" y1="85" x2="155" y2="85" stroke="#808080" strokeWidth="0.5" />
              <rect x="35" y="65" width="18" height="20" fill={PURPLE} />
              <rect x="60" y="55" width="18" height="30" fill={VIOLET} />
              <rect x="85" y="40" width="18" height="45" fill={ORCHID} />
              <rect x="110" y="28" width="18" height="57" fill={LAVENDER} />
              <text x="44" y="62" textAnchor="middle" fontSize="4" fill="#595959" fontFamily="Calibri, sans-serif">$12B</text>
              <text x="69" y="52" textAnchor="middle" fontSize="4" fill="#595959" fontFamily="Calibri, sans-serif">$18B</text>
              <text x="94" y="37" textAnchor="middle" fontSize="4" fill="#595959" fontFamily="Calibri, sans-serif">$28B</text>
              <text x="119" y="25" textAnchor="middle" fontSize="4" fill="#595959" fontFamily="Calibri, sans-serif">$35B</text>
              <text x="44" y="93" textAnchor="middle" fontSize="4.5" fill="#595959" fontFamily="Calibri, sans-serif">2023</text>
              <text x="69" y="93" textAnchor="middle" fontSize="4.5" fill="#595959" fontFamily="Calibri, sans-serif">2024</text>
              <text x="94" y="93" textAnchor="middle" fontSize="4.5" fill="#595959" fontFamily="Calibri, sans-serif">2025</text>
              <text x="119" y="93" textAnchor="middle" fontSize="4.5" fill="#595959" fontFamily="Calibri, sans-serif">2026E</text>
            </svg>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <div>
              <div className="text-[6px] font-bold mb-1" style={{ color: PURPLE }}>Funding Acceleration</div>
              <div className="text-[4.5px] leading-[1.5]" style={{ color: '#404040' }}>
                AI infrastructure startups raised $35B in 2026, up 25% from 2025. Focus shifting from model development to deployment infrastructure. Enterprise adoption driving B2B investment focus.
              </div>
            </div>
            <div>
              <div className="text-[6px] font-bold mb-1" style={{ color: PURPLE }}>Key Investment Areas</div>
              <div className="text-[4.5px] leading-[1.5]" style={{ color: '#404040' }}>
                GPU-as-a-Service platforms attracting major rounds. MLOps and observability tools seeing strong traction. Edge AI infrastructure emerging as new category.
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  // Slide 6: Market Segments with donut chart
  {
    title: 'Market Segments',
    render: () => (
      <div className="flex flex-col h-full" style={{ background: '#FFFFFF', fontFamily: "Calibri, 'Inter', sans-serif" }}>
        <div className="px-5 py-2" style={{ background: PURPLE }}>
          <h3 className="text-[11px] font-semibold text-white">Market Segmentation & Revenue Distribution</h3>
        </div>

        <div className="flex flex-1 px-4 pt-2.5 pb-1.5 gap-3 items-center">
          <svg viewBox="0 0 90 90" width="75" height="75" className="shrink-0">
            <circle cx="45" cy="45" r="32" fill="none" stroke={PURPLE} strokeWidth="14"
              strokeDasharray={`${0.40 * 201.06} ${201.06}`} strokeDashoffset="0" transform="rotate(-90 45 45)" />
            <circle cx="45" cy="45" r="32" fill="none" stroke={VIOLET} strokeWidth="14"
              strokeDasharray={`${0.30 * 201.06} ${201.06}`} strokeDashoffset={`${-0.40 * 201.06}`} transform="rotate(-90 45 45)" />
            <circle cx="45" cy="45" r="32" fill="none" stroke={ORCHID} strokeWidth="14"
              strokeDasharray={`${0.20 * 201.06} ${201.06}`} strokeDashoffset={`${-0.70 * 201.06}`} transform="rotate(-90 45 45)" />
            <circle cx="45" cy="45" r="32" fill="none" stroke={LAVENDER} strokeWidth="14"
              strokeDasharray={`${0.10 * 201.06} ${201.06}`} strokeDashoffset={`${-0.90 * 201.06}`} transform="rotate(-90 45 45)" />
            <text x="45" y="43" textAnchor="middle" fontSize="7" fontWeight="700" fill={PURPLE} fontFamily="Calibri, sans-serif">$285B</text>
            <text x="45" y="51" textAnchor="middle" fontSize="4" fill="#595959" fontFamily="Calibri, sans-serif">Total Market</text>
          </svg>
          <div className="flex-1 flex flex-col gap-1.5">
            {[
              { color: PURPLE, label: 'Cloud Infrastructure', pct: '40%', value: '$114B' },
              { color: VIOLET, label: 'Hardware/Chips', pct: '30%', value: '$85.5B' },
              { color: ORCHID, label: 'Software/Tools', pct: '20%', value: '$57B' },
              { color: LAVENDER, label: 'Services/Consulting', pct: '10%', value: '$28.5B' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div style={{ width: '5px', height: '5px', background: item.color, flexShrink: 0 }} />
                <div className="flex-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-[5px] font-semibold" style={{ color: PURPLE }}>{item.label}</span>
                    <span className="text-[4px]" style={{ color: '#757575' }}>{item.pct}</span>
                  </div>
                  <div className="text-[4px]" style={{ color: '#595959' }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  // Slide 7: Growth Forecast with line chart
  {
    title: 'Growth Forecast',
    render: () => (
      <div className="flex flex-col h-full" style={{ background: '#FFFFFF', fontFamily: "Calibri, 'Inter', sans-serif" }}>
        <div className="px-5 py-2" style={{ background: PURPLE }}>
          <h3 className="text-[11px] font-semibold text-white">5-Year Market Growth Projection</h3>
        </div>

        <div className="flex flex-1 px-4 pt-2.5 pb-1.5 gap-3">
          <div className="flex-1">
            <svg viewBox="0 0 220 90" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
              <rect x="30" y="8" width="180" height="55" fill="#F8F8F8" />
              {[8, 21.75, 35.5, 49.25, 63].map(y => (
                <line key={y} x1="30" y1={y} x2="210" y2={y} stroke="#E0E0E0" strokeWidth="0.4" />
              ))}
              <text x="27" y="11" textAnchor="end" fontSize="4" fill="#595959" fontFamily="Calibri, sans-serif">$600B</text>
              <text x="27" y="25" textAnchor="end" fontSize="4" fill="#595959" fontFamily="Calibri, sans-serif">$500B</text>
              <text x="27" y="39" textAnchor="end" fontSize="4" fill="#595959" fontFamily="Calibri, sans-serif">$400B</text>
              <text x="27" y="53" textAnchor="end" fontSize="4" fill="#595959" fontFamily="Calibri, sans-serif">$300B</text>
              <text x="27" y="66" textAnchor="end" fontSize="4" fill="#595959" fontFamily="Calibri, sans-serif">$200B</text>
              <line x1="30" y1="8" x2="30" y2="63" stroke="#808080" strokeWidth="0.6" />
              <line x1="30" y1="63" x2="210" y2="63" stroke="#808080" strokeWidth="0.6" />
              <polyline points="40,58 76,48 112,38 148,26 184,16" fill="none" stroke={PURPLE} strokeWidth="1.5" />
              {[[40,58],[76,48],[112,38],[148,26],[184,16]].map(([cx,cy], i) => (
                <circle key={i} cx={cx} cy={cy} r="2" fill={PURPLE} />
              ))}
              {['2024', '2025', '2026E', '2027E', '2028E'].map((yr, i) => (
                <text key={yr} x={40 + i * 36} y="72" textAnchor="middle" fontSize="4.5" fill="#595959" fontFamily="Calibri, sans-serif">{yr}</text>
              ))}
            </svg>
          </div>
          <div style={{ width: '90px', flexShrink: 0 }} className="flex flex-col gap-1.5">
            <div>
              <div className="text-[5px] font-bold mb-0.5" style={{ color: PURPLE }}>CAGR</div>
              <div className="text-[10px] font-bold" style={{ color: VIOLET }}>38.2%</div>
              <div className="text-[4px]" style={{ color: '#757575' }}>2024-2028</div>
            </div>
            <div>
              <div className="text-[5px] font-bold mb-0.5" style={{ color: PURPLE }}>Key Drivers</div>
              <div className="text-[4px] leading-[1.5]" style={{ color: '#404040' }}>
                Generative AI adoption, enterprise digital transformation, GPU supply normalization
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  // Slide 8: Customer Feedback
  {
    title: 'Customer Feedback',
    render: () => (
      <div className="flex flex-col h-full" style={{ background: '#FFFFFF', fontFamily: "Calibri, 'Inter', sans-serif" }}>
        <div className="px-5 py-2" style={{ background: PURPLE }}>
          <h3 className="text-[11px] font-semibold text-white">Customer Satisfaction Metrics</h3>
        </div>

        <div className="flex flex-1 px-4 pt-2.5 pb-1.5">
          <div className="grid grid-cols-2 gap-3 flex-1">
            {[
              { metric: 'NPS Score', value: '72', change: '+8 pts' },
              { metric: 'CSAT', value: '4.6/5', change: '+0.3' },
              { metric: 'Retention Rate', value: '94%', change: '+2%' },
              { metric: 'Churn Rate', value: '6%', change: '-2%' },
            ].map((item, i) => (
              <div key={i} className="px-3 py-2" style={{ background: '#F3E5F5', border: `1px solid ${ORCHID}` }}>
                <div className="text-[5px] mb-0.5" style={{ color: '#757575' }}>{item.metric}</div>
                <div className="text-[10px] font-bold" style={{ color: PURPLE }}>{item.value}</div>
                <div className="text-[4.5px]" style={{ color: '#66BB6A' }}>{item.change}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  // Slide 9: Roadmap
  {
    title: 'Product Roadmap',
    render: () => (
      <div className="flex flex-col h-full" style={{ background: '#FFFFFF', fontFamily: "Calibri, 'Inter', sans-serif" }}>
        <div className="px-5 py-2" style={{ background: PURPLE }}>
          <h3 className="text-[11px] font-semibold text-white">2026 Product Roadmap</h3>
        </div>

        <div className="flex flex-1 px-4 pt-2.5 pb-1.5 flex-col gap-2">
          {[
            { quarter: 'Q2 2026', items: ['API v3 launch', 'Mobile SDK beta'] },
            { quarter: 'Q3 2026', items: ['Enterprise features', 'Advanced analytics'] },
            { quarter: 'Q4 2026', items: ['Multi-region support', 'Custom integrations'] },
          ].map((q, i) => (
            <div key={i}>
              <div className="text-[6px] font-bold mb-1" style={{ color: PURPLE }}>{q.quarter}</div>
              <div className="flex flex-col gap-0.5">
                {q.items.map((item, j) => (
                  <div key={j} className="flex items-center gap-1">
                    <div style={{ width: '3px', height: '3px', background: ORCHID }} />
                    <span className="text-[5px]" style={{ color: '#404040' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
]
