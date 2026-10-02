"use client";

import React from "react";

export function AnalyticsSkeleton() {
  return (
    <div className="w-full space-y-4 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-6 w-36 rounded bg-neutral-800" />
        <div className="h-7 w-48 rounded bg-neutral-800" />
      </div>

      {/* Small Summary Skeleton */}
      <div className="flex items-center gap-8 rounded-lg border border-neutral-800 bg-neutral-900 p-4">
        <div className="space-y-1">
          <div className="h-3 w-28 rounded bg-neutral-800" />
          <div className="h-7 w-16 rounded bg-neutral-800" />
        </div>
        <div className="h-8 w-px bg-neutral-800" />
        <div className="space-y-1">
          <div className="h-3 w-28 rounded bg-neutral-800" />
          <div className="h-7 w-16 rounded bg-neutral-800" />
        </div>
      </div>

      {/* Chart Skeleton */}
      <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-5 space-y-4 min-h-[220px]">
        <div className="h-5 w-32 rounded bg-neutral-800" />
        <div className="h-36 w-full rounded bg-neutral-950" />
      </div>

      {/* Habit List Skeleton */}
      <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-5 space-y-3">
        <div className="h-5 w-40 rounded bg-neutral-800" />
        {[1, 2, 3].map((r) => (
          <div key={r} className="h-12 w-full rounded bg-neutral-950" />
        ))}
      </div>
    </div>
  );
}

