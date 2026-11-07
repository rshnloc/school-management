import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Grade, Student, Course } from '../../types';
import { Award, Plus, Filter, X, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';

export const GradebookView: React.FC = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);

  // Form State
  const [form, setForm] = useState({
    student_id: 1,
    course_id: 1,
    assessment_name: 'Unit 3 Comprehensive Assessment',
    assessment_type: 'Exam',
    max_score: 100,
    score: 88,
    remarks: 'Consistent execution on theoretical concepts.'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [gData, sData, cData] = await Promise.all([
        api.getGrades({
          course_id: selectedCourseId !== 'All' ? Number(selectedCourseId) : undefined
        }),
        api.getStudents(),
        api.getCourses()
      ]);
      setGrades(gData);
      setStudents(sData);
      setCourses(cData);
      if (sData.length > 0) setForm((prev) => ({ ...prev, student_id: sData[0].id }));
      if (cData.length > 0) setForm((prev) => ({ ...prev, course_id: cData[0].id }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCourseId]);

  const handleAddGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.addGrade(form);
      setIsAddOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const avgScore = grades.length
    ? Math.round(grades.reduce((acc, g) => acc + g.score, 0) / grades.length)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <span>Academic Gradebook & Examination Ledger</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Record formative scores, track weighted assessments, and recalculate GPA standings.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center space-x-1.5 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Record Assessment Score</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Entries</span>
            <span className="text-2xl font-black text-slate-900 block mt-0.5">{grades.length}</span>
          </div>
          <span className="p-2.5 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs">Ledger</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Class Average</span>
            <span className="text-2xl font-black text-brand-600 block mt-0.5">{avgScore}%</span>
          </div>
          <span className="p-2.5 rounded-xl bg-brand-50 text-brand-700 font-bold text-xs">Mean</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">AI Integration</span>
            <span className="text-xs font-bold text-emerald-600 block mt-1 flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1" /> Auto-updates GPA & Risk
            </span>
          </div>
          <span className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs">Active</span>
        </div>
      </div>

      {/* Course Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-2 overflow-x-auto">
        <span className="text-xs font-semibold text-slate-400 flex items-center px-1">
          <Filter className="w-3.5 h-3.5 mr-1" /> Course:
        </span>
        <button
          onClick={() => setSelectedCourseId('All')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            selectedCourseId === 'All' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Courses
        </button>
        {courses.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCourseId(c.id.toString())}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCourseId === c.id.toString()
                ? 'bg-brand-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {c.course_code}
          </button>
        ))}
      </div>

      {/* Grades Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Assessment</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {grades.map((g) => {
                const pct = (g.score / g.max_score) * 100;
                const isPass = pct >= 60;
                return (
                  <tr key={g.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-bold text-xs text-slate-900">{g.student_name}</td>
                    <td className="py-3 px-4 text-xs font-medium text-slate-700">{g.course_name}</td>
                    <td className="py-3 px-4 text-xs font-semibold text-slate-800">{g.assessment_name}</td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {g.assessment_type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-xs font-black px-2 py-0.5 rounded ${
                          pct >= 85
                            ? 'bg-emerald-50 text-emerald-700'
                            : pct >= 70
                            ? 'bg-blue-50 text-blue-700'
                            : pct >= 60
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {g.score} / {g.max_score}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-500 font-mono">{g.date}</td>
                    <td className="py-3 px-4 text-xs text-slate-500 max-w-xs truncate">{g.remarks}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Score Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-slide-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                <Award className="w-4 h-4 text-indigo-600" />
                <span>Record Assessment Score</span>
              </h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddGrade} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Student</label>
                <select
                  value={form.student_id}
                  onChange={(e) => setForm({ ...form, student_id: Number(e.target.value) })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.first_name} {s.last_name} ({s.student_id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Course</label>
                <select
                  value={form.course_id}
                  onChange={(e) => setForm({ ...form, course_id: Number(e.target.value) })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.course_code}: {c.course_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Assessment Name</label>
                <input
                  type="text"
                  required
                  value={form.assessment_name}
                  onChange={(e) => setForm({ ...form, assessment_name: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Type</label>
                  <select
                    value={form.assessment_type}
                    onChange={(e) => setForm({ ...form, assessment_type: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-2 py-2"
                  >
                    <option value="Exam">Exam</option>
                    <option value="Quiz">Quiz</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Project">Project</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Score</label>
                  <input
                    type="number"
                    step="0.5"
                    value={form.score}
                    onChange={(e) => setForm({ ...form, score: Number(e.target.value) })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Max Score</label>
                  <input
                    type="number"
                    value={form.max_score}
                    onChange={(e) => setForm({ ...form, max_score: Number(e.target.value) })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Remarks</label>
                <input
                  type="text"
                  value={form.remarks}
                  onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold"
                >
                  Save Score
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

