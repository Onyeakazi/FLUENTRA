// FLUENTRA Locked Prerequisite Gate Modal
import React from 'react';
import { Lock, ArrowRight, ShieldAlert } from 'lucide-react';
import { UnitMetadata } from '../../types/curriculum';
import { CURRICULUM_DATA } from '../../data/curriculumRegistry';

interface LockedGateModalProps {
  unit: UnitMetadata | null;
  onClose: () => void;
  onJumpToPrereq?: (prereqUnitId: string) => void;
}

export const LockedGateModal: React.FC<LockedGateModalProps> = ({
  unit,
  onClose,
  onJumpToPrereq
}) => {
  if (!unit) return null;

  const prereqUnit = unit.requiredUnlockUnitId
    ? CURRICULUM_DATA.unitsById[unit.requiredUnlockUnitId]
    : null;

  return (
    <div className="fl-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="fl-modal-content animate-pop-in"
        onClick={(e) => e.stopPropagation()}
        style={{ textAlign: 'center' }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 107, 74, 0.15)',
            border: '1px solid rgba(255, 107, 74, 0.3)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}
        >
          <Lock size={32} color="var(--fl-coral-flame)" />
        </div>

        <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '6px' }}>
          Unit {unit.number} is Locked 🔒
        </h3>
        <p style={{ fontSize: '15px', color: 'var(--fl-text-secondary)', marginBottom: '18px' }}>
          {unit.title}
        </p>

        <div
          style={{
            padding: '14px',
            borderRadius: 'var(--fl-radius-md)',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid var(--fl-border)',
            textAlign: 'left',
            marginBottom: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <ShieldAlert size={16} color="var(--fl-gold-star)" />
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--fl-gold-star)', textTransform: 'uppercase' }}>
              Unlock Prerequisite
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--fl-text-secondary)', lineHeight: 1.4 }}>
            {prereqUnit ? (
              <>
                You must complete <strong>Unit {prereqUnit.number}: {prereqUnit.title}</strong> before moving forward in this level.
              </>
            ) : (
              'Complete the prior units in this stage to unlock.'
            )}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className="fl-btn fl-btn-secondary"
            onClick={onClose}
            style={{ flex: 1 }}
          >
            Close
          </button>

          {prereqUnit && onJumpToPrereq && (
            <button
              type="button"
              className="fl-btn fl-btn-primary"
              onClick={() => {
                onClose();
                onJumpToPrereq(prereqUnit.id);
              }}
              style={{ flex: 1.3 }}
            >
              <span>Go to Unit {prereqUnit.number}</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
