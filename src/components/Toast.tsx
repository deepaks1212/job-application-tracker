import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, title?: string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info', title?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const success = useCallback((message: string, title?: string) => showToast(message, 'success', title), [showToast]);
  const error = useCallback((message: string, title?: string) => showToast(message, 'error', title), [showToast]);
  const info = useCallback((message: string, title?: string) => showToast(message, 'info', title), [showToast]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full p-4 sm:p-0 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => {
            const isSuccess = toast.type === 'success';
            const isError = toast.type === 'error';
            const bgColor = isSuccess 
              ? 'bg-emerald-50 dark:bg-emerald-950/90 border-emerald-200 dark:border-emerald-900/40 shadow-emerald-100/10' 
              : isError 
                ? 'bg-rose-50 dark:bg-rose-950/90 border-rose-200 dark:border-rose-900/40 shadow-rose-100/10' 
                : 'bg-slate-50 dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 shadow-slate-100/10';
            const textColor = isSuccess ? 'text-emerald-800 dark:text-emerald-300' : isError ? 'text-rose-800 dark:text-rose-300' : 'text-slate-800 dark:text-slate-350';
            const iconColor = isSuccess ? 'text-emerald-500 dark:text-emerald-400' : isError ? 'text-rose-500 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400';
            const icon = isSuccess ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : isError ? <AlertCircle className="w-5 h-5 flex-shrink-0" /> : <Info className="w-5 h-5 flex-shrink-0" />;

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.15 }, y: -10, scale: 0.95 }}
                className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg ${bgColor} ${textColor}`}
                layout
              >
                <div className={iconColor}>{icon}</div>
                <div className="flex-1 min-w-0">
                  {toast.title && <h4 className="font-semibold text-sm leading-tight mb-1">{toast.title}</h4>}
                  <p className="text-xs leading-normal font-medium">{toast.message}</p>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 handle-toast-close"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
