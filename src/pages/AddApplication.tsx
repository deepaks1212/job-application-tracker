import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, ArrowLeft, Save, Sparkles, Building, AlertCircle } from 'lucide-react';
import { ApplicationAPI } from '../services/api';
import { useToast } from '../components/Toast';

export default function AddApplication() {
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState({
    company_name: '',
    job_title: '',
    job_type: 'INTERNSHIP',
    status: 'APPLIED',
    applied_date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const tempErrors: Record<string, string> = {};

    if (!form.company_name.trim()) {
      tempErrors.company_name = 'Company name is required';
    } else if (form.company_name.trim().length < 2) {
      tempErrors.company_name = 'Company name must be at least 2 characters';
    }

    if (!form.job_title.trim()) {
      tempErrors.job_title = 'Job title is required';
    }

    if (!form.applied_date) {
      tempErrors.applied_date = 'Applied date is required';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error dynamically
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the validation errors on the form.', 'Validation Error');
      return;
    }

    try {
      setSubmitting(true);
      await ApplicationAPI.create({
        company_name: form.company_name.trim(),
        job_title: form.job_title.trim(),
        job_type: form.job_type as any,
        status: form.status as any,
        applied_date: form.applied_date,
        notes: form.notes.trim() || null,
      });

      toast.success(`${form.company_name} application tracked successfully!`, 'Application Added');

      const isAllNotifyEnabled = localStorage.getItem('notifications_all') !== 'false';
      if (isAllNotifyEnabled) {
        if (form.status === 'APPLIED' && localStorage.getItem('notifications_applied') !== 'false') {
          setTimeout(() => {
            toast.info(`Status "Applied" active for ${form.company_name}. We will trace follow-up dates & countdown milestones!`, 'Applied Milestone Alert 🚀');
          }, 300);
        } else if (form.status === 'REJECTED' && localStorage.getItem('notifications_rejected') !== 'false') {
          setTimeout(() => {
            const name = localStorage.getItem('candidate_name') || 'Dipak';
            toast.info(`"Every delay is not a denial. Keep your head high, ${name}! The right opportunity is waiting."`, 'Momentum Boost 💪');
          }, 300);
        }
      }

      navigate('/');
    } catch (err: any) {
      console.error('Error adding application:', err);
      if (err.response?.data?.details) {
        // Validation errors from backend
        const bgErrors: Record<string, string> = {};
        err.response.data.details.forEach((det: any) => {
          bgErrors[det.field] = det.message;
        });
        setErrors(bgErrors);
        toast.error('The backend rejected the request payload.', 'Submission Rejected');
      } else {
        toast.error('An error occurred. Please try again.', 'Error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6" id="add-application-container">
      {/* Back link bar */}
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        id="btn-back-to-dashboard"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to applications</span>
      </button>

      {/* Main card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl p-6 sm:p-8 shadow-xs transition-colors duration-200">
        <div className="flex items-center gap-3 border-b border-slate-50 dark:border-slate-800 pb-5 mb-6">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-xl text-blue-600 dark:text-blue-400">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-950 dark:text-white font-sans">Track New Job Application</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Fill out the role details below to monitor your screening stage progression.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" id="add-application-form">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Company Name */}
            <div className="space-y-1.5 col-span-1">
              <label htmlFor="company_name" className="text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider block">
                Company Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
                <input
                  type="text"
                  id="company_name"
                  name="company_name"
                  value={form.company_name}
                  onChange={handleChange}
                  placeholder="e.g. Google, Apple, Stripe"
                  maxLength={100}
                  className={`w-full pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900/80 focus:bg-white dark:focus:bg-slate-950 border rounded-xl outline-none transition-all duration-200 ${
                    errors.company_name ? 'border-rose-400 dark:border-rose-500 focus:border-rose-500 focus:ring-rose-100' : 'border-transparent dark:border-slate-850 focus:border-blue-500'
                  }`}
                  required
                />
              </div>
              {errors.company_name && (
                <p className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.company_name}</span>
                </p>
              )}
            </div>

            {/* Job Title */}
            <div className="space-y-1.5 col-span-1">
              <label htmlFor="job_title" className="text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider block">
                Job Title <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
                <input
                  type="text"
                  id="job_title"
                  name="job_title"
                  value={form.job_title}
                  onChange={handleChange}
                  placeholder="e.g. Software Engineer Intern"
                  maxLength={100}
                  className={`w-full pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900/80 focus:bg-white dark:focus:bg-slate-950 border rounded-xl outline-none transition-all duration-200 ${
                    errors.job_title ? 'border-rose-400 dark:border-rose-500 focus:border-rose-500' : 'border-transparent dark:border-slate-850 focus:border-blue-500'
                  }`}
                  required
                />
              </div>
              {errors.job_title && (
                <p className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.job_title}</span>
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Job Type */}
            <div className="space-y-1.5 col-span-1">
              <label htmlFor="job_type" className="text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider block">
                Job Type <span className="text-rose-500">*</span>
              </label>
              <select
                id="job_type"
                name="job_type"
                value={form.job_type}
                onChange={handleChange}
                className="w-full px-3 py-2.5 text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 border border-transparent dark:border-slate-850 focus:border-blue-500 rounded-xl outline-none transition-all cursor-pointer"
              >
                <option value="INTERNSHIP" className="dark:bg-slate-950">Internship</option>
                <option value="FULL_TIME" className="dark:bg-slate-950">Full-time</option>
                <option value="PART_TIME" className="dark:bg-slate-950">Part-time</option>
              </select>
            </div>

            {/* Status */}
            <div className="space-y-1.5 col-span-1">
              <label htmlFor="status" className="text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider block">
                Status <span className="text-rose-500">*</span>
              </label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-3 py-2.5 text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 border border-transparent dark:border-slate-850 focus:border-blue-500 rounded-xl outline-none transition-all cursor-pointer"
              >
                <option value="APPLIED" className="dark:bg-slate-950">Applied</option>
                <option value="INTERVIEWING" className="dark:bg-slate-950">Interviewing</option>
                <option value="OFFER" className="dark:bg-slate-950">Offer</option>
                <option value="REJECTED" className="dark:bg-slate-950">Rejected</option>
              </select>
            </div>

            {/* Applied Date */}
            <div className="space-y-1.5 col-span-1">
              <label htmlFor="applied_date" className="text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider block">
                Applied Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                id="applied_date"
                name="applied_date"
                value={form.applied_date}
                onChange={handleChange}
                className={`w-full px-3.5 py-2.5 text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 border rounded-xl outline-none transition-all cursor-pointer ${
                  errors.applied_date ? 'border-rose-400 dark:border-rose-500 focus:border-rose-500' : 'border-transparent dark:border-slate-850 focus:border-blue-500'
                }`}
                required
              />
              {errors.applied_date && (
                <p className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.applied_date}</span>
                </p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label htmlFor="notes" className="text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider block">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Keep track of interviews, interviewers, compensation, resources, contact information, or portfolio links..."
              rows={4}
              maxLength={1500}
              className="w-full px-4 py-3 text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900/80 focus:bg-white dark:focus:bg-slate-950 border border-transparent dark:border-slate-850 focus:border-blue-500 rounded-xl outline-none transition-all resize-none leading-relaxed"
            />
          </div>

          {/* Actions panel */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-50 dark:border-slate-800 mt-8">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-5 py-2.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-none"
              id="btn-add-application-submit"
            >
              <Save className="w-4 h-4" />
              <span>{submitting ? 'Saving Application...' : 'Save Job Record'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
