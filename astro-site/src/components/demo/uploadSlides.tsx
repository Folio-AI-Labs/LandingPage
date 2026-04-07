import React from 'react'

export interface SlideContent {
  title: string
  render: () => React.ReactNode
}

// Red theme colors for upload demo
const RED = '#C62828'      // Deep red
const CRIMSON = '#D32F2F'  // Medium red
const SCARLET = '#E53935'  // Bright red
const ROSE = '#EF5350'     // Light red

// Original logo: Globe icon (updated)

const OldLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="#455A64" strokeWidth="2" fill="none"/>
    <path d="M12 3C12 3 15 7 15 12C15 17 12 21 12 21" stroke="#455A64" strokeWidth="2"/>
    <path d="M12 3C12 3 9 7 9 12C9 17 12 21 12 21" stroke="#455A64" strokeWidth="2"/>
    <path d="M3 12H21" stroke="#455A64" strokeWidth="2"/>
    <path d="M5 8H19" stroke="#455A64" strokeWidth="2"/>
    <path d="M5 16H19" stroke="#455A64" strokeWidth="2"/>
  </svg>
)

// New logo: Paperplane icon
const NewLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 3L21 12L3 21L6 12L3 3Z" fill="url(#gradient)" stroke="url(#gradient)" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M6 12H14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <defs>
      <linearGradient id="gradient" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#667eea"/>
        <stop offset="100%" stopColor="#764ba2"/>
      </linearGradient>
    </defs>
  </svg>
)

export const uploadSlides: SlideContent[] = [
  // Slide 0: Title slide - OLD LOGO
  {
    title: 'Title Slide',
    render: () => (
      <div className="flex flex-col justify-between h-full" style={{ background: RED, fontFamily: "Calibri, 'Inter', sans-serif" }}>
        <div style={{ height: '3px', background: `linear-gradient(90deg, ${ROSE}, ${ROSE}80, transparent)` }} />
        <div className="flex flex-col items-start px-8">
          <div className="flex items-center gap-2 mb-3">
            <OldLogo />
            <div className="text-[6px] font-medium tracking-[0.25em] uppercase" style={{ color: ROSE }}>
              Acme Corporation
            </div>
          </div>
          <h3 className="text-[18px] font-bold text-white mb-1.5 leading-tight" style={{ letterSpacing: '-0.01em' }}>
            Company<br />Overview 2026
          </h3>
          <div className="w-8 mt-2 mb-3" style={{ height: '1.5px', background: ROSE }} />
          <p className="text-[8px] font-normal" style={{ color: '#FFCDD2' }}>
            Strategic Vision & Market Position
          </p>
        </div>
        <div className="flex items-center justify-between px-10 py-3" style={{ borderTop: '1px solid #D32F2F' }}>
          <span className="text-[7px] font-medium tracking-wider uppercase" style={{ color: '#EF9A9A' }}>Confidential</span>
          <span className="text-[7px]" style={{ color: '#EF9A9A' }}>March 2026</span>
        </div>
      </div>
    ),
  },
  // Slide 1: Mission - OLD LOGO
  {
    title: 'Our Mission',
    render: () => (
      <div className="flex flex-col h-full" style={{ background: '#FFFFFF', fontFamily: "Calibri, 'Inter', sans-serif" }}>
        <div className="flex items-center justify-between px-5 py-2">
          <div className="flex items-center gap-2">
            <div style={{ width: '30px', height: '3px', background: RED, borderRadius: '1.5px', flexShrink: 0 }} />
            <h3 className="text-[11px] font-semibold" style={{ color: '#333' }}>Our Mission</h3>
          </div>
          <OldLogo />
        </div>

        <div className="flex flex-col flex-1 px-6 pt-4 pb-2 justify-center">
          <div className="text-center mb-4">
            <div className="text-[9px] font-bold leading-tight mb-2" style={{ color: RED }}>
              "Empowering businesses through innovative technology solutions"
            </div>
            <div className="text-[5px] italic" style={{ color: '#9E9E9E' }}>
              — Since 2010
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-2">
            {[
              { icon: '🎯', title: 'Innovation', desc: 'Cutting-edge solutions for modern challenges' },
              { icon: '🤝', title: 'Partnership', desc: 'Building long-term relationships' },
              { icon: '🌍', title: 'Global Reach', desc: 'Serving clients in 50+ countries' },
            ].map((item, i) => (
              <div key={i} className="text-center px-2">
                <div className="text-[14px] mb-1">{item.icon}</div>
                <div className="text-[6px] font-bold mb-0.5" style={{ color: RED }}>{item.title}</div>
                <div className="text-[4.5px] leading-[1.4]" style={{ color: '#616161' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  // Slide 2: Team - OLD LOGO
  {
    title: 'Leadership Team',
    render: () => (
      <div className="flex flex-col h-full" style={{ background: '#FFFFFF', fontFamily: "Calibri, 'Inter', sans-serif" }}>
        <div className="flex items-center justify-between px-5 py-2">
          <div className="flex items-center gap-2">
            <div style={{ width: '30px', height: '3px', background: RED, borderRadius: '1.5px', flexShrink: 0 }} />
            <h3 className="text-[11px] font-semibold" style={{ color: '#333' }}>Leadership Team</h3>
          </div>
          <OldLogo />
        </div>

        <div className="flex flex-1 px-6 pt-3 pb-2 gap-3">
          {[
            { name: 'Sarah Chen', role: 'CEO & Founder', bg: RED },
            { name: 'Michael Ross', role: 'CTO', bg: CRIMSON },
            { name: 'Emily Zhang', role: 'CFO', bg: SCARLET },
          ].map((person, i) => (
            <div key={i} className="flex-1 flex flex-col">
              <div className="aspect-square rounded-lg mb-2" style={{ background: person.bg, width: '100%' }} />
              <div className="text-[6px] font-bold" style={{ color: RED }}>{person.name}</div>
              <div className="text-[5px]" style={{ color: '#757575' }}>{person.role}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  // Slide 3: Revenue Analysis - OLD LOGO
  {
    title: 'Revenue Analysis',
    render: () => (
      <div className="flex flex-col h-full" style={{ background: '#FFFFFF', fontFamily: "Calibri, 'Inter', sans-serif" }}>
        <div className="flex items-center justify-between px-5 py-2">
          <div className="flex items-center gap-2">
            <div style={{ width: '30px', height: '3px', background: RED, borderRadius: '1.5px', flexShrink: 0 }} />
            <h3 className="text-[11px] font-semibold" style={{ color: '#333' }}>Revenue Analysis 2025</h3>
          </div>
          <OldLogo />
        </div>

        <div className="flex flex-1 px-6 pt-3 pb-2 gap-3">
          <div className="flex-1">
            <svg viewBox="0 0 180 90" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
              <text x="90" y="8" textAnchor="middle" fontSize="5" fontWeight="700" fill={RED} fontFamily="Calibri, sans-serif">Quarterly Revenue Growth</text>
              {[20, 35, 50, 65, 80].map(y => (
                <line key={y} x1="25" y1={y} x2="160" y2={y} stroke="#E0E0E0" strokeWidth="0.4" />
              ))}
              <line x1="25" y1="20" x2="25" y2="80" stroke="#808080" strokeWidth="0.5" />
              <line x1="25" y1="80" x2="160" y2="80" stroke="#808080" strokeWidth="0.5" />
              <rect x="35" y="60" width="20" height="20" fill={RED} />
              <rect x="65" y="52" width="20" height="28" fill={CRIMSON} />
              <rect x="95" y="42" width="20" height="38" fill={SCARLET} />
              <rect x="125" y="32" width="20" height="48" fill={ROSE} />
              <text x="45" y="57" textAnchor="middle" fontSize="4" fill="#595959" fontFamily="Calibri, sans-serif">$42M</text>
              <text x="75" y="49" textAnchor="middle" fontSize="4" fill="#595959" fontFamily="Calibri, sans-serif">$58M</text>
              <text x="105" y="39" textAnchor="middle" fontSize="4" fill="#595959" fontFamily="Calibri, sans-serif">$71M</text>
              <text x="135" y="29" textAnchor="middle" fontSize="4" fill="#595959" fontFamily="Calibri, sans-serif">$89M</text>
              {['Q1', 'Q2', 'Q3', 'Q4'].map((q, i) => (
                <text key={q} x={45 + i * 30} y="88" textAnchor="middle" fontSize="4.5" fill="#595959" fontFamily="Calibri, sans-serif">{q}</text>
              ))}
            </svg>
          </div>
        </div>
      </div>
    ),
  },
  // Slide 4: Products - OLD LOGO
  {
    title: 'Product Portfolio',
    render: () => (
      <div className="flex flex-col h-full" style={{ background: '#FFFFFF', fontFamily: "Calibri, 'Inter', sans-serif" }}>
        <div className="flex items-center justify-between px-5 py-2">
          <div className="flex items-center gap-2">
            <div style={{ width: '30px', height: '3px', background: RED, borderRadius: '1.5px', flexShrink: 0 }} />
            <h3 className="text-[11px] font-semibold" style={{ color: '#333' }}>Product Portfolio</h3>
          </div>
          <OldLogo />
        </div>

        <div className="flex flex-1 px-6 pt-3 pb-2">
          <div className="grid grid-cols-2 gap-3 flex-1">
            {[
              { name: 'Product A', revenue: '$32M', growth: '+45%' },
              { name: 'Product B', revenue: '$28M', growth: '+38%' },
              { name: 'Product C', revenue: '$19M', growth: '+52%' },
              { name: 'Product D', revenue: '$10M', growth: '+61%' },
            ].map((product, i) => (
              <div key={i} className="flex flex-col justify-center px-3 py-2" style={{ background: '#FFF5F5', border: `1.5px solid ${ROSE}` }}>
                <div className="text-[6px] font-bold" style={{ color: RED }}>{product.name}</div>
                <div className="text-[8px] font-bold" style={{ color: CRIMSON }}>{product.revenue}</div>
                <div className="text-[4.5px]" style={{ color: '#66BB6A' }}>{product.growth} YoY</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  // Slide 5: Innovation Lab - OLD LOGO
  {
    title: 'Innovation Lab',
    render: () => (
      <div className="flex flex-col h-full" style={{ background: '#FFFFFF', fontFamily: "Calibri, 'Inter', sans-serif" }}>
        <div className="flex items-center justify-between px-5 py-2">
          <div className="flex items-center gap-2">
            <div style={{ width: '30px', height: '3px', background: RED, borderRadius: '1.5px', flexShrink: 0 }} />
            <h3 className="text-[11px] font-semibold" style={{ color: '#333' }}>Innovation Lab Projects</h3>
          </div>
          <OldLogo />
        </div>

        <div className="flex flex-1 px-6 pt-3 pb-2">
          <div className="flex flex-col gap-2 flex-1">
            {[
              { name: 'AI Research', status: 'Active', progress: '75%' },
              { name: 'Blockchain', status: 'Testing', progress: '60%' },
              { name: 'IoT Platform', status: 'Planning', progress: '30%' },
            ].map((project, i) => (
              <div key={i} className="px-3 py-2" style={{ background: '#FFF5F5', border: `1px solid ${ROSE}` }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="text-[6px] font-bold" style={{ color: RED }}>{project.name}</div>
                  <div className="text-[5px]" style={{ color: '#757575' }}>{project.status}</div>
                </div>
                <div className="text-[5px] text-right" style={{ color: CRIMSON }}>{project.progress}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  // Slide 6: Employee Stats - OLD LOGO
  {
    title: 'Employee Statistics',
    render: () => (
      <div className="flex flex-col h-full" style={{ background: '#FFFFFF', fontFamily: "Calibri, 'Inter', sans-serif" }}>
        <div className="flex items-center justify-between px-5 py-2">
          <div className="flex items-center gap-2">
            <div style={{ width: '30px', height: '3px', background: RED, borderRadius: '1.5px', flexShrink: 0 }} />
            <h3 className="text-[11px] font-semibold" style={{ color: '#333' }}>Employee Statistics</h3>
          </div>
          <OldLogo />
        </div>

        <div className="flex flex-1 px-6 pt-3 pb-2 items-center justify-center">
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="text-center">
              <div className="text-[24px] font-bold" style={{ color: RED }}>1,200+</div>
              <div className="text-[5px]" style={{ color: '#757575' }}>Total Employees</div>
            </div>
            <div className="text-center">
              <div className="text-[24px] font-bold" style={{ color: RED }}>85%</div>
              <div className="text-[5px]" style={{ color: '#757575' }}>Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  // Slide 7: Global Offices - OLD LOGO
  {
    title: 'Global Offices',
    render: () => (
      <div className="flex flex-col h-full" style={{ background: '#FFFFFF', fontFamily: "Calibri, 'Inter', sans-serif" }}>
        <div className="flex items-center justify-between px-5 py-2">
          <div className="flex items-center gap-2">
            <div style={{ width: '30px', height: '3px', background: RED, borderRadius: '1.5px', flexShrink: 0 }} />
            <h3 className="text-[11px] font-semibold" style={{ color: '#333' }}>Global Office Locations</h3>
          </div>
          <OldLogo />
        </div>

        <div className="flex flex-1 px-6 pt-3 pb-2">
          <div className="grid grid-cols-2 gap-2 flex-1">
            {['San Francisco 🇺🇸', 'London 🇬🇧', 'Tokyo 🇯🇵', 'Sydney 🇦🇺', 'Berlin 🇩🇪', 'Toronto 🇨🇦'].map((office, i) => (
              <div key={i} className="px-3 py-2 text-center" style={{ background: '#FFF5F5', border: `1px solid ${ROSE}` }}>
                <div className="text-[6px] font-bold" style={{ color: RED }}>{office}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  // Slide 8: Awards - OLD LOGO
  {
    title: 'Awards & Recognition',
    render: () => (
      <div className="flex flex-col h-full" style={{ background: '#FFFFFF', fontFamily: "Calibri, 'Inter', sans-serif" }}>
        <div className="flex items-center justify-between px-5 py-2">
          <div className="flex items-center gap-2">
            <div style={{ width: '30px', height: '3px', background: RED, borderRadius: '1.5px', flexShrink: 0 }} />
            <h3 className="text-[11px] font-semibold" style={{ color: '#333' }}>Awards & Recognition</h3>
          </div>
          <OldLogo />
        </div>

        <div className="flex flex-1 px-6 pt-3 pb-2 items-center justify-center">
          <div className="flex flex-col gap-2 flex-1">
            {[
              { award: 'Best Tech Company 2025', org: 'Tech Awards' },
              { award: 'Innovation Leader', org: 'Industry Week' },
              { award: 'Top Workplace', org: 'Fortune' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2" style={{ background: '#FFF5F5', border: `1px solid ${ROSE}` }}>
                <span className="text-[8px]">🏆</span>
                <div className="flex-1">
                  <div className="text-[6px] font-bold" style={{ color: RED }}>{item.award}</div>
                  <div className="text-[5px]" style={{ color: '#757575' }}>{item.org}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  // Slide 9: Community Impact - OLD LOGO
  {
    title: 'Community Impact',
    render: () => (
      <div className="flex flex-col h-full" style={{ background: '#FFFFFF', fontFamily: "Calibri, 'Inter', sans-serif" }}>
        <div className="flex items-center justify-between px-5 py-2">
          <div className="flex items-center gap-2">
            <div style={{ width: '30px', height: '3px', background: RED, borderRadius: '1.5px', flexShrink: 0 }} />
            <h3 className="text-[11px] font-semibold" style={{ color: '#333' }}>Community Impact</h3>
          </div>
          <OldLogo />
        </div>

        <div className="flex flex-1 px-6 pt-3 pb-2">
          <div className="grid grid-cols-2 gap-3 flex-1">
            {[
              { metric: 'Volunteer Hours', value: '10,000+' },
              { metric: 'Donations', value: '$2M' },
              { metric: 'Scholarships', value: '150' },
              { metric: 'Local Programs', value: '25' },
            ].map((item, i) => (
              <div key={i} className="px-3 py-2 text-center" style={{ background: '#FFF5F5', border: `1px solid ${ROSE}` }}>
                <div className="text-[10px] font-bold mb-0.5" style={{ color: RED }}>{item.value}</div>
                <div className="text-[5px]" style={{ color: '#757575' }}>{item.metric}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  // Slides 10-12: NEW logo versions of slides 0, 1, 2 (for logo replacement animation)
  // Slide 10: Title slide - NEW LOGO (replacement for slide 0)
  {
    title: 'Title Slide',
    render: () => (
      <div className="flex flex-col justify-between h-full" style={{ background: RED, fontFamily: "Calibri, 'Inter', sans-serif" }}>
        <div style={{ height: '3px', background: `linear-gradient(90deg, ${ROSE}, ${ROSE}80, transparent)` }} />
        <div className="flex flex-col items-start px-8">
          <div className="flex items-center gap-2 mb-3">
            <NewLogo />
            <div className="text-[6px] font-medium tracking-[0.25em] uppercase" style={{ color: ROSE }}>
              Acme Corporation
            </div>
          </div>
          <h3 className="text-[18px] font-bold text-white mb-1.5 leading-tight" style={{ letterSpacing: '-0.01em' }}>
            Company<br />Overview 2026
          </h3>
          <div className="w-8 mt-2 mb-3" style={{ height: '1.5px', background: ROSE }} />
          <p className="text-[8px] font-normal" style={{ color: '#FFCDD2' }}>
            Strategic Vision & Market Position
          </p>
        </div>
        <div className="flex items-center justify-between px-10 py-3" style={{ borderTop: '1px solid #D32F2F' }}>
          <span className="text-[7px] font-medium tracking-wider uppercase" style={{ color: '#EF9A9A' }}>Confidential</span>
          <span className="text-[7px]" style={{ color: '#EF9A9A' }}>March 2026</span>
        </div>
      </div>
    ),
  },
  // Slide 11: Mission - NEW LOGO (replacement for slide 1)
  {
    title: 'Our Mission',
    render: () => (
      <div className="flex flex-col h-full" style={{ background: '#FFFFFF', fontFamily: "Calibri, 'Inter', sans-serif" }}>
        <div className="flex items-center justify-between px-5 py-2">
          <div className="flex items-center gap-2">
            <div style={{ width: '30px', height: '3px', background: RED, borderRadius: '1.5px', flexShrink: 0 }} />
            <h3 className="text-[11px] font-semibold" style={{ color: '#333' }}>Our Mission</h3>
          </div>
          <NewLogo />
        </div>

        <div className="flex flex-col flex-1 px-6 pt-4 pb-2 justify-center">
          <div className="text-center mb-4">
            <div className="text-[9px] font-bold leading-tight mb-2" style={{ color: RED }}>
              "Empowering businesses through innovative technology solutions"
            </div>
            <div className="text-[5px] italic" style={{ color: '#9E9E9E' }}>
              — Since 2010
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-2">
            {[
              { icon: '🎯', title: 'Innovation', desc: 'Cutting-edge solutions for modern challenges' },
              { icon: '🤝', title: 'Partnership', desc: 'Building long-term relationships' },
              { icon: '🌍', title: 'Global Reach', desc: 'Serving clients in 50+ countries' },
            ].map((item, i) => (
              <div key={i} className="text-center px-2">
                <div className="text-[14px] mb-1">{item.icon}</div>
                <div className="text-[6px] font-bold mb-0.5" style={{ color: RED }}>{item.title}</div>
                <div className="text-[4.5px] leading-[1.4]" style={{ color: '#616161' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  // Slide 12: Team - NEW LOGO (replacement for slide 2)
  {
    title: 'Leadership Team',
    render: () => (
      <div className="flex flex-col h-full" style={{ background: '#FFFFFF', fontFamily: "Calibri, 'Inter', sans-serif" }}>
        <div className="flex items-center justify-between px-5 py-2">
          <div className="flex items-center gap-2">
            <div style={{ width: '30px', height: '3px', background: RED, borderRadius: '1.5px', flexShrink: 0 }} />
            <h3 className="text-[11px] font-semibold" style={{ color: '#333' }}>Leadership Team</h3>
          </div>
          <NewLogo />
        </div>

        <div className="flex flex-1 px-6 pt-3 pb-2 gap-3">
          {[
            { name: 'Sarah Chen', role: 'CEO & Founder', bg: RED },
            { name: 'Michael Ross', role: 'CTO', bg: CRIMSON },
            { name: 'Emily Zhang', role: 'CFO', bg: SCARLET },
          ].map((person, i) => (
            <div key={i} className="flex-1 flex flex-col">
              <div className="aspect-square rounded-lg mb-2" style={{ background: person.bg, width: '100%' }} />
              <div className="text-[6px] font-bold" style={{ color: RED }}>{person.name}</div>
              <div className="text-[5px]" style={{ color: '#757575' }}>{person.role}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
]
