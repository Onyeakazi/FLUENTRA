// FLUENTRA Step 1: WORD PRIMING — Learn Words First Before Building Sentences
import React, { useState } from 'react';
import { Volume2, Sparkles, ArrowRight, Info, Check, Headphones } from 'lucide-react';
import { LearningTarget } from '../../types/curriculum';
import { ttsService } from '../../services/ttsService';
import { useUser } from '../../context/UserContext';
import { getLanguageOption } from '../../data/languages';
import { LANGUAGE_PACKS } from '../../data/curriculumContent';

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

  const fallbackPack = LANGUAGE_PACKS[profile?.currentLanguage || 'French'] || LANGUAGE_PACKS.French;
  const effectiveTargets: LearningTarget[] = (targets && targets.length > 0) ? targets : [
    { id: 'fb-1', term: fallbackPack.greetingFormal.target, translation: fallbackPack.greetingFormal.trans, phonetic: fallbackPack.greetingFormal.hint, audioText: fallbackPack.greetingFormal.target },
    { id: 'fb-2', term: fallbackPack.thankYou.target, translation: fallbackPack.thankYou.trans, phonetic: fallbackPack.thankYou.hint, audioText: fallbackPack.thankYou.target },
    { id: 'fb-3', term: fallbackPack.goodbye.target, translation: fallbackPack.goodbye.trans, phonetic: fallbackPack.goodbye.hint, audioText: fallbackPack.goodbye.target }
  ];

  const handlePlay = (target: LearningTarget, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const text = target.audioText || target.term;
    setPlayingId(target.id);

    ttsService.speak(text, effectiveLang, profile.slowAudioDefault || false, () => {
      setPlayingId(null);
      setListenedIds(prev => Array.from(new Set([...prev, target.id])));
    });
  };

  const allListened = listenedIds.length >= effectiveTargets.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header Banner */}
      <div
        className="fl-card"
        style={{
          padding: '16px 18px',
          background: 'linear-gradient(135deg, rgba(88, 204, 2, 0.14) 0%, rgba(0, 196, 140, 0.09) 100%)',
          border: '1.5px solid rgba(88, 204, 2, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              className="fl-badge"
              style={{
                backgroundColor: '#58CC02',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '11px',
                padding: '3px 10px',
                borderRadius: '999px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Sparkles size={13} />
              Step 1 · WORD PRIMING
            </span>
            <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--fl-teal-light)' }}>
              Learn Words First
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 700,
              color: allListened ? '#58CC02' : 'var(--fl-text-secondary)',
              backgroundColor: allListened ? 'rgba(88, 204, 2, 0.15)' : 'rgba(255, 255, 255, 0.06)',
              padding: '3px 8px',
              borderRadius: '999px'
            }}
          >
            <Headphones size={13} />
            <span>{listenedIds.length}/{effectiveTargets.length} Listened</span>
          </div>
        </div>

        {practicalOutcome && (
          <p style={{ fontSize: '14px', color: 'var(--fl-text-primary)', fontWeight: 600, margin: 0, lineHeight: 1.45 }}>
            🎯 {practicalOutcome}
          </p>
        )}
      </div>

      <div style={{ fontSize: '13px', color: 'var(--fl-text-secondary)', paddingLeft: '4px', fontWeight: 600 }}>
        Tap each card to listen and master the core words before building sentences:
      </div>

      {/* Target Cards Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {effectiveTargets.map((t, idx) => {
          const isPlaying = playingId === t.id;
          const hasListened = listenedIds.includes(t.id);

          return (
            <div
              key={t.id}
              className="fl-card fl-card-interactive"
              onClick={() => handlePlay(t)}
              style={{
                padding: '16px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                border: isPlaying
                  ? '2px solid var(--fl-teal-light)'
                  : hasListened
                  ? '1.5px solid rgba(88, 204, 2, 0.6)'
                  : '1.5px solid var(--fl-border)',
                backgroundColor: isPlaying
                  ? 'rgba(0, 245, 180, 0.08)'
                  : hasListened
                  ? 'rgba(88, 204, 2, 0.05)'
                  : 'var(--fl-bg-card)',
                boxShadow: isPlaying ? '0 0 16px rgba(0, 245, 180, 0.15)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--fl-gold-star)' }}>
                      #{idx + 1}
                    </span>
                    <span style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF' }}>
                      {t.term}
                    </span>
                    {t.phonetic && (
                      <span style={{ fontSize: '13px', color: 'var(--fl-teal-light)', fontWeight: 600, fontFamily: 'monospace' }}>
                        {t.phonetic}
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '15px', color: 'var(--fl-text-secondary)', fontWeight: 600 }}>
                    “{t.translation}”
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  {hasListened && (
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        color: '#58CC02',
                        backgroundColor: 'rgba(88, 204, 2, 0.15)',
                        padding: '2px 6px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px'
                      }}
                    >
                      <Check size={12} strokeWidth={3} />
                      Heard
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={(e) => handlePlay(t, e)}
                    className="fl-btn-icon"
                    style={{
                      width: '38px',
                      height: '38px',
                      backgroundColor: isPlaying ? 'rgba(88, 204, 2, 0.25)' : 'var(--fl-bg-card-hover)',
                      border: `1.5px solid ${isPlaying ? '#58CC02' : 'var(--fl-border)'}`
                    }}
                    title="Listen to native pronunciation"
                    aria-label="Listen"
                  >
                    <Volume2 size={18} color={isPlaying ? '#58CC02' : 'var(--fl-teal-light)'} className={isPlaying ? 'fl-pulse' : ''} />
                  </button>
                </div>
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

      {/* Action to proceed to Step 2 (Building Sentences) */}
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
        <span>I'm Ready — Build Sentences</span>
        <ArrowRight size={18} />
      </button>
    </div>
  );
};
