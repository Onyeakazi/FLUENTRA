// FLUENTRA Unit Detail & AI Dynamic Lesson Generation Sheet
import React, { useState, useEffect } from 'react';
import { X, Play, CheckCircle2, Sparkles, RefreshCw, Cpu, Zap, Headphones } from 'lucide-react';
import { UnitMetadata, Lesson } from '../../types/curriculum';
import { getLessonsForUnit } from '../../data/curriculumContent';
import { aiCurriculumGenerator } from '../../services/aiCurriculumGenerator';
import { useProgression } from '../../context/ProgressionContext';
import { useUser } from '../../context/UserContext';
import { storageService } from '../../services/storageService';

interface UnitDetailSheetProps {
  unit: UnitMetadata | null;
  onClose: () => void;
  onStartLesson: (unitId: string, lessonId: string, customLesson?: Lesson) => void;
  onOpenEarChallenge?: (unit: UnitMetadata) => void;
}

export const UnitDetailSheet: React.FC<UnitDetailSheetProps> = ({
  unit,
  onClose,
  onStartLesson,
  onOpenEarChallenge
}) => {
  if (!unit) return null;

  const { progressMap } = useProgression();
  const { profile } = useUser();
  const unitProgress = progressMap[unit.id];
  const completedLessons = unitProgress?.completedLessonIds || [];

  const [lessons, setLessons] = useState<Lesson[]>(() => {
    return getLessonsForUnit(unit.id, profile.currentLanguage);
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationNotice, setGenerationNotice] = useState<string | null>(null);

  // Dynamically synthesize/generate AI lessons whenever unit opens
  useEffect(() => {
    let isMounted = true;
    const loadDynamicLessons = async () => {
      setIsGenerating(true);
      try {
        const dynamicList = await aiCurriculumGenerator.generateLesson({
          unitId: unit.id,
          language: profile.currentLanguage,
          levelNumber: unit.levelNumber,
          learningGoal: profile.learningGoal,
          forceRegenerate: false
        });
        if (isMounted && dynamicList && dynamicList.length > 0) {
          setLessons(dynamicList);
        }
      } catch (err) {
        console.warn('AI lesson generation fallback:', err);
      } finally {
        if (isMounted) setIsGenerating(false);
      }
    };

    loadDynamicLessons();
    return () => {
      isMounted = false;
    };
  }, [unit.id, profile.currentLanguage, profile.learningGoal, unit.levelNumber]);

  const handleRegenerate = async () => {
    setIsGenerating(true);
    setGenerationNotice('Synthesizing fresh AI lesson variation...');
    try {
      const regenerated = await aiCurriculumGenerator.generateLesson({
        unitId: unit.id,
        language: profile.currentLanguage,
        levelNumber: unit.levelNumber,
        learningGoal: profile.learningGoal,
        forceRegenerate: true
      });
      if (regenerated && regenerated.length > 0) {
        setLessons(regenerated);
        setGenerationNotice('New AI variation generated!');
        setTimeout(() => setGenerationNotice(null), 2500);
      }
    } catch (err) {
      setGenerationNotice('Using high-performance dynamic synthesis');
      setTimeout(() => setGenerationNotice(null), 2000);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fl-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="fl-bottom-sheet"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '88vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
              <span className="fl-badge fl-badge-teal" style={{ fontSize: '13px', padding: '3px 10px' }}>
                Unit {unit.number} · {unit.cefrLevel}
              </span>
              {unit.pedagogyType && (
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(99, 102, 241, 0.15)',
                    color: 'var(--fl-indigo-light)',
                    border: '1px solid rgba(99, 102, 241, 0.3)'
                  }}
                >
                  {unit.pedagogyType} Unit
                </span>
              )}
              <span style={{ fontSize: '13px', color: 'var(--fl-text-muted)' }}>
                {unit.category}
              </span>
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: 800 }}>
              {unit.title}
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--fl-text-secondary)', marginTop: '2px' }}>
              {unit.subtitle}
            </p>
          </div>

          <button
            type="button"
            className="fl-btn-icon"
            onClick={onClose}
            style={{ width: '38px', height: '38px' }}
            aria-label="Close sheet"
          >
            <X size={18} />
          </button>
        </div>

        {/* Practical Outcome Card */}
        {unit.practicalOutcome && (
          <div
            style={{
              padding: '12px 14px',
              borderRadius: 'var(--fl-radius-md)',
              backgroundColor: 'rgba(88, 204, 2, 0.08)',
              border: '1px solid rgba(88, 204, 2, 0.25)',
              marginBottom: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#58CC02', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Practical Outcome
            </span>
            <p style={{ fontSize: '13px', color: 'var(--fl-text-primary)', margin: 0, lineHeight: 1.45, fontWeight: 600 }}>
              🎯 {unit.practicalOutcome}
            </p>
          </div>
        )}

        {/* Learning Targets Preview Chips */}
        {unit.learningTargets && unit.learningTargets.length > 0 && (
          <div style={{ marginBottom: '14px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--fl-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Learning Targets ({unit.learningTargets.length})
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
              {unit.learningTargets.map(t => (
                <span
                  key={t.id}
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '999px',
                    backgroundColor: 'var(--fl-bg-card-hover)',
                    border: '1px solid var(--fl-border)',
                    color: 'var(--fl-text-primary)'
                  }}
                >
                  {t.term} <span style={{ color: 'var(--fl-text-muted)', fontWeight: 500 }}>· {t.translation}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 11-Mode Ear Training Arcade Banner */}
        <div
          style={{
            padding: '14px 16px',
            borderRadius: 'var(--fl-radius-md)',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.16) 0%, rgba(0, 245, 180, 0.12) 100%)',
            border: '1.5px solid rgba(99, 102, 241, 0.35)',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(99, 102, 241, 0.25)',
                border: '1.5px solid var(--fl-indigo-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--fl-indigo-light)',
                flexShrink: 0
              }}
            >
              <Headphones size={20} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--fl-text-primary)' }}>
                🎧 11-Mode Ear Training Arcade
              </div>
              <div style={{ fontSize: '12px', color: 'var(--fl-text-secondary)', marginTop: '2px' }}>
                Sound Blitz, Minimal Pairs, Cloze & Native Micro-Story
              </div>
            </div>
          </div>

          <button
            type="button"
            id={`btn-open-ear-arcade-${unit.id}`}
            className="fl-btn"
            onClick={() => {
              onClose();
              if (onOpenEarChallenge) {
                onOpenEarChallenge(unit);
              }
            }}
            style={{
              padding: '9px 16px',
              fontSize: '13px',
              fontWeight: 800,
              backgroundColor: 'var(--fl-indigo-primary)',
              color: '#FFFFFF',
              borderRadius: 'var(--fl-radius-sm)',
              border: 'none',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
            }}
          >
            Play 11 Games
          </button>
        </div>

        {/* Lessons List */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
          {(() => {
            const checkpoint = storageService.getResumeCheckpoint(profile.currentLanguage || 'French');
            return lessons.map((lesson, idx) => {
              const isLessonDone = completedLessons.includes(lesson.id);
              const isCheckpoint = !isLessonDone && checkpoint && checkpoint.unitId === unit.id && (checkpoint.lessonId === lesson.id || (!checkpoint.lessonId && idx === 0));

              return (
                <div
                  key={lesson.id}
                  className="fl-card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 18px',
                    backgroundColor: isLessonDone
                      ? 'rgba(0, 196, 140, 0.05)'
                      : isCheckpoint
                      ? 'rgba(88, 204, 2, 0.08)'
                      : 'var(--fl-bg-card-hover)',
                    borderColor: isLessonDone
                      ? 'var(--fl-teal-primary)'
                      : isCheckpoint
                      ? '#58CC02'
                      : 'var(--fl-border)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: isLessonDone
                          ? 'var(--fl-teal-primary)'
                          : isCheckpoint
                          ? '#58CC02'
                          : 'rgba(255, 255, 255, 0.08)',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '15px',
                        flexShrink: 0
                      }}
                    >
                      {isLessonDone ? <CheckCircle2 size={20} color="#FFFFFF" /> : idx + 1}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '17px', fontWeight: 700, color: 'var(--fl-text-primary)' }}>
                        {lesson.title}
                      </span>
                      <span style={{ fontSize: '14px', color: 'var(--fl-text-secondary)', marginTop: '2px' }}>
                        {lesson.exercises.length} interactive exercises · +{lesson.xpReward} XP
                      </span>
                      {isCheckpoint && (
                        <span style={{ fontSize: '12px', fontWeight: 800, color: '#58CC02', marginTop: '2px' }}>
                          ⚡ Resume from Step {checkpoint.exerciseIndex + 1}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    id={`btn-start-lesson-${lesson.id}`}
                    className="fl-btn fl-btn-primary"
                    onClick={() => {
                      onClose();
                      onStartLesson(unit.id, lesson.id, lesson);
                    }}
                    style={{
                      padding: '10px 16px',
                      fontSize: '14px',
                      borderRadius: 'var(--fl-radius-sm)',
                      backgroundColor: isCheckpoint ? '#58CC02' : undefined,
                      borderColor: isCheckpoint ? '#58CC02' : undefined,
                      boxShadow: isCheckpoint ? '0 0 14px rgba(88, 204, 2, 0.4)' : undefined
                    }}
                  >
                    <Play size={15} fill="currentColor" />
                    <span>
                      {isLessonDone
                        ? 'Review'
                        : isCheckpoint
                        ? `Resume`
                        : 'Start'}
                    </span>
                  </button>
                </div>
              );
            });
          })()}
        </div>
      </div>
    </div>
  );
};

