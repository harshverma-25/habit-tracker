"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Navbar } from "@/components/Navbar";
import { MonthSelector } from "@/components/MonthSelector";
import { WeeklyCompletionChart } from "@/components/analytics/WeeklyCompletionChart";
import { HabitPerformanceList } from "@/components/analytics/HabitPerformanceList";
import { AnalyticsSkeleton } from "@/components/analytics/AnalyticsSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { useRouter } from "next/navigation";

interface AnalyticsData {
  selectedMonth: {
    year: number;
    month: number;
    monthName: string;
  };
  overallStats: {
    totalHabits: number;
    completedCheckins: number;
    eligibleCheckins: number;
    overallProgress: number;
    currentStreak: number;
    longestStreak: number;
    bestHabit: {
      name: string;
      icon: string;
      color: string;
      rate: number;
    } | null;
  };
  weeklyBreakdown: {
    day: string;
    completed: number;
    eligible: number;
    rate: number;
  }[];
  weeklyTrends: {
    weekLabel: string;
    weekNumber: number;
    completed: number;
    eligible: number;
    rate: number;
  }[];
  habitPerformance: {
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
  }[];
}

interface AnalyticsContentProps {
  initialData?: AnalyticsData | null;
}

export function AnalyticsContent({ initialData }: AnalyticsContentProps = {}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const today = useMemo(() => new Date(), []);
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth() + 1);
  const [data, setData] = useState<AnalyticsData | null>(initialData || null);
  const [isLoading, setIsLoading] = useState<boolean>(!initialData);

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

  // Fetch analytics data from MongoDB API when month/year changes
  useEffect(() => {
    let isMounted = true;
    const isInitialMonth =
      currentYear === today.getFullYear() && currentMonth === today.getMonth() + 1;

    if (session?.user && (!isInitialMonth || !initialData)) {
      Promise.resolve().then(() => {
        if (isMounted) setIsLoading(true);
      });
      fetch(`/api/analytics?year=${currentYear}&month=${currentMonth}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((analyticsData) => {
          if (isMounted) {
            setData(analyticsData);
            setIsLoading(false);
          }
        })
        .catch((err) => {
          console.error("Error loading analytics:", err);
          if (isMounted) setIsLoading(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [session, currentYear, currentMonth, initialData, today]);

  const loading = status === "loading" || isLoading;

  return (
    <div className="min-h-screen bg-black text-neutral-100 flex flex-col font-sans selection:bg-neutral-700 selection:text-white">
      <Navbar />

      <main className="flex-1 w-full px-3 py-4 sm:px-6 lg:px-8 space-y-4 max-w-7xl mx-auto">
        {loading ? (
          <AnalyticsSkeleton />
        ) : !data || data.overallStats.totalHabits === 0 ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h1 className="text-base font-bold text-white uppercase tracking-wider font-mono">
                Analytics
              </h1>
            </div>
            <EmptyState onAddClick={() => router.push("/dashboard")} />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Section 1: Header & Month Selector */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h1 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider font-mono">
                Analytics
              </h1>

              <div className="shrink-0 min-w-[240px]">
                <MonthSelector
                  monthName={data.selectedMonth.monthName}
                  year={data.selectedMonth.year}
                  onPrevMonth={handlePrevMonth}
                  onNextMonth={handleNextMonth}
                  onSelectCurrentMonth={handleSelectCurrentMonth}
                />
              </div>
            </div>

            {/* Section 2: Small Summary Typography */}
            <div className="flex flex-wrap items-center justify-between sm:justify-start gap-6 sm:gap-12 rounded-lg border border-neutral-800 bg-neutral-900 px-5 py-3 shadow-md">
              <div>
                <span className="block text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest">
                  Overall Completion
                </span>
                <span className="text-2xl font-extrabold font-mono text-white">
                  {data.overallStats.overallProgress}%
                </span>
              </div>

              <div className="hidden sm:block h-8 w-px bg-neutral-800" />

              <div>
                <span className="block text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest">
                  Total Completed Check-ins
                </span>
                <span className="text-2xl font-extrabold font-mono text-white">
                  {data.overallStats.completedCheckins}
                </span>
              </div>
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Section 3: Weekly Activity Graph */}
              <WeeklyCompletionChart data={data.weeklyBreakdown} />

              {/* Section 4: Habit Consistency */}
              <HabitPerformanceList habits={data.habitPerformance} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

