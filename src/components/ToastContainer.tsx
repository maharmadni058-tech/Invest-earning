import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-4 right-2 sm:right-4 z-50 flex flex-col gap-2 max-w-[calc(100vw-16px)] sm:max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let borderClass = 'border-amber-500/40';
        let bgClass = 'bg-[#12141a]/95';
        let Icon = Info;
        let iconColor = 'text-amber-400';

        if (toast.type === 'success') {
          borderClass = 'border-emerald-500/40';
          Icon = CheckCircle2;
          iconColor = 'text-emerald-400';
        } else if (toast.type === 'error') {
          borderClass = 'border-rose-500/40';
          Icon = AlertCircle;
          iconColor = 'text-rose-400';
        } else if (toast.type === 'warning') {
          borderClass = 'border-amber-400/50';
          Icon = AlertTriangle;
          iconColor = 'text-amber-300';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border ${borderClass} ${bgClass} backdrop-blur-md shadow-2xl transition-all duration-200 animate-in fade-in slide-in-from-bottom-2`}
          >
            <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white tracking-wide uppercase">{toast.title}</p>
              <p className="text-xs text-zinc-300 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-zinc-400 hover:text-white p-1 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
