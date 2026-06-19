import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  Building, Briefcase, Calendar, Clock, 
  ArrowLeft, Edit, AlertCircle, FileText, 
  RefreshCw, Layers, CheckSquare2 
} from 'lucide-react';
import { ApplicationAPI } from '../services/api';
import { Application } from '../types';
import { useToast } from '../components/Toast';

export default function ViewApplication() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadApplication() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await ApplicationAPI.getById(id);
        setApplication(data);
      } catch (err: any) {
        toast.error('The requested application record could not be found.', 'Record Not Found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    }

    loadApplication();
  }, [id, navigate, toast]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'OFFER':
        return 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50';
      case 'INTERVIEWING':
        return 'bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-900/50';
      case 'REJECTED':
        return 'bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-400 border-rose-200 dark:border-rose-900/50';
      default: // APPLIED
        return 'bg-slate-50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-800/40';
    }
  };

  const getJobTypeStyle = (type: string) => {
    switch (type) {
      case 'INTERNSHIP':
        return 'bg-indigo-50 dark:bg-indigo-950/25 text-indigo-700 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/40';
      case 'FULL_TIME':
        return 'bg-teal-50 dark:bg-teal-950/25 text-teal-700 dark:text-teal-400 border-teal-100 dark:border-teal-900/40';
      case 'PART_TIME':
        return 'bg-orange-50 dark:bg-orange-950/25 text-orange-700 dark:text-orange-400 border-orange-100 dark:border-orange-900/40';
      default:
        return 'bg-slate-50 dark:bg-slate-800/20 text-slate-600 dark:text-slate-300 border-slate-100 dark:border-slate-800';
    }
  };

  const formatEnum = (str: string) => {
    return str.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ');
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (e) {
      return dateStr;
    }
  };

  const formatTimestamp = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3" id="view-loading-stage">
        <RefreshCw className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
        <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Loading application profile...</span>
      </div>
    );
  }

  if (!application) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6" id="view-application-container">
      {/* Upper Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer"
          id="btn-view-back-to-dashboard"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to dashboard</span>
        </button>

        <Link
          to={`/edit/${application.id}`}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-850 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          id="btn-view-edit-link"
        >
          <Edit className="w-3.5 h-3.5" />
          <span>Edit Details</span>
        </Link>
      </div>

      {/* Main Stats Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 transition-colors duration-200">
        
        {/* Header summary info block */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-50 dark:border-slate-800">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-2xl text-blue-600 dark:text-blue-400 shrink-0">
              <Building className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-sans">
                {application.company_name}
              </h1>
              <p className="text-base font-semibold text-slate-500 dark:text-slate-400">{application.job_title}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 sm:flex-col sm:items-end">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(application.status)}`}>
              {formatEnum(application.status)}
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-bold border ${getJobTypeStyle(application.job_type)}`}>
              {formatEnum(application.job_type)}
            </span>
          </div>
        </div>

        {/* Detailed Fields Parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 py-2">
          {/* Timeline Date Grid Box */}
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100/50 dark:border-slate-850 p-4.5 rounded-2xl flex items-start gap-3">
            <Calendar className="w-5 h-5 text-slate-400 dark:text-slate-500 mt-0.5" />
            <div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Date Applied</span>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1 block">
                {formatDate(application.applied_date)}
              </span>
            </div>
          </div>

          {/* Type Identification Box */}
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100/50 dark:border-slate-850 p-4.5 rounded-2xl flex items-start gap-3">
            <Layers className="w-5 h-5 text-slate-400 dark:text-slate-500 mt-0.5" />
            <div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Employment Stream</span>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1 block">
                {formatEnum(application.job_type)} Placement
              </span>
            </div>
          </div>
        </div>

        {/* Notes Segment */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-slate-350 dark:text-slate-700" />
            <span>Process Logs & Notes</span>
          </h3>

          {application.notes ? (
            <div className="bg-slate-50/40 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal whitespace-pre-wrap">
              {application.notes}
            </div>
          ) : (
            <div className="border border-dashed border-slate-100 dark:border-slate-800 text-center py-6 px-4 rounded-2xl text-xs text-slate-400 dark:text-slate-500 font-medium">
              No additional notes or comments have been logged for this application stream yet.
            </div>
          )}
        </div>

        {/* Timestamps audit footer */}
        <div className="pt-5 border-t border-slate-50 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-slate-400 dark:text-slate-550 font-medium">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-350 dark:text-slate-700" />
            <span>Added to logs: {formatTimestamp(application.created_at)}</span>
          </div>
          {application.updated_at !== application.created_at && (
            <div className="flex items-center gap-1.5">
              <CheckSquare2 className="w-3.5 h-3.5 text-slate-350 dark:text-slate-700" />
              <span>Last updated: {formatTimestamp(application.updated_at)}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
