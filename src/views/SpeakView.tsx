// FLUENTRA Speak View (Pronunciation Studio & Conversation Roleplay Hub)
import React, { useState } from 'react';
import { Mic, MessageSquare, Lock, ChevronRight, Sparkles } from 'lucide-react';
import { AudioControls } from '../components/speech/AudioControls';
import { RecordMicButton } from '../components/speech/RecordMicButton';
import { PronunciationScoreCard } from '../components/speech/PronunciationScoreCard';
import { speechService } from '../services/speechService';
import { pronunciationEngine } from '../services/pronunciationService';
import { soundService } from '../services/soundService';
import { getScenariosForLanguage } from '../data/conversationScenarios';
import { ConversationScenario } from '../types/conversation';
import { useProgression } from '../context/ProgressionContext';
import { useUser } from '../context/UserContext';
import { SpeechRecognitionState, PronunciationResult } from '../types/speech';

interface SpeakViewProps {
  onStartScenario: (scenario: ConversationScenario) => void;
}

const MULTI_LANG_PRONUNCIATION_PHRASES: Record<string, { text: string; hint: string; trans: string }[]> = {
  'Chinese Mandarin': [
    { text: '你好，很高兴认识你', hint: 'Nǐ hǎo, hěn gāoxìng rènshí nǐ', trans: 'Hello, very nice to meet you' },
    { text: '请问洗手间在哪里？', hint: 'Qǐngwèn xǐshǒujiān zài nǎlǐ?', trans: 'Excuse me, where is the restroom?' },
    { text: '我想买一杯热咖啡', hint: 'Wǒ xiǎng mǎi yī bēi rè kāfēi', trans: 'I would like to buy a hot coffee' },
    { text: '非常感谢你的帮助', hint: 'Fēicháng gǎnxiè nǐ de bāngzhù', trans: 'Thank you very much for your help' }
  ],
  French: [
    { text: 'Bonjour, comment allez-vous ?', hint: '/bɔ̃.ʒuʁ kɔ.mɑ̃.t‿a.le.vu/', trans: 'Hello, how are you?' },
    { text: 'Une baguette tradition s’il vous plaît', hint: '/yn ba.ɡɛt tʁa.di.sjɔ̃ sil vu plɛ/', trans: 'A tradition baguette please' },
    { text: 'Enchanté de faire votre connaissance', hint: '/ɑ̃.ʃɑ̃.te də fɛʁ vɔtʁ kɔ.nɛ.sɑ̃s/', trans: 'Delighted to make your acquaintance' },
    { text: 'Où se trouve la station de métro ?', hint: '/u sə tʁuv la sta.sjɔ̃ də me.tʁo/', trans: 'Where is the metro station?' }
  ],
  Spanish: [
    { text: '¡Hola! ¿Cómo estás hoy?', hint: '/ˈo.la ˈko.mo esˈtas oj/', trans: 'Hello! How are you today?' },
    { text: 'Una mesa para dos personas por favor', hint: '/ˈu.na ˈme.sa ˈpa.ɾa dos peɾˈso.nas poɾ faˈβoɾ/', trans: 'A table for two people please' },
    { text: 'Mucho gusto en conocerte', hint: '/ˈmu.tʃo ˈɣws.to en ko.noˈseɾ.te/', trans: 'Nice to meet you' },
    { text: '¿Dónde está la estación de metro?', hint: '/ˈdon.de esˈta la es.taˈsjon de ˈme.tɾo/', trans: 'Where is the metro station?' }
  ],
  German: [
    { text: 'Guten Tag, wie geht es Ihnen?', hint: '/ˈɡuːtn̩ taːk viː ɡeːt ɛs ˈiːnən/', trans: 'Good day, how are you?' },
    { text: 'Ich möchte bitte einen Kaffee bestellen', hint: '/ɪç ˈmœç.tə ˈbɪ.tə ˈaɪ̯.nən ˈka.fe bəˈʃtɛ.lən/', trans: 'I would like to order a coffee please' },
    { text: 'Freut mich, Sie kennenzulernen', hint: '/fʁɔɪ̯t mɪç ziː ˈkɛ.nən.tsu.lɛʁ.nən/', trans: 'Pleased to meet you' },
    { text: 'Wo befindet sich der Bahnhof?', hint: '/voː bəˈfɪn.dət zɪç deːɐ̯ ˈbaːn.hoːf/', trans: 'Where is the train station located?' }
  ],
  Japanese: [
    { text: 'こんにちは、お元気ですか？', hint: 'Konnichiwa, o-genki desu ka?', trans: 'Hello, how are you?' },
    { text: 'コーヒーをひとつお願いします', hint: 'Koohii o hitotsu onegaishimasu', trans: 'One coffee please' },
    { text: 'はじめまして、よろしくお願いします', hint: 'Hajimemashite, yoroshiku onegaishimasu', trans: 'Nice to meet you, please treat me well' },
    { text: '駅はどちらですか？', hint: 'Eki wa dochira desu ka?', trans: 'Where is the train station?' }
  ],
  Italian: [
    { text: 'Buongiorno, come sta oggi?', hint: '/bwonˈdʒor.no ˈko.me sta ˈɔd.dʒi/', trans: 'Good morning, how are you today?' },
    { text: 'Vorrei un tavolo per due per favore', hint: '/vorˈrɛj un ˈta.vo.lo per ˈdu.e per faˈvo.re/', trans: 'I would like a table for two please' },
    { text: 'Piacere di conoscerti', hint: '/pjaˈtʃe.re di koˈnoʃ.ʃer.ti/', trans: 'Pleasure to meet you' },
    { text: 'Dov’è la stazione ferroviaria?', hint: '/doˈvɛ la statˈtsjo.ne fer.roˈvja.rja/', trans: 'Where is the train station?' }
  ]
};

export const SpeakView: React.FC<SpeakViewProps> = ({ onStartScenario }) => {
  const { activeLevel } = useProgression();
  const { profile } = useUser();
  const [selectedPhraseIdx, setSelectedPhraseIdx] = useState(0);
  const [speechState, setSpeechState] = useState<SpeechRecognitionState>('idle');
  const [evalResult, setEvalResult] = useState<PronunciationResult | null>(null);
  const [lastTranscript, setLastTranscript] = useState('');

  const phrases = MULTI_LANG_PRONUNCIATION_PHRASES[profile.currentLanguage] || MULTI_LANG_PRONUNCIATION_PHRASES.French;
  const currentPhrase = phrases[selectedPhraseIdx] || phrases[0];
  const targetLangCode = profile.targetLanguage || 'fr-FR';

  const handleStartMic = () => {
    soundService.playMicClick();
    setSpeechState('listening');
    setEvalResult(null);

    const started = speechService.start(
      targetLangCode,
      (transcript, isFinal) => {
        setLastTranscript(transcript);
        if (isFinal) {
          handleEvaluate(transcript);
        }
      },
      (_err) => {
        setSpeechState('idle');
      },
      () => {
        if (speechState === 'listening') {
          setSpeechState('idle');
        }
      }
    );

    if (!started) {
      setSpeechState('idle');
    }
  };

  const handleStopMic = () => {
    soundService.playMicClick();
    speechService.stop();
    if (lastTranscript) {
      handleEvaluate(lastTranscript);
    } else {
      setSpeechState('idle');
    }
  };

  const handleEvaluate = (transcript: string) => {
    setSpeechState('processing');
    setTimeout(() => {
      const res = pronunciationEngine.evaluate(currentPhrase.text, transcript);
      setEvalResult(res);
      setSpeechState('success');

      if (res.isPassed) {
        soundService.playCorrect();
      } else {
        soundService.playIncorrect();
      }
    }, 450);
  };

  const handleSimulate = (text: string) => {
    setSpeechState('listening');
    setTimeout(() => {
      setLastTranscript(text);
      handleEvaluate(text);
    }, 500);
  };

  return (
    <div className="content-scrollable" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--fl-coral-flame)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Voice Studio · {profile.currentLanguage}
          </span>
        </div>
        <h1 style={{ fontSize: '26px', fontWeight: 800, marginTop: '2px', color: 'var(--fl-text-primary)' }}>
          Voice Pronunciation Studio
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--fl-text-secondary)' }}>
          Master native {profile.currentLanguage} accent articulation with real-time phonetic feedback.
        </p>
      </div>

      {/* Target Phrase Selection Pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {phrases.map((_phrase, idx) => {
          const isSelected = selectedPhraseIdx === idx;
          return (
            <button
              key={idx}
              type="button"
              id={`phrase-pill-${idx}`}
              onClick={() => {
                setSelectedPhraseIdx(idx);
                setEvalResult(null);
                setSpeechState('idle');
              }}
              className={`fl-badge ${isSelected ? 'fl-badge-flame' : 'fl-badge-locked'}`}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              <span>Phrase {idx + 1}</span>
            </button>
          );
        })}
      </div>

      {/* Main Pronunciation Practice Display */}
      <div
        className="fl-card fl-card-active"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '26px 18px',
          gap: '14px',
          background: 'linear-gradient(180deg, rgba(255, 107, 74, 0.08) 0%, var(--fl-bg-card) 100%)',
          borderColor: 'rgba(255, 107, 74, 0.3)'
        }}
      >
        <AudioControls text={currentPhrase.text} lang={targetLangCode} size="lg" />

        <div>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF' }}>
            {currentPhrase.text}
          </h2>
          <span style={{ fontSize: '15px', color: 'var(--fl-teal-light)', fontFamily: 'monospace', display: 'block', marginTop: '4px' }}>
            {currentPhrase.hint}
          </span>
          <span style={{ fontSize: '16px', color: 'var(--fl-text-secondary)', display: 'block', marginTop: '4px' }}>
            “{currentPhrase.trans}”
          </span>
        </div>

        {/* Microphone Button */}
        {!evalResult && (
          <RecordMicButton
            state={speechState}
            onStart={handleStartMic}
            onStop={handleStopMic}
            onSimulateSpeech={handleSimulate}
            targetSample={currentPhrase.text}
          />
        )}

        {/* Evaluation Output */}
        {evalResult && (
          <div style={{ width: '100%' }}>
            <PronunciationScoreCard
              result={evalResult}
              onRetry={() => {
                setEvalResult(null);
                setSpeechState('idle');
              }}
              onContinue={() => {
                setSelectedPhraseIdx(prev => (prev + 1) % phrases.length);
                setEvalResult(null);
                setSpeechState('idle');
              }}
            />
          </div>
        )}
      </div>

      {/* AI Conversation Roleplay Scenarios Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--fl-text-primary)' }}>
              AI Real-World Roleplay
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--fl-text-secondary)' }}>
              Interactive conversations in {profile.currentLanguage} unlocking with your level.
            </p>
          </div>
          <span className="fl-badge fl-badge-teal" style={{ fontSize: '13px' }}>
            {getScenariosForLanguage(profile.currentLanguage || 'French').length} Scenarios
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {getScenariosForLanguage(profile.currentLanguage || 'French').map((scenario) => {
            const isLocked = scenario.minLevelNumber > activeLevel;

            return (
              <button
                key={scenario.id}
                type="button"
                id={`scenario-btn-${scenario.id}`}
                className={`fl-card fl-card-interactive ${isLocked ? 'fl-card-locked' : ''}`}
                onClick={() => !isLocked && onStartScenario(scenario)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 18px',
                  textAlign: 'left',
                  width: '100%'
                }}
                disabled={isLocked}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: 'var(--fl-radius-md)',
                      backgroundColor: isLocked ? 'rgba(255,255,255,0.05)' : 'var(--fl-teal-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {isLocked ? (
                      <Lock size={18} color="var(--fl-text-muted)" />
                    ) : (
                      <MessageSquare size={20} color="var(--fl-teal-light)" />
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '17px', fontWeight: 700, color: 'var(--fl-text-primary)' }}>
                        {scenario.title}
                      </span>
                      {isLocked && (
                        <span className="fl-badge fl-badge-locked" style={{ fontSize: '12px', padding: '2px 8px' }}>
                          Requires Level {scenario.minLevelNumber}
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '14px', color: 'var(--fl-text-secondary)', marginTop: '2px' }}>
                      {scenario.description}
                    </span>
                  </div>
                </div>

                {!isLocked && (
                  <ChevronRight size={20} color="var(--fl-text-muted)" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
