"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, MoreHorizontal } from "lucide-react";
import { Habit, DayInfo, HabitCompletion } from "@/types/habit";

interface HabitTrackerProps {
  habits: Habit[];
  days: DayInfo[];
  weeks: { weekNumber: number; label: string; days: DayInfo[] }[];
  completions: HabitCompletion[];
  onToggleCompletion: (habitId: string, date: string) => void;
  onArchiveHabit?: (habitId: string) => void;
  onDeleteHabit?: (habitId: string) => void;
}

export function HabitTracker({
  habits,
  days,
  weeks,
  completions,
  onToggleCompletion,
}: HabitTrackerProps) {
  // Helper to check if habit is completed on date
  const isCompleted = (habitId: string, date: string) => {
    return completions.some((c) => c.habitId === habitId && c.date === date && c.completed);
  };

  // Helper to calculate progress percentage per habit
  const getHabitProgress = (habitId: string) => {
    const habitCompletions = completions.filter((c) => c.habitId === habitId && c.completed);
    // prototype percentage based on 31 days
    return Math.round((habitCompletions.length / 31) * 100);
  };

  return (
    <div className="w-full rounded-2xl border border-neutral-800 bg-neutral-900/40 p-1 shadow-2xl backdrop-blur-sm">
      <div className="custom-scrollbar overflow-x-auto rounded-xl">
        <table className="w-full border-collapse text-left">
          <thead>
            {/* Top row: Week Headers */}
            <tr className="border-b border-neutral-800/80 bg-neutral-950/80">
              <th className="sticky left-0 z-30 min-w-[220px] max-w-[260px] bg-neutral-950 px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider border-r border-neutral-800">
                Habit
              </th>
              {weeks.map((week) => (
                <th
                  key={week.weekNumber}
                  colSpan={week.days.length}
                  className="px-2 py-2 text-center text-[11px] font-bold text-blue-400 uppercase tracking-widest border-r border-neutral-800/60 bg-blue-500/[0.03]"
                >
                  {week.label}
                </th>
              ))}
              <th className="sticky right-0 z-20 min-w-[100px] bg-neutral-950 px-4 py-3 text-center text-xs font-semibold text-neutral-400 uppercase tracking-wider border-l border-neutral-800">
                Progress
              </th>
            </tr>

            {/* Sub row: Day Name & Day Number */}
            <tr className="border-b border-neutral-800 bg-neutral-950/50 text-center">
              <th className="sticky left-0 z-30 bg-neutral-950 px-4 py-2 text-xs font-medium text-neutral-500 border-r border-neutral-800">
                Daily Check-in
              </th>
              {days.map((day) => (
                <th
                  key={day.date}
                  className={`min-w-[42px] px-1 py-2 text-center border-r border-neutral-800/40 ${
                    day.isToday ? "bg-blue-500/10 border-x-2 border-x-blue-500/40" : ""
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <span
                      className={`text-[10px] font-semibold uppercase ${
                        day.isToday ? "text-blue-400" : "text-neutral-500"
                      }`}
                    >
                      {day.dayName}
                    </span>
                    <span
                      className={`mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                        day.isToday
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                          : "text-neutral-300"
                      }`}
                    >
                      {day.dayNumber}
                    </span>
                  </div>
                </th>
              ))}
              <th className="sticky right-0 z-20 bg-neutral-950 px-4 py-2 border-l border-neutral-800" />
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral-800/60">
            {habits.map((habit) => {
              const progress = getHabitProgress(habit.id);
              return (
                <tr
                  key={habit.id}
                  className="group transition-colors hover:bg-neutral-800/30"
                >
                  {/* Sticky Habit Column */}
                  <td className="sticky left-0 z-30 bg-neutral-950 px-4 py-3 border-r border-neutral-800 shadow-md">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${habit.color}`}
                        >
                          <span className="text-base">{habit.icon}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                            {habit.name}
                          </p>
                          {habit.description && (
                            <p className="truncate text-xs text-neutral-500">
                              {habit.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          title="Options"
                          className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </td>

                  {/* Day Checkboxes */}
                  {days.map((day) => {
                    const checked = isCompleted(habit.id, day.date);
                    return (
                      <td
                        key={day.date}
                        className={`p-1.5 text-center border-r border-neutral-800/30 ${
                          day.isToday ? "bg-blue-500/[0.04] border-x-2 border-x-blue-500/20" : ""
                        }`}
                      >
                        <div className="flex items-center justify-center">
                          <button
                            disabled={day.isFuture}
                            onClick={() => onToggleCompletion(habit.id, day.date)}
                            className={`group/btn relative flex h-7 w-7 items-center justify-center rounded-lg border transition-all duration-200 focus:outline-none ${
                              day.isFuture
                                ? "border-neutral-800/50 bg-neutral-900/30 text-neutral-700 cursor-not-allowed opacity-40"
                                : checked
                                ? "border-blue-500 bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-md shadow-blue-500/25 active:scale-90"
                                : "border-neutral-700/80 bg-neutral-950/80 text-transparent hover:border-neutral-500 hover:bg-neutral-800/60 active:scale-95"
                            }`}
                          >
                            {checked && (
                              <motion.div
                                initial={{ scale: 0, rotate: -45 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                              >
                                <Check className="h-4 w-4 stroke-[3]" />
                              </motion.div>
                            )}
                          </button>
                        </div>
                      </td>
                    );
                  })}

                  {/* Sticky Habit Progress Bar */}
                  <td className="sticky right-0 z-20 bg-neutral-950 px-4 py-3 border-l border-neutral-800">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-neutral-300">{progress}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-800">
                        <motion.div
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
