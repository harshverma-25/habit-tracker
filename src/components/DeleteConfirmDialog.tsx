"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

interface DeleteConfirmModalProps {
  habitName: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmDialog({
  habitName,
  isOpen,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  const shouldReduceMotion = useReducedMotion();

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.15 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            className="relative z-10 w-full max-w-sm overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950 p-5 text-center"
          >
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="absolute right-3 top-3 rounded p-1 text-neutral-400 hover:bg-neutral-900 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-900 text-neutral-300 border border-neutral-800 mb-3">
              <AlertTriangle className="h-5 w-5" />
            </div>

            <h3 id="delete-dialog-title" className="text-sm font-bold text-white uppercase tracking-wide">
              Delete &quot;{habitName}&quot;?
            </h3>
            <p className="mt-1.5 text-xs text-neutral-400 leading-relaxed">
              This will permanently remove this habit and its completion records. This action cannot be undone.
            </p>

            <div className="mt-5 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-md border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-neutral-300 hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="flex-1 rounded-md bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-950 transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

