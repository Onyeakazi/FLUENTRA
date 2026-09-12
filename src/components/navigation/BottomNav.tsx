// FLUENTRA Duolingo-Style 5-Tab Navigation Bar
import React from 'react';
import { Home, Headphones, Target, User } from 'lucide-react';

export type NavTab = 'learn' | 'sounds' | 'practice' | 'profile';

interface BottomNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab }) => {
  const tabs: { id: NavTab; label: string; icon: React.FC<{ size: number; color?: string }> }[] = [
    { id: 'learn', label: 'Learn', icon: Home },
    { id: 'sounds', label: 'Audio', icon: Headphones },
    { id: 'practice', label: 'Practice', icon: Target },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <nav
      className="fl-bottom-nav"
      role="navigation"
      aria-label="Main Navigation"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            id={`nav-${tab.id}`}
            className={`fl-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => onChangeTab(tab.id)}
            aria-selected={isActive}
            role="tab"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              background: 'none',
              border: 'none',
              padding: '8px 12px',
              cursor: 'pointer',
              color: isActive ? '#58CC02' : 'var(--fl-text-secondary)',
              transition: 'all 0.15s ease'
            }}
          >
            <Icon
              size={22}
              color={isActive ? '#58CC02' : 'var(--fl-text-secondary)'}
            />
            <span
              style={{
                fontSize: '11px',
                fontWeight: isActive ? 800 : 600,
                letterSpacing: '0.02em'
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
