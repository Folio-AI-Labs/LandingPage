import React from 'react'

export interface SlideContent {
  title: string
  render?: () => React.ReactNode  // Full custom render (for title slides)
  header?: () => React.ReactNode  // Header bar
  body?: () => React.ReactNode    // Body content (viewer wraps in padded container)
}

// Render a real exported slide image, full-bleed into the 16:9 frame.
function imageSlide(src: string, title: string): SlideContent {
  return {
    title,
    render: () => (
      <img
        src={src}
        alt={title}
        loading="lazy"
        className="w-full h-full object-cover"
        style={{ display: 'block' }}
      />
    ),
  }
}

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

// Real slides exported from the Air France–KLM FY2025 deck.
export const evSlides: SlideContent[] = [
  imageSlide('/decks/airfrance/slide-01.png', 'Air France–KLM Group FY2025 Consolidated Financial Statements'),
  imageSlide('/decks/airfrance/slide-02.png', 'FY2025 Financial Highlights: Stronger Earnings, Higher Debt'),
  imageSlide('/decks/airfrance/slide-05.png', 'Profitability: Margin Expansion Across EBITDA and Net Income'),
  imageSlide('/decks/airfrance/slide-06.png', 'Asset Base Deep Dive: Fleet Assets Drive Most Growth'),
  imageSlide('/decks/airfrance/slide-08.png', 'Cash Flow: Operating Cash Generation Funds Most Investment'),
  imageSlide('/decks/airfrance/slide-15.png', 'Risks and Key Takeaways: Stronger Earnings, Active Reinvestment'),
]
