// FLUENTRA "Welcome Back" 1-Tap Resume Modal
import React from 'react';
import { Play, Sparkles, X, ArrowRight, RotateCcw, Flame } from 'lucide-react';
import { CURRICULUM_DATA } from '../../data/curriculumRegistry';
import { ResumeCheckpoint, storageService } from '../../services/storageService';
import { LANG_FLAGS } from '../../data/languages';

interface WelcomeBackResumeModalProps {
  isOpen: boolean;
  checkpoint: ResumeCheckpoint | null;
  userName?: string;
  language: string;
  onClose: () => void;
  onResume: (unitId: string, lessonId?: string) => void;
  onRestart: (unitId: string, lessonId?: string) => void;
}

export const WelcomeBackResumeModal: React.FC<WelcomeBackResumeModalProps> = ({
  isOpen,
  checkpoint,
  userName = 'Learner',
  language,
  onClose,
  onResume,
  onRestart
}) => {
  if (!isOpen || !checkpoint || !checkpoint.unitId) return null;

  const unitMeta = CURRICULUM_DATA.unitsById[checkpoint.unitId];
  if (!unitMeta) return null;

  const flag = LANG_FLAGS[language] || '🇫🇷';
  const currentStep = checkpoint.exerciseIndex + 1;
  const totalSteps = checkpoint.totalExercises || 10;
  const progressPercent = Math.min(100, Math.round((currentStep / totalSteps) * 100));

  return (
    <div
      className="fl-sheet-backdrop"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="fl-card animate-pop-in"
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '28px 24px',
          borderRadius: '24px',
          backgroundColor: 'var(--fl-bg-card)',
          border: '2px solid #58CC02',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(88, 204, 2, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close / Dismiss Button */}
        <button
          type="button"
          id="btn-dismiss-welcome-back"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            color: 'var(--fl-text-muted)',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Dismiss"
        >
          <X size={20} />
        </button>

        {/* Pulsing Mascot / Hero Icon */}
        <div
          style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #58CC02 0%, #46A302 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(88, 204, 2, 0.4)',
            marginBottom: '16px'
          }}
        >
          <Sparkles size={34} color="#FFFFFF" />
        </div>

        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 900, margin: 0, color: 'var(--fl-text-primary)' }}>
            Welcome Back!
          </h2>
          <span style={{ fontSize: '20px' }}>{flag}</span>
        </div>

        <p style={{ fontSize: '14px', color: 'var(--fl-text-secondary)', margin: '0 0 20px', lineHeight: 1.4 }}>
          Ready to pick up right where you left off, <strong>{userName}</strong>?
        </p>

        {/* Checkpoint Detail Card */}
        <div
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '16px',
            backgroundColor: 'var(--fl-bg-card-subtle)',
            border: '1.5px solid var(--fl-border-strong)',
            marginBottom: '20px',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span
              className="fl-badge"
              style={{
                backgroundColor: '#58CC02',
                color: '#FFFFFF',
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.04em',
                padding: '3px 8px',
                borderRadius: '999px'
              }}
            >
              IN PROGRESS
            </span>
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--fl-text-muted)' }}>
              {unitMeta.cefrLevel} · Section {unitMeta.levelNumber}
            </span>
          </div>

          <div>
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 900, color: 'var(--fl-text-primary)' }}>
              Unit {unitMeta.number}: {unitMeta.title}
            </h4>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--fl-text-secondary)' }}>
              {unitMeta.practicalOutcome || unitMeta.subtitle}
            </p>
          </div>

          {/* Progress Bar */}
          <div style={{ marginTop: '4px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
                fontWeight: 800,
                color: '#58CC02',
                marginBottom: '5px'
              }}
            >
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{progressPercent}% Complete</span>
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
                  width: `${progressPercent}%`,
                  height: '100%',
                  backgroundColor: '#58CC02',
                  borderRadius: '999px',
                  transition: 'width 0.4s ease'
                }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            type="button"
            id="btn-modal-resume-now"
            className="fl-btn fl-btn-primary"
            onClick={() => {
              onResume(checkpoint.unitId, checkpoint.lessonId);
              onClose();
            }}
            style={{
              width: '100%',
              minHeight: '52px',
              fontSize: '16px',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              borderRadius: '16px',
              boxShadow: '0 5px 0 #46A302'
            }}
          >
            <Play size={18} fill="#FFFFFF" />
            <span>Resume Step {currentStep}</span>
            <ArrowRight size={18} />
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              id="btn-modal-explore-path"
              className="fl-btn fl-btn-secondary"
              onClick={onClose}
              style={{
                flex: 1,
                minHeight: '44px',
                fontSize: '14px',
                fontWeight: 800,
                borderRadius: '14px'
              }}
            >
              Explore Map
            </button>

            <button
              type="button"
              id="btn-modal-restart-unit"
              onClick={() => {
                storageService.clearResumeCheckpoint(language);
                onRestart(checkpoint.unitId, checkpoint.lessonId);
                onClose();
              }}
              style={{
                padding: '0 14px',
                minHeight: '44px',
                borderRadius: '14px',
                backgroundColor: 'var(--fl-bg-card-subtle)',
                border: '1.5px solid var(--fl-border-strong)',
                color: 'var(--fl-text-secondary)',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
              title="Restart this unit from Step 1"
            >
              <RotateCcw size={14} />
              <span>Restart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
