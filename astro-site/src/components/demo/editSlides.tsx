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

// Real slides exported from the Draghi report deck (1:1 with deck pages).
// Index 0..9 == deck pages 1..10. The edit demo morphs the active slide
// (index 2 = page 3) into index 3 (page 4) then index 4 (page 5); those two
// are kept out of the initial rail so no thumbnail is ever shown twice.
export const editSlides: SlideContent[] = [
  imageSlide('/decks/draghi/slide-01.png', 'The Future of European Competitiveness'),
  imageSlide('/decks/draghi/slide-02.png', 'Executive Takeaway: An Existential Productivity Challenge'),
  imageSlide('/decks/draghi/slide-03.png', 'The Growth Gap: Productivity Is the Central Weakness'),
  imageSlide('/decks/draghi/slide-04.png', 'Three Shocks to the Old European Growth Model'),
  imageSlide('/decks/draghi/slide-05.png', 'Innovation Gap: Europe Is Strong in Science, Weak at Scale-Up'),
  imageSlide('/decks/draghi/slide-06.png', 'Decarbonisation: Opportunity, If Energy Costs Fall'),
  imageSlide('/decks/draghi/slide-07.png', 'Security & Dependencies: Exposure Is Now a Competitiveness Risk'),
  imageSlide('/decks/draghi/slide-08.png', 'What Blocks Europe: Focus, Resources and Coordination'),
  imageSlide('/decks/draghi/slide-09.png', 'Financing the Transformation: Mobilise Capital at Scale'),
  imageSlide('/decks/draghi/slide-10.png', 'Strategic Agenda: One Coordinated EU Response'),
]
