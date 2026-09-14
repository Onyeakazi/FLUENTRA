// FLUENTRA Step 1: DISCOVER Interactive Learning Target Presentation
import React, { useState } from 'react';
import { Volume2, Sparkles, BookOpen, ArrowRight, Info, Check } from 'lucide-react';
import { LearningTarget } from '../../types/curriculum';
import { ttsService } from '../../services/ttsService';
import { useUser } from '../../context/UserContext';
import { getLanguageOption } from '../../data/languages';

interface TargetDiscoveryProps {
  targets: LearningTarget[];
  practicalOutcome?: string;
  onComplete: () => void;
}

export const TargetDiscovery: React.FC<TargetDiscoveryProps> = ({
  targets,
  practicalOutcome,
  onComplete
}) => {
  const { profile } = useUser();
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [listenedIds, setListenedIds] = useState<string[]>([]);

  const effectiveLang =
    getLanguageOption(profile?.currentLanguage || 'French').code ||
    profile?.targetLanguage ||
    'fr-FR';

  const handlePlay = (target: LearningTarget, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const text = target.audioText || target.term;
    setPlayingId(target.id);

    ttsService.speak(text, effectiveLang, profile.slowAudioDefault || false, () => {
      setPlayingId(null);
      setListenedIds(prev => Array.from(new Set([...prev, target.id])));
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Banner */}
      <div
        className="fl-card"
        style={{
          padding: '16px 18px',
          background: 'linear-gradient(135deg, rgba(88, 204, 2, 0.12) 0%, rgba(0, 196, 140, 0.08) 100%)',
          border: '1.5px solid rgba(88, 204, 2, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            className="fl-badge"
            style={{
              backgroundColor: '#58CC02',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: '999px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Sparkles size={12} />
            Step 1 · DISCOVER
          </span>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--fl-text-secondary)' }}>
            Meet Your Learning Targets
          </span>
        </div>

        {practicalOutcome && (
          <p style={{ fontSize: '14px', color: 'var(--fl-text-primary)', fontWeight: 600, margin: 0, lineHeight: 1.45 }}>
            🎯 {practicalOutcome}
          </p>
        )}
      </div>

      {/* Target Cards Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {targets.map((t, idx) => {
          const isPlaying = playingId === t.id;
          const hasListened = listenedIds.includes(t.id);

          return (
            <div
              key={t.id}
              className="fl-card"
              onClick={() => handlePlay(t)}
              style={{
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                border: isPlaying ? '1.5px solid #58CC02' : '1px solid var(--fl-border)',
                backgroundColor: isPlaying ? 'rgba(88, 204, 2, 0.06)' : 'var(--fl-bg-card)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--fl-text-muted)' }}>
                      #{idx + 1}
                    </span>
                    <span style={{ fontSize: '19px', fontWeight: 800, color: 'var(--fl-text-primary)' }}>
                      {t.term}
                    </span>
                    {t.phonetic && (
                      <span style={{ fontSize: '13px', color: '#58CC02', fontWeight: 600 }}>
                        {t.phonetic}
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '15px', color: 'var(--fl-text-secondary)', fontWeight: 600 }}>
                    {t.translation}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => handlePlay(t, e)}
                  className="fl-btn-icon"
                  style={{
                    width: '38px',
                    height: '38px',
                    backgroundColor: isPlaying ? 'rgba(88, 204, 2, 0.2)' : 'var(--fl-bg-card-hover)',
                    border: `1.5px solid ${isPlaying ? '#58CC02' : 'var(--fl-border)'}`,
                    flexShrink: 0
                  }}
                  title="Listen to native pronunciation"
                >
                  <Volume2 size={18} color={isPlaying ? '#58CC02' : 'var(--fl-text-secondary)'} className={isPlaying ? 'fl-pulse' : ''} />
                </button>
              </div>

              {/* Context / When to use */}
              {t.context && (
                <div
                  style={{
                    padding: '8px 10px',
                    borderRadius: 'var(--fl-radius-xs)',
                    backgroundColor: 'var(--fl-bg-card-hover)',
                    border: '1px solid var(--fl-border)',
                    fontSize: '12px',
                    color: 'var(--fl-text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Info size={14} color="var(--fl-indigo-light)" style={{ flexShrink: 0 }} />
                  <span>{t.context}</span>
                </div>
              )}

              {/* In-Context Example */}
              {t.exampleUsage && (
                <div style={{ fontSize: '13px', color: 'var(--fl-text-secondary)', fontStyle: 'italic', paddingLeft: '4px' }}>
                  “{t.exampleUsage}” — <span style={{ color: 'var(--fl-text-muted)' }}>{t.exampleTranslation}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action to proceed to Step 2 */}
      <button
        type="button"
        id="btn-discover-continue"
        className="fl-btn fl-btn-primary"
        onClick={onComplete}
        style={{
          width: '100%',
          minHeight: '52px',
          fontSize: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '8px'
        }}
      >
        <span>I'm Ready — Start Learning Journey</span>
        <ArrowRight size={18} />
      </button>
    </div>
  );
};
