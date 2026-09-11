// FLUENTRA Audio Controls (TTS with Normal & Slow Playback)
import React, { useState } from 'react';
import { Volume2, Snail } from 'lucide-react';
import { ttsService } from '../../services/ttsService';

interface AudioControlsProps {
  text: string;
  lang?: string;
  size?: 'sm' | 'md' | 'lg';
  showSlowToggle?: boolean;
}

export const AudioControls: React.FC<AudioControlsProps> = ({
  text,
  lang = 'fr-FR',
  size = 'md',
  showSlowToggle = true
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayingSlow, setIsPlayingSlow] = useState(false);

  const handlePlayNormal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(true);
    ttsService.speak(text, lang, false, () => {
      setIsPlaying(false);
    });
  };

  const handlePlaySlow = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlayingSlow(true);
    ttsService.speak(text, lang, true, () => {
      setIsPlayingSlow(false);
    });
  };

  const btnSize = size === 'sm' ? 36 : size === 'lg' ? 52 : 44;
  const iconSize = size === 'sm' ? 18 : size === 'lg' ? 24 : 20;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
      <button
        type="button"
        id="btn-audio-play"
        className="fl-btn-icon"
        onClick={handlePlayNormal}
        title="Listen to native audio"
        style={{
          width: `${btnSize}px`,
          height: `${btnSize}px`,
          backgroundColor: isPlaying ? 'var(--fl-teal-subtle)' : 'var(--fl-bg-card-hover)',
          borderColor: isPlaying ? 'var(--fl-teal-light)' : 'var(--fl-border)'
        }}
        aria-label="Listen to audio"
      >
        <Volume2
          size={iconSize}
          color={isPlaying ? 'var(--fl-teal-light)' : 'var(--fl-text-primary)'}
        />
      </button>

      {showSlowToggle && (
        <button
          type="button"
          id="btn-audio-slow"
          className="fl-btn-icon"
          onClick={handlePlaySlow}
          title="Listen at slower speed (0.7x)"
          style={{
            width: `${btnSize - 4}px`,
            height: `${btnSize - 4}px`,
            backgroundColor: isPlayingSlow ? 'var(--fl-indigo-subtle)' : 'var(--fl-bg-card-hover)',
            borderColor: isPlayingSlow ? 'var(--fl-indigo-light)' : 'var(--fl-border)'
          }}
          aria-label="Listen slowly"
        >
          <Snail
            size={iconSize - 2}
            color={isPlayingSlow ? 'var(--fl-indigo-light)' : 'var(--fl-text-secondary)'}
          />
        </button>
      )}
    </div>
  );
};
