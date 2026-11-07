import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Student } from '../../types';
import {
  Users,
  Search,
  Plus,
  Filter,
  FileText,
  Trash2,
  X,
  Printer,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Phone
} from 'lucide-react';

interface StudentsViewProps {
  initialReportStudentId?: number | null;
}

export const StudentsView: React.FC<StudentsViewProps> = ({ initialReportStudentId }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState<string>('');
  const [gradeFilter, setGradeFilter] = useState<string>('All');
  const [riskFilter, setRiskFilter] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [reportCardData, setReportCardData] = useState<any | null>(null);
  const [reportLoading, setReportLoading] = useState<boolean>(false);

  // New Student Form
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    grade_level: 'Grade 10',
    section: 'A',
    date_of_birth: '2008-04-15',
    gender: 'Non-binary',
    address: '100 Example Way, Example City',
    guardian_name: 'Guardian Example',
    guardian_phone: '+1-555-0100',
    guardian_email: 'guardian@example.com'
  });

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await api.getStudents({
        search: search || undefined,
        grade_level: gradeFilter !== 'All' ? gradeFilter : undefined,
        risk_level: riskFilter !== 'All' ? riskFilter : undefined
      });
      setStudents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [gradeFilter, riskFilter]);

  useEffect(() => {
    if (initialReportStudentId) {
      handleOpenReportCard(initialReportStudentId);
    }
  }, [initialReportStudentId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStudents();
  };

  const handleOpenReportCard = async (studentId: number) => {
    setReportLoading(true);
    try {
      const data = await api.getStudentReportCard(studentId);
      setReportCardData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setReportLoading(false);
    }
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createStudent(formData);
      setIsAddModalOpen(false);
      fetchStudents();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this student record?')) return;
    try {
      await api.deleteStudent(id);
      fetchStudents();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <Users className="w-5 h-5 text-brand-600" />
            <span>Student Information System (SIS)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage student rosters, demographics, academic standing, and AI performance diagnostics.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/20 flex items-center space-x-1.5 transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Enroll New Student</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 justify-between items-center">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or STU-ID..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs">
            <span className="text-slate-400 px-2 font-semibold">Grade:</span>
            {['All', 'Grade 10', 'Grade 11', 'Grade 12'].map((g) => (
              <button
                key={g}
                onClick={() => setGradeFilter(g)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  gradeFilter === g ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs">
            <span className="text-slate-400 px-2 font-semibold">AI Risk:</span>
            {['All', 'Low', 'Medium', 'High'].map((r) => (
              <button
                key={r}
                onClick={() => setRiskFilter(r)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  riskFilter === r ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Cohort</th>
                <th className="py-3 px-4">Cumulative GPA</th>
                <th className="py-3 px-4">Attendance</th>
                <th className="py-3 px-4">AI Risk Diagnostics</th>
                <th className="py-3 px-4">Guardian Contact</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((s) => {
                const isHigh = s.ai_risk_level === 'High';
                const isMed = s.ai_risk_level === 'Medium';
                return (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-700 font-bold text-xs flex items-center justify-center">
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

                    <td className="py-3.5 px-4">
                      <span className="text-xs font-semibold text-slate-700">
                        {s.grade_level} - {s.section}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-xs font-bold text-slate-900">{s.gpa}</span>
                      <span className="text-[10px] text-slate-400"> / 4.0</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold text-slate-800">
                          {s.attendance_rate}%
                        </span>
                        <div className="w-12 bg-slate-100 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${
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
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          isHigh
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : isMed
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {s.ai_risk_level} Risk ({s.ai_risk_score}%)
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      <p className="font-medium text-slate-800">{s.guardian_name}</p>
                      <p className="text-[10px] text-slate-400">{s.guardian_phone}</p>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => handleOpenReportCard(s.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                          title="Generate Report Card"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Card Modal */}
      {reportCardData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-slide-up max-h-[90vh] overflow-y-auto">
            {/* School Header */}
            <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">NEXORA ACADEMY</h2>
                <p className="text-xs text-slate-500">Official Student Academic Transcript & Evaluation</p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                  Term: {reportCardData.academic_term}
                </p>
              </div>
              <div className="text-right">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700 flex items-center space-x-1.5 inline-flex mb-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / PDF</span>
                </button>
                <button
                  onClick={() => setReportCardData(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 block ml-auto"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Student Info Box */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Student Name</span>
                <span className="font-bold text-slate-900">{reportCardData.student.name}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Student ID</span>
                <span className="font-mono text-slate-900">{reportCardData.student.student_id}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Grade & Section</span>
                <span className="font-bold text-slate-900">
                  {reportCardData.student.grade_level} - {reportCardData.student.section}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Guardian Contact</span>
                <span className="font-medium text-slate-700">
                  {reportCardData.student.guardian_name}
                </span>
              </div>
            </div>

            {/* Courses Table */}
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Coursework Evaluation
              </h3>
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase">
                    <th className="p-2.5">Course Subject</th>
                    <th className="p-2.5">Assessments</th>
                    <th className="p-2.5">Average Score</th>
                    <th className="p-2.5 text-right">Letter Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reportCardData.courses.map((c: any, idx: number) => (
                    <tr key={idx}>
                      <td className="p-2.5 font-bold text-slate-900">{c.course_name}</td>
                      <td className="p-2.5 text-slate-500">{c.assessments_count} tasks</td>
                      <td className="p-2.5 font-semibold text-slate-800">{c.average_score}%</td>
                      <td className="p-2.5 text-right">
                        <span className="px-2 py-0.5 rounded font-black bg-brand-50 text-brand-700">
                          {c.letter_grade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Totals */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-slate-900 text-white rounded-2xl text-center">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Cumulative GPA</span>
                <span className="text-2xl font-black text-white">{reportCardData.gpa}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Academic Average</span>
                <span className="text-2xl font-black text-white">{reportCardData.overall_average}%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Attendance Record</span>
                <span className="text-2xl font-black text-emerald-400">{reportCardData.attendance_rate}%</span>
              </div>
            </div>

            {/* AI Holistic Notes */}
            <div className="p-3.5 bg-indigo-50 border border-indigo-100 rounded-2xl text-xs">
              <span className="font-bold text-indigo-900 flex items-center space-x-1 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>AI Academic Advisor Recommendation:</span>
              </span>
              <p className="text-indigo-800 leading-relaxed">{reportCardData.ai_recommendation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-slide-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                <Users className="w-4 h-4 text-brand-600" />
                <span>Enroll New Student (Clean Example Record)</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    placeholder="e.g. Student"
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    placeholder="e.g. Test 1"
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Student Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. student.test1@example.com"
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Grade Level</label>
                  <select
                    value={formData.grade_level}
                    onChange={(e) => setFormData({ ...formData, grade_level: e.target.value })}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2"
                  >
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 11">Grade 11</option>
                    <option value="Grade 12">Grade 12</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Section</label>
                  <select
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Guardian Name</label>
                  <input
                    type="text"
                    value={formData.guardian_name}
                    onChange={(e) => setFormData({ ...formData, guardian_name: e.target.value })}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Guardian Phone</label>
                  <input
                    type="text"
                    value={formData.guardian_phone}
                    onChange={(e) => setFormData({ ...formData, guardian_phone: e.target.value })}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold"
                >
                  Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

