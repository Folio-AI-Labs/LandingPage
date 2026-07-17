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

// Real slides exported from the McKinsey State of AI deck (1:1 with deck pages).
// Index 0..7 == deck pages 1..8. The edit demo morphs the active slide
// (index 2 = page 3) into index 3 (page 4) then index 4 (page 5); those two
// are kept out of the initial rail so no thumbnail is ever shown twice.
export const editSlides: SlideContent[] = [
  imageSlide('/decks/stateofai/slide-01.webp', 'The State of AI: How Organizations Are Rewiring to Capture Value'),
  imageSlide('/decks/stateofai/slide-02.webp', 'AI Adoption Has Accelerated Markedly'),
  imageSlide('/decks/stateofai/slide-03.webp', 'Value Starts with Rewiring How the Company Runs'),
  imageSlide('/decks/stateofai/slide-04.webp', 'Governance Centralizes; Talent and Adoption Stay Hybrid'),
  imageSlide('/decks/stateofai/slide-05.webp', 'Business-Unit Gains Are Rising, but Enterprise EBIT Lags'),
  imageSlide('/decks/stateofai/slide-06.webp', 'Risk Mitigation Is Expanding, but Oversight Is Uneven'),
  imageSlide('/decks/stateofai/slide-07.webp', 'AI Is Reshaping Skills Faster Than Head Count'),
  imageSlide('/decks/stateofai/slide-08.webp', 'What Leaders Should Do Next'),
]
