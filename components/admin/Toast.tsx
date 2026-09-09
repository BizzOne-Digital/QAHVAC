'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

type ToastTone = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  tone: ToastTone;
  message: string;
}

interface ToastContextValue {
  toast: (message: string, tone?: ToastTone) => void;
  success: (message: string) => void;
  error: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TONE_STYLES: Record<ToastTone, string> = {
  success: 'border-l-ink',
  error: 'border-l-urgent',
  info: 'border-l-line-strong',
};

const TONE_LABELS: Record<ToastTone, string> = {
  success: 'Done',
  error: 'Problem',
  info: 'Note',
};

let nextId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, tone: ToastTone = 'info') => {
      const id = ++nextId;
      setToasts(prev => [...prev, { id, tone, message }]);
      setTimeout(() => dismiss(id), tone === 'error' ? 7000 : 4500);
    },
    [dismiss]
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      toast,
      success: (message: string) => toast(message, 'success'),
      error: (message: string) => toast(message, 'error'),
    }),
    [toast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div
        aria-live="polite"
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 w-[min(22rem,calc(100vw-3rem))]"
      >
        {toasts.map(t => (
          <div
            key={t.id}
            role="status"
            className={`bg-surface border border-line border-l-2 ${TONE_STYLES[t.tone]} px-4 py-3 shadow-[0_8px_24px_-12px_rgba(20,22,26,0.35)]`}
          >
            <div className="flex items-baseline justify-between gap-4">
              <span className="type-label text-ink-3">{TONE_LABELS[t.tone]}</span>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss notification"
                className="type-meta text-ink-3 hover:text-ink transition-colors"
              >
                Close
              </button>
            </div>
            <p className="type-small text-ink mt-1.5">{t.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used inside <ToastProvider>.');
  }
  return ctx;
}
