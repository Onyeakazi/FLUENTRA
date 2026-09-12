// FLUENTRA Authentic Duolingo Section Header Banner with Guidebook
import React, { useState } from 'react';
import { BookOpen, Layers, ChevronDown } from 'lucide-react';
import { useProgression } from '../../context/ProgressionContext';
import { CURRICULUM_DATA } from '../../data/curriculumRegistry';
import { GuidebookModal } from './GuidebookModal';
import { SectionDrawer } from './SectionDrawer';

const SECTION_COLORS: Record<number, { bg: string; border: string; text: string }> = {
  1: { bg: '#58CC02', border: '#46A302', text: '#FFFFFF' }, // Emerald Green
  2: { bg: '#1CB0F6', border: '#1899D6', text: '#FFFFFF' }, // Sky Blue
  3: { bg: '#CE82FF', border: '#A855F7', text: '#FFFFFF' }, // Royal Purple
  4: { bg: '#FF9600', border: '#D97706', text: '#FFFFFF' }, // Amber Orange
  5: { bg: '#FF4B4B', border: '#DC2626', text: '#FFFFFF' }, // Coral Red
  6: { bg: '#00CD9C', border: '#059669', text: '#FFFFFF' }, // Mint Teal
  7: { bg: '#2B70C9', border: '#1D4ED8', text: '#FFFFFF' }, // Cobalt Blue
  8: { bg: '#FFC800', border: '#D97706', text: '#000000' }  // Golden Sun
};

export const SectionBanner: React.FC = () => {
  const { activeLevel, activeStage, setActiveLevel, setActiveStage } = useProgression();
  const [isGuidebookOpen, setIsGuidebookOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const levelMeta = CURRICULUM_DATA.levels.find((l) => l.number === activeLevel) || CURRICULUM_DATA.levels[0];
  const stageMeta = levelMeta.stages.find((s) => s.number === activeStage) || levelMeta.stages[0];
  const currentUnitId = stageMeta.unitIds[0] || 'u1';
  const unitMeta = CURRICULUM_DATA.unitsById[currentUnitId] || CURRICULUM_DATA.units[0];

  const colorScheme = SECTION_COLORS[activeLevel] || SECTION_COLORS[1];

  return (
    <>
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 30,
          padding: '8px 12px 6px',
          backgroundColor: 'var(--fl-bg-app)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 16px',
            borderRadius: '20px',
            backgroundColor: colorScheme.bg,
            color: colorScheme.text,
            boxShadow: `0 6px 0 ${colorScheme.border}`,
            userSelect: 'none'
          }}
        >
          {/* Left: Section & Stage Title with Dropdown Trigger */}
          <div
            onClick={() => setIsDrawerOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setIsDrawerOpen(true);
            }}
            style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '2px' }}
            title="Click to browse all course sections"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 900,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  opacity: 0.95
                }}
              >
                Section {activeLevel}, Stage {activeStage}
              </span>
              <ChevronDown size={14} strokeWidth={3} />
            </div>

            <h2
              style={{
                fontSize: '18px',
                fontWeight: 900,
                margin: 0,
                lineHeight: 1.25
              }}
            >
              {stageMeta.title}
            </h2>

            <span style={{ fontSize: '12px', opacity: 0.85 }}>
              Units {stageMeta.unitRange[0]}–{stageMeta.unitRange[1]} · {unitMeta.cefrLevel}
            </span>
          </div>

          {/* Right: Duolingo-Signature Guidebook Button */}
          <button
            type="button"
            id="btn-open-guidebook"
            onClick={() => setIsGuidebookOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 14px',
              borderRadius: '14px',
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              border: 'none',
              color: '#FFFFFF',
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: '13px',
              letterSpacing: '0.02em',
              transition: 'all 0.15s ease',
              flexShrink: 0
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'scale(0.95)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
            title="Open Unit Guidebook & Grammar Tips"
          >
            <BookOpen size={16} strokeWidth={2.5} />
            <span>Guidebook</span>
          </button>
        </div>
      </div>

      {/* Guidebook Modal */}
      <GuidebookModal
        isOpen={isGuidebookOpen}
        onClose={() => setIsGuidebookOpen(false)}
        unitNumber={unitMeta.number}
        unitTitle={unitMeta.title}
        cefrLevel={unitMeta.cefrLevel}
      />

      {/* Section Switcher Drawer */}
      <SectionDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSelectSection={(lvl, stg) => {
          setActiveLevel(lvl);
          setActiveStage(stg);
        }}
      />
    </>
  );
};
