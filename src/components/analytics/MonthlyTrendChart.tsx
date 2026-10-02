"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { TrendingUp } from "lucide-react";

interface MonthlyTrendChartProps {
  data: {
    weekLabel: string;
    weekNumber: number;
    completed: number;
    eligible: number;
    rate: number;
  }[];
}

export function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-neutral-800/90 bg-neutral-900/50 p-6 backdrop-blur-md shadow-xl">
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Weekly Completion Trends
            </h3>
            <p className="text-xs text-neutral-400 font-medium">
              Progress breakdown by week of the month
            </p>
          </div>
        </div>
      </div>

      {/* Weekly Progress Card List */}
      <div className="space-y-4 py-2">
        {data.map((week, idx) => {
          const isHovered = hoveredIndex === idx;

          return (
            <div
              key={week.weekLabel}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`group relative flex flex-col gap-2 rounded-xl border p-3.5 transition-all ${
                isHovered
                  ? "border-neutral-700 bg-neutral-800/60 shadow-lg"
                  : "border-neutral-800/60 bg-neutral-950/60"
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white tracking-wide">{week.weekLabel}</span>
                <div className="flex items-center gap-2">
                  <span className="text-neutral-400 font-medium">
                    {week.completed} / {week.eligible} completed
                  </span>
                  <span className="font-bold font-mono text-purple-400">{week.rate}%</span>
                </div>
              </div>

              {/* Progress Bar Track */}
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-neutral-900 p-0.5 border border-neutral-800/60">
                <motion.div
                  initial={shouldReduceMotion ? { width: `${week.rate}%` } : { width: 0 }}
                  animate={{ width: `${week.rate}%` }}
                  transition={{ duration: 0.6, delay: idx * 0.08, ease: "easeOut" }}
                  className={`h-full rounded-full transition-all ${
                    week.rate >= 80
                      ? "bg-gradient-to-r from-emerald-500 to-teal-400 shadow-sm shadow-emerald-500/30"
                      : week.rate >= 50
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 shadow-sm shadow-blue-500/30"
                      : "bg-gradient-to-r from-purple-500 to-pink-500 shadow-sm shadow-purple-500/30"
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-neutral-800/60 pt-3 text-[11px] font-semibold text-neutral-400">
        <span>Consistent habit growth</span>
        <span>Goal: 80%+</span>
      </div>
    </div>
  );
}
