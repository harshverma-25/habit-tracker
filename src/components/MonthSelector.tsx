"use client";

import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

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
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 rounded-2xl border border-neutral-800/90 bg-neutral-900/50 p-3.5 sm:px-6 backdrop-blur-md shadow-xl"
    >
      {/* Current Month & Year Display */}
      <div className="flex items-center gap-3">
        <motion.div
          whileHover={shouldReduceMotion ? {} : { rotate: 12, scale: 1.05 }}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30 shadow-inner"
        >
          <CalendarIcon className="h-5 w-5" />
        </motion.div>
        <div>
          <div className="relative overflow-hidden h-7 min-w-[130px] sm:min-w-[150px]">
            <AnimatePresence mode="wait">
              <motion.h2
                key={`${monthName}-${year}`}
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="absolute text-base sm:text-xl font-extrabold text-white tracking-tight"
              >
                {monthName} {year}
              </motion.h2>
            </AnimatePresence>
          </div>
          <p className="text-[11px] sm:text-xs font-medium text-neutral-400">Dynamic Monthly Grid</p>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center gap-2">
        <motion.button
          whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
          onClick={onPrevMonth}
          title="Previous Month"
          aria-label="Previous Month"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-950 text-neutral-300 hover:bg-neutral-800 hover:border-neutral-700 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <ChevronLeft className="h-5 w-5" />
        </motion.button>

        {onSelectCurrentMonth && (
          <motion.button
            whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            onClick={onSelectCurrentMonth}
            title="Jump to current month"
            aria-label="Jump to current month"
            className="h-10 rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 text-xs font-semibold text-neutral-300 hover:bg-neutral-800 hover:border-neutral-700 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Today
          </motion.button>
        )}

        <motion.button
          whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
          onClick={onNextMonth}
          title="Next Month"
          aria-label="Next Month"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-950 text-neutral-300 hover:bg-neutral-800 hover:border-neutral-700 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <ChevronRight className="h-5 w-5" />
        </motion.button>
      </div>
    </motion.div>
  );
}
