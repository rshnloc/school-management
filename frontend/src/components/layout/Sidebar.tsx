import React from 'react';
import {
  LayoutDashboard,
  AlertTriangle,
  FileCheck2,
  BookOpenCheck,
  CalendarDays,
  Users,
  GraduationCap,
  BookMarked,
  CheckSquare,
  Award,
  CreditCard,
  BellRing,
  Sparkles
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: any;
  isAi?: boolean;
  badge?: string;
  badgeColor?: string;
}

interface SidebarSection {
  label: string;
  items: SidebarItem[];
}

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  highRiskCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  highRiskCount = 2
}) => {
  const sections: SidebarSection[] = [
    {
      label: 'MAIN',
      items: [
        { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard }
      ]
    },
    {
      label: 'ADVANCED AI CORE',
      items: [
        {
          id: 'ai-at-risk',
          label: 'AI At-Risk Predictor',
          icon: AlertTriangle,
          badge: highRiskCount > 0 ? `${highRiskCount} Alert` : undefined,
          badgeColor: 'bg-rose-100 text-rose-700 border-rose-200'
        },
        {
          id: 'ai-auto-grader',
          label: 'AI Rubric Auto-Grader',
          icon: FileCheck2,
          isAi: true
        },
        {
          id: 'ai-lesson-planner',
          label: 'AI Curriculum Generator',
          icon: BookOpenCheck,
          isAi: true
        },
        {
          id: 'ai-timetable-solver',
          label: 'AI Timetable Optimizer',
          icon: CalendarDays,
          isAi: true
        }
      ]
    },
    {
      label: 'ACADEMICS & SIS',
      items: [
        { id: 'students', label: 'Student Directory', icon: Users },
        { id: 'teachers', label: 'Faculty Directory', icon: GraduationCap },
        { id: 'courses', label: 'Courses & Syllabus', icon: BookMarked },
        { id: 'attendance', label: 'Daily Attendance', icon: CheckSquare },
        { id: 'gradebook', label: 'Gradebook & Exams', icon: Award }
      ]
    },
    {
      label: 'MANAGEMENT',
      items: [
        { id: 'fees', label: 'Fees & Invoicing', icon: CreditCard },
        { id: 'announcements', label: 'Notice Board', icon: BellRing }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between h-[calc(100vh-4rem)] sticky top-16 select-none">
      <div className="py-4 px-3 overflow-y-auto space-y-6">
        {sections.map((sec, idx) => (
          <div key={idx} className="space-y-1">
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {sec.label}
            </p>
            <div className="space-y-0.5">
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/30'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.isAi ? 'text-indigo-600' : 'text-slate-500'}`} />
                      <span>{item.label}</span>
                    </div>

                    <div className="flex items-center space-x-1">
                      {item.isAi && !item.badge && !isActive && (
                        <span className="p-0.5 rounded-full bg-indigo-50 text-indigo-600">
                          <Sparkles className="w-3 h-3" />
                        </span>
                      )}
                      {item.badge && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold border ${
                            isActive
                              ? 'bg-white/20 text-white border-transparent'
                              : item.badgeColor || 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info Box */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/70">
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Zero-Credential Safe</span>
          </span>
          <span className="font-mono text-slate-400">v1.0.0</span>
        </div>
        <p className="text-[10px] text-slate-400 mt-1">Autonomous Offline AI Engines</p>
      </div>
    </aside>
  );
};
