"use client";

import React from "react";

export function DashboardSkeleton() {
  return (
    <div className="w-full space-y-3 animate-pulse">
      {/* Top Toolbar Skeleton */}
      <div className="flex items-center justify-between gap-3 bg-neutral-900 border border-neutral-800 p-2.5 rounded-lg">
        <div className="h-6 w-36 rounded bg-neutral-800" />
        <div className="flex items-center gap-2">
          <div className="h-7 w-20 rounded bg-neutral-800" />
          <div className="h-7 w-24 rounded bg-neutral-800" />
        </div>
      </div>

      {/* Habit Tracker Table Skeleton */}
      <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-3 space-y-3">
        <div className="h-8 w-full rounded bg-neutral-900" />
        {[1, 2, 3, 4, 5].map((r) => (
          <div key={r} className="flex items-center gap-2 py-1.5 border-b border-neutral-900">
            <div className="h-7 w-48 rounded bg-neutral-900 shrink-0" />
            <div className="flex-1 flex gap-1 overflow-hidden">
              {Array.from({ length: 20 }).map((_, c) => (
                <div key={c} className="h-5 w-5 rounded bg-neutral-900 shrink-0" />
              ))}
            </div>
            <div className="h-5 w-12 rounded bg-neutral-900 shrink-0" />
          </div>
        ))}
        
      </div>
    </div>
  );
}

