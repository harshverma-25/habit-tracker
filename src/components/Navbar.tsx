"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { Sparkles, LayoutDashboard, BarChart3, Settings, LogOut, LogIn } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-lg shadow-blue-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
            HabitFlow
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-lg bg-neutral-800/70 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 border border-neutral-700/50"
          >
            <LayoutDashboard className="h-4 w-4 text-blue-400" />
            <span>Dashboard</span>
          </Link>

          <button
            title="Analytics (Phase 8)"
            className="flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-sm font-medium text-neutral-400 transition-colors hover:bg-neutral-900 hover:text-neutral-200 opacity-75 cursor-not-allowed"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </button>

          <button
            title="Settings (Phase 9)"
            className="flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-sm font-medium text-neutral-400 transition-colors hover:bg-neutral-900 hover:text-neutral-200 opacity-75 cursor-not-allowed"
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
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-semibold text-white">
                    {session.user.name?.charAt(0) || "U"}
                  </div>
                )}
                <span className="hidden text-xs font-medium text-neutral-300 sm:inline-block">
                  {session.user.name || "User"}
                </span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                title="Sign out"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors shadow-md shadow-blue-500/20"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
