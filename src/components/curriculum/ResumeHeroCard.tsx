// FLUENTRA "Start from where you left off" Hero Resume Card
import React from 'react';
import { Play, Sparkles, BookOpen, Compass, ArrowRight, RotateCcw } from 'lucide-react';
import { UnitMetadata } from '../../types/curriculum';
import { useProgression } from '../../context/ProgressionContext';
import { useUser } from '../../context/UserContext';
import { CURRICULUM_DATA } from '../../data/curriculumRegistry';
import { storageService, ResumeCheckpoint } from '../../services/storageService';

interface ResumeHeroCardProps {
  onResume: (unitId: string, lessonId?: string) => void;
}

export const ResumeHeroCard: React.FC<ResumeHeroCardProps> = ({ onResume }) => {
  const { progressMap, activeLevel, activeStage, setActiveLevel, setActiveStage, getUnitStatus, activeCourse } = useProgression();
  const { profile } = useUser();

  const lang = profile?.currentLanguage || 'French';
  const checkpoint: ResumeCheckpoint | null = storageService.getResumeCheckpoint(lang);

  // 1. Identify the exact unit where the learner left off
  let activeUnit: UnitMetadata | null = null;
  let isMidLesson = false;

  if (checkpoint && checkpoint.unitId) {
    const meta = CURRICULUM_DATA.unitsById[checkpoint.unitId];
    if (meta) {
      activeUnit = meta;
      isMidLesson = checkpoint.exerciseIndex > 0;
    }
  }

  // 2. If no checkpoint, check the course's currentUnitId
  if (!activeUnit && activeCourse?.currentUnitId) {
    const meta = CURRICULUM_DATA.unitsById[activeCourse.currentUnitId];
    if (meta) {
      activeUnit = meta;
    }
  }

  // 3. Find the first in-progress unit
  if (!activeUnit) {
    for (const unit of CURRICULUM_DATA.units) {
      if (getUnitStatus(unit.id) === 'in_progress') {
        activeUnit = unit;
        break;
      }
    }
  }

  // 4. Find the first available unit
  if (!activeUnit) {
    for (const unit of CURRICULUM_DATA.units) {
      if (getUnitStatus(unit.id) === 'available') {
        activeUnit = unit;
        break;
      }
    }
  }

  // 5. Fallback to Unit 1
  if (!activeUnit) {
    activeUnit = CURRICULUM_DATA.units[0];
  }

  const handleResumeClick = () => {
    if (!activeUnit) return;

    // Automatically synchronize level & stage to match the active unit
    if (activeUnit.levelNumber !== activeLevel) {
      setActiveLevel(activeUnit.levelNumber);
    }
    if (activeUnit.stageNumber !== activeStage) {
      setActiveStage(activeUnit.stageNumber);
    }

    const targetLessonId = (checkpoint && checkpoint.unitId === activeUnit.id && checkpoint.lessonId)
      ? checkpoint.lessonId
      : `${activeUnit.id}-l1`;

    onResume(activeUnit.id, targetLessonId);
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '480px',
        margin: '12px auto 6px',
        padding: '0 16px'
      }}
    >
      <div
        className="fl-card animate-pop-in"
        style={{
          padding: '16px 18px',
          background: 'linear-gradient(135deg, rgba(88, 204, 2, 0.14) 0%, rgba(28, 176, 246, 0.08) 100%)',
          border: '1.5px solid #58CC02',
          borderRadius: '20px',
          boxShadow: '0 6px 20px rgba(88, 204, 2, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              className="fl-badge"
              style={{
                backgroundColor: '#58CC02',
                color: '#FFFFFF',
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.04em',
                padding: '3px 10px',
                borderRadius: '999px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Sparkles size={12} />
              {isMidLesson ? 'CONTINUE WHERE YOU LEFT OFF' : 'YOUR ACTIVE PATH'}
            </span>
          </div>

          <span style={{ fontSize: '12px', color: 'var(--fl-text-muted)', fontWeight: 700 }}>
            {activeUnit.cefrLevel}
          </span>
        </div>

        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 900, color: 'var(--fl-text-primary)', margin: 0 }}>
            Unit {activeUnit.number}: {activeUnit.title}
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--fl-text-secondary)', marginTop: '3px', margin: 0 }}>
            {isMidLesson && checkpoint
              ? `Step ${checkpoint.exerciseIndex + 1} of ${checkpoint.totalExercises || 10} in progress`
              : activeUnit.practicalOutcome || activeUnit.subtitle}
          </p>
        </div>

        {isMidLesson && checkpoint && (
          <div style={{ marginTop: '2px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '12px',
                fontWeight: 800,
                color: '#58CC02',
                marginBottom: '6px'
              }}
            >
              <span>Step {checkpoint.exerciseIndex + 1} of {checkpoint.totalExercises || 10}</span>
              <span>{Math.round(((checkpoint.exerciseIndex + 1) / (checkpoint.totalExercises || 10)) * 100)}% Complete</span>
            </div>
            <div
              style={{
                width: '100%',
                height: '8px',
                backgroundColor: 'rgba(88, 204, 2, 0.2)',
                borderRadius: '999px',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: `${Math.round(((checkpoint.exerciseIndex + 1) / (checkpoint.totalExercises || 10)) * 100)}%`,
                  height: '100%',
                  backgroundColor: '#58CC02',
                  borderRadius: '999px',
                  transition: 'width 0.4s ease'
                }}
              />
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            type="button"
            id="btn-resume-learning"
            className="fl-btn fl-btn-primary"
            onClick={handleResumeClick}
            style={{
              flex: 1,
              minHeight: '48px',
              fontSize: '15px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              borderRadius: '14px',
              boxShadow: '0 4px 0 #46A302'
            }}
          >
            <Play size={16} fill="#FFFFFF" />
            <span>{isMidLesson ? 'Resume From Where You Left Off' : 'Start Learning This Unit'}</span>
            <ArrowRight size={16} />
          </button>

          {isMidLesson && (
            <button
              type="button"
              id="btn-restart-unit-hero"
              onClick={() => {
                storageService.clearResumeCheckpoint(lang);
                onResume(activeUnit!.id, `${activeUnit!.id}-l1`);
              }}
              title="Restart from beginning"
              style={{
                height: '48px',
                padding: '0 14px',
                borderRadius: '14px',
                backgroundColor: 'var(--fl-bg-card-subtle)',
                border: '1.5px solid var(--fl-border-strong)',
                color: 'var(--fl-text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                fontWeight: 800,
                transition: 'all 0.15s ease'
              }}
            >
              <RotateCcw size={15} />
              <span>Restart</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
