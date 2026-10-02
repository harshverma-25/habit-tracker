"use client";

import React from "react";

export function DashboardSkeleton() {
  return (
    <div className="w-full space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-8 w-64 rounded-xl bg-neutral-800/60" />
          <div className="h-4 w-96 rounded-lg bg-neutral-800/40" />
        </div>
        <div className="h-10 w-32 rounded-xl bg-neutral-800/60" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex flex-col justify-between rounded-xl border border-neutral-800/60 bg-neutral-900/40 p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 rounded bg-neutral-800/60" />
              <div className="h-8 w-8 rounded-lg bg-neutral-800/60" />
            </div>
            <div className="h-8 w-16 rounded-lg bg-neutral-800/80" />
          </div>
        ))}
      </div>

      {/* Month Selector Skeleton */}
      <div className="flex items-center justify-between rounded-xl border border-neutral-800/60 bg-neutral-900/40 p-3.5 sm:px-5">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-neutral-800/60" />
          <div className="space-y-1.5">
            <div className="h-5 w-32 rounded bg-neutral-800/60" />
            <div className="h-3 w-24 rounded bg-neutral-800/40" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-neutral-800/60" />
          <div className="h-9 w-14 rounded-lg bg-neutral-800/60" />
          <div className="h-9 w-9 rounded-lg bg-neutral-800/60" />
        </div>
      </div>

      {/* Habit Tracker Table Skeleton */}
      <div className="rounded-2xl border border-neutral-800/60 bg-neutral-900/30 p-4 space-y-4">
        <div className="h-6 w-full rounded bg-neutral-800/40" />
        {[1, 2, 3, 4].map((r) => (
          <div key={r} className="flex items-center gap-4 py-2 border-b border-neutral-800/30">
            <div className="h-10 w-48 rounded-xl bg-neutral-800/60 shrink-0" />
            <div className="flex-1 flex gap-2 overflow-hidden">
              {Array.from({ length: 14 }).map((_, c) => (
                <div key={c} className="h-7 w-7 rounded-lg bg-neutral-800/40 shrink-0" />
              ))}
            </div>
            <div className="h-6 w-20 rounded bg-neutral-800/60 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
