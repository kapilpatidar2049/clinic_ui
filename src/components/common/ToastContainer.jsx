import React from 'react';
import { useToast } from '../../context/ToastContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const STYLES = {
  success: 'bg-emerald-900/95 text-emerald-100 border-emerald-700 shadow-emerald-900/30',
  error: 'bg-rose-900/95 text-rose-100 border-rose-700 shadow-rose-900/30',
  warning: 'bg-amber-900/95 text-amber-100 border-amber-700 shadow-amber-900/30',
  info: 'bg-slate-900/95 text-slate-100 border-slate-700 shadow-slate-900/30',
};

const ICON_COLORS = {
  success: 'text-emerald-400',
  error: 'text-rose-400',
  warning: 'text-amber-400',
  info: 'text-cyan-400',
};

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      className="fixed z-50 bottom-5 right-5 sm:bottom-6 sm:right-6 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type] || ICONS.info;
        const colorClass = STYLES[toast.type] || STYLES.info;
        const iconColor = ICON_COLORS[toast.type] || ICON_COLORS.info;

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl border backdrop-blur-md shadow-xl text-xs sm:text-sm font-medium transition-all duration-200 animate-in fade-in slide-in-from-bottom-3 ${colorClass}`}
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 leading-snug break-words">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 -mr-1 -mt-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;

