// FLUENTRA Dedicated Account Setup Flow (Post-Registration Setup)
import React, { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, Check, Sun, Moon, Globe, Target, Clock, Zap } from 'lucide-react';
import { FluentraLogo } from '../components/brand/FluentraLogo';
import { useUser } from '../context/UserContext';
import { useProgression } from '../context/ProgressionContext';

import { AVAILABLE_LANGUAGES, LanguageOption } from '../data/languages';

const LEARNING_GOALS = [
  { id: 'travel', title: 'Travel & Exploration ✈️', desc: 'Order dining, ask directions, navigate airports & immerse in culture' },
  { id: 'career', title: 'Career & Professional 💼', desc: 'Ace job interviews, team meetings, client pitches & business emails' },
  { id: 'daily', title: 'Daily Conversation 💬', desc: 'Chat naturally with friends, locals, neighbors & social circles' },
  { id: 'brain', title: 'Brain Training & Culture 🧠', desc: 'Cognitive sharpness, world literature, philosophy & mindset' }
];

const COMMITMENTS = [
  { id: 15, label: 'Casual', time: '15 min / day', xp: 20 },
  { id: 20, label: 'Regular', time: '20 min / day', xp: 35, popular: true },
  { id: 30, label: 'Serious', time: '30 min / day', xp: 50 },
  { id: 45, label: 'Intense', time: '45 min / day', xp: 75 }
];

export const AccountSetupView: React.FC = () => {
  const { profile, completeAccountSetup, theme, toggleTheme } = useUser();
  const { setActiveLevel } = useProgression();

  const [step, setStep] = useState(1);
  const [selectedLang, setSelectedLang] = useState<LanguageOption>(AVAILABLE_LANGUAGES[0]); // Chinese Mandarin default
  const [selectedGoal, setSelectedGoal] = useState<'travel' | 'career' | 'daily' | 'brain'>('travel');
  const [selectedCommitment, setSelectedCommitment] = useState(COMMITMENTS[1]);

  const handleFinishSetup = () => {
    completeAccountSetup({
      currentLanguage: selectedLang.name,
      targetLanguage: selectedLang.code,
      learningGoal: selectedGoal,
      experienceLevel: 'beginner',
      dailyCommitmentMinutes: selectedCommitment.id,
      currentLevelNumber: 1,
      currentUnitId: 'u1',
      dailyGoal: {
        targetXp: selectedCommitment.xp,
        currentXp: 0,
        completed: false
      }
    });
    setActiveLevel(1);
  };

  const handleSkipSetup = () => {
    completeAccountSetup({
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

  const firstName = profile.name ? profile.name.split(' ')[0] : 'there';

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
        maxWidth: '520px',
        margin: '0 auto',
        position: 'relative'
      }}
    >
      {/* Top Navigation & Status */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <FluentraLogo size="sm" showWordmark={true} showTagline={false} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              id="btn-skip-setup"
              onClick={handleSkipSetup}
              className="fl-btn fl-btn-outline"
              style={{ padding: '6px 12px', fontSize: '13px', color: 'var(--fl-text-secondary)', borderRadius: '999px' }}
            >
              Skip for now
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="fl-btn-icon"
              style={{ width: '36px', height: '36px', borderRadius: '50%' }}
              title="Toggle Theme"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun size={17} color="var(--fl-gold-light)" />
              ) : (
                <Moon size={17} color="var(--fl-indigo-primary)" />
              )}
            </button>
          </div>
        </div>

        {/* Multi-step progress indicator */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '24px' }}>
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              style={{
                flex: 1,
                height: '5px',
                borderRadius: '999px',
                backgroundColor: s <= step ? 'var(--fl-teal-light)' : 'rgba(255, 255, 255, 0.12)',
                transition: 'all 0.25s ease'
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Step Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {/* ================= STEP 1: LANGUAGE SELECTION ================= */}
        {step === 1 && (
          <div className="animate-pop-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <span className="fl-badge fl-badge-teal">
                Account Setup · Step 1 of 3
              </span>
              <h2 style={{ fontSize: '26px', fontWeight: 800, marginTop: '8px', color: 'var(--fl-text-primary)' }}>
                Welcome, {firstName}! What language would you like to learn?
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--fl-text-secondary)', marginTop: '4px' }}>
                Your dynamic AI curriculum and speech recognition will tailor to this language.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {AVAILABLE_LANGUAGES.map((lang) => {
                const isSelected = selectedLang.id === lang.id;
                return (
                  <button
                    key={lang.id}
                    type="button"
                    id={`setup-lang-${lang.id}`}
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
                      <span style={{ fontSize: '30px' }}>{lang.flag}</span>
                      <div>
                        <span style={{ fontSize: '17px', fontWeight: 700, color: 'var(--fl-text-primary)' }}>
                          {lang.name}
                        </span>
                        <span style={{ fontSize: '13px', color: 'var(--fl-text-secondary)', display: 'block', marginTop: '2px' }}>
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

        {/* ================= STEP 2: LEARNING GOAL ================= */}
        {step === 2 && (
          <div className="animate-pop-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <span className="fl-badge fl-badge-teal">
                Account Setup · Step 2 of 3
              </span>
              <h2 style={{ fontSize: '26px', fontWeight: 800, marginTop: '8px', color: 'var(--fl-text-primary)' }}>
                Why are you learning {selectedLang.name}?
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--fl-text-secondary)', marginTop: '4px' }}>
                We'll tune your AI conversation scenarios and lesson vocabulary to match your goals.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {LEARNING_GOALS.map((goal) => {
                const isSelected = selectedGoal === goal.id;
                return (
                  <button
                    key={goal.id}
                    type="button"
                    id={`setup-goal-${goal.id}`}
                    onClick={() => setSelectedGoal(goal.id as any)}
                    className={`fl-card fl-card-interactive ${isSelected ? 'fl-card-active' : ''}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 18px',
                      textAlign: 'left'
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '17px', fontWeight: 700, color: 'var(--fl-text-primary)' }}>
                        {goal.title}
                      </span>
                      <span style={{ fontSize: '14px', color: 'var(--fl-text-secondary)', display: 'block', marginTop: '3px' }}>
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

        {/* ================= STEP 3: PRACTICE TARGET ================= */}
        {step === 3 && (
          <div className="animate-pop-in" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <span className="fl-badge fl-badge-teal">
                Account Setup · Step 3 of 3
              </span>
              <h2 style={{ fontSize: '26px', fontWeight: 800, marginTop: '8px', color: 'var(--fl-text-primary)' }}>
                Set your daily practice commitment
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--fl-text-secondary)', marginTop: '4px' }}>
                Small daily practice leads to long-lasting speaking fluency.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {COMMITMENTS.map((c) => {
                const isSelected = selectedCommitment.id === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    id={`setup-commit-${c.id}`}
                    onClick={() => setSelectedCommitment(c)}
                    className={`fl-card fl-card-interactive ${isSelected ? 'fl-card-active' : ''}`}
                    style={{
                      padding: '18px 14px',
                      textAlign: 'center',
                      position: 'relative'
                    }}
                  >
                    {c.popular && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '-10px',
                          right: '12px',
                          backgroundColor: 'var(--fl-teal-primary)',
                          color: '#FFFFFF',
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '999px'
                        }}
                      >
                        RECOMMENDED
                      </span>
                    )}
                    <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--fl-text-primary)', display: 'block' }}>
                      {c.label}
                    </span>
                    <span style={{ fontSize: '14px', color: 'var(--fl-text-secondary)', marginTop: '4px', display: 'block' }}>
                      {c.time}
                    </span>
                    <span className="fl-badge fl-badge-gold" style={{ marginTop: '10px', fontSize: '13px', padding: '3px 10px' }}>
                      +{c.xp} XP / day
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--fl-border)' }}>
        {step > 1 && (
          <button
            type="button"
            className="fl-btn fl-btn-secondary"
            onClick={() => setStep(prev => prev - 1)}
            style={{ flex: 1, minHeight: '50px', fontSize: '16px' }}
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>
        )}

        {step < 3 ? (
          <button
            type="button"
            id="btn-setup-next"
            className="fl-btn fl-btn-primary"
            onClick={() => setStep(prev => prev + 1)}
            style={{ flex: step === 1 ? 1 : 1.5, minHeight: '50px', fontSize: '16px' }}
          >
            <span>Continue</span>
            <ArrowRight size={18} />
          </button>
        ) : (
          <button
            type="button"
            id="btn-setup-finish"
            className="fl-btn fl-btn-primary"
            onClick={handleFinishSetup}
            style={{ flex: 1.5, minHeight: '50px', fontSize: '16px', boxShadow: '0 4px 16px rgba(0, 196, 140, 0.25)' }}
          >
            <Sparkles size={18} />
            <span>Complete Setup & Launch</span>
          </button>
        )}
      </div>
    </div>
  );
};
