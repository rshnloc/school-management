import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Student, AnalyticsOverview } from '../../types';
import {
  AlertTriangle,
  Sparkles,
  TrendingDown,
  UserCheck,
  RefreshCw,
  Mail,
  Phone,
  ShieldAlert,
  GraduationCap,
  CheckCircle2,
  Filter,
  ArrowRight
} from 'lucide-react';

interface AiAtRiskViewProps {
  onSelectStudentForReport?: (studentId: number) => void;
}

export const AiAtRiskView: React.FC<AiAtRiskViewProps> = ({ onSelectStudentForReport }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [filterLevel, setFilterLevel] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);
  const [evaluating, setEvaluating] = useState<boolean>(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [stuData, ovData] = await Promise.all([
        api.getStudents(),
        api.getAiAnalyticsOverview()
      ]);
      setStudents(stuData);
      setOverview(ovData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRunBatchEvaluation = async () => {
    setEvaluating(true);
    try {
      await api.batchEvaluateRisk();
      await fetchData();
      setActionNotice('AI Early-Warning predictive evaluation completed across all enrolled students.');
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  };

  const handleTakeAction = (studentName: string, actionName: string) => {
    setActionNotice(`Initiated: "${actionName}" for ${studentName}. Automated alert logged to student file.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const filteredStudents = students.filter((s) => {
    if (filterLevel === 'All') return true;
    return s.ai_risk_level === filterLevel;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner / Title */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Nexora AI Diagnostic Engine</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Student Retention & At-Risk Early Warning System</h1>
          <p className="text-slate-300 text-xs mt-1 max-w-2xl">
            Continuously analyzes multi-dimensional academic momentum, class attendance degradation, and submission latencies to flag scholars at risk of failure or drop-out before high-stakes exams.
          </p>
        </div>

        <button
          onClick={handleRunBatchEvaluation}
          disabled={evaluating}
          className="flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-brand-500 hover:from-indigo-600 hover:to-brand-600 font-semibold text-xs tracking-wide shadow-lg shadow-indigo-500/30 transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${evaluating ? 'animate-spin' : ''}`} />
          <span>{evaluating ? 'Computing AI Projections...' : 'Re-Run AI Model on All Students'}</span>
        </button>
      </div>

      {actionNotice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium px-4 py-3 rounded-xl flex items-center space-x-2 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* KPI Stats Overview */}
      {overview && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase">High Risk Alerts</span>
              <span className="p-2 rounded-xl bg-rose-50 text-rose-600">
                <AlertTriangle className="w-5 h-5" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-rose-600">{overview.risk_breakdown.high}</span>
              <span className="text-xs text-slate-400">Students require urgent action</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase">Moderate Risk</span>
              <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <TrendingDown className="w-5 h-5" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-amber-600">{overview.risk_breakdown.medium}</span>
              <span className="text-xs text-slate-400">Under proactive monitoring</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase">Stable Scholars</span>
              <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <UserCheck className="w-5 h-5" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-emerald-600">{overview.risk_breakdown.low}</span>
              <span className="text-xs text-slate-400">Consistent mastery trajectory</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase">Schoolwide GPA Avg</span>
              <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <GraduationCap className="w-5 h-5" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-slate-900">{overview.average_gpa}</span>
              <span className="text-xs text-slate-400">out of 4.0 scale</span>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-1">
          <span className="px-3 text-xs font-semibold text-slate-400 flex items-center">
            <Filter className="w-3.5 h-3.5 mr-1" /> Risk Filter:
          </span>
          {['All', 'High', 'Medium', 'Low'].map((level) => (
            <button
              key={level}
              onClick={() => setFilterLevel(level)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterLevel === level
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {level === 'All' ? 'All Students' : `${level} Risk`}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-400 font-medium px-3">
          Showing {filteredStudents.length} of {students.length} students
        </span>
      </div>

      {/* Student Risk Cards Grid */}
      {loading ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500 font-medium">Loading AI predictive telemetry...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredStudents.map((s) => {
            const factors: string[] = (() => {
              try {
                return JSON.parse(s.ai_risk_factors || '[]');
              } catch {
                return [s.ai_risk_factors];
              }
            })();

            const isHigh = s.ai_risk_level === 'High';
            const isMedium = s.ai_risk_level === 'Medium';

            return (
              <div
                key={s.id}
                className={`bg-white rounded-2xl p-5 border transition-all shadow-sm hover:shadow-md ${
                  isHigh
                    ? 'border-rose-300 ring-1 ring-rose-200 bg-rose-50/20'
                    : isMedium
                    ? 'border-amber-300'
                    : 'border-slate-200'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm ${
                        isHigh
                          ? 'bg-rose-100 text-rose-700'
                          : isMedium
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {s.first_name[0]}
                      {s.last_name[0]}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-sm text-slate-900">
                          {s.first_name} {s.last_name}
                        </h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {s.student_id}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {s.grade_level} • Section {s.section}
                      </p>
                    </div>
                  </div>

                  {/* Risk Badge */}
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center space-x-1.5 ${
                      isHigh
                        ? 'bg-rose-100 text-rose-800 border-rose-300'
                        : isMedium
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>{s.ai_risk_level} Risk ({s.ai_risk_score}%)</span>
                  </div>
                </div>

                {/* Score & Attendance Bars */}
                <div className="mt-4 grid grid-cols-2 gap-3 bg-white p-3 rounded-xl border border-slate-200">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">Cumulative GPA</span>
                      <span className="font-bold text-slate-900">{s.gpa} / 4.0</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          s.gpa >= 3.0 ? 'bg-emerald-500' : s.gpa >= 2.3 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${Math.min(100, (s.gpa / 4.0) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">Attendance Rate</span>
                      <span className="font-bold text-slate-900">{s.attendance_rate}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          s.attendance_rate >= 90
                            ? 'bg-emerald-500'
                            : s.attendance_rate >= 80
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${s.attendance_rate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Contributing Risk Factors */}
                <div className="mt-3">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    AI Identified Risk Indicators:
                  </p>
                  <ul className="space-y-1">
                    {factors.map((f, fIdx) => (
                      <li
                        key={fIdx}
                        className="text-xs text-slate-700 flex items-start space-x-1.5"
                      >
                        <span className="text-brand-600 font-bold">•</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* AI Recommendation Box */}
                <div className="mt-3 p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl">
                  <p className="text-[11px] font-bold text-indigo-900 flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>AI Intervention Guidance:</span>
                  </p>
                  <p className="text-xs text-indigo-800 mt-1 leading-relaxed">
                    {s.ai_recommendation}
                  </p>
                </div>

                {/* Intervention Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleTakeAction(s.first_name, 'Counselor 1-on-1 Session')}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1"
                    >
                      <span>Counselor Slot</span>
                    </button>
                    <button
                      onClick={() => handleTakeAction(s.first_name, `SMS/Email to ${s.guardian_name}`)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1"
                      title={s.guardian_email}
                    >
                      <Mail className="w-3 h-3 text-slate-500" />
                      <span>Alert Guardian</span>
                    </button>
                  </div>

                  {onSelectStudentForReport && (
                    <button
                      onClick={() => onSelectStudentForReport(s.id)}
                      className="px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1"
                    >
                      <span>View Full Profile</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

