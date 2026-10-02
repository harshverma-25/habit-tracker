"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { motion, useReducedMotion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { MonthSelector } from "@/components/MonthSelector";
import { AnalyticsSummaryCards } from "@/components/analytics/AnalyticsSummaryCards";
import { WeeklyCompletionChart } from "@/components/analytics/WeeklyCompletionChart";
import { MonthlyTrendChart } from "@/components/analytics/MonthlyTrendChart";
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

export function AnalyticsContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  const today = useMemo(() => new Date(), []);
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth() + 1);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  // Fetch analytics data from MongoDB API
  useEffect(() => {
    let isMounted = true;
    if (session?.user) {
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
  }, [session, currentYear, currentMonth]);

  const userName = session?.user?.name || "User";
  const loading = status === "loading" || isLoading;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {loading ? (
          <AnalyticsSkeleton />
        ) : !data || data.overallStats.totalHabits === 0 ? (
          <div className="space-y-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Analytics & Insights 📊
              </h1>
              <p className="text-sm font-medium text-neutral-400">
                Track consistency trends and long-term habit performance.
              </p>
            </div>

            <EmptyState onAddClick={() => router.push("/dashboard")} />
          </div>
        ) : (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  Analytics & Insights 📊
                </h1>
                <p className="mt-1 text-sm font-medium text-neutral-400">
                  Comprehensive habit performance and completion trends for {userName}.
                </p>
              </div>

              {/* Month Selector Filter */}
              <div className="w-full sm:w-auto">
                <MonthSelector
                  monthName={data.selectedMonth.monthName}
                  year={data.selectedMonth.year}
                  onPrevMonth={handlePrevMonth}
                  onNextMonth={handleNextMonth}
                  onSelectCurrentMonth={handleSelectCurrentMonth}
                />
              </div>
            </div>

            {/* Summary KPI Cards */}
            <AnalyticsSummaryCards stats={data.overallStats} />

            {/* Visual Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WeeklyCompletionChart data={data.weeklyBreakdown} />
              <MonthlyTrendChart data={data.weeklyTrends} />
            </div>

            {/* Habit Performance List */}
            <HabitPerformanceList habits={data.habitPerformance} />
          </motion.div>
        )}
      </main>
    </div>
  );
}
