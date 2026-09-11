// FLUENTRA Brand Logo & Wordmark
import React from 'react';

interface FluentraLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  showTagline?: boolean;
}

export const FluentraLogo: React.FC<FluentraLogoProps> = ({
  size = 'md',
  showWordmark = true,
  showTagline = false
}) => {
  const sizeMap = {
    sm: { icon: 28, text: '18px', sub: '10px', gap: '8px' },
    md: { icon: 38, text: '22px', sub: '11px', gap: '10px' },
    lg: { icon: 52, text: '30px', sub: '13px', gap: '14px' }
  };

  const dim = sizeMap[size];

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: dim.gap }}>
      <svg
        width={dim.icon}
        height={dim.icon}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <rect width="64" height="64" rx="18" fill="#131B2E" />
        <rect x="13" y="27" width="5" height="10" rx="2.5" fill="#00C48C" />
        <rect x="22" y="19" width="5" height="26" rx="2.5" fill="#00F5B4" />
        <rect x="31" y="12" width="5" height="40" rx="2.5" fill="#FFFFFF" />
        <rect x="40" y="21" width="5" height="22" rx="2.5" fill="#818CF8" />
        <rect x="49" y="28" width="5" height="8" rx="2.5" fill="#6366F1" />
        <circle cx="33.5" cy="32" r="3.5" fill="#00F5B4" />
      </svg>

      {showWordmark && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 800,
              fontSize: dim.text,
              letterSpacing: '0.04em',
              color: '#F8FAFC'
            }}
          >
            FLUENTRA
          </span>
          {showTagline && (
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: dim.sub,
                fontWeight: 600,
                color: 'var(--fl-teal-light)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginTop: '2px'
              }}
            >
              Learn. Speak. Connect.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
