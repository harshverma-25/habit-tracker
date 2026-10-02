"use client";

import React from "react";

export function AnalyticsSkeleton() {
  return (
    <div className="w-full space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-8 w-64 rounded-xl bg-neutral-800/60" />
          <div className="h-4 w-96 rounded-lg bg-neutral-800/40" />
        </div>
        <div className="h-10 w-48 rounded-xl bg-neutral-800/60" />
      </div>

      {/* Summary KPI Cards Skeleton */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex flex-col justify-between rounded-2xl border border-neutral-800/60 bg-neutral-900/40 p-4 sm:p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 rounded bg-neutral-800/60" />
              <div className="h-9 w-9 rounded-xl bg-neutral-800/60" />
            </div>
            <div className="h-8 w-24 rounded-lg bg-neutral-800/80" />
          </div>
        ))}
      </div>

      {/* Charts Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-neutral-800/60 bg-neutral-900/40 p-6 space-y-4 min-h-[300px]">
          <div className="h-6 w-40 rounded bg-neutral-800/60" />
          <div className="h-48 w-full rounded-xl bg-neutral-800/30" />
        </div>
        <div className="rounded-2xl border border-neutral-800/60 bg-neutral-900/40 p-6 space-y-4 min-h-[300px]">
          <div className="h-6 w-40 rounded bg-neutral-800/60" />
          <div className="h-48 w-full rounded-xl bg-neutral-800/30" />
        </div>
      </div>

      {/* Performance List Skeleton */}
      <div className="rounded-2xl border border-neutral-800/60 bg-neutral-900/40 p-6 space-y-4">
        <div className="h-6 w-48 rounded bg-neutral-800/60" />
        {[1, 2, 3].map((r) => (
          <div key={r} className="h-16 w-full rounded-xl bg-neutral-800/40" />
        ))}
      </div>
    </div>
  );
}
