import React from 'react'

export interface SlideContent {
  title: string
  render: () => React.ReactNode
}

// Orange theme colors for object manipulation
const ORANGE = '#E65100'  // Deep orange
const TANGERINE = '#FB8C00' // Medium orange
const CORAL = '#FF9800'    // Light orange
const PEACH = '#FFCC80'    // Pale orange

// Teal colors for original state
const TEAL = '#00695C'
const AQUA = '#00897B'
const CYAN = '#26A69A'
const MINT_BLUE = '#80CBC4'

export const controlSlides: SlideContent[] = [
  // Slide 0: Title slide
  {
    title: 'Title Slide',
    render: () => (
      <div className="flex flex-col justify-between h-full" style={{ background: TEAL, fontFamily: "Calibri, 'Inter', sans-serif" }}>
        <div style={{ height: '3px', background: `linear-gradient(90deg, ${CYAN}, ${CYAN}80, transparent)` }} />
        <div className="flex flex-col items-start px-8">
          <div className="text-[6px] font-medium tracking-[0.25em] uppercase mb-3" style={{ color: CYAN }}>
            Quarterly Review
          </div>
          <h3 className="text-[18px] font-bold text-white mb-1.5 leading-tight" style={{ letterSpacing: '-0.01em' }}>
            Q1 2026<br />Performance Report
          </h3>
          <div className="w-8 mt-2 mb-3" style={{ height: '1.5px', background: CYAN }} />
          <p className="text-[8px] font-normal" style={{ color: MINT_BLUE }}>
            Business Metrics & Financial Analysis
          </p>
        </div>
        <div className="flex items-center justify-between px-10 py-3" style={{ borderTop: '1px solid #00796B' }}>
          <span className="text-[7px] font-medium tracking-wider uppercase" style={{ color: '#4DB6AC' }}>Confidential</span>
          <span className="text-[7px]" style={{ color: '#4DB6AC' }}>March 2026</span>
        </div>
      </div>
    ),
  },
  // Slide 1: Original layout - Chart on left, cards on right
  {
    title: 'Performance Dashboard',
    render: () => (
      <div className="flex flex-col h-full" style={{ background: '#FFFFFF', fontFamily: "Calibri, 'Inter', sans-serif" }}>
        <div className="px-5 py-2" style={{ background: TEAL }}>
          <h3 className="text-[11px] font-semibold text-white">Q1 Performance Dashboard</h3>
        </div>
        <div style={{ height: '2px', background: CYAN }} />
        <div className="flex flex-1 px-4 pt-2.5 pb-1.5 gap-3">
          {/* LEFT: Revenue Chart */}
          <div className="flex flex-col" style={{ width: '60%' }}>
            <div className="text-[6px] font-bold mb-1.5" style={{ color: TEAL }}>Revenue Growth</div>
            <div className="flex-1 border" style={{ borderColor: '#E0E0E0', padding: '8px', background: '#FAFAFA' }}>
              <svg viewBox="0 0 200 80" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                <rect x="25" y="5" width="165" height="60" fill="#F5F5F5" />
                {[5, 21, 37, 53].map(y => (
                  <line key={y} x1="25" y1={y} x2="190" y2={y} stroke="#D9D9D9" strokeWidth="0.4" />
                ))}
                <text x="22" y="8" textAnchor="end" fontSize="4" fill="#595959">$4M</text>
                <text x="22" y="24" textAnchor="end" fontSize="4" fill="#595959">$3M</text>
                <text x="22" y="40" textAnchor="end" fontSize="4" fill="#595959">$2M</text>
                <text x="22" y="56" textAnchor="end" fontSize="4" fill="#595959">$1M</text>
                <line x1="25" y1="5" x2="25" y2="65" stroke="#808080" strokeWidth="0.5" />
                <line x1="25" y1="65" x2="190" y2="65" stroke="#808080" strokeWidth="0.5" />
                {/* Bars */}
                <rect x="40" y="45" width="18" height="20" fill={TEAL} />
                <rect x="70" y="40" width="18" height="25" fill={AQUA} />
                <rect x="100" y="33" width="18" height="32" fill={CYAN} />
                <rect x="130" y="25" width="18" height="40" fill={AQUA} />
                <rect x="160" y="18" width="18" height="47" fill={TEAL} />
                {/* Labels */}
                <text x="49" y="73" textAnchor="middle" fontSize="4" fill="#595959">Jan</text>
                <text x="79" y="73" textAnchor="middle" fontSize="4" fill="#595959">Feb</text>
                <text x="109" y="73" textAnchor="middle" fontSize="4" fill="#595959">Mar</text>
                <text x="139" y="73" textAnchor="middle" fontSize="4" fill="#595959">Apr</text>
                <text x="169" y="73" textAnchor="middle" fontSize="4" fill="#595959">May</text>
              </svg>
            </div>
          </div>
          {/* RIGHT: KPI Cards */}
          <div className="flex flex-col gap-2" style={{ width: '40%' }}>
            <div className="text-[6px] font-bold mb-0.5" style={{ color: TEAL }}>Key Metrics</div>
            {[
              { label: 'Total Revenue', value: '$12.4M', change: '+23%', bg: TEAL },
              { label: 'Customer Growth', value: '2,847', change: '+18%', bg: AQUA },
              { label: 'Conversion Rate', value: '4.2%', change: '+0.8pp', bg: CYAN },
            ].map((kpi, i) => (
              <div key={i} className="px-3 py-2.5 rounded" style={{ background: kpi.bg }}>
                <div className="text-[4.5px] font-medium uppercase tracking-wider mb-1" style={{ color: MINT_BLUE }}>
                  {kpi.label}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[11px] font-bold text-white">{kpi.value}</span>
                  <span className="text-[5px] font-semibold" style={{ color: '#A5D6A7' }}>{kpi.change}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  // Slide 2: Modified layout - Chart on right, orange cards on left
  {
    title: 'Performance Dashboard',
    render: () => (
      <div className="flex flex-col h-full" style={{ background: '#FFFFFF', fontFamily: "Calibri, 'Inter', sans-serif" }}>
        <div className="px-5 py-2" style={{ background: TEAL }}>
          <h3 className="text-[11px] font-semibold text-white">Q1 Performance Dashboard</h3>
        </div>
        <div style={{ height: '2px', background: CYAN }} />
        <div className="flex flex-1 px-4 pt-2.5 pb-1.5 gap-3">
          {/* LEFT: KPI Cards (NOW ORANGE) */}
          <div className="flex flex-col gap-2" style={{ width: '40%' }}>
            <div className="text-[6px] font-bold mb-0.5" style={{ color: ORANGE }}>Key Metrics</div>
            {[
              { label: 'Total Revenue', value: '$12.4M', change: '+23%', bg: ORANGE },
              { label: 'Customer Growth', value: '2,847', change: '+18%', bg: TANGERINE },
              { label: 'Conversion Rate', value: '4.2%', change: '+0.8pp', bg: CORAL },
            ].map((kpi, i) => (
              <div key={i} className="px-3 py-2.5 rounded" style={{ background: kpi.bg }}>
                <div className="text-[4.5px] font-medium uppercase tracking-wider mb-1" style={{ color: PEACH }}>
                  {kpi.label}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[11px] font-bold text-white">{kpi.value}</span>
                  <span className="text-[5px] font-semibold" style={{ color: '#A5D6A7' }}>{kpi.change}</span>
                </div>
              </div>
            ))}
          </div>
          {/* RIGHT: Revenue Chart (MOVED HERE) */}
          <div className="flex flex-col" style={{ width: '60%' }}>
            <div className="text-[6px] font-bold mb-1.5" style={{ color: TEAL }}>Revenue Growth</div>
            <div className="flex-1 border" style={{ borderColor: '#E0E0E0', padding: '8px', background: '#FAFAFA' }}>
              <svg viewBox="0 0 200 80" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                <rect x="25" y="5" width="165" height="60" fill="#F5F5F5" />
                {[5, 21, 37, 53].map(y => (
                  <line key={y} x1="25" y1={y} x2="190" y2={y} stroke="#D9D9D9" strokeWidth="0.4" />
                ))}
                <text x="22" y="8" textAnchor="end" fontSize="4" fill="#595959">$4M</text>
                <text x="22" y="24" textAnchor="end" fontSize="4" fill="#595959">$3M</text>
                <text x="22" y="40" textAnchor="end" fontSize="4" fill="#595959">$2M</text>
                <text x="22" y="56" textAnchor="end" fontSize="4" fill="#595959">$1M</text>
                <line x1="25" y1="5" x2="25" y2="65" stroke="#808080" strokeWidth="0.5" />
                <line x1="25" y1="65" x2="190" y2="65" stroke="#808080" strokeWidth="0.5" />
                {/* Bars */}
                <rect x="40" y="45" width="18" height="20" fill={TEAL} />
                <rect x="70" y="40" width="18" height="25" fill={AQUA} />
                <rect x="100" y="33" width="18" height="32" fill={CYAN} />
                <rect x="130" y="25" width="18" height="40" fill={AQUA} />
                <rect x="160" y="18" width="18" height="47" fill={TEAL} />
                {/* Labels */}
                <text x="49" y="73" textAnchor="middle" fontSize="4" fill="#595959">Jan</text>
                <text x="79" y="73" textAnchor="middle" fontSize="4" fill="#595959">Feb</text>
                <text x="109" y="73" textAnchor="middle" fontSize="4" fill="#595959">Mar</text>
                <text x="139" y="73" textAnchor="middle" fontSize="4" fill="#595959">Apr</text>
                <text x="169" y="73" textAnchor="middle" fontSize="4" fill="#595959">May</text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  // Slide 4: Market Share - Pie chart
  {
    title: 'Market Share',
    render: () => (
      <div className="flex flex-col h-full" style={{ background: '#FFFFFF', fontFamily: "Calibri, 'Inter', sans-serif" }}>
        <div className="px-5 py-2" style={{ background: TEAL }}>
          <h3 className="text-[11px] font-semibold text-white">Market Share Distribution</h3>
        </div>
        <div style={{ height: '2px', background: CYAN }} />
        <div className="flex flex-1 px-6 pt-3 pb-2 gap-4 items-center justify-center">
          <svg viewBox="0 0 100 100" width="90" height="90">
            <circle cx="50" cy="50" r="35" fill="none" stroke={TEAL} strokeWidth="16"
              strokeDasharray={`${0.35 * 219.9} ${219.9}`} strokeDashoffset="0" transform="rotate(-90 50 50)" />
            <circle cx="50" cy="50" r="35" fill="none" stroke={AQUA} strokeWidth="16"
              strokeDasharray={`${0.25 * 219.9} ${219.9}`} strokeDashoffset={`${-0.35 * 219.9}`} transform="rotate(-90 50 50)" />
            <circle cx="50" cy="50" r="35" fill="none" stroke={CYAN} strokeWidth="16"
              strokeDasharray={`${0.20 * 219.9} ${219.9}`} strokeDashoffset={`${-0.60 * 219.9}`} transform="rotate(-90 50 50)" />
            <circle cx="50" cy="50" r="35" fill="none" stroke={MINT_BLUE} strokeWidth="16"
              strokeDasharray={`${0.20 * 219.9} ${219.9}`} strokeDashoffset={`${-0.80 * 219.9}`} transform="rotate(-90 50 50)" />
            <text x="50" y="48" textAnchor="middle" fontSize="8" fontWeight="700" fill={TEAL} fontFamily="Calibri, sans-serif">Q1</text>
            <text x="50" y="56" textAnchor="middle" fontSize="4" fill="#595959" fontFamily="Calibri, sans-serif">Share</text>
          </svg>
          <div className="flex flex-col gap-1.5">
            {[
              { color: TEAL, label: 'Product A', pct: '35%' },
              { color: AQUA, label: 'Product B', pct: '25%' },
              { color: CYAN, label: 'Product C', pct: '20%' },
              { color: MINT_BLUE, label: 'Product D', pct: '20%' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div style={{ width: '6px', height: '6px', background: item.color }} />
                <span className="text-[5px]" style={{ color: '#404040' }}>{item.label}: {item.pct}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  // Slide 5: Team Overview
  {
    title: 'Team Overview',
    render: () => (
      <div className="flex flex-col h-full" style={{ background: '#FFFFFF', fontFamily: "Calibri, 'Inter', sans-serif" }}>
        <div className="px-5 py-2" style={{ background: TEAL }}>
          <h3 className="text-[11px] font-semibold text-white">Team Performance Q1</h3>
        </div>
        <div style={{ height: '2px', background: CYAN }} />
        <div className="flex flex-1 px-6 pt-3 pb-2">
          <div className="grid grid-cols-3 gap-3 flex-1">
            {[
              { name: 'Sales', value: '142%', target: 'of target' },
              { name: 'Marketing', value: '118%', target: 'of target' },
              { name: 'Support', value: '95%', target: 'satisfaction' },
              { name: 'Product', value: '12', target: 'features' },
              { name: 'Engineering', value: '98%', target: 'uptime' },
              { name: 'Operations', value: '23%', target: 'cost reduction' },
            ].map((team, i) => (
              <div key={i} className="flex flex-col justify-center px-3 py-2" style={{ background: '#E0F2F1', border: `1.5px solid ${CYAN}` }}>
                <div className="text-[5px] font-bold" style={{ color: TEAL }}>{team.name}</div>
                <div className="text-[9px] font-bold" style={{ color: AQUA }}>{team.value}</div>
                <div className="text-[4px]" style={{ color: '#757575' }}>{team.target}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  // Slide 6: Timeline
  {
    title: 'Project Timeline',
    render: () => (
      <div className="flex flex-col h-full" style={{ background: '#FFFFFF', fontFamily: "Calibri, 'Inter', sans-serif" }}>
        <div className="px-5 py-2" style={{ background: TEAL }}>
          <h3 className="text-[11px] font-semibold text-white">Q1 Project Timeline</h3>
        </div>
        <div style={{ height: '2px', background: CYAN }} />
        <div className="flex flex-1 px-6 pt-3 pb-2 flex-col gap-2">
          {[
            { month: 'January', projects: ['Launch new website', 'Q4 reporting complete'] },
            { month: 'February', projects: ['Mobile app beta', 'Team expansion'] },
            { month: 'March', projects: ['Product v2.0 release', 'Customer conference'] },
          ].map((item, i) => (
            <div key={i} className="flex gap-3">
              <div style={{ width: '60px', flexShrink: 0 }}>
                <div className="text-[6px] font-bold" style={{ color: TEAL }}>{item.month}</div>
              </div>
              <div className="flex-1 flex flex-col gap-1">
                {item.projects.map((proj, j) => (
                  <div key={j} className="flex items-center gap-1.5">
                    <div style={{ width: '4px', height: '4px', background: CYAN }} />
                    <span className="text-[5px]" style={{ color: '#404040' }}>{proj}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  // Slide 7: Summary
  {
    title: 'Summary',
    render: () => (
      <div className="flex flex-col h-full" style={{ background: '#FFFFFF', fontFamily: "Calibri, 'Inter', sans-serif" }}>
        <div className="px-5 py-2" style={{ background: TEAL }}>
          <h3 className="text-[11px] font-semibold text-white">Q1 Summary & Next Steps</h3>
        </div>
        <div style={{ height: '2px', background: CYAN }} />
        <div className="flex flex-1 px-6 pt-3 pb-2 flex-col gap-3">
          <div>
            <div className="text-[6px] font-bold mb-1.5" style={{ color: TEAL }}>Key Achievements</div>
            <div className="space-y-1">
              {[
                'Revenue exceeded targets by 42%',
                'Customer satisfaction reached 95%',
                'Team headcount grew by 15%',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <div style={{ width: '3px', height: '3px', background: CYAN, marginTop: '2px' }} />
                  <span className="text-[5px] leading-[1.4]" style={{ color: '#404040' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[6px] font-bold mb-1.5" style={{ color: TEAL }}>Q2 Priorities</div>
            <div className="space-y-1">
              {[
                'Launch international expansion',
                'Scale engineering team',
                'Release mobile app v1.0',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <div style={{ width: '3px', height: '3px', background: AQUA, marginTop: '2px' }} />
                  <span className="text-[5px] leading-[1.4]" style={{ color: '#404040' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
  },
  // Slides 8-14: Additional unique slides with teal theme
  ...Array.from({ length: 7 }, (_, i) => ({
    title: `Slide ${i + 8}`,
    render: () => (
      <div className="flex flex-col h-full" style={{ background: '#FFFFFF', fontFamily: "Calibri, 'Inter', sans-serif" }}>
        <div className="px-5 py-2" style={{ background: TEAL }}>
          <h3 className="text-[11px] font-semibold text-white">{['Budget Overview', 'Risk Assessment', 'Stakeholder Map', 'Action Items', 'Next Quarter Goals', 'Resource Planning', 'Final Recommendations'][i]}</h3>
        </div>
        <div style={{ height: '2px', background: CYAN }} />
        <div className="flex flex-1 px-6 pt-3 pb-2 items-center justify-center">
          <div className="grid grid-cols-2 gap-3" style={{ width: '100%' }}>
            {Array.from({ length: 4 }, (_, j) => (
              <div key={j} className="px-3 py-2 text-center" style={{ background: i % 2 === 0 ? '#E0F2F1' : '#B2DFDB', border: `1px solid ${CYAN}` }}>
                <div className="text-[6px] font-bold" style={{ color: TEAL }}>Item {j + 1}</div>
                <div className="text-[9px] font-bold" style={{ color: AQUA }}>{85 + j * 5}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  })),
]
