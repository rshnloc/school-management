import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Announcement } from '../../types';
import { BellRing, Plus, Pin, Calendar, Tag, X, User } from 'lucide-react';

export const AnnouncementsView: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'General',
    target_audience: 'All',
    pinned: false
  });

  const fetchAnnouncements = async () => {
    try {
      const data = await api.getAnnouncements();
      setAnnouncements(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createAnnouncement(form);
      setIsAddOpen(false);
      setForm({
        title: '',
        content: '',
        category: 'General',
        target_audience: 'All',
        pinned: false
      });
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <BellRing className="w-5 h-5 text-indigo-600" />
            <span>Campus Notice Board & Broadcasts</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Institutional announcements, academic calendar dates, events, and urgent alerts.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center space-x-1.5 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Post Announcement</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className={`bg-white rounded-2xl p-5 border transition-all shadow-sm hover:shadow-md space-y-3 ${
              ann.pinned
                ? 'border-brand-200 ring-1 ring-brand-100 bg-brand-50/10'
                : 'border-slate-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <span
                  className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                    ann.category === 'Urgent'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : ann.category === 'Academic'
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {ann.category}
                </span>
                <span className="text-[10px] font-semibold text-slate-400">
                  Audience: {ann.target_audience}
                </span>
              </div>

              {ann.pinned && (
                <span className="flex items-center space-x-1 text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200">
                  <Pin className="w-3 h-3" />
                  <span>Pinned</span>
                </span>
              )}
            </div>

            <h3 className="font-bold text-sm text-slate-900 leading-snug">{ann.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{ann.content}</p>

            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-3 border-t border-slate-100">
              <span className="flex items-center space-x-1">
                <User className="w-3 h-3" />
                <span>{ann.author}</span>
              </span>
              <span>{new Date(ann.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-slide-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                <BellRing className="w-4 h-4 text-indigo-600" />
                <span>Draft New Campus Broadcast</span>
              </h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Headline</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Schedule for Mid-Term Diagnostics"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2"
                  >
                    <option value="General">General</option>
                    <option value="Academic">Academic</option>
                    <option value="Event">Event</option>
                    <option value="Urgent">Urgent Alert</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Target Audience</label>
                  <select
                    value={form.target_audience}
                    onChange={(e) => setForm({ ...form, target_audience: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2"
                  >
                    <option value="All">All Campus</option>
                    <option value="Students">Students Only</option>
                    <option value="Teachers">Teachers Only</option>
                    <option value="Parents">Parents Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Notice Content</label>
                <textarea
                  rows={4}
                  required
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Provide detailed description of the announcement..."
                  className="w-full border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="pinnedCheck"
                  checked={form.pinned}
                  onChange={(e) => setForm({ ...form, pinned: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <label htmlFor="pinnedCheck" className="text-xs font-semibold text-slate-700">
                  Pin to Top of Board
                </label>
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
                  Broadcast Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

