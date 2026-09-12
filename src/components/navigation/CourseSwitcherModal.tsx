// FLUENTRA Duolingo-Style Multi-Language Course Switcher Modal
import React, { useState } from 'react';
import { X, Check, Plus, Globe, Award, Zap, BookOpen, ChevronRight } from 'lucide-react';
import { useProgression } from '../../context/ProgressionContext';
import { useUser } from '../../context/UserContext';
import { AVAILABLE_LANGUAGES, LanguageOption } from '../../data/languages';
import { soundService } from '../../services/soundService';

interface CourseSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CourseSwitcherModal: React.FC<CourseSwitcherModalProps> = ({ isOpen, onClose }) => {
  const { activeCourse, enrolledCourses, switchCourse, enrollInNewCourse } = useProgression();
  const { profile } = useUser();
  const [showAddMenu, setShowAddMenu] = useState(false);

  if (!isOpen) return null;

  // Find languages not yet enrolled
  const enrolledLangIds = enrolledCourses.map((c) => c.languageId);
  const availableToAdd = AVAILABLE_LANGUAGES.filter(
    (lang) => !enrolledLangIds.includes(lang.id) && !enrolledLangIds.includes(lang.name)
  );

  const handleSelectCourse = (langId: string) => {
    switchCourse(langId);
    soundService.playCorrect();
    onClose();
  };

  const handleAddNewCourse = (langId: string) => {
    enrollInNewCourse(langId);
    setShowAddMenu(false);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Course Switcher"
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
          maxWidth: '440px',
          maxHeight: '90vh',
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
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px 16px',
            borderBottom: '1px solid var(--fl-border)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                backgroundColor: 'var(--fl-teal-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--fl-teal-light)'
              }}
            >
              <Globe size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>
                My Language Courses
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--fl-text-secondary)', margin: 0 }}>
                Switch or enroll in multiple languages anytime
              </p>
            </div>
          </div>

          <button
            type="button"
            id="btn-close-course-modal"
            onClick={onClose}
            className="fl-btn-icon"
            style={{ width: '36px', height: '36px', borderRadius: '50%' }}
            aria-label="Close Course Switcher"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div
          style={{
            padding: '20px 24px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          {/* Active / Enrolled Courses Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 800,
                color: 'var(--fl-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em'
              }}
            >
              Enrolled Courses ({enrolledCourses.length})
            </span>

            {enrolledCourses.map((course) => {
              const isActive =
                activeCourse.languageId.toLowerCase() === course.languageId.toLowerCase();
              const completedUnits = Object.values(course.unitProgress || {}).filter(
                (u) => u.status === 'completed' || u.status === 'mastered'
              ).length;

              return (
                <div
                  key={course.languageId}
                  id={`course-item-${course.languageId.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => handleSelectCourse(course.languageId)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleSelectCourse(course.languageId);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    borderRadius: '16px',
                    border: isActive
                      ? '2px solid var(--fl-teal-light)'
                      : '1.5px solid var(--fl-border)',
                    backgroundColor: isActive
                      ? 'rgba(0, 245, 180, 0.08)'
                      : 'var(--fl-bg-card-subtle)',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span style={{ fontSize: '32px', lineHeight: 1 }}>{course.flag || '🌐'}</span>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '16px', fontWeight: 800 }}>
                          {course.languageId}
                        </span>
                        {isActive && (
                          <span
                            className="fl-badge fl-badge-teal"
                            style={{ padding: '2px 8px', fontSize: '11px', fontWeight: 800 }}
                          >
                            Active
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          marginTop: '4px',
                          fontSize: '12px',
                          color: 'var(--fl-text-secondary)'
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Award size={13} color="var(--fl-teal-light)" />
                          Level {course.activeLevel || 1}
                        </span>
                        <span>•</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <BookOpen size={13} />
                          {completedUnits} Units Done
                        </span>
                        {course.courseXp > 0 && (
                          <>
                            <span>•</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <Zap size={13} color="var(--fl-gold-star)" />
                              {course.courseXp} XP
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    {isActive ? (
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--fl-teal-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#000'
                        }}
                      >
                        <Check size={16} strokeWidth={3} />
                      </div>
                    ) : (
                      <ChevronRight size={18} color="var(--fl-text-muted)" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add a New Course Action */}
          <div style={{ marginTop: '6px' }}>
            {!showAddMenu ? (
              <button
                type="button"
                id="btn-add-course-expand"
                onClick={() => setShowAddMenu(true)}
                className="fl-btn fl-btn-secondary"
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontWeight: 700,
                  fontSize: '15px'
                }}
              >
                <Plus size={18} color="var(--fl-teal-light)" />
                <span>Add a New Language Course</span>
              </button>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  padding: '16px',
                  backgroundColor: 'var(--fl-bg-card-subtle)',
                  borderRadius: '16px',
                  border: '1px solid var(--fl-border)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--fl-text-primary)' }}>
                    Choose a Language to Learn:
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAddMenu(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '12px',
                      color: 'var(--fl-text-muted)',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                  {availableToAdd.length === 0 ? (
                    <p style={{ fontSize: '13px', color: 'var(--fl-text-muted)', textAlign: 'center', padding: '12px' }}>
                      You have enrolled in all available courses! 🎉
                    </p>
                  ) : (
                    availableToAdd.map((lang: LanguageOption) => (
                      <button
                        key={lang.id}
                        type="button"
                        id={`btn-enroll-${lang.id.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={() => handleAddNewCourse(lang.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 14px',
                          borderRadius: '12px',
                          border: '1px solid var(--fl-border)',
                          backgroundColor: 'var(--fl-bg-card)',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '24px' }}>{lang.flag}</span>
                          <div>
                            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--fl-text-primary)', display: 'block' }}>
                              {lang.name}
                            </span>
                            <span style={{ fontSize: '11px', color: 'var(--fl-text-secondary)' }}>
                              {lang.nativeName}
                            </span>
                          </div>
                        </div>
                        <div
                          className="fl-badge fl-badge-teal"
                          style={{ padding: '4px 10px', fontSize: '12px', fontWeight: 700 }}
                        >
                          + Start
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Tip */}
        <div
          style={{
            padding: '12px 24px 18px',
            borderTop: '1px solid var(--fl-border)',
            backgroundColor: 'var(--fl-bg-card-subtle)',
            textAlign: 'center'
          }}
        >
          <p style={{ fontSize: '12px', color: 'var(--fl-text-muted)', margin: 0 }}>
            💡 Your streak ({profile.streak.currentStreak} days) & total XP ({profile.stats.totalXp}) are preserved across all your languages!
          </p>
        </div>
      </div>
    </div>
  );
};
