"use client";

import React from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { motion, useReducedMotion, Variants } from "framer-motion";
import { Sparkles, ArrowRight, ShieldCheck, Zap, LayoutDashboard } from "lucide-react";
import { Navbar } from "@/components/Navbar";

export default function Home() {
  const { data: session } = useSession();
  const shouldReduceMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center max-w-4xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-bold text-blue-400 mb-8 shadow-inner"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>HabitFlow 1.0 Foundation</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-3xl leading-tight"
          >
            Build better habits. <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              One day at a time.
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-6 text-base sm:text-lg text-neutral-400 max-w-xl font-medium leading-relaxed"
          >
            Track your daily routine with clean monthly grid views, dynamic streaks, and smooth analytics. Designed for consistency.
          </motion.p>

          <motion.div variants={itemVariants} className="mt-10 flex flex-col sm:flex-row items-center gap-4">
            {session ? (
              <motion.div
                whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
              >
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-500/25 hover:from-blue-500 hover:to-indigo-500 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Go to Dashboard</span>
                </Link>
              </motion.div>
            ) : (
              <motion.button
                whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="flex items-center gap-2.5 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-neutral-900 shadow-xl hover:bg-neutral-100 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span>Continue with Google</span>
                <ArrowRight className="h-4 w-4 text-neutral-600" />
              </motion.button>
            )}
            <motion.div
              whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
            >
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900/60 px-6 py-3.5 text-sm font-semibold text-neutral-300 hover:bg-neutral-800 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <span>Preview Prototype</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Feature Highlights */}
          <motion.div
            variants={containerVariants}
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left w-full"
          >
            <motion.div
              variants={itemVariants}
              whileHover={shouldReduceMotion ? {} : { y: -3, scale: 1.02 }}
              className="rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-6 backdrop-blur-md transition-all hover:border-neutral-700 hover:bg-neutral-900/80 hover:shadow-xl"
            >
              <ShieldCheck className="h-6 w-6 text-blue-400 mb-3" />
              <h3 className="text-sm font-bold text-white">Google Auth & Data Isolation</h3>
              <p className="mt-1.5 text-xs text-neutral-400 leading-relaxed">
                Secure OAuth authentication backed by isolated user schemas.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={shouldReduceMotion ? {} : { y: -3, scale: 1.02 }}
              className="rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-6 backdrop-blur-md transition-all hover:border-neutral-700 hover:bg-neutral-900/80 hover:shadow-xl"
            >
              <Zap className="h-6 w-6 text-emerald-400 mb-3" />
              <h3 className="text-sm font-bold text-white">Monthly Tracker View</h3>
              <p className="mt-1.5 text-xs text-neutral-400 leading-relaxed">
                Grid layout with dynamic week grouping and horizontal scroll.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={shouldReduceMotion ? {} : { y: -3, scale: 1.02 }}
              className="rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-6 backdrop-blur-md transition-all hover:border-neutral-700 hover:bg-neutral-900/80 hover:shadow-xl"
            >
              <Sparkles className="h-6 w-6 text-purple-400 mb-3" />
              <h3 className="text-sm font-bold text-white">Framer Motion Polish</h3>
              <p className="mt-1.5 text-xs text-neutral-400 leading-relaxed">
                Micro-animations for check-ins, stat cards, and modals.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
