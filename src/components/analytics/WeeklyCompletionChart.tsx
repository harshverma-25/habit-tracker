"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

  const maxCompleted = Math.max(...data.map((d) => d.completed), 1);

  return (
    <div
      role="region"
      aria-label="Day of week completion activity chart"
      className="flex flex-col justify-between rounded-lg border border-neutral-800 bg-neutral-900 p-4 sm:p-5 shadow-xl"
    >
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Weekly Activity
          </h3>
          <p className="text-xs text-neutral-400">
            Habit check-ins by day of the week
          </p>
        </div>
      </div>

      {/* Bar Chart Container */}
      <div className="relative flex h-44 items-end justify-between gap-2 sm:gap-3 px-1 pt-4 pb-1">
        {data.map((item, idx) => {
          const heightPercent = maxCompleted > 0 ? (item.completed / maxCompleted) * 100 : 0;
          const isHovered = hoveredIndex === idx;

          return (
            <div
              key={item.day}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              tabIndex={0}
              role="img"
              aria-label={`${item.day}: ${item.completed} completed check-ins (${item.rate}%)`}
              className="relative flex flex-1 flex-col items-center h-full justify-end group cursor-pointer focus-visible:outline-none"
            >
              {/* Tooltip */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: -4 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.1 }}
                    className="absolute -top-10 z-30 flex flex-col items-center rounded border border-neutral-700 bg-neutral-950 px-2.5 py-1 shadow-lg pointer-events-none whitespace-nowrap"
                  >
                    <span className="text-[11px] font-bold text-white font-mono">
                      {item.day}: {item.completed} done ({item.rate}%)
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bar Track Container */}
              <div className="relative w-full max-w-[36px] flex-1 rounded bg-neutral-950 border border-neutral-800 overflow-hidden flex items-end p-0.5">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercent}%` }}
                  transition={{ duration: 0.4, delay: idx * 0.03, ease: "easeOut" }}
                  className={`w-full rounded-sm transition-colors ${
                    isHovered ? "bg-white" : "bg-neutral-300"
                  }`}
                />
              </div>

              {/* Day Label */}
              <span
                className={`mt-2 text-[11px] font-mono font-semibold transition-colors ${
                  isHovered ? "text-white" : "text-neutral-400"
                }`}
              >
                {item.day}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-neutral-800 pt-2 text-[10px] font-mono text-neutral-500">
        <span>0</span>
        <span>{Math.round(maxCompleted / 2)}</span>
        <span>{maxCompleted} max</span>
      </div>
    </div>
  );
}

