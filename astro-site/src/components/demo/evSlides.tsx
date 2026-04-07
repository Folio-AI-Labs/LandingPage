import React from 'react'

export interface SlideContent {
  title: string
  render: () => React.ReactNode
}

// Green theme colors for EV market
const FOREST = '#1B5E20'  // Dark green
const LIME = '#7CB342'    // Accent green
const SAGE = '#558B2F'    // Mid green
const MINT = '#AED581'    // Light green

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

export const evSlides: SlideContent[] = [
  {
    title: 'Japan EV Sales Surge to 1.2M Units in 2025',
    render: () => (
      <div className="flex flex-col justify-between h-full" style={{ background: FOREST, fontFamily: "Calibri, 'Inter', sans-serif" }}>
        <div style={{ height: '3px', background: `linear-gradient(90deg, ${LIME}, ${LIME}80, transparent)` }} />
        <div className="flex flex-col items-start px-8">
          <div className="text-[6px] font-medium tracking-[0.25em] uppercase mb-3" style={{ color: LIME }}>
            Market Evolution
          </div>
          <h3 className="text-[18px] font-bold text-white mb-1.5 leading-tight" style={{ letterSpacing: '-0.01em' }}>
            Electric Vehicle Market<br />Evolution in Japan
          </h3>
          <div className="w-8 mt-2 mb-3" style={{ height: '1.5px', background: LIME }} />
          <p className="text-[8px] font-normal" style={{ color: '#90CAF9' }}>
            Market Analysis & Strategic Outlook — 2026
          </p>
        </div>
        <div className="flex items-center justify-between px-10 py-3" style={{ borderTop: '1px solid #2E7D32' }}>
          <span className="text-[7px] font-medium tracking-wider uppercase" style={{ color: '#66BB6A' }}>Confidential</span>
          <span className="text-[7px]" style={{ color: '#66BB6A' }}>March 2026</span>
        </div>
      </div>
    ),
  },
  {
    title: 'EV Sales Nearly Tripled From 2021 to 2025',
    render: () => {
      return (
      <div className="flex flex-col h-full" style={{ background: '#FFFFFF', fontFamily: "Calibri, 'Inter', sans-serif" }}>
        <div className="px-5 py-2" style={{ background: FOREST }}>
          <h3 className="text-[11px] font-semibold text-white">EV Sales Nearly Tripled From 2021 to 2025</h3>
        </div>
        <div style={{ height: '2px', background: LIME }} />
        <div className="flex flex-1 px-4 pt-2 pb-1 gap-2 min-h-0">
          <div className="flex flex-col gap-1.5 justify-start pt-0.5" style={{ width: '80px', flexShrink: 0 }}>
            {[
              { color: LIME, label: 'EV Sales', value: '1.2M', unit: 'units', sub: '+42% YoY', subColor: '#66BB6A' },
              { color: SAGE, label: 'Market Share', value: '35%', unit: 'of sales', sub: '+8pp YoY', subColor: '#66BB6A' },
              { color: MINT, label: 'Charging Infra', value: '85K', unit: 'stations', sub: '+65% YoY', subColor: '#66BB6A' },
            ].map((kpi, i) => (
              <div key={i} className="px-1.5 py-1.5" style={{ background: FOREST }}>
                <div className="flex items-center gap-1 mb-0.5">
                  <div style={{ width: '4px', height: '4px', background: kpi.color }} />
                  <span className="text-[4.5px] font-semibold" style={{ color: '#90CAF9' }}>{kpi.label}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-white">{kpi.value}</span>
                  <span className="text-[3.5px] ml-0.5" style={{ color: '#90CAF9' }}>{kpi.unit}</span>
                </div>
                <div className="text-[3.5px]" style={{ color: kpi.subColor }}>{kpi.sub}</div>
              </div>
            ))}
          </div>
          <div className="flex-1 flex gap-2.5 min-h-0 min-w-0">
            <div className="flex items-center p-2" style={{ width: '185px', flexShrink: 0 }}>
              <svg viewBox="0 0 150 120" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                <rect x="25" y="5" width="105" height="80" fill="#F2F2F2" />
                {[5, 25, 45, 65, 85].map(y => (
                  <line key={y} x1="25" y1={y} x2="130" y2={y} stroke="#D9D9D9" strokeWidth="0.4" />
                ))}
                <text x="22" y="8" textAnchor="end" fontSize="4.5" fill="#595959" fontFamily="Calibri, sans-serif">1.5M</text>
                <text x="22" y="28" textAnchor="end" fontSize="4.5" fill="#595959" fontFamily="Calibri, sans-serif">1.2M</text>
                <text x="22" y="48" textAnchor="end" fontSize="4.5" fill="#595959" fontFamily="Calibri, sans-serif">900K</text>
                <text x="22" y="68" textAnchor="end" fontSize="4.5" fill="#595959" fontFamily="Calibri, sans-serif">600K</text>
                <line x1="25" y1="5" x2="25" y2="85" stroke="#808080" strokeWidth="0.5" />
                <line x1="25" y1="85" x2="130" y2="85" stroke="#808080" strokeWidth="0.5" />
                {[5, 25, 45, 65, 85].map(y => (
                  <line key={`t${y}`} x1="22" y1={y} x2="25" y2={y} stroke="#808080" strokeWidth="0.5" />
                ))}
                <rect x="35" y="71" width="12" height="14" fill={FOREST} />
                <rect x="49" y="68" width="12" height="17" fill={LIME} />
                <rect x="70" y="58" width="12" height="27" fill={FOREST} />
                <rect x="84" y="51" width="12" height="34" fill={LIME} />
                <rect x="105" y="33" width="12" height="52" fill={FOREST} />
                <rect x="119" y="25" width="12" height="60" fill={LIME} />
                <text x="41" y="68" textAnchor="middle" fontSize="4" fill="#595959" fontFamily="Calibri, sans-serif">520K</text>
                <text x="55" y="65" textAnchor="middle" fontSize="4" fill="#595959" fontFamily="Calibri, sans-serif">580K</text>
                <text x="76" y="55" textAnchor="middle" fontSize="4" fill="#595959" fontFamily="Calibri, sans-serif">780K</text>
                <text x="90" y="48" textAnchor="middle" fontSize="4" fill="#595959" fontFamily="Calibri, sans-serif">920K</text>
                <text x="111" y="30" textAnchor="middle" fontSize="4" fill="#595959" fontFamily="Calibri, sans-serif">1.2M</text>
                <text x="125" y="22" textAnchor="middle" fontSize="4" fill="#595959" fontFamily="Calibri, sans-serif">1.4M</text>
                <text x="48" y="93" textAnchor="middle" fontSize="4.5" fill="#595959" fontFamily="Calibri, sans-serif">2021</text>
                <text x="83" y="93" textAnchor="middle" fontSize="4.5" fill="#595959" fontFamily="Calibri, sans-serif">2023</text>
                <text x="118" y="93" textAnchor="middle" fontSize="4.5" fill="#595959" fontFamily="Calibri, sans-serif">2025E</text>
                <rect x="40" y="100" width="5" height="5" fill={FOREST} />
                <text x="48" y="104" fontSize="4" fill="#595959" fontFamily="Calibri, sans-serif">BEV</text>
                <rect x="78" y="100" width="5" height="5" fill={LIME} />
                <text x="86" y="104" fontSize="4" fill="#595959" fontFamily="Calibri, sans-serif">PHEV</text>
                <text x="77" y="114" textAnchor="middle" fontSize="4" fill="#808080" fontFamily="Calibri, sans-serif">Annual EV Sales in Japan</text>
              </svg>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-x-3 gap-y-0 min-h-0" style={{ alignContent: 'stretch' }}>
              {[
                { title: 'Government Policy', text: 'Japan targets 100% EV sales by 2035. Subsidies up to ¥850K per vehicle. Carbon neutrality goal driving regulatory support.' },
                { title: 'Infrastructure Growth', text: 'Charging stations grew 65% to 85K locations. Fast-charging network expanding along highways. Tokyo metro area leads deployment.' },
                { title: 'Consumer Adoption', text: 'EV market share reached 35% in 2025, up from 27% in 2024. Range anxiety declining with improved battery tech and charging access.' },
                { title: 'Manufacturer Strategy', text: 'Toyota, Nissan, Honda investing $50B+ in EV development. Local production scaling to meet demand and reduce import dependency.' },
                { title: 'Battery Technology', text: 'Solid-state batteries in pilot production. Energy density improvements enable 500km+ range. Domestic battery production capacity doubling.' },
                { title: 'Market Forecast', text: 'Projected 1.4M EV sales in 2025, growing to 2M+ by 2027. Premium segment showing strongest growth with luxury EVs.' },
                { title: 'Competitive Landscape', text: 'Japanese brands hold 68% market share. Chinese imports growing rapidly in budget segment. Tesla maintains premium position.' },
                { title: 'Grid Integration', text: 'V2G technology piloting in 5 major cities. EVs supporting grid stability during peak demand. Smart charging incentives launched.' },
              ].map((box, i) => (
                <div key={i} className="flex flex-col justify-start pt-1">
                  <div className="text-[5.5px] font-bold mb-0.5" style={{ color: FOREST }}>{box.title}</div>
                  <div className="text-[4.5px] leading-[1.5]" style={{ color: '#404040' }}>{box.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="px-4 pb-0.5">
          <span className="text-[3.5px]" style={{ color: '#A0A0A0' }}>Source: JAMA, METI Japan, BloombergNEF — March 2026</span>
        </div>
      </div>
      )
    },
  },
  {
    title: 'Market Value Reached ¥4.2T With 38% Annual Growth',
    render: () => (
      <div className="flex flex-col h-full" style={{ background: '#FFFFFF', fontFamily: "Calibri, 'Inter', sans-serif" }}>
        <div className="px-5 py-2" style={{ background: FOREST }}>
          <h3 className="text-[11px] font-semibold text-white">Market Value Reached ¥4.2T With 38% Annual Growth</h3>
        </div>
        <div style={{ height: '2px', background: LIME }} />
        <div className="flex flex-1 px-4 pt-2.5 pb-1.5 gap-3 min-h-0">
          {/* Left: compact line chart */}
          <div className="flex flex-col" style={{ width: '220px', flexShrink: 0 }}>
            {/* Market value callouts */}
            <div className="flex items-center gap-4 pb-1.5">
              <div>
                <div className="text-[4.5px] font-medium uppercase tracking-wider" style={{ color: '#595959' }}>Market Size</div>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-[12px] font-bold" style={{ color: FOREST }}>¥4.2T</span>
                  <span className="text-[5px] font-semibold" style={{ color: '#66BB6A' }}>+38%</span>
                </div>
              </div>
              <div style={{ width: '1px', height: '18px', background: '#D9D9D9' }} />
              <div>
                <div className="text-[4.5px] font-medium uppercase tracking-wider" style={{ color: '#595959' }}>Investment</div>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-[12px] font-bold" style={{ color: FOREST }}>¥850B</span>
                  <span className="text-[5px] font-semibold" style={{ color: '#66BB6A' }}>+52%</span>
                </div>
              </div>
            </div>
            {/* Line chart */}
            <div className="flex-1 p-2">
              <svg viewBox="0 0 200 80" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                <rect x="25" y="3" width="165" height="50" fill="#F2F2F2" />
                {[3, 15.5, 28, 40.5, 53].map(y => (
                  <line key={y} x1="25" y1={y} x2="190" y2={y} stroke="#D9D9D9" strokeWidth="0.4" />
                ))}
                <text x="22" y="6" textAnchor="end" fontSize="4" fill="#595959" fontFamily="Calibri, sans-serif">¥5T</text>
                <text x="22" y="18" textAnchor="end" fontSize="4" fill="#595959" fontFamily="Calibri, sans-serif">¥4T</text>
                <text x="22" y="31" textAnchor="end" fontSize="4" fill="#595959" fontFamily="Calibri, sans-serif">¥3T</text>
                <text x="22" y="43" textAnchor="end" fontSize="4" fill="#595959" fontFamily="Calibri, sans-serif">¥2T</text>
                <text x="22" y="56" textAnchor="end" fontSize="4" fill="#595959" fontFamily="Calibri, sans-serif">¥1T</text>
                <line x1="25" y1="3" x2="25" y2="53" stroke="#808080" strokeWidth="0.5" />
                <line x1="25" y1="53" x2="190" y2="53" stroke="#808080" strokeWidth="0.5" />
                {[3, 15.5, 28, 40.5, 53].map(y => (
                  <line key={`t${y}`} x1="22" y1={y} x2="25" y2={y} stroke="#808080" strokeWidth="0.5" />
                ))}
                {/* Market Size */}
                <polyline points="38,48 65,44 92,38 119,28 146,18 173,14" fill="none" stroke={FOREST} strokeWidth="1.2" />
                {[[38,48],[65,44],[92,38],[119,28],[146,18],[173,14]].map(([cx,cy], i) => (
                  <rect key={i} x={cx-1.5} y={cy-1.5} width="3" height="3" fill={FOREST} />
                ))}
                {/* Investment */}
                <polyline points="38,50 65,48 92,45 119,39 146,32 173,28" fill="none" stroke={LIME} strokeWidth="1.2" />
                {[[38,50],[65,48],[92,45],[119,39],[146,32],[173,28]].map(([cx,cy], i) => (
                  <rect key={i} x={cx-1.5} y={cy-1.5} width="3" height="3" fill={LIME} />
                ))}
                {['2021', '2022', '2023', '2024', '2025', '2026E'].map((m, i) => (
                  <text key={m} x={38 + i * 27} y="60" textAnchor="middle" fontSize="4" fill="#595959" fontFamily="Calibri, sans-serif">{m}</text>
                ))}
                {/* Legend */}
                <line x1="55" y1="68" x2="65" y2="68" stroke={FOREST} strokeWidth="1.2" />
                <rect x="59" y="66.5" width="3" height="3" fill={FOREST} />
                <text x="68" y="70" fontSize="3.5" fill="#595959" fontFamily="Calibri, sans-serif">Market Size</text>
                <line x1="115" y1="68" x2="125" y2="68" stroke={LIME} strokeWidth="1.2" />
                <rect x="119" y="66.5" width="3" height="3" fill={LIME} />
                <text x="128" y="70" fontSize="3.5" fill="#595959" fontFamily="Calibri, sans-serif">Investment</text>
              </svg>
            </div>
          </div>
          {/* Right: title + donut + text */}
          <div className="flex-1 flex flex-col justify-between min-h-0">
            {/* Emphasized message */}
            <div>
              <div className="text-[8px] font-bold leading-tight" style={{ color: FOREST }}>
                Strong growth trajectory with government backing
              </div>
              <div className="mt-1" style={{ height: '1.5px', width: '30px', background: LIME }} />
            </div>
            {/* Donut chart — market segments */}
            <div className="flex items-center gap-2.5 p-2">
              <svg viewBox="0 0 80 80" width="65" height="65" className="shrink-0">
                <circle cx="40" cy="40" r="28" fill="none" stroke={FOREST} strokeWidth="12"
                  strokeDasharray={`${0.45 * 175.9} ${175.9}`} strokeDashoffset="0" transform="rotate(-90 40 40)" />
                <circle cx="40" cy="40" r="28" fill="none" stroke={LIME} strokeWidth="12"
                  strokeDasharray={`${0.30 * 175.9} ${175.9}`} strokeDashoffset={`${-0.45 * 175.9}`} transform="rotate(-90 40 40)" />
                <circle cx="40" cy="40" r="28" fill="none" stroke={SAGE} strokeWidth="12"
                  strokeDasharray={`${0.15 * 175.9} ${175.9}`} strokeDashoffset={`${-0.75 * 175.9}`} transform="rotate(-90 40 40)" />
                <circle cx="40" cy="40" r="28" fill="none" stroke={MINT} strokeWidth="12"
                  strokeDasharray={`${0.10 * 175.9} ${175.9}`} strokeDashoffset={`${-0.90 * 175.9}`} transform="rotate(-90 40 40)" />
                <text x="40" y="38" textAnchor="middle" fontSize="6" fontWeight="700" fill={FOREST} fontFamily="Calibri, sans-serif">¥4.2T</text>
                <text x="40" y="45" textAnchor="middle" fontSize="3.5" fill="#595959" fontFamily="Calibri, sans-serif">total value</text>
              </svg>
              <div className="flex flex-col gap-1">
                <div className="text-[5px] font-bold" style={{ color: FOREST }}>Revenue by Segment</div>
                {[
                  { color: FOREST, label: 'Vehicle Sales', pct: '45%' },
                  { color: LIME, label: 'Charging Infra', pct: '30%' },
                  { color: SAGE, label: 'Battery Tech', pct: '15%' },
                  { color: MINT, label: 'Services', pct: '10%' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <div style={{ width: '4px', height: '4px', background: item.color }} />
                    <span className="text-[4px]" style={{ color: '#595959' }}>{item.label}</span>
                    <span className="text-[4px] font-semibold" style={{ color: FOREST }}>{item.pct}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Two text blocks */}
            <div className="flex flex-col gap-2">
              <div>
                <div className="flex items-center gap-1 mb-0.5">
                  <svg viewBox="0 0 12 12" width="7" height="7" className="shrink-0">
                    <polyline points="1,9 4,4 7,6 11,1" fill="none" stroke={FOREST} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-[5px] font-bold" style={{ color: FOREST }}>Growth Drivers</span>
                </div>
                <div className="text-[4.5px] leading-[1.5]" style={{ color: '#404040' }}>
                  {"Government subsidies and tax incentives accelerating adoption. Manufacturing capacity expansion by major automakers creating economies of scale. Battery costs declining 15% annually, improving vehicle affordability. Charging infrastructure investments reducing range anxiety and enabling longer trips across Japan's regions."}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 mb-0.5">
                  <svg viewBox="0 0 12 12" width="7" height="7" className="shrink-0">
                    <circle cx="6" cy="6" r="5" fill="none" stroke={FOREST} strokeWidth="1.2" />
                    <path d="M6,3 L6,6.5 L8.5,8" fill="none" stroke={FOREST} strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  <span className="text-[5px] font-bold" style={{ color: FOREST }}>Investment Priorities</span>
                </div>
                <div className="text-[4.5px] leading-[1.5]" style={{ color: '#404040' }}>
                  {"Solid-state battery R&D receiving ¥200B+ annually. Fast-charging network expansion prioritized in rural areas. Domestic supply chain development reducing import dependence. Recycling infrastructure being built to handle end-of-life batteries sustainably."}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 pb-0.5">
          <span className="text-[3.5px]" style={{ color: '#A0A0A0' }}>Source: METI Japan, JAMA, McKinsey EV Index — March 2026</span>
        </div>
      </div>
    ),
  },
  {
    title: 'Urban Millennials Drive 42% of EV Purchases',
    render: () => (
      <div className="flex flex-col h-full" style={{ background: '#FFFFFF', fontFamily: "Calibri, 'Inter', sans-serif" }}>
        <div className="px-5 py-2" style={{ background: FOREST }}>
          <h3 className="text-[11px] font-semibold text-white">Urban Millennials Drive 42% of EV Purchases</h3>
        </div>
        <div style={{ height: '2px', background: LIME }} />
        <div className="flex flex-1 px-4 pt-2.5 pb-1.5 gap-3">
          <div className="flex-1 flex flex-col gap-2">
            <div>
              <div className="text-[6px] font-bold mb-1" style={{ color: FOREST }}>Demographic Insights</div>
              <div className="text-[4.5px] leading-[1.5]" style={{ color: '#404040' }}>
                Urban millennials (25-40) lead EV adoption at 42% market share. Family buyers increasingly choosing EVs for second vehicles. Premium segment buyers switching from luxury ICE vehicles, citing lower operating costs and environmental benefits.
              </div>
            </div>
            <div>
              <div className="text-[6px] font-bold mb-1" style={{ color: FOREST }}>Purchase Motivations</div>
              <div className="text-[4.5px] leading-[1.5]" style={{ color: '#404040' }}>
                Top factors: Government incentives (68%), fuel cost savings (61%), environmental concern (54%), advanced technology features (47%). Range anxiety declining from 72% to 38% over past two years.
              </div>
            </div>
            <div>
              <div className="text-[6px] font-bold mb-1" style={{ color: FOREST }}>Usage Patterns</div>
              <div className="text-[4.5px] leading-[1.5]" style={{ color: '#404040' }}>
                Average daily commute: 45km. 85% of charging done at home overnight. Weekend trips increasing as fast-charging network expands. Vehicle-to-home (V2H) systems gaining traction for emergency backup power.
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 pb-0.5">
          <span className="text-[3.5px]" style={{ color: '#A0A0A0' }}>Source: Consumer Behavior Study 2026 — JAMA</span>
        </div>
      </div>
    ),
  },
  {
    title: 'Solid-State Batteries Enter Production by 2027',
    render: () => (
      <div className="flex flex-col h-full" style={{ background: '#FFFFFF', fontFamily: "Calibri, 'Inter', sans-serif" }}>
        <div className="px-5 py-2" style={{ background: FOREST }}>
          <h3 className="text-[11px] font-semibold text-white">Solid-State Batteries Enter Production by 2027</h3>
        </div>
        <div style={{ height: '2px', background: LIME }} />
        <div className="flex flex-1 px-4 pt-2.5 pb-1.5 gap-3">
          <div className="flex-1 grid grid-cols-2 gap-3">
            {[
              { title: 'Battery Innovation', text: 'Solid-state batteries entering production in 2027. Energy density reaching 500Wh/kg. Cost per kWh declining to $80 by 2028. 10-minute fast charging becoming standard.' },
              { title: 'Autonomous Features', text: 'Level 3 autonomy in urban areas. Highway pilot systems standard on premium models. AI-powered predictive maintenance. Over-the-air software updates enhancing capabilities.' },
              { title: 'Charging Technology', text: 'Ultra-fast 350kW chargers deployed nationwide. Wireless charging pads in parking lots. Battery swap stations piloting in Tokyo. Solar-powered charging networks expanding.' },
              { title: 'Vehicle Platform', text: 'Modular skateboard platforms enabling rapid model development. Lightweight materials reducing vehicle weight 15%. Aerodynamic efficiency improving range by 12%. Software-defined vehicle architecture.' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col">
                <div className="text-[6px] font-bold mb-1" style={{ color: FOREST }}>{item.title}</div>
                <div className="text-[4.5px] leading-[1.5]" style={{ color: '#404040' }}>{item.text}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="px-4 pb-0.5">
          <span className="text-[3.5px]" style={{ color: '#A0A0A0' }}>Source: Technology Forecast 2026 — Industry Analysis</span>
        </div>
      </div>
    ),
  },
  {
    title: 'Japan Poised to Lead Asia-Pacific EV Transition by 2028',
    render: () => (
      <div className="flex flex-col h-full" style={{ background: '#FFFFFF', fontFamily: "Calibri, 'Inter', sans-serif" }}>
        <div className="px-5 py-2" style={{ background: FOREST }}>
          <h3 className="text-[11px] font-semibold text-white">Japan Poised to Lead Asia-Pacific EV Transition by 2028</h3>
        </div>
        <div style={{ height: '2px', background: LIME }} />
        <div className="flex flex-1 px-4 pt-2.5 pb-1.5 gap-3">
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="text-[8px] font-bold leading-tight mb-2" style={{ color: FOREST }}>
                Japan positioned to lead Asia-Pacific EV transition
              </div>
              <div className="text-[4.5px] leading-[1.5] mb-3" style={{ color: '#404040' }}>
                With government backing, technological leadership, and growing consumer acceptance, Japan's EV market is set for sustained growth. Key opportunities in battery technology export, charging infrastructure, and vehicle-to-grid integration.
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { year: '2026E', sales: '1.6M', share: '40%' },
                { year: '2027E', sales: '2.1M', share: '50%' },
                { year: '2028E', sales: '2.8M', share: '62%' },
              ].map((item, i) => (
                <div key={i} className="px-2 py-1.5" style={{ background: '#F5F5F5', border: `1px solid ${LIME}` }}>
                  <div className="text-[5px] font-bold" style={{ color: FOREST }}>{item.year}</div>
                  <div className="text-[7px] font-bold" style={{ color: SAGE }}>{item.sales}</div>
                  <div className="text-[4px]" style={{ color: '#757575' }}>{item.share} market share</div>
                </div>
              ))}
            </div>
            <div className="mt-2">
              <div className="text-[5.5px] font-bold mb-1" style={{ color: FOREST }}>Strategic Recommendations</div>
              <ul className="text-[4.5px] leading-[1.5] space-y-0.5" style={{ color: '#404040', paddingLeft: '8px' }}>
                <li>• Accelerate partnerships with charging infrastructure providers</li>
                <li>• Invest in domestic battery production capacity</li>
                <li>• Develop export strategy for EV technology to Southeast Asia</li>
                <li>• Focus on premium segment where margins remain strong</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="px-4 pb-0.5">
          <span className="text-[3.5px]" style={{ color: '#A0A0A0' }}>Source: Strategic Analysis 2026 — Market Forecast</span>
        </div>
      </div>
    ),
  },
]
