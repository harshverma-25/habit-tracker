"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Sparkles, LayoutDashboard, BarChart3, Settings, LogOut, LogIn, Menu, X } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();
  const shouldReduceMotion = useReducedMotion();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDashboard = pathname === "/dashboard";
  const isAnalytics = pathname === "/analytics";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/90 backdrop-blur-xl">
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

        {/* Desktop Navigation Links */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-2">
          <Link
            href="/dashboard"
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              isDashboard
                ? "bg-neutral-900/90 text-white border border-neutral-700/60 shadow-sm"
                : "text-neutral-400 hover:bg-neutral-900/60 hover:text-neutral-200"
            }`}
          >
            <LayoutDashboard className={`h-4 w-4 ${isDashboard ? "text-blue-400" : "text-neutral-400"}`} />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/analytics"
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              isAnalytics
                ? "bg-neutral-900/90 text-white border border-neutral-700/60 shadow-sm"
                : "text-neutral-400 hover:bg-neutral-900/60 hover:text-neutral-200"
            }`}
          >
            <BarChart3 className={`h-4 w-4 ${isAnalytics ? "text-purple-400" : "text-neutral-400"}`} />
            <span>Analytics</span>
          </Link>

          <button
            disabled
            title="Settings (Phase 9)"
            aria-label="Settings (Coming soon)"
            className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium text-neutral-500 transition-colors cursor-not-allowed opacity-60"
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </button>
        </nav>

        {/* Desktop User Profile Avatar / Sign In / Sign Out */}
        <div className="hidden md:flex items-center gap-3">
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
                <span className="text-xs font-semibold text-neutral-200">
                  {session.user.name || "User"}
                </span>
              </div>

              <motion.button
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                onClick={() => signOut({ callbackUrl: "/" })}
                title="Sign out"
                aria-label="Sign out"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900/90 text-neutral-400 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
              >
                <LogOut className="h-4 w-4" />
              </motion.button>
            </div>
          ) : (
            <motion.button
              whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-600/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign In</span>
            </motion.button>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex items-center md:hidden gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-neutral-800/80 bg-neutral-950/95 px-4 py-4 space-y-3 shadow-2xl backdrop-blur-xl"
          >
            <nav aria-label="Mobile Navigation" className="flex flex-col space-y-2">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                  isDashboard
                    ? "bg-neutral-900 text-white border border-neutral-700/60"
                    : "text-neutral-400 hover:bg-neutral-900/60 hover:text-neutral-200"
                }`}
              >
                <LayoutDashboard className={`h-5 w-5 ${isDashboard ? "text-blue-400" : "text-neutral-400"}`} />
                <span>Dashboard</span>
              </Link>

              <Link
                href="/analytics"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                  isAnalytics
                    ? "bg-neutral-900 text-white border border-neutral-700/60"
                    : "text-neutral-400 hover:bg-neutral-900/60 hover:text-neutral-200"
                }`}
              >
                <BarChart3 className={`h-5 w-5 ${isAnalytics ? "text-purple-400" : "text-neutral-400"}`} />
                <span>Analytics</span>
              </Link>
            </nav>

            <div className="pt-3 border-t border-neutral-800/60">
              {session?.user ? (
                <div className="flex items-center justify-between gap-3 p-2 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
                  <div className="flex items-center gap-3">
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "User Avatar"}
                        width={32}
                        height={32}
                        className="rounded-full object-cover ring-1 ring-white/10"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-semibold text-white">
                        {session.user.name?.charAt(0) || "U"}
                      </div>
                    )}
                    <span className="text-xs font-semibold text-neutral-200">
                      {session.user.name || "User"}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/10"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signIn("google", { callbackUrl: "/dashboard" });
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In with Google</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
