import React, { useState } from 'react';
import { Flame, Zap, Award, Sun, Moon, ChevronDown } from 'lucide-react';
import { FluentraLogo } from '../brand/FluentraLogo';
import { useUser } from '../../context/UserContext';
import { useProgression } from '../../context/ProgressionContext';
import { LANG_FLAGS } from '../../data/languages';
import { CourseSwitcherModal } from './CourseSwitcherModal';

export const TopBar: React.FC = () => {
  const { profile, theme, toggleTheme } = useUser();
  const { activeLevel } = useProgression();
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);

  const flag = LANG_FLAGS[profile.currentLanguage] || '🇫🇷';
  const initial = (profile.name || 'L').charAt(0).toUpperCase();

  return (
    <>
      <header className="fl-top-bar" role="banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FluentraLogo size="sm" showWordmark={true} showTagline={false} />
          {/* Interactive Course Switcher Flag Badge */}
          <button
            type="button"
            id="btn-open-course-switcher"
            onClick={() => setIsCourseModalOpen(true)}
            className="fl-badge fl-badge-locked"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              borderRadius: '12px',
              cursor: 'pointer',
              border: '1px solid var(--fl-border-strong)',
              backgroundColor: 'var(--fl-bg-card-subtle)',
              transition: 'all 0.15s ease'
            }}
            title={`Learning ${profile.currentLanguage} — Click to switch course`}
            aria-label={`Learning ${profile.currentLanguage} — Click to switch course`}
          >
            <span style={{ fontSize: '18px', lineHeight: 1 }}>{flag}</span>
            <ChevronDown size={13} color="var(--fl-text-secondary)" />
          </button>
        </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Theme Toggle Button */}
        <button
          type="button"
          id="btn-toggle-theme-topbar"
          onClick={toggleTheme}
          className="fl-btn-icon"
          style={{ width: '30px', height: '30px', borderRadius: '50%' }}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? (
            <Sun size={15} color="var(--fl-gold-light)" />
          ) : (
            <Moon size={15} color="var(--fl-indigo-primary)" />
          )}
        </button>

        {/* Streak Counter */}
        <div
          className="fl-badge fl-badge-flame"
          title={`${profile.streak.currentStreak} day streak`}
          style={{ cursor: 'pointer', padding: '5px 10px', fontSize: '13px' }}
        >
          <Flame size={15} color="var(--fl-coral-flame)" fill="var(--fl-coral-flame)" />
          <span>{profile.streak.currentStreak}</span>
        </div>

        {/* XP Daily Progress Pill */}
        <div
          className="fl-badge fl-badge-gold"
          title={`${profile.dailyGoal.currentXp} / ${profile.dailyGoal.targetXp} Daily XP`}
          style={{ cursor: 'pointer', padding: '5px 10px', fontSize: '13px' }}
        >
          <Zap size={14} color="var(--fl-gold-star)" fill="var(--fl-gold-star)" />
          <span>{profile.dailyGoal.currentXp}</span>
        </div>

        {/* Active Level Badge */}
        <div
          className="fl-badge fl-badge-teal"
          title={`Currently on Level ${activeLevel}`}
          style={{ padding: '5px 10px', fontSize: '13px' }}
        >
          <Award size={14} color="var(--fl-teal-light)" />
          <span>L{activeLevel}</span>
        </div>

        {/* User Initials Avatar */}
        <div
          title={profile.name ? `${profile.name} (${profile.email || 'Logged In'})` : 'Your Profile'}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'var(--fl-teal-subtle)',
            border: '1.5px solid var(--fl-teal-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 800,
            color: 'var(--fl-teal-light)'
          }}
        >
          {initial}
        </div>
      </div>
    </header>

      <CourseSwitcherModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
      />
    </>
  );
};
