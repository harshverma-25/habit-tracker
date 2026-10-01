"use client";

import React from "react";
import { PlusCircle, Target } from "lucide-react";

interface EmptyStateProps {
  onAddClick: () => void;
}

export function EmptyState({ onAddClick }: EmptyStateProps) {
  return (
    <div className="flex min-h-[300px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/30 p-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4">
        <Target className="h-7 w-7" />
      </div>
      <h3 className="text-lg font-bold text-white mb-1">You don&apos;t have any habits yet</h3>
      <p className="max-w-sm text-sm text-neutral-400 mb-6">
        Start building consistency today. Add your first small daily routine to begin tracking progress.
      </p>
      <button
        onClick={onAddClick}
        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-blue-500 transition-all"
      >
        <PlusCircle className="h-4 w-4" />
        <span>Create your first habit</span>
      </button>
    </div>
  );
}
