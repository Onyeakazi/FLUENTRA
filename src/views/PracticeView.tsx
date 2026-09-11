// FLUENTRA Practice & Recall Drills View
import React, { useState } from 'react';
import { Sparkles, CheckCircle2, RotateCcw, Volume2, ArrowRight } from 'lucide-react';
import { MatchPairs } from '../components/exercise/MatchPairs';
import { SentenceOrder } from '../components/exercise/SentenceOrder';
import { AudioControls } from '../components/speech/AudioControls';
import { soundService } from '../services/soundService';
import { useUser } from '../context/UserContext';

const PRACTICE_PAIRS = [
  { id: 'p1', left: 'Bonjour', right: 'Good morning' },
  { id: 'p2', left: 'S’il vous plaît', right: 'Please' },
  { id: 'p3', left: 'L’addition', right: 'The bill / check' },
  { id: 'p4', left: 'Enchanté', right: 'Nice to meet you' },
  { id: 'p5', left: 'Bonsoir', right: 'Good evening' }
];

export const PracticeView: React.FC = () => {
  const [activeDrill, setActiveDrill] = useState<'pairs' | 'sentence' | 'listening'>('pairs');
  const [drillCompleted, setDrillCompleted] = useState(false);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const { addXp } = useUser();

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
        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--fl-indigo-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Interactive Practice
        </span>
        <h1 style={{ fontSize: '24px', fontWeight: 800, marginTop: '2px' }}>
          Active Recall Drills
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--fl-text-secondary)' }}>
          Strengthen vocabulary memory and sentence construction reflexes.
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
                padding: '10px 8px',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '13px'
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
                You earned <strong style={{ color: 'var(--fl-gold-star)' }}>+15 XP</strong> for your active practice.
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
                pairs={PRACTICE_PAIRS}
                onComplete={handleFinishDrill}
              />
            )}

            {activeDrill === 'sentence' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <SentenceOrder
                  exercise={{
                    id: 'drill-sentence-1',
                    type: 'sentence_order',
                    prompt: 'Arrange the sentence: “I would like a table for two please”',
                    translation: 'Je voudrais une table pour deux s’il vous plaît',
                    correctOrder: ['Je', 'voudrais', 'une table', 'pour deux', 's’il vous plaît'],
                    options: [
                      { id: 'w1', text: 'voudrais' },
                      { id: 'w2', text: 'Je' },
                      { id: 'w3', text: 'pour deux' },
                      { id: 'w4', text: 'une table' },
                      { id: 'w5', text: 's’il vous plaît' }
                    ],
                    xpReward: 15
                  }}
                  selectedWords={selectedWords}
                  onAddWord={(word) => setSelectedWords(prev => [...prev, word])}
                  onRemoveWord={(idx) => setSelectedWords(prev => prev.filter((_, i) => i !== idx))}
                  isChecked={isChecked}
                  isCorrect={selectedWords.join(' ') === 'Je voudrais une table pour deux s’il vous plaît'}
                />

                <div style={{ marginTop: '14px' }}>
                  <button
                    type="button"
                    className="fl-btn fl-btn-primary"
                    onClick={() => {
                      if (!isChecked) {
                        setIsChecked(true);
                        if (selectedWords.join(' ') === 'Je voudrais une table pour deux s’il vous plaît') {
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
                <h3 style={{ fontSize: '18px', fontWeight: 800 }}>
                  Listen & Identify Phrase
                </h3>

                <AudioControls text="Enchanté de faire votre connaissance" size="lg" />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                  {[
                    { id: 'opt1', text: 'Enchanté de faire votre connaissance', correct: true },
                    { id: 'opt2', text: 'Comment vous appelez-vous ?', correct: false },
                    { id: 'opt3', text: 'Où se trouve la gare centrale ?', correct: false }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      className="fl-card fl-card-interactive"
                      onClick={handleFinishDrill}
                      style={{ padding: '14px', textAlign: 'left' }}
                    >
                      <span style={{ fontSize: '15px', fontWeight: 600 }}>
                        {opt.text}
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
