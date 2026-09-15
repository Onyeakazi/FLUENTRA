// FLUENTRA Main Application Shell
import React, { useState, useEffect, useRef } from 'react';
import { UserProvider, useUser } from './context/UserContext';
import { ProgressionProvider } from './context/ProgressionContext';
import { FluentraSplash } from './components/brand/FluentraSplash';
import { TopBar } from './components/navigation/TopBar';
import { BottomNav, NavTab } from './components/navigation/BottomNav';
import { AuthOnboardingView } from './views/AuthOnboardingView';
import { AccountSetupView } from './views/AccountSetupView';
import { LearnView } from './views/LearnView';
import { PhoneticsLabView } from './views/PhoneticsLabView';
import { PracticeView } from './views/PracticeView';
import { SpeakView } from './views/SpeakView';
import { ProfileView } from './views/ProfileView';
import { ExerciseRunner } from './components/exercise/ExerciseRunner';
import { ConversationRoleplayView } from './views/ConversationRoleplayView';
import { WelcomeBackResumeModal } from './components/curriculum/WelcomeBackResumeModal';
import { getLessonsForUnit } from './data/curriculumContent';
import { aiCurriculumGenerator } from './services/aiCurriculumGenerator';
import { storageService, ResumeCheckpoint } from './services/storageService';
import { Lesson } from './types/curriculum';
import { ConversationScenario } from './types/conversation';

const FluentraApp: React.FC = () => {
  const { isAuthenticated, profile } = useUser();
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<NavTab>('learn'); // Learn (Path) is default home screen
  const [activeLessonContext, setActiveLessonContext] = useState<{ unitId: string; lesson: Lesson } | null>(null);
  const [activeScenario, setActiveScenario] = useState<ConversationScenario | null>(null);

  // 1-Tap "Start From Where You Left Off" Launch Modal State
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [pendingCheckpoint, setPendingCheckpoint] = useState<ResumeCheckpoint | null>(null);
  const hasPromptedResumeRef = useRef(false);

  // Automatically prompt learner on app open if an active checkpoint exists
  useEffect(() => {
    if (!showSplash && isAuthenticated && profile.isSetupCompleted && !hasPromptedResumeRef.current) {
      hasPromptedResumeRef.current = true;
      const cp = storageService.getResumeCheckpoint(profile.currentLanguage || 'French');
      if (cp && cp.unitId && cp.exerciseIndex > 0) {
        setPendingCheckpoint(cp);
        setIsResumeModalOpen(true);
      }
    }
  }, [showSplash, isAuthenticated, profile.isSetupCompleted, profile.currentLanguage]);

  const handleStartLesson = async (unitId: string, lessonId?: string, customLesson?: Lesson) => {
    if (customLesson) {
      setActiveLessonContext({ unitId, lesson: customLesson });
      return;
    }

    try {
      const lessons = await aiCurriculumGenerator.generateLesson({
        unitId,
        language: profile.currentLanguage,
        levelNumber: profile.currentLevelNumber || 1,
        learningGoal: profile.learningGoal
      });
      const targetLesson = lessonId
        ? lessons.find(l => l.id === lessonId) || lessons[0]
        : lessons[0];

      if (targetLesson) {
        setActiveLessonContext({ unitId, lesson: targetLesson });
        return;
      }
    } catch {
      // Fallback
      const lessons = getLessonsForUnit(unitId, profile.currentLanguage);
      const targetLesson = lessonId
        ? lessons.find(l => l.id === lessonId) || lessons[0]
        : lessons[0];

      if (targetLesson) {
        setActiveLessonContext({ unitId, lesson: targetLesson });
      }
    }
  };

  const handleStartScenario = (scenario: ConversationScenario) => {
    setActiveScenario(scenario);
  };

  return (
    <div className="app-container">
      {/* 1. Native Mobile Splash Screen */}
      {showSplash && (
        <FluentraSplash onDismiss={() => setShowSplash(false)} />
      )}

      {/* 2. Authentication (Sign In / Register) */}
      {!showSplash && !isAuthenticated && (
        <AuthOnboardingView />
      )}

      {/* 3. Dedicated Account Setup (Post-Registration Setup) */}
      {!showSplash && isAuthenticated && !profile.isSetupCompleted && (
        <AccountSetupView />
      )}

      {/* 4. Fullscreen Active Lesson Runner */}
      {isAuthenticated && profile.isSetupCompleted && activeLessonContext && (
        <ExerciseRunner
          key={`${activeLessonContext.unitId}-${activeLessonContext.lesson.id}`}
          unitId={activeLessonContext.unitId}
          lesson={activeLessonContext.lesson}
          onExit={() => setActiveLessonContext(null)}
          onStartNextUnit={(nextUnitId) => handleStartLesson(nextUnitId)}
        />
      )}

      {/* 5. Fullscreen Active AI Roleplay Conversation */}
      {isAuthenticated && profile.isSetupCompleted && !activeLessonContext && activeScenario && (
        <ConversationRoleplayView
          scenario={activeScenario}
          onExit={() => setActiveScenario(null)}
        />
      )}

      {/* 6. Main Authenticated App Views */}
      {isAuthenticated && profile.isSetupCompleted && !activeLessonContext && !activeScenario && (
        <>
          <TopBar />

          <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden', position: 'relative' }}>
            {activeTab === 'learn' && (
              <LearnView
                onStartLesson={(unitId, lessonId, customLesson) => handleStartLesson(unitId, lessonId, customLesson)}
              />
            )}

            {activeTab === 'sounds' && (
              <PhoneticsLabView />
            )}

            {activeTab === 'practice' && (
              <PracticeView />
            )}

            {activeTab === 'profile' && (
              <ProfileView />
            )}
          </main>

          <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />
        </>
      )}

      {/* 7. 1-Tap "Start From Where You Left Off" Welcome Back Modal */}
      <WelcomeBackResumeModal
        isOpen={isResumeModalOpen}
        checkpoint={pendingCheckpoint}
        userName={profile.name || 'Learner'}
        language={profile.currentLanguage || 'French'}
        onClose={() => setIsResumeModalOpen(false)}
        onResume={(unitId, lessonId) => {
          handleStartLesson(unitId, lessonId);
          setIsResumeModalOpen(false);
        }}
        onRestart={(unitId, lessonId) => {
          storageService.clearResumeCheckpoint(profile.currentLanguage || 'French');
          handleStartLesson(unitId, lessonId || `${unitId}-l1`);
          setIsResumeModalOpen(false);
        }}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <UserProvider>
      <ProgressionProvider>
        <FluentraApp />
      </ProgressionProvider>
    </UserProvider>
  );
};
export default App;
