"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, ArrowRight, ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";

export default function Home() {
  const { data: session } = useSession();
  const shouldReduceMotion = useReducedMotion();

  // Animated Demo Checkbox state sequence for Section A
  const [completedDemoDays, setCompletedDemoDays] = useState<number>(0);

  const handleStartDemoAnimation = () => {
    if (completedDemoDays > 0) return;
    if (shouldReduceMotion) {
      setCompletedDemoDays(7);
      return;
    }
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setCompletedDemoDays(step);
      if (step >= 7) {
        clearInterval(interval);
      }
    }, 280);
  };

  return (
    <div className="min-h-screen bg-black text-neutral-100 flex flex-col font-sans selection:bg-neutral-800 selection:text-white">
      <Navbar />

      <main className="flex-1 w-full">
        {/* ==================================================================== */}
        {/* 1. HERO SECTION (Asymmetrical Two-Column Composition) */}
        {/* ==================================================================== */}
        <section className="w-full max-w-7xl mx-auto px-4 py-12 sm:py-20 lg:py-24 border-b border-neutral-800/80">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Hero Text & Actions */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/60 px-3 py-1 text-[11px] font-mono font-semibold text-neutral-400 uppercase tracking-widest">
                <span>Editorial Habit Tracker</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.05] font-serif">
                Build a life, <br />
                <span className="italic font-normal text-neutral-300">one day at a time.</span>
              </h1>

              <p className="text-base sm:text-lg text-neutral-400 font-normal leading-relaxed max-w-xl">
                The Habit Tracker is a quiet digital space for your daily routines. Track consistency across a clean monthly grid with zero noise, zero dopamine traps, and absolute visual clarity.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                {session ? (
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-neutral-100 hover:bg-neutral-200 px-6 py-3.5 text-xs font-bold text-neutral-950 uppercase tracking-wider transition-colors"
                  >
                    <span>Open Dashboard</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <button
                    onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-neutral-100 hover:bg-neutral-200 px-6 py-3.5 text-xs font-bold text-neutral-950 uppercase tracking-wider transition-colors"
                  >
                    <span>Start tracking</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}

                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-1.5 rounded-md border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-900 px-5 py-3.5 text-xs font-semibold text-neutral-300 hover:text-white transition-colors"
                >
                  <span>Explore how it works</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-neutral-500" />
                </a>
              </div>
            </div>

            {/* Right Column: Realistic Calendar Interface Preview */}
            <div className="lg:col-span-6">
              <motion.div
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 p-3 sm:p-4 shadow-2xl"
              >
                {/* Header preview */}
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-3">
                  <span className="font-mono text-xs font-bold text-white uppercase tracking-widest">
                    OCTOBER 2026
                  </span>
                  <span className="font-mono text-[10px] text-neutral-500 uppercase">
                    Monthly Overview
                  </span>
                </div>

                {/* Grid Header preview */}
                <div className="custom-scrollbar overflow-x-auto">
                  <table className="w-full border-collapse text-left table-fixed min-w-[340px]">
                    <thead>
                      <tr className="border-b border-neutral-800 text-[10px] font-mono text-neutral-500 uppercase">
                        <th className="w-[120px] pb-2 font-bold text-neutral-400">Habit</th>
                        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                          <th
                            key={i}
                            className={`text-center pb-2 ${i === 3 ? "text-white font-bold" : ""}`}
                          >
                            {d} {i + 1}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-900">
                      {[
                        { name: "Morning Reading", icon: "📖", checks: [true, true, true, true, false, false, false] },
                        { name: "Meditation & Breath", icon: "🧘", checks: [true, true, true, true, true, false, false] },
                        { name: "Writing Journal", icon: "✍️", checks: [true, true, false, true, true, false, false] },
                        { name: "Physical Exercise", icon: "🏃", checks: [true, true, true, false, true, false, false] },
                      ].map((row, idx) => (
                        <tr key={idx} className="hover:bg-neutral-900/40">
                          <td className="py-2.5 text-xs font-medium text-neutral-200 truncate">
                            <span className="mr-1.5">{row.icon}</span>
                            {row.name}
                          </td>
                          {row.checks.map((checked, cIdx) => (
                            <td key={cIdx} className="text-center p-1">
                              <div
                                className={`h-5 w-5 mx-auto rounded-[3px] border flex items-center justify-center ${
                                  checked
                                    ? "bg-neutral-100 border-neutral-100 text-black font-bold"
                                    : cIdx === 3
                                    ? "border-neutral-600 bg-neutral-900"
                                    : "border-neutral-800 bg-neutral-950"
                                }`}
                              >
                                {checked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-3 pt-2 border-t border-neutral-900 flex items-center justify-between text-[10px] font-mono text-neutral-500">
                  <span>4 habits active</span>
                  <span>78% consistency rate</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* 3. SECTION A — The Calendar & Interactive Demo */}
        {/* ==================================================================== */}
        <section id="how-it-works" className="w-full max-w-7xl mx-auto px-4 py-16 sm:py-24 border-b border-neutral-800/80">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Editorial Photograph */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="relative rounded-lg border border-neutral-800 bg-neutral-900 overflow-hidden shadow-2xl">
                <Image
                  src="/journal_editorial_bw.jpg"
                  alt="Editorial black and white photograph of daily habit journaling"
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover grayscale contrast-110"
                  priority
                />
                <div className="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                  <span>FIG. 01 — DAILY HABIT LOGGING</span>
                  <span>TACTILE & DIGITAL</span>
                </div>
              </div>
            </div>

            {/* Content & Custom Interactive Animation */}
            <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
              <span className="font-mono text-xs font-bold text-neutral-500 uppercase tracking-widest">
                Section A — The Calendar
              </span>

              <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight font-serif">
                A single canvas for all your habits.
              </h2>

              <p className="text-sm sm:text-base text-neutral-400 leading-relaxed font-normal">
                Instead of isolated check-in screens, The Habit Tracker lays out your entire month across a unified grid. See every day, every week, and every habit in one elegant view.
              </p>

              {/* Interactive Calendar Demonstration Card */}
              <motion.div
                onViewportEnter={handleStartDemoAnimation}
                viewport={{ once: true, amount: 0.4 }}
                className="mt-6 rounded-lg border border-neutral-800 bg-neutral-950 p-4 space-y-3"
              >
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400 border-b border-neutral-800 pb-2">
                  <span className="font-bold text-white">LIVE DEMO — WEEK 1 CHECK-INS</span>
                  <span>
                    {Math.min(completedDemoDays, 7)} / 7 days done (
                    {Math.round((Math.min(completedDemoDays, 7) / 7) * 100)}%)
                  </span>
                </div>

                <div className="grid grid-cols-7 gap-2 pt-1">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => {
                    const isFilled = idx < completedDemoDays;

                    return (
                      <div key={day} className="flex flex-col items-center gap-1.5">
                        <span className="text-[10px] font-mono text-neutral-500 uppercase">
                          {day}
                        </span>
                        <motion.div
                          animate={isFilled ? { scale: [0.85, 1.05, 1] } : { scale: 1 }}
                          transition={{ duration: 0.2 }}
                          className={`h-7 w-7 rounded-[3px] border flex items-center justify-center transition-colors ${
                            isFilled
                              ? "bg-neutral-100 border-neutral-100 text-black font-bold"
                              : "border-neutral-800 bg-neutral-900"
                          }`}
                        >
                          {isFilled && <Check className="h-4 w-4 stroke-[3]" />}
                        </motion.div>
                      </div>
                    );
                  })}
                </div>

                <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden mt-3">
                  <motion.div
                    className="h-full bg-neutral-100 rounded-full"
                    animate={{
                      width: `${(Math.min(completedDemoDays, 7) / 7) * 100}%`,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* 4. SECTION B — Consistency & Streak History */}
        {/* ==================================================================== */}
        <section id="consistency" className="w-full max-w-7xl mx-auto px-4 py-16 sm:py-24 border-b border-neutral-800/80">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Content Left */}
            <div className="lg:col-span-6 space-y-6">
              <span className="font-mono text-xs font-bold text-neutral-500 uppercase tracking-widest">
                Section B — Consistency
              </span>

              <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight font-serif">
                Momentum is built quietly.
              </h2>

              <p className="text-sm sm:text-base text-neutral-400 leading-relaxed font-normal">
                Consistency doesn&apos;t require gamified badges, flashing rewards, or arbitrary points. Watching unbroken rows of completed days provides real intrinsic motivation.
              </p>

              <div className="pt-2 text-xs font-mono text-neutral-400 space-y-2 border-l border-neutral-800 pl-4">
                <p>• Zero streak resets for missing a single rest day.</p>
                <p>• Clear historical record across previous months.</p>
                <p>• Pure focus on daily action over artificial scores.</p>
              </div>
            </div>

            {/* Visual Right: Continuous Streak Timeline Strip */}
            <div className="lg:col-span-6">
              <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                  <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                    30-DAY STREAK TIMELINE
                  </span>
                  <span className="font-mono text-xs text-neutral-400 font-bold">
                    28 DAYS UNBROKEN
                  </span>
                </div>

                {/* Continuous 30-Day Checkbox Matrix */}
                <div className="grid grid-cols-10 gap-2 py-2">
                  {Array.from({ length: 30 }).map((_, i) => {
                    const isCompleted = i < 28;
                    return (
                      <div
                        key={i}
                        className={`h-6 w-full rounded-[2px] border flex items-center justify-center text-[10px] font-mono ${
                          isCompleted
                            ? "bg-neutral-100 border-neutral-100 text-black font-bold"
                            : "border-neutral-800 bg-neutral-900 text-neutral-600"
                        }`}
                      >
                        {isCompleted ? <Check className="h-3 w-3 stroke-[3]" /> : i + 1}
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 pt-2 border-t border-neutral-900">
                  <span>Sep 01</span>
                  <span>Sep 15</span>
                  <span>Sep 30</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* 5. SECTION C — Analytics Preview */}
        {/* ==================================================================== */}
        <section id="analytics" className="w-full max-w-7xl mx-auto px-4 py-16 sm:py-24 border-b border-neutral-800/80">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual Left: Monochrome Analytics Graph Preview */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                  <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                    WEEKLY ACTIVITY & CONSISTENCY
                  </span>
                  <span className="font-mono text-xs font-bold text-neutral-300">
                    84% RATE
                  </span>
                </div>

                {/* Monochrome Bar Chart Preview */}
                <div className="flex h-36 items-end justify-between gap-3 px-2 pt-4">
                  {[
                    { day: "Mon", rate: 100 },
                    { day: "Tue", rate: 80 },
                    { day: "Wed", rate: 90 },
                    { day: "Thu", rate: 100 },
                    { day: "Fri", rate: 75 },
                    { day: "Sat", rate: 60 },
                    { day: "Sun", rate: 85 },
                  ].map((bar) => (
                    <div key={bar.day} className="flex flex-col items-center flex-1 h-full justify-end">
                      <div className="w-full max-w-[28px] flex-1 bg-neutral-900 border border-neutral-800 rounded-sm overflow-hidden flex items-end">
                        <div
                          style={{ height: `${bar.rate}%` }}
                          className="w-full bg-neutral-200 rounded-sm"
                        />
                      </div>
                      <span className="mt-2 text-[10px] font-mono text-neutral-400">
                        {bar.day}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Habit Consistency Bar Preview */}
                <div className="pt-3 border-t border-neutral-900 space-y-2">
                  {[
                    { name: "Morning Reading", rate: 92 },
                    { name: "Writing Journal", rate: 85 },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-xs font-mono">
                      <span className="text-neutral-300 truncate">{item.name}</span>
                      <div className="flex items-center gap-2 w-36">
                        <div className="h-1.5 flex-1 rounded bg-neutral-900 overflow-hidden">
                          <div style={{ width: `${item.rate}%` }} className="h-full bg-neutral-200" />
                        </div>
                        <span className="text-neutral-400 text-[10px]">{item.rate}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Right */}
            <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
              <span className="font-mono text-xs font-bold text-neutral-500 uppercase tracking-widest">
                Section C — Analytics
              </span>

              <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight font-serif">
                Insight without vanity metrics.
              </h2>

              <p className="text-sm sm:text-base text-neutral-400 leading-relaxed font-normal">
                The Habit Tracker analytics highlight patterns across your week and month. See which days of the week you are most consistent, without wading through endless charts or bloated dashboards.
              </p>
            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* 6. CLOSING CTA SECTION & MINIMAL FOOTER */}
        {/* ==================================================================== */}
        <section className="w-full max-w-7xl mx-auto px-4 py-20 sm:py-28 text-center space-y-8">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight font-serif">
              Small actions. <br />
              <span className="italic font-normal text-neutral-400">Days that add up.</span>
            </h2>
            <p className="text-sm sm:text-base text-neutral-400">
              Start tracking your daily routines in a clean, distraction-free environment.
            </p>
          </div>

          <div className="pt-2">
            {session ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-neutral-100 hover:bg-neutral-200 px-8 py-4 text-xs font-bold text-neutral-950 uppercase tracking-wider transition-colors"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <button
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-neutral-100 hover:bg-neutral-200 px-8 py-4 text-xs font-bold text-neutral-950 uppercase tracking-wider transition-colors"
              >
                <span>Start tracking</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-neutral-800 bg-black py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 font-mono">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="The Habit Tracker logo" width={18} height={18} className="h-4 w-4 object-contain" />
            <span className="font-bold text-white uppercase tracking-wider">The Habit Tracker</span>
            <span>— Minimalist Habit Journal</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/analytics" className="hover:text-white transition-colors">
              Analytics
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

