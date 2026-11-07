import React from 'react';
import { Sparkles, Bot, Shield, Bell, GraduationCap, ChevronDown } from 'lucide-react';

interface NavbarProps {
  currentRole: string;
  onRoleChange: (role: string) => void;
  onOpenEduBot: () => void;
  activeAiAlertsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  onOpenEduBot,
  activeAiAlertsCount = 2
}) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-slate-900 tracking-tight">Nexora Academy</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                SIS + AI Core
              </span>
            </div>
            <p className="text-xs text-slate-500">Autonomous School Intelligence System</p>
          </div>
        </div>

        {/* AI Engine Status Pill */}
        <div className="hidden lg:flex items-center space-x-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Predictive AI Models Active</span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Role Selector Pill */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium border border-slate-200">
          <span className="px-2 text-slate-500 flex items-center">
            <Shield className="w-3.5 h-3.5 mr-1 text-slate-400" /> Role:
          </span>
          {(['admin', 'teacher', 'student', 'parent'] as const).map((role) => (
            <button
              key={role}
              onClick={() => onRoleChange(role)}
              className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                currentRole === role
                  ? 'bg-white text-brand-700 font-semibold shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        {/* EduBot AI Assistant Trigger */}
        <button
          onClick={onOpenEduBot}
          className="flex items-center space-x-2 px-3.5 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-brand-500/25 transition-all active:scale-95"
        >
          <Bot className="w-4 h-4" />
          <span>EduBot AI</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
        </button>

        {/* Example User Avatar */}
        <div className="flex items-center pl-2 border-l border-slate-200 space-x-2">
          <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-xs">
            {currentRole.slice(0, 2).toUpperCase()}
          </div>
          <div className="hidden sm:block text-left text-xs">
            <p className="font-semibold text-slate-800 capitalize">Example {currentRole}</p>
            <p className="text-[10px] text-slate-400">demo@example.com</p>
          </div>
        </div>
      </div>
    </header>
  );
};

