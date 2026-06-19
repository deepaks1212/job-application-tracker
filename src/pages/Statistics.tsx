import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, TrendingUp, Award, Clock, ArrowLeft, 
  ChevronRight, Calendar, Sparkles, Building, Briefcase, RefreshCw, AlertCircle
} from 'lucide-react';
import { ApplicationAPI } from '../services/api';
import { Application, ApplicationStats } from '../types';

export default function Statistics() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<ApplicationStats | null>(null);
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const statsData = await ApplicationAPI.getStats();
        setStats(statsData);
        
        // Fetch matches
        const listData = await ApplicationAPI.getAll({ limit: 100 });
        setApps(listData.items);
      } catch (err) {
        console.error('Failed to load stats details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3" id="loading-spinner">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
        <span className="text-sm text-slate-500 font-medium">Crunching career database statistics...</span>
      </div>
    );
  }

  const total = stats?.TOTAL ?? 0;
  const applied = stats?.APPLIED ?? 0;
  const interviewing = stats?.INTERVIEWING ?? 0;
  const offer = stats?.OFFER ?? 0;
  const rejected = stats?.REJECTED ?? 0;

  // Calculators
  const responseRate = total > 0 ? Math.round(((interviewing + offer) / total) * 100) : 0;
  const offerRate = total > 0 ? Math.round((offer / total) * 100) : 0;
  const interviewConversion = (interviewing + offer) > 0 ? Math.round((offer / (interviewing + offer)) * 100) : 0;

  // Group by job type
  const internships = apps.filter(a => a.job_type === 'INTERNSHIP').length;
  const fulltime = apps.filter(a => a.job_type === 'FULL_TIME').length;
  const parttime = apps.filter(a => a.job_type === 'PART_TIME').length;

  return (
    <div className="space-y-8 animate-fade-in" id="statistics-view-container">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 dark:border-slate-800/65 pb-6">
        <div>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-widest cursor-pointer mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-sans">
            Career Analytics
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time stage conversions, recruitment response funnels, and application metrics.
          </p>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5" id="kpi-grid">
        {/* KPI 1 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-2xl shadow-xs transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Recruiter Response Rate</span>
            <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-xl text-blue-600 dark:text-blue-450 border border-blue-50 dark:border-blue-900/30">
              <TrendingUp className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{responseRate}%</span>
            <span className="text-xs font-semibold text-slate-500">of applications</span>
          </div>
          <div className="mt-4">
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full transition-all" style={{ width: `${responseRate}%` }} />
            </div>
            <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">
              Based on the percentage of submissions that advanced to <b>Interviewing</b> or resulted in an <b>Offer</b>.
            </p>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-2xl shadow-xs transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Offer Conversion Rate</span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl text-emerald-600 dark:text-emerald-450 border border-emerald-50 dark:border-emerald-900/30">
              <Award className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{offerRate}%</span>
            <span className="text-xs font-semibold text-slate-500">total target</span>
          </div>
          <div className="mt-4">
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${offerRate}%` }} />
            </div>
            <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">
              The overall percentage of completed job trackers that succeeded in resulting in a valid <b>Offer</b>.
            </p>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-2xl shadow-xs transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Interview Success Rate</span>
            <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-xl text-purple-600 dark:text-purple-450 border border-purple-50 dark:border-purple-900/30">
              <Clock className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{interviewConversion}%</span>
            <span className="text-xs font-semibold text-slate-500">screening win</span>
          </div>
          <div className="mt-4">
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-purple-600 h-full rounded-full transition-all" style={{ width: `${interviewConversion}%` }} />
            </div>
            <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">
              Represents success converting an active interview stage into a written <b>career offer</b>.
            </p>
          </div>
        </div>
      </div>

      {/* Main Charts & Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recruitment Funnel - Col 7 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-2xl shadow-xs lg:col-span-7 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-6">Recruitment Pipeline Funnel</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">A structured view of active application volume and funnel leakages.</p>
          </div>

          <div className="mt-8 space-y-4">
            {/* Stage 1: Tracked */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 block" />
                  Total Handled (Lead Stage)
                </span>
                <span className="text-slate-500 font-bold">{total} Roles (100%)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-8 rounded-lg overflow-hidden relative flex items-center px-4">
                <div className="absolute inset-y-0 left-0 bg-indigo-500/15 dark:bg-indigo-500/10 w-full transition-all" />
                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 relative z-10">Database entry list</span>
              </div>
            </div>

            {/* Stage 2: Applied */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 block" />
                  Successfully Submitted
                </span>
                <span className="text-slate-500 font-bold">{applied + interviewing + offer + rejected} Roles ({total > 0 ? Math.round(((applied + interviewing + offer + rejected)/total)*100) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-8 rounded-lg overflow-hidden relative flex items-center px-4">
                <div 
                  className="absolute inset-y-0 left-0 bg-amber-500/15 dark:bg-amber-500/10 transition-all border-r border-amber-500/30" 
                  style={{ width: `${total > 0 ? ((applied + interviewing + offer + rejected)/total)*100 : 0}%` }} 
                />
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 relative z-10">Application letters sent</span>
              </div>
            </div>

            {/* Stage 3: Interviewing */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 block" />
                  Interviews Secured
                </span>
                <span className="text-slate-500 font-bold">{interviewing + offer} Roles ({total > 0 ? Math.round(((interviewing + offer)/total)*100) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-8 rounded-lg overflow-hidden relative flex items-center px-4">
                <div 
                  className="absolute inset-y-0 left-0 bg-blue-500/15 dark:bg-blue-500/10 transition-all border-r border-blue-500/30" 
                  style={{ width: `${total > 0 ? ((interviewing + offer)/total)*100 : 0}%` }} 
                />
                <span className="text-xs font-bold text-blue-700 dark:text-blue-400 relative z-10">Screening & on-sites arranged</span>
              </div>
            </div>

            {/* Stage 4: Offers */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block" />
                  Written Offers Recieved
                </span>
                <span className="text-slate-500 font-bold">{offer} Roles ({total > 0 ? Math.round((offer/total)*100) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-8 rounded-lg overflow-hidden relative flex items-center px-4">
                <div 
                  className="absolute inset-y-0 left-0 bg-emerald-500/15 dark:bg-emerald-500/10 transition-all border-r border-emerald-500/30" 
                  style={{ width: `${total > 0 ? (offer/total)*100 : 0}%` }} 
                />
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 relative z-10">Success Goal Achieved!</span>
              </div>
            </div>
          </div>
        </div>

        {/* Roles Breakdown - Col 5 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-2xl shadow-xs lg:col-span-5 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-6">Career Contract Types</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Breakdown of roles based on internship vs full-time classifications.</p>
          </div>

          <div className="mt-6 flex flex-col items-center justify-center py-2 relative">
            {/* Render a beautiful layered CSS segmented donut representation or circle counts */}
            <div className="w-32 h-32 rounded-full border-12 border-slate-50 dark:border-slate-800 flex items-center justify-center relative shadow-inner">
              <div className="flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-900 dark:text-white">{total}</span>
                <span className="text-[10px] text-slate-450 uppercase font-bold tracking-widest">Total Positions</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 mt-6">
            {/* Internship */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100/50 dark:border-slate-850">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-purple-500" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-350">Internship Roles</span>
              </div>
              <span className="text-xs font-extrabold text-slate-900 dark:text-white">{internships} Roles</span>
            </div>

            {/* Full-time */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100/50 dark:border-slate-850">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-teal-500" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-350">Full-Time Positions</span>
              </div>
              <span className="text-xs font-extrabold text-slate-900 dark:text-white">{fulltime} Roles</span>
            </div>

            {/* Part-time */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100/50 dark:border-slate-850">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-orange-500" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-350">Part-Time / Temporary</span>
              </div>
              <span className="text-xs font-extrabold text-slate-900 dark:text-white">{parttime} Roles</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
