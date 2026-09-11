// FLUENTRA Mobile-First Bottom Navigation Bar
import React from 'react';
import { Home, Compass, Sparkles, Mic, User } from 'lucide-react';

export type NavTab = 'home' | 'learn' | 'practice' | 'speak' | 'profile';

interface BottomNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab }) => {
  const tabs: { id: NavTab; label: string; icon: React.FC<{ size: number; color?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'learn', label: 'Learn', icon: Compass },
    { id: 'practice', label: 'Practice', icon: Sparkles },
    { id: 'speak', label: 'Speak', icon: Mic },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <nav className="fl-bottom-nav" role="navigation" aria-label="Main Navigation">
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
          >
            <Icon
              size={22}
              color={isActive ? 'var(--fl-teal-light)' : 'var(--fl-text-secondary)'}
            />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
