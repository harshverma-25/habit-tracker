"use client";

import React from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface MonthSelectorProps {
  monthName: string;
  year: number;
}

export function MonthSelector({ monthName, year }: MonthSelectorProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-3.5 sm:px-5">
      {/* Current Month & Year Display */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-800/80 text-blue-400 border border-neutral-700/50">
          <Calendar className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight sm:text-xl">
            {monthName} {year}
          </h2>
          <p className="text-xs text-neutral-400">Prototype Static Mode (Phase 1)</p>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center gap-2">
        <button
          disabled
          title="Previous Month (Phase 3)"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-500 opacity-60 cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="rounded-md bg-neutral-800/60 px-3 py-1 text-xs font-semibold text-neutral-300 border border-neutral-700/40">
          {monthName}
        </span>
        <button
          disabled
          title="Next Month (Phase 3)"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-500 opacity-60 cursor-not-allowed transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
