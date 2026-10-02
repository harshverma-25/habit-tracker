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
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative flex min-h-[320px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-neutral-800/80 bg-neutral-900/30 p-8 text-center backdrop-blur-sm"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-3xl" />

      {/* Target Icon with subtle bounce */}
      <motion.div
        animate={shouldReduceMotion ? {} : { y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/10 text-blue-400 border border-blue-500/30 shadow-xl mb-4"
      >
        <Target className="h-8 w-8" />
      </motion.div>

      <h3 className="text-xl font-extrabold text-white tracking-tight mb-2">
        You don&apos;t have any habits yet
      </h3>

      <p className="max-w-sm text-sm font-medium text-neutral-400 mb-6 leading-relaxed">
        Start building consistency today. Add your first small daily routine to begin tracking progress.
      </p>

      <motion.button
        whileHover={shouldReduceMotion ? {} : { scale: 1.04, y: -2 }}
        whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
        onClick={onAddClick}
        className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-xl shadow-blue-500/25 hover:from-blue-500 hover:to-indigo-500 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <PlusCircle className="h-4.5 w-4.5" />
        <span>Create your first habit</span>
      </motion.button>
    </motion.div>
  );
}
