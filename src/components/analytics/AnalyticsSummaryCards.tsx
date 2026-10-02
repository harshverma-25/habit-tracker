"use client";

import React from "react";
import { motion, useReducedMotion, Variants } from "framer-motion";
import { TrendingUp, CheckCircle2, Flame, Trophy } from "lucide-react";

interface AnalyticsSummaryCardsProps {
  stats: {
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
}

export function AnalyticsSummaryCards({ stats }: AnalyticsSummaryCardsProps) {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const summaryItems = [
    {
      id: "rate",
      label: "OVERALL RATE",
      value: `${stats.overallProgress}%`,
      subtext: `${stats.completedCheckins} / ${stats.eligibleCheckins} check-ins`,
      icon: TrendingUp,
      color: "from-blue-500/20 to-indigo-500/10 text-blue-400 border-blue-500/30",
    },
    {
      id: "checkins",
      label: "TOTAL CHECK-INS",
      value: stats.completedCheckins.toString(),
      subtext: "Completed in selected month",
      icon: CheckCircle2,
      color: "from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30",
    },
    {
      id: "streaks",
      label: "CURRENT STREAK",
      value: `🔥 ${stats.currentStreak} ${stats.currentStreak === 1 ? "day" : "days"}`,
      subtext: `Longest streak: ${stats.longestStreak} days`,
      icon: Flame,
      color: "from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/30",
    },
    {
      id: "top-habit",
      label: "BEST HABIT",
      value: stats.bestHabit ? `${stats.bestHabit.icon} ${stats.bestHabit.name}` : "—",
      subtext: stats.bestHabit ? `${stats.bestHabit.rate}% completion rate` : "No data yet",
      icon: Trophy,
      color: "from-purple-500/20 to-pink-500/10 text-purple-400 border-purple-500/30",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {summaryItems.map((item) => {
        const IconComponent = item.icon;
        return (
          <motion.div
            key={item.id}
            variants={cardVariants}
            whileHover={shouldReduceMotion ? {} : { y: -3, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="group relative overflow-hidden rounded-2xl border border-neutral-800/90 bg-neutral-900/50 p-5 backdrop-blur-md transition-colors hover:border-neutral-700/80 hover:bg-neutral-900/80 hover:shadow-xl hover:shadow-black/40"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">
                {item.label}
              </span>
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl border bg-gradient-to-br shadow-inner ${item.color}`}
              >
                <IconComponent className="h-4.5 w-4.5" />
              </div>
            </div>

            <div className="mt-4">
              <span className="truncate block text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono">
                {item.value}
              </span>
              <p className="mt-1 truncate text-xs font-medium text-neutral-400">
                {item.subtext}
              </p>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
