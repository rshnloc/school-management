import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Student, BehaviorAnalysisResult } from '../../types';
import {
  HeartHandshake,
  Sparkles,
  AlertTriangle,
  Smile,
  Frown,
  MessageSquare,
  ShieldAlert,
  UserCheck,
  CheckCircle2
} from 'lucide-react';

export const AiBehaviorAnalyzerView: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<number>(2);
  const [contextType, setContextType] = useState<string>('Teacher Observation');
  const [notesText, setNotesText] = useState<string>('');
  const [result, setResult] = useState<BehaviorAnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState<boolean>(false);

  useEffect(() => {
    api.getStudents().then((data) => {
      setStudents(data);
      if (data.length > 1) setSelectedStudentId(data[1].id);
      loadSampleNote('burnout');
    }).catch(console.error);
  }, []);

  const loadSampleNote = (type: 'burnout' | 'anxiety' | 'positive') => {
    if (type === 'burnout') {
      setContextType('Teacher Observation');
      setNotesText(
        'Student appeared exhausted and overwhelmed during Period 3. Had head down on desk, skipped the collaborative lab group activity, and mentioned having a severe headache and staying up past 2 AM studying for quizzes.'
      );
    } else if (type === 'anxiety') {
      setContextType('Counselor Note');
      setNotesText(
        'Student expressed feeling intense panic and dread prior to chapter exams. Mentioned hands shaking and mind going completely blank during timed assessments, despite reviewing materials extensively beforehand.'
      );
    } else {
      setContextType('Teacher Observation');
      setNotesText(
        'Student was enthusiastic, inquisitive, and highly engaged throughout our thermodynamics inquiry session. Actively helped peers troubleshoot their experimental circuits and demonstrated strong collaborative leadership.'
      );
    }
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!notesText.trim()) return;
    setAnalyzing(true);
    try {
      const res = await api.analyzeStudentBehavior({
        student_id: selectedStudentId,
        context_type: contextType,
        notes_text: notesText
      });
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>AI Emotional Wellness & Sentiment Telemetry</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Behavioral & Sentiment Anomaly Detector</h1>
          <p className="text-slate-300 text-xs mt-1 max-w-2xl">
            Detects subtle emotional distress, academic burnout, test anxiety, or social isolation markers from classroom observations and counselor notes to trigger proactive compassionate check-ins.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-medium">Quick Presets:</span>
          <button
            onClick={() => loadSampleNote('burnout')}
            className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-rose-300 transition-colors"
          >
            Burnout Note
          </button>
          <button
            onClick={() => loadSampleNote('anxiety')}
            className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-amber-300 transition-colors"
          >
            Anxiety Note
          </button>
          <button
            onClick={() => loadSampleNote('positive')}
            className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-emerald-300 transition-colors"
          >
            Positive Note
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <HeartHandshake className="w-4 h-4 text-rose-600" />
              <span>Observation Parameters</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Select Student</label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(Number(e.target.value))}
                className="w-full text-xs font-medium border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.first_name} {s.last_name} ({s.student_id}) - {s.grade_level}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Observation Context</label>
              <select
                value={contextType}
                onChange={(e) => setContextType(e.target.value)}
                className="w-full text-xs font-medium border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Teacher Observation">Teacher Classroom Observation</option>
                <option value="Counselor Note">Counselor / Wellness Advisory Session</option>
                <option value="Student Reflection">Student Self-Reflection Log</option>
                <option value="Parent Feedback">Guardian / Parent Inquiry</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Observation Notes & Anecdotes
              </label>
              <textarea
                rows={6}
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                placeholder="Type or paste observational details regarding student engagement, mood, or fatigue..."
                className="w-full text-xs font-normal border border-slate-300 rounded-xl p-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={analyzing || !notesText.trim()}
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-md shadow-rose-500/20 flex items-center justify-center space-x-2 transition-all active:scale-95"
            >
              <Sparkles className={`w-4 h-4 ${analyzing ? 'animate-spin' : ''}`} />
              <span>{analyzing ? 'Evaluating Behavioral Sentiment...' : 'Analyze Emotional Sentiment'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: AI Analysis Result */}
        <div className="lg:col-span-7 space-y-4">
          {result ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 animate-fade-in">
              {/* Header Status */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Student Evaluation
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                    {result.student_name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Context: {result.context_type}</p>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                      result.urgency_level === 'High'
                        ? 'bg-rose-100 text-rose-800 border-rose-300'
                        : result.urgency_level === 'Medium'
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5 mr-1" />
                    {result.urgency_level} Urgency
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">{result.urgency}</p>
                </div>
              </div>

              {/* Sentiment Polarity Meter */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700 flex items-center space-x-1">
                    {result.sentiment_polarity >= 0 ? (
                      <Smile className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Frown className="w-4 h-4 text-rose-600" />
                    )}
                    <span>Detected Affect: <strong>{result.sentiment_label}</strong></span>
                  </span>
                  <span className="font-mono text-slate-500 text-xs">
                    Score: {result.sentiment_polarity > 0 ? `+${result.sentiment_polarity}` : result.sentiment_polarity}
                  </span>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-2 relative overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      result.sentiment_polarity >= 0 ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                    style={{
                      width: `${Math.max(10, Math.min(100, (result.sentiment_polarity + 1) * 50))}%`
                    }}
                  ></div>
                </div>
              </div>

              {/* Behavioral Indicators */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Extracted Indicators & Patterns:
                </h4>
                <div className="space-y-1.5">
                  {result.behavioral_flags.map((flag, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 flex items-start space-x-2"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-500 mt-0.5 flex-shrink-0" />
                      <span>{flag}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Advice */}
              <div className="p-4 bg-rose-50/60 border border-rose-200 rounded-2xl">
                <h4 className="text-xs font-bold text-rose-900 flex items-center space-x-1.5 mb-1">
                  <UserCheck className="w-4 h-4 text-rose-600" />
                  <span>Recommended Pedagogical / Counselor Action:</span>
                </h4>
                <p className="text-xs text-rose-800 leading-relaxed">{result.action_advice}</p>
              </div>

              {/* Empathetic Script */}
              <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl">
                <h4 className="text-xs font-bold text-indigo-900 flex items-center space-x-1.5 mb-1.5">
                  <MessageSquare className="w-4 h-4 text-indigo-600" />
                  <span>Teacher / Advisor Check-In Script (Ready to Use):</span>
                </h4>
                <p className="text-xs text-indigo-800 italic leading-relaxed bg-white/80 p-3 rounded-xl border border-indigo-100">
                  {result.recommended_checkin_script}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-16 text-center flex flex-col items-center justify-center h-full min-h-[380px]">
              <HeartHandshake className="w-12 h-12 text-slate-300 mb-3" />
              <h3 className="font-bold text-slate-700 text-sm">No Observation Analyzed Yet</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Enter teacher notes or choose a preset on top, then trigger the AI engine to evaluate emotional affect and student well-being.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
