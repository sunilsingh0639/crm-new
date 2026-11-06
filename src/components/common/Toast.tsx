import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface Toast { id: string; message: string; type: 'success' | 'error' | 'info' | 'warning'; }
interface ToastContextType { toast: (message: string, type?: Toast['type']) => void; }

const ToastContext = createContext<ToastContextType>({ toast: () => {} });
export const useToast = () => useContext(ToastContext);

const icons = { success: CheckCircle, error: AlertCircle, info: Info, warning: AlertTriangle };

const toastStyles: Record<Toast['type'], React.CSSProperties> = {
  success: {
    background: 'rgba(6, 30, 20, 0.88)',
    border: '1px solid rgba(16,185,129,0.35)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.40), 0 0 20px rgba(16,185,129,0.12), inset 0 1px 0 rgba(16,185,129,0.15)',
  },
  error: {
    background: 'rgba(30, 6, 6, 0.88)',
    border: '1px solid rgba(239,68,68,0.35)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.40), 0 0 20px rgba(239,68,68,0.12), inset 0 1px 0 rgba(239,68,68,0.15)',
  },
  info: {
    background: 'rgba(6, 15, 35, 0.88)',
    border: '1px solid rgba(59,130,246,0.35)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.40), 0 0 20px rgba(59,130,246,0.12), inset 0 1px 0 rgba(59,130,246,0.15)',
  },
  warning: {
    background: 'rgba(30, 20, 4, 0.88)',
    border: '1px solid rgba(245,158,11,0.35)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.40), 0 0 20px rgba(245,158,11,0.12), inset 0 1px 0 rgba(245,158,11,0.15)',
  },
};

const iconColors = { success: '#10b981', error: '#ef4444', info: '#3b82f6', warning: '#f59e0b' };

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4200);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2.5 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = icons[t.type];
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 60, scale: 0.88 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 60, scale: 0.88 }}
                transition={{ type: 'spring', damping: 24, stiffness: 280 }}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl pointer-events-auto min-w-[280px] max-w-[380px] relative overflow-hidden"
                style={{
                  ...toastStyles[t.type],
                  backdropFilter: 'blur(32px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(32px) saturate(180%)',
                }}
              >
                {/* Top highlight */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
                <Icon size={15} style={{ color: iconColors[t.type], flexShrink: 0 }} />
                <span className="text-sm font-medium text-white flex-1">{t.message}</span>
                <button
                  onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
                  className="text-slate-500 hover:text-slate-300 transition-colors shrink-0"
                >
                  <X size={13} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
