// FLUENTRA Profile, Personal Progress & Settings View
import React, { useState } from 'react';
import {
  User,
  Flame,
  Zap,
  Award,
  Volume2,
  RotateCcw,
  Check,
  Sparkles,
  LogOut,
  Sun,
  Moon,
  BookOpen,
  CheckCircle2,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useProgression } from '../context/ProgressionContext';
import { CURRICULUM_DATA } from '../data/curriculumRegistry';

export const ProfileView: React.FC = () => {
  const { profile, updateSettings, resetProgress, logout, theme, setTheme } = useUser();
  const {
    activeLevel,
    activeStage,
    activeCourse,
    progressMap,
    enrolledCourses,
    switchCourse
  } = useProgression();

  const [resetConfirm, setResetConfirm] = useState(false);

  // Level & Progression status calculations
  const currentLevelNum = activeLevel || profile.currentLevelNumber || 1;
  const currentLevelData = CURRICULUM_DATA.levels.find(l => l.number === currentLevelNum) || CURRICULUM_DATA.levels[0];
  const currentLevelUnits = CURRICULUM_DATA.units.filter(u => u.levelNumber === currentLevelNum);
  const completedLevelUnits = currentLevelUnits.filter(u => progressMap[u.id]?.status === 'completed');
  const levelCompletionPct = Math.round((completedLevelUnits.length / Math.max(currentLevelUnits.length, 1)) * 100);

  const totalCompletedUnits = Object.values(progressMap).filter(p => p.status === 'completed').length;
  const currentStageData = currentLevelData?.stages?.find(s => s.number === activeStage) || currentLevelData?.stages?.[0];

  const ACHIEVEMENTS = [
    { id: 'a1', title: 'First Words', desc: 'Completed your first interactive lesson', icon: Sparkles, unlocked: totalCompletedUnits > 0 || profile.stats.totalXp > 0 },
    { id: 'a2', title: 'Streak Flame', desc: 'Maintained a 5-day speaking habit', icon: Flame, unlocked: profile.streak.currentStreak >= 5 },
    { id: 'a3', title: 'Pronunciation Pro', desc: 'Achieved 85%+ on voice articulation', icon: Award, unlocked: profile.stats.pronunciationAverage >= 80 },
    { id: 'a4', title: 'Conversation Starter', desc: 'Mastered a real-world roleplay turn', icon: Zap, unlocked: true }
  ];

  const goalLabels: Record<string, string> = {
    travel: 'Travel & Exploration ✈️',
    career: 'Career & Professional 💼',
    daily: 'Daily Communication 💬',
    brain: 'Brain Training & Culture 🧠'
  };

  const currentFlag = activeCourse?.flag || '🇫🇷';
  const currentLangName = activeCourse?.languageId || profile.currentLanguage || 'French';

  return (
    <div
      className="content-scrollable"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        padding: '16px 16px calc(var(--fl-bottom-nav-height) + var(--fl-safe-bottom) + 24px)',
        maxWidth: '520px',
        margin: '0 auto',
        width: '100%'
      }}
    >
      {/* 1. Learner Identity & Account Status Header */}
      <div
        className="fl-card fl-card-active"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '20px',
          background: 'linear-gradient(135deg, rgba(88, 204, 2, 0.12) 0%, var(--fl-bg-card) 100%)',
          border: '1.5px solid var(--fl-teal-primary)'
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
            overflow: 'hidden',
            flexShrink: 0
          }}
        >
          <User size={36} color="var(--fl-teal-light)" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--fl-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {profile.name || 'Learner'}
            </h2>
            <button
              type="button"
              id="btn-profile-logout"
              onClick={logout}
              className="fl-btn-icon"
              style={{ width: '36px', height: '36px', flexShrink: 0 }}
              title="Sign Out / Switch Account"
            >
              <LogOut size={18} color="var(--fl-coral-flame)" />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: '13px',
                fontWeight: 700,
                color: 'var(--fl-teal-light)',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <span>{currentFlag}</span>
              <span>{currentLangName}</span>
            </span>

            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                backgroundColor: 'rgba(88, 204, 2, 0.15)',
                color: '#58CC02',
                padding: '2px 8px',
                borderRadius: '999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <ShieldCheck size={12} />
              Personal Track
            </span>
          </div>

          {profile.learningGoal && (
            <span style={{ fontSize: '12px', color: 'var(--fl-text-secondary)', marginTop: '4px' }}>
              Goal: {goalLabels[profile.learningGoal] || profile.learningGoal}
            </span>
          )}
        </div>
      </div>

      {/* 2. Active Level & Curriculum Status Card */}
      <div
        className="fl-card"
        style={{
          padding: '18px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          border: '1.5px solid rgba(88, 204, 2, 0.3)',
          background: 'var(--fl-bg-card)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(88, 204, 2, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <BookOpen size={18} color="#58CC02" />
            </div>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--fl-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Account Curriculum Status
              </span>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--fl-text-primary)' }}>
                Level {currentLevelNum}: {currentLevelData?.name || 'Foundations'}
              </h3>
            </div>
          </div>

          <span
            className="fl-badge"
            style={{
              backgroundColor: 'rgba(0, 196, 140, 0.12)',
              color: 'var(--fl-teal-light)',
              fontWeight: 800,
              fontSize: '12px',
              padding: '4px 10px',
              borderRadius: '8px',
              border: '1px solid rgba(0, 196, 140, 0.3)'
            }}
          >
            CEFR {currentLevelData?.cefr || 'A1.1'}
          </span>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--fl-text-secondary)', lineHeight: 1.5 }}>
          {currentLevelData?.description || 'Build core conversational fluency, articulation, and everyday vocabulary.'}
        </p>

        {/* Level Unit Completion Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700 }}>
            <span style={{ color: 'var(--fl-text-secondary)' }}>
              Level Mastery Progress
            </span>
            <span style={{ color: '#58CC02' }}>
              {completedLevelUnits.length} / {currentLevelUnits.length || 100} Units ({levelCompletionPct}%)
            </span>
          </div>
          <div
            style={{
              width: '100%',
              height: '10px',
              backgroundColor: 'var(--fl-border)',
              borderRadius: '999px',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${Math.max(levelCompletionPct, 3)}%`,
                height: '100%',
                backgroundColor: '#58CC02',
                borderRadius: '999px',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
        </div>

        {/* Active Stage Details */}
        {currentStageData && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: 'var(--fl-radius-sm)',
              backgroundColor: 'var(--fl-bg-card-hover)',
              border: '1px solid var(--fl-border)'
            }}
          >
            <Layers size={18} color="var(--fl-indigo-light)" style={{ flexShrink: 0 }} />
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--fl-indigo-light)', textTransform: 'uppercase' }}>
                Active Milestone · Stage {activeStage} of 10
              </span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--fl-text-primary)' }}>
                {currentStageData.title}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--fl-text-muted)' }}>
                {currentStageData.description}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 3. Personal Learning Statistics Matrix */}
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '12px', color: 'var(--fl-text-primary)' }}>
          Learning Statistics
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="fl-card" style={{ padding: '16px', textAlign: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--fl-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total XP
            </span>
            <p style={{ fontSize: '24px', fontWeight: 800, color: 'var(--fl-gold-star)', marginTop: '4px' }}>
              {profile.stats.totalXp}
            </p>
          </div>

          <div className="fl-card" style={{ padding: '16px', textAlign: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--fl-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Streak
            </span>
            <p style={{ fontSize: '24px', fontWeight: 800, color: 'var(--fl-coral-flame)', marginTop: '4px' }}>
              {profile.streak.currentStreak} Days
            </p>
          </div>

          <div className="fl-card" style={{ padding: '16px', textAlign: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--fl-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Pronunciation Avg
            </span>
            <p style={{ fontSize: '24px', fontWeight: 800, color: 'var(--fl-teal-light)', marginTop: '4px' }}>
              {profile.stats.pronunciationAverage}%
            </p>
          </div>

          <div className="fl-card" style={{ padding: '16px', textAlign: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--fl-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Units Mastered
            </span>
            <p style={{ fontSize: '24px', fontWeight: 800, color: 'var(--fl-indigo-light)', marginTop: '4px' }}>
              {totalCompletedUnits}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Enrolled Language Courses (Multi-Course Switcher) */}
      {enrolledCourses && enrolledCourses.length > 0 && (
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '12px', color: 'var(--fl-text-primary)' }}>
            Language Courses
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {enrolledCourses.map((course) => {
              const isCurrent = course.languageId === currentLangName;
              return (
                <div
                  key={course.languageId}
                  className="fl-card"
                  onClick={() => !isCurrent && switchCourse(course.languageId, course.languageCode, course.flag)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    cursor: isCurrent ? 'default' : 'pointer',
                    border: isCurrent ? '1.5px solid #58CC02' : '1px solid var(--fl-border)',
                    backgroundColor: isCurrent ? 'rgba(88, 204, 2, 0.05)' : 'var(--fl-bg-card)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '24px' }}>{course.flag}</span>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--fl-text-primary)' }}>
                        {course.languageId}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--fl-text-muted)' }}>
                        Level {course.activeLevel || 1} · {course.courseXp || 0} XP
                      </span>
                    </div>
                  </div>

                  {isCurrent ? (
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#58CC02',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <CheckCircle2 size={16} />
                      Active
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="fl-btn fl-btn-outline"
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                    >
                      Switch
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Achievements Showcase */}
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '12px', color: 'var(--fl-text-primary)' }}>
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
                  padding: '14px 16px',
                  opacity: ach.unlocked ? 1 : 0.45
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: ach.unlocked ? 'var(--fl-gold-subtle)' : 'rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Icon size={20} color={ach.unlocked ? 'var(--fl-gold-star)' : 'var(--fl-text-muted)'} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--fl-text-primary)' }}>
                    {ach.title}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--fl-text-secondary)', marginTop: '2px' }}>
                    {ach.desc}
                  </span>
                </div>

                {ach.unlocked && (
                  <Check size={18} color="var(--fl-teal-light)" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Audio & App Preferences */}
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '12px', color: 'var(--fl-text-primary)' }}>
          Preferences
        </h3>
        <div className="fl-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Sound Effects Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Volume2 size={20} color="var(--fl-text-secondary)" />
              <div>
                <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--fl-text-primary)' }}>Sound Effects & Chimes</p>
                <p style={{ fontSize: '12px', color: 'var(--fl-text-muted)', marginTop: '2px' }}>Audio cues for correct/incorrect answers</p>
              </div>
            </div>
            <input
              type="checkbox"
              id="pref-sound"
              checked={profile.soundEnabled}
              onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
              style={{ width: '20px', height: '20px', accentColor: '#58CC02' }}
            />
          </div>

          {/* Slow Audio Default */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--fl-border)', paddingTop: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={20} color="var(--fl-text-secondary)" />
              <div>
                <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--fl-text-primary)' }}>Slow Audio Default</p>
                <p style={{ fontSize: '12px', color: 'var(--fl-text-muted)', marginTop: '2px' }}>Play native pronunciations at 0.7x speed</p>
              </div>
            </div>
            <input
              type="checkbox"
              id="pref-slow-audio"
              checked={profile.slowAudioDefault}
              onChange={(e) => updateSettings({ slowAudioDefault: e.target.checked })}
              style={{ width: '20px', height: '20px', accentColor: '#58CC02' }}
            />
          </div>

          {/* Theme / Appearance Toggle */}
          <div style={{ borderTop: '1px solid var(--fl-border)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--fl-text-primary)' }}>App Appearance</p>
                <p style={{ fontSize: '12px', color: 'var(--fl-text-muted)', marginTop: '2px' }}>Switch between dark and light themes</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '4px' }}>
              <button
                type="button"
                id="btn-theme-dark"
                onClick={() => setTheme('dark')}
                className="fl-btn"
                style={{
                  padding: '10px 14px',
                  fontSize: '13px',
                  borderRadius: 'var(--fl-radius-md)',
                  border: theme === 'dark' ? '2px solid #58CC02' : '1px solid var(--fl-border)',
                  backgroundColor: theme === 'dark' ? 'rgba(88, 204, 2, 0.12)' : 'var(--fl-bg-card-hover)',
                  color: theme === 'dark' ? '#58CC02' : 'var(--fl-text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Moon size={16} />
                <span>Dark Theme</span>
                {theme === 'dark' && <Check size={14} />}
              </button>

              <button
                type="button"
                id="btn-theme-light"
                onClick={() => setTheme('light')}
                className="fl-btn"
                style={{
                  padding: '10px 14px',
                  fontSize: '13px',
                  borderRadius: 'var(--fl-radius-md)',
                  border: theme === 'light' ? '2px solid #58CC02' : '1px solid var(--fl-border)',
                  backgroundColor: theme === 'light' ? 'rgba(88, 204, 2, 0.12)' : 'var(--fl-bg-card-hover)',
                  color: theme === 'light' ? '#58CC02' : 'var(--fl-text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Sun size={16} />
                <span>Light Theme</span>
                {theme === 'light' && <Check size={14} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Account Management & Reset */}
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
            <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--fl-coral-flame)' }}>
              Are you sure you want to reset all progress?
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="fl-btn fl-btn-secondary"
                onClick={() => setResetConfirm(false)}
                style={{ flex: 1, padding: '10px', fontSize: '13px' }}
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
                style={{ flex: 1, padding: '10px', fontSize: '13px' }}
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
            style={{ width: '100%', color: 'var(--fl-text-muted)', fontSize: '13px', padding: '10px' }}
          >
            <RotateCcw size={15} />
            <span>Reset Progress</span>
          </button>
        )}
      </div>
    </div>
  );
};
