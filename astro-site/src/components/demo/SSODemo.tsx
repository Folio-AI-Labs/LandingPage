import { useState, useEffect, useCallback, useRef } from 'react'
import { makeBlankSlide } from './slides'
import './demo-styles.css'

const CHAR_DELAY = 50
const PAUSE_SHORT = 600
const PAUSE_MED = 1000
const PAUSE_LONG = 1500

type Phase = 'idle' | 'opening_panel' | 'showing_login' | 'selecting_sso' | 'opening_popup' | 'popup_open' | 'typing_email' | 'typing_password' | 'authenticating' | 'success' | 'closing_popup' | 'authenticated' | 'done'

const demoText: Record<string, {
  fileTitle: string
  tabs: string[]
  slideOf: (current: number, total: number) => string
  ready: string
  clickTitle: string
  clickSubtitle: string
  loginTitle: string
  emailLabel: string
  passwordLabel: string
  emailPlaceholder: string
  passwordPlaceholder: string
  signInButton: string
  orDivider: string
  googleSSO: string
  microsoftSSO: string
  microsoftTitle: string
  microsoftSubtitle: string
  continueButton: string
  authenticating: string
  successMessage: string
  versoTitle: string
  emailValue: string
  passwordValue: string
}> = {
  en: {
    fileTitle: 'Presentation1.pptx',
    tabs: ['Home', 'Insert', 'Design', 'Transitions', 'Slide Show'],
    slideOf: (c, t) => `Slide ${c} of ${t}`,
    ready: 'Ready',
    clickTitle: 'Click to add title',
    clickSubtitle: 'Click to add subtitle',
    loginTitle: 'Sign in to Verso',
    emailLabel: 'Email',
    passwordLabel: 'Password',
    emailPlaceholder: 'you@company.com',
    passwordPlaceholder: '••••••••',
    signInButton: 'Sign in',
    orDivider: 'or continue with',
    googleSSO: 'Google',
    microsoftSSO: 'Microsoft',
    microsoftTitle: 'Sign in',
    microsoftSubtitle: 'to continue to Verso',
    continueButton: 'Next',
    authenticating: 'Signing you in...',
    successMessage: 'Success!',
    versoTitle: 'Verso AI',
    emailValue: 'john.doe@acmecorp.com',
    passwordValue: 'mypassword123',
  },
  fr: {
    fileTitle: 'Présentation1.pptx',
    tabs: ['Accueil', 'Insertion', 'Création', 'Transitions', 'Diaporama'],
    slideOf: (c, t) => `Diapositive ${c} sur ${t}`,
    ready: 'Prêt',
    clickTitle: 'Cliquez pour ajouter un titre',
    clickSubtitle: 'Cliquez pour ajouter un sous-titre',
    loginTitle: 'Connexion à Verso',
    emailLabel: 'E-mail',
    passwordLabel: 'Mot de passe',
    emailPlaceholder: 'vous@entreprise.com',
    passwordPlaceholder: '••••••••',
    signInButton: 'Se connecter',
    orDivider: 'ou continuer avec',
    googleSSO: 'Google',
    microsoftSSO: 'Microsoft',
    microsoftTitle: 'Se connecter',
    microsoftSubtitle: 'pour continuer vers Verso',
    continueButton: 'Suivant',
    authenticating: 'Connexion en cours...',
    successMessage: 'Succès !',
    versoTitle: 'Verso AI',
    emailValue: 'jean.dupont@acmecorp.com',
    passwordValue: 'motdepasse123',
  },
  es: {
    fileTitle: 'Presentación1.pptx',
    tabs: ['Inicio', 'Insertar', 'Diseño', 'Transiciones', 'Presentación con diapositivas'],
    slideOf: (c, t) => `Diapositiva ${c} de ${t}`,
    ready: 'Listo',
    clickTitle: 'Haga clic para agregar título',
    clickSubtitle: 'Haga clic para agregar subtítulo',
    loginTitle: 'Iniciar sesión en Verso',
    emailLabel: 'Correo electrónico',
    passwordLabel: 'Contraseña',
    emailPlaceholder: 'tu@empresa.com',
    passwordPlaceholder: '••••••••',
    signInButton: 'Iniciar sesión',
    orDivider: 'o continuar con',
    googleSSO: 'Google',
    microsoftSSO: 'Microsoft',
    microsoftTitle: 'Iniciar sesión',
    microsoftSubtitle: 'para continuar a Verso',
    continueButton: 'Siguiente',
    authenticating: 'Iniciando sesión...',
    successMessage: '¡Éxito!',
    versoTitle: 'Verso AI',
    emailValue: 'juan.perez@acmecorp.com',
    passwordValue: 'micontraseña123',
  },
  de: {
    fileTitle: 'Präsentation1.pptx',
    tabs: ['Start', 'Einfügen', 'Entwurf', 'Übergänge', 'Bildschirmpräsentation'],
    slideOf: (c, t) => `Folie ${c} von ${t}`,
    ready: 'Bereit',
    clickTitle: 'Titel durch Klicken hinzufügen',
    clickSubtitle: 'Untertitel durch Klicken hinzufügen',
    loginTitle: 'Bei Verso anmelden',
    emailLabel: 'E-Mail',
    passwordLabel: 'Passwort',
    emailPlaceholder: 'du@unternehmen.de',
    passwordPlaceholder: '••••••••',
    signInButton: 'Anmelden',
    orDivider: 'oder fortfahren mit',
    googleSSO: 'Google',
    microsoftSSO: 'Microsoft',
    microsoftTitle: 'Anmelden',
    microsoftSubtitle: 'um zu Verso fortzufahren',
    continueButton: 'Weiter',
    authenticating: 'Anmeldung läuft...',
    successMessage: 'Erfolg!',
    versoTitle: 'Verso AI',
    emailValue: 'max.mustermann@acmecorp.com',
    passwordValue: 'meinpasswort123',
  },
}

export default function SSODemo({ lang = 'en' }: { lang?: string }) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [showPanel, setShowPanel] = useState(false)
  const [emailText, setEmailText] = useState('')
  const [passwordText, setPasswordText] = useState('')
  const [showPopup, setShowPopup] = useState(false)

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

  const t = demoText[lang] || demoText.en
  const ui = { clickTitle: t.clickTitle, clickSubtitle: t.clickSubtitle }
  const blankSlide = makeBlankSlide(ui.clickTitle, ui.clickSubtitle)

  const runWorkflow = useCallback(() => {
    clearAllTimeouts()
    setPhase('idle')
    setShowPanel(false)
    setEmailText('')
    setPasswordText('')
    setShowPopup(false)

    let elapsed = 500

    // Open panel
    elapsed += PAUSE_SHORT
    schedule(() => {
      setPhase('opening_panel')
      setShowPanel(true)
    }, elapsed)

    elapsed += PAUSE_MED
    schedule(() => setPhase('showing_login'), elapsed)

    // Click on Microsoft SSO
    elapsed += PAUSE_LONG
    schedule(() => setPhase('selecting_sso'), elapsed)

    // Open popup window
    elapsed += PAUSE_MED
    schedule(() => {
      setPhase('opening_popup')
      setShowPopup(true)
    }, elapsed)

    elapsed += PAUSE_SHORT
    schedule(() => setPhase('popup_open'), elapsed)

    // Type email
    elapsed += PAUSE_MED
    schedule(() => setPhase('typing_email'), elapsed)

    for (let i = 1; i <= t.emailValue.length; i++) {
      const ci = i
      schedule(() => setEmailText(t.emailValue.slice(0, ci)), elapsed + i * CHAR_DELAY)
    }
    elapsed += t.emailValue.length * CHAR_DELAY

    // Type password
    elapsed += PAUSE_SHORT
    schedule(() => setPhase('typing_password'), elapsed)

    const passwordDots = '••••••••••••'
    for (let i = 1; i <= passwordDots.length; i++) {
      const ci = i
      schedule(() => setPasswordText(passwordDots.slice(0, ci)), elapsed + i * (CHAR_DELAY * 0.7))
    }
    elapsed += passwordDots.length * (CHAR_DELAY * 0.7)

    // Authenticate
    elapsed += PAUSE_MED
    schedule(() => setPhase('authenticating'), elapsed)

    elapsed += PAUSE_LONG
    schedule(() => setPhase('success'), elapsed)

    // Close popup
    elapsed += PAUSE_MED
    schedule(() => {
      setPhase('closing_popup')
      setShowPopup(false)
    }, elapsed)

    elapsed += PAUSE_SHORT
    schedule(() => setPhase('authenticated'), elapsed)

    elapsed += PAUSE_LONG
    schedule(() => setPhase('done'), elapsed)

    // Loop
    elapsed += 2000
    schedule(() => runWorkflow(), elapsed)
  }, [clearAllTimeouts, schedule, t])

  useEffect(() => {
    runWorkflow()
    return () => clearAllTimeouts()
  }, [runWorkflow, clearAllTimeouts])

  return (
    <div
      style={{
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        width: '820px',
        height: '420px',
        display: 'flex',
        flexDirection: 'column',
        background: '#f5f5f5',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* PowerPoint Header */}
      <div style={{
        background: '#2b579a',
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexShrink: 0,
      }}>
        <div style={{
          fontSize: '14px',
          fontWeight: 600,
          color: 'white',
        }}>
          {t.fileTitle}
        </div>
      </div>

      {/* Ribbon */}
      <div style={{
        background: '#f3f3f3',
        borderBottom: '1px solid #d5d5d5',
        display: 'flex',
        gap: '20px',
        padding: '0 16px',
        fontSize: '13px',
        flexShrink: 0,
      }}>
        {t.tabs.map((tab, i) => (
          <div key={i} style={{
            padding: '8px 4px',
            color: i === 0 ? '#2b579a' : '#666',
            borderBottom: i === 0 ? '2px solid #2b579a' : 'none',
            fontWeight: i === 0 ? 600 : 400,
          }}>
            {tab}
          </div>
        ))}
      </div>

      {/* Main area */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, position: 'relative' }}>
        {/* Slide canvas */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e8e8e8', padding: '20px' }}>
          <div style={{
            width: '100%',
            maxWidth: '500px',
            aspectRatio: '16 / 9',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            border: '1px solid #e0e0e0',
            overflow: 'hidden',
          }}>
            {blankSlide.render()}
          </div>
        </div>

        {/* Verso Panel */}
        {showPanel && (
          <div
            className="demo-slide-in-right"
            style={{
              width: '280px',
              background: 'white',
              borderLeft: '1px solid #d5d5d5',
              display: 'flex',
              flexDirection: 'column',
              flexShrink: 0,
            }}
          >
            {/* Panel Header */}
            <div style={{
              background: '#e8e8e8',
              padding: '8px 12px',
              fontSize: '12px',
              fontWeight: 600,
              color: '#555',
              borderBottom: '1px solid #d5d5d5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <span>{t.versoTitle}</span>
              <button style={{
                background: 'transparent',
                border: 'none',
                color: '#666',
                cursor: 'pointer',
                fontSize: '16px',
                padding: '0 4px',
              }}>×</button>
            </div>

            {/* Login Form */}
            <div style={{ padding: '24px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '4px',
                }}>
                  Verso
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  {t.loginTitle}
                </div>
              </div>

              {/* Email Input */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#333', marginBottom: '6px' }}>
                  {t.emailLabel}
                </label>
                <input
                  type="email"
                  placeholder={t.emailPlaceholder}
                  readOnly
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    fontSize: '12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              {/* Password Input */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#333', marginBottom: '6px' }}>
                  {t.passwordLabel}
                </label>
                <input
                  type="password"
                  placeholder={t.passwordPlaceholder}
                  readOnly
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    fontSize: '12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              {/* Sign In Button */}
              <button
                disabled
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'white',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'not-allowed',
                  marginBottom: '20px',
                  opacity: 0.7,
                }}
              >
                {t.signInButton}
              </button>

              {/* Divider */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px',
                fontSize: '11px',
                color: '#9ca3af',
              }}>
                <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
                <span>{t.orDivider}</span>
                <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
              </div>

              {/* SSO Buttons */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  style={{
                    flex: 1,
                    padding: '10px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#333',
                    background: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {t.googleSSO}
                </button>
                <button
                  onClick={() => {}}
                  style={{
                    flex: 1,
                    padding: '10px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'white',
                    background: phase === 'selecting_sso' ? 'linear-gradient(135deg, #0078d4 0%, #005a9e 100%)' : '#0078d4',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transform: phase === 'selecting_sso' ? 'scale(0.97)' : 'scale(1)',
                    transition: 'all 0.15s',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z"/>
                  </svg>
                  {t.microsoftSSO}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Microsoft SSO Popup */}
        {showPopup && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '360px',
              background: 'white',
              borderRadius: '8px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
              overflow: 'hidden',
              zIndex: 100,
              animation: 'popupAppear 0.2s ease-out',
            }}
          >
            {/* Popup Header */}
            <div style={{
              background: '#0078d4',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: 'white',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z"/>
                </svg>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>Microsoft</span>
              </div>
              <button
                onClick={() => {}}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '18px',
                  padding: '0 4px',
                }}
              >
                ×
              </button>
            </div>

            {/* Popup Content */}
            {phase !== 'success' ? (
              <div style={{ padding: '32px 24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <div style={{ fontSize: '18px', fontWeight: 600, color: '#1f2937', marginBottom: '4px' }}>
                    {t.microsoftTitle}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    {t.microsoftSubtitle}
                  </div>
                </div>

                {/* Email Input */}
                <div style={{ marginBottom: '16px' }}>
                  <input
                    type="email"
                    value={emailText}
                    placeholder={t.emailPlaceholder}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      fontSize: '13px',
                      border: '2px solid #e5e7eb',
                      borderColor: phase === 'typing_email' ? '#0078d4' : '#e5e7eb',
                      borderRadius: '4px',
                      outline: 'none',
                      fontFamily: 'inherit',
                      transition: 'border-color 0.2s',
                    }}
                  />
                </div>

                {/* Password Input */}
                <div style={{ marginBottom: '20px' }}>
                  <input
                    type="password"
                    value={passwordText}
                    placeholder={t.passwordPlaceholder}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      fontSize: '13px',
                      border: '2px solid #e5e7eb',
                      borderColor: phase === 'typing_password' ? '#0078d4' : '#e5e7eb',
                      borderRadius: '4px',
                      outline: 'none',
                      fontFamily: 'inherit',
                      transition: 'border-color 0.2s',
                    }}
                  />
                </div>

                {/* Submit Button */}
                <button
                  disabled={phase === 'authenticating'}
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'white',
                    background: phase === 'authenticating' ? '#5a9fd4' : '#0078d4',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: phase === 'authenticating' ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  {phase === 'authenticating' && (
                    <div style={{
                      width: '14px',
                      height: '14px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: 'white',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                    }} />
                  )}
                  {phase === 'authenticating' ? t.authenticating : t.continueButton}
                </button>
              </div>
            ) : (
              <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  margin: '0 auto 16px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'scaleIn 0.3s ease-out',
                }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#1f2937' }}>
                  {t.successMessage}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Overlay */}
        {showPopup && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 99,
          }} />
        )}
      </div>

      {/* Status bar */}
      <div style={{
        background: '#f3f3f3',
        borderTop: '1px solid #d5d5d5',
        padding: '4px 12px',
        fontSize: '11px',
        color: '#666',
        display: 'flex',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <span>{t.slideOf(1, 1)}</span>
        <span>{t.ready}</span>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes scaleIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        @keyframes popupAppear {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        .demo-slide-in-right {
          animation: slideInRight 0.4s ease-out;
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}
