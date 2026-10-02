"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check, Edit2, Archive, Trash2, MoreVertical, Sparkles } from "lucide-react";
import { Habit, DayInfo, HabitCompletion } from "@/types/habit";
import { EditHabitDialog } from "@/components/EditHabitDialog";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";

interface HabitTrackerProps {
  habits: Habit[];
  days: DayInfo[];
  weeks: { weekNumber: number; label: string; days: DayInfo[] }[];
  completions: HabitCompletion[];
  onToggleCompletion: (habitId: string, date: string) => void;
  onEditHabit?: (updated: { id: string; name: string; description: string; icon: string; color: string }) => void;
  onArchiveHabit?: (habitId: string) => void;
  onDeleteHabit?: (habitId: string) => void;
}

export function HabitTracker({
  habits,
  days,
  weeks,
  completions,
  onToggleCompletion,
  onEditHabit,
  onArchiveHabit,
  onDeleteHabit,
}: HabitTrackerProps) {
  const [activeMenuHabitId, setActiveMenuHabitId] = useState<string | null>(null);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [deletingHabit, setDeletingHabit] = useState<Habit | null>(null);

  const shouldReduceMotion = useReducedMotion();

  // Helper to check if habit is completed on date
  const isCompleted = (habitId: string, date: string) => {
    return completions.some((c) => c.habitId === habitId && c.date === date && c.completed);
  };

  // Helper to calculate progress percentage per habit
  const getHabitProgress = (habitId: string) => {
    const habitCompletions = completions.filter((c) => c.habitId === habitId && c.completed);
    return Math.round((habitCompletions.length / days.length) * 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full rounded-2xl border border-neutral-800/90 bg-neutral-900/40 p-1 shadow-2xl backdrop-blur-md"
    >
      <div className="custom-scrollbar overflow-x-auto rounded-xl">
        <table className="w-full border-collapse text-left">
          <thead>
            {/* Top row: Week Headers */}
            <tr className="border-b border-neutral-800/80 bg-neutral-950/90">
              <th className="sticky left-0 z-30 min-w-[240px] max-w-[280px] bg-neutral-950 px-4 py-3.5 text-xs font-bold text-neutral-400 uppercase tracking-wider border-r border-neutral-800/80">
                Habit
              </th>
              {weeks.map((week) => (
                <th
                  key={week.weekNumber}
                  colSpan={week.days.length}
                  className="px-2 py-2.5 text-center text-[11px] font-bold text-blue-400 uppercase tracking-widest border-r border-neutral-800/60 bg-blue-500/[0.03]"
                >
                  {week.label}
                </th>
              ))}
              <th className="sticky right-0 z-20 min-w-[110px] bg-neutral-950 px-4 py-3.5 text-center text-xs font-bold text-neutral-400 uppercase tracking-wider border-l border-neutral-800/80">
                Progress
              </th>
            </tr>

            {/* Sub row: Day Name & Day Number */}
            <tr className="border-b border-neutral-800/80 bg-neutral-950/60 text-center">
              <th className="sticky left-0 z-30 bg-neutral-950 px-4 py-2 text-xs font-medium text-neutral-500 border-r border-neutral-800/80">
                Daily Check-in
              </th>
              {days.map((day) => (
                <th
                  key={day.date}
                  className={`min-w-[42px] px-1 py-2 text-center border-r border-neutral-800/40 ${
                    day.isToday ? "bg-blue-500/10 border-x-2 border-x-blue-500/50" : ""
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <span
                      className={`text-[10px] font-bold uppercase ${
                        day.isToday ? "text-blue-400" : "text-neutral-500"
                      }`}
                    >
                      {day.dayName}
                    </span>
                    <span
                      className={`mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-all ${
                        day.isToday
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/40 ring-2 ring-blue-500/30 scale-105"
                          : "text-neutral-300"
                      }`}
                    >
                      {day.dayNumber}
                    </span>
                  </div>
                </th>
              ))}
              <th className="sticky right-0 z-20 bg-neutral-950 px-4 py-2 border-l border-neutral-800/80" />
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral-800/60">
            <AnimatePresence>
              {habits.map((habit, idx) => {
                const progress = getHabitProgress(habit.id);
                const isMenuOpen = activeMenuHabitId === habit.id;
                const isPerfect = progress === 100;

                return (
                  <motion.tr
                    key={habit.id}
                    initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="group transition-colors hover:bg-neutral-800/40"
                  >
                    {/* Sticky Habit Column */}
                    <td className="sticky left-0 z-30 bg-neutral-950 px-4 py-3 border-r border-neutral-800/80 shadow-md">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border shadow-inner ${habit.color}`}
                          >
                            <span className="text-base">{habit.icon}</span>
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                              {habit.name}
                            </p>
                            {habit.description && (
                              <p className="truncate text-xs font-medium text-neutral-400">
                                {habit.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Dropdown Action Menu */}
                        <div className="relative shrink-0">
                          <button
                            onClick={() => setActiveMenuHabitId(isMenuOpen ? null : habit.id)}
                            title="Options"
                            aria-label={`Options for ${habit.name}`}
                            className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>

                          <AnimatePresence>
                            {isMenuOpen && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                transition={{ duration: 0.15 }}
                                onMouseLeave={() => setActiveMenuHabitId(null)}
                                className="absolute right-0 top-7 z-50 w-36 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/95 p-1 shadow-2xl backdrop-blur-xl"
                              >
                                <button
                                  onClick={() => {
                                    setActiveMenuHabitId(null);
                                    setEditingHabit(habit);
                                  }}
                                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                                >
                                  <Edit2 className="h-3.5 w-3.5 text-blue-400" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveMenuHabitId(null);
                                    if (onArchiveHabit) onArchiveHabit(habit.id);
                                  }}
                                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-amber-400 hover:bg-amber-500/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                                >
                                  <Archive className="h-3.5 w-3.5" />
                                  <span>Archive</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveMenuHabitId(null);
                                    setDeletingHabit(habit);
                                  }}
                                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  <span>Delete</span>
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
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
                            day.isToday ? "bg-blue-500/[0.04] border-x-2 border-x-blue-500/30" : ""
                          }`}
                        >
                          <div className="flex items-center justify-center">
                            <motion.button
                              whileHover={day.isFuture || shouldReduceMotion ? {} : { scale: 1.1 }}
                              whileTap={day.isFuture || shouldReduceMotion ? {} : { scale: 0.85 }}
                              disabled={day.isFuture}
                              role="checkbox"
                              aria-checked={checked}
                              aria-disabled={day.isFuture}
                              aria-label={`Mark ${habit.name} on ${day.dayName} ${day.dayNumber}`}
                              tabIndex={day.isFuture ? -1 : 0}
                              onKeyDown={(e) => {
                                if ((e.key === " " || e.key === "Enter") && !day.isFuture) {
                                  e.preventDefault();
                                  onToggleCompletion(habit.id, day.date);
                                }
                              }}
                              onClick={() => onToggleCompletion(habit.id, day.date)}
                              className={`group/btn relative flex h-7 w-7 items-center justify-center rounded-lg border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 focus-visible:ring-offset-neutral-950 ${
                                day.isFuture
                                  ? "border-neutral-800/40 bg-neutral-900/20 text-neutral-700 cursor-not-allowed opacity-30"
                                  : checked
                                  ? "border-blue-500 bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-md shadow-blue-500/30"
                                  : "border-neutral-700/80 bg-neutral-950/90 text-transparent hover:border-neutral-500 hover:bg-neutral-800/80"
                              }`}
                            >
                              <AnimatePresence mode="wait">
                                {checked && (
                                  <motion.div
                                    key="check-icon"
                                    initial={
                                      shouldReduceMotion
                                        ? { opacity: 0 }
                                        : { scale: 0, rotate: -45 }
                                    }
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={
                                      shouldReduceMotion
                                        ? { opacity: 0 }
                                        : { scale: 0, rotate: 45 }
                                    }
                                    transition={{ type: "spring", stiffness: 450, damping: 25 }}
                                  >
                                    <Check className="h-4 w-4 stroke-[3]" />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.button>
                          </div>
                        </td>
                      );
                    })}

                    {/* Sticky Habit Progress Bar */}
                    <td className="sticky right-0 z-20 bg-neutral-950 px-4 py-3 border-l border-neutral-800/80">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span
                            className={`font-bold font-mono transition-colors ${
                              isPerfect ? "text-emerald-400" : "text-neutral-300"
                            }`}
                          >
                            {progress}%
                          </span>
                          {isPerfect && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring" }}
                            >
                              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                            </motion.span>
                          )}
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-800/90 p-0.5">
                          <motion.div
                            className={`h-full rounded-full transition-all ${
                              isPerfect
                                ? "bg-gradient-to-r from-emerald-500 to-teal-400 shadow-sm shadow-emerald-500/50"
                                : "bg-gradient-to-r from-blue-500 to-indigo-500"
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Edit Habit Modal */}
      {editingHabit && (
        <EditHabitDialog
          habit={editingHabit}
          isOpen={Boolean(editingHabit)}
          onClose={() => setEditingHabit(null)}
          onSave={(updated) => {
            if (onEditHabit) onEditHabit(updated);
            setEditingHabit(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingHabit && (
        <DeleteConfirmDialog
          habitName={deletingHabit.name}
          isOpen={Boolean(deletingHabit)}
          onClose={() => setDeletingHabit(null)}
          onConfirm={() => {
            if (onDeleteHabit) onDeleteHabit(deletingHabit.id);
            setDeletingHabit(null);
          }}
        />
      )}
    </motion.div>
  );
}
