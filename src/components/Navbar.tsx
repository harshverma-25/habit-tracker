"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, LayoutDashboard, BarChart3, Settings, LogOut, LogIn } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();
  const shouldReduceMotion = useReducedMotion();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl p-1"
        >
          <motion.div
            whileHover={shouldReduceMotion ? {} : { scale: 1.05, rotate: 5 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 shadow-lg shadow-blue-500/20 border border-white/10"
          >
            <Sparkles className="h-5 w-5 text-white" />
          </motion.div>
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent group-hover:from-blue-200 group-hover:to-indigo-300 transition-colors">
            HabitFlow
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-xl bg-neutral-900/90 px-3.5 py-1.5 text-sm font-semibold text-white transition-all hover:bg-neutral-800 border border-neutral-700/60 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <LayoutDashboard className="h-4 w-4 text-blue-400" />
            <span>Dashboard</span>
          </Link>

          <button
            disabled
            title="Analytics (Phase 8)"
            aria-label="Analytics (Coming soon)"
            className="flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-sm font-medium text-neutral-500 transition-colors cursor-not-allowed opacity-60"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </button>

          <button
            disabled
            title="Settings (Phase 9)"
            aria-label="Settings (Coming soon)"
            className="flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-sm font-medium text-neutral-500 transition-colors cursor-not-allowed opacity-60"
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </nav>

        {/* User Profile Avatar / Sign In / Sign Out Flow */}
        <div className="flex items-center gap-3">
          {session?.user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2.5 rounded-full border border-neutral-800 bg-neutral-900/90 p-1.5 pr-3 shadow-inner">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User Avatar"}
                    width={28}
                    height={28}
                    className="rounded-full object-cover ring-1 ring-white/10"
                  />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-semibold text-white shadow-md">
                    {session.user.name?.charAt(0) || "U"}
                  </div>
                )}
                <span className="hidden text-xs font-semibold text-neutral-200 sm:inline-block">
                  {session.user.name || "User"}
                </span>
              </div>

              <motion.button
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                onClick={() => signOut({ callbackUrl: "/" })}
                title="Sign out"
                aria-label="Sign out"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900/90 text-neutral-400 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
              >
                <LogOut className="h-4 w-4" />
              </motion.button>
            </div>
          ) : (
            <motion.button
              whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-600/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign In</span>
            </motion.button>
          )}
        </div>
      </div>
    </header>
  );
}
