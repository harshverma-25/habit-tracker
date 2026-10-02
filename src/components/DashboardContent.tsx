"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { Navbar } from "@/components/Navbar";
import { MonthSelector } from "@/components/MonthSelector";
import { HabitTracker } from "@/components/HabitTracker";
import { EmptyState } from "@/components/EmptyState";
import { DashboardSkeleton } from "@/components/DashboardSkeleton";
import { Toast, ToastMessage } from "@/components/Toast";
import { generateMonthData } from "@/lib/dates";
import { Habit, HabitCompletion } from "@/types/habit";

const AddHabitDialog = dynamic(
  () => import("@/components/AddHabitDialog").then((mod) => mod.AddHabitDialog),
  { ssr: false }
);

interface DashboardContentProps {
  initialHabits?: Habit[];
  initialCompletions?: HabitCompletion[];
}

export function DashboardContent({
  initialHabits,
  initialCompletions,
}: DashboardContentProps) {
  const { data: session, status } = useSession();
  const [habits, setHabits] = useState<Habit[]>(initialHabits || []);
  const [completions, setCompletions] = useState<HabitCompletion[]>(initialCompletions || []);
  const [isFetchingHabits, setIsFetchingHabits] = useState<boolean>(!initialHabits);
  const [isFetchingCompletions, setIsFetchingCompletions] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Dynamic Month & Year state (default to current date)
  const today = useMemo(() => new Date(), []);
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth() + 1); // 1-12

  // Generate dynamic calendar data for selected month/year
  const monthData = useMemo(
    () => generateMonthData(currentYear, currentMonth, today),
    [currentYear, currentMonth, today]
  );

  // Helper toast trigger
  const showToast = useCallback((type: "success" | "error" | "info", message: string, title?: string) => {
    setToast({
      id: `toast-${Date.now()}`,
      type,
      title,
      message,
    });
  }, []);

  // Fetch active habits from MongoDB API if not provided via props
  useEffect(() => {
    let isMounted = true;
    if (session?.user && !initialHabits) {
      Promise.resolve().then(() => {
        if (isMounted) setIsFetchingHabits(true);
      });
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
  }, [session, initialHabits]);

  // Fetch completions for selected month from MongoDB API
  useEffect(() => {
    let isMounted = true;
    const isInitialMonth =
      currentYear === today.getFullYear() && currentMonth === today.getMonth() + 1;

    if (session?.user && (!isInitialMonth || !initialCompletions)) {
      Promise.resolve().then(() => {
        if (isMounted) setIsFetchingCompletions(true);
      });
      fetch(`/api/completions?year=${currentYear}&month=${currentMonth}`)
        .then((res) => (res.ok ? res.json() : { completions: [] }))
        .then((data) => {
          if (isMounted) {
            setCompletions(data.completions || []);
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
  }, [session, currentYear, currentMonth, initialCompletions, today]);

  const loading = status === "loading" || isFetchingHabits;

  // Month navigation handlers
  const handlePrevMonth = useCallback(() => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  }, [currentMonth]);

  const handleNextMonth = useCallback(() => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  }, [currentMonth]);

  const handleSelectCurrentMonth = useCallback(() => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth() + 1);
  }, [today]);

  // Add Habit(s) via MongoDB API (bulk or single)
  const handleAddHabits = useCallback(
    async (newHabitsData: Omit<Habit, "id" | "createdAt" | "updatedAt">[]): Promise<boolean> => {
      try {
        const res = await fetch("/api/habits", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ habits: newHabitsData }),
        });

        if (res.ok) {
          const data = await res.json();
          const addedList: Habit[] = data.habits || (data.habit ? [data.habit] : []);
          setHabits((prev) => [...prev, ...addedList]);
          const msg =
            addedList.length === 1
              ? `"${addedList[0].name}" added to your habits.`
              : `${addedList.length} habits added successfully.`;
          showToast("success", msg, "Habits Created");
          return true;
        } else {
          const errData = await res.json().catch(() => ({}));
          showToast("error", errData.error || "Failed to create habits.", "Error");
          return false;
        }
      } catch (err) {
        console.error("Error creating habit(s):", err);
        showToast("error", "Network error creating habits.", "Network Error");
        return false;
      }
    },
    [showToast]
  );

  // Edit Habit via MongoDB API
  const handleEditHabit = useCallback(
    async (updated: {
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
          setHabits((prev) => prev.map((h) => (h.id === updated.id ? data.habit : h)));
          showToast("success", `"${updated.name}" updated.`, "Habit Updated");
        } else {
          showToast("error", "Failed to update habit.", "Error");
        }
      } catch (err) {
        console.error("Error updating habit:", err);
        showToast("error", "Network error updating habit.", "Network Error");
      }
    },
    [showToast]
  );

  // Archive Habit via MongoDB API
  const handleArchiveHabit = useCallback(
    async (habitId: string) => {
      try {
        const targetHabit = habits.find((h) => h.id === habitId);
        const res = await fetch(`/api/habits/${habitId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isArchived: true }),
        });

        if (res.ok) {
          setHabits((prev) => prev.filter((h) => h.id !== habitId));
          showToast("info", `"${targetHabit?.name || "Habit"}" archived. Historical data preserved.`, "Habit Archived");
        } else {
          showToast("error", "Failed to archive habit.", "Error");
        }
      } catch (err) {
        console.error("Error archiving habit:", err);
        showToast("error", "Network error archiving habit.", "Network Error");
      }
    },
    [habits, showToast]
  );

  // Delete Habit via MongoDB API
  const handleDeleteHabit = useCallback(
    async (habitId: string) => {
      try {
        const targetHabit = habits.find((h) => h.id === habitId);
        const res = await fetch(`/api/habits/${habitId}`, {
          method: "DELETE",
        });

        if (res.ok) {
          setHabits((prev) => prev.filter((h) => h.id !== habitId));
          setCompletions((prev) => prev.filter((c) => c.habitId !== habitId));
          showToast("success", `"${targetHabit?.name || "Habit"}" deleted.`, "Habit Deleted");
        } else {
          showToast("error", "Failed to delete habit.", "Error");
        }
      } catch (err) {
        console.error("Error deleting habit:", err);
        showToast("error", "Network error deleting habit.", "Network Error");
      }
    },
    [habits, showToast]
  );

  // Optimistic Checkbox Completion Toggle with real-time stats update and rollback
  const handleToggleCompletion = useCallback(
    async (habitId: string, date: string) => {
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
          showToast("error", "Failed to save check-in. Changes reverted.", "Check-in Error");
        } else {
          const data = await res.json();
          setCompletions((prev) =>
            prev.map((c) => (c.habitId === habitId && c.date === date ? data.completion : c))
          );
        }
      } catch (err) {
        console.error("Error saving completion:", err);
        setCompletions(prevCompletions);
        showToast("error", "Network error. Check-in reverted.", "Check-in Error");
      }
    },
    [completions, showToast]
  );

  const habitNames = useMemo(() => habits.map((h) => h.name), [habits]);

  return (
    <div className="min-h-screen bg-black text-neutral-100 flex flex-col font-sans selection:bg-neutral-700 selection:text-white">
      <Navbar />

      {/* Animated Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      <main className="flex-1 w-full px-3 py-4 sm:px-6 lg:px-8 space-y-3">
        {loading ? (
          <DashboardSkeleton />
        ) : (
          <div className="space-y-3">
            {/* Top Toolbar: Month Navigation & Add Habit Action */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex-1 min-w-[260px]">
                <MonthSelector
                  monthName={monthData.monthName}
                  year={monthData.year}
                  onPrevMonth={handlePrevMonth}
                  onNextMonth={handleNextMonth}
                  onSelectCurrentMonth={handleSelectCurrentMonth}
                />
              </div>

              <div className="shrink-0">
                <AddHabitDialog
                  onAddHabits={handleAddHabits}
                  existingHabitNames={habitNames}
                />
              </div>
            </div>

            {/* Main Habit Tracker Grid or Empty State */}
            {isFetchingCompletions && habits.length > 0 ? (
              <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-8 text-center">
                <div className="flex items-center justify-center gap-2 text-neutral-400">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span className="text-xs font-mono">Loading month data...</span>
                </div>
              </div>
            ) : habits.length === 0 ? (
              <EmptyState
                onAddClick={() =>
                  handleAddHabits([
                    {
                      name: "Read a book",
                      description: "20 pages every day",
                      icon: "📖",
                      color: "bg-neutral-800 text-white border-neutral-700",
                      frequency: "daily",
                      isArchived: false,
                    },
                  ])
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
          </div>
        )}
      </main>
    </div>
  );
}

