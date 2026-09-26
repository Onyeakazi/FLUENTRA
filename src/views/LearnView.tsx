// FLUENTRA Clean Duolingo-Style Learning Path Screen
import React, { useState } from 'react';
import { CURRICULUM_DATA } from '../data/curriculumRegistry';
import { UnitMetadata } from '../types/curriculum';
import { LearningPath } from '../components/curriculum/LearningPath';
import { SectionBanner } from '../components/curriculum/SectionBanner';
import { LockedGateModal } from '../components/curriculum/LockedGateModal';
import { EarTrainingGameModal } from '../components/exercise/EarTrainingGameModal';
import { useProgression } from '../context/ProgressionContext';

interface LearnViewProps {
  onStartLesson: (unitId: string, lessonId?: string, customLesson?: any) => void;
  activeEarGameUnit?: UnitMetadata | null;
  onOpenEarChallenge?: (unit: UnitMetadata | null) => void;
}

export const LearnView: React.FC<LearnViewProps> = ({
  onStartLesson,
  activeEarGameUnit: externalActiveEarUnit,
  onOpenEarChallenge: externalSetEarUnit
}) => {
  const { activeLevel, setActiveLevel, activeStage, setActiveStage, completeEarTraining } = useProgression();
  const [lockedModalUnit, setLockedModalUnit] = useState<UnitMetadata | null>(null);
  const [lockedModalReason, setLockedModalReason] = useState<string | null>(null);
  const [lockedModalTitle, setLockedModalTitle] = useState<string | null>(null);

  const [internalActiveEarUnit, setInternalActiveEarUnit] = useState<UnitMetadata | null>(null);

  // Controlled or uncontrolled active ear game unit
  const activeEarGameUnit = externalActiveEarUnit !== undefined ? externalActiveEarUnit : internalActiveEarUnit;
  const setActiveEarGameUnit = (unit: UnitMetadata | null) => {
    if (externalSetEarUnit) {
      externalSetEarUnit(unit);
    } else {
      setInternalActiveEarUnit(unit);
    }
  };

  const currentLevel = CURRICULUM_DATA.levels.find((l) => l.number === activeLevel) || CURRICULUM_DATA.levels[0];
  const currentStage = currentLevel.stages.find((s) => s.number === activeStage) || currentLevel.stages[0];

  const stageUnits = currentStage.unitIds
    .map((id) => CURRICULUM_DATA.unitsById[id])
    .filter((u): u is UnitMetadata => !!u);

  return (
    <div
      className="content-scrollable"
      style={{
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* 1. Duolingo Signature Unit & Section Banner (Sticky with Guidebook) */}
      <SectionBanner />

      {/* 2. Duolingo Serpentine Stepping-Stone Path */}
      <div style={{ width: '100%', maxWidth: '480px', margin: '0 auto' }}>
        <LearningPath
          units={stageUnits}
          onStartLesson={onStartLesson}
          onShowLockedModal={(unit, lockReason, customTitle) => {
            setLockedModalUnit(unit);
            setLockedModalReason(lockReason || null);
            setLockedModalTitle(customTitle || null);
          }}
          onOpenEarChallenge={(unit) => setActiveEarGameUnit(unit)}
        />
      </div>

      {/* 3. Locked Gate Modal with Strict Prerequisite Explanation */}
      <LockedGateModal
        unit={lockedModalUnit}
        lockReason={lockedModalReason || undefined}
        customTitle={lockedModalTitle || undefined}
        onClose={() => {
          setLockedModalUnit(null);
          setLockedModalReason(null);
          setLockedModalTitle(null);
        }}
        onJumpToPrereq={(prereqId) => {
          const prereq = CURRICULUM_DATA.unitsById[prereqId];
          if (prereq) {
            setActiveLevel(prereq.levelNumber);
            setActiveStage(prereq.stageNumber);
          }
        }}
      />

      {/* 4. 11-Mode Ear Training & Audio Arcade Modal */}
      {activeEarGameUnit && (
        <EarTrainingGameModal
          unit={activeEarGameUnit}
          onClose={() => setActiveEarGameUnit(null)}
          onCompleted={() => {
            completeEarTraining(activeEarGameUnit.id);
            setActiveEarGameUnit(null);
          }}
        />
      )}
    </div>
  );
};
