"use client";

import React from "react";
import { motion } from "framer-motion";
import { Target, CheckCircle2, Flame, TrendingUp } from "lucide-react";
import { HabitStats } from "@/types/habit";

interface StatsCardsProps {
  stats: HabitStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1.0] as const,
      },
    }),
  };

  const statItems = [
    {
      label: "TOTAL HABITS",
      value: stats.totalHabits.toString(),
      icon: Target,
      color: "from-blue-500/20 to-indigo-500/10 text-blue-400 border-blue-500/20",
    },
    {
      label: "COMPLETED",
      value: stats.completedCheckins.toString(),
      icon: CheckCircle2,
      color: "from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/20",
    },
    {
      label: "STREAK",
      value: `🔥 ${stats.currentStreak} days`,
      icon: Flame,
      color: "from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/20",
    },
    {
      label: "PROGRESS",
      value: `${stats.overallProgress}%`,
      icon: TrendingUp,
      color: "from-purple-500/20 to-pink-500/10 text-purple-400 border-purple-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
      {statItems.map((item, idx) => {
        const IconComponent = item.icon;
        return (
          <motion.div
            key={item.label}
            custom={idx}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="group relative overflow-hidden rounded-xl border border-neutral-800/80 bg-neutral-900/60 p-4 transition-all duration-300 hover:border-neutral-700 hover:bg-neutral-900/90 hover:shadow-xl hover:shadow-black/40"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
                {item.label}
              </span>
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg border bg-gradient-to-br ${item.color}`}
              >
                <IconComponent className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {item.value}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
