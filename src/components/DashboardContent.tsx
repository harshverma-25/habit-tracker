"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { Navbar } from "@/components/Navbar";
import { StatsCards } from "@/components/StatsCards";
import { MonthSelector } from "@/components/MonthSelector";
import { HabitTracker } from "@/components/HabitTracker";
import { AddHabitDialog } from "@/components/AddHabitDialog";
import { EmptyState } from "@/components/EmptyState";
import { generateMonthData } from "@/lib/dates";
import { calculateHabitStreak, calculateMonthlyProgress } from "@/lib/calculations";
import { Habit, HabitCompletion, HabitStats } from "@/types/habit";

export function DashboardContent() {
  const { data: session, status } = useSession();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [allUserCompletions, setAllUserCompletions] = useState<HabitCompletion[]>([]);
  const [isFetchingHabits, setIsFetchingHabits] = useState<boolean>(false);
  const [isFetchingCompletions, setIsFetchingCompletions] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dynamic Month & Year state (default to current date)
  const today = useMemo(() => new Date(), []);
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth() + 1); // 1-12

  // Generate dynamic calendar data for selected month/year
  const monthData = generateMonthData(currentYear, currentMonth, today);

  // Show error toast message
  const showErrorToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Fetch active habits from MongoDB API
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

  // Fetch completions for selected month from MongoDB API
  useEffect(() => {
    let isMounted = true;
    if (session?.user) {
      fetch(`/api/completions?year=${currentYear}&month=${currentMonth}`)
        .then((res) => (res.ok ? res.json() : { completions: [] }))
        .then((data) => {
          if (isMounted) {
            const loaded: HabitCompletion[] = data.completions || [];
            setCompletions(loaded);
            setAllUserCompletions((prev) => {
              const map = new Map<string, HabitCompletion>();
              prev.forEach((c) => map.set(`${c.habitId}_${c.date}`, c));
              loaded.forEach((c) => map.set(`${c.habitId}_${c.date}`, c));
              return Array.from(map.values());
            });
            setIsFetchingCompletions(false);
          }
        })
        .catch((err) => {
          console.error("Error loading completions:", err);
          if (isMounted) setIsFetchingCompletions(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [session, currentYear, currentMonth]);

  const loading = status === "loading" || isFetchingHabits || isFetchingCompletions;

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
      } else {
        showErrorToast("Failed to create habit.");
      }
    } catch (err) {
      console.error("Error creating habit:", err);
      showErrorToast("Network error creating habit.");
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
      } else {
        showErrorToast("Failed to update habit.");
      }
    } catch (err) {
      console.error("Error updating habit:", err);
      showErrorToast("Network error updating habit.");
    }
  };

  // Archive Habit via MongoDB API
  const handleArchiveHabit = async (habitId: string) => {
    try {
      const res = await fetch(`/api/habits/${habitId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isArchived: true }),
      });

      if (res.ok) {
        setHabits((prev) => prev.filter((h) => h.id !== habitId));
      } else {
        showErrorToast("Failed to archive habit.");
      }
    } catch (err) {
      console.error("Error archiving habit:", err);
      showErrorToast("Network error archiving habit.");
    }
  };

  // Delete Habit via MongoDB API
  const handleDeleteHabit = async (habitId: string) => {
    try {
      const res = await fetch(`/api/habits/${habitId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setHabits((prev) => prev.filter((h) => h.id !== habitId));
        setCompletions((prev) => prev.filter((c) => c.habitId !== habitId));
        setAllUserCompletions((prev) => prev.filter((c) => c.habitId !== habitId));
      } else {
        showErrorToast("Failed to delete habit.");
      }
    } catch (err) {
      console.error("Error deleting habit:", err);
      showErrorToast("Network error deleting habit.");
    }
  };

  // Optimistic Checkbox Completion Toggle with real-time stats update and rollback
  const handleToggleCompletion = async (habitId: string, date: string) => {
    const existingIndex = completions.findIndex((c) => c.habitId === habitId && c.date === date);
    const prevCompletions = [...completions];

    let newCompletedState = true;
    if (existingIndex > -1) {
      newCompletedState = !completions[existingIndex].completed;
    }

    const updatedRecord: HabitCompletion = {
      id: existingIndex > -1 ? completions[existingIndex].id : `temp-${Date.now()}`,
      habitId,
      date,
      completed: newCompletedState,
    };

    // 1. Optimistic UI update
    setCompletions((prev) => {
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = updatedRecord;
        return updated;
      } else {
        return [...prev, updatedRecord];
      }
    });

    setAllUserCompletions((prev) => {
      const idx = prev.findIndex((c) => c.habitId === habitId && c.date === date);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = updatedRecord;
        return updated;
      } else {
        return [...prev, updatedRecord];
      }
    });

    // 2. Persist to MongoDB API
    try {
      const res = await fetch("/api/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          habitId,
          date,
          completed: newCompletedState,
        }),
      });

      if (!res.ok) {
        setCompletions(prevCompletions);
        showErrorToast("Failed to save check-in. Changes reverted.");
      } else {
        const data = await res.json();
        setCompletions((prev) =>
          prev.map((c) => (c.habitId === habitId && c.date === date ? data.completion : c))
        );
        setAllUserCompletions((prev) =>
          prev.map((c) => (c.habitId === habitId && c.date === date ? data.completion : c))
        );
      }
    } catch (err) {
      console.error("Error saving completion:", err);
      setCompletions(prevCompletions);
      showErrorToast("Network error. Check-in reverted.");
    }
  };

  const userName = session?.user?.name || "Harsh";

  // Calculate dynamic stats instantly from state
  const currentStats: HabitStats = useMemo(() => {
    const activeHabits = habits.filter((h) => !h.isArchived);
    if (activeHabits.length === 0) {
      return { totalHabits: 0, completedCheckins: 0, currentStreak: 0, overallProgress: 0 };
    }

    // Streak calculation across all active habits
    let maxCurrentStreak = 0;
    activeHabits.forEach((habit) => {
      const completedDates = allUserCompletions
        .filter((c) => c.habitId === habit.id && c.completed)
        .map((c) => c.date);
      const { currentStreak } = calculateHabitStreak(completedDates, today);
      if (currentStreak > maxCurrentStreak) {
        maxCurrentStreak = currentStreak;
      }
    });

    // Monthly progress calculation considering creation date & future dates
    const habitCreationList = activeHabits.map((h) => ({
      id: h.id,
      createdAt: h.createdAt,
    }));

    const { completedCheckins, overallProgress } = calculateMonthlyProgress(
      habitCreationList,
      completions,
      monthData.days
    );

    return {
      totalHabits: activeHabits.length,
      completedCheckins,
      currentStreak: maxCurrentStreak,
      overallProgress,
    };
  }, [habits, completions, allUserCompletions, monthData.days, today]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      <Navbar />

      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 rounded-xl border border-rose-500/40 bg-rose-950/90 px-4 py-3 text-sm font-semibold text-rose-200 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-5">
          {toastMessage}
        </div>
      )}

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

        {/* Dynamic Statistics Cards */}
        <StatsCards stats={currentStats} />

        {/* Month Selector */}
        <MonthSelector
          monthName={monthData.monthName}
          year={monthData.year}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onSelectCurrentMonth={handleSelectCurrentMonth}
        />

        {/* Main Habit Tracker Grid or Empty State */}
        {loading ? (
          <div className="flex min-h-[300px] w-full items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/30">
            <div className="flex items-center gap-3 text-neutral-400">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
              <span className="text-sm font-medium">Loading habit tracker dashboard...</span>
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
