"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Navbar } from "@/components/Navbar";
import { StatsCards } from "@/components/StatsCards";
import { MonthSelector } from "@/components/MonthSelector";
import { HabitTracker } from "@/components/HabitTracker";
import { AddHabitDialog } from "@/components/AddHabitDialog";
import { EmptyState } from "@/components/EmptyState";
import { generateMonthData } from "@/lib/dates";
import { Habit, HabitCompletion } from "@/types/habit";

export function DashboardContent() {
  const { data: session, status } = useSession();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [isFetchingHabits, setIsFetchingHabits] = useState<boolean>(false);

  // Dynamic Month & Year state (default to current date)
  const today = new Date();
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth() + 1); // 1-12

  // Generate dynamic calendar data for selected month/year
  const monthData = generateMonthData(currentYear, currentMonth, today);

  useEffect(() => {
    let isMounted = true;
    if (session?.user) {
      fetch("/api/habits")
        .then((res) => (res.ok ? res.json() : { habits: [] }))
        .then((data) => {
          if (isMounted) {
            setHabits(data.habits || []);
            setIsFetchingHabits(false);
          }
        })
        .catch((err) => {
          console.error("Error loading habits:", err);
          if (isMounted) setIsFetchingHabits(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [session]);

  const loading = status === "loading" || isFetchingHabits;

  // Month navigation handlers
  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleSelectCurrentMonth = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth() + 1);
  };

  // Add Habit via MongoDB API
  const handleAddHabit = async (newHabitData: Omit<Habit, "id" | "createdAt" | "updatedAt">) => {
    try {
      const res = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newHabitData),
      });

      if (res.ok) {
        const data = await res.json();
        setHabits((prev) => [...prev, data.habit]);
      }
    } catch (err) {
      console.error("Error creating habit:", err);
    }
  };

  // Edit Habit via MongoDB API
  const handleEditHabit = async (updated: {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
  }) => {
    try {
      const res = await fetch(`/api/habits/${updated.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      if (res.ok) {
        const data = await res.json();
        setHabits((prev) =>
          prev.map((h) => (h.id === updated.id ? data.habit : h))
        );
      }
    } catch (err) {
      console.error("Error updating habit:", err);
    }
  };

  // Archive Habit via MongoDB API (Removes from active tracker view)
  const handleArchiveHabit = async (habitId: string) => {
    try {
      const res = await fetch(`/api/habits/${habitId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isArchived: true }),
      });

      if (res.ok) {
        setHabits((prev) => prev.filter((h) => h.id !== habitId));
      }
    } catch (err) {
      console.error("Error archiving habit:", err);
    }
  };

  // Delete Habit via MongoDB API (Permanent)
  const handleDeleteHabit = async (habitId: string) => {
    try {
      const res = await fetch(`/api/habits/${habitId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setHabits((prev) => prev.filter((h) => h.id !== habitId));
        setCompletions((prev) => prev.filter((c) => c.habitId !== habitId));
      }
    } catch (err) {
      console.error("Error deleting habit:", err);
    }
  };

  // Local state toggle for check-ins (Phase 5 will persist completions)
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

  const userName = session?.user?.name || "Harsh";

  // Calculate stats from dynamic real habits
  const activeHabitsCount = habits.filter((h) => !h.isArchived).length;
  const completedCheckinsCount = completions.filter((c) => c.completed).length;

  const currentStats = {
    totalHabits: activeHabitsCount,
    completedCheckins: completedCheckinsCount,
    currentStreak: activeHabitsCount > 0 ? 12 : 0,
    overallProgress: activeHabitsCount > 0 ? 80 : 0,
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Good morning, {userName} 👋
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
        <MonthSelector
          monthName={monthData.monthName}
          year={monthData.year}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onSelectCurrentMonth={handleSelectCurrentMonth}
        />

        {/* Main Habit Tracker or Empty State */}
        {loading ? (
          <div className="flex min-h-[300px] w-full items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/30">
            <div className="flex items-center gap-3 text-neutral-400">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
              <span className="text-sm font-medium">Loading habits from MongoDB...</span>
            </div>
          </div>
        ) : habits.length === 0 ? (
          <EmptyState
            onAddClick={() =>
              handleAddHabit({
                name: "Read a book",
                description: "20 pages every day",
                icon: "📖",
                color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
                frequency: "daily",
                isArchived: false,
              })
            }
          />
        ) : (
          <HabitTracker
            habits={habits}
            days={monthData.days}
            weeks={monthData.weeks}
            completions={completions}
            onToggleCompletion={handleToggleCompletion}
            onEditHabit={handleEditHabit}
            onArchiveHabit={handleArchiveHabit}
            onDeleteHabit={handleDeleteHabit}
          />
        )}
      </main>
    </div>
  );
}
