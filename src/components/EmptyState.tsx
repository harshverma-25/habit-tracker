"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { PlusCircle, Target } from "lucide-react";

interface EmptyStateProps {
  onAddClick: () => void;
}

export function EmptyState({ onAddClick }: EmptyStateProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="flex min-h-[300px] w-full flex-col items-center justify-center rounded-lg border border-dashed border-neutral-800 bg-neutral-900/40 p-8 text-center"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-300 mb-4">
        <Target className="h-6 w-6" />
      </div>

      <h3 className="text-base font-bold text-white tracking-wide uppercase mb-1">
        No habits created yet
      </h3>

      <p className="max-w-sm text-xs text-neutral-400 mb-5 leading-relaxed">
        Start building daily consistency. Add your first habit to begin check-in tracking.
      </p>

      <button
        onClick={onAddClick}
        className="inline-flex items-center gap-2 rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-950 px-4 py-2 text-xs font-bold transition-colors"
      >
        <PlusCircle className="h-4 w-4" />
        <span>Create your first habit</span>
      </button>
    </motion.div>
  );
}

