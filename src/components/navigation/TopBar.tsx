// FLUENTRA Clean Duolingo-Grade Top Status Header
import React, { useState } from 'react';
import { Flame, Gem, Heart, Sun, Moon, ChevronDown } from 'lucide-react';
import { FluentraLogo } from '../brand/FluentraLogo';
import { useUser } from '../../context/UserContext';
import { LANG_FLAGS } from '../../data/languages';
import { CourseSwitcherModal } from './CourseSwitcherModal';

export const TopBar: React.FC = () => {
  const { profile, theme, toggleTheme } = useUser();
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);

  const flag = LANG_FLAGS[profile.currentLanguage] || '🇫🇷';

  return (
    <>
      <header className="fl-top-bar" role="banner">
        {/* Left: Brand Image Logo & Course Switcher Flag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FluentraLogo size="sm" showWordmark={false} showTagline={false} />

          {/* Interactive Duolingo Course Switcher Flag Pill */}
          <button
            type="button"
            id="btn-open-course-switcher"
            onClick={() => setIsCourseModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '16px',
              cursor: 'pointer',
              border: '1.5px solid var(--fl-border-strong)',
              backgroundColor: 'var(--fl-bg-card-subtle)',
              transition: 'all 0.15s ease'
            }}
            title={`Learning ${profile.currentLanguage} — Tap to switch course`}
            aria-label={`Learning ${profile.currentLanguage} — Tap to switch course`}
          >
            <span style={{ fontSize: '20px', lineHeight: 1 }}>{flag}</span>
            <ChevronDown size={14} color="var(--fl-text-secondary)" />
          </button>
        </div>

        {/* Right: Duolingo-Signature Clean Status Trackers */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Streak Flame Pill */}
          <div
            title={`${profile.streak.currentStreak} Day Streak`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              cursor: 'pointer',
              color: '#FF6B4A',
              fontWeight: 800,
              fontSize: '14px'
            }}
          >
            <Flame size={20} fill="#FF6B4A" color="#FF6B4A" />
            <span>{profile.streak.currentStreak}</span>
          </div>

          {/* Gems / Lingots Pill */}
          <div
            title={`${profile.stats.totalXp} XP / Gems Earned`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              cursor: 'pointer',
              color: '#1CB0F6',
              fontWeight: 800,
              fontSize: '14px'
            }}
          >
            <Gem size={18} fill="#1CB0F6" color="#1CB0F6" />
            <span>{profile.stats.totalXp}</span>
          </div>

          {/* Health / Hearts */}
          <div
            title="Unlimited Practice Hearts"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              color: '#FF4B4B',
              fontWeight: 800,
              fontSize: '14px'
            }}
          >
            <Heart size={19} fill="#FF4B4B" color="#FF4B4B" />
            <span style={{ fontSize: '15px' }}>∞</span>
          </div>

          {/* Clean Theme Toggle Button */}
          <button
            type="button"
            id="btn-toggle-theme-topbar"
            onClick={toggleTheme}
            className="fl-btn-icon"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--fl-bg-card)',
              border: '1px solid var(--fl-border)'
            }}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun size={15} color="#FFC800" />
            ) : (
              <Moon size={15} color="#6366F1" />
            )}
          </button>
        </div>
      </header>

      {/* Multi-Language Course Switcher Modal */}
      <CourseSwitcherModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
      />
    </>
  );
};
