import React, { useState } from 'react';
import { api } from '../../services/api';
import { LessonPlanResult } from '../../types';
import {
  BookOpenCheck,
  Sparkles,
  Clock,
  CheckCircle2,
  ListOrdered,
  HelpCircle,
  Copy,
  Check,
  Layers,
  ArrowRight,
  BookOpen
} from 'lucide-react';

export const AiLessonPlannerView: React.FC = () => {
  const [subject, setSubject] = useState<string>('Computer Science');
  const [topic, setTopic] = useState<string>("Recursive Algorithms and Binary Trees");
  const [gradeLevel, setGradeLevel] = useState<string>('Grade 11');
  const [duration, setDuration] = useState<number>(50);
  const [objectives, setObjectives] = useState<string>(
    'Understand base case versus recursive step\nAnalyze tree traversal time complexity O(n)\nImplement in-order and pre-order traversals'
  );
  const [includeQuiz, setIncludeQuiz] = useState<boolean>(true);
  const [generating, setGenerating] = useState<boolean>(false);
  const [plan, setPlan] = useState<LessonPlanResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setGenerating(true);
    setPlan(null);
    setQuizAnswers({});
    setQuizSubmitted(false);
    try {
      const res = await api.generateLessonPlan({
        subject,
        topic,
        grade_level: gradeLevel,
        duration_minutes: duration,
        objectives,
        include_quiz: includeQuiz
      });
      setPlan(res);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyMarkdown = () => {
    if (!plan) return;
    const text = `# ${plan.title}\n\n**Subject:** ${plan.subject} | **Grade:** ${plan.grade_level} | **Duration:** ${plan.duration}\n\n## Essential Question\n${plan.essential_question}\n\n## Learning Objectives\n${plan.learning_objectives.map(o => `- ${o}`).join('\n')}\n\n## Lesson Timeline\n${plan.timeline.map(t => `### ${t.phase} (${t.duration})\n${t.activity}`).join('\n\n')}\n\n## Differentiated Instruction\n- **Support:** ${plan.differentiation.scaffolding_for_support}\n- **Extension:** ${plan.differentiation.extension_for_advanced}\n\n## Homework\n${plan.homework_assignment}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>AI Curriculum & Pedagogy Engine</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">AI Lesson Planner & Formative Assessment Generator</h1>
          <p className="text-slate-300 text-xs mt-1 max-w-2xl">
            Generates standards-aligned instructional timelines, differentiated scaffolding for diverse learning tiers, and interactive comprehension quizzes in seconds.
          </p>
        </div>

        {plan && (
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Markdown' : 'Export / Copy Plan'}</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-brand-600" />
              <span>Lesson Parameters</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full text-xs font-medium border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Computer Science">Computer Science & AI</option>
                <option value="Physics">AP Physics & Mechanics</option>
                <option value="Mathematics">Calculus & Geometry</option>
                <option value="World Literature">World Literature & Rhetoric</option>
                <option value="Economics">Macroeconomics & Trade</option>
                <option value="Chemistry">Chemistry & Thermodynamics</option>
                <option value="Biology">Genetics & Cellular Biology</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Lesson Topic</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Newton's Universal Gravity"
                className="w-full text-xs font-medium border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Grade Level</label>
                <select
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  className="w-full text-xs font-medium border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="Grade 9">Grade 9 (Freshman)</option>
                  <option value="Grade 10">Grade 10 (Sophomore)</option>
                  <option value="Grade 11">Grade 11 (Junior)</option>
                  <option value="Grade 12">Grade 12 (Senior)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Duration (Min)</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full text-xs font-medium border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value={45}>45 Minutes</option>
                  <option value={50}>50 Minutes</option>
                  <option value={60}>60 Minutes</option>
                  <option value={90}>90 Min (Block)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Target Learning Objectives (One per line)
              </label>
              <textarea
                rows={3}
                value={objectives}
                onChange={(e) => setObjectives(e.target.value)}
                placeholder="Enter key goals..."
                className="w-full text-xs font-normal border border-slate-300 rounded-xl p-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="includeQuiz"
                checked={includeQuiz}
                onChange={(e) => setIncludeQuiz(e.target.checked)}
                className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
              />
              <label htmlFor="includeQuiz" className="text-xs font-medium text-slate-700">
                Generate 5-Question Formative Assessment Quiz
              </label>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating || !topic.trim()}
              className="w-full py-3 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-brand-500/20 flex items-center justify-center space-x-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
              <span>{generating ? 'Synthesizing Pedagogy & Activities...' : 'Generate AI Lesson Plan'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Output */}
        <div className="lg:col-span-8 space-y-4">
          {plan ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 animate-fade-in">
              {/* Header */}
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 rounded-md bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200">
                    {plan.subject}
                  </span>
                  <span className="text-xs text-slate-500">{plan.grade_level}</span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-xs text-slate-500 flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1" /> {plan.duration}
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 mt-2">{plan.title}</h2>
                <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Essential Inquiry Question:
                  </span>
                  <p className="text-xs font-medium text-slate-800 mt-0.5 italic">
                    "{plan.essential_question}"
                  </p>
                </div>
              </div>

              {/* Objectives */}
              <div>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Measurable Student Outcomes (Bloom's Aligned):
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {plan.learning_objectives.map((obj, i) => (
                    <div key={i} className="p-3 bg-brand-50/50 border border-brand-100 rounded-xl text-xs text-brand-900 flex items-start space-x-2">
                      <span className="font-bold text-brand-600">{i + 1}.</span>
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Phased Timeline */}
              <div>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                  <ListOrdered className="w-4 h-4 text-brand-600" />
                  <span>Instructional Phasing & Time Allocation:</span>
                </h3>
                <div className="space-y-2.5">
                  {plan.timeline.map((item, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl hover:border-slate-300 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-slate-900">{item.phase}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                          {item.duration}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{item.activity}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Differentiation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-xl">
                  <span className="text-xs font-bold text-amber-900 block mb-1">
                    Scaffolding for Targeted Support:
                  </span>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    {plan.differentiation.scaffolding_for_support}
                  </p>
                </div>
                <div className="p-3.5 bg-indigo-50/60 border border-indigo-200 rounded-xl">
                  <span className="text-xs font-bold text-indigo-900 block mb-1">
                    Extension for Advanced Scholars:
                  </span>
                  <p className="text-xs text-indigo-800 leading-relaxed">
                    {plan.differentiation.extension_for_advanced}
                  </p>
                </div>
              </div>

              {/* Formative Quiz */}
              {plan.quiz && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                        <HelpCircle className="w-4 h-4 text-indigo-600" />
                        <span>Interactive Formative Assessment (5 Questions)</span>
                      </h3>
                      <p className="text-xs text-slate-500">Test student comprehension in real time.</p>
                    </div>

                    <button
                      onClick={() => setQuizSubmitted(true)}
                      disabled={quizSubmitted}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all active:scale-95 disabled:opacity-50"
                    >
                      {quizSubmitted ? 'Quiz Evaluated' : 'Check Answers'}
                    </button>
                  </div>

                  <div className="space-y-4">
                    {plan.quiz.map((q, qIdx) => (
                      <div key={qIdx} className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                        <p className="text-xs font-bold text-slate-800">
                          {qIdx + 1}. {q.question}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options.map((opt, optIdx) => {
                            const isSelected = quizAnswers[qIdx] === optIdx;
                            const isCorrect = q.correct_option_index === optIdx;
                            let btnStyle = 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200';

                            if (quizSubmitted) {
                              if (isCorrect) {
                                btnStyle = 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold';
                              } else if (isSelected && !isCorrect) {
                                btnStyle = 'bg-rose-50 text-rose-800 border-rose-300 line-through';
                              }
                            } else if (isSelected) {
                              btnStyle = 'bg-brand-50 text-brand-700 border-brand-300 font-semibold ring-1 ring-brand-300';
                            }

                            return (
                              <button
                                key={optIdx}
                                disabled={quizSubmitted}
                                onClick={() =>
                                  setQuizAnswers({ ...quizAnswers, [qIdx]: optIdx })
                                }
                                className={`p-2 rounded-lg text-left text-xs border transition-all ${btnStyle}`}
                              >
                                <span className="font-bold mr-1.5">
                                  {String.fromCharCode(65 + optIdx)}.
                                </span>
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {quizSubmitted && (
                          <div className="text-[11px] p-2 bg-slate-50 text-slate-600 rounded-lg border border-slate-200">
                            <span className="font-bold text-indigo-700">Rationale: </span>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-16 text-center flex flex-col items-center justify-center h-full min-h-[380px]">
              <BookOpenCheck className="w-12 h-12 text-slate-300 mb-3" />
              <h3 className="font-bold text-slate-700 text-sm">No Curriculum Outline Generated Yet</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Configure your subject, topic, and duration on the left panel, then trigger the AI engine to draft a complete pedagogical outline.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

