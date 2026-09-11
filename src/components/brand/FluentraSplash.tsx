// FLUENTRA Native Splash Screen Experience
import React, { useEffect, useState } from 'react';
import { FluentraLogo } from './FluentraLogo';

interface FluentraSplashProps {
  onDismiss: () => void;
}

export const FluentraSplash: React.FC<FluentraSplashProps> = ({ onDismiss }) => {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Elegant native app opening duration (1.2 seconds)
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(onDismiss, 350);
    }, 1200);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'var(--fl-bg-app)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        opacity: fading ? 0 : 1,
        transition: 'opacity 350ms cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: fading ? 'none' : 'auto'
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          animation: 'popIn 400ms cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <FluentraLogo size="lg" showWordmark={true} showTagline={true} />

        {/* Dynamic audio resonance wave */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '16px' }}>
          {[12, 28, 44, 28, 16].map((h, i) => (
            <div
              key={i}
              style={{
                width: '4px',
                height: `${h}px`,
                backgroundColor: 'var(--fl-teal-light)',
                borderRadius: '999px',
                animation: `waveBar 0.9s ease-in-out ${i * 0.15}s infinite alternate`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
