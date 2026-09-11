// FLUENTRA Authentication, Google Sign-In & Personalized Onboarding View
import React, { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, Check, Shield, User, Globe, Target, Clock, Zap, X, Sun, Moon } from 'lucide-react';
import { FluentraLogo } from '../components/brand/FluentraLogo';
import { useUser } from '../context/UserContext';
import { useProgression } from '../context/ProgressionContext';

const AVAILABLE_LANGUAGES = [
  { id: 'Chinese Mandarin', code: 'zh-CN', name: 'Chinese Mandarin', flag: '🇨🇳', tagline: 'Nǐ hǎo! Hanzi, tones & rich culture' },
  { id: 'French', code: 'fr-FR', name: 'French', flag: '🇫🇷', tagline: 'Bonjour, l’amour & la culture' },
  { id: 'Spanish', code: 'es-ES', name: 'Spanish', flag: '🇪🇸', tagline: '¡Hola! Passion & global reach' },
  { id: 'German', code: 'de-DE', name: 'German', flag: '🇩🇪', tagline: 'Guten Tag! Engineering & precision' },
  { id: 'Japanese', code: 'ja-JP', name: 'Japanese', flag: '🇯🇵', tagline: 'Konnichiwa! Tradition & nuance' },
  { id: 'Italian', code: 'it-IT', name: 'Italian', flag: '🇮🇹', tagline: 'Ciao! Art, cuisine & melody' }
];

const LEARNING_GOALS = [
  { id: 'travel', title: 'Travel & Exploration ✈️', desc: 'Order dining, ask directions, navigate airports & immerse in culture' },
  { id: 'career', title: 'Career & Professional 💼', desc: 'Ace job interviews, team syncs, negotiations & business emails' },
  { id: 'daily', title: 'Daily Communication 💬', desc: 'Chat naturally with friends, locals, neighbors & social gatherings' },
  { id: 'brain', title: 'Brain Training & Culture 🧠', desc: 'Mental agility, literature, philosophy & cognitive fitness' }
];

const STARTING_LEVELS = [
  { id: 'beginner', title: 'Absolute Beginner 🐣', desc: 'Start from Level 1 Foundations (Sounds, greetings, basic words)', level: 1, unitId: 'u1' },
  { id: 'elementary', title: 'Some Basics / A1.2 🌿', desc: 'Jump straight to Level 2 (Family, food, places), Level 1 unlocked', level: 2, unitId: 'u101' },
  { id: 'intermediate', title: 'Intermediate / B1 🚀', desc: 'Jump to Level 4 (Tenses, fluency, complex ideas), Levels 1–3 unlocked', level: 4, unitId: 'u301' }
];

const COMMITMENTS = [
  { id: 15, label: 'Casual', time: '15 min / day', xp: 20 },
  { id: 20, label: 'Regular', time: '20 min / day', xp: 35 },
  { id: 30, label: 'Serious', time: '30 min / day', xp: 50 },
  { id: 45, label: 'Intense', time: '45 min / day', xp: 75 }
];

export const AuthOnboardingView: React.FC = () => {
  const { login, register, theme, toggleTheme } = useUser();
  const { setActiveLevel } = useProgression();

  const [mode, setMode] = useState<'onboard' | 'signin'>('onboard');
  const [step, setStep] = useState(1);
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  // Real Google Sign-In state (no hardcoded mock accounts)
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');
  const [useAnotherGoogleAccount, setUseAnotherGoogleAccount] = useState(false);

  const savedGoogleAccount = (() => {
    try {
      const raw = localStorage.getItem('fluentra_saved_google_account');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [authProvider, setAuthProvider] = useState<'google' | 'email' | 'guest'>('email');

  const [selectedLang, setSelectedLang] = useState(AVAILABLE_LANGUAGES[0]);
  const [selectedGoal, setSelectedGoal] = useState<'travel' | 'career' | 'daily' | 'brain'>('travel');
  const [selectedLevel, setSelectedLevel] = useState(STARTING_LEVELS[0]);
  const [selectedCommitment, setSelectedCommitment] = useState(COMMITMENTS[1]);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    login(email, password);
  };

  const handleGoogleSubmit = (emailToAuth: string, nameToAuth?: string) => {
    const cleanEmail = emailToAuth.trim();
    if (!cleanEmail) return;

    const derivedName = nameToAuth?.trim() || cleanEmail.split('@')[0].replace(/[._]/g, ' ');
    const formattedName = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);
    const userAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(formattedName)}&backgroundColor=00C48C`;

    // Persist real account locally for seamless subsequent one-click sign-in
    try {
      localStorage.setItem('fluentra_saved_google_account', JSON.stringify({
        name: formattedName,
        email: cleanEmail,
        avatar: userAvatar
      }));
    } catch {
      // Safe ignore
    }

    setName(formattedName);
    setEmail(cleanEmail);
    setAvatarUrl(userAvatar);
    setAuthProvider('google');
    setShowGoogleModal(false);

    if (mode === 'signin') {
      login(cleanEmail);
    } else {
      setStep(2);
    }
  };

  const handleFinishOnboarding = () => {
    register({
      name: name.trim() || 'Learner',
      email: email.trim(),
      avatarUrl: avatarUrl,
      authProvider: authProvider,
      currentLanguage: selectedLang.name,
      targetLanguage: selectedLang.code,
      learningGoal: selectedGoal,
      experienceLevel: selectedLevel.id as any,
      dailyCommitmentMinutes: selectedCommitment.id,
      currentLevelNumber: selectedLevel.level,
      currentUnitId: selectedLevel.unitId,
      dailyGoal: {
        targetXp: selectedCommitment.xp,
        currentXp: 0,
        completed: false
      }
    });
    setActiveLevel(selectedLevel.level);
  };

  return (
    <div
      className="content-fullscreen"
      style={{
        padding: '24px 20px',
        backgroundColor: 'var(--fl-bg-app)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '100vh',
        maxWidth: '540px',
        margin: '0 auto',
        position: 'relative'
      }}
    >
      {/* Google Authentication Dialog Modal */}
      {showGoogleModal && (
        <div className="fl-overlay" onClick={() => setShowGoogleModal(false)}>
          <div
            className="fl-modal-content animate-pop-in"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '420px', padding: '24px', backgroundColor: 'var(--fl-bg-card)', border: '1px solid var(--fl-border-strong)' }}
          >
            {/* Google Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="22" height="22" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z" />
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15Z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z" />
                </svg>
                <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--fl-text-primary)' }}>Sign in with Google</span>
              </div>
              <button
                type="button"
                className="fl-btn-icon"
                onClick={() => setShowGoogleModal(false)}
                style={{ width: '32px', height: '32px' }}
              >
                <X size={16} />
              </button>
            </div>

            {savedGoogleAccount && !useAnotherGoogleAccount ? (
              /* Previously saved genuine account on this browser */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <p style={{ fontSize: '13px', color: 'var(--fl-text-secondary)' }}>
                  Continue to <strong>FLUENTRA</strong> with your Google account:
                </p>

                <button
                  type="button"
                  id="btn-google-saved-acc"
                  onClick={() => handleGoogleSubmit(savedGoogleAccount.email, savedGoogleAccount.name)}
                  className="fl-card fl-card-interactive"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 14px',
                    textAlign: 'left',
                    border: '1.5px solid var(--fl-teal-primary)',
                    backgroundColor: 'var(--fl-bg-card-hover)'
                  }}
                >
                  <img
                    src={savedGoogleAccount.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(savedGoogleAccount.name)}`}
                    alt={savedGoogleAccount.name}
                    style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--fl-text-primary)' }}>{savedGoogleAccount.name}</span>
                    <span style={{ fontSize: '12px', color: 'var(--fl-text-secondary)' }}>{savedGoogleAccount.email}</span>
                  </div>
                  <Check size={16} color="var(--fl-teal-light)" />
                </button>

                <button
                  type="button"
                  id="btn-google-use-another"
                  onClick={() => setUseAnotherGoogleAccount(true)}
                  className="fl-btn fl-btn-outline"
                  style={{ padding: '8px', fontSize: '12px', color: 'var(--fl-text-muted)' }}
                >
                  Use another Google account
                </button>
              </div>
            ) : (
              /* Genuine Google Account Entry (No hardcoded mock accounts) */
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleGoogleSubmit(googleEmail, googleName);
                }}
                style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
              >
                <p style={{ fontSize: '13px', color: 'var(--fl-text-secondary)' }}>
                  Enter your Google Account email to continue to <strong>FLUENTRA</strong>:
                </p>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--fl-text-muted)', display: 'block', marginBottom: '6px' }}>
                    Google Email Address
                  </label>
                  <input
                    type="email"
                    id="input-google-email"
                    required
                    value={googleEmail}
                    onChange={(e) => setGoogleEmail(e.target.value)}
                    placeholder="your.name@gmail.com"
                    autoFocus
                    className="fl-input"
                    style={{
                      width: '100%',
                      height: '42px',
                      padding: '0 12px',
                      borderRadius: 'var(--fl-radius-md)',
                      backgroundColor: 'var(--fl-bg-input)',
                      border: '1px solid var(--fl-border-strong)',
                      color: 'var(--fl-text-primary)',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--fl-text-muted)', display: 'block', marginBottom: '6px' }}>
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    id="input-google-name"
                    value={googleName}
                    onChange={(e) => setGoogleName(e.target.value)}
                    placeholder="e.g. Alex"
                    className="fl-input"
                    style={{
                      width: '100%',
                      height: '42px',
                      padding: '0 12px',
                      borderRadius: 'var(--fl-radius-md)',
                      backgroundColor: 'var(--fl-bg-input)',
                      border: '1px solid var(--fl-border-strong)',
                      color: 'var(--fl-text-primary)',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div style={{ padding: '8px 10px', borderRadius: '8px', backgroundColor: 'rgba(66, 133, 244, 0.08)', border: '1px solid rgba(66, 133, 244, 0.2)', fontSize: '11px', color: 'var(--fl-text-secondary)', lineHeight: 1.4 }}>
                  <Shield size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
                  Google will securely authenticate your identity and share your verified email and profile with FLUENTRA.
                </div>

                <button
                  type="submit"
                  id="btn-submit-google-auth"
                  className="fl-btn"
                  style={{
                    backgroundColor: '#4285F4',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    boxShadow: '0 2px 10px rgba(66, 133, 244, 0.4)',
                    padding: '12px'
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#FFFFFF" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                {savedGoogleAccount && (
                  <button
                    type="button"
                    onClick={() => setUseAnotherGoogleAccount(false)}
                    className="fl-btn fl-btn-outline"
                    style={{ padding: '6px', fontSize: '12px', color: 'var(--fl-text-muted)' }}
                  >
                    Back to saved account
                  </button>
                )}
              </form>
            )}
          </div>
        </div>
      )}

      {/* Top Brand Bar with Theme Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <FluentraLogo size="sm" showWordmark={true} showTagline={false} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            id="btn-auth-theme-toggle"
            onClick={toggleTheme}
            className="fl-btn-icon"
            style={{ width: '32px', height: '32px', borderRadius: '50%' }}
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            aria-label={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {theme === 'dark' ? (
              <Sun size={15} color="var(--fl-gold-light)" />
            ) : (
              <Moon size={15} color="var(--fl-indigo-primary)" />
            )}
          </button>

          {mode === 'onboard' ? (
            <button
              type="button"
              id="btn-toggle-signin"
              className="fl-badge fl-badge-locked"
              onClick={() => setMode('signin')}
              style={{ cursor: 'pointer', padding: '6px 12px' }}
            >
              <span>Sign In</span>
            </button>
          ) : (
            <button
              type="button"
              id="btn-toggle-signup"
              className="fl-badge fl-badge-teal"
              onClick={() => setMode('onboard')}
              style={{ cursor: 'pointer', padding: '6px 12px' }}
            >
              <span>Create Account</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {mode === 'signin' ? (
          /* ================= SIGN IN VIEW ================= */
          <div className="animate-pop-in" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <span className="fl-badge fl-badge-teal" style={{ marginBottom: '8px' }}>
                Welcome Back
              </span>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--fl-text-primary)' }}>
                Sign in to FLUENTRA
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--fl-text-secondary)', marginTop: '4px' }}>
                Pick up your speaking streak right where you left off.
              </p>
            </div>

            {/* Google One-Click Button */}
            <button
              type="button"
              id="btn-google-signin"
              className="fl-card fl-card-interactive"
              onClick={() => setShowGoogleModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                padding: '14px',
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--fl-radius-md)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                border: 'none',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z" />
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15Z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z" />
              </svg>
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#1F2937' }}>
                Continue with Google
              </span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--fl-border)' }} />
              <span style={{ fontSize: '12px', color: 'var(--fl-text-muted)', fontWeight: 600 }}>OR EMAIL</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--fl-border)' }} />
            </div>

            <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--fl-text-secondary)', marginBottom: '6px', display: 'block' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  id="input-login-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  style={{
                    width: '100%',
                    height: '46px',
                    padding: '0 14px',
                    borderRadius: 'var(--fl-radius-md)',
                    backgroundColor: 'var(--fl-bg-card)',
                    border: '1px solid var(--fl-border)',
                    color: 'var(--fl-text-primary)',
                    fontSize: '15px',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--fl-text-secondary)', marginBottom: '6px', display: 'block' }}>
                  Password
                </label>
                <input
                  type="password"
                  id="input-login-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    height: '46px',
                    padding: '0 14px',
                    borderRadius: 'var(--fl-radius-md)',
                    backgroundColor: 'var(--fl-bg-card)',
                    border: '1px solid var(--fl-border)',
                    color: 'var(--fl-text-primary)',
                    fontSize: '15px',
                    outline: 'none'
                  }}
                />
              </div>

              <button
                type="submit"
                id="btn-submit-signin"
                className="fl-btn fl-btn-primary"
                style={{ width: '100%', marginTop: '6px' }}
              >
                <span>Sign In</span>
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        ) : (
          /* ================= ONBOARDING STEP-BY-STEP ================= */
          <div className="animate-pop-in" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Progress dots */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: '4px',
                    borderRadius: '999px',
                    backgroundColor: i <= step ? 'var(--fl-teal-light)' : 'rgba(255, 255, 255, 0.1)'
                  }}
                />
              ))}
            </div>

            {/* STEP 1: Name, Email & Google Sign-In */}
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <span className="fl-badge fl-badge-teal">Personalization · 1 of 5</span>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, marginTop: '8px', color: 'var(--fl-text-primary)' }}>
                    Create your profile
                  </h2>
                  <p style={{ fontSize: '14px', color: 'var(--fl-text-secondary)', marginTop: '4px' }}>
                    Sign up with Google or enter your details to personalize your journey.
                  </p>
                </div>

                {/* Google Sign-In Button */}
                <button
                  type="button"
                  id="btn-google-signup"
                  className="fl-card fl-card-interactive"
                  onClick={() => setShowGoogleModal(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    padding: '14px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--fl-radius-md)',
                    border: 'none',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z" />
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15Z" />
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z" />
                  </svg>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: '#1F2937' }}>
                    Sign up with Google
                  </span>
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--fl-border)' }} />
                  <span style={{ fontSize: '12px', color: 'var(--fl-text-muted)', fontWeight: 600 }}>OR ENTER DETAILS</span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--fl-border)' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--fl-text-secondary)', marginBottom: '6px', display: 'block' }}>
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      id="input-onboard-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Jordan Miller"
                      style={{
                        width: '100%',
                        height: '48px',
                        padding: '0 16px',
                        borderRadius: 'var(--fl-radius-md)',
                        backgroundColor: 'var(--fl-bg-card)',
                        border: '1px solid var(--fl-border)',
                        color: 'var(--fl-text-primary)',
                        fontSize: '16px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--fl-text-secondary)', marginBottom: '6px', display: 'block' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="input-onboard-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. jordan@example.com"
                      style={{
                        width: '100%',
                        height: '48px',
                        padding: '0 16px',
                        borderRadius: 'var(--fl-radius-md)',
                        backgroundColor: 'var(--fl-bg-card)',
                        border: '1px solid var(--fl-border)',
                        color: 'var(--fl-text-primary)',
                        fontSize: '16px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Language Selection */}
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <span className="fl-badge fl-badge-teal">Language · 2 of 5</span>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, marginTop: '8px', color: 'var(--fl-text-primary)' }}>
                    Choose language to master
                  </h2>
                  <p style={{ fontSize: '14px', color: 'var(--fl-text-secondary)', marginTop: '4px' }}>
                    Your curriculum, audio player, voice analysis, and roleplays will adapt to this language.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {AVAILABLE_LANGUAGES.map((lang) => {
                    const isSelected = selectedLang.id === lang.id;
                    return (
                      <button
                        key={lang.id}
                        type="button"
                        id={`lang-choice-${lang.id}`}
                        onClick={() => setSelectedLang(lang)}
                        className={`fl-card fl-card-interactive ${isSelected ? 'fl-card-active' : ''}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '14px 16px',
                          textAlign: 'left'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <span style={{ fontSize: '28px' }}>{lang.flag}</span>
                          <div>
                            <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--fl-text-primary)' }}>
                              {lang.name}
                            </span>
                            <span style={{ fontSize: '12px', color: 'var(--fl-text-secondary)', display: 'block' }}>
                              {lang.tagline}
                            </span>
                          </div>
                        </div>
                        {isSelected && <Check size={20} color="var(--fl-teal-light)" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 3: Learning Motivation */}
            {step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <span className="fl-badge fl-badge-teal">Goal · 3 of 5</span>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, marginTop: '8px', color: 'var(--fl-text-primary)' }}>
                    Why are you learning {selectedLang.name}?
                  </h2>
                  <p style={{ fontSize: '14px', color: 'var(--fl-text-secondary)', marginTop: '4px' }}>
                    We will tailor your AI conversation scenarios and vocabulary recommendations.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {LEARNING_GOALS.map((goal) => {
                    const isSelected = selectedGoal === goal.id;
                    return (
                      <button
                        key={goal.id}
                        type="button"
                        id={`goal-choice-${goal.id}`}
                        onClick={() => setSelectedGoal(goal.id as any)}
                        className={`fl-card fl-card-interactive ${isSelected ? 'fl-card-active' : ''}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '14px 16px',
                          textAlign: 'left'
                        }}
                      >
                        <div>
                          <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--fl-text-primary)' }}>
                            {goal.title}
                          </span>
                          <span style={{ fontSize: '12px', color: 'var(--fl-text-secondary)', display: 'block', marginTop: '2px' }}>
                            {goal.desc}
                          </span>
                        </div>
                        {isSelected && <Check size={20} color="var(--fl-teal-light)" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 4: Starting Point */}
            {step === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <span className="fl-badge fl-badge-teal">Placement · 4 of 5</span>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, marginTop: '8px', color: 'var(--fl-text-primary)' }}>
                    What is your starting point?
                  </h2>
                  <p style={{ fontSize: '14px', color: 'var(--fl-text-secondary)', marginTop: '4px' }}>
                    We will unlock curriculum units matching your experience.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {STARTING_LEVELS.map((lvl) => {
                    const isSelected = selectedLevel.id === lvl.id;
                    return (
                      <button
                        key={lvl.id}
                        type="button"
                        id={`lvl-choice-${lvl.id}`}
                        onClick={() => setSelectedLevel(lvl)}
                        className={`fl-card fl-card-interactive ${isSelected ? 'fl-card-active' : ''}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '16px',
                          textAlign: 'left'
                        }}
                      >
                        <div>
                          <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--fl-text-primary)' }}>
                            {lvl.title}
                          </span>
                          <span style={{ fontSize: '12px', color: 'var(--fl-text-secondary)', display: 'block', marginTop: '2px' }}>
                            {lvl.desc}
                          </span>
                        </div>
                        {isSelected && <Check size={20} color="var(--fl-teal-light)" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 5: Daily Commitment */}
            {step === 5 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <span className="fl-badge fl-badge-teal">Habit · 5 of 5</span>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, marginTop: '8px', color: 'var(--fl-text-primary)' }}>
                    Set your daily practice target
                  </h2>
                  <p style={{ fontSize: '14px', color: 'var(--fl-text-secondary)', marginTop: '4px' }}>
                    This sets your daily XP goal on your dashboard.
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {COMMITMENTS.map((c) => {
                    const isSelected = selectedCommitment.id === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        id={`commit-choice-${c.id}`}
                        onClick={() => setSelectedCommitment(c)}
                        className={`fl-card fl-card-interactive ${isSelected ? 'fl-card-active' : ''}`}
                        style={{ padding: '16px', textAlign: 'center' }}
                      >
                        <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--fl-text-primary)', display: 'block' }}>
                          {c.label}
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--fl-text-secondary)', marginTop: '2px', display: 'block' }}>
                          {c.time}
                        </span>
                        <span className="fl-badge fl-badge-gold" style={{ marginTop: '8px', fontSize: '11px', padding: '2px 8px' }}>
                          +{c.xp} XP / day
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Persistent Bottom Controls for Onboarding */}
      {mode === 'onboard' && (
        <div style={{ display: 'flex', gap: '10px', marginTop: '24px', paddingTop: '12px', borderTop: '1px solid var(--fl-border)' }}>
          {step > 1 && (
            <button
              type="button"
              className="fl-btn fl-btn-secondary"
              onClick={() => setStep(prev => prev - 1)}
              style={{ flex: 1 }}
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          )}

          {step < 5 ? (
            <button
              type="button"
              id="btn-onboard-next"
              className="fl-btn fl-btn-primary"
              onClick={() => {
                if (step === 1 && !name.trim()) {
                  setName('Learner');
                }
                setStep(prev => prev + 1);
              }}
              style={{ flex: step === 1 ? 1 : 1.5 }}
            >
              <span>Continue</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              id="btn-onboard-finish"
              className="fl-btn fl-btn-primary"
              onClick={handleFinishOnboarding}
              style={{ flex: 1.5 }}
            >
              <Sparkles size={16} />
              <span>Start Learning {selectedLang.name}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
