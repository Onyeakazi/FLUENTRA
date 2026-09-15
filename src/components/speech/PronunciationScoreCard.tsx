// FLUENTRA Pronunciation Score & Phonetic Feedback Card
import React from 'react';
import { CheckCircle2, AlertCircle, RotateCcw, ArrowRight } from 'lucide-react';
import { PronunciationResult } from '../../types/speech';

interface PronunciationScoreCardProps {
  result: PronunciationResult;
  onRetry: () => void;
  onContinue: () => void;
}

export const PronunciationScoreCard: React.FC<PronunciationScoreCardProps> = ({
  result,
  onRetry,
  onContinue
}) => {
  const score = result.overallScore;
  const isPassed = result.isPassed && score >= 80;

  const scoreColor = isPassed
    ? 'var(--fl-teal-light)'
    : score >= 65
    ? 'var(--fl-gold-star)'
    : 'var(--fl-coral-flame)';

  return (
    <div
      className="fl-card animate-pop-in"
      style={{
        marginTop: '16px',
        borderLeft: `4px solid ${scoreColor}`,
        background: 'var(--fl-bg-card-elevated)'
      }}
    >
      {/* Header with Score Radial/Pill */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isPassed ? (
            <CheckCircle2 size={26} color="var(--fl-teal-light)" />
          ) : (
            <AlertCircle size={26} color="var(--fl-coral-flame)" />
          )}
          <div>
            <h4 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>
              {isPassed ? 'Pronunciation Verified! ✓' : 'Score Below 80% — Retry'}
            </h4>
            <span style={{ fontSize: '14px', color: 'var(--fl-text-secondary)', display: 'block', marginTop: '2px' }}>
              {result.feedbackMessage}
            </span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '2px',
            background: 'rgba(0,0,0,0.35)',
            padding: '6px 14px',
            borderRadius: 'var(--fl-radius-full)',
            border: `1px solid ${scoreColor}`
          }}
        >
          <span style={{ fontSize: '22px', fontWeight: 800, color: scoreColor }}>
            {score}
          </span>
          <span style={{ fontSize: '13px', color: 'var(--fl-text-muted)' }}>%</span>
        </div>
      </div>

      {/* Word-by-Word Articulation Breakdown */}
      <div style={{ marginTop: '16px' }}>
        <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--fl-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
          Word Articulation Breakdown
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {result.words.map((item, idx) => {
            const wordBg = item.accuracy === 'exact'
              ? 'var(--fl-teal-subtle)'
              : item.accuracy === 'approximate'
              ? 'var(--fl-gold-subtle)'
              : 'var(--fl-coral-subtle)';

            const wordColor = item.accuracy === 'exact'
              ? 'var(--fl-teal-light)'
              : item.accuracy === 'approximate'
              ? 'var(--fl-gold-light)'
              : 'var(--fl-coral-light)';

            return (
              <div
                key={idx}
                style={{
                  display: 'inline-flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '8px 12px',
                  borderRadius: 'var(--fl-radius-sm)',
                  backgroundColor: wordBg,
                  border: `1px solid ${wordColor}`
                }}
              >
                <span style={{ fontWeight: 700, fontSize: '15px', color: wordColor }}>
                  {item.expected}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--fl-text-muted)', marginTop: '2px' }}>
                  {item.score}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Phonetic Guidance Box */}
      {result.phoneticAdvice && (
        <div
          style={{
            marginTop: '14px',
            padding: '12px 16px',
            borderRadius: 'var(--fl-radius-md)',
            backgroundColor: 'rgba(0, 0, 0, 0.25)',
            border: '1px solid var(--fl-border)',
            fontSize: '14px',
            color: 'var(--fl-text-secondary)',
            lineHeight: 1.5
          }}
        >
          <strong style={{ color: 'var(--fl-text-primary)' }}>Coach Tip: </strong>
          {result.phoneticAdvice}
        </div>
      )}

      {/* Action Buttons: Enforce 80%+ Score Requirement to Advance */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '18px' }}>
        {!isPassed ? (
          <>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                borderRadius: '12px',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1.5px solid rgba(239, 68, 68, 0.35)',
                color: 'var(--fl-coral-flame)',
                fontSize: '13px',
                fontWeight: 700
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>Score is {score}%. You need at least 80% to advance. Repeat to get it right!</span>
            </div>

            <button
              type="button"
              id="btn-pronunciation-retry"
              className="fl-btn fl-btn-coral"
              onClick={onRetry}
              style={{ width: '100%', padding: '14px 16px', fontSize: '15px', minHeight: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <RotateCcw size={18} />
              <span>Repeat Attempt (Target: 80%+)</span>
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className="fl-btn fl-btn-secondary"
              onClick={onRetry}
              style={{ flex: 1, padding: '12px 16px', fontSize: '15px', minHeight: '48px' }}
            >
              <RotateCcw size={16} />
              <span>Practice Again</span>
            </button>

            <button
              type="button"
              id="btn-pronunciation-continue"
              className="fl-btn fl-btn-primary"
              onClick={onContinue}
              style={{ flex: 1.2, padding: '12px 16px', fontSize: '15px', minHeight: '48px' }}
            >
              <span>Continue</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
