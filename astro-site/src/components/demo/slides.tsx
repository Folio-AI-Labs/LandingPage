export interface SlideContent {
  title: string
  render: () => React.ReactNode
}

const NAVY = '#0C1F3F'
const GOLD = '#C5A55A'

export const defaultSlides: SlideContent[] = [
  {
    title: 'Title Slide',
    render: () => (
      <div className="flex flex-col justify-between h-full" style={{ background: NAVY, fontFamily: "Calibri, 'Inter', sans-serif" }}>
        <div style={{ height: '3px', background: `linear-gradient(90deg, ${GOLD}, ${GOLD}80, transparent)` }} />
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
      const kpiStyle = { background: '#F2F2F2', border: '1px solid #D9D9D9' }
      return (
      <div className="flex flex-col h-full" style={{ background: '#FFFFFF', fontFamily: "Calibri, 'Inter', sans-serif" }}>
        <div className="px-5 py-2" style={{ background: NAVY }}>
          <h3 className="text-[11px] font-semibold text-white">Supply & Demand Overview</h3>
        </div>
        <div style={{ height: '2px', background: GOLD }} />
        <div className="flex flex-1 px-4 pt-2 pb-1 gap-2 min-h-0">
          <div className="flex flex-col gap-1.5 justify-start pt-0.5" style={{ width: '80px', flexShrink: 0 }}>
            {[
              { color: '#4472C4', label: 'Global Demand', value: '104.5M', unit: 'bbl/day', sub: '+0.9M YoY', subColor: '#16A34A' },
              { color: '#ED7D31', label: 'Global Supply', value: '106.1M', unit: 'bbl/day', sub: '+3.0M YoY', subColor: '#16A34A' },
              { color: '#A5A5A5', label: 'US Production', value: '13.6M', unit: 'bbl/day', sub: 'Plateau', subColor: '#595959' },
            ].map((kpi, i) => (
              <div key={i} className="px-1.5 py-1.5" style={kpiStyle}>
                <div className="flex items-center gap-1 mb-0.5">
                  <div style={{ width: '4px', height: '4px', background: kpi.color }} />
                  <span className="text-[4.5px] font-semibold" style={{ color: NAVY }}>{kpi.label}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold" style={{ color: NAVY }}>{kpi.value}</span>
                  <span className="text-[3.5px] ml-0.5" style={{ color: '#595959' }}>{kpi.unit}</span>
                </div>
                <div className="text-[3.5px]" style={{ color: kpi.subColor }}>{kpi.sub}</div>
              </div>
            ))}
          </div>
          <div className="flex-1 flex gap-2.5 min-h-0 min-w-0">
            <div className="flex items-center" style={{ width: '185px', flexShrink: 0 }}>
              <svg viewBox="0 0 150 120" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                <rect x="25" y="5" width="105" height="80" fill="#F2F2F2" />
                {[5, 25, 45, 65, 85].map(y => (
                  <line key={y} x1="25" y1={y} x2="130" y2={y} stroke="#D9D9D9" strokeWidth="0.4" />
                ))}
                <text x="22" y="8" textAnchor="end" fontSize="4.5" fill="#595959" fontFamily="Calibri, sans-serif">108</text>
                <text x="22" y="28" textAnchor="end" fontSize="4.5" fill="#595959" fontFamily="Calibri, sans-serif">104</text>
                <text x="22" y="48" textAnchor="end" fontSize="4.5" fill="#595959" fontFamily="Calibri, sans-serif">100</text>
                <text x="22" y="68" textAnchor="end" fontSize="4.5" fill="#595959" fontFamily="Calibri, sans-serif">96</text>
                <line x1="25" y1="5" x2="25" y2="85" stroke="#808080" strokeWidth="0.5" />
                <line x1="25" y1="85" x2="130" y2="85" stroke="#808080" strokeWidth="0.5" />
                {[5, 25, 45, 65, 85].map(y => (
                  <line key={`t${y}`} x1="22" y1={y} x2="25" y2={y} stroke="#808080" strokeWidth="0.5" />
                ))}
                <rect x="35" y="51" width="12" height="34" fill="#4472C4" />
                <rect x="49" y="50" width="12" height="35" fill="#ED7D31" />
                <rect x="70" y="34.5" width="12" height="50.5" fill="#4472C4" />
                <rect x="84" y="42.5" width="12" height="42.5" fill="#ED7D31" />
                <rect x="105" y="19" width="12" height="66" fill="#4472C4" />
                <rect x="119" y="34.5" width="12" height="50.5" fill="#ED7D31" />
                <text x="41" y="48" textAnchor="middle" fontSize="4" fill="#595959" fontFamily="Calibri, sans-serif">102.8</text>
                <text x="55" y="47" textAnchor="middle" fontSize="4" fill="#595959" fontFamily="Calibri, sans-serif">103.0</text>
                <text x="76" y="31.5" textAnchor="middle" fontSize="4" fill="#595959" fontFamily="Calibri, sans-serif">104.5</text>
                <text x="90" y="39.5" textAnchor="middle" fontSize="4" fill="#595959" fontFamily="Calibri, sans-serif">103.7</text>
                <text x="111" y="16" textAnchor="middle" fontSize="4" fill="#595959" fontFamily="Calibri, sans-serif">106.1</text>
                <text x="125" y="31.5" textAnchor="middle" fontSize="4" fill="#595959" fontFamily="Calibri, sans-serif">104.5</text>
                <line x1="132" y1="19" x2="136" y2="19" stroke="#808080" strokeWidth="0.4" />
                <line x1="136" y1="19" x2="136" y2="34.5" stroke="#808080" strokeWidth="0.4" />
                <line x1="132" y1="34.5" x2="136" y2="34.5" stroke="#808080" strokeWidth="0.4" />
                <line x1="136" y1="26.5" x2="140" y2="26.5" stroke="#808080" strokeWidth="0.4" />
                <polygon points="140,26.5 138,25.3 138,27.7" fill="#808080" />
                <text x="142" y="25" fontSize="3.5" fill="#DC2626" fontFamily="Calibri, sans-serif" fontWeight="600">+1.6M</text>
                <text x="142" y="29" fontSize="3.5" fill="#DC2626" fontFamily="Calibri, sans-serif" fontWeight="600">surplus</text>
                <text x="48" y="93" textAnchor="middle" fontSize="4.5" fill="#595959" fontFamily="Calibri, sans-serif">2024</text>
                <text x="83" y="93" textAnchor="middle" fontSize="4.5" fill="#595959" fontFamily="Calibri, sans-serif">2025</text>
                <text x="118" y="93" textAnchor="middle" fontSize="4.5" fill="#595959" fontFamily="Calibri, sans-serif">2026E</text>
                <rect x="40" y="100" width="5" height="5" fill="#4472C4" />
                <text x="48" y="104" fontSize="4" fill="#595959" fontFamily="Calibri, sans-serif">Supply</text>
                <rect x="78" y="100" width="5" height="5" fill="#ED7D31" />
                <text x="86" y="104" fontSize="4" fill="#595959" fontFamily="Calibri, sans-serif">Demand</text>
                <text x="77" y="114" textAnchor="middle" fontSize="4" fill="#808080" fontFamily="Calibri, sans-serif">Global Liquids (M bbl/day)</text>
              </svg>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-x-3 gap-y-0 min-h-0" style={{ alignContent: 'stretch' }}>
              {[
                { title: 'OPEC+ Strategy', text: 'Unwinding 2.2M bbl/day of voluntary cuts from April 2026, adding 206K bbl/day initially. Saudi Arabia accepting lower prices to defend market share.' },
                { title: 'Non-OPEC+ Growth', text: 'Adding +1.6M bbl/day in 2025 led by US, Brazil, Guyana, Canada. Moderating as shale capex discipline persists across basins.' },
                { title: 'Asian Demand Drivers', text: 'China and India ~60% of global demand growth. Indian refinery capacity expanding +0.5M bbl/day through 2027, supporting crude intake.' },
                { title: 'Geopolitical Risk', text: 'Middle East tensions added $8\u201312/bbl risk premium. IEA released 400M barrels from strategic reserves. Red Sea freight costs +30\u201340%.' },
                { title: 'Energy Transition', text: 'EVs reducing demand growth by ~0.3M bbl/day annually. 25% of new car sales now electric. Aviation & petchem remain growth sectors.' },
                { title: 'Price Outlook', text: 'Brent forecast above $95/bbl near-term, declining to ~$70/bbl by year-end as supply surplus materializes if OPEC+ fully unwinds cuts.' },
                { title: 'SPR & Inventories', text: 'Strategic reserves at multi-decade lows after emergency releases. OECD commercial stocks 120M barrels below 5-year average. Limited buffer.' },
                { title: 'Refining Margins', text: 'Global refining capacity additions of 1.4M bbl/day in 2025\u201326 concentrated in Middle East and Asia. Atlantic basin margins under pressure.' },
              ].map((box, i) => (
                <div key={i} className="flex flex-col justify-start pt-1">
                  <div className="text-[5.5px] font-bold mb-0.5" style={{ color: NAVY }}>{box.title}</div>
                  <div className="text-[4.5px] leading-[1.5]" style={{ color: '#404040' }}>{box.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="px-4 pb-0.5">
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
        <div className="px-6 py-2.5" style={{ background: NAVY }}>
          <h3 className="text-[12px] font-semibold text-white">Price Trends & Forecast</h3>
        </div>
        <div style={{ height: '2px', background: GOLD }} />
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
        <div className="flex-1 flex items-center justify-center px-6 pb-3">
          <svg viewBox="0 0 250 95" className="w-full">
            <rect x="30" y="5" width="205" height="60" fill="#F2F2F2" />
            {[5, 20, 35, 50, 65].map(y => (
              <line key={y} x1="30" y1={y} x2="235" y2={y} stroke="#D9D9D9" strokeWidth="0.5" />
            ))}
            <text x="27" y="8" textAnchor="end" fontSize="5" fill="#595959" fontFamily="Calibri, sans-serif">$95</text>
            <text x="27" y="23" textAnchor="end" fontSize="5" fill="#595959" fontFamily="Calibri, sans-serif">$85</text>
            <text x="27" y="38" textAnchor="end" fontSize="5" fill="#595959" fontFamily="Calibri, sans-serif">$75</text>
            <text x="27" y="53" textAnchor="end" fontSize="5" fill="#595959" fontFamily="Calibri, sans-serif">$65</text>
            <text x="27" y="68" textAnchor="end" fontSize="5" fill="#595959" fontFamily="Calibri, sans-serif">$55</text>
            <line x1="30" y1="5" x2="30" y2="65" stroke="#808080" strokeWidth="0.6" />
            <line x1="30" y1="65" x2="235" y2="65" stroke="#808080" strokeWidth="0.6" />
            {[5, 20, 35, 50, 65].map(y => (
              <line key={y} x1="27" y1={y} x2="30" y2={y} stroke="#808080" strokeWidth="0.6" />
            ))}
            <polyline points="47,42 81,45 115,35 149,30 183,22 217,18" fill="none" stroke="#4472C4" strokeWidth="1.5" />
            {[[47,42],[81,45],[115,35],[149,30],[183,22],[217,18]].map(([cx,cy], i) => (
              <rect key={i} x={cx-2} y={cy-2} width="4" height="4" fill="#4472C4" />
            ))}
            <polyline points="47,48 81,50 115,42 149,37 183,30 217,26" fill="none" stroke="#ED7D31" strokeWidth="1.5" />
            {[[47,48],[81,50],[115,42],[149,37],[183,30],[217,26]].map(([cx,cy], i) => (
              <rect key={i} x={cx-2} y={cy-2} width="4" height="4" fill="#ED7D31" />
            ))}
            {['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'].map((m, i) => (
              <text key={m} x={47 + i * 34} y="73" textAnchor="middle" fontSize="5" fill="#595959" fontFamily="Calibri, sans-serif">{m}</text>
            ))}
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

export const frenchSlide2: SlideContent = {
  title: 'Offre & Demande',
  render: () => {
    const kpiStyle = { background: '#F2F2F2', border: '1px solid #D9D9D9' }
    return (
    <div className="flex flex-col h-full" style={{ background: '#FFFFFF', fontFamily: "Calibri, 'Inter', sans-serif" }}>
      <div className="px-5 py-2" style={{ background: NAVY }}>
        <h3 className="text-[11px] font-semibold text-white">{"Vue d'ensemble Offre & Demande"}</h3>
      </div>
      <div style={{ height: '2px', background: GOLD }} />
      <div className="flex flex-1 px-4 pt-2 pb-1 gap-2 min-h-0">
        <div className="flex flex-col gap-1.5 justify-start pt-0.5" style={{ width: '80px', flexShrink: 0 }}>
          {[
            { color: '#4472C4', label: 'Demande mondiale', value: '104,5M', unit: 'bbl/j', sub: '+0,9M sur un an', subColor: '#16A34A' },
            { color: '#ED7D31', label: 'Offre mondiale', value: '106,1M', unit: 'bbl/j', sub: '+3,0M sur un an', subColor: '#16A34A' },
            { color: '#A5A5A5', label: 'Prod. US', value: '13,6M', unit: 'bbl/j', sub: 'Plateau', subColor: '#595959' },
          ].map((kpi, i) => (
            <div key={i} className="px-1.5 py-1.5" style={kpiStyle}>
              <div className="flex items-center gap-1 mb-0.5">
                <div style={{ width: '4px', height: '4px', background: kpi.color }} />
                <span className="text-[4.5px] font-semibold" style={{ color: NAVY }}>{kpi.label}</span>
              </div>
              <div>
                <span className="text-[9px] font-bold" style={{ color: NAVY }}>{kpi.value}</span>
                <span className="text-[3.5px] ml-0.5" style={{ color: '#595959' }}>{kpi.unit}</span>
              </div>
              <div className="text-[3.5px]" style={{ color: kpi.subColor }}>{kpi.sub}</div>
            </div>
          ))}
        </div>
        <div className="flex-1 flex gap-2.5 min-h-0 min-w-0">
          <div className="flex items-center" style={{ width: '185px', flexShrink: 0 }}>
            <svg viewBox="0 0 150 120" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
              <rect x="25" y="5" width="105" height="80" fill="#F2F2F2" />
              {[5, 25, 45, 65, 85].map(y => (<line key={y} x1="25" y1={y} x2="130" y2={y} stroke="#D9D9D9" strokeWidth="0.4" />))}
              <text x="22" y="8" textAnchor="end" fontSize="4.5" fill="#595959" fontFamily="Calibri, sans-serif">108</text>
              <text x="22" y="28" textAnchor="end" fontSize="4.5" fill="#595959" fontFamily="Calibri, sans-serif">104</text>
              <text x="22" y="48" textAnchor="end" fontSize="4.5" fill="#595959" fontFamily="Calibri, sans-serif">100</text>
              <text x="22" y="68" textAnchor="end" fontSize="4.5" fill="#595959" fontFamily="Calibri, sans-serif">96</text>
              <line x1="25" y1="5" x2="25" y2="85" stroke="#808080" strokeWidth="0.5" />
              <line x1="25" y1="85" x2="130" y2="85" stroke="#808080" strokeWidth="0.5" />
              {[5, 25, 45, 65, 85].map(y => (<line key={`t${y}`} x1="22" y1={y} x2="25" y2={y} stroke="#808080" strokeWidth="0.5" />))}
              <rect x="35" y="51" width="12" height="34" fill="#4472C4" />
              <rect x="49" y="50" width="12" height="35" fill="#ED7D31" />
              <rect x="70" y="34.5" width="12" height="50.5" fill="#4472C4" />
              <rect x="84" y="42.5" width="12" height="42.5" fill="#ED7D31" />
              <rect x="105" y="19" width="12" height="66" fill="#4472C4" />
              <rect x="119" y="34.5" width="12" height="50.5" fill="#ED7D31" />
              <text x="41" y="48" textAnchor="middle" fontSize="4" fill="#595959" fontFamily="Calibri, sans-serif">102,8</text>
              <text x="55" y="47" textAnchor="middle" fontSize="4" fill="#595959" fontFamily="Calibri, sans-serif">103,0</text>
              <text x="76" y="31.5" textAnchor="middle" fontSize="4" fill="#595959" fontFamily="Calibri, sans-serif">104,5</text>
              <text x="90" y="39.5" textAnchor="middle" fontSize="4" fill="#595959" fontFamily="Calibri, sans-serif">103,7</text>
              <text x="111" y="16" textAnchor="middle" fontSize="4" fill="#595959" fontFamily="Calibri, sans-serif">106,1</text>
              <text x="125" y="31.5" textAnchor="middle" fontSize="4" fill="#595959" fontFamily="Calibri, sans-serif">104,5</text>
              <line x1="132" y1="19" x2="136" y2="19" stroke="#808080" strokeWidth="0.4" />
              <line x1="136" y1="19" x2="136" y2="34.5" stroke="#808080" strokeWidth="0.4" />
              <line x1="132" y1="34.5" x2="136" y2="34.5" stroke="#808080" strokeWidth="0.4" />
              <line x1="136" y1="26.5" x2="140" y2="26.5" stroke="#808080" strokeWidth="0.4" />
              <polygon points="140,26.5 138,25.3 138,27.7" fill="#808080" />
              <text x="142" y="25" fontSize="3.5" fill="#DC2626" fontFamily="Calibri, sans-serif" fontWeight="600">+1,6M</text>
              <text x="142" y="29" fontSize="3.5" fill="#DC2626" fontFamily="Calibri, sans-serif" fontWeight="600">{"excédent"}</text>
              <text x="48" y="93" textAnchor="middle" fontSize="4.5" fill="#595959" fontFamily="Calibri, sans-serif">2024</text>
              <text x="83" y="93" textAnchor="middle" fontSize="4.5" fill="#595959" fontFamily="Calibri, sans-serif">2025</text>
              <text x="118" y="93" textAnchor="middle" fontSize="4.5" fill="#595959" fontFamily="Calibri, sans-serif">2026E</text>
              <rect x="40" y="100" width="5" height="5" fill="#4472C4" />
              <text x="48" y="104" fontSize="4" fill="#595959" fontFamily="Calibri, sans-serif">Offre</text>
              <rect x="78" y="100" width="5" height="5" fill="#ED7D31" />
              <text x="86" y="104" fontSize="4" fill="#595959" fontFamily="Calibri, sans-serif">Demande</text>
              <text x="77" y="114" textAnchor="middle" fontSize="4" fill="#808080" fontFamily="Calibri, sans-serif">Liquides mondiaux (M bbl/j)</text>
            </svg>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-x-3 gap-y-0 min-h-0" style={{ alignContent: 'stretch' }}>
            {[
              { title: 'Stratégie OPEP+', text: "Levée de 2,2M bbl/j de réductions volontaires à partir d'avril 2026. L'Arabie saoudite accepte des prix plus bas pour défendre ses parts de marché." },
              { title: 'Croissance hors OPEP+', text: "+1,6M bbl/j en 2025 menés par les États-Unis, le Brésil, le Guyana et le Canada. Modération avec la discipline budgétaire." },
              { title: 'Demande asiatique', text: "Chine et Inde ~60 % de la croissance. Capacité de raffinage indienne +0,5M bbl/j d'ici 2027." },
              { title: 'Risque géopolitique', text: "Tensions au Moyen-Orient : prime de 8–12 $/bbl. AIE : libération de 400M de barils. Fret mer Rouge +30–40 %." },
              { title: 'Transition énergétique', text: "VE : -0,3M bbl/j de croissance par an. 25 % des ventes neuves électriques. Aviation et pétrochimie restent moteurs." },
              { title: 'Perspectives de prix', text: "Brent >95 $/bbl à court terme, baisse vers ~70 $/bbl en fin d'année si l'OPEP+ lève ses réductions." },
              { title: 'RSP & Stocks', text: "Réserves stratégiques au plus bas historique. Stocks OCDE -120M bbl vs moyenne 5 ans. Marge limitée." },
              { title: 'Marges de raffinage', text: "Capacité +1,4M bbl/j en 2025–26, concentrée Moyen-Orient et Asie. Bassin atlantique sous pression." },
            ].map((box, i) => (
              <div key={i} className="flex flex-col justify-start pt-1">
                <div className="text-[5.5px] font-bold mb-0.5" style={{ color: NAVY }}>{box.title}</div>
                <div className="text-[4.5px] leading-[1.5]" style={{ color: '#404040' }}>{box.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="px-4 pb-0.5">
        <span className="text-[3.5px]" style={{ color: '#A0A0A0' }}>{"Source : Rapport sur le marché pétrolier de l'AIE, EIA STEO — Mars 2026"}</span>
      </div>
    </div>
    )
  },
}
