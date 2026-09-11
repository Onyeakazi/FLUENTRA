// FLUENTRA Pure Authentication View (Google OAuth & Email Auth)
import React, { useState } from 'react';
import { ArrowRight, Sun, Moon, Lock, Mail, User as UserIcon, AlertCircle, Loader2 } from 'lucide-react';
import { FluentraLogo } from '../components/brand/FluentraLogo';
import { useUser } from '../context/UserContext';
import { firebaseService } from '../services/firebase';

export const AuthOnboardingView: React.FC = () => {
  const { login, register, theme, toggleTheme } = useUser();

  const [mode, setMode] = useState<'signup' | 'signin'>('signup');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Email/Password Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleAuth = async () => {
    setAuthError(null);
    setIsGoogleLoading(true);

    try {
      if (!firebaseService.isReady()) {
        throw new Error('Firebase is not initialized. Please verify your environment variables.');
      }

      const res = await firebaseService.signInWithGoogle();
      if (res && res.user) {
        const fbUser = res.user;
        const cleanEmail = fbUser.email || '';
        const cleanName = fbUser.displayName || cleanEmail.split('@')[0] || 'Learner';
        const avatar = fbUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=00C48C`;

        if (mode === 'signin' && !res.isNewUser) {
          login(cleanEmail);
        } else {
          register({
            id: fbUser.uid,
            name: cleanName,
            email: cleanEmail,
            avatarUrl: avatar,
            authProvider: 'google',
            isSetupCompleted: false
          });
        }
      }
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      const code = err?.code || '';
      const msg = err?.message || '';

      if (code === 'auth/operation-not-allowed' || msg.includes('operation-not-allowed') || code === 'auth/configuration-not-found') {
        setAuthError(
          'Google Sign-In is not enabled in your Firebase Console yet. Go to Firebase Console > Authentication > Sign-in method, click Google, and enable it.'
        );
      } else if (code === 'auth/popup-blocked') {
        setAuthError('The sign-in popup was blocked by your browser. Please allow popups for localhost:5173 and try again.');
      } else if (code === 'auth/popup-closed-by-user') {
        setAuthError('Sign-in was cancelled before completion.');
      } else if (code === 'auth/unauthorized-domain') {
        setAuthError('This domain is not authorized in Firebase. Add "localhost" under Authentication > Settings > Authorized domains in Firebase Console.');
      } else {
        setAuthError(msg || 'An error occurred during Google sign in. Please try again.');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const cleanEmail = email.trim();
    if (!cleanEmail) return;

    setIsEmailLoading(true);

    try {
      if (mode === 'signin') {
        if (firebaseService.isReady() && password) {
          try {
            await firebaseService.signInWithEmail(cleanEmail, password);
          } catch (err: any) {
            console.warn('Firebase email sign-in:', err);
            if (err?.code === 'auth/user-not-found' || err?.code === 'auth/wrong-password' || err?.code === 'auth/invalid-credential') {
              setAuthError('Invalid email or password. Please check your credentials.');
              setIsEmailLoading(false);
              return;
            }
          }
        }
        login(cleanEmail, password);
      } else {
        const cleanName = name.trim() || cleanEmail.split('@')[0] || 'Learner';
        let firebaseUid = '';

        if (firebaseService.isReady() && password) {
          try {
            const user = await firebaseService.registerWithEmail(cleanEmail, password);
            if (user) firebaseUid = user.uid;
          } catch (err: any) {
            console.warn('Firebase registration notice:', err);
            if (err?.code === 'auth/email-already-in-use') {
              setAuthError('An account with this email already exists. Please switch to Sign In.');
              setIsEmailLoading(false);
              return;
            } else if (err?.code === 'auth/weak-password') {
              setAuthError('Password is too weak. Please use at least 6 characters.');
              setIsEmailLoading(false);
              return;
            }
          }
        }

        const userAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=00C48C`;

        register({
          id: firebaseUid || `learner_${Date.now()}`,
          name: cleanName,
          email: cleanEmail,
          avatarUrl: userAvatar,
          authProvider: 'email',
          isSetupCompleted: false
        });
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Authentication error. Please try again.');
    } finally {
      setIsEmailLoading(false);
    }
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
        maxWidth: '460px',
        margin: '0 auto',
        position: 'relative'
      }}
    >
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

      {/* Main Auth Form Container */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '20px' }}>
        {/* Title Header */}
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--fl-text-primary)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            {mode === 'signup' ? 'Create your account' : 'Welcome back'}
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--fl-text-secondary)', marginTop: '6px' }}>
            {mode === 'signup' 
              ? 'Join FLUENTRA to master languages with dynamic AI conversation.'
              : 'Sign in to resume your learning streak and pronunciation practice.'}
          </p>
        </div>

        {/* Error Alert Box (if any) */}
        {authError && (
          <div
            className="animate-fade-in"
            style={{
              padding: '14px 16px',
              borderRadius: 'var(--fl-radius-md)',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}
          >
            <AlertCircle size={20} color="var(--fl-error)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '14px', color: 'var(--fl-text-primary)', lineHeight: 1.5 }}>
              {authError}
            </div>
          </div>
        )}

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
            onClick={() => { setMode('signup'); setAuthError(null); }}
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
            onClick={() => { setMode('signin'); setAuthError(null); }}
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

        {/* Real Google OAuth 1-Click Button */}
        <button
          type="button"
          id="btn-google-auth-action"
          className="fl-card fl-card-interactive"
          onClick={handleGoogleAuth}
          disabled={isGoogleLoading}
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
            cursor: isGoogleLoading ? 'not-allowed' : 'pointer',
            width: '100%',
            opacity: isGoogleLoading ? 0.75 : 1
          }}
        >
          {isGoogleLoading ? (
            <Loader2 size={20} className="animate-spin" color="#1F2937" />
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z" />
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15Z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z" />
            </svg>
          )}
          <span style={{ fontSize: '16px', fontWeight: 700, color: '#1F2937' }}>
            {isGoogleLoading
              ? 'Opening Google Sign-In...'
              : mode === 'signup'
              ? 'Sign up with Google'
              : 'Sign in with Google'}
          </span>
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '4px 0' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--fl-border)' }} />
          <span style={{ fontSize: '13px', color: 'var(--fl-text-muted)', fontWeight: 600 }}>OR EMAIL</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--fl-border)' }} />
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {mode === 'signup' && (
            <div>
              <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--fl-text-secondary)', display: 'block', marginBottom: '6px' }}>
                Full Name
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

          {/* Action Submit Button */}
          <button
            type="submit"
            id="btn-auth-submit"
            disabled={isEmailLoading}
            className="fl-btn fl-btn-primary"
            style={{
              minHeight: '50px',
              fontSize: '16px',
              marginTop: '6px',
              boxShadow: '0 4px 16px rgba(0, 196, 140, 0.25)',
              opacity: isEmailLoading ? 0.75 : 1
            }}
          >
            {isEmailLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : mode === 'signup' ? (
              <>
                <span>Create Account</span>
                <ArrowRight size={18} />
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

      <div style={{ height: '24px' }} />
    </div>
  );
};
