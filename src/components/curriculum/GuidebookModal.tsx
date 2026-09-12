// FLUENTRA Duolingo-Style Unit Guidebook Modal
import React from 'react';
import { X, BookOpen, Volume2, Sparkles, CheckCircle2 } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { LANGUAGE_PACKS } from '../../data/curriculumContent';
import { AudioControls } from '../speech/AudioControls';

interface GuidebookModalProps {
  isOpen: boolean;
  onClose: () => void;
  unitNumber: number;
  unitTitle: string;
  cefrLevel: string;
}

export const GuidebookModal: React.FC<GuidebookModalProps> = ({
  isOpen,
  onClose,
  unitNumber,
  unitTitle,
  cefrLevel
}) => {
  const { profile } = useUser();
  const currentLang = profile.currentLanguage || 'French';
  const pack = LANGUAGE_PACKS[currentLang] || LANGUAGE_PACKS.French;

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Unit Guidebook"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="fl-card"
        style={{
          width: '100%',
          maxWidth: '480px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--fl-bg-card)',
          borderRadius: '24px',
          border: '1.5px solid var(--fl-border-strong)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.45)',
          overflow: 'hidden',
          animation: 'fadeInUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 24px',
            borderBottom: '1px solid var(--fl-border)',
            background: 'linear-gradient(135deg, rgba(88, 204, 2, 0.1) 0%, var(--fl-bg-card) 100%)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                backgroundColor: 'rgba(88, 204, 2, 0.18)',
                color: '#58CC02',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <BookOpen size={20} />
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--fl-text-muted)', textTransform: 'uppercase' }}>
                Unit {unitNumber} Guidebook · {cefrLevel}
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>
                {unitTitle}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="fl-btn-icon"
            style={{ width: '34px', height: '34px', borderRadius: '50%' }}
            aria-label="Close Guidebook"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Content */}
        <div
          style={{
            padding: '20px 24px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}
        >
          {/* Key Phrases Section */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
              <Sparkles size={16} color="#FFC800" />
              <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Key Expressions ({pack.name})
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                pack.greetingFormal,
                pack.greetingInformal,
                pack.thankYou,
                pack.howAreYou,
                pack.goodbye
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: '16px',
                    backgroundColor: 'var(--fl-bg-card-subtle)',
                    border: '1px solid var(--fl-border)'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--fl-text-primary)' }}>
                      {item.target}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--fl-text-secondary)', marginTop: '2px' }}>
                      {item.trans} {item.hint ? `· ${item.hint}` : ''}
                    </div>
                  </div>
                  <AudioControls text={item.target} lang={profile.targetLanguage || pack.code} size="sm" />
                </div>
              ))}
            </div>
          </div>

          {/* Grammar & Phonetic Tip */}
          <div
            style={{
              padding: '16px',
              borderRadius: '18px',
              backgroundColor: 'rgba(28, 176, 246, 0.08)',
              border: '1.5px solid rgba(28, 176, 246, 0.3)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1CB0F6', fontWeight: 800, fontSize: '14px', marginBottom: '6px' }}>
              <CheckCircle2 size={18} />
              <span>Phonetic & Grammar Tip</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--fl-text-primary)', margin: 0, lineHeight: 1.5 }}>
              {pack.name === 'Chinese Mandarin' && 'Remember: The 4 tones alter word meaning completely. Keep the 1st tone high and flat like singing, while the 4th tone drops sharply.'}
              {pack.name === 'French' && 'Silent Endings: In French, final consonants (s, t, d, x) are typically silent unless followed by a word starting with a vowel.'}
              {pack.name === 'Spanish' && 'Pure Vowels: Spanish vowels (A-E-I-O-U) never change their sound regardless of word position, and the letter H is always silent.'}
              {pack.name === 'German' && 'Capital Nouns: In German, all nouns are capitalized, and the letter W is pronounced like an English V sound.'}
              {pack.name === 'Japanese' && 'Mora Timing: Every syllable in Japanese receives equal duration and steady rhythmic pacing.'}
              {pack.name === 'Italian' && 'Double Consonants: Hold double consonants slightly longer (like the "ll" in mille) to preserve musical cadence.'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid var(--fl-border)',
            backgroundColor: 'var(--fl-bg-card-subtle)',
            display: 'flex',
            justifyContent: 'flex-end'
          }}
        >
          <button
            type="button"
            className="fl-btn fl-btn-primary"
            onClick={onClose}
            style={{ padding: '10px 20px', borderRadius: '12px', fontWeight: 700 }}
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
};
