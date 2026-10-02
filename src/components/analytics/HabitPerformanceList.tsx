"use client";

import React from "react";
import { motion } from "framer-motion";

interface HabitPerformance {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  completedCount: number;
  eligibleCount: number;
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
}

interface HabitPerformanceListProps {
  habits: HabitPerformance[];
}

export function HabitPerformanceList({ habits }: HabitPerformanceListProps) {
  // Sort habits by completion rate
  const sortedHabits = [...habits].sort((a, b) => b.completionRate - a.completionRate);

  return (
    <div
      role="region"
      aria-label="Habit consistency performance list"
      className="w-full rounded-lg border border-neutral-800 bg-neutral-900 p-4 sm:p-5 shadow-xl space-y-4"
    >
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Habit Consistency
          </h3>
          <p className="text-xs text-neutral-400">
            Completion rate per habit for the selected month
          </p>
        </div>
      </div>

      {/* Habit List */}
      <div className="space-y-2.5">
        {sortedHabits.map((habit, idx) => (
          <div
            key={habit.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-md border border-neutral-800 bg-neutral-950 p-3 transition-colors hover:bg-neutral-900"
          >
            {/* Habit Label */}
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <span className="text-base shrink-0">{habit.icon}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="truncate text-xs font-bold text-white font-mono">
                    {habit.name}
                  </h4>
                </div>
                <p className="text-[11px] text-neutral-500 font-mono">
                  {habit.completedCount} of {habit.eligibleCount} days ({habit.currentStreak}d streak)
                </p>
              </div>
            </div>

            {/* Completion Percentage & Horizontal Progress Bar */}
            <div className="flex items-center gap-3 shrink-0 sm:w-56">
              <div className="h-2 flex-1 overflow-hidden rounded bg-neutral-800">
                <motion.div
                  className="h-full bg-neutral-200 rounded"
                  initial={{ width: 0 }}
                  animate={{ width: `${habit.completionRate}%` }}
                  transition={{ duration: 0.4, delay: idx * 0.03, ease: "easeOut" }}
                />
              </div>
              <span className="w-10 text-right text-xs font-bold font-mono text-neutral-200">
                {habit.completionRate}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

