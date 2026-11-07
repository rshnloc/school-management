import React, { useState, useRef, useEffect } from 'react';
import { api } from '../../services/api';
import { ChatMessage } from '../../types';
import {
  Bot,
  X,
  Send,
  Sparkles,
  RefreshCw,
  User,
  ArrowRight,
  HelpCircle
} from 'lucide-react';

interface EduBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: string;
  onNavigateTab?: (tab: string) => void;
}

export const EduBotModal: React.FC<EduBotModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onNavigateTab
}) => {
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: `Hello! I am **EduBot**, Nexora Academy's intelligent virtual assistant. I can assist with academic policies, syllabus guidelines, GPA thresholds, fee billing, and student counseling. How may I help you today?`,
      timestamp: 'Just now',
      suggested_actions: [
        'What is the grading scale?',
        'What is the attendance threshold?',
        'Where is the counseling office?',
        'Show the daily bell schedule',
        'Tuition fee deadlines'
      ]
    }
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.chatWithEduBot({
        message: textToSend,
        user_role: currentRole
      });

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: res.reply,
        timestamp: 'Just now',
        suggested_actions: res.suggested_actions
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: 'Sorry, I am temporarily having trouble reaching the campus knowledge base. Please try again.',
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (action: string) => {
    if (action.includes('Gradebook') || action.includes('GPA')) {
      onNavigateTab?.('gradebook');
    } else if (action.includes('Attendance')) {
      onNavigateTab?.('attendance');
    } else if (action.includes('Timetable') || action.includes('Schedule')) {
      onNavigateTab?.('ai-timetable-solver');
    } else if (action.includes('Fee') || action.includes('Balance')) {
      onNavigateTab?.('fees');
    } else {
      handleSend(action);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:justify-end sm:p-6 p-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-fade-in">
      <div className="bg-white w-full sm:w-[420px] h-[580px] sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="font-bold text-sm tracking-tight">EduBot AI Assistant</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <p className="text-[11px] text-slate-300">
                School Policy & Academic Advisor ({currentRole})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
          {messages.map((m) => {
            const isBot = m.sender === 'bot';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                    isBot
                      ? 'bg-white text-slate-800 border border-slate-200/80 shadow-xs'
                      : 'bg-brand-600 text-white shadow-sm shadow-brand-500/20 rounded-br-none'
                  }`}
                >
                  <div
                    className="space-y-1.5 whitespace-pre-line"
                    dangerouslySetInnerHTML={{
                      __html: m.text
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                        .replace(/• /g, '• ')
                    }}
                  />
                </div>

                {/* Suggested Action Chips */}
                {m.suggested_actions && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                    {m.suggested_actions.map((act, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleActionClick(act)}
                        className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white hover:bg-brand-50 hover:text-brand-700 text-slate-600 border border-slate-200 shadow-2xs transition-all active:scale-95 flex items-center space-x-1"
                      >
                        <Sparkles className="w-2.5 h-2.5 text-brand-500" />
                        <span>{act}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center space-x-2 text-xs text-slate-400 p-2">
              <Bot className="w-4 h-4 text-brand-600 animate-bounce" />
              <span>EduBot is synthesizing policy context...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Bar */}
        <div className="px-3 py-2 bg-slate-100 border-t border-slate-200 flex items-center space-x-1 overflow-x-auto text-[11px] whitespace-nowrap">
          <span className="text-slate-400 font-semibold px-1">Try asking:</span>
          {['Grading rubric', 'Excused absence', 'Library hours', 'Extracurricular clubs'].map(
            (topic) => (
              <button
                key={topic}
                onClick={() => handleSend(topic)}
                className="px-2 py-0.5 rounded-md bg-white text-slate-600 border border-slate-200 hover:text-brand-600 hover:border-brand-200"
              >
                {topic}
              </button>
            )
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about syllabus, grades, campus policies..."
            className="flex-1 text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white disabled:opacity-40 transition-all active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

