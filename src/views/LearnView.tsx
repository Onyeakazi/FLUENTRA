import React, { useState } from 'react';
import { Route, List, Sparkles } from 'lucide-react';
import { CURRICULUM_DATA } from '../data/curriculumRegistry';
import { UnitMetadata } from '../types/curriculum';
import { UnitNode } from '../components/curriculum/UnitNode';
import { LearningPath } from '../components/curriculum/LearningPath';
import { UnitDetailSheet } from '../components/curriculum/UnitDetailSheet';
import { LockedGateModal } from '../components/curriculum/LockedGateModal';
import { useProgression } from '../context/ProgressionContext';
import { useUser } from '../context/UserContext';

interface LearnViewProps {
  onStartLesson: (unitId: string, lessonId: string, customLesson?: any) => void;
}

export const LearnView: React.FC<LearnViewProps> = ({ onStartLesson }) => {
  const { activeLevel, setActiveLevel, activeStage, setActiveStage, progressMap, activeCourse } = useProgression();
  const { profile } = useUser();
  const [selectedUnit, setSelectedUnit] = useState<UnitMetadata | null>(null);
  const [lockedModalUnit, setLockedModalUnit] = useState<UnitMetadata | null>(null);
  const [viewMode, setViewMode] = useState<'path' | 'list'>('path');

  const currentLevel = CURRICULUM_DATA.levels.find(l => l.number === activeLevel) || CURRICULUM_DATA.levels[0];
  const currentStage = currentLevel.stages.find(s => s.number === activeStage) || currentLevel.stages[0];

  // Calculate completed count in current level
  const levelUnitIds = currentLevel.stages.flatMap(s => s.unitIds);
  const completedInLevel = levelUnitIds.filter(id => {
    const s = progressMap[id]?.status;
    return s === 'completed' || s === 'mastered';
  }).length;
  const levelPercent = Math.round((completedInLevel / currentLevel.totalUnits) * 100);

  return (
    <div className="content-scrollable" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* 8-Level Horizontal Scroll Tabs */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--fl-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Curriculum Progression
          </span>
          <span style={{ fontSize: '13px', color: 'var(--fl-teal-light)', fontWeight: 700 }}>
            800 Units Total
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '6px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {CURRICULUM_DATA.levels.map((lvl) => {
            const isSelected = activeLevel === lvl.number;
            return (
              <button
                key={lvl.id}
                type="button"
                id={`lvl-pill-${lvl.number}`}
                onClick={() => {
                  setActiveLevel(lvl.number);
                  setActiveStage(1);
                }}
                className={`fl-badge ${isSelected ? 'fl-badge-teal' : 'fl-badge-locked'}`}
                style={{
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: isSelected ? '1px solid var(--fl-teal-light)' : '1px solid var(--fl-border)',
                  backgroundColor: isSelected ? 'var(--fl-teal-subtle)' : 'var(--fl-bg-card)'
                }}
              >
                <span>Level {lvl.number}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Level Header Box */}
      <div
        className="fl-card"
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, var(--fl-bg-card) 100%)',
          borderColor: 'var(--fl-border-strong)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="fl-badge fl-badge-indigo" style={{ fontSize: '13px' }}>
            Level {currentLevel.number}
          </span>
          <span style={{ fontSize: '14px', color: 'var(--fl-text-secondary)', fontWeight: 600 }}>
            {completedInLevel} / 100 Units ({levelPercent}%)
          </span>
        </div>

        <h2 style={{ fontSize: '22px', fontWeight: 800, marginTop: '8px' }}>
          {currentLevel.name}
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--fl-text-secondary)', marginTop: '2px' }}>
          {currentLevel.description}
        </p>

        <div className="fl-progress-track" style={{ marginTop: '14px' }}>
          <div className="fl-progress-fill" style={{ width: `${Math.max(5, levelPercent)}%` }} />
        </div>
      </div>

      {/* 10-Stage Selection Pills */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--fl-text-muted)', textTransform: 'uppercase' }}>
            Stages (10 Units Each)
          </span>
          <span style={{ fontSize: '13px', color: 'var(--fl-text-secondary)' }}>
            Stage {activeStage} of 10
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '6px',
            scrollbarWidth: 'none'
          }}
        >
          {currentLevel.stages.map((stage) => {
            const isStageActive = activeStage === stage.number;
            return (
              <button
                key={stage.number}
                type="button"
                id={`stage-pill-${stage.number}`}
                onClick={() => setActiveStage(stage.number)}
                className={`fl-badge ${isStageActive ? 'fl-badge-teal' : 'fl-badge-locked'}`}
                style={{
                  padding: '8px 14px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                <span>Stage {stage.number}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Stage Headline & View Mode Toggle */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '12px',
          padding: '4px 0'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>
              Stage {currentStage.number}: {currentStage.title}
            </h3>
            <span
              className="fl-badge fl-badge-teal"
              style={{ padding: '2px 8px', fontSize: '11px', fontWeight: 800 }}
            >
              {activeCourse.flag || '🌐'} {activeCourse.languageId}
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--fl-text-secondary)', margin: '4px 0 0' }}>
            {currentStage.description} · Units {currentStage.unitRange[0]} to {currentStage.unitRange[1]}
          </p>
        </div>

        {/* Path / List Toggle */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'var(--fl-bg-card-subtle)',
            borderRadius: '12px',
            padding: '3px',
            border: '1px solid var(--fl-border)',
            flexShrink: 0
          }}
        >
          <button
            type="button"
            id="btn-viewmode-path"
            onClick={() => setViewMode('path')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '5px 10px',
              borderRadius: '9px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 700,
              backgroundColor: viewMode === 'path' ? 'var(--fl-teal-primary)' : 'transparent',
              color: viewMode === 'path' ? '#000000' : 'var(--fl-text-secondary)',
              transition: 'all 0.15s ease'
            }}
            title="Duolingo Serpentine Path View"
          >
            <Route size={14} />
            <span>Path</span>
          </button>

          <button
            type="button"
            id="btn-viewmode-list"
            onClick={() => setViewMode('list')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '5px 10px',
              borderRadius: '9px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 700,
              backgroundColor: viewMode === 'list' ? 'var(--fl-teal-primary)' : 'transparent',
              color: viewMode === 'list' ? '#000000' : 'var(--fl-text-secondary)',
              transition: 'all 0.15s ease'
            }}
            title="Compact Unit List View"
          >
            <List size={14} />
            <span>List</span>
          </button>
        </div>
      </div>

      {/* Render Curriculum Content: Serpentine Path OR Compact List */}
      {viewMode === 'path' ? (
        <LearningPath
          units={currentStage.unitIds
            .map((id) => CURRICULUM_DATA.unitsById[id])
            .filter((u): u is UnitMetadata => !!u)}
          onOpenUnit={(unit) => setSelectedUnit(unit)}
          onShowLockedModal={(unit) => setLockedModalUnit(unit)}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {currentStage.unitIds.map((unitId) => {
            const unit = CURRICULUM_DATA.unitsById[unitId];
            if (!unit) return null;

            return (
              <UnitNode
                key={unit.id}
                unit={unit}
                onOpenUnit={() => setSelectedUnit(unit)}
                onShowLockedModal={(lockedUnit) => setLockedModalUnit(lockedUnit)}
              />
            );
          })}
        </div>
      )}

      {/* Interactive Sheet for Unlocked Unit */}
      <UnitDetailSheet
        unit={selectedUnit}
        onClose={() => setSelectedUnit(null)}
        onStartLesson={onStartLesson}
      />

      {/* Locked Gate Modal with Prerequisite Explanation */}
      <LockedGateModal
        unit={lockedModalUnit}
        onClose={() => setLockedModalUnit(null)}
        onJumpToPrereq={(prereqId) => {
          const prereq = CURRICULUM_DATA.unitsById[prereqId];
          if (prereq) {
            setActiveLevel(prereq.levelNumber);
            setActiveStage(prereq.stageNumber);
          }
        }}
      />
    </div>
  );
};
