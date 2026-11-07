import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { TimetableSlot } from '../../types';
import {
  CalendarDays,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Building,
  User,
  Clock,
  Zap
} from 'lucide-react';

export const AiTimetableOptimizerView: React.FC = () => {
  const [slots, setSlots] = useState<TimetableSlot[]>([]);
  const [conflictsData, setConflictsData] = useState<{
    has_conflicts: boolean;
    conflicts_count: number;
    conflicts: any[];
  } | null>(null);
  const [selectedSection, setSelectedSection] = useState<string>('Grade 11-A');
  const [optimizing, setOptimizing] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = [
    { num: 1, time: '08:30 - 09:20' },
    { num: 2, time: '09:25 - 10:15' },
    { num: 3, time: '10:30 - 11:20' },
    { num: 4, time: '11:25 - 12:15' },
    { num: 5, time: '13:00 - 13:50' },
    { num: 6, time: '13:55 - 14:45' }
  ];

  const fetchTimetable = async () => {
    try {
      const [allSlots, cData] = await Promise.all([
        api.getTimetable(),
        api.checkTimetableConflicts()
      ]);
      setSlots(allSlots);
      setConflictsData(cData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, []);

  const handleRunOptimizer = async () => {
    setOptimizing(true);
    try {
      const res = await api.autoOptimizeTimetable();
      await fetchTimetable();
      setMessage(res.message);
      setTimeout(() => setMessage(null), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setOptimizing(false);
    }
  };

  // Filter slots for the current selected section
  const sectionSlots = slots.filter((s) => s.grade_section === selectedSection);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>AI Constraint Satisfaction Engine</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Smart Timetable & Classroom Allocation Optimizer</h1>
          <p className="text-slate-300 text-xs mt-1 max-w-2xl">
            Solves multi-variable educational scheduling constraints: eliminates faculty double-bookings, resolves room capacity bottlenecks, and optimizes daily cognitive pacing for scholars.
          </p>
        </div>

        <button
          onClick={handleRunOptimizer}
          disabled={optimizing}
          className="flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-brand-500 hover:from-indigo-600 hover:to-brand-600 font-semibold text-xs tracking-wide shadow-lg shadow-indigo-500/30 transition-all active:scale-95 disabled:opacity-50"
        >
          <Zap className={`w-4 h-4 ${optimizing ? 'animate-bounce' : ''}`} />
          <span>{optimizing ? 'Solving Constraints...' : 'Run 1-Click AI Schedule Optimizer'}</span>
        </button>
      </div>

      {message && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium px-4 py-3 rounded-xl flex items-center space-x-2 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Conflict Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              conflictsData?.has_conflicts
                ? 'bg-rose-100 text-rose-700'
                : 'bg-emerald-100 text-emerald-700'
            }`}
          >
            {conflictsData?.has_conflicts ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <CheckCircle2 className="w-5 h-5" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-xs text-slate-900">
              {conflictsData?.has_conflicts
                ? `${conflictsData.conflicts_count} Schedule Collision(s) Detected`
                : 'Zero Conflicts Detected (Schedule Verified)'}
            </h3>
            <p className="text-xs text-slate-500">
              {conflictsData?.has_conflicts
                ? 'Teachers or rooms are double-allocated during overlapping hours.'
                : 'All instructor assignments, lecture rooms, and cohorts are perfectly synchronized.'}
            </p>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
          {['Grade 10-A', 'Grade 11-A', 'Grade 12-A'].map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSection(sec)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedSection === sec
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* Timetable Grid Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-3 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider w-28">
                  Period / Time
                </th>
                {days.map((day) => (
                  <th
                    key={day}
                    className="py-3 px-4 text-xs font-bold text-slate-700 uppercase tracking-wider text-center"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {periods.map((p) => (
                <tr key={p.num} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 bg-slate-50/60 border-r border-slate-200">
                    <span className="font-bold text-xs text-slate-800 block">Period {p.num}</span>
                    <span className="text-[10px] text-slate-400 flex items-center mt-0.5">
                      <Clock className="w-3 h-3 mr-1" /> {p.time}
                    </span>
                  </td>

                  {days.map((day) => {
                    const slot = sectionSlots.find(
                      (s) => s.day_of_week === day && s.period === p.num
                    );

                    return (
                      <td key={day} className="p-2 border-r border-slate-100 min-w-[160px]">
                        {slot ? (
                          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-50/60 to-brand-50/40 border border-brand-100 hover:border-brand-300 transition-all shadow-xs">
                            <span className="font-bold text-xs text-brand-900 block leading-tight">
                              {slot.course_name}
                            </span>
                            <div className="mt-2 space-y-0.5">
                              <span className="text-[11px] text-slate-600 flex items-center">
                                <User className="w-3 h-3 mr-1 text-slate-400" />
                                {slot.teacher_name}
                              </span>
                              <span className="text-[10px] text-slate-500 flex items-center">
                                <Building className="w-3 h-3 mr-1 text-slate-400" />
                                {slot.room_name}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 rounded-xl border border-dashed border-slate-200 text-center text-slate-300 text-[11px] font-medium">
                            Study Period / Open
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

