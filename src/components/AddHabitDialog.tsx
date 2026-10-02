"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Plus, Trash2, X, ChevronDown, ChevronUp } from "lucide-react";
import { Habit } from "@/types/habit";

interface HabitRowDraft {
  tempId: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  showDetails: boolean;
}

interface AddHabitModalProps {
  onAddHabits: (habits: Omit<Habit, "id" | "createdAt" | "updatedAt">[]) => Promise<boolean>;
  existingHabitNames?: string[];
}

const COLOR_OPTIONS = [
  "bg-neutral-800 text-white border-neutral-700",
  "bg-neutral-700 text-white border-neutral-600",
  "bg-neutral-900 text-neutral-300 border-neutral-700",
  "bg-zinc-800 text-zinc-200 border-zinc-700",
  "bg-stone-800 text-stone-200 border-stone-700",
  "bg-slate-800 text-slate-200 border-slate-700",
];

const EMOJI_OPTIONS = ["📖", "💻", "🏃", "🧘", "💧", "🎨", "🎵", "✍️", "🏋️", "🥗"];

const createDefaultRow = (index: number): HabitRowDraft => ({
  tempId: `row-${Date.now()}-${index}-${Math.random()}`,
  name: "",
  description: "",
  icon: "📖",
  color: COLOR_OPTIONS[0],
  showDetails: false,
});

export function AddHabitDialog({ onAddHabits, existingHabitNames = [] }: AddHabitModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rows, setRows] = useState<HabitRowDraft[]>([createDefaultRow(0)]);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shouldReduceMotion = useReducedMotion();

  const handleOpen = () => {
    setRows([createDefaultRow(0)]);
    setValidationError(null);
    setIsSubmitting(false);
    setIsOpen(true);
  };

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting]);


  // Dynamic row manipulation
  const handleAddRow = () => {
    setValidationError(null);
    setRows((prev) => [...prev, createDefaultRow(prev.length)]);
  };

  const handleRemoveRow = (tempId: string) => {
    if (rows.length <= 1) return;
    setValidationError(null);
    setRows((prev) => prev.filter((r) => r.tempId !== tempId));
  };

  const handleUpdateRow = (tempId: string, updates: Partial<HabitRowDraft>) => {
    setValidationError(null);
    setRows((prev) =>
      prev.map((r) => (r.tempId === tempId ? { ...r, ...updates } : r))
    );
  };

  // Bulk form submission with validation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setValidationError(null);

    // 1. Check for empty habit names
    const hasEmptyName = rows.some((r) => !r.name.trim());
    if (hasEmptyName) {
      setValidationError("Please enter a name for every habit row.");
      return;
    }

    // 2. Check for duplicate habit names within the bulk form
    const trimmedNames = rows.map((r) => r.name.trim().toLowerCase());
    const uniqueNames = new Set(trimmedNames);
    if (uniqueNames.size !== trimmedNames.length) {
      setValidationError("Habit names must be unique within the list.");
      return;
    }

    // 3. Check against existing user habits
    const existingLower = existingHabitNames.map((n) => n.trim().toLowerCase());
    const duplicateExisting = trimmedNames.find((n) => existingLower.includes(n));
    if (duplicateExisting) {
      const originalName = rows.find((r) => r.name.trim().toLowerCase() === duplicateExisting)?.name;
      setValidationError(`Habit "${originalName}" already exists in your tracker.`);
      return;
    }

    // Prepare payload
    const payload = rows.map((r) => ({
      name: r.name.trim(),
      description: r.description.trim(),
      icon: r.icon,
      color: r.color,
      frequency: "daily" as const,
      isArchived: false,
    }));

    setIsSubmitting(true);
    const success = await onAddHabits(payload);
    setIsSubmitting(false);

    if (success) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="inline-flex items-center justify-center gap-1.5 rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-950 px-3 py-1.5 text-xs font-semibold border border-neutral-300 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400"
      >
        <Plus className="h-3.5 w-3.5" />
        <span>Add Habit</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSubmitting && setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Container */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.15 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="add-habits-title"
              className="relative z-10 w-full max-w-lg max-h-[85vh] flex flex-col rounded-lg border border-neutral-800 bg-neutral-950 shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-neutral-800 px-5 py-3.5 shrink-0 bg-neutral-950">
                <h3 id="add-habits-title" className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Add Habits
                </h3>
                <button
                  disabled={isSubmitting}
                  onClick={() => setIsOpen(false)}
                  aria-label="Close modal"
                  className="flex h-7 w-7 items-center justify-center rounded text-neutral-400 hover:bg-neutral-900 hover:text-white transition-colors disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                <div className="flex-1 overflow-y-auto p-5 space-y-3 custom-scrollbar">
                  {/* Validation Error Banner */}
                  {validationError && (
                    <div className="rounded border border-rose-900/60 bg-rose-950/40 p-2.5 text-xs text-rose-300 font-medium">
                      {validationError}
                    </div>
                  )}

                  {/* Habit Input Rows */}
                  <div className="space-y-2.5">
                    {rows.map((row, idx) => (
                      <div
                        key={row.tempId}
                        className="rounded-md border border-neutral-800 bg-neutral-900 p-2.5 space-y-2 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          {/* Row Number */}
                          <span className="text-[10px] font-mono text-neutral-500 w-4 text-center shrink-0">
                            {idx + 1}.
                          </span>

                          {/* Quick Emoji Icon Selector */}
                          <div className="relative group shrink-0">
                            <select
                              disabled={isSubmitting}
                              value={row.icon}
                              onChange={(e) => handleUpdateRow(row.tempId, { icon: e.target.value })}
                              aria-label={`Select icon for habit ${idx + 1}`}
                              className="appearance-none h-8 w-8 text-center bg-neutral-950 border border-neutral-800 rounded cursor-pointer text-base focus:outline-none focus:border-neutral-500"
                            >
                              {EMOJI_OPTIONS.map((emoji) => (
                                <option key={emoji} value={emoji}>
                                  {emoji}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Habit Name Input */}
                          <input
                            type="text"
                            required
                            disabled={isSubmitting}
                            placeholder="Habit name (e.g. Read 20 pages)"
                            value={row.name}
                            onChange={(e) => handleUpdateRow(row.tempId, { name: e.target.value })}
                            className="flex-1 rounded border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:border-neutral-500 focus:outline-none transition-colors"
                          />

                          {/* Details Toggle */}
                          <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => handleUpdateRow(row.tempId, { showDetails: !row.showDetails })}
                            title="Optional details"
                            className="flex h-7 w-7 items-center justify-center rounded border border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white transition-colors"
                          >
                            {row.showDetails ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                          </button>

                          {/* Remove Row Button */}
                          {rows.length > 1 && (
                            <button
                              type="button"
                              disabled={isSubmitting}
                              onClick={() => handleRemoveRow(row.tempId)}
                              title="Remove row"
                              aria-label={`Remove row ${idx + 1}`}
                              className="flex h-7 w-7 items-center justify-center rounded border border-neutral-800 bg-neutral-950 text-neutral-500 hover:text-rose-400 hover:border-neutral-700 transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Optional Description Details Row */}
                        {row.showDetails && (
                          <div className="pt-2 border-t border-neutral-800/60 pl-6 space-y-2">
                            <input
                              type="text"
                              disabled={isSubmitting}
                              placeholder="Description (Optional)"
                              value={row.description}
                              onChange={(e) => handleUpdateRow(row.tempId, { description: e.target.value })}
                              className="w-full rounded border border-neutral-800 bg-neutral-950 px-2.5 py-1 text-xs text-neutral-200 placeholder-neutral-500 focus:border-neutral-500 focus:outline-none"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add another habit row button */}
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleAddRow}
                    className="w-full flex items-center justify-center gap-1.5 rounded border border-dashed border-neutral-800 bg-neutral-900/40 py-2 text-xs font-semibold text-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add another habit</span>
                  </button>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-between border-t border-neutral-800 px-5 py-3 shrink-0 bg-neutral-950">
                  <span className="text-[11px] font-mono text-neutral-500">
                    {rows.length} {rows.length === 1 ? "habit" : "habits"}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => setIsOpen(false)}
                      className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-neutral-300 hover:bg-neutral-800 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-1.5 rounded-md bg-neutral-100 hover:bg-neutral-200 px-4 py-1.5 text-xs font-semibold text-neutral-950 transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-3 w-3 animate-spin rounded-full border-2 border-neutral-950 border-t-transparent" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <span>Save Habits</span>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}


