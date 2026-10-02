"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Target, Flame, Trophy, Award } from "lucide-react";

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
  const [sortBy, setSortBy] = useState<"rate" | "streak">("rate");
  const shouldReduceMotion = useReducedMotion();

  const sortedHabits = [...habits].sort((a, b) => {
    if (sortBy === "rate") {
      return b.completionRate - a.completionRate;
    } else {
      return b.currentStreak - a.currentStreak;
    }
  });

  return (
    <div
      role="region"
      aria-label="Habit performance ranking list"
      className="w-full rounded-2xl border border-neutral-800/90 bg-neutral-900/50 p-5 sm:p-6 backdrop-blur-md shadow-xl space-y-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Habit Performance Breakdown
            </h3>
            <p className="text-xs text-neutral-400 font-medium">
              Compare completion rates & streak history across habits
            </p>
          </div>
        </div>

        {/* Sort Filter Buttons */}
        <div className="flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-950 p-1 self-start sm:self-auto">
          <button
            onClick={() => setSortBy("rate")}
            aria-pressed={sortBy === "rate"}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              sortBy === "rate"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Sort by Rate
          </button>
          <button
            onClick={() => setSortBy("streak")}
            aria-pressed={sortBy === "streak"}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              sortBy === "streak"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Sort by Streak
          </button>
        </div>
      </div>

      {/* Habit Performance Cards */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {sortedHabits.map((habit, rank) => {
            const isTopRanked = rank === 0 && habit.completionRate > 0;

            return (
              <motion.div
                key={habit.id}
                layout
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: rank * 0.04 }}
                tabIndex={0}
                aria-label={`Rank ${rank + 1}: ${habit.name}, ${habit.completionRate}% completion rate, ${habit.currentStreak} day streak`}
                className={`group relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 rounded-xl border p-4 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  isTopRanked
                    ? "border-amber-500/40 bg-amber-500/[0.04] hover:bg-amber-500/[0.08]"
                    : "border-neutral-800/80 bg-neutral-950/60 hover:border-neutral-700/80 hover:bg-neutral-900/60"
                }`}
              >
                {/* Habit Info & Icon */}
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-neutral-400 border border-neutral-800">
                    #{rank + 1}
                  </span>

                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${habit.color}`}
                  >
                    <span className="text-lg">{habit.icon}</span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="truncate text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                        {habit.name}
                      </h4>
                      {isTopRanked && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/30">
                          <Award className="h-3 w-3" />
                          <span>Top Performer</span>
                        </span>
                      )}
                    </div>
                    {habit.description ? (
                      <p className="truncate text-xs font-medium text-neutral-400">
                        {habit.description}
                      </p>
                    ) : (
                      <p className="text-xs text-neutral-400">
                        {habit.completedCount} / {habit.eligibleCount} check-ins
                      </p>
                    )}
                  </div>
                </div>

                {/* Performance Metrics & Progress Bar */}
                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 border-t border-neutral-800/40 sm:border-t-0 pt-2 sm:pt-0">
                  {/* Streak Badges */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-400">
                      <Flame className="h-3.5 w-3.5" />
                      <span>{habit.currentStreak}d streak</span>
                    </div>
                    <div className="hidden md:flex items-center gap-1 rounded-lg border border-neutral-800 bg-neutral-900 px-2.5 py-1 text-xs font-medium text-neutral-400">
                      <Target className="h-3.5 w-3.5 text-neutral-500" />
                      <span>Best: {habit.longestStreak}d</span>
                    </div>
                  </div>

                  {/* Percentage Progress */}
                  <div className="flex flex-col items-end min-w-[70px] sm:min-w-[80px]">
                    <span className="text-base font-extrabold font-mono text-white">
                      {habit.completionRate}%
                    </span>
                    <div className="h-1.5 w-16 sm:w-20 overflow-hidden rounded-full bg-neutral-800 mt-1">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${habit.completionRate}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
