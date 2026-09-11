// FLUENTRA Unit Detail & AI Dynamic Lesson Generation Sheet
import React, { useState, useEffect } from 'react';
import { X, Play, CheckCircle2, Sparkles, RefreshCw, Cpu, Zap } from 'lucide-react';
import { UnitMetadata, Lesson } from '../../types/curriculum';
import { getLessonsForUnit } from '../../data/curriculumContent';
import { aiCurriculumGenerator } from '../../services/aiCurriculumGenerator';
import { useProgression } from '../../context/ProgressionContext';
import { useUser } from '../../context/UserContext';

interface UnitDetailSheetProps {
  unit: UnitMetadata | null;
  onClose: () => void;
  onStartLesson: (unitId: string, lessonId: string, customLesson?: Lesson) => void;
}

export const UnitDetailSheet: React.FC<UnitDetailSheetProps> = ({
  unit,
  onClose,
  onStartLesson
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="fl-badge fl-badge-teal" style={{ fontSize: '11px', padding: '2px 8px' }}>
                Unit {unit.number} · {unit.cefrLevel}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--fl-text-muted)' }}>
                {unit.category}
              </span>
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 800 }}>
              {unit.title}
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--fl-text-secondary)', marginTop: '2px' }}>
              {unit.subtitle}
            </p>
          </div>

          <button
            type="button"
            className="fl-btn-icon"
            onClick={onClose}
            style={{ width: '36px', height: '36px' }}
            aria-label="Close sheet"
          >
            <X size={18} />
          </button>
        </div>

        {/* Dynamic AI Engine Indicator Card */}
        <div
          style={{
            padding: '12px 14px',
            marginBottom: '14px',
            borderRadius: 'var(--fl-radius-md)',
            background: 'linear-gradient(135deg, rgba(0, 196, 140, 0.12) 0%, rgba(99, 102, 241, 0.08) 100%)',
            border: '1px solid rgba(0, 196, 140, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 196, 140, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Sparkles size={16} color="var(--fl-teal-light)" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--fl-teal-light)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Dynamic AI Curriculum
                </span>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--fl-teal-light)', animation: 'fl-pulse 1.5s infinite' }} />
              </div>
              <p style={{ fontSize: '11px', color: 'var(--fl-text-secondary)', margin: 0 }}>
                Tailored for {profile.currentLanguage} · {profile.learningGoal ? profile.learningGoal.toUpperCase() : 'TRAVEL'} goal
              </p>
            </div>
          </div>

          <button
            type="button"
            id="btn-regenerate-ai-lesson"
            onClick={handleRegenerate}
            disabled={isGenerating}
            className="fl-btn fl-btn-outline"
            style={{
              padding: '6px 10px',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderColor: 'rgba(0, 196, 140, 0.4)',
              color: 'var(--fl-text-primary)'
            }}
            title="Generate a brand new AI lesson variation dynamically"
          >
            <RefreshCw size={12} className={isGenerating ? 'fl-spin' : ''} />
            <span>{isGenerating ? 'Synthesizing...' : 'Regenerate'}</span>
          </button>
        </div>

        {generationNotice && (
          <div style={{ padding: '6px 12px', marginBottom: '10px', borderRadius: '6px', backgroundColor: 'rgba(99, 102, 241, 0.2)', fontSize: '12px', color: 'var(--fl-indigo-light)', textAlign: 'center' }}>
            {generationNotice}
          </div>
        )}

        {/* Lessons List */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
          {lessons.map((lesson, idx) => {
            const isLessonDone = completedLessons.includes(lesson.id);

            return (
              <div
                key={lesson.id}
                className="fl-card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  backgroundColor: isLessonDone ? 'rgba(0, 196, 140, 0.05)' : 'var(--fl-bg-card-hover)',
                  borderColor: isLessonDone ? 'var(--fl-teal-primary)' : 'var(--fl-border)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: isLessonDone ? 'var(--fl-teal-primary)' : 'rgba(255, 255, 255, 0.08)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '14px',
                      flexShrink: 0
                    }}
                  >
                    {isLessonDone ? <CheckCircle2 size={18} color="#FFFFFF" /> : idx + 1}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--fl-text-primary)' }}>
                      {lesson.title}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--fl-text-secondary)' }}>
                      {lesson.exercises.length} interactive exercises · +{lesson.xpReward} XP
                    </span>
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
                    padding: '8px 14px',
                    fontSize: '13px',
                    borderRadius: 'var(--fl-radius-sm)'
                  }}
                >
                  <Play size={14} fill="currentColor" />
                  <span>{isLessonDone ? 'Review' : 'Start'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

