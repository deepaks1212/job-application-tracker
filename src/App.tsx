import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Briefcase, LayoutDashboard, PlusCircle, Settings, Menu, X, 
  Sun, Moon, List, TrendingUp, ChevronDown 
} from 'lucide-react';
import { ToastProvider } from './components/Toast';
import Dashboard from './pages/Dashboard';
import AddApplication from './pages/AddApplication';
import EditApplication from './pages/EditApplication';
import ViewApplication from './pages/ViewApplication';
import Statistics from './pages/Statistics';
import SettingsPage from './pages/Settings';

function AppContent() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Candidate Profile State
  const [candidateName, setCandidateName] = useState('Dipak Mandal');
  const [candidateEmail, setCandidateEmail] = useState('dipak26@gmail.com');

  useEffect(() => {
    const savedName = localStorage.getItem('candidate_name');
    const savedEmail = localStorage.getItem('candidate_email');
    if (savedName) setCandidateName(savedName);
    if (savedEmail) setCandidateEmail(savedEmail);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 dark:bg-[#030712] font-sans text-slate-800 dark:text-slate-100 overflow-hidden transition-colors duration-300" id="tracker-app-shell">
      
      {/* Mobile Top Header Bar */}
      <div className="flex md:hidden items-center justify-between px-5 h-16 bg-white dark:bg-slate-900 text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-800 z-50">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Job Tracker</span>
        </Link>
        <div className="flex items-center gap-2">
          {/* Mobile Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            title={darkMode ? "Light Code" : "Dark Code"}
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-indigo-500" />}
          </button>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar - Persistent on Desktop, Overlay on Mobile */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-[#0b0f19] text-slate-650 flex flex-col border-r border-slate-200/80 dark:border-slate-850 transform transition-transform duration-205 ease-in-out md:translate-x-0 md:static h-screen
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Header */}
        <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-850">
          <Link to="/" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-sm shadow-blue-100 dark:shadow-none">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Job Tracker</span>
          </Link>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden text-slate-400 hover:text-slate-850 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {/* Dashboard */}
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 ${
              isActive('/') 
                ? 'bg-blue-50/70 text-blue-600 font-bold dark:bg-blue-950/30 dark:text-blue-400' 
                : 'hover:bg-slate-50 hover:text-slate-900 text-slate-500 font-medium dark:hover:bg-slate-900 dark:hover:text-white dark:text-slate-400'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>

          {/* Add Application */}
          <Link
            to="/add"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 ${
              isActive('/add') 
                ? 'bg-blue-50/70 text-blue-600 font-bold dark:bg-blue-950/30 dark:text-blue-400' 
                : 'hover:bg-slate-50 hover:text-slate-900 text-slate-500 font-medium dark:hover:bg-slate-900 dark:hover:text-white dark:text-slate-400'
            }`}
          >
            <PlusCircle className="w-5 h-5" />
            <span>Add Application</span>
          </Link>

          {/* Statistics */}
          <Link
            to="/statistics"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 ${
              isActive('/statistics') 
                ? 'bg-blue-50/70 text-blue-600 font-bold dark:bg-blue-950/30 dark:text-blue-400' 
                : 'hover:bg-slate-50 hover:text-slate-900 text-slate-500 font-medium dark:hover:bg-slate-900 dark:hover:text-white dark:text-slate-400'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span>Statistics</span>
          </Link>

          {/* Settings */}
          <Link
            to="/settings"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 ${
              isActive('/settings') 
                ? 'bg-blue-50/70 text-blue-600 font-bold dark:bg-blue-950/30 dark:text-blue-400' 
                : 'hover:bg-slate-50 hover:text-slate-900 text-slate-500 font-medium dark:hover:bg-slate-900 dark:hover:text-white dark:text-slate-400'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
        </nav>

        {/* Bottom Panel with Dark Mode Block & User info */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-850 space-y-3.5 bg-slate-50/20 dark:bg-transparent">
          
          {/* Dark Mode Pilled Card Toggler */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070b13]/60 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-350 transition-all cursor-pointer shadow-xs"
            title={darkMode ? "Switch to light theme" : "Switch to dark theme"}
          >
            <div className="flex items-center gap-2.5">
              {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-500" />}
              <span className="text-xs font-bold leading-none">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </div>
            {/* Custom iOS Slid Switch visual */}
            <div className={`w-7.5 h-4.5 rounded-full p-0.5 transition-colors duration-200 ${darkMode ? 'bg-blue-600' : 'bg-slate-205 bg-slate-300'}`}>
              <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform duration-200 ${darkMode ? 'translate-x-3' : 'translate-x-0'}`} />
            </div>
          </button>

          {/* Professional User Profile block */}
          <div className="flex items-center justify-between p-1 rounded-2xl bg-[#f8fafc]/90 dark:bg-[#121824] border border-slate-150/40 dark:border-slate-850/60 transition-colors">
            <div className="flex items-center gap-2.5 p-1.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-blue-105 bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-extrabold text-sm flex items-center justify-center shrink-0 border border-blue-50 dark:border-blue-900/10">
                {candidateName.split(' ').map((n: string) => n[0]).join('')}
              </div>
              <div className="min-w-0 leading-tight">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{candidateName}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-450 truncate mt-0.5">{candidateEmail}</div>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-30 md:hidden"
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<AddApplication />} />
            <Route path="/edit/:id" element={<EditApplication />} />
            <Route path="/view/:id" element={<ViewApplication />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
        
        {/* Simple professional footer */}
        <footer className="w-full bg-white dark:bg-[#070b13] border-t border-slate-201 border-slate-200/60 dark:border-slate-850 py-5 px-6 md:px-8 text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-auto transition-colors duration-300">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 pb-1 sm:pb-0">
              <span className="font-bold text-slate-600 dark:text-slate-400">Job Tracker Portfolio</span>
             
            </div>
            <div />
          </div>
        </footer>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ToastProvider>
  );
}
