"use client";

import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MonthSelectorProps {
  monthName: string;
  year: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectCurrentMonth?: () => void;
}

export function MonthSelector({
  monthName,
  year,
  onPrevMonth,
  onNextMonth,
  onSelectCurrentMonth,
}: MonthSelectorProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="flex items-center justify-between gap-3 bg-neutral-900 border border-neutral-800 px-4 py-2.5 rounded-lg">
      {/* Current Month & Year Display */}
      <div className="flex items-center gap-3">
        <div className="relative overflow-hidden h-6 min-w-[130px] sm:min-w-[160px] flex items-center">
          <AnimatePresence mode="wait">
            <motion.h2
              key={`${monthName}-${year}`}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
              transition={{ duration: 0.15, ease: "easeInOut" }}
              className="text-sm sm:text-base font-bold text-white tracking-wider uppercase font-mono"
            >
              {monthName} {year}
            </motion.h2>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onPrevMonth}
          title="Previous Month"
          aria-label="Previous Month"
          className="flex h-7 w-7 items-center justify-center rounded border border-neutral-700 bg-neutral-950 text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {onSelectCurrentMonth && (
          <button
            onClick={onSelectCurrentMonth}
            title="Jump to current month"
            aria-label="Jump to current month"
            className="h-7 rounded border border-neutral-700 bg-neutral-950 px-2.5 text-xs font-semibold text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400"
          >
            Today
          </button>
        )}

        <button
          onClick={onNextMonth}
          title="Next Month"
          aria-label="Next Month"
          className="flex h-7 w-7 items-center justify-center rounded border border-neutral-700 bg-neutral-950 text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

