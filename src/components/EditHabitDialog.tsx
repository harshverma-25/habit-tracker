"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Edit2, X } from "lucide-react";
import { Habit } from "@/types/habit";

interface EditHabitModalProps {
  habit: Habit;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: { id: string; name: string; description: string; icon: string; color: string }) => void;
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

export function EditHabitDialog({ habit, isOpen, onClose, onSave }: EditHabitModalProps) {
  const [name, setName] = useState(habit.name);
  const [description, setDescription] = useState(habit.description || "");
  const [icon, setIcon] = useState(habit.icon || "📖");
  const [selectedColor] = useState(habit.color || COLOR_OPTIONS[0]);

  const shouldReduceMotion = useReducedMotion();

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      id: habit.id,
      name,
      description,
      icon,
      color: selectedColor,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Box */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.15 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-habit-title"
            className="relative z-10 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-lg border border-neutral-800 bg-neutral-950 p-5 shadow-2xl custom-scrollbar"
          >
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Edit2 className="h-4 w-4 text-neutral-300" />
                <h3 id="edit-habit-title" className="text-base font-bold text-white uppercase tracking-wide">
                  Edit Habit
                </h3>
              </div>
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="flex h-7 w-7 items-center justify-center rounded text-neutral-400 hover:bg-neutral-900 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label htmlFor="edit-habit-name-input" className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Habit Name *
                </label>
                <input
                  id="edit-habit-name-input"
                  type="text"
                  required
                  placeholder="e.g. Read 20 pages"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-neutral-500 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label htmlFor="edit-habit-desc-input" className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <input
                  id="edit-habit-desc-input"
                  type="text"
                  placeholder="e.g. Before going to bed"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-neutral-500 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Icon
                </label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setIcon(emoji)}
                      aria-label={`Select icon ${emoji}`}
                      className={`flex h-9 w-9 items-center justify-center rounded border text-base transition-colors ${
                        icon === emoji
                          ? "border-neutral-400 bg-neutral-800 text-white"
                          : "border-neutral-800 bg-neutral-900 text-neutral-400 hover:bg-neutral-800"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 border-t border-neutral-800 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md border border-neutral-800 bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-neutral-300 hover:bg-neutral-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-neutral-100 px-4 py-1.5 text-xs font-semibold text-neutral-950 hover:bg-neutral-200 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

