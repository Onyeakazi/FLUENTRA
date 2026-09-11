// FLUENTRA Home Daily Learning Dashboard
import React from 'react';
import { Play, Sparkles, Mic, MessageSquare, Zap, Flame, ArrowRight, Target } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useProgression } from '../context/ProgressionContext';
import { CURRICULUM_DATA } from '../data/curriculumRegistry';

interface HomeViewProps {
  onContinueCourse: () => void;
  onOpenSpeak: () => void;
  onOpenPractice: () => void;
  onOpenConversation: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onContinueCourse,
  onOpenSpeak,
  onOpenPractice,
  onOpenConversation
}) => {
  const { profile } = useUser();
  const { activeLevel, progressMap } = useProgression();

  // Find the highest available or in-progress unit in the current level
  const currentUnitId = profile.currentUnitId || 'u1';
  const currentUnit = CURRICULUM_DATA.unitsById[currentUnitId] || CURRICULUM_DATA.units[0];
  const unitProgress = progressMap[currentUnit.id];
  const completedLessonCount = unitProgress?.completedLessonIds.length || 0;
  const unitPercentage = Math.round((completedLessonCount / currentUnit.lessonCount) * 100);

  const dailyGoalPercent = Math.min(
    100,
    Math.round((profile.dailyGoal.currentXp / profile.dailyGoal.targetXp) * 100)
  );

  const goalLabels: Record<string, string> = {
    travel: 'Travel & Exploration ✈️',
    career: 'Career & Professional 💼',
    daily: 'Daily Communication 💬',
    brain: 'Brain Training & Culture 🧠'
  };

  return (
    <div className="content-scrollable" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Personalized Greeting & Language Banner */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--fl-teal-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Welcome Back, {profile.name || 'Learner'} 👋
          </span>
          {profile.learningGoal && (
            <span className="fl-badge fl-badge-teal" style={{ fontSize: '13px', padding: '3px 10px' }}>
              {goalLabels[profile.learningGoal] || profile.learningGoal}
            </span>
          )}
        </div>

        <h1 style={{ fontSize: '26px', fontWeight: 800, marginTop: '4px', color: 'var(--fl-text-primary)' }}>
          Continue Learning {profile.currentLanguage || 'French'}
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--fl-text-secondary)' }}>
          Level {activeLevel} · Stage {currentUnit.stageNumber}
        </p>
      </div>

      {/* Main Continuation Hero Card */}
      <div
        className="fl-card fl-card-active animate-pop-in"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          background: 'linear-gradient(135deg, rgba(0, 196, 140, 0.12) 0%, var(--fl-bg-card) 100%)',
          borderColor: 'rgba(0, 245, 180, 0.35)',
          boxShadow: '0 8px 30px rgba(0, 196, 140, 0.15)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="fl-badge fl-badge-teal" style={{ fontSize: '13px' }}>
            Active Unit {currentUnit.number}
          </span>
          <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--fl-text-secondary)' }}>
            {unitPercentage}% Completed
          </span>
        </div>

        <div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--fl-text-primary)' }}>
            {currentUnit.title}
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--fl-text-secondary)', marginTop: '2px' }}>
            {currentUnit.subtitle}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="fl-progress-track">
          <div className="fl-progress-fill" style={{ width: `${Math.max(8, unitPercentage)}%` }} />
        </div>

        <button
          type="button"
          id="btn-home-continue-lesson"
          className="fl-btn fl-btn-primary"
          onClick={onContinueCourse}
          style={{ width: '100%', marginTop: '4px', minHeight: '50px', fontSize: '16px' }}
        >
          <Play size={18} fill="currentColor" />
          <span>Continue Lesson</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Daily Motivation Row: Streak & Daily Goal */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {/* Streak Tile */}
        <div className="fl-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--fl-text-muted)', textTransform: 'uppercase' }}>
              Daily Streak
            </span>
            <Flame size={20} color="var(--fl-coral-flame)" fill="var(--fl-coral-flame)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span style={{ fontSize: '26px', fontWeight: 800, color: 'var(--fl-coral-flame)' }}>
              {profile.streak.currentStreak}
            </span>
            <span style={{ fontSize: '14px', color: 'var(--fl-text-secondary)' }}>days on fire</span>
          </div>
        </div>

        {/* Daily Goal Tile */}
        <div className="fl-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--fl-text-muted)', textTransform: 'uppercase' }}>
              Daily Goal
            </span>
            <Zap size={20} color="var(--fl-gold-star)" fill="var(--fl-gold-star)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span style={{ fontSize: '26px', fontWeight: 800, color: 'var(--fl-gold-star)' }}>
              {profile.dailyGoal.currentXp}
            </span>
            <span style={{ fontSize: '14px', color: 'var(--fl-text-secondary)' }}>/ {profile.dailyGoal.targetXp} XP</span>
          </div>
          <div className="fl-progress-track" style={{ height: '4px' }}>
            <div className="fl-progress-fill fl-progress-fill-gold" style={{ width: `${dailyGoalPercent}%` }} />
          </div>
        </div>
      </div>

      {/* Recommended Practice Quick Actions */}
      <div>
        <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '12px', color: 'var(--fl-text-primary)' }}>
          Targeted Practice
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Pronunciation Practice */}
          <button
            type="button"
            className="fl-card fl-card-interactive"
            onClick={onOpenSpeak}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 18px',
              textAlign: 'left',
              width: '100%'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: 'var(--fl-radius-md)',
                  backgroundColor: 'var(--fl-coral-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Mic size={22} color="var(--fl-coral-flame)" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '17px', fontWeight: 700, color: 'var(--fl-text-primary)' }}>
                  Voice Pronunciation Studio
                </span>
                <span style={{ fontSize: '14px', color: 'var(--fl-text-secondary)', marginTop: '2px' }}>
                  Practice target sounds with instant phonetic feedback
                </span>
              </div>
            </div>
            <ArrowRight size={20} color="var(--fl-text-muted)" />
          </button>

          {/* AI Roleplay Conversation */}
          <button
            type="button"
            className="fl-card fl-card-interactive"
            onClick={onOpenConversation}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 18px',
              textAlign: 'left',
              width: '100%'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: 'var(--fl-radius-md)',
                  backgroundColor: 'var(--fl-teal-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <MessageSquare size={22} color="var(--fl-teal-light)" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '17px', fontWeight: 700, color: 'var(--fl-text-primary)' }}>
                  Real-World AI Conversation
                </span>
                <span style={{ fontSize: '14px', color: 'var(--fl-text-secondary)', marginTop: '2px' }}>
                  Level-aware roleplay in cafés, airports, and social situations
                </span>
              </div>
            </div>
            <ArrowRight size={20} color="var(--fl-text-muted)" />
          </button>

          {/* Interactive Drills */}
          <button
            type="button"
            className="fl-card fl-card-interactive"
            onClick={onOpenPractice}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 18px',
              textAlign: 'left',
              width: '100%'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: 'var(--fl-radius-md)',
                  backgroundColor: 'var(--fl-indigo-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Sparkles size={22} color="var(--fl-indigo-light)" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '17px', fontWeight: 700, color: 'var(--fl-text-primary)' }}>
                  Active Recall Drills
                </span>
                <span style={{ fontSize: '14px', color: 'var(--fl-text-secondary)', marginTop: '2px' }}>
                  Matching, sentence building & listening comprehension
                </span>
              </div>
            </div>
            <ArrowRight size={20} color="var(--fl-text-muted)" />
          </button>
        </div>
      </div>
    </div>
  );
};
