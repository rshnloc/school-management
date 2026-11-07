import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Course, Teacher } from '../../types';
import { BookMarked, User, Building, Plus, X, Award, FileText } from 'lucide-react';

export const CoursesView: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [form, setForm] = useState({
    course_code: '',
    course_name: '',
    department: 'Sciences',
    grade_level: 'Grade 11',
    credits: 3,
    teacher_id: 1,
    room: 'Hall 101',
    syllabus: 'Standard course syllabus and analytical benchmarks.'
  });

  const fetchData = async () => {
    try {
      const [cData, tData] = await Promise.all([api.getCourses(), api.getTeachers()]);
      setCourses(cData);
      setTeachers(tData);
      if (tData.length > 0) setForm((prev) => ({ ...prev, teacher_id: tData[0].id }));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createCourse(form);
      setIsAddOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <BookMarked className="w-5 h-5 text-brand-600" />
            <span>Courses & Academic Curriculum</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Active credit courses, syllabi, classroom venues, and assigned instructors.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/20 flex items-center space-x-1.5 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Course</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-50 text-brand-700 font-bold border border-brand-200">
                  {c.course_code}
                </span>
                <h3 className="font-bold text-sm text-slate-900 mt-1">{c.course_name}</h3>
                <p className="text-xs text-slate-500">{c.department}</p>
              </div>

              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {c.credits} Credits
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-slate-400" />
                <span className="font-semibold text-slate-800">
                  Instructor: {c.teacher_name || 'Unassigned'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Building className="w-4 h-4 text-slate-400" />
                <span>
                  Room: {c.room} • {c.grade_level}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] text-slate-600 line-clamp-2">
              <strong className="text-slate-800 block mb-0.5">Syllabus Overview:</strong>
              {c.syllabus}
            </div>
          </div>
        ))}
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-slide-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                <BookMarked className="w-4 h-4 text-brand-600" />
                <span>Create New Course</span>
              </h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Course Code</label>
                  <input
                    type="text"
                    required
                    value={form.course_code}
                    onChange={(e) => setForm({ ...form, course_code: e.target.value })}
                    placeholder="e.g. CHEM-202"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Credits</label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={form.credits}
                    onChange={(e) => setForm({ ...form, credits: Number(e.target.value) })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Course Name</label>
                <input
                  type="text"
                  required
                  value={form.course_name}
                  onChange={(e) => setForm({ ...form, course_name: e.target.value })}
                  placeholder="e.g. Organic Chemistry & Biochemistry"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Department</label>
                  <select
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2"
                  >
                    <option value="Sciences">Sciences</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Humanities">Humanities</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Social Sciences">Social Sciences</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Faculty Instructor</label>
                  <select
                    value={form.teacher_id}
                    onChange={(e) => setForm({ ...form, teacher_id: Number(e.target.value) })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2"
                  >
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.first_name} {t.last_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Syllabus Overview</label>
                <textarea
                  rows={2}
                  value={form.syllabus}
                  onChange={(e) => setForm({ ...form, syllabus: e.target.value })}
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
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold"
                >
                  Create Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

