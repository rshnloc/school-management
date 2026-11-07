import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Student, AttendanceRecord } from '../../types';
import {
  CheckSquare,
  Calendar,
  Save,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Users
} from 'lucide-react';

export const AttendanceView: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [records, setRecords] = useState<Record<number, { status: string; remarks: string }>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [summary, setSummary] = useState<any>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [stuData, attData, sumData] = await Promise.all([
        api.getStudents(),
        api.getAttendance({ date: selectedDate }),
        api.getAttendanceSummary()
      ]);
      setStudents(stuData);
      setSummary(sumData);

      // Prepopulate record state
      const initialMap: Record<number, { status: string; remarks: string }> = {};
      stuData.forEach((s) => {
        const found = attData.find((a) => a.student_id === s.id);
        initialMap[s.id] = {
          status: found ? found.status : 'Present',
          remarks: found?.remarks || ''
        };
      });
      setRecords(initialMap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const setStudentStatus = (studentId: number, status: string) => {
    setRecords((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status
      }
    }));
  };

  const markAllPresent = () => {
    const updated: Record<number, { status: string; remarks: string }> = {};
    students.forEach((s) => {
      updated[s.id] = { status: 'Present', remarks: 'Standard roll call' };
    });
    setRecords(updated);
  };

  const handleSaveAttendance = async () => {
    setSaving(true);
    try {
      const payload = Object.entries(records).map(([sId, data]) => ({
        student_id: Number(sId),
        date: selectedDate,
        status: data.status,
        remarks: data.remarks
      }));

      await api.recordAttendanceBatch(payload);
      const sum = await api.getAttendanceSummary();
      setSummary(sum);
      setMessage('Attendance batch committed! AI student risk indices recalculated.');
      setTimeout(() => setMessage(null), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <CheckSquare className="w-5 h-5 text-emerald-600" />
            <span>Daily Attendance Tracker & Roll Call</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Record classroom attendance; automatically synchronizes with AI Early-Warning models.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={markAllPresent}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            Mark All Present
          </button>
          <button
            onClick={handleSaveAttendance}
            disabled={saving}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center space-x-1.5 transition-all active:scale-95 disabled:opacity-50"
          >
            <Save className={`w-4 h-4 ${saving ? 'animate-spin' : ''}`} />
            <span>{saving ? 'Syncing...' : 'Save Attendance'}</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium px-4 py-3 rounded-xl flex items-center space-x-2 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Date Picker & KPI Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-slate-100 rounded-xl text-slate-600">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block">Roll Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs font-bold text-slate-900 border border-slate-200 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        {summary && (
          <div className="flex items-center space-x-4 text-xs font-medium">
            <span className="text-slate-500">
              Total Records: <strong className="text-slate-900">{summary.total_records}</strong>
            </span>
            <span className="text-emerald-600">
              Present: <strong>{summary.present_count}</strong>
            </span>
            <span className="text-amber-600">
              Late: <strong>{summary.late_count}</strong>
            </span>
            <span className="text-rose-600">
              Absent: <strong>{summary.absent_count}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
              {summary.overall_rate}% Overall Stability
            </span>
          </div>
        )}
      </div>

      {/* Roll Call Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4 text-center">Status Toggle</th>
                <th className="py-3 px-4">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((s) => {
                const currentStatus = records[s.id]?.status || 'Present';
                return (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 font-bold text-xs flex items-center justify-center text-slate-700">
                          {s.first_name[0]}
                          {s.last_name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-xs text-slate-900">
                            {s.first_name} {s.last_name}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono">{s.student_id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-xs font-semibold text-slate-700">
                      {s.grade_level} - {s.section}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center space-x-1.5">
                        {[
                          { label: 'Present', color: 'bg-emerald-600 text-white shadow-xs' },
                          { label: 'Late', color: 'bg-amber-500 text-white shadow-xs' },
                          { label: 'Absent', color: 'bg-rose-600 text-white shadow-xs' },
                          { label: 'Excused', color: 'bg-indigo-600 text-white shadow-xs' }
                        ].map((btn) => {
                          const isSelected = currentStatus === btn.label;
                          return (
                            <button
                              key={btn.label}
                              onClick={() => setStudentStatus(s.id, btn.label)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                isSelected
                                  ? btn.color
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                              }`}
                            >
                              {btn.label}
                            </button>
                          );
                        })}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <input
                        type="text"
                        value={records[s.id]?.remarks || ''}
                        onChange={(e) =>
                          setRecords((prev) => ({
                            ...prev,
                            [s.id]: { ...prev[s.id], remarks: e.target.value }
                          }))
                        }
                        placeholder="Optional remarks (e.g. sick note)..."
                        className="w-full text-xs bg-transparent border-b border-slate-200 focus:border-brand-500 focus:outline-none py-1"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

