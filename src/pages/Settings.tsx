import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings as SettingsIcon, ArrowLeft, Save, User, Mail, Briefcase, 
  Target, GraduationCap, Check, ShieldAlert, Sparkles, Sliders
} from 'lucide-react';
import { useToast } from '../components/Toast';

export default function Settings() {
  const navigate = useNavigate();
  const toast = useToast();

  const [candidateName, setCandidateName] = useState(() => {
    return localStorage.getItem('candidate_name') || 'Dipak Mandal';
  });

  const [candidateEmail, setCandidateEmail] = useState(() => {
    return localStorage.getItem('candidate_email') || 'dipak26@gmail.com';
  });

  const [preferredRole, setPreferredRole] = useState(() => {
    return localStorage.getItem('preferred_role') || 'Frontend Developer / UI Designer';
  });

  const [targetCount, setTargetCount] = useState(() => {
    return localStorage.getItem('target_count') || '30';
  });

  const [notifications, setNotifications] = useState(() => {
    return localStorage.getItem('notifications') === 'true';
  });

  const [notifyApplied, setNotifyApplied] = useState(() => {
    const saved = localStorage.getItem('notifications_applied');
    return saved === null ? true : saved === 'true';
  });

  const [notifyRejected, setNotifyRejected] = useState(() => {
    const saved = localStorage.getItem('notifications_rejected');
    return saved === null ? true : saved === 'true';
  });

  const [notifyAll, setNotifyAll] = useState(() => {
    const saved = localStorage.getItem('notifications_all');
    return saved === null ? true : saved === 'true';
  });

  const [weeklyGoal, setWeeklyGoal] = useState(() => {
    return localStorage.getItem('weekly_goal') || '5';
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('candidate_name', candidateName);
    localStorage.setItem('candidate_email', candidateEmail);
    localStorage.setItem('preferred_role', preferredRole);
    localStorage.setItem('target_count', targetCount);
    localStorage.setItem('notifications', notifications.toString());
    localStorage.setItem('notifications_applied', notifyApplied.toString());
    localStorage.setItem('notifications_rejected', notifyRejected.toString());
    localStorage.setItem('notifications_all', notifyAll.toString());
    localStorage.setItem('weekly_goal', weeklyGoal);

    // Reload window so the sidebar gets updated user name and email automatically!
    toast.success('Your profile configuration has been successfully saved.', 'Settings Updated');
    
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in" id="settings-view-container">
      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        id="btn-back-to-dashboard-from-settings"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to applications</span>
      </button>

      {/* Main card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl p-6 sm:p-8 shadow-xs transition-colors duration-200">
        <div className="flex items-center gap-3 border-b border-slate-50 dark:border-slate-800 pb-5 mb-6">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-xl text-blue-600 dark:text-blue-400">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-950 dark:text-white font-sans">Portfolio settings</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Configure your job seeker profile name, contact card, and recruitment goals.</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6" id="settings-form-wrapper">
          <h3 className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest block border-b border-slate-50 dark:border-slate-800/60 pb-2">
            Personal Identity Config
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Candidate Name */}
            <div className="space-y-1.5 col-span-1">
              <label htmlFor="candidateName" className="text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider block">
                Full Display Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
                <input
                  type="text"
                  id="candidateName"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="e.g. Dipak Mandal"
                  className="w-full pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900/80 focus:bg-white dark:focus:bg-slate-950 border border-transparent dark:border-slate-850 focus:border-blue-500 rounded-xl outline-none transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Candidate Email */}
            <div className="space-y-1.5 col-span-1">
              <label htmlFor="candidateEmail" className="text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
                <input
                  type="email"
                  id="candidateEmail"
                  value={candidateEmail}
                  onChange={(e) => setCandidateEmail(e.target.value)}
                  placeholder="e.g. dipak@example.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900/80 focus:bg-white dark:focus:bg-slate-950 border border-transparent dark:border-slate-850 focus:border-blue-500 rounded-xl outline-none transition-all duration-200"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="preferredRole" className="text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider block">
              Preferred Job Role Target
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
              <input
                type="text"
                id="preferredRole"
                value={preferredRole}
                onChange={(e) => setPreferredRole(e.target.value)}
                placeholder="e.g. Software Engineer / Frontend Developer Intern"
                className="w-full pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900/80 focus:bg-white dark:focus:bg-slate-950 border border-transparent dark:border-slate-850 focus:border-blue-500 rounded-xl outline-none transition-all duration-200"
                required
              />
            </div>
          </div>

          <h3 className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest block border-b border-slate-50 dark:border-slate-800/60 pb-2 pt-4">
            Recruitment Metrics Goals
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Target Count */}
            <div className="space-y-1.5 col-span-1">
              <label htmlFor="targetCount" className="text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider block">
                Total Application Target Goal
              </label>
              <div className="relative">
                <Target className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
                <input
                  type="number"
                  id="targetCount"
                  value={targetCount}
                  onChange={(e) => setTargetCount(e.target.value)}
                  placeholder="e.g. 50"
                  min={1}
                  className="w-full pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900/80 focus:bg-white dark:focus:bg-slate-950 border border-transparent dark:border-slate-850 focus:border-blue-500 rounded-xl outline-none transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Weekly Goal */}
            <div className="space-y-1.5 col-span-1">
              <label htmlFor="weeklyGoal" className="text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider block">
                Weekly Submissions Target
              </label>
              <div className="relative">
                <Sliders className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
                <input
                  type="number"
                  id="weeklyGoal"
                  value={weeklyGoal}
                  onChange={(e) => setWeeklyGoal(e.target.value)}
                  placeholder="e.g. 5"
                  min={1}
                  className="w-full pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900/80 focus:bg-white dark:focus:bg-slate-950 border border-transparent dark:border-slate-850 focus:border-blue-500 rounded-xl outline-none transition-all duration-200"
                  required
                />
              </div>
            </div>
          </div>

          {/* Custom Notification Preferences */}
          <h3 className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest block border-b border-slate-50 dark:border-slate-800/60 pb-2 pt-4">
            Custom Notification Preferences
          </h3>

          <div className="space-y-4 pt-2" id="notification-toggles-container">
            {/* Toggle 1: All notifications */}
            <div className="flex items-start gap-3 p-4 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl border border-slate-100 dark:border-slate-850">
              <input
                type="checkbox"
                id="notifyAll"
                checked={notifyAll}
                onChange={(e) => setNotifyAll(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded-md focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600 cursor-pointer mt-1"
              />
              <div className="text-sm">
                <label htmlFor="notifyAll" className="font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                  Enable "All of things" Notifications
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Master master-toggle to enable or disable all in-app milestones and popup triggers instantly.
                </p>
              </div>
            </div>

            {/* Toggle 2: Applied stage */}
            <div className="flex items-start gap-3 p-4 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl border border-slate-100 dark:border-slate-850">
              <input
                type="checkbox"
                id="notifyApplied"
                checked={notifyApplied}
                onChange={(e) => setNotifyApplied(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded-md focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600 cursor-pointer mt-1"
              />
              <div className="text-sm">
                <label htmlFor="notifyApplied" className="font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                  Enable "Applied" Stage Notifications
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Get status update alarms and tracking reminder alerts when new application letters are filed.
                </p>
              </div>
            </div>

            {/* Toggle 3: Rejected stage */}
            <div className="flex items-start gap-3 p-4 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl border border-slate-100 dark:border-slate-850">
              <input
                type="checkbox"
                id="notifyRejected"
                checked={notifyRejected}
                onChange={(e) => setNotifyRejected(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded-md focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600 cursor-pointer mt-1"
              />
              <div className="text-sm">
                <label htmlFor="notifyRejected" className="font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                  Enable "Rejected" Stage Alerts & Motivation
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Receive instant alerts on rejection logs paired with positive quotes so you never lose momentum.
                </p>
              </div>
            </div>

            {/* Toggle 4: Existing recruiter follow-up warning */}
            <div className="flex items-start gap-3 p-4 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl border border-slate-100 dark:border-slate-850">
              <input
                type="checkbox"
                id="notifications"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded-md focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600 cursor-pointer mt-1"
              />
              <div className="text-sm">
                <label htmlFor="notifications" className="font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                  Weekly Recruiter Follow-up Warnings
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Detect and flash updates when an application letter is stuck in the "Applied" database for over 14 days.
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-50 dark:border-slate-800 mt-8">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-5 py-2.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-none"
              id="btn-settings-save"
            >
              <Save className="w-4 h-4" />
              <span>Save settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
