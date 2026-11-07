import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/views/DashboardView';
import { AiAtRiskView } from './components/views/AiAtRiskView';
import { AiAutoGraderView } from './components/views/AiAutoGraderView';
import { AiLessonPlannerView } from './components/views/AiLessonPlannerView';
import { AiTimetableOptimizerView } from './components/views/AiTimetableOptimizerView';
import { StudentsView } from './components/views/StudentsView';
import { TeachersView } from './components/views/TeachersView';
import { CoursesView } from './components/views/CoursesView';
import { AttendanceView } from './components/views/AttendanceView';
import { GradebookView } from './components/views/GradebookView';
import { FeesView } from './components/views/FeesView';
import { AnnouncementsView } from './components/views/AnnouncementsView';
import { EduBotModal } from './components/modals/EduBotModal';
import { Bot, Sparkles } from 'lucide-react';
import { api } from './services/api';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [currentRole, setCurrentRole] = useState<string>('admin');
  const [isEduBotOpen, setIsEduBotOpen] = useState<boolean>(false);
  const [selectedReportStudentId, setSelectedReportStudentId] = useState<number | null>(null);
  const [highRiskCount, setHighRiskCount] = useState<number>(2);

  useEffect(() => {
    // Check initial risk metrics
    api.getAiAnalyticsOverview().then((res) => {
      if (res?.risk_breakdown?.high !== undefined) {
        setHighRiskCount(res.risk_breakdown.high);
      }
    }).catch(() => {});
  }, [currentTab]);

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardView onNavigateTab={setCurrentTab} currentRole={currentRole} />;
      case 'ai-at-risk':
        return (
          <AiAtRiskView
            onSelectStudentForReport={(id) => {
              setSelectedReportStudentId(id);
              setCurrentTab('students');
            }}
          />
        );
      case 'ai-auto-grader':
        return <AiAutoGraderView />;
      case 'ai-lesson-planner':
        return <AiLessonPlannerView />;
      case 'ai-timetable-solver':
        return <AiTimetableOptimizerView />;
      case 'students':
        return <StudentsView initialReportStudentId={selectedReportStudentId} />;
      case 'teachers':
        return <TeachersView />;
      case 'courses':
        return <CoursesView />;
      case 'attendance':
        return <AttendanceView />;
      case 'gradebook':
        return <GradebookView />;
      case 'fees':
        return <FeesView />;
      case 'announcements':
        return <AnnouncementsView />;
      default:
        return <DashboardView onNavigateTab={setCurrentTab} currentRole={currentRole} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        onOpenEduBot={() => setIsEduBotOpen(true)}
        activeAiAlertsCount={highRiskCount}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => {
            if (tab !== 'students') setSelectedReportStudentId(null);
            setCurrentTab(tab);
          }}
          highRiskCount={highRiskCount}
        />

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">{renderContent()}</div>
        </main>
      </div>

      {/* Floating EduBot Trigger Button (Bottom Right) */}
      {!isEduBotOpen && (
        <button
          onClick={() => setIsEduBotOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center space-x-2.5 px-4 py-3 bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-700 text-white rounded-2xl shadow-xl shadow-brand-500/30 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all group"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-brand-600 rounded-full animate-pulse"></span>
          </div>
          <span className="text-xs font-bold tracking-wide">Ask EduBot AI</span>
          <span className="p-1 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
            <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
          </span>
        </button>
      )}

      {/* EduBot AI Assistant Modal */}
      <EduBotModal
        isOpen={isEduBotOpen}
        onClose={() => setIsEduBotOpen(false)}
        currentRole={currentRole}
        onNavigateTab={(tab) => {
          setCurrentTab(tab);
          setIsEduBotOpen(false);
        }}
      />
    </div>
  );
}

export default App;

