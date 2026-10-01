"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { StatsCards } from "@/components/StatsCards";
import { MonthSelector } from "@/components/MonthSelector";
import { HabitTracker } from "@/components/HabitTracker";
import { AddHabitDialog } from "@/components/AddHabitDialog";
import { EmptyState } from "@/components/EmptyState";
import {
  MOCK_HABITS,
  getOctober2026MonthData,
  INITIAL_MOCK_COMPLETIONS,
  MOCK_STATS,
} from "@/lib/mockData";
import { Habit, HabitCompletion } from "@/types/habit";

export function DashboardContent() {
  const [habits, setHabits] = useState<Habit[]>(MOCK_HABITS);
  const [completions, setCompletions] = useState<HabitCompletion[]>(INITIAL_MOCK_COMPLETIONS);
  const monthData = getOctober2026MonthData();

  // Toggle mock completion state locally
  const handleToggleCompletion = (habitId: string, date: string) => {
    setCompletions((prev) => {
      const existingIndex = prev.findIndex((c) => c.habitId === habitId && c.date === date);
      if (existingIndex > -1) {
        const existing = prev[existingIndex];
        const updated = [...prev];
        updated[existingIndex] = { ...existing, completed: !existing.completed };
        return updated;
      } else {
        return [
          ...prev,
          {
            id: `c-${Date.now()}`,
            habitId,
            date,
            completed: true,
          },
        ];
      }
    });
  };

  // Add new habit mock
  const handleAddHabit = (newHabitData: Omit<Habit, "id" | "createdAt" | "updatedAt">) => {
    const newHabit: Habit = {
      ...newHabitData,
      id: `habit-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setHabits((prev) => [...prev, newHabit]);
  };

  // Calculate dynamic stats from state
  const activeHabitsCount = habits.filter((h) => !h.isArchived).length;
  const completedCheckinsCount = completions.filter((c) => c.completed).length;

  const currentStats = {
    ...MOCK_STATS,
    totalHabits: activeHabitsCount,
    completedCheckins: completedCheckinsCount,
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Dashboard Greeting Header & Add Habit button */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Good morning, Harsh 👋
            </h1>
            <p className="mt-1 text-sm text-neutral-400">
              Stay consistent. Small actions become big results.
            </p>
          </div>
          <AddHabitDialog onAddHabit={handleAddHabit} />
        </div>

        {/* Statistics Cards */}
        <StatsCards stats={currentStats} />

        {/* Month Selector */}
        <MonthSelector monthName={monthData.monthName} year={monthData.year} />

        {/* Main Habit Tracker Grid or Empty State */}
        {habits.length === 0 ? (
          <EmptyState onAddClick={() => handleAddHabit({
            name: "New Habit",
            icon: "✨",
            color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
            frequency: "daily",
            isArchived: false,
          })} />
        ) : (
          <HabitTracker
            habits={habits}
            days={monthData.days}
            weeks={monthData.weeks}
            completions={completions}
            onToggleCompletion={handleToggleCompletion}
          />
        )}
      </main>
    </div>
  );
}
