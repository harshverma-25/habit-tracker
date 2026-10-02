"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { LayoutDashboard, BarChart3, LogOut, LogIn, Menu, X } from "lucide-react";

export const Navbar = React.memo(function Navbar() {
  const { data: session } = useSession();
  const shouldReduceMotion = useReducedMotion();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDashboard = pathname === "/dashboard";
  const isAnalytics = pathname === "/analytics";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 rounded-lg p-1"
        >
          <Image
            src="/logo.png"
            alt="The Habit Tracker logo"
            width={28}
            height={28}
            className="h-7 w-7 object-contain rounded-sm"
          />
          <span className="text-base font-bold tracking-tight text-white group-hover:text-neutral-300 transition-colors">
            The Habit Tracker
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1">
          <Link
            href="/dashboard"
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 ${
              isDashboard
                ? "bg-neutral-800 text-white border border-neutral-700 shadow-sm"
                : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200"
            }`}
          >
            <LayoutDashboard className={`h-3.5 w-3.5 ${isDashboard ? "text-white" : "text-neutral-400"}`} />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/analytics"
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 ${
              isAnalytics
                ? "bg-neutral-800 text-white border border-neutral-700 shadow-sm"
                : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200"
            }`}
          >
            <BarChart3 className={`h-3.5 w-3.5 ${isAnalytics ? "text-white" : "text-neutral-400"}`} />
            <span>Analytics</span>
          </Link>

   
        </nav>

        {/* Desktop User Profile Avatar / Sign In / Sign Out */}
        <div className="hidden md:flex items-center gap-3">
          {session?.user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900 px-2.5 py-1">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User Avatar"}
                    width={22}
                    height={22}
                    className="rounded-full object-cover ring-1 ring-neutral-700"
                  />
                ) : (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-800 text-[10px] font-semibold text-white">
                    {session.user.name?.charAt(0) || "U"}
                  </div>
                )}
                <span className="text-xs font-medium text-neutral-300">
                  {session.user.name || "User"}
                </span>
              </div>

              <motion.button
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                onClick={() => signOut({ callbackUrl: "/" })}
                title="Sign out"
                aria-label="Sign out"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
              >
                <LogOut className="h-3.5 w-3.5" />
              </motion.button>
            </div>
          ) : (
            <motion.button
              whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="flex items-center gap-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 px-3.5 py-1.5 text-xs font-semibold text-neutral-950 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
            >
              <LogIn className="h-3.5 w-3.5" />
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
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
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
            transition={{ duration: 0.15 }}
            className="md:hidden border-t border-neutral-800 bg-neutral-950 px-4 py-3 space-y-2"
          >
            <nav aria-label="Mobile Navigation" className="flex flex-col space-y-1">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                  isDashboard
                    ? "bg-neutral-800 text-white border border-neutral-700"
                    : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200"
                }`}
              >
                <LayoutDashboard className="h-4 w-4 text-white" />
                <span>Dashboard</span>
              </Link>

              <Link
                href="/analytics"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                  isAnalytics
                    ? "bg-neutral-800 text-white border border-neutral-700"
                    : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200"
                }`}
              >
                <BarChart3 className="h-4 w-4 text-white" />
                <span>Analytics</span>
              </Link>
            </nav>

            <div className="pt-2 border-t border-neutral-800">
              {session?.user ? (
                <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-neutral-900 border border-neutral-800">
                  <div className="flex items-center gap-2">
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "User Avatar"}
                        width={24}
                        height={24}
                        className="rounded-full object-cover ring-1 ring-neutral-700"
                      />
                    ) : (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-800 text-[10px] font-semibold text-white">
                        {session.user.name?.charAt(0) || "U"}
                      </div>
                    )}
                    <span className="text-xs font-medium text-neutral-200">
                      {session.user.name || "User"}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="flex items-center gap-1 rounded-md border border-neutral-800 bg-neutral-950 px-2.5 py-1 text-[11px] font-semibold text-neutral-400 hover:text-white"
                  >
                    <LogOut className="h-3 w-3" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signIn("google", { callbackUrl: "/dashboard" });
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 py-2 text-xs font-semibold text-neutral-950"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  <span>Sign In with Google</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
});

