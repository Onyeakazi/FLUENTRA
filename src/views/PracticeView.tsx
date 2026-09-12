// FLUENTRA Practice & Recall Drills View (Dynamic Across All Languages)
import React, { useState } from 'react';
import { Sparkles, CheckCircle2, RotateCcw, Volume2, ArrowRight } from 'lucide-react';
import { MatchPairs } from '../components/exercise/MatchPairs';
import { SentenceOrder } from '../components/exercise/SentenceOrder';
import { AudioControls } from '../components/speech/AudioControls';
import { soundService } from '../services/soundService';
import { useUser } from '../context/UserContext';
import { LANGUAGE_PACKS } from '../data/curriculumContent';

export const PracticeView: React.FC = () => {
  const [activeDrill, setActiveDrill] = useState<'pairs' | 'sentence' | 'listening'>('pairs');
  const [drillCompleted, setDrillCompleted] = useState(false);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const { profile, addXp } = useUser();

  const currentLang = profile.currentLanguage || 'French';
  const pack = LANGUAGE_PACKS[currentLang] || LANGUAGE_PACKS.French;

  const practicePairs = pack.pairs.map((p, idx) => ({
    id: `p${idx + 1}`,
    left: p.left,
    right: p.right
  }));

  const handleFinishDrill = () => {
    setDrillCompleted(true);
    addXp(15);
    soundService.playLevelUnlock();
  };

  const handleReset = () => {
    setDrillCompleted(false);
    setSelectedWords([]);
    setIsChecked(false);
  };

  return (
    <div className="content-scrollable" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--fl-indigo-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Interactive Practice
          </span>
          <span className="fl-badge fl-badge-teal" style={{ padding: '2px 8px', fontSize: '11px', fontWeight: 700 }}>
            {pack.flag} {pack.name}
          </span>
        </div>
        <h1 style={{ fontSize: '26px', fontWeight: 800, marginTop: '2px' }}>
          Active Recall Drills
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--fl-text-secondary)' }}>
          Strengthen vocabulary retention and sentence reflexes for {pack.name}.
        </p>
      </div>

      {/* Drill Selector Tabs */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {[
          { id: 'pairs', label: 'Match Pairs' },
          { id: 'sentence', label: 'Sentence Builder' },
          { id: 'listening', label: 'Audio Recall' }
        ].map((tab) => {
          const isActive = activeDrill === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              id={`tab-practice-${tab.id}`}
              onClick={() => {
                setActiveDrill(tab.id as any);
                handleReset();
              }}
              className={`fl-badge ${isActive ? 'fl-badge-teal' : 'fl-badge-locked'}`}
              style={{
                flex: 1,
                padding: '10px 10px',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 700
              }}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Practice Drill Workspace */}
      <div className="fl-card fl-card-active" style={{ minHeight: '340px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {drillCompleted ? (
          <div style={{ textAlign: 'center', padding: '24px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--fl-teal-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CheckCircle2 size={36} color="#FFFFFF" />
            </div>

            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Drill Completed!</h3>
              <p style={{ fontSize: '14px', color: 'var(--fl-text-secondary)', marginTop: '4px' }}>
                You earned <strong style={{ color: 'var(--fl-gold-star)' }}>+15 XP</strong> for practicing {pack.name}.
              </p>
            </div>

            <button
              type="button"
              className="fl-btn fl-btn-primary"
              onClick={handleReset}
              style={{ marginTop: '8px' }}
            >
              <RotateCcw size={16} />
              <span>Practice Another Round</span>
            </button>
          </div>
        ) : (
          <>
            {activeDrill === 'pairs' && (
              <MatchPairs
                pairs={practicePairs}
                onComplete={handleFinishDrill}
              />
            )}

            {activeDrill === 'sentence' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <SentenceOrder
                  exercise={{
                    id: 'drill-sentence-1',
                    type: 'sentence_order',
                    prompt: pack.orderSentence.prompt,
                    translation: pack.orderSentence.trans,
                    correctOrder: pack.orderSentence.words,
                    options: [...pack.orderSentence.words, ...pack.orderSentence.distractors].map((w, idx) => ({ id: `w${idx}`, text: w })),
                    xpReward: 15
                  }}
                  selectedWords={selectedWords}
                  onAddWord={(word) => setSelectedWords(prev => [...prev, word])}
                  onRemoveWord={(idx) => setSelectedWords(prev => prev.filter((_, i) => i !== idx))}
                  isChecked={isChecked}
                  isCorrect={selectedWords.join(' ') === pack.orderSentence.target}
                />

                <div style={{ marginTop: '14px' }}>
                  <button
                    type="button"
                    className="fl-btn fl-btn-primary"
                    onClick={() => {
                      if (!isChecked) {
                        setIsChecked(true);
                        if (selectedWords.join(' ') === pack.orderSentence.target) {
                          soundService.playCorrect();
                        } else {
                          soundService.playIncorrect();
                        }
                      } else {
                        handleFinishDrill();
                      }
                    }}
                    disabled={selectedWords.length === 0}
                    style={{ width: '100%' }}
                  >
                    <span>{isChecked ? 'Complete Drill' : 'Check Order'}</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {activeDrill === 'listening' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', textAlign: 'center', padding: '16px 0' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 800 }}>
                  Listen & Identify Phrase in {pack.name}
                </h3>

                <AudioControls text={pack.greetingFormal.target} lang={profile.targetLanguage || pack.code} size="lg" />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                  {[
                    { id: 'opt1', text: pack.greetingFormal.target, translation: pack.greetingFormal.trans, correct: true },
                    { id: 'opt2', text: pack.goodbye.target, translation: pack.goodbye.trans, correct: false },
                    { id: 'opt3', text: pack.thankYou.target, translation: pack.thankYou.trans, correct: false }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      className="fl-card fl-card-interactive"
                      onClick={handleFinishDrill}
                      style={{ padding: '16px 18px', minHeight: '52px', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <span style={{ fontSize: '17px', fontWeight: 600 }}>
                        {opt.text}
                      </span>
                      <span style={{ fontSize: '13px', color: 'var(--fl-text-secondary)' }}>
                        {opt.translation}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
