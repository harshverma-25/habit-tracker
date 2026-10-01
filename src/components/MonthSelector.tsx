"use client";

import React from "react";
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
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-3.5 sm:px-5">
      {/* Current Month & Year Display */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-800/80 text-blue-400 border border-neutral-700/50">
          <CalendarIcon className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight sm:text-xl">
            {monthName} {year}
          </h2>
          <p className="text-xs text-neutral-400">Dynamic Calendar Engine</p>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onPrevMonth}
          title="Previous Month"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors active:scale-95"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {onSelectCurrentMonth && (
          <button
            onClick={onSelectCurrentMonth}
            className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
          >
            Today
          </button>
        )}

        <button
          onClick={onNextMonth}
          title="Next Month"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors active:scale-95"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
