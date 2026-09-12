// FLUENTRA Duolingo-Style Section & Level Drawer
import React from 'react';
import { X, Award, ChevronRight, Check, BookOpen, Layers } from 'lucide-react';
import { CURRICULUM_DATA } from '../../data/curriculumRegistry';
import { useProgression } from '../../context/ProgressionContext';

interface SectionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSection: (levelNumber: number, stageNumber: number) => void;
}

const SECTION_THEMES: Record<number, { bg: string; border: string; label: string }> = {
  1: { bg: '#58CC02', border: '#46A302', label: 'Section 1: Foundations' },
  2: { bg: '#1CB0F6', border: '#1899D6', label: 'Section 2: Everyday Explorer' },
  3: { bg: '#CE82FF', border: '#A855F7', label: 'Section 3: Global Traveler' },
  4: { bg: '#FF9600', border: '#D97706', label: 'Section 4: Storyteller' },
  5: { bg: '#FF4B4B', border: '#DC2626', label: 'Section 5: Conversationalist' },
  6: { bg: '#00CD9C', border: '#059669', label: 'Section 6: Fluent Speaker' },
  7: { bg: '#2B70C9', border: '#1D4ED8', label: 'Section 7: Professional Master' },
  8: { bg: '#FFC800', border: '#D97706', label: 'Section 8: Native Resonance' }
};

export const SectionDrawer: React.FC<SectionDrawerProps> = ({
  isOpen,
  onClose,
  onSelectSection
}) => {
  const { activeLevel, activeStage, progressMap } = useProgression();

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="All Course Sections"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="fl-card"
        style={{
          width: '100%',
          maxWidth: '460px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--fl-bg-card)',
          borderRadius: '24px',
          border: '1.5px solid var(--fl-border-strong)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.45)',
          overflow: 'hidden',
          animation: 'fadeInUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 24px',
            borderBottom: '1px solid var(--fl-border)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '12px',
                backgroundColor: 'rgba(88, 204, 2, 0.15)',
                color: '#58CC02',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Layers size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>
                Course Sections
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--fl-text-secondary)', margin: 0 }}>
                8 CEFR Sections · 800 Units Total
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="fl-btn-icon"
            style={{ width: '34px', height: '34px', borderRadius: '50%' }}
            aria-label="Close Sections"
          >
            <X size={18} />
          </button>
        </div>

        {/* Section List */}
        <div
          style={{
            padding: '18px 20px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          {CURRICULUM_DATA.levels.map((lvl) => {
            const isCurrentLevel = activeLevel === lvl.number;
            const theme = SECTION_THEMES[lvl.number] || SECTION_THEMES[1];

            // Calculate completed count in this level
            const levelUnitIds = lvl.stages.flatMap((s) => s.unitIds);
            const completedCount = levelUnitIds.filter((id) => {
              const s = progressMap[id]?.status;
              return s === 'completed' || s === 'mastered';
            }).length;

            return (
              <div
                key={lvl.number}
                id={`section-item-${lvl.number}`}
                onClick={() => {
                  onSelectSection(lvl.number, 1);
                  onClose();
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onSelectSection(lvl.number, 1);
                    onClose();
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 18px',
                  borderRadius: '20px',
                  backgroundColor: isCurrentLevel
                    ? 'rgba(88, 204, 2, 0.08)'
                    : 'var(--fl-bg-card-subtle)',
                  border: isCurrentLevel
                    ? `2px solid ${theme.bg}`
                    : '1.5px solid var(--fl-border)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '14px',
                      backgroundColor: theme.bg,
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      fontSize: '18px',
                      boxShadow: `0 4px 0 ${theme.border}`,
                      flexShrink: 0
                    }}
                  >
                    {lvl.number}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '15px', fontWeight: 800 }}>
                        {lvl.name}
                      </span>
                      {isCurrentLevel && (
                        <span
                          className="fl-badge fl-badge-teal"
                          style={{ padding: '2px 8px', fontSize: '11px', fontWeight: 800 }}
                        >
                          Current
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--fl-text-secondary)', marginTop: '2px' }}>
                      Level {lvl.number} · {completedCount} / {lvl.totalUnits} Units Done
                    </div>
                  </div>
                </div>

                <div>
                  {isCurrentLevel ? (
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: '#58CC02',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF'
                      }}
                    >
                      <Check size={16} strokeWidth={3} />
                    </div>
                  ) : (
                    <ChevronRight size={18} color="var(--fl-text-muted)" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
