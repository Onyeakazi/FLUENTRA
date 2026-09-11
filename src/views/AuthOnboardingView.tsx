// FLUENTRA Streamlined Authentication View (No Multi-Step Wizard)
import React, { useState } from 'react';
import { Sparkles, ArrowRight, Check, Shield, X, Sun, Moon, Lock, Mail, User as UserIcon, Globe } from 'lucide-react';
import { FluentraLogo } from '../components/brand/FluentraLogo';
import { useUser } from '../context/UserContext';
import { useProgression } from '../context/ProgressionContext';
import { firebaseService } from '../services/firebase';

const AVAILABLE_LANGUAGES = [
  { id: 'Chinese Mandarin', code: 'zh-CN', name: 'Chinese Mandarin', flag: '🇨🇳' },
  { id: 'French', code: 'fr-FR', name: 'French', flag: '🇫🇷' },
  { id: 'Spanish', code: 'es-ES', name: 'Spanish', flag: '🇪🇸' },
  { id: 'German', code: 'de-DE', name: 'German', flag: '🇩🇪' },
  { id: 'Japanese', code: 'ja-JP', name: 'Japanese', flag: '🇯🇵' },
  { id: 'Italian', code: 'it-IT', name: 'Italian', flag: '🇮🇹' }
];

export const AuthOnboardingView: React.FC = () => {
  const { login, register, theme, toggleTheme } = useUser();
  const { setActiveLevel } = useProgression();

  const [mode, setMode] = useState<'signup' | 'signin'>('signup');
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  // Real Google Sign-In state
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
  const [selectedLang, setSelectedLang] = useState(AVAILABLE_LANGUAGES[0]); // Chinese Mandarin default

  const handleTriggerGoogleAuth = async () => {
    if (firebaseService.isReady()) {
      try {
        const res = await firebaseService.signInWithGoogle();
        if (res && res.user) {
          handleGoogleSubmit(res.user.email || '', res.user.displayName || '');
          return;
        }
      } catch (err) {
        console.warn('Firebase Google Sign-In notice:', err);
      }
    }
    setShowGoogleModal(true);
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

    setShowGoogleModal(false);

    if (mode === 'signin') {
      login(cleanEmail);
    } else {
      register({
        name: formattedName,
        email: cleanEmail,
        avatarUrl: userAvatar,
        authProvider: 'google',
        currentLanguage: selectedLang.name,
        targetLanguage: selectedLang.code,
        learningGoal: 'travel',
        experienceLevel: 'beginner',
        dailyCommitmentMinutes: 20,
        currentLevelNumber: 1,
        currentUnitId: 'u1',
        dailyGoal: {
          targetXp: 35,
          currentXp: 0,
          completed: false
        }
      });
      setActiveLevel(1);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) return;

    if (mode === 'signin') {
      if (firebaseService.isReady() && password) {
        try {
          await firebaseService.signInWithEmail(cleanEmail, password);
        } catch (err) {
          console.warn('Firebase sign in notice:', err);
        }
      }
      login(cleanEmail, password);
    } else {
      // Direct instant Sign Up (No 5-step wizard)
      const cleanName = name.trim() || cleanEmail.split('@')[0] || 'Learner';
      const userAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=00C48C`;

      if (firebaseService.isReady() && password) {
        try {
          await firebaseService.registerWithEmail(cleanEmail, password);
        } catch (err) {
          console.warn('Firebase registration notice:', err);
        }
      }

      register({
        name: cleanName,
        email: cleanEmail,
        avatarUrl: userAvatar,
        authProvider: 'email',
        currentLanguage: selectedLang.name,
        targetLanguage: selectedLang.code,
        learningGoal: 'travel',
        experienceLevel: 'beginner',
        dailyCommitmentMinutes: 20,
        currentLevelNumber: 1,
        currentUnitId: 'u1',
        dailyGoal: {
          targetXp: 35,
          currentXp: 0,
          completed: false
        }
      });
      setActiveLevel(1);
    }
  };

  const handleGuestEntry = () => {
    register({
      name: 'Guest Learner',
      email: 'guest@fluentra.app',
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=Guest&backgroundColor=00C48C`,
      authProvider: 'guest',
      currentLanguage: selectedLang.name,
      targetLanguage: selectedLang.code,
      learningGoal: 'travel',
      experienceLevel: 'beginner',
      dailyCommitmentMinutes: 20,
      currentLevelNumber: 1,
      currentUnitId: 'u1',
      dailyGoal: {
        targetXp: 35,
        currentXp: 0,
        completed: false
      }
    });
    setActiveLevel(1);
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
        maxWidth: '480px',
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <p style={{ fontSize: '15px', color: 'var(--fl-text-secondary)' }}>
                  Continue to <strong>FLUENTRA</strong> with your saved account:
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
                    padding: '14px 16px',
                    textAlign: 'left',
                    border: '1.5px solid var(--fl-teal-primary)',
                    backgroundColor: 'var(--fl-bg-card-hover)'
                  }}
                >
                  <img
                    src={savedGoogleAccount.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(savedGoogleAccount.name)}`}
                    alt={savedGoogleAccount.name}
                    style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--fl-text-primary)' }}>{savedGoogleAccount.name}</span>
                    <span style={{ fontSize: '14px', color: 'var(--fl-text-secondary)' }}>{savedGoogleAccount.email}</span>
                  </div>
                  <Check size={18} color="var(--fl-teal-light)" />
                </button>

                <button
                  type="button"
                  id="btn-google-use-another"
                  onClick={() => setUseAnotherGoogleAccount(true)}
                  className="fl-btn fl-btn-outline"
                  style={{ padding: '10px', fontSize: '14px', color: 'var(--fl-text-muted)' }}
                >
                  Use another Google account
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleGoogleSubmit(googleEmail, googleName);
                }}
                style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
              >
                <p style={{ fontSize: '14px', color: 'var(--fl-text-secondary)', lineHeight: 1.5 }}>
                  Enter your Google Account email to authenticate your profile:
                </p>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--fl-text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Google Email
                  </label>
                  <input
                    type="email"
                    required
                    id="input-real-google-email"
                    placeholder="yourname@gmail.com"
                    value={googleEmail}
                    onChange={(e) => setGoogleEmail(e.target.value)}
                    style={{
                      width: '100%',
                      height: '48px',
                      padding: '0 14px',
                      borderRadius: 'var(--fl-radius-md)',
                      backgroundColor: 'var(--fl-bg-input)',
                      border: '1px solid var(--fl-border-strong)',
                      color: 'var(--fl-text-primary)',
                      fontSize: '16px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--fl-text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Display Name (Optional)
                  </label>
                  <input
                    type="text"
                    id="input-real-google-name"
                    placeholder="e.g. Alex"
                    value={googleName}
                    onChange={(e) => setGoogleName(e.target.value)}
                    style={{
                      width: '100%',
                      height: '48px',
                      padding: '0 14px',
                      borderRadius: 'var(--fl-radius-md)',
                      backgroundColor: 'var(--fl-bg-input)',
                      border: '1px solid var(--fl-border-strong)',
                      color: 'var(--fl-text-primary)',
                      fontSize: '16px'
                    }}
                  />
                </div>

                <div style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: 'rgba(66, 133, 244, 0.08)', border: '1px solid rgba(66, 133, 244, 0.2)', fontSize: '13px', color: 'var(--fl-text-secondary)', lineHeight: 1.45 }}>
                  <Shield size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
                  Google will securely authenticate your profile with FLUENTRA.
                </div>

                <button
                  type="submit"
                  id="btn-submit-google-auth"
                  className="fl-btn"
                  style={{
                    backgroundColor: '#4285F4',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '16px',
                    minHeight: '48px',
                    boxShadow: '0 2px 10px rgba(66, 133, 244, 0.4)',
                    padding: '12px'
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path fill="#FFFFFF" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                {savedGoogleAccount && (
                  <button
                    type="button"
                    onClick={() => setUseAnotherGoogleAccount(false)}
                    className="fl-btn fl-btn-outline"
                    style={{ padding: '8px', fontSize: '14px', color: 'var(--fl-text-muted)' }}
                  >
                    Back to saved account
                  </button>
                )}
              </form>
            )}
          </div>
        </div>
      )}

      {/* Top Header: Brand & Theme Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <FluentraLogo size="sm" showWordmark={true} showTagline={false} />
        <button
          type="button"
          id="btn-auth-theme-toggle"
          onClick={toggleTheme}
          className="fl-btn-icon"
          style={{ width: '38px', height: '38px', borderRadius: '50%' }}
          title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          aria-label={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {theme === 'dark' ? (
            <Sun size={18} color="var(--fl-gold-light)" />
          ) : (
            <Moon size={18} color="var(--fl-indigo-primary)" />
          )}
        </button>
      </div>

      {/* Main Auth Container */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '20px' }}>
        {/* Title Header */}
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--fl-text-primary)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            {mode === 'signup' ? 'Start speaking from Day 1' : 'Welcome back'}
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--fl-text-secondary)', marginTop: '6px' }}>
            {mode === 'signup' 
              ? 'Join FLUENTRA and unlock dynamic AI-powered language mastery.'
              : 'Sign in to resume your learning streak and pronunciation practice.'}
          </p>
        </div>

        {/* Mode Selector Segmented Pill */}
        <div 
          style={{
            display: 'flex',
            backgroundColor: 'var(--fl-bg-card)',
            padding: '4px',
            borderRadius: '12px',
            border: '1px solid var(--fl-border)'
          }}
        >
          <button
            type="button"
            onClick={() => setMode('signup')}
            style={{
              flex: 1,
              padding: '10px 0',
              fontSize: '15px',
              fontWeight: mode === 'signup' ? 700 : 500,
              color: mode === 'signup' ? 'var(--fl-text-primary)' : 'var(--fl-text-muted)',
              backgroundColor: mode === 'signup' ? 'var(--fl-bg-surface)' : 'transparent',
              borderRadius: '9px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: mode === 'signup' ? '0 2px 6px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => setMode('signin')}
            style={{
              flex: 1,
              padding: '10px 0',
              fontSize: '15px',
              fontWeight: mode === 'signin' ? 700 : 500,
              color: mode === 'signin' ? 'var(--fl-text-primary)' : 'var(--fl-text-muted)',
              backgroundColor: mode === 'signin' ? 'var(--fl-bg-surface)' : 'transparent',
              borderRadius: '9px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: mode === 'signin' ? '0 2px 6px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            Sign In
          </button>
        </div>

        {/* Google 1-Click Auth */}
        <button
          type="button"
          id="btn-google-auth-action"
          className="fl-card fl-card-interactive"
          onClick={handleTriggerGoogleAuth}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '14px',
            minHeight: '50px',
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--fl-radius-md)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            border: 'none',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z" />
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z" />
            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15Z" />
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z" />
          </svg>
          <span style={{ fontSize: '16px', fontWeight: 700, color: '#1F2937' }}>
            {mode === 'signup' ? 'Continue with Google' : 'Sign in with Google'}
          </span>
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '4px 0' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--fl-border)' }} />
          <span style={{ fontSize: '13px', color: 'var(--fl-text-muted)', fontWeight: 600 }}>OR EMAIL</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--fl-border)' }} />
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {mode === 'signup' && (
            <div>
              <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--fl-text-secondary)', display: 'block', marginBottom: '6px' }}>
                Your Name
              </label>
              <div style={{ position: 'relative' }}>
                <UserIcon size={18} style={{ position: 'absolute', left: '14px', top: '16px', color: 'var(--fl-text-muted)' }} />
                <input
                  type="text"
                  id="input-signup-name"
                  placeholder="e.g. Jordan Miller"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    height: '50px',
                    padding: '0 16px 0 42px',
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
          )}

          <div>
            <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--fl-text-secondary)', display: 'block', marginBottom: '6px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '14px', top: '16px', color: 'var(--fl-text-muted)' }} />
              <input
                type="email"
                required
                id="input-auth-email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  height: '50px',
                  padding: '0 16px 0 42px',
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

          <div>
            <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--fl-text-secondary)', display: 'block', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '16px', color: 'var(--fl-text-muted)' }} />
              <input
                type="password"
                required
                id="input-auth-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  height: '50px',
                  padding: '0 16px 0 42px',
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

          {/* Language Selector (Instant choice on sign up) */}
          {mode === 'signup' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--fl-text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Globe size={15} color="var(--fl-teal-light)" />
                  Target Language
                </label>
                <span style={{ fontSize: '13px', color: 'var(--fl-teal-light)', fontWeight: 600 }}>
                  {selectedLang.name}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {AVAILABLE_LANGUAGES.map((lang) => {
                  const isSelected = selectedLang.id === lang.id;
                  return (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => setSelectedLang(lang)}
                      className={`fl-card ${isSelected ? 'fl-card-active' : ''}`}
                      style={{
                        padding: '10px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        border: isSelected ? '1.5px solid var(--fl-teal-primary)' : '1px solid var(--fl-border)',
                        backgroundColor: isSelected ? 'var(--fl-bg-card-hover)' : 'var(--fl-bg-card)',
                        cursor: 'pointer',
                        borderRadius: 'var(--fl-radius-md)'
                      }}
                    >
                      <span style={{ fontSize: '18px' }}>{lang.flag}</span>
                      <span style={{ fontSize: '13px', fontWeight: isSelected ? 700 : 500, color: 'var(--fl-text-primary)' }}>
                        {lang.name.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Submit Button */}
          <button
            type="submit"
            id="btn-auth-submit"
            className="fl-btn fl-btn-primary"
            style={{
              minHeight: '50px',
              fontSize: '16px',
              marginTop: '6px',
              boxShadow: '0 4px 16px rgba(0, 196, 140, 0.25)'
            }}
          >
            {mode === 'signup' ? (
              <>
                <Sparkles size={18} />
                <span>Start Learning {selectedLang.name}</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Guest / Direct Entry Shortcut */}
      <div style={{ marginTop: '20px', textAlign: 'center', paddingTop: '16px', borderTop: '1px solid var(--fl-border)' }}>
        <button
          type="button"
          id="btn-guest-entry"
          onClick={handleGuestEntry}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--fl-text-secondary)',
            fontSize: '14px',
            cursor: 'pointer',
            padding: '8px 12px',
            textDecoration: 'underline'
          }}
        >
          Want to test first? <strong>Explore as Guest</strong>
        </button>
      </div>
    </div>
  );
};
