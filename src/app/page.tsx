"use client";

import React from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { Sparkles, ArrowRight, ShieldCheck, Zap, LayoutDashboard } from "lucide-react";
import { Navbar } from "@/components/Navbar";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1.5 text-xs font-semibold text-blue-400 mb-8">
          <Sparkles className="h-3.5 w-3.5" />
          <span>HabitFlow 1.0 Foundation</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-3xl leading-tight">
          Build better habits. <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            One day at a time.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-neutral-400 max-w-xl">
          Track your daily routine with clean monthly grid views, dynamic streaks, and smooth analytics. Designed for consistency.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          {session ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-500/25 hover:from-blue-500 hover:to-indigo-500 transition-all"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Go to Dashboard</span>
            </Link>
          ) : (
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="flex items-center gap-2.5 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-neutral-900 shadow-xl hover:bg-neutral-100 transition-all"
            >
              <span>Continue with Google</span>
              <ArrowRight className="h-4 w-4 text-neutral-600" />
            </button>
          )}
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900/60 px-6 py-3.5 text-sm font-semibold text-neutral-300 hover:bg-neutral-800 transition-colors"
          >
            <span>Preview Prototype</span>
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left w-full">
          <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-5">
            <ShieldCheck className="h-6 w-6 text-blue-400 mb-3" />
            <h3 className="text-sm font-bold text-white">Google Auth & Data Isolation</h3>
            <p className="mt-1 text-xs text-neutral-400">
              Secure OAuth authentication backed by isolated user schemas.
            </p>
          </div>
          <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-5">
            <Zap className="h-6 w-6 text-emerald-400 mb-3" />
            <h3 className="text-sm font-bold text-white">Monthly Tracker View</h3>
            <p className="mt-1 text-xs text-neutral-400">
              Grid layout with dynamic week grouping and horizontal scroll.
            </p>
          </div>
          <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-5">
            <Sparkles className="h-6 w-6 text-purple-400 mb-3" />
            <h3 className="text-sm font-bold text-white">Framer Motion Polish</h3>
            <p className="mt-1 text-xs text-neutral-400">
              Micro-animations for check-ins, stat cards, and modals.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
