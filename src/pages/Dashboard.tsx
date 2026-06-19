import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, Edit, Trash2, Eye, Search, Filter, 
  TrendingUp, Briefcase, Calendar, ChevronLeft, ChevronRight,
  CheckCircle2, AlertCircle, RefreshCw, Layers, FileText, Send, XCircle, SlidersHorizontal, Sliders
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ApplicationAPI } from '../services/api';
import { Application, ApplicationStats } from '../types';
import { useToast } from '../components/Toast';

// Premium Company Logo Component
function CompanyLogo({ companyName }: { companyName: string }) {
  const name = companyName.trim().toLowerCase();
  
  const getColors = () => {
    if (name.includes('google')) return { bg: 'bg-red-50 text-red-650 border-red-100', logo: 'G' };
    if (name.includes('microsoft')) return { bg: 'bg-blue-50 text-blue-600 border-blue-105', logo: 'M' };
    if (name.includes('amazon')) return { bg: 'bg-amber-50 text-amber-705 border-amber-100', logo: 'A' };
    if (name.includes('deloitte')) return { bg: 'bg-black text-white border-black', logo: 'D' };
    if (name.includes('adobe')) return { bg: 'bg-rose-50 text-rose-600 border-rose-100', logo: 'A' };
    if (name.includes('infosys')) return { bg: 'bg-blue-50 text-blue-600 border-blue-100', logo: 'I' };
    if (name.includes('stripe')) return { bg: 'bg-indigo-50 text-indigo-650 border-indigo-150', logo: 'S' };
    if (name.includes('apple')) return { bg: 'bg-slate-100 text-slate-800 border-slate-200', logo: '' };
    if (name.includes('netflix')) return { bg: 'bg-rose-50 text-rose-700 border-rose-150', logo: 'N' };
    if (name.includes('facebook')) return { bg: 'bg-blue-50 text-blue-700 border-blue-150', logo: 'F' };
    if (name.includes('meta')) return { bg: 'bg-blue-50 text-[#0081FB] border-blue-100', logo: 'M' };

    // Fallback dynamic card background based on ASCII check
    const colors = [
      { bg: 'bg-blue-50 text-blue-605 border-blue-100', char: 'B' },
      { bg: 'bg-emerald-50 text-emerald-600 border-emerald-100', char: 'E' },
      { bg: 'bg-purple-50 text-purple-600 border-purple-100', char: 'P' },
      { bg: 'bg-rose-50 text-rose-600 border-rose-100', char: 'R' },
      { bg: 'bg-amber-50 text-amber-600 border-amber-100', char: 'Y' }
    ];
    const idx = (name.charCodeAt(0) || 0) % colors.length;
    const fallbackChar = (companyName.trim().charAt(0) || '?').toUpperCase();
    return { bg: colors[idx].bg, logo: fallbackChar };
  };

  const { bg, logo } = getColors();

  // Custom Google Logo block
  if (name.includes('google')) {
    return (
      <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex items-center justify-center font-bold text-base shadow-xs select-none flex-shrink-0">
        <span className="text-[#4285F4]">G</span>
        <span className="text-[#EA4335]">o</span>
        <span className="text-[#FBBC05]">o</span>
        <span className="text-[#34A853]">g</span>
      </div>
    );
  }

  // Custom Microsoft Logo block
  if (name.includes('microsoft')) {
    return (
      <div className="w-10 h-10 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex items-center justify-center shadow-xs select-none flex-shrink-0">
        <div className="grid grid-cols-2 gap-0.5 p-1.5">
          <div className="w-2.5 h-2.5 bg-[#F25022]" />
          <div className="w-2.5 h-2.5 bg-[#7FBA00]" />
          <div className="w-2.5 h-2.5 bg-[#00A4EF]" />
          <div className="w-2.5 h-2.5 bg-[#FFB900]" />
        </div>
      </div>
    );
  }

  // Custom Deloitte Logo block
  if (name.includes('deloitte')) {
    return (
      <div className="w-10 h-10 rounded-full bg-[#111111] dark:bg-black border border-black flex items-center justify-center font-black text-sm select-none shadow-xs text-white flex-shrink-0">
        <span>D</span>
        <span className="text-[#86BC25] font-extrabold ml-0.5">.</span>
      </div>
    );
  }

  // Custom Adobe Logo block
  if (name.includes('adobe')) {
    return (
      <div className="w-10 h-10 rounded-xl bg-[#FA0A00] flex items-center justify-center shadow-xs select-none flex-shrink-0">
        <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 24 24">
          <path d="M14.542 3H24v18h-9.458L12 16.2zM9.458 3H0v18h9.458L12 16.2z" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-bold text-sm select-none shadow-xs dark:bg-slate-950/40 dark:border-slate-800/80 ${bg} flex-shrink-0`}>
      <span>{logo}</span>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const toast = useToast();

  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<ApplicationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  
  // Filtering & Sorting states
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('latest');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 6; // Set to 6 results per page just like in the screenshot!

  // Delete modal state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const data = await ApplicationAPI.getStats();
      setStats(data);
    } catch (err: any) {
      console.error('Failed to load stats:', err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ApplicationAPI.getAll({
        status: statusFilter || undefined,
        search: search || undefined,
        page,
        limit,
        sort: sortOrder,
      });
      setApplications(data.items);
      setTotalPages(data.meta.totalPages);
      setTotalCount(data.meta.total);

      // Adjust page if current page exceeds newly loaded total pages
      if (data.meta.totalPages > 0 && page > data.meta.totalPages) {
        setPage(data.meta.totalPages);
      }
    } catch (err: any) {
      toast.error('Could not fetch applications. Please try again.', 'Error');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search, page, limit, sortOrder, toast]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Live and submit search
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  // Double trigger live-updated search for responsive feel
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 450);

    return () => clearTimeout(delayDebounceFn);
  }, [searchInput]);

  const handleClearFilters = () => {
    setSearchInput('');
    setSearch('');
    setStatusFilter('');
    setSortOrder('latest');
    setPage(1);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      setIsDeleting(true);
      await ApplicationAPI.delete(deleteId);
      toast.success('The job application was permanently deleted.', 'Deleted');
      setDeleteId(null);
      fetchStats();
      fetchApplications();
    } catch (err) {
      toast.error('Failed to delete user application.', 'Error');
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'OFFER':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50';
      case 'INTERVIEWING':
        return 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/50';
      case 'REJECTED':
        return 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50';
      default: // APPLIED
        return 'bg-amber-50 text-amber-705 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50';
    }
  };

  const getJobTypeStyle = (type: string) => {
    switch (type) {
      case 'INTERNSHIP':
        return 'bg-purple-50 text-purple-650 border-purple-100 dark:bg-purple-950/25 dark:text-purple-400 dark:border-purple-900/40';
      case 'FULL_TIME':
        return 'bg-teal-50 text-teal-655 border-teal-100 dark:bg-teal-950/25 dark:text-teal-400 dark:border-teal-900/40';
      default:
        return 'bg-orange-50 text-orange-655 border-orange-100 dark:bg-orange-950/25 dark:text-orange-400 dark:border-orange-900/40';
    }
  };

  const formatEnum = (str: string) => {
    return str.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ');
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6 md:space-y-8" id="dashboard-container">
      
      {/* Premium Header Alignment - Title & Search in One Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-sans">
            Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Track and manage your job applications
          </p>
        </div>

        {/* Search Input Box & Submit Button aligned */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:max-w-xl">
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
            <input
              type="text"
              placeholder="Search by company or job title..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 focus:bg-white dark:focus:bg-[#0c1220] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-xl outline-none transition-all duration-200"
              id="search-input-field"
            />
          </form>

          <Link
            to="/add"
            className="inline-flex items-center justify-center gap-1.5 px-4.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all duration-200 shadow-xs shadow-blue-105-0 hover:shadow-sm cursor-pointer whitespace-nowrap self-stretch sm:self-auto"
            id="btn-add-application"
          >
            <Plus className="w-4 h-4" />
            <span>Add Application</span>
          </Link>
        </div>
      </div>

      {/* Metrics Section: 5 beautiful cards aligned horizontally with custom icons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4" id="stats-grid">
        {[
          { 
            label: 'Total Applications', 
            val: stats?.TOTAL ?? 0, 
            icon: FileText, 
            iconBg: 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/30', 
            iconColor: 'text-blue-600 dark:text-blue-400',
            subtext: 'All applications' 
          },
          { 
            label: 'Applied', 
            val: stats?.APPLIED ?? 0, 
            icon: Send, 
            iconBg: 'bg-amber-50 dark:bg-amber-950/20 text-orange-500 dark:text-orange-400 border border-amber-100/50 dark:border-amber-900/30', 
            iconColor: 'text-orange-500 dark:text-orange-400',
            subtext: 'Applications' 
          },
          { 
            label: 'Interviewing', 
            val: stats?.INTERVIEWING ?? 0, 
            icon: RefreshCw, 
            iconBg: 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/30', 
            iconColor: 'text-indigo-600 dark:text-indigo-400',
            subtext: 'Applications' 
          },
          { 
            label: 'Offers', 
            val: stats?.OFFER ?? 0, 
            icon: CheckCircle2, 
            iconBg: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/30', 
            iconColor: 'text-emerald-600 dark:text-emerald-400',
            subtext: 'Applications' 
          },
          { 
            label: 'Rejected', 
            val: stats?.REJECTED ?? 0, 
            icon: XCircle, 
            iconBg: 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-450 border border-rose-100/50 dark:border-rose-900/30', 
            iconColor: 'text-rose-600 dark:text-rose-500',
            subtext: 'Applications' 
          },
        ].map((item, idx) => (
          <div 
            key={idx} 
            className="border border-slate-200/60 dark:border-slate-850 rounded-2xl p-4 sm:p-5 flex items-center gap-4 transition-all duration-300 shadow-xs bg-white dark:bg-[#0c101d] col-span-1 hover:-translate-y-0.5"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${item.iconBg}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block truncate">{item.label}</span>
              {statsLoading ? (
                <div className="h-7 w-10 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-md mt-1" />
              ) : (
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight block mt-0.5">{item.val}</span>
              )}
              <span className="text-[10px] font-semibold text-slate-405 dark:text-slate-500 block mt-0.5">{item.subtext}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main card box housing the Filters and grand table */}
      <div className="bg-white dark:bg-[#0c101d] border border-slate-200/60 dark:border-slate-850 rounded-2xl shadow-xs transition-colors overflow-hidden" id="control-panel">
        
        {/* Double Dropdown Filter controls */}
        <div className="p-5 border-b border-slate-150/50 dark:border-slate-850 flex flex-col sm:flex-row items-center gap-4 bg-[#fcfdfe]/60 dark:bg-transparent">
          {/* Status selector */}
          <div className="w-full sm:max-w-xs flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Filter by status</label>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="w-full text-sm bg-white dark:bg-[#121824] border border-slate-200 dark:border-slate-800 text-slate-705 dark:text-slate-350 py-2 pl-3 pr-8 rounded-xl outline-none transition-all cursor-pointer hover:border-slate-300 dark:hover:border-slate-700"
                id="filter-status-select"
              >
                <option value="">All Status</option>
                <option value="APPLIED">Applied</option>
                <option value="INTERVIEWING">Interviewing</option>
                <option value="OFFER">Offer</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          {/* Sort order selector */}
          <div className="w-full sm:max-w-xs sm:ml-auto flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Sort by</label>
            <div className="relative">
              <select
                value={sortOrder}
                onChange={(e) => { setSortOrder(e.target.value); setPage(1); }}
                className="w-full text-sm bg-white dark:bg-[#121824] border border-slate-200 dark:border-slate-800 text-slate-705 dark:text-slate-350 py-2 pl-3 pr-8 rounded-xl outline-none transition-all cursor-pointer hover:border-slate-300 dark:hover:border-slate-700"
                id="sort-by-select"
              >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
                <option value="alphabetical">Company Name (A-Z)</option>
                <option value="title">Role Title (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Database List / Table display */}
        <div className="relative" id="applications-list-stage">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3" id="loading-spinner">
              <RefreshCw className="w-7 h-7 text-blue-605 dark:text-blue-450 animate-spin" />
              <span className="text-sm text-slate-550 dark:text-slate-400 font-semibold">Loading job applications...</span>
            </div>
          ) : (
            <>
              {applications.length === 0 ? (
                <div 
                  className="py-16 px-4 text-center flex flex-col items-center justify-center bg-transparent transition-colors"
                  id="empty-state"
                >
                  <Briefcase className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-3" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">No applications match</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                    {search || statusFilter 
                      ? "Reset your search criteria or status toggles to discover other applications."
                      : "Start monitoring your recruitment journey! Add your very first application record above."
                    }
                  </p>
                  {(search || statusFilter) ? (
                    <button
                      type="button"
                      onClick={handleClearFilters}
                      className="mt-4 px-4.5 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  ) : null}
                </div>
              ) : (
                <div className="flex flex-col">
                  {/* Desktop Table View */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full text-left border-collapse" id="desktop-applications-table">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-850/60 bg-[#f8fafc]/50 dark:bg-[#121824]/30 select-none">
                          <th className="py-4 px-6 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Company</th>
                          <th className="py-4 px-6 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Job Title</th>
                          <th className="py-4 px-6 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Job Type</th>
                          <th className="py-4 px-6 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Status</th>
                          <th className="py-4 px-6 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Applied Date</th>
                          <th className="py-4 px-6 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-850/60">
                        {applications.map((app) => (
                          <tr key={app.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/10 group transition-colors">
                            {/* Company logo & name */}
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <CompanyLogo companyName={app.company_name} />
                                <span className="font-bold text-slate-800 dark:text-white text-base leading-none">
                                  {app.company_name}
                                </span>
                              </div>
                            </td>
                            {/* Job title */}
                            <td className="py-4 px-6">
                              <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                                {app.job_title}
                              </span>
                            </td>
                            {/* Job contract type */}
                            <td className="py-4 px-6">
                              <span className={`inline-flex px-2.5 py-1 rounded-lg text-[11px] font-bold border ${getJobTypeStyle(app.job_type)}`}>
                                {formatEnum(app.job_type)}
                              </span>
                            </td>
                            {/* Recruitment status */}
                            <td className="py-4 px-6">
                              <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusStyle(app.status)}`}>
                                {formatEnum(app.status)}
                              </span>
                            </td>
                            {/* Applied Date */}
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-1.5 text-slate-450 dark:text-slate-400 text-xs font-bold select-none">
                                <Calendar className="w-4 h-4 text-slate-400" />
                                <span>{formatDate(app.applied_date)}</span>
                              </div>
                            </td>
                            {/* Actions links buttons */}
                            <td className="py-4 px-6 text-right">
                              <div className="inline-flex items-center gap-1">
                                <button
                                  onClick={() => navigate(`/view/${app.id}`)}
                                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-lg text-slate-450 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => navigate(`/edit/${app.id}`)}
                                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-lg text-slate-450 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                                  title="Edit Application"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(app.id)}
                                  className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-450 transition-colors cursor-pointer"
                                  title="Delete"
                                  id={`delete-btn-${app.id}`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile/Tablet Card View */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden p-5 bg-slate-50/25 dark:bg-transparent" id="mobile-applications-cards">
                    {applications.map((app) => (
                      <div 
                        key={app.id} 
                        className="bg-white dark:bg-[#121824]/50 border border-slate-150 dark:border-slate-850 rounded-2xl p-5 hover:border-slate-350 dark:hover:border-slate-700 transition-all shadow-xs flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <CompanyLogo companyName={app.company_name} />
                              <div className="min-w-0 leading-tight">
                                <h3 className="font-bold text-slate-900 dark:text-white text-base truncate">
                                  {app.company_name}
                                </h3>
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-405 truncate mt-0.5">{app.job_title}</p>
                              </div>
                            </div>
                            <span className={`flex-shrink-0 inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusStyle(app.status)}`}>
                              {formatEnum(app.status)}
                            </span>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2 items-center text-xs font-bold">
                            <span className={`inline-flex px-2 py-0.5 rounded-lg text-[10px] border ${getJobTypeStyle(app.job_type)}`}>
                              {formatEnum(app.job_type)}
                            </span>
                            <span className="inline-flex items-center gap-1 text-slate-450 dark:text-slate-400 text-[10px]">
                              <Calendar className="w-3.5 h-3.5" />
                              {formatDate(app.applied_date)}
                            </span>
                          </div>

                          {app.notes && (
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl mt-3.5 line-clamp-2 leading-relaxed border border-slate-100 dark:border-slate-850/60 font-medium">
                              {app.notes}
                            </p>
                          )}
                        </div>

                        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-850/60 flex items-center justify-end gap-2.5">
                          <button
                            onClick={() => navigate(`/view/${app.id}`)}
                            className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white font-bold text-xs py-1.5 px-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>
                          <button
                            onClick={() => navigate(`/edit/${app.id}`)}
                            className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-bold text-xs py-1.5 px-2.5 hover:bg-blue-50/50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteClick(app.id)}
                            className="flex items-center gap-1 text-slate-400 dark:text-slate-550 hover:text-rose-600 dark:hover:text-rose-450 font-bold text-xs py-1.5 px-2.5 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination footer alignment bar */}
                  {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-150/55 dark:border-slate-850 p-5 gap-4" id="pagination-panel">
                      <span className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest text-center sm:text-left select-none">
                        Showing <span className="text-slate-800 dark:text-slate-200">{(page - 1) * limit + 1}</span> to{' '}
                        <span className="text-slate-800 dark:text-slate-200">{Math.min(page * limit, totalCount)}</span> of{' '}
                        <span className="text-slate-950 dark:text-white font-extrabold">{totalCount}</span> results
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          disabled={page === 1}
                          className={`w-9 h-9 rounded-xl border transition-colors flex items-center justify-center cursor-pointer ${
                            page === 1 
                              ? 'text-slate-300 border-slate-100 dark:border-slate-900 cursor-not-allowed bg-transparent dark:text-slate-700' 
                              : 'text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 bg-white dark:bg-transparent'
                          }`}
                          title="Prev Page"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        
                        <div className="flex items-center gap-1">
                          {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setPage(i + 1)}
                              className={`w-9 h-9 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                                page === i + 1
                                  ? 'bg-blue-600 text-white border border-transparent shadow-none'
                                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 border border-slate-200 dark:border-slate-800 dark:hover:bg-slate-850'
                              }`}
                            >
                              {i + 1}
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                          disabled={page === totalPages}
                          className={`w-9 h-9 rounded-xl border transition-colors flex items-center justify-center cursor-pointer ${
                            page === totalPages 
                              ? 'text-slate-300 border-slate-100 dark:border-slate-900 cursor-not-allowed bg-transparent dark:text-slate-700' 
                              : 'text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 bg-white dark:bg-transparent'
                          }`}
                          title="Next Page"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Confirmation Deletion Modal overlay */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-55 overflow-y-auto" id="delete-confirmation-modal">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteId(null)}
              className="fixed inset-0 bg-black/45 backdrop-blur-xs"
            />

            {/* Modal Body Wrapper */}
            <div className="flex min-h-full items-center justify-center p-4 relative z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="relative transform overflow-hidden rounded-2xl bg-white dark:bg-[#0c101d] p-6 shadow-2xl transition-all max-w-md w-full border border-slate-150 dark:border-slate-850"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-xl text-rose-500 flex-shrink-0">
                    <Trash2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-6 font-sans">Delete Application?</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                      Are you sure you want to delete this job application? This action is permanent and cannot be undone. All saved milestones and notes for this entry will be deleted.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-50 dark:border-slate-800 pt-4">
                  <button
                    type="button"
                    onClick={() => setDeleteId(null)}
                    disabled={isDeleting}
                    className="px-4.5 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDelete}
                    disabled={isDeleting}
                    className="px-4.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 shadow-none"
                    id="confirm-delete-application-btn"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete Permanently'}
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
