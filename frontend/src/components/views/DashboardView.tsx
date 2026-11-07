import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Student, Teacher, Course, Announcement, AnalyticsOverview } from '../../types';
import {
  Users,
  GraduationCap,
  BookOpen,
  CalendarCheck,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  Bell,
  FileCheck2,
  BookOpenCheck,
  CalendarDays
} from 'lucide-react';

interface DashboardViewProps {
  onNavigateTab: (tab: string) => void;
  currentRole: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigateTab, currentRole }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [attendanceSummary, setAttendanceSummary] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [stus, tchs, crss, anns, ov, att] = await Promise.all([
          api.getStudents(),
          api.getTeachers(),
          api.getCourses(),
          api.getAnnouncements(),
          api.getAiAnalyticsOverview(),
          api.getAttendanceSummary()
        ]);
        setStudents(stus);
        setTeachers(tchs);
        setCourses(crss);
        setAnnouncements(anns);
        setOverview(ov);
        setAttendanceSummary(att);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-brand-500/10 to-transparent pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-brand-200 text-xs font-semibold mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-brand-300" />
            <span>Autonomous AI-Assisted Academic Term 2024-2025</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Welcome to Nexora Academy Portal
          </h1>
          <p className="text-slate-300 text-xs md:text-sm mt-2 leading-relaxed">
            School administration, student information records, predictive retention analytics, and teacher curriculum generation operating on a zero-credential privacy architecture.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              onClick={() => onNavigateTab('ai-at-risk')}
              className="px-4 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-md hover:bg-slate-100 transition-all active:scale-95 flex items-center space-x-2"
            >
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Review At-Risk Warnings</span>
            </button>
            <button
              onClick={() => onNavigateTab('ai-auto-grader')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all flex items-center space-x-2"
            >
              <FileCheck2 className="w-4 h-4 text-indigo-300" />
              <span>AI Auto-Grader Studio</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigateTab('students')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Enrolled Students
            </span>
            <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">{students.length}</span>
            <span className="text-xs text-brand-600 font-semibold flex items-center">
              100% active roster
            </span>
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('teachers')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Faculty Members
            </span>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">{teachers.length}</span>
            <span className="text-xs text-indigo-600 font-semibold">5 STEM/Hum Depts</span>
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('attendance')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Attendance Stability
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">
              {attendanceSummary?.overall_rate || 95.8}%
            </span>
            <span className="text-xs text-emerald-600 font-semibold">Above 85% goal</span>
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('ai-at-risk')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              AI At-Risk Flags
            </span>
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-rose-600">
              {overview?.risk_breakdown?.high ?? 2}
            </span>
            <span className="text-xs text-rose-600 font-semibold">Urgent attention</span>
          </div>
        </div>
      </div>

      {/* AI Features Quick Access Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span>Advanced AI Academic Capabilities</span>
          </h2>
          <span className="text-xs text-slate-400">Zero third-party tokens required</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => onNavigateTab('ai-at-risk')}
            className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-brand-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 group-hover:text-brand-600 transition-colors">
              Dropout & Failure Predictor
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Detects early warning signs from attendance anomalies and grade velocity.
            </p>
            <div className="mt-3 flex items-center text-xs font-bold text-brand-600">
              <span>Launch Predictor</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div
            onClick={() => onNavigateTab('ai-auto-grader')}
            className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-brand-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 group-hover:text-brand-600 transition-colors">
              Rubric Auto-Grader
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Synthesizes thesis coherence, empirical evidence, and mechanics for student essays.
            </p>
            <div className="mt-3 flex items-center text-xs font-bold text-brand-600">
              <span>Open Grader</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div
            onClick={() => onNavigateTab('ai-lesson-planner')}
            className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-brand-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <BookOpenCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 group-hover:text-brand-600 transition-colors">
              Curriculum Generator
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Generates standards-aligned lesson phases, differentiated instruction, and quizzes.
            </p>
            <div className="mt-3 flex items-center text-xs font-bold text-brand-600">
              <span>Create Lesson</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div
            onClick={() => onNavigateTab('ai-timetable-solver')}
            className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-brand-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <CalendarDays className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 group-hover:text-brand-600 transition-colors">
              Timetable Optimizer
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Constraint solver removes faculty collisions and ensures classroom load balance.
            </p>
            <div className="mt-3 flex items-center text-xs font-bold text-brand-600">
              <span>Optimize Matrix</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Urgent Intervention Roster + Notice Board */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* At-Risk Intervention Spotlight */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Priority Early Intervention Roster</span>
              </h3>
              <p className="text-xs text-slate-500">Students flagged by AI with elevated risk scores</p>
            </div>
            <button
              onClick={() => onNavigateTab('ai-at-risk')}
              className="text-xs font-bold text-brand-600 hover:text-brand-700"
            >
              View Full Analytics →
            </button>
          </div>

          <div className="space-y-2.5">
            {overview?.intervention_roster?.map((s) => {
              const isHigh = s.risk_level === 'High';
              return (
                <div
                  key={s.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between ${
                    isHigh
                      ? 'bg-rose-50/40 border-rose-200'
                      : 'bg-amber-50/30 border-amber-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-9 h-9 rounded-lg font-bold text-xs flex items-center justify-center ${
                        isHigh ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {s.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-slate-900">{s.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{s.student_id}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {s.grade_level} • GPA: <strong className="text-slate-800">{s.gpa}</strong> •
                        Att: <strong className="text-slate-800">{s.attendance_rate}%</strong>
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isHigh
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {s.risk_level} ({s.risk_score}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* School Announcements */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
              <Bell className="w-4 h-4 text-brand-600" />
              <span>Campus Bulletin & Notices</span>
            </h3>
            <button
              onClick={() => onNavigateTab('announcements')}
              className="text-xs font-bold text-brand-600 hover:text-brand-700"
            >
              All Notices →
            </button>
          </div>

          <div className="space-y-3">
            {announcements.slice(0, 3).map((ann) => (
              <div
                key={ann.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center space-x-2 mb-1">
                  <span
                    className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                      ann.category === 'Urgent'
                        ? 'bg-rose-100 text-rose-700'
                        : ann.category === 'Academic'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {ann.category}
                  </span>
                  <span className="text-[10px] text-slate-400">Target: {ann.target_audience}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{ann.title}</h4>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {ann.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

