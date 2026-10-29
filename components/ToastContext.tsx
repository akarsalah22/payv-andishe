"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Check, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastOptions {
  type?: ToastType;
  link?: { href: string; label: string };
  duration?: number;
}

interface ToastData {
  id: number;
  message: string;
  type: ToastType;
  link?: { href: string; label: string };
}

interface ToastContextValue {
  showToast: (message: string, options?: ToastOptions) => void;
  success: (message: string, link?: { href: string; label: string }) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastData | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const hideToast = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setToast(null);
  }, []);

  const showToast = useCallback((message: string, options?: ToastOptions) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const type = options?.type || 'success';
    const link = options?.link;
    const duration = options?.duration || 4500;
    const id = Date.now();

    setToast({ id, message, type, link });

    timerRef.current = setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, duration);
  }, []);

  const success = useCallback((message: string, link?: { href: string; label: string }) => {
    showToast(message, { type: 'success', link });
  }, [showToast]);

  const error = useCallback((message: string) => {
    showToast(message, { type: 'error' });
  }, [showToast]);

  const info = useCallback((message: string) => {
    showToast(message, { type: 'info' });
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info }}>
      {children}
      {toast && (
        <div
          dir="rtl"
          role="status"
          aria-live="polite"
          className="fixed bottom-6 start-6 z-50 flex items-center justify-between gap-3 px-4 sm:px-5 py-3 rounded-2xl bg-[#18191d] text-zinc-200 border border-zinc-800 shadow-2xl shadow-black/50 animate-in fade-in slide-in-from-bottom-3 duration-200 min-w-[280px] max-w-md select-none"
        >
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium font-sirwan text-zinc-200">
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" strokeWidth={2} />
            ) : toast.type === 'info' ? (
              <Info className="w-4 h-4 text-[#d49757] shrink-0" strokeWidth={2} />
            ) : (
              <Check className="w-4 h-4 text-emerald-500 shrink-0" strokeWidth={2.25} />
            )}
            <span>{toast.message}</span>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {toast.link && (
              <Link
                href={toast.link.href}
                className="text-xs font-semibold font-sirwan text-amber-400 hover:text-amber-300 underline underline-offset-4 decoration-amber-400/50 hover:decoration-amber-300 transition-colors"
                onClick={hideToast}
              >
                {toast.link.label}
              </Link>
            )}
            <button
              type="button"
              onClick={hideToast}
              className="p-1 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60 transition-colors cursor-pointer tap-highlight-transparent"
              aria-label="داخستن"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      showToast: () => {},
      success: () => {},
      error: () => {},
      info: () => {},
    };
  }
  return context;
}

