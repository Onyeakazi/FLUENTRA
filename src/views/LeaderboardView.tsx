// FLUENTRA Duolingo-Style Weekly Leagues & Leaderboard View
import React, { useState } from 'react';
import { Shield, Trophy, Flame, Zap, ArrowUp, ArrowDown, Sparkles } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useProgression } from '../context/ProgressionContext';

interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  xp: number;
  streak: number;
  isCurrentUser?: boolean;
}

const LEAGUES = [
  { id: 'bronze', name: 'Bronze League', color: '#CD7F32', minXp: 0 },
  { id: 'silver', name: 'Silver League', color: '#C0C0C0', minXp: 100 },
  { id: 'gold', name: 'Gold League', color: '#FFD700', minXp: 300 },
  { id: 'sapphire', name: 'Sapphire League', color: '#1CB0F6', minXp: 600 },
  { id: 'emerald', name: 'Emerald League', color: '#58CC02', minXp: 1000 },
  { id: 'diamond', name: 'Diamond League', color: '#A855F7', minXp: 1800 }
];

export const LeaderboardView: React.FC = () => {
  const { profile } = useUser();
  const { activeCourse } = useProgression();

  // Determine user's league based on total XP
  const userXp = profile.stats.totalXp || 0;
  const currentLeague =
    [...LEAGUES].reverse().find((l) => userXp >= l.minXp) || LEAGUES[0];

  // Cohort of rival learners
  const competitors: LeaderboardUser[] = [
    { rank: 1, name: 'Sofia M.', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Sofia&backgroundColor=58CC02', xp: Math.max(userXp + 45, 180), streak: 12 },
    { rank: 2, name: 'David K.', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=David&backgroundColor=1CB0F6', xp: Math.max(userXp + 20, 140), streak: 9 },
    { rank: 3, name: profile.name || 'You', avatar: profile.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profile.name || 'Learner')}&backgroundColor=FFC800`, xp: userXp, streak: profile.streak.currentStreak, isCurrentUser: true },
    { rank: 4, name: 'Alexandre R.', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Alexandre&backgroundColor=CE82FF', xp: Math.max(userXp - 15, 60), streak: 5 },
    { rank: 5, name: 'Elena V.', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Elena&backgroundColor=FF9600', xp: Math.max(userXp - 35, 40), streak: 4 },
    { rank: 6, name: 'Lucas T.', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Lucas&backgroundColor=00CD9C', xp: Math.max(userXp - 50, 25), streak: 2 },
    { rank: 7, name: 'Chen Wei', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Chen&backgroundColor=FF4B4B', xp: Math.max(userXp - 65, 10), streak: 1 }
  ];

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
      {/* League Header Card */}
      <div
        className="fl-card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '24px 20px',
          borderRadius: '24px',
          background: `linear-gradient(135deg, ${currentLeague.color}22 0%, var(--fl-bg-card) 100%)`,
          border: `2px solid ${currentLeague.color}55`,
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.25)'
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: `${currentLeague.color}33`,
            border: `3px solid ${currentLeague.color}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: currentLeague.color,
            marginBottom: '12px'
          }}
        >
          <Shield size={34} />
        </div>

        <h1 style={{ fontSize: '24px', fontWeight: 900, margin: 0 }}>
          {currentLeague.name}
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--fl-text-secondary)', marginTop: '4px', maxWidth: '320px' }}>
          Top 3 advance to the next league! Week ends in <strong style={{ color: 'var(--fl-text-primary)' }}>2d 14h</strong>.
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginTop: '14px',
            padding: '6px 14px',
            borderRadius: '16px',
            backgroundColor: 'var(--fl-bg-card)',
            border: '1px solid var(--fl-border)'
          }}
        >
          <Sparkles size={14} color="#FFC800" />
          <span style={{ fontSize: '12px', fontWeight: 800 }}>
            {activeCourse.flag} {activeCourse.languageId} Learner Cohort
          </span>
        </div>
      </div>

      {/* Promotion Zone Callout */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          borderRadius: '14px',
          backgroundColor: 'rgba(88, 204, 2, 0.12)',
          border: '1px solid #58CC02',
          color: '#58CC02',
          fontSize: '13px',
          fontWeight: 800
        }}
      >
        <ArrowUp size={16} strokeWidth={3} />
        <span>PROMOTION ZONE (Top 3 Advance)</span>
      </div>

      {/* Ranked Competitors List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {competitors.map((user) => {
          const isTop3 = user.rank <= 3;

          return (
            <div
              key={user.rank}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderRadius: '18px',
                backgroundColor: user.isCurrentUser
                  ? 'rgba(0, 245, 180, 0.1)'
                  : 'var(--fl-bg-card-subtle)',
                border: user.isCurrentUser
                  ? '2px solid var(--fl-teal-light)'
                  : '1.5px solid var(--fl-border)',
                boxShadow: user.isCurrentUser ? '0 4px 16px rgba(0, 245, 180, 0.15)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                {/* Rank Number / Medal */}
                <div
                  style={{
                    width: '28px',
                    fontWeight: 900,
                    fontSize: '16px',
                    color: user.rank === 1 ? '#FFD700' : user.rank === 2 ? '#C0C0C0' : user.rank === 3 ? '#CD7F32' : 'var(--fl-text-muted)',
                    textAlign: 'center'
                  }}
                >
                  {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : user.rank === 3 ? '🥉' : user.rank}
                </div>

                {/* Avatar */}
                <img
                  src={user.avatar}
                  alt={user.name}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: '2px solid var(--fl-border)'
                  }}
                />

                {/* Name & Streak */}
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--fl-text-primary)' }}>
                    {user.name} {user.isCurrentUser && '(You)'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#FF6B4A', fontWeight: 700 }}>
                    <Flame size={12} fill="#FF6B4A" color="#FF6B4A" />
                    <span>{user.streak}d streak</span>
                  </div>
                </div>
              </div>

              {/* XP Count */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: 900,
                  fontSize: '14px',
                  color: '#1CB0F6'
                }}
              >
                <Zap size={14} fill="#1CB0F6" color="#1CB0F6" />
                <span>{user.xp} XP</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
