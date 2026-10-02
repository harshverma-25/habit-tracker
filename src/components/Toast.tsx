"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
  duration?: number;
}

export function Toast({ toast, onClose, duration = 4000 }: ToastProps) {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [toast, duration, onClose]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 15, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          role="status"
          aria-live="polite"
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 flex max-w-md items-center gap-3 rounded-2xl border border-neutral-800/90 bg-neutral-900/95 p-4 shadow-2xl backdrop-blur-xl"
        >
          {/* Icon */}
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
              toast.type === "error"
                ? "border-rose-500/30 bg-rose-500/10 text-rose-400"
                : toast.type === "success"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border-blue-500/30 bg-blue-500/10 text-blue-400"
            }`}
          >
            {toast.type === "error" ? (
              <AlertCircle className="h-5 w-5" />
            ) : toast.type === "success" ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <Info className="h-5 w-5" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 pr-1">
            {toast.title && (
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                {toast.title}
              </h4>
            )}
            <p className="text-sm font-medium text-neutral-200">{toast.message}</p>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close notification"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Progress bar line */}
          {!shouldReduceMotion && (
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: duration / 1000, ease: "linear" }}
              className={`absolute bottom-0 left-3 right-3 h-0.5 origin-left rounded-full ${
                toast.type === "error"
                  ? "bg-rose-500/60"
                  : toast.type === "success"
                  ? "bg-emerald-500/60"
                  : "bg-blue-500/60"
              }`}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
