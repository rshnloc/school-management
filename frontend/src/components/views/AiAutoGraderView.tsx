import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Student, Course, AutoGradeResult } from '../../types';
import {
  FileCheck2,
  Sparkles,
  Award,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  ArrowRight,
  Save,
  RotateCcw
} from 'lucide-react';

export const AiAutoGraderView: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<number>(1);
  const [selectedCourseId, setSelectedCourseId] = useState<number>(1);
  const [assignmentTitle, setAssignmentTitle] = useState<string>('Thermodynamic Efficiency in Energy Production');
  const [rubricGuidelines, setRubricGuidelines] = useState<string>(
    'Evaluate clarity of thesis, empirical evidence, paragraph coherence, transition markers, and technical accuracy.'
  );
  const [submissionText, setSubmissionText] = useState<string>('');
  const [result, setResult] = useState<AutoGradeResult | null>(null);
  const [evaluating, setEvaluating] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    const init = async () => {
      try {
        const [stuData, courseData] = await Promise.all([
          api.getStudents(),
          api.getCourses()
        ]);
        setStudents(stuData);
        setCourses(courseData);
        if (stuData.length > 0) setSelectedStudentId(stuData[0].id);
        if (courseData.length > 0) setSelectedCourseId(courseData[0].id);
        loadSampleEssay('excellent');
      } catch (err) {
        console.error(err);
      }
    };
    init();
  }, []);

  const loadSampleEssay = (type: 'excellent' | 'average' | 'poor') => {
    if (type === 'excellent') {
      setAssignmentTitle('Thermodynamic Efficiency in Modern Power Systems');
      setSubmissionText(
        `The global transition toward sustainable power generation requires a rigorous thermodynamic evaluation of thermal conversion efficiencies. Specifically, the Second Law of Thermodynamics dictates that no heat engine can achieve 100% Carnot efficiency because entropy generation is irreversible in non-ideal closed systems.

Furthermore, empirical research indicates that combined-cycle gas turbine (CCGT) installations achieve thermal efficiencies exceeding 60% by capturing high-temperature exhaust gas to drive a secondary Rankine steam cycle. Consequently, parasitic heat loss is substantially mitigated, reducing specific fuel consumption per kilowatt-hour produced.

However, challenges persist in managing exergy destruction across heat exchangers. To illustrate, temperature differentials between working fluids generate internal irreversible entropy increases. In conclusion, optimizing pinch-point temperatures and integrating supercritical carbon dioxide loops represents the most viable path toward minimizing thermal dissipation.`
      );
    } else if (type === 'average') {
      setAssignmentTitle('Introduction to Energy and Engines');
      setSubmissionText(
        `Heat engines are used to make electricity and power vehicles. They take heat and turn it into mechanical energy. For example, cars use combustion to push pistons.

Efficiency is very important because a lot of energy gets wasted as heat. We should try to capture this lost heat to save money and fuel. In conclusion, we need better engines for the future.`
      );
    } else {
      setAssignmentTitle('Notes on Heat');
      setSubmissionText(
        `heat is energy that moves around. if things get hot they expand. electricity is made in stations. engines get hot so you need water cooling.`
      );
    }
    setResult(null);
  };

  const handleEvaluate = async () => {
    if (!submissionText.trim()) return;
    setEvaluating(true);
    setSavedSuccess(false);
    try {
      const res = await api.autoGradeSubmission({
        student_id: selectedStudentId,
        course_id: selectedCourseId,
        assignment_title: assignmentTitle,
        submission_text: submissionText,
        rubric_guidelines: rubricGuidelines
      });
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  };

  const handleSaveToGradebook = async () => {
    if (!result) return;
    try {
      await api.addGrade({
        student_id: selectedStudentId,
        course_id: selectedCourseId,
        assessment_name: assignmentTitle,
        assessment_type: 'Assignment',
        score: result.score,
        max_score: 100,
        remarks: `AI-Graded (${result.letter_grade}): ${result.strengths[0] || 'Evaluated'}`
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>AI Automated Assessment Studio</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Rubric-Based Assignment & Essay Auto-Grader</h1>
          <p className="text-slate-300 text-xs mt-1 max-w-2xl">
            Empowers educators to evaluate written submissions instantly across 4 educational dimensions: Thesis Development, Evidence Rigor, Structural Flow, and Linguistic Mechanics.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-medium">Quick Preset:</span>
          <button
            onClick={() => loadSampleEssay('excellent')}
            className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-emerald-300 transition-colors"
          >
            Sample High (A)
          </button>
          <button
            onClick={() => loadSampleEssay('average')}
            className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-amber-300 transition-colors"
          >
            Sample Mid (B)
          </button>
          <button
            onClick={() => loadSampleEssay('poor')}
            className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-rose-300 transition-colors"
          >
            Sample Short (D)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-brand-600" />
              <span>Assignment & Submission Details</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Select Student</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(Number(e.target.value))}
                  className="w-full text-xs font-medium border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.first_name} {s.last_name} ({s.student_id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Select Course</label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(Number(e.target.value))}
                  className="w-full text-xs font-medium border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.course_code}: {c.course_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Assignment Title</label>
              <input
                type="text"
                value={assignmentTitle}
                onChange={(e) => setAssignmentTitle(e.target.value)}
                className="w-full text-xs font-medium border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Rubric Guidelines & Instructions
              </label>
              <textarea
                rows={2}
                value={rubricGuidelines}
                onChange={(e) => setRubricGuidelines(e.target.value)}
                className="w-full text-xs font-medium border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-600">Student Submission Text</label>
                <span className="text-[11px] text-slate-400">
                  {submissionText.trim().split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
              <textarea
                rows={8}
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                placeholder="Paste or type student essay submission here..."
                className="w-full text-xs font-normal border border-slate-300 rounded-xl p-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
              />
            </div>

            <button
              onClick={handleEvaluate}
              disabled={evaluating || !submissionText.trim()}
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-md shadow-brand-500/20 flex items-center justify-center space-x-2 transition-all active:scale-[0.99]"
            >
              <Sparkles className={`w-4 h-4 ${evaluating ? 'animate-spin' : ''}`} />
              <span>{evaluating ? 'Analyzing Vocabulary & Rubric Criteria...' : 'Run AI Rubric Evaluation'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: AI Results & Feedback */}
        <div className="lg:col-span-6 space-y-4">
          {result ? (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 animate-fade-in">
              {/* Score Header */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-brand-50 to-indigo-50 border border-brand-100 rounded-2xl">
                <div>
                  <span className="text-xs font-semibold text-brand-700 uppercase tracking-wider">
                    AI Rubric Result
                  </span>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <span className="text-3xl font-black text-slate-900">{result.score}</span>
                    <span className="text-sm font-semibold text-slate-500">/ 100</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    For {result.student_name} • {result.course_name}
                  </p>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-brand-500/30">
                    {result.letter_grade}
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 mt-1 uppercase">Grade</span>
                </div>
              </div>

              {/* Text Metrics */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block uppercase">Words</span>
                  <span className="font-bold text-xs text-slate-800">{result.metrics.word_count}</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block uppercase">Sentences</span>
                  <span className="font-bold text-xs text-slate-800">{result.metrics.sentence_count}</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block uppercase">Paragraphs</span>
                  <span className="font-bold text-xs text-slate-800">{result.metrics.paragraph_count}</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block uppercase">Lexical TTR</span>
                  <span className="font-bold text-xs text-slate-800">{result.metrics.lexical_diversity}</span>
                </div>
              </div>

              {/* Rubric Breakdown (4 Pillars) */}
              <div>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Rubric Dimension Breakdown:
                </h3>
                <div className="space-y-2">
                  {Object.entries(result.rubric_breakdown).map(([dimKey, dimVal]) => {
                    const label = dimKey.replace(/_/g, ' ').toUpperCase();
                    const pct = (dimVal.score / dimVal.max) * 100;
                    return (
                      <div key={dimKey} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="font-semibold text-slate-700">{label}</span>
                          <span className="font-bold text-slate-900">
                            {dimVal.score} / {dimVal.max}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 mb-1.5">
                          <div
                            className="bg-brand-600 h-1.5 rounded-full"
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-tight">{dimVal.feedback}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Strengths & Targeted Revisions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl">
                  <span className="text-xs font-bold text-emerald-800 flex items-center space-x-1 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Identified Strengths:</span>
                  </span>
                  <ul className="space-y-1">
                    {result.strengths.map((str, i) => (
                      <li key={i} className="text-[11px] text-emerald-900">
                        • {str}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-xl">
                  <span className="text-xs font-bold text-amber-800 flex items-center space-x-1 mb-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Targeted Revisions:</span>
                  </span>
                  <ul className="space-y-1">
                    {result.improvements.map((imp, i) => (
                      <li key={i} className="text-[11px] text-amber-900">
                        • {imp}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Save To Official Gradebook */}
              <div className="pt-2 flex items-center justify-between">
                {savedSuccess ? (
                  <span className="text-xs text-emerald-600 font-semibold flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Recorded to official Gradebook!</span>
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">Teacher review stage</span>
                )}

                <button
                  onClick={handleSaveToGradebook}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-sm transition-all active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Grade & Feedback</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center h-full min-h-[360px]">
              <FileCheck2 className="w-12 h-12 text-slate-300 mb-3" />
              <h3 className="font-bold text-slate-700 text-sm">No Rubric Evaluation Generated Yet</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Paste student work or pick one of the sample presets on top, then click "Run AI Rubric Evaluation" to generate diagnostic scoring.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

