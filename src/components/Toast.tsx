import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContext, useToastState } from '../hooks/useToast';
import type { Toast as ToastType } from '../types';

const TOAST_STYLES: Record<ToastType['type'], { bg: string; defaultIcon: string }> = {
  success:     { bg: 'bg-green-500',  defaultIcon: '' },
  achievement: { bg: 'bg-purple-500', defaultIcon: '' },
  levelup:     { bg: 'bg-amber-500',  defaultIcon: '' },
  reward:      { bg: 'bg-blue-500',   defaultIcon: '' },
  info:        { bg: 'bg-gray-700',   defaultIcon: '' },
};

function ToastItem({ toast, onDismiss }: { toast: ToastType; onDismiss: (id: string) => void }) {
  const style = TOAST_STYLES[toast.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`${style.bg} text-white rounded-xl px-4 py-3 shadow-lg flex items-center gap-3 min-w-[280px] max-w-[340px]`}
      onClick={() => onDismiss(toast.id)}
    >
      <span className="text-xl flex-shrink-0">{toast.icon || style.defaultIcon}</span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">{toast.title}</p>
        {toast.message && (
          <p className="text-xs text-white/80 mt-0.5 truncate">{toast.message}</p>
        )}
      </div>
    </motion.div>
  );
}

export function ToastContainer() {
  const { toasts, dismissToast } = React.useContext(ToastContext)!;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map(toast => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onDismiss={dismissToast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toastState = useToastState();

  return (
    <ToastContext.Provider value={toastState}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}
