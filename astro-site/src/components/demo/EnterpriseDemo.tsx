import { useState, useEffect, useCallback, useRef } from 'react'
import PresentationViewer from './PresentationViewer'
import ChatPanel from './ChatPanel'
import { makeBlankSlide, type SlideContent } from './slides'
import './demo-styles.css'

// EnterpriseDemo: Shows blank PowerPoint with login panel

const pptUI: Record<string, {
  fileTitle: string
  tabs: string[]
  slideOf: (current: number, total: number) => string
  ready: string
  clickTitle: string
  clickSubtitle: string
  composerPlaceholder: string
}> = {
  en: {
    fileTitle: 'New Presentation.pptx',
    tabs: ['Home', 'Insert', 'Design', 'Transitions', 'Slide Show'],
    slideOf: (c, t) => `Slide ${c} of ${t}`,
    ready: 'Ready',
    clickTitle: 'Click to add title',
    clickSubtitle: 'Click to add subtitle',
    composerPlaceholder: 'Ask Verso to edit your slides',
  },
  fr: {
    fileTitle: 'Nouvelle Présentation.pptx',
    tabs: ['Accueil', 'Insertion', 'Création', 'Transitions', 'Diaporama'],
    slideOf: (c, t) => `Diapositive ${c} sur ${t}`,
    ready: 'Prêt',
    clickTitle: 'Cliquez pour ajouter un titre',
    clickSubtitle: 'Cliquez pour ajouter un sous-titre',
    composerPlaceholder: 'Demandez à Verso de modifier vos slides',
  },
  es: {
    fileTitle: 'Nueva Presentación.pptx',
    tabs: ['Inicio', 'Insertar', 'Diseño', 'Transiciones', 'Presentación con diapositivas'],
    slideOf: (c, t) => `Diapositiva ${c} de ${t}`,
    ready: 'Listo',
    clickTitle: 'Haga clic para agregar título',
    clickSubtitle: 'Haga clic para agregar subtítulo',
    composerPlaceholder: 'Pide a Verso que edite tus diapositivas',
  },
  de: {
    fileTitle: 'Neue Präsentation.pptx',
    tabs: ['Start', 'Einfügen', 'Entwurf', 'Übergänge', 'Bildschirmpräsentation'],
    slideOf: (c, t) => `Folie ${c} von ${t}`,
    ready: 'Bereit',
    clickTitle: 'Titel durch Klicken hinzufügen',
    clickSubtitle: 'Untertitel durch Klicken hinzufügen',
    composerPlaceholder: 'Bitten Sie Verso, Ihre Folien zu bearbeiten',
  },
}

// Google icon
function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

// Microsoft icon
function MicrosoftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="9.5" height="9.5" fill="#F25022"/>
      <rect x="12.5" y="2" width="9.5" height="9.5" fill="#7FBA00"/>
      <rect x="2" y="12.5" width="9.5" height="9.5" fill="#00A4EF"/>
      <rect x="12.5" y="12.5" width="9.5" height="9.5" fill="#FFB900"/>
    </svg>
  )
}

type Phase = 'idle' | 'clicking-microsoft' | 'popup-open' | 'typing-email' | 'typing-password' | 'authenticating' | 'success' | 'closing' | 'showing-verso'

export default function EnterpriseDemo({ lang = 'en' }: { lang?: string }) {
  const ui = pptUI[lang] || pptUI.en

  // Initialize with blank slide immediately to avoid SSR issues
  const blankSlide = makeBlankSlide(ui.clickTitle, ui.clickSubtitle)
  const [slides, setSlides] = useState<SlideContent[]>([blankSlide])
  const [visibleSlides, setVisibleSlides] = useState<number[]>([0])
  const [activeSlide, setActiveSlide] = useState(0)
  const [showPanel, setShowPanel] = useState(true) // Always show the login panel
  const [chatScale, setChatScale] = useState(1) // Panel at full size
  const [phase, setPhase] = useState<Phase>('idle')
  const [showPopup, setShowPopup] = useState(false)
  const [popupEmail, setPopupEmail] = useState('')
  const [popupPassword, setPopupPassword] = useState('')

  const timeoutsRef = useRef<number[]>([])

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
  }, [])

  const schedule = useCallback((fn: () => void, delay: number) => {
    const id = window.setTimeout(fn, delay)
    timeoutsRef.current.push(id)
    return id
  }, [])

  const CHAR_DELAY = 100
  const PAUSE_SHORT = 400
  const PAUSE_MED = 800
  const PAUSE_LONG = 1200

  const runWorkflow = useCallback(() => {
    clearAllTimeouts()
    setPhase('idle')
    setShowPopup(false)
    setPopupEmail('')
    setPopupPassword('')

    let elapsed = 800

    // Click Microsoft button
    elapsed += PAUSE_SHORT
    schedule(() => setPhase('clicking-microsoft'), elapsed)

    // Open popup
    elapsed += PAUSE_MED
    schedule(() => {
      setShowPopup(true)
      setPhase('popup-open')
    }, elapsed)

    // Type email
    elapsed += PAUSE_LONG
    schedule(() => setPhase('typing-email'), elapsed)
    const email = 'user@company.com'
    for (let i = 1; i <= email.length; i++) {
      const ci = i
      schedule(() => setPopupEmail(email.slice(0, ci)), elapsed + i * CHAR_DELAY)
    }
    elapsed += email.length * CHAR_DELAY

    // Type password
    elapsed += PAUSE_MED
    schedule(() => setPhase('typing-password'), elapsed)
    const password = '••••••••'
    for (let i = 1; i <= password.length; i++) {
      const ci = i
      schedule(() => setPopupPassword(password.slice(0, ci)), elapsed + i * CHAR_DELAY)
    }
    elapsed += password.length * CHAR_DELAY

    // Authenticate
    elapsed += PAUSE_MED
    schedule(() => setPhase('authenticating'), elapsed)

    // Success
    elapsed += PAUSE_LONG
    schedule(() => setPhase('success'), elapsed)

    // Close popup
    elapsed += PAUSE_LONG
    schedule(() => {
      setPhase('closing')
      setShowPopup(false)
    }, elapsed)

    // Show Verso chat interface
    elapsed += PAUSE_MED
    schedule(() => {
      setPhase('showing-verso')
    }, elapsed)

    // Hold on Verso interface
    elapsed += PAUSE_LONG * 2

    // Loop
    elapsed += PAUSE_SHORT
    schedule(() => runWorkflow(), elapsed)
  }, [clearAllTimeouts, schedule])

  useEffect(() => {
    runWorkflow()
    return () => clearAllTimeouts()
  }, [runWorkflow, clearAllTimeouts])

  const handleSlideClick = useCallback((index: number) => {
    setActiveSlide(index)
  }, [])

  // Login panel with design from screenshot - styled like UploadFilesDemo
  // Microsoft popup window
  const microsoftPopup = showPopup ? (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '266px',
      background: 'white',
      borderRadius: '6px',
      boxShadow: '0 6px 22px rgba(0,0,0,0.24), 0 1px 6px rgba(0,0,0,0.12)',
      zIndex: 1000,
      padding: '22px 31px',
      fontFamily: 'Inter, sans-serif',
    }}>
      {/* Microsoft logo */}
      <div style={{ textAlign: 'center' as const, marginBottom: '14px', transform: 'scale(0.7)' }}>
        <MicrosoftIcon />
      </div>

      {/* Sign in heading */}
      <h2 style={{ fontSize: '17px', fontWeight: 600, color: '#1a1a1a', textAlign: 'center' as const, marginBottom: '6px' }}>Sign in</h2>
      <p style={{ fontSize: '9px', color: '#666', textAlign: 'center' as const, marginBottom: '17px' }}>to continue to Verso AI</p>

      {phase === 'success' ? (
        // Success message
        <div style={{ textAlign: 'center' as const, padding: '22px 0' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: '#10a37f',
            margin: '0 auto 11px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <p style={{ fontSize: '11px', fontWeight: 600, color: '#1a1a1a' }}>Authentication successful</p>
        </div>
      ) : (
        <>
          {/* Email input */}
          <div style={{ marginBottom: '11px' }}>
            <input
              type="text"
              placeholder="Email"
              value={popupEmail}
              readOnly
              style={{
                width: '100%',
                padding: '7px 8px',
                fontSize: '10px',
                border: '1px solid #d0d0d0',
                borderRadius: '3px',
                background: phase === 'typing-email' ? '#f8f8f8' : 'white',
                outline: phase === 'typing-email' ? '1.5px solid #0067B8' : 'none',
                boxSizing: 'border-box' as const,
              }}
            />
          </div>

          {/* Password input */}
          <div style={{ marginBottom: '17px' }}>
            <input
              type="password"
              placeholder="Password"
              value={popupPassword}
              readOnly
              style={{
                width: '100%',
                padding: '7px 8px',
                fontSize: '10px',
                border: '1px solid #d0d0d0',
                borderRadius: '3px',
                background: phase === 'typing-password' ? '#f8f8f8' : 'white',
                outline: phase === 'typing-password' ? '1.5px solid #0067B8' : 'none',
                boxSizing: 'border-box' as const,
              }}
            />
          </div>

          {/* Sign in button */}
          <button style={{
            width: '100%',
            padding: '8px',
            background: phase === 'authenticating' ? '#005A9E' : '#0067B8',
            border: 'none',
            borderRadius: '3px',
            fontSize: '10px',
            fontWeight: 600,
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}>
            {phase === 'authenticating' ? (
              <>
                <div style={{
                  width: '10px',
                  height: '10px',
                  border: '1.5px solid white',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }} />
                Authenticating...
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </>
      )}
    </div>
  ) : null

  // Decide which panel to show based on phase
  const showLoginPanel = phase !== 'showing-verso'
  const showVersoPanel = phase === 'showing-verso'

  const loginPanel = showPanel && showLoginPanel ? (
    <div
      className="demo-chat-panel"
      style={{
        transform: `scale(${chatScale})`,
        transformOrigin: 'center',
        transition: 'transform 0.6s ease-out, border-radius 0.6s ease-out, box-shadow 0.6s ease-out',
        height: '100%',
        background: 'white',
        borderRadius: chatScale > 1 ? '12px' : '0',
        border: chatScale > 1 ? '1px solid hsl(0,0%,85%)' : 'none',
        boxShadow: chatScale > 1 ? '0 12px 40px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.1)' : 'none',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column' as const,
      }}
    >
      {/* Header - matching other animations */}
      <div style={{
        background: '#e8e8e8',
        padding: '3px 10px',
        fontSize: '11px',
        fontWeight: 600,
        color: '#555',
        letterSpacing: '0.3px',
        fontFamily: 'Inter, sans-serif',
        borderBottom: '1px solid #d5d5d5',
        flexShrink: 0,
      }}>
        Verso AI
      </div>

      {/* Login content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px 14px',
        gap: '11px',
      }}>
        {/* Logo */}
        <div style={{
          fontSize: '18px',
          fontWeight: 600,
          color: '#1a1a1a',
          textAlign: 'center' as const,
          marginBottom: '2px',
        }}>
          Verso AI
        </div>

        {/* SSO buttons */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
          <button style={{
            width: '100%',
            padding: '7px 10px',
            background: 'white',
            border: '1px solid #d0d0d0',
            borderRadius: '5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '10px',
            fontWeight: 500,
            color: '#1a1a1a',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}>
            <GoogleIcon />
            Continue with Google
          </button>

          <button style={{
            width: '100%',
            padding: '7px 10px',
            background: phase === 'clicking-microsoft' ? '#f0f0f0' : 'white',
            border: '1px solid #d0d0d0',
            borderRadius: '5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '10px',
            fontWeight: 500,
            color: '#1a1a1a',
            cursor: 'pointer',
            transition: 'all 0.2s',
            transform: phase === 'clicking-microsoft' ? 'scale(0.98)' : 'scale(1)',
          }}>
            <MicrosoftIcon />
            Continue with Microsoft
          </button>
        </div>

        {/* OR divider */}
        <div style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: '#999',
          fontSize: '8px',
        }}>
          <div style={{ flex: 1, height: '1px', background: '#e0e0e0' }} />
          OR
          <div style={{ flex: 1, height: '1px', background: '#e0e0e0' }} />
        </div>

        {/* Email and Password inputs */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
          <div style={{
            width: '100%',
            padding: '7px 10px',
            background: 'white',
            border: '1px solid #d0d0d0',
            borderRadius: '5px',
            fontSize: '10px',
            color: '#999',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span>Email</span>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>

          <div style={{
            width: '100%',
            padding: '7px 10px',
            background: 'white',
            border: '1px solid #d0d0d0',
            borderRadius: '5px',
            fontSize: '10px',
            color: '#999',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span>Password</span>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
        </div>

        {/* Sign In button */}
        <button style={{
          width: '100%',
          padding: '7px 10px',
          background: '#4F6FEE',
          border: 'none',
          borderRadius: '5px',
          fontSize: '11px',
          fontWeight: 600,
          color: 'white',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}>
          Sign In
        </button>

        {/* Sign up link */}
        <div style={{ fontSize: '9px', color: '#666' }}>
          No account? <span style={{ color: '#4F6FEE', fontWeight: 500, cursor: 'pointer' }}>Sign up</span>
        </div>
      </div>
    </div>
  ) : null

  const versoPanel = showPanel && showVersoPanel ? (
    <div
      className="demo-chat-panel"
      style={{
        transform: `scale(${chatScale})`,
        transformOrigin: 'center',
        transition: 'transform 0.6s ease-out, border-radius 0.6s ease-out, box-shadow 0.6s ease-out',
        height: '100%',
        background: 'white',
        borderRadius: chatScale > 1 ? '12px' : '0',
        border: chatScale > 1 ? '1px solid hsl(0,0%,85%)' : 'none',
        boxShadow: chatScale > 1 ? '0 12px 40px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.1)' : 'none',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column' as const,
      }}
    >
      {/* Header - matching other animations */}
      <div style={{
        background: '#e8e8e8',
        padding: '3px 10px',
        fontSize: '11px',
        fontWeight: 600,
        color: '#555',
        letterSpacing: '0.3px',
        fontFamily: 'Inter, sans-serif',
        borderBottom: '1px solid #d5d5d5',
        flexShrink: 0,
      }}>
        Verso AI
      </div>
      <ChatPanel
        messages={[]}
        toolCalls={[]}
        isTyping={false}
        composerText=""
        isRunning={false}
        composerPlaceholder={ui.composerPlaceholder}
      />
    </div>
  ) : null

  const viewer = (
    <PresentationViewer
      slides={slides}
      visibleSlides={visibleSlides}
      activeSlide={activeSlide}
      sidePanel={showVersoPanel ? versoPanel : loginPanel}
      onSlideClick={handleSlideClick}
      fileTitle={ui.fileTitle}
      ribbonTabs={ui.tabs}
      statusSlideOf={ui.slideOf}
      statusReady={ui.ready}
      totalSlideCount={1}
    />
  )

  return (
    <div aria-hidden="true" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="demo-viewer-outer" style={{ marginTop: '0', position: 'relative', zIndex: 0 }}>
        <div className="demo-viewer-inner">
          {viewer}
        </div>
        {microsoftPopup}
      </div>
    </div>
  )
}
