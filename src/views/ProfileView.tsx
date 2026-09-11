// FLUENTRA Profile, Achievements & Settings View
import React, { useState } from 'react';
import { User, Flame, Zap, Award, Volume2, RotateCcw, Check, Sparkles, LogOut, Target, Globe, Cpu, Key, RefreshCw, Sun, Moon } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { aiCurriculumGenerator } from '../services/aiCurriculumGenerator';

export const ProfileView: React.FC = () => {
  const { profile, updateSettings, resetProgress, logout, theme, setTheme } = useUser();
  const [resetConfirm, setResetConfirm] = useState(false);
  const [geminiKey, setGeminiKey] = useState(aiCurriculumGenerator.getGeminiApiKey() || '');
  const [keySaved, setKeySaved] = useState(false);
  const [cacheCleared, setCacheCleared] = useState(false);

  const handleSaveApiKey = () => {
    aiCurriculumGenerator.setGeminiApiKey(geminiKey);
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2500);
  };

  const handleClearAiCache = () => {
    try {
      Object.keys(localStorage).forEach(k => {
        if (k.startsWith('fluentra_ai_lessons_cache')) {
          localStorage.removeItem(k);
        }
      });
      setCacheCleared(true);
      setTimeout(() => setCacheCleared(false), 2500);
    } catch {
      // Safe
    }
  };

  const ACHIEVEMENTS = [
    { id: 'a1', title: 'First Words', desc: 'Completed your first interactive lesson', icon: Sparkles, unlocked: true },
    { id: 'a2', title: 'Streak Flame', desc: 'Maintained a 5-day speaking habit', icon: Flame, unlocked: profile.streak.currentStreak >= 5 },
    { id: 'a3', title: 'Pronunciation Pro', desc: 'Achieved 85%+ on voice articulation', icon: Award, unlocked: profile.stats.pronunciationAverage >= 80 },
    { id: 'a4', title: 'Conversation Starter', desc: 'Completed a real-world roleplay turn', icon: Zap, unlocked: true }
  ];

  const goalLabels: Record<string, string> = {
    travel: 'Travel & Exploration ✈️',
    career: 'Career & Professional 💼',
    daily: 'Daily Communication 💬',
    brain: 'Brain Training & Culture 🧠'
  };

  return (
    <div className="content-scrollable" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Learner Identity Card */}
      <div
        className="fl-card fl-card-active"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '20px',
          background: 'linear-gradient(135deg, rgba(0, 196, 140, 0.12) 0%, var(--fl-bg-card) 100%)'
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--fl-teal-subtle)',
            border: '2px solid var(--fl-teal-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          <User size={36} color="var(--fl-teal-light)" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--fl-text-primary)' }}>
              {profile.name || 'Learner'}
            </h2>
            <button
              type="button"
              id="btn-profile-logout"
              onClick={logout}
              className="fl-btn-icon"
              style={{ width: '36px', height: '36px' }}
              title="Sign Out / Switch Account"
            >
              <LogOut size={18} color="var(--fl-coral-flame)" />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
            <span style={{ fontSize: '14px', color: 'var(--fl-teal-light)', fontWeight: 600 }}>
              Learning {profile.currentLanguage || 'French'} · Level {profile.currentLevelNumber}
            </span>
          </div>

          {profile.learningGoal && (
            <span style={{ fontSize: '13px', color: 'var(--fl-text-secondary)', marginTop: '4px' }}>
              Goal: {goalLabels[profile.learningGoal] || profile.learningGoal}
            </span>
          )}
        </div>
      </div>

      {/* Learning Stats Matrix */}
      <div>
        <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '12px' }}>
          Learning Statistics
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="fl-card" style={{ padding: '16px', textAlign: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--fl-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total XP
            </span>
            <p style={{ fontSize: '26px', fontWeight: 800, color: 'var(--fl-gold-star)', marginTop: '4px' }}>
              {profile.stats.totalXp}
            </p>
          </div>

          <div className="fl-card" style={{ padding: '16px', textAlign: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--fl-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Streak
            </span>
            <p style={{ fontSize: '26px', fontWeight: 800, color: 'var(--fl-coral-flame)', marginTop: '4px' }}>
              {profile.streak.currentStreak} Days
            </p>
          </div>

          <div className="fl-card" style={{ padding: '16px', textAlign: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--fl-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Pronunciation Avg
            </span>
            <p style={{ fontSize: '26px', fontWeight: 800, color: 'var(--fl-teal-light)', marginTop: '4px' }}>
              {profile.stats.pronunciationAverage}%
            </p>
          </div>

          <div className="fl-card" style={{ padding: '16px', textAlign: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--fl-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Words Learned
            </span>
            <p style={{ fontSize: '26px', fontWeight: 800, color: 'var(--fl-indigo-light)', marginTop: '4px' }}>
              {profile.stats.wordsLearned}
            </p>
          </div>
        </div>
      </div>

      {/* Achievements Showcase */}
      <div>
        <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '12px' }}>
          Achievements
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {ACHIEVEMENTS.map((ach) => {
            const Icon = ach.icon;
            return (
              <div
                key={ach.id}
                className="fl-card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '16px 18px',
                  opacity: ach.unlocked ? 1 : 0.45
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    backgroundColor: ach.unlocked ? 'var(--fl-gold-subtle)' : 'rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Icon size={22} color={ach.unlocked ? 'var(--fl-gold-star)' : 'var(--fl-text-muted)'} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--fl-text-primary)' }}>
                    {ach.title}
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--fl-text-secondary)', marginTop: '2px' }}>
                    {ach.desc}
                  </span>
                </div>

                {ach.unlocked && (
                  <Check size={20} color="var(--fl-teal-light)" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Dynamic Curriculum & Engine Settings */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 800 }}>
            AI Curriculum & Intelligence
          </h3>
          <span className="fl-badge fl-badge-teal" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Cpu size={14} />
            100% Dynamic Engine
          </span>
        </div>

        <div className="fl-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px', borderColor: 'rgba(0, 196, 140, 0.3)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Sparkles size={18} color="var(--fl-teal-light)" />
              <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--fl-text-primary)' }}>
                Zero Hardcoded Lessons
              </span>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--fl-text-secondary)', lineHeight: 1.55 }}>
              Every exercise and dialogue is dynamically synthesized in real time to match your exact CEFR level, target language ({profile.currentLanguage}), and motivation ({goalLabels[profile.learningGoal || 'travel'] || 'Travel'}).
            </p>
          </div>

          <div style={{ borderTop: '1px solid var(--fl-border)', paddingTop: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Key size={16} color="var(--fl-gold-star)" />
                <span style={{ fontSize: '14px', fontWeight: 600 }}>Google Gemini API Key (Optional)</span>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--fl-text-muted)' }}>
                {geminiKey ? 'Custom Cloud LLM Active' : 'Adaptive Synthesizer Active'}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="password"
                id="input-gemini-key"
                placeholder="AIzaSy... (leave blank to use built-in synthesizer)"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                className="fl-input"
                style={{ flex: 1, fontSize: '14px', padding: '10px 14px' }}
              />
              <button
                type="button"
                id="btn-save-gemini-key"
                onClick={handleSaveApiKey}
                className="fl-btn fl-btn-primary"
                style={{ padding: '10px 16px', fontSize: '14px', borderRadius: 'var(--fl-radius-sm)', whiteSpace: 'nowrap' }}
              >
                {keySaved ? 'Saved! ✓' : 'Save'}
              </button>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--fl-border)', paddingTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', color: 'var(--fl-text-muted)' }}>
              Want to force regenerate all cached lessons?
            </span>
            <button
              type="button"
              id="btn-clear-ai-cache"
              onClick={handleClearAiCache}
              className="fl-btn fl-btn-outline"
              style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <RefreshCw size={13} />
              <span>{cacheCleared ? 'Cleared! ✓' : 'Reset AI Cache'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Audio & App Preferences */}
      <div>
        <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '12px' }}>
          Preferences
        </h3>
        <div className="fl-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Sound Effects Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Volume2 size={20} color="var(--fl-text-secondary)" />
              <div>
                <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--fl-text-primary)' }}>Sound Effects & Chimes</p>
                <p style={{ fontSize: '13px', color: 'var(--fl-text-muted)', marginTop: '2px' }}>Audio cues for correct/incorrect answers</p>
              </div>
            </div>
            <input
              type="checkbox"
              id="pref-sound"
              checked={profile.soundEnabled}
              onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
              style={{ width: '20px', height: '20px', accentColor: 'var(--fl-teal-light)' }}
            />
          </div>

          {/* Slow Audio Default */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--fl-border)', paddingTop: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={20} color="var(--fl-text-secondary)" />
              <div>
                <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--fl-text-primary)' }}>Slow Audio Default</p>
                <p style={{ fontSize: '13px', color: 'var(--fl-text-muted)', marginTop: '2px' }}>Play native pronunciations at 0.7x speed</p>
              </div>
            </div>
            <input
              type="checkbox"
              id="pref-slow-audio"
              checked={profile.slowAudioDefault}
              onChange={(e) => updateSettings({ slowAudioDefault: e.target.checked })}
              style={{ width: '20px', height: '20px', accentColor: 'var(--fl-teal-light)' }}
            />
          </div>

          {/* Theme / Appearance Toggle */}
          <div style={{ borderTop: '1px solid var(--fl-border)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--fl-text-primary)' }}>App Appearance & Theme</p>
                <p style={{ fontSize: '13px', color: 'var(--fl-text-muted)', marginTop: '2px' }}>Switch between high-contrast dark and clean light mode</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '4px' }}>
              <button
                type="button"
                id="btn-theme-dark"
                onClick={() => setTheme('dark')}
                className="fl-btn"
                style={{
                  padding: '12px 16px',
                  fontSize: '14px',
                  borderRadius: 'var(--fl-radius-md)',
                  border: theme === 'dark' ? '2px solid var(--fl-teal-primary)' : '1px solid var(--fl-border)',
                  backgroundColor: theme === 'dark' ? 'rgba(0, 196, 140, 0.12)' : 'var(--fl-bg-card-hover)',
                  color: theme === 'dark' ? 'var(--fl-teal-light)' : 'var(--fl-text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Moon size={18} />
                <span>Dark Theme</span>
                {theme === 'dark' && <Check size={16} />}
              </button>

              <button
                type="button"
                id="btn-theme-light"
                onClick={() => setTheme('light')}
                className="fl-btn"
                style={{
                  padding: '12px 16px',
                  fontSize: '14px',
                  borderRadius: 'var(--fl-radius-md)',
                  border: theme === 'light' ? '2px solid var(--fl-teal-primary)' : '1px solid var(--fl-border)',
                  backgroundColor: theme === 'light' ? 'rgba(0, 196, 140, 0.12)' : 'var(--fl-bg-card-hover)',
                  color: theme === 'light' ? 'var(--fl-teal-primary)' : 'var(--fl-text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Sun size={18} />
                <span>Light Theme</span>
                {theme === 'light' && <Check size={16} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Account Management & Reset */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button
          type="button"
          id="btn-profile-switch-account"
          className="fl-btn fl-btn-secondary"
          onClick={logout}
          style={{ width: '100%', minHeight: '48px', fontSize: '15px' }}
        >
          <LogOut size={18} />
          <span>Switch Account / Change Target Language</span>
        </button>

        {resetConfirm ? (
          <div className="fl-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', borderColor: 'var(--fl-coral-flame)' }}>
            <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--fl-coral-flame)' }}>
              Are you sure you want to reset all progress?
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="fl-btn fl-btn-secondary"
                onClick={() => setResetConfirm(false)}
                style={{ flex: 1, padding: '10px', fontSize: '14px' }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="fl-btn fl-btn-coral"
                onClick={() => {
                  resetProgress();
                  setResetConfirm(false);
                }}
                style={{ flex: 1, padding: '10px', fontSize: '14px' }}
              >
                Confirm Reset
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="fl-btn fl-btn-outline"
            onClick={() => setResetConfirm(true)}
            style={{ width: '100%', color: 'var(--fl-text-muted)', fontSize: '14px', padding: '10px' }}
          >
            <RotateCcw size={16} />
            <span>Reset Progress</span>
          </button>
        )}
      </div>
    </div>
  );
};
