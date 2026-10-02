"use client";

import React, { useState, useMemo, memo } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Edit2, Archive, Trash2, MoreVertical } from "lucide-react";
import { Habit, DayInfo, HabitCompletion } from "@/types/habit";

const EditHabitDialog = dynamic(
  () => import("@/components/EditHabitDialog").then((mod) => mod.EditHabitDialog),
  { ssr: false }
);

const DeleteConfirmDialog = dynamic(
  () => import("@/components/DeleteConfirmDialog").then((mod) => mod.DeleteConfirmDialog),
  { ssr: false }
);

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

export const HabitTracker = memo(function HabitTracker({
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

  // O(1) Constant-time lookup set for completion states
  const completedSet = useMemo(() => {
    const set = new Set<string>();
    for (let i = 0; i < completions.length; i++) {
      const c = completions[i];
      if (c.completed) {
        set.add(`${c.habitId}_${c.date}`);
      }
    }
    return set;
  }, [completions]);

  // Precomputed habit progress percentage map
  const habitProgressMap = useMemo(() => {
    const counts: Record<string, number> = {};
    for (let i = 0; i < completions.length; i++) {
      const c = completions[i];
      if (c.completed) {
        counts[c.habitId] = (counts[c.habitId] || 0) + 1;
      }
    }
    const map: Record<string, number> = {};
    const totalDays = days.length || 1;
    for (let i = 0; i < habits.length; i++) {
      const hId = habits[i].id;
      map[hId] = Math.round(((counts[hId] || 0) / totalDays) * 100);
    }
    return map;
  }, [completions, days.length, habits]);

  return (
    <div className="w-full rounded-lg border border-neutral-800 bg-neutral-950 overflow-hidden shadow-xl">
      {/* Mobile scroll hint banner */}
      <div className="sm:hidden flex items-center justify-between text-[10px] text-neutral-400 px-3 py-1.5 border-b border-neutral-800 bg-neutral-900/80 font-mono tracking-tight">
        <span>← Swipe horizontally to view full month →</span>
        <span className="text-[9px] uppercase tracking-widest text-neutral-500">{days.length} DAYS</span>
      </div>

      {/* Horizontal scroll container with custom scrollbar */}
      <div className="custom-scrollbar overflow-x-auto max-w-full touch-pan-x pb-1">
        <table className="w-full min-w-max border-collapse text-left table-fixed">
          <thead>
            {/* Top row: Week Headers */}
            <tr className="border-b border-neutral-800 bg-neutral-900 text-neutral-300">
              <th className="sticky left-0 z-30 w-[180px] min-w-[180px] sm:w-[240px] sm:min-w-[240px] bg-neutral-900 px-3 py-2 text-[11px] font-bold uppercase tracking-wider border-r border-neutral-800">
                DAILY HABITS
              </th>
              {weeks.map((week) => (
                <th
                  key={week.weekNumber}
                  colSpan={week.days.length}
                  className="px-1 py-1.5 text-center text-[10px] font-bold font-mono text-neutral-300 uppercase tracking-widest border-r border-neutral-800 bg-neutral-900/90"
                >
                  {week.label}
                </th>
              ))}
              <th className="sticky right-0 z-20 w-[60px] min-w-[60px] bg-neutral-900 px-2 py-1.5 text-center text-[10px] font-bold text-neutral-400 uppercase tracking-wider border-l border-neutral-800">
                %
              </th>
            </tr>

            {/* Sub row: Day Name & Day Number */}
            <tr className="border-b border-neutral-800 bg-neutral-950 text-center">
              <th className="sticky left-0 z-30 w-[180px] min-w-[180px] sm:w-[240px] sm:min-w-[240px] bg-neutral-950 px-3 py-1.5 text-[11px] font-semibold text-neutral-400 border-r border-neutral-800 text-left">
                Check-in
              </th>
              {days.map((day) => (
                <th
                  key={day.date}
                  className={`w-[40px] min-w-[40px] max-w-[40px] p-1 text-center border-r border-neutral-800/80 ${
                    day.isToday ? "bg-neutral-800/90 border-x border-x-neutral-700" : ""
                  }`}
                >
                  <div className="flex flex-col items-center justify-center leading-none py-0.5">
                    <span
                      className={`text-[9px] font-bold uppercase tracking-tighter ${
                        day.isToday ? "text-white" : "text-neutral-500"
                      }`}
                    >
                      {day.dayName}
                    </span>
                    <span
                      className={`mt-1 text-[11px] font-mono font-bold ${
                        day.isToday ? "text-white font-extrabold" : "text-neutral-300"
                      }`}
                    >
                      {day.dayNumber}
                    </span>
                  </div>
                </th>
              ))}
              <th className="sticky right-0 z-20 w-[60px] min-w-[60px] bg-neutral-950 px-2 py-1.5 border-l border-neutral-800" />
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral-800/80">
            {habits.map((habit) => {
              const progress = habitProgressMap[habit.id] || 0;
              const isMenuOpen = activeMenuHabitId === habit.id;

              return (
                <tr
                  key={habit.id}
                  className="group transition-colors hover:bg-neutral-900/50"
                >
                  {/* Sticky Habit Column */}
                  <td className="sticky left-0 z-30 w-[180px] min-w-[180px] sm:w-[240px] sm:min-w-[240px] bg-neutral-950 px-3 py-2 border-r border-neutral-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.5)]">
                    <div className="flex items-center justify-between gap-1.5">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className="text-sm shrink-0">{habit.icon}</span>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold text-neutral-200 group-hover:text-white transition-colors">
                            {habit.name}
                          </p>
                          {habit.description && (
                            <p className="truncate text-[10px] text-neutral-500 hidden sm:block">
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
                          aria-label={`Options for habit ${habit.name}`}
                          className="flex h-6 w-6 items-center justify-center rounded text-neutral-500 hover:bg-neutral-800 hover:text-neutral-200 transition-colors"
                        >
                          <MoreVertical className="h-3.5 w-3.5" />
                        </button>

                        <AnimatePresence>
                          {isMenuOpen && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.1 }}
                              onMouseLeave={() => setActiveMenuHabitId(null)}
                              className="absolute right-0 top-6 z-50 w-32 rounded-md border border-neutral-800 bg-neutral-900 p-1 shadow-xl"
                            >
                              <button
                                onClick={() => {
                                  setActiveMenuHabitId(null);
                                  setEditingHabit(habit);
                                }}
                                className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-xs font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white"
                              >
                                <Edit2 className="h-3 w-3 text-neutral-400" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => {
                                  setActiveMenuHabitId(null);
                                  if (onArchiveHabit) onArchiveHabit(habit.id);
                                }}
                                className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-xs font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white"
                              >
                                <Archive className="h-3 w-3 text-neutral-400" />
                                <span>Archive</span>
                              </button>
                              <button
                                onClick={() => {
                                  setActiveMenuHabitId(null);
                                  setDeletingHabit(habit);
                                }}
                                className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-xs font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white"
                              >
                                <Trash2 className="h-3 w-3 text-neutral-400" />
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
                    const checked = completedSet.has(`${habit.id}_${day.date}`);
                    return (
                      <td
                        key={day.date}
                        className={`w-[40px] min-w-[40px] max-w-[40px] p-1 text-center border-r border-neutral-800/60 ${
                          day.isToday ? "bg-neutral-900/60" : ""
                        }`}
                      >
                        <div className="flex items-center justify-center min-h-[32px]">
                          <button
                            disabled={day.isFuture}
                            role="checkbox"
                            aria-checked={checked}
                            aria-disabled={day.isFuture}
                            aria-label={`${habit.name} on ${day.dayName} ${day.dayNumber}`}
                            tabIndex={day.isFuture ? -1 : 0}
                            onKeyDown={(e) => {
                              if ((e.key === " " || e.key === "Enter") && !day.isFuture) {
                                e.preventDefault();
                                onToggleCompletion(habit.id, day.date);
                              }
                            }}
                            onClick={() => onToggleCompletion(habit.id, day.date)}
                            className={`flex h-6 w-6 items-center justify-center rounded-[4px] border transition-colors ${
                              day.isFuture
                                ? "border-neutral-900 bg-neutral-950 text-transparent cursor-not-allowed opacity-20"
                                : checked
                                ? "border-neutral-200 bg-neutral-100 text-neutral-950 shadow-sm"
                                : "border-neutral-700 bg-neutral-950 text-transparent hover:border-neutral-500 hover:bg-neutral-900"
                            }`}
                          >
                            {checked && <Check className="h-4 w-4 stroke-[3]" />}
                          </button>
                        </div>
                      </td>
                    );
                  })}

                  {/* Sticky Habit Progress Percentage */}
                  <td className="sticky right-0 z-20 w-[60px] min-w-[60px] max-w-[60px] bg-neutral-950 px-2 py-2 text-center border-l border-neutral-800 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.5)]">
                    <span className="font-mono text-[11px] font-bold text-neutral-400">
                      {progress}%
                    </span>
                  </td>
                </tr>
              );
            })}
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
    </div>
  );
});

