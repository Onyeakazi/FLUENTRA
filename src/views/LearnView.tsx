// FLUENTRA Clean Duolingo-Style Learning Path Screen
import React, { useState } from 'react';
import { CURRICULUM_DATA } from '../data/curriculumRegistry';
import { UnitMetadata } from '../types/curriculum';
import { LearningPath } from '../components/curriculum/LearningPath';
import { SectionBanner } from '../components/curriculum/SectionBanner';
import { UnitDetailSheet } from '../components/curriculum/UnitDetailSheet';
import { LockedGateModal } from '../components/curriculum/LockedGateModal';
import { useProgression } from '../context/ProgressionContext';

interface LearnViewProps {
  onStartLesson: (unitId: string, lessonId: string, customLesson?: any) => void;
}

export const LearnView: React.FC<LearnViewProps> = ({ onStartLesson }) => {
  const { activeLevel, setActiveLevel, activeStage, setActiveStage } = useProgression();
  const [selectedUnit, setSelectedUnit] = useState<UnitMetadata | null>(null);
  const [lockedModalUnit, setLockedModalUnit] = useState<UnitMetadata | null>(null);

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
        flexDirection: 'column',
        padding: '0 0 80px',
        overflowX: 'hidden'
      }}
    >
      {/* 1. Duolingo Signature Unit & Section Banner (Sticky with Guidebook) */}
      <SectionBanner />

      {/* 2. Duolingo Serpentine Stepping-Stone Path */}
      <div style={{ width: '100%', maxWidth: '480px', margin: '0 auto' }}>
        <LearningPath
          units={stageUnits}
          onOpenUnit={(unit) => setSelectedUnit(unit)}
          onShowLockedModal={(unit) => setLockedModalUnit(unit)}
        />
      </div>

      {/* 3. Interactive Detail Sheet for Unlocked Unit */}
      <UnitDetailSheet
        unit={selectedUnit}
        onClose={() => setSelectedUnit(null)}
        onStartLesson={onStartLesson}
      />

      {/* 4. Locked Gate Modal with Prerequisite Explanation */}
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
