"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BarChart2 } from "lucide-react";

interface WeeklyCompletionChartProps {
  data: {
    day: string;
    completed: number;
    eligible: number;
    rate: number;
  }[];
}

export function WeeklyCompletionChart({ data }: WeeklyCompletionChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const maxRate = Math.max(...data.map((d) => d.rate), 100);

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-neutral-800/90 bg-neutral-900/50 p-6 backdrop-blur-md shadow-xl">
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <BarChart2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Day of Week Activity
            </h3>
            <p className="text-xs text-neutral-400 font-medium">
              Average check-in consistency across days
            </p>
          </div>
        </div>
      </div>

      {/* Bar Chart Grid */}
      <div className="relative flex h-52 items-end justify-between gap-2 sm:gap-4 px-2 pt-6 pb-2">
        {data.map((item, idx) => {
          const heightPercent = item.eligible > 0 ? (item.rate / maxRate) * 100 : 0;
          const isHovered = hoveredIndex === idx;

          return (
            <div
              key={item.day}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative flex flex-1 flex-col items-center h-full justify-end group cursor-pointer"
            >
              {/* Tooltip */}
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 5, scale: 0.9 }}
                  animate={{ opacity: 1, y: -5, scale: 1 }}
                  className="absolute -top-12 z-30 flex flex-col items-center rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-1.5 shadow-2xl backdrop-blur-md pointer-events-none whitespace-nowrap"
                >
                  <span className="text-xs font-bold text-white">
                    {item.day}: {item.rate}%
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    {item.completed} / {item.eligible} check-ins
                  </span>
                </motion.div>
              )}

              {/* Bar track container */}
              <div className="relative w-full max-w-[40px] flex-1 rounded-xl bg-neutral-950/80 border border-neutral-800/60 overflow-hidden flex items-end p-1">
                <motion.div
                  initial={shouldReduceMotion ? { height: `${heightPercent}%` } : { height: 0 }}
                  animate={{ height: `${heightPercent}%` }}
                  transition={{ duration: 0.6, delay: idx * 0.05, ease: "easeOut" }}
                  className={`w-full rounded-lg transition-all duration-300 ${
                    item.rate >= 80
                      ? "bg-gradient-to-t from-emerald-600 to-teal-400 shadow-md shadow-emerald-500/20"
                      : item.rate >= 50
                      ? "bg-gradient-to-t from-blue-600 to-indigo-400 shadow-md shadow-blue-500/20"
                      : "bg-gradient-to-t from-purple-600 to-indigo-500 shadow-md shadow-purple-500/20"
                  } ${isHovered ? "brightness-125 scale-x-105" : ""}`}
                />
              </div>

              {/* Label */}
              <span
                className={`mt-3 text-xs font-bold transition-colors ${
                  isHovered ? "text-blue-400" : "text-neutral-400"
                }`}
              >
                {item.day}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-neutral-800/60 pt-3 text-[11px] font-semibold text-neutral-400">
        <span>0%</span>
        <span>50%</span>
        <span>100% Target</span>
      </div>
    </div>
  );
}
