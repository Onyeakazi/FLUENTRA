// FLUENTRA Active AI Roleplay Conversation View & Review
import React, { useState } from 'react';
import { ArrowLeft, Send, Mic, Sparkles, Volume2, Award, CheckCircle2, ArrowRight } from 'lucide-react';
import { ConversationScenario, ConversationTurn, ConversationReview } from '../types/conversation';
import { aiService } from '../services/aiService';
import { ttsService } from '../services/ttsService';
import { soundService } from '../services/soundService';
import { speechService } from '../services/speechService';
import { useProgression } from '../context/ProgressionContext';
import { useUser } from '../context/UserContext';

interface ConversationRoleplayViewProps {
  scenario: ConversationScenario;
  onExit: () => void;
}

export const ConversationRoleplayView: React.FC<ConversationRoleplayViewProps> = ({
  scenario,
  onExit
}) => {
  const { activeLevel } = useProgression();
  const { addXp } = useUser();

  const [turns, setTurns] = useState<ConversationTurn[]>([
    {
      id: 'turn-init',
      sender: 'ai',
      text: scenario.initialAiMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [review, setReview] = useState<ConversationReview | null>(null);
  const [isListening, setIsListening] = useState(false);

  const handleSpeakText = (text: string) => {
    ttsService.speak(text, 'fr-FR');
  };

  const handleSendMessage = async (customMessage?: string) => {
    const textToSend = (customMessage || inputText).trim();
    if (!textToSend || isThinking) return;

    soundService.playMicClick();
    const userTurn: ConversationTurn = {
      id: `turn-user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedTurns = [...turns, userTurn];
    setTurns(updatedTurns);
    setInputText('');
    setIsThinking(true);

    try {
      const aiReply = await aiService.generateReply(
        scenario,
        updatedTurns,
        textToSend,
        activeLevel
      );

      const aiTurn: ConversationTurn = {
        id: `turn-ai-${Date.now()}`,
        sender: 'ai',
        text: aiReply.replyText,
        translation: aiReply.translation,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setTurns(prev => [...prev, aiTurn]);
      soundService.playCorrect();
      handleSpeakText(aiReply.replyText);
    } catch (e) {
      console.warn('AI reply error', e);
    } finally {
      setIsThinking(false);
    }
  };

  const handleStartVoiceInput = () => {
    soundService.playMicClick();
    setIsListening(true);

    speechService.start(
      'fr-FR',
      (transcript, isFinal) => {
        setInputText(transcript);
        if (isFinal) {
          setIsListening(false);
          handleSendMessage(transcript);
        }
      },
      (_err) => {
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );
  };

  const handleFinishConversation = () => {
    const evaluation = aiService.evaluateConversation(scenario, turns);
    setReview(evaluation);
    addXp(evaluation.xpEarned);
    soundService.playLevelUnlock();
  };

  // If review is ready, show post-conversation report
  if (review) {
    return (
      <div className="content-fullscreen" style={{ padding: '20px', background: 'var(--fl-bg-app)', overflowY: 'auto' }}>
        <div
          className="fl-card animate-pop-in"
          style={{
            maxWidth: '500px',
            margin: '0 auto',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <span className="fl-badge fl-badge-teal">
              Roleplay Completed 🎉
            </span>
            <h2 style={{ fontSize: '26px', fontWeight: 800, marginTop: '8px' }}>
              Conversation Review
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--fl-text-secondary)', marginTop: '2px' }}>
              {scenario.title} · {review.totalTurns} turns exchanged
            </p>
          </div>

          {/* Scores Matrix */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="fl-card" style={{ padding: '16px', textAlign: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--fl-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Communication
              </span>
              <p style={{ fontSize: '26px', fontWeight: 800, color: 'var(--fl-teal-light)', marginTop: '4px' }}>
                {review.communicationScore}%
              </p>
            </div>
            <div className="fl-card" style={{ padding: '16px', textAlign: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--fl-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Pronunciation
              </span>
              <p style={{ fontSize: '26px', fontWeight: 800, color: 'var(--fl-coral-flame)', marginTop: '4px' }}>
                {review.pronunciationScore}%
              </p>
            </div>
            <div className="fl-card" style={{ padding: '16px', textAlign: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--fl-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Vocabulary
              </span>
              <p style={{ fontSize: '26px', fontWeight: 800, color: 'var(--fl-gold-star)', marginTop: '4px' }}>
                {review.vocabularyScore}%
              </p>
            </div>
            <div className="fl-card" style={{ padding: '16px', textAlign: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--fl-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Fluency
              </span>
              <p style={{ fontSize: '26px', fontWeight: 800, color: 'var(--fl-indigo-light)', marginTop: '4px' }}>
                {review.fluencyScore}%
              </p>
            </div>
          </div>

          {/* Strengths */}
          <div style={{ backgroundColor: 'rgba(0, 196, 140, 0.08)', padding: '16px', borderRadius: 'var(--fl-radius-md)', border: '1px solid rgba(0, 196, 140, 0.2)' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--fl-teal-light)', marginBottom: '8px' }}>
              What You Did Well
            </h4>
            <ul style={{ fontSize: '14px', color: 'var(--fl-text-secondary)', paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {review.strengths.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ul>
          </div>

          {/* Growth Areas */}
          <div style={{ backgroundColor: 'rgba(255, 107, 74, 0.08)', padding: '16px', borderRadius: 'var(--fl-radius-md)', border: '1px solid rgba(255, 107, 74, 0.2)' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--fl-coral-flame)', marginBottom: '8px' }}>
              Growth & Coaching Areas
            </h4>
            <ul style={{ fontSize: '14px', color: 'var(--fl-text-secondary)', paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {review.growthAreas.map((g, idx) => (
                <li key={idx}>{g}</li>
              ))}
            </ul>
          </div>

          {/* Discovered Words */}
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '10px' }}>
              Encountered Vocabulary
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {review.newVocabulary.map((v, i) => (
                <div key={i} className="fl-card" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--fl-text-primary)' }}>
                      {v.word}
                    </span>
                    <span style={{ fontSize: '13px', color: 'var(--fl-text-muted)', display: 'block', marginTop: '2px' }}>
                      {v.example}
                    </span>
                  </div>
                  <span style={{ fontSize: '14px', color: 'var(--fl-teal-light)', fontWeight: 600 }}>
                    {v.translation}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            id="btn-close-conversation-review"
            className="fl-btn fl-btn-primary"
            onClick={onExit}
            style={{ width: '100%', marginTop: '8px', minHeight: '50px', fontSize: '16px' }}
          >
            <span>Return to Studio</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="content-fullscreen" style={{ background: 'var(--fl-bg-app)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Conversation Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 18px',
          borderBottom: '1px solid var(--fl-border)',
          background: 'rgba(11, 15, 25, 0.95)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            className="fl-btn-icon"
            onClick={onExit}
            style={{ width: '36px', height: '36px' }}
            aria-label="Back to studio"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 800 }}>{scenario.title}</h3>
            <span style={{ fontSize: '13px', color: 'var(--fl-teal-light)' }}>
              AI Role: {scenario.aiRole}
            </span>
          </div>
        </div>

        <button
          type="button"
          id="btn-finish-roleplay"
          className="fl-btn fl-btn-secondary"
          onClick={handleFinishConversation}
          style={{ padding: '8px 14px', fontSize: '13px', borderRadius: 'var(--fl-radius-full)' }}
        >
          <span>Finish & Review</span>
        </button>
      </div>

      {/* Message Stream */}
      <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {turns.map((turn) => {
          const isAi = turn.sender === 'ai';
          return (
            <div
              key={turn.id}
              style={{
                alignSelf: isAi ? 'flex-start' : 'flex-end',
                maxWidth: '85%',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <div
                style={{
                  padding: '14px 18px',
                  borderRadius: isAi ? '4px 18px 18px 18px' : '18px 4px 18px 18px',
                  backgroundColor: isAi ? 'var(--fl-bg-card-elevated)' : 'var(--fl-teal-primary)',
                  color: '#FFFFFF',
                  border: isAi ? '1px solid var(--fl-border)' : 'none',
                  boxShadow: 'var(--fl-shadow-sm)'
                }}
              >
                <p style={{ fontSize: '16px', lineHeight: 1.45, fontWeight: isAi ? 500 : 600, color: '#FFFFFF' }}>
                  {turn.text}
                </p>

                {turn.translation && (
                  <p style={{ fontSize: '13px', color: 'var(--fl-text-muted)', marginTop: '4px', fontStyle: 'italic' }}>
                    {turn.translation}
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 4px' }}>
                <span style={{ fontSize: '12px', color: 'var(--fl-text-muted)' }}>
                  {turn.timestamp}
                </span>
                {isAi && (
                  <button
                    type="button"
                    onClick={() => handleSpeakText(turn.text)}
                    style={{ background: 'none', border: 'none', color: 'var(--fl-teal-light)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    title="Play pronunciation"
                  >
                    <Volume2 size={15} />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {isThinking && (
          <div style={{ alignSelf: 'flex-start', padding: '12px 18px', borderRadius: '14px', backgroundColor: 'var(--fl-bg-card)', border: '1px solid var(--fl-border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', color: 'var(--fl-text-secondary)' }}>Thinking...</span>
          </div>
        )}
      </div>

      {/* Suggested Starter Chips */}
      {turns.length <= 2 && scenario.suggestedUserStarters.length > 0 && (
        <div style={{ padding: '8px 16px', display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {scenario.suggestedUserStarters.map((starter, i) => (
            <button
              key={i}
              type="button"
              className="fl-badge fl-badge-teal"
              onClick={() => handleSendMessage(starter)}
              style={{ padding: '8px 14px', fontSize: '13px', whiteSpace: 'nowrap', cursor: 'pointer' }}
            >
              <span>{starter}</span>
            </button>
          ))}
        </div>
      )}

      {/* Persistent Message Input Bar */}
      <div
        style={{
          padding: '12px 16px',
          paddingBottom: 'calc(12px + var(--fl-safe-bottom))',
          backgroundColor: 'var(--fl-bg-card)',
          borderTop: '1px solid var(--fl-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        <button
          type="button"
          id="btn-conv-mic"
          className="fl-btn-icon"
          onClick={handleStartVoiceInput}
          style={{
            width: '46px',
            height: '46px',
            backgroundColor: isListening ? 'var(--fl-coral-flame)' : 'var(--fl-bg-card-elevated)',
            color: isListening ? '#FFFFFF' : 'var(--fl-teal-light)'
          }}
          title="Speak into microphone"
        >
          <Mic size={22} />
        </button>

        <input
          type="text"
          id="input-conv-message"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder={isListening ? 'Listening...' : 'Type or speak in French...'}
          style={{
            flex: 1,
            height: '48px',
            padding: '0 16px',
            borderRadius: 'var(--fl-radius-full)',
            backgroundColor: 'var(--fl-bg-input)',
            border: '1px solid var(--fl-border)',
            color: 'var(--fl-text-primary)',
            fontSize: '16px',
            outline: 'none'
          }}
        />

        <button
          type="button"
          id="btn-conv-send"
          className="fl-btn-icon"
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim()}
          style={{
            width: '46px',
            height: '46px',
            backgroundColor: 'var(--fl-teal-light)',
            color: '#0B0F19',
            opacity: inputText.trim() ? 1 : 0.4
          }}
          aria-label="Send message"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};
