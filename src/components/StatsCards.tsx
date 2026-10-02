"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Target, CheckCircle2, Flame, TrendingUp } from "lucide-react";
import { HabitStats } from "@/types/habit";

interface StatsCardsProps {
  stats: HabitStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1.0] as const,
      },
    },
  };

  const statItems = [
    {
      id: "habits",
      label: "TOTAL HABITS",
      value: stats.totalHabits,
      displayValue: stats.totalHabits.toString(),
      icon: Target,
      color: "from-blue-500/20 to-indigo-500/10 text-blue-400 border-blue-500/30",
      glowColor: "group-hover:border-blue-500/40",
    },
    {
      id: "completed",
      label: "COMPLETED",
      value: stats.completedCheckins,
      displayValue: stats.completedCheckins.toString(),
      icon: CheckCircle2,
      color: "from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30",
      glowColor: "group-hover:border-emerald-500/40",
    },
    {
      id: "streak",
      label: "STREAK",
      value: stats.currentStreak,
      displayValue: `🔥 ${stats.currentStreak} ${stats.currentStreak === 1 ? "day" : "days"}`,
      icon: Flame,
      color: "from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/30",
      glowColor: "group-hover:border-amber-500/40",
    },
    {
      id: "progress",
      label: "PROGRESS",
      value: stats.overallProgress,
      displayValue: `${stats.overallProgress}%`,
      icon: TrendingUp,
      color: "from-purple-500/20 to-pink-500/10 text-purple-400 border-purple-500/30",
      glowColor: "group-hover:border-purple-500/40",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4"
    >
      {statItems.map((item) => {
        const IconComponent = item.icon;
        return (
          <motion.div
            key={item.id}
            variants={cardVariants}
            whileHover={shouldReduceMotion ? {} : { y: -3, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={`group relative overflow-hidden rounded-2xl border border-neutral-800/90 bg-neutral-900/50 p-4 sm:p-5 backdrop-blur-md transition-colors duration-300 hover:bg-neutral-900/80 hover:shadow-xl hover:shadow-black/50 ${item.glowColor}`}
          >
            {/* Top row */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">
                {item.label}
              </span>
              <motion.div
                whileHover={shouldReduceMotion ? {} : { rotate: 10, scale: 1.1 }}
                className={`flex h-9 w-9 items-center justify-center rounded-xl border bg-gradient-to-br shadow-inner ${item.color}`}
              >
                <IconComponent className="h-4.5 w-4.5" />
              </motion.div>
            </div>

            {/* Value row with animated value transition */}
            <div className="mt-4 flex items-baseline justify-between">
              <motion.span
                key={item.displayValue}
                initial={shouldReduceMotion ? {} : { opacity: 0.5, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono"
              >
                {item.displayValue}
              </motion.span>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
