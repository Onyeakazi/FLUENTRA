// FLUENTRA Unit Node Card (800 Units)
import React from 'react';
import { Lock, Check, Play, Star } from 'lucide-react';
import { UnitMetadata } from '../../types/curriculum';
import { useProgression } from '../../context/ProgressionContext';

interface UnitNodeProps {
  unit: UnitMetadata;
  onOpenUnit: (unitId: string) => void;
  onShowLockedModal: (unit: UnitMetadata) => void;
}

export const UnitNode: React.FC<UnitNodeProps> = ({
  unit,
  onOpenUnit,
  onShowLockedModal
}) => {
  const { getUnitStatus } = useProgression();
  const status = getUnitStatus(unit.id);
  const isLocked = status === 'locked';

  const handleClick = () => {
    if (isLocked) {
      onShowLockedModal(unit);
    } else {
      onOpenUnit(unit.id);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'mastered':
        return <Star size={18} color="var(--fl-gold-star)" fill="var(--fl-gold-star)" />;
      case 'completed':
        return <Check size={18} color="var(--fl-teal-light)" />;
      case 'in_progress':
        return <Play size={16} color="#FFFFFF" fill="#FFFFFF" />;
      case 'available':
        return <Play size={16} color="var(--fl-teal-light)" />;
      case 'locked':
      default:
        return <Lock size={16} color="var(--fl-text-muted)" />;
    }
  };

  const getNodeBackground = () => {
    if (status === 'in_progress') {
      return 'linear-gradient(135deg, var(--fl-teal-light) 0%, var(--fl-teal-primary) 100%)';
    }
    if (status === 'mastered') {
      return 'var(--fl-gold-subtle)';
    }
    if (status === 'completed') {
      return 'var(--fl-teal-subtle)';
    }
    return 'rgba(255, 255, 255, 0.05)';
  };

  return (
    <button
      type="button"
      id={`unit-node-${unit.id}`}
      className={`fl-card fl-card-interactive ${status === 'in_progress' ? 'fl-card-active' : ''} ${isLocked ? 'fl-card-locked' : ''}`}
      onClick={handleClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 16px',
        textAlign: 'left',
        width: '100%'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* State Visual Node */}
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: getNodeBackground(),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: status === 'in_progress' ? '0 0 16px rgba(0, 245, 180, 0.4)' : undefined
          }}
        >
          {getStatusIcon()}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--fl-teal-light)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Unit {unit.number}
            </span>
            <span style={{ fontSize: '13px', color: 'var(--fl-text-muted)' }}>
              · {unit.cefrLevel}
            </span>
          </div>
          <span style={{ fontSize: '16px', fontWeight: 700, color: isLocked ? 'var(--fl-text-secondary)' : 'var(--fl-text-primary)' }}>
            {unit.title}
          </span>
          <span style={{ fontSize: '13px', color: 'var(--fl-text-muted)', marginTop: '2px' }}>
            {unit.lessonCount} lessons · {unit.requiredXp} XP
          </span>
        </div>
      </div>

      <div>
        {status === 'in_progress' && (
          <span className="fl-badge fl-badge-teal" style={{ fontSize: '12px', padding: '4px 10px' }}>
            Current
          </span>
        )}
        {status === 'completed' && (
          <span className="fl-badge fl-badge-teal" style={{ fontSize: '12px', padding: '4px 10px' }}>
            Done
          </span>
        )}
        {status === 'mastered' && (
          <span className="fl-badge fl-badge-gold" style={{ fontSize: '12px', padding: '4px 10px' }}>
            Mastered
          </span>
        )}
        {isLocked && (
          <Lock size={18} color="var(--fl-text-muted)" />
        )}
      </div>
    </button>
  );
};
